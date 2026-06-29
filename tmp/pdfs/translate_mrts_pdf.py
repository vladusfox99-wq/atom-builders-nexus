from __future__ import annotations

import json
import math
import re
import time
from collections import Counter
from pathlib import Path

import fitz
from deep_translator import GoogleTranslator


ROOT = Path(__file__).resolve().parent
SRC = ROOT / "mrts_company_rus_2026.pdf"
OUT_DIR = ROOT.parent.parent / "output" / "pdf"
OUT = OUT_DIR / "MRTS_Company_2026_EN.pdf"
CACHE_PATH = ROOT / "mrts_translation_cache.json"

FONT_FILES = {
    "Tahoma": r"C:\Windows\Fonts\tahoma.ttf",
    "Tahoma-Bold": r"C:\Windows\Fonts\tahomabd.ttf",
    "Calibri": r"C:\Windows\Fonts\calibri.ttf",
    "Calibri-Bold": r"C:\Windows\Fonts\calibrib.ttf",
    "ArialMT": r"C:\Windows\Fonts\arial.ttf",
    "Arial-BoldMT": r"C:\Windows\Fonts\arialbd.ttf",
}

FONT_ALIAS = {
    "Tahoma": "TahomaReg",
    "Tahoma-Bold": "TahomaBold",
    "Calibri": "CalibriReg",
    "Calibri-Bold": "CalibriBold",
    "ArialMT": "ArialReg",
    "Arial-BoldMT": "ArialBold",
}


CYR_RE = re.compile(r"[А-Яа-яЁё]")

MANUAL = {
    "Уникальные технологии и безупречный опыт строительства объектов гидротехнических сооружений": (
        "Unique technologies and proven expertise in hydraulic engineering construction"
    ),
    "УНИКАЛЬНЫЙ ОПЫТ\nСТРОИТЕЛЬСТВА МОРСКИХ И \nПРИБРЕЖНЫХ ОБЪЕКТОВ": (
        "UNIQUE EXPERIENCE\nIN MARINE AND COASTAL\nCONSTRUCTION"
    ),
    "УНИКАЛЬНЫЙ ОПЫТ\nСТРОИТЕЛЬСТВА МОРСКИХ И\nПРИБРЕЖНЫХ ОБЪЕКТОВ": (
        "UNIQUE EXPERIENCE\nIN MARINE AND COASTAL\nCONSTRUCTION"
    ),
    "НАША ИСТОРИЯ": "OUR HISTORY",
    "КАРТА ОБЪЕКТОВ": "PROJECT MAP",
    "Состав флота": "Fleet Composition",
    "ФЛОТ – 45 ед.": "FLEET - 45 units",
    "Оснащенность техникой и оборудованием": "Machinery and Equipment",
    "ТЕХНИКА": "MACHINERY",
    "ПРОИЗВОДСТВЕННО-ЛОГИСТИЧЕСКИЕ БАЗЫ": "PRODUCTION AND LOGISTICS BASES",
    "ВЫРУЧКА КОМПАНИИ ЗА ПОСЛЕДНИЕ 10 ЛЕТ": "COMPANY REVENUE OVER THE LAST 10 YEARS",
    "ИТОГО: 593 ед": "TOTAL: 593 units",
    "СПАСИБО ЗА ВНИМАНИЕ!": "THANK YOU!",
    "КОНТАКТЫ:": "CONTACTS:",
    "Тел: +7 (499) 754 20 21": "Tel.: +7 (499) 754 20 21",
    "Сайт: www.mrts.ru": "Website: www.mrts.ru",
}


POST_REPLACEMENTS = [
    (r'JSC\s+"MRTS"', "MRTS JSC"),
    (r'JSC\s+"RusGazDobycha"', "RusGazDobycha JSC"),
    (r'LLC\s+"RusKhimAlliance"', "RusKhimAlliance LLC"),
    (r"\bJSC «MRTS»", "MRTS JSC"),
    (r"\bAO «MRTS»", "MRTS JSC"),
    (r"\bJSC MRTS", "MRTS JSC"),
    (r"\bMRTS JSC JSC\b", "MRTS JSC"),
    (r"\bPJSC Gazprom\b", "PJSC Gazprom"),
    (r"\bOOO\b", "LLC"),
    (r"\bLLC «RusKhimAlliance»", "RusKhimAlliance LLC"),
    (r"\bJSC «RusGazDobycha»", "RusGazDobycha JSC"),
    (r"\bLNG\b", "LNG"),
    (r"\bLPG\b", "LPG"),
    (r"\bSPG\b", "LNG"),
    (r"\bGCS\b", "gas condensate"),
    (r"\bGCF\b", "gas condensate field"),
    (r"\bGPP\b", "gas processing plant"),
    (r"\bGCC\b", "gas chemical complex"),
    (r"\bRUB billion\b", "RUB bln"),
    (r"\bbillion rubles\b", "RUB bln"),
    (r"\bbillion rub\.", "RUB bln"),
    (r"\bbillion\.rub\.", "RUB bln"),
    (r"\bbillion rubles\.", "RUB bln"),
    (r"\bbn rubles\b", "RUB bln"),
    (r"\bmlrd\.rub\.", "RUB bln"),
    (r"\bmln\.rub\.", "RUB mln"),
    (r"\bpcs\.", "units"),
    (r"\bpc\.", "unit"),
    (r"\bunits\.", "units"),
    (r"\bunit\.", "unit"),
    (r"\btons\b", "t"),
    (r"\btonnes\b", "t"),
    (r"\btn\b", "t"),
    (r"\bha\b", "ha"),
    (r"\bkm\b", "km"),
    (r"\bm2\b", "m2"),
    (r"\bm3\b", "m3"),
    (r"\bkW\b", "kW"),
    (r"\brailway dead ends\b", "railway sidings"),
    (r"\brailway dead-end tracks\b", "railway sidings"),
    (r"\bRailway dead ends\b", "Rail sidings"),
    (r"\bRailway dead\b\nends\b", "Rail sidings"),
    (r"\brailway tracks\b", "railway tracks"),
    (r"\bRailway capacity\s*\n?carriages\b", "Railcar capacity"),
    (r"\brailway carriages\b", "railcars"),
    (r"\bcarriages\b", "railcars"),
    (r"\biceproof\b", "ice-protection"),
    (r"\bice protection\b", "ice-protection"),
    (r"\bice-protection structures\b", "ice protection structures"),
    (r"\bhydrotechnical\b", "hydraulic engineering"),
    (r"\bunderwater technical\b", "subsea"),
    (r"\bunderwater crossings\b", "underwater crossings"),
    (r"\bunderwater crossing\b", "underwater crossing"),
    (r"\bmain pipelines\b", "trunk pipelines"),
    (r"\bmain pipeline\b", "trunk pipeline"),
    (r"\btrunk oil pipeline\b", "trunk oil pipeline"),
    (r"\btrunk gas pipeline\b", "trunk gas pipeline"),
    (r"\bquayage\b", "quay wall"),
    (r"\bberthing embankment\b", "quay wall"),
    (r"\bmooring wall\b", "quay wall"),
    (r"\bMoorings\b", "Berths"),
    (r"\bmoorings\b", "berths"),
    (r"\baccess channel\b", "approach channel"),
    (r"\bfairway approach channel\b", "navigable approach channel"),
    (r"\bR\.\s+", "River "),
    (r"\br\.\s+", "River "),
    (r"\bp\.\s+", "settlement "),
    (r"\bpos\.\s+", "settlement "),
    (r"\bsettlement settlement\b", "settlement"),
    (r"\bOb Bay\b", "Gulf of Ob"),
    (r"\bObskaya Bay\b", "Gulf of Ob"),
    (r"\bBaydaratskaya lip\b", "Baydaratskaya Bay"),
    (r"\bBałtyk Sea\b", "Baltic Sea"),
    (r"\bBarents Sea\b", "Barents Sea"),
    (r"\bKara Sea\b", "Kara Sea"),
    (r"\bSea of Okhotsk\b", "Sea of Okhotsk"),
    (r"\bSea of Japan\b", "Sea of Japan"),
    (r"\bNevelsky Strait\b", "Nevelskoy Strait"),
    (r"\bTatar Strait\b", "Tatar Strait"),
    (r"\bYamal LNG\b", "Yamal LNG"),
    (r"\bArctic LNG 2\b", "Arctic LNG 2"),
    (r"\bPortovaya\b", "Portovaya"),
    (r"\bUtrenny\b", "Utrenny"),
    (r"\bUst-Luga\b", "Ust-Luga"),
    (r"\bVostok-Oil\b", "Vostok Oil"),
    (r"\bDruzhba-1\b", "Druzhba-1"),
    (r"\bESPO\b", "ESPO"),
    (r"\bSakhalin-Khabarovsk-Vladivostok\b", "Sakhalin-Khabarovsk-Vladivostok"),
    (r"\bSelf-pickup\s*\n?dredger\b", "Self-propelled hopper\ndredger"),
    (r"\bMilling dredger\b", "Cutter suction dredger"),
    (r"\bPipe-laying\s*\n?barge\s+\"Captain\s*\n?Bulganin\"", 'Pipe-laying barge\n"Captain Bulganin"'),
    (r"\bBarge barge\b", "Deck barge"),
    (r"\bCargo transporters\s*\n?chaladny\b", "Cargo scows"),
    (r"\bchaladny\b", "scows"),
    (r"\bPassable precipitation\s*\n?ships\b", "Vessel draft"),
    (r"\bPassable precipitation\b", "Vessel draft"),
    (r"\bLoading onto the ship in\s*\n?day\b", "Ship loading per day"),
    (r"\bAvtobetono\s*\n?mixer\b", "Concrete\nmixer"),
    (r"\bDiver\s*\n?complexheated\b", "Diving\ncomplex"),
    (r"\bcomplexheated\b", "complex"),
    (r"\bArrangement\s*\n?marine\s*\n?deposits\b", "Offshore field\ndevelopment"),
    (r"\bMarine laying\s*\n?pipelines\b", "Offshore pipeline\nlaying"),
    (r"\bunderwater\s*\n?transitions\b", "underwater\ncrossings"),
    (r"\btransitions through\b", "crossings across"),
    (r"\bMarine construction\s*\n?ports\b", "Seaport\nconstruction"),
    (r"\bMarine construction\s*\n?terminals\b", "Marine terminal\nconstruction"),
    (r"\bsells large coastal\b", "delivers large coastal"),
    (r"\bBase\s*\n?companies\b", "Company\nfoundation"),
    (r"\bcrushed stone lintels\b", "crushed stone berms"),
    (r"\bPLATES\b", "PLETs"),
    (r"\bMorning\b", "Utrenny"),
]


def has_cyrillic(text: str) -> bool:
    return bool(CYR_RE.search(text))


def load_cache() -> dict[str, str]:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict[str, str]) -> None:
    CACHE_PATH.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")


def normalize_source(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n[ \t]+", "\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def is_upper_cyr(text: str) -> bool:
    letters = [c for c in text if ("А" <= c <= "я") or c in "Ёё"]
    if len(letters) < 3:
        return False
    upper = sum(1 for c in letters if c.upper() == c and c.lower() != c)
    return upper / len(letters) > 0.82


def postprocess(text: str, original: str) -> str:
    text = text.replace("–", "-").replace("—", "-").replace("−", "-")
    text = text.replace("“", '"').replace("”", '"').replace("«", '"').replace("»", '"')
    text = text.replace("▪", "•")
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    text = re.sub(r"([(\[])\s+", r"\1", text)
    text = re.sub(r"\s+([)\]])", r"\1", text)
    text = re.sub(r"\b(\d+),(\d+)\b", r"\1.\2", text)
    text = re.sub(r"\b(\d+)\s*г\.", r"\1", text)
    text = re.sub(r"\b(\d+)\s*G\.", r"\1", text)
    text = re.sub(r"\b(\d+)\s*year\b", r"\1", text, flags=re.I)
    text = re.sub(r"\b(\d+)\s*years\b", r"\1", text, flags=re.I)
    text = re.sub(r"\bm\s*2\b", "m2", text, flags=re.I)
    text = re.sub(r"\bm\s*3\b", "m3", text, flags=re.I)
    text = re.sub(r"\bkm\.", "km", text, flags=re.I)
    text = re.sub(r"\bha\.", "ha", text, flags=re.I)
    text = re.sub(r"\bt\.", "t", text, flags=re.I)
    for pattern, repl in POST_REPLACEMENTS:
        text = re.sub(pattern, repl, text)
    text = re.sub(r"\s{2,}", " ", text)
    text = re.sub(r" ?\n ?", "\n", text)
    text = text.strip()
    if is_upper_cyr(original):
        text = text.upper()
    return text


def translate_text(text: str, translator: GoogleTranslator, cache: dict[str, str]) -> str:
    original = normalize_source(text)
    if not original:
        return original
    if not has_cyrillic(original):
        return original
    if original in MANUAL:
        return MANUAL[original]
    if original in cache:
        cleaned = postprocess(cache[original], original)
        if cleaned != cache[original]:
            cache[original] = cleaned
            save_cache(cache)
        return cleaned

    # Google Translate sometimes handles the compact footer + page number better
    # when the trailing page number is temporarily removed.
    trailing_number = ""
    m = re.match(r"(.+?)\n(\d{1,2})$", original, flags=re.S)
    to_translate = original
    if m and has_cyrillic(m.group(1)):
        to_translate = m.group(1)
        trailing_number = "\n" + m.group(2)

    for attempt in range(4):
        try:
            translated = translator.translate(to_translate)
            break
        except Exception:
            if attempt == 3:
                raise
            time.sleep(1.5 * (attempt + 1))
    translated = postprocess(translated + trailing_number, original)
    cache[original] = translated
    save_cache(cache)
    time.sleep(0.06)
    return translated


def text_color(span: dict) -> tuple[float, float, float]:
    value = int(span.get("color", 0))
    return ((value >> 16 & 255) / 255, (value >> 8 & 255) / 255, (value & 255) / 255)


def get_block_text(block: dict) -> str:
    lines = []
    for line in block.get("lines", []):
        parts = [span.get("text", "") for span in line.get("spans", [])]
        joined = "".join(parts).strip()
        if joined:
            lines.append(joined)
    return "\n".join(lines)


def first_style(block: dict) -> dict:
    spans = []
    for line in block.get("lines", []):
        for span in line.get("spans", []):
            if span.get("text", "").strip():
                spans.append(span)
    if not spans:
        return {}
    # Use the largest visible span as the dominant style.
    return max(spans, key=lambda s: len(s.get("text", "")) * float(s.get("size", 0)))


def block_align(block: dict) -> int:
    lines = block.get("lines", [])
    if not lines:
        return fitz.TEXT_ALIGN_LEFT
    aligns = Counter()
    x0, _, x1, _ = block["bbox"]
    width = max(1, x1 - x0)
    for line in lines:
        spans = [s for s in line.get("spans", []) if s.get("text", "").strip()]
        if not spans:
            continue
        lx0 = min(s["bbox"][0] for s in spans)
        lx1 = max(s["bbox"][2] for s in spans)
        left_gap = lx0 - x0
        right_gap = x1 - lx1
        if abs(left_gap - right_gap) < width * 0.08:
            aligns["center"] += 1
        elif left_gap > right_gap * 1.7:
            aligns["right"] += 1
        else:
            aligns["left"] += 1
    winner = aligns.most_common(1)[0][0] if aligns else "left"
    return {
        "left": fitz.TEXT_ALIGN_LEFT,
        "center": fitz.TEXT_ALIGN_CENTER,
        "right": fitz.TEXT_ALIGN_RIGHT,
    }[winner]


def expand_rect(rect: fitz.Rect, page_rect: fitz.Rect, original: str) -> fitz.Rect:
    # Add enough room for English text expansion, but keep small map labels tight.
    width = rect.width
    height = rect.height
    has_lines = "\n" in original
    pad_x = 1.2 if width < 80 else 2.5
    pad_y = 1.0 if height < 18 else 1.8
    extra_right = 0
    if has_cyrillic(original):
        ratio = min(0.55, max(0.10, (len(original) / max(1, width)) * 0.035))
        extra_right = width * ratio if width < 260 else width * 0.08
    if has_lines and width < 140:
        extra_right *= 0.65
    extra_bottom = 0
    expanded = fitz.Rect(
        rect.x0 - pad_x,
        rect.y0 - pad_y,
        rect.x1 + pad_x + extra_right,
        rect.y1 + pad_y + extra_bottom,
    )
    return expanded & page_rect


def redact_rect(rect: fitz.Rect, page_rect: fitz.Rect) -> fitz.Rect:
    return fitz.Rect(rect.x0 - 2.4, rect.y0 - 2.2, rect.x1 + 2.4, rect.y1 + 2.2) & page_rect


def preferred_font(span: dict) -> tuple[str, str | None]:
    font = span.get("font", "Tahoma")
    base = font
    if base not in FONT_ALIAS:
        if "Bold" in base or "bold" in base:
            base = "Tahoma-Bold"
        elif "Calibri" in base:
            base = "Calibri"
        elif "Arial" in base:
            base = "ArialMT"
        else:
            base = "Tahoma"
    return FONT_ALIAS[base], FONT_FILES.get(base)


def line_count(text: str) -> int:
    return max(1, text.count("\n") + 1)


def fit_font_size(page: fitz.Page, rect: fitz.Rect, text: str, style: dict, align: int) -> tuple[float, str, str | None]:
    original_size = float(style.get("size", 10.5))
    fontname, fontfile = preferred_font(style)
    # English usually takes more horizontal space than Russian; start slightly smaller.
    size = min(original_size, original_size * 0.96)
    min_size = max(4.2, min(7.0, original_size * 0.55))
    if rect.height < original_size * 1.7 and line_count(text) <= 2:
        min_size = max(3.8, min_size - 0.8)

    while size >= min_size:
        shape = page.new_shape()
        rc = shape.insert_textbox(
            rect,
            text,
            fontsize=size,
            fontname=fontname,
            fontfile=fontfile,
            color=text_color(style),
            align=align,
            lineheight=0.92,
        )
        if rc >= -0.1:
            return size, fontname, fontfile
        size -= 0.35
    return max(min_size, size), fontname, fontfile


def insert_text(page: fitz.Page, rect: fitz.Rect, text: str, style: dict, align: int) -> None:
    color = text_color(style)
    size, fontname, fontfile = fit_font_size(page, rect, text, style, align)
    page.insert_textbox(
        rect,
        text,
        fontsize=size,
        fontname=fontname,
        fontfile=fontfile,
        color=color,
        align=align,
        lineheight=0.92,
        overlay=True,
    )


def footer_item(page: fitz.Page, block: dict, original: str, translator: GoogleTranslator, cache: dict[str, str]) -> dict | None:
    if "Уникальные технологии" not in original:
        return None
    cyr_spans = []
    for line in block.get("lines", []):
        for span in line.get("spans", []):
            if has_cyrillic(span.get("text", "")):
                cyr_spans.append(span)
    if not cyr_spans:
        return None
    x0 = min(span["bbox"][0] for span in cyr_spans)
    y0 = min(span["bbox"][1] for span in cyr_spans)
    x1 = max(span["bbox"][2] for span in cyr_spans)
    y1 = max(span["bbox"][3] for span in cyr_spans)
    rect = fitz.Rect(x0, y0, x1, y1)
    translated = translate_text(
        "Уникальные технологии и безупречный опыт строительства объектов гидротехнических сооружений",
        translator,
        cache,
    )
    insert_rect = expand_rect(rect, page.rect, "Уникальные технологии и безупречный опыт строительства объектов гидротехнических сооружений")
    style = max(cyr_spans, key=lambda s: len(s.get("text", "")))
    return {
        "bbox": list(rect),
        "insert_bbox": list(insert_rect),
        "original": original,
        "translated": translated,
        "style": {
            "font": style.get("font", "Tahoma"),
            "size": float(style.get("size", 7.0)),
            "color": int(style.get("color", 0)),
        },
        "align": fitz.TEXT_ALIGN_LEFT,
    }


def collect_items(doc: fitz.Document, translator: GoogleTranslator, cache: dict[str, str]) -> list[list[dict]]:
    all_items: list[list[dict]] = []
    for page in doc:
        page_items = []
        for block in page.get_text("dict")["blocks"]:
            original = normalize_source(get_block_text(block))
            if not original or not has_cyrillic(original):
                continue
            footer = footer_item(page, block, original, translator, cache)
            if footer is not None:
                page_items.append(footer)
                continue
            style = first_style(block)
            if not style:
                continue
            translated = translate_text(original, translator, cache)
            if not translated:
                continue
            rect = fitz.Rect(block["bbox"])
            insert_rect = expand_rect(rect, page.rect, original)
            page_items.append(
                {
                    "bbox": list(rect),
                    "insert_bbox": list(insert_rect),
                    "original": original,
                    "translated": translated,
                    "style": {
                        "font": style.get("font", "Tahoma"),
                        "size": float(style.get("size", 10.5)),
                        "color": int(style.get("color", 0)),
                    },
                    "align": block_align(block),
                }
            )
        all_items.append(page_items)
        print(f"page {page.number + 1:02d}: {len(page_items)} translated blocks")
    return all_items


def apply_translation(doc: fitz.Document, all_items: list[list[dict]]) -> None:
    for page, items in zip(doc, all_items):
        for item in items:
            page.add_redact_annot(redact_rect(fitz.Rect(item["bbox"]), page.rect), fill=None, cross_out=False)
        if items:
            page.apply_redactions(
                images=fitz.PDF_REDACT_IMAGE_NONE,
                graphics=fitz.PDF_REDACT_LINE_ART_NONE,
                text=fitz.PDF_REDACT_TEXT_REMOVE,
            )
        for item in items:
            insert_text(
                page,
                fitz.Rect(item["insert_bbox"]),
                item["translated"],
                item["style"],
                item["align"],
            )


def clean_remaining_cyrillic(doc: fitz.Document) -> None:
    for page in doc:
        rects = []
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                for span in line.get("spans", []):
                    if has_cyrillic(span.get("text", "")):
                        rects.append(redact_rect(fitz.Rect(span["bbox"]), page.rect))
        for rect in rects:
            page.add_redact_annot(rect, fill=None, cross_out=False)
        if rects:
            page.apply_redactions(
                images=fitz.PDF_REDACT_IMAGE_NONE,
                graphics=fitz.PDF_REDACT_LINE_ART_NONE,
                text=fitz.PDF_REDACT_TEXT_REMOVE,
            )


def apply_manual_touchups(doc: fitz.Document) -> None:
    # The bottom fleet category on page 4 is one combined source block and tends
    # to be dropped by PDF textbox fitting. Place the compact label manually.
    page = doc[3]
    page.insert_textbox(
        fitz.Rect(448, 518, 565, 548),
        "Floating cranes\n2 units",
        fontsize=10.3,
        fontname="TahomaReg",
        fontfile=FONT_FILES["Tahoma"],
        color=(1, 1, 1),
        align=fitz.TEXT_ALIGN_CENTER,
        lineheight=0.92,
        overlay=True,
    )

    page = doc[4]
    page.draw_rect(
        fitz.Rect(72, 84, 190, 123),
        color=(1, 1, 1),
        fill=(1, 1, 1),
        overlay=True,
    )
    page.insert_textbox(
        fitz.Rect(77, 91, 190, 116),
        "MACHINERY",
        fontsize=16.2,
        fontname="TahomaReg",
        fontfile=FONT_FILES["Tahoma"],
        color=(0.58, 0.54, 0.33),
        align=fitz.TEXT_ALIGN_LEFT,
        overlay=True,
    )


def render_previews(pdf_path: Path, pages: list[int], out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    doc = fitz.open(pdf_path)
    for page_no in pages:
        if page_no < 1 or page_no > doc.page_count:
            continue
        pix = doc[page_no - 1].get_pixmap(matrix=fitz.Matrix(1.35, 1.35), alpha=False)
        pix.save(out_dir / f"page-{page_no:02d}.png")
    doc.close()


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cache = load_cache()
    translator = GoogleTranslator(source="ru", target="en")

    source_doc = fitz.open(SRC)
    items = collect_items(source_doc, translator, cache)
    source_doc.close()

    doc = fitz.open(SRC)
    apply_translation(doc, items)
    clean_remaining_cyrillic(doc)
    apply_manual_touchups(doc)
    doc.save(OUT, garbage=4, deflate=True)
    doc.close()

    render_previews(OUT, [1, 2, 3, 4, 5, 6, 10, 14, 17, 20, 30, 37, 40, 50], ROOT / "mrts_en_preview")
    print(f"saved: {OUT}")


if __name__ == "__main__":
    main()

from __future__ import annotations

from pathlib import Path

import fitz


PDF = Path("output/pdf/MRTS_Company_2026_EN.pdf")
OUT = Path("output/pdf/MRTS_Company_2026_EN_fixed_v3.pdf")

TAHOMA = r"C:\Windows\Fonts\tahoma.ttf"
TAHOMA_BOLD = r"C:\Windows\Fonts\tahomabd.ttf"

BLUE = (0.0, 0.44, 0.74)
BLUE2 = (0.0, 0.55, 0.78)
DARK_BLUE = (0.0, 0.18, 0.34)
TEXT = (0.23, 0.23, 0.23)
WHITE = (1, 1, 1)
GREY = (0.35, 0.35, 0.35)
GOLD = (0.58, 0.54, 0.33)
RED = (0.85, 0.0, 0.0)


def rect(x0: float, y0: float, x1: float, y1: float) -> fitz.Rect:
    return fitz.Rect(x0, y0, x1, y1)


def wipe_text(page: fitz.Page) -> None:
    rects = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line.get("spans", []):
                if span.get("text", "").strip():
                    r = fitz.Rect(span["bbox"])
                    rects.append((r + (-1.5, -1.5, 1.5, 1.5)) & page.rect)
    for r in rects:
        page.add_redact_annot(r, fill=None, cross_out=False)
    if rects:
        page.apply_redactions(
            images=fitz.PDF_REDACT_IMAGE_NONE,
            graphics=fitz.PDF_REDACT_LINE_ART_NONE,
            text=fitz.PDF_REDACT_TEXT_REMOVE,
        )


def put(
    page: fitz.Page,
    box: fitz.Rect,
    text: str,
    size: float = 10,
    color=TEXT,
    bold: bool = False,
    align: int = fitz.TEXT_ALIGN_LEFT,
    lineheight: float = 1.0,
    min_size: float = 5.5,
) -> None:
    font = "TahomaBold" if bold else "TahomaReg"
    fontfile = TAHOMA_BOLD if bold else TAHOMA
    s = size
    while s >= min_size:
        shape = page.new_shape()
        rc = shape.insert_textbox(
            box,
            text,
            fontsize=s,
            fontname=font,
            fontfile=fontfile,
            color=color,
            align=align,
            lineheight=lineheight,
        )
        if rc >= -0.2:
            break
        s -= 0.25
    page.insert_textbox(
        box,
        text,
        fontsize=max(s, min_size),
        fontname=font,
        fontfile=fontfile,
        color=color,
        align=align,
        lineheight=lineheight,
        overlay=True,
    )


def put_rotated(page: fitz.Page, point: tuple[float, float], text: str, size: float, color=WHITE, bold: bool = True, rotate: int = 90) -> None:
    page.insert_text(
        point,
        text,
        fontsize=size,
        fontname="TahomaBold" if bold else "TahomaReg",
        fontfile=TAHOMA_BOLD if bold else TAHOMA,
        color=color,
        rotate=rotate,
        overlay=True,
    )


def footer(page: fitz.Page, n: int) -> None:
    put(
        page,
        rect(46, 576, 520, 588),
        "Unique technologies and proven expertise in hydraulic engineering construction",
        6.2,
        color=WHITE,
    )
    put(page, rect(805, 576, 835, 590), str(n), 8.5, color=WHITE, align=fitz.TEXT_ALIGN_CENTER)


def bullet_text(page: fitz.Page, x: float, y: float, text: str, w: float, size: float = 11.0, leading: float = 17.0) -> float:
    page.draw_rect(rect(x, y + 4.5, x + 3.0, y + 7.5), color=BLUE, fill=BLUE, overlay=True)
    put(page, rect(x + 13, y, x + w, y + leading), text, size, color=TEXT, lineheight=0.95)
    return y + leading


def header(page: fitz.Page, title: str, y: float = 38, size: float = 14.0, x: float = 156) -> None:
    put(page, rect(x, y, 820, y + 42), title, size, color=BLUE, bold=True, lineheight=0.92)


def project_page_27(page: fitz.Page) -> None:
    header(page, 'PROJECT:\n"LIQUEFIED NATURAL GAS AND STABLE GAS CONDENSATE TERMINAL\nUTRENNY"', 35, 12.0)
    put(
        page,
        rect(166, 83, 835, 112),
        "Location: Yamalo-Nenets Autonomous Okrug, western coast of the Gydan Peninsula,\n"
        "eastern coast of the northern part of the Gulf of Ob",
        10.5,
        color=(0, 0, 0),
        align=fitz.TEXT_ALIGN_CENTER,
        lineheight=0.95,
    )
    put(
        page,
        rect(170, 345, 685, 365),
        "Description: Mooring embankment. Plots No. 1, No. 2, No. 3, artificial land plot No. 1",
        10.0,
        align=fitz.TEXT_ALIGN_CENTER,
    )
    put(page, rect(42, 373, 330, 392), "Construction period: 2018-2020", 10.5, bold=True)
    put(page, rect(42, 404, 350, 420), "Specifications:", 10.0)
    y = 419
    for item in [
        "Total length of berths - 1,762 m",
        "Metal weight about 38 thousand t",
        "Inert material volume over 1.4 million m3",
        "Concrete work: 25.6 thousand m3",
    ]:
        y = bullet_text(page, 42, y, item, 420, 10.0, 13.0)
    footer(page, 27)


def project_page_28(page: fitz.Page) -> None:
    header(page, 'PROJECT:\n"CENTER FOR CONSTRUCTION OF LARGE-CAPACITY MARINE STRUCTURES (CSKMS)"', 35, 12.0)
    put(page, rect(205, 85, 630, 104), "Location: Murmansk region, Kola district", 10.5, align=fitz.TEXT_ALIGN_CENTER)
    put(
        page,
        rect(92, 345, 748, 368),
        "Description: Bank protection No. 2; Bank protection No. 3; Bank protection No. 5; "
        "Bank protection No. 6;\nBerth No. 4",
        9.8,
        align=fitz.TEXT_ALIGN_CENTER,
        lineheight=0.92,
    )
    put(page, rect(62, 386, 330, 405), "Construction period: 2019-2020", 10.5, bold=True)
    put(page, rect(40, 418, 160, 434), "Specifications:", 10.0)
    y = 433
    for item in [
        "Length - 1,371.1 m",
        "Metal weight about 36.8 thousand t",
        "Inert material volume about 745 thousand m3",
        "Concrete work about 30 thousand m3",
    ]:
        y = bullet_text(page, 40, y, item, 430, 10.0, 13.0)
    footer(page, 28)


def project_page_29(page: fitz.Page) -> None:
    header(
        page,
        'PROJECT:\n"LIQUEFIED NATURAL GAS AND STABLE GAS CONDENSATE TERMINAL\nUTRENNY" STAGE 2, 3, 11, 13.1, 13.2, 15',
        35,
        11.7,
    )
    put(
        page,
        rect(160, 80, 610, 98),
        "Location: Yamalo-Nenets Autonomous Okrug, Tyumen Region, Tazovsky District",
        8.7,
        color=(0, 0, 0),
    )
    put(
        page,
        rect(60, 340, 410, 386),
        "Description: Northern ice-protection structure\n"
        "Southern ice-protection structure\n"
        "Dredging of the approach channel and terminal water area",
        10.2,
        color=TEXT,
        lineheight=1.05,
    )
    put(page, rect(60, 398, 285, 416), "Construction period: 2020-2022", 10.2, color=TEXT, bold=True)
    put(page, rect(60, 427, 180, 443), "Specifications:", 9.5, color=TEXT)
    y = 444
    for item in [
        "Total length - 4,428 m",
        "Metal weight about 165.5 thousand t",
        "Concrete work about 155.7 thousand m3",
        "Dredging of the approach channel and terminal water area - 20.5 million m3",
    ]:
        y = bullet_text(page, 60, y, item, 500, 8.8, 14.5)
    footer(page, 29)


def project_page_30(page: fitz.Page) -> None:
    header(
        page,
        'PROJECT:\n"GAS PROCESSING COMPLEX AS PART OF THE ETHANE-CONTAINING GAS\nPROCESSING COMPLEX NEAR UST-LUGA"',
        38,
        11.7,
    )
    put(page, rect(212, 86, 592, 104), "Location: Ust-Luga, Leningrad Region", 10.5, align=fitz.TEXT_ALIGN_CENTER)
    put(
        page,
        rect(130, 318, 760, 338),
        "Anchor project of a large gas processing and gas chemical cluster being formed in the region",
        10.2,
        color=(0.26, 0.48, 0.74),
        bold=True,
        align=fitz.TEXT_ALIGN_CENTER,
    )
    put(page, rect(55, 351, 445, 370), "Construction period: 05.2023 - 08.2027 (works ongoing)", 10.0)
    put(page, rect(55, 376, 124, 394), "Customer:", 10.0, bold=True)
    put(
        page,
        rect(108, 398, 525, 436),
        "The project operator is RusKhimAlliance LLC, a special-purpose company\n"
        "established on a parity basis by PJSC Gazprom and RusGazDobycha JSC.",
        9.2,
        color=(0, 0, 0),
        lineheight=0.95,
    )
    put(page, rect(55, 441, 130, 458), "Description:", 10.0, bold=True)
    y = 463
    y = bullet_text(page, 72, y, "Two berths for LNG loading", 270, 9.5, 15)
    y = bullet_text(page, 72, y, "One berth for LPG loading", 270, 9.5, 15)
    put(page, rect(55, 506, 98, 521), "incl.", 9.5)
    y = 526
    y = bullet_text(page, 72, y, "36,630 t - volume of pile products", 300, 9.2, 14)
    y = bullet_text(page, 72, y, "63,000 m3 - volume of concreting", 300, 9.2, 14)
    put(page, rect(300, 448, 392, 468), "Federal facilities:", 9.5)
    y = 483
    y = bullet_text(page, 300, y, "1,921,000 m3 - volume of dredging works", 570, 9.2, 17)
    y = bullet_text(page, 300, y, "Construction of a special checkpoint", 570, 9.2, 17)
    y = bullet_text(page, 300, y, "AtoN signs", 570, 9.2, 17)
    footer(page, 30)


def ribbon(page: fitz.Page, title_box: fitz.Rect, title: str, spec_box: fitz.Rect, spec: str, title_size: float = 14.0) -> None:
    put(page, title_box, title, title_size, color=WHITE, bold=True, lineheight=0.88, min_size=8.0)
    put(page, spec_box, spec, 6.3, color=(0, 0, 0), lineheight=0.95, min_size=4.8)


def page_36(page: fitz.Page) -> None:
    ribbon(
        page,
        rect(14, 202, 235, 238),
        "Pipe-laying barge\nMRTS DEFENDER",
        rect(236, 198, 420, 238),
        "Technological line:\n6 welding stations\n1 NDT / repair station\n2 insulation stations\nPipe diameter 101.60-1,524 mm",
        12.6,
    )
    ribbon(
        page,
        rect(428, 202, 610, 238),
        "Pipe-laying barge\nCAPTAIN BULGANIN",
        rect(630, 198, 835, 238),
        "Technological line:\n3 welding stations\n1 NDT / repair station\n2 insulation stations\nPipe diameter 609.60-1,828.80 mm",
        12.2,
    )
    ribbon(
        page,
        rect(16, 546, 210, 585),
        "Deck barge\nMGS-1",
        rect(250, 546, 420, 581),
        "Cargo deck area 2,500 m2\nBairas winch 4 pcs x 18 t",
        14.0,
    )
    ribbon(
        page,
        rect(428, 546, 625, 585),
        "Multifunctional barge\nGEFEST",
        rect(650, 542, 838, 582),
        "Soil pump capacity by water\n4,500 m3/hour\nJet pump motor\nCaterpillar C32 1 x 650 kW",
        11.0,
    )


def page_37(page: fitz.Page) -> None:
    ribbon(
        page,
        rect(28, 282, 230, 336),
        'Multi-bucket\nnon-self-propelled dredger\n"Samotlor"',
        rect(292, 285, 420, 325),
        "Bucket chain for 20 m\ndredging depth\nBucket capacity 0.325 m3",
        13.0,
    )
    ribbon(
        page,
        rect(470, 286, 650, 330),
        "Diving boat\nPTPSV-7",
        rect(690, 286, 824, 313),
        "Main engine power - 110 kW\nDraft - 1.1 m",
        14.8,
    )
    ribbon(
        page,
        rect(45, 562, 245, 590),
        "Floating crane PK-4",
        rect(312, 562, 425, 590),
        "Load capacity - 16 t\nBoom radius 30 m",
        14.2,
    )
    ribbon(
        page,
        rect(470, 562, 675, 590),
        "Floating crane PK-3",
        rect(710, 562, 825, 580),
        "Load capacity - 5 t",
        14.2,
    )


def page_39(page: fitz.Page) -> None:
    ribbon(
        page,
        rect(255, 258, 480, 296),
        "Self-elevating platform\nSKYLIFT 3000",
        rect(480, 251, 655, 286),
        "Working depth 36.20 m\nDeck load capacity 12 t/m2",
        11.5,
    )
    ribbon(
        page,
        rect(18, 548, 235, 585),
        "Deck barge MMP-1",
        rect(255, 546, 420, 583),
        "Cargo deck area 300 m2\n4 winches x 15 t; cable 150 m",
        13.2,
    )
    ribbon(
        page,
        rect(430, 548, 625, 585),
        "Platform\nMRTS SAPPOTER",
        rect(656, 544, 840, 584),
        "Working depth 22 m\nPile-driving unit: 4 piles x 30 m",
        12.2,
    )


def page_40(page: fitz.Page) -> None:
    ribbon(
        page,
        rect(28, 246, 240, 288),
        "Hydrographic survey vessel\nGLADIUS",
        rect(243, 245, 420, 284),
        "Draft 1.30 m\nMain engine MAN 2842 LE 405\n2 x 660 kW",
        12.4,
    )
    ribbon(
        page,
        rect(430, 246, 630, 288),
        "Hydrographic survey vessel\nKAREON",
        rect(665, 244, 835, 284),
        "Draft 1.43 m\nMain engine DORMAN SP6LTD5\n2 x 220 kW",
        10.6,
    )
    ribbon(
        page,
        rect(34, 546, 240, 585),
        "Service and crew vessel\nMOSELLE",
        rect(250, 548, 420, 585),
        "Free speed 20 knots\nMain engine Mercedes Benz OM 444 LA\n2 x 550 kW",
        9.7,
    )
    ribbon(
        page,
        rect(430, 546, 630, 585),
        "Service and crew vessel\nRHINE",
        rect(665, 548, 835, 585),
        "Free speed 9.50 knots\nMain engine Mercedes Benz OM 442LA\n2 x 450 kW",
        10.0,
    )


def page_42(page: fitz.Page) -> None:
    header(page, "TECHNICAL EQUIPMENT OF THE BASE", 42, 17.0, x=160)
    put_rotated(page, (26, 382), "PERSONNEL AND EQUIPMENT", 15.5)
    put_rotated(page, (372, 296), "KEY METRICS", 15.5)
    left = [
        ("3 technological\nlines", "Rolling\nequipment"),
        ("65\ninstallations", "Automatic welding\nequipment"),
        ("78\ninstallations", "Semi-automatic\nwelding equipment"),
        ("124\ninstallations", "Manual welding\nequipment"),
        ("1 installation", "Pipe welding\nequipment"),
        (">200", "Highly qualified\nwelders"),
        ("Controls", ""),
        ("4", "LNK laboratory"),
        ("2", "Quality control\nservice"),
    ]
    y = 118
    for value, label in left:
        if value == "Controls":
            put(page, rect(64, y, 180, y + 18), value, 8.5, color=BLUE, bold=True)
            y += 24
            continue
        put(page, rect(62, y, 146, y + 26), value, 13.0 if "\n" in value or value.startswith(">") else 10.0, color=GREY, bold=True, lineheight=0.86)
        put(page, rect(148, y + 2, 305, y + 34), label, 8.8, color=TEXT, lineheight=0.92)
        y += 43
    put(page, rect(57, 512, 278, 548), "Equipment: >280 units\nPersonnel: >700 people", 11.5, color=WHITE, bold=True, lineheight=0.9)
    metrics = [
        ("50 ha", "Territory"),
        ("6 km", "Railway tracks"),
        ("2", "Rail sidings"),
        ("100 railcars", "Railcar capacity"),
        ("2", "Shunting railway locomotives"),
        ("200,000 m2", "Open areas"),
        ("15,000 m2", "Covered warehouses"),
    ]
    y = 132
    for value, label in metrics:
        put(page, rect(395, y, 500, y + 24), value, 13.0, color=GREY, bold=True)
        put(page, rect(510, y + 3, 635, y + 25), label, 8.8, color=TEXT, lineheight=0.95)
        y += 48
    right = [
        ("360 m", "Berths"),
        ("1,500 t", "Ship loading per day"),
        ("7.5 m", "Vessel draft"),
        ("600,000", "Possible annual\ncargo turnover, t"),
        ("104 t", "Mobile portal crane\nLiebherr LHM 550"),
    ]
    y = 132
    for value, label in right:
        put(page, rect(635, y, 720, y + 24), value, 13.0, color=GREY, bold=True)
        put(page, rect(725, y + 2, 835, y + 35), label, 8.4, color=TEXT, lineheight=0.9)
        y += 51
    footer(page, 42)


def production_header(page: fitz.Page) -> None:
    header(page, "PRODUCTION BASE", 42, 17.0, x=218)
    put(
        page,
        rect(255, 80, 760, 100),
        "Location: Arkhangelsk, territory of the Arkhangelsk sea trade port (left bank)",
        10.5,
        align=fitz.TEXT_ALIGN_CENTER,
    )


def page_45(page: fitz.Page) -> None:
    production_header(page)
    put(page, rect(245, 126, 430, 145), "SCOPE OF WORK:", 11.5, color=BLUE, bold=True)
    y = 150
    for item in [
        "Production of pipe products (dia. up to 3,500 mm, capacity up to 3,000 t per month)",
        "Production of shell piles (including large-diameter pipe sheet piles)",
        "Production of overpasses",
        "Production of reinforced concrete structures (concrete mats, slabs, supports, etc.)",
        "Assembly of modular structures",
    ]:
        y = bullet_text(page, 246, y, item, 805, 9.8, 22)
    put(
        page,
        rect(284, 310, 680, 342),
        "DESIGN AND MANUFACTURE OF CONDUCTORS\nFOR SHELL PILE IMMERSION",
        10.5,
        color=BLUE,
        bold=True,
        align=fitz.TEXT_ALIGN_CENTER,
        lineheight=0.92,
    )
    put(page, rect(300, 425, 500, 445), "OTHER PRODUCTS", 11.0, color=BLUE, bold=True)
    y = 455
    for item in ["Distribution belts", "Insulation of anchor rods", "Cable trays"]:
        y = bullet_text(page, 300, y, item, 540, 9.6, 20)
    y = 455
    for item in ["Clamps (for lifting underwater pipelines)", "Welding and painting of sheet piles", "Anchor plates"]:
        y = bullet_text(page, 498, y, item, 810, 9.6, 20)
    footer(page, 45)


def page_46(page: fitz.Page) -> None:
    production_header(page)
    put(page, rect(408, 122, 580, 142), "PERFORMANCE:", 11.5, color=BLUE, bold=True)
    bullet_text(page, 408, 152, "Production volume of metal structures: 50 thousand t per year", 815, 9.8, 18)
    put(page, rect(408, 198, 570, 218), "ADVANTAGES:", 11.5, color=BLUE, bold=True)
    y = 230
    for item in [
        "Production and logistics base closest to the Arctic",
        "Production of unique product types",
        "Own port infrastructure",
        "Year-round port operation",
        "Direct access from the M-8 highway and railway (without bridges or ferry crossings)",
        "Developed infrastructure in the region and surrounding areas",
    ]:
        y = bullet_text(page, 408, y, item, 820, 9.8, 22)
    footer(page, 46)


def page_50(page: fitz.Page) -> None:
    put(page, rect(170, 246, 430, 270), "THANK YOU FOR YOUR ATTENTION!", 14.0, color=BLUE, bold=True, align=fitz.TEXT_ALIGN_CENTER)
    put(
        page,
        rect(102, 365, 325, 418),
        "CONTACTS:\nE-mail: mrts@mrts.ru\nTel.: +7 (499) 754 20 21\nWebsite: www.mrts.ru",
        10.5,
        color=BLUE,
        lineheight=0.92,
    )


def main() -> None:
    doc = fitz.open(PDF)
    handlers = {
        27: project_page_27,
        28: project_page_28,
        29: project_page_29,
        30: project_page_30,
        36: page_36,
        37: page_37,
        39: page_39,
        40: page_40,
        42: page_42,
        45: page_45,
        46: page_46,
        50: page_50,
    }
    for page_no, fn in handlers.items():
        page = doc[page_no - 1]
        wipe_text(page)
        fn(page)
    tmp = OUT.with_name(OUT.stem + "_tmp.pdf")
    doc.save(tmp, garbage=4, deflate=True)
    doc.close()
    tmp.replace(OUT)
    print(f"saved {OUT.resolve()}")


if __name__ == "__main__":
    main()

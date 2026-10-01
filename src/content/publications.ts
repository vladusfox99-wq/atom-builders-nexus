import scientificArticle from "./publication.json";
import veselovskogoInterview from "./publications/ntc-veselovskogo-otechestvennye-materialy-2026.json";

export const publications = [
  veselovskogoInterview,
  {
    ...scientificArticle,
    kind: "Научная статья",
    credits: scientificArticle.authors.join(" · "),
    metadata: "«Инженерный вестник Дона», № 8 (2026) · PDF · 19 страниц",
    fileDetails: "Оригинальная статья в PDF · 19 страниц · 549 КБ",
    downloadName: "Bechtev-Kurguz-Sokolik-2026.pdf",
  },
];

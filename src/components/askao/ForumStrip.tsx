import { ArrowUpRight } from "lucide-react";
import "./forum-strip.css";

const ForumStrip = () => (
  <aside className="askao-forum-strip" aria-label="Анонс III Финансово-промышленного форума" lang="ru">
    <div className="container askao-forum-strip__inner">
      <div className="askao-forum-strip__date">
        <time dateTime="2026-11-25">25 ноября 2026</time>
        <span className="askao-forum-strip__place">Москва · НИУ МГСУ</span>
      </div>
      <div className="askao-forum-strip__title">
        <h2>III Финансово-промышленный форум</h2>
        <p>в сфере строительства</p>
      </div>
      <a
        className="askao-forum-strip__link"
        href="https://promfinforum.ru/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="О форуме — открыть сайт promfinforum.ru в новой вкладке"
      >
        О форуме <ArrowUpRight size={20} aria-hidden="true" />
      </a>
    </div>
  </aside>
);

export default ForumStrip;

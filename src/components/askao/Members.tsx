import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import MemberLogo from "@/components/askao/MemberLogo";
import { members } from "@/content/members";

const PREVIEW_ROWS = 5;
const PREVIEW_COLUMNS_LG = 6;

const Members = () => {
  const preview = members.slice(0, PREVIEW_ROWS * PREVIEW_COLUMNS_LG);

  return (
    <section id="members" className="relative py-24 md:py-32 overflow-hidden bg-navy">
      <div className="container mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="section-label mb-6">Участники</div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Экосистема <br />
              <span className="text-gradient">крупных игроков</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Более {members.length} компаний-лидеров — проектировщики, инжиниринговые и подрядные организации,
            формирующие опорный каркас атомного строительства.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border border border-border">
          {preview.map((m) => (
            <div
              key={m.name}
              className="group relative aspect-[4/3] bg-navy-deep p-4 flex items-center justify-center overflow-hidden transition-colors hover:bg-navy-light"
            >
              <MemberLogo
                src={m.logo}
                name={m.name}
                className="h-16 w-full max-w-[85%] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/members"
            className="group inline-flex items-center gap-3 border border-primary/40 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            Все участники
            <ArrowUpRight size={18} className="transition-transform group-hover:rotate-45" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Members;

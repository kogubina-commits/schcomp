import { useState } from "react";

const MOODS: Record<string, { emoji: string; label: string }> = {
  great: { emoji: "😄", label: "супер" },
  good: { emoji: "🙂", label: "хорошо" },
  ok: { emoji: "😐", label: "нормально" },
  sad: { emoji: "😔", label: "грустно" },
  angry: { emoji: "😤", label: "злость" },
};

const REASON_LABELS: Record<string, string> = {
  grade_good: "🌟 получил хорошую отметку",
  praise: "🎉 учитель похвалил",
  friends: "🤗 играл с друзьями",
  lesson: "🔍 интересный урок",
  tasty: "🍪 вкусное угощение",
  grade_bad: "📉 плохая отметка",
  scolded: "🌧️ учитель отругал",
  fight: "⛈️ поругался с другом",
  tired: "😴 сильно устал",
  board: "🙈 страшно было у доски",
  forgot: "🎒 забыл или потерял",
};

const MONTHS = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

function keyOf(d: Date) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function fmt(d: Date) {
  return d.getDate() + " " + MONTHS[d.getMonth()];
}

type DayEntry = { mood?: string; reasons?: string[]; note?: string };

function normalize(value: unknown): DayEntry {
  if (typeof value === "string") return { mood: value };
  if (value && typeof value === "object") return value as DayEntry;
  return {};
}

export default function WeekReport() {
  const [log] = useState<Record<string, DayEntry>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = JSON.parse(window.localStorage.getItem("school-compass-mood-log") || "{}") as Record<string, unknown>;
      const out: Record<string, DayEntry> = {};
      for (const k of Object.keys(raw)) out[k] = normalize(raw[k]);
      return out;
    } catch {
      return {};
    }
  });

  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  const from = days[0];
  const to = days[6];

  const rows = days.map((d) => {
    const entry = log[keyOf(d)];
    const moodInfo = entry && entry.mood && MOODS[entry.mood] ? MOODS[entry.mood] : null;
    const parts: string[] = [];
    if (entry && entry.reasons && entry.reasons.length > 0) {
      parts.push(entry.reasons.map((r) => REASON_LABELS[r] || r).join("; "));
    }
    if (entry && entry.note && entry.note.trim().length > 0) {
      parts.push(entry.note.trim());
    }
    return {
      day: WEEKDAYS[d.getDay()] + ", " + fmt(d),
      mood: moodInfo ? moodInfo.emoji + " " + moodInfo.label : "",
      influence: parts.join(" | "),
    };
  });

  const downloadCsv = () => {
    const esc = (v: string) => '"' + v.replace(/"/g, '""') + '"';
    const lines: string[] = [];
    lines.push(esc("Отчет по настроению ребенка"));
    lines.push(esc("Период: с " + fmt(from) + " по " + fmt(to) + " включительно"));
    lines.push([esc("День"), esc("Настроение по дням"), esc("Что на это повлияло")].join(";"));
    for (const r of rows) {
      lines.push([esc(r.day), esc(r.mood || "—"), esc(r.influence || "—")].join(";"));
    }
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "otchet-nastroenie-" + keyOf(new Date()) + ".csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-[26px] border border-[#e2e4df] bg-white/80 p-5 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold text-[#26363b]">Отчет по настроению ребенка</h3>
          <p className="mt-1 text-sm text-[#8a9792]">Данные с {fmt(from)} по {fmt(to)} включительно.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#fff1cb] px-3 py-1 text-xs font-bold text-[#9f7b37]">7 дней</span>
          <button onClick={downloadCsv} className="rounded-xl bg-[#17212b] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#324b51]">
            ⬇ Скачать файл (CSV)
          </button>
        </div>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[#e2e4df] text-xs uppercase tracking-[0.12em] text-[#82918d]">
              <th className="px-3 py-2">День</th>
              <th className="px-3 py-2">Настроение по дням</th>
              <th className="px-3 py-2">Что на это повлияло</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d, i) => {
              const r = rows[i];
              const entry = log[keyOf(d)];
              const hasReasons = entry && entry.reasons && entry.reasons.length > 0;
              const hasNote = entry && entry.note && entry.note.trim().length > 0;
              return (
                <tr key={keyOf(d)} className="border-b border-[#eef0ec] align-top">
                  <td className="whitespace-nowrap px-3 py-2 font-semibold text-[#665b52]">{r.day}</td>
                  <td className="px-3 py-2">
                    {r.mood ? (
                      <span className="text-base">{r.mood.split(" ")[0]} <span className="text-sm text-[#665b52]">{r.mood.split(" ").slice(1).join(" ")}</span></span>
                    ) : (
                      <span className="text-[#b2bdb7]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-[#665b52]">
                    {hasReasons || hasNote ? (
                      <>
                        {hasReasons && <span>{(entry.reasons as string[]).map((x) => REASON_LABELS[x] || x).join("; ")}</span>}
                        {hasNote && <span className={(hasReasons ? "mt-1 block " : "") + "italic text-[#8a9792]"}>«{entry.note}»</span>}
                      </>
                    ) : entry && entry.mood ? (
                      <span className="text-[#b2bdb7]">ребёнок не отметил причины</span>
                    ) : (
                      <span className="text-[#b2bdb7]">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[#9aa59f]">Файл CSV открывается и редактируется в Excel, Google Sheets и Numbers. Голосовые рассказы ребёнка сохраняются как текст.</p>
    </section>
  );
}

const MOODS: Record<string, { emoji: string; word: string }> = {
  great: { emoji: "😄", word: "супер" },
  good: { emoji: "🙂", word: "хорошо" },
  ok: { emoji: "😐", word: "нормально" },
  sad: { emoji: "😔", word: "грустно" },
  angry: { emoji: "😤", word: "злость" },
};

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export default function ParentHint({ childName }: { childName?: string }) {
  const name = childName && childName.trim() ? childName.trim() : "ребёнок";
  let entry: { mood?: string } = {};
  if (typeof window !== "undefined") {
    try {
      const raw = JSON.parse(window.localStorage.getItem("school-compass-mood-log") || "{}") as Record<string, unknown>;
      const v = raw[todayKey()];
      entry = typeof v === "string" ? { mood: v } : ((v as { mood?: string }) || {});
    } catch {
      entry = {};
    }
  }
  const m = entry.mood ? MOODS[entry.mood] : undefined;
  const text = m
    ? `Сегодня ${name} отметил день так: ${m.emoji} «${m.word}». Иногда лучшая поддержка — просто обнять и побыть рядом без расспросов.`
    : `Вечером ${name} поделится своим днём с героем. Вам не нужно ничего специального — быть рядом уже достаточно.`;
  return (
    <section className="mt-6 rounded-2xl border border-[#f0dfb2] bg-[#fffaf0] px-4 py-3 text-sm leading-5 text-[#806531]">
      <span className="mr-2">💛</span>
      {text}
    </section>
  );
}

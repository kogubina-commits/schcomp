import { useState, useEffect, useRef } from "react";

const MOODS = [
  { key: "great", emoji: "😄", label: "Супер!" },
  { key: "good", emoji: "🙂", label: "Хорошо" },
  { key: "ok", emoji: "😐", label: "Нормально" },
  { key: "sad", emoji: "😔", label: "Грустно" },
  { key: "angry", emoji: "😤", label: "Злюсь" },
];

const REASONS_GOOD = [
  { key: "grade_good", emoji: "🌟", label: "Получил хорошую отметку" },
  { key: "praise", emoji: "🎉", label: "Учитель похвалил" },
  { key: "friends", emoji: "🤗", label: "Играл с друзьями" },
  { key: "lesson", emoji: "🔍", label: "Интересный урок" },
  { key: "tasty", emoji: "🍪", label: "Вкусное угощение" },
];

const REASONS_HARD = [
  { key: "grade_bad", emoji: "📉", label: "Плохая отметка" },
  { key: "scolded", emoji: "🌧️", label: "Учитель отругал" },
  { key: "fight", emoji: "⛈️", label: "Поругался с другом" },
  { key: "tired", emoji: "😴", label: "Сильно устал" },
  { key: "board", emoji: "🙈", label: "Страшно было у доски" },
  { key: "forgot", emoji: "🎒", label: "Забыл или потерял" },
];

type DayEntry = { mood?: string; reasons?: string[]; note?: string };

function normalize(value: unknown): DayEntry {
  if (typeof value === "string") return { mood: value };
  if (value && typeof value === "object") return value as DayEntry;
  return {};
}

function todayKey() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export default function MoodCheckin() {
  const [log, setLog] = useState<Record<string, DayEntry>>(() => {
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

  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const noteRef = useRef<string>("");

  const today = todayKey();
  const entry = log[today] || {};
  const reasons = entry.reasons || [];
  const note = entry.note || "";
  const mascot = typeof window !== "undefined" && window.localStorage.getItem("school-compass-mascot") === "timo" ? "timo" : "luna";
  const mascotName = mascot === "timo" ? "Тимо" : "Луна";

  const save = (next: DayEntry) => {
    const full = { ...log, [today]: next };
    setLog(full);
    window.localStorage.setItem("school-compass-mood-log", JSON.stringify(full));
    if (next.note !== undefined) {
      noteRef.current = next.note;
    }
  };

  const pickMood = (key: string) => save({ ...entry, mood: key });

  const toggleReason = (key: string) => {
    const next = reasons.includes(key) ? reasons.filter((r) => r !== key) : [...reasons, key];
    save({ ...entry, reasons: next });
  };

  const done = Boolean(entry.mood) && (reasons.length > 0 || note.trim().length > 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
  }, []);

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  const toggleListening = () => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript + " ";
        }
      }
      if (transcript) {
        const currentNote = noteRef.current;
        const newNote = currentNote + (currentNote ? " " : "") + transcript.trim();
        save({ ...entry, note: newNote });
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <section className="mt-6 rounded-[26px] border border-[#e2e4df] bg-white/80 p-5 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-6">
      <div className="flex items-center gap-4">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ backgroundColor: mascot === "luna" ? "#F7C6B8" : "#C8DCEB" }}>
          <img src={`${import.meta.env.BASE_URL}images/${mascot}.png`} alt={mascotName} className="mascot-cut h-full w-full object-contain" />
        </span>
        <div>
          <h3 className="font-display text-xl font-semibold text-[#26363b]">Вечерний чек-ин с {mascotName}</h3>
          <p className="mt-1 text-sm text-[#8a9792]">Три коротких шага — и день ложится в копилку недели.</p>
        </div>
      </div>

      <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#82918d]">Шаг 1. Как прошёл твой день?</p>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {MOODS.map((m) => (
          <button key={m.key} onClick={() => pickMood(m.key)} className={`flex flex-col items-center gap-1 rounded-2xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md ${entry.mood === m.key ? "border-[#e58e79] bg-[#fff9f5]" : "border-[#e6e8e4] bg-[#fbfcfa]"}`}>
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-[11px] font-semibold text-[#665b52]">{m.label}</span>
          </button>
        ))}
      </div>

      {entry.mood && (
        <>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#82918d]">Шаг 2. Что сегодня случилось?</p>
          <p className="mt-1 text-xs text-[#9aa59f]">Можно выбрать несколько пунктов.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {REASONS_GOOD.map((r) => (
              <button key={r.key} onClick={() => toggleReason(r.key)} className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${reasons.includes(r.key) ? "border-[#7ebb9d] bg-[#e3f3e9] text-[#4d8c6e]" : "border-[#e6e8e4] bg-[#fbfcfa] text-[#665b52] hover:border-[#7ebb9d]"}`}>
                <span>{r.emoji}</span>{r.label}
              </button>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {REASONS_HARD.map((r) => (
              <button key={r.key} onClick={() => toggleReason(r.key)} className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition ${reasons.includes(r.key) ? "border-[#e58e79] bg-[#fbe5df] text-[#b86151]" : "border-[#e6e8e4] bg-[#fbfcfa] text-[#665b52] hover:border-[#e58e79]"}`}>
                <span>{r.emoji}</span>{r.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[#82918d]">Шаг 3. Хочешь рассказать подробнее?</p>
          <div className="mt-2 flex gap-2">
            <textarea value={note} onChange={(e) => save({ ...entry, note: e.target.value })} rows={3} placeholder="Напиши или расскажи герою вслух" className="min-w-0 flex-1 rounded-xl border border-[#d8dfda] bg-[#fbfcfa] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
            {speechSupported && (
              <button
                onClick={toggleListening}
                className={`flex shrink-0 flex-col items-center justify-center rounded-xl border px-4 transition ${isListening ? "border-[#e58e79] bg-[#fbe5df] text-[#b86151]" : "border-[#d8dfda] bg-white text-[#8a9792] hover:border-[#e58e79] hover:text-[#b86151]"}`}
                aria-label={isListening ? "Остановить запись" : "Начать запись"}
              >
                {isListening ? (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 animate-pulse rounded-full bg-[#e58e79]"></span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
                      </svg>
                    </span>
                    <span className="mt-1 text-xs font-semibold">Остановить</span>
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <span className="mt-1 text-xs font-semibold">Сказать</span>
                  </>
                )}
              </button>
            )}
          </div>
          {isListening && (
            <p className="mt-2 text-xs text-[#b86151]">🎤 Говори, {mascotName} слушает. Нажми кнопку ещё раз, чтобы остановить.</p>
          )}
        </>
      )}

      {done && (
        <p className="mt-4 rounded-2xl bg-[#e3f3e9] px-4 py-3 text-sm font-semibold text-[#4d8c6e]">
          Спасибо, что поделился! {mascotName} всё запомнил. ✨
        </p>
      )}
    </section>
  );
}

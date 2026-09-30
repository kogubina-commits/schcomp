import { useState, useMemo } from "react";
import { Clock3 } from "lucide-react";

type MorningTask = { id: string; title: string };
type MorningConfig = {
  wakeTime: string;
  greeting: string;
  tasks: MorningTask[];
  aliceDays: boolean[];
  aliceMusic: boolean;
  alicePhrases: [string, string, string];
};

const DEFAULT: MorningConfig = {
  wakeTime: "07:00",
  greeting: "Доброе утро! Пора вставать. Впереди хороший день. Я рядом и помогу всё успеть.",
  tasks: [
    { id: "m1", title: "Почистить зубы" },
    { id: "m2", title: "Позавтракать" },
    { id: "m3", title: "Одеться" },
    { id: "m4", title: "Не забыть рюкзак и завтрак" },
  ],
  aliceDays: [true, true, true, true, true, false, false],
  aliceMusic: true,
  alicePhrases: ["", "", ""],
};

const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function readConfig(): MorningConfig {
  try {
    const raw = window.localStorage.getItem("school-compass-morning");
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return DEFAULT;
  }
}

function cleanForAlice(text: string): string {
  return text
    .replace(/[—–―]/g, " ")
    .replace(/[:;]/g, ",")
    .replace(/\s+/g, " ")
    .trim();
}

function autoGenerate(config: MorningConfig): [string, string, string] {
  const hello = cleanForAlice(config.greeting) || "Доброе утро! Пора вставать.";
  const tasksText = config.tasks.length > 0
    ? "Сегодня нужно " + config.tasks.map((t) => t.title.toLowerCase()).join(", ") + "."
    : "";
  const support = "Ты справишься, я в тебя верю. Хорошего дня!";

  const splitTo100 = (s: string): string[] => {
    const clean = cleanForAlice(s);
    if (!clean) return [];
    if (clean.length <= 100) return [clean];
    const words = clean.split(" ");
    const parts: string[] = [];
    let current = "";
    for (const w of words) {
      if ((current + " " + w).trim().length > 100) {
        parts.push(current.trim());
        current = w;
      } else {
        current = current ? current + " " + w : w;
      }
    }
    if (current) parts.push(current.trim());
    return parts;
  };

  const allParts = [...splitTo100(hello), ...splitTo100(tasksText), ...splitTo100(support)];
  const out: [string, string, string] = ["", "", ""];
  let idx = 0;
  for (const part of allParts) {
    while (idx < 3 && (out[idx] + " " + part).trim().length > 100) idx++;
    if (idx >= 3) break;
    out[idx] = out[idx] ? out[idx] + " " + part : part;
  }
  return out;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#82918d]">{label}</span>
        {value && <button onClick={copy} className="text-[11px] font-semibold text-[#5a8391] hover:text-[#3f6d7c]">{copied ? "Скопировано ✓" : "Копировать"}</button>}
      </div>
      <div className="mt-1 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm text-[#26363b]">{value || "—"}</div>
    </div>
  );
}

export default function MorningRoutine() {
  const [config, setConfig] = useState<MorningConfig>(() => readConfig());
  const [newTitle, setNewTitle] = useState("");
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const auto = useMemo(() => autoGenerate(config), [config]);

  const save = (next: MorningConfig) => {
    setConfig(next);
    window.localStorage.setItem("school-compass-morning", JSON.stringify(next));
  };

  const addTask = () => {
    const t = newTitle.trim();
    if (!t) return;
    save({ ...config, tasks: [...config.tasks, { id: "m" + Date.now(), title: t }] });
    setNewTitle("");
  };
  const removeTask = (id: string) => save({ ...config, tasks: config.tasks.filter((t) => t.id !== id) });

  const toggleDay = (i: number) => {
    const next = [...config.aliceDays];
    next[i] = !next[i];
    save({ ...config, aliceDays: next });
  };

  const setPhrase = (i: 0 | 1 | 2, v: string) => {
    const next = [...config.alicePhrases] as [string, string, string];
    next[i] = cleanForAlice(v);
    save({ ...config, alicePhrases: next });
  };

  const openWizard = () => {
    if (!config.alicePhrases[0] && !config.alicePhrases[1] && !config.alicePhrases[2]) {
      save({ ...config, alicePhrases: auto });
    }
    setStep(1);
    setShowWizard(true);
  };

  const selectedDaysShort = config.aliceDays.map((v, i) => (v ? DAY_LABELS[i] : null)).filter(Boolean).join(", ");
  const phraseSteps = config.alicePhrases.map((p, i) => ({ p, n: i + 1 })).filter((x) => x.p.trim().length > 0);

  return (
    <section className="rounded-[26px] border border-[#e2e4df] bg-white/80 p-5 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#82918d]"><Clock3 size={14} /> Завтра утром</div>
          <h2 className="font-display text-3xl font-semibold tracking-[-0.05em] text-[#26363b]">План на утро</h2>
          <p className="mt-1 text-sm text-[#8a9792]">Утренние дела ребёнка. При желании их можно озвучить через умную колонку.</p>
        </div>
        
      </div>

      <div className="mt-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Время подъёма</span>
          <input type="time" value={config.wakeTime} onChange={(e) => save({ ...config, wakeTime: e.target.value })} className="mt-2 block w-36 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-center text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Приветствие для ребёнка</span>
        <textarea value={config.greeting} onChange={(e) => save({ ...config, greeting: e.target.value })} rows={2} className="mt-1 w-full rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
      </label>

      <div className="mt-4">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Утренние дела</span>
        <div className="mt-2 space-y-2">
          {config.tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-2">
              <span className="flex-1 rounded-xl border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-2 text-sm font-semibold text-[#26363b]">{t.title}</span>
              <button onClick={() => removeTask(t.id)} className="text-[#b2bdb7] transition hover:text-[#b86151]" aria-label="Удалить">✕</button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Добавить дело, например: заправить кровать" className="min-w-0 flex-1 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
          <button onClick={addTask} className="rounded-xl bg-[#17212b] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#324b51]">Добавить</button>
        </div>
      </div>

      <div className="mt-4 border-t border-[#eef0ec] pt-4">
        <button onClick={openWizard} className="rounded-xl bg-[#fc3f1d] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#e63615]">🔊 Настроить голосовое утро (Алиса)</button>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-[#17212b]/30 p-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[26px] bg-[#fffdf9] p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#82918d]">Шаг {step} из 4</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">
                  {step === 1 && "В какие дни запускать"}
                  {step === 2 && "Музыка"}
                  {step === 3 && "Что скажет колонка"}
                  {step === 4 && "Как настроить в Доме с Алисой"}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f3ef] text-[#80908d]">✕</button>
            </div>

            {step === 1 && (
              <div className="mt-5">
                <p className="text-sm text-[#8a9792]">Отметь дни, когда нужно голосовое напоминание.</p>
                <div className="mt-3 grid grid-cols-7 gap-1.5">
                  {DAY_LABELS.map((d, i) => (
                    <button key={d} onClick={() => toggleDay(i)} className={`rounded-xl border px-1 py-3 text-xs font-bold transition ${config.aliceDays[i] ? "border-[#7ebb9d] bg-[#e3f3e9] text-[#4d8c6e]" : "border-[#e6e8e4] bg-[#fbfcfa] text-[#8a9792] hover:border-[#7ebb9d]"}`}>{d}</button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-[#9aa59f]">Выбрано: {selectedDaysShort || "ни одного дня"}</p>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5">
                <p className="text-sm text-[#8a9792]">Спокойная музыка помогает проснуться мягче.</p>
                <div className="mt-3 grid gap-2">
                  <button onClick={() => save({ ...config, aliceMusic: true })} className={`rounded-2xl border p-4 text-left transition ${config.aliceMusic ? "border-[#7ebb9d] bg-[#e3f3e9]" : "border-[#e6e8e4] bg-[#fbfcfa] hover:border-[#7ebb9d]"}`}>
                    <div className="text-sm font-bold text-[#26363b]">🎵 Включить спокойную музыку</div>
                    <div className="mt-1 text-xs text-[#8a9792]">Колонка тихо заиграет фоновую мелодию</div>
                  </button>
                  <button onClick={() => save({ ...config, aliceMusic: false })} className={`rounded-2xl border p-4 text-left transition ${!config.aliceMusic ? "border-[#7ebb9d] bg-[#e3f3e9]" : "border-[#e6e8e4] bg-[#fbfcfa] hover:border-[#7ebb9d]"}`}>
                    <div className="text-sm font-bold text-[#26363b]">🔇 Без музыки</div>
                    <div className="mt-1 text-xs text-[#8a9792]">Только голосовое напоминание</div>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[#8a9792]">Три фразы, каждая до 100 символов. Спецсимволы убираются автоматически.</p>
                  <button onClick={() => save({ ...config, alicePhrases: auto })} className="rounded-lg border border-[#d8dfda] bg-white px-2.5 py-1 text-xs font-semibold text-[#665b52] hover:border-[#7ebb9d]">Заполнить автоматически</button>
                </div>
                {[0, 1, 2].map((i) => {
                  const v = config.alicePhrases[i] || "";
                  const over = v.length > 100;
                  return (
                    <div key={i} className="mt-3">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.12em] text-[#82918d]">
                        <span>Фраза {i + 1}</span>
                        <span className={over ? "font-bold text-[#b86151]" : "text-[#9aa59f]"}>{v.length}/100</span>
                      </div>
                      <textarea value={v} onChange={(e) => setPhrase(i as 0 | 1 | 2, e.target.value)} rows={2} placeholder={i === 0 ? "Приветствие" : i === 1 ? "Список дел" : "Поддержка"} className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 ${over ? "border-[#e58e79] bg-[#fff9f5] focus:ring-[#e58e79]" : "border-[#d8dfda] bg-white focus:ring-[#f3c3b4]"}`} />
                    </div>
                  );
                })}
                {config.alicePhrases.some((p) => p.length > 100) && (
                  <p className="mt-2 text-xs font-semibold text-[#b86151]">Одна из фраз длиннее 100 символов — колонка может не прочитать её целиком.</p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="mt-5">
                <p className="text-sm text-[#8a9792]">Алиса пока не подключена к приложению напрямую, поэтому голосовое утро настраивается <b>один раз вручную</b> в приложении «Умный дом с Алисой». Следуй алгоритму.</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-5 text-[#665b52]">
                  <li>Открой приложение <b>«Умный дом»</b> (Дом с Алисой).</li>
                  <li>Нажми <b>Сценарии</b> → <b>Создать сценарий</b>.</li>
                  <li>В поле <b>«Укажите имя сценария»</b> напиши <b>Утро с компасом</b>, нажми <b>Далее</b>.</li>
                  <li>В блоке <b>«Если»</b> нажми <b>Добавить условие</b> → <b>Время</b>. Выбери время <b>{config.wakeTime}</b> и дни <b>{selectedDaysShort || "—"}</b>.</li>
                  {config.aliceMusic && (
                    <li>В блоке <b>«Тогда»</b>: <b>Добавить действие</b> → <b>Устройство</b> → выбери свою колонку → <b>Включить музыку</b> и выбери спокойный трек.</li>
                  )}
                  {phraseSteps.map((x, idx) => (
                    <li key={x.n}>
                      {config.aliceMusic || idx > 0 ? "Снова " : "В блоке «Тогда»: "}
                      <b>Добавить действие</b> → <b>Устройство</b> → выбери колонку → <b>Прочитать текст вслух</b>. Вставь <b>Фразу {x.n}</b>.
                    </li>
                  ))}
                  <li>Нажми <b>Сохранить</b>. Готово.</li>
                </ol>
                <div className="mt-4 border-t border-[#eef0ec] pt-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Фразы для копирования</p>
                  {config.alicePhrases.map((p, i) => <CopyField key={i} label={"Фраза " + (i + 1)} value={p} />)}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between gap-2">
              {step > 1 ? (
                <button onClick={() => setStep((step - 1) as 1 | 2 | 3 | 4)} className="rounded-xl border border-[#d8dfda] bg-white px-4 py-2.5 text-sm font-semibold text-[#665b52] hover:border-[#7ebb9d]">← Назад</button>
              ) : <span></span>}
              {step < 4 ? (
                <button onClick={() => setStep((step + 1) as 1 | 2 | 3 | 4)} className="rounded-xl bg-[#17212b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#324b51]">Далее →</button>
              ) : (
                <button onClick={() => setShowWizard(false)} className="rounded-xl bg-[#7ebb9d] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#6ba589]">Понятно</button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

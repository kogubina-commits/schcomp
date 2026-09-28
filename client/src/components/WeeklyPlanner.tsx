import { useState } from "react";

type PlanTask = { id: string; title: string; note: string; day: number };
const DAYS = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"];

function readPlan(): PlanTask[] {
  try { return JSON.parse(window.localStorage.getItem("school-compass-tasks") || "[]") as PlanTask[]; } catch { return []; }
}

export default function WeeklyPlanner() {
  const [plan, setPlan] = useState<PlanTask[]>(() => readPlan());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [day, setDay] = useState<number>(() => { const js = new Date().getDay(); return js === 0 ? 6 : js - 1; });
  const role = typeof window !== "undefined" ? window.localStorage.getItem("school-compass-role") : null;
  const isParent = role !== "child";
  const todayIdx = (() => { const js = new Date().getDay(); return js === 0 ? 6 : js - 1; })();

  const save = (list: PlanTask[]) => {
    setPlan(list);
    window.localStorage.setItem("school-compass-tasks", JSON.stringify(list));
  };

  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    save([...plan, { id: "t" + Date.now(), title: t, note: note.trim(), day }]);
    setTitle("");
    setNote("");
  };

  const removeTask = (id: string) => save(plan.filter((t) => t.id !== id));

  return (
    <div className="mt-4">
      {isParent && (
        <div className="rounded-2xl border border-dashed border-[#c9d5cd] bg-[#fbfcfa] p-3">
          <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Добавить задание на день недели</div>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]">
              {DAYS.map((d, i) => <option key={d} value={i}>{d}</option>)}
            </select>
            <input value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Например: взять форму на физкультуру" className="min-w-0 flex-1 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
            <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Подсказка (необязательно)" className="min-w-0 flex-1 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
            <button onClick={addTask} className="rounded-xl bg-[#17212b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#324b51]">Добавить</button>
          </div>
        </div>
      )}
      <div className="mt-3 grid gap-2">
        {DAYS.map((d, i) => {
          const dayTasks = plan.filter((t) => t.day === i);
          return (
            <div key={d} className={`rounded-2xl border p-3 ${i === todayIdx ? "border-[#e58e79] bg-[#fff9f5]" : "border-[#e6e8e4] bg-[#fbfcfa]"}`}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">{d}</div>
                {i === todayIdx && <span className="rounded-full bg-[#fbe5df] px-2 py-0.5 text-[10px] font-bold text-[#b86151]">СЕГОДНЯ</span>}
              </div>
              {dayTasks.length > 0 ? (
                <div className="mt-2 space-y-1.5">
                  {dayTasks.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 font-semibold text-[#26363b]">{t.title}{t.note ? <span className="ml-2 text-xs font-normal text-[#8a9792]">· {t.note}</span> : null}</span>
                      {isParent && <button onClick={() => removeTask(t.id)} className="text-[#b2bdb7] transition hover:text-[#b86151]" aria-label="Удалить">✕</button>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-xs text-[#b2bdb7]">Нет заданий</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

from pathlib import Path

home = Path('/home/ubuntu/firstgrade-compass/client/src/pages/Home.tsx')
text = home.read_text()
text = text.replace(
    'import { ArrowRight, Backpack, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Coffee, Info, Moon, MoreHorizontal, Pencil, Plus, RotateCcw, Sparkles, SunMedium, Timer, X } from "lucide-react";',
    'import { ArrowRight, Backpack, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Coffee, Flame, Info, Moon, MoreHorizontal, Pencil, Plus, RotateCcw, Sparkles, Star, SunMedium, Timer, Trophy, X } from "lucide-react";'
)
text = text.replace(
    '  const [reflection, setReflection] = useState<string | null>(null);\n  const completed',
    '  const [reflection, setReflection] = useState<string | null>(null);\n  const [recentlyDone, setRecentlyDone] = useState<number | null>(null);\n  const completed'
)
text = text.replace(
    '  const encouragement = useMemo(() => completed === tasks.length ? "Всё готово — можно выдыхать" : completed > 0 ? "Хороший темп, осталось совсем немного" : "Начнём с одного маленького шага", [completed, tasks.length]);\n  const toggleTask = (id: number) => setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));',
    '  const encouragement = useMemo(() => completed === tasks.length ? "Всё готово — можно выдыхать" : completed > 0 ? "Хороший темп, осталось совсем немного" : "Начнём с одного маленького шага", [completed, tasks.length]);\n  const allDone = completed === tasks.length && bagCompleted === bag.length;\n  const stars = completed + bagCompleted;\n  const toggleTask = (id: number) => {\n    const task = tasks.find((item) => item.id === id);\n    const nextDone = !task?.done;\n    setTasks((current) => current.map((item) => item.id === id ? { ...item, done: nextDone } : item));\n    if (nextDone) {\n      setRecentlyDone(id);\n      window.setTimeout(() => setRecentlyDone(null), 620);\n      toast.success("Звезда заработана", { description: "Ещё один спокойный шаг готов." });\n    }\n  };'
)
text = text.replace(
    '<div className="flex rounded-xl bg-[#f1f3ef] p-1 text-xs font-semibold text-[#80908d]"><button onClick={() => setActiveTab("today")} className={`rounded-lg px-3 py-2 transition ${activeTab === "today" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}>Сегодня</button><button onClick={() => setActiveTab("week")} className={`rounded-lg px-3 py-2 transition ${activeTab === "week" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}>Неделя</button></div></div>\n          {activeTab',
    '<div className="flex rounded-xl bg-[#f1f3ef] p-1 text-xs font-semibold text-[#80908d]" role="tablist" aria-label="Период плана"><button role="tab" aria-selected={activeTab === "today"} onClick={() => setActiveTab("today")} className={`relative rounded-lg px-3 py-2 transition duration-200 ${activeTab === "today" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}><span className="relative z-10">Сегодня</span></button><button role="tab" aria-selected={activeTab === "week"} onClick={() => setActiveTab("week")} className={`relative rounded-lg px-3 py-2 transition duration-200 ${activeTab === "week" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}><span className="relative z-10">Неделя</span></button></div></div>\n          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#f0dfb2] bg-[#fffaf0] px-3 py-2.5 text-xs"><span className="flex items-center gap-1.5 font-bold text-[#806531]"><Flame size={15} className="text-[#e58e79]" /> 2 дня подряд</span><span className="h-3 w-px bg-[#eadfce]" /><span className="flex items-center gap-1.5 font-semibold text-[#9f7b37]"><Star size={15} className="fill-[#f8d08f] text-[#e6b75f]" /> {stars} звёзд</span><span className="ml-auto hidden text-[#9a8a7a] sm:inline">До следующего уровня: {Math.max(0, 6 - stars)} шага</span></div>\n          {activeTab'
)
text = text.replace(
    'className={`group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(23,33,43,0.07)] ${task.done ? "border-[#cce5d4] bg-[#f3faf5]" : "border-[#e6e8e4] bg-[#fbfcfa]"}`}',
    'className={`task-row group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(23,33,43,0.07)] ${task.done ? "border-[#cce5d4] bg-[#f3faf5]" : "border-[#e6e8e4] bg-[#fbfcfa]"} ${recentlyDone === task.id ? "task-pop" : ""}`}'
)
text = text.replace(
    'className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition ${task.done ?',
    'className={`task-check grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition ${task.done ?'
)
text = text.replace(
    '</div><div className="mt-5 flex flex-col gap-3 sm:flex-row">{!showAdd ?',
    '</div>{allDone && <div className="celebrate-banner mt-4 flex items-center gap-3 rounded-2xl bg-[#e3f3e9] px-4 py-3 text-sm font-semibold text-[#4d8c6e]"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#e6b75f] shadow-sm"><Trophy size={16} /></span><span>Вечерний герой! Всё собрано — можно отдыхать.</span><Star size={18} className="ml-auto fill-[#f8d08f] text-[#e6b75f]" /></div>}<div className="mt-5 flex flex-col gap-3 sm:flex-row">{!showAdd ?'
)
home.write_text(text)

css = Path('/home/ubuntu/firstgrade-compass/client/src/index.css')
styles = css.read_text()
styles += '''\n@keyframes task-pop { 0% { transform: scale(1); } 45% { transform: scale(1.018) translateY(-2px); } 100% { transform: scale(1); } }\n@keyframes check-in { 0% { transform: scale(.72) rotate(-12deg); opacity: .2; } 65% { transform: scale(1.14) rotate(4deg); opacity: 1; } 100% { transform: scale(1) rotate(0); } }\n@keyframes celebrate-in { 0% { opacity: 0; transform: translateY(6px); } 100% { opacity: 1; transform: translateY(0); } }\n.task-pop { animation: task-pop 620ms cubic-bezier(.23,1,.32,1); }\n.task-pop .task-check { animation: check-in 520ms cubic-bezier(.23,1,.32,1); }\n.celebrate-banner { animation: celebrate-in 360ms cubic-bezier(.23,1,.32,1); }\n@media (prefers-reduced-motion: reduce) { .task-pop, .task-pop .task-check, .celebrate-banner { animation: none; } }\n'''
css.write_text(styles)

from pathlib import Path

home = Path('/home/ubuntu/firstgrade-compass/client/src/pages/Home.tsx')
text = home.read_text()
text = text.replace(
    'import { ArrowRight, Backpack, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Coffee, Flame, Info, Moon, MoreHorizontal, Pencil, Plus, RotateCcw, Sparkles, Star, SunMedium, Timer, Trophy, X } from "lucide-react";',
    'import { ArrowRight, Backpack, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Coffee, Flame, Info, Moon, MoreHorizontal, Pencil, Plus, RotateCcw, Sparkles, Star, SunMedium, Timer, Trophy, UserRound, X } from "lucide-react";'
)
text = text.replace(
    '  const [reflection, setReflection] = useState<string | null>(null);\n  const [recentlyDone',
    '  const [reflection, setReflection] = useState<string | null>(null);\n  const [mascot, setMascot] = useState<"luna" | "timo">("luna");\n  const [recentlyDone'
)
text = text.replace(
    '  const allDone = completed === tasks.length && bagCompleted === bag.length;\n  const stars',
    '  const allDone = completed === tasks.length && bagCompleted === bag.length;\n  const mascotCopy = mascot === "luna" ? { name: "Луна", role: "лисенок-исследователь", tip: completed === 0 ? "Давай найдём самый лёгкий шаг и начнём с него!" : allDone ? "Миссия вечера выполнена. Ты настоящий исследователь!" : "Классно идёшь. Какой следующий шаг найдём?" } : { name: "Тимо", role: "енот-изобретатель", tip: completed === 0 ? "Соберём план как конструктор: один шаг за раз!" : allDone ? "Суперсборка завершена. Можно включать режим отдыха!" : "Твоя команда растёт. Проверим следующий пункт?" };\n  const stars'
)
text = text.replace(
    '<div className="paper-lines pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-30" /></section>\n      <div className="grid gap-7',
    '<div className="paper-lines pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-30" /></section>\n      <section className="mascot-panel mb-8 overflow-hidden rounded-[26px] border border-[#eadfce] bg-[#fffaf2] p-4 shadow-[0_10px_30px_rgba(28,43,51,0.04)] sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4"><div className={`mascot-avatar mascot-${mascot}`}><MascotArt kind={mascot} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[0.15em] text-[#af8960]">Помощник {mascotCopy.name}</span><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a8a7a]">{mascotCopy.role}</span></div><p className="mt-1 text-sm font-semibold leading-5 text-[#665b52]">{mascotCopy.tip}</p></div></div><div className="flex shrink-0 items-center gap-2 rounded-xl bg-white/70 p-1.5"><span className="hidden px-2 text-[11px] font-semibold text-[#9a8a7a] sm:inline">Выбери героя</span><button onClick={() => setMascot("luna")} aria-label="Выбрать Луну" className={`mascot-choice ${mascot === "luna" ? "mascot-choice-active" : ""}`}><span className="mascot-mini mascot-luna"><MascotArt kind="luna" small /></span><span>Луна</span></button><button onClick={() => setMascot("timo")} aria-label="Выбрать Тимо" className={`mascot-choice ${mascot === "timo" ? "mascot-choice-active" : ""}`}><span className="mascot-mini mascot-timo"><MascotArt kind="timo" small /></span><span>Тимо</span></button></div></div><div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#9a8a7a]"><UserRound size={13} className="text-[#ce6e5d]" /> Герой помогает, но не оценивает: здесь важны усилия, а не идеальный результат.</div></section>\n      <div className="grid gap-7'
)
text = text.replace(
    'function WeekView() {',
    '''function MascotArt({ kind, small = false }: { kind: "luna" | "timo"; small?: boolean }) {
  return <svg viewBox="0 0 100 100" className={small ? "h-8 w-8" : "h-20 w-20"} aria-hidden="true"><circle cx="50" cy="52" r="39" fill={kind === "luna" ? "#F7C6B8" : "#C8DCEB"} /><path d={kind === "luna" ? "M25 42 18 18l21 14c7-5 15-7 23-5l20-12-5 26c5 6 7 14 5 24-4 17-19 26-33 26S19 83 17 65c-1-9 2-17 8-23Z" : "M22 39 19 19l20 12c7-4 16-4 23 0l20-12-3 22c8 7 10 19 5 30-6 15-20 22-36 22S19 85 16 70c-3-13 0-24 6-31Z"} fill={kind === "luna" ? "#D97865" : "#7C9AA6"} /><circle cx="38" cy="57" r="4" fill="#17212B" /><circle cx="63" cy="57" r="4" fill="#17212B" /><path d="M43 69c5 5 10 5 15 0" stroke="#17212B" strokeWidth="3" strokeLinecap="round" /><circle cx="50" cy="47" r="3" fill={kind === "luna" ? "#F8D08F" : "#F7D49A"} /><path d={kind === "luna" ? "M22 29 29 34M78 28 70 33" : "M25 31 32 35M75 31 68 35"} stroke="#F7F3EB" strokeWidth="3" strokeLinecap="round" /></svg>;
}

function WeekView() {'''
)
home.write_text(text)

css = Path('/home/ubuntu/firstgrade-compass/client/src/index.css')
styles = css.read_text()
styles += '''
.mascot-panel { position: relative; }
.mascot-avatar { display: grid; height: 92px; width: 92px; flex-shrink: 0; place-items: center; border-radius: 28px; transition: transform 220ms cubic-bezier(.23,1,.32,1); }
.mascot-avatar:hover { transform: rotate(-3deg) translateY(-2px); }
.mascot-luna { background: #f8d8cf; color: #c76255; }
.mascot-timo { background: #d7e8f1; color: #628392; }
.mascot-choice { display: flex; align-items: center; gap: 6px; border-radius: 10px; padding: 5px 8px 5px 5px; color: #8b7b6d; font-size: 11px; font-weight: 700; transition: background 180ms ease, color 180ms ease, transform 180ms ease; }
.mascot-choice:hover { background: #fff; color: #665b52; transform: translateY(-1px); }
.mascot-choice-active { background: #fff; color: #b86151; box-shadow: 0 3px 10px rgba(80,63,39,.08); }
.mascot-mini { display: grid; height: 28px; width: 28px; place-items: center; overflow: hidden; border-radius: 8px; }
@media (max-width: 420px) { .mascot-avatar { height: 72px; width: 72px; border-radius: 22px; } .mascot-avatar svg { height: 64px; width: 64px; } .mascot-panel { padding: 14px; } }
'''
css.write_text(styles)

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Backpack, BookOpen, CalendarDays, Check, ChevronRight, Clock3, Coffee, Flame, Info, Moon, MoreHorizontal, Pencil, Plus, RotateCcw, Sparkles, Star, SunMedium, Timer, Trophy, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import MoodCheckin from "../components/MoodCheckin";
import ParentHint from "../components/ParentHint";
import WeekReport from "../components/WeekReport";
import ChildSwitcher from "../components/ChildSwitcher";

type Task = { id: number; title: string; meta: string; tag: string; tone: "coral" | "blue" | "yellow" | "mint"; done: boolean };
const initialTasks: Task[] = [
  { id: 1, title: "Русский язык", meta: "стр. 24 · упр. 5", tag: "домашнее", tone: "coral", done: true },
  { id: 2, title: "Математика", meta: "стр. 18 · № 6–8", tag: "домашнее", tone: "blue", done: false },
  { id: 3, title: "Читательский дневник", meta: "10 минут чтения", tag: "вечер", tone: "yellow", done: false },
];
const bagItems = [
  { label: "Математика", detail: "учебник + тетрадь", icon: BookOpen, checked: true },
  { label: "Русский язык", detail: "учебник + тетрадь", icon: Pencil, checked: true },
  { label: "Спортивная форма", detail: "не забудь о форме", icon: Sparkles, checked: false },
  { label: "Бутылка воды", detail: "проверить утром", icon: Coffee, checked: false },
];
const dayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт"];

type ChildCase = "nominative" | "genitive" | "dative" | "accusative" | "instrumental" | "prepositional";
const childCaseLabels: Record<ChildCase, string> = { nominative: "Именительный — кто?", genitive: "Родительный — для кого?", dative: "Дательный — кому?", accusative: "Винительный — вижу кого?", instrumental: "Творительный — с кем?", prepositional: "Предложный — о ком?" };
const childCaseOrder: ChildCase[] = ["nominative", "genitive", "dative", "accusative", "instrumental", "prepositional"];
const childNameForms: Record<string, Record<ChildCase, string>> = {
  "миша": { nominative: "Миша", genitive: "Миши", dative: "Мише", accusative: "Мишу", instrumental: "Мишей", prepositional: "Мише" },
  "саша": { nominative: "Саша", genitive: "Саши", dative: "Саше", accusative: "Сашу", instrumental: "Сашей", prepositional: "Саше" },
  "паша": { nominative: "Паша", genitive: "Паши", dative: "Паше", accusative: "Пашу", instrumental: "Пашей", prepositional: "Паше" },
  "маша": { nominative: "Маша", genitive: "Маши", dative: "Маше", accusative: "Машу", instrumental: "Машей", prepositional: "Маше" },
  "даша": { nominative: "Даша", genitive: "Даши", dative: "Даше", accusative: "Дашу", instrumental: "Дашей", prepositional: "Даше" },
  "коля": { nominative: "Коля", genitive: "Коли", dative: "Коле", accusative: "Колу", instrumental: "Колей", prepositional: "Коле" },
  "толя": { nominative: "Толя", genitive: "Толи", dative: "Толе", accusative: "Толю", instrumental: "Толей", prepositional: "Толе" },
  "витя": { nominative: "Витя", genitive: "Вити", dative: "Вите", accusative: "Витю", instrumental: "Витей", prepositional: "Вите" },
  "петя": { nominative: "Петя", genitive: "Пети", dative: "Пете", accusative: "Петю", instrumental: "Петей", prepositional: "Пете" },
  "женя": { nominative: "Женя", genitive: "Жени", dative: "Жене", accusative: "Женю", instrumental: "Женей", prepositional: "Жене" },
  "федя": { nominative: "Федя", genitive: "Феди", dative: "Феде", accusative: "Федю", instrumental: "Федей", prepositional: "Феде" },
  "вася": { nominative: "Вася", genitive: "Васи", dative: "Васе", accusative: "Васю", instrumental: "Васей", prepositional: "Васе" },
  "лёша": { nominative: "Лёша", genitive: "Лёши", dative: "Лёше", accusative: "Лёшу", instrumental: "Лёшей", prepositional: "Лёше" },
  "гриша": { nominative: "Гриша", genitive: "Гриши", dative: "Грише", accusative: "Гришу", instrumental: "Гришей", prepositional: "Грише" },
  "аня": { nominative: "Аня", genitive: "Ани", dative: "Ане", accusative: "Аню", instrumental: "Аней", prepositional: "Ане" },
  "таня": { nominative: "Таня", genitive: "Тани", dative: "Тане", accusative: "Таню", instrumental: "Таней", prepositional: "Тане" },
  "катя": { nominative: "Катя", genitive: "Кати", dative: "Кате", accusative: "Катю", instrumental: "Катей", prepositional: "Кате" },
  "оля": { nominative: "Оля", genitive: "Оли", dative: "Оле", accusative: "Олю", instrumental: "Олей", prepositional: "Оле" },
  "юля": { nominative: "Юля", genitive: "Юли", dative: "Юле", accusative: "Юлю", instrumental: "Юлей", prepositional: "Юле" },
  "лиза": { nominative: "Лиза", genitive: "Лизы", dative: "Лизе", accusative: "Лизу", instrumental: "Лизой", prepositional: "Лизе" },
  "соня": { nominative: "Соня", genitive: "Сони", dative: "Соне", accusative: "Соню", instrumental: "Соней", prepositional: "Соне" },
  "настя": { nominative: "Настя", genitive: "Насти", dative: "Насте", accusative: "Настю", instrumental: "Настей", prepositional: "Насте" },
  "вика": { nominative: "Вика", genitive: "Вики", dative: "Вике", accusative: "Вику", instrumental: "Викой", prepositional: "Вике" },
  "софия": { nominative: "София", genitive: "Софии", dative: "Софии", accusative: "Софию", instrumental: "Софией", prepositional: "Софии" },
  "алиса": { nominative: "Алиса", genitive: "Алисы", dative: "Алисе", accusative: "Алису", instrumental: "Алисой", prepositional: "Алисе" },
  "полина": { nominative: "Полина", genitive: "Полины", dative: "Полине", accusative: "Полину", instrumental: "Полиной", prepositional: "Полине" },
  "илья": { nominative: "Илья", genitive: "Ильи", dative: "Илье", accusative: "Илью", instrumental: "Ильёй", prepositional: "Илье" },
  "егор": { nominative: "Егор", genitive: "Егора", dative: "Егору", accusative: "Егора", instrumental: "Егором", prepositional: "Егоре" },
  "артём": { nominative: "Артём", genitive: "Артёма", dative: "Артёму", accusative: "Артёма", instrumental: "Артёмом", prepositional: "Артёме" },
  "максим": { nominative: "Максим", genitive: "Максима", dative: "Максиму", accusative: "Максима", instrumental: "Максимом", prepositional: "Максиме" },
  "михаил": { nominative: "Михаил", genitive: "Михаила", dative: "Михаилу", accusative: "Михаила", instrumental: "Михаилом", prepositional: "Михаиле" },
  "александр": { nominative: "Александр", genitive: "Александра", dative: "Александру", accusative: "Александра", instrumental: "Александром", prepositional: "Александре" },
  "алексей": { nominative: "Алексей", genitive: "Алексея", dative: "Алексею", accusative: "Алексея", instrumental: "Алексеем", prepositional: "Алексее" },
  "андрей": { nominative: "Андрей", genitive: "Андрея", dative: "Андрею", accusative: "Андрея", instrumental: "Андреем", prepositional: "Андрее" },
  "никита": { nominative: "Никита", genitive: "Никиты", dative: "Никите", accusative: "Никиту", instrumental: "Никитой", prepositional: "Никите" },
  "матвей": { nominative: "Матвей", genitive: "Матвея", dative: "Матвею", accusative: "Матвея", instrumental: "Матвеем", prepositional: "Матвее" },
  "иван": { nominative: "Иван", genitive: "Ивана", dative: "Ивану", accusative: "Ивана", instrumental: "Иваном", prepositional: "Иване" },
  "роман": { nominative: "Роман", genitive: "Романа", dative: "Роману", accusative: "Романа", instrumental: "Романом", prepositional: "Романе" },
  "кирилл": { nominative: "Кирилл", genitive: "Кирилла", dative: "Кириллу", accusative: "Кирилла", instrumental: "Кириллом", prepositional: "Кирилле" },
  "тимофей": { nominative: "Тимофей", genitive: "Тимофея", dative: "Тимофею", accusative: "Тимофея", instrumental: "Тимофеем", prepositional: "Тимофее" },
  "даниил": { nominative: "Даниил", genitive: "Даниила", dative: "Даниилу", accusative: "Даниила", instrumental: "Даниилом", prepositional: "Данииле" },
  "мария": { nominative: "Мария", genitive: "Марии", dative: "Марии", accusative: "Марию", instrumental: "Марией", prepositional: "Марии" },
  "екатерина": { nominative: "Екатерина", genitive: "Екатерины", dative: "Екатерине", accusative: "Екатерину", instrumental: "Екатериной", prepositional: "Екатерине" },
  "валерия": { nominative: "Валерия", genitive: "Валерии", dative: "Валерии", accusative: "Валерию", instrumental: "Валерией", prepositional: "Валерии" },
  "дарья": { nominative: "Дарья", genitive: "Дарьи", dative: "Дарье", accusative: "Дарью", instrumental: "Дарьёй", prepositional: "Дарье" },
  "евгения": { nominative: "Евгения", genitive: "Евгении", dative: "Евгении", accusative: "Евгению", instrumental: "Евгенией", prepositional: "Евгении" },
  "кристина": { nominative: "Кристина", genitive: "Кристины", dative: "Кристине", accusative: "Кристину", instrumental: "Кристиной", prepositional: "Кристине" },
  "амелия": { nominative: "Амелия", genitive: "Амелии", dative: "Амелии", accusative: "Амелию", instrumental: "Амелией", prepositional: "Амелии" },
  "мия": { nominative: "Мия", genitive: "Мии", dative: "Мии", accusative: "Мию", instrumental: "Мией", prepositional: "Мии" },
  "эмилия": { nominative: "Эмилия", genitive: "Эмилии", dative: "Эмилии", accusative: "Эмилию", instrumental: "Эмилией", prepositional: "Эмилии" },
  "ева": { nominative: "Ева", genitive: "Евы", dative: "Еве", accusative: "Еву", instrumental: "Евой", prepositional: "Еве" },
  "элина": { nominative: "Элина", genitive: "Элины", dative: "Элине", accusative: "Элину", instrumental: "Элиной", prepositional: "Элине" },
  "майя": { nominative: "Майя", genitive: "Майи", dative: "Майе", accusative: "Майю", instrumental: "Майей", prepositional: "Майе" },
  "николь": { nominative: "Николь", genitive: "Николь", dative: "Николь", accusative: "Николь", instrumental: "Николь", prepositional: "Николь" },
  "марк": { nominative: "Марк", genitive: "Марка", dative: "Марку", accusative: "Марка", instrumental: "Марком", prepositional: "Марке" },
  "лев": { nominative: "Лев", genitive: "Льва", dative: "Льву", accusative: "Льва", instrumental: "Львом", prepositional: "Льве" },
  "лука": { nominative: "Лука", genitive: "Луки", dative: "Луке", accusative: "Луку", instrumental: "Лукой", prepositional: "Луке" },
  "давид": { nominative: "Давид", genitive: "Давида", dative: "Давиду", accusative: "Давида", instrumental: "Давидом", prepositional: "Давиде" },
  "адам": { nominative: "Адам", genitive: "Адама", dative: "Адаму", accusative: "Адама", instrumental: "Адамом", prepositional: "Адаме" },
  "теодор": { nominative: "Теодор", genitive: "Теодора", dative: "Теодору", accusative: "Теодора", instrumental: "Теодором", prepositional: "Теодоре" },
};

function declineChildName(name: string, grammaticalCase: ChildCase): string {
  const cleanName = name.trim();
  const knownForms = childNameForms[cleanName.toLocaleLowerCase("ru-RU")];
  return knownForms?.[grammaticalCase] ?? cleanName;
}

export default function Home() {
  const role = typeof window !== 'undefined' ? window.localStorage.getItem('school-compass-role') : null;
  const [tasks, setTasks] = useState(initialTasks);
  const [bag, setBag] = useState(bagItems);
  const [activeTab, setActiveTab] = useState<"today" | "week">("today");
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [childName, setChildName] = useState(() => {

    if (typeof window === "undefined") return "Миша";
    return window.localStorage.getItem("school-compass-child-name") ?? "Миша";
  });
  const [childCaseOverrides, setChildCaseOverrides] = useState<Partial<Record<ChildCase, string>>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.localStorage.getItem("school-compass-child-cases") ?? "{}") as Partial<Record<ChildCase, string>>;
    } catch {
      return {};
    }
  });
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [mascot, setMascot] = useState<"luna" | "timo">(() => {
    if (typeof window === "undefined") return "luna";
    const savedMascot = window.localStorage.getItem("school-compass-mascot");
    return savedMascot === "timo" ? "timo" : "luna";
  });
  const [recentlyDone, setRecentlyDone] = useState<number | null>(null);
  const [mascotJoy, setMascotJoy] = useState(false);
  const childInGenitive = childCaseOverrides.genitive?.trim() || declineChildName(childName, "genitive");
  useEffect(() => {
    window.localStorage.setItem("school-compass-mascot", mascot);
  }, [mascot]);
  useEffect(() => {
    window.localStorage.setItem("school-compass-child-name", childName.trim() || "Миша");
  }, [childName]);
  useEffect(() => {
    const normalizedCases = Object.fromEntries(Object.entries(childCaseOverrides).filter(([, value]) => value?.trim())) as Partial<Record<ChildCase, string>>;
    if (Object.keys(normalizedCases).length) window.localStorage.setItem("school-compass-child-cases", JSON.stringify(normalizedCases));
    else window.localStorage.removeItem("school-compass-child-cases");
  }, [childCaseOverrides]);
  const completed = tasks.filter((task) => task.done).length;
  const bagCompleted = bag.filter((item) => item.checked).length;
  const progress = Math.round(((completed + bagCompleted / 2) / (tasks.length + bag.length / 2)) * 100);
  const encouragement = useMemo(() => completed === tasks.length ? "Всё готово — можно выдыхать" : completed > 0 ? "Хороший темп, осталось совсем немного" : "Начнём с одного маленького шага", [completed, tasks.length]);
  const allDone = completed === tasks.length && bagCompleted === bag.length;
  const mascotCopy = mascot === "luna" ? { name: "Луна", role: "лисенок-исследователь", tip: mascotJoy ? "Ура! Предмет собран — коллекция готовности растёт!" : completed === 0 ? "Давай найдём самый лёгкий шаг и начнём с него!" : allDone ? "Миссия вечера выполнена. Ты настоящий исследователь!" : "Классно идёшь. Какой следующий шаг найдём?" } : { name: "Тимо", role: "енот-изобретатель", tip: mascotJoy ? "Отличная сборка! Ещё один предмет на месте!" : completed === 0 ? "Соберём план как конструктор: один шаг за раз!" : allDone ? "Суперсборка завершена. Можно включать режим отдыха!" : "Твоя команда растёт. Проверим следующий пункт?" };
  const stars = completed + bagCompleted;
  const toggleTask = (id: number) => {
    const task = tasks.find((item) => item.id === id);
    const nextDone = !task?.done;
    setTasks((current) => current.map((item) => item.id === id ? { ...item, done: nextDone } : item));
    if (nextDone) {
      setRecentlyDone(id);
      setMascotJoy(true);
      window.setTimeout(() => setMascotJoy(false), 820);
      window.setTimeout(() => setRecentlyDone(null), 620);
      toast.success("Звезда заработана", { description: "Ещё один спокойный шаг готов." });
    }
  };
  const toggleBagItem = (index: number) => {
    const item = bag[index];
    const nextChecked = !item.checked;
    setBag((current) => current.map((currentItem, itemIndex) => itemIndex === index ? { ...currentItem, checked: nextChecked } : currentItem));
    if (nextChecked) {
      setMascotJoy(true);
      window.setTimeout(() => setMascotJoy(false), 820);
    }
    if (item.label === "Спортивная форма") {
      toast(nextChecked ? "Спортивная форма собрана" : "Ты не забыл форму?", { description: nextChecked ? "Отлично, утром всё будет под рукой." : "Проверь, где лежит спортивная форма." });
    }
  };
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((current) => [...current, { id: Date.now(), title: newTask.trim(), meta: "добавлено сегодня", tag: "новое", tone: "mint", done: false }]);
    setNewTask(""); setShowAdd(false); toast.success("Задача добавлена", { description: "Она появится в вечернем плане." });
  };
  const resetDay = () => { setTasks(initialTasks); setBag(bagItems); setReflection(null); toast("План на сегодня восстановлен", { icon: <RotateCcw size={16} /> }); };

  return <div className="min-h-screen bg-[#f6f5f1] text-[#17212b] selection:bg-[#f5c8b9]">
    <header className="sticky top-0 z-20 border-b border-[#dfe3df]/80 bg-[#f6f5f1]/90 backdrop-blur-xl"><div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-10">
      <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#17212b] text-[#f8d08f] shadow-[0_8px_20px_rgba(23,33,43,0.12)]"><CompassMark /></div><div><div className="font-display text-[20px] font-semibold tracking-[-0.04em]">Школьный компас</div><div className="hidden text-[11px] font-medium uppercase tracking-[0.16em] text-[#80908d] sm:block">спокойные вечера · уверенные утра</div></div></div>
      <div className="flex items-center gap-2 sm:gap-4"><div className="hidden items-center gap-2 rounded-full border border-[#dfe3df] bg-white/65 px-3 py-2 text-xs font-medium text-[#60706d] md:flex"><button onClick={() => { window.localStorage.removeItem('school-compass-role'); window.location.reload(); }} className="rounded-full bg-white/80 px-3 py-1.5 text-[11px] font-semibold text-[#665b52] shadow-sm transition-colors hover:bg-white">Сменить роль</button><span className="h-2 w-2 rounded-full bg-[#7ebb9d] shadow-[0_0_0_4px_#e3f3e9]" />Сохраняется на этом устройстве</div><button className="grid h-10 w-10 place-items-center rounded-full border border-[#dfe3df] bg-white/70 text-[#5f706c] transition hover:-translate-y-0.5 hover:bg-white" aria-label="Дополнительные действия" onClick={() => toast("Подсказка", { description: "Все данные остаются только в вашем браузере." })}><MoreHorizontal size={19} /></button><div className="grid h-10 w-10 place-items-center rounded-full bg-[#f3c3b4] font-display font-semibold text-[#783e3a]">АМ</div></div>
    </div></header>
    <main className="mx-auto max-w-[1440px] px-5 pb-16 pt-8 lg:px-10 lg:pt-12">
      {role === 'child' && (<section className="relative mb-8 overflow-hidden rounded-[30px] bg-[#dbeae8] px-6 py-7 shadow-[0_16px_50px_rgba(44,72,74,0.08)] sm:px-10 sm:py-9 lg:px-12 lg:py-10"><div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#f8d08f]/55 blur-2xl" /><div className="absolute bottom-[-85px] right-[22%] h-52 w-52 rounded-full bg-[#f3c3b4]/40 blur-3xl" /><div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end"><div className="max-w-2xl"><div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#5b7978]"><SunMedium size={15} /> Вторник, 7 сентября</div><h1 className="font-display text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[0.95] tracking-[-0.065em] text-[#1e3035]">Вечерний маршрут<br /><span className="text-[#ce6e5d]">для {childInGenitive}</span></h1><p className="mt-5 max-w-lg text-[15px] leading-7 text-[#52706e]">Три маленьких шага сегодня — и утро начнётся без спешки. Выберите только то, что действительно важно.</p></div><div className="relative w-full max-w-[290px] rounded-[24px] border border-white/60 bg-white/65 p-5 backdrop-blur-sm lg:mb-1"><div className="flex items-start justify-between"><span className="text-sm font-semibold text-[#314c50]">Готовность дня</span><span className="font-display text-2xl font-semibold text-[#ce6e5d]">{progress}%</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#c7dcd9]"><div className="h-full rounded-full bg-[#e58e79] transition-all duration-500" style={{ width: `${Math.max(progress, 8)}%` }} /></div><div className="mt-3 flex items-center gap-2 text-xs text-[#5d7777]"><Sparkles size={14} className="text-[#ce6e5d]" /> {encouragement}</div></div></div><div className="paper-lines pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-30" /></section>)}
      {role === 'child' && (<section className="mascot-panel mb-8 overflow-hidden rounded-[26px] border border-[#eadfce] bg-[#fffaf2] p-4 shadow-[0_10px_30px_rgba(28,43,51,0.04)] sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="flex min-w-0 flex-1 items-center gap-4"><div className={`mascot-avatar mascot-${mascot} ${mascotJoy ? "mascot-joy" : ""}`}>   <span className={mascotJoy ? "mascot-joy-run" : ""}><MascotArt kind={mascot} /></span>{mascotJoy && <span className="mascot-sparkle" aria-hidden="true">✦</span>}   </div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[0.15em] text-[#af8960]">Привет, {childName}! · помощник {mascotCopy.name}</span><span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a8a7a]">{mascotCopy.role}</span></div><p className={`mt-1 text-sm font-semibold leading-5 text-[#665b52] ${mascotJoy ? "mascot-tip-pop" : ""}`}>{mascotCopy.tip}</p></div></div><div className="flex shrink-0 items-center gap-2 rounded-xl bg-white/70 p-1.5">
            {role === 'child' && <><span className="hidden px-2 text-[11px] font-semibold text-[#9a8a7a] sm:inline">Выбери героя</span><button onClick={() => setMascot("luna")} aria-label="Выбрать Луну" className={`mascot-choice ${mascot === "luna" ? "mascot-choice-active" : ""}`}><span className="mascot-mini mascot-luna"><MascotArt kind="luna" small /></span><span>Луна</span></button><button onClick={() => setMascot("timo")} aria-label="Выбрать Тимо" className={`mascot-choice ${mascot === "timo" ? "mascot-choice-active" : ""}`}><span className="mascot-mini mascot-timo"><MascotArt kind="timo" small /></span><span>Тимо</span></button></>}</div></div><div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-[#9a8a7a]"><UserRound size={13} className="text-[#ce6e5d]" /> Герой помогает, но не оценивает: здесь важны усилия, а не идеальный результат. <span className="hidden sm:inline">Выбор сохранится на этом устройстве.</span></div></section>)}
      {role === 'parent' && (<div className="mb-6 flex flex-wrap items-center gap-3"><h1 className="font-display text-2xl font-semibold tracking-[-0.04em] text-[#26363b]">Страница {childInGenitive}</h1><span className="rounded-full bg-[#fff1cb] px-3 py-1 text-xs font-bold text-[#9f7b37]">профиль ребёнка</span></div>)}{role === 'parent' && <ChildSwitcher />}<div className="grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)]">
        <section className="rounded-[26px] border border-[#e2e4df] bg-white/80 p-5 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-7"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#82918d]"><Clock3 size={14} /> Сегодня вечером</div><h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">План на вечер</h2><p className="mt-1 text-sm text-[#80908d]">Дела, которые помогают не торопиться.</p></div><div className="flex rounded-xl bg-[#f1f3ef] p-1 text-xs font-semibold text-[#80908d]" role="tablist" aria-label="Период плана"><button role="tab" aria-selected={activeTab === "today"} onClick={() => setActiveTab("today")} className={`relative rounded-lg px-3 py-2 transition duration-200 ${activeTab === "today" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}><span className="relative z-10">Сегодня</span></button><button role="tab" aria-selected={activeTab === "week"} onClick={() => setActiveTab("week")} className={`relative rounded-lg px-3 py-2 transition duration-200 ${activeTab === "week" ? "bg-white text-[#24343b] shadow-sm" : "hover:text-[#24343b]"}`}><span className="relative z-10">Неделя</span></button></div></div>
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-[#f0dfb2] bg-[#fffaf0] px-3 py-2.5 text-xs"><span className="flex items-center gap-1.5 font-bold text-[#806531]"><Flame size={15} className="text-[#e58e79]" /> 2 дня подряд</span><span className="h-3 w-px bg-[#eadfce]" /><span className="flex items-center gap-1.5 font-semibold text-[#9f7b37]"><Star size={15} className="fill-[#f8d08f] text-[#e6b75f]" /> {stars} звёзд</span><span className="ml-auto hidden text-[#9a8a7a] sm:inline">До следующего уровня: {Math.max(0, 6 - stars)} шага</span></div>
          {activeTab === "today" ? <><div className="mt-7 space-y-3">{tasks.map((task) => <button key={task.id} onClick={() => toggleTask(task.id)} className={`task-row group flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(23,33,43,0.07)] ${task.done ? "border-[#cce5d4] bg-[#f3faf5]" : "border-[#e6e8e4] bg-[#fbfcfa]"} ${recentlyDone === task.id ? "task-pop" : ""}`}><span className={`task-check grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition ${task.done ? "border-[#7ebb9d] bg-[#7ebb9d] text-white" : "border-[#cdd6d0] bg-white text-transparent group-hover:border-[#e58e79]"}`}><Check size={16} strokeWidth={3} /></span><span className="min-w-0 flex-1"><span className={`block font-semibold ${task.done ? "text-[#789087] line-through decoration-[#7ebb9d]" : "text-[#26363b]"}`}>{task.title}</span><span className="mt-1 block text-xs text-[#8a9792]">{task.meta}</span></span><span className={`hidden rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:inline-block ${task.tone === "coral" ? "bg-[#fbe5df] text-[#b86151]" : task.tone === "blue" ? "bg-[#e1eff3] text-[#5a8391]" : task.tone === "yellow" ? "bg-[#fff1cb] text-[#9f7b37]" : "bg-[#e3f3e9] text-[#5b9778]"}`}>{task.tag}</span><ChevronRight size={17} className="text-[#b2bdb7] transition group-hover:translate-x-1" /></button>)}</div>{allDone && <div className="celebrate-banner mt-4 flex items-center gap-3 rounded-2xl bg-[#e3f3e9] px-4 py-3 text-sm font-semibold text-[#4d8c6e]"><span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#e6b75f] shadow-sm"><Trophy size={16} /></span><span>Вечерний герой! Всё собрано — можно отдыхать.</span><Star size={18} className="ml-auto fill-[#f8d08f] text-[#e6b75f]" /></div>}<div className="mt-5 flex flex-col gap-3 sm:flex-row">{role !== 'child' && (!showAdd ? <button onClick={() => setShowAdd(true)} className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#c9d5cd] px-4 py-3 text-sm font-semibold text-[#71837c] transition hover:border-[#e58e79] hover:bg-[#fff9f5] hover:text-[#b86151]"><Plus size={17} /> Добавить своё дело</button> : <div className="flex flex-1 gap-2"><input autoFocus value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addTask()} placeholder="Например, подписать тетради" className="min-w-0 flex-1 rounded-xl border border-[#d8dfda] bg-[#fbfcfa] px-4 text-sm outline-none ring-[#e58e79] focus:ring-2" /><button onClick={addTask} className="rounded-xl bg-[#17212b] px-4 text-sm font-semibold text-white transition hover:bg-[#324b51]">Добавить</button><button onClick={() => setShowAdd(false)} className="grid w-10 place-items-center rounded-xl border border-[#d8dfda] text-[#87948f]"><X size={16} /></button></div>)}{role !== 'child' && <button onClick={resetDay} className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-[#8b9892] transition hover:bg-[#f1f3ef] hover:text-[#52645e]"><RotateCcw size={15} /> Сбросить</button>}</div></> : <WeekView />}
        </section>
        <aside className="space-y-7"><section className="rounded-[26px] bg-[#17212b] p-6 text-[#f7f3eb] shadow-[0_14px_40px_rgba(23,33,43,0.15)] sm:p-7"><div className="flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9cb5b0]"><Backpack size={14} /> На завтра</div><h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">Портфель</h2></div><div className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-[#b7d8cf]">{bagCompleted}/{bag.length}</div></div><div className="mt-6 space-y-3">{bag.map((item, index) => { const Icon = item.icon; return <button key={item.label} onClick={() => toggleBagItem(index)} className="flex w-full items-center gap-3 text-left"><span className={`grid h-8 w-8 place-items-center rounded-lg transition ${item.checked ? "bg-[#7ebb9d] text-[#17212b]" : "bg-white/10 text-[#9cb5b0]"}`}>{item.checked ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}</span><span className="min-w-0 flex-1"><span className={`block text-sm font-semibold ${item.checked ? "text-[#8fa49f] line-through" : "text-white"}`}>{item.label}</span><span className="block text-[11px] text-[#879995]">{item.detail}</span></span></button>; })}</div><div className="my-6 h-px bg-white/10" /><button onClick={() => toast.success("Портфель проверен", { description: "Утро уже будет спокойнее." })} className="flex w-full items-center justify-between rounded-xl bg-[#f7d49a] px-4 py-3 text-sm font-bold text-[#503f27] transition hover:bg-[#ffe0af]"><span>Проверить портфель</span><ArrowRight size={17} /></button></section>
          <section className="rounded-[26px] border border-[#e2e4df] bg-white/80 p-6 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-7"><div className="flex items-start justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#82918d]"><CalendarDays size={14} /> Ритм недели</div><h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">Всё под контролем</h2></div><div className="grid h-9 w-9 place-items-center rounded-full bg-[#fff1cb] text-[#9f7b37]"><Timer size={17} /></div></div><div className="mt-6 flex justify-between gap-1">{dayLabels.map((day, index) => <div key={day} className="flex flex-col items-center gap-2 text-[11px] font-semibold text-[#93a09b]"><span>{day}</span><span className={`grid h-8 w-8 place-items-center rounded-full text-xs ${index < 2 ? "bg-[#e3f3e9] text-[#5b9778]" : index === 2 ? "bg-[#fbe5df] text-[#b86151]" : "bg-[#f1f3ef] text-[#a1aca7]"}`}>{index < 2 ? <Check size={14} /> : index === 2 ? <span className="h-1.5 w-1.5 rounded-full bg-[#ce6e5d]" /> : "·"}</span></div>)}</div><div className="mt-5 rounded-xl bg-[#f7f8f5] p-3 text-xs leading-5 text-[#74837e]"><Info size={14} className="mr-1 inline text-[#ce6e5d]" /> Отмечайте только то, что получилось. Ритм важнее идеального плана.</div></section></aside>
      </div>
      
      {role === 'child' && <MoodCheckin />}{role === 'parent' && <ParentHint childName={childName} />}{role === 'parent' && <WeekReport />}<footer className="mt-10 flex flex-col justify-between gap-3 border-t border-[#e2e4df] pt-5 text-xs text-[#9aa59f] sm:flex-row"><span>Школьный компас · ваш тихий помощник в первом классе</span>{role !== 'child' && <button onClick={() => setShowNameEdit(true)} className="flex items-center gap-1.5 font-semibold transition hover:text-[#ce6e5d]"><Pencil size={13} /> Настроить профиль ребёнка</button>}</footer>
    </main>
    {role !== 'child' && showNameEdit && <div className="fixed inset-0 z-30 grid place-items-center bg-[#17212b]/30 p-5 backdrop-blur-sm"><div className="w-full max-w-sm rounded-[26px] bg-[#fffdf9] p-6 shadow-2xl"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#82918d]">Профиль</p><h3 className="mt-2 font-display text-2xl font-semibold">Как зовут ребёнка?</h3></div><button onClick={() => setShowNameEdit(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f3ef] text-[#80908d]"><X size={16} /></button></div><label className="mt-6 block text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Имя ребёнка</label><input value={childName} onChange={(event) => setChildName(event.target.value)} placeholder="Например, Михаил или Мия" className="mt-2 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" /><div className="mt-4 rounded-2xl bg-[#f5f6f2] p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Настроить формы падежей</p><p className="mt-1 text-xs leading-5 text-[#82918d]">Оставьте поле пустым для автоматической формы. Введите только имя, без предлога.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{childCaseOrder.map((caseName) => <label key={caseName} className="block text-xs font-semibold text-[#687873]">{childCaseLabels[caseName]}<input value={childCaseOverrides[caseName] ?? ""} onChange={(event) => setChildCaseOverrides((current) => ({ ...current, [caseName]: event.target.value }))} placeholder={declineChildName(childName, caseName)} className="mt-1 w-full rounded-lg border border-[#d8dfda] bg-white px-3 py-2 text-sm font-normal text-[#17212b] outline-none focus:ring-2 focus:ring-[#f3c3b4]" /></label>)}</div></div><button onClick={() => { setShowNameEdit(false); toast.success("Профиль обновлён"); }} className="mt-4 w-full rounded-xl bg-[#17212b] py-3 text-sm font-bold text-white">Сохранить</button></div></div>}
  </div>;
}

function MascotArt({ kind, small = false }: { kind: "luna" | "timo"; small?: boolean }) {
  const scale = kind === "luna" ? 1.15 : 1.6;
  return (
    <span
      style={{ backgroundColor: kind === "luna" ? "#F7C6B8" : "#C8DCEB" }}
      className={
        (small ? "h-8 w-8" : "h-20 w-20 mascot-alive") +
        " flex items-center justify-center overflow-hidden rounded-full"
      }
    >
      <span
        style={{ transform: `scale(${scale})` }}
        className="flex h-full w-full items-center justify-center"
      >
        <img
          src={`${import.meta.env.BASE_URL}images/${kind}.png`}
          alt={kind === "luna" ? "Луна" : "Тимо"}
          aria-hidden="true"
          className="mascot-cut mascot-blink h-full w-full object-contain"
        />
      </span>
    </span>
  );
}

function WeekView() { return <div className="mt-7 rounded-2xl bg-[#f7f8f5] p-6"><div className="grid gap-3 sm:grid-cols-5">{dayLabels.map((day, index) => <div key={day} className="rounded-xl border border-[#e4e9e3] bg-white p-3"><div className="text-xs font-bold uppercase tracking-[0.15em] text-[#82918d]">{day}</div><div className="mt-4 h-20 rounded-lg bg-[#f1f3ef] p-2 text-xs leading-5 text-[#788982]">{index < 2 ? "Режим выстроен" : index === 2 ? "Сегодня" : "Свободный день"}</div></div>)}</div><p className="mt-5 text-sm text-[#80908d]">Неделя — это ориентир, а не ещё один список, за который нужно себя ругать.</p></div>; }
function CompassMark() { return <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="8.5" stroke="currentColor" strokeWidth="1.5" /><path d="m14.5 7.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" fill="currentColor" /></svg>; }

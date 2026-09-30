import { useEffect, useState } from "react";

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

function ruleDecline(name: string, grammaticalCase: string): string {
  const hush = "жшчщ";
  const vowels = "аеёиоуыэюя";
  const irregular: Record<string, Record<string, string>> = {
    "любовь": { "genitive": "Любови", "dative": "Любови", "accusative": "Любовь", "instrumental": "Любовью", "prepositional": "Любови" },
    "пётр": { "genitive": "Петра", "dative": "Петру", "accusative": "Петра", "instrumental": "Петром", "prepositional": "Петре" },
    "петр": { "genitive": "Петра", "dative": "Петру", "accusative": "Петра", "instrumental": "Петром", "prepositional": "Петре" },
    "лев": { "genitive": "Льва", "dative": "Льву", "accusative": "Льва", "instrumental": "Львом", "prepositional": "Льве" },
  };
  const n = name.trim();
  if (!n) return n;
  const lower = n.toLowerCase();
  const last = lower[lower.length - 1];
  const irr = irregular[lower];
  if (irr && irr[grammaticalCase]) return irr[grammaticalCase];
  if (vowels.includes(last) && last !== "а" && last !== "я") return n;
  if (lower.slice(-2) === "ия") {
    const stem = n.slice(0, -1);
    switch (grammaticalCase) {
      case "genitive": return stem + "и";
      case "dative": return stem + "и";
      case "accusative": return stem + "ю";
      case "instrumental": return stem + "ей";
      case "prepositional": return stem + "и";
      default: return n;
    }
  }
  if (last === "а") {
    const stem = n.slice(0, -1);
    const prev = lower[lower.length - 2];
    const soft = hush.includes(prev) || prev === "ц";
    switch (grammaticalCase) {
      case "genitive": return stem + (soft ? "и" : "ы");
      case "dative": return stem + "е";
      case "accusative": return stem + "у";
      case "instrumental": return stem + (soft ? "ей" : "ой");
      case "prepositional": return stem + "е";
      default: return n;
    }
  }
  if (last === "я") {
    const stem = n.slice(0, -1);
    switch (grammaticalCase) {
      case "genitive": return stem + "и";
      case "dative": return stem + "е";
      case "accusative": return stem + "ю";
      case "instrumental": return stem + "ей";
      case "prepositional": return stem + "е";
      default: return n;
    }
  }
  if (last === "й") {
    const stem = n.slice(0, -1);
    switch (grammaticalCase) {
      case "genitive": return stem + "я";
      case "dative": return stem + "ю";
      case "accusative": return stem + "я";
      case "instrumental": return stem + "ем";
      case "prepositional": return stem + "и";
      default: return n;
    }
  }
  if (last === "ь") {
    const stem = n.slice(0, -1);
    switch (grammaticalCase) {
      case "genitive": return stem + "я";
      case "dative": return stem + "ю";
      case "accusative": return stem + "я";
      case "instrumental": return stem + "ем";
      case "prepositional": return stem + "е";
      default: return n;
    }
  }
  if (/[бвгджзклмнпрстфхцчшщ]/.test(last)) {
    switch (grammaticalCase) {
      case "genitive": return n + "а";
      case "dative": return n + "у";
      case "accusative": return n + "а";
      case "instrumental": return n + "ом";
      case "prepositional": return n + "е";
      default: return n;
    }
  }
  return n;
}

function declineChildName(name: string, grammaticalCase: ChildCase): string {
  const cleanName = name.trim();
  const knownForms = childNameForms[cleanName.toLocaleLowerCase("ru-RU")];
  if (knownForms?.[grammaticalCase]) return knownForms[grammaticalCase];
  return ruleDecline(cleanName, grammaticalCase);
}




type ChildCases = Record<string, string>;
type Child = { id: string; name: string; cases: ChildCases };

const CHILDREN_KEY = "school-compass-children";
const ACTIVE_KEY = "school-compass-active-child";
const NAME_KEY = "school-compass-child-name";
const CASES_KEY = "school-compass-child-cases";

const CASE_ORDER = ["genitive", "dative", "accusative", "instrumental", "prepositional", "nominative"];
const CASE_LABELS: Record<string, string> = {
  genitive: "Родительный — для кого? (Страница …)",
  dative: "Дательный — кому?",
  accusative: "Винительный — вижу кого?",
  instrumental: "Творительный — с кем?",
  prepositional: "Предложный — о ком?",
  nominative: "Именительный — кто?",
};

function loadChildren(): Child[] {
  if (typeof window === "undefined") return [{ id: "c1", name: "Миша", cases: {} }];
  let list: Child[] = [];
  try {
    const raw = window.localStorage.getItem(CHILDREN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) list = parsed;
    }
  } catch {}
  if (list.length === 0) {
    const single = window.localStorage.getItem(NAME_KEY);
    list = [{ id: "c1", name: single || "Миша", cases: {} }];
  }
  list = list.map((c) => ({ id: c.id, name: c.name, cases: c.cases || {} }));
  try {
    const globalCases = JSON.parse(window.localStorage.getItem(CASES_KEY) || "{}");
    if (Object.keys(globalCases).length > 0 && list.length > 0 && Object.keys(list[0].cases).length === 0) {
      list[0].cases = globalCases;
    }
  } catch {}
  return list;
}

function loadActiveId(children: Child[]): string {
  if (typeof window === "undefined") return children[0]?.id || "";
  try {
    const active = window.localStorage.getItem(ACTIVE_KEY);
    if (active && children.some((c) => c.id === active)) return active;
    return children[0]?.id || "";
  } catch {
    return children[0]?.id || "";
  }
}

type Props = {
  onActiveChild: (name: string, cases: ChildCases) => void;
};

export default function ChildrenCard({ onActiveChild }: Props) {
  const [children, setChildren] = useState<Child[]>(() => loadChildren());
  const [activeId, setActiveId] = useState<string>(() => loadActiveId(loadChildren()));
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCases, setEditCases] = useState<ChildCases>({});

  const activeChild = children.find((c) => c.id === activeId);

  useEffect(() => {
    const current = children.find((c) => c.id === activeId);
    if (current) {
      window.localStorage.setItem(NAME_KEY, current.name);
      const cases = current.cases || {};
      if (Object.keys(cases).length > 0) window.localStorage.setItem(CASES_KEY, JSON.stringify(cases));
      else window.localStorage.removeItem(CASES_KEY);
      onActiveChild(current.name, cases);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, children]);

  const persist = (list: Child[], active: string) => {
    setChildren(list);
    setActiveId(active);
    window.localStorage.setItem(CHILDREN_KEY, JSON.stringify(list));
    window.localStorage.setItem(ACTIVE_KEY, active);
  };

  const switchTo = (id: string) => persist(children, id);

  const addChild = () => {
    const name = newName.trim();
    if (!name) return;
    const id = "c" + Date.now();
    persist([...children, { id, name, cases: {} }], id);
    setNewName("");
    setAdding(false);
  };

  const openEdit = () => {
    if (!activeChild) return;
    setEditName(activeChild.name);
    setEditCases({ ...(activeChild.cases || {}) });
    setShowEdit(true);
  };

  const saveEdit = () => {
    if (!activeChild) return;
    const name = editName.trim() || activeChild.name;
    const cases: ChildCases = {};
    for (const [k, v] of Object.entries(editCases)) {
      if (v && v.trim()) cases[k] = v.trim();
    }
    persist(children.map((c) => (c.id === activeId ? { ...c, name, cases } : c)), activeId);
    setShowEdit(false);
  };

  const removeActive = () => {
    if (children.length <= 1 || !activeChild) return;
    const list = children.filter((c) => c.id !== activeId);
    persist(list, list[0].id);
  };

  return (
    <section className="rounded-[26px] border border-[#e2e4df] bg-white/80 p-5 shadow-[0_10px_40px_rgba(28,43,51,0.04)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#82918d]">Семья</div>
          <h2 className="font-display text-2xl font-semibold tracking-[-0.04em]">Дети</h2>
        </div>
        <button onClick={() => setAdding((v) => !v)} className="rounded-xl bg-[#17212b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#324b51]">+ Добавить ребёнка</button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {children.map((child) => (
          <button key={child.id} onClick={() => switchTo(child.id)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${child.id === activeId ? "border-[#e58e79] bg-[#fff9f5] text-[#b86151]" : "border-[#e6e8e4] bg-[#fbfcfa] text-[#665b52] hover:border-[#e58e79]"}`}>
            {child.id === activeId ? "● " : ""}{child.name}
          </button>
        ))}
      </div>

      {activeChild && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#eef0ec] pt-4">
          <span className="flex items-center gap-2 rounded-xl border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Активный:</span>
            <span className="text-sm font-semibold text-[#26363b]">{activeChild.name}</span>
          </span>
          <button onClick={openEdit} className="rounded-xl border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5 text-xs font-semibold text-[#665b52] transition hover:border-[#e58e79]">Имя и падежи</button>
          {children.length > 1 && (
            <button onClick={removeActive} className="rounded-xl border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5 text-xs font-semibold text-[#9aa59f] transition hover:border-[#e58e79] hover:text-[#b86151]">Удалить</button>
          )}
        </div>
      )}

      {adding && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addChild()} placeholder="Имя нового ребёнка" autoFocus className="w-48 rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
          <button onClick={addChild} className="rounded-xl bg-[#17212b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#324b51]">Добавить</button>
          <button onClick={() => { setAdding(false); setNewName(""); }} className="rounded-xl px-3 py-2 text-sm font-semibold text-[#8a9792] hover:text-[#665b52]">Отмена</button>
        </div>
      )}

      {showEdit && activeChild && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-[#17212b]/30 p-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[26px] bg-[#fffdf9] p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#82918d]">Профиль</p>
                <h3 className="mt-2 font-display text-2xl font-semibold">Имя и падежи</h3>
              </div>
              <button onClick={() => setShowEdit(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#f1f3ef] text-[#80908d]">✕</button>
            </div>
            <label className="mt-5 block text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Имя ребёнка</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-2 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
            <div className="mt-4 rounded-2xl bg-[#f5f6f2] p-3">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Формы падежей</p>
              <p className="mt-1 text-xs leading-5 text-[#82918d]">Оставьте поле пустым для автоматической формы. Введите только имя, без предлога.</p>
              <div className="mt-3 grid gap-3">
                {CASE_ORDER.map((c) => (
                  <div key={c}>
                    <label className="text-[11px] font-semibold text-[#82918d]">{CASE_LABELS[c]} <span className="text-[#9aa59f]">(авто: {declineChildName(editName, c as any)})</span></label>
                    <input value={editCases[c] || ""} onChange={(e) => setEditCases({ ...editCases, [c]: e.target.value })} className="mt-1 w-full rounded-xl border border-[#d8dfda] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
                  </div>
                ))}
              </div>
            </div>
            <button onClick={saveEdit} className="mt-5 w-full rounded-xl bg-[#17212b] py-3 text-sm font-bold text-white hover:bg-[#324b51]">Сохранить</button>
          </div>
        </div>
      )}
    </section>
  );
}

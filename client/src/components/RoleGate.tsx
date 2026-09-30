import { useEffect, useState } from "react";
import Home from "../pages/Home";

export default function RoleGate() {
  const [role, setRole] = useState<"parent" | "child" | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("school-compass-role");
    return saved === "parent" || saved === "child" ? saved : null;
  });
  const [stage, setStage] = useState<"choose" | "pin">("choose");
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (role) window.localStorage.setItem("school-compass-role", role);
  }, [role]);

  const enterParent = () => {
    const pin = typeof window !== "undefined" ? window.localStorage.getItem("school-compass-parent-pin") : null;
    if (pin) { setStage("pin"); setPinInput(""); setPinError(false); }
    else { window.localStorage.setItem("school-compass-role", "parent"); setRole("parent"); }
  };

  const enterChild = () => {
    window.localStorage.setItem("school-compass-role", "child");
    setRole("child");
  };

  const submitPin = () => {
    const pin = window.localStorage.getItem("school-compass-parent-pin");
    if (pinInput === pin) { window.localStorage.setItem("school-compass-role", "parent"); setRole("parent"); }
    else setPinError(true);
  };

  if (!role) {
    if (stage === "pin") {
      return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#dbeae8] to-[#f0dfb2] p-5">
          <div className="w-full max-w-sm rounded-[30px] bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(28,43,51,0.12)]">
            <div className="text-5xl">🔒</div>
            <h1 className="mt-3 font-display text-2xl font-bold text-[#3a4f5c]">Вход для родителя</h1>
            <p className="mt-2 text-sm text-[#665b52]">Введите PIN-код, чтобы открыть взрослую оболочку.</p>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={pinInput}
              onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
              onKeyDown={(e) => e.key === "Enter" && submitPin()}
              placeholder="••••"
              className="mt-5 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-[#f3c3b4]"
            />
            {pinError && <p className="mt-2 text-sm font-semibold text-[#b86151]">Неверный PIN. Попробуй ещё раз.</p>}
            <div className="mt-4 grid gap-2">
              <button onClick={submitPin} className="rounded-xl bg-[#17212b] py-3 text-sm font-bold text-white transition hover:bg-[#324b51]">Войти</button>
              <button onClick={() => setStage("choose")} className="rounded-xl py-2 text-sm font-semibold text-[#8a9792] transition hover:text-[#665b52]">Назад</button>
            </div>
            <p className="mt-4 text-[11px] text-[#9aa59f]">PIN хранится только на этом устройстве. Если забудешь — очисти данные сайта в браузере.</p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#dbeae8] to-[#f0dfb2] p-5">
        <div className="w-full max-w-2xl rounded-[30px] bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(28,43,51,0.12)] md:p-12">
          <h1 className="mb-3 font-display text-3xl font-bold text-[#3a4f5c] md:text-4xl">Школьный компас</h1>
          <p className="mb-8 text-lg text-[#665b52]">Кто ты?</p>
          <div className="grid gap-4 md:grid-cols-2">
            <button onClick={enterParent} className="rounded-2xl bg-[#f7c6b8] p-6 shadow-lg transition-all hover:scale-105 hover:bg-[#e8a898]">
              <div className="mb-3 text-6xl">👩</div>
              <div className="font-display text-xl font-bold text-[#3a4f5c]">Я родитель</div>
              <div className="mt-1 text-sm text-[#665b52]">Составляю план, слежу за неделей</div>
            </button>
            <button onClick={enterChild} className="rounded-2xl bg-[#c8dceb] p-6 shadow-lg transition-all hover:scale-105 hover:bg-[#a8c4d8]">
              <div className="mb-3 text-6xl">🧒</div>
              <div className="font-display text-xl font-bold text-[#3a4f5c]">Я ребёнок</div>
              <div className="mt-1 text-sm text-[#665b52]">Выполняю задачи, играю с героем</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Home />;
}

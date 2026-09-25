import { useEffect, useState } from "react";
import Home from "../pages/Home";

export default function RoleGate() {
  const [role, setRole] = useState<"parent" | "child" | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem("school-compass-role");
    return saved === "parent" || saved === "child" ? saved : null;
  });

  useEffect(() => {
    if (role) {
      window.localStorage.setItem("school-compass-role", role);
    }
  }, [role]);

  if (!role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#dbeae8] to-[#f0dfb2] p-5">
        <div className="w-full max-w-2xl rounded-[30px] bg-white/90 p-8 text-center shadow-[0_20px_60px_rgba(28,43,51,0.12)] md:p-12">
          <h1 className="mb-3 text-3xl font-bold text-[#3a4f5c] md:text-4xl">Школьный компас</h1>
          <p className="mb-8 text-lg text-[#665b52]">Кто ты?</p>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setRole("parent")}
              className="rounded-2xl bg-[#f7c6b8] p-6 shadow-lg transition-all hover:scale-105 hover:bg-[#e8a898]"
            >
              <div className="mb-3 text-6xl">👩</div>
              <div className="text-xl font-bold text-[#3a4f5c]">Я родитель</div>
              <div className="mt-1 text-sm text-[#665b52]">Составляю план, слежу за неделей</div>
            </button>
            <button
              onClick={() => setRole("child")}
              className="rounded-2xl bg-[#c8dceb] p-6 shadow-lg transition-all hover:scale-105 hover:bg-[#a8c4d8]"
            >
              <div className="mb-3 text-6xl">🧒</div>
              <div className="text-xl font-bold text-[#3a4f5c]">Я ребёнок</div>
              <div className="mt-1 text-sm text-[#665b52]">Выполняю задачи, играю с героем</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Home />;
}

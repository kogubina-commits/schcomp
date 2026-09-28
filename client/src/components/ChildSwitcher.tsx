import { useState } from "react";

export default function ChildSwitcher() {
  const [pinSet, setPinSet] = useState(() => Boolean(window.localStorage.getItem("school-compass-parent-pin")));
  const [settingPin, setSettingPin] = useState(false);
  const [pinDraft, setPinDraft] = useState("");

  const savePin = () => {
    if (pinDraft.trim().length < 4) return;
    window.localStorage.setItem("school-compass-parent-pin", pinDraft.trim());
    setPinSet(true);
    setSettingPin(false);
    setPinDraft("");
  };

  const removePin = () => {
    window.localStorage.removeItem("school-compass-parent-pin");
    setPinSet(false);
    setSettingPin(false);
  };

  return (
    <section className="mb-6 rounded-[26px] border border-[#e2e4df] bg-white/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Защита входа:</span>
        {pinSet ? (
          <>
            <span className="rounded-full bg-[#e3f3e9] px-3 py-1.5 text-xs font-semibold text-[#4d8c6e]">PIN установлен ✓</span>
            <button onClick={() => { setSettingPin(true); setPinDraft(""); }} className="rounded-full border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5 text-xs font-semibold text-[#665b52] hover:border-[#e58e79]">Сменить PIN</button>
            <button onClick={removePin} className="rounded-full border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5 text-xs font-semibold text-[#9aa59f] hover:border-[#e58e79]">Убрать PIN</button>
          </>
        ) : (
          <button onClick={() => { setSettingPin(true); setPinDraft(""); }} className="rounded-full border border-[#e6e8e4] bg-[#fbfcfa] px-3 py-1.5 text-xs font-semibold text-[#665b52] hover:border-[#e58e79]">Поставить PIN на вход родителя</button>
        )}
        {settingPin && (
          <span className="flex items-center gap-2">
            <input type="password" inputMode="numeric" value={pinDraft} onChange={(e) => setPinDraft(e.target.value)} placeholder="Новый PIN (4+ цифры)" className="w-40 rounded-xl border border-[#d8dfda] bg-white px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-[#f3c3b4]" />
            <button onClick={savePin} className="rounded-xl bg-[#17212b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#324b51]">Сохранить</button>
          </span>
        )}
        <span className="text-[11px] text-[#9aa59f]">Ребёнок не сможет открыть взрослую оболочку без PIN.</span>
      </div>
    </section>
  );
}

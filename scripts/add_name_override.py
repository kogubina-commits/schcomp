from pathlib import Path

path = Path('/home/ubuntu/firstgrade-compass/client/src/pages/Home.tsx')
text = path.read_text()
old = '<input value={childName} onChange={(event) => setChildName(event.target.value)} className="mt-6 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" /><button onClick={() => { setShowNameEdit(false); toast.success("Профиль обновлён"); }} className="mt-4 w-full rounded-xl bg-[#17212b] py-3 text-sm font-bold text-white">Сохранить</button>'
new = '<label className="mt-6 block text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Имя ребёнка</label><input value={childName} onChange={(event) => setChildName(event.target.value)} placeholder="Например, Михаил или Мия" className="mt-2 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" /><label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Форма для «для …»</label><input value={childGenitiveOverride} onChange={(event) => setChildGenitiveOverride(event.target.value)} placeholder={`Автоматически: для ${declineChildName(childName, "genitive") || "…"}`} className="mt-2 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" /><p className="mt-2 text-xs leading-5 text-[#82918d]">Если форма определилась неверно, напишите её вручную. Например: «для Мии», «для Луки».</p><button onClick={() => { setShowNameEdit(false); toast.success("Профиль обновлён"); }} className="mt-4 w-full rounded-xl bg-[#17212b] py-3 text-sm font-bold text-white">Сохранить</button>'
if old not in text:
    raise SystemExit('profile input block not found')
path.write_text(text.replace(old, new, 1))

from pathlib import Path

path = Path('/home/ubuntu/firstgrade-compass/client/src/pages/Home.tsx')
text = path.read_text()
old = '<label className="mt-4 block text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Форма для «для …»</label><input value={childGenitiveOverride} onChange={(event) => setChildGenitiveOverride(event.target.value)} placeholder={`Автоматически: для ${declineChildName(childName, "genitive") || "…"}`} className="mt-2 w-full rounded-xl border border-[#d8dfda] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[#f3c3b4]" /><p className="mt-2 text-xs leading-5 text-[#82918d]">Если форма определилась неверно, напишите её вручную. Например: «для Мии», «для Луки».</p>'
new = '<div className="mt-4 rounded-2xl bg-[#f5f6f2] p-3"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#82918d]">Настроить формы падежей</p><p className="mt-1 text-xs leading-5 text-[#82918d]">Оставьте поле пустым для автоматической формы. Введите только имя, без предлога.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{childCaseOrder.map((caseName) => <label key={caseName} className="block text-xs font-semibold text-[#687873]">{childCaseLabels[caseName]}<input value={childCaseOverrides[caseName] ?? ""} onChange={(event) => setChildCaseOverrides((current) => ({ ...current, [caseName]: event.target.value }))} placeholder={declineChildName(childName, caseName)} className="mt-1 w-full rounded-lg border border-[#d8dfda] bg-white px-3 py-2 text-sm font-normal text-[#17212b] outline-none focus:ring-2 focus:ring-[#f3c3b4]" /></label>)}</div></div>'
if old not in text:
    raise SystemExit('old case editor block not found')
path.write_text(text.replace(old, new, 1))

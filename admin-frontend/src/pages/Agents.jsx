export default function Agents() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">座席表现</h1>
        <p className="text-sm text-slate-500">
          后续将从 Supabase 的 `agents` 表聚合统计座席拨打、接通、成功等关键指标。
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500">
        <p className="font-medium text-slate-700">计划中的能力</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>实时显示在线座席、状态与接通情况。</li>
          <li>提供排行视图，支持按接通率 / 成功单排序。</li>
          <li>展示单座席的趋势和质检提醒。</li>
        </ul>
      </div>
    </div>
  )
}

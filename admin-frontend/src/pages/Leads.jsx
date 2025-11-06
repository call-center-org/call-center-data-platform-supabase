export default function Leads() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">线索列表</h1>
        <p className="text-sm text-slate-500">
          后续会通过 Supabase 实时展示电话线索数据，并支持筛选、排序与批量操作。
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500">
        <p className="font-medium text-slate-700">开发计划（TODO #6）</p>
        <ol className="mt-3 list-decimal space-y-1 pl-4">
          <li>使用 React Query + Supabase SDK 读取 `leads` 表。</li>
          <li>实现筛选条件（意向等级、是否加微信、是否成功单等）。</li>
          <li>支持分页、导出与快捷操作（标记跟进、同步到任务等）。</li>
        </ol>
      </div>
    </div>
  )
}

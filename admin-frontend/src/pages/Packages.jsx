export default function Packages() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">数据包管理</h1>
        <p className="text-sm text-slate-500">
          这里将展示来自 Supabase 的 `lead_packages` 数据，并提供层级分配、进度追踪与新包登记能力。
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">开发内容规划</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>展示数据包基础信息与进度条。</li>
            <li>筛选条件：数据来源、行业、地区、包类型。</li>
            <li>新增 / 编辑数据包的表单流程。</li>
            <li>层级视图，支持 N/O/P 层快速切换。</li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">与 Supabase 数据表映射</h2>
          <dl className="mt-3 space-y-2 text-sm text-slate-600">
            <div>
              <dt className="font-medium text-slate-700">数据源</dt>
              <dd>`lead_packages`</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">依赖关系</dt>
              <dd>与 `dial_tasks`、`leads` 表通过包 ID 关联。</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-700">后续计划</dt>
              <dd>新增包层级历史、任务映射、复拨建议等模块。</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

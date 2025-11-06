const summaryCards = [
  { title: '今日接通率', value: '82%', trend: '+3.5%', trendLabel: '较昨日' },
  { title: '待跟进线索', value: '128', trend: '-12', trendLabel: '较上周' },
  { title: '本周采买成本', value: '¥ 18,420', trend: '+5.8%', trendLabel: '预算使用率' },
  { title: '有效数据包', value: '24', trend: '+2', trendLabel: '新增' },
]

const sections = [
  {
    title: '快捷入口',
    items: [
      '线索导入和清洗',
      '数据包层级分配',
      '任务拨打进度',
      '供需预测计算器',
    ],
  },
  {
    title: '实时关注',
    items: [
      '座席状态监控',
      '高意向线索追踪',
      '标签命中热力图',
      '失败原因趋势',
    ],
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">数据看板</h1>
          <p className="text-sm text-slate-500">
            汇总展示线索、任务、成本等核心指标，帮助团队快速掌握业务状态。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {card.value}
              </p>
              <p className="mt-3 text-xs text-slate-400">
                <span className="font-medium text-emerald-600">{card.trend}</span>
                <span className="ml-1">{card.trendLabel}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {sections.map((section) => (
          <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {section.items.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-slate-100 p-6 text-sm text-slate-500">
        <p className="font-medium text-slate-700">下一步</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>接入 Supabase 实时数据源，替换示例数据。</li>
          <li>配置跨服务共享的统计接口。</li>
          <li>在此模块加入常用操作快捷卡片。</li>
        </ul>
      </section>
    </div>
  )
}

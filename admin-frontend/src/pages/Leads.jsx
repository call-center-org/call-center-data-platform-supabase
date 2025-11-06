import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient.js'

const fetchLeads = async ({ queryKey }) => {
  const [, filters] = queryKey
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('latest_call_time', { ascending: false, nullsFirst: false })

  if (filters.search) {
    query = query.ilike('phone', `%${filters.search}%`)
  }

  if (filters.isSuccess !== 'all') {
    query = query.eq('is_success', filters.isSuccess === 'success')
  }

  if (filters.hasWechat !== 'all') {
    query = query.eq('has_wechat', filters.hasWechat === 'true')
  }

  const { data, error, count } = await query
  if (error) throw error

  return { data: data ?? [], count: count ?? 0 }
}

const summaryFormatter = new Intl.NumberFormat('zh-CN')
const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default function Leads() {
  const [filters, setFilters] = useState({
    search: '',
    isSuccess: 'all',
    hasWechat: 'all',
  })

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['leads', filters],
    queryFn: fetchLeads,
    keepPreviousData: true,
  })

  const stats = useMemo(() => {
    const list = data?.data ?? []
    const total = data?.count ?? 0
    const success = list.filter((item) => item.is_success).length
    const withWechat = list.filter((item) => item.has_wechat).length
    const contactRate = total ? Math.round((success / total) * 100) : 0

    return [
      {
        title: '线索总数',
        value: summaryFormatter.format(total),
        description: '当前筛选条件下的线索数量',
      },
      {
        title: '成功单',
        value: summaryFormatter.format(success),
        description: 'is_success = true',
      },
      {
        title: '已加微信',
        value: summaryFormatter.format(withWechat),
        description: 'has_wechat = true',
      },
      {
        title: '成功率',
        value: `${contactRate}%`,
        description: '成功单 / 线索总数',
      },
    ]
  }, [data])

  const leads = data?.data ?? []

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">线索列表</h1>
            <p className="text-sm text-slate-500">
              所有数据均直接来自 Supabase REST API，无需自建后端。
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
          >
            {isFetching ? '刷新中…' : '手动刷新'}
          </button>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Supabase 请求失败：{error.message}
          </div>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-3 text-xs text-slate-400">{card.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs font-medium text-slate-500" htmlFor="search">
              按电话号码搜索
            </label>
            <input
              id="search"
              type="search"
              placeholder="输入电话号码，例如 13800138001"
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500" htmlFor="isSuccess">
              成功单
            </label>
            <select
              id="isSuccess"
              value={filters.isSuccess}
              onChange={(event) => setFilters((prev) => ({ ...prev, isSuccess: event.target.value }))}
              className="mt-1 inline-flex w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">全部</option>
              <option value="success">仅成功单</option>
              <option value="pending">仅未成功</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500" htmlFor="hasWechat">
              是否已加微信
            </label>
            <select
              id="hasWechat"
              value={filters.hasWechat}
              onChange={(event) => setFilters((prev) => ({ ...prev, hasWechat: event.target.value }))}
              className="mt-1 inline-flex w-40 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">全部</option>
              <option value="true">已加微信</option>
              <option value="false">未加微信</option>
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left">电话</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">拨打/接通</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">最新通话</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">意向等级</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">成功单</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">已加微信</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    正在从 Supabase 加载数据…
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                    暂无数据，尝试调整筛选条件。
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const callStats = `${lead.total_call_count ?? 0} / ${lead.connected_call_count ?? 0}`
                  const latestCall = lead.latest_call_time
                    ? dateFormatter.format(new Date(lead.latest_call_time))
                    : '—'

                  return (
                    <tr key={lead.phone} className="hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                        {lead.phone}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">{callStats}</td>
                      <td className="whitespace-nowrap px-4 py-3">{latestCall}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {lead.intention_level || '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            lead.is_success
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-slate-100 text-slate-500',
                          ].join(' ')}
                        >
                          {lead.is_success ? '成功' : '未成功'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <span
                          className={[
                            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                            lead.has_wechat
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'bg-slate-100 text-slate-500',
                          ].join(' ')}
                        >
                          {lead.has_wechat ? '已加微信' : '未加微信'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

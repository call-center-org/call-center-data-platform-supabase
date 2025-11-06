import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabaseClient.js'

const fetchLeads = async ({ queryKey }) => {
  const [, filters] = queryKey
  let query = supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .order('latest_call_time', { ascending: false, nullsFirst: true })

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

const initialForm = {
  phone: '',
  intention_level: '',
  detail: '',
}

export default function Leads() {
  const [filters, setFilters] = useState({
    search: '',
    isSuccess: 'all',
    hasWechat: 'all',
  })
  const [formData, setFormData] = useState(initialForm)
  const [toast, setToast] = useState(null)

  const queryClient = useQueryClient()

  const queryResult = useQuery({
    queryKey: ['leads', filters],
    queryFn: fetchLeads,
    keepPreviousData: true,
  })

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 2800)
  }

  const createLeadMutation = useMutation({
    mutationFn: async (payload) => {
      const { error } = await supabase.from('leads').insert(payload)
      if (error) throw error
    },
    onSuccess: () => {
      showToast('success', '线索已创建')
      setFormData(initialForm)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (error) => {
      showToast('error', `创建失败：${error.message}`)
    },
  })

  const toggleSuccessMutation = useMutation({
    mutationFn: async ({ phone, next }) => {
      const { error } = await supabase
        .from('leads')
        .update({ is_success: next })
        .eq('phone', phone)
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      showToast('success', variables.next ? '已标记为成功单' : '已取消成功单')
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (error) => {
      showToast('error', `更新失败：${error.message}`)
    },
  })

  const toggleWechatMutation = useMutation({
    mutationFn: async ({ phone, next }) => {
      const { error } = await supabase
        .from('leads')
        .update({ has_wechat: next })
        .eq('phone', phone)
      if (error) throw error
    },
    onSuccess: (_, variables) => {
      showToast('success', variables.next ? '已标记为已加微信' : '已取消微信标记')
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (error) => {
      showToast('error', `更新失败：${error.message}`)
    },
  })

  const deleteLeadMutation = useMutation({
    mutationFn: async (phone) => {
      const { error } = await supabase.from('leads').delete().eq('phone', phone)
      if (error) throw error
    },
    onSuccess: (_, phone) => {
      showToast('success', `已删除线索 ${phone}`)
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
    onError: (error) => {
      showToast('error', `删除失败：${error.message}`)
    },
  })

  const stats = useMemo(() => {
    const list = queryResult.data?.data ?? []
    const total = queryResult.data?.count ?? 0
    const success = list.filter((item) => item.is_success).length
    const withWechat = list.filter((item) => item.has_wechat).length
    const contactRate = total ? Math.round((success / total) * 100) : 0

    return [
      { title: '线索总数', value: summaryFormatter.format(total), description: '当前筛选条件下' },
      { title: '成功单', value: summaryFormatter.format(success), description: 'is_success = true' },
      { title: '已加微信', value: summaryFormatter.format(withWechat), description: 'has_wechat = true' },
      { title: '成功率', value: `${contactRate}%`, description: '成功单 / 线索总数' },
    ]
  }, [queryResult.data])

  const leads = queryResult.data?.data ?? []
  const isLoading = queryResult.isLoading
  const isFetching = queryResult.isFetching
  const error = queryResult.error

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!formData.phone) {
      showToast('error', '请填写电话号码')
      return
    }
    createLeadMutation.mutate({
      phone: formData.phone,
      intention_level: formData.intention_level || null,
      detail: formData.detail || null,
    })
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">线索列表</h1>
            <p className="text-sm text-slate-500">
              所有操作均直接调用 Supabase REST API，无需自建后台 CRUD。
            </p>
          </div>
          <button
            type="button"
            onClick={() => queryResult.refetch()}
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
        {toast && (
          <div
            className={`rounded-md px-4 py-3 text-sm ${
              toast.type === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border border-red-200 bg-red-50 text-red-700'
            }`}
          >
            {toast.message}
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
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-medium text-slate-500" htmlFor="new-phone">
              电话号码 *
            </label>
            <input
              id="new-phone"
              type="tel"
              required
              maxLength={20}
              value={formData.phone}
              onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
              placeholder="例如：13800138006"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500" htmlFor="new-intention">
              意向等级（选填）
            </label>
            <input
              id="new-intention"
              type="text"
              value={formData.intention_level}
              onChange={(event) => setFormData((prev) => ({ ...prev, intention_level: event.target.value }))}
              placeholder="例如：A / B / C"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="md:col-span-1 md:flex md:items-end">
            <button
              type="submit"
              disabled={createLeadMutation.isLoading}
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {createLeadMutation.isLoading ? '创建中…' : '新建线索'}
            </button>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-slate-500" htmlFor="new-detail">
              备注（选填）
            </label>
            <textarea
              id="new-detail"
              rows={2}
              value={formData.detail}
              onChange={(event) => setFormData((prev) => ({ ...prev, detail: event.target.value }))}
              placeholder="可记录首访备注、来源说明等"
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>
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
                <th className="whitespace-nowrap px-4 py-3 text-left">标签</th>
                <th className="whitespace-nowrap px-4 py-3 text-left">操作</th>
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
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {lead.tags ? JSON.stringify(lead.tags) : '—'}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              toggleSuccessMutation.mutate({
                                phone: lead.phone,
                                next: !lead.is_success,
                              })
                            }
                            className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            {lead.is_success ? '取消成功单' : '标记成功单'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              toggleWechatMutation.mutate({
                                phone: lead.phone,
                                next: !lead.has_wechat,
                              })
                            }
                            className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
                          >
                            {lead.has_wechat ? '取消微信' : '标记已加微信'}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              deleteLeadMutation.mutate(lead.phone)
                            }
                            className="inline-flex items-center rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                          >
                            删除
                          </button>
                        </div>
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

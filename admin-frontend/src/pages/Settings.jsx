export default function Settings() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">系统设置</h1>
        <p className="text-sm text-slate-500">
          集中配置 Supabase 访问密钥、微服务回调、管理员账号等信息。
        </p>
      </header>

      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        <p className="font-medium text-slate-700">当前进度</p>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>读取环境变量 `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`。</li>
          <li>后续新增表单用于配置 Service Role Key 等敏感信息（仅内部使用）。</li>
          <li>在 Supabase Edge Functions 发布后，可在此绑定 Webhook。</li>
        </ul>
      </div>
    </div>
  )
}

import { NavLink } from 'react-router-dom'

const navigation = [
  { label: '总览', to: '/' },
  { label: '线索', to: '/leads' },
  { label: '数据包', to: '/packages' },
  { label: '座席', to: '/agents' },
  { label: '设置', to: '/settings' },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white/90 backdrop-blur lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold text-white">
          CC
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Call Center</p>
          <p className="text-xs text-slate-500">Data Platform</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 px-4 py-5 text-xs text-slate-400">
        Supabase 数据平台<br />
        版本 0.1.0
      </div>
    </aside>
  )
}

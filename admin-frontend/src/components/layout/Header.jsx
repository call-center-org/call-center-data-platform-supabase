import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: '总览', to: '/' },
  { label: '线索', to: '/leads' },
  { label: '数据包', to: '/packages' },
  { label: '座席', to: '/agents' },
  { label: '设置', to: '/settings' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div>
            <p className="text-sm font-semibold text-slate-900">Call Center</p>
            <p className="text-xs text-slate-500">Data Platform</p>
          </div>
        </div>

        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 lg:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'text-indigo-600' : 'hover:text-slate-900'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 text-sm text-slate-500">
          <span className="hidden sm:inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
            生产环境
          </span>
          <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 lg:hidden">
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2',
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'hover:bg-slate-100 hover:text-slate-900',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

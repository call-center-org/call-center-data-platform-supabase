import { Sidebar } from './Sidebar'
import { Header } from './Header'

export function Layout({ children }) {
  return (
    <div className="flex h-full min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}

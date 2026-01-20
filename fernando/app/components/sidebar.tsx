"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Overview", href: "/dashboards", icon: "🏠" },
  { label: "API Playground", href: "/playground", icon: "◇" },
  { label: "Use Cases", href: "/use-cases", icon: "✦" },
  { label: "Billing", href: "/billing", icon: "💳" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
  { label: "Certification", href: "/certification", icon: "🏅" },
];

const externalLinks = [
  { label: "Documentation", href: "https://docs.example.com", icon: "📄" },
  { label: "Api Key", href: "https://mcp.example.com", icon: "🔗" },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-40 flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-all duration-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 ${
          isOpen ? "left-[216px]" : "left-4"
        }`}
        title={isOpen ? "Hide sidebar" : "Show sidebar"}
      >
        <svg
          className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "" : "rotate-180"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-30 flex h-screen w-60 flex-col border-r border-zinc-200 bg-white transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 px-5">
          <span className="text-2xl">↗</span>
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Api Key
          </span>
        </div>

        {/* Workspace Selector */}
        <div className="px-3">
          <button className="flex w-full items-center justify-between rounded-lg bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 px-3 py-2.5 text-left text-sm font-medium text-blue-700 transition hover:from-blue-500/20 hover:via-indigo-500/20 hover:to-purple-500/20 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xs font-bold text-white">
                P
              </span>
              <span>Personal</span>
            </div>
            <svg
              className="h-4 w-4 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}

          {/* External links with icon */}
          <div className="mt-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
            {externalLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </div>
                <svg
                  className="h-3.5 w-3.5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-zinc-200 px-3 py-4 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                  FA
                </div>
              </div>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Fernando Assumpção
              </span>
            </div>
            <button
              className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              title="Sign out"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

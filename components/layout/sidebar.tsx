"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AtentoLogo } from "@/components/atento-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout } from "@/lib/auth";
import {
  Users, Plug2, LogOut, Menu, X, BarChart3, Phone, MessageSquare, FileText, BookOpen
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
  customNav?: NavItem[];
}

type Role = "admin" | "supervisor" | "agente";
type NavItem = { href: string; label: string; icon: any };

const COLLAPSE_KEY = "sidebar:collapsed";

const ROLE_BASE: Record<Role, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  agente: "/agente",
};

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  admin: [
    { href: `${ROLE_BASE.admin}/usuarios`,      label: "Usuarios",      icon: Users },
    { href: `${ROLE_BASE.admin}/integraciones`, label: "Integraciones", icon: Plug2 },
  ],
  supervisor: [
    { href: `${ROLE_BASE.supervisor}/dashboard`,  label: "Dashboard",  icon: BarChart3 },
    { href: `${ROLE_BASE.supervisor}/agentes`,    label: "Agentes",    icon: Users },
    { href: `${ROLE_BASE.supervisor}/llamadas`,   label: "Llamadas",   icon: Phone },
    { href: `${ROLE_BASE.supervisor}/reportes`,   label: "Reportes",   icon: FileText },
    { href: `${ROLE_BASE.supervisor}/biblioteca`, label: "Biblioteca", icon: BookOpen },
  ],
  agente: [
    { href: `${ROLE_BASE.agente}/dashboard`,         label: "Dashboard",         icon: BarChart3 },
    { href: `${ROLE_BASE.agente}/entrenamiento`,     label: "Entrenamiento",     icon: Phone },
    { href: `${ROLE_BASE.agente}/mis-llamadas`,      label: "Mis Llamadas",      icon: FileText },
    { href: `${ROLE_BASE.agente}/feedback`,          label: "Feedback",          icon: MessageSquare },
  ],
};

export function Sidebar({ className, customNav }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = getCurrentUser() as null | { role?: Role };
  if (!user?.role) return null;

  const [isCollapsed, setIsCollapsed] = useState(false);
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(COLLAPSE_KEY) : null;
    if (raw) setIsCollapsed(raw === "1");
  }, []);
  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      if (typeof window !== "undefined") localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const items = useMemo<NavItem[]>(() => {
    if (customNav?.length) return customNav;
    return NAV_BY_ROLE[user.role as Role] ?? [];
  }, [customNav, user.role]);

  const Item = ({ href, label, icon: Icon }: NavItem) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    const pill = (
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-full px-3 py-2 transition-colors",
          active
            ? "bg-white/12 text-white ring-1 ring-inset ring-white/25 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-10px_rgba(0,0,0,0.55)]"
            : "text-[--text-muted] hover:bg-white/8"
        )}
        aria-current={active ? "page" : undefined}
      >
        <div
          className={cn(
            "grid place-items-center rounded-full size-6 shrink-0 transition-colors",
            active ? "bg-white/20" : "bg-white/10 group-hover:bg-white/15"
          )}
        >
          <Icon aria-hidden className="size-4 text-[--sidebar-icon]" />
        </div>
        {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
      </div>
    );

    return (
      <Link href={href} className="block" aria-label={label}>
        {isCollapsed ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>{pill}</TooltipTrigger>
              <TooltipContent side="right" className="text-xs">{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : pill}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-brand-gradient text-white h-screen sticky top-0",
        "border-r border-white/10",
        "transition-[width] duration-300",
        isCollapsed ? "w-20" : "w-72",
        "px-3 py-4",
        "flex flex-col",
        className
      )}
      role="navigation"
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        {!isCollapsed && <AtentoLogo variant="full" className="h-7" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="text-white/80 hover:text-white hover:bg-white/10"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {isCollapsed ? <Menu className="size-5" /> : <X className="size-5" />}
        </Button>
      </div>

      {/* Nav: se adapta al rol (admin 2, otros 4+) */}
      <nav className={cn("mt-4 space-y-2", isCollapsed && "mx-1")}>
        {items.map((it) => <Item key={it.href} {...it} />)}
      </nav>

      <div className="flex-1" />

      {/* Footer: Cerrar Sesión */}
      <div className="mt-auto pt-4 pb-6 border-t border-white/10">
        <button
          onClick={() => { logout(); router.push("/login"); }}
          className={cn(
            "group w-full flex items-center gap-3 rounded-full px-3 py-2 text-left",
            "text-[--text-muted] hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-white/40"
          )}
          aria-label="Cerrar sesión"
        >
          <div className="grid place-items-center rounded-full size-8 bg-white/10 group-hover:bg-white/15">
            <LogOut className="size-4 text-[--sidebar-icon]" aria-hidden />
          </div>
          {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AtentoLogo } from "@/components/atento-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCurrentUser, logout, User } from "@/lib/auth"; // Importa el tipo User de tu auth.ts
import {
  Users,
  Plug2,
  LogOut,
  ChevronLeft, // Ícono más adecuado para colapsar
  BarChart3,
  Phone,
  MessageSquare,
  FileText,
  BookOpen,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Definición de tipos
interface SidebarProps {
  className?: string;
  customNav?: NavItem[];
}
type Role = "admin" | "supervisor" | "agente";
type NavItem = { href: string; label: string; icon: React.ElementType };

const COLLAPSE_KEY = "sidebar:collapsed";

// Rutas base por rol para mantener el código limpio
const ROLE_BASE: Record<Role, string> = {
  admin: "/admin",
  supervisor: "/supervisor",
  agente: "/agente",
};

// Menús de navegación por rol
const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  admin: [
    { href: `${ROLE_BASE.admin}/usuarios`, label: "Usuarios", icon: Users },
    { href: `${ROLE_BASE.admin}/integraciones`, label: "Integraciones", icon: Plug2 },
  ],
  supervisor: [
    { href: `${ROLE_BASE.supervisor}/dashboard`, label: "Dashboard", icon: BarChart3 },
    { href: `${ROLE_BASE.supervisor}/agentes`, label: "Agentes", icon: Users },
    { href: `${ROLE_BASE.supervisor}/llamadas`, label: "Llamadas", icon: Phone },
    { href: `${ROLE_BASE.supervisor}/reportes`, label: "Reportes", icon: FileText },
    { href: `${ROLE_BASE.supervisor}/biblioteca`, label: "Biblioteca", icon: BookOpen },
  ],
  agente: [
    { href: `${ROLE_BASE.agente}/dashboard`, label: "Dashboard", icon: BarChart3 },
    { href: `${ROLE_BASE.agente}/registrar-llamada`, label: "Registrar llamadas", icon: Phone },
    { href: `${ROLE_BASE.agente}/mis-llamadas`, label: "Mis Llamadas", icon: FileText },
    { href: `${ROLE_BASE.agente}/feedback`, label: "Feedback", icon: MessageSquare },
  ],
};

// Mapa para normalizar los roles que vienen del backend
const ROLE_MAP: Record<string, Role> = {
  ADMIN: "admin",
  SUPERVISOR: "supervisor",
  LEARNER: "agente",
};

export function Sidebar({ className, customNav }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // MEJORA: Usar estado para el usuario para evitar errores de renderizado
  const [user, setUser] = useState<User | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Carga el estado de colapso desde localStorage
    const collapsedState = localStorage.getItem(COLLAPSE_KEY);
    setIsCollapsed(collapsedState === "1");

    // Carga los datos del usuario de forma segura en el cliente
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  const toggleCollapsed = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  // El menú de navegación se calcula de forma segura
  const items = useMemo<NavItem[]>(() => {
    if (customNav?.length) return customNav;
    // Si no hay usuario, no hay menú
    if (!user) return []; 

    // Normaliza el rol de forma segura
    const normalizedRole = user.role_name?.toUpperCase() ?? "";
    const mappedRole = ROLE_MAP[normalizedRole] ?? "agente"; // Fallback seguro a 'agente'
    
    return NAV_BY_ROLE[mappedRole] || [];
  }, [customNav, user]);

  // Si el usuario no se ha cargado, muestra un esqueleto o nada para evitar errores
  if (!user) {
    return (
      <aside className={cn("bg-brand-gradient h-screen sticky top-0 transition-[width] duration-300", isCollapsed ? "w-20" : "w-72", className)}>
        {/* Aquí podrías poner un componente de esqueleto de carga */}
      </aside>
    );
  }

  const Item = ({ href, label, icon: Icon }: NavItem) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    
    const content = (
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
          active
            ? "bg-white/15 text-white shadow-inner shadow-white/10"
            : "text-text-muted hover:bg-white/10 hover:text-white"
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon aria-hidden className="size-5 text-sidebar-icon" />
        {!isCollapsed && <span className="text-sm font-medium truncate">{label}</span>}
      </div>
    );

    return (
      <Link href={href} aria-label={label}>
        {isCollapsed ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>{content}</TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : content}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-brand-gradient text-white h-screen sticky top-0 border-r border-white/10",
        "transition-[width] duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64", // Ancho ajustado para mejor proporción
        "p-4 flex flex-col",
        className
      )}
      aria-label="Sidebar"
    >
      {/* Encabezado con logo y botón de colapso */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        {!isCollapsed ? <AtentoLogo variant="full" className="h-7" /> : <AtentoLogo variant="iso" className="h-8" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="text-white/80 hover:text-white hover:bg-white/10 rounded-full"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {/* MEJORA: Ícono de flecha con animación de rotación */}
          <ChevronLeft className={cn("size-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
        </Button>
      </div>

      {/* Navegación principal */}
      <nav className="mt-6 flex-1 space-y-2">
        {items.map((item) => <Item key={item.href} {...item} />)}
      </nav>

      {/* Footer: Cerrar Sesión */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div
          onClick={() => { logout(); router.push("/login"); }}
          className={cn(
            "group w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left cursor-pointer",
            "text-text-muted transition-colors",
            // MEJORA: Estilo de hover rojo para indicar acción destructiva
            "hover:bg-red-500/10 hover:text-red-300"
          )}
          aria-label="Cerrar sesión"
        >
          <LogOut className="size-5 text-sidebar-icon" aria-hidden />
          {!isCollapsed && <span className="text-sm font-medium">Cerrar Sesión</span>}
        </div>
      </div>
    </aside>
  );
}
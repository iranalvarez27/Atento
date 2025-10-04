"use client";

import { useMemo, useState, FormEvent } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockUsers } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Rol = "agente" | "supervisor" | "admin";
type Usuario = { id: string; name: string; email: string; role: Rol; createdAt?: string };

const recentUsers: Usuario[] = mockUsers.map((u, i) => ({
  ...u,
  createdAt: new Date(Date.now() - (i + 1) * 86400000).toISOString(),
}));

const mockGroups = [
  { id: "g1", name: "Ventas Norte", supervisor: "supervisor.norte@atento.com", agents: 32 },
  { id: "g2", name: "Soporte Prime", supervisor: "soporte.prime@atento.com", agents: 28 },
];

export default function AdminUsuariosPage() {
  const { toast } = useToast();  // 👈 inicializamos hook de toast
  const [query, setQuery] = useState("");
  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);

  const [newUser, setNewUser] = useState<{ name: string; email: string; role: Rol }>({
    name: "",
    email: "",
    role: "agente",
  });

  const supervisors = mockUsers.filter((u) => u.role === "supervisor");
  const agents = mockUsers.filter((u) => u.role === "agente");

  const [newGroup, setNewGroup] = useState<{
    name: string;
    supervisorId: string;
    memberIds: string[];
    memberSearch: string;
  }>({
    name: "",
    supervisorId: supervisors[0]?.id ?? "",
    memberIds: [],
    memberSearch: "",
  });

  const totalAgentes = mockUsers.filter((u) => u.role === "agente").length;
  const totalSupervisores = mockUsers.filter((u) => u.role === "supervisor").length;
  const gruposCreados = mockGroups.length;

  const filteredRecent = useMemo(() => {
    if (!query) return recentUsers.slice(0, 3);
    return recentUsers
      .filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3);
  }, [query]);

  function submitCreateUser(e: FormEvent) {
    e.preventDefault();

    toast({
      title: "Usuario creado",
      description: `Se agregó correctamente a ${newUser.name} (${newUser.role}).`,
    });

    setOpenCreateUser(false);
    setNewUser({ name: "", email: "", role: "agente" });
  }

  function submitCreateGroup(e: FormEvent) {
    e.preventDefault();
    toast({
      title: "Grupo creado",
      description: `El grupo "${newGroup.name}" fue creado con ${newGroup.memberIds.length} agentes.`,
    });

    setOpenCreateGroup(false);
    setNewGroup({
      name: "",
      supervisorId: supervisors[0]?.id ?? "",
      memberIds: [],
      memberSearch: "",
    });
  }

  function handleEditUser(usuario: Usuario) {
    toast({
      title: "Usuario editado",
      description: `Los datos de ${usuario.name} fueron actualizados.`,
    });
  }

  function handleDeleteUser(userId: string) {
    toast({
      title: "Usuario eliminado",
      description: `El usuario con id ${userId} fue eliminado del sistema.`,
    });
  }

  function handleDeleteGroup(groupId: string) {
    toast({
      title: "Grupo eliminado",
      description: `El grupo con id ${groupId} fue eliminado.`,
    });
  }

  const filteredAgents = useMemo(() => {
    const q = newGroup.memberSearch.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
    );
  }, [newGroup.memberSearch, agents]);

  return (
    <DashboardLayout
      title="Gestión de Usuarios"
      subtitle="Administrar usuarios y roles del sistema"
    >
      <div className="space-y-6">
   
        <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="rounded-[28px] bg-[#E7EFF1] p-4 md:p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                { label: "Cantidad de supervisores", value: totalSupervisores },
                { label: "Cantidad de agentes", value: totalAgentes },
                { label: "Grupos creados", value: gruposCreados },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col items-center justify-center text-center py-5 md:py-6",
                    idx !== 2 && "md:border-r md:border-[#9ECDE2]/50"
                  )}
                >
                  <span className="text-[13px] text-neutral-700">{kpi.label}</span>
                  <span className="mt-2 text-3xl md:text-4xl font-bold leading-none text-[#2F1E3E]">
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex md:flex-col gap-3 md:justify-center md:items-stretch">
            {/* Crear Usuario */}
            <Dialog open={openCreateUser} onOpenChange={setOpenCreateUser}>
              <DialogTrigger asChild>
                <Button
                  className="h-11 rounded-[16px] pl-4 pr-5 text-white shadow-sm w-[220px] md:w-full"
                  style={{ backgroundColor: "#3B2748" }}
                >
                  <span className="mr-3 text-lg leading-none">+</span>
                  Crear Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-[#E7EFF1] border-0">
                <DialogHeader>
                  <DialogTitle>Crear Usuario</DialogTitle>
                  <DialogDescription className="text-neutral-700">
                    Completa los datos para crear un usuario.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitCreateUser} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="nu-name">Nombre completo</Label>
                    <Input
                      id="nu-name"
                      value={newUser.name}
                      onChange={(e) => setNewUser((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Ej: Ana Martínez"
                      className="bg-white/70"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="nu-email">Correo electrónico</Label>
                    <Input
                      id="nu-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))}
                      placeholder="usuario@atento.com"
                      className="bg-white/70"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Rol</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(v: Rol) => setNewUser((s) => ({ ...s, role: v }))}
                    >
                      <SelectTrigger className="bg-white/70">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agente">Agente</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenCreateUser(false)}
                      className="rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-full bg-[#3B2748] text-white hover:bg-[#2F1E3E]">
                      Crear
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Crear Grupo */}
            <Dialog open={openCreateGroup} onOpenChange={setOpenCreateGroup}>
              <DialogTrigger asChild>
                <Button
                  className="h-11 rounded-[16px] pl-4 pr-5 text-white shadow-sm w-[220px] md:w-full"
                  style={{ backgroundColor: "#0B4777" }}
                >
                  <span className="mr-3 text-lg leading-none">+</span>
                  Crear Grupo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-[#E7EFF1] border-0">
                <DialogHeader>
                  <DialogTitle>Crear Grupo</DialogTitle>
                  <DialogDescription className="text-neutral-700">
                    Asigna un supervisor y selecciona los agentes del grupo.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitCreateGroup} className="space-y-5">
                  <div className="space-y-1">
                    <Label htmlFor="ng-name">Nombre del grupo</Label>
                    <Input
                      id="ng-name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup((s) => ({ ...s, name: e.target.value }))}
                      placeholder="Ej: Ventas Norte"
                      className="bg-white/70"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>Supervisor</Label>
                    <Select
                      value={newGroup.supervisorId}
                      onValueChange={(v: string) => setNewGroup((s) => ({ ...s, supervisorId: v }))}
                    >
                      <SelectTrigger className="bg-white/70">
                        <SelectValue placeholder="Selecciona un supervisor" />
                      </SelectTrigger>
                      <SelectContent>
                        {supervisors.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} — {s.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selector de miembros (agentes) con búsqueda y checkboxes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Miembros (agentes)</Label>
                      <span className="text-xs text-neutral-600">
                        Seleccionados: {newGroup.memberIds.length}
                      </span>
                    </div>

                    <div className="rounded-[12px] bg-white/60 p-3">
                      {/* Buscador interno */}
                      <div className="relative mb-3">
                        <svg
                          aria-hidden
                          viewBox="0 0 24 24"
                          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-600"
                        >
                          <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
                          <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <Input
                          placeholder="Buscar agente por nombre o correo"
                          value={newGroup.memberSearch}
                          onChange={(e) => setNewGroup((s) => ({ ...s, memberSearch: e.target.value }))}
                          className="h-10 rounded-full pl-9"
                        />
                      </div>

                      {/* Lista scrolleable de agentes con checkbox */}
                      <div className="max-h-[40vh] overflow-auto divide-y">
                        {filteredAgents.map((a) => {
                          const checked = newGroup.memberIds.includes(a.id);
                          return (
                            <label
                              key={a.id}
                              className="flex items-center gap-3 py-2 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-neutral-400"
                                checked={checked}
                                onChange={(e) => {
                                  const isOn = e.target.checked;
                                  setNewGroup((s) => ({
                                    ...s,
                                    memberIds: isOn
                                      ? [...s.memberIds, a.id]
                                      : s.memberIds.filter((id) => id !== a.id),
                                  }));
                                }}
                              />
                              <div className="min-w-0">
                                <div className="text-sm font-medium truncate">{a.name}</div>
                                <div className="text-xs text-neutral-600 truncate">{a.email}</div>
                              </div>
                            </label>
                          );
                        })}
                        {filteredAgents.length === 0 && (
                          <div className="py-6 text-center text-sm text-neutral-500">
                            No se encontraron agentes con esa búsqueda.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpenCreateGroup(false)}
                      className="rounded-full"
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="rounded-full bg-[#0B4777] text-white hover:bg-[#063a66]">
                      Crear
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="rounded-[20px] bg-neutral-100/70 p-3">
          <div className="relative">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black"
            >
              <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <Input
              aria-label="Buscar por correo electrónico"
              placeholder="Buscar por correo electrónico"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 rounded-full pl-10 pr-12 bg-white/70"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Paneles principales */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Grupos recientes */}
          <Card className="rounded-[24px] bg-[#E7EFF1] shadow-md ">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-700">Grupos creados recientemente</h3>

                {/* Boton Ver */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full px-4 ">
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[75vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Grupos</DialogTitle>
                      <DialogDescription>Listado de grupos del sistema</DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-auto divide-y">
                      {mockGroups.map((g) => (
                        <div key={g.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{g.name}</div>
                            <div className="text-xs text-neutral-500 truncate">
                              Supervisor: {g.supervisor}
                            </div>
                          </div>
                          <span className="text-xs rounded-full bg-neutral-200 px-3 py-1">
                            {g.agents} agentes
                          </span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {mockGroups.map((g) => (
                  <div
                    key={g.id}
                    className="rounded-[16px] p-4 text-white"
                    style={{ background: "linear-gradient(180deg,#0B4777,#03375F)" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="grid place-items-center rounded-full size-10 bg-black/20">
                        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white/90">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                      </div>
                      <div className="size-7 grid place-items-center rounded-full bg-black/15">•</div>
                    </div>

                    <div className="mt-4">
                      <div className="font-semibold">{g.name}</div>
                    </div>

                    <div className="mt-3 text-[11px] leading-5 opacity-90">
                      <div>Supervisor: {g.supervisor}</div>
                      <div>Agentes: {g.agents} miembros</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usuarios recientes */}
          <Card className="rounded-[24px] bg-[#E7EFF1] shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-700">Usuarios agregados recientemente</h3>

                {/* ---- Boton Ver (abre popup con lista completa) ---- */}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full px-4">
                      Ver
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[75vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Usuarios</DialogTitle>
                      <DialogDescription>Listado de usuarios del sistema</DialogDescription>
                    </DialogHeader>

                    <div className="max-h-[60vh] overflow-auto divide-y">
                      {mockUsers.map((u) => (
                        <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{u.name}</div>
                            <div className="text-xs text-neutral-500 truncate">{u.email}</div>
                          </div>
                          <span className="text-xs rounded-full bg-neutral-200 px-3 py-1 capitalize">
                            {u.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {filteredRecent.map((u) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="grid place-items-center rounded-full size-9 bg-neutral-300">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-neutral-700">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="rounded-full px-5 py-3 text-white" style={{ background: "#3C2A4A" }}>
                        <div className="text-sm font-semibold leading-tight">{u.name}</div>
                        <div className="text-[11px] opacity-85 -mt-0.5">Rol: {u.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
"use client";

import { useEffect, useState, FormEvent, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { msFetch } from "@/lib/msfetch";
import { getToken } from "@/lib/auth";
import { Pencil, KeyRound, Search, AlertCircle, CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Usuario = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_name: string;
  role_id: number;
  is_active: boolean;
};

// --- Componente para las notificaciones flotantes (éxito) ---
function Notification({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void; }) {
  const styles = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800", // Aunque los errores se mostrarán en el formulario, se mantiene
  };
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={cn("fixed top-5 right-5 z-50 p-4 rounded-lg border shadow-lg flex items-center animate-in fade-in-0 slide-in-from-top-5", styles[type])}>
      <Icon className="h-5 w-5 mr-3" />
      <p className="flex-grow">{message}</p>
      <button onClick={onDismiss} className="ml-4 opacity-70 hover:opacity-100">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}


export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [openCreateUser, setOpenCreateUser] = useState(false);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);

  // Estados para notificaciones globales de exito
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Estados de error específicos para cada formulario
  const [createUserFormError, setCreateUserFormError] = useState<string | null>(null);
  const [editUserFormError, setEditUserFormError] = useState<string | null>(null);
  const [changePasswordFormError, setChangePasswordFormError] = useState<string | null>(null);

  // Estados para formularios
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", role_id: 1 });
  // Estado para la edición de usuario
  const [editedUser, setEditedUser] = useState<Omit<Usuario, 'role_name'> | null>(null);


  const roles = [ { id: 1, name: "LEARNER" }, { id: 2, name: "SUPERVISOR" }, { id: 3, name: "ADMIN" }];

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchUsuarios = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("No autenticado. Inicia sesión nuevamente.");
      const res = await msFetch("/users/?page=1&page_size=50", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Error al cargar usuarios.");
      const usuariosArray = Array.isArray(data) ? data : data.users || [];
      const roleMap: Record<number, string> = { 1: "LEARNER", 2: "SUPERVISOR", 3: "ADMIN" };
      setUsuarios(usuariosArray.map((u: any) => ({ ...u, role_name: roleMap[u.role_id] || u.role_name || "DESCONOCIDO" })));
    } catch (err: any) {
      console.error("Error al obtener usuarios:", err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const submitCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setCreateUserFormError(null); 
    try {
      const token = getToken();
      const predictablePassword = `${newUser.first_name.toLowerCase().trim()}123456`;
      const res = await msFetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...newUser, password: predictablePassword }),
      });
      if (!res.ok) {
        // Si hay un error, Si intentamos leer el JSON para obtener el detalle
        const errorData = await res.json();
        throw new Error(errorData.detail || "Error al crear usuario.");
      }
      
      setOpenCreateUser(false);
      setNewUser({ first_name: "", last_name: "", email: "", role_id: 1 });
      await fetchUsuarios();
      setNotification({ message: `Usuario '${newUser.first_name}' creado. Contraseña temporal: ${predictablePassword}`, type: 'success' });
    } catch (err: any) {
      setCreateUserFormError(err.message || "No se pudo crear el usuario.");
    }
  };

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    const endpoint = isActive ? `/users/${userId}/disable` : `/users/${userId}/enable`;
    try {
      const token = getToken();
      // Optimistic update
      setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, is_active: !isActive } : u)));
      const res = await msFetch(endpoint, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        // Rollback on error
        setUsuarios(usuarios.map((u) => (u.id === userId ? { ...u, is_active: isActive } : u)));
        const data = await res.json();
        throw new Error(data.detail || `Error al actualizar el estado del usuario.`);
      }
      setNotification({ message: `Estado de usuario actualizado.`, type: 'success' });
    } catch (err: any) {
      console.error(err);
      setNotification({ message: err.message || `Error al actualizar estado.`, type: 'error' });
    }
  };

  const handleUpdateUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!editedUser) return;
    setEditUserFormError(null); 
    try {
      const token = getToken();
      await msFetch(`/users/${editedUser.id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ first_name: editedUser.first_name, last_name: editedUser.last_name, email: editedUser.email }) });
      await msFetch(`/users/${editedUser.id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ role_id: editedUser.role_id }) });
      
      setOpenEditUser(false);
      await fetchUsuarios();
      setNotification({ message: "Usuario actualizado correctamente.", type: 'success' });
    } catch (err: any) {
      setEditUserFormError(err.message || "No se pudo actualizar el usuario.");
    }
  };
  
  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setChangePasswordFormError(null); 

    if (!selectedUser || !newPassword || !currentPassword) {
      setChangePasswordFormError("Por favor, completa ambos campos.");
      return;
    }
    
    try {
      const token = getToken();
      const res = await msFetch(`/users/${selectedUser.id}/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "No se pudo actualizar la contraseña. Verifica la contraseña actual.");
      }

      setOpenChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setNotification({ message: `Contraseña de '${selectedUser.first_name}' actualizada correctamente.`, type: 'success' });
    } catch (err: any) {
      setChangePasswordFormError(err.message);
    }
  };

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((user) => {
      const queryLower = query.toLowerCase();
      const matchesQuery = user.first_name.toLowerCase().includes(queryLower) || user.last_name.toLowerCase().includes(queryLower) || user.email.toLowerCase().includes(queryLower);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" && user.is_active) || (statusFilter === "inactive" && !user.is_active);
      const matchesRole = roleFilter === "all" || user.role_name === roleFilter;
      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [query, usuarios, statusFilter, roleFilter]);

  // Helper para limpiar estados al cerrar modales y setear usuario para edición
  const handleEditModalOpenChange = (isOpen: boolean) => {
    setOpenEditUser(isOpen);
    if (!isOpen) {
      setEditUserFormError(null);
      setEditedUser(null);
    } else if (selectedUser) {
      setEditedUser({
        id: selectedUser.id,
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        role_id: selectedUser.role_id,
        is_active: selectedUser.is_active,
      });
    }
  };

  const handleChangePasswordModalOpenChange = (isOpen: boolean) => {
    setOpenChangePassword(isOpen);
    if (!isOpen) {
      setChangePasswordFormError(null);
      setCurrentPassword("");
      setNewPassword("");
    }
  };

  const handleCreateUserModalOpenChange = (isOpen: boolean) => {
    setOpenCreateUser(isOpen);
    if (!isOpen) {
      setCreateUserFormError(null);
      setNewUser({ first_name: "", last_name: "", email: "", role_id: 1 });
    }
  };


  return (
    <DashboardLayout>
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#2F1E3E]">Gestión de Usuarios</h1>
            <p className="text-neutral-600">Administra los usuarios y roles del sistema</p>
          </div>
          <Dialog open={openCreateUser} onOpenChange={handleCreateUserModalOpenChange}>
            <DialogTrigger asChild><Button className="bg-[#3B2748] text-white rounded-full px-6 py-2 hover:bg-[#2F1E3E]">+ Crear Usuario</Button></DialogTrigger>
            <DialogContent className="max-w-md bg-gradient-to-b from-[#E7EFF1] to-[#F3F6F7] border-0 rounded-[20px]">
              <DialogHeader><DialogTitle className="text-[#2F1E3E]">Crear Usuario</DialogTitle><DialogDescription>Completa los datos para crear un usuario nuevo.</DialogDescription></DialogHeader>
              <form onSubmit={submitCreateUser} className="space-y-4 pt-4">
                <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Nombre</Label><Input value={newUser.first_name} onChange={(e) => setNewUser(s => ({ ...s, first_name: e.target.value }))} required className="bg-white/80" /></div>
                <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Apellido</Label><Input value={newUser.last_name} onChange={(e) => setNewUser(s => ({ ...s, last_name: e.target.value }))} required className="bg-white/80" /></div>
                <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Correo electrónico</Label><Input type="email" value={newUser.email} onChange={(e) => setNewUser(s => ({ ...s, email: e.target.value }))} required className="bg-white/80" /></div>
                <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Rol</Label><Select value={String(newUser.role_id)} onValueChange={(v) => setNewUser(s => ({ ...s, role_id: Number(v) }))}><SelectTrigger className="bg-white/80"><SelectValue/></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}</SelectContent></Select></div>
                
                {createUserFormError && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-700 rounded-lg">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{createUserFormError}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="outline" className="rounded-full border-[#3B2748] text-[#3B2748] hover:bg-[#3B2748] hover:text-white">Cancelar</Button></DialogClose>
                  <Button type="submit" className="rounded-full bg-[#3B2748] text-white hover:bg-[#2F1E3E]">Crear</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? ( <p className="text-center text-neutral-500 py-10">Cargando datos de usuarios...</p> ) :
         error ? ( <p className="text-center text-red-500 py-10">{error}</p> ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[{ label: "Administradores", value: usuarios.filter(u => u.role_name === "ADMIN").length }, { label: "Supervisores", value: usuarios.filter(u => u.role_name === "SUPERVISOR").length }, { label: "Agentes", value: usuarios.filter(u => u.role_name === "LEARNER").length },].map((kpi, idx) => (<Card key={idx} className="bg-[#E7EFF1] shadow-sm rounded-[20px]"><CardContent className="p-4 text-center"><p className="text-neutral-600 text-sm">{kpi.label}</p><p className="text-3xl font-bold text-[#2F1E3E]">{kpi.value}</p></CardContent></Card>))}</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative"><Input placeholder="Buscar por nombre o correo" value={query} onChange={(e) => setQuery(e.target.value)} className="h-11 rounded-full pl-10 pr-4 bg-white/70 border-gray-300" /><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" /></div>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-11 rounded-full bg-white/70 border-gray-300"><SelectValue placeholder="Filtrar por estado" /></SelectTrigger><SelectContent><SelectItem value="all">Todos los Estados</SelectItem><SelectItem value="active">Activos</SelectItem><SelectItem value="inactive">Inactivos</SelectItem></SelectContent></Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}><SelectTrigger className="h-11 rounded-full bg-white/70 border-gray-300"><SelectValue placeholder="Filtrar por rol" /></SelectTrigger><SelectContent><SelectItem value="all">Todos los Roles</SelectItem><SelectItem value="ADMIN">Admin</SelectItem><SelectItem value="SUPERVISOR">Supervisor</SelectItem><SelectItem value="LEARNER">Learner</SelectItem></SelectContent></Select>
            </div>
            
            <Card className="rounded-[24px] bg-[#E7EFF1] shadow-md">
              <CardContent className="p-5">
                <h3 className="text-base font-semibold text-[#2F1E3E] mb-3">Usuarios del sistema</h3>
                {filteredUsuarios.length === 0 ? (<p className="text-center text-neutral-500 py-10">No se encontraron usuarios que coincidan con los filtros.</p>) : (
                  <div className="max-h-[60vh] overflow-auto divide-y divide-neutral-200 custom-scrollbar">
                    {filteredUsuarios.map((u) => (
                      <div key={u.id} className="py-3 flex items-center justify-between gap-4">
                        <div className="min-w-0"><div className="font-medium text-[#2F1E3E] truncate">{u.first_name} {u.last_name}</div><div className="text-xs text-neutral-600 truncate">{u.email}</div></div>
                        <div className="flex items-center gap-4">
                          <span className={cn("text-xs rounded-full px-3 py-1 font-semibold", u.role_name === "ADMIN" ? "bg-[#3B2748] text-white" : u.role_name === "SUPERVISOR" ? "bg-blue-200 text-blue-800" : "bg-green-200 text-green-800")}>{u.role_name}</span>
                          <Switch checked={u.is_active} onCheckedChange={() => handleToggleUserStatus(u.id, u.is_active)} className="data-[state=checked]:bg-[#3B2748] data-[state=unchecked]:bg-gray-300" />
                          <Button variant="ghost" size="icon" className="text-neutral-600 hover:bg-neutral-200" onClick={() => { setSelectedUser(u); handleEditModalOpenChange(true); }}><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="text-neutral-600 hover:bg-neutral-200" onClick={() => { setSelectedUser(u); handleChangePasswordModalOpenChange(true); }}><KeyRound className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {selectedUser && editedUser && (
        <Dialog open={openEditUser} onOpenChange={handleEditModalOpenChange}>
          <DialogContent className="max-w-md bg-gradient-to-b from-[#E7EFF1] to-[#F3F6F7] border-0 rounded-[20px]">
            <DialogHeader><DialogTitle className="text-[#2F1E3E]">Editar Usuario</DialogTitle><DialogDescription>Modifica los datos del usuario.</DialogDescription></DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4 pt-4">
              <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Nombre</Label><Input value={editedUser.first_name} onChange={(e) => setEditedUser(s => s ? { ...s, first_name: e.target.value } : null)} required className="bg-white/80" /></div>
              <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Apellido</Label><Input value={editedUser.last_name} onChange={(e) => setEditedUser(s => s ? { ...s, last_name: e.target.value } : null)} required className="bg-white/80" /></div>
              <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Correo electrónico</Label><Input type="email" value={editedUser.email} onChange={(e) => setEditedUser(s => s ? { ...s, email: e.target.value } : null)} required className="bg-white/80" /></div>
              <div><Label className="font-medium text-[#2F1E3E] mb-2 block">Rol</Label><Select value={String(editedUser.role_id)} onValueChange={(v) => setEditedUser(s => s ? { ...s, role_id: Number(v) } : null)}><SelectTrigger className="bg-white/80"><SelectValue/></SelectTrigger><SelectContent>{roles.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>)}</SelectContent></Select></div>
              
              {editUserFormError && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-700 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{editUserFormError}</AlertDescription>
                  </Alert>
              )}

              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline" className="rounded-full border-[#3B2748] text-[#3B2748] hover:bg-[#3B2748] hover:text-white">Cancelar</Button></DialogClose>
                <Button type="submit" className="rounded-full bg-[#3B2748] text-white hover:bg-[#2F1E3E]">Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      
      {selectedUser && (
        <Dialog open={openChangePassword} onOpenChange={handleChangePasswordModalOpenChange}>
          <DialogContent className="max-w-md bg-gradient-to-b from-[#E7EFF1] to-[#F3F6F7] border-0 rounded-[20px]">
            <DialogHeader>
              <DialogTitle className="text-[#2F1E3E]">Cambiar Contraseña</DialogTitle>
              <DialogDescription>
                Actualiza la contraseña para <strong>{selectedUser.first_name}</strong>.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
              <div>
                <Label className="font-medium text-[#2F1E3E] mb-2 block">Contraseña Actual</Label>
                <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="bg-white/80" placeholder="Ingresa la contraseña actual" />
              </div>
              <div>
                <Label className="font-medium text-[#2F1E3E] mb-2 block">Nueva Contraseña</Label>
                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="bg-white/80" placeholder="Mínimo 6 caracteres" />
              </div>

              {changePasswordFormError && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-700 rounded-lg">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{changePasswordFormError}</AlertDescription>
                  </Alert>
              )}
              
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline" className="rounded-full border-[#3B2748] text-[#3B2748] hover:bg-[#3B2748] hover:text-white">Cancelar</Button></DialogClose>
                <Button type="submit" className="rounded-full bg-[#3B2748] text-white hover:bg-[#2F1E3E]">Actualizar Contraseña</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
}
"use client";

import { useState, useEffect, FormEvent } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, Bell, Shield, Globe, AlertCircle, CheckCircle, X } from "lucide-react";
import { getCurrentUser, User, getToken } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast"; // useToast se mantiene para las otras pestañas
import { msFetch } from "@/lib/msfetch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";


// --- Componente para las notificaciones flotantes (éxito) ---
function Notification({ message, type, onDismiss }: { message: string; type: 'success' | 'error'; onDismiss: () => void; }) {
  const styles = {
    success: "bg-green-100 border-green-400 text-green-800",
    error: "bg-red-100 border-red-400 text-red-800",
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

export default function ConfigPage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast(); // Se mantiene para las funciones de placeholder

  // --- ESTADO PARA LA NOTIFICACIÓN DE EXITO ---
  const [notification, setNotification] = useState<{ message: string; type: 'success' } | null>(null);
  
  const [seguridad, setSeguridad] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
  }, []);

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Funciones de placeholder que todavía usan toast
  const handleSavePerfil = () => { toast({ title: "Perfil actualizado", description: "Los cambios han sido guardados." }); };
  const handleSaveNotificaciones = () => { toast({ title: "Notificaciones actualizadas", description: "Tus preferencias han sido guardadas." }); };
  const handleSavePreferencias = () => { toast({ title: "Preferencias guardadas", description: "Tus preferencias han sido actualizadas." }); };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setIsSaving(true);

    if (seguridad.newPassword !== seguridad.confirmPassword) {
      setSecurityError("Las nuevas contraseñas no coinciden.");
      setIsSaving(false);
      return;
    }
    if (seguridad.newPassword.length < 6) {
      setSecurityError("La nueva contraseña debe tener al menos 6 caracteres.");
      setIsSaving(false);
      return;
    }
    if (!user) {
      setSecurityError("No se ha podido identificar al usuario.");
      setIsSaving(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error("Sesión inválida. Por favor, inicia sesión de nuevo.");
      }

      const res = await msFetch(`/users/${user.id}/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          current_password: seguridad.currentPassword,
          new_password: seguridad.newPassword,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "No se pudo cambiar la contraseña. Verifica tu contraseña actual.");
      }

      // --- CAMBIO: Usa la notificación flotante en lugar del toast ---
      setNotification({
        message: "Tu contraseña ha sido cambiada exitosamente.",
        type: 'success',
      });
      setSeguridad({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setSecurityError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full"><p>Cargando configuración...</p></div>
      </DashboardLayout>
    );
  }

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  const roleName = user.role_name?.replace("_", " ") || "Usuario";
  const initials = fullName ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase() : (user.email ? user.email[0].toUpperCase() : 'U');

  return (
    <DashboardLayout>
      {/* --- RENDERIZO LA NOTIFICACIÓN SI EXISTE --- */}
      {notification && <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification(null)} />}
      
      <div className="space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-[#2F1E3E]">Configuración</h1>
          <p className="text-neutral-600">Gestiona tu perfil y preferencias del sistema</p>
        </div>

        <Card className="bg-[#E7EFF1] border-0 shadow-sm rounded-[20px]">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-[#3B2748] text-white text-xl font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-[#2F1E3E]">{fullName}</h2>
                <p className="text-neutral-600">{user.email}</p>
                <p className="text-sm text-neutral-500 capitalize">Rol: {roleName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="perfil" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="perfil"><UserIcon className="h-4 w-4 mr-2" />Perfil</TabsTrigger>
            <TabsTrigger value="notificaciones"><Bell className="h-4 w-4 mr-2" />Notificaciones</TabsTrigger>
            <TabsTrigger value="preferencias"><Globe className="h-4 w-4 mr-2" />Preferencias</TabsTrigger>
            <TabsTrigger value="seguridad"><Shield className="h-4 w-4 mr-2" />Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card className="bg-[#E7EFF1]/50 border-0 shadow-sm">
              <CardHeader><CardTitle className="text-[#2F1E3E]">Información Personal</CardTitle><CardDescription>Estos datos no pueden ser editados aquí. Contacta a un administrador.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2"><Label>Nombre completo</Label><Input value={fullName} disabled /></div>
                  <div className="space-y-2"><Label>Correo electrónico</Label><Input type="email" value={user.email} disabled /></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notificaciones">{/* ... (Contenido omitido por brevedad) ... */}</TabsContent>
          <TabsContent value="preferencias">{/* ... (Contenido omitido por brevedad) ... */}</TabsContent>

          <TabsContent value="seguridad">
            <Card className="bg-[#E7EFF1]/50 border-0 shadow-sm">
              <CardHeader><CardTitle className="text-[#2F1E3E]">Cambiar Contraseña</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="current-password">Contraseña actual</Label><Input id="current-password" type="password" value={seguridad.currentPassword} onChange={(e) => setSeguridad({ ...seguridad, currentPassword: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="new-password">Nueva contraseña</Label><Input id="new-password" type="password" value={seguridad.newPassword} onChange={(e) => setSeguridad({ ...seguridad, newPassword: e.target.value })} required /></div>
                  <div className="space-y-2"><Label htmlFor="confirm-password">Confirmar nueva contraseña</Label><Input id="confirm-password" type="password" value={seguridad.confirmPassword} onChange={(e) => setSeguridad({ ...seguridad, confirmPassword: e.target.value })} required /></div>
                  
                  {securityError && (
                    <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{securityError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={isSaving || !seguridad.currentPassword || !seguridad.newPassword || !seguridad.confirmPassword}
                  >
                    {isSaving ? "Guardando..." : "Cambiar Contraseña"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mic,
  Brain,
  Database,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { msFetch } from "@/lib/msfetch";
import { getToken } from "@/lib/auth";

interface Integracion {
  id: string;
  nombre: string;
  descripcion: string;
  estado: "conectado" | "desconectado" | "error";
  tipo: "transcripcion" | "ia" | "base-datos";
  configuracion: Record<string, any>;
  ultimaActualizacion: string;
}

export default function IntegracionesPage() {
  const [integraciones, setIntegraciones] = useState<Integracion[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configuracionGeneral, setConfiguracionGeneral] = useState({
    transcripcionAutomatica: true,
    analisisIA: true,
    notificaciones: true,
    backupAutomatico: false,
  });
  const { toast } = useToast();

useEffect(() => {
  //Simular integraciones locales mientras no hay backend
  const mockData = [
    {
      id: "1",
      nombre: "Azure Speech Services",
      descripcion: "Transcripción de audio automática",
      estado: "conectado",
      tipo: "transcripcion",
      configuracion: { idioma: "es-ES" },
      ultimaActualizacion: new Date().toISOString(),
    },
    {
      id: "2",
      nombre: "OpenAI Whisper",
      descripcion: "Conversión de audio a texto con IA",
      estado: "desconectado",
      tipo: "ia",
      configuracion: { idioma: "en-US" },
      ultimaActualizacion: new Date().toISOString(),
    },
  ];

  setIntegraciones(mockData);
  setIsLoading(false);
}, []);

  // Cambiar estado manualmente (mock visual)
  const handleToggleIntegracion = (id: string) => {
    setIntegraciones((prev) =>
      prev.map((int) =>
        int.id === id
          ? {
              ...int,
              estado: int.estado === "conectado" ? "desconectado" : "conectado",
              ultimaActualizacion: new Date().toISOString(),
            }
          : int
      )
    );
    toast({
      title: "Estado actualizado",
      description: "El estado de la integración ha sido cambiado.",
    });
  };

  const handleTestConnection = (id: string) => {
    toast({
      title: "Probando conexión",
      description: "Verificando el estado de la integración...",
    });
    setTimeout(() => {
      toast({
        title: "Conexión exitosa",
        description: "La integración está funcionando correctamente.",
      });
    }, 1400);
  };

  // Helpers visuales
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case "conectado":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "desconectado":
        return <XCircle className="h-4 w-4 text-gray-400" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "conectado":
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Conectado</Badge>;
      case "desconectado":
        return <Badge variant="secondary">Desconectado</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "transcripcion":
        return <Mic className="h-5 w-5" />;
      case "ia":
        return <Brain className="h-5 w-5" />;
      case "base-datos":
        return <Database className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const filtered = integraciones.filter((i) =>
    `${i.nombre || ""} ${i.descripcion || ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Integraciones</h1>
            <p className="text-muted-foreground">Configurar y gestionar integraciones del sistema</p>
          </div>
          <div className="flex gap-3">
            <Button className="rounded-full px-5 bg-[#3A2554] hover:bg-[#2E2145] text-white">
              <Plus className="mr-2 h-4 w-4" /> Conectar Servicio
            </Button>
            <Button className="rounded-full px-5 bg-[--pill-active] hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Añadir API
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <div className="rounded-[24px] bg-neutral-100/70 p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              {
                icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
                value: filtered.filter((i) => i.estado === "conectado").length,
                label: "Conectadas",
              },
              {
                icon: <XCircle className="h-5 w-5 text-gray-400" />,
                value: filtered.filter((i) => i.estado === "desconectado").length,
                label: "Desconectadas",
              },
              {
                icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
                value: filtered.filter((i) => i.estado === "error").length,
                label: "Con errores",
              },
            ].map((kpi, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between rounded-[20px] bg-white/70 px-6 py-4",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
                )}
              >
                <div className="flex items-center gap-2">
                  {kpi.icon}
                  <span className="text-2xl font-bold">{kpi.value}</span>
                </div>
                <span className="text-sm text-neutral-500">{kpi.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div className="rounded-[20px] bg-neutral-100/70 p-3">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por nombre o descripción…"
                className="rounded-full pl-9 bg-white/70"
              />
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="rounded-full bg-white/70">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="conectado">Conectadas</SelectItem>
                <SelectItem value="desconectado">Desconectadas</SelectItem>
                <SelectItem value="error">Con errores</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="rounded-full bg-white/70">
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Limpiar Filtros
            </Button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Lista de integraciones */}
          <Card className="rounded-[24px] bg-neutral-100/60 shadow-md">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-neutral-700">Integraciones disponibles</h3>
              </div>

              {isLoading ? (
                <p className="text-center text-gray-400">Cargando integraciones...</p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : (
                <div className="space-y-3">
                  {filtered.map((integracion) => (
                    <div
                      key={integracion.id}
                      className={cn(
                        "rounded-[16px] bg-white/90 p-4 shadow-sm",
                        "hover:shadow transition-shadow"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid place-items-center rounded-full size-9 bg-neutral-200/70">
                            {getTipoIcon(integracion.tipo)}
                          </div>
                          <div>
                            <div className="font-medium">{integracion.nombre}</div>
                            <div className="text-xs text-neutral-500">
                              {integracion.descripcion}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integracion.estado)}
                          {getStatusBadge(integracion.estado)}
                        </div>
                      </div>

                      {/* Configuración resumida */}
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {Object.entries(integracion.configuracion || {}).map(([key, value]) => (
                          <div
                            key={key}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                          >
                            <span className="font-medium capitalize">
                              {key.replace(/([A-Z])/g, " $1")}:{" "}
                            </span>
                            <span className="opacity-80">{String(value)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Acciones */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleToggleIntegracion(integracion.id)}
                        >
                          {integracion.estado === "conectado" ? "Desconectar" : "Conectar"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleTestConnection(integracion.id)}
                        >
                          Probar Conexión
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full">
                          Configurar
                        </Button>
                      </div>

                      {/* Última actualización */}
                      <p className="mt-2 text-xs text-neutral-500">
                        Última actualización:{" "}
                        {new Date(integracion.ultimaActualizacion).toLocaleString("es-ES")}
                      </p>

                      {/* Alerta de error */}
                      {integracion.estado === "error" && (
                        <Alert variant="destructive" className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Error de conexión detectado. Verifique la configuración y pruebe nuevamente.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Configuración general */}
          <Card className="rounded-[24px] bg-neutral-100/60 shadow-md">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Configuración general</h3>

              {/* Configuración IA y sistema */}
              <div className="rounded-[16px] bg-white/90 p-4 shadow-sm space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Transcripción Automática</div>
                    <p className="text-xs text-neutral-500">
                      Convertir automáticamente audio de llamadas a texto
                    </p>
                  </div>
                  <Switch
                    checked={configuracionGeneral.transcripcionAutomatica}
                    onCheckedChange={(checked) =>
                      setConfiguracionGeneral((s) => ({ ...s, transcripcionAutomatica: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Análisis de IA</div>
                    <p className="text-xs text-neutral-500">
                      Generar tips automáticos basados en IA
                    </p>
                  </div>
                  <Switch
                    checked={configuracionGeneral.analisisIA}
                    onCheckedChange={(checked) =>
                      setConfiguracionGeneral((s) => ({ ...s, analisisIA: checked }))
                    }
                  />
                </div>
              </div>

              {/* Sistema */}
              <div className="rounded-[16px] bg-white/90 p-4 shadow-sm space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notificaciones</div>
                    <p className="text-xs text-neutral-500">Enviar notificaciones por email</p>
                  </div>
                  <Switch
                    checked={configuracionGeneral.notificaciones}
                    onCheckedChange={(checked) =>
                      setConfiguracionGeneral((s) => ({ ...s, notificaciones: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Backup Automático</div>
                    <p className="text-xs text-neutral-500">Copias de seguridad diarias</p>
                  </div>
                  <Switch
                    checked={configuracionGeneral.backupAutomatico}
                    onCheckedChange={(checked) =>
                      setConfiguracionGeneral((s) => ({ ...s, backupAutomatico: checked }))
                    }
                  />
                </div>
              </div>

              {/* Selector proveedor e idioma */}
              <div className="rounded-[16px] bg-white/90 p-4 shadow-sm space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Proveedor Preferido</Label>
                    <Select defaultValue="azure">
                      <SelectTrigger className="rounded-full bg-neutral-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="azure">Azure Speech Services</SelectItem>
                        <SelectItem value="google">Google Cloud Speech</SelectItem>
                        <SelectItem value="aws">Amazon Transcribe</SelectItem>
                        <SelectItem value="openai">OpenAI Whisper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Idioma Principal</Label>
                    <Select defaultValue="es-ES">
                      <SelectTrigger className="rounded-full bg-neutral-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es-ES">Español (España)</SelectItem>
                        <SelectItem value="es-MX">Español (México)</SelectItem>
                        <SelectItem value="es-AR">Español (Argentina)</SelectItem>
                        <SelectItem value="en-US">Inglés (EE.UU.)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    className="rounded-full"
                    onClick={() =>
                      toast({
                        title: "Configuración guardada",
                        description: "Los cambios han sido aplicados exitosamente.",
                      })
                    }
                  >
                    Guardar Configuración
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

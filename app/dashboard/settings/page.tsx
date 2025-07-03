"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  Chip,
  Stack,
  Container,
  Divider,
} from "@mui/material"
import {
  Save,
  Phone,
  Mail,
  MapPin,
  Building2,
  Globe,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  Hash,
  Copyright,
} from "lucide-react"
import { toast } from "react-toastify"
import Swal from "sweetalert2"
import { useDebounce } from "use-debounce"
import { Config } from "@/types/types"

export default function SettingsPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  // Debounce para detectar cambios
  const [debouncedConfig] = useDebounce(config, 500)

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setConfig({ ...data, urlSite: data.urlSite || "" })
        setLoading(false)
      })
      .catch(() => {
        setError("Error al cargar la configuración")
        setLoading(false)
        toast.error("Error al cargar la configuración")
      })
  }, [])

  useEffect(() => {
    if (debouncedConfig && !loading) {
      setHasChanges(true)
    }
  }, [debouncedConfig, loading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return
    const { name, value, type, checked } = e.target
    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSwitchChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!config) return
    setConfig({
      ...config,
      [name]: event.target.checked,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Confirmación con SweetAlert2
    const result = await Swal.fire({
      title: "¿Guardar cambios?",
      text: "Se actualizará la configuración de la empresa",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#d32f2f",
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    })

    if (!result.isConfirmed) return

    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      if (!res.ok) throw new Error("Error al guardar")

      toast.success("Configuración guardada correctamente", {
        position: "top-right",
        autoClose: 3000,
      })
      setHasChanges(false)
      setSaving(false)
    } catch {
      setError("Error al guardar la configuración")
      toast.error("Error al guardar la configuración")
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={40} />
            <Typography variant="h6" color="text.secondary">
              Cargando configuración...
            </Typography>
          </Stack>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box p={3}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    )
  }

  if (!config) return null

  return (
    <Container maxWidth="lg">
      <Box p={3}>
        {/* Header */}
        <Stack spacing={2} mb={4}>
          <Typography variant="h3" component="h1" fontWeight="bold">
            Configuración
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestiona la información de contacto y configuración de tu empresa
          </Typography>
          {hasChanges && (
            <Box>
              <Chip label="Cambios sin guardar" color="warning" size="small" />
            </Box>
          )}
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Información de la Empresa */}
            <Card elevation={2}>
              <CardHeader>
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Building2 size={20} />
                    <Typography variant="h5" component="h2">
                      Información de la Empresa
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Datos básicos de tu empresa
                  </Typography>
                </Stack>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  {/* Primera fila - Nombre y Horario */}
                  <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                    <TextField
                      fullWidth
                      label="Nombre de la empresa"
                      name="companyName"
                      value={config.companyName}
                      onChange={handleChange}
                      placeholder="Ingresa el nombre de tu empresa"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Building2 size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Horario de atención"
                      name="companyHours"
                      value={config.companyHours}
                      onChange={handleChange}
                      placeholder="Ej: Lun-Vie 9:00-18:00"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Clock size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Segunda fila - Copyright */}
                  <TextField
                    fullWidth
                    label="Texto de copyright"
                    name="copyrightText"
                    value={config.copyrightText}
                    onChange={handleChange}
                    placeholder="© 2024 Tu Empresa. Todos los derechos reservados."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Copyright size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Nueva fila - URL del sitio */}
                  <TextField
                    fullWidth
                    label="URL del sitio web"
                    name="urlSite"
                    value={config.urlSite || ""}
                    onChange={handleChange}
                    placeholder="https://tusitio.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Globe size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card elevation={2}>
              <CardHeader>
                <Stack spacing={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Phone size={20} />
                    <Typography variant="h5" component="h2">
                      Información de Contacto
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Datos de contacto para tus clientes
                  </Typography>
                </Stack>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  {/* Primera fila - WhatsApp y Teléfono */}
                  <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                    <TextField
                      fullWidth
                      label="WhatsApp"
                      name="contactWS"
                      type="tel"
                      value={config.contactWS}
                      onChange={handleChange}
                      placeholder="123456789"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Teléfono"
                      name="contactPhone"
                      type="tel"
                      value={config.contactPhone}
                      onChange={handleChange}
                      placeholder="+1 234 567 8900"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {/* Segunda fila - Email y Dirección */}
                  <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="contactEmail"
                      type="email"
                      value={config.contactEmail}
                      onChange={handleChange}
                      placeholder="contacto@tuempresa.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Mail size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Dirección"
                      name="contactAddress"
                      value={config.contactAddress}
                      onChange={handleChange}
                      placeholder="Calle Principal 123, Ciudad"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MapPin size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Redes Sociales */}
            <Card elevation={2}>
              <CardHeader>
                <Stack spacing={1}>
                  <Typography variant="h5" component="h2">
                    Redes Sociales
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enlaces a tus perfiles en redes sociales
                  </Typography>
                </Stack>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Instagram"
                    name="instagramLink"
                    value={config.instagramLink}
                    onChange={handleChange}
                    placeholder="https://instagram.com/tuempresa"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Instagram size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Facebook"
                    name="facebookLink"
                    value={config.facebookLink}
                    onChange={handleChange}
                    placeholder="https://facebook.com/tuempresa"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Facebook size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="YouTube"
                    name="youtubeLink"
                    value={config.youtubeLink}
                    onChange={handleChange}
                    placeholder="https://youtube.com/@tuempresa"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Youtube size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Configuración Avanzada */}
            <Card elevation={2}>
              <CardHeader>
                <Stack spacing={1}>
                  <Typography variant="h5" component="h2">
                    Configuración Avanzada
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Opciones adicionales de configuración
                  </Typography>
                </Stack>
              </CardHeader>
              <CardContent>
                <Stack spacing={3}>
                  <FormControlLabel
                    control={<Switch checked={config.active} onChange={handleSwitchChange("active")} color="primary" />}
                    label={
                      <Stack spacing={0.5}>
                        <Typography variant="body1">Estado activo</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Activa o desactiva la configuración
                        </Typography>
                      </Stack>
                    }
                  />

                  <Divider />

                  <Box maxWidth={300}>
                    <TextField
                      fullWidth
                      label="Orden"
                      name="ordering"
                      type="number"
                      value={config.ordering}
                      onChange={handleChange}
                      placeholder="1"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Hash size={20} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Botón de Guardar */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving || !hasChanges}
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <Save size={20} />}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                }}
              >
                {saving ? "Guardando..." : "Guardar Configuración"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  )
}

# Analisis profundo del folder HOYPASA

Fecha del analisis: 2026-02-16

## 1) Resumen ejecutivo

Esta carpeta contiene una app web frontend llamada `Hoy Pasa` orientada a informar si hoy pasa la recoleccion de residuos segun la ubicacion del usuario.

Estado actual real:
- El frontend compila correctamente (`npm run build` OK).
- La integracion de clima funciona (OpenWeather responde 200 con la API key actual).
- La integracion principal (Supabase RPC para residuos) esta bloqueada porque el host configurado no resuelve DNS (`NXDOMAIN`).

Conclusion directa:
- Hoy la app puede mostrar UI, mapa, geolocalizacion y clima.
- Pero la funcion principal de negocio (decir si pasa la basura hoy) depende de un backend que en este estado no es alcanzable.

## 2) Que hace la app (flujo funcional)

1. Al iniciar, pide geolocalizacion del navegador.
2. Con lat/lon, llama a Supabase RPC `get_waste_info_day`.
3. Normaliza la respuesta para tolerar distintos nombres de campos.
4. Muestra una tarjeta principal con estado de recoleccion, franja horaria y zona.
5. En paralelo consulta OpenWeather y muestra widget de clima.
6. Si hay alerta de lluvia/tormenta/viento fuerte, agrega advertencia visual.
7. Muestra mapa Leaflet centrado en la ubicacion del usuario.
8. Si el estado es favorable, permite check-in diario (`Ya la saque!`) con racha en `localStorage` y confetti.

## 3) Stack y arquitectura tecnica

### Frontend
- React 18 + TypeScript + Vite 5
- TailwindCSS para estilos
- Lucide icons
- Leaflet + react-leaflet para mapa
- date-fns para fechas
- canvas-confetti para animacion de check-in

### Integraciones externas
- Supabase (`@supabase/supabase-js`): RPC `get_waste_info_day`
- OpenWeather API: clima actual por coordenadas
- OpenStreetMap tiles: capa de mapa

### Estructura principal
- `src/App.tsx`: orquestacion general (geolocalizacion + RPC + clima + layout)
- `src/hooks/useGeoLocation.ts`: permisos y captura de coordenadas
- `src/hooks/useWeather.ts`: fetch de clima y calculo de warning
- `src/components/StatusHero.tsx`: estado principal, check-in, racha
- `src/components/WeatherWidget.tsx`: datos meteorologicos detallados
- `src/components/MapLeaflet.tsx`: mapa y marcador
- `src/lib/supabase.ts`: cliente Supabase por env vars

Tamano aproximado de codigo fuente (`src/`): 1294 lineas.

## 4) Contrato de datos esperado para residuos

El frontend espera que el RPC devuelva (objeto o array con objeto) algo equivalente a:
- `municipio`
- `zona`
- `tipo_residuo`
- `mensaje_principal`
- `color_estado` (`verde | rojo | amarillo | gris`)
- `hora_inicio`
- `hora_fin`
- `pasa_hoy`
- `is_exception`
- `exception_message`

Ademas, la normalizacion tolera aliases (`municipality`, `zone_name`, `message`, etc.).

## 5) Variables de entorno y configuracion

Variables usadas:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_WEATHER_API_KEY` (opcional en tipos, pero necesaria para clima)

Notas:
- `VITE_*` se inyecta en cliente (queda visible en bundle).
- El anon key de Supabase es esperado en frontend.
- La weather key en cliente debe considerarse publica/restringida por uso, no secreta fuerte.

## 6) Hallazgos clave (con impacto)

### Critico: backend principal no alcanzable
Evidencia:
- `nslookup zazefsvcnnrtxlbspkuv.supabase.co` -> `Non-existent domain`.
- Llamada HTTP al RPC falla por resolucion de nombre.

Impacto:
- La funcion principal de negocio queda sin datos.
- El usuario ve estado sin informacion util.

### Alto: dependencia total de RPC remoto sin fallback
- Si RPC falla, no hay cache local ni estrategia offline para la logica principal.

### Medio: bundle principal grande
Evidencia build:
- Chunk JS principal ~539.88 kB minificado (warning de Vite >500 kB).

Impacto:
- Peor tiempo de carga inicial en red movil.

### Medio: falta de base operativa de proyecto
- No hay `README.md`.
- No hay `.gitignore`.
- No hay tests (unitarios/integracion/e2e).
- No hay pipeline CI.

Impacto:
- Mantenimiento dificil, onboarding lento, mas riesgo de regresiones.

### Medio: carpeta con artefactos locales
- Existen `dist/`, `node_modules/`, logs de dev server en el folder.

Impacto:
- Ruido operativo y riesgo de subir artefactos no deseados.

### Bajo: PWA incompleta
- Hay `manifest.webmanifest` e icono, pero no hay service worker registrado.

Impacto:
- No hay capacidades offline reales ni instalacion PWA completa.

## 7) Calidad de UX y comportamiento actual

Puntos buenos:
- UI clara y mobile-first.
- Buen manejo de estados visuales (loading/error/permission denied).
- Error boundaries en app y bloque de mapa.
- Advertencias climaticas utiles para contexto de residuos.

Limitaciones:
- Cuando falla backend, el mensaje al usuario no explica claramente causa tecnica.
- No hay trazabilidad/telemetria para saber por que falla en produccion.

## 8) Validaciones ejecutadas en este analisis

- `npm run build` -> OK (con warning de chunk grande).
- OpenWeather request directo -> STATUS 200.
- Supabase RPC request directo -> falla DNS del host configurado.

## 9) Que tenemos que hacer (plan priorizado)

### Fase 0 - Desbloquear core de negocio (urgente)
1. Corregir `VITE_SUPABASE_URL` a un proyecto Supabase valido y activo.
2. Verificar que RPC `get_waste_info_day` exista y tenga permisos para rol anon.
3. Probar manualmente 3 ubicaciones reales (zona con servicio, sin servicio, zona limite).

### Fase 1 - Robustez minima para produccion
1. Mostrar error explicito cuando falle RPC (ej: "Servicio temporalmente no disponible").
2. Agregar timeout/retry controlado para RPC principal.
3. Agregar logging minimo de errores (Sentry u opcion equivalente).
4. Crear `README.md` con setup, env vars y flujo.
5. Crear `.gitignore` para excluir `node_modules`, `dist`, logs y `.env` local.

### Fase 2 - Calidad tecnica
1. Tests unitarios para:
   - `normalizeWasteInfo`
   - reglas de warning en `useWeather`
   - logica de racha/check-in en `StatusHero`
2. Test de integracion para flujo completo geolocalizacion -> estado.
3. CI basica (typecheck + build + tests).

### Fase 3 - Performance y producto
1. Reducir bundle inicial (lazy-load de mapa/widget clima o manualChunks).
2. Evaluar cache de ultima respuesta valida para modo degradado.
3. Si se busca PWA real, incorporar service worker y estrategia offline.
4. Reemplazar banner `PROXIMAMENTE` por funcionalidad o remover temporalmente.

## 10) Diagnostico final

La app esta bien encaminada en frontend y UX, pero hoy no cumple su objetivo principal por un bloqueo de conectividad/configuracion en Supabase.

Si se corrige la URL/proyecto Supabase y se agrega una capa minima de robustez (errores claros, retries, tests basicos), puede pasar rapido a un estado util y publicable.

# Sitio web — PAC (Prueba Ambiental del Centro S. de R.L. de C.V.)

Sitio estático de una sola página para la unidad de inspección de autotransporte
federal en Jesús María, Aguascalientes.

**Sin backend, sin base de datos, sin CMS.** Es HTML, CSS y SVG. Se abre con doble
clic y se puede editar con cualquier editor de texto. Está pensado para que no
requiera mantenimiento: todo el contacto sale por WhatsApp.

---

## Cómo verlo en tu máquina

Doble clic en `index.html` funciona. Si prefieres servidor local:

```bash
python -m http.server 4321
```

Luego abre <http://localhost:4321>.

---

## Estructura

```
Verificentro-PAC/
├─ index.html                  ← toda la página (comentada por secciones)
├─ 404.html                    ← "esta dirección no existe"
├─ og-plantilla.html           ← molde de la imagen para compartir (no es una página del sitio)
├─ favicon.ico                 ← ícono para navegadores viejos (va en la raíz a fuerza)
├─ site.webmanifest            ← nombre e íconos para Android
├─ robots.txt                  ← para buscadores
├─ sitemap.xml                 ← para buscadores
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css            ← COLORES, TIPOGRAFÍA Y ESPACIOS. Empieza aquí.
│  │  └─ styles.css            ← estilos de cada componente
│  ├─ fonts/                   ← Barlow, 4 pesos, servidos desde aquí
│  ├─ js/
│  │  └─ main.js               ← mapa, menú, navegación activa y apariciones
│  └─ img/
│     ├─ logo-pac.png          ← logo oficial, ya sin fondo y recortado
│     ├─ logo-pac-original.png ← el archivo tal cual lo mandó el cliente. No lo borres.
│     ├─ isotipo-pac.svg       ← la hoja del logo, vectorizada del PNG oficial
│     ├─ tractocamion-tecnico.svg ← ilustración vectorial original de portada
│     ├─ favicon.svg           ← ícono de pestaña
│     ├─ favicon-32.png
│     ├─ apple-touch-icon.png  ← 180 px, para iPhone
│     ├─ icon-192.png          ← para Android
│     ├─ icon-512.png          ← para Android
│     └─ og-pac.png            ← 1200x630, lo que se ve al compartir el link
└─ .claude/launch.json         ← config del servidor local (no afecta al sitio)
```

Secciones de la página, en orden: barra de ubicación · header · portada con
ilustración técnica · datos rápidos · servicios · cómo funciona · compromiso ·
normatividad · preguntas frecuentes · ubicación con mapa · contacto · footer.

El diseño combina el verde de la marca, fondos claros y carbón. La ilustración
es un recurso gráfico, no una fotografía del negocio. Las fotos reales pueden
incorporarse después sin alterar los datos de contacto ni la estructura.

### Si vas a tocar algo, lee esto primero

- **Para cambiar un color en todo el sitio** → `assets/css/tokens.css`, sección 4
  ("Roles semánticos"). No cambies colores directamente en `styles.css`.
- **Para cambiar textos** → `index.html`. Cada sección está separada con un
  comentario grande en mayúsculas.
- **Para cambiar el número de WhatsApp** → busca todas las coincidencias de
  `524491100153` en los archivos HTML. Cada consulta tiene un mensaje propio.
- **Para llenar un pendiente** → consulta la lista al final de este documento y
  los comentarios `PENDIENTE` del HTML. Los datos aún desconocidos se consultan
  por WhatsApp; no se muestran avisos internos al visitante.
- **Si cambia el domicilio** → actualiza el texto visible, el JSON-LD, los enlaces
  de Google Maps y Waze, y las coordenadas del mapa en `assets/js/main.js`.
- **Si cambia el teléfono** → aparece en `index.html`, en `404.html` y en
  `og-plantilla.html` (y hay que regenerar `og-pac.png`, ver más abajo).
- **`404.html` usa rutas que empiezan con `/`** y por eso se ve sin estilos si le
  das doble clic. Es correcto: esa página se muestra en direcciones inventadas y
  con rutas relativas se rompería. Míralo con el servidor local.

### Dos decisiones técnicas que conviene no deshacer

**El mapa carga hasta que le dan clic.** El iframe de Google pesa cerca de 1 MB y
mete cookies de terceros. Se muestra un panel propio y el mapa real aparece al
primer clic. Los botones de Google Maps y Waze son enlaces normales, así que
funcionan aunque el JavaScript falle.

**El contenido es visible por defecto.** Solo se activa la clase `reveal-ready`
después de inicializar el observador. Un temporizador muestra todo a los 1.5
segundos si el observador falla. Si JavaScript no carga, la página sigue siendo
legible; el menú y los acordeones funcionan con HTML nativo. Se respeta la
preferencia de movimiento reducido.

Los CSS y el JavaScript llevan un parámetro `?v=` en `index.html` y `404.html`.
Actualízalo al publicar cambios para evitar que se reutilicen estilos antiguos.

---

## Paleta

Medida sobre el logo oficial, no puesta a ojo. El detalle importante:

| Token | Hex | Para qué |
|---|---|---|
| `--verde-300` | `#A7C776` | El verde del logo. **Solo hoja, íconos y rellenos.** |
| `--verde-700` | `#46681A` | **Botones y texto verde.** Es el único que pasa contraste AA (6.5:1). |
| `--color-texto` | `#26342B` | Texto principal |
| `--gris-600` | `#63625D` | Texto secundario |
| `--color-fondo-oscuro` | `#202C25` | Lámina técnica, compromiso y footer |
| `--pac-gris-logo` | `#7D7E79` | El gris exacto del wordmark. Solo para dibujar el logo. |

El verde del logo es demasiado claro para llevar texto blanco encima (da 1.9:1,
ilegible). Por eso hay dos verdes distintos y no es un error.

El gris del wordmark tampoco alcanza para texto (4.1:1). Por eso el texto usa
`--gris-600`, que es el mismo tono más oscuro, y el logo usa el suyo.

---

## Cómo se regeneran los íconos y la imagen para compartir

Los dos se rasterizan con Edge en modo sin ventana. No hace falta instalar nada.

**Imagen de Open Graph** (la que se ve al pegar el link en WhatsApp). Edita los
textos en `og-plantilla.html` y corre esto desde la carpeta del proyecto:

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=5000 --window-size=1200,630 --screenshot=assets\img\og-pac.png og-plantilla.html
```

**Íconos.** Solo hay que rehacerlos si cambia el logo. Son la hoja de
`isotipo-pac.svg` sobre una placa gris carbón, en 5 tamaños. La receta está en
el comentario de `assets/img/favicon.svg`; el mismo comando de arriba sirve
cambiando `--window-size` al tamaño que toque.

Después de tocar la imagen de Open Graph hay que pedirle a Facebook y WhatsApp
que la vuelvan a leer, porque guardan copia: <https://developers.facebook.com/tools/debug/>

---

## Pendientes

### Bloqueantes para publicar
- [x] **Horario de atención** — confirmado: lunes a sábado, 9:00 a 18:00 h.
      Ya está en `index.html` (topbar, datos rápidos, contacto, footer y JSON-LD
      `openingHours`) y en `404.html`.
- [ ] **Dominio.** Buscar `EJEMPLO.mx` en `index.html` y reemplazar (5 lugares:
      canonical, Open Graph y JSON-LD). También en `robots.txt` y `sitemap.xml`.
- [ ] **¿Quién contesta el WhatsApp?** Cada botón del sitio manda a ese número.
      Si nadie contesta, el sitio falla en silencio. Confirmarlo antes de publicar.
- [ ] **Que el cliente apruebe el texto por escrito**, sobre todo el sello de
      las acreditaciones y la lista de normas. Son afirmaciones regulatorias.
- [x] **Logo oficial** del cliente — ya está, procesado y sin fondo.
- [x] **Imagen Open Graph** `assets/img/og-pac.png`, 1200×630 px.
- [x] **Juego de íconos** (favicon, iPhone, Android).

### Contenido por confirmar con el cliente
- [ ] Precios o rango de precios
- [ ] Requisitos / qué documentos traer
- [ ] Cuánto tarda el trámite
- [ ] ¿Atienden solo carga federal o también otros vehículos?
- [ ] ¿Número de aprobación SICT? (sería la señal de confianza más fuerte del sitio)
- [ ] ¿La aprobación ya dice SICT o sigue como SCT?
- [ ] Fotos reales del lugar (fachada, acceso, equipo). Sin stock genérico.

### Mejoras posibles
- [ ] **Fotos reales del lugar.** Fachada con el letrero, acceso, equipo, unidad
      en la rampa. Es el mayor salto disponible y solo cuesta un celular y 20 min.
      Sirven también para el Perfil de Empresa en Google.
      Ojo: los videos que mandó el cliente vienen re-comprimidos (576×1024).
      Hay que pedir los **originales del celular**, no por WhatsApp.
- [ ] **Analítica** con Cloudflare Web Analytics: gratis, sin cookies, una línea.
      Al no usar cookies no obliga a poner banner ni complica el aviso de privacidad.
- [ ] Separar en `/baja-emision` y `/fisico-mecanica` **cuando haya contenido real**
      (requisitos, precios, qué se revisa). Hoy quedarían dos páginas delgadas.
- [x] Tipografía propia auto-alojada (Barlow, 4 pesos en `assets/fonts/`)
- [x] Página 404
- [ ] Deploy (Cloudflare Pages, Netlify o Vercel)

---

## Fuera del sitio (pero es lo que más mueve la aguja)

El sitio por sí solo no genera visitas. Para búsquedas locales el orden de impacto es:

1. **Perfil de Empresa en Google.** El perfil YA EXISTE en Maps (4.6★, 11 reseñas)
   pero está sin reclamar por el negocio. Falta reclamarlo y luego corregir la
   categoría, que hoy dice "Department of Transportation". Es lo que aparece en el
   mapa cuando alguien busca desde el celular.
   El nombre en Maps es "Verificación Federal Prueba Ambiental del Centro,
   S. de R.L. de C.V." — ese mismo va en el JSON-LD del sitio. Si se cambia en un
   lado, cambiarlo en el otro.
2. Este sitio, como destino y respaldo de credibilidad.
3. **Reseñas** — un QR impreso en recepción que abra el formulario.
4. **WhatsApp Business** (no el normal): perfil de negocio, horario y mensaje de
   bienvenida automático. Cero mantenimiento.
5. Directorios: listado de unidades de verificación de la SICT, CANACAR.

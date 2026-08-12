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
├─ robots.txt                  ← para buscadores
├─ sitemap.xml                 ← para buscadores
├─ assets/
│  ├─ css/
│  │  ├─ tokens.css            ← COLORES, TIPOGRAFÍA Y ESPACIOS. Empieza aquí.
│  │  └─ styles.css            ← estilos de cada componente
│  ├─ js/
│  │  └─ main.js               ← carga del mapa + aparición al hacer scroll
│  └─ img/
│     └─ isotipo-pac.svg       ← la hoja del logo, en vectores
└─ .claude/launch.json         ← config del servidor local (no afecta al sitio)
```

Secciones de la página, en orden: barra de ubicación · header · hero con ficha
de datos · servicios · cómo funciona · compromiso · normatividad · preguntas
frecuentes · ubicación con mapa · footer.

### Si vas a tocar algo, lee esto primero

- **Para cambiar un color en todo el sitio** → `assets/css/tokens.css`, sección 4
  ("Roles semánticos"). No cambies colores directamente en `styles.css`.
- **Para cambiar textos** → `index.html`. Cada sección está separada con un
  comentario grande en mayúsculas.
- **Para cambiar el número de WhatsApp** → busca `524491100153` en `index.html`.
  Aparece en 7 lugares.
- **Para llenar un pendiente** → busca en la página lo que salga con recuadro
  ámbar punteado, o busca `class="pendiente"` en `index.html`. Borra la etiqueta
  `<span class="pendiente">…</span>` y escribe el dato real.
- **Si cambia el domicilio** → hay que actualizar dos lugares: el JSON-LD al final
  de `index.html` y las coordenadas en `assets/js/main.js`.

### Dos decisiones técnicas que conviene no deshacer

**El mapa carga hasta que le dan clic.** El iframe de Google pesa cerca de 1 MB y
mete cookies de terceros. Se muestra un panel propio y el mapa real aparece al
primer clic. Los botones de Google Maps y Waze son enlaces normales, así que
funcionan aunque el JavaScript falle.

**La red de seguridad de `main.js`.** El efecto de aparición esconde el contenido
hasta que el navegador avisa que ya se ve en pantalla. Si ese aviso no llega, un
temporizador muestra todo a los 1.5 segundos. Sin eso, un fallo del navegador
dejaría la página en blanco. No borres ese `setTimeout`.

---

## Paleta

Derivada del logo. El detalle importante:

| Token | Hex | Para qué |
|---|---|---|
| `--verde-300` | `#97C45E` | El verde del logo. **Solo hoja, íconos y rellenos.** |
| `--verde-700` | `#46681A` | **Botones y texto verde.** Es el único que pasa contraste AA (6.4:1). |
| `--gris-800` | `#3A3936` | Texto principal |
| `--gris-600` | `#63625D` | El gris del wordmark. Texto secundario. |

El verde del logo es demasiado claro para llevar texto blanco encima (da 2:1, ilegible).
Por eso hay dos verdes distintos y no es un error.

---

## Pendientes

### Bloqueantes para publicar
- [ ] **Horario de atención** — es el dato más buscado de un verificentro.
      Hoy dice "Consulta horarios por WhatsApp", que es un parche.
- [ ] **Logo oficial** del cliente. El de ahora es una reconstrucción vectorial.
- [ ] **Dominio.** Buscar `EJEMPLO.mx` en `index.html` y reemplazar (5 lugares:
      canonical, Open Graph y JSON-LD).
- [ ] **Imagen Open Graph** `assets/img/og-pac.jpg`, 1200×630 px.

### Contenido por confirmar con el cliente
- [ ] Precios o rango de precios
- [ ] Requisitos / qué documentos traer
- [ ] Cuánto tarda el trámite
- [ ] ¿Atienden solo carga federal o también otros vehículos?
- [ ] ¿Número de aprobación SICT? (sería la señal de confianza más fuerte del sitio)
- [ ] ¿La aprobación ya dice SICT o sigue como SCT?
- [ ] Fotos reales del lugar (fachada, acceso, equipo). Sin stock genérico.

### Mejoras posibles
- [ ] **Tipografía propia auto-alojada** (ej. Barlow) en vez de la fuente del
      sistema. Es el cambio que más sube el nivel visual. Se cambia en una línea
      de `tokens.css`, pero hay que descargar los archivos a `assets/fonts/`.
- [ ] **Fotos reales del lugar.** Fachada con el letrero, acceso, equipo, unidad
      en la rampa. Es el mayor salto disponible y solo cuesta un celular y 20 min.
      Sirven también para el Perfil de Empresa en Google.
- [ ] Página 404
- [ ] Deploy en Vercel

---

## Fuera del sitio (pero es lo que más mueve la aguja)

El sitio por sí solo no genera visitas. Para búsquedas locales el orden de impacto es:

1. **Perfil de Empresa en Google** verificado — categoría correcta, horario, fotos,
   teléfono. Es lo que aparece en el mapa cuando alguien busca desde el celular.
2. Este sitio, como destino y respaldo de credibilidad.
3. **Reseñas** — un QR impreso en recepción que abra el formulario.
4. **WhatsApp Business** (no el normal): perfil de negocio, horario y mensaje de
   bienvenida automático. Cero mantenimiento.
5. Directorios: listado de unidades de verificación de la SICT, CANACAR.

/* =============================================================================
   PAC — JavaScript del sitio
   -----------------------------------------------------------------------------
   Son dos cosas nada más:
     1. El mapa de Google, que se carga hasta que el usuario da clic.
     2. La aparición suave de las secciones al hacer scroll.

   Si este archivo se borrara, el sitio seguiría funcionando: el contenido se ve
   igual y el acordeón abre y cierra solo (es HTML nativo). Lo único que se
   perdería es el mapa embebido — por eso los botones de Google Maps y Waze
   están en HTML normal y no dependen de aquí.
   ============================================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------------------------
     1. MAPA — carga diferida ("facade")
     Mostrar el iframe de Google desde el inicio costaría cerca de 1 MB de
     descarga y cookies de terceros para TODOS los visitantes, incluso los que
     nunca miran el mapa. Así que primero se ve un panel propio, y el mapa real
     se inserta apenas alguien lo pide.
     --------------------------------------------------------------------------- */
  var contenedorMapa = document.querySelector('[data-mapa]');

  if (contenedorMapa) {
    var boton = contenedorMapa.querySelector('.mapa__facade');

    boton.addEventListener('click', function () {
      var iframe = document.createElement('iframe');

      // Coordenadas de la unidad. Si algún día cambia el domicilio, este es uno
      // de los dos lugares a actualizar (el otro es el JSON-LD en index.html).
      iframe.src = 'https://maps.google.com/maps?q=21.9548,-102.2959&hl=es&z=17&output=embed';
      iframe.title = 'Mapa de la ubicación de PAC en Jesús María, Aguascalientes';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;

      contenedorMapa.replaceChildren(iframe);
    });
  }

  /* ---------------------------------------------------------------------------
     2. MENÚ MÓVIL — detalles de comodidad
     El menú abre y cierra solo (es un <details> nativo). Aquí únicamente
     agregamos que se cierre al elegir una sección o al tocar fuera, que es lo
     que la gente espera. Si este bloque no corriera, el menú seguiría sirviendo.
     --------------------------------------------------------------------------- */
  var menu = document.querySelector('[data-menu]');

  if (menu) {
    // Al elegir una sección, se cierra el menú
    menu.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () { menu.open = false; });
    });

    // Al tocar fuera del menú, se cierra
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });

    // La tecla Escape también lo cierra
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  /* ---------------------------------------------------------------------------
     3. APARICIÓN AL HACER SCROLL
     Cada elemento con class="revelar" entra con un fundido corto la primera vez
     que se asoma en pantalla. Se desactiva solo si el sistema del usuario pide
     menos animaciones.
     --------------------------------------------------------------------------- */
  var elementos = document.querySelectorAll('.revelar');
  var prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrarTodo() {
    elementos.forEach(function (el) { el.classList.add('visible'); });
  }

  if (!('IntersectionObserver' in window) || prefiereMenosMovimiento) {
    // Navegador viejo o usuario que pidió menos animación: se muestra todo y ya.
    mostrarTodo();
    return;
  }

  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('visible');
      observador.unobserve(entrada.target);   // una sola vez por elemento
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

  elementos.forEach(function (el, i) {
    // Escalonado corto entre elementos hermanos: da sensación de orden, no de show.
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    observador.observe(el);
  });

  /* RED DE SEGURIDAD — no la quites.
     El efecto de aparición esconde el contenido hasta que el observador avisa
     que ya se ve. Si por lo que sea el observador no dispara (navegador raro,
     pestaña en segundo plano, una extensión), el texto se quedaría invisible
     para siempre. Este temporizador garantiza que a los 1.5 s TODO se muestre,
     con animación o sin ella. Vale más una página sin efecto que una página
     en blanco. */
  setTimeout(mostrarTodo, 1500);

})();

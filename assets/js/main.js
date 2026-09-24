/* PAC — interacción progresiva, sin dependencias. */
(function () {
  'use strict';

  /* El mapa se descarga solo cuando la persona decide abrirlo. Los enlaces
     a Google Maps y Waze en el HTML siguen disponibles como alternativa. */
  var contenedorMapa = document.querySelector('[data-mapa]');
  var botonMapa = contenedorMapa && contenedorMapa.querySelector('.mapa__facade');

  if (botonMapa) {
    botonMapa.addEventListener('click', function () {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://maps.google.com/maps?q=21.9548,-102.2959&hl=es&z=17&output=embed';
      iframe.title = 'Mapa de la ubicación de PAC en Jesús María, Aguascalientes';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      iframe.tabIndex = 0;

      // Un enlace visible permanece disponible si el proveedor no responde o
      // si el navegador bloquea el contenido de terceros del iframe.
      var alternativa = document.createElement('a');
      alternativa.className = 'mapa__alternativa';
      alternativa.href = 'https://www.google.com/maps/dir/?api=1&destination=21.9548,-102.2959';
      alternativa.target = '_blank';
      alternativa.rel = 'noopener';
      alternativa.textContent = 'Abrir ubicación en Google Maps ↗';

      var estado = document.createElement('p');
      estado.className = 'mapa__estado';
      estado.setAttribute('role', 'status');
      estado.textContent = 'Cargando el mapa…';
      var esperaMapa = window.setTimeout(function () {
        if (estado.isConnected) estado.textContent = '¿El mapa tarda en cargar? Abre la ruta con el enlace de abajo.';
      }, 10000);

      contenedorMapa.setAttribute('aria-busy', 'true');
      iframe.addEventListener('load', function () {
        window.clearTimeout(esperaMapa);
        estado.remove();
        contenedorMapa.removeAttribute('aria-busy');
      });
      iframe.addEventListener('error', function () {
        window.clearTimeout(esperaMapa);
        contenedorMapa.removeAttribute('aria-busy');
        contenedorMapa.classList.remove('mapa--cargado');
        contenedorMapa.replaceChildren(botonMapa);
        var titulo = botonMapa.querySelector('.mapa__titulo');
        var accion = botonMapa.querySelector('.mapa__cta');
        if (titulo) titulo.textContent = 'No pudimos cargar el mapa';
        if (accion) accion.textContent = 'Volver a intentar';
        botonMapa.focus({ preventScroll: true });
      });

      contenedorMapa.classList.add('mapa--cargado');
      contenedorMapa.replaceChildren(iframe, alternativa, estado);
      iframe.focus({ preventScroll: true });
    });
  }

  /* El menú y los acordeones usan HTML nativo y funcionan sin JavaScript. */
  var menu = document.querySelector('[data-menu]');
  var controlMenu = menu && menu.querySelector('summary');

  if (controlMenu) {
    function actualizarEtiquetaMenu() {
      controlMenu.setAttribute('aria-label', menu.open ? 'Cerrar menú de secciones' : 'Abrir menú de secciones');
    }

    actualizarEtiquetaMenu();
    menu.addEventListener('toggle', actualizarEtiquetaMenu);

    menu.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () { menu.open = false; });
    });

    document.addEventListener('click', function (evento) {
      if (menu.open && !menu.contains(evento.target)) menu.open = false;
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && menu.open) {
        menu.open = false;
        controlMenu.focus();
      }
    });

    // Consulta el CSS para no duplicar el punto de ruptura del diseño.
    window.addEventListener('resize', function () {
      if (menu.open && window.getComputedStyle(menu).display === 'none') menu.open = false;
    });
  }

  /* Indica la sección que se está leyendo en ambas navegaciones. El trabajo
     de scroll se agrupa en un único frame y solo mide los destinos del menú. */
  var enlacesSeccion = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"], .menu__panel a[href^="#"]'));
  var secciones = [];
  enlacesSeccion.forEach(function (enlace) {
    var seccion = document.getElementById(enlace.getAttribute('href').slice(1));
    if (seccion && secciones.indexOf(seccion) === -1) secciones.push(seccion);
  });

  if (secciones.length) {
    var framePendiente = false;

    function actualizarSeccion() {
      framePendiente = false;
      var limite = window.innerHeight * 0.35;
      var actual = null;
      secciones.forEach(function (seccion) {
        if (seccion.getBoundingClientRect().top <= limite) actual = seccion.id;
      });
      enlacesSeccion.forEach(function (enlace) {
        if (enlace.getAttribute('href') === '#' + actual) {
          enlace.setAttribute('aria-current', 'location');
        } else {
          enlace.removeAttribute('aria-current');
        }
      });
    }

    function solicitarActualizacion() {
      if (framePendiente) return;
      framePendiente = true;
      window.requestAnimationFrame(actualizarSeccion);
    }

    window.addEventListener('scroll', solicitarActualizacion, { passive: true });
    window.addEventListener('resize', solicitarActualizacion);
    window.addEventListener('pageshow', solicitarActualizacion);
    actualizarSeccion();
  }

  /* El contenido es visible por defecto. La clase que habilita las entradas
     se añade únicamente después de crear y registrar el observador. */
  var raiz = document.documentElement;
  var elementos = document.querySelectorAll('.revelar');
  var movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var observador;

  function mostrarTodo() {
    elementos.forEach(function (elemento) { elemento.classList.add('visible'); });
    if (observador) observador.disconnect();
  }

  if (!('IntersectionObserver' in window) || movimientoReducido.matches || !elementos.length) {
    mostrarTodo();
    return;
  }

  // Red de seguridad: un observador que no notifique nunca oculta contenido
  // más de 1,5 segundos. Si el archivo no carga, la clase no existe en el HTML.
  window.setTimeout(mostrarTodo, 1500);

  try {
    observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 });

    elementos.forEach(function (elemento, indice) {
      elemento.style.transitionDelay = (indice % 3) * 55 + 'ms';
      observador.observe(elemento);
    });
    raiz.classList.add('reveal-ready');
  } catch (error) {
    raiz.classList.remove('reveal-ready');
    mostrarTodo();
  }

  // También respeta cambios de preferencia mientras la página está abierta.
  if (movimientoReducido.addEventListener) {
    movimientoReducido.addEventListener('change', function (evento) {
      if (evento.matches) {
        raiz.classList.remove('reveal-ready');
        mostrarTodo();
      }
    });
  }
})();

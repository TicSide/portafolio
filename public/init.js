// Se ejecuta antes de pintar: marca si hay movimiento y si toca la intro.
// La intro (contador y cortina) solo aparece en pantallas anchas, una vez por
// sesión: en móvil el contenido llega antes y el nombre entra igual.
(function () {
  var d = document.documentElement;
  if (!window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  d.classList.add('js-motion');
  if (!d.hasAttribute('data-intro') || !matchMedia('(min-width: 64rem)').matches) return;
  try {
    if (!sessionStorage.getItem('or-intro')) {
      d.classList.add('js-intro');
      sessionStorage.setItem('or-intro', '1');
    }
  } catch (e) {}
})();

(function () {
  var hero = document.getElementById('hero');
  var captionEl = document.getElementById('hero-caption');
  var images = window.HERO_IMAGES || [];
  var base = window.HERO_BASE || '/assets/hero/';
  if (!hero || images.length === 0) return;
  var pick = images[Math.floor(Math.random() * images.length)];
  hero.style.backgroundImage = "url('" + base + pick.file + "')";
  if (captionEl && pick.caption) captionEl.textContent = pick.caption;
})();

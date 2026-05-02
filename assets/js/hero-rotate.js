(function () {
  var hero = document.getElementById('hero');
  var captionEl = document.getElementById('hero-caption');
  var prevBtn = document.getElementById('hero-prev');
  var nextBtn = document.getElementById('hero-next');
  var images = window.HERO_IMAGES || [];
  var base = window.HERO_BASE || '/assets/hero/';
  if (!hero || images.length === 0) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  // Hide nav arrows when there's only one image — nothing to browse.
  if (images.length <= 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
  }

  var index = Math.floor(Math.random() * images.length);

  function show(i) {
    index = (i + images.length) % images.length;
    var pick = images[index];
    hero.style.backgroundImage = "url('" + base + pick.file + "')";
    if (captionEl) captionEl.textContent = pick.caption || '';
  }

  show(index);

  if (prevBtn) prevBtn.addEventListener('click', function () { show(index - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () { show(index + 1); });

  // Keyboard arrows when the hero is focused (e.g., a screen-reader user
  // tabs to one of the nav buttons and uses arrow keys).
  hero.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { show(index - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
  });
})();

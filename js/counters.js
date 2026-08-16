(function () {
  var statValues = document.querySelectorAll('.stat-value');
  var items = [];

  statValues.forEach(function (el) {
    var match = el.textContent.trim().match(/^([\d,]+)(.*)$/);
    if (!match) return;
    var target = parseInt(match[1].replace(/,/g, ''), 10);
    var suffix = match[2];
    var start = target * 2;
    items.push({ el: el, target: target, suffix: suffix, start: start });
    el.textContent = start + suffix;
  });

  var statsSection = document.querySelector('.stats');
  if (!statsSection || !items.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    items.forEach(function (item) { item.el.textContent = item.target + item.suffix; });
    return;
  }

  function animateCount(item, duration) {
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(item.start - eased * (item.start - item.target));
      item.el.textContent = value + item.suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        item.el.textContent = item.target + item.suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      items.forEach(function (item) { animateCount(item, 1600); });
      observer.disconnect();
    });
  }, { threshold: 0.4 });

  observer.observe(statsSection);
})();

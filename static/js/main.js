// Page behavior: table-of-contents scroll-spy, reveal-on-scroll, BibTeX copy.
document.addEventListener('DOMContentLoaded', function () {
  const SECTIONS = ['abstract', 'approach', 'results', 'bibtex'];
  const RESULT_SUBS = ['efficiency', 'quality', 'unseen', 'ablations'];

  // ---- Table-of-contents scroll-spy ----
  const tocLinks = document.querySelectorAll('.toc-list a[data-sec]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    // a Results subsection highlights itself and marks "Results" as its parent
    const setActive = (id) => tocLinks.forEach(function (a) {
      a.classList.toggle('active', a.dataset.sec === id);
      a.classList.toggle('parent', a.dataset.sec === 'results' && RESULT_SUBS.includes(id));
    });
    const visible = new Set();
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(e => { if (e.isIntersecting) visible.add(e.target.id); else visible.delete(e.target.id); });
      // prefer a Results subsection in the active band, else the first top-level section
      const current = RESULT_SUBS.find(id => visible.has(id)) || SECTIONS.find(id => visible.has(id));
      if (current) setActive(current);
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    SECTIONS.concat(RESULT_SUBS).forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  // ---- Reveal figures and grow charts once they scroll into view ----
  const revealables = document.querySelectorAll('.reveal, .charts, .ablations');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.2 });
    revealables.forEach(n => io.observe(n));
  } else {
    revealables.forEach(n => n.classList.add('in'));
  }

  // ---- BibTeX copy ----
  const copyBtn = document.getElementById('bibCopy');
  const bibCode = document.getElementById('bibCode');
  if (copyBtn && bibCode) {
    copyBtn.addEventListener('click', function () {
      const text = bibCode.textContent.trim();
      const done = () => { copyBtn.textContent = 'Copied!'; setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(() => window.prompt('Copy BibTeX:', text));
      } else {
        window.prompt('Copy BibTeX:', text);
      }
    });
  }
});

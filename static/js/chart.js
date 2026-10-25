// Animated horizontal bar charts for the collection-efficiency and ablation panels.
// Values come from the paper (collection-efficiency figure and controller ablation).
// Bars grow when their panel becomes visible (main.js adds the "in" class).
(function () {
  const AURA = 'var(--bar-aura)';
  const HUMAN = 'var(--bar-human)';

  // One row per collection group. sep marks the dashed line above the human sub-groups.
  const GROUPS = [
    { name: 'AuRA (Ours)',     ours: true, yield: 74.3, yieldN: '26/35', wall: 126.7, labor: 32.7,   detect: 88.3 },
    { name: 'Human (Overall)',             yield: 26.9, yieldN: '21/78', wall: 284.4, labor: 284.4,  detect: 133.0 },
    { name: 'Human (Amateur)', sep: true,  yield: 7.7,  yieldN: '2/26',  wall: 1108.5, labor: 1108.5, detect: 126.4 },
    { name: 'Human (Trained)',             yield: 15.4, yieldN: '4/26',  wall: 561.8, labor: 561.8,  detect: 158.1 },
    { name: 'Human (Expert)',              yield: 57.7, yieldN: '15/26', wall: 100.6, labor: 100.6,  detect: 89.2 },
  ];

  const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };

  // Time per asset spans 30 s to 1,100 s, so it uses a log axis like the paper.
  const LOG_MIN = 10, LOG_MAX = 2000;
  const logPct = v => (Math.log10(v) - Math.log10(LOG_MIN)) / (Math.log10(LOG_MAX) - Math.log10(LOG_MIN)) * 100;

  function line(widthPct, color, label, delay, thin) {
    const l = el('div', 'hc-line' + (thin ? ' thin' : ''));
    const bar = el('div', 'hc-bar');
    // leave room for the value label after the bar
    bar.style.setProperty('--w', (widthPct * 0.72) + '%');
    bar.style.setProperty('--d', delay + 's');
    bar.style.background = color;
    const val = el('span', 'hc-val', label);
    val.style.setProperty('--d', delay + 's');
    l.appendChild(bar);
    l.appendChild(val);
    return l;
  }

  function chart(root, opts) {
    root.classList.add('hc');
    root.appendChild(el('div', 'hc-title', opts.title));
    root.appendChild(el('div', 'hc-note', opts.note));
    if (opts.legend) root.appendChild(opts.legend);
    opts.rows.forEach(function (r, i) {
      const row = el('div', 'hc-row' + (r.sep ? ' sep' : ''));
      row.appendChild(el('div', 'hc-name' + (r.ours ? ' ours' : ''), r.name));
      const track = el('div', 'hc-track');
      opts.bars(r, i).forEach(b => track.appendChild(b));
      row.appendChild(track);
      root.appendChild(row);
    });
  }

  function legend(items) {
    const lg = el('div', 'hc-legend');
    items.forEach(([label, color, h]) => {
      const s = el('span', null, '<i style="background:' + color + (h ? ';height:' + h + 'px' : '') + '"></i>' + label);
      lg.appendChild(s);
    });
    return lg;
  }

  document.addEventListener('DOMContentLoaded', function () {
    const yieldEl = document.getElementById('chartYield');
    if (yieldEl) chart(yieldEl, {
      title: 'End-to-end yield ↑',
      note: 'reconstructed / attempted',
      rows: GROUPS,
      bars: (r, i) => [line(r.yield, r.ours ? AURA : HUMAN, r.yield + '% <span style="font-weight:500;color:var(--muted)">(' + r.yieldN + ')</span>', i * 0.08)],
    });

    const costEl = document.getElementById('chartCost');
    if (costEl) chart(costEl, {
      title: 'Time per asset (s, log) ↓',
      note: 'equal for human collection',
      legend: legend([['Wall-clock', '#b5b5b5', 8], ['Human labor', AURA, 8]]),
      rows: GROUPS,
      bars: (r, i) => r.ours
        ? [line(logPct(r.wall), '#b5b5b5', r.wall, i * 0.08, true), line(logPct(r.labor), AURA, '<b>' + r.labor + '</b>', i * 0.08 + 0.05, true)]
        : [line(logPct(r.labor), HUMAN, r.labor.toLocaleString('en-US'), i * 0.08)],
    });

    const detectEl = document.getElementById('chartDetect');
    if (detectEl) chart(detectEl, {
      title: 'Failure detection (s) ↓',
      note: 'mean over failed runs',
      rows: GROUPS,
      bars: (r, i) => [line(r.detect / 160 * 100, r.ours ? AURA : HUMAN, r.detect.toFixed(1), i * 0.08)],
    });

    const ctrlEl = document.getElementById('chartController');
    if (ctrlEl) chart(ctrlEl, {
      title: 'Reconstruction success ↑',
      note: 'same 26 robot-collected trajectories',
      rows: [
        { name: 'Robot states (AuRA)', ours: true, v: 100.0, n: '26/26' },
        { name: 'Visual tracking', v: 7.7, n: '2/26' },
      ],
      bars: (r, i) => [line(r.v, r.ours ? AURA : HUMAN, r.v.toFixed(1) + '% <span style="font-weight:500;color:var(--muted)">(' + r.n + ')</span>', i * 0.1)],
    });
  });
})();

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const HOTSPOTS = [
  { cx: 350, cy: 250, r: 8,  color: 'var(--danger)',  city: 'Delhi',     cases: '1,420' },
  { cx: 280, cy: 480, r: 12, color: 'var(--danger)',  city: 'Mumbai',    cases: '2,150' },
  { cx: 380, cy: 600, r: 10, color: 'var(--danger)',  city: 'Bangalore', cases: '1,890' },
  { cx: 420, cy: 520, r: 6,  color: 'var(--warning)', city: 'Hyderabad', cases: '1,100' },
  { cx: 450, cy: 350, r: 7,  color: 'var(--warning)', city: 'Kolkata',   cases: '980'   },
];

export default function InsightsPage() {
  const lineRef  = useRef(null);
  const donutRef = useRef(null);
  const chartInstances = useRef({});
  const [tooltip, setTooltip] = React.useState({ visible: false, text: '', x: 0, y: 0 });

  useEffect(() => {
    if (chartInstances.current.line) return;

    Chart.defaults.color         = '#7a7f99';
    Chart.defaults.font.family   = "'Syne', sans-serif";

    chartInstances.current.line = new Chart(lineRef.current, {
      type: 'line',
      data: {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
          label: 'Complaints',
          data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10),
          borderColor: '#63c740',
          backgroundColor: 'rgba(99,199,64,0.1)',
          tension: 0.4, fill: true, pointRadius: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { grid: { display: false } },
        },
      },
    });

    chartInstances.current.donut = new Chart(donutRef.current, {
      type: 'doughnut',
      data: {
        labels: ['Resolved', 'Under Review', 'Investigating'],
        datasets: [{ data: [1204, 89, 45], backgroundColor: ['#63c740','#EF9F27','#378ADD'], borderWidth: 0 }],
      },
      options: { responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom' } } },
    });

    return () => {
      Object.values(chartInstances.current).forEach(c => c.destroy());
      chartInstances.current = {};
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><div className="card-title">Daily Complaints (30 Days)</div></div>
          <div className="chart-wrapper"><canvas ref={lineRef} /></div>
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Resolution Rate</div></div>
          <div className="chart-wrapper"><canvas ref={donutRef} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div className="card-title">Interactive Threat Map (India)</div></div>
        <div className="map-container" style={{ position: 'relative' }}>
          <svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* Simplified India outline */}
            <path d="M300,60 L350,40 L430,60 L500,120 L560,200 L620,320 L640,420 L600,520 L560,600 L500,680 L440,740 L400,760 L360,740 L310,700 L260,640 L220,560 L180,460 L160,380 L180,280 L220,180 L260,110 Z"
              fill="rgba(17,20,32,0.8)" stroke="rgba(99,199,64,0.3)" strokeWidth="2" />
            {HOTSPOTS.map((h, i) => (
              <g key={i}
                onMouseEnter={e => setTooltip({ visible: true, text: `${h.city}: ${h.cases} Cases`, x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltip({ visible: false })}
                style={{ cursor: 'pointer' }}>
                <circle cx={h.cx} cy={h.cy} r={h.r * 2.5} fill={h.color} opacity="0.15">
                  <animate attributeName="r" values={`${h.r};${h.r * 3};${h.r}`} dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={h.cx} cy={h.cy} r={h.r} fill={h.color} />
              </g>
            ))}
          </svg>
          {tooltip.visible && (
            <div className="map-tooltip" style={{ left: tooltip.x + 15, top: tooltip.y - 40, opacity: 1 }}>
              {tooltip.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

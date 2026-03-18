<template>
  <div class="bento-background" aria-hidden="true">
    <div class="bento-grid">
      <!-- Decorative Mechanical Cells -->
      <div class="bento-cell cell-large cell-1">
        <div class="mech-overlay"></div>
        <div class="grid-lines"></div>
        <div class="blinking-dot"></div>
      </div>
      
      <div class="bento-cell cell-medium cell-2">
        <div class="circuit-pattern"></div>
        <div class="scan-line"></div>
      </div>
      
      <div class="bento-cell cell-small cell-3">
        <svg class="gear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <div class="bento-cell cell-medium cell-4">
        <div class="data-stream"></div>
      </div>
      
      <div class="bento-cell cell-large cell-5">
        <div class="hex-grid"></div>
        <div class="pulse-ring"></div>
      </div>
      
      <div class="bento-cell cell-small cell-6">
        <div class="crosshair"></div>
      </div>
      
      <div class="bento-cell cell-medium cell-7">
        <div class="bar-chart">
          <div class="bar" style="height: 40%"></div>
          <div class="bar" style="height: 70%"></div>
          <div class="bar" style="height: 30%"></div>
          <div class="bar" style="height: 90%"></div>
        </div>
      </div>
    </div>
    <!-- Global gradient mask to fade the grid out so it doesn't overpower text -->
    <div class="fade-mask"></div>
  </div>
</template>

<style scoped>
.bento-background {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  background-color: transparent;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 1rem;
  width: 150vw;
  height: 150vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-10deg) scale(1.1);
  opacity: 0.15;
  transition: opacity 0.5s ease;
}

.dark .bento-grid {
  opacity: 0.25;
}

/* Base Cell Styling - Mechanical Feel */
.bento-cell {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.02);
}

.dark .bento-cell {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(51, 65, 85, 0.5);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.1);
}

/* Asymmetrical Grid Placement */
.cell-1 { grid-column: 1 / 3; grid-row: 1 / 3; }
.cell-2 { grid-column: 3 / 5; grid-row: 1 / 2; }
.cell-3 { grid-column: 5 / 6; grid-row: 1 / 2; }
.cell-4 { grid-column: 3 / 4; grid-row: 2 / 4; }
.cell-5 { grid-column: 4 / 7; grid-row: 2 / 4; }
.cell-6 { grid-column: 1 / 2; grid-row: 3 / 4; }
.cell-7 { grid-column: 2 / 3; grid-row: 3 / 5; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .bento-grid {
    grid-template-columns: repeat(4, 1fr);
    width: 200vw;
  }
  .cell-5 { grid-column: 3 / 5; grid-row: 2 / 4; }
  .cell-3 { display: none; }
}

/* Mechanical Elements & Animations */

/* 1. Grid Lines */
.grid-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(148, 163, 184, 0.2) 1px, transparent 1px),
    linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px);
  background-size: 20px 20px;
}
.dark .grid-lines {
  background-image: 
    linear-gradient(rgba(71, 85, 105, 0.4) 1px, transparent 1px),
    linear-gradient(90deg, rgba(71, 85, 105, 0.4) 1px, transparent 1px);
}

/* 2. Blinking Dot */
.blinking-dot {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 8px;
  height: 8px;
  background-color: #ef4444;
  border-radius: 50%;
  box-shadow: 0 0 10px #ef4444;
  animation: blink 2s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}

/* 3. Circuit Pattern */
.circuit-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.4) 2px, transparent 0);
  background-size: 16px 16px;
}
.dark .circuit-pattern {
  background-image: radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.2) 2px, transparent 0);
}

/* 4. Scan Line */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), transparent);
  animation: scan 4s linear infinite;
}
@keyframes scan {
  0% { transform: translateY(-10px); }
  100% { transform: translateY(300px); }
}

/* 5. Gear Icon */
.gear-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 50%;
  transform: translate(-50%, -50%);
  color: rgba(148, 163, 184, 0.5);
  animation: spin 20s linear infinite;
}
.dark .gear-icon { color: rgba(148, 163, 184, 0.3); }
@keyframes spin { 100% { transform: translate(-50%, -50%) rotate(360deg); } }

/* 6. Data Stream */
.data-stream {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    180deg,
    rgba(148, 163, 184, 0.1) 0,
    rgba(148, 163, 184, 0.1) 2px,
    transparent 2px,
    transparent 8px
  );
  animation: scrollData 10s linear infinite;
}
.dark .data-stream {
  background: repeating-linear-gradient(
    180deg,
    rgba(71, 85, 105, 0.3) 0,
    rgba(71, 85, 105, 0.3) 2px,
    transparent 2px,
    transparent 8px
  );
}
@keyframes scrollData {
  0% { background-position: 0 0; }
  100% { background-position: 0 100px; }
}

/* 7. Pulse Ring */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(99, 102, 241, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}
@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
}

/* 8. Crosshair */
.crosshair {
  position: absolute;
  inset: 20%;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 50%;
}
.crosshair::before, .crosshair::after {
  content: '';
  position: absolute;
  background: rgba(148, 163, 184, 0.3);
}
.crosshair::before { top: -10px; bottom: -10px; left: 50%; width: 1px; transform: translateX(-50%); }
.crosshair::after { left: -10px; right: -10px; top: 50%; height: 1px; transform: translateY(-50%); }

/* 9. Bar Chart */
.bar-chart {
  position: absolute;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  height: 60%;
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.bar {
  flex: 1;
  background: rgba(148, 163, 184, 0.3);
  border-radius: 2px 2px 0 0;
  animation: equalize 4s ease-in-out infinite alternate;
}
.dark .bar { background: rgba(99, 102, 241, 0.4); }
.bar:nth-child(1) { animation-delay: 0s; }
.bar:nth-child(2) { animation-delay: -1s; }
.bar:nth-child(3) { animation-delay: -2s; }
.bar:nth-child(4) { animation-delay: -3s; }

@keyframes equalize {
  0% { transform: scaleY(0.5); transform-origin: bottom; }
  100% { transform: scaleY(1.2); transform-origin: bottom; }
}

/* Fade Mask to ensure readability of foreground content */
.fade-mask {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 20%, #ffffff 80%);
  z-index: 1;
}
.dark .fade-mask {
  background: radial-gradient(circle at center, transparent 20%, #020617 80%);
}
</style>
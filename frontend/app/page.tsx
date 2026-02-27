"use client";

import { useEffect, useRef, useState, useCallback, CSSProperties } from "react";

function randRange(a: number, b: number) { return a + Math.random() * (b - a); }

const CSS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  html,body{overflow:hidden!important;margin:0;padding:0;}
  *{box-sizing:border-box;}
  .orb{font-family:'Orbitron',monospace;}
  .stm{font-family:'Share Tech Mono',monospace;}
  .metal-frame{
    background:linear-gradient(135deg,#2a3a4a 0%,#1a2535 15%,#0d1520 30%,#1a2535 45%,#243040 60%,#1a2535 100%);
    box-shadow:inset 0 1px 0 rgba(100,160,220,0.3),0 0 30px rgba(0,80,160,0.4);
  }
  .metal-dark{
    background:linear-gradient(180deg,#0d1218 0%,#141e2a 20%,#0a1018 50%,#141e2a 80%,#0d1218 100%);
    box-shadow:inset 0 1px 0 rgba(0,100,180,0.2),inset 2px 0 8px rgba(0,0,0,0.5),inset -2px 0 8px rgba(0,0,0,0.5);
  }
  .glass-sheen{position:relative;}
  .glass-sheen::after{content:'';position:absolute;top:0;left:0;right:0;bottom:0;background:linear-gradient(135deg,rgba(255,255,255,0.04) 0%,transparent 50%,rgba(0,0,0,0.1) 100%);border-radius:inherit;pointer-events:none;}
  .bolt{width:8px;height:8px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4a6070,#1a2530);box-shadow:inset 0 1px 0 rgba(255,255,255,0.15),0 1px 2px rgba(0,0,0,0.8);}
  .instrument{background:radial-gradient(ellipse at 35% 30%,rgba(0,20,50,0.92),rgba(0,5,18,0.98));border:1px solid rgba(0,120,200,0.3);box-shadow:inset 0 0 20px rgba(0,0,0,0.8),0 0 10px rgba(0,80,160,0.2);}
  @keyframes ignBtnGlow{0%,100%{box-shadow:0 0 20px rgba(0,120,220,0.5),0 0 50px rgba(0,80,180,0.2);}50%{box-shadow:0 0 35px rgba(0,160,255,0.7),0 0 80px rgba(0,120,220,0.3);}}
  @keyframes ejectBtnGlow{0%,100%{box-shadow:0 0 20px rgba(200,40,20,0.6),0 0 50px rgba(160,20,0,0.3);}50%{box-shadow:0 0 40px rgba(255,60,30,0.9),0 0 100px rgba(200,30,0,0.5);}}
  @keyframes blinkAnim{0%,49%{opacity:1;}50%,100%{opacity:0.2;}}
  @keyframes pulseGlow{0%,100%{opacity:0.7;}50%{opacity:1;}}
  @keyframes missionPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.85);}15%{opacity:1;transform:translate(-50%,-50%) scale(1.03);}85%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(0.95);}}
  .ign-btn{animation:ignBtnGlow 3s ease-in-out infinite;}
  .ign-btn:hover{filter:brightness(1.25);}
  .eject-btn{animation:ejectBtnGlow 0.8s ease-in-out infinite;}
  .blink{animation:blinkAnim 1s step-end infinite;}
  .pulse{animation:pulseGlow 2s ease-in-out infinite;}
  ::-webkit-scrollbar{display:none;}
  .led-green{width:6px;height:6px;border-radius:50%;background:#00e060;box-shadow:0 0 5px #00e060;}
  .led-red{width:6px;height:6px;border-radius:50%;background:#ff3030;box-shadow:0 0 5px #ff3030;}
  .led-blue{width:6px;height:6px;border-radius:50%;background:#00a8ff;box-shadow:0 0 5px #00a8ff;}
  .led-off{width:6px;height:6px;border-radius:50%;background:#1a2530;}
  .knob{width:28px;height:28px;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 35% 30%,#3a5060,#0d1a22);border:1px solid rgba(0,100,160,0.4);box-shadow:inset 0 2px 4px rgba(0,0,0,0.8);position:relative;}
  .knob::after{content:'';position:absolute;top:4px;left:50%;transform:translateX(-50%);width:2px;height:7px;background:rgba(0,180,255,0.7);border-radius:1px;}
  .toggle-base{width:34px;height:16px;border-radius:8px;background:rgba(0,80,160,0.55);border:1px solid rgba(0,80,140,0.4);box-shadow:inset 0 2px 3px rgba(0,0,0,0.6);position:relative;}
  .toggle-thumb{position:absolute;top:2px;left:18px;width:12px;height:12px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#40a0ff,#0060c0);box-shadow:0 1px 3px rgba(0,0,0,0.7);}
`;

export default function SpaceshipPomodoro() {
  const canvasRef     = useRef<HTMLCanvasElement>(null);
  const starsRef      = useRef<any[]>([]);
  const largeObjRef   = useRef<any[]>([]);
  const dustRef       = useRef<any[]>([]);
  const galaxiesRef   = useRef<any[]>([]);
  const milkyWayStarsRef = useRef<any[]>([]);
  const animRef       = useRef(0);
  const tRef          = useRef(0);
  const isRunningRef  = useRef(false);
  const isEjectingRef = useRef(false);
  const warpSpeedRef  = useRef(0);
  const gForceRef     = useRef(0);
  const timeLeftRef   = useRef(25 * 60);
  const progressRef   = useRef(0);
  const warpPhaseRef  = useRef("idle");
  const missionRef    = useRef(false);
  const distanceRef   = useRef(0);
  const warpAnimRef   = useRef(0);

  const TOTAL = 25 * 60;
  const SPEED = 2777777;

  const [timeLeft,    setTimeLeft]    = useState(TOTAL);
  const [distance,    setDistance]    = useState(0);
  const [gForce,      setGForce]      = useState(0);
  const [isRunning,   setIsRunning]   = useState(false);
  const [isEjecting,  setIsEjecting]  = useState(false);
  const [warpPhase,   setWarpPhase]   = useState("idle");
  const [isMounted,   setIsMounted]   = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [warpSpeed,   setWarpSpeed]   = useState(0);

  useEffect(() => { isRunningRef.current  = isRunning;  }, [isRunning]);
  useEffect(() => { isEjectingRef.current = isEjecting; }, [isEjecting]);
  useEffect(() => { gForceRef.current     = gForce;     }, [gForce]);
  useEffect(() => { timeLeftRef.current   = timeLeft;   }, [timeLeft]);
  useEffect(() => { progressRef.current   = (TOTAL - timeLeft) / TOTAL; }, [timeLeft]);
  useEffect(() => { warpPhaseRef.current  = warpPhase;  }, [warpPhase]);
  useEffect(() => { missionRef.current    = missionDone; }, [missionDone]);
  useEffect(() => { distanceRef.current   = distance;   }, [distance]);
  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    cancelAnimationFrame(warpAnimRef.current);
    const target = isRunning ? 1 : 0;
    const step = () => {
      const c = warpSpeedRef.current;
      const d = target - c;
      if (Math.abs(d) < 0.001) { warpSpeedRef.current = target; setWarpSpeed(target); return; }
      warpSpeedRef.current = c + d * (isRunning ? 0.025 : 0.04);
      setWarpSpeed(warpSpeedRef.current);
      warpAnimRef.current = requestAnimationFrame(step);
    };
    warpAnimRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(warpAnimRef.current);
  }, [isRunning]);

  const startWarp = useCallback(() => {
    setWarpPhase("spinup");
    setTimeout(() => { setIsRunning(true); setWarpPhase("warp"); }, 1200);
  }, []);

  const stopWarp = useCallback(() => {
    setWarpPhase("spindown");
    setTimeout(() => { setIsRunning(false); setWarpPhase("idle"); }, 900);
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(p => { const n = p - 1; timeLeftRef.current = n; return n; });
        setDistance(p => p + SPEED);
        const gf = (Math.random() - 0.5) * 2.2;
        setGForce(gf); gForceRef.current = gf;
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      stopWarp();
      setMissionDone(true); missionRef.current = true;
      setTimeout(() => { setMissionDone(false); missionRef.current = false; }, 5000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, stopWarp]);

  const handleEject = useCallback(() => {
    if (isEjecting) return;
    setIsEjecting(true); isEjectingRef.current = true;
    setWarpPhase("idle");
    setTimeout(() => {
      setIsRunning(false);  isRunningRef.current  = false;
      setIsEjecting(false); isEjectingRef.current = false;
      setTimeLeft(TOTAL);   timeLeftRef.current   = TOTAL;
      setDistance(0);       distanceRef.current   = 0;
      setGForce(0);         gForceRef.current     = 0;
      warpSpeedRef.current  = 0;
    }, 2200);
  }, [isEjecting]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COLORS = ["#ffffff","#ffffff","#ffffff","#cce0ff","#cce0ff","#fffacc","#ffd0a0","#ffaaaa"];

    const initObjects = (W: number, H: number) => {
      const DEPTH = 4000;
      
      // 通常の星を増やす（2500→4000個）
      starsRef.current = Array.from({ length: 4000 }, () => ({
        wx: randRange(-W * 3, W * 3), wy: randRange(-H * 3, H * 3), wz: randRange(100, DEPTH),
        r: randRange(0.3, 2.8), color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        tp: Math.random() * Math.PI * 2, ts: randRange(0.015, 0.06),
      }));

      // 天の川の星（密集地帯）
      milkyWayStarsRef.current = Array.from({ length: 1500 }, () => {
        const angle = randRange(-0.3, 0.3); // 帯状に配置
        const dist = randRange(0, W * 2.5);
        return {
          wx: Math.cos(angle) * dist,
          wy: Math.sin(angle) * dist + randRange(-H * 0.4, H * 0.4),
          wz: randRange(100, DEPTH),
          r: randRange(0.2, 1.2),
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          tp: Math.random() * Math.PI * 2,
          ts: randRange(0.01, 0.05),
        };
      });

      // 遠方の銀河
      galaxiesRef.current = Array.from({ length: 8 }, () => ({
        wx: randRange(-W * 2, W * 2),
        wy: randRange(-H * 2, H * 2),
        wz: randRange(2000, DEPTH * 0.95),
        size: randRange(3, 8),
        angle: Math.random() * Math.PI * 2,
        hue: randRange(180, 280),
      }));

      largeObjRef.current = Array.from({ length: 18 }, (_, i) => {
        const type = i < 6 ? "star" : i < 13 ? "asteroid" : "planet";
        return {
          wx: randRange(-W * 2.5, W * 2.5), wy: randRange(-H * 2, H * 2), wz: randRange(300, DEPTH),
          br: type === "star" ? randRange(3, 10) : type === "planet" ? randRange(12, 30) : randRange(4, 14),
          type,
          hue: type === "star" ? randRange(30, 60) : type === "planet" ? randRange(160, 300) : randRange(20, 50),
          sat: type === "star" ? randRange(60, 90) : type === "planet" ? randRange(40, 70) : randRange(10, 30),
          bri: type === "star" ? randRange(70, 100) : type === "planet" ? randRange(30, 60) : randRange(30, 55),
          angle: Math.random() * Math.PI * 2,
        };
      });

      // 星間塵を増やして色バリエーション追加
      dustRef.current = Array.from({ length: 600 }, () => ({
        wx: randRange(-W * 2.5, W * 2.5), wy: randRange(-H * 2.5, H * 2.5),
        wz: randRange(50, 2000), op: randRange(0.03, 0.25),
        hue: randRange(180, 240), // 青系の色バリエーション
      }));
    };

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      initObjects(canvas.width, canvas.height);
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      const t  = ++tRef.current;
      const W  = canvas.width;
      const H  = canvas.height;
      const ws = warpSpeedRef.current;
      const ej = isEjectingRef.current;
      const FOCAL = W * 0.7;
      const MAX_Z = 4000;
      const SPD   = 3 + ws * 110 + (ej ? 300 : 0);
      const cx = W / 2;
      const cy = H / 2;

      // より深い宇宙の背景グラデーション
      const bgG = ctx.createRadialGradient(cx * 0.85, cy * 0.65, 0, cx, cy, Math.hypot(W, H) * 0.9);
      bgG.addColorStop(0,    ws > 0.05 ? "#080520" : "#060318");
      bgG.addColorStop(0.3,  ws > 0.05 ? "#040315" : "#030210");
      bgG.addColorStop(0.65, ws > 0.05 ? "#02020d" : "#01010a");
      bgG.addColorStop(1,    "#000000");
      ctx.fillStyle = bgG;
      ctx.fillRect(0, 0, W, H);

      // 強化された星雲（複数レイヤー）
      const nebula = (nx: number, ny: number, rx: number, ry: number, hue: number, al: number, layers = 3) => {
        ctx.save();
        ctx.translate(nx, ny);
        
        // 複数レイヤーで深みを出す
        for (let layer = 0; layer < layers; layer++) {
          const layerScale = 1 - (layer * 0.25);
          const layerAlpha = al * (1 - layer * 0.3);
          
          ctx.save();
          ctx.scale(layerScale, (ry / rx) * layerScale);
          
          const ng = ctx.createRadialGradient(
            Math.sin(t * 0.001 + layer) * 20, 
            Math.cos(t * 0.0015 + layer) * 15, 
            0, 
            0, 0, rx
          );
          ng.addColorStop(0,    "hsla(" + (hue + layer * 15) + ",75%,65%," + layerAlpha + ")");
          ng.addColorStop(0.35, "hsla(" + (hue + 25 + layer * 10) + ",60%,45%," + (layerAlpha * 0.6) + ")");
          ng.addColorStop(0.7,  "hsla(" + (hue + layer * 20) + ",50%,35%," + (layerAlpha * 0.25) + ")");
          ng.addColorStop(1,    "hsla(" + hue + ",45%,25%,0)");
          
          ctx.fillStyle = ng;
          ctx.beginPath();
          ctx.arc(0, 0, rx, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      };

      const na = 0.028 + ws * 0.015;
      nebula(W * 0.12, H * 0.28,  350, 180, 215, na * (0.95 + Math.sin(t * 0.004) * 0.1), 4);
      nebula(W * 0.82, H * 0.58,  280, 140, 265, na * (0.85 + Math.sin(t * 0.006) * 0.1), 3);
      nebula(W * 0.58, H * 0.12,  220, 110, 195, na * 0.75, 3);
      nebula(W * 0.25, H * 0.78,  190,  95, 295, na * 0.9, 3);
      nebula(W * 0.70, H * 0.25,  160,  80, 245, na * 0.65, 2);

      // 天の川の光の帯
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.25);
      const milkyGrad = ctx.createLinearGradient(-W * 0.6, -H * 0.3, W * 0.6, H * 0.3);
      milkyGrad.addColorStop(0,    "hsla(220,40%,45%,0)");
      milkyGrad.addColorStop(0.25, "hsla(215,45%,50%," + (0.015 + ws * 0.008) + ")");
      milkyGrad.addColorStop(0.5,  "hsla(210,50%,55%," + (0.025 + ws * 0.012) + ")");
      milkyGrad.addColorStop(0.75, "hsla(215,45%,50%," + (0.015 + ws * 0.008) + ")");
      milkyGrad.addColorStop(1,    "hsla(220,40%,45%,0)");
      ctx.fillStyle = milkyGrad;
      ctx.fillRect(-W, -H * 0.4, W * 2, H * 0.8);
      ctx.restore();

      // 遠方の銀河
      galaxiesRef.current.forEach(gal => {
        gal.wz -= SPD * 0.15;
        gal.angle += 0.001;
        if (gal.wz < 50) {
          gal.wz = MAX_Z * 0.95;
          gal.wx = randRange(-W * 2, W * 2);
          gal.wy = randRange(-H * 2, H * 2);
        }

        const px = cx + (gal.wx / gal.wz) * FOCAL;
        const py = cy + (gal.wy / gal.wz) * FOCAL;
        if (px < -100 || px > W + 100 || py < -100 || py > H + 100) return;

        const dep = 1 - gal.wz / MAX_Z;
        const size = gal.size * dep * 2;
        if (size < 0.3) return;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(gal.angle);
        ctx.globalAlpha = dep * 0.4;

        // 渦巻き銀河の描画
        const galaxyGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        galaxyGrad.addColorStop(0,   "hsl(" + gal.hue + ",60%,70%)");
        galaxyGrad.addColorStop(0.5, "hsl(" + (gal.hue + 15) + ",45%,50%)");
        galaxyGrad.addColorStop(1,   "transparent");
        
        ctx.fillStyle = galaxyGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 2, size * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 改善された星間塵
      dustRef.current.forEach(d => {
        d.wz -= SPD * 0.2;
        if (d.wz < 1) {
          d.wz = MAX_Z;
          d.wx = randRange(-W * 2.5, W * 2.5);
          d.wy = randRange(-H * 2.5, H * 2.5);
        }
        const px = cx + (d.wx / d.wz) * FOCAL;
        const py = cy + (d.wy / d.wz) * FOCAL;
        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) return;
        
        const dep = 1 - d.wz / MAX_Z;
        ctx.globalAlpha = d.op * dep * 0.7;
        ctx.fillStyle = "hsl(" + d.hue + ",70%,70%)";
        ctx.beginPath();
        ctx.arc(px, py, 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      largeObjRef.current.forEach(obj => {
        obj.wz -= SPD * 0.6 + ws * 5; obj.angle += 0.003 + ws * 0.005;
        if (obj.wz < 50) { obj.wz = MAX_Z * 0.9; obj.wx = randRange(-W * 2, W * 2); obj.wy = randRange(-H * 1.8, H * 1.8); }
        const px = cx + (obj.wx / obj.wz) * FOCAL;
        const py = cy + (obj.wy / obj.wz) * FOCAL;
        if (px < -200 || px > W + 200 || py < -200 || py > H + 200) return;
        const dep = 1 - obj.wz / MAX_Z;
        const rad = obj.br * dep * (FOCAL / 600) * 4;
        if (rad < 0.5) return;
        if (obj.type === "star") {
          const gr = ctx.createRadialGradient(px, py, 0, px, py, rad * 5);
          gr.addColorStop(0,    "hsla(" + obj.hue + "," + obj.sat + "%," + obj.bri + "%," + (dep * 0.9) + ")");
          gr.addColorStop(0.25, "hsla(" + obj.hue + "," + obj.sat + "%," + (obj.bri * 0.7) + "%," + (dep * 0.3) + ")");
          gr.addColorStop(1,    "transparent");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, rad * 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "hsl(" + obj.hue + "," + obj.sat + "%," + obj.bri + "%)";
          ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
        } else if (obj.type === "planet") {
          const pg = ctx.createRadialGradient(px - rad * 0.3, py - rad * 0.3, rad * 0.05, px, py, rad);
          pg.addColorStop(0,   "hsl(" + (obj.hue + 20) + "," + (obj.sat + 20) + "%," + (obj.bri + 20) + "%)");
          pg.addColorStop(0.6, "hsl(" + obj.hue + "," + obj.sat + "%," + obj.bri + "%)");
          pg.addColorStop(1,   "hsl(" + (obj.hue - 10) + "," + (obj.sat - 10) + "%," + (obj.bri * 0.3) + "%)");
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
          if (obj.hue < 240 && rad > 12) {
            ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.25);
            ctx.strokeStyle = "hsla(" + (obj.hue + 10) + ",50%,70%," + (dep * 0.35) + ")"; ctx.lineWidth = rad * 0.5;
            ctx.beginPath(); ctx.arc(0, 0, rad * 1.7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          }
        } else {
          ctx.save(); ctx.translate(px, py); ctx.rotate(obj.angle);
          const ag = ctx.createRadialGradient(-rad * 0.2, -rad * 0.2, 0, 0, 0, rad * 1.2);
          ag.addColorStop(0, "hsl(" + obj.hue + "," + obj.sat + "%," + obj.bri + "%)");
          ag.addColorStop(1, "hsl(" + obj.hue + "," + (obj.sat * 0.5) + "%," + (obj.bri * 0.3) + "%)");
          ctx.fillStyle = ag; ctx.beginPath();
          for (let k = 0; k < 7; k++) {
            const a = (k / 7) * Math.PI * 2;
            const rr = rad * (0.7 + 0.3 * Math.sin(k * 2.3 + obj.angle * 3));
            if (k === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
            else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
          }
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
      });

      // 天の川の星
      milkyWayStarsRef.current.forEach(s => {
        s.wz -= SPD * 0.5;
        s.tp += s.ts;
        if (s.wz < 1) {
          s.wz = MAX_Z;
          const angle = randRange(-0.3, 0.3);
          const dist = randRange(0, W * 2.5);
          s.wx = Math.cos(angle) * dist;
          s.wy = Math.sin(angle) * dist + randRange(-H * 0.4, H * 0.4);
        }
        const px = cx + (s.wx / s.wz) * FOCAL;
        const py = cy + (s.wy / s.wz) * FOCAL;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        
        const dep = Math.max(0, 1 - s.wz / MAX_Z);
        const al = (0.15 + dep * 0.85) * (0.7 + Math.sin(s.tp) * 0.3);
        const rad = Math.max(0.3, s.r * dep * 0.7);
        
        ctx.globalAlpha = al;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 通常の星
      starsRef.current.forEach(s => {
        s.wz -= SPD; s.tp += s.ts;
        if (s.wz < 1) { s.wz = MAX_Z; s.wx = randRange(-W * 3, W * 3); s.wy = randRange(-H * 3, H * 3); }
        const px = cx + (s.wx / s.wz) * FOCAL;
        const py = cy + (s.wy / s.wz) * FOCAL;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        const dep = Math.max(0, 1 - s.wz / MAX_Z);
        if (ws > 0.05) {
          const pz  = s.wz + SPD;
          const ppx = cx + (s.wx / pz) * FOCAL;
          const ppy = cy + (s.wy / pz) * FOCAL;
          if (Math.hypot(px - ppx, py - ppy) < 0.3) return;
          const hue = s.color === "#cce0ff" ? 210 : s.color === "#ffd0a0" ? 25 : s.color === "#ffaaaa" ? 350 : 195;
          const al  = (0.15 + dep * 0.85) * ws;
          const sg  = ctx.createLinearGradient(ppx, ppy, px, py);
          sg.addColorStop(0, "hsla(" + hue + ",90%,90%,0)");
          sg.addColorStop(1, "hsla(" + hue + ",100%,97%," + al + ")");
          ctx.strokeStyle = sg; ctx.lineWidth = Math.max(0.3, s.r * dep * (ws > 0.5 ? 2.0 : 1.2)); ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(ppx, ppy); ctx.lineTo(px, py); ctx.stroke();
        } else {
          const al  = (0.1 + dep * 0.9) * (0.6 + Math.sin(s.tp) * 0.4);
          const rad = Math.max(0.3, s.r * dep * 0.8);
          ctx.globalAlpha = al; ctx.fillStyle = s.color;
          ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        }
      });

      if (ws > 0.1) {
        const wr = ws * ws;
        for (let ring = 0; ring < 3; ring++) {
          const phase = (t * 0.04 + ring * 0.33) % 1;
          ctx.strokeStyle = "rgba(80,180,255," + ((1 - phase) * 0.12 * wr) + ")";
          ctx.lineWidth   = 1 + (1 - phase) * 2;
          ctx.beginPath(); ctx.arc(cx, cy, phase * Math.min(W, H) * 0.45 * wr, 0, Math.PI * 2); ctx.stroke();
        }
      }

      if (ej) {
        const bp  = 0.35 + Math.sin(t * 0.35) * 0.2;
        const bG  = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.6);
        bG.addColorStop(0,    "rgba(255,200,60," + bp + ")");
        bG.addColorStop(0.15, "rgba(255,80,10,"  + (bp * 0.7) + ")");
        bG.addColorStop(1,    "transparent");
        ctx.fillStyle = bG; ctx.fillRect(0, 0, W, H);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  const fmt = (s: number) => {
    const m  = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return m + ":" + ss;
  };

  const progress   = (TOTAL - timeLeft) / TOTAL;
  const fuel       = Math.max(0, 1 - progress);
  const fuelCol    = fuel > 0.4 ? "#00c8ff" : fuel > 0.15 ? "#ffaa00" : "#ff4444";
  const gfAbs      = Math.abs(gForce);
  const gfCol      = gfAbs > 1.8 ? "#ff4444" : "#00d8ff";
  const engCol     = isEjecting ? "#ff4444" : isRunning ? "#40d8ff" : "#506070";

  const S: Record<string, CSSProperties> = {
    root:   { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", background: "#080818", userSelect: "none", fontFamily: "Courier New, monospace" },
    canvas: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "block", width: "100%", height: "100%" },
    layout: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", pointerEvents: "none" },
    topRow: { flex: 1, display: "flex", minHeight: 0, overflow: "hidden" },
    leftCol: { width: "clamp(130px,13vw,190px)", flexShrink: 0, display: "flex", flexDirection: "column", padding: "12px 10px", gap: "10px", borderRight: "2px solid rgba(0,100,180,0.25)", pointerEvents: "all" },
    rightCol: { width: "clamp(130px,13vw,190px)", flexShrink: 0, display: "flex", flexDirection: "column", padding: "12px 10px", gap: "10px", borderLeft: "2px solid rgba(0,100,180,0.25)", pointerEvents: "all" },
    window: { flex: 1, position: "relative", overflow: "hidden" },
    bottomPanel: { flexShrink: 0, height: "clamp(155px,21vh,235px)", borderTop: "3px solid rgba(0,120,200,0.4)", display: "flex", alignItems: "stretch", padding: "10px 16px", gap: "12px", pointerEvents: "all", position: "relative" },
  };

  return (
    <div style={S.root}>
      <style>{CSS_STYLES}</style>
      <canvas ref={canvasRef} style={S.canvas} />
      {isMounted && (
        <div style={S.layout}>
          <div style={S.topRow}>

            <div className="metal-dark" style={S.leftCol}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>
              <div className="instrument glass-sheen" style={{ borderRadius: "10px", padding: "12px 8px", textAlign: "center", position: "relative" }}>
                <div className="stm" style={{ fontSize: "9px", letterSpacing: "3px", color: "rgba(0,160,255,0.5)", marginBottom: "6px" }}>MISSION TIME</div>
                <div className="orb" style={{ fontSize: "clamp(20px,3.2vw,30px)", fontWeight: 900, color: timeLeft < 300 ? "#ff4444" : timeLeft < 600 ? "#ffaa00" : "#fff", textShadow: timeLeft < 300 ? "0 0 20px rgba(255,60,60,0.8)" : "0 0 15px rgba(255,255,255,0.3)", letterSpacing: "2px", lineHeight: 1 }}>{fmt(timeLeft)}</div>
                <div style={{ marginTop: "8px", height: "3px", background: "rgba(0,40,80,0.6)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (progress * 100) + "%", background: "linear-gradient(90deg,#00c8ff,#7050ff,#ff4060)", boxShadow: "0 0 6px rgba(0,200,255,0.6)", transition: "width 1s linear" }} />
                </div>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,200,0.5)", marginTop: "4px" }}>{Math.round(progress * 100)}% ELAPSED</div>
              </div>
              <div style={{ background: "rgba(0,10,25,0.6)", border: "1px solid rgba(0,80,140,0.25)", borderRadius: "8px", padding: "8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "4px" }}>TARGET</div>
                <div className="stm" style={{ fontSize: "9px", color: "rgba(0,140,200,0.7)" }}>M31 ANDROMEDA</div>
              </div>
              <div className="instrument" style={{ borderRadius: "8px", padding: "8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "4px" }}>DISTANCE</div>
                <div className="orb" style={{ fontSize: "11px", fontWeight: 700, color: "#b090ff", textShadow: "0 0 10px rgba(150,100,255,0.6)" }}>{distance.toLocaleString()} km</div>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(80,60,140,0.5)", marginTop: "3px" }}>{(distance / 9.461e12).toFixed(6)} ly</div>
              </div>
              <div className="instrument" style={{ borderRadius: "8px", padding: "8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "4px" }}>G-FORCE</div>
                <div className="orb" style={{ fontSize: "18px", fontWeight: 700, color: gfCol, textShadow: "0 0 10px " + gfCol, textAlign: "center" }}>{gfAbs.toFixed(2)}G</div>
                <div style={{ marginTop: "6px", height: "4px", background: "rgba(0,30,60,0.7)", borderRadius: "2px", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", height: "100%", width: Math.min(gfAbs / 2.5 * 50, 50) + "%", left: "50%", transform: "translateX(" + (gForce >= 0 ? "0" : "-100%") + ")", background: gfCol, borderRadius: "2px" }} />
                  <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(0,160,255,0.4)" }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "auto", paddingBottom: "4px" }}>
                <div className="knob" /><div className="knob" /><div className="knob" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>
            </div>

            <div style={S.window}>
              <div style={{ position: "absolute", top: "-6px", left: "-6px", right: "-6px", bottom: "-6px", borderRadius: "38% / 32%", boxShadow: "inset 0 0 0 clamp(14px,2.2vw,26px) #0b1220, inset 0 0 0 clamp(16px,2.5vw,29px) rgba(0,90,170,0.35), inset 0 0 0 clamp(18px,2.8vw,32px) rgba(0,0,0,0.55), 0 0 50px rgba(0,80,160,0.35)", pointerEvents: "none", zIndex: 5 }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(135deg,rgba(100,160,220,0.04) 0%,transparent 40%,rgba(0,0,0,0.14) 100%)", zIndex: 4, pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 40%,transparent 35%,rgba(0,5,20,0.38) 65%,rgba(0,0,10,0.68) 100%)", zIndex: 3, pointerEvents: "none" }} />
              {missionDone && (
                <div style={{ position: "absolute", top: "50%", left: "50%", zIndex: 20, animation: "missionPop 5s ease-out forwards", background: "rgba(0,18,12,0.92)", border: "1px solid rgba(80,255,160,0.4)", borderRadius: "12px", padding: "20px 40px", textAlign: "center", pointerEvents: "none" }}>
                  <div className="orb" style={{ fontSize: "clamp(14px,2.2vw,26px)", fontWeight: 900, color: "#a0ffc0", textShadow: "0 0 20px rgba(80,255,160,0.8)" }}>MISSION COMPLETE</div>
                  <div className="stm" style={{ fontSize: "clamp(9px,1.1vw,12px)", color: "rgba(80,200,140,0.8)", marginTop: "8px" }}>ANDROMEDA REACHED</div>
                </div>
              )}
            </div>

            <div className="metal-dark" style={S.rightCol}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>
              <div className="instrument glass-sheen" style={{ borderRadius: "10px", padding: "10px 8px", position: "relative" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "6px" }}>ENGINE</div>
                <div className="stm" style={{ fontSize: "10px", fontWeight: "bold", color: engCol, textShadow: "0 0 8px " + engCol, lineHeight: 1.3 }}>{isEjecting ? "EMERGENCY" : isRunning ? "HYPERDRIVE" : "STANDBY"}</div>
                <div style={{ display: "flex", gap: "2px", marginTop: "8px" }}>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const on  = i < Math.round(progress * 8);
                    const col = i < 5 ? "#00c8ff" : i < 7 ? "#ffaa00" : "#ff3300";
                    return <div key={i} style={{ flex: 1, height: "7px", borderRadius: "1px", background: on ? col : "rgba(10,25,50,0.7)", boxShadow: on ? ("0 0 4px " + col) : "none", transition: "all 0.5s" }} />;
                  })}
                </div>
                {warpSpeed > 0.05 && (
                  <div className="orb" style={{ fontSize: "13px", fontWeight: 700, color: "#40c8ff", textShadow: "0 0 10px rgba(0,180,255,0.6)", marginTop: "6px", textAlign: "center" }}>x{Math.round(warpSpeed * 9999 + 1)}c</div>
                )}
              </div>
              <div style={{ background: "rgba(0,10,25,0.6)", border: "1px solid rgba(0,80,140,0.25)", borderRadius: "8px", padding: "8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "6px" }}>SYSTEMS</div>
                {[{ l: "NAV", ok: true }, { l: "SHIELDS", ok: !isEjecting }, { l: "LIFE SUP", ok: true }, { l: "WARP", ok: isRunning }, { l: "COMMS", ok: !isEjecting }].map(({ l, ok }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span className="stm" style={{ fontSize: "8px", color: "rgba(0,100,160,0.7)" }}>{l}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "26px", height: "3px", borderRadius: "2px", background: "rgba(0,20,40,0.7)", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: ok ? "100%" : "20%", background: ok ? "#00c860" : "#ff4444", transition: "width 0.5s" }} />
                      </div>
                      <div className={ok ? "led-green" : "led-red"} />
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(0,10,25,0.6)", border: "1px solid rgba(0,80,140,0.25)", borderRadius: "8px", padding: "8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", letterSpacing: "3px", marginBottom: "4px" }}>COORDS</div>
                <div className="stm" style={{ fontSize: "7px", color: "rgba(0,120,180,0.6)", lineHeight: 1.8 }}>RA 00h 42m 44s<br />DEC +41d 16m</div>
              </div>
              <div style={{ background: "rgba(0,8,20,0.7)", border: "1px solid rgba(0,60,120,0.3)", borderRadius: "8px", padding: "10px 8px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.35)", letterSpacing: "3px", marginBottom: "8px" }}>AUX SYS</div>
                {["AUTOPILOT", "SHIELDS", "BEACON"].map((label) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span className="stm" style={{ fontSize: "8px", color: "rgba(0,100,150,0.6)" }}>{label}</span>
                    <div className="toggle-base"><div className="toggle-thumb" /></div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "auto", paddingBottom: "4px" }}>
                <div className="knob" /><div className="knob" />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>
            </div>

          </div>

          <div className="metal-frame" style={S.bottomPanel}>
            <div style={{ position: "absolute", top: "6px", left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 20px", pointerEvents: "none" }}>
              {Array.from({ length: 10 }).map((_, i) => <div key={i} className="bolt" />)}
            </div>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px)", pointerEvents: "none", zIndex: 0 }} />

            <div className="instrument glass-sheen" style={{ width: "clamp(55px,6.5vw,85px)", flexShrink: 0, borderRadius: "10px", padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", position: "relative", zIndex: 1 }}>
              <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.5)", textAlign: "center" }}>FUEL</div>
              <div style={{ flex: 1, width: "22px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(0,100,180,0.35)", borderRadius: "4px", overflow: "hidden", position: "relative", minHeight: "55px" }}>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: (fuel * 100) + "%", background: "linear-gradient(180deg," + fuelCol + "," + fuelCol + "88)", boxShadow: "0 0 8px " + fuelCol + "60", transition: "height 1s linear", borderRadius: "2px" }} />
                {[0.25, 0.5, 0.75].map(p => <div key={p} style={{ position: "absolute", left: 0, right: 0, bottom: (p * 100) + "%", borderTop: "1px solid rgba(0,80,120,0.4)" }} />)}
              </div>
              <div className="orb" style={{ fontSize: "11px", fontWeight: 700, color: fuelCol }}>{Math.round(fuel * 100)}%</div>
            </div>

            <div className="instrument glass-sheen" style={{ flexShrink: 0, width: "clamp(125px,15vw,180px)", borderRadius: "50%", aspectRatio: "1 / 1", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, maxWidth: "180px", maxHeight: "180px", alignSelf: "center" }}>
              <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }} viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00c8ff" />
                    <stop offset="50%" stopColor="#7050ff" />
                    <stop offset="100%" stopColor="#ff4060" />
                  </linearGradient>
                  <filter id="glow2">
                    <feGaussianBlur stdDeviation="2" result="b" />
                    <feComposite in="SourceGraphic" in2="b" operator="over" />
                  </filter>
                </defs>
                <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(0,60,120,0.4)" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={String((270 / 360 * 2 * Math.PI * 60).toFixed(2)) + " " + String((90 / 360 * 2 * Math.PI * 60).toFixed(2))}
                  transform="rotate(135,80,80)" />
                {progress > 0.001 && (
                  <circle cx="80" cy="80" r="60" fill="none" stroke="url(#arcG)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={String((270 / 360 * 2 * Math.PI * 60 * progress).toFixed(2)) + " " + String((2 * Math.PI * 60 - 270 / 360 * 2 * Math.PI * 60 * progress).toFixed(2))}
                    transform="rotate(135,80,80)" filter="url(#glow2)" />
                )}
                {Array.from({ length: 26 }).map((_, i) => {
                  const a   = (135 + i * (270 / 25)) * Math.PI / 180;
                  const maj = i % 5 === 0;
                  const ir  = maj ? 55 : 62;
                  return <line key={i} x1={80 + ir * Math.cos(a)} y1={80 + ir * Math.sin(a)} x2={80 + 68 * Math.cos(a)} y2={80 + 68 * Math.sin(a)} stroke={maj ? "rgba(0,200,255,0.7)" : "rgba(0,100,160,0.35)"} strokeWidth={maj ? 1.5 : 0.8} />;
                })}
                {[0, 5, 10, 15, 20, 25].map(m => {
                  const a = (135 + (m / 25) * 270) * Math.PI / 180;
                  return <text key={m} x={80 + 46 * Math.cos(a)} y={80 + 46 * Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="rgba(0,180,255,0.55)" fontFamily="Courier New,monospace">{m}</text>;
                })}
                <g transform={"rotate(" + (135 + progress * 270) + ",80,80)"} filter="url(#glow2)">
                  <line x1="80" y1="80" x2="80" y2="24" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="80" y1="80" x2="80" y2="92" stroke="rgba(0,100,180,0.4)" strokeWidth="1" strokeLinecap="round" />
                </g>
                <circle cx="80" cy="80" r="6" fill="rgba(0,8,20,1)" stroke="rgba(0,160,255,0.5)" strokeWidth="1.5" />
                <circle cx="80" cy="80" r="2.5" fill="#00c8ff" filter="url(#glow2)" />
              </svg>
              <div style={{ textAlign: "center", zIndex: 1, marginTop: "20px" }}>
                <div className="orb" style={{ fontSize: "clamp(13px,1.9vw,19px)", fontWeight: 900, color: "#fff", textShadow: "0 0 14px rgba(255,255,255,0.35)", lineHeight: 1 }}>{fmt(timeLeft)}</div>
                <div className="stm" style={{ fontSize: "8px", letterSpacing: "2px", marginTop: "4px", color: isRunning ? "rgba(0,210,255,0.85)" : isEjecting ? "rgba(255,60,60,0.9)" : "rgba(60,90,120,0.7)" }}>
                  {isEjecting ? "EJECT" : warpPhase === "spinup" ? "SPINUP" : isRunning ? "WARP" : "IDLE"}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "10px", position: "relative", zIndex: 1 }}>
              <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.35)", letterSpacing: "5px" }}>MAIN CONTROL</div>
              {(!isRunning && warpPhase === "idle") && (
                <button onClick={startWarp} className="ign-btn orb" style={{ padding: "clamp(10px,1.4vh,15px) clamp(24px,3.5vw,55px)", borderRadius: "10px", background: "linear-gradient(160deg,#0d7ec4,#0a5a96,#073d6e)", border: "1.5px solid rgba(100,200,255,0.45)", color: "#fff", fontWeight: 900, fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: "5px", textShadow: "0 0 10px rgba(100,200,255,0.9)", cursor: "pointer", fontFamily: "Orbitron,monospace" }}>IGNITION</button>
              )}
              {warpPhase === "spinup" && (
                <div className="stm" style={{ fontSize: "clamp(11px,1.2vw,14px)", letterSpacing: "5px", color: "#40c8ff", textShadow: "0 0 12px rgba(0,200,255,0.8)", padding: "12px 0" }}>SPIN UP...</div>
              )}
              {isRunning && (
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", top: "-8px", left: "-8px", right: "-8px", bottom: "-8px", borderRadius: "18px", background: "rgba(200,30,0,0.2)", filter: "blur(14px)", animation: "pulseGlow 0.7s ease-in-out infinite" }} />
                  <button onClick={handleEject} disabled={isEjecting} className="eject-btn orb" style={{ position: "relative", padding: "clamp(10px,1.4vh,13px) clamp(24px,3.5vw,55px)", borderRadius: "10px", background: "linear-gradient(160deg,#c0392b,#96231a,#6e0f09)", border: "1.5px solid rgba(255,100,80,0.5)", color: "#fff", fontWeight: 900, fontSize: "clamp(13px,1.4vw,17px)", letterSpacing: "5px", textShadow: "0 0 10px rgba(255,150,120,0.9)", cursor: isEjecting ? "not-allowed" : "pointer", opacity: isEjecting ? 0.5 : 1, fontFamily: "Orbitron,monospace" }}>
                    EJECT
                    <span style={{ display: "block", fontSize: "9px", opacity: 0.7, letterSpacing: "2px", marginTop: "2px", fontFamily: "Share Tech Mono,monospace", fontWeight: 400 }}>KINKYU DASSHUTSU</span>
                  </button>
                </div>
              )}
              {isEjecting && <div className="stm blink" style={{ fontSize: "11px", color: "#ff4444", letterSpacing: "3px", textShadow: "0 0 10px rgba(255,0,0,0.8)" }}>EMERGENCY EJECT</div>}
            </div>

            <div style={{ display: "flex", gap: "8px", flexShrink: 0, alignItems: "stretch", zIndex: 1 }}>
              <div className="instrument glass-sheen" style={{ width: "clamp(65px,7.5vw,95px)", borderRadius: "10px", padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", position: "relative" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.4)", textAlign: "center" }}>WARP VEL</div>
                <div className="orb" style={{ fontSize: "clamp(13px,1.9vw,19px)", fontWeight: 900, color: warpSpeed > 0.05 ? "#40c8ff" : "#304050", textAlign: "center", transition: "color 0.5s" }}>{warpSpeed > 0.05 ? ("x" + Math.round(warpSpeed * 999 + 1) + "c") : "----"}</div>
                <div style={{ width: "100%", height: "4px", background: "rgba(0,30,60,0.7)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (warpSpeed * 100) + "%", background: "linear-gradient(90deg,#00c8ff,#8060ff)", transition: "width 0.3s" }} />
                </div>
                <div className="stm" style={{ fontSize: "7px", color: "rgba(0,120,180,0.5)" }}>LIGHT SPEED</div>
              </div>
              <div style={{ width: "clamp(48px,5.5vw,70px)", background: "rgba(0,8,18,0.8)", border: "1px solid rgba(0,80,140,0.3)", borderRadius: "10px", padding: "10px 8px", display: "flex", flexDirection: "column", gap: "7px" }}>
                <div className="stm" style={{ fontSize: "8px", color: "rgba(0,160,255,0.35)", textAlign: "center" }}>SYS</div>
                {[{ l: "PWR", on: true, col: "green" }, { l: "NAV", on: true, col: "blue" }, { l: "SHD", on: !isEjecting, col: "green" }, { l: "WRP", on: isRunning, col: "blue" }, { l: "COM", on: !isEjecting, col: "green" }].map(({ l, on, col }) => (
                  <div key={l} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                    <span className="stm" style={{ fontSize: "7px", color: "rgba(0,100,140,0.6)" }}>{l}</span>
                    <div className={on ? (col === "blue" ? "led-blue" : "led-green") : "led-off"} />
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: "absolute", bottom: "6px", left: 0, right: 0, display: "flex", justifyContent: "space-between", padding: "0 20px", pointerEvents: "none" }}>
              {Array.from({ length: 10 }).map((_, i) => <div key={i} className="bolt" />)}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useRef, useState, useCallback, FC } from "react";


/* ── Types ── */
interface StarDot {
  x: number; y: number; r: number;
  al: number; tp: number; ts: number;
  color: string; bright: boolean; huge: boolean;
}
interface DustParticle { x: number; y: number; r: number; al: number; }

function rrS(a: number, b: number): number { return a + Math.random() * (b - a); }

interface StarBgProps { canvasRef: React.RefObject<HTMLCanvasElement | null>; }

const StarBackground: FC<StarBgProps> = ({ canvasRef }) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let stars: StarDot[]       = [];
    let dust:  DustParticle[]  = [];

    /* Star colours: mostly white, ~8% warm/cool tint */
    const SC = [
      "#ffffff","#ffffff","#ffffff","#ffffff","#ffffff","#ffffff",
      "#fff8ee","#ffeedd","#eef4ff","#ddeeff","#fffde0","#ffe0e0",
    ];

    const init = (): void => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = []; dust = [];

      /* dust — micro-particles giving depth to nebula regions */
      for (let i = 0; i < 280; i++) dust.push({
        x: Math.random() * W, y: Math.random() * H,
        r: rrS(0.08, 0.28),
        al: rrS(0.04, 0.20),
      });

      /* distant faint star field */
      for (let i = 0; i < 820; i++) stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: rrS(0.12, 0.48), al: rrS(0.08, 0.38),
        tp: Math.random()*Math.PI*2, ts: rrS(0.002, 0.008),
        color: "#ffffff", bright: false, huge: false,
      });
      /* mid-field */
      for (let i = 0; i < 320; i++) stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: rrS(0.4, 1.1), al: rrS(0.28, 0.78),
        tp: Math.random()*Math.PI*2, ts: rrS(0.004, 0.016),
        color: SC[Math.floor(Math.random()*SC.length)],
        bright: false, huge: false,
      });
      /* prominent stars with glow */
      for (let i = 0; i < 55; i++) stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: rrS(1.2, 2.2), al: rrS(0.65, 1.0),
        tp: Math.random()*Math.PI*2, ts: rrS(0.003, 0.010),
        color: SC[Math.floor(Math.random()*SC.length)],
        bright: true, huge: false,
      });
      /* 6–8 "hero" stars — large diffraction spikes */
      for (let i = 0; i < 7; i++) stars.push({
        x: Math.random()*W, y: Math.random()*H,
        r: rrS(2.5, 4.2), al: rrS(0.80, 1.0),
        tp: Math.random()*Math.PI*2, ts: rrS(0.002, 0.006),
        color: SC[Math.floor(Math.random()*SC.length)],
        bright: true, huge: true,
      });
    };

    window.addEventListener("resize", init);
    init();

    /* ── Diffraction cross + 45° secondary spikes ── */
    const drawSpike = (x: number, y: number, r: number, al: number, col: string): void => {
      const arms = r > 2.4 ? 4 : 2;
      ctx.save();
      for (let a = 0; a < arms; a++) {
        const angle = (a * Math.PI) / arms;
        const len   = r * (r > 2.4 ? 18 : 11);
        const falloff = r > 2.4 ? 0.38 : 0.42;
        ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
        const g = ctx.createLinearGradient(-len, 0, len, 0);
        g.addColorStop(0,         "transparent");
        g.addColorStop(falloff,   col);
        g.addColorStop(0.5,       "#ffffff");
        g.addColorStop(1-falloff, col);
        g.addColorStop(1,         "transparent");
        ctx.globalAlpha = al * (r > 2.4 ? 0.50 : 0.36);
        ctx.strokeStyle = g;
        ctx.lineWidth   = r * (r > 2.4 ? 0.55 : 0.42);
        ctx.beginPath(); ctx.moveTo(-len, 0); ctx.lineTo(len, 0); ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    /* ── Pre-render nebula composites to offscreen canvas ── */
    const nebCanvas = document.createElement("canvas");
    let nebW = 0, nebH = 0;
    const buildNebula = (): void => {
      nebW = nebCanvas.width  = W;
      nebH = nebCanvas.height = H;
      const nc = nebCanvas.getContext("2d")!;
      nc.clearRect(0, 0, nebW, nebH);

      /* Large volume blobs — base nebula colour */
      const blobs: [number,number,number,number,number,number][] = [
        /* cx%,  cy%,  r%,    H,   S%,  maxA */
        [0.72, 0.25, 0.38,  25,  80,  0.060],  /* orange-red right */
        [0.80, 0.40, 0.26, 200, 100,  0.038],  /* faint purple */
        [0.12, 0.60, 0.32, 270,  90,  0.050],  /* magenta-pink left */
        [0.55, 0.15, 0.22, 200,  70,  0.032],  /* cool blue top */
        [0.38, 0.78, 0.28, 240,  80,  0.028],  /* blue-purple bottom */
        [0.90, 0.70, 0.20,  30,  75,  0.030],  /* warm amber corner */
        [0.20, 0.20, 0.18, 300,  85,  0.025],  /* pink upper-left */
      ];
      blobs.forEach(([cx, cy, rr, hue, sat, maxA]) => {
        const bx = cx*W, by = cy*H, br = rr*Math.max(W,H);
        const g = nc.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0,   `hsla(${hue},${sat}%,58%,${maxA})`);
        g.addColorStop(0.35,`hsla(${hue},${sat}%,42%,${maxA*0.55})`);
        g.addColorStop(0.65,`hsla(${hue},${sat}%,30%,${maxA*0.20})`);
        g.addColorStop(1,   "transparent");
        nc.fillStyle = g; nc.fillRect(0, 0, nebW, nebH);
      });

      /* Milky Way core — diagonal luminous band */
      nc.save();
      nc.translate(W*0.50, H*0.42); nc.rotate(-0.30);
      const mw = nc.createLinearGradient(0, -H*0.55, 0, H*0.55);
      mw.addColorStop(0,    "transparent");
      mw.addColorStop(0.18, "rgba(200,190,255,0.010)");
      mw.addColorStop(0.35, "rgba(215,210,255,0.026)");
      mw.addColorStop(0.50, "rgba(230,225,255,0.042)");
      mw.addColorStop(0.65, "rgba(215,210,255,0.026)");
      mw.addColorStop(0.82, "rgba(200,190,255,0.010)");
      mw.addColorStop(1,    "transparent");
      nc.fillStyle = mw; nc.fillRect(-W, -H*0.55, W*2, H*1.1);
      nc.restore();

      /* Warm Milky Way bulge (galactic centre — lower-right) */
      nc.save();
      nc.translate(W*0.68, H*0.35); nc.rotate(0.40);
      const bulge = nc.createRadialGradient(0, 0, 0, 0, 0, W*0.50);
      bulge.addColorStop(0,   "rgba(200,150,60,0.048)");
      bulge.addColorStop(0.30,"rgba(180,120,40,0.022)");
      bulge.addColorStop(0.60,"rgba(140,90,20,0.008)");
      bulge.addColorStop(1,   "transparent");
      nc.fillStyle = bulge; nc.fillRect(-W*0.6,-H*0.6,W*1.2,H*1.2);
      nc.restore();

      /* Bright emission star-forming pockets (small intense blobs) */
      const pockets: [number,number,number,number,number][] = [
        [0.84, 0.22, 0.055, 15,  0.10],
        [0.10, 0.48, 0.050, 310, 0.09],
        [0.75, 0.60, 0.040, 200, 0.07],
        [0.30, 0.30, 0.038, 280, 0.08],
        [0.60, 0.75, 0.035, 30,  0.07],
      ];
      pockets.forEach(([cx, cy, rr, hue, al]) => {
        const bx = cx*W, by = cy*H, br = rr*Math.max(W,H);
        const g = nc.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0,   `hsla(${hue},90%,80%,${al})`);
        g.addColorStop(0.40,`hsla(${hue},80%,60%,${al*0.45})`);
        g.addColorStop(1,   "transparent");
        nc.fillStyle = g; nc.fillRect(0, 0, nebW, nebH);
      });

      /* Dark dust lane — slightly darkens mid-region for realism */
      nc.save();
      nc.translate(W*0.5, H*0.5); nc.rotate(-0.28);
      const dust2 = nc.createLinearGradient(0, -H*0.08, 0, H*0.08);
      dust2.addColorStop(0,   "transparent");
      dust2.addColorStop(0.3, "rgba(0,0,0,0.040)");
      dust2.addColorStop(0.5, "rgba(0,0,0,0.065)");
      dust2.addColorStop(0.7, "rgba(0,0,0,0.040)");
      dust2.addColorStop(1,   "transparent");
      nc.fillStyle = dust2; nc.fillRect(-W*0.9, -H*0.08, W*1.8, H*0.16);
      nc.restore();
    };
    buildNebula();

    let raf: number;

    const draw = (): void => {
      /* 1. Absolute black void */
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, H);

      /* 2. Nebula composite */
      ctx.drawImage(nebCanvas, 0, 0);

      /* 3. Dust micro-particles */
      dust.forEach(d => {
        ctx.globalAlpha = d.al;
        ctx.fillStyle   = "#ffffff";
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI*2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      /* 4. Stars */
      stars.forEach(s => {
        s.tp += s.ts;
        const al = s.al * (0.42 + Math.sin(s.tp) * 0.58);

        if (s.bright) {
          /* multi-layer halo */
          const h1 = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*(s.huge?12:8));
          h1.addColorStop(0,   `rgba(255,255,255,${al*0.22})`);
          h1.addColorStop(0.25,`rgba(255,255,255,${al*0.10})`);
          h1.addColorStop(0.55,`rgba(255,255,255,${al*0.03})`);
          h1.addColorStop(1,   "transparent");
          ctx.fillStyle = h1;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*(s.huge?12:8),0,Math.PI*2); ctx.fill();

          /* soft inner bloom */
          const h2 = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*2.8);
          h2.addColorStop(0,   `rgba(255,255,255,${al})`);
          h2.addColorStop(0.40,`rgba(255,255,255,${al*0.55})`);
          h2.addColorStop(1,   "transparent");
          ctx.fillStyle = h2;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.8,0,Math.PI*2); ctx.fill();

          drawSpike(s.x, s.y, s.r, al, s.color);
        } else if (s.r > 0.65) {
          /* mid-field soft glow */
          const sg = ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*2.5);
          sg.addColorStop(0,`rgba(255,255,255,${al*0.52})`);
          sg.addColorStop(1,"transparent");
          ctx.fillStyle = sg;
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*2.5,0,Math.PI*2); ctx.fill();
        }

        ctx.globalAlpha = al;
        ctx.fillStyle   = s.color;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* 5. Edge vignette — deepens the corners */
      const vig = ctx.createRadialGradient(W*.5,H*.46,H*.12,W*.5,H*.5,Math.hypot(W,H)*.70);
      vig.addColorStop(0,   "transparent");
      vig.addColorStop(0.48,"rgba(0,0,0,0.14)");
      vig.addColorStop(0.72,"rgba(0,0,0,0.42)");
      vig.addColorStop(1,   "rgba(0,0,0,0.84)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener("resize", init); cancelAnimationFrame(raf); };
  }, [canvasRef]);

  return null;
};

/* ── CSS ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap');
  html,body{margin:0;padding:0;overflow:hidden;}
  *{box-sizing:border-box;}
  .orb{font-family:'Orbitron',monospace;}
  .stm{font-family:'Share Tech Mono',monospace;}
  @keyframes bootIn{
    0%{opacity:0;transform:translateY(30px) scale(0.96);}
    60%{opacity:1;transform:translateY(-3px) scale(1.005);}
    100%{opacity:1;transform:translateY(0) scale(1);}
  }
  @keyframes scanDown{0%{top:-4px;}100%{top:100%;}}
  @keyframes statusPulse{0%,100%{opacity:0.6;}50%{opacity:1;}}
  @keyframes glitch1{
    0%,95%,100%{transform:translateX(0);}
    96%{transform:translateX(-3px);}97%{transform:translateX(2px);}98%{transform:translateX(-1px);}
  }
  .panel-boot{animation:bootIn 0.85s cubic-bezier(0.22,1,0.36,1) both;}
  .hud-input{
    width:100%;background:rgba(0,8,22,0.7);
    border:1px solid rgba(0,120,200,0.4);border-bottom:2px solid rgba(0,180,255,0.55);
    color:#e0f4ff;font-family:'Share Tech Mono',monospace;font-size:14px;
    padding:10px 14px 10px 38px;outline:none;letter-spacing:1.5px;
    transition:border-color 0.2s,box-shadow 0.2s;border-radius:4px 4px 2px 2px;
  }
  .hud-input:focus{
    border-color:rgba(0,200,255,0.7);border-bottom-color:#00c8ff;
    box-shadow:0 0 0 1px rgba(0,160,255,0.2),0 4px 20px rgba(0,120,255,0.15);
  }
  .hud-input::placeholder{color:rgba(0,120,180,0.45);letter-spacing:2px;font-size:12px;}
  .submit-btn{
    width:100%;padding:13px;border-radius:6px;
    background:linear-gradient(160deg,#0d7ec4,#0a5a96,#063870);
    border:1.5px solid rgba(100,200,255,0.4);color:#fff;
    font-family:'Orbitron',monospace;font-weight:700;font-size:13px;
    letter-spacing:6px;text-shadow:0 0 12px rgba(100,200,255,0.8);cursor:pointer;
    box-shadow:0 0 20px rgba(0,100,200,0.4),inset 0 1px 0 rgba(150,220,255,0.2);
    transition:filter 0.15s,box-shadow 0.15s;
  }
  .submit-btn:hover{filter:brightness(1.25);}
  .submit-btn:active{filter:brightness(0.95);}
  .link-btn{
    background:none;border:none;color:rgba(0,160,220,0.65);
    font-family:'Share Tech Mono',monospace;font-size:11px;letter-spacing:2px;
    cursor:pointer;text-decoration:underline;text-underline-offset:3px;
    transition:color 0.2s;padding:0;
  }
  .link-btn:hover{color:#00c8ff;}
  .led{width:7px;height:7px;border-radius:50%;}
  .led-on{background:#00e060;box-shadow:0 0 6px #00e060;}
  .led-warn{background:#ffaa00;box-shadow:0 0 6px #ffaa00;}
  .led-dim{background:#1a2530;}
  .glitch{animation:glitch1 8s ease-in-out infinite;}
`;

/* ── Component ── */
type StatusState = "idle" | "scanning" | "granted";

export default function LoginPage(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [user,     setUser]     = useState<string>("");
  const [pass,     setPass]     = useState<string>("");
  const [status,   setStatus]   = useState<string>("AWAITING INPUT");
  const [statusSt, setStatusSt] = useState<StatusState>("idle");
  const [error,    setError]    = useState<string>("");
  const [mounted,  setMounted]  = useState<boolean>(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!user || !pass) { setError("入力されていない項目があります"); return; }
    setError("");
    setStatusSt("scanning");

    const steps: [number, string, StatusState][] = [
      [0,    "SCANNING CREW ID...",          "scanning"],
      [900,  "VERIFYING ACCESS CODE...",     "scanning"],
      [1800, "CROSS-REFERENCING DATABASE...", "scanning"],
      [2800, "ACCESS GRANTED",               "granted"],
    ];
    steps.forEach(([delay, msg, st]) => {
      setTimeout(() => { setStatus(msg); setStatusSt(st); }, delay);
    });
  }, [user, pass]);

  const ledClass =
    statusSt === "scanning" ? "led led-warn" :
    statusSt === "granted"  ? "led led-on"   : "led led-dim";

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", background: "#040210", userSelect: "none" }}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "block" }} />
      {mounted && <StarBackground canvasRef={canvasRef} />}

      {/* Vignette */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,12,0.55) 70%,rgba(0,0,6,0.82) 100%)", pointerEvents: "none" }} />
      {/* Scan line */}
      <div style={{ position: "absolute", left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,180,255,0.15) 20%,rgba(0,200,255,0.25) 50%,rgba(0,180,255,0.15) 80%,transparent)", animation: "scanDown 8s linear infinite", zIndex: 2, pointerEvents: "none" }} />

      {mounted && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>

          {/* Header */}
          <div className="panel-boot" style={{ marginBottom: "14px", textAlign: "center" }}>
            <div className="stm" style={{ fontSize: "30px", letterSpacing: "6px", color: "rgb(255,255,255)", marginBottom: "6px" }}>
              WarpDrive Pomodoro
            </div>
            <div className="orb glitch" style={{ fontSize: "min(max(7px,2.2vw),15px)", fontWeight: 900, color: "#fff", textShadow: "0 0 28px rgba(0,220,140,0.5)", letterSpacing: "0.1em" }}>
              ログイン
            </div>
            <div style={{ marginTop: "8px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(0,210,130,0.55),transparent)" }} />
          </div>

          {/* Panel */}
          <div className="panel-boot" style={{
            width: "100%", maxWidth: "420px",
            background: "linear-gradient(165deg,rgba(0,14,38,0.94),rgba(0,8,24,0.97),rgba(0,4,16,0.99))",
            border: "1px solid rgba(0,100,180,0.3)",
            borderTop: "2px solid rgba(0,160,255,0.45)",
            borderRadius: "4px 4px 8px 8px",
            boxShadow: "0 0 0 1px rgba(0,60,120,0.2),0 20px 60px rgba(0,0,0,0.8),0 0 40px rgba(0,60,160,0.15)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#00c8ff 30%,#8060ff 70%,transparent)" }} />

            <div style={{ position: "relative", zIndex: 1, padding: "28px 28px 22px" }}>
              {/* Status bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", padding: "8px 12px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(0,80,140,0.3)", borderRadius: "4px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div className={ledClass} style={{ animation: statusSt === "scanning" ? "statusPulse 0.6s ease-in-out infinite" : "none" }} />
                  <span className="stm" style={{ fontSize: "9px", letterSpacing: "2.5px", color: statusSt === "scanning" ? "#ffaa00" : statusSt === "granted" ? "#00e060" : "rgba(0,140,200,0.6)" }}>
                    {status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "5px" }}>
                  {(["led led-on","led led-on","led led-dim"] as string[]).map((cls, i) => (
                    <div key={i} className={cls} />
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <div className="stm" style={{ fontSize: "12px", letterSpacing: "4px", color: "rgba(0,160,255,0.55)", marginBottom: "6px" }}>◈ メールアドレス</div>
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", opacity: 0.45 }} viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                    <input className="hud-input" type="text" value={user}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setUser(e.target.value); setStatus("AWAITING INPUT"); setStatusSt("idle"); setError(""); }}
                      autoComplete="off" />
                  </div>
                </div>

                <div>
                  <div className="stm" style={{ fontSize: "12px", letterSpacing: "4px", color: "rgba(0,160,255,0.55)", marginBottom: "6px" }}>パスワード</div>
                  <div style={{ position: "relative" }}>
                    <svg style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", opacity: 0.45 }} viewBox="0 0 24 24" fill="none" stroke="#00c8ff" strokeWidth="1.5">
                      <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <input className="hud-input" type="password" value={pass}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPass(e.target.value); setStatus("AWAITING INPUT"); setStatusSt("idle"); setError(""); }} />
                  </div>
                </div>

                {error && (
                  <div className="stm" style={{ fontSize: "10px", letterSpacing: "2px", color: "#ff4444", textAlign: "center", textShadow: "0 0 8px rgba(255,60,60,0.6)" }}>
                    ⚠ {error}
                  </div>
                )}

                <button type="submit" className="submit-btn orb" disabled={statusSt === "scanning"}>
                  {statusSt === "scanning" ? "ログイン中..." : "ログイン"}
                </button>
              </form>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0 16px" }}>
                <div style={{ flex: 1, height: "1px", background: "rgba(0,80,140,0.3)" }} />
                <span className="stm" style={{ fontSize: "8px", letterSpacing: "3px", color: "rgba(0,100,150,0.5)" }}>NEW CREW</span>
                <div style={{ flex: 1, height: "1px", background: "rgba(0,80,140,0.3)" }} />
              </div>

              <div style={{ textAlign: "center" }}>
                <button className="link-btn" style={{ fontSize: "16px" }} onClick={() => { window.location.href = "/signup"; }}>新規登録</button>
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid rgba(0,60,120,0.3)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
              <span className="stm" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(0,80,120,0.5)" }}>SEC-LVL: ALPHA</span>
              <div style={{ display: "flex", gap: "8px" }}>
                {(["led-on","led-on","led-dim","led-dim"] as string[]).map((s, i) => (
                  <div key={i} className={"led " + s} style={{ width: "5px", height: "5px" }} />
                ))}
              </div>
              <span className="stm" style={{ fontSize: "8px", letterSpacing: "2px", color: "rgba(0,80,120,0.5)" }}>ENC: AES-512</span>
            </div>
          </div>

          <div className="panel-boot stm" style={{ marginTop: "16px", fontSize: "8px", letterSpacing: "3px", color: "rgba(0,80,130,0.5)" }}>
            SECTOR 7-G · QUADRANT DELTA · {new Date().getFullYear()}
          </div>
        </div>
      )}
    </div>
  );
}
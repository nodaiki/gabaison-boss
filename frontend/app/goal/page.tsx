"use client";

import { useEffect, useRef, useState, useCallback, FC } from "react";
import { buildApiUrl } from "@/lib/api";
import { useRouter } from "next/navigation";

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

interface Destination {
  id: number; name: string; dist: string;
  time: string; timeRaw: number; desc: string;
  hue: number; sat: number; hasRing: boolean;
  moons: number; bands: number; lightX: number; lightY: number;
  type: "blackhole" | "planet" | "nebula" | "star" | "cluster" | "galaxy" | "remnant";
}

const DESTINATIONS: Destination[] = [
  { "id": 0, "name": "はくちょう座X-1", "dist": "1,585光年", "time": "25分", "timeRaw": 25, "desc": "【1ポモドーロ完了！】ブラックホールの重力を振り切りました！", "hue": 200, "sat": 63, "hasRing": false, "moons": 1, "bands": 3, "lightX": -0.219, "lightY": -0.265, "type": "blackhole" },
  { "id": 1, "name": "ケプラー452b", "dist": "1,800光年", "time": "28分", "timeRaw": 28, "desc": "地球にそっくりな惑星。ここで休憩しますか？", "hue": 210, "sat": 65, "hasRing": false, "moons": 0, "bands": 4, "lightX": -0.313, "lightY": -0.226, "type": "planet" },
  { "id": 2, "name": "環状星雲 (M57)", "dist": "2,000光年", "time": "31分", "timeRaw": 31, "desc": "星の最期の姿、美しいガスのリングを通過", "hue": 280, "sat": 67, "hasRing": true, "moons": 2, "bands": 2, "lightX": -0.407, "lightY": -0.187, "type": "nebula" },
  { "id": 3, "name": "網状星雲 (Veil Nebula)", "dist": "2,400光年", "time": "37分", "timeRaw": 37, "desc": "巨大な超新星残骸のレースをくぐり抜ける", "hue": 160, "sat": 69, "hasRing": false, "moons": 1, "bands": 5, "lightX": -0.281, "lightY": -0.348, "type": "remnant" },
  { "id": 4, "name": "デネブ", "dist": "2,615光年", "time": "41分", "timeRaw": 41, "desc": "はくちょう座の尾。夏の大三角をこれで全制覇！", "hue": 50, "sat": 71, "hasRing": true, "moons": 0, "bands": 3, "lightX": -0.375, "lightY": -0.309, "type": "star" },
  { "id": 5, "name": "干潟星雲 (M8)", "dist": "4,100光年", "time": "1時間04分", "timeRaw": 64, "desc": "天の川の濃い部分に突入してきました", "hue": 0, "sat": 73, "hasRing": false, "moons": 2, "bands": 6, "lightX": -0.248, "lightY": -0.27, "type": "nebula" },
  { "id": 6, "name": "ばら星雲 (Rosette Nebula)", "dist": "5,200光年", "time": "1時間21分", "timeRaw": 81, "desc": "バラの花の形をした巨大なガス雲。タスクも咲かせよう", "hue": 340, "sat": 74, "hasRing": true, "moons": 1, "bands": 4, "lightX": -0.342, "lightY": -0.231, "type": "nebula" },
  { "id": 7, "name": "かに星雲 (M1)", "dist": "6,500光年", "time": "1時間42分", "timeRaw": 102, "desc": "かつての超新星爆発の残骸を突っ切ります", "hue": 30, "sat": 76, "hasRing": true, "moons": 2, "bands": 3, "lightX": -0.216, "lightY": -0.193, "type": "remnant" },
  { "id": 8, "name": "わし星雲（創造の柱）", "dist": "7,000光年", "time": "1時間50分", "timeRaw": 110, "desc": "宇宙の神秘『創造の柱』。今日のタスク量は凄い！", "hue": 40, "sat": 78, "hasRing": false, "moons": 0, "bands": 5, "lightX": -0.31, "lightY": -0.154, "type": "nebula" },
  { "id": 9, "name": "りゅうこつ座イータ星", "dist": "7,500光年", "time": "1時間58分", "timeRaw": 118, "desc": "太陽の数百万倍明るい、爆発寸前の超大質量星に接近", "hue": 40, "sat": 80, "hasRing": true, "moons": 1, "bands": 2, "lightX": -0.404, "lightY": -0.315, "type": "star" },
  { "id": 10, "name": "球状星団 M22", "dist": "10,600光年", "time": "2時間47分", "timeRaw": 167, "desc": "夜空で最も明るい球状星団の一つ！", "hue": 60, "sat": 82, "hasRing": false, "moons": 3, "bands": 7, "lightX": -0.278, "lightY": -0.276, "type": "cluster" },
  { "id": 11, "name": "カシオペヤ座A", "dist": "11,000光年", "time": "2時間53分", "timeRaw": 173, "desc": "強力な電波を放つ超新星残骸を通過。順調です", "hue": 200, "sat": 84, "hasRing": false, "moons": 0, "bands": 3, "lightX": -0.371, "lightY": -0.237, "type": "remnant" },
  { "id": 12, "name": "ウェスタールンド1", "dist": "15,000光年", "time": "3時間56分", "timeRaw": 236, "desc": "天の川銀河最大級の『超星団』。星の密度が異常です", "hue": 45, "sat": 86, "hasRing": true, "moons": 1, "bands": 4, "lightX": -0.245, "lightY": -0.198, "type": "cluster" },
  { "id": 13, "name": "オメガ星団", "dist": "15,800光年", "time": "4時間09分", "timeRaw": 249, "desc": "数百万の星が密集する巨大な球状星団！", "hue": 50, "sat": 87, "hasRing": false, "moons": 2, "bands": 5, "lightX": -0.339, "lightY": -0.159, "type": "cluster" },
  { "id": 14, "name": "NGC 3603", "dist": "20,000光年", "time": "5時間15分", "timeRaw": 315, "desc": "銀河系最大級の星形成領域で新しいタスクを生み出す", "hue": 260, "sat": 89, "hasRing": true, "moons": 1, "bands": 3, "lightX": -0.213, "lightY": -0.32, "type": "nebula" },
  { "id": 15, "name": "ヘルクレス座球状星団", "dist": "25,000光年", "time": "6時間34分", "timeRaw": 394, "desc": "アレシボ・メッセージの送信先！宇宙人に応答せよ", "hue": 55, "sat": 56, "hasRing": true, "moons": 0, "bands": 4, "lightX": -0.307, "lightY": -0.281, "type": "cluster" },
  { "id": 16, "name": "天の川銀河の中心", "dist": "26,000光年", "time": "6時間49分", "timeRaw": 409, "desc": "超大質量ブラックホール『いて座A*』をスイングバイ", "hue": 80, "sat": 58, "hasRing": false, "moons": 2, "bands": 6, "lightX": -0.4, "lightY": -0.242, "type": "blackhole" },
  { "id": 17, "name": "天の川銀河の外縁部", "dist": "50,000光年", "time": "13時間08分", "timeRaw": 788, "desc": "我らが銀河の果てを通過。完全な暗黒の宇宙へ", "hue": 200, "sat": 60, "hasRing": true, "moons": 1, "bands": 5, "lightX": -0.274, "lightY": -0.203, "type": "galaxy" },
  { "id": 18, "name": "いて座矮小楕円小銀河", "dist": "70,000光年", "time": "18時間23分", "timeRaw": 1103, "desc": "天の川銀河に飲み込まれつつある小さな伴銀河", "hue": 40, "sat": 62, "hasRing": false, "moons": 0, "bands": 3, "lightX": -0.368, "lightY": -0.164, "type": "galaxy" },
  { "id": 19, "name": "天の川銀河の反対側", "dist": "80,000光年", "time": "21時間01分", "timeRaw": 1261, "desc": "銀河の裏側まで来ました。地球からは見えない景色です", "hue": 220, "sat": 64, "hasRing": true, "moons": 2, "bands": 4, "lightX": -0.242, "lightY": -0.325, "type": "galaxy" },
  { "id": 20, "name": "大マゼラン雲", "dist": "160,000光年", "time": "42時間02分", "timeRaw": 2522, "desc": "南半球の夜空を彩る巨大な伴銀河に到達しました", "hue": 240, "sat": 65, "hasRing": false, "moons": 1, "bands": 2, "lightX": -0.336, "lightY": -0.286, "type": "galaxy" },
  { "id": 21, "name": "小マゼラン雲", "dist": "200,000光年", "time": "52時間33分", "timeRaw": 3153, "desc": "大マゼラン雲の兄弟星雲。長時間の作業、お疲れ様です", "hue": 210, "sat": 67, "hasRing": false, "moons": 3, "bands": 5, "lightX": -0.209, "lightY": -0.247, "type": "galaxy" },
  { "id": 22, "name": "りゅう座矮小銀河", "dist": "260,000光年", "time": "68時間19分", "timeRaw": 4099, "desc": "暗黒物質（ダークマター）を大量に含む古い銀河を通過", "hue": 30, "sat": 69, "hasRing": true, "moons": 0, "bands": 4, "lightX": -0.303, "lightY": -0.208, "type": "galaxy" },
  { "id": 23, "name": "ろくぶんぎ座矮小銀河", "dist": "280,000光年", "time": "73時間35分", "timeRaw": 4415, "desc": "古い星ばかりが集まる静かな銀河。タスクも消化試合？", "hue": 45, "sat": 71, "hasRing": false, "moons": 1, "bands": 3, "lightX": -0.397, "lightY": -0.169, "type": "galaxy" },
  { "id": 24, "name": "ちょうこくしつ座矮小銀河", "dist": "290,000光年", "time": "76時間12分", "timeRaw": 4572, "desc": "銀河系の重力圏を完全に脱出しました", "hue": 220, "sat": 73, "hasRing": true, "moons": 2, "bands": 6, "lightX": -0.271, "lightY": -0.33, "type": "galaxy" },
  { "id": 25, "name": "銀河間放浪者 (NGC 2419)", "dist": "300,000光年", "time": "78時間50分", "timeRaw": 4730, "desc": "どの銀河にも属さない孤独な球状星団を通過", "hue": 50, "sat": 75, "hasRing": false, "moons": 0, "bands": 3, "lightX": -0.365, "lightY": -0.291, "type": "cluster" },
  { "id": 26, "name": "りゅうこつ座矮小銀河", "dist": "330,000光年", "time": "86時間43分", "timeRaw": 5203, "desc": "天の川銀河の周りを回る衛星銀河をさらにパス", "hue": 240, "sat": 77, "hasRing": true, "moons": 1, "bands": 5, "lightX": -0.238, "lightY": -0.252, "type": "galaxy" },
  { "id": 27, "name": "ろ座矮小銀河", "dist": "460,000光年", "time": "120時間53分", "timeRaw": 7253, "desc": "暗闇の宇宙を進み続けています。孤独な戦いですね", "hue": 210, "sat": 79, "hasRing": false, "moons": 2, "bands": 4, "lightX": -0.332, "lightY": -0.213, "type": "galaxy" },
  { "id": 28, "name": "しし座II (矮小銀河)", "dist": "690,000光年", "time": "181時間19分", "timeRaw": 10879, "desc": "圧倒的な作業時間の蓄積を感じます", "hue": 35, "sat": 80, "hasRing": true, "moons": 1, "bands": 3, "lightX": -0.206, "lightY": -0.174, "type": "galaxy" },
  { "id": 29, "name": "しし座I (矮小銀河)", "dist": "820,000光年", "time": "215時間29分", "timeRaw": 12929, "desc": "さらに遠くの矮小銀河。もはやチーム開発の鑑です", "hue": 240, "sat": 82, "hasRing": true, "moons": 0, "bands": 5, "lightX": -0.3, "lightY": -0.335, "type": "galaxy" },
  { "id": 30, "name": "ほうおう座矮小銀河", "dist": "1,440,000光年", "time": "378時間26分", "timeRaw": 22706, "desc": "天の川とアンドロメダのちょうど中間地点の何もない空間", "hue": 30, "sat": 84, "hasRing": false, "moons": 3, "bands": 4, "lightX": -0.394, "lightY": -0.296, "type": "galaxy" },
  { "id": 31, "name": "バーナード銀河 (NGC 6822)", "dist": "1,600,000光年", "time": "420時間28分", "timeRaw": 25228, "desc": "不規則銀河に突入！アンドロメダの重力圏に入り始めました", "hue": 40, "sat": 86, "hasRing": true, "moons": 1, "bands": 3, "lightX": -0.268, "lightY": -0.257, "type": "galaxy" },
  { "id": 32, "name": "NGC 185 (伴銀河)", "dist": "2,050,000光年", "time": "538時間44分", "timeRaw": 32324, "desc": "アンドロメダのお供の銀河を発見！", "hue": 210, "sat": 88, "hasRing": false, "moons": 2, "bands": 6, "lightX": -0.361, "lightY": -0.218, "type": "galaxy" },
  { "id": 33, "name": "IC 10 (スターバースト銀河)", "dist": "2,200,000光年", "time": "578時間11分", "timeRaw": 34691, "desc": "猛烈な勢いで星が生まれている銀河。爆速開発中！", "hue": 50, "sat": 55, "hasRing": false, "moons": 0, "bands": 5, "lightX": -0.235, "lightY": -0.179, "type": "galaxy" },
  { "id": 34, "name": "IC 1613", "dist": "2,380,000光年", "time": "625時間29分", "timeRaw": 37529, "desc": "アンドロメダに極めて近い不規則銀河。ゴールは目の前！", "hue": 230, "sat": 57, "hasRing": true, "moons": 1, "bands": 4, "lightX": -0.329, "lightY": -0.34, "type": "galaxy" },
  { "id": 35, "name": "M32 (アンドロメダ伴銀河)", "dist": "2,490,000光年", "time": "654時間24分", "timeRaw": 39264, "desc": "アンドロメダのすぐ隣にあるコンパクトな楕円銀河！", "hue": 220, "sat": 58, "hasRing": true, "moons": 2, "bands": 3, "lightX": -0.203, "lightY": -0.301, "type": "galaxy" },
  { "id": 36, "name": "アンドロメダ銀河 (M31)", "dist": "2,500,000光年", "time": "657時間", "timeRaw": 39420, "desc": "【最終目的地】お隣の銀河に到着！渡邊様のチームが宇宙を超えました！", "hue": 220, "sat": 60, "hasRing": false, "moons": 0, "bands": 5, "lightX": -0.297, "lightY": -0.262, "type": "galaxy" },
  { "id": 37, "name": "M110 (伴銀河)", "dist": "2,690,000光年", "time": "706時間58分", "timeRaw": 42418, "desc": "アンドロメダを通り抜けた先にあるもう一つの伴銀河", "hue": 210, "sat": 62, "hasRing": true, "moons": 1, "bands": 4, "lightX": -0.39, "lightY": -0.223, "type": "galaxy" },
  { "id": 38, "name": "さんかく座銀河 (M33)", "dist": "2,730,000光年", "time": "717時間30分", "timeRaw": 43050, "desc": "局所銀河群で3番目に大きい巨大銀河。真のカンスト！", "hue": 230, "sat": 64, "hasRing": true, "moons": 3, "bands": 3, "lightX": -0.264, "lightY": -0.184, "type": "galaxy" },
  { "id": 39, "name": "WLM銀河", "dist": "3,000,000光年", "time": "788時間26分", "timeRaw": 47306, "desc": "局所銀河群の最果て。これ以上は宇宙の壁に阻まれます", "hue": 35, "sat": 66, "hasRing": false, "moons": 2, "bands": 5, "lightX": -0.358, "lightY": -0.345, "type": "galaxy" }
];

interface PastTask {
  id: string;
  memberId: string;
  taskId: string;
  title: string;
  destId: number;
  goalTime: number;
  timeSpent: number; // 消化済み時間(分)
}

interface MemberTaskApi {
  member_id: string;
  task_id: string;
  task_name: string;
  goal_time: number;
  total_time: number;
  planet_id: number;
}


/* ── hsl helper ── */
function hsl(h: number, s: number, l: number, a = 1): string {
  return `hsla(${h},${s}%,${l}%,${a})`;
}

/* ── Planet Rendering by Type ── */
interface PlanetProps { dest: Destination; size: number; active: boolean; }

const Planet: FC<PlanetProps> = ({ dest, size, active }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    
    // キャンバスを3倍のサイズにしてグローが切れないようにする
    const canvasSize = size * 3;
    c.width  = canvasSize * DPR;
    c.height = canvasSize * DPR;
    ctx.scale(DPR, DPR);

    const { hue: H, sat: S, type, hasRing, moons, bands, lightX, lightY } = dest;
    let rot = 0;

    const draw = () => {
      const W = canvasSize, HH = canvasSize;
      // 完全に透明にクリア
      ctx.clearRect(0, 0, W, HH);
      // 中心を調整（キャンバスの中央）
      const cx = W / 2, cy = HH / 2;
      const R = size * 0.32;

      /* ── Render based on celestial type ── */
      if (type === "blackhole") {
        drawBlackHole(ctx, cx, cy, R, H, S, active);
      } else if (type === "star") {
        drawStar(ctx, cx, cy, R, H, S, active);
      } else if (type === "nebula") {
        drawNebula(ctx, cx, cy, R, H, S, active);
      } else if (type === "remnant") {
        drawRemnant(ctx, cx, cy, R, H, S, active);
      } else if (type === "cluster") {
        drawCluster(ctx, cx, cy, R, H, S, active, rot);
      } else if (type === "galaxy") {
        drawGalaxy(ctx, cx, cy, R, H, S, active, rot);
      } else {
        // Default: planet
        drawPlanet(ctx, cx, cy, R, H, S, hasRing, moons, bands, lightX, lightY, active, rot);
      }

      rot += active ? 0.005 : 0.002;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [dest, size, active]);

  return (
    <canvas
      ref={ref}
      style={{ 
        width: size, 
        height: size, 
        display: "block", 
        flexShrink: 0 
      }}
    />
  );
};

/* ── Black Hole Rendering ── */
function drawBlackHole(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean) {
  // Outer glow (fades to transparent at edges)
  const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 6);
  outerGlow.addColorStop(0, "transparent");
  outerGlow.addColorStop(0.25, hsl(30, 90, 50, active ? 0.04 : 0.02));
  outerGlow.addColorStop(0.45, hsl(20, 95, 45, active ? 0.06 : 0.03));
  outerGlow.addColorStop(0.65, hsl(10, 100, 40, active ? 0.03 : 0.015));
  outerGlow.addColorStop(0.82, hsl(10, 100, 35, active ? 0.01 : 0.005));
  outerGlow.addColorStop(0.94, hsl(10, 100, 30, active ? 0.003 : 0.0015));
  outerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = outerGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  // Accretion disk (outer glow)
  const diskGlow = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 2.8);
  diskGlow.addColorStop(0, "transparent");
  diskGlow.addColorStop(0.2, hsl(30, 90, 60, active ? 0.15 : 0.08));
  diskGlow.addColorStop(0.5, hsl(20, 95, 50, active ? 0.35 : 0.20));
  diskGlow.addColorStop(0.75, hsl(10, 100, 40, active ? 0.20 : 0.10));
  diskGlow.addColorStop(0.95, hsl(10, 100, 35, active ? 0.05 : 0.02));
  diskGlow.addColorStop(1, "transparent");
  ctx.fillStyle = diskGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 2.8, 0, Math.PI * 2); ctx.fill();

  // Event horizon (dark center with subtle edge glow)
  const eventHorizon = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.95);
  eventHorizon.addColorStop(0, "#000000");
  eventHorizon.addColorStop(0.85, "#000000");
  eventHorizon.addColorStop(0.95, hsl(H, S, 30, 0.6));
  eventHorizon.addColorStop(1, hsl(H, S, 50, 0.3));
  ctx.fillStyle = eventHorizon;
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.95, 0, Math.PI * 2); ctx.fill();

  // Gravitational lensing ring
  ctx.strokeStyle = hsl(200, 70, 60, active ? 0.4 : 0.25);
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.1, 0, Math.PI * 2); ctx.stroke();
}

/* ── Star Rendering ── */
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean) {
  // Outer atmospheric glow (very wide, fades to transparent)
  const atmosphereGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 8);
  atmosphereGlow.addColorStop(0, hsl(H, S, 70, active ? 0.12 : 0.06));
  atmosphereGlow.addColorStop(0.25, hsl(H, S, 65, active ? 0.08 : 0.04));
  atmosphereGlow.addColorStop(0.45, hsl(H, S, 60, active ? 0.05 : 0.025));
  atmosphereGlow.addColorStop(0.65, hsl(H, S, 55, active ? 0.025 : 0.012));
  atmosphereGlow.addColorStop(0.82, hsl(H, S, 50, active ? 0.01 : 0.005));
  atmosphereGlow.addColorStop(0.94, hsl(H, S, 45, active ? 0.003 : 0.0015));
  atmosphereGlow.addColorStop(1, "transparent");
  ctx.fillStyle = atmosphereGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 8, 0, Math.PI * 2); ctx.fill();

  // Core glow
  const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 3.5);
  coreGlow.addColorStop(0, hsl(H, S, 95, active ? 1.0 : 0.8));
  coreGlow.addColorStop(0.15, hsl(H, S, 85, active ? 0.9 : 0.7));
  coreGlow.addColorStop(0.35, hsl(H, S, 70, active ? 0.6 : 0.4));
  coreGlow.addColorStop(0.60, hsl(H, S, 50, active ? 0.3 : 0.2));
  coreGlow.addColorStop(0.85, hsl(H, S, 40, active ? 0.1 : 0.05));
  coreGlow.addColorStop(1, "transparent");
  ctx.fillStyle = coreGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 3.5, 0, Math.PI * 2); ctx.fill();

  // Bright core
  const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.8);
  core.addColorStop(0, "#ffffff");
  core.addColorStop(0.4, hsl(H, S, 90));
  core.addColorStop(0.7, hsl(H, S, 70));
  core.addColorStop(1, hsl(H, S, 50));
  ctx.fillStyle = core;
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.8, 0, Math.PI * 2); ctx.fill();

  // Diffraction spikes
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const spikeGrad = ctx.createLinearGradient(-R * 6, 0, R * 6, 0);
    spikeGrad.addColorStop(0, "transparent");
    spikeGrad.addColorStop(0.15, hsl(H, S, 75, active ? 0.15 : 0.1));
    spikeGrad.addColorStop(0.3, hsl(H, S, 80, active ? 0.3 : 0.2));
    spikeGrad.addColorStop(0.43, hsl(H, S, 85, active ? 0.5 : 0.3));
    spikeGrad.addColorStop(0.5, "#ffffff");
    spikeGrad.addColorStop(0.57, hsl(H, S, 85, active ? 0.5 : 0.3));
    spikeGrad.addColorStop(0.7, hsl(H, S, 80, active ? 0.3 : 0.2));
    spikeGrad.addColorStop(0.85, hsl(H, S, 75, active ? 0.15 : 0.1));
    spikeGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = spikeGrad;
    ctx.lineWidth = active ? 3 : 2;
    ctx.beginPath();
    ctx.moveTo(-R * 6, 0);
    ctx.lineTo(R * 6, 0);
    ctx.stroke();
    ctx.restore();
  }
}

/* ── Nebula Rendering ── */
function drawNebula(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean) {
  // Outer diffuse glow (fades to transparent)
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 6);
  outerGlow.addColorStop(0, hsl(H, S, 60, active ? 0.06 : 0.03));
  outerGlow.addColorStop(0.35, hsl(H, S, 55, active ? 0.04 : 0.02));
  outerGlow.addColorStop(0.6, hsl(H, S, 50, active ? 0.02 : 0.01));
  outerGlow.addColorStop(0.8, hsl(H, S, 45, active ? 0.007 : 0.003));
  outerGlow.addColorStop(0.94, hsl(H, S, 40, active ? 0.002 : 0.001));
  outerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = outerGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  // Multiple layered gas clouds
  for (let layer = 0; layer < 5; layer++) {
    const offsetX = (Math.random() - 0.5) * R * 0.8;
    const offsetY = (Math.random() - 0.5) * R * 0.8;
    const layerR = R * (1.2 + layer * 0.3);
    const layerH = (H + layer * 15) % 360;
    
    const nebGrad = ctx.createRadialGradient(
      cx + offsetX, cy + offsetY, 0,
      cx + offsetX, cy + offsetY, layerR
    );
    nebGrad.addColorStop(0, hsl(layerH, S, 60, active ? 0.25 : 0.15));
    nebGrad.addColorStop(0.3, hsl(layerH, S, 50, active ? 0.20 : 0.12));
    nebGrad.addColorStop(0.6, hsl(layerH, S, 40, active ? 0.10 : 0.06));
    nebGrad.addColorStop(0.85, hsl(layerH, S, 35, active ? 0.03 : 0.015));
    nebGrad.addColorStop(1, "transparent");
    ctx.fillStyle = nebGrad;
    ctx.beginPath();
    ctx.arc(cx + offsetX, cy + offsetY, layerR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Bright emission regions (star forming areas)
  for (let i = 0; i < 3; i++) {
    const emitX = cx + (Math.random() - 0.5) * R * 1.2;
    const emitY = cy + (Math.random() - 0.5) * R * 1.2;
    const emitGrad = ctx.createRadialGradient(emitX, emitY, 0, emitX, emitY, R * 0.4);
    emitGrad.addColorStop(0, hsl(H, S + 20, 80, active ? 0.4 : 0.25));
    emitGrad.addColorStop(0.5, hsl(H, S + 10, 60, active ? 0.2 : 0.12));
    emitGrad.addColorStop(0.85, hsl(H, S, 50, active ? 0.05 : 0.03));
    emitGrad.addColorStop(1, "transparent");
    ctx.fillStyle = emitGrad;
    ctx.beginPath();
    ctx.arc(emitX, emitY, R * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── Supernova Remnant Rendering ── */
function drawRemnant(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean) {
  // Outer diffuse glow
  const outerGlow = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 6);
  outerGlow.addColorStop(0, "transparent");
  outerGlow.addColorStop(0.25, hsl(H, S, 55, active ? 0.05 : 0.025));
  outerGlow.addColorStop(0.5, hsl(H, S, 50, active ? 0.03 : 0.015));
  outerGlow.addColorStop(0.75, hsl(H, S, 45, active ? 0.015 : 0.007));
  outerGlow.addColorStop(0.92, hsl(H, S, 40, active ? 0.005 : 0.002));
  outerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = outerGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  // Expanding shock wave shell
  const shellGrad = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 2.2);
  shellGrad.addColorStop(0, "transparent");
  shellGrad.addColorStop(0.3, hsl(H, S, 60, active ? 0.15 : 0.08));
  shellGrad.addColorStop(0.5, hsl(H, S, 50, active ? 0.35 : 0.22));
  shellGrad.addColorStop(0.65, hsl(H, S, 45, active ? 0.25 : 0.15));
  shellGrad.addColorStop(0.8, hsl(H, S, 40, active ? 0.12 : 0.07));
  shellGrad.addColorStop(0.95, hsl(H, S, 35, active ? 0.03 : 0.015));
  shellGrad.addColorStop(1, "transparent");
  ctx.fillStyle = shellGrad;
  ctx.beginPath(); ctx.arc(cx, cy, R * 2.2, 0, Math.PI * 2); ctx.fill();

  // Filaments (web-like structure)
  ctx.strokeStyle = hsl(H, S, 60, active ? 0.4 : 0.25);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const length = R * (1.5 + Math.random() * 0.7);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(
      cx + Math.cos(angle) * length,
      cy + Math.sin(angle) * length
    );
    ctx.stroke();
  }

  // Central pulsar/neutron star
  const pulsarGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.15);
  pulsarGrad.addColorStop(0, "#ffffff");
  pulsarGrad.addColorStop(0.5, hsl(200, 100, 80));
  pulsarGrad.addColorStop(1, hsl(200, 90, 50, 0.5));
  ctx.fillStyle = pulsarGrad;
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.15, 0, Math.PI * 2); ctx.fill();
}

/* ── Star Cluster Rendering ── */
function drawCluster(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean, rot: number) {
  // Outer diffuse glow
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 6);
  outerGlow.addColorStop(0, hsl(H, S, 70, active ? 0.10 : 0.05));
  outerGlow.addColorStop(0.35, hsl(H, S, 65, active ? 0.07 : 0.035));
  outerGlow.addColorStop(0.6, hsl(H, S, 60, active ? 0.04 : 0.02));
  outerGlow.addColorStop(0.8, hsl(H, S, 55, active ? 0.02 : 0.01));
  outerGlow.addColorStop(0.94, hsl(H, S, 50, active ? 0.007 : 0.003));
  outerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = outerGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  // Background glow
  const clusterGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.5);
  clusterGlow.addColorStop(0, hsl(H, S, 70, active ? 0.2 : 0.12));
  clusterGlow.addColorStop(0.5, hsl(H, S, 50, active ? 0.12 : 0.07));
  clusterGlow.addColorStop(0.85, hsl(H, S, 40, active ? 0.04 : 0.02));
  clusterGlow.addColorStop(1, "transparent");
  ctx.fillStyle = clusterGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 2.5, 0, Math.PI * 2); ctx.fill();

  // Individual stars in cluster (densely packed)
  const starCount = 40;
  for (let i = 0; i < starCount; i++) {
    const angle = (i / starCount) * Math.PI * 2 + rot;
    const dist = R * (0.3 + Math.random() * 1.2);
    const sx = cx + Math.cos(angle) * dist;
    const sy = cy + Math.sin(angle) * dist;
    const sr = Math.random() * 1.5 + 0.5;
    const starH = (H + Math.random() * 40 - 20) % 360;
    
    const starGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 2);
    starGrad.addColorStop(0, "#ffffff");
    starGrad.addColorStop(0.5, hsl(starH, S, 80, 0.8));
    starGrad.addColorStop(1, "transparent");
    ctx.fillStyle = starGrad;
    ctx.beginPath(); ctx.arc(sx, sy, sr * 2, 0, Math.PI * 2); ctx.fill();
  }
}

/* ── Galaxy Rendering ── */
function drawGalaxy(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, active: boolean, rot: number) {
  // Outer glow (before rotation)
  const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 6);
  outerGlow.addColorStop(0, hsl(H, S, 65, active ? 0.10 : 0.05));
  outerGlow.addColorStop(0.3, hsl(H, S, 60, active ? 0.07 : 0.035));
  outerGlow.addColorStop(0.5, hsl(H, S, 55, active ? 0.04 : 0.02));
  outerGlow.addColorStop(0.7, hsl(H, S, 50, active ? 0.02 : 0.01));
  outerGlow.addColorStop(0.87, hsl(H, S, 45, active ? 0.007 : 0.003));
  outerGlow.addColorStop(0.96, hsl(H, S, 40, active ? 0.002 : 0.001));
  outerGlow.addColorStop(1, "transparent");
  ctx.fillStyle = outerGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot * 0.3);
  ctx.scale(1, 0.4); // Flatten for galaxy view

  // Core bulge
  const bulge = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.5);
  bulge.addColorStop(0, hsl(H, S, 90, active ? 0.9 : 0.7));
  bulge.addColorStop(0.4, hsl(H, S, 70, active ? 0.6 : 0.4));
  bulge.addColorStop(0.8, hsl(H, S, 50, active ? 0.3 : 0.2));
  bulge.addColorStop(1, "transparent");
  ctx.fillStyle = bulge;
  ctx.beginPath(); ctx.arc(0, 0, R * 0.5, 0, Math.PI * 2); ctx.fill();

  // Spiral arms
  for (let arm = 0; arm < 2; arm++) {
    const armAngle = (arm * Math.PI);
    for (let t = 0; t < 50; t++) {
      const spiralAngle = armAngle + (t / 50) * Math.PI * 3;
      const spiralDist = (t / 50) * R * 2.5;
      const sx = Math.cos(spiralAngle) * spiralDist;
      const sy = Math.sin(spiralAngle) * spiralDist;
      
      const armGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, R * 0.3);
      armGrad.addColorStop(0, hsl(H, S, 70, active ? 0.4 : 0.25));
      armGrad.addColorStop(0.5, hsl(H, S, 50, active ? 0.2 : 0.12));
      armGrad.addColorStop(1, "transparent");
      ctx.fillStyle = armGrad;
      ctx.beginPath(); ctx.arc(sx, sy, R * 0.3, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Star dust scattered throughout
  for (let i = 0; i < 30; i++) {
    const dustAngle = Math.random() * Math.PI * 2;
    const dustDist = Math.random() * R * 2;
    const dx = Math.cos(dustAngle) * dustDist;
    const dy = Math.sin(dustAngle) * dustDist;
    ctx.fillStyle = hsl(H, S, 90, Math.random() * 0.3);
    ctx.beginPath(); ctx.arc(dx, dy, 0.5, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

/* ── Default Planet Rendering ── */
function drawPlanet(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, H: number, S: number, hasRing: boolean, moons: number, bands: number, lightX: number, lightY: number, active: boolean, rot: number) {
  /* ── outer diffuse glow (fades to transparent at edges) ── */
  const diffuseGlow = ctx.createRadialGradient(cx, cy, R * 0.8, cx, cy, R * 6);
  diffuseGlow.addColorStop(0, hsl(H, S, 60, active ? 0.06 : 0.03));
  diffuseGlow.addColorStop(0.35, hsl(H, S, 55, active ? 0.04 : 0.02));
  diffuseGlow.addColorStop(0.6, hsl(H, S, 50, active ? 0.02 : 0.01));
  diffuseGlow.addColorStop(0.8, hsl(H, S, 47, active ? 0.008 : 0.004));
  diffuseGlow.addColorStop(0.93, hsl(H, S, 45, active ? 0.003 : 0.0015));
  diffuseGlow.addColorStop(1, "transparent");
  ctx.fillStyle = diffuseGlow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 6, 0, Math.PI * 2); ctx.fill();

  /* ── outer glow ── */
  const glow = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 2.4);
  glow.addColorStop(0, hsl(H, S, 55, active ? 0.22 : 0.10));
  glow.addColorStop(0.5, hsl(H, S, 50, active ? 0.12 : 0.06));
  glow.addColorStop(0.85, hsl(H, S, 45, active ? 0.04 : 0.02));
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(cx, cy, R * 2.4, 0, Math.PI * 2); ctx.fill();

  /* ── clip sphere ── */
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();

  /* base gradient */
  const bg = ctx.createRadialGradient(
    cx + lightX * R * 0.9, cy + lightY * R * 0.9, R * 0.04,
    cx, cy, R * 1.06
  );
  bg.addColorStop(0,   hsl(H, S, 70));
  bg.addColorStop(0.25,hsl(H, S, 50));
  bg.addColorStop(0.60,hsl(H, S, 30));
  bg.addColorStop(1,   hsl(H, S, 8));
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

  /* bands */
  for (let b = 0; b < bands; b++) {
    const by = cy - R + (b + 0.5) * (R * 2 / bands);
    const ny = (by - cy) / R;
    const cosL = Math.sqrt(Math.max(0, 1 - ny * ny));
    const bw = R * cosL * 2;
    const bandH = (H + b * 18) % 360;
    const grad = ctx.createLinearGradient(cx - bw / 2, by, cx + bw / 2, by);
    grad.addColorStop(0,   "transparent");
    grad.addColorStop(0.15, hsl(bandH, S + 10, 65, 0.18));
    grad.addColorStop(0.5,  hsl(bandH, S + 15, 70, 0.26));
    grad.addColorStop(0.85, hsl(bandH, S + 10, 65, 0.18));
    grad.addColorStop(1,   "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(cx - bw / 2, by - R / bands * 0.45, bw, R / bands * 0.9);
  }

  /* terminator shadow */
  const term = ctx.createRadialGradient(
    cx - lightX * R * 0.5, cy - lightY * R * 0.5, R * 0.1,
    cx + R * 0.55, cy, R * 1.25
  );
  term.addColorStop(0,    "transparent");
  term.addColorStop(0.38, "rgba(0,0,20,0.10)");
  term.addColorStop(0.58, "rgba(0,0,20,0.55)");
  term.addColorStop(0.82, "rgba(0,0,18,0.85)");
  term.addColorStop(1,    "rgba(0,0,10,0.96)");
  ctx.fillStyle = term;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

  /* specular */
  const spec = ctx.createRadialGradient(
    cx + lightX * R, cy + lightY * R, 0,
    cx + lightX * R, cy + lightY * R, R * 0.3
  );
  spec.addColorStop(0, "rgba(255,255,255,0.28)");
  spec.addColorStop(0.5,"rgba(255,255,255,0.07)");
  spec.addColorStop(1,  "transparent");
  ctx.fillStyle = spec;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

  /* atmosphere rim */
  const rim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
  rim.addColorStop(0,   "transparent");
  rim.addColorStop(0.65, hsl(H, S, 70, 0.06));
  rim.addColorStop(1,    hsl(H, S, 80, 0.25));
  ctx.fillStyle = rim;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();

  ctx.restore(); /* end sphere clip */

  /* atmosphere halo */
  const halo = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.16);
  halo.addColorStop(0,   hsl(H, S, 65, 0.32));
  halo.addColorStop(0.6, hsl(H, S, 55, 0.08));
  halo.addColorStop(1,   "transparent");
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy, R * 1.16, 0, Math.PI * 2); ctx.fill();

  /* ring (back half) */
  if (hasRing) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, 0.26);
    const rIn = R * 1.3, rOut = R * 2.15;
    const rg = ctx.createRadialGradient(0, 0, rIn, 0, 0, rOut);
    rg.addColorStop(0,   hsl(H, S - 10, 80, 0));
    rg.addColorStop(0.06,hsl(H, S - 10, 80, 0.55));
    rg.addColorStop(0.35,hsl(H, S,      70, 0.38));
    rg.addColorStop(0.68,hsl(H, S + 5,  65, 0.20));
    rg.addColorStop(0.90,hsl(H, S,      60, 0.08));
    rg.addColorStop(1,   "transparent");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(0, 0, rOut, 0, Math.PI * 2);
    ctx.arc(0, 0, rIn,  0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();

    /* cut out planet from ring, then redraw front sphere */
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.arc(cx, cy, R * 0.995, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    /* redraw planet front */
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    const bg2 = ctx.createRadialGradient(
      cx + lightX * R * 0.9, cy + lightY * R * 0.9, R * 0.04, cx, cy, R * 1.06
    );
    bg2.addColorStop(0,   hsl(H, S, 70));
    bg2.addColorStop(0.25,hsl(H, S, 50));
    bg2.addColorStop(0.60,hsl(H, S, 30));
    bg2.addColorStop(1,   hsl(H, S, 8));
    ctx.fillStyle = bg2; 
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = term; 
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  /* moons */
  for (let m = 0; m < moons; m++) {
    const angle = rot + (m * Math.PI * 2 / moons);
    const dist  = R * (1.55 + m * 0.38);
    const mx    = cx + Math.cos(angle) * dist;
    const my    = cy + Math.sin(angle) * dist * 0.36;
    const mr    = Math.max(1.5, R * (0.072 - m * 0.012));
    const mg    = ctx.createRadialGradient(
      mx - mr * 0.28, my - mr * 0.22, mr * 0.05, mx, my, mr
    );
    mg.addColorStop(0, "#d0e0e8");
    mg.addColorStop(0.6,"#607080");
    mg.addColorStop(1, "#1a2430");
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
  }
}

/* ── CSS ── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap');
  html,body{margin:0;padding:0;overflow:hidden;}
  *{box-sizing:border-box;}
  .orb{font-family:'Orbitron',monospace;}
  .stm{font-family:'Share Tech Mono',monospace;}
  @keyframes bootIn{0%{opacity:0;transform:translateY(20px) scale(0.97);}60%{opacity:1;transform:translateY(-1px) scale(1.002);}100%{opacity:1;transform:translateY(0)scale(1);}}
  @keyframes scanDown{0%{top:-4px;}100%{top:100%;}}
  @keyframes glitch1{0%,95%,100%{transform:translateX(0);}96%{transform:translateX(-3px);}97%{transform:translateX(2px);}98%{transform:translateX(-1px);}}
  @keyframes pulse{0%,100%{opacity:0.55;}50%{opacity:1;}}
  @keyframes detailIn{0%{opacity:0;transform:translateY(12px);}100%{opacity:1;transform:translateY(0);}}
  
  /* Sidebar Anim */
  @keyframes slideLeftIn { 0% { transform: translateX(100%); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }

  .panel-boot{animation:bootIn 0.8s cubic-bezier(0.22,1,0.36,1) both;}
  .glitch{animation:glitch1 8s ease-in-out infinite;}
  .detail-anim{animation:detailIn 0.3s cubic-bezier(0.22,1,0.36,1) both;}
  
  .confirm-btn{
    padding:13px 48px;border-radius:6px;
    background:linear-gradient(160deg,#0d7ec4,#0a5a96,#063870);
    border:1.5px solid rgba(100,200,255,0.45);color:#fff;
    font-family:'Orbitron',monospace;font-weight:700;font-size:12px;
    letter-spacing:5px;cursor:pointer;
    box-shadow:0 0 22px rgba(0,100,200,0.4),inset 0 1px 0 rgba(150,220,255,0.18);
    transition:filter 0.15s;
  }
  .confirm-btn:hover{filter:brightness(1.28);}
  
  .nav-btn{
    width:36px;height:36px;border-radius:50%;
    background:rgba(0,8,30,0.75);
    border:1px solid rgba(0,140,220,0.3);
    color:rgba(0,180,255,0.8);font-size:18px;
    cursor:pointer;display:flex;align-items:center;justify-content:center;
    transition:border-color 0.2s,color 0.2s,background 0.2s;
    user-select:none;flex-shrink:0;
  }
  .nav-btn:hover{border-color:rgba(0,200,255,0.7);color:#fff;background:rgba(0,20,60,0.9);}
  
  .pip{
    width:5px;height:5px;border-radius:50%;
    background:rgba(0,100,160,0.4);
    transition:background 0.2s,transform 0.2s;cursor:pointer;
    flex-shrink:0;
  }
  .pip.active{background:#00c8ff;transform:scale(1.5);}

  /* ── Sidebar & Task Card Styles ── */
  .sidebar-container {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: 320px; background: rgba(0, 5, 15, 0.85);
    border-left: 1px solid rgba(0, 180, 255, 0.2);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    padding: 24px 16px; z-index: 10;
    box-shadow: -10px 0 30px rgba(0,0,0,0.6);
    animation: slideLeftIn 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  }
  .task-card {
    background: rgba(0, 20, 40, 0.4);
    border: 1px solid rgba(0, 150, 255, 0.15);
    border-radius: 6px; padding: 14px 12px; margin-bottom: 12px;
    cursor: pointer; transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .task-card::before {
    content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 3px;
    background: #00c8ff; transform: scaleY(0); transition: transform 0.2s ease;
    transform-origin: bottom;
  }
  .task-card:hover {
    background: rgba(0, 40, 80, 0.6);
    border-color: rgba(0, 200, 255, 0.5);
    transform: translateX(-4px);
    box-shadow: 0 4px 12px rgba(0, 150, 255, 0.15);
  }
  .task-card:hover::before { transform: scaleY(1); }
  
  .task-bar-bg { background: rgba(0,0,0,0.5); height: 4px; border-radius: 2px; overflow: hidden; margin-top: 10px; }
  .task-bar-fill { height: 100%; background: #00c8ff; box-shadow: 0 0 8px #00c8ff; transition: width 0.3s; }
  
  .sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(0, 150, 255, 0.3); border-radius: 2px; }
  .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 200, 255, 0.6); }
`;

const PLANET_SIZE_ACTIVE = 220;
const PLANET_SIZE_SIDE   = 130;
/* gap between planet centres in px */
const STRIDE = 300;

export default function DestinationSelectPage(): React.JSX.Element {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const [mounted,  setMounted]  = useState(false);
  const [index,    setIndex]    = useState(0);
  const [animKey,  setAnimKey]  = useState(0);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskError, setCreateTaskError] = useState("");
  const [pastTasks, setPastTasks] = useState<PastTask[]>([]);
  const dragStartX = useRef<number | null>(null);
  const dragBaseIdx = useRef(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(buildApiUrl("/auth/me"), {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          router.replace("/login");
          return;
        }
      } catch {
        router.replace("/login");
      }
    };
    void checkAuth();
  }, [router]);

  useEffect(() => {
    const loadPastTasks = async () => {
      try {
        const meRes = await fetch(buildApiUrl("/auth/me"), {
          method: "GET",
          credentials: "include",
        });
        if (!meRes.ok) return;
        const meData = await meRes.json();
        const userId = meData?.id;
        if (!userId) return;

        const taskRes = await fetch(`${buildApiUrl("/tasks/me")}?user_id=${userId}`);
        if (!taskRes.ok) return;
        const taskData = await taskRes.json();

        const mapped: PastTask[] = (taskData?.members ?? []).map((m: MemberTaskApi) => ({
          id: String(m.member_id),
          memberId: String(m.member_id),
          taskId: String(m.task_id ?? ""),
          title: String(m.task_name ?? "TASK"),
          destId: Number(m.planet_id ?? 0),
          goalTime: Math.max(0, Number(m.goal_time ?? 0)),
          timeSpent: Math.max(0, Math.floor(Number(m.total_time ?? 0) / 60)),
        }));

        setPastTasks(mapped);
      } catch {
        // 履歴取得失敗時は既存のモック表示にフォールバック
      }
    };

    void loadPastTasks();
    const timer = setInterval(() => {
      void loadPastTasks();
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const go = useCallback((next: number) => {
    const len = DESTINATIONS.length;
    const wrapped = ((next % len) + len) % len;
    setIndex(wrapped);
    setAnimKey(k => k + 1);
  }, []);

  /* ── Arrow keys ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  { e.preventDefault(); go(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  /* ── Pointer drag ── */
  const onPD = useCallback((e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    dragBaseIdx.current = index;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [index]);

  const onPM = useCallback((e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = dragStartX.current - e.clientX;
    const delta = Math.round(dx / (STRIDE * 0.55));
    if (delta !== 0) go(dragBaseIdx.current + delta);
  }, [go]);

  const onPU = useCallback(() => { dragStartX.current = null; }, []);

  /* ── Wheel ── */
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    go(index + (e.deltaX !== 0 ? (e.deltaX > 0 ? 1 : -1) : (e.deltaY > 0 ? 1 : -1)));
  }, [index, go]);

  const dest = DESTINATIONS[index];
  const glowColor = `hsl(${dest.hue},${dest.sat}%,65%)`;

  const handleLaunch = useCallback(async () => {
    if (isCreatingTask) return;
    setIsCreatingTask(true);
    setCreateTaskError("");

    try {
      // login 時に保存した email を優先利用。未保存時のみ /auth/me を叩く。
      let email = localStorage.getItem("login_email")?.trim() ?? "";
      if (!email) {
        const meRes = await fetch(buildApiUrl("/auth/me"), {
          method: "GET",
          credentials: "include",
        });
        if (!meRes.ok) {
          throw new Error("ログイン情報を取得できませんでした（再ログインしてください）");
        }
        const meData = await meRes.json();
        email = meData?.email ?? "";
      }

      if (!email) {
        throw new Error("ユーザーのメールアドレスを取得できませんでした");
      }

      const taskRes = await fetch(buildApiUrl("/tasks/task"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${dest.name} mission`,
          planet_id: dest.id,
          goal_time: dest.timeRaw * 60,
          leave_time: dest.timeRaw * 60,
          member_emails: [email],
        }),
      });

      if (!taskRes.ok) {
        const errData = await taskRes.json().catch(() => ({}));
        throw new Error(errData?.detail ?? "タスク作成に失敗しました");
      }

      const taskData = await taskRes.json();
      const taskId = taskData?.task_id;
      const memberId = taskData?.members?.[0]?.member_id;
      if (!taskId) {
        throw new Error("task_id を取得できませんでした");
      }
      if (!memberId) {
        throw new Error("member_id を取得できませんでした");
      }

      window.location.href = `/app?dest=${dest.id}&time=${dest.timeRaw}&task_id=${taskId}&member_id=${memberId}`;
    } catch (error) {
      const message = error instanceof Error ? error.message : "タスク作成に失敗しました";
      setCreateTaskError(message);
    } finally {
      setIsCreatingTask(false);
    }
  }, [dest.id, dest.name, dest.timeRaw, isCreatingTask]);

  /* ── Visible planets: centre ± 2 ── */
  const visRange = 2;
  const visItems = [];
  for (let v = -visRange; v <= visRange; v++) {
    const i = index + v;
    if (i < 0 || i >= DESTINATIONS.length) continue;
    const d = DESTINATIONS[i];
    const isActive = v === 0;
    const absDist  = Math.abs(v);
    const pSize    = isActive ? PLANET_SIZE_ACTIVE : PLANET_SIZE_SIDE;
    const scale    = isActive ? 1 : absDist === 1 ? 0.70 : 0.45;
    const opacity  = isActive ? 1 : absDist === 1 ? 0.65 : 0.30;
    const xOff     = v * STRIDE;
    visItems.push({ i, d, isActive, pSize, scale, opacity, xOff, v });
  }

  return (
    <div style={{ position:"fixed", inset:0, overflow:"hidden", background:"#000008", userSelect:"none" }}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", display:"block" }} />
      {mounted && <StarBackground canvasRef={canvasRef} />}

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,12,0.5) 70%,rgba(0,0,6,0.80) 100%)", pointerEvents:"none" }} />
      {/* Scan line */}
      <div style={{ position:"absolute", left:0, right:0, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,180,255,0.14) 20%,rgba(0,200,255,0.22) 50%,rgba(0,180,255,0.14) 80%,transparent)", animation:"scanDown 8s linear infinite", zIndex:2, pointerEvents:"none" }} />

      {mounted && (
        <>
          {/* ── Main UI (Shifted left to accommodate sidebar without breaking design) ── */}
          <div style={{ position:"absolute", inset:"0 320px 0 0", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:0 }}>

            {/* ── Header ── */}
            <div className="panel-boot" style={{ textAlign:"center", marginBottom:16 }}>
              <div className="stm" style={{ fontSize:"9px", letterSpacing:"6px", color:"rgba(0,160,255,0.38)", marginBottom:6 }}>
                MISSION CONTROL · DESTINATION SELECT
              </div>
              <div className="orb glitch" style={{ fontSize:"min(max(16px,2.8vw),26px)", fontWeight:900, color:"#fff", letterSpacing:"0.12em", textShadow:"0 0 28px rgba(0,180,255,0.35)" }}>
                目的地を選択
              </div>
              <div style={{ marginTop:8, height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,180,255,0.4),transparent)" }} />
            </div>

            {/* ── Planet carousel ── */}
            <div
              ref={trackRef}
              style={{ position:"relative", width:"100%", height: PLANET_SIZE_ACTIVE + 40, overflow:"visible", cursor:"grab", flexShrink:0 }}
              onPointerDown={onPD}
              onPointerMove={onPM}
              onPointerUp={onPU}
              onPointerCancel={onPU}
              onWheel={onWheel}
            >
              {visItems.map(({ i, d, isActive, pSize, scale, opacity, xOff }) => (
                <div
                  key={i}
                  onClick={() => { if (!isActive) go(i); }}
                  style={{
                    position:"absolute",
                    left:"50%",
                    top:"50%",
                    transform:`translate(calc(-50% + ${xOff}px), -50%) scale(${scale})`,
                    opacity,
                    transition:"transform 0.32s cubic-bezier(0.22,1,0.36,1), opacity 0.25s",
                    cursor: isActive ? "grab" : "pointer",
                    zIndex: isActive ? 2 : 1,
                  }}
                >
                  <Planet dest={d} size={pSize} active={isActive} />
                </div>
              ))}

              {/* Glow under active planet */}
              <div style={{
                position:"absolute", left:"50%", bottom:0,
                transform:"translateX(-50%)",
                width:180, height:28,
                background:`radial-gradient(ellipse at 50% 100%,${glowColor.replace(')',',0.35)')} 0%,transparent 70%)`,
                pointerEvents:"none",
                transition:"background 0.35s",
                zIndex:0,
              }} />
            </div>

            {/* ── Nav row ── */}
            <div style={{ display:"flex", alignItems:"center", gap:14, marginTop:8 }}>
              <button className="nav-btn" onClick={() => go(index - 1)}>‹</button>
              <div className="stm" style={{ fontSize:"10px", letterSpacing:"3px", color:"rgba(0,140,200,0.6)", minWidth:60, textAlign:"center" }}>
                {String(index + 1).padStart(2,"0")} / {String(DESTINATIONS.length).padStart(2,"0")}
              </div>
              <button className="nav-btn" onClick={() => go(index + 1)}>›</button>
            </div>

            {/* ── Detail card ── */}
            <div
              key={animKey}
              className="detail-anim"
              style={{
                marginTop: 18, width: "90%", maxWidth: 480,
                background: "linear-gradient(165deg,rgba(0,10,30,0.95),rgba(0,5,20,0.98))",
                border: `1px solid ${glowColor.replace(')', ',0.25)')}`,
                borderTop: `3px solid ${glowColor}`,
                borderRadius: "4px 4px 12px 12px",
                boxShadow: `0 20px 50px rgba(0,0,0,0.9), 0 0 20px ${glowColor.replace(')', ',0.15)')}`,
                overflow: "hidden", flexShrink: 0,
                padding: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                
                {/* Left: Name & Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="orb" style={{ 
                    fontSize: 18, fontWeight: 900, color: "#fff", 
                    letterSpacing: "0.1em", marginBottom: 10,
                    textShadow: `0 0 10px ${glowColor}`
                  }}>
                    {dest.name}
                  </div>
                  <div className="stm" style={{ 
                    fontSize: 11, color: "rgba(180,220,255,0.85)", 
                    lineHeight: 1.6, letterSpacing: "0.5px" 
                  }}>
                    {dest.desc}
                  </div>
                </div>

                {/* Right: Telemetry Data (Distance & Time) */}
                <div style={{ 
                  display: "flex", flexDirection: "column", gap: 12, 
                  paddingLeft: 16, borderLeft: "1px solid rgba(0,180,255,0.2)",
                  minWidth: "135px"
                }}>
                  {/* Distance block */}
                  <div>
                    <div className="stm" style={{ fontSize: "9px", color: glowColor, letterSpacing: "2px", marginBottom: 4, opacity: 0.8 }}>
                      DISTANCE
                    </div>
                    <div className="orb" style={{ fontSize: 16, color: "#fff", fontWeight: 700 }}>
                      {dest.dist.replace("光年", "")}<span style={{ fontSize: 10, marginLeft: 4, color: "rgba(255,255,255,0.4)" }}>光年</span>
                    </div>
                  </div>

                  {/* Time block */}
                  <div style={{ padding: "8px 0 0 0", borderTop: "1px dashed rgba(0,180,255,0.2)" }}>
                    <div className="stm" style={{ fontSize: "9px", color: "#00c8ff", letterSpacing: "2px", marginBottom: 4, opacity: 0.8 }}>
                      TARGET TIME
                    </div>
                    <div className="orb" style={{ fontSize: 16, color: "#00c8ff", fontWeight: 700, textShadow: "0 0 8px rgba(0,200,255,0.5)" }}>
                      {dest.time}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Status bar */}
              <div style={{ 
                marginTop: 18, paddingTop: 10, borderTop: "1px solid rgba(0,180,255,0.1)", 
                display: "flex", justifyContent: "center" 
              }}>
                 <div className="stm" style={{ fontSize: "8px", color: "rgba(0,180,255,0.3)", letterSpacing: "4px" }}>
                  NAVIGATION SECTOR ACTIVE
                 </div>
              </div>
            </div>

            {/* ── Pips ── */}
            <div style={{ marginTop:14, display:"flex", gap:5, alignItems:"center", flexWrap:"nowrap", maxWidth:"80vw", overflow:"hidden" }}>
              {DESTINATIONS.map((_, i) => (
                <div
                  key={i}
                  className={"pip" + (i === index ? " active" : "")}
                  onClick={() => go(i)}
                />
              ))}
            </div>

            {/* ── Confirm Button ── */}
            <div style={{ marginTop:18, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <button className="confirm-btn orb" onClick={handleLaunch} disabled={isCreatingTask} style={{ opacity: isCreatingTask ? 0.7 : 1, cursor: isCreatingTask ? "wait" : "pointer" }}>
                {isCreatingTask ? "接続中..." : "出発する"}
              </button>
              {createTaskError && (
                <div className="stm" style={{ fontSize:"10px", color:"#ff6f6f", letterSpacing:"1px" }}>
                  {createTaskError}
                </div>
              )}
            </div>

            <div className="panel-boot stm" style={{ marginTop:14, fontSize:"8px", letterSpacing:"3px", color:"rgba(0,80,130,0.38)" }}>
              SECTOR 7-G · QUADRANT DELTA · {new Date().getFullYear()}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR: Past Tasks ── */}
          <div className="sidebar-container">
            <div className="stm" style={{ fontSize: "12px", color: "#00c8ff", letterSpacing: "3px", marginBottom: "20px", borderBottom: "1px solid rgba(0,200,255,0.3)", paddingBottom: "8px" }}>
              PAST MISSIONS
            </div>
            
            <div className="sidebar-scroll" style={{ flex: 1, overflowY: "auto", paddingRight: "8px" }}>
              {pastTasks.map(task => {
                const targetDest = DESTINATIONS.find(d => d.id === task.destId);
                if (!targetDest) return null;
                
                const progressPercent = Math.min(100, (task.timeSpent / targetDest.timeRaw) * 100);

                return (
                  <div 
                    key={task.id} 
                    className="task-card"
                    onClick={() => {
                      const goalMin = Math.max(1, Math.ceil((task.goalTime || targetDest.timeRaw * 60) / 60));
                      window.location.href = `/app?dest=${targetDest.id}&time=${goalMin}&task_id=${task.taskId}&member_id=${task.memberId}`;
                    }}
                  >
                    <div style={{ fontSize: 13, color: "#fff", fontWeight: "bold", marginBottom: 6, lineHeight: 1.4 }}>
                      {task.title}
                    </div>
                    
                    <div className="stm" style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(180,220,255,0.7)" }}>
                      <span>⌖ {targetDest.name}</span>
                      <span style={{ color: "#00c8ff" }}>{task.timeSpent} / {targetDest.timeRaw} min</span>
                    </div>

                    <div className="task-bar-bg">
                      <div className="task-bar-fill" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                );
              })}
              {pastTasks.length === 0 && (
                <div className="stm" style={{ fontSize: "10px", color: "rgba(150,190,220,0.55)", lineHeight: 1.8 }}>
                  参加可能なタスクはまだありません
                </div>
              )}
            </div>
            
            <div className="stm" style={{ marginTop: "16px", fontSize: "9px", color: "rgba(0,150,255,0.4)", textAlign: "center", letterSpacing: "1px" }}>
              SYSTEM READY. WAITING FOR INPUT...
            </div>
          </div>
        </>
      )}
    </div>
  );
}

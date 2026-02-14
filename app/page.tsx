"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const start = Date.now();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const t = (Date.now() - start) / 1000;
      const W = canvas.width;
      const H = canvas.height;

      ctx.fillStyle = "#06000f";
      ctx.fillRect(0, 0, W, H);

      const lights = [
        {
          x: W * 0.5 + Math.sin(t * 0.4) * W * 0.38,
          y: H * 0.5 + Math.cos(t * 0.31) * H * 0.38,
          r: W * 0.65,
          hue: (t * 22) % 360,
          alpha: 0.72,
        },
        {
          x: W * 0.5 + Math.cos(t * 0.53) * W * 0.35,
          y: H * 0.5 + Math.sin(t * 0.61) * H * 0.35,
          r: W * 0.55,
          hue: ((t * 22) + 120) % 360,
          alpha: 0.62,
        },
        {
          x: W * 0.5 + Math.sin(t * 0.72) * W * 0.28,
          y: H * 0.5 + Math.cos(t * 0.49) * H * 0.28,
          r: W * 0.45,
          hue: ((t * 22) + 240) % 360,
          alpha: 0.45,
        },
      ];

      for (const l of lights) {
        const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        g.addColorStop(0, `hsla(${l.hue},100%,62%,${l.alpha})`);
        g.addColorStop(0.5, `hsla(${l.hue},100%,45%,${l.alpha * 0.3})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }

      const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.15, W / 2, H / 2, H * 0.88);
      vg.addColorStop(0, "transparent");
      vg.addColorStop(1, "rgba(0,0,0,0.88)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      for (let y = 0; y < H; y += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.07)";
        ctx.fillRect(0, y, W, 2);
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes glow {
          from { text-shadow: 0 0 40px rgba(255,80,255,0.55), 0 0 90px rgba(0,210,255,0.3); }
          to   { text-shadow: 0 0 90px rgba(255,80,255,1), 0 0 180px rgba(0,210,255,0.75), 0 0 220px rgba(255,220,0,0.28); }
        }
        @keyframes scrollBounce {
          0%,100% { opacity: 0.35; transform: translateY(0); }
          50%      { opacity: 0.7;  transform: translateY(9px); }
        }

        .badge      { animation: fadeDown 0.9s ease both; }
        .boss-label {
          background: linear-gradient(90deg,#f0f,#0ff,#ff0,#f0f);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: fadeDown 0.9s 0.15s ease both, shimmer 3s linear infinite;
        }
        .title {
          margin: 0;
          color: #fff;
          animation: glow 2.2s ease-in-out infinite alternate, fadeUp 1s 0.3s ease both;
        }
        .title-accent {
          background: linear-gradient(135deg,#ff6ef7,#6ef7ff,#f7ff6e,#ff6ef7);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradShift 4.5s ease infinite;
        }
        .divider  { animation: fadeIn 1s 0.75s ease both; }
        .subtitle { animation: fadeIn 1s 0.95s ease both; }
        .buttons  { animation: fadeUp 1s 1.1s ease both; }
        .scroll-line {
          animation: scrollBounce 2.2s ease-in-out infinite;
        }

        .btn-primary {
          border: none;
          cursor: pointer;
          border-radius: 9999px;
          padding: 15px 40px;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #000;
          background: linear-gradient(135deg,#ff6ef7,#6ef7ff);
          box-shadow: 0 0 44px rgba(255,110,247,0.55);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .btn-primary:hover  { transform: scale(1.05); box-shadow: 0 0 60px rgba(255,110,247,0.8); }
        .btn-primary:active { transform: scale(0.97); }

        .btn-secondary {
          border: 1px solid rgba(255,255,255,0.22);
          cursor: pointer;
          border-radius: 9999px;
          padding: 15px 40px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(10px);
          transition: transform 0.18s, background 0.18s;
        }
        .btn-secondary:hover  { transform: scale(1.05); background: rgba(255,255,255,0.1); }
        .btn-secondary:active { transform: scale(0.97); }

        /* ↓ 追加セクション用の共通スタイル */
        .section {
          position: relative;
          z-index: 2;
          max-width: 860px;
          margin: 0 auto;
          padding: 120px 24px;
          text-align: center;
        }
        .section-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 900;
          letter-spacing: -0.02em;
          margin-bottom: 24px;
          background: linear-gradient(135deg,#ff6ef7,#6ef7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .section-body {
          font-size: 17px;
          line-height: 1.95;
          color: rgba(255,255,255,0.65);
        }
        .divider-line {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, rgba(255,110,247,0.5), transparent);
          margin: 0 auto;
        }
      `}</style>

      {/* ── fixed canvas 背景 ── */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* ── ノイズグレイン (fixed) ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.22,
          mixBlendMode: "overlay",
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
        }}
      />

      {/* ── スクロールできるページ本体 ── */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ヒーローセクション */}
        <section
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "80px 24px 120px",
            position: "relative",
          }}
        >
          <p className="badge" style={{ marginBottom: 36, fontSize: 11, letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)" }}>
            ✦ 佐賀県最強 ✦
          </p>

          <p className="boss-label" style={{ marginBottom: 6, fontSize: 13, fontWeight: 900, letterSpacing: "0.62em", textTransform: "uppercase" }}>
            BOSS
          </p>

          <h1
            className="title"
            style={{
              fontSize: "clamp(4rem, 17vw, 13rem)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.02em",
            }}
          >
            ガバイ
            <br />
            <span className="title-accent">ソン</span>
          </h1>

          <div className="divider" style={{ display: "flex", alignItems: "center", gap: 16, margin: "32px 0" }}>
            <div style={{ width: 88, height: 1, background: "linear-gradient(90deg,transparent,#ff6ef7)" }} />
            <span style={{ fontSize: 22 }}>🔥</span>
            <div style={{ width: 88, height: 1, background: "linear-gradient(90deg,#6ef7ff,transparent)" }} />
          </div>

          <p className="subtitle" style={{ maxWidth: 480, fontSize: 17, lineHeight: 1.9, color: "rgba(255,255,255,0.68)", marginBottom: 52 }}>
            佐賀弁で「すごい」。
            <br />
            ガバイすごか ガバイソン。
            <br />
            <strong style={{ color: "rgba(255,255,255,0.92)" }}>最強の存在、ここに降臨。</strong>
          </p>

          <div className="buttons" style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <button className="btn-primary">✦ 始める ✦</button>
            <button className="btn-secondary">詳しく見る</button>
          </div>

          {/* スクロールヒント */}
          <div
            style={{
              position: "absolute",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.3)",
            }}
          >
            <span style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase" }}>Scroll</span>
            <div
              className="scroll-line"
              style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }}
            />
          </div>
        </section>

        {/* ── About セクション ── */}
        <div className="divider-line" />
        <section className="section" id="about">
          <h2 className="section-title">ガバイとは？</h2>
          <p className="section-body">
            佐賀・長崎の方言で「とても」「すごく」を意味する言葉。<br />
            ガバイソンはその名の通り、すべてにおいてガバイ（＝超絶）な存在。<br />
            佐賀の誇りを胸に、最強のパワーをこの世に解き放つ。
          </p>
        </section>

        {/* ── Power セクション ── */}
        <div className="divider-line" />
        <section className="section" id="power">
          <h2 className="section-title">その力</h2>
          <p className="section-body">
            光速を超える思考速度。<br />
            宇宙を包む包容力。<br />
            そして、無限のガバイエネルギー。<br />
            ガバイソンの前に不可能という文字は存在しない。
          </p>
        </section>

        {/* ── Story セクション ── */}
        <div className="divider-line" />
        <section className="section" id="story">
          <h2 className="section-title">物語</h2>
          <p className="section-body">
            遥か彼方の佐賀の星から飛来し、<br />
            鳥栖市の地に静かに降り立ったBOSS。<br />
            その姿を見た者は皆、口を揃えてこう言う。<br />
            <strong style={{ color: "rgba(255,255,255,0.9)", display: "block", marginTop: 16, fontSize: 20 }}>
              「ガバイすごか…」
            </strong>
          </p>
        </section>

        {/* ── フッター ── */}
        <div className="divider-line" />
        <footer style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.25)", fontSize: 12, letterSpacing: "0.15em", position: "relative", zIndex: 2 }}>
          © 2026 GABAISON — 佐賀県最強
        </footer>
      </div>
    </>
  );
}
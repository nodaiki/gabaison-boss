module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SpaceshipPomodoro
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function randRange(a, b) {
    return a + Math.random() * (b - a);
}
function SpaceshipPomodoro() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const starsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const largeObjRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const dustRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])([]);
    const animRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const tRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const isRunningRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const isEjectingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const warpSpeedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const gForceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const timeLeftRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(25 * 60);
    const progressRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const warpPhaseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])("idle");
    const missionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    const distanceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const warpAnimRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(0);
    const TOTAL_TIME = 25 * 60;
    const SPEED_PER_SEC = 2_777_777;
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(TOTAL_TIME);
    const [distance, setDistance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [gForce, setGForce] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isEjecting, setIsEjecting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [warpPhase, setWarpPhase] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("idle");
    const [isMounted, setIsMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [missionDone, setMissionDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        isRunningRef.current = isRunning;
    }, [
        isRunning
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        isEjectingRef.current = isEjecting;
    }, [
        isEjecting
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        gForceRef.current = gForce;
    }, [
        gForce
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        timeLeftRef.current = timeLeft;
    }, [
        timeLeft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        progressRef.current = (TOTAL_TIME - timeLeft) / TOTAL_TIME;
    }, [
        timeLeft
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        warpPhaseRef.current = warpPhase;
    }, [
        warpPhase
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        missionRef.current = missionDone;
    }, [
        missionDone
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        distanceRef.current = distance;
    }, [
        distance
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        cancelAnimationFrame(warpAnimRef.current);
        const target = isRunning ? 1 : 0;
        const step = ()=>{
            const c = warpSpeedRef.current, d = target - c;
            if (Math.abs(d) < 0.001) {
                warpSpeedRef.current = target;
                return;
            }
            warpSpeedRef.current = c + d * (isRunning ? 0.025 : 0.04);
            warpAnimRef.current = requestAnimationFrame(step);
        };
        warpAnimRef.current = requestAnimationFrame(step);
        return ()=>cancelAnimationFrame(warpAnimRef.current);
    }, [
        isRunning
    ]);
    const startWarp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setWarpPhase("spinup");
        setTimeout(()=>{
            setIsRunning(true);
            setWarpPhase("warp");
        }, 1200);
    }, []);
    const stopWarp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setWarpPhase("spindown");
        setTimeout(()=>{
            setIsRunning(false);
            setWarpPhase("idle");
        }, 900);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(()=>{
                setTimeLeft((p)=>{
                    const n = p - 1;
                    timeLeftRef.current = n;
                    return n;
                });
                setDistance((p)=>p + SPEED_PER_SEC);
                const gf = (Math.random() - 0.5) * 2.2;
                setGForce(gf);
                gForceRef.current = gf;
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            stopWarp();
            setMissionDone(true);
            missionRef.current = true;
            setTimeout(()=>{
                setMissionDone(false);
                missionRef.current = false;
            }, 5000);
        }
        return ()=>clearInterval(timer);
    }, [
        isRunning,
        timeLeft,
        stopWarp
    ]);
    const handleEject = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (isEjecting) return;
        setIsEjecting(true);
        isEjectingRef.current = true;
        setWarpPhase("idle");
        setTimeout(()=>{
            setIsRunning(false);
            isRunningRef.current = false;
            setIsEjecting(false);
            isEjectingRef.current = false;
            setTimeLeft(TOTAL_TIME);
            timeLeftRef.current = TOTAL_TIME;
            setDistance(0);
            distanceRef.current = 0;
            setGForce(0);
            gForceRef.current = 0;
            warpSpeedRef.current = 0;
        }, 2200);
    }, [
        isEjecting
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const STAR_COLORS = [
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#ffffff",
            "#cce0ff",
            "#cce0ff",
            "#fffacc",
            "#ffd0a0",
            "#ffaaaa",
            "#fffacc"
        ];
        const initObjects = (W, H)=>{
            const DEPTH = 4000;
            starsRef.current = Array.from({
                length: 2500
            }, ()=>({
                    wx: randRange(-W * 3, W * 3),
                    wy: randRange(-H * 3, H * 3),
                    wz: randRange(100, DEPTH),
                    r: randRange(0.4, 2.8),
                    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
                    twinklePhase: Math.random() * Math.PI * 2,
                    twinkleSpeed: randRange(0.015, 0.06)
                }));
            largeObjRef.current = Array.from({
                length: 18
            }, (_, i)=>{
                const type = i < 6 ? "star" : i < 13 ? "asteroid" : "planet";
                return {
                    wx: randRange(-W * 2.5, W * 2.5),
                    wy: randRange(-H * 2, H * 2),
                    wz: randRange(300, DEPTH),
                    baseRadius: type === "star" ? randRange(3, 10) : type === "planet" ? randRange(12, 30) : randRange(4, 14),
                    type,
                    hue: type === "star" ? randRange(30, 60) : type === "planet" ? randRange(160, 300) : randRange(20, 50),
                    sat: type === "star" ? randRange(60, 90) : type === "planet" ? randRange(40, 70) : randRange(10, 30),
                    brightness: type === "star" ? randRange(70, 100) : type === "planet" ? randRange(30, 60) : randRange(30, 55),
                    angle: Math.random() * Math.PI * 2
                };
            });
            dustRef.current = Array.from({
                length: 400
            }, ()=>({
                    wx: randRange(-W * 2.5, W * 2.5),
                    wy: randRange(-H * 2.5, H * 2.5),
                    wz: randRange(50, 2000),
                    opacity: randRange(0.05, 0.3)
                }));
        };
        const resize = ()=>{
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initObjects(canvas.width, canvas.height);
        };
        window.addEventListener("resize", resize);
        resize();
        const roundRect = (x, y, w, h, r)=>{
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.arcTo(x + w, y, x + w, y + r, r);
            ctx.lineTo(x + w, y + h - r);
            ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
            ctx.lineTo(x + r, y + h);
            ctx.arcTo(x, y + h, x, y + h - r, r);
            ctx.lineTo(x, y + r);
            ctx.arcTo(x, y, x + r, y, r);
            ctx.closePath();
        };
        const draw = ()=>{
            const t = ++tRef.current;
            const W = canvas.width, H = canvas.height;
            const ws = warpSpeedRef.current;
            const eject = isEjectingRef.current;
            const running = isRunningRef.current;
            const gf = gForceRef.current;
            const prog = progressRef.current;
            const wph = warpPhaseRef.current;
            const miss = missionRef.current;
            const dist = distanceRef.current;
            const tleft = timeLeftRef.current;
            const FOCAL = W * 0.7;
            const MAX_Z = 4000;
            const BASE_SPEED = 3 + ws * 110 + (eject ? 300 : 0);
            const cx = W / 2, cy = H / 2;
            // 背景
            const bgG = ctx.createRadialGradient(cx * 0.9, cy * 0.7, 0, cx, cy, Math.hypot(W, H) * 0.85);
            bgG.addColorStop(0, ws > 0.05 ? "#060418" : "#04030e");
            bgG.addColorStop(0.45, ws > 0.05 ? "#030212" : "#020109");
            bgG.addColorStop(1, "#000000");
            ctx.fillStyle = bgG;
            ctx.fillRect(0, 0, W, H);
            // 星雲
            const drawNebula = (nx, ny, rx, ry, hue, alpha)=>{
                ctx.save();
                ctx.translate(nx, ny);
                ctx.scale(1, ry / rx);
                const ng = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
                ng.addColorStop(0, `hsla(${hue},70%,60%,${alpha})`);
                ng.addColorStop(0.5, `hsla(${hue + 20},55%,40%,${alpha * 0.5})`);
                ng.addColorStop(1, `hsla(${hue},50%,30%,0)`);
                ctx.fillStyle = ng;
                ctx.beginPath();
                ctx.arc(0, 0, rx, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            };
            const na = 0.022 + ws * 0.012;
            drawNebula(W * 0.15, H * 0.25, 320, 160, 220, na * (0.9 + Math.sin(t * 0.005) * 0.1));
            drawNebula(W * 0.78, H * 0.60, 260, 130, 270, na * (0.8 + Math.sin(t * 0.007) * 0.1));
            drawNebula(W * 0.55, H * 0.12, 200, 100, 200, na * 0.7);
            drawNebula(W * 0.30, H * 0.80, 180, 90, 300, na * 0.85);
            // ダスト
            dustRef.current.forEach((d)=>{
                d.wz -= BASE_SPEED * 0.2;
                if (d.wz < 1) {
                    d.wz = MAX_Z;
                    d.wx = randRange(-W * 2.5, W * 2.5);
                    d.wy = randRange(-H * 2.5, H * 2.5);
                }
                const psx = cx + d.wx / d.wz * FOCAL, psy = cy + d.wy / d.wz * FOCAL;
                if (psx < -10 || psx > W + 10 || psy < -10 || psy > H + 10) return;
                const depth = 1 - d.wz / MAX_Z;
                ctx.globalAlpha = d.opacity * depth * 0.6;
                ctx.fillStyle = "#99ccff";
                ctx.beginPath();
                ctx.arc(psx, psy, 0.5 + depth * 0.8, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            // 大型オブジェクト
            largeObjRef.current.forEach((obj)=>{
                obj.wz -= BASE_SPEED * 0.6 + ws * 5;
                obj.angle += 0.003 + ws * 0.005;
                if (obj.wz < 50) {
                    obj.wz = MAX_Z * 0.9;
                    obj.wx = randRange(-W * 2, W * 2);
                    obj.wy = randRange(-H * 1.8, H * 1.8);
                }
                const psx = cx + obj.wx / obj.wz * FOCAL, psy = cy + obj.wy / obj.wz * FOCAL;
                if (psx < -200 || psx > W + 200 || psy < -200 || psy > H + 200) return;
                const depth = 1 - obj.wz / MAX_Z;
                const radius = obj.baseRadius * depth * (FOCAL / 600) * 4;
                if (radius < 0.5) return;
                if (obj.type === "star") {
                    const glowR = radius * 5;
                    const glow = ctx.createRadialGradient(psx, psy, 0, psx, psy, glowR);
                    glow.addColorStop(0, `hsla(${obj.hue},${obj.sat}%,${obj.brightness}%,${depth * 0.9})`);
                    glow.addColorStop(0.25, `hsla(${obj.hue},${obj.sat}%,${obj.brightness * 0.7}%,${depth * 0.3})`);
                    glow.addColorStop(1, "transparent");
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(psx, psy, glowR, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = `hsl(${obj.hue},${obj.sat}%,${obj.brightness}%)`;
                    ctx.beginPath();
                    ctx.arc(psx, psy, radius, 0, Math.PI * 2);
                    ctx.fill();
                    if (depth > 0.3) {
                        ctx.save();
                        ctx.translate(psx, psy);
                        ctx.rotate(obj.angle);
                        ctx.strokeStyle = `hsla(${obj.hue},80%,90%,${depth * 0.4})`;
                        ctx.lineWidth = 0.5;
                        for(let k = 0; k < 4; k++){
                            const a = k / 4 * Math.PI * 2;
                            ctx.beginPath();
                            ctx.moveTo(Math.cos(a) * radius, Math.sin(a) * radius);
                            ctx.lineTo(Math.cos(a) * radius * 6, Math.sin(a) * radius * 6);
                            ctx.stroke();
                        }
                        ctx.restore();
                    }
                } else if (obj.type === "planet") {
                    const pg = ctx.createRadialGradient(psx - radius * 0.3, psy - radius * 0.3, radius * 0.05, psx, psy, radius);
                    pg.addColorStop(0, `hsl(${obj.hue + 20},${obj.sat + 20}%,${obj.brightness + 20}%)`);
                    pg.addColorStop(0.6, `hsl(${obj.hue},${obj.sat}%,${obj.brightness}%)`);
                    pg.addColorStop(1, `hsl(${obj.hue - 10},${obj.sat - 10}%,${obj.brightness * 0.3}%)`);
                    ctx.fillStyle = pg;
                    ctx.beginPath();
                    ctx.arc(psx, psy, radius, 0, Math.PI * 2);
                    ctx.fill();
                    const atm = ctx.createRadialGradient(psx, psy, radius * 0.85, psx, psy, radius * 1.3);
                    atm.addColorStop(0, `hsla(${obj.hue + 30},70%,70%,${depth * 0.15})`);
                    atm.addColorStop(1, "transparent");
                    ctx.fillStyle = atm;
                    ctx.beginPath();
                    ctx.arc(psx, psy, radius * 1.3, 0, Math.PI * 2);
                    ctx.fill();
                    if (obj.hue < 240 && radius > 12) {
                        ctx.save();
                        ctx.translate(psx, psy);
                        ctx.scale(1, 0.25);
                        ctx.strokeStyle = `hsla(${obj.hue + 10},50%,70%,${depth * 0.35})`;
                        ctx.lineWidth = radius * 0.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, radius * 1.7, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.strokeStyle = `hsla(${obj.hue},40%,60%,${depth * 0.2})`;
                        ctx.lineWidth = radius * 0.3;
                        ctx.beginPath();
                        ctx.arc(0, 0, radius * 2.1, 0, Math.PI * 2);
                        ctx.stroke();
                        ctx.restore();
                    }
                } else {
                    ctx.save();
                    ctx.translate(psx, psy);
                    ctx.rotate(obj.angle);
                    const ag = ctx.createRadialGradient(-radius * 0.2, -radius * 0.2, 0, 0, 0, radius * 1.2);
                    ag.addColorStop(0, `hsl(${obj.hue},${obj.sat}%,${obj.brightness}%)`);
                    ag.addColorStop(1, `hsl(${obj.hue},${obj.sat * 0.5}%,${obj.brightness * 0.3}%)`);
                    ctx.fillStyle = ag;
                    ctx.beginPath();
                    const pts = 7;
                    for(let k = 0; k < pts; k++){
                        const a = k / pts * Math.PI * 2;
                        const rr = radius * (0.7 + 0.3 * Math.sin(k * 2.3 + obj.angle * 3));
                        k === 0 ? ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
                    }
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                }
            });
            // 星（主役）
            starsRef.current.forEach((s)=>{
                s.wz -= BASE_SPEED;
                s.twinklePhase += s.twinkleSpeed;
                if (s.wz < 1) {
                    s.wz = MAX_Z;
                    s.wx = randRange(-W * 3, W * 3);
                    s.wy = randRange(-H * 3, H * 3);
                }
                const psx = cx + s.wx / s.wz * FOCAL, psy = cy + s.wy / s.wz * FOCAL;
                if (psx < -20 || psx > W + 20 || psy < -20 || psy > H + 20) return;
                const depth = Math.max(0, 1 - s.wz / MAX_Z);
                if (ws > 0.05) {
                    const prevZ = s.wz + BASE_SPEED;
                    const ppx = cx + s.wx / prevZ * FOCAL, ppy = cy + s.wy / prevZ * FOCAL;
                    const streakLen = Math.hypot(psx - ppx, psy - ppy);
                    if (streakLen < 0.3) return;
                    const hue = s.color === "#cce0ff" ? 210 : s.color === "#ffd0a0" ? 25 : s.color === "#ffaaaa" ? 350 : s.color === "#fffacc" ? 55 : 195;
                    const alpha = (0.15 + depth * 0.85) * ws;
                    const sg = ctx.createLinearGradient(ppx, ppy, psx, psy);
                    sg.addColorStop(0, `hsla(${hue},90%,90%,0)`);
                    sg.addColorStop(1, `hsla(${hue},100%,97%,${alpha})`);
                    ctx.strokeStyle = sg;
                    ctx.lineWidth = Math.max(0.3, s.r * depth * (ws > 0.5 ? 2.0 : 1.2));
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    ctx.moveTo(ppx, ppy);
                    ctx.lineTo(psx, psy);
                    ctx.stroke();
                } else {
                    const twinkle = 0.6 + Math.sin(s.twinklePhase) * 0.4;
                    const alpha = (0.1 + depth * 0.9) * twinkle;
                    const radius = Math.max(0.3, s.r * depth * 0.8);
                    if (depth > 0.6 && s.r > 1.5) {
                        const gg = ctx.createRadialGradient(psx, psy, 0, psx, psy, radius * 5);
                        gg.addColorStop(0, `rgba(255,255,255,${alpha * 0.25})`);
                        gg.addColorStop(1, "transparent");
                        ctx.fillStyle = gg;
                        ctx.beginPath();
                        ctx.arc(psx, psy, radius * 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = s.color;
                    ctx.beginPath();
                    ctx.arc(psx, psy, radius, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                }
            });
            // ワープトンネル
            if (ws > 0.1) {
                const wr = ws * ws;
                for(let ring = 0; ring < 3; ring++){
                    const phase = (t * 0.04 + ring * 0.33) % 1;
                    const rr = phase * Math.min(W, H) * 0.45 * wr;
                    const al = (1 - phase) * 0.12 * wr;
                    ctx.strokeStyle = `rgba(80,180,255,${al})`;
                    ctx.lineWidth = 1 + (1 - phase) * 2;
                    ctx.beginPath();
                    ctx.arc(cx, cy, rr, 0, Math.PI * 2);
                    ctx.stroke();
                }
                const coreG = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80 * wr);
                coreG.addColorStop(0, `rgba(200,230,255,${0.15 * wr})`);
                coreG.addColorStop(0.5, `rgba(80,160,255,${0.06 * wr})`);
                coreG.addColorStop(1, "transparent");
                ctx.fillStyle = coreG;
                ctx.beginPath();
                ctx.arc(cx, cy, 80 * wr, 0, Math.PI * 2);
                ctx.fill();
            }
            // 脱出爆発
            if (eject) {
                const bp = 0.35 + Math.sin(t * 0.35) * 0.2;
                const boomG = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.6);
                boomG.addColorStop(0, `rgba(255,200,60,${bp})`);
                boomG.addColorStop(0.15, `rgba(255,80,10,${bp * 0.7})`);
                boomG.addColorStop(0.4, `rgba(180,0,0,${bp * 0.25})`);
                boomG.addColorStop(1, "transparent");
                ctx.fillStyle = boomG;
                ctx.fillRect(0, 0, W, H);
            }
            // ─── HUD ───────────────────────────────────────
            // ビネット
            const vg = ctx.createRadialGradient(cx, cy * 0.8, Math.min(W, H) * 0.25, cx, cy, Math.hypot(W, H) * 0.65);
            vg.addColorStop(0, "transparent");
            vg.addColorStop(0.6, "rgba(0,2,15,0.22)");
            vg.addColorStop(1, "rgba(0,0,8,0.84)");
            ctx.fillStyle = vg;
            ctx.fillRect(0, 0, W, H);
            // 下部パネル背景
            const PANEL_H = Math.min(H * 0.40, 275);
            const panelY = H - PANEL_H;
            const panelG = ctx.createLinearGradient(0, panelY, 0, H);
            panelG.addColorStop(0, "rgba(0,8,25,0)");
            panelG.addColorStop(0.18, "rgba(0,8,28,0.78)");
            panelG.addColorStop(0.5, "rgba(1,10,32,0.94)");
            panelG.addColorStop(1, "rgba(2,10,28,1)");
            ctx.fillStyle = panelG;
            ctx.fillRect(0, panelY, W, PANEL_H);
            // 区切り線
            const lineY = panelY + PANEL_H * 0.17;
            const lineG2 = ctx.createLinearGradient(0, 0, W, 0);
            lineG2.addColorStop(0, "transparent");
            lineG2.addColorStop(0.12, "rgba(0,160,220,0.7)");
            lineG2.addColorStop(0.5, "rgba(0,200,255,0.9)");
            lineG2.addColorStop(0.88, "rgba(0,160,220,0.7)");
            lineG2.addColorStop(1, "transparent");
            ctx.strokeStyle = lineG2;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(0, lineY);
            ctx.lineTo(W, lineY);
            ctx.stroke();
            // ── タコメーター（中央）──
            const tacoX = cx, tacoY = H - PANEL_H * 0.52, tacoR = Math.min(PANEL_H * 0.62, 108);
            ctx.strokeStyle = "rgba(0,120,180,0.2)";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, tacoR + 6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.strokeStyle = "rgba(0,160,220,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, tacoR + 11, 0, Math.PI * 2);
            ctx.stroke();
            const tacoBG = ctx.createRadialGradient(tacoX - tacoR * 0.3, tacoY - tacoR * 0.3, 0, tacoX, tacoY, tacoR);
            tacoBG.addColorStop(0, "rgba(0,22,55,0.92)");
            tacoBG.addColorStop(0.7, "rgba(0,8,28,0.97)");
            tacoBG.addColorStop(1, "rgba(0,4,16,1)");
            ctx.fillStyle = tacoBG;
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, tacoR, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(0,150,220,0.28)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, tacoR, 0, Math.PI * 2);
            ctx.stroke();
            const ARC_S = Math.PI * 0.75, ARC_E = Math.PI * 2.25, ARC_F = ARC_E - ARC_S;
            ctx.strokeStyle = "rgba(0,60,120,0.4)";
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, tacoR - 10, ARC_S, ARC_E);
            ctx.stroke();
            if (prog > 0.001) {
                const arcEnd = ARC_S + ARC_F * prog;
                const arcG = ctx.createLinearGradient(tacoX - tacoR, tacoY, tacoX + tacoR, tacoY);
                arcG.addColorStop(0, "#00c8ff");
                arcG.addColorStop(0.5, "#7050ff");
                arcG.addColorStop(1, "#ff4060");
                ctx.strokeStyle = arcG;
                ctx.lineWidth = 5;
                ctx.shadowColor = "rgba(0,200,255,0.6)";
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(tacoX, tacoY, tacoR - 10, ARC_S, arcEnd);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
            for(let i = 0; i <= 50; i++){
                const a = ARC_S + i / 50 * ARC_F;
                const major = i % 10 === 0, mid = i % 5 === 0 && !major;
                const or = tacoR - 4, ir = major ? tacoR - 18 : mid ? tacoR - 13 : tacoR - 9;
                ctx.strokeStyle = major ? "rgba(0,200,255,0.7)" : mid ? "rgba(0,140,200,0.4)" : "rgba(0,80,140,0.25)";
                ctx.lineWidth = major ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(tacoX + ir * Math.cos(a), tacoY + ir * Math.sin(a));
                ctx.lineTo(tacoX + or * Math.cos(a), tacoY + or * Math.sin(a));
                ctx.stroke();
            }
            ctx.fillStyle = "rgba(0,180,255,0.55)";
            ctx.font = `${tacoR * 0.12}px 'Courier New',monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            [
                0,
                5,
                10,
                15,
                20,
                25
            ].forEach((min)=>{
                const a = ARC_S + min / 25 * ARC_F;
                ctx.fillText(String(min), tacoX + (tacoR - 28) * Math.cos(a), tacoY + (tacoR - 28) * Math.sin(a));
            });
            const needleA = ARC_S + ARC_F * prog;
            ctx.save();
            ctx.translate(tacoX, tacoY);
            ctx.rotate(needleA);
            const ndG = ctx.createLinearGradient(0, -tacoR * 0.72, 0, tacoR * 0.18);
            ndG.addColorStop(0, "#00c8ff");
            ndG.addColorStop(0.6, "#4090ff");
            ndG.addColorStop(1, "rgba(0,80,150,0.3)");
            ctx.strokeStyle = ndG;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.shadowColor = "#00c8ff";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.moveTo(0, tacoR * 0.18);
            ctx.lineTo(0, -tacoR * 0.72);
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.restore();
            ctx.fillStyle = "rgba(0,8,25,1)";
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#00c8ff";
            ctx.shadowColor = "#00c8ff";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(tacoX, tacoY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            const timeSz = Math.max(22, tacoR * 0.38);
            ctx.font = `900 ${timeSz}px 'Courier New',monospace`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0,200,255,0.4)";
            ctx.shadowBlur = 16;
            const mm = Math.floor(tleft / 60).toString().padStart(2, "0"), ss2 = (tleft % 60).toString().padStart(2, "0");
            ctx.fillText(`${mm}:${ss2}`, tacoX, tacoY + tacoR * 0.22);
            ctx.shadowBlur = 0;
            const statusText = eject ? "⚠ EJECT" : wph === "spinup" ? "▶ SPIN UP" : ws > 0.05 ? "◉ WARP DRIVE" : "◎ STANDBY";
            const statusColor = eject ? "rgba(255,60,60,0.9)" : ws > 0.05 ? "rgba(0,210,255,0.85)" : "rgba(60,90,120,0.7)";
            ctx.font = `${tacoR * 0.1}px 'Courier New',monospace`;
            ctx.fillStyle = statusColor;
            ctx.fillText(statusText, tacoX, tacoY + tacoR * 0.44);
            ctx.font = `${tacoR * 0.085}px 'Courier New',monospace`;
            ctx.fillStyle = "rgba(0,160,255,0.35)";
            ctx.fillText("CHRONO · DRIVE · METER", tacoX, tacoY - tacoR - 14);
            // ── 左パネル：燃料 & Gフォース ──
            const LP_X = Math.min(W * 0.12, 120), LP_Y = H - PANEL_H * 0.88, LP_W = Math.min(150, W * 0.13), LP_H = PANEL_H * 0.78;
            roundRect(LP_X - LP_W / 2 - 10, LP_Y - 8, LP_W + 20, LP_H + 16, 10);
            ctx.fillStyle = "rgba(0,15,40,0.5)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,140,220,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            const fuelRemain = Math.max(0, 1 - prog);
            const TANK_W = 28, TANK_H = Math.min(80, LP_H * 0.54), tankX = LP_X - TANK_W / 2, tankY = LP_Y + 22;
            ctx.font = "9px 'Courier New',monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(0,160,255,0.5)";
            ctx.fillText("FUEL CELL", LP_X, tankY - 10);
            roundRect(tankX, tankY, TANK_W, TANK_H, 4);
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,100,180,0.4)";
            ctx.lineWidth = 1;
            ctx.stroke();
            const flH = TANK_H * fuelRemain;
            if (flH > 3) {
                const fuelColor = fuelRemain > 0.4 ? "#00c8ff" : fuelRemain > 0.15 ? "#ffaa00" : "#ff4444";
                roundRect(tankX + 2, tankY + TANK_H - flH + 2, TANK_W - 4, flH - 4, 3);
                const flG = ctx.createLinearGradient(0, tankY + TANK_H - flH, 0, tankY + TANK_H);
                flG.addColorStop(0, fuelColor);
                flG.addColorStop(1, fuelColor + "88");
                ctx.fillStyle = flG;
                ctx.shadowColor = fuelColor;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
                [
                    0.25,
                    0.5,
                    0.75
                ].forEach((p)=>{
                    const ly = tankY + TANK_H * (1 - p);
                    ctx.strokeStyle = "rgba(0,80,120,0.5)";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(tankX + 2, ly);
                    ctx.lineTo(tankX + TANK_W - 2, ly);
                    ctx.stroke();
                });
                const fuelColor2 = fuelRemain > 0.4 ? "#40d0ff" : fuelRemain > 0.15 ? "#ffaa00" : "#ff4444";
                ctx.font = `bold ${Math.max(12, TANK_W * 0.4)}px 'Courier New',monospace`;
                ctx.textAlign = "center";
                ctx.fillStyle = fuelColor2;
                ctx.shadowColor = fuelColor2;
                ctx.shadowBlur = 6;
                ctx.fillText(`${Math.round(fuelRemain * 100)}%`, LP_X, tankY + TANK_H + 18);
                ctx.shadowBlur = 0;
            }
            const gfY = tankY + TANK_H + 38;
            ctx.font = "9px 'Courier New',monospace";
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(0,160,255,0.5)";
            ctx.fillText("G-FORCE", LP_X, gfY);
            const gfAbs = Math.abs(gf);
            const gfColor = gfAbs > 1.8 ? "#ff4444" : "#00d8ff";
            ctx.font = `bold ${Math.max(14, LP_W * 0.22)}px 'Courier New',monospace`;
            ctx.fillStyle = gfColor;
            ctx.shadowColor = gfColor;
            ctx.shadowBlur = 8;
            ctx.fillText(`${gfAbs.toFixed(2)}G`, LP_X, gfY + 22);
            ctx.shadowBlur = 0;
            const gBarW = LP_W * 0.85, gBarY = gfY + 34;
            roundRect(LP_X - gBarW / 2, gBarY, gBarW, 5, 2);
            ctx.fillStyle = "rgba(0,30,60,0.7)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,80,140,0.4)";
            ctx.lineWidth = 0.5;
            ctx.stroke();
            const gFill = Math.min(gBarW * 0.5 * (gfAbs / 2.5), gBarW * 0.5);
            const gStartX = LP_X + (gf >= 0 ? 0 : -gFill);
            roundRect(gStartX, gBarY + 0.5, gFill, 4, 1);
            ctx.fillStyle = gfColor;
            ctx.shadowColor = gfColor;
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
            // ── 右パネル：システム ──
            const RP_X = Math.max(W * 0.88, W - 120), RP_Y = LP_Y, RP_W = Math.min(150, W * 0.13);
            roundRect(RP_X - RP_W / 2 - 10, RP_Y - 8, RP_W + 20, LP_H + 16, 10);
            ctx.fillStyle = "rgba(0,15,40,0.5)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,140,220,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = "9px 'Courier New',monospace";
            ctx.fillStyle = "rgba(0,160,255,0.5)";
            ctx.textAlign = "center";
            ctx.fillText("SYSTEMS", RP_X, RP_Y + 8);
            const systems = [
                {
                    l: "NAVIGATION",
                    ok: true
                },
                {
                    l: "SHIELDS",
                    ok: !eject
                },
                {
                    l: "LIFE SUPPORT",
                    ok: true
                },
                {
                    l: "WARP CORE",
                    ok: running
                },
                {
                    l: "SENSORS",
                    ok: !eject
                }
            ];
            systems.forEach(({ l, ok }, i)=>{
                const sy = RP_Y + 26 + i * 20, showOk = ok || t % 20 > 10;
                ctx.font = "8px 'Courier New',monospace";
                ctx.textAlign = "left";
                ctx.fillStyle = ok ? "rgba(0,120,180,0.7)" : showOk ? "rgba(255,80,80,0.9)" : "rgba(100,20,20,0.5)";
                ctx.fillText(l, RP_X - RP_W / 2 + 4, sy);
                const bx = RP_X + RP_W / 2 - 30;
                roundRect(bx, sy - 5, 26, 4, 1);
                ctx.fillStyle = "rgba(0,20,40,0.7)";
                ctx.fill();
                ctx.fillStyle = showOk ? ok ? "#00c860" : "#ff4444" : "rgba(60,0,0,0.5)";
                ctx.shadowColor = showOk ? ok ? "#00c860" : "#ff4444" : "transparent";
                ctx.shadowBlur = ok ? 4 : 6;
                roundRect(bx + 0.5, sy - 4.5, ok ? 25 : 8, 3, 1);
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            // ── 左上：ナビゲーション ──
            const NAV_X = 20, NAV_Y = 16;
            roundRect(NAV_X, NAV_Y, 220, 90, 8);
            ctx.fillStyle = "rgba(0,12,35,0.6)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,140,220,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = "8px 'Courier New',monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(0,160,255,0.45)";
            ctx.fillText("◈ NAVIGATION", NAV_X + 10, NAV_Y + 14);
            ctx.fillStyle = "rgba(0,140,200,0.65)";
            ctx.font = "9px 'Courier New',monospace";
            ctx.fillText("TARGET: M31 · ANDROMEDA", NAV_X + 10, NAV_Y + 30);
            ctx.font = "bold 16px 'Courier New',monospace";
            ctx.fillStyle = "#b090ff";
            ctx.shadowColor = "rgba(150,100,255,0.6)";
            ctx.shadowBlur = 10;
            ctx.fillText(`${dist.toLocaleString()} km`, NAV_X + 10, NAV_Y + 52);
            ctx.shadowBlur = 0;
            ctx.font = "8px 'Courier New',monospace";
            ctx.fillStyle = "rgba(100,80,160,0.5)";
            ctx.fillText(`${(dist / 9.461e12).toFixed(6)} ly`, NAV_X + 10, NAV_Y + 68);
            const dbW = 200;
            roundRect(NAV_X + 10, NAV_Y + 78, dbW, 3, 1);
            ctx.fillStyle = "rgba(0,40,80,0.6)";
            ctx.fill();
            roundRect(NAV_X + 10, NAV_Y + 78, dbW * Math.min(prog * 8, 1), 3, 1);
            const dbG = ctx.createLinearGradient(NAV_X + 10, 0, NAV_X + 10 + dbW, 0);
            dbG.addColorStop(0, "#4060ff");
            dbG.addColorStop(1, "#a060ff");
            ctx.fillStyle = dbG;
            ctx.shadowColor = "#6060ff";
            ctx.shadowBlur = 4;
            ctx.fill();
            ctx.shadowBlur = 0;
            // ── 右上：エンジン ──
            const ENG_X = W - 24 - 220, ENG_Y = 16;
            roundRect(ENG_X, ENG_Y, 220, 90, 8);
            ctx.fillStyle = "rgba(0,12,35,0.6)";
            ctx.fill();
            ctx.strokeStyle = "rgba(0,140,220,0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.font = "8px 'Courier New',monospace";
            ctx.textAlign = "left";
            ctx.fillStyle = "rgba(0,160,255,0.45)";
            ctx.fillText("ENGINE STATUS ◈", ENG_X + 10, ENG_Y + 14);
            const engStatus = eject ? "⚠ EMERGENCY EJECT" : running ? "◉ HYPERDRIVE ONLINE" : "◎ SYSTEMS STANDBY";
            const engColor = eject ? "#ff4444" : running ? "#40d8ff" : "#405060";
            ctx.font = "bold 11px 'Courier New',monospace";
            ctx.fillStyle = engColor;
            ctx.shadowColor = engColor;
            ctx.shadowBlur = 8;
            ctx.fillText(engStatus, ENG_X + 10, ENG_Y + 32);
            ctx.shadowBlur = 0;
            if (ws > 0.02) {
                ctx.font = "9px 'Courier New',monospace";
                ctx.fillStyle = "rgba(0,150,200,0.5)";
                ctx.fillText("WARP VELOCITY", ENG_X + 10, ENG_Y + 50);
                ctx.font = "bold 18px 'Courier New',monospace";
                ctx.fillStyle = "#40c8ff";
                ctx.shadowColor = "rgba(0,180,255,0.5)";
                ctx.shadowBlur = 10;
                ctx.fillText(`×${Math.round(ws * 9999 + 1)}c`, ENG_X + 10, ENG_Y + 72);
                ctx.shadowBlur = 0;
            } else {
                ctx.font = "9px 'Courier New',monospace";
                ctx.fillStyle = "rgba(0,150,200,0.4)";
                ctx.fillText("WARP POWER:", ENG_X + 10, ENG_Y + 50);
                for(let b = 0; b < 8; b++){
                    const bx = ENG_X + 10 + b * 24, by = ENG_Y + 58, on = b < Math.round(prog * 8);
                    const bc = b < 5 ? "#00c8ff" : b < 7 ? "#ffaa00" : "#ff3300";
                    roundRect(bx, by, 20, 10, 2);
                    ctx.fillStyle = on ? bc + "bb" : "rgba(10,25,50,0.6)";
                    ctx.fill();
                    if (on) {
                        ctx.shadowColor = bc;
                        ctx.shadowBlur = 5;
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            }
            // ミッションコンプリート
            if (miss) {
                const mcA = Math.min(1, t % 300 < 50 ? t % 50 / 50 : t % 300 > 250 ? (300 - t % 300) / 50 : 1);
                ctx.fillStyle = `rgba(100,255,180,${mcA * 0.1})`;
                ctx.fillRect(0, 0, W, H);
                const mcW = Math.min(480, W * 0.7), mcH = 100, mcX = cx - mcW / 2, mcY = cy - mcH / 2 - 40;
                roundRect(mcX, mcY, mcW, mcH, 14);
                ctx.fillStyle = `rgba(0,18,12,${mcA * 0.9})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(80,255,160,${mcA * 0.4})`;
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.font = `bold ${Math.min(34, W * 0.034)}px 'Courier New',monospace`;
                ctx.fillStyle = `rgba(160,255,200,${mcA})`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.shadowColor = `rgba(80,255,160,0.8)`;
                ctx.shadowBlur = 20;
                ctx.fillText("◈ MISSION COMPLETE ◈", cx, mcY + 40);
                ctx.shadowBlur = 0;
                ctx.font = `${Math.min(13, W * 0.013)}px 'Courier New',monospace`;
                ctx.fillStyle = `rgba(80,200,140,${mcA * 0.8})`;
                ctx.fillText("ANDROMEDA REACHED — 25 MIN LOGGED", cx, mcY + 72);
                ctx.textBaseline = "alphabetic";
            }
            // スキャンライン
            for(let sy = 0; sy < H; sy += 4){
                ctx.fillStyle = "rgba(0,0,0,0.055)";
                ctx.fillRect(0, sy, W, 1);
            }
            animRef.current = requestAnimationFrame(draw);
        };
        draw();
        return ()=>{
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            inset: 0,
            overflow: "hidden",
            background: "#000",
            userSelect: "none",
            cursor: "crosshair"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                style: {
                    display: "block",
                    position: "absolute",
                    inset: 0
                }
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this),
            isMounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "absolute",
                    bottom: "4%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    pointerEvents: "all"
                },
                children: [
                    !isRunning && warpPhase === "idle" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: startWarp,
                        style: {
                            fontFamily: "'Courier New',monospace",
                            fontWeight: 900,
                            fontSize: "clamp(13px,1.4vw,18px)",
                            letterSpacing: "5px",
                            color: "#fff",
                            padding: "clamp(10px,1.2vh,16px) clamp(28px,4vw,56px)",
                            borderRadius: "10px",
                            border: "1.5px solid rgba(100,200,255,0.45)",
                            background: "linear-gradient(160deg,#0d7ec4 0%,#0a5a96 40%,#073d6e 100%)",
                            boxShadow: "0 0 24px rgba(0,120,220,0.6),0 0 60px rgba(0,100,200,0.2),inset 0 1px 0 rgba(150,220,255,0.25)",
                            textShadow: "0 0 10px rgba(100,200,255,0.8)",
                            cursor: "pointer"
                        },
                        children: "IGNITION"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 565,
                        columnNumber: 11
                    }, this),
                    warpPhase === "spinup" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Courier New',monospace",
                            fontWeight: 700,
                            fontSize: "clamp(11px,1.2vw,15px)",
                            letterSpacing: "6px",
                            color: "#40c8ff",
                            textShadow: "0 0 10px rgba(0,200,255,0.7)",
                            padding: "14px 40px"
                        },
                        children: "▶ SPIN UP..."
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 576,
                        columnNumber: 11
                    }, this),
                    isRunning && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            position: "relative"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    position: "absolute",
                                    inset: "-6px",
                                    borderRadius: "16px",
                                    background: "rgba(200,30,0,0.25)",
                                    filter: "blur(14px)",
                                    animation: "pulseGlow 0.9s ease-in-out infinite"
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 582,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleEject,
                                disabled: isEjecting,
                                style: {
                                    position: "relative",
                                    fontFamily: "'Courier New',monospace",
                                    fontWeight: 900,
                                    fontSize: "clamp(13px,1.4vw,18px)",
                                    letterSpacing: "5px",
                                    color: "#fff",
                                    padding: "clamp(10px,1.2vh,14px) clamp(28px,4vw,56px)",
                                    borderRadius: "10px",
                                    border: "1.5px solid rgba(255,100,80,0.5)",
                                    background: "linear-gradient(160deg,#c0392b 0%,#96231a 40%,#6e0f09 100%)",
                                    boxShadow: "0 0 24px rgba(200,50,30,0.6),0 0 60px rgba(180,30,10,0.25),inset 0 1px 0 rgba(255,180,160,0.2)",
                                    textShadow: "0 0 10px rgba(255,150,120,0.9)",
                                    cursor: isEjecting ? "not-allowed" : "pointer",
                                    opacity: isEjecting ? 0.5 : 1
                                },
                                children: [
                                    "EJECT",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "9px",
                                            opacity: 0.7,
                                            letterSpacing: "2px",
                                            marginTop: "2px"
                                        },
                                        children: "緊急脱出"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 594,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 583,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 581,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 552,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                children: `
        @keyframes pulseGlow{0%,100%{opacity:0.6;}50%{opacity:1.0;}}
        html,body{overflow:hidden!important;margin:0;padding:0;}
      `
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 600,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 548,
        columnNumber: 5
    }, this);
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__73ae023d._.js.map
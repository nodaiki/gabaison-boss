"use client";

import { useEffect, useRef, useState, useCallback, CSSProperties } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { buildApiUrl } from "@/lib/api";

function randRange(a: number, b: number) { return a + Math.random() * (b - a); }

interface TaskMember {
  member_id: string;
  user_id: string;
  name: string;
  email: string;
  sum_time: number;
  is_online: boolean;
}

function toBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "1" || v === "t" || v === "yes" || v === "y";
  }
  return false;
}

/* ── 目的地とランドマークのデータ ── */
const DEST_DATA = [
  { id: 0, ly: 1585 }, { id: 1, ly: 1800 }, { id: 2, ly: 2000 }, { id: 3, ly: 2400 },
  { id: 4, ly: 2615 }, { id: 5, ly: 4100 }, { id: 6, ly: 5200 }, { id: 7, ly: 6500 },
  { id: 8, ly: 7000 }, { id: 9, ly: 7500 }, { id: 10, ly: 10600 }, { id: 11, ly: 11000 },
  { id: 12, ly: 15000 }, { id: 13, ly: 15800 }, { id: 14, ly: 20000 }, { id: 15, ly: 25000 },
  { id: 16, ly: 26000 }, { id: 17, ly: 50000 }, { id: 18, ly: 70000 }, { id: 19, ly: 80000 },
  { id: 20, ly: 160000 }, { id: 21, ly: 200000 }, { id: 22, ly: 260000 }, { id: 23, ly: 280000 },
  { id: 24, ly: 290000 }, { id: 25, ly: 300000 }, { id: 26, ly: 330000 }, { id: 27, ly: 460000 },
  { id: 28, ly: 690000 }, { id: 29, ly: 820000 }, { id: 30, ly: 1440000 }, { id: 31, ly: 1600000 },
  { id: 32, ly: 2050000 }, { id: 33, ly: 2200000 }, { id: 34, ly: 2380000 }, { id: 35, ly: 2490000 },
  { id: 36, ly: 2500000 }, { id: 37, ly: 2690000 }, { id: 38, ly: 2730000 }, { id: 39, ly: 3000000 }
];

const LANDMARKS = [
  { name: "太陽系圏境 (ヘリオポーズ)", ly: 0.002, msg: "開始0秒で太陽系を脱出" },
  { name: "オールトの雲 (外縁)", ly: 1, msg: "1秒で1光年！未知の領域へ" },
  { name: "プロキシマ・ケンタウリ", ly: 4.2, msg: "もうお隣の恒星に着きました" },
  { name: "バーナード星", ly: 6.0, msg: "全天で一番早く動く星を、さらに早く追い抜く" },
  { name: "ウォルフ359", ly: 7.8, msg: "SF好きにはたまらない赤色矮星" },
  { name: "シリウス", ly: 8.6, msg: "全天で一番明るい星を瞬殺" },
  { name: "エリダヌス座イプシロン星", ly: 10.5, msg: "SF小説でおなじみの星系を通過" },
  { name: "くじら座タウ星", ly: 11.9, msg: "かつて地球外生命体探査で狙われた星" },
  { name: "アルタイル（彦星）", ly: 16.7, msg: "わし座の彦星を通過！織姫に会いに行きます" },
  { name: "グリーゼ581", ly: 20, msg: "スーパーアースが存在する赤色矮星" },
  { name: "ベガ（織姫星）", ly: 25, msg: "わずか8秒で七夕の星をつなぎました" },
  { name: "フォーマルハウト", ly: 25, msg: "秋の夜空の孤独な一等星（ベガとほぼ同距離）" },
  { name: "ポルックス", ly: 34, msg: "ふたご座の弟星を通過" },
  { name: "アルクトゥルス", ly: 36.7, msg: "オレンジ色の巨星を横目に爆走中" },
  { name: "カペラ", ly: 42.9, msg: "ぎょしゃ座の連星をあっさり通過" },
  { name: "カストル", ly: 51, msg: "ふたご座の兄星も通過。双子コンプリート！" },
  { name: "アルデバラン", ly: 65, msg: "おうし座の赤い目を通過。集中できてますか？" },
  { name: "レグルス", ly: 79, msg: "しし座の心臓。王の星を越えました" },
  { name: "アルカイド", ly: 104, msg: "北斗七星のひしゃくの柄の先端！" },
  { name: "ヒアデス星団", ly: 153, msg: "おうし座のV字型を形作る星団を通過" },
  { name: "スピカ", ly: 250, msg: "おとめ座の真珠と呼ばれる青白い星を通過" },
  { name: "北極星（ポラリス）", ly: 433, msg: "常に北を示す星を追い抜きました。道は合ってます！" },
  { name: "プレアデス星団（すばる）", ly: 444, msg: "美しい星団を猛スピードで駆け抜けています" },
  { name: "アンタレス", ly: 550, msg: "さそり座の心臓、巨大な赤い星に接近" },
  { name: "ケプラー186f", ly: 582, msg: "生命が存在するかもしれない系外惑星を発見" },
  { name: "ベテルギウス", ly: 642, msg: "いつ超新星爆発してもおかしくない星を無事通過" },
  { name: "リゲル", ly: 860, msg: "オリオン座の青い超巨星。折り返し地点です！" },
  { name: "オリオン大星雲", ly: 1344, msg: "星が生まれる場所を観測。集中力高まってます！" },
  { name: "馬頭星雲", ly: 1500, msg: "馬の頭の形をした暗黒星雲を駆け抜ける！" },
  { name: "はくちょう座X-1", ly: 1585, msg: "【1ポモドーロ完了！】ブラックホールの重力を振り切りました！" },
  { name: "ケプラー452b", ly: 1800, msg: "地球にそっくりな惑星。ここで休憩しますか？" },
  { name: "環状星雲 (M57)", ly: 2000, msg: "星の最期の姿、美しいガスのリングを通過" },
  { name: "網状星雲 (Veil Nebula)", ly: 2400, msg: "巨大な超新星残骸のレースをくぐり抜ける" },
  { name: "デネブ", ly: 2615, msg: "はくちょう座の尾。夏の大三角をこれで全制覇！" },
  { name: "干潟星雲 (M8)", ly: 4100, msg: "天の川の濃い部分に突入してきました" },
  { name: "ばら星雲 (Rosette Nebula)", ly: 5200, msg: "バラの花の形をした巨大なガス雲。タスクも咲かせよう" },
  { name: "かに星雲 (M1)", ly: 6500, msg: "かつての超新星爆発の残骸を突っ切ります" },
  { name: "わし星雲（創造の柱）", ly: 7000, msg: "宇宙の神秘『創造の柱』。今日のタスク量は凄い！" },
  { name: "りゅうこつ座イータ星", ly: 7500, msg: "太陽の数百万倍明るい、爆発寸前の超大質量星に接近" },
  { name: "球状星団 M22", ly: 10600, msg: "夜空で最も明るい球状星団の一つ！" },
  { name: "カシオペヤ座A", ly: 11000, msg: "強力な電波を放つ超新星残骸を通過。順調です" },
  { name: "ウェスタールンド1", ly: 15000, msg: "天の川銀河最大級の『超星団』。星の密度が異常です" },
  { name: "オメガ星団", ly: 15800, msg: "数百万の星が密集する巨大な球状星団！" },
  { name: "NGC 3603", ly: 20000, msg: "銀河系最大級の星形成領域で新しいタスクを生み出す" },
  { name: "ヘルクレス座球状星団", ly: 25000, msg: "アレシボ・メッセージの送信先！宇宙人に応答せよ" },
  { name: "天の川銀河の中心", ly: 26000, msg: "超大質量ブラックホール『いて座A*』をスイングバイ" },
  { name: "天の川銀河の外縁部", ly: 50000, msg: "我らが銀河の果てを通過。完全な暗黒の宇宙へ" },
  { name: "いて座矮小楕円小銀河", ly: 70000, msg: "天の川銀河に飲み込まれつつある小さな伴銀河" },
  { name: "天の川銀河の反対側", ly: 80000, msg: "銀河の裏側まで来ました。地球からは見えない景色です" },
  { name: "大マゼラン雲", ly: 160000, msg: "南半球の夜空を彩る巨大な伴銀河に到達しました" },
  { name: "小マゼラン雲", ly: 200000, msg: "大マゼラン雲の兄弟星雲。長時間の作業、お疲れ様です" },
  { name: "りゅう座矮小銀河", ly: 260000, msg: "暗黒物質（ダークマター）を大量に含む古い銀河を通過" },
  { name: "ろくぶんぎ座矮小銀河", ly: 280000, msg: "古い星ばかりが集まる静かな銀河。タスクも消化試合？" },
  { name: "ちょうこくしつ座矮小銀河", ly: 290000, msg: "銀河系の重力圏を完全に脱出しました" },
  { name: "銀河間放浪者 (NGC 2419)", ly: 300000, msg: "どの銀河にも属さない孤独な球状星団を通過" },
  { name: "りゅうこつ座矮小銀河", ly: 330000, msg: "天の川銀河の周りを回る衛星銀河をさらにパス" },
  { name: "ろ座矮小銀河", ly: 460000, msg: "暗闇の宇宙を進み続けています。孤独な戦いですね" },
  { name: "しし座II (矮小銀河)", ly: 690000, msg: "圧倒的な作業時間の蓄積を感じます" },
  { name: "しし座I (矮小銀河)", ly: 820000, msg: "さらに遠くの矮小銀河。もはやチーム開発の鑑です" },
  { name: "ほうおう座矮小銀河", ly: 1440000, msg: "天の川とアンドロメダのちょうど中間地点の何もない空間" },
  { name: "バーナード銀河 (NGC 6822)", ly: 1600000, msg: "不規則銀河に突入！アンドロメダの重力圏に入り始めました" },
  { name: "NGC 185 (伴銀河)", ly: 2050000, msg: "アンドロメダのお供の銀河を発見！" },
  { name: "IC 10 (スターバースト銀河)", ly: 2200000, msg: "猛烈な勢いで星が生まれている銀河。爆速開発中！" },
  { name: "IC 1613", ly: 2380000, msg: "アンドロメダに極めて近い不規則銀河。ゴールは目の前！" },
  { name: "M32 (アンドロメダ伴銀河)", ly: 2490000, msg: "アンドロメダのすぐ隣にあるコンパクトな楕円銀河！" },
  { name: "アンドロメダ銀河 (M31)", ly: 2500000, msg: "【最終目的地】お隣の銀河に到着！渡邊様のチームが宇宙を超えました！" },
  { name: "M110 (伴銀河)", ly: 2690000, msg: "アンドロメダを通り抜けた先にあるもう一つの伴銀河" },
  { name: "さんかく座銀河 (M33)", ly: 2730000, msg: "局所銀河群で3番目に大きい巨大銀河。真のカンスト！" },
  { name: "WLM銀河", ly: 3000000, msg: "局所銀河群の最果て。これ以上は宇宙の壁に阻まれます" }
];

const CSS_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');
  /* touch-action: manipulation でダブルタップ拡大などを防ぐ */
  html,body{overflow:hidden!important;margin:0;padding:0;touch-action:manipulation;}
  *{box-sizing:border-box;}
  .orb{font-family:'Orbitron',monospace; font-size: 14px;} 
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
  @keyframes evaBtnGlow{0%,100%{box-shadow:0 0 14px rgba(0,180,160,0.4),0 0 30px rgba(0,140,120,0.2);}50%{box-shadow:0 0 24px rgba(0,220,200,0.6),0 0 50px rgba(0,180,160,0.3);}}
  @keyframes blinkingAnim{0%,49%{opacity:1;}50%,100%{opacity:0.2;}}
  @keyframes pulseGlow{0%,100%{opacity:0.7;}50%{opacity:1;}}
  @keyframes missionPop{0%{opacity:0;transform:translate(-50%,-50%) scale(0.85);}15%{opacity:1;transform:translate(-50%,-50%) scale(1.03);}85%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-50%) scale(0.95);}}
  @keyframes eventPopIn{0%{opacity:0;transform:translate(-50%,-40%) scale(0.8);}15%{opacity:1;transform:translate(-50%,-50%) scale(1.05);}30%{opacity:1;transform:translate(-50%,-50%) scale(1);}85%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-60%) scale(0.9);}}
  @keyframes scanline{0%{transform:translateY(-100%);}100%{transform:translateY(100%);}}
  @keyframes crtFlicker{0%,100%{opacity:0.95;}50%{opacity:1;}}
  @keyframes slideInFromRight{0%{opacity:0;transform:translateX(20px);}100%{opacity:1;transform:translateX(0);}}
  .ign-btn{animation:ignBtnGlow 3s ease-in-out infinite;}
  .ign-btn:hover{filter:brightness(1.25);}
  .eva-btn{animation:evaBtnGlow 2.5s ease-in-out infinite;}
  .blink{animation:blinkingAnim 1s step-end infinite;}
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
  @keyframes evaFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-4px);}}
  @keyframes evaPopIn{0%{opacity:0;transform:translate(-50%,-50%) scale(0.88);}60%{opacity:1;transform:translate(-50%,-50%) scale(1.02);}100%{opacity:1;transform:translate(-50%,-50%) scale(1);}}
  @keyframes backBtnPulse{0%,100%{box-shadow:0 0 8px rgba(0,140,220,0.3);}50%{box-shadow:0 0 18px rgba(0,180,255,0.55);}}
  .eva-float{animation:evaFloat 3s ease-in-out infinite;}
  .back-btn{background:rgba(0,8,24,0.80);border:1px solid rgba(0,140,220,0.4);border-radius:6px;color:rgba(0,180,255,0.85);font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:3px;cursor:pointer;padding:6px 12px;transition:border-color 0.2s,color 0.2s;animation:backBtnPulse 3s ease-in-out infinite;}
  .back-btn:hover{border-color:rgba(0,200,255,0.75);color:#fff;background:rgba(0,16,44,0.92);}
  /* cockpit console details */
  .console-ridge{background:linear-gradient(180deg,rgba(0,60,100,0.4) 0%,rgba(0,30,60,0.2) 40%,rgba(0,60,100,0.4) 100%);border-top:1px solid rgba(0,140,200,0.22);border-bottom:1px solid rgba(0,140,200,0.22);}
  .console-btn{display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:5px 7px;border-radius:5px;border:1px solid rgba(0,80,120,0.35);background:rgba(0,10,28,0.7);transition:border-color 0.2s,background 0.2s;}
  .console-btn:hover{border-color:rgba(0,180,255,0.5);background:rgba(0,20,50,0.85);}
  .console-btn-label{font-family:'Share Tech Mono',monospace;font-size:7px;letter-spacing:2px;color:rgba(0,140,200,0.6);}
  .console-light{width:10px;height:10px;border-radius:50%;}
  .crew-input{background:rgba(0,5,18,0.8);border:1px solid rgba(0,100,160,0.35);border-bottom:2px solid rgba(0,160,255,0.5);color:#a0d8ff;font-family:'Share Tech Mono',monospace;font-size:10px;letter-spacing:2px;padding:4px 8px;outline:none;border-radius:3px 3px 2px 2px;width:100%;}
  .crew-input:focus{border-bottom-color:#00c8ff;box-shadow:0 0 0 1px rgba(0,120,255,0.15);}
  .crew-add-btn{background:rgba(0,60,100,0.6);border:1px solid rgba(0,140,200,0.4);border-radius:3px;color:#00c8ff;font-family:'Share Tech Mono',monospace;font-size:9px;letter-spacing:2px;cursor:pointer;padding:4px 8px;transition:filter 0.15s;white-space:nowrap;}
  .crew-add-btn:hover{filter:brightness(1.3);}
  .planet-sphere { width: 60px; height: 60px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, #a0d8ff, #004080, #001030); box-shadow: inset -10px -10px 20px rgba(0,0,0,0.8), 0 0 20px rgba(0,180,255,0.6); margin: 0 auto 12px; animation: evaFloat 4s ease-in-out infinite; }
`;

export default function SpaceshipPomodoro() {
  const searchParams   = useSearchParams();
  const router         = useRouter();

  /* ── searchParams から memberId を取得するように追加 ── */
  const destId         = parseInt(searchParams?.get("dest") ?? "0", 10);
  const destTimeMin    = parseInt(searchParams?.get("time") ?? "25", 10);
  const taskId         = searchParams?.get("task_id") ?? searchParams?.get("taskId") ?? "";
  const memberId       = searchParams?.get("member_id") ?? searchParams?.get("memberId") ?? ""; 

  const targetLy       = DEST_DATA.find(d => d.id === destId)?.ly || 1585;
  const GOAL_TOTAL_SEC = destTimeMin * 60;
  const TOTAL          = 25 * 60;

  const [timeLeft,     setTimeLeft]    = useState(TOTAL);
  const [goalLeft,     setGoalLeft]    = useState(GOAL_TOTAL_SEC);
  const [distance,     setDistance]    = useState(0); 
  const [isRunning,   setIsRunning]   = useState(false);
  const [isPausing,   setIsPausing]   = useState(false);
  const [warpPhase,   setWarpPhase]   = useState("idle");
  const [isMounted,   setIsMounted]   = useState(false);
  const [missionDone, setMissionDone] = useState(false);
  const [warpSpeed,   setWarpSpeed]   = useState(0);
  const [activeTimeId, setActiveTimeId] = useState<string | null>(
    searchParams?.get("time_id") ?? searchParams?.get("timeId")
  );
  const [serverOnlineCount, setServerOnlineCount] = useState<number | null>(null);
  const [apiError, setApiError] = useState("");
  const [members, setMembers] = useState<TaskMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  
  const passedLandmarksRef = useRef<Set<number>>(new Set());
  const [currentEvent, setCurrentEvent] = useState<{name:string, msg:string} | null>(null);

  const canvasRef        = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const starsRef         = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const largeObjRef      = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dustRef          = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const galaxiesRef      = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const milkyWayStarsRef = useRef<any[]>([]);
  const animRef          = useRef(0);
  const tRef             = useRef(0);
  const isRunningRef     = useRef(false);
  const isPausingRef     = useRef(false);
  const activeCountRef   = useRef(1);
  const warpSpeedRef     = useRef(0);
  const evaSpeedRef      = useRef(1.0);
  const timeLeftRef      = useRef(TOTAL);
  const goalLeftRef      = useRef(GOAL_TOTAL_SEC);
  const warpAnimRef      = useRef(0);

  /* ── 拡大(ズーム)防止の処理 ── */
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      // 2本指以上でのタッチ操作（ピンチイン・アウト）を無効化
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    const handleWheel = (e: WheelEvent) => {
      // Ctrlキーを押しながらのホイール（PCブラウザの拡大縮小）を無効化
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouch, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouch);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => { isRunningRef.current  = isRunning;   }, [isRunning]);
  useEffect(() => { isPausingRef.current = isPausing;  }, [isPausing]);
  useEffect(() => { timeLeftRef.current   = timeLeft;    }, [timeLeft]);
  useEffect(() => { goalLeftRef.current   = goalLeft;    }, [goalLeft]);
  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    const totalProg = 1 - (goalLeft / Math.max(1, GOAL_TOTAL_SEC));
    setDistance(Math.max(0, totalProg * targetLy));
  }, [goalLeft, GOAL_TOTAL_SEC, targetLy]);

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

  const handleBack = useCallback(() => {
    setIsRunning(false);
    setIsPausing(false);
    setWarpPhase("idle");
    warpSpeedRef.current = 0;
    cancelAnimationFrame(warpAnimRef.current);
    router.push("/goal");
  }, [router]);

  const startWarp = useCallback(() => {
    setWarpPhase("spinup");
    setTimeout(() => { setIsRunning(true); setWarpPhase("warp"); }, 1200);
  }, []);

  const fetchMembers = useCallback(async (forceSelfOnline = false) => {
    if (!taskId) return;
    const res = await fetch(
      buildApiUrl(`/tasks/${taskId}/members?t=${Date.now()}`),
      { cache: "no-store" }
    );
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    const rawMembers = Array.isArray(data?.members) ? data.members : [];
    const normalized: TaskMember[] = rawMembers.map((m: Record<string, unknown>) => {
      const memberIdFromApi = String(m.member_id ?? "");
      const onlineFromApi = m.is_online ?? m.isOnline ?? m.online;
      const isSelfActive =
        memberIdFromApi === memberId && (Boolean(activeTimeId) || forceSelfOnline);
      return {
        member_id: memberIdFromApi,
        user_id: String(m.user_id ?? ""),
        name: String(m.name ?? ""),
        email: String(m.email ?? ""),
        sum_time: Number(m.sum_time ?? 0),
        is_online: toBool(onlineFromApi) || isSelfActive,
      };
    });
    setMembers(normalized);
  }, [taskId, memberId, activeTimeId]);

  const handleStartWork = useCallback(async () => {
    if (!memberId) {
      setApiError("member_id がURLにありません");
      return;
    }
    setApiError("");
    try {
      const res = await fetch(buildApiUrl("/work/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "StartWorksの呼び出しに失敗しました");
      }

      const data = await res.json();
      // 互換のため複数キーを許容（backend実装差異に対応）
      const returnedTimeId = data?.time_id ?? data?.timeId ?? data?.time_ID ?? data?.id ?? null;
      if (returnedTimeId) {
        setActiveTimeId(String(returnedTimeId));
      }
      if (typeof data?.leave_time === "number") {
        setGoalLeft(Math.max(0, data.leave_time));
      }
      if (typeof data?.online_member_count === "number") {
        setServerOnlineCount(data.online_member_count);
      }
      await fetchMembers(true);
      startWarp();
    } catch (error) {
      const message = error instanceof Error ? error.message : "StartWorksの呼び出しに失敗しました";
      setApiError(message);
    }
  }, [memberId, fetchMembers, startWarp]);

  const stopWarp = useCallback(() => {
    setWarpPhase("spindown");
    setTimeout(() => { setIsRunning(false); setWarpPhase("idle"); }, 900);
  }, []);

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

  const activeCount = Math.max(1, serverOnlineCount ?? 1);
  useEffect(() => {
    activeCountRef.current = activeCount;
  }, [activeCount]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(p => { const n = p - 1; timeLeftRef.current = n; return n; });
        
        setGoalLeft(p => { 
          const n = Math.max(0, p - activeCount); 
          goalLeftRef.current = n; 
          return n; 
        });

        const totalProg = 1 - (goalLeftRef.current / Math.max(1, GOAL_TOTAL_SEC));
        const cLy = totalProg * targetLy;
        setDistance(cLy);

        const passed = passedLandmarksRef.current;
        const newLandmarks = LANDMARKS.filter((lm, idx) => cLy >= lm.ly && !passed.has(idx));
        
        if (newLandmarks.length > 0) {
          const latest = newLandmarks[newLandmarks.length - 1];
          setCurrentEvent({ name: latest.name, msg: latest.msg });
          newLandmarks.forEach(lm => passed.add(LANDMARKS.indexOf(lm)));
          setTimeout(() => setCurrentEvent(null), 6000);
        }

      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      stopWarp();
      setMissionDone(true);
      setTimeout(() => {
        setMissionDone(false);
        setTimeLeft(TOTAL);   timeLeftRef.current = TOTAL;
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, stopWarp, activeCount, TOTAL, GOAL_TOTAL_SEC, targetLy]); 

  const handlePause = useCallback(async () => {
    if (isPausing) return;
    setApiError("");

    if (!activeTimeId) {
      setApiError("time_id が取得できていないため endTime を実行できません");
      return;
    }

    // タイマーを即座に停止
    setIsRunning(false);
    isRunningRef.current = false;

    try {
      const res = await fetch(buildApiUrl(`/time/${activeTimeId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "endTimeの呼び出しに失敗しました");
      }

      const data = await res.json().catch(() => ({}));
      if (typeof data?.leave_time === "number") {
        setGoalLeft(Math.max(0, data.leave_time));
      }
      if (typeof data?.online_member_count === "number") {
        setServerOnlineCount(data.online_member_count);
      }
      await fetchMembers();
    } catch (error) {
      const message = error instanceof Error ? error.message : "endTimeの呼び出しに失敗しました";
      setApiError(message);
      return;
    }

    // 演出を開始
    evaSpeedRef.current = 1.0;
    setIsPausing(true); 
    isPausingRef.current = true;
    setWarpPhase("idle");
    
    // 2.2秒後にリセット処理
    setTimeout(() => {
      setIsPausing(false); 
      isPausingRef.current = false;
      setTimeLeft(TOTAL);   
      timeLeftRef.current = TOTAL;
      warpSpeedRef.current = 0;
      evaSpeedRef.current = 1.0;
      setActiveTimeId(null);
      setServerOnlineCount(null);
    }, 2200);
  }, [isPausing, TOTAL, activeTimeId, fetchMembers]); 

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const STAR_COLORS = ["#ffffff","#ffffff","#ffffff","#cce0ff","#cce0ff","#fffacc","#ffd0a0","#ffaaaa"];

    const initObjects = (W: number, H: number) => {
      const DEPTH = 4000;
      starsRef.current = Array.from({ length: 4000 }, () => ({
        wx: randRange(-W * 3, W * 3), wy: randRange(-H * 3, H * 3), wz: randRange(100, DEPTH),
        r: randRange(0.3, 2.8), color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        tp: Math.random() * Math.PI * 2, ts: randRange(0.015, 0.06),
      }));
      milkyWayStarsRef.current = Array.from({ length: 1500 }, () => {
        const angle = randRange(-0.3, 0.3);
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
      galaxiesRef.current = Array.from({ length: 8 }, () => ({
        wx: randRange(-W * 2, W * 2), wy: randRange(-H * 2, H * 2),
        wz: randRange(2000, DEPTH * 0.95), size: randRange(3, 8),
        angle: Math.random() * Math.PI * 2, hue: randRange(180, 280),
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
      dustRef.current = Array.from({ length: 600 }, () => ({
        wx: randRange(-W * 2.5, W * 2.5), wy: randRange(-H * 2.5, H * 2.5),
        wz: randRange(50, 2000), op: randRange(0.03, 0.25), hue: randRange(180, 240),
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
      const ej = isPausingRef.current;
      const teamBoost = 1 + Math.max(0, activeCountRef.current - 1) * 1;
      if (ej && evaSpeedRef.current > 0.0) {
        evaSpeedRef.current = Math.max(0, evaSpeedRef.current - 0.008);
      }
      const evaS = ej ? evaSpeedRef.current : 1.0;
      const FOCAL = W * 0.7;
      const MAX_Z = 4000;
      const SPD   = (3 + ws * 110) * evaS * teamBoost;
      const cx = W / 2, cy = H / 2;

      const bgG = ctx.createRadialGradient(cx * 0.85, cy * 0.65, 0, cx, cy, Math.hypot(W, H) * 0.9);
      bgG.addColorStop(0,    ws > 0.05 ? "#080520" : "#060318");
      bgG.addColorStop(0.3,  ws > 0.05 ? "#040315" : "#030210");
      bgG.addColorStop(0.65, ws > 0.05 ? "#02020d" : "#01010a");
      bgG.addColorStop(1,    "#000000");
      ctx.fillStyle = bgG;
      ctx.fillRect(0, 0, W, H);

      const nebula = (nx: number, ny: number, rx: number, ry: number, hue: number, al: number, layers = 3) => {
        ctx.save(); ctx.translate(nx, ny);
        for (let layer = 0; layer < layers; layer++) {
          const ls = 1 - layer * 0.25, la = al * (1 - layer * 0.3);
          ctx.save(); ctx.scale(ls, (ry / rx) * ls);
          const ng = ctx.createRadialGradient(Math.sin(t * 0.001 + layer) * 20, Math.cos(t * 0.0015 + layer) * 15, 0, 0, 0, rx);
          ng.addColorStop(0,    `hsla(${hue + layer * 15},75%,65%,${la})`);
          ng.addColorStop(0.35, `hsla(${hue + 25 + layer * 10},60%,45%,${la * 0.6})`);
          ng.addColorStop(0.7,  `hsla(${hue + layer * 20},50%,35%,${la * 0.25})`);
          ng.addColorStop(1,    `hsla(${hue},45%,25%,0)`);
          ctx.fillStyle = ng; ctx.beginPath(); ctx.arc(0, 0, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
        }
        ctx.restore();
      };

      const na = 0.028 + ws * 0.015;
      nebula(W * 0.12, H * 0.28, 350, 180, 215, na * (0.95 + Math.sin(t * 0.004) * 0.1), 4);
      nebula(W * 0.82, H * 0.58, 280, 140, 265, na * (0.85 + Math.sin(t * 0.006) * 0.1), 3);
      nebula(W * 0.58, H * 0.12, 220, 110, 195, na * 0.75, 3);
      nebula(W * 0.25, H * 0.78, 190,  95, 295, na * 0.9, 3);
      nebula(W * 0.70, H * 0.25, 160,  80, 245, na * 0.65, 2);

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.25);
      const mw = ctx.createLinearGradient(-W * 0.6, -H * 0.3, W * 0.6, H * 0.3);
      mw.addColorStop(0,    "hsla(220,40%,45%,0)");
      mw.addColorStop(0.25, `hsla(215,45%,50%,${0.015 + ws * 0.008})`);
      mw.addColorStop(0.5,  `hsla(210,50%,55%,${0.025 + ws * 0.012})`);
      mw.addColorStop(0.75, `hsla(215,45%,50%,${0.015 + ws * 0.008})`);
      mw.addColorStop(1,    "hsla(220,40%,45%,0)");
      ctx.fillStyle = mw; ctx.fillRect(-W, -H * 0.4, W * 2, H * 0.8); ctx.restore();

      galaxiesRef.current.forEach(gal => {
        gal.wz -= SPD * 0.15; gal.angle += 0.001;
        if (gal.wz < 50) { gal.wz = MAX_Z * 0.95; gal.wx = randRange(-W * 2, W * 2); gal.wy = randRange(-H * 2, H * 2); }
        const px = cx + (gal.wx / gal.wz) * FOCAL, py = cy + (gal.wy / gal.wz) * FOCAL;
        if (px < -100 || px > W + 100 || py < -100 || py > H + 100) return;
        const dep = 1 - gal.wz / MAX_Z, size = gal.size * dep * 2;
        if (size < 0.3) return;
        ctx.save(); ctx.translate(px, py); ctx.rotate(gal.angle); ctx.globalAlpha = dep * 0.4;
        const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 2);
        gg.addColorStop(0, `hsl(${gal.hue},60%,70%)`); gg.addColorStop(0.5, `hsl(${gal.hue + 15},45%,50%)`); gg.addColorStop(1, "transparent");
        ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(0, 0, size * 2, size * 0.8, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });

      dustRef.current.forEach(d => {
        d.wz -= SPD * 0.2;
        if (d.wz < 1) { d.wz = MAX_Z; d.wx = randRange(-W * 2.5, W * 2.5); d.wy = randRange(-H * 2.5, H * 2.5); }
        const px = cx + (d.wx / d.wz) * FOCAL, py = cy + (d.wy / d.wz) * FOCAL;
        if (px < -10 || px > W + 10 || py < -10 || py > H + 10) return;
        ctx.globalAlpha = d.op * (1 - d.wz / MAX_Z) * 0.7;
        ctx.fillStyle = `hsl(${d.hue},70%,70%)`; ctx.beginPath(); ctx.arc(px, py, 0.6, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      largeObjRef.current.forEach(obj => {
        obj.wz -= SPD * 0.6 + ws * 5; obj.angle += 0.003 + ws * 0.005;
        if (obj.wz < 50) { obj.wz = MAX_Z * 0.9; obj.wx = randRange(-W * 2, W * 2); obj.wy = randRange(-H * 1.8, H * 1.8); }
        const px = cx + (obj.wx / obj.wz) * FOCAL, py = cy + (obj.wy / obj.wz) * FOCAL;
        if (px < -200 || px > W + 200 || py < -200 || py > H + 200) return;
        const dep = 1 - obj.wz / MAX_Z, rad = obj.br * dep * (FOCAL / 600) * 4;
        if (rad < 0.5) return;
        if (obj.type === "star") {
          const gr = ctx.createRadialGradient(px, py, 0, px, py, rad * 5);
          gr.addColorStop(0, `hsla(${obj.hue},${obj.sat}%,${obj.bri}%,${dep * 0.9})`);
          gr.addColorStop(0.25, `hsla(${obj.hue},${obj.sat}%,${obj.bri * 0.7}%,${dep * 0.3})`);
          gr.addColorStop(1, "transparent");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(px, py, rad * 5, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `hsl(${obj.hue},${obj.sat}%,${obj.bri}%)`; ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
        } else if (obj.type === "planet") {
          const pg = ctx.createRadialGradient(px - rad * 0.3, py - rad * 0.3, rad * 0.05, px, py, rad);
          pg.addColorStop(0, `hsl(${obj.hue + 20},${obj.sat + 20}%,${obj.bri + 20}%)`);
          pg.addColorStop(0.6, `hsl(${obj.hue},${obj.sat}%,${obj.bri}%)`);
          pg.addColorStop(1, `hsl(${obj.hue - 10},${obj.sat - 10}%,${obj.bri * 0.3}%)`);
          ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, rad, 0, Math.PI * 2); ctx.fill();
          if (obj.hue < 240 && rad > 12) {
            ctx.save(); ctx.translate(px, py); ctx.scale(1, 0.25);
            ctx.strokeStyle = `hsla(${obj.hue + 10},50%,70%,${dep * 0.35})`; ctx.lineWidth = rad * 0.5;
            ctx.beginPath(); ctx.arc(0, 0, rad * 1.7, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
          }
        } else {
          ctx.save(); ctx.translate(px, py); ctx.rotate(obj.angle);
          const ag = ctx.createRadialGradient(-rad * 0.2, -rad * 0.2, 0, 0, 0, rad * 1.2);
          ag.addColorStop(0, `hsl(${obj.hue},${obj.sat}%,${obj.bri}%)`);
          ag.addColorStop(1, `hsl(${obj.hue},${obj.sat * 0.5}%,${obj.bri * 0.3}%)`);
          ctx.fillStyle = ag; ctx.beginPath();
          for (let k = 0; k < 7; k++) {
            const a = (k / 7) * Math.PI * 2, rr = rad * (0.7 + 0.3 * Math.sin(k * 2.3 + obj.angle * 3));
            if (k === 0) ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
            else ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
          }
          ctx.closePath(); ctx.fill(); ctx.restore();
        }
      });

      milkyWayStarsRef.current.forEach(s => {
        s.wz -= SPD * 0.5; s.tp += s.ts;
        if (s.wz < 1) {
          s.wz = MAX_Z;
          const a = randRange(-0.3, 0.3), d = randRange(0, W * 2.5);
          s.wx = Math.cos(a) * d; s.wy = Math.sin(a) * d + randRange(-H * 0.4, H * 0.4);
        }
        const px = cx + (s.wx / s.wz) * FOCAL, py = cy + (s.wy / s.wz) * FOCAL;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        const dep = Math.max(0, 1 - s.wz / MAX_Z);
        ctx.globalAlpha = (0.15 + dep * 0.85) * (0.7 + Math.sin(s.tp) * 0.3);
        ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(px, py, Math.max(0.3, s.r * dep * 0.7), 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      starsRef.current.forEach(s => {
        s.wz -= SPD; s.tp += s.ts;
        if (s.wz < 1) { s.wz = MAX_Z; s.wx = randRange(-W * 3, W * 3); s.wy = randRange(-H * 3, H * 3); }
        const px = cx + (s.wx / s.wz) * FOCAL, py = cy + (s.wy / s.wz) * FOCAL;
        if (px < -20 || px > W + 20 || py < -20 || py > H + 20) return;
        const dep = Math.max(0, 1 - s.wz / MAX_Z);
        if (ws > 0.05) {
          const pz = s.wz + SPD, ppx = cx + (s.wx / pz) * FOCAL, ppy = cy + (s.wy / pz) * FOCAL;
          if (Math.hypot(px - ppx, py - ppy) < 0.3) return;
          const hue = s.color === "#cce0ff" ? 210 : s.color === "#ffd0a0" ? 25 : s.color === "#ffaaaa" ? 350 : 195;
          const sg = ctx.createLinearGradient(ppx, ppy, px, py);
          sg.addColorStop(0, `hsla(${hue},90%,90%,0)`);
          sg.addColorStop(1, `hsla(${hue},100%,97%,${(0.15 + dep * 0.85) * ws})`);
          ctx.strokeStyle = sg; ctx.lineWidth = Math.max(0.3, s.r * dep * (ws > 0.5 ? 2.0 : 1.2)); ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(ppx, ppy); ctx.lineTo(px, py); ctx.stroke();
        } else {
          ctx.globalAlpha = (0.1 + dep * 0.9) * (0.6 + Math.sin(s.tp) * 0.4);
          ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(px, py, Math.max(0.3, s.r * dep * 0.8), 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        }
      });

      if (ws > 0.1) {
        const wr = ws * ws;
        for (let ring = 0; ring < 3; ring++) {
          const phase = (t * 0.04 + ring * 0.33) % 1;
          ctx.strokeStyle = `rgba(80,180,255,${(1 - phase) * 0.12 * wr})`;
          ctx.lineWidth = 1 + (1 - phase) * 2;
          ctx.beginPath(); ctx.arc(cx, cy, phase * Math.min(W, H) * 0.45 * wr, 0, Math.PI * 2); ctx.stroke();
        }
      }
      if (ej) {
        const breathe = 0.10 + Math.sin(t * 0.04) * 0.05;
        ctx.fillStyle = `rgba(0,40,80,${breathe})`;
        ctx.fillRect(0, 0, W, H);
        const vg = ctx.createRadialGradient(cx, cy, W * 0.3, cx, cy, W * 0.85);
        vg.addColorStop(0, "transparent");
        vg.addColorStop(1, `rgba(0,80,120,${0.18 + Math.sin(t * 0.03) * 0.06})`);
        ctx.fillStyle = vg;
        ctx.fillRect(0, 0, W, H);
      }
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;
  const fmtGoal = (s: number) => {
    const h  = Math.floor(s / 3600);
    const m  = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2,"0")}m ${String(ss).padStart(2,"0")}s`;
    return `${m}m ${String(ss).padStart(2,"0")}s`;
  };

  /* ── 距離表示用ヘルパー関数 ── */
  const formatDistanceKm = (ly: number) => {
    if (ly === 0) return "0";
    const km = ly * 9.46073e12; // 1光年 ≒ 9.46兆km
    if (km < 1e4) return km.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (km < 1e8) return (km / 1e4).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " 万";
    if (km < 1e12) return (km / 1e8).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " 億";
    if (km < 1e16) return (km / 1e12).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " 兆";
    return (km / 1e16).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " 京";
  };

  const progress     = (TOTAL - timeLeft) / TOTAL;
  const goalProgress = Math.max(0, 1 - goalLeft / Math.max(1, GOAL_TOTAL_SEC));
  const goalDone     = goalLeft === 0;
  const effectiveOnlineIds = (() => {
    const target = Math.max(0, Math.min(members.length, serverOnlineCount ?? 0));
    const ids = new Set<string>(
      members.filter((m) => m.is_online).map((m) => m.member_id)
    );
    if (ids.size >= target) return ids;

    // 自分を優先してONLINEに補完
    const self = members.find((m) => m.member_id === memberId);
    if (self) ids.add(self.member_id);

    if (ids.size < target) {
      for (const m of members) {
        ids.add(m.member_id);
        if (ids.size >= target) break;
      }
    }
    return ids;
  })();

  const fetchTaskStatus = useCallback(async () => {
    if (!taskId) return;
    const res = await fetch(
      buildApiUrl(`/tasks/${taskId}/status?t=${Date.now()}`),
      { cache: "no-store" }
    );
    if (!res.ok) return;
    const data = await res.json().catch(() => ({}));
    if (typeof data?.online_member_count === "number") {
      setServerOnlineCount(data.online_member_count);
    }
    // 実行中はフロントの1秒更新を優先し、サーバー値で逆行させない
    if (!isRunningRef.current && typeof data?.leave_time === "number") {
      setGoalLeft(Math.max(0, data.leave_time));
    }
  }, [taskId]);

  const handleInvite = useCallback(async () => {
    const email = inviteEmail.trim();
    if (!taskId || !email) return;
    setApiError("");
    try {
      const res = await fetch(buildApiUrl(`/tasks/${taskId}/invite`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail ?? "招待に失敗しました");
      }
      setInviteEmail("");
      await fetchMembers();
      await fetchTaskStatus();
    } catch (error) {
      const message = error instanceof Error ? error.message : "招待に失敗しました";
      setApiError(message);
    }
  }, [inviteEmail, taskId, fetchMembers, fetchTaskStatus]);

  useEffect(() => {
    void fetchMembers();
    void fetchTaskStatus();
  }, [fetchMembers, fetchTaskStatus]);

  useEffect(() => {
    if (!taskId) return;
    void fetchMembers(Boolean(activeTimeId));
  }, [taskId, activeTimeId, fetchMembers]);

  useEffect(() => {
    if (!taskId) return;
    const timer = setInterval(() => {
      void fetchTaskStatus();
      void fetchMembers();
    }, 3000);
    return () => clearInterval(timer);
  }, [taskId, fetchMembers, fetchTaskStatus]);

  const S: Record<string, CSSProperties> = {
    root:        { position:"fixed", top:0, left:0, right:0, bottom:0, overflow:"hidden", background:"#080818", userSelect:"none", fontFamily:"Courier New,monospace" },
    canvas:      { position:"absolute", top:0, left:0, right:0, bottom:0, display:"block", width:"100%", height:"100%" },
    layout:      { position:"absolute", top:0, left:0, right:0, bottom:0, display:"flex", flexDirection:"column", pointerEvents:"none" },
    topRow:      { flex:1, display:"flex", minHeight:0, overflow:"hidden" },
    leftCol:     { width:"clamp(130px,13vw,190px)", flexShrink:0, display:"flex", flexDirection:"column", padding:"12px 10px", gap:"10px", borderRight:"2px solid rgba(0,100,180,0.25)", pointerEvents:"all" },
    rightCol:    { width:"clamp(130px,13vw,190px)", flexShrink:0, display:"flex", flexDirection:"column", padding:"12px 10px", gap:"10px", borderLeft:"2px solid rgba(0,100,180,0.25)", pointerEvents:"all" },
    window:      { flex:1, position:"relative", overflow:"hidden" },
    bottomPanel: { flexShrink:0, height:"clamp(170px,22vh,245px)", borderTop:"3px solid rgba(0,120,200,0.4)", display:"flex", padding:"0", gap:"0", pointerEvents:"all", position:"relative" },
  };

  return (
    <div style={S.root}>
      <style>{CSS_STYLES}</style>
      <canvas ref={canvasRef} style={S.canvas} />
      {isMounted && (
        <div style={S.layout} className={isPausing ? "eva-float" : ""}>
          <div style={S.topRow}>

            {/* ── 左コラム ── */}
            <div className="metal-dark" style={S.leftCol}>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>

              {/* ポモドーロタイマー */}
              <div className="instrument glass-sheen" style={{ borderRadius:"10px", padding:"12px 8px", textAlign:"center" }}>
                <div className="stm" style={{ fontSize:"9px", letterSpacing:"3px", color:"rgba(0,160,255,0.5)", marginBottom:"6px" }}>POMODORO</div>
                <div className="orb" style={{ fontSize:"clamp(20px,3.2vw,30px)", fontWeight:900, color:timeLeft < 300 ? "#ff4444" : timeLeft < 600 ? "#ffaa00" : "#fff", textShadow:timeLeft < 300 ? "0 0 20px rgba(255,60,60,0.8)" : "0 0 15px rgba(255,255,255,0.3)", letterSpacing:"2px", lineHeight:1 }}>{fmt(timeLeft)}</div>
                <div style={{ marginTop:"8px", height:"3px", background:"rgba(0,40,80,0.6)", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:(progress * 100)+"%", background:"linear-gradient(90deg,#00c8ff,#7050ff,#ff4060)", boxShadow:"0 0 6px rgba(0,200,255,0.6)", transition:"width 1s linear" }} />
                </div>
                <div className="stm" style={{ fontSize:"8px", color:"rgba(0,160,200,0.5)", marginTop:"4px" }}>{Math.round(progress * 100)}% ELAPSED</div>
              </div>

              {/* 目標時間カウントダウン */}
              <div className="instrument glass-sheen" style={{ borderRadius:"10px", padding:"10px 8px", textAlign:"center" }}>
                <div className="stm" style={{ fontSize:"9px", letterSpacing:"3px", color:goalDone ? "rgba(0,255,100,0.65)" : "rgba(160,100,255,0.65)", marginBottom:"5px" }}>
                  {goalDone ? "★ GOAL CLEAR" : "GOAL TIME"}
                </div>
                <div className="orb" style={{ fontSize:"clamp(9px,1.25vw,12px)", fontWeight:700, color:goalDone ? "#00e060" : "#c090ff", textShadow:goalDone ? "0 0 14px #00e060" : "0 0 10px rgba(180,120,255,0.6)", lineHeight:1.45 }}>
                  {fmtGoal(goalLeft)}
                </div>
                <div style={{ marginTop:"6px", height:"3px", background:"rgba(0,20,50,0.7)", borderRadius:"2px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:(goalProgress * 100)+"%", background:goalDone ? "#00e060" : "linear-gradient(90deg,#a060ff,#00c8ff)", boxShadow:goalDone ? "0 0 6px #00e060" : "0 0 5px rgba(160,100,255,0.5)", transition:"width 1s linear" }} />
                </div>
                <div className="stm" style={{ fontSize:"7px", color:goalDone ? "rgba(0,220,80,0.5)" : "rgba(120,80,180,0.5)", marginTop:"3px" }}>
                  {Math.round(goalProgress * 100)}% CLEARED
                </div>
                {activeCount > 1 && (
                  <div className="stm" style={{ fontSize:"7px", color:"rgba(0,200,180,0.6)", marginTop:"3px", letterSpacing:"1px" }}>
                    x{activeCount} 加速中
                  </div>
                )}
              </div>

              {/* 距離表示（光年） */}
              <div className="instrument glass-sheen" style={{ borderRadius:"8px", padding:"10px 8px", textAlign:"center" }}>
                <div className="stm" style={{ fontSize:"8px", color:"rgba(0,160,255,0.45)", letterSpacing:"3px", marginBottom:"6px" }}>DISTANCE (LY)</div>
                <div className="orb" style={{ fontSize:"clamp(15px, 1.8vw, 19px)", fontWeight:900, color:"#b090ff", textShadow:"0 0 10px rgba(150,100,255,0.6)", lineHeight:1 }}>
                  {distance >= 1000 ? distance.toLocaleString(undefined, {maximumFractionDigits:0}) : distance.toLocaleString(undefined, {maximumFractionDigits:2})}
                </div>
                <div className="stm" style={{ fontSize:"9px", color:"rgba(176,144,255,0.7)", marginTop:"4px", letterSpacing:"2px" }}>光年</div>
                <div className="stm" style={{ fontSize:"7px", color:"rgba(80,60,140,0.5)", marginTop:"6px", paddingTop:"6px", borderTop:"1px solid rgba(0,100,180,0.2)" }}>
                  DEST: {targetLy.toLocaleString()} LY
                </div>
              </div>

              {/* 距離表示（km） */}
              <div className="instrument glass-sheen" style={{ borderRadius:"8px", padding:"10px 8px", textAlign:"center" }}>
                <div className="stm" style={{ fontSize:"8px", color:"rgba(0,160,255,0.45)", letterSpacing:"3px", marginBottom:"6px" }}>DISTANCE (KM)</div>
                <div className="orb" style={{ fontSize:"clamp(11px, 1.3vw, 14px)", fontWeight:800, color:"#9080ff", textShadow:"0 0 8px rgba(140,100,255,0.5)", lineHeight:1.3, letterSpacing:"0px", wordBreak:"break-all" }}>
                  {formatDistanceKm(distance)}
                </div>
                <div className="stm" style={{ fontSize:"9px", color:"rgba(144,128,255,0.7)", marginTop:"4px", letterSpacing:"2px" }}>km</div>
              </div>
            </div>

            {/* ── ウィンドウ ── */}
            <div style={S.window}>
              <div style={{ position:"absolute", top:14, left:16, zIndex:10, pointerEvents:"all" }}>
                <button className="back-btn" onClick={handleBack}>◀ 目的地変更</button>
              </div>
              <div style={{ position:"absolute", top:"-6px", left:"-6px", right:"-6px", bottom:"-6px", borderRadius:"38% / 32%", boxShadow:"inset 0 0 0 clamp(14px,2.2vw,26px) #0b1220, inset 0 0 0 clamp(16px,2.5vw,29px) rgba(0,90,170,0.35), inset 0 0 0 clamp(18px,2.8vw,32px) rgba(0,0,0,0.55), 0 0 50px rgba(0,80,160,0.35)", pointerEvents:"none", zIndex:5 }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(100,160,220,0.04) 0%,transparent 40%,rgba(0,0,0,0.14) 100%)", zIndex:4, pointerEvents:"none" }} />
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 40%,transparent 35%,rgba(0,5,20,0.38) 65%,rgba(0,0,10,0.68) 100%)", zIndex:3, pointerEvents:"none" }} />

              {missionDone && (
                <div style={{ position:"absolute", top:"50%", left:"50%", zIndex:20, animation:"missionPop 5s ease-out forwards", background:"rgba(0,18,12,0.92)", border:"1px solid rgba(80,255,160,0.4)", borderRadius:"12px", padding:"20px 40px", textAlign:"center", pointerEvents:"none" }}>
                  <div className="orb" style={{ fontSize:"clamp(14px,2.2vw,26px)", fontWeight:900, color:"#a0ffc0", textShadow:"0 0 20px rgba(80,255,160,0.8)" }}>POMODORO COMPLETE</div>
                  <div className="stm" style={{ fontSize:"clamp(9px,1.1vw,12px)", color:"rgba(80,200,140,0.8)", marginTop:"8px" }}>次のセッションを開始してください</div>
                </div>
              )}
              {isPausing && (
                <>
                  <div style={{ position:"absolute", inset:0, background:"rgba(0,60,100,0.22)", animation:"evaGlow 3s ease-in-out infinite", pointerEvents:"none", zIndex:15 }} />
                  <div style={{ position:"absolute", inset:0, border:"2px solid rgba(0,200,200,0.25)", borderRadius:4, animation:"evaGlow 3s ease-in-out infinite", pointerEvents:"none", zIndex:16 }} />
                  <div style={{ position:"absolute", top:"50%", left:"50%", zIndex:20, animation:"evaPopIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards", background:"rgba(0,12,28,0.88)", border:"1px solid rgba(0,200,180,0.35)", borderRadius:"12px", padding:"20px 40px", textAlign:"center", pointerEvents:"none", boxShadow:"0 0 40px rgba(0,150,160,0.25), inset 0 0 20px rgba(0,80,100,0.15)" }}>
                    <div className="stm" style={{ fontSize:"10px", letterSpacing:"5px", color:"rgba(0,200,180,0.65)", marginBottom:"8px" }}>· · · EVA · · ·</div>
                    <div className="orb" style={{ fontSize:"clamp(13px,1.9vw,20px)", fontWeight:900, color:"#60e8e0", textShadow:"0 0 20px rgba(0,220,200,0.6)", letterSpacing:"0.1em" }}>宇宙遊泳中</div>
                    <div className="stm" style={{ fontSize:"10px", color:"rgba(0,180,160,0.55)", marginTop:"8px", letterSpacing:"2px" }}>セッションをリセットしています</div>
                  </div>
                </>
              )}
            </div>

            {/* ── 右コラム：クルー管理 ── */}
            <div className="metal-dark" style={S.rightCol}>
              <div style={{ display:"flex", justifyContent:"space-between", padding:"0 4px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>

              {/* クルーヘッダー */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 6px", marginBottom:"8px" }}>
                <div className="orb" style={{ fontSize:"12px", fontWeight:700, color:"rgba(0,190,255,0.85)", letterSpacing:"3px", textShadow:"0 0 10px rgba(0,160,255,0.3)" }}>CREW</div>
                <div className="stm" style={{ fontSize:"10px", color:"rgba(0,160,220,0.6)", padding:"3px 8px", border:"1px solid rgba(0,100,180,0.35)", borderRadius:3, background:"rgba(0,8,24,0.6)" }}>{members.length} / ONLINE {Math.max(0, serverOnlineCount ?? 0)}</div>
              </div>

              {/* ステータス凡例 */}
              <div style={{ display:"flex", gap:"10px", padding:"4px 6px", marginBottom:"8px" }}>
                {([["#00e060","ONLINE"],["#4a6070","ASSIGNED"]] as [string,string][]).map(([col,lbl])=>(
                  <div key={lbl} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
                    <div style={{ width:7, height:7, borderRadius:"50%", background:col, boxShadow:`0 0 5px ${col}`, flexShrink:0 }} />
                    <div className="stm" style={{ fontSize:"8px", color:"rgba(120,170,210,0.7)", letterSpacing:"1px" }}>{lbl}</div>
                  </div>
                ))}
              </div>

              <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,140,220,0.4),transparent)", margin:"0 4px 8px" }} />

              {/* クルーリスト */}
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"6px", overflowY:"auto", minHeight:0, padding:"0 2px" }}>
                {members.map(m => {
                  const isOnlineEffective = effectiveOnlineIds.has(m.member_id);
                  const stCol = isOnlineEffective ? "#00e060" : "#4a6070";
                  return (
                  <div
                    key={m.member_id}
                    style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:6, background:"rgba(0,8,20,0.6)", border:`1px solid ${stCol}44`, boxShadow:`0 0 8px ${stCol}18` }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:"8px", minWidth:0 }}>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:stCol, boxShadow:`0 0 6px ${stCol}`, flexShrink:0 }} />
                      <div style={{ minWidth:0 }}>
                        <div className="stm" style={{ fontSize:"11px", color:"rgba(200,230,255,0.92)", letterSpacing:"1px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {m.name}
                        </div>
                        <div className="stm" style={{ fontSize:"8px", color:"rgba(120,170,210,0.7)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {m.email}
                        </div>
                      </div>
                    </div>
                    <div className="stm" style={{ fontSize:"8px", color:stCol, letterSpacing:"1.5px" }}>
                      {isOnlineEffective ? "ONLINE" : "ASSIGNED"} · {Math.floor((m.sum_time ?? 0) / 60)}m
                    </div>
                  </div>
                )})}
              </div>

              <div style={{ height:"1px", background:"linear-gradient(90deg,transparent,rgba(0,140,220,0.4),transparent)", margin:"8px 4px" }} />

              {/* クルー追加 */}
              <div style={{ display:"flex", gap:"6px", alignItems:"stretch", padding:"0 2px" }}>
                <input className="crew-input" placeholder="招待するメールアドレス" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { void handleInvite(); } }} style={{ fontSize:"11px", padding:"6px 10px" }} />
                <button className="crew-add-btn" onClick={() => void handleInvite()} style={{ fontSize:"11px", padding:"6px 12px" }}>招待</button>
              </div>

              <div style={{ display:"flex", justifyContent:"space-between", padding:"0 4px", marginTop:"8px" }}>
                <div className="bolt" /><div className="bolt" />
              </div>
            </div>

          </div>

          {/* ── ボトムパネル (3カラム構造に一致させて完全中央配置を実現) ── */}
          <div className="metal-frame" style={S.bottomPanel}>
            <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(0deg,transparent 0,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)", pointerEvents:"none", zIndex:0 }} />
            <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:"linear-gradient(90deg,transparent,rgba(0,180,255,0.35) 20%,rgba(0,220,255,0.55) 50%,rgba(0,180,255,0.35) 80%,transparent)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", top:"6px", left:0, right:0, display:"flex", justifyContent:"space-between", padding:"0 18px", pointerEvents:"none", zIndex:2 }}>
              {Array.from({length:12}).map((_,i) => <div key={i} className="bolt" />)}
            </div>
            <div style={{ position:"absolute", bottom:"5px", left:0, right:0, display:"flex", justifyContent:"space-between", padding:"0 18px", pointerEvents:"none", zIndex:2 }}>
              {Array.from({length:12}).map((_,i) => <div key={i} className="bolt" />)}
            </div>

            <div style={{ display:"flex", width:"100%", height:"100%", zIndex:1 }}>
              
              {/* ─ LEFT: 円形メーター + ダミー計器 (左コラム幅と一致) ─ */}
              <div style={{ width:"clamp(130px,13vw,190px)", flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", padding:"12px 10px", borderRight:"2px solid rgba(0,100,180,0.25)" }}>
                <div className="instrument glass-sheen" style={{ width:"100%", maxWidth:140, aspectRatio:"1/1", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  <svg style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", overflow:"visible" }} viewBox="0 0 160 160">
                    <defs>
                      <linearGradient id="arcG" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00c8ff" /><stop offset="50%" stopColor="#7050ff" /><stop offset="100%" stopColor="#ff4060" />
                      </linearGradient>
                      <filter id="glow2"><feGaussianBlur stdDeviation="2" result="b" /><feComposite in="SourceGraphic" in2="b" operator="over" /></filter>
                    </defs>
                    <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(0,60,120,0.4)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(270/360*2*Math.PI*60).toFixed(2)} ${(90/360*2*Math.PI*60).toFixed(2)}`} transform="rotate(135,80,80)" />
                    {progress > 0.001 && (
                      <circle cx="80" cy="80" r="60" fill="none" stroke="url(#arcG)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${(270/360*2*Math.PI*60*progress).toFixed(2)} ${(2*Math.PI*60-270/360*2*Math.PI*60*progress).toFixed(2)}`} transform="rotate(135,80,80)" filter="url(#glow2)" />
                    )}
                    {Array.from({length:26}).map((_,i) => {
                      const a=(135+i*(270/25))*Math.PI/180, maj=i%5===0, ir=maj?55:62;
                      return <line key={i} x1={80+ir*Math.cos(a)} y1={80+ir*Math.sin(a)} x2={80+68*Math.cos(a)} y2={80+68*Math.sin(a)} stroke={maj?"rgba(0,200,255,0.7)":"rgba(0,100,160,0.35)"} strokeWidth={maj?1.5:0.8} />;
                    })}
                    {[0,5,10,15,20,25].map(m => {
                      const a=(135+(m/25)*270)*Math.PI/180;
                      return <text key={m} x={80+46*Math.cos(a)} y={80+46*Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="rgba(0,180,255,0.55)" fontFamily="Courier New,monospace">{m}</text>;
                    })}
                    <g transform={`rotate(${135+progress*270},80,80)`} filter="url(#glow2)">
                      <line x1="80" y1="80" x2="80" y2="24" stroke="#00c8ff" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="80" y1="80" x2="80" y2="92" stroke="rgba(0,100,180,0.4)" strokeWidth="1" strokeLinecap="round" />
                    </g>
                    <circle cx="80" cy="80" r="6" fill="rgba(0,8,20,1)" stroke="rgba(0,160,255,0.5)" strokeWidth="1.5" />
                    <circle cx="80" cy="80" r="2.5" fill="#00c8ff" filter="url(#glow2)" />
                  </svg>
                  <div style={{ textAlign:"center", zIndex:1, marginTop:"15px" }}>
                    <div className="orb" style={{ fontSize:"clamp(12px,1.5vw,16px)", fontWeight:900, color:"#fff", textShadow:"0 0 14px rgba(255,255,255,0.35)", lineHeight:1 }}>{fmt(timeLeft)}</div>
                    <div className="stm" style={{ fontSize:"7px", letterSpacing:"2px", marginTop:"3px", color:isRunning ? "rgba(0,210,255,0.85)" : isPausing ? "rgba(0,220,200,0.85)" : "rgba(60,90,120,0.7)" }}>
                      {isPausing ? "EVA" : warpPhase==="spinup" ? "SPINUP" : isRunning ? "WARP" : "IDLE"}
                    </div>
                  </div>
                </div>

                {/* システム情報 */}
                <div style={{ width:"100%", marginTop:"auto", display:"flex", flexDirection:"column", gap:"8px", padding:"0 4px" }}>
                  <div className="instrument" style={{ padding:"6px 8px", borderRadius:"4px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span className="stm" style={{ fontSize:"7px", color:"rgba(0,160,255,0.5)", letterSpacing:"1px" }}>ENGINE</span>
                    <span className="orb" style={{ fontSize:"9px", color:"#00e060" }}>ONLINE</span>
                  </div>
                  <div className="instrument" style={{ padding:"6px 8px", borderRadius:"4px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span className="stm" style={{ fontSize:"7px", color:"rgba(0,160,255,0.5)", letterSpacing:"1px" }}>SHIELD</span>
                    <span className="orb" style={{ fontSize:"9px", color:"#00e060" }}>ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* ─ CENTER: メインコントロールとサブモニター (ウィンドウ幅と一致) ─ */}
              <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 14px", position:"relative", gap:"clamp(20px, 3vw, 40px)" }}>
                
                {/* メインコントロールボタン */}
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"10px", zIndex:2 }}>
                  <div className="stm" style={{ fontSize:"9px", color:"rgba(0,160,255,0.4)", letterSpacing:"6px", marginBottom:"4px" }}>MAIN CONTROL</div>
                  {(!isRunning && warpPhase==="idle") && (
                    <button onClick={handleStartWork} className="ign-btn orb" style={{ padding:"clamp(16px,2vh,22px) clamp(40px,5vw,80px)", borderRadius:"12px", background:"linear-gradient(160deg,#0d7ec4,#0a5a96,#073d6e)", border:"2px solid rgba(100,200,255,0.5)", color:"#fff", fontWeight:900, fontSize:"clamp(18px,2.2vw,26px)", letterSpacing:"6px", cursor:"pointer", fontFamily:"Orbitron,monospace", boxShadow:"0 4px 20px rgba(0,120,220,0.3)" }}>START</button>
                  )}
                  {warpPhase==="spinup" && (
                    <div className="stm" style={{ fontSize:"clamp(14px,1.8vw,20px)", letterSpacing:"6px", color:"#40c8ff", textShadow:"0 0 16px rgba(0,200,255,0.9)" }}>SPIN UP...</div>
                  )}
                  {isRunning && (
                    <div style={{ position:"relative" }}>
                      <div style={{ position:"absolute", top:"-8px", left:"-8px", right:"-8px", bottom:"-8px", borderRadius:"18px", background:"rgba(0,160,140,0.2)", filter:"blur(12px)", animation:"pulseGlow 1.2s ease-in-out infinite" }} />
                      <button onClick={handlePause} disabled={isPausing} className="eva-btn orb" style={{ position:"relative", padding:"clamp(16px,2vh,22px) clamp(40px,5vw,80px)", borderRadius:"12px", background:"linear-gradient(160deg,#0a5a54,#074840,#04302c)", border:"2px solid rgba(0,200,180,0.5)", color:"#fff", fontWeight:900, fontSize:"clamp(18px,2.2vw,26px)", letterSpacing:"6px", cursor:isPausing?"not-allowed":"pointer", opacity:isPausing?0.5:1, fontFamily:"Orbitron,monospace", boxShadow:"0 4px 20px rgba(0,180,160,0.3)" }}>
                        STOP
                        <span style={{ display:"block", fontSize:"clamp(10px,1.2vw,13px)", opacity:0.65, letterSpacing:"3px", marginTop:"4px", fontFamily:"Share Tech Mono,monospace", fontWeight:400 }}></span>
                      </button>
                    </div>
                  )}
                  {isPausing && <div className="stm pulse" style={{ fontSize:"clamp(13px,1.6vw,16px)", color:"#40e8e0", letterSpacing:"4px", marginTop:"6px" }}></div>}
                  {apiError && (
                    <div className="stm" style={{ marginTop:"10px", maxWidth:320, textAlign:"center", color:"#ff6f6f", fontSize:"10px", letterSpacing:"1px" }}>
                      {apiError}
                    </div>
                  )}
                </div>

                {/* ランドマーク通過サブモニター */}
                <div className="instrument" style={{ 
                  borderRadius:"8px", 
                  padding:"12px 16px", 
                  minWidth:280,
                  maxWidth:360,
                  height:140,
                  display:"flex", 
                  flexDirection:"column",
                  background:"radial-gradient(ellipse at 35% 30%, rgba(0,30,20,0.95), rgba(0,10,8,0.98))",
                  border:"1px solid rgba(0,180,100,0.4)",
                  boxShadow:"inset 0 0 25px rgba(0,0,0,0.9), 0 0 15px rgba(0,140,80,0.25)",
                  position:"relative",
                  overflow:"hidden"
                }}>
                  {/* CRT スキャンライン エフェクト */}
                  <div style={{ 
                    position:"absolute", 
                    inset:0, 
                    backgroundImage:"repeating-linear-gradient(0deg, rgba(0,255,100,0.03) 0px, rgba(0,255,100,0.03) 1px, transparent 1px, transparent 2px)",
                    pointerEvents:"none",
                    zIndex:1
                  }} />
                  {/* スキャニングライン */}
                  <div style={{ 
                    position:"absolute", 
                    inset:0, 
                    background:"linear-gradient(180deg, transparent 0%, rgba(0,255,100,0.15) 50%, transparent 100%)",
                    animation:"scanline 4s linear infinite",
                    pointerEvents:"none",
                    zIndex:2
                  }} />
                  {/* CRTフリッカー */}
                  <div style={{ 
                    position:"absolute", 
                    inset:0, 
                    background:"rgba(0,255,100,0.02)",
                    animation:"crtFlicker 0.15s infinite",
                    pointerEvents:"none",
                    zIndex:3
                  }} />
                  
                  <div className="stm" style={{ 
                    fontSize:"8px", 
                    color:"rgba(0,255,100,0.5)", 
                    letterSpacing:"3px", 
                    marginBottom:"8px",
                    position:"relative",
                    zIndex:4,
                    textAlign:"center"
                  }}>
                    LANDMARK MONITOR
                  </div>
                  
                  <div style={{ 
                    flex:1, 
                    display:"flex", 
                    flexDirection:"column", 
                    justifyContent:"center",
                    alignItems:"center",
                    position:"relative",
                    zIndex:4
                  }}>
                    {currentEvent ? (
                      <div style={{ 
                        width:"100%",
                        animation:"slideInFromRight 0.5s ease-out"
                      }}>
                        {/* 惑星アイコン */}
                        <div style={{ 
                          width: 42, 
                          height: 42, 
                          borderRadius: "50%", 
                          background: "radial-gradient(circle at 30% 30%, #60ff80, #00a040, #003020)", 
                          boxShadow: "inset -5px -5px 10px rgba(0,0,0,0.8), 0 0 15px rgba(0,255,100,0.6)", 
                          margin: "0 auto 10px"
                        }} />
                        
                        {/* 「○○を通過」テキスト */}
                        <div className="orb" style={{ 
                          fontSize:"clamp(14px,1.6vw,18px)", 
                          fontWeight:900, 
                          color:"#80ffb0", 
                          textShadow:"0 0 12px rgba(0,255,100,0.9)",
                          marginBottom:"8px",
                          textAlign:"center",
                          lineHeight:1.3,
                          letterSpacing:"1px"
                        }}>
                          {currentEvent.name} を通過
                        </div>
                        
                        {/* メッセージ */}
                        <div className="stm" style={{ 
                          fontSize:"clamp(10px,1.15vw,12px)", 
                          color:"rgba(120,255,170,0.9)", 
                          textAlign:"center",
                          lineHeight:1.5,
                          letterSpacing:"0.8px"
                        }}>
                          {currentEvent.msg}
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign:"center" }}>
                        <div className="stm pulse" style={{ 
                          fontSize:"clamp(11px,1.3vw,14px)", 
                          color:"rgba(0,200,100,0.5)", 
                          letterSpacing:"3px",
                          marginBottom:"6px"
                        }}>
                          SCANNING...
                        </div>
                        <div className="stm" style={{ 
                          fontSize:"10px", 
                          color:"rgba(0,150,80,0.4)", 
                          letterSpacing:"2px"
                        }}>
                          待機中
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="console-ridge" style={{ position:"absolute", bottom:"10px", left:"20px", right:"20px", borderRadius:"4px", padding:"6px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div className="stm" style={{ fontSize:"8px", color:"rgba(0,120,180,0.55)", letterSpacing:"3px" }}>
                    STATUS: <span style={{ color: isRunning?"#00e060":isPausing?"#40e8e0":"rgba(0,100,150,0.7)", fontWeight:700 }}>
                      {isRunning?"WARP ACTIVE":isPausing?"EVA":"STANDBY"}
                    </span>
                  </div>
                  <div className="stm" style={{ fontSize:"8px", color:"rgba(0,140,200,0.6)", letterSpacing:"2px" }}>
                    DIST: <span style={{ color:"rgba(0,180,255,0.85)", fontWeight:700 }}>{distance.toLocaleString(undefined, {maximumFractionDigits:2})} LY</span>
                  </div>
                </div>
              </div>

              {/* ─ RIGHT: システム情報 ─ */}
              <div style={{ width:"clamp(130px,13vw,190px)", flexShrink:0, display:"flex", flexDirection:"column", padding:"12px 10px", borderLeft:"2px solid rgba(0,100,180,0.25)" }}>
                <div className="stm" style={{ fontSize:"8px", color:"rgba(0,160,255,0.5)", letterSpacing:"2px", marginBottom:"10px", textAlign:"center", borderBottom:"1px solid rgba(0,160,255,0.2)", paddingBottom:"4px" }}>SYSTEM</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px", flex:1 }}>
                  <div className="instrument" style={{ padding:"8px", borderRadius:"4px", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                    <span className="stm" style={{ fontSize:"7px", color:"rgba(0,160,255,0.5)", letterSpacing:"1px" }}>SYS POWER</span>
                    <span className="orb" style={{ fontSize:"11px", color:"#00c8ff", fontWeight:700 }}>98%</span>
                    <div style={{ width:"100%", height:"3px", background:"rgba(0,20,50,0.7)", borderRadius:"2px", marginTop:"2px" }}>
                      <div style={{ width:"98%", height:"100%", background:"#00c8ff", boxShadow:"0 0 4px #00c8ff" }}/>
                    </div>
                  </div>
                  <div className="instrument" style={{ padding:"8px", borderRadius:"4px", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                    <span className="stm" style={{ fontSize:"7px", color:"rgba(0,160,255,0.5)", letterSpacing:"1px" }}>GRAVITY</span>
                    <span className="orb" style={{ fontSize:"11px", color:"#00e060", fontWeight:700 }}>1.0G</span>
                  </div>
                  <div style={{ marginTop:"auto", height:"28px", background:"repeating-linear-gradient(90deg, rgba(0,160,255,0.1) 0px, rgba(0,160,255,0.1) 2px, transparent 2px, transparent 4px)", border:"1px solid rgba(0,160,255,0.2)", borderRadius:"2px", position:"relative" }}>
                    <div style={{ position:"absolute", top:0, bottom:0, width:"50%", background:"linear-gradient(90deg, transparent, rgba(0,200,255,0.4), transparent)", animation:"pulseGlow 2s infinite" }} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

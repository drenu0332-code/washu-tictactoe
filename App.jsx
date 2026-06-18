import { useState, useEffect, useRef, useCallback } from "react";

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (let [a,b,c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: "draw", line: [] };
  return null;
}

function minimax(board, isMaximizing, depth) {
  const result = checkWinner(board);
  if (result) {
    if (result.winner === "O") return 10 - depth;
    if (result.winner === "X") return depth - 10;
    return 0;
  }
  const moves = board.map((v, i) => v ? null : i).filter(i => i !== null);
  if (moves.length === 0) return 0;
  if (isMaximizing) {
    let best = -Infinity;
    for (let i of moves) {
      board[i] = "O";
      best = Math.max(best, minimax(board, false, depth + 1));
      board[i] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (let i of moves) {
      board[i] = "X";
      best = Math.min(best, minimax(board, true, depth + 1));
      board[i] = null;
    }
    return best;
  }
}

function getAIMove(board) {
  const moves = board.map((v, i) => v ? null : i).filter(i => i !== null);
  if (moves.length === 0) return -1;
  let bestVal = -Infinity, bestMove = moves[0];
  for (let i of moves) {
    board[i] = "O";
    const val = minimax(board, false, 0);
    board[i] = null;
    if (val > bestVal) { bestVal = val; bestMove = i; }
  }
  return bestMove;
}

// Sound helper
function playSound(src) {
  try {
    const audio = new Audio(src);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch(e) {}
}

// Particle component
function Particles() {
  const particles = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${4 + Math.random() * 8}px`,
    duration: `${6 + Math.random() * 12}s`,
    delay: `${Math.random() * 8}s`,
    color: i % 3 === 0 ? "#b16eff" : i % 3 === 1 ? "#4fc3f7" : "#f472b6",
    top: `${Math.random() * 100}%`,
  }));

  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { opacity: 0.4; transform: translateY(-60px) scale(1.2); }
          100% { transform: translateY(-130px) scale(0.7); opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.18; transform: scale(1); }
          50% { opacity: 0.32; transform: scale(1.08); }
        }
        @keyframes cellPop {
          0% { transform: scale(0.4) rotate(-10deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(3deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes bgShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes glowOrb {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.25; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.4; }
        }
        @keyframes winPulse {
          0%, 100% { box-shadow: 0 0 18px #b16eff, 0 0 40px #b16eff55; }
          50% { box-shadow: 0 0 36px #f472b6, 0 0 70px #f472b688; }
        }
        @keyframes btnHoverGlow {
          0%, 100% { box-shadow: 0 0 14px #7c3aed88; }
          50% { box-shadow: 0 0 28px #a855f7cc; }
        }
        @keyframes thinkingPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      {/* Glowing orbs */}
      <div style={{
        position: "absolute", top: "20%", left: "15%",
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, #7c3aed55, transparent 70%)",
        animation: "glowOrb 7s ease-in-out infinite",
        transform: "translate(-50%, -50%)",
      }} />
      <div style={{
        position: "absolute", top: "70%", left: "80%",
        width: 220, height: 220, borderRadius: "50%",
        background: "radial-gradient(circle, #db277755, transparent 70%)",
        animation: "glowOrb 9s ease-in-out infinite 2s",
        transform: "translate(-50%, -50%)",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, #1e40af33, transparent 70%)",
        animation: "glowOrb 11s ease-in-out infinite 4s",
        transform: "translate(-50%, -50%)",
      }} />
      {/* Floating particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: p.left, top: p.top,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: p.color,
          boxShadow: `0 0 8px ${p.color}`,
          animation: `floatUp ${p.duration} ${p.delay} ease-in-out infinite`,
          opacity: 0.7,
        }} />
      ))}
    </div>
  );
}

// Confetti component
function Confetti({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 38 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    color: ["#b16eff","#f472b6","#4fc3f7","#fbbf24","#34d399","#f87171"][i % 6],
    size: `${7 + Math.random() * 9}px`,
    duration: `${1.8 + Math.random() * 1.5}s`,
    delay: `${Math.random() * 0.7}s`,
    shape: i % 3 === 0 ? "50%" : "2px",
  }));
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: -20,
          left: p.left, width: p.size, height: p.size,
          background: p.color, borderRadius: p.shape,
          animation: `confettiFall ${p.duration} ${p.delay} ease-in forwards`,
          boxShadow: `0 0 6px ${p.color}`,
        }} />
      ))}
    </div>
  );
}

const THEMES = {
  X: { color: "#a78bfa" },
  O: { color: "#f472b6" },
};

export default function App() {
  const [mode, setMode] = useState(null);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [result, setResult] = useState(null);
  const [thinking, setThinking] = useState(false);
  const [newCells, setNewCells] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const aiScheduled = useRef(false);

  const triggerConfetti = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  useEffect(() => {
    const isAITurn = mode === "ai" && !xIsNext && !result;
    if (!isAITurn || aiScheduled.current) return;
    aiScheduled.current = true;
    setThinking(true);
    const timer = setTimeout(() => {
      setBoard(prev => {
        const newBoard = [...prev];
        const move = getAIMove(newBoard);
        if (move === -1) { aiScheduled.current = false; setThinking(false); return prev; }
        newBoard[move] = "O";
        playSound("/sounds/ai.mp3");
        setNewCells(nc => ({ ...nc, [move]: true }));
        setTimeout(() => setNewCells(nc => { const n = {...nc}; delete n[move]; return n; }), 400);
        const res = checkWinner(newBoard);
        if (res) {
          setResult(res);
          setScores(s => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
          if (res.winner !== "draw") { playSound("/sounds/win.mp3"); triggerConfetti(); }
          else playSound("/sounds/draw.mp3");
        } else {
          setXIsNext(true);
        }
        aiScheduled.current = false;
        setThinking(false);
        return newBoard;
      });
    }, 650);
    return () => { clearTimeout(timer); aiScheduled.current = false; setThinking(false); };
  }, [mode, xIsNext, result, triggerConfetti]);

  function handleClick(i) {
    if (board[i] || result || thinking || (mode === "ai" && !xIsNext)) return;
    playSound("/sounds/move.mp3");
    const newBoard = [...board];
    const player = xIsNext ? "X" : "O";
    newBoard[i] = player;
    setNewCells(nc => ({ ...nc, [i]: true }));
    setTimeout(() => setNewCells(nc => { const n = {...nc}; delete n[i]; return n; }), 400);
    setBoard(newBoard);
    const res = checkWinner(newBoard);
    if (res) {
      setResult(res);
      setScores(s => ({ ...s, [res.winner]: (s[res.winner] || 0) + 1 }));
      if (res.winner !== "draw") { playSound("/sounds/win.mp3"); triggerConfetti(); }
      else playSound("/sounds/draw.mp3");
    } else {
      setXIsNext(p => !p);
    }
  }

  function reset() {
    playSound("/sounds/click.mp3");
    aiScheduled.current = false;
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setResult(null);
    setThinking(false);
    setNewCells({});
    setShowConfetti(false);
  }

  function backToMenu() {
    playSound("/sounds/click.mp3");
    reset();
    setMode(null);
    setScores({ X: 0, O: 0, draw: 0 });
  }

  function startMode(m) {
    playSound("/sounds/click.mp3");
    setMode(m);
  }

  const winLine = result?.line || [];
  const currentPlayer = xIsNext ? "X" : "O";

  const statusText = result
    ? result.winner === "draw"
      ? "It's a Draw! 🤝"
      : result.winner === "O" && mode === "ai"
        ? "AI Wins! 🤖"
        : `Player ${result.winner} Wins! 🎉`
    : thinking
      ? "AI is thinking... 🤔"
      : mode === "ai"
        ? "Your turn ✕"
        : `Player ${currentPlayer}'s turn`;

  const statusGradient = result
    ? result.winner === "draw"
      ? "linear-gradient(90deg, #374151, #4b5563)"
      : result.winner === "X"
        ? "linear-gradient(90deg, #5b21b6, #7c3aed)"
        : "linear-gradient(90deg, #9d174d, #db2777)"
    : thinking
      ? "linear-gradient(90deg, #1e3a5f, #1e40af)"
      : "linear-gradient(90deg, #1a103a, #2d1b69)";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #07030f 0%, #0d0720 40%, #0a0418 70%, #0c0a1e 100%)",
      backgroundSize: "400% 400%",
      animation: "bgShift 12s ease infinite",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: "16px",
      position: "relative",
      overflow: "hidden",
    }}>
      <Particles />
      <Confetti active={showConfetti} />

      {/* Giant WASHU watermark */}
      <div style={{
        position: "fixed", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 1,
      }}>
        <div style={{
          fontSize: "clamp(80px, 22vw, 200px)",
          fontWeight: 900,
          letterSpacing: "-4px",
          color: "transparent",
          WebkitTextStroke: "1px rgba(167,139,250,0.09)",
          background: "linear-gradient(135deg, rgba(167,139,250,0.07), rgba(244,114,182,0.05), rgba(79,195,247,0.07))",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          userSelect: "none",
          lineHeight: 1,
          transform: "rotate(-8deg)",
          whiteSpace: "nowrap",
        }}>WASHU</div>
      </div>

      {!mode ? (
        /* MENU SCREEN */
        <div style={{
          position: "relative", zIndex: 2,
          background: "rgba(15, 8, 40, 0.82)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "28px",
          padding: "38px 28px 32px",
          width: "100%", maxWidth: "370px",
          border: "1px solid rgba(167,139,250,0.22)",
          boxShadow: "0 0 60px rgba(109,40,217,0.25), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "slideUp 0.5s ease both",
        }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 4 }}>
              <span style={{
                fontSize: 34, fontWeight: 900, color: "#a78bfa",
                textShadow: "0 0 18px #7c3aed, 0 0 40px #7c3aed88",
              }}>✕</span>
              <div>
                <div style={{
                  fontSize: "clamp(16px, 4.5vw, 22px)", fontWeight: 900, color: "#fff",
                  letterSpacing: "-0.3px", lineHeight: 1.1,
                  textShadow: "0 0 20px rgba(167,139,250,0.5)",
                }}>Washu Tic Tac Toe Pro</div>
              </div>
              <span style={{
                fontSize: 34, fontWeight: 900, color: "#f472b6",
                textShadow: "0 0 18px #db2777, 0 0 40px #db277788",
              }}>○</span>
            </div>
            <div style={{
              fontSize: 11, color: "#7c3aed", fontWeight: 600,
              letterSpacing: "2px", textTransform: "uppercase",
              marginBottom: 6,
            }}>Powered by Washu Games</div>
          </div>

          {/* AI Badge */}
          <div style={{
            background: "linear-gradient(135deg, rgba(109,40,217,0.3), rgba(219,39,119,0.2))",
            border: "1px solid rgba(167,139,250,0.3)",
            borderRadius: 14, padding: "10px 16px",
            textAlign: "center", marginBottom: 22,
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#a78bfa", marginBottom: 2 }}>🤖 IMPOSSIBLE AI</div>
            <div style={{ fontSize: 11, color: "#9ca3af", letterSpacing: "1px", textTransform: "uppercase" }}>Perfect Strategy Mode</div>
          </div>

          <p style={{ textAlign: "center", color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>Choose your game mode</p>

          <button
            style={{
              display: "block", width: "100%", padding: "16px",
              borderRadius: 16, border: "1px solid rgba(124,58,237,0.5)",
              background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
              color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer",
              marginBottom: 12, letterSpacing: "0.3px",
              boxShadow: "0 0 24px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onClick={() => startMode("ai")}
          >🤖 Play vs AI</button>

          <button
            style={{
              display: "block", width: "100%", padding: "16px",
              borderRadius: 16, border: "1px solid rgba(219,39,119,0.5)",
              background: "linear-gradient(135deg, #9d174d, #db2777)",
              color: "#fff", fontSize: 17, fontWeight: 700, cursor: "pointer",
              marginBottom: 24, letterSpacing: "0.3px",
              boxShadow: "0 0 24px rgba(219,39,119,0.4), 0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onClick={() => startMode("friend")}
          >👥 Play vs Friend</button>

          <div style={{ textAlign: "center", color: "#374151", fontSize: 11, letterSpacing: "0.5px" }}>
            Made by Washu
          </div>
        </div>
      ) : (
        /* GAME SCREEN */
        <div style={{
          position: "relative", zIndex: 2,
          background: "rgba(15, 8, 40, 0.85)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "28px",
          padding: "24px 20px 20px",
          width: "100%", maxWidth: "390px",
          border: "1px solid rgba(167,139,250,0.2)",
          boxShadow: "0 0 60px rgba(109,40,217,0.2), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          animation: "slideUp 0.4s ease both",
        }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ color: "#a78bfa", fontSize: 20, fontWeight: 900, textShadow: "0 0 12px #7c3aed" }}>✕</span>
            <span style={{ fontSize: "clamp(14px, 4vw, 18px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
              Washu Tic Tac Toe Pro
            </span>
            <span style={{ color: "#f472b6", fontSize: 20, fontWeight: 900, textShadow: "0 0 12px #db2777" }}>○</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 10, color: "#7c3aed", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 14 }}>
            Powered by Washu Games
          </div>

          {/* Score */}
          <div style={{
            display: "flex", justifyContent: "space-around",
            background: "rgba(255,255,255,0.03)", borderRadius: 16,
            padding: "12px 8px", marginBottom: 14,
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ color: "#a78bfa", fontWeight: 800, fontSize: 15, textShadow: "0 0 10px #7c3aed" }}>✕</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{scores.X}</span>
              <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {mode === "ai" ? "You" : "P1"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ color: "#4b5563", fontWeight: 700, fontSize: 14 }}>—</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{scores.draw}</span>
              <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Draw</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span style={{ color: "#f472b6", fontWeight: 800, fontSize: 15, textShadow: "0 0 10px #db2777" }}>○</span>
              <span style={{ fontSize: 28, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{scores.O}</span>
              <span style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {mode === "ai" ? "AI" : "P2"}
              </span>
            </div>
          </div>

          {/* Status */}
          <div style={{
            textAlign: "center", color: "#fff", fontSize: 14, fontWeight: 700,
            padding: "10px 16px", borderRadius: 12, marginBottom: 16,
            background: statusGradient,
            border: "1px solid rgba(167,139,250,0.15)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
            letterSpacing: "0.3px",
            animation: thinking ? "thinkingPulse 1s ease-in-out infinite" : "none",
          }}>
            {statusText}
          </div>

          {/* Board */}
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8, marginBottom: 16,
            padding: 10,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 20,
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            {board.map((val, i) => {
              const isWin = winLine.includes(i);
              const isNew = newCells[i];
              return (
                <button
                  key={i}
                  onClick={() => handleClick(i)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 14,
                    fontWeight: 900,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: val ? "clamp(34px, 9vw, 44px)" : "22px",
                    color: val ? THEMES[val].color : "rgba(255,255,255,0.1)",
                    background: isWin
                      ? val === "X"
                        ? "rgba(124,58,237,0.18)"
                        : "rgba(219,39,119,0.18)"
                      : val
                        ? "rgba(255,255,255,0.04)"
                        : "rgba(255,255,255,0.025)",
                    border: isWin
                      ? `1.5px solid ${THEMES[val]?.color}`
                      : val
                        ? `1.5px solid rgba(167,139,250,0.15)`
                        : "1.5px solid rgba(255,255,255,0.06)",
                    boxShadow: isWin
                      ? `0 0 22px ${THEMES[val]?.color}88, 0 0 50px ${THEMES[val]?.color}44`
                      : "0 2px 8px rgba(0,0,0,0.4)",
                    cursor: val || result || thinking || (mode === "ai" && !xIsNext) ? "default" : "pointer",
                    transition: "all 0.2s ease",
                    animation: isNew ? "cellPop 0.35s cubic-bezier(.34,1.56,.64,1) both" : isWin ? "winPulse 1.2s ease-in-out infinite" : "none",
                    textShadow: val ? `0 0 16px ${THEMES[val]?.color}` : "none",
                  }}
                >
                  {val || "·"}
                </button>
              );
            })}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button
              style={{
                flex: 1, padding: "12px", borderRadius: 14,
                background: "linear-gradient(135deg, #5b21b6, #7c3aed)",
                color: "#fff", border: "1px solid rgba(124,58,237,0.5)",
                fontWeight: 700, fontSize: 13, cursor: "pointer",
                boxShadow: "0 0 18px rgba(124,58,237,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              onClick={reset}
            >🔄 New Game</button>
            <button
              style={{
                flex: 1, padding: "12px", borderRadius: 14,
                background: "rgba(255,255,255,0.04)",
                color: "#9ca3af",
                border: "1px solid rgba(255,255,255,0.1)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#9ca3af"; }}
              onClick={backToMenu}
            >🏠 Menu</button>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 11, color: "#374151" }}>Made by Washu</div>
            <div style={{
              fontSize: 11, color: "#6b7280",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8, padding: "3px 8px",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              {mode === "ai" ? "🤖 vs AI" : "👥 2 Players"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./FlashcardArtikel.css";

const GENDER_STYLE = {
  der: {
    shape: "square",
    color: "#D7263D",
    label: "der",
  },
  die: {
    shape: "circle",
    color: "#1B3B6F",
    label: "die",
  },
  das: {
    shape: "triangle",
    color: "#F4B400",
    label: "das",
  },
};

function shuffleArray(array) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

function GenderShape({ gender, size = 70 }) {
  const style = GENDER_STYLE[gender];

  if (!style) return null;

  if (style.shape === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          fill={style.color}
          rx="8"
        />
      </svg>
    );
  }

  if (style.shape === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill={style.color}
        />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points="50,5 95,90 5,90"
        fill={style.color}
      />
    </svg>
  );
}

function useConfetti(canvasRef) {
  const animation = useRef(null);

  const fire = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = [
      "#D7263D",
      "#1B3B6F",
      "#F4B400",
      "#1E8E5A"
    ];

    const shapes = [
      "square",
      "circle",
      "triangle"
    ];

    const particles = Array.from(
      { length: 70 },
      () => ({
        x: canvas.width / 2,
        y: 80,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - .5) * 12,
        speedY: Math.random() * -10 - 4,
        gravity: .3,
        rotation: Math.random() * 6,
        rotationSpeed: (Math.random() - .5) * .2,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)]
      })
    );

    function animate() {
      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      let active = false;

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += p.gravity;
        p.rotation += p.rotationSpeed;

        if (p.y < canvas.height) {
          active = true;

          ctx.save();
          ctx.translate(
            p.x,
            p.y
          );
          ctx.rotate(
            p.rotation
          );

          ctx.fillStyle = p.color;

          if (p.shape === "square") {
            ctx.fillRect(
              -p.size / 2,
              -p.size / 2,
              p.size,
              p.size
            );
          }

          if (p.shape === "circle") {
            ctx.beginPath();
            ctx.arc(
              0,
              0,
              p.size / 2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          if (p.shape === "triangle") {
            ctx.beginPath();
            ctx.moveTo(
              0,
              -p.size
            );
            ctx.lineTo(
              p.size,
              p.size
            );
            ctx.lineTo(
              -p.size,
              p.size
            );
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      });

      if (active) {
        animation.current = requestAnimationFrame(animate);
      }
    }

    animate();
  }, []);

  useEffect(() => {
    return () => {
      if (animation.current) {
        cancelAnimationFrame(animation.current);
      }
    };
  }, []);

  return fire;
}

export default function FlashcardArtikel({ words = [] }) {
  const deck = useMemo(() => {
    return shuffleArray(words);
  }, [words]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [flipped, setFlipped] = useState(false);

  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const fireConfetti = useConfetti(canvasRef);

  const current = deck[index];

  // Se remueve el focus() automático al cambiar de índice
  // para evitar que el teclado vuelva a aparecer en móviles al avanzar de tarjeta.
  useEffect(() => {}, [index]);

  function nextCard() {
    setInput("");
    setStatus("idle");
    setFlipped(false);

    setIndex(prev =>
      prev + 1 >= deck.length
        ? 0
        : prev + 1
    );
  }

function checkAnswer(e) {
    e.preventDefault();

    // 1. Quita el foco del input inmediatamente
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // 2. Espera a que el teclado se recoja por completo y fuerza el centrado visual
    setTimeout(() => {
      // Fuerza el reseteo del scroll en la ventana
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;

      // Centra la app de nuevo en el viewport del móvil
      const appElem = document.querySelector(".artikel-app");
      if (appElem) {
        appElem.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 100);

    const correct =
      input.trim().toLowerCase() === current.artikel.toLowerCase();

    setStatus(correct ? "correct" : "incorrect");
    setFlipped(true);

    if (correct) {
      fireConfetti();
    }

    setTimeout(nextCard, correct ? 1500 : 2200);
  }

  if (!current) {
    return (
      <div className="empty-state">
        No hay palabras cargadas
      </div>
    );
  }

  return (
    <div className="artikel-app">
      <div className="topbar">
        <h1>
          ARTIKEL TRAINING
        </h1>
        <span>
          {index + 1}/{deck.length}
        </span>
      </div>

      <div className="card-area">
        <canvas
          ref={canvasRef}
          className="confetti"
        />

        <div className={`card ${flipped ? "flip" : ""}`}>
          <div className="face front">
            <small>
              Welcher Artikel?
            </small>

            <h2>
              {current.nomen}
            </h2>

            <p>
              {current.espanol}
            </p>

            <form onSubmit={checkAnswer}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="der / die / das"
              />

              <button type="submit">
                Comprobar
              </button>
            </form>
          </div>

          <div className={`face back ${status}`}>
            <GenderShape gender={current.artikel} />

            <h2>
              {status === "correct" ? "Richtig! 🎉" : "Falsch"}
            </h2>

            <h3>
              {current.palabra_completa}
            </h3>

            <p>
              {current.espanol}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
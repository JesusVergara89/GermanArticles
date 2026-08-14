import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "./FlashcardArtikel.css";
import BuyMeCoffee from "./BuyMeCoffee";
import Myself from "./Myself";

const GENDER_STYLE = {
  ein: {
    shape: "square",
    color: "#D7263D",
    label: "ein",
  },
  eine: {
    shape: "circle",
    color: "#1B3B6F",
    label: "eine",
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

  return null;
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
      "#1E8E5A",
    ];

    const shapes = [
      "square",
      "circle",
      "triangle",
    ];

    const particles = Array.from(
      { length: 70 },
      () => ({
        x: canvas.width / 2,
        y: 80,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 12,
        speedY: Math.random() * -10 - 4,
        gravity: 0.3,
        rotation: Math.random() * 6,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color:
          colors[
            Math.floor(
              Math.random() * colors.length
            )
          ],
        shape:
          shapes[
            Math.floor(
              Math.random() * shapes.length
            )
          ],
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

      particles.forEach((p) => {
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
        animation.current =
          requestAnimationFrame(
            animate
          );
      }
    }

    animate();
  }, []);

  useEffect(() => {
    return () => {
      if (animation.current) {
        cancelAnimationFrame(
          animation.current
        );
      }
    };
  }, []);

  return fire;
}

function ArticulosIndefinidos({ dativ = [] }) {
  const deck = useMemo(() => {
    return shuffleArray(dativ);
  }, [dativ]);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [flipped, setFlipped] = useState(false);

  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const fireConfetti =
    useConfetti(canvasRef);

  const current = deck[index];

  function nextCard() {
    setInput("");
    setStatus("idle");
    setFlipped(false);

    setIndex((prev) =>
      prev + 1 >= deck.length
        ? 0
        : prev + 1
    );
  }

  function checkAnswer(e) {
    e.preventDefault();

    const normalized =
      input.trim().toLowerCase();

    const isValid =
      /^(ein|eine)$/.test(
        normalized
      );

    if (!isValid) {
      alert(
        "Solo puedes escribir: ein o eine"
      );
      return;
    }

    if (inputRef.current) {
      inputRef.current.blur();
    }

    const correct =
      normalized ===
      current.artikel.toLowerCase();

    setStatus(
      correct
        ? "correct"
        : "incorrect"
    );

    setFlipped(true);

    if (correct) {
      fireConfetti();
    }

    setTimeout(
      nextCard,
      correct ? 1500 : 2200
    );
  }

  if (!current) {
    return (
      <div className="app-container">
        <h1>Artículos indefinidos</h1>

        <div className="empty-state">
          No hay palabras cargadas
        </div>
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

        <div
          className={`card ${
            flipped ? "flip" : ""
          }`}
        >

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
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                placeholder="ein / eine"
              />

              <button type="submit">
                Comprobar
              </button>

            </form>

          </div>

          <div
            className={`face back ${
              status
            }`}
          >

            <GenderShape
              gender={
                current.artikel
              }
            />

            <h2>
              {status === "correct"
                ? "Richtig! 🎉"
                : "Falsch"}
            </h2>

            <h3>
              <span>{current.artikel_definido}</span> <span>{current.nomen}</span>
            </h3>

            <p>
              {current.espanol}
            </p>

          </div>

        </div>
      </div>


      <BuyMeCoffee />

      <Myself />
    </div>
  );
}

export default ArticulosIndefinidos;
import { useState, useEffect, useRef, useCallback } from "react";

// ── Paleta de colores de la app Android ──────────────────────────────────────
const C = {
  morado:      "#7B61FF",
  moradoClaro: "#A084E8",
  moradoSplash:"#6C63FF",
  verde:       "#009688",
  azulOscuro:  "#1A1A2E",
  rojo:        "#E53935",
  naranja:     "#FF7043",
  gris:        "#F5F5F5",
  blanco:      "#FFFFFF",
  texto:       "#555555",
};

// ── URL del backend (reemplazar con la URL real de Render) 
const BACKEND_URL = "https://url-de-render.onrender.com";


// COMPONENTE: Waveform animado
function Waveform({ activo }) {
  const bars = 32;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 3, height: 80, padding: "0 16px"
    }}>
      {Array.from({ length: bars }).map((_, i) => (
        <div key={i} style={{
          width: 4, borderRadius: 4,
          background: `linear-gradient(180deg, ${C.morado}, ${C.moradoClaro})`,
          height: activo ? `${20 + Math.sin(i * 0.5) * 18 + Math.random() * 20}%` : "15%",
          transition: activo ? `height ${0.1 + (i % 5) * 0.05}s ease` : "height 0.3s ease",
          animation: activo ? `wave ${0.6 + (i % 7) * 0.1}s ease-in-out infinite alternate` : "none",
          animationDelay: `${i * 0.03}s`,
          opacity: activo ? 1 : 0.4,
        }} />
      ))}
      <style>{`
        @keyframes wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(123,97,255,0.4); }
          50%       { box-shadow: 0 0 0 12px rgba(123,97,255,0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.gris}; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f0f0; }
        ::-webkit-scrollbar-thumb { background: ${C.moradoClaro}; border-radius: 3px; }
      `}</style>
    </div>
  );
}


// COMPONENTE: RiskGauge circular
function RiskGauge({ valor }) {
  const r = 44, circ = 2 * Math.PI * r;
  const offset = circ - (valor / 100) * circ;
  const color = valor < 40 ? C.verde : valor < 75 ? C.naranja : C.rojo;
  return (
    <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
      <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="60" cy="60" r={r} fill="none" stroke="#E8E8F4" strokeWidth="10"/>
        <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}/>
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        flexDirection: "column", alignItems: "center", justifyContent: "center"
      }}>
        <span style={{ fontSize: 24, fontWeight: 800, color, lineHeight: 1 }}>{valor}</span>
        <span style={{ fontSize: 11, color: C.texto }}>%</span>
      </div>
    </div>
  );
}


// PANTALLA: Splash
function SplashScreen({ onContinuar }) {
  return (
    <div style={{
      minHeight: "100vh", background: C.moradoSplash,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "60px 36px 48px", position: "relative", overflow: "hidden"
    }}>
      {/* Forma oval decorativa */}
      <div style={{
        position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
        width: 340, height: 340, borderRadius: "50%",
        background: "rgba(255,255,255,0.12)", pointerEvents: "none"
      }}/>
      <div style={{
        position: "absolute", top: 40, right: -60,
        width: 200, height: 200, borderRadius: "50%",
        background: "rgba(255,255,255,0.07)", pointerEvents: "none"
      }}/>

      {/* Contenido superior */}
      <div style={{ animation: "fadeIn 0.8s ease both", zIndex: 1 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "rgba(255,255,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 32, backdropFilter: "blur(8px)"
        }}>
          <span style={{ fontSize: 28 }}>🛡️</span>
        </div>
        <h1 style={{
          color: C.blanco, fontSize: "clamp(32px,8vw,48px)",
          fontWeight: 900, lineHeight: 1.1, letterSpacing: "-1px",
          fontFamily: "'DM Sans', sans-serif"
        }}>
          VISHING<br/>CALL<br/>DETECTION
        </h1>
      </div>

      {/* Contenido inferior */}
      <div style={{ animation: "slideUp 0.9s 0.2s ease both", zIndex: 1, width: "100%", maxWidth: 380 }}>
        <p style={{
          color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.6,
          marginBottom: 32, textAlign: "center"
        }}>
          Analiza tus llamadas y detecta posibles<br/>fraudes telefónicos bancarios.
        </p>
        <button onClick={onContinuar} style={{
          width: "100%", height: 56, borderRadius: 28,
          background: C.blanco, color: C.moradoSplash,
          border: "none", fontSize: 16, fontWeight: 700,
          cursor: "pointer", letterSpacing: "0.3px",
          fontFamily: "'DM Sans', sans-serif",
          transition: "transform 0.15s, box-shadow 0.15s",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
        }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.02)"; e.target.style.boxShadow = "0 12px 32px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}


// PANTALLA: Panel Principal
function PanelPrincipal({ onNav, historialCount }) {
  const fecha = new Date().toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "short" }).toUpperCase();
  const cards = [
    { id: "monitoreo", label: "Aceptar monitoreo de llamadas", color: C.morado, icon: "📞", count: historialCount, sub: `${historialCount} llamadas analizadas` },
    { id: "historial", label: "Ver Historial", color: C.moradoClaro, icon: "🕐", count: historialCount, sub: `${historialCount} llamadas almacenadas` },
    { id: "configuracion", label: "Configuración", color: C.verde, icon: "⚙️", count: null, sub: "Ajustes de detección" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease both" }}>
      {/* Header */}
      <div style={{ padding: "24px 20px 8px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.azulOscuro, marginBottom: 4 }}>Panel Principal</h2>
        <p style={{ fontSize: 12, color: "#aaa", marginBottom: 2 }}>☀ {fecha}</p>
        <p style={{ fontSize: 13, color: C.texto }}>Vishing Call Detection</p>
      </div>

      {/* Cards */}
      <div style={{ padding: "12px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {cards.map((c, i) => (
          <div key={c.id} onClick={() => onNav(c.id)}
            style={{
              background: c.color, borderRadius: 20, padding: "20px 20px 18px",
              cursor: "pointer", position: "relative", overflow: "hidden",
              boxShadow: `0 6px 24px ${c.color}55`,
              animation: `slideUp 0.4s ${i * 0.08}s ease both`,
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 12px 32px ${c.color}77`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 6px 24px ${c.color}55`; }}
          >
            {/* Círculo decorativo */}
            <div style={{
              position: "absolute", right: -16, top: -16,
              width: 80, height: 80, borderRadius: "50%",
              background: "rgba(255,255,255,0.15)"
            }}/>
            <span style={{ position: "absolute", right: 16, top: 16, fontSize: 28, opacity: 0.85 }}>{c.icon}</span>
            <p style={{ color: C.blanco, fontWeight: 700, fontSize: 16, marginBottom: 8, paddingRight: 48, lineHeight: 1.3 }}>{c.label}</p>
            {c.count !== null && (
              <p style={{ color: C.blanco, fontWeight: 800, fontSize: 22, marginBottom: 2 }}>{c.count}</p>
            )}
            <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


// PANTALLA: Monitoreo
function Monitoreo({ onGuardar }) {
  const [grabando, setGrabando]         = useState(false);
  const [segundos, setSegundos]         = useState(0);
  const [riesgo, setRiesgo]             = useState(0);
  const [transcripcion, setTranscripcion] = useState("");
  const [palabras, setPalabras]         = useState([]);
  const [cargando, setCargando]         = useState(false);
  const [error, setError]               = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const loopRef          = useRef(null);

  // Cronómetro
  useEffect(() => {
    if (grabando) {
      timerRef.current = setInterval(() => setSegundos(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [grabando]);

  const formatTime = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Enviar segmento al backend
  const enviarSegmento = useCallback(async (blob) => {
    setCargando(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("audio", blob, "segmento.mp4");
      const res = await fetch(`${BACKEND_URL}/analyze_audio/`, {
        method: "POST", body: formData
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setRiesgo(Math.round(data.riesgo ?? 0));
      setTranscripcion(data.transcripcion ?? "");
      // Extraer palabras sospechosas (más de 5 chars como heurística básica)
      const palabrasSosp = (data.transcripcion ?? "")
        .split(" ")
        .filter(w => w.length > 5)
        .slice(0, 8);
      setPalabras(palabrasSosp);
    } catch (e) {
      setError("No se pudo conectar con el servidor. Verifica la URL del backend.");
    } finally {
      setCargando(false);
    }
  }, []);

  // Loop de grabación de 5s
  const iniciarLoop = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const grabarCiclo = () => {
        const mr = new MediaRecorder(stream, { mimeType: "audio/webm" });
        chunksRef.current = [];
        mr.ondataavailable = e => chunksRef.current.push(e.data);
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          enviarSegmento(blob);
        };
        mr.start();
        mediaRecorderRef.current = mr;
        loopRef.current = setTimeout(() => {
          if (mr.state === "recording") mr.stop();
          if (grabando) grabarCiclo();
        }, 5000);
      };
      grabarCiclo();
    } catch {
      setError("No se pudo acceder al micrófono. Verifica los permisos del navegador.");
      setGrabando(false);
    }
  }, [enviarSegmento, grabando]);

  const toggleGrabacion = () => {
    if (!grabando) {
      setGrabando(true);
      setSegundos(0);
      setRiesgo(0);
      setTranscripcion("");
      setPalabras([]);
      setError("");
    } else {
      setGrabando(false);
      clearTimeout(loopRef.current);
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  };

  useEffect(() => {
    if (grabando) iniciarLoop();
  }, [grabando]);

  const colorRiesgo = riesgo < 40 ? C.verde : riesgo < 75 ? C.naranja : C.rojo;

  return (
    <div style={{ animation: "fadeIn 0.4s ease both", paddingBottom: 24 }}>
      <div style={{ padding: "24px 20px 12px" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: C.azulOscuro }}>Monitoreo en tiempo real</h2>
      </div>

      {/* Waveform */}
      <div style={{
        margin: "0 16px 8px", background: C.blanco,
        borderRadius: 20, padding: "20px 8px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <Waveform activo={grabando} />
        <p style={{ textAlign: "center", fontSize: 28, fontWeight: 800, color: C.azulOscuro, marginTop: 8 }}>
          {formatTime(segundos)}
        </p>
      </div>

      {/* Botón grabar */}
      <div style={{ padding: "12px 16px" }}>
        <button onClick={toggleGrabacion} style={{
          width: "100%", height: 52, borderRadius: 26,
          background: grabando ? C.rojo : C.morado,
          color: C.blanco, border: "none", fontSize: 15,
          fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "background 0.3s, transform 0.15s",
          animation: grabando ? "pulse 2s infinite" : "none",
          boxShadow: `0 4px 16px ${grabando ? C.rojo : C.morado}55`
        }}>
          {grabando ? "⏹ Detener grabación" : "🎙 Grabar llamada"}
        </button>
      </div>

      {error && (
        <div style={{
          margin: "0 16px 12px", padding: "12px 16px",
          background: "#FFF3F3", borderRadius: 12,
          border: `1px solid ${C.rojo}33`, color: C.rojo, fontSize: 13
        }}>{error}</div>
      )}

      {/* Nivel de riesgo */}
      <div style={{
        margin: "0 16px 14px", background: C.blanco,
        borderRadius: 20, padding: "20px 16px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
      }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: C.azulOscuro, textAlign: "center", marginBottom: 16 }}>
          Nivel de riesgo
        </p>
        <RiskGauge valor={riesgo} />
        {cargando && (
          <p style={{ textAlign: "center", fontSize: 12, color: C.texto, marginTop: 10 }}>
            <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: 6 }}>⟳</span>
            Analizando segmento...
          </p>
        )}
        {riesgo >= 75 && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 12,
            background: "#FFF3F3", border: `1px solid ${C.rojo}44`,
            textAlign: "center", color: C.rojo, fontWeight: 700, fontSize: 13
          }}>
            ⚠️ Alto riesgo de vishing detectado
          </div>
        )}
      </div>

      {/* Transcripción / Palabras clave */}
      {(transcripcion || palabras.length > 0) && (
        <div style={{
          margin: "0 16px 14px", background: C.blanco,
          borderRadius: 20, padding: "20px 16px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
        }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: C.azulOscuro, marginBottom: 10 }}>
            Palabras clave detectadas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: transcripcion ? 14 : 0 }}>
            {palabras.map((w, i) => (
              <span key={i} style={{
                background: `${C.naranja}18`, color: C.naranja,
                borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 600
              }}>{w}</span>
            ))}
          </div>
          {transcripcion && (
            <p style={{ fontSize: 13, color: C.texto, lineHeight: 1.6, fontStyle: "italic" }}>
              "{transcripcion}"
            </p>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        <button onClick={() => {
          if (grabando) {
            setGrabando(false);
            clearTimeout(loopRef.current);
            if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
          }
        }} style={{
          width: "100%", height: 52, borderRadius: 26,
          background: C.morado, color: C.blanco,
          border: "none", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: `0 4px 16px ${C.morado}44`
        }}>
          Detener análisis manual
        </button>
        <button onClick={() => onGuardar({ fecha: new Date().toLocaleString("es-MX"), estado: riesgo >= 75 ? "Sospechoso" : "Seguro", riesgo })}
          style={{
            width: "100%", height: 52, borderRadius: 26,
            background: C.morado, color: C.blanco,
            border: "none", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 4px 16px ${C.morado}44`
          }}>
          Guardar resultado
        </button>
      </div>
    </div>
  );
}


// PANTALLA: Historial
function Historial({ lista, onLimpiar }) {
  return (
    <div style={{ animation: "fadeIn 0.4s ease both", paddingBottom: 100 }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.azulOscuro, lineHeight: 1.2 }}>
          Llamadas almacenadas<br/>hasta el momento
        </h2>
      </div>

      <div style={{ padding: "0 16px" }}>
        {lista.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "48px 24px",
            background: C.blanco, borderRadius: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)"
          }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📋</p>
            <p style={{ color: C.texto, fontSize: 14 }}>No hay llamadas grabadas aún.</p>
          </div>
        ) : (
          <div style={{ background: C.blanco, borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {lista.map((item, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                borderBottom: i < lista.length - 1 ? "1px solid #F0F0F0" : "none",
                display: "flex", alignItems: "center", gap: 12,
                animation: `slideUp 0.3s ${i * 0.05}s ease both`
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: item.estado === "Seguro" ? `${C.verde}18` : `${C.naranja}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18
                }}>
                  {item.estado === "Seguro" ? "✅" : "⚠️"}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: C.azulOscuro, fontWeight: 600 }}>{item.fecha}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: item.estado === "Seguro" ? C.verde : C.naranja }}>
                    {item.estado} — {item.riesgo}% riesgo
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: "16px 16px 0" }}>
        <button onClick={onLimpiar} style={{
          width: "100%", height: 56, borderRadius: 28,
          background: C.morado, color: C.blanco,
          border: "none", fontSize: 15, fontWeight: 700,
          cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          boxShadow: `0 4px 16px ${C.morado}44`
        }}>
          🗑 Limpiar Historial
        </button>
      </div>
    </div>
  );
}


// PANTALLA: Configuración
function Configuracion({ config, onChange }) {
  const items = [
    { key: "alertas", icon: "🔔", color: C.verde,   label: "Activar alertas sonoras" },
    { key: "microfono", icon: "🎙", color: C.naranja, label: "Permisos de micrófono" },
    { key: "privacidad", icon: "🔒", color: C.rojo,   label: "Permisos de privacidad" },
  ];

  return (
    <div style={{ animation: "fadeIn 0.4s ease both", paddingBottom: 24 }}>
      <div style={{ padding: "24px 20px 16px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: C.azulOscuro }}>Configuración</h2>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Umbral */}
        <div style={{ background: C.blanco, borderRadius: 20, padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${C.morado}18`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20
            }}></div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: C.azulOscuro }}>Cambiar umbral de detección</p>
              <p style={{ fontSize: 13, color: C.morado, fontWeight: 700 }}>{config.umbral} %</p>
            </div>
          </div>
          <input type="range" min="0" max="100" value={config.umbral}
            onChange={e => onChange("umbral", Number(e.target.value))}
            style={{ width: "100%", accentColor: C.morado }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#aaa" }}>0%</span>
            <span style={{ fontSize: 11, color: "#aaa" }}>100%</span>
          </div>
        </div>

        {/* Switches */}
        {items.map((item, i) => (
          <div key={item.key} style={{
            background: C.blanco, borderRadius: 20, padding: "16px 20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", gap: 12,
            animation: `slideUp 0.3s ${i * 0.07}s ease both`
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `${item.color}18`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20
            }}>{item.icon}</div>
            <p style={{ flex: 1, fontWeight: 600, fontSize: 14, color: C.azulOscuro }}>{item.label}</p>
            <div onClick={() => onChange(item.key, !config[item.key])}
              style={{
                width: 48, height: 28, borderRadius: 14, cursor: "pointer",
                background: config[item.key] ? C.morado : "#DDD",
                position: "relative", transition: "background 0.25s", flexShrink: 0
              }}>
              <div style={{
                position: "absolute", top: 4,
                left: config[item.key] ? 24 : 4,
                width: 20, height: 20, borderRadius: "50%",
                background: C.blanco, transition: "left 0.25s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)"
              }}/>
            </div>
          </div>
        ))}

        {/* Acerca de */}
        <div style={{ background: C.blanco, borderRadius: 20, padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: C.azulOscuro, marginBottom: 12 }}>Acerca de</p>
          {["Descripción del proyecto", "Créditos"].map((item, i) => (
            <div key={i}>
              <p style={{ padding: "10px 0", fontSize: 14, color: C.texto, cursor: "pointer" }}
                onMouseEnter={e => e.target.style.color = C.morado}
                onMouseLeave={e => e.target.style.color = C.texto}
              >{item}</p>
              {i === 0 && <div style={{ height: 1, background: "#F0F0F0" }}/>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// APP PRINCIPAL
export default function App() {
  const [pantalla, setPantalla] = useState("splash");
  const [navActiva, setNavActiva] = useState("inicio");
  const [historial, setHistorial] = useState([]);
  const [config, setConfig] = useState({ umbral: 40, alertas: true, microfono: true, privacidad: true });

  const navItems = [
    { id: "inicio",    icon: "🏠", label: "Inicio" },
    { id: "monitoreo", icon: "📞", label: "Monitoreo" },
    { id: "historial", icon: "📋", label: "Historial" },
  ];

  const handleNav = (id) => {
    if (id === "configuracion") { setPantalla("configuracion"); return; }
    setNavActiva(id);
    setPantalla("main");
  };

  const handleGuardar = (entrada) => {
    setHistorial(prev => [entrada, ...prev]);
    setNavActiva("historial");
    setPantalla("main");
  };

  const renderPantalla = () => {
    if (pantalla === "configuracion") return (
      <Configuracion config={config} onChange={(k, v) => setConfig(c => ({ ...c, [k]: v }))} />
    );
    switch (navActiva) {
      case "inicio":    return <PanelPrincipal onNav={handleNav} historialCount={historial.length} />;
      case "monitoreo": return <Monitoreo onGuardar={handleGuardar} />;
      case "historial": return <Historial lista={historial} onLimpiar={() => setHistorial([])} />;
      default:          return <PanelPrincipal onNav={handleNav} historialCount={historial.length} />;
    }
  };

  if (pantalla === "splash") {
    return (
      <>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
        <SplashScreen onContinuar={() => setPantalla("main")} />
      </>
    );
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet"/>
      <div style={{
        minHeight: "100vh", background: C.gris,
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 480, margin: "0 auto",
        position: "relative", paddingBottom: 72
      }}>
        {/* Contenido */}
        <div style={{ overflowY: "auto" }}>
          {renderPantalla()}
        </div>

        {/* Bottom Navigation */}
        {pantalla !== "configuracion" && (
          <div style={{
            position: "fixed", bottom: 0, left: "50%",
            transform: "translateX(-50%)", width: "100%", maxWidth: 480,
            background: C.blanco, borderTop: "1px solid #F0F0F0",
            display: "flex", height: 64,
            boxShadow: "0 -4px 20px rgba(0,0,0,0.08)", zIndex: 100
          }}>
            {navItems.map(item => {
              const activo = navActiva === item.id && pantalla === "main";
              return (
                <button key={item.id} onClick={() => handleNav(item.id)} style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 2,
                  background: "none", border: "none", cursor: "pointer",
                  transition: "transform 0.15s"
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.08)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: activo ? 700 : 500,
                    color: activo ? C.morado : "#AAAAAA",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "color 0.2s"
                  }}>{item.label}</span>
                  {activo && (
                    <div style={{
                      position: "absolute", bottom: 0,
                      width: 32, height: 3, borderRadius: "3px 3px 0 0",
                      background: C.morado
                    }}/>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Botón atrás en Configuración */}
        {pantalla === "configuracion" && (
          <button onClick={() => { setPantalla("main"); setNavActiva("inicio"); }} style={{
            position: "fixed", top: 16, left: "calc(50% - 220px)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: 22, color: C.azulOscuro, padding: 8,
            fontFamily: "'DM Sans', sans-serif"
          }}>← </button>
        )}
      </div>
    </>
  );
}

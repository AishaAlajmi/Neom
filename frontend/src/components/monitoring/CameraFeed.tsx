import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/axiosConfig";

type Detection = {
  bbox: [number, number, number, number];
  score: number;
  label: string;
};

// 🔽 4 demo images served from /public
const DEMO_FEEDS = [
  {
    name: "C1 North Gate",
    src: "/inbox_2163725_0e46d95b350ee8bc9c683595ccf5ecb6_construction-safety.jpg",
  },
  {
    name: "C1 Zone A",
    src: "/680a070c3b99253410dd4540_67ed5389d0cfa882e60957b_67a380c04818ec6e4d783319_release_1.webp",
  },
  { name: "C1 Storage", src: "/images.jpg" },
  {
    name: "C1 Entrance",
    src: "/PPE-detection-for-construction.webp",
  },
];

export default function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [running, setRunning] = useState(false);
  const [fps, setFps] = useState(2);
  const [msg, setMsg] = useState<string>("");

  const start = async () => {
    setMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setRunning(true);
      }
    } catch (e: any) {
      setMsg(`Camera error: ${e?.name || ""} ${e?.message || e}`);
      console.error(e);
    }
  };

  const stop = () => {
    setRunning(false);
    const v = videoRef.current;
    if (v?.srcObject)
      (v.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    if (v) v.srcObject = null;
  };

  const drawDetections = (ctx: CanvasRenderingContext2D, dets: Detection[]) => {
    const c = canvasRef.current!;
    ctx.lineWidth = 2;
    ctx.font = "14px sans-serif";
    dets.forEach((d) => {
      const [x, y, w, h] = d.bbox;
      ctx.strokeStyle = "#00E5FF";
      ctx.strokeRect(x, y, w, h);
      const label = `${d.label} ${(d.score * 100).toFixed(0)}%`;
      const textW = ctx.measureText(label).width + 8;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(x, Math.max(0, y - 18), textW, 18);
      ctx.fillStyle = "#fff";
      ctx.fillText(label, x + 4, Math.max(12, y - 4));
    });
  };

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const loop = async (now: number) => {
      const v = videoRef.current,
        c = canvasRef.current;
      if (!running || !v || !c) return;

      // set canvas size to the video’s
      if (
        v.videoWidth &&
        v.videoHeight &&
        (c.width !== v.videoWidth || c.height !== v.videoHeight)
      ) {
        c.width = v.videoWidth;
        c.height = v.videoHeight;
      }
      const ctx = c.getContext("2d");
      if (!ctx) return;

      // draw preview frame
      ctx.drawImage(v, 0, 0, c.width, c.height);

      // throttle sends
      if (now - last > 1000 / Math.max(1, fps)) {
        last = now;
        try {
          const dataUrl = c.toDataURL("image/jpeg", 0.6);
          const res = await axiosInstance.post("/predict/", { image: dataUrl });
          const dets: Detection[] = res.data?.detections || [];
          drawDetections(ctx, dets);
          setMsg(`Sent -> got ${dets.length} detections`);
        } catch (e: any) {
          setMsg(`API error: ${e?.message || e}`);
          console.error(e);
        }
      }

      raf = requestAnimationFrame(loop);
    };

    if (running) raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, fps]);

  return (
    <div>
      {/* Webcam + model section (unchanged) */}
      <div style={{ marginBottom: 12 }}>
        {!running ? (
          <button onClick={start}>Start Camera</button>
        ) : (
          <button onClick={stop}>Stop Camera</button>
        )}
        <span style={{ marginLeft: 12 }}>Send FPS:</span>
        <select
          value={fps}
          onChange={(e) => setFps(Number(e.target.value))}
          style={{ marginLeft: 6 }}
        >
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={5}>5</option>
        </select>
      </div>

      <video ref={videoRef} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          maxWidth: 1280,
          borderRadius: 8,
          background: "#000",
        }}
      />

      {msg && <div style={{ marginTop: 8, color: "#9ad" }}>{msg}</div>}

      {/* 🔽 2×2 grid with the 4 demo images */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 12 }}>Demo Feeds</h3>
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          }}
        >
          {DEMO_FEEDS.map((cam) => (
            <div
              key={cam.name}
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                background: "#0b1220",
              }}
              title={cam.name}
            >
              <img
                src={cam.src}
                alt={cam.name}
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/placeholder.svg";
                }}
              />

              {/* overlays */}
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "4px 8px",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "999px",
                    background: "#ef4444",
                    boxShadow: "0 0 6px #ef4444",
                  }}
                />
                REC
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  padding: "4px 8px",
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {cam.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

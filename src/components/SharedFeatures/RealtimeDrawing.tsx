import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Download, Sparkles, Paintbrush, Eraser } from 'lucide-react';
import { DrawStroke, UserProfile } from '../../types/game';

interface RealtimeDrawingProps {
  drawingStrokes: DrawStroke[];
  myProfile: UserProfile;
  partnerProfile: UserProfile | null;
  onSendStroke: (stroke: DrawStroke) => void;
  onClearCanvas: () => void;
  onBack: () => void;
}

const COLORS = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#334155'];

export const RealtimeDrawing: React.FC<RealtimeDrawingProps> = ({
  drawingStrokes,
  myProfile,
  partnerProfile,
  onSendStroke,
  onClearCanvas,
  onBack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState('#f43f5e');
  const [brushSize, setBrushSize] = useState(5);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentPointsRef = useRef<{ x: number; y: number }[]>([]);

  // Redraw all strokes whenever state changes
  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawingStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      }
      ctx.stroke();
    });
  };

  useEffect(() => {
    redrawCanvas();
  }, [drawingStrokes]);

  // Adjust canvas size to match aspect ratio
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    redrawCanvas();
  }, []);

  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
  };

  const handleStartDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const pt = getCanvasCoords(e);
    if (!pt) return;
    setIsDrawing(true);
    currentPointsRef.current = [pt];
  };

  const handleMoveDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const pt = getCanvasCoords(e);
    if (!pt) return;

    currentPointsRef.current.push(pt);

    // Live preview on local canvas
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const len = currentPointsRef.current.length;
    if (len >= 2) {
      const prev = currentPointsRef.current[len - 2];
      ctx.beginPath();
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(prev.x * canvas.width, prev.y * canvas.height);
      ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
      ctx.stroke();
    }
  };

  const handleEndDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentPointsRef.current.length >= 2) {
      const stroke: DrawStroke = {
        color: selectedColor,
        size: brushSize * 2,
        points: [...currentPointsRef.current],
      };
      onSendStroke(stroke);
    }
    currentPointsRef.current = [];
  };

  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `tranh-ve-2-dua-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-pink-200 text-xs font-bold text-slate-700 shadow-xs hover:bg-pink-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onClearCanvas}
            title="Xóa trắng bảng vẽ"
            className="p-2 rounded-full bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleSaveImage}
            title="Tải ảnh vẽ về máy"
            className="p-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 transition"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas Card */}
      <div className="bg-white rounded-3xl p-4 shadow-xl border-2 border-pink-200 space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
            <Paintbrush className="w-4 h-4 text-pink-500" />
            <span>Bảng Vẽ Đôi Realtime 🎨</span>
          </span>
          <span className="text-[10px] text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-full">
            Cùng vẽ đồng thời 2 máy
          </span>
        </div>

        {/* Canvas Area */}
        <div className="relative w-full h-[52vh] rounded-2xl border-2 border-pink-200 overflow-hidden shadow-inner touch-none bg-white">
          <canvas
            ref={canvasRef}
            onMouseDown={handleStartDraw}
            onMouseMove={handleMoveDraw}
            onMouseUp={handleEndDraw}
            onMouseLeave={handleEndDraw}
            onTouchStart={handleStartDraw}
            onTouchMove={handleMoveDraw}
            onTouchEnd={handleEndDraw}
            className="w-full h-full cursor-crosshair"
          />
        </div>

        {/* Color Palette & Brush Size */}
        <div className="flex items-center justify-between pt-1">
          {/* Colors */}
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  selectedColor === c ? 'scale-125 ring-2 ring-offset-2 ring-pink-400' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Brush Sizes */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            {[3, 6, 12].map((s) => (
              <button
                key={s}
                onClick={() => setBrushSize(s)}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                  brushSize === s ? 'bg-pink-500 text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {s === 3 ? 'S' : s === 6 ? 'M' : 'L'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

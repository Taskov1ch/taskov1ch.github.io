import { useEffect, useRef } from "react";

const CUBE_VERTICES = [
	[-1, -1, -1],
	[1, -1, -1],
	[1, 1, -1],
	[-1, 1, -1],
	[-1, -1, 1],
	[1, -1, 1],
	[1, 1, 1],
	[-1, 1, 1],
];

const CUBE_EDGES: [number, number][] = [
	[0, 1], [1, 2], [2, 3], [3, 0],
	[4, 5], [5, 6], [6, 7], [7, 4],
	[0, 4], [1, 5], [2, 6], [3, 7],
];

const CUBE_FACES: number[][] = [
	[0, 1, 2, 3], // back
	[4, 5, 6, 7], // front
	[0, 1, 5, 4], // bottom
	[2, 3, 7, 6], // top
	[1, 2, 6, 5], // right
	[0, 3, 7, 4], // left
];

function project(
	x: number,
	y: number,
	z: number,
	cx: number,
	cy: number,
	size: number,
): [number, number, number] {
	const fov = 4;
	const scale = fov / (fov + z);
	return [cx + x * size * scale, cy + y * size * scale, scale];
}

function rotateY(x: number, y: number, z: number, a: number): [number, number, number] {
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	return [x * cos - z * sin, y, x * sin + z * cos];
}

function rotateX(x: number, y: number, z: number, a: number): [number, number, number] {
	const cos = Math.cos(a);
	const sin = Math.sin(a);
	return [x, y * cos - z * sin, y * sin + z * cos];
}

export const WireframeCube = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animRef = useRef<number>(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const style = getComputedStyle(document.documentElement);
		const accentColor = style.getPropertyValue("--color-accent-val").trim() || "#fbbf24";
		const cyanColor = style.getPropertyValue("--color-cyan-val").trim() || "#22d3ee";

		let angleY = 0;
		let angleX = 0.4;

		const resize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		resize();
		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);

		const draw = () => {
			const w = canvas.getBoundingClientRect().width;
			const h = canvas.getBoundingClientRect().height;
			const cx = w / 2;
			const cy = h / 2;
			const size = Math.min(w, h) * 0.20;

			ctx.clearRect(0, 0, w, h);

			angleY += 0.004;
			angleX += 0.002;

			ctx.save();
			ctx.globalAlpha = 0.18;
			const gradGlow = ctx.createRadialGradient(cx, cy, size * 0.2, cx, cy, size * 1.1);
			gradGlow.addColorStop(0, cyanColor);
			gradGlow.addColorStop(0.5, accentColor);
			gradGlow.addColorStop(1, "transparent");
			ctx.beginPath();
			ctx.arc(cx, cy, size * 1.1, 0, Math.PI * 2);
			ctx.fillStyle = gradGlow;
			ctx.fill();
			ctx.restore();

			const projected = CUBE_VERTICES.map(([vx, vy, vz]) => {
				let [rx, ry, rz] = rotateY(vx, vy, vz, angleY);
				[rx, ry, rz] = rotateX(rx, ry, rz, angleX);
				return project(rx, ry, rz, cx, cy, size);
			});

			for (const face of CUBE_FACES) {
				ctx.save();
				ctx.beginPath();
				face.forEach((idx, i) => {
					const [x, y] = projected[idx];
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				});
				ctx.closePath();
				const [x0, y0] = projected[face[0]];
				const [x2, y2] = projected[face[2]];
				const grad = ctx.createLinearGradient(x0, y0, x2, y2);
				grad.addColorStop(0, accentColor + "33");
				grad.addColorStop(0.5, cyanColor + "22");
				grad.addColorStop(1, accentColor + "33");
				ctx.fillStyle = grad;
				ctx.globalAlpha = 0.18;
				ctx.fill();
				ctx.restore();
			}

			for (const [a, b] of CUBE_EDGES) {
				const [x1, y1, s1] = projected[a];
				const [x2, y2, s2] = projected[b];
				const avgScale = (s1 + s2) / 2;
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				const grad = ctx.createLinearGradient(x1, y1, x2, y2);
				grad.addColorStop(0, cyanColor);
				grad.addColorStop(0.5, accentColor);
				grad.addColorStop(1, cyanColor);
				ctx.strokeStyle = grad;
				ctx.globalAlpha = 0.45 + avgScale * 0.35;
				ctx.lineWidth = 2.2;
				ctx.shadowColor = accentColor;
				ctx.shadowBlur = 6;
				ctx.stroke();
				ctx.restore();
			}

			// Вершины
			for (const [px, py, s] of projected) {
				const r = 3 + s * 2.5;
				ctx.save();
				ctx.beginPath();
				ctx.arc(px, py, r, 0, Math.PI * 2);
				ctx.fillStyle = accentColor;
				ctx.globalAlpha = 0.7 + s * 0.2;
				ctx.shadowColor = cyanColor;
				ctx.shadowBlur = 8;
				ctx.fill();
				ctx.restore();
			}

			ctx.save();
			ctx.globalAlpha = 0.13;
			ctx.scale(1, -1);
			ctx.translate(0, -h);
			for (const face of CUBE_FACES) {
				ctx.beginPath();
				face.forEach((idx, i) => {
					const [x, y] = projected[idx];
					if (i === 0) ctx.moveTo(x, h - y);
					else ctx.lineTo(x, h - y);
				});
				ctx.closePath();
				ctx.fillStyle = accentColor;
				ctx.fill();
			}
			ctx.restore();

			animRef.current = requestAnimationFrame(draw);
		};

		animRef.current = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(animRef.current);
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="w-full h-[100vh]"
			style={{ display: "block" }}
		/>
	)
};

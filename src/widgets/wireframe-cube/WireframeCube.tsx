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
		const mutedColor = style.getPropertyValue("--color-muted-val").trim() || "#71717a";

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
			const size = Math.min(w, h) * 0.28;

			ctx.clearRect(0, 0, w, h);

			angleY += 0.004;
			angleX += 0.002;

			const projected = CUBE_VERTICES.map(([vx, vy, vz]) => {
				let [rx, ry, rz] = rotateY(vx, vy, vz, angleY);
				[rx, ry, rz] = rotateX(rx, ry, rz, angleX);
				return project(rx, ry, rz, cx, cy, size);
			});

			// Draw edges
			for (const [a, b] of CUBE_EDGES) {
				const [x1, y1, s1] = projected[a];
				const [x2, y2, s2] = projected[b];
				const avgScale = (s1 + s2) / 2;
				const alpha = 0.25 + avgScale * 0.55;

				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.strokeStyle = accentColor;
				ctx.globalAlpha = alpha;
				ctx.lineWidth = 1.2;
				ctx.stroke();
			}

			// Draw vertices
			for (const [px, py, s] of projected) {
				const r = 2 + s * 2;
				const alpha = 0.4 + s * 0.6;

				ctx.beginPath();
				ctx.arc(px, py, r, 0, Math.PI * 2);
				ctx.fillStyle = accentColor;
				ctx.globalAlpha = alpha;
				ctx.fill();

				// Glow
				ctx.beginPath();
				ctx.arc(px, py, r * 2.5, 0, Math.PI * 2);
				ctx.fillStyle = accentColor;
				ctx.globalAlpha = alpha * 0.15;
				ctx.fill();
			}

			// Corner labels
			ctx.globalAlpha = 0.3;
			ctx.font = "10px monospace";
			ctx.fillStyle = mutedColor;
			ctx.textAlign = "left";
			ctx.fillText("[ WIREFRAME ]", 12, 20);
			ctx.textAlign = "right";
			ctx.fillText("ROTATE_Y: " + angleY.toFixed(2), w - 12, h - 12);

			ctx.globalAlpha = 1;
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
			className="w-full h-full min-h-[300px]"
			style={{ display: "block" }}
		/>
	);
};

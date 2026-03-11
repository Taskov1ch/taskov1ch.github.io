import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "solid" | "outline" | "ghost";
	size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant = "solid", size = "md", ...props }, ref) => {
		return (
			<button
				ref={ref}
				className={cn(
					"inline-flex items-center justify-center gap-2 font-sans font-bold tracking-wide transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none",
					variant === "solid" &&
					"bg-accent text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] hover:scale-[1.02] active:scale-[0.98]",
					variant === "outline" &&
					"border border-accent text-accent bg-transparent hover:bg-accent hover:text-black hover:shadow-[0_0_15px_rgba(251,191,36,0.3)]",
					variant === "ghost" &&
					"text-muted hover:text-main hover:bg-surface",
					size === "sm" && "h-9 px-4 text-xs",
					size === "md" && "h-12 px-6 text-sm",
					size === "lg" && "h-16 px-8 text-lg",
					className,
				)}
				{...props}
			/>
		);
	},
);

Button.displayName = "Button";

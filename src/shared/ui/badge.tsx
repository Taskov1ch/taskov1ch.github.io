import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: "default" | "outline" | "accent";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	({ className, variant = "default", ...props }, ref) => {
		return (
			<span
				ref={ref}
				className={cn(
					"inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 transition-colors",
					variant === "default" && "border border-muted/20 bg-surface text-muted",
					variant === "outline" && "border border-accent text-accent",
					variant === "accent" && "bg-accent text-black font-bold",
					className,
				)}
				{...props}
			/>
		);
	},
);

Badge.displayName = "Badge";

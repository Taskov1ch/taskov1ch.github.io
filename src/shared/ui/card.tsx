import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "outline" | "elevated";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, variant = "default", ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"bg-surface border border-muted/20 relative overflow-hidden transition-all duration-300",
					variant === "default" && "hover:border-accent/50 hover:shadow-[0_0_20px_rgba(251,191,36,0.08)]",
					variant === "outline" && "bg-transparent hover:border-accent/50",
					variant === "elevated" && "shadow-lg hover:border-accent/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.1)]",
					className,
				)}
				{...props}
			/>
		);
	},
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("p-6 pb-0", className)} {...props} />
	),
);
CardHeader.displayName = "CardHeader";

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("p-6", className)} {...props} />
	),
);
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
	({ className, ...props }, ref) => (
		<div ref={ref} className={cn("p-6 pt-0 flex items-center", className)} {...props} />
	),
);
CardFooter.displayName = "CardFooter";

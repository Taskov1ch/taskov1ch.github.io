import { Dialog } from "@ark-ui/react/dialog";
import { Portal } from "@ark-ui/react/portal";
import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";
import { cn } from "../lib/utils";
import { FaTimes } from "react-icons/fa";

interface DrawerProps {
	open: boolean;
	onOpenChange: (details: { open: boolean }) => void;
	children: ReactNode;
	title?: string;
	side?: "left" | "right";
}

export const Drawer = ({ open, onOpenChange, children, title, side = "right" }: DrawerProps) => {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<AnimatePresence>
				{open && (
					<Portal>
						<Dialog.Backdrop asChild>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
							/>
						</Dialog.Backdrop>
						<Dialog.Positioner className="fixed inset-0 z-[70] flex">
							<Dialog.Content asChild>
								<motion.div
									initial={{ x: side === "right" ? "100%" : "-100%" }}
									animate={{ x: 0 }}
									exit={{ x: side === "right" ? "100%" : "-100%" }}
									transition={{ type: "spring", damping: 25, stiffness: 200 }}
									className={cn(
										"fixed top-0 bottom-0 w-full max-w-sm bg-bg border-muted/20 flex flex-col h-[100dvh]",
										side === "right" ? "right-0 border-l" : "left-0 border-r",
									)}
								>
									{title && (
										<div className="h-16 flex items-center justify-between px-6 border-b border-muted/20 bg-surface shrink-0">
											<Dialog.Title className="font-mono text-sm text-accent tracking-widest flex items-center gap-2">
												<span className="w-2 h-2 bg-accent" />
												:: {title}
											</Dialog.Title>
											<Dialog.CloseTrigger className="p-2 border border-accent text-accent hover:bg-accent hover:text-black transition-colors cursor-pointer">
												<FaTimes size={20} />
											</Dialog.CloseTrigger>
										</div>
									)}
									<div className="flex-1 flex flex-col overflow-hidden">
										{children}
									</div>
								</motion.div>
							</Dialog.Content>
						</Dialog.Positioner>
					</Portal>
				)}
			</AnimatePresence>
		</Dialog.Root>
	);
};

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaExclamationTriangle } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { Button } from "../../shared/ui/button";

export const NotFoundPage = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

	return (
		<div className="h-full w-full flex flex-col items-center justify-center p-8 relative overflow-hidden">
			<div className="absolute inset-0 pointer-events-none opacity-20 bg-[size:30px_30px] bg-[radial-gradient(#333_1px,transparent_1px)]" />

			<div className="relative z-10 max-w-md text-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", duration: 0.5 }}
					className="flex justify-center mb-6 text-accent"
				>
					<FaExclamationTriangle size={64} />
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="text-6xl md:text-8xl font-bold font-sans tracking-tighter text-main mb-2 glitch-text"
					data-text="404"
				>
					404
				</motion.h1>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="font-mono text-accent text-sm tracking-widest mb-8 border-y border-muted/20 py-2"
				>
					// {t("not_found.code")}: ROUTE_MISSING
				</motion.div>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-muted font-mono text-sm mb-8"
				>
					{t("not_found.message")}
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="flex justify-center"
				>
					<Button
						variant="solid"
						onClick={() => navigate("/")}
						className="gap-3"
					>
						<FaHome size={18} />
						<span>{t("not_found.return")}</span>
					</Button>
				</motion.div>
			</div>

			<div className="absolute bottom-8 font-mono text-[10px] text-muted/40">
				SYSTEM_HALTED // {new Date().toISOString().split("T")[0]}
			</div>
		</div>
	);
};

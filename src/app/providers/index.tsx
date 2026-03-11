import { type ReactNode } from "react";
import { DataProvider } from "../../features/data";
import { AudioProvider } from "../../features/audio";

export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<AudioProvider>
			<DataProvider>{children}</DataProvider>
		</AudioProvider>
	);
};

import { type ReactNode } from "react";
import { DataProvider } from "../../features/data";
export const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<DataProvider>{children}</DataProvider>
	);
};

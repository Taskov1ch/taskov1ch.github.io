import { useContext } from "react";
import { DataContext } from "./data-provider";

export const useData = () => {
	return useContext(DataContext);
};

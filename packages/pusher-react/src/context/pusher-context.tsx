"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import Pusher from "pusher-js";

export type PusherContextType = {
	client: Pusher;
};

export const PusherContext = createContext<PusherContextType>(
	{} as PusherContextType,
);

type Props = PropsWithChildren<{
	client: Pusher;
}>;

export function PusherProvider({ children, client }: Props) {
	return (
		<PusherContext.Provider value={{ client }}>
			{children}
		</PusherContext.Provider>
	);
}

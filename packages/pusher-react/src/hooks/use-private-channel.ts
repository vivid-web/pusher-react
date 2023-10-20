"use client";

import { useChannel } from "./use-channel";

export const usePrivateChannel = (channelName: string) =>
	useChannel(`private-${channelName}`);

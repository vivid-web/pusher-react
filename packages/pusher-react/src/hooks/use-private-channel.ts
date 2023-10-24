"use client";

import { useChannel } from "./use-channel";

const PREFIX = "private";

export const usePrivateChannel = (channelName: string) =>
	useChannel(`${PREFIX}-${channelName}`);

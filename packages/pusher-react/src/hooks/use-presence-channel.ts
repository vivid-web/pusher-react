"use client";

import { PresenceChannel } from "pusher-js";

import { useChannel } from "./use-channel";

const PREFIX = "presence";

export const usePresenceChannel = (channelName: string) =>
	useChannel<PresenceChannel>(`${PREFIX}-${channelName}`);

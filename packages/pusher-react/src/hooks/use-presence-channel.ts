"use client";

import { PresenceChannel } from "pusher-js";

import { useChannel } from "./use-channel";

export const usePresenceChannel = (channelName: string) =>
	useChannel<PresenceChannel>(`presence-${channelName}`);

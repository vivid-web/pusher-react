"use client";

import { Channel } from "pusher-js";
import { useEffect, useState } from "react";

import { usePusher } from "./use-pusher";

export const useChannel = <T extends Channel>(channelName: string) => {
	const [channel, setChannel] = useState<T>();
	const { client } = usePusher();

	useEffect(() => {
		const _channel = client.subscribe(channelName) as T;

		setChannel(_channel);

		return () => client.unsubscribe(channelName);
	}, [channelName, client]);

	return channel;
};

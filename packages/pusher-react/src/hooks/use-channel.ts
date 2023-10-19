import { Channel } from "pusher-js";
import { useEffect, useState } from "react";

import { usePusher } from "./use-pusher";

export const useChannel = (channelName: string) => {
	const [channel, setChannel] = useState<Channel>();
	const { client } = usePusher();

	useEffect(() => {
		const _channel = client.subscribe(channelName);

		setChannel(_channel);

		return () => client.unsubscribe(channelName);
	}, [channelName, client]);

	return channel;
};

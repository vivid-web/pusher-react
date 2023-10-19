import { useContext } from "react";

import { PusherContext, PusherContextType } from "../context/pusher-context";

export const usePusher = (): PusherContextType => useContext(PusherContext);

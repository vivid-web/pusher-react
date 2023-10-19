import {
	PusherProvider,
	usePusherChannel,
	usePusherEvent,
} from "@vivid-web/pusher-react";
import Pusher from "pusher-js";
import { useState } from "react";
import ReactDOM from "react-dom/client";

type Post = {
	id: number;
	title: string;
	content: string;
};

const client = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
	cluster: import.meta.env.VITE_PUSHER_CLUSTER,
});

function App() {
	return (
		<PusherProvider client={client}>
			<Posts />
		</PusherProvider>
	);
}

function Posts() {
	const [posts, setPosts] = useState<Array<Post>>([]);

	const channel = usePusherChannel("posts-example");

	usePusherEvent(channel, "post-created", (post: Post) => {
		setPosts((curr) => [...curr, post]);
	});

	usePusherEvent(channel, "post-deleted", (post: Post) => {
		setPosts((curr) => curr.filter((item) => item.id !== post.id));
	});

	return (
		<div>
			<h1>Posts</h1>
			{posts.map((post) => (
				<div key={post.id}>
					<h2>{post.title}</h2>
					<p>{post.content}</p>
				</div>
			))}
			{!posts.length && <p>No posts available</p>}
		</div>
	);
}

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement!).render(<App />);

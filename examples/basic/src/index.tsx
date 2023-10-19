import {
	PusherProvider,
	useChannel,
	usePusherEvent,
} from "@vivid-web/pusher-react";
import Pusher from "pusher-js";
import { useState } from "react";
import ReactDOM from "react-dom/client";

type Post = {
	content: string;
	id: number;
	title: string;
};

const client = new Pusher(import.meta.env.VITE_PUSHER_KEY as string, {
	cluster: import.meta.env.VITE_PUSHER_CLUSTER as string,
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

	const channel = useChannel("posts-example");

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

if (rootElement) {
	ReactDOM.createRoot(rootElement).render(<App />);
}

import { json } from "@remix-run/node";
import {
	ScrollRestoration,
	useLoaderData,
	LiveReload,
	Scripts,
	Outlet,
	Links,
	Meta,
} from "@remix-run/react";

export async function loader() {
	return json({
		ENV: {
			EMAILJS_MAIL_SERVICE_ID: process.env.EMAILJS_MAIL_SERVICE_ID,
			EMAILJS_TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID,
			EMAILJS_PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
		},
	});
}

export default function App() {
	const { ENV } = useLoaderData<typeof loader>();

	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width,initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.ENV = ${JSON.stringify(ENV)}`,
					}}
				/>
				<Outlet />
				<ScrollRestoration />
				<LiveReload />
				<Scripts />
			</body>
		</html>
	);
}

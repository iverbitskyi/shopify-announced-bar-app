import { Frame, Loading } from "@shopify/polaris";
import React from "react";

export function LoadingExample() {
	return (
		<div style={{ height: "2px" }}>
			<Frame>
				<Loading />
			</Frame>
		</div>
	);
}

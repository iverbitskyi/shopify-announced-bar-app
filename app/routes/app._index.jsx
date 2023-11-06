import { useActionData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { v4 as uuidv4 } from "uuid";
import {
	InlineStack,
	BlockStack,
	Layout,
	Page,
	Text,
	Link,
} from "@shopify/polaris";

import { LoadingExample } from "~/components/LoadingExample";
import { FormOnSubmit } from "~/components/FormOnSubmit.tsx";
import { AdminPanel } from "~/components/AdminPanel.jsx";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
	await authenticate.admin(request);

	return null;
};

export async function action({ request }) {
	try {
		const { admin } = await authenticate.admin(request);

		const uniqueNumber = uuidv4();

		const response = await admin.graphql(
			`#graphql
			mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
				discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
				  codeDiscountNode {
					 codeDiscount {
						... on DiscountCodeBasic {
						  title
						  codes(first: 10) {
							 nodes {
								code
							 }
						  }
						  startsAt
						  endsAt
						  customerSelection {
							 ... on DiscountCustomerAll {
								allCustomers
							 }
						  }
						  customerGets {
							 value {
								... on DiscountPercentage {
								  percentage
								}
							 }
							 items {
								... on AllDiscountItems {
								  allItems
								}
							 }
						  }
						  appliesOncePerCustomer
						}
					 }
				  }
				  userErrors {
					 field
					 code
					 message
				  }
				}
			 }`,
			{
				variables: {
					basicCodeDiscount: {
						title: "20% off all items during the Fall of 2023",
						code: `FALL2023-${uniqueNumber}`,
						startsAt: "2023-09-01T00:00:00Z",
						endsAt: "2023-11-30T00:00:00Z",
						customerSelection: {
							all: true,
						},
						customerGets: {
							value: {
								percentage: 0.2,
							},
							items: {
								all: true,
							},
						},
						appliesOncePerCustomer: true,
					},
				},
			}
		);

		if (response.ok) {
			const responseJson = await response.json();

			return json({
				code: 200,
				data: responseJson.data,
			});
		} else {
			const errorJson = await response.json();

			return json({
				code: response.status,
				error: errorJson.errors,
			});
		}
	} catch (error) {
		console.error("Error:", error);

		return json({
			code: 500,
			error: "Internal Server Error",
		});
	}
}

const initialConfig = {
	bar: {
		background: {
			hue: 300,
			brightness: 1,
			saturation: 0.7,
			alpha: 0.7,
		},
		padding: 10,
		position: 0,
	},
	title: {
		color: {
			hue: 0,
			brightness: 0,
			saturation: 0,
			alpha: 0.7,
		},
		variant: "headingMd",
		fontWeight: "bold",
	},
	body: {
		color: {
			hue: 0,
			brightness: 0,
			saturation: 0,
			alpha: 0.7,
		},
		variant: "bodyMd",
		fontWeight: "medium",
	},
	button: {
		background: {
			hue: 157,
			brightness: 0.28,
			saturation: 0.84,
			alpha: 1,
		},
		color: {
			hue: 300,
			brightness: 1,
			saturation: 1,
			alpha: 1,
		},
		text: "Generate the Discount Code",
		borderRadius: 5,
	},
};

export default function Index() {
	const [config, setConfig] = useState(initialConfig);

	useEffect(() => {
		const storedConfig = localStorage.getItem("appConfig");
		if (storedConfig) {
			setConfig(JSON.parse(storedConfig));
		}
	}, []);

	// prettier-ignore
	const btnBackground = `hsla(${config.button.background.hue}, ${config.button.background.saturation * 100}%, ${config.button.background.brightness * 100}%, ${config.button.background.alpha})`;
	// prettier-ignore
	const barBackgroundColor = `hsla(${config.bar.background.hue}, ${config.bar.background.saturation * 100}%, ${config.bar.background.brightness * 100}%, ${config.bar.background.alpha})`;
	// prettier-ignore
	const btnColor = `hsla(${config.button.color.hue}, ${config.button.color.saturation * 100}%, ${config.button.color.brightness * 100}%, ${config.button.color.alpha})`;
	// prettier-ignore
	const titleColor = `hsla(${config.title.color.hue}, ${config.title.color.saturation * 100}%, ${config.title.color.brightness * 100}%, ${config.title.color.alpha})`;
	// prettier-ignore
	const bodyColor = `hsla(${config.body.color.hue}, ${config.body.color.saturation * 100}%, ${config.body.color.brightness * 100}%, ${config.body.color.alpha})`;

	const [btnDiscountHover, setBtnDiscountHover] = useState("transparent");
	const [isLoadingExample, setIsloadingExample] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	const actionData = useActionData();
	const submit = useSubmit();

	const discountCode =
		actionData?.data?.discountCodeBasicCreate?.codeDiscountNode?.codeDiscount
			?.codes?.nodes[0]?.code;

	useEffect(() => {
		if (discountCode) {
			shopify.toast.show("Discount code generated");
		}
	}, [discountCode]);

	const generateDiscount = async () => {
		setIsloadingExample(true);

		try {
			submit({}, { replace: true, method: "POST" });
			await new Promise((resolve) => setTimeout(resolve, 2000));
		} catch (error) {
			console.error("Error generating discount:", error);
		} finally {
			setIsloadingExample(false);
		}
	};

	return (
		<Page>
			{isLoadingExample && <LoadingExample />}
			<ui-title-bar title="Announced Bar">
				<button variant="primary" onClick={toggleSidebar}>
					{sidebarOpen ? "Close admin panel" : "Open admin panel"}{" "}
				</button>
			</ui-title-bar>
			<BlockStack gap="500">
				<Layout>
					<Layout.Section>
						<div
							className="Polaris-ShadowBevel"
							style={{
								"--pc-shadow-bevel-z-index": 32,
								"--pc-shadow-bevel-content-xs": "",
								"--pc-shadow-bevel-box-shadow-xs":
									"var(--p-shadow-100)",
								"--pc-shadow-bevel-border-radius-xs":
									"var(--p-border-radius-300)",
								position: "relative",
								top: config.bar.position,
							}}
						>
							<div
								className="Polaris-Box"
								style={{
									"--pc-box-background": "var(--p-color-bg-surface)",
									"--pc-box-min-height": "100%",
									"--pc-box-overflow-x": "hidden",
									"--pc-box-overflow-y": "hidden",
									"--pc-box-padding-block-end-xs":
										"var(--p-space-400)",
									"--pc-box-padding-block-start-xs":
										"var(--p-space-400)",
									"--pc-box-padding-inline-start-xs":
										"var(--p-space-400)",
									"--pc-box-padding-inline-end-xs":
										"var(--p-space-400)",
									backgroundColor: barBackgroundColor,
									padding: config.bar.padding,
								}}
							>
								<BlockStack gap="500">
									<BlockStack gap="200">
										<div
											style={{
												color: titleColor,
											}}
										>
											<Text
												as="p"
												variant={config.title.variant}
												fontWeight={config.title.fontWeight}
											>
												Create and send a discount
											</Text>
										</div>

										{!discountCode && (
											<div
												style={{
													color: bodyColor,
												}}
											>
												<Text
													as="p"
													variant={config.body.variant}
													fontWeight={config.body.fontWeight}
												>
													This application is designed to generate
													a discount code and send it to an email.
												</Text>
												<Text
													as="p"
													variant={config.body.variant}
													fontWeight={config.body.fontWeight}
												>
													1. To generate a personal discount code,
													click on the button
												</Text>
												<Text
													as="p"
													variant={config.body.variant}
													fontWeight={config.body.fontWeight}
												>
													2. To send an email with a personal
													discount, enter your email, allow email
													sending and click on the button
												</Text>
											</div>
										)}
									</BlockStack>

									<InlineStack gap="300" align="center">
										{discountCode ? (
											<FormOnSubmit
												discount={discountCode}
												ENV={ENV}
												bodyColor={bodyColor}
												titleColor={titleColor}
											/>
										) : (
											<button
												className="Polaris-Button"
												type="button"
												style={{
													background: btnBackground,
													color: btnColor,
													borderRadius: config.button.borderRadius,
													outline: `2px solid ${btnDiscountHover}`,
												}}
												onClick={generateDiscount}
												onMouseOver={() =>
													setBtnDiscountHover("#363636")
												}
												onMouseOut={() =>
													setBtnDiscountHover("transparent")
												}
											>
												<span className="Polaris-Button__Content">
													<span className="Polaris-Button__Text">
														{config.button.text}
													</span>
												</span>
											</button>
										)}
									</InlineStack>

									<BlockStack gap="200">
										<div
											style={{
												color: titleColor,
											}}
										>
											<Text
												as="p"
												variant={config.title.variant}
												fontWeight={config.title.fontWeight}
											>
												Customisation
											</Text>
										</div>
										<div
											style={{
												color: bodyColor,
											}}
										>
											{sidebarOpen ? (
												<Link onClick={toggleSidebar}>
													Close admin panel
												</Link>
											) : (
												<Text
													as="p"
													variant={config.body.variant}
													fontWeight={config.body.fontWeight}
												>
													To customise the Bar,{" "}
													<Link onClick={toggleSidebar}>
														open the admin panel
													</Link>
												</Text>
											)}
										</div>
									</BlockStack>
								</BlockStack>
							</div>
						</div>
					</Layout.Section>
					{sidebarOpen && (
						<Layout.Section variant="oneThird">
							<AdminPanel
								config={config}
								setConfig={setConfig}
								initialConfig={initialConfig}
							/>
						</Layout.Section>
					)}
				</Layout>
			</BlockStack>
		</Page>
	);
}

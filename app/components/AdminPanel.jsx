import { useState, useCallback } from "react";
import {
	Collapsible,
	ButtonGroup,
	ColorPicker,
	Scrollable,
	BlockStack,
	TextField,
	Divider,
	Button,
	Select,
	Text,
	Card,
} from "@shopify/polaris";

import { CustomNumberChangeField } from "./CustomNumberChangeField";
import { CustomFontWeightSelect } from "./CustomFontWeightSelect";

export const AdminPanel = ({ config, setConfig, initialConfig }) => {
	const [btnBackground, setBtnBackground] = useState(config.button.background);
	const [titleTextColor, setTitleTextColor] = useState(config.title.color);
	const [bodyTextColor, setBodyTextColor] = useState(config.body.color);
	const [isFirstBtnActive, setIsFirstBtnActive] = useState(true);
	const [btnColor, setBtnColor] = useState(config.button.color);
	const [barBackgroundColor, setBarBackgroundColor] = useState(
		config.bar.background
	);

	const [textOpen, setTextOpen] = useState(false);
	const [btnOpen, setBtnOpen] = useState(false);
	const [barOpen, setBarOpen] = useState(false);

	const handleTextOpen = () => setTextOpen(!textOpen);
	const handleBtnOpen = () => setBtnOpen(!btnOpen);
	const handleBarOpen = () => setBarOpen(!barOpen);

	const handleFirstBtnClick = useCallback(() => {
		if (isFirstBtnActive) return;
		setIsFirstBtnActive(true);
	}, [isFirstBtnActive]);

	const handleSecondBtnClick = useCallback(() => {
		if (!isFirstBtnActive) return;
		setIsFirstBtnActive(false);
	}, [isFirstBtnActive]);

	const handleConfigChange = (category, property, value) => {
		setConfig((prevConfig) => {
			const newConfig = {
				...prevConfig,
				[category]: {
					...prevConfig[category],
					[property]: value,
				},
			};

			localStorage.setItem("appConfig", JSON.stringify(newConfig));
			return newConfig;
		});
	};

	const handleConfigReset = () => {
		setConfig(() => {
			const newConfig = initialConfig;

			localStorage.setItem("appConfig", JSON.stringify(newConfig));
			return newConfig;
		});
	};

	return (
		<Card>
			<Scrollable style={{ height: "90vh" }} focusable>
				<BlockStack gap="500">
					<BlockStack gap="200">
						<Text as="h2" variant="headingMd">
							Admin Panel{" "}
						</Text>
						<Text variant="bodyMd" as="p">
							Here you can change the appearance of this app
						</Text>
					</BlockStack>

					<BlockStack gap="200">
						<Button
							fullWidth
							textAlign="left"
							disclosure={barOpen ? "up" : "down"}
							onClick={handleBarOpen}
						>
							Bar Settings
						</Button>

						<Collapsible
							open={barOpen}
							transition={{
								duration: "500ms",
								timingFunction: "ease-in-out",
							}}
						>
							<BlockStack gap="200">
								<Card sectioned>
									<Text variant="headingMd" as="p">
										Background color
									</Text>
									<ColorPicker
										fullWidth
										color={barBackgroundColor}
										onChange={(color) => {
											setBarBackgroundColor(color);
											handleConfigChange("bar", "background", color);
										}}
										allowAlpha
									/>
								</Card>

								<CustomNumberChangeField
									title="Bar padding"
									value={config.bar.padding}
									category="bar"
									property="padding"
									handleConfigChange={handleConfigChange}
									min={0}
									max={300}
								/>

								<CustomNumberChangeField
									title="Bar position"
									value={config.bar.position}
									category="bar"
									property="position"
									handleConfigChange={handleConfigChange}
									min={0}
									max={400}
								/>
							</BlockStack>
						</Collapsible>

						<Divider />

						<Button
							fullWidth
							textAlign="left"
							disclosure={textOpen ? "up" : "down"}
							onClick={handleTextOpen}
						>
							Text Settings
						</Button>

						<Collapsible
							open={textOpen}
							transition={{
								duration: "500ms",
								timingFunction: "ease-in-out",
							}}
						>
							<BlockStack gap="200">
								<Card sectioned>
									<Text variant="headingMd" as="p">
										Color
									</Text>
									{isFirstBtnActive ? (
										<ColorPicker
											fullWidth
											color={titleTextColor}
											onChange={(color) => {
												setTitleTextColor(color);
												handleConfigChange("title", "color", color);
											}}
											allowAlpha
										/>
									) : (
										<ColorPicker
											fullWidth
											color={bodyTextColor}
											onChange={(color) => {
												setBodyTextColor(color);
												handleConfigChange("body", "color", color);
											}}
											allowAlpha
										/>
									)}
									<ButtonGroup variant="segmented" fullWidth>
										<Button
											size="micro"
											pressed={isFirstBtnActive}
											onClick={handleFirstBtnClick}
										>
											Title text
										</Button>
										<Button
											size="micro"
											pressed={!isFirstBtnActive}
											onClick={handleSecondBtnClick}
										>
											Body text
										</Button>
									</ButtonGroup>
								</Card>

								<Card sectioned>
									<Text variant="headingMd" as="p">
										Title text
									</Text>
									<Select
										label="Font size"
										options={[
											{ label: "Small", value: "headingSm" },
											{ label: "Medium", value: "headingMd" },
											{ label: "Large", value: "headingLg" },
											{
												label: "Extra Large",
												value: "headingXl",
											},
											{ label: "Huge", value: "heading2xl" },
											{ label: "Very Huge", value: "heading3xl" },
										]}
										onChange={(value) =>
											handleConfigChange("title", "variant", value)
										}
										value={config.title.variant}
									/>
									<CustomFontWeightSelect
										value={config.title.fontWeight}
										handleConfigChange={handleConfigChange}
										category="title"
										property="fontWeight"
									/>
								</Card>

								<Card sectioned>
									<Text variant="headingMd" as="p">
										Body text
									</Text>
									<Select
										label="Font size"
										options={[
											{ label: "Small", value: "bodySm" },
											{ label: "Medium", value: "bodyMd" },
											{ label: "Large", value: "bodyLg" },
										]}
										onChange={(value) =>
											handleConfigChange("body", "variant", value)
										}
										value={config.body.variant}
									/>
									<CustomFontWeightSelect
										value={config.body.fontWeight}
										handleConfigChange={handleConfigChange}
										category="body"
										property="fontWeight"
									/>
								</Card>
							</BlockStack>
						</Collapsible>

						<Divider />

						<Button
							fullWidth
							textAlign="left"
							disclosure={btnOpen ? "up" : "down"}
							onClick={handleBtnOpen}
						>
							Button Settings
						</Button>

						<Collapsible
							open={btnOpen}
							transition={{
								duration: "500ms",
								timingFunction: "ease-in-out",
							}}
						>
							<BlockStack gap="200">
								<Card sectioned>
									<Text variant="headingMd" as="p">
										Color
									</Text>
									{isFirstBtnActive ? (
										<ColorPicker
											fullWidth
											color={btnBackground}
											onChange={(color) => {
												setBtnBackground(color);
												handleConfigChange(
													"button",
													"background",
													color
												);
											}}
											allowAlpha
										/>
									) : (
										<ColorPicker
											fullWidth
											color={btnColor}
											onChange={(color) => {
												setBtnColor(color);
												handleConfigChange(
													"button",
													"color",
													color
												);
											}}
											allowAlpha
										/>
									)}
									<ButtonGroup variant="segmented" fullWidth>
										<Button
											size="micro"
											pressed={isFirstBtnActive}
											onClick={handleFirstBtnClick}
										>
											Background
										</Button>
										<Button
											size="micro"
											pressed={!isFirstBtnActive}
											onClick={handleSecondBtnClick}
										>
											Text
										</Button>
									</ButtonGroup>
								</Card>

								<Card sectioned>
									<Text variant="headingMd" as="p">
										Button text
									</Text>
									<TextField
										label="Enter button text"
										value={config.button.text}
										onChange={(value) => {
											handleConfigChange("button", "text", value);
										}}
										error={
											!config.button.text &&
											"Please enter a value between 0 and 300"
										}
										autoComplete="off"
									/>
								</Card>

								<CustomNumberChangeField
									title="Border radius"
									value={config.button.borderRadius}
									category="button"
									property="borderRadius"
									handleConfigChange={handleConfigChange}
									min={0}
									max={50}
								/>
							</BlockStack>
						</Collapsible>
					</BlockStack>
					<Button
						variant="plain"
						tone="critical"
						onClick={handleConfigReset}
					>
						Reset all settings
					</Button>
				</BlockStack>
			</Scrollable>
		</Card>
	);
};

import { Select } from "@shopify/polaris";

export const CustomFontWeightSelect = ({
	handleConfigChange,
	category,
	property,
	value,
}) => (
	<Select
		onChange={(value) => handleConfigChange(category, property, value)}
		options={[
			{ label: "Regular", value: "regular" },
			{ label: "Medium", value: "medium" },
			{ label: "Semibold", value: "semibold" },
			{ label: "Bold", value: "bold" },
		]}
		label="Font weight"
		value={value}
	/>
);

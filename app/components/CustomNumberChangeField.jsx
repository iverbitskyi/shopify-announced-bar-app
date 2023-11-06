import { TextField, RangeSlider, Text, Card } from "@shopify/polaris";

export const CustomNumberChangeField = ({
	handleConfigChange,
	category,
	property,
	title,
	value,
	min,
	max,
}) => (
	<Card sectioned>
		<Text variant="headingMd" as="p">
			{title}
		</Text>
		<TextField
			onChange={(value, min, max) => {
				const parsedValue = parseInt(value, 10);
				if (parsedValue <= min) handleConfigChange(category, property, 0);
				else if (parsedValue > max)
					handleConfigChange(category, property, max);
				else handleConfigChange(category, property, parsedValue);
			}}
			error={
				value !== 0 &&
				!value &&
				`Please enter a value between ${min} and ${max}`
			}
			label="Enter value in px"
			autoComplete="off"
			type="number"
			value={value}
			min={min}
			max={max}
		/>

		<RangeSlider
			onChange={(value) => handleConfigChange(category, property, value)}
			suffix={
				<p
					style={{
						minWidth: "24px",
						textAlign: "right",
					}}
				>
					{value} px
				</p>
			}
			label="Or move the slider"
			value={value}
			min={min}
			max={max}
			output
		/>
	</Card>
);

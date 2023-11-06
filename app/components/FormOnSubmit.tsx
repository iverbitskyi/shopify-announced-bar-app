import emailjs from "@emailjs/browser";
import { useState } from "react";
import {
	EmptyState,
	FormLayout,
	TextField,
	Checkbox,
	Layout,
	Button,
	Form,
} from "@shopify/polaris";

type EnvType = {
	EMAILJS_MAIL_SERVICE_ID: string;
	EMAILJS_TEMPLATE_ID: string;
	EMAILJS_PUBLIC_KEY: string;
};

export const FormOnSubmit = ({
	discount,
	ENV,
	bodyColor,
	titleColor,
}: {
	discount: string;
	ENV: EnvType;
	bodyColor: string;
	titleColor: string;
}) => {
	const [newsletter, setNewsletter] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [email, setEmail] = useState("");

	const handleNewsLetterChange = (value: boolean) => setNewsletter(value);

	const handleEmailChange = (value: string) => setEmail(value);

	const handleSubmit = async () => {
		if (email) {
			const params = {
				to_email: email,
				message: discount,
			};
			try {
				if (
					ENV.EMAILJS_MAIL_SERVICE_ID &&
					ENV.EMAILJS_TEMPLATE_ID &&
					ENV.EMAILJS_PUBLIC_KEY
				)
					await emailjs.send(
						ENV.EMAILJS_MAIL_SERVICE_ID,
						ENV.EMAILJS_TEMPLATE_ID,
						params,
						ENV.EMAILJS_PUBLIC_KEY
					);

				console.log("Email sent successfully!");
			} catch (error) {
				console.error("Error sending email:", error);
			}
		}

		setEmail("");
		setNewsletter(false);
		setEmailSent(true);
	};

	return (
		<Layout>
			{emailSent ? (
				<div
					style={{
						color: titleColor,
					}}
				>
					<EmptyState
						heading="Email sent to the entered mail"
						action={{
							content: "Go Home",
							url: "/app/",
						}}
						image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
						fullWidth
					>
						<div
							style={{
								color: bodyColor,
							}}
						>
							<p>to continue working, go back</p>{" "}
						</div>
					</EmptyState>
				</div>
			) : (
				<Form onSubmit={handleSubmit}>
					<FormLayout>
						<div
							style={{
								color: bodyColor,
							}}
						>
							<Checkbox
								label="I agree to receive emails"
								checked={newsletter}
								onChange={handleNewsLetterChange}
							/>

							<TextField
								value={email}
								onChange={handleEmailChange}
								label="Email"
								type="email"
								autoComplete="email"
								helpText={
									<span style={{ color: titleColor }}>
										We'll use this email to send you a discount code
									</span>
								}
							/>
						</div>

						<Button disabled={!email || !newsletter} submit>
							Send Email
						</Button>
					</FormLayout>
				</Form>
			)}
		</Layout>
	);
};

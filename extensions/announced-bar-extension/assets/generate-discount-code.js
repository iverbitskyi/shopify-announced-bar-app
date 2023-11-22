import { v4 as uuidv4 } from "uuid";
import { process } from "process";
import { emailjs } from "emailjs";

async function generateDiscountCode(email) {
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

		return responseJson.data.codeDiscountNode.codeDiscount.code;
	} else {
		const errorJson = await response.json();

		return errorJson.errors;
	}
}

async function sendEmail(email, discountCode) {
	const transporter = emailjs.createTransport({
		serviceId: process.env.EMAILJS_MAIL_SERVICE_ID,
		templateId: process.env.EMAILJS_TEMPLATE_ID,
		publicKey: process.env.EMAILJS_PUBLIC_KEY,
	});

	const mailOptions = {
		from: "ivan.verbitskyj@gmail.com",
		to: email,
		// subject: "Your discount code",
		templateData: {
			to_email: email,
			message: discountCode,
		},
	};

	transporter.send(mailOptions, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Email sent successfully");
		}
	});
}

const button = document.getElementById("generateDiscountButton");
button.addEventListener("click", (event) => {
	const email = document.getElementById("email").value;
	const discountCode = generateDiscountCode(email);
	document.getElementById("discount-code").innerHTML = discountCode;

	sendEmail(email, discountCode);
});

// import { z } from "zod";

// const envSchema = z.object({
// 	EMAILJS_MAIL_SERVICE_ID: z.string(),
// 	EMAILJS_TEMPLATE_ID: z.string(),
// 	EMAILJS_PUBLIC_KEY: z.string(),
// });

// type Env = z.infer<typeof envSchema>;

// declare global {
// 	var ENV: Env;
// 	interface Window {
// 		ENV: Env;
// 	}
// }

// export function getEnv() {
// 	return envSchema.parse(process.env);
// }

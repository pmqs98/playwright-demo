export interface Credentials {
	username: string;
	password: string;
}

export enum SauceUser {
	STANDARD = "standard_user",
	LOCKED_OUT = "locked_out_user",
	PROBLEM = "problem_user",
	PERFORMANCE_GLITCH = "performance_glitch_user",
}

export const PASSWORD = "secret_sauce";

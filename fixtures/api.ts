import { test as base, request as playwrightRequest } from "@playwright/test";
import { BookingApiClient } from "../utils/BookingApiClient";
import { BookingClientData } from "../utils/BookingClientData";
import { API_BASE_URL } from "../utils/apiConfig";

type ApiFixtures = {
	apiClient: BookingApiClient;
	bookingDataGenerator: BookingClientData;
};

type WorkerFixtures = {
	authToken: string;
};

export const test = base.extend<ApiFixtures, WorkerFixtures>({
	authToken: [
		async ({}, use) => {
			const context = await playwrightRequest.newContext({
				baseURL: API_BASE_URL,
			});
			const apiClient = new BookingApiClient(context);
			const token = await apiClient.getAuthToken();
			await use(token);

			await context.dispose();
		},
		{ scope: "worker" },
	],
	apiClient: async ({ request }, use) => {
		await use(new BookingApiClient(request));
	},

	bookingDataGenerator: async ({}, use) => {
		await use(new BookingClientData());
	},
});

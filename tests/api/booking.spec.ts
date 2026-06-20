import { test, expect } from "@playwright/test";
import { BookingApiClient, BookingData } from "../../utils/BookingApiClient";
import { BookingClientData } from "../../utils/BookingClientData";
import {
	BookingResponseSchema,
	CreateBookingResponse,
} from "../../utils/bookingSchema";

test.describe("Booking API - CRUD with auth", () => {
	let apiClient: BookingApiClient;
	let token: string;
	let bookingDataGenerator: BookingClientData;

	test.beforeEach(async ({ request }) => {
		apiClient = new BookingApiClient(request);
		token = await apiClient.getAuthToken();
		bookingDataGenerator = new BookingClientData();
	});

	test("GET all bookings returns 200", async () => {
		const response = await apiClient.getAllBookings();
		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(Array.isArray(body)).toBeTruthy();
	});

	test("GET booking by id matches expected schema", async () => {
		const listResponse = await apiClient.getAllBookings();
		const bookings = await listResponse.json();
		const bookingID = bookings[0].bookingid;

		const response = await apiClient.getBooking(bookingID);
		expect(response.status()).toBe(200);

		const bookingDetails = await response.json();
		BookingResponseSchema.parse(bookingDetails);
	});

	test("GET booking by invalid id returns 404", async () => {
		const response = await apiClient.getBooking(9999999);
		expect(response.status()).toBe(404);
	});

	test("create booking matches expected schema", async () => {
		const payload: BookingData =
			bookingDataGenerator.generateRandomBookingData();

		const response = await apiClient.createBooking(payload);
		expect(response.status()).toBe(200);

		const body = await response.json();
		CreateBookingResponse.parse(body);
	});

	test("update booking with valid token succeeds", async () => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const updatedPayload: BookingData = {
			firstname: "Updated",
			lastname: "Name",
			totalprice: 200,
			depositpaid: true,
			bookingdates: { checkin: "2025-06-01", checkout: "2025-06-05" },
		};

		const response = await apiClient.updateBooking(id, token, updatedPayload);
		expect(response.status()).toBe(200);

		const { firstname } = await response.json();
		expect(firstname).toBe("Updated");
	});

	test("delete booking with valid token", async () => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, token);
		expect(response.status()).toBe(201);
	});

	test("delete booking with invalid token returns 403", async () => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, "wrong token");
		expect(response.status()).toBe(403);
	});

	test("create booking with missing required fields returns 500 (possibly unintended)", async () => {
		const payload = {
			firstname: "OnlyFirstName",
		};
		const response = await apiClient.createBooking(payload as BookingData);
		expect(response.status()).toBe(500);
	});

	test("PATCH partial update on a booking succeds", async () => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const partialPayload = {
			firstname: "Partial",
			lastname: "Update",
		};

		const response = await apiClient.patchBooking(
			id,
			token,
			partialPayload as BookingData,
		);
		expect(response.status()).toBe(200);

		const { firstname, lastname } = await response.json();
		expect(firstname).toBe("Partial");
		expect(lastname).toBe("Update");
	});
});

import { test, expect } from "../../fixtures";
import { BookingData } from "../../utils/BookingApiClient";
import {
	BookingResponseSchema,
	CreateBookingResponse,
} from "../../utils/bookingSchema";

test.describe("Booking API - CRUD with auth", () => {
	test("GET all bookings returns 200 @smoke @api", async ({ apiClient }) => {
		const response = await apiClient.getAllBookings();
		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(Array.isArray(body)).toBeTruthy();
	});

	test("GET booking by id matches expected schema @regression @api", async ({
		apiClient,
	}) => {
		const listResponse = await apiClient.getAllBookings();
		const bookings = await listResponse.json();
		const bookingID = bookings[0].bookingid;

		const response = await apiClient.getBooking(bookingID);
		expect(response.status()).toBe(200);

		const bookingDetails = await response.json();
		BookingResponseSchema.parse(bookingDetails);
	});

	test("GET booking by invalid id returns 404 @regression @api", async ({
		apiClient,
	}) => {
		const response = await apiClient.getBooking(9999999);
		expect(response.status()).toBe(404);
	});

	test("create booking matches expected schema @smoke @api", async ({
		apiClient,
		bookingDataGenerator,
	}) => {
		const payload: BookingData =
			bookingDataGenerator.generateRandomBookingData();

		const response = await apiClient.createBooking(payload);
		expect(response.status()).toBe(200);

		const body = await response.json();
		CreateBookingResponse.parse(body);
	});

	test("update booking with valid token succeeds @regression @api", async ({
		apiClient,
		bookingDataGenerator,
		authToken,
	}) => {
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

		const response = await apiClient.updateBooking(
			id,
			authToken,
			updatedPayload,
		);
		expect(response.status()).toBe(200);

		const { firstname } = await response.json();
		expect(firstname).toBe("Updated");
	});

	test("delete booking with valid token @regression @api", async ({
		apiClient,
		bookingDataGenerator,
		authToken,
	}) => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, authToken);
		expect(response.status()).toBe(201);
	});

	test("delete booking with invalid token returns 403 @regression @api", async ({
		apiClient,
		bookingDataGenerator,
	}) => {
		const createResponse = await apiClient.createBooking(
			bookingDataGenerator.generateRandomBookingData(),
		);

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, "wrong token");
		expect(response.status()).toBe(403);
	});

	test("create booking with missing required fields returns 500 (possibly unintended) @regression @api", async ({
		apiClient,
	}) => {
		const payload = {
			firstname: "OnlyFirstName",
		};
		const response = await apiClient.createBooking(payload as BookingData);
		expect(response.status()).toBe(500);
	});

	test("PATCH partial update on a booking suceeds @regression @api", async ({
		apiClient,
		bookingDataGenerator,
		authToken,
	}) => {
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
			authToken,
			partialPayload,
		);
		expect(response.status()).toBe(200);

		const { firstname, lastname } = await response.json();
		expect(firstname).toBe("Partial");
		expect(lastname).toBe("Update");
	});
});

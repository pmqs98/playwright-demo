import { test, expect } from "@playwright/test";
import { BookingApiClient, BookingData } from "../../utils/BookingApiClient";

test.describe("Booking API - CRUD with auth", () => {
	let apiClient: BookingApiClient;
	let token: string;

	test.beforeEach(async ({ request }) => {
		apiClient = new BookingApiClient(request);
		token = await apiClient.getAuthToken();
	});

	test("GET all bookings returns 200", async () => {
		const response = await apiClient.getAllBookings();
		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(Array.isArray(body)).toBeTruthy();
	});

	test("GET booking by id returns booking details", async () => {
		const listResponse = await apiClient.getAllBookings();
		const bookings = await listResponse.json();
		const bookingID = bookings[0].bookingid;

		const response = await apiClient.getBooking(bookingID);
		expect(response.status()).toBe(200);

		const bookingDetails = await response.json();

		expect(bookingDetails).toHaveProperty("firstname");
		expect(bookingDetails).toHaveProperty("lastname");
		expect(bookingDetails).toHaveProperty("totalprice");
	});

	test("GET booking by invalid id returns 404", async () => {
		const response = await apiClient.getBooking(9999999);
		expect(response.status()).toBe(404);
	});

	test("create a booking returns booking id", async () => {
		const payload: BookingData = {
			firstname: "Jane",
			lastname: "Doe",
			totalprice: 759,
			depositpaid: true,
			bookingdates: { checkin: "2020-05-20", checkout: "2020-05-27" },
		};

		const response = await apiClient.createBooking(payload);
		expect(response.status()).toBe(200);

		const body = await response.json();
		expect(body).toHaveProperty("bookingid");
		expect(body.booking.firstname).toBe("Jane");
	});

	test("update booking with valid token succeeds", async () => {
		const createResponse = await apiClient.createBooking({
			firstname: "Original",
			lastname: "Name",
			totalprice: 100,
			depositpaid: false,
			bookingdates: { checkin: "2025-02-01", checkout: "2025-02-05" },
		});

		const { bookingid: id } = await createResponse.json();

		const updateResponse: BookingData = {
			firstname: "Updated",
			lastname: "Name",
			totalprice: 200,
			depositpaid: true,
			bookingdates: { checkin: "2025-06-01", checkout: "2025-06-05" },
		};

		const response = await apiClient.updateBooking(id, token, updateResponse);
		expect(response.status()).toBe(200);

		const { firstname } = await response.json();
		expect(firstname).toBe("Updated");
	});

	test("delete booking with valid token", async () => {
		const createResponse = await apiClient.createBooking({
			firstname: "Original",
			lastname: "Name",
			totalprice: 100,
			depositpaid: false,
			bookingdates: { checkin: "2025-02-01", checkout: "2025-02-05" },
		});

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, token);
		expect(response.status()).toBe(201);
	});

	test("delete booking with invalid token returns 403", async () => {
		const createResponse = await apiClient.createBooking({
			firstname: "Original",
			lastname: "Name",
			totalprice: 100,
			depositpaid: false,
			bookingdates: { checkin: "2025-02-01", checkout: "2025-02-05" },
		});

		const { bookingid: id } = await createResponse.json();

		const response = await apiClient.deleteBooking(id, "wrong token");
		expect(response.status()).toBe(403);
	});
});

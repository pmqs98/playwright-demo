import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "./apiConfig";

export interface BookingDates {
	checkin: string;
	checkout: string;
}

export interface BookingData {
	firstname: string;
	lastname: string;
	totalprice: number;
	depositpaid: boolean;
	bookingdates: BookingDates;
	additionalneeds?: string;
}

export class BookingApiClient {
	constructor(private request: APIRequestContext) {}

	async getAuthToken(): Promise<string> {
		const response = await this.request.post(`${API_BASE_URL}/auth`, {
			data: {
				username: "admin",
				password: "password123",
			},
		});
		const body = await response.json();
		return body.token;
	}

	async createBooking(bookingData: BookingData) {
		return await this.request.post(`${API_BASE_URL}/booking`, {
			data: bookingData,
		});
	}

	async getAllBookings() {
		return await this.request.get(`${API_BASE_URL}/booking`);
	}

	async getBooking(id: number) {
		return await this.request.get(`${API_BASE_URL}/booking/${id}`);
	}

	async updateBooking(id: number, token: string, bookingData: BookingData) {
		return await this.request.put(`${API_BASE_URL}/booking/${id}`, {
			data: bookingData,
			headers: { Cookie: `token=${token}` },
		});
	}

	async deleteBooking(id: number, token: string) {
		return await this.request.delete(`${API_BASE_URL}/booking/${id}`, {
			headers: { Cookie: `token=${token}` },
		});
	}
}

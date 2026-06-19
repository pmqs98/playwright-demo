import { fakerPT_PT } from "@faker-js/faker";
import { BookingData } from "./BookingApiClient";

export class BookingClientData {
	generateRandomBookingData(): BookingData {
		const checkin: Date = fakerPT_PT.date.anytime();
		const checkout: Date = fakerPT_PT.date.soon({ days: 14, refDate: checkin });
		const payload: BookingData = {
			firstname: fakerPT_PT.person.firstName(),
			lastname: fakerPT_PT.person.lastName(),
			totalprice: fakerPT_PT.number.int(),
			depositpaid: fakerPT_PT.datatype.boolean(),
			bookingdates: {
				checkin: checkin.toISOString().split("T")[0],
				checkout: checkout.toISOString().split("T")[0],
			},
		};
		return payload;
	}
}

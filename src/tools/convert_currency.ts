import { z } from "zod";
import {
	FRANKFURTER_API_BASE,
	type ExchangeRateResponse,
	type ToolResponse,
} from "../types";

export const convertCurrencySchema = {
	from: z
		.string()
		.length(3)
		.describe("Source currency code (e.g., USD, EUR)"),
	to: z.string().length(3).describe("Target currency code (e.g., USD, EUR)"),
	amount: z.number().positive().describe("Amount to convert"),
};

export type ConvertCurrencyInput = {
	from: string;
	to: string;
	amount: number;
};

export type ConvertCurrencyOutput = ExchangeRateResponse & {
	conversion: {
		from: string;
		to: string;
		amount: number;
		result: number;
		rate: number;
	};
};

export async function convertCurrency(
	input: ConvertCurrencyInput,
): Promise<ToolResponse> {
	const { from, to, amount } = input;

	try {
		const url = `${FRANKFURTER_API_BASE}/latest?base=${from.toUpperCase()}&symbols=${to.toUpperCase()}`;
		const response = await fetch(url);

		if (!response.ok) {
			return {
				content: [
					{
						type: "text",
						text: `Error: Unable to fetch exchange rate. Status: ${response.status}`,
					},
				],
			};
		}

		const data = (await response.json()) as ExchangeRateResponse;

		if (!data.rates || !data.rates[to.toUpperCase()]) {
			return {
				content: [
					{
						type: "text",
						text: `Error: Exchange rate not available for ${from.toUpperCase()} to ${to.toUpperCase()}`,
					},
				],
			};
		}

		const rate = data.rates[to.toUpperCase()];
		const convertedAmount = Math.round(amount * rate * 100) / 100;

		const result: ConvertCurrencyOutput = {
			...data,
			conversion: {
				from: from.toUpperCase(),
				to: to.toUpperCase(),
				amount: amount,
				result: convertedAmount,
				rate: rate,
			},
		};

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(result),
				},
			],
		};
	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error: Failed to convert currency - ${error instanceof Error ? error.message : "Unknown error"}`,
				},
			],
		};
	}
}

import { z } from "zod";
import {
	FRANKFURTER_API_BASE,
	type ExchangeRateResponse,
	type ToolResponse,
} from "../types";

export const getHistoricalRatesSchema = {
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.describe("Date in YYYY-MM-DD format"),
	base: z
		.string()
		.length(3)
		.optional()
		.describe("Base currency code (default: EUR)"),
	symbols: z
		.string()
		.optional()
		.describe("Comma-separated currency codes to limit results"),
};

export type GetHistoricalRatesInput = {
	date: string;
	base?: string;
	symbols?: string;
};

export type GetHistoricalRatesOutput = ExchangeRateResponse;

export async function getHistoricalRates(
	input: GetHistoricalRatesInput,
): Promise<ToolResponse> {
	const { date, base, symbols } = input;

	try {
		const params = new URLSearchParams();
		if (base) params.append("base", base.toUpperCase());
		if (symbols) params.append("symbols", symbols.toUpperCase());

		const url = `${FRANKFURTER_API_BASE}/${date}${params.toString() ? `?${params.toString()}` : ""}`;
		const response = await fetch(url);

		if (!response.ok) {
			return {
				content: [
					{
						type: "text",
						text: `Error: Unable to fetch historical rates. Status: ${response.status}`,
					},
				],
			};
		}

		const data = (await response.json()) as ExchangeRateResponse;

		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(data),
				},
			],
		};
	} catch (error) {
		return {
			content: [
				{
					type: "text",
					text: `Error: Failed to fetch historical rates - ${error instanceof Error ? error.message : "Unknown error"}`,
				},
			],
		};
	}
}

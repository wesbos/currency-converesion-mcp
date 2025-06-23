import { z } from "zod";
import {
	FRANKFURTER_API_BASE,
	type ExchangeRateResponse,
	type ToolResponse,
} from "../types";

export const getLatestRatesSchema = {
	base: z
		.string()
		.length(3)
		.optional()
		.describe("Base currency code (default: EUR)"),
	symbols: z
		.string()
		.optional()
		.describe(
			"Comma-separated currency codes to limit results (e.g., USD,GBP,JPY)",
		),
};

export type GetLatestRatesInput = {
	base?: string;
	symbols?: string;
};

export type GetLatestRatesOutput = ExchangeRateResponse;

export async function getLatestRates(
	input: GetLatestRatesInput,
): Promise<ToolResponse> {
	const { base, symbols } = input;

	try {
		const params = new URLSearchParams();
		if (base) params.append("base", base.toUpperCase());
		if (symbols) params.append("symbols", symbols.toUpperCase());

		const url = `${FRANKFURTER_API_BASE}/latest${params.toString() ? `?${params.toString()}` : ""}`;
		const response = await fetch(url);

		if (!response.ok) {
			return {
				content: [
					{
						type: "text",
						text: `Error: Unable to fetch exchange rates. Status: ${response.status}`,
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
					text: `Error: Failed to fetch exchange rates - ${error instanceof Error ? error.message : "Unknown error"}`,
				},
			],
		};
	}
}

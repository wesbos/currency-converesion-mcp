import {
	FRANKFURTER_API_BASE,
	type CurrenciesResponse,
	type ToolResponse,
} from "../types";

export const getCurrenciesSchema = {};

export type GetCurrenciesInput = Record<string, never>;

export type GetCurrenciesOutput = CurrenciesResponse;

export async function getCurrencies(
	_input: GetCurrenciesInput,
): Promise<ToolResponse> {
	try {
		const url = `${FRANKFURTER_API_BASE}/currencies`;
		const response = await fetch(url);

		if (!response.ok) {
			return {
				content: [
					{
						type: "text",
						text: `Error: Unable to fetch currencies. Status: ${response.status}`,
					},
				],
			};
		}

		const data = (await response.json()) as CurrenciesResponse;

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
					text: `Error: Failed to fetch currencies - ${error instanceof Error ? error.message : "Unknown error"}`,
				},
			],
		};
	}
}

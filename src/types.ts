export interface ExchangeRateResponse {
	base: string;
	date: string;
	rates: Record<string, number>;
}

export interface CurrenciesResponse {
	[currencyCode: string]: string;
}

export interface ToolResponse {
	[x: string]: unknown;
	content: Array<{
		[x: string]: unknown;
		type: "text";
		text: string;
	}>;
	_meta?: {
		[x: string]: unknown;
	};
	structuredContent?: {
		[x: string]: unknown;
	};
	isError?: boolean;
}

export const FRANKFURTER_API_BASE = "https://api.frankfurter.dev/v1";

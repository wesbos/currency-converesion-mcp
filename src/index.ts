import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";

import {
  convertCurrency,
  convertCurrencySchema,
} from "./tools/convert_currency";
import { getCurrencies, getCurrenciesSchema } from "./tools/get_currencies";
import {
  getHistoricalRates,
  getHistoricalRatesSchema,
} from "./tools/get_historical_rates";
import {
  getLatestRates,
  getLatestRatesSchema,
} from "./tools/get_latest_rates";

export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Currency Converter",
    version: "1.0.0",
  });

  async init() {
    this.server.tool("convert_currency", convertCurrencySchema, async (input) =>
      convertCurrency(input),
    );

    this.server.tool("get_latest_rates", getLatestRatesSchema, async (input) =>
      getLatestRates(input),
    );

    this.server.tool("get_currencies", getCurrenciesSchema, async (input) =>
      getCurrencies(input),
    );

    this.server.tool(
      "get_historical_rates",
      getHistoricalRatesSchema,
      async (input) => getHistoricalRates(input),
    );
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }

    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }

    return new Response("Not found", { status: 404 });
  },
};

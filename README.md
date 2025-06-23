# MCP Currency Converter Server

An MCP server that provides real-time currency conversion and exchange rate data using the Frankfurter API.


## Using

URL base is https://currency-mcp.wesbos.com

There are two endpoints - `/mcp` for [streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) and `/sse` for legacy HTTP+SSE.

Right now many clients do not offer support for streamable http, so you can use it with a proxy:

```json
{
  "mcpServers": {
    "currency-conversion": {
      "command": "npx",
      "args": ["mcp-remote", "https://currency-mcp.wesbos.com/sse"]
    }
  },
}
```

## Available Tools

### `convert_currency`

Convert an amount from one currency to another.

**Parameters:**

- `from` (string): Source currency code (3 letters, e.g., "USD", "EUR")
- `to` (string): Target currency code (3 letters, e.g., "USD", "EUR")
- `amount` (number): Amount to convert (positive number)

**Example:** Convert 100 USD to EUR

```json
{
  "from": "USD",
  "to": "EUR",
  "amount": 100
}
```

### `get_latest_rates`

Fetch the latest exchange rates.

**Parameters:**

- `base` (string, optional): Base currency code (defaults to EUR)
- `symbols` (string, optional): Comma-separated currency codes to limit results

**Example:** Get USD rates for specific currencies

```json
{
  "base": "USD",
  "symbols": "EUR,GBP,JPY"
}
```

### `get_currencies`

List all available currencies with their full names.

**Parameters:** None

### `get_historical_rates`

Get historical exchange rates for a specific date.

**Parameters:**

- `date` (string): Date in YYYY-MM-DD format
- `base` (string, optional): Base currency code (defaults to EUR)
- `symbols` (string, optional): Comma-separated currency codes to limit results

**Example:** Get historical EUR rates for January 1, 2024

```json
{
  "date": "2024-01-01",
  "base": "EUR",
  "symbols": "USD,GBP"
}
```

## Data Source

Exchange rate data is provided by the [Frankfurter API](https://frankfurter.dev/)

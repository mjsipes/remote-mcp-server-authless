import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_calculate(server: McpServer) {
  server.tool(
    "calculate",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      a: z.number(),
      b: z.number(),
    },
    async ({ operation, a, b }) => {
      let result: number;
      switch (operation) {
        case "add":
          result = a + b;
          break;
        case "subtract":
          result = a - b;
          break;
        case "multiply":
          result = a * b;
          break;
        case "divide":
          if (b === 0)
            return {
              content: [
                {
                  type: "text",
                  text: "Error: Cannot divide by zero",
                },
              ],
            };
          result = a / b;
          break;
      }
      return { content: [{ type: "text", text: String(result) }] };
    }
  );
} 
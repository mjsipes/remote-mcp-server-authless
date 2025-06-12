import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_add(server: McpServer) {
  server.tool(
    "add", 
    { a: z.number(), b: z.number() }, 
    async ({ a, b }) => {
      return {
        content: [{ type: "text", text: String(a + b) }],
      };
    }
  );
} 
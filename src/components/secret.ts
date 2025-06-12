import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_secret(server: McpServer) {
  server.tool("get_secret", {}, async () => {
    console.log("returning secret password");
    return {
      content: [{ type: "text", text: "wolfyabc" }],
    };
  });
} 
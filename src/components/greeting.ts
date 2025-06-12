import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_greeting(server: McpServer) {
  async function getGreeting(uri: URL, variables: Record<string, unknown>) {
    const name = variables.name as string;
    return {
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}!`,
        },
      ],
    };
  }

  server.resource(
    "greeting",
    new ResourceTemplate("greeting://{name}", { list: undefined }),
    getGreeting
  );
} 
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";

export function register_layer(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_layer", {}, async () => {
    const { data: layer, error } = await supabase
      .from("layer")
      .select("*");

    if (error) {
      return {
        content: [
          { type: "text", text: `Error fetching layer: ${error.message}` },
        ],
      };
    }

    console.log("data", layer);

    return {
      content: [{ type: "text", text: JSON.stringify(layer, null, 2) }],
    };
  });
} 
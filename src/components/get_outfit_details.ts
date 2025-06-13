import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";

export function register_get_outfit_details(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_outfit_details", {}, async () => {
    const { data, error } = await supabase.rpc("get_outfit_details", {
        outfit_uuid: "4efe9847-a023-4490-8257-0a3730ce1f2f"
    });

    if (error) {
      return {
        content: [
          { type: "text", text: `Error getting outfit details: ${error.message}` },
        ],
      };
    }

    console.log("data", data);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });
} 
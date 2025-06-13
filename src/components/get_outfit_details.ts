import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";


export function register_get_outfit_details(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_outfit_details", { outfit_id: z.string() },  async ({outfit_id}) => {
    const { data, error } = await supabase.rpc("get_outfit_details", {
        outfit_uuid: outfit_id,
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
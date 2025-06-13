import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";


export function register_calculate_outfit_warmth(server: McpServer, supabase: SupabaseClient) {
  server.tool("calculate_outfit_warmth", { outfit_id: z.string() }, async ({outfit_id}) => {
    const { data, error } = await supabase.rpc("calculate_outfit_warmth", {
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
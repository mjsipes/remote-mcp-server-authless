import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";


export function register_get_weather(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_weather", { lat: z.number(), long: z.number(), date: z.string() },  async ({lat, long, date}) => {
    const { data, error } = await supabase.functions.invoke("get_weather", {
        body: { 
          latitude: lat,
          longitude: long,
          date: date,
          unitGroup: "us"
        }
      });

    if (error) {
      return {
        content: [
          { type: "text", text: `Error getting weather: ${error.message}` },
        ],
      };
    }

    console.log("data", data);

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });
} 
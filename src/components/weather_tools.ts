import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";


export function register_weather_tools(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_weather", { lat: z.number(), long: z.number(), date: z.string() },  async ({lat, long, date}) => {
    console.log("get_weather");
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

  server.tool("get_weather_by_id", { id: z.string() }, async ({ id }) => {
    console.log("get_weather_by_id");
    const { data, error } = await supabase
      .from("weather")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return {
        content: [
          { type: "text", text: `Error getting weather: ${error.message}` },
        ],
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });
} 
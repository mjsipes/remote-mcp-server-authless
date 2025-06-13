import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export function register_logs(server: McpServer, supabase: SupabaseClient) {
  server.tool(
    "get_logs_by_date",
    { date: z.string() },
    async ({ date }) => {
      const { data, error } = await supabase.rpc("get_logs_by_date", { 
        log_date: date  // ✅ Fixed: Use log_date parameter name
      });
      if (error) {
        return {
          content: [
            { type: "text", text: `Error getting logs by date: ${error.message}` },
          ],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_logs_date_range",
    { start_date: z.string(), end_date: z.string() },
    async ({ start_date, end_date }) => {
      const { data, error } = await supabase.rpc("get_logs_date_range", { 
        start_date,   // ✅ These match the function parameters
        end_date 
      });
      if (error) {
        return {
          content: [
            { type: "text", text: `Error getting logs by date range: ${error.message}` },
          ],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_logs_by_outfit",
    { outfit_id: z.string() },
    async ({ outfit_id }) => {
      const { data, error } = await supabase.rpc("get_logs_by_outfit", { 
        outfit_uuid: outfit_id  // ✅ This was already correct
      });
      if (error) {
        return {
          content: [
            { type: "text", text: `Error getting logs by outfit: ${error.message}` },
          ],
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
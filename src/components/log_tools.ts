import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export function register_log_tools(server: McpServer, supabase: SupabaseClient) {

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

  server.tool(
    "get_all_logs",
    {},
    async () => {
      const { data, error } = await supabase
        .from('log')
        .select('*');
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error getting all logs: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }]
      };
    }
  );

  server.tool(
    "insert_log",
    {
      outfit_id: z.string().optional(),
      weather_id: z.string().optional(),
      date: z.string().optional(),
      comfort_level: z.number().optional(),
      feedback: z.string().optional(),
      was_too_hot: z.boolean().optional(),
      was_too_cold: z.boolean().optional()
    },
    async ({ 
      outfit_id = null, 
      weather_id = null, 
      date = null, 
      comfort_level = null, 
      feedback = null, 
      was_too_hot = null, 
      was_too_cold = null 
    }) => {
      const { data, error } = await supabase
        .from('log')
        .insert({ 
          outfit_id: outfit_id || null, 
          weather_id: weather_id || null, 
          date: date || null, 
          comfort_level: comfort_level || null, 
          feedback: feedback || null, 
          was_too_hot: was_too_hot || null, 
          was_too_cold: was_too_cold || null 
        })
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error inserting log: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Log created successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );


  server.tool(
    "update_log",
    {
      id: z.string(),
      outfit_id: z.string().optional(),
      weather_id: z.string().optional(),
      date: z.string().optional(),
      comfort_level: z.number().optional(),
      feedback: z.string().optional(),
      was_too_hot: z.boolean().optional(),
      was_too_cold: z.boolean().optional()
    },
    async ({ 
      id,
      outfit_id = null, 
      weather_id = null, 
      date = null, 
      comfort_level = null, 
      feedback = null, 
      was_too_hot = null, 
      was_too_cold = null 
    }) => {
      const updates: { outfit_id?: string | null; weather_id?: string | null; date?: string | null; comfort_level?: number | null; feedback?: string | null; was_too_hot?: boolean | null; was_too_cold?: boolean | null } = {};
      if (outfit_id !== null) updates.outfit_id = outfit_id || null;
      if (weather_id !== null) updates.weather_id = weather_id || null;
      if (date !== null) updates.date = date || null;
      if (comfort_level !== null) updates.comfort_level = comfort_level || null;
      if (feedback !== null) updates.feedback = feedback || null;
      if (was_too_hot !== null) updates.was_too_hot = was_too_hot || null;
      if (was_too_cold !== null) updates.was_too_cold = was_too_cold || null;
  
      const { data, error } = await supabase
        .from('log')
        .update(updates)
        .eq('id', id)
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error updating log: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Log updated successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );

  server.tool(
    "delete_log",
    {
      id: z.string()
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from('log')
        .delete()
        .eq('id', id)
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error deleting log: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Log deleted successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );

}
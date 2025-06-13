import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export function register_outfit_layer_tools(server: McpServer, supabase: SupabaseClient) {
    server.tool(
        "add_outfit_layer",
        {
          outfit_id: z.string(),
          layer_id: z.string()
        },
        async ({ outfit_id, layer_id }) => {
          const { data, error } = await supabase
            .from('outfit_layer')
            .insert({ 
              outfit_id: outfit_id || null, 
              layer_id: layer_id || null 
            })
            .select();
      
          if (error) {
            return {
              content: [{ type: "text", text: `Error adding layer to outfit: ${error.message}` }],
              isError: true
            };
          }
      
          return {
            content: [{ type: "text", text: `Layer added to outfit successfully: ${JSON.stringify(data, null, 2)}` }]
          };
        }
      );
      
      server.tool(
        "delete_outfit_layer",
        {
          outfit_id: z.string().optional(),
          layer_id: z.string().optional(),
          id: z.string().optional()
        },
        async ({ outfit_id = null, layer_id = null, id = null }) => {
          let query = supabase.from('outfit_layer').delete().select();
          
          if (id) {
            query = query.eq('id', id);
          } else if (outfit_id && layer_id) {
            query = query.eq('outfit_id', outfit_id).eq('layer_id', layer_id);
          } else {
            return {
              content: [{ type: "text", text: "Error: Must provide either 'id' or both 'outfit_id' and 'layer_id'" }],
              isError: true
            };
          }
      
          const { data, error } = await query;
      
          if (error) {
            return {
              content: [{ type: "text", text: `Error removing layer from outfit: ${error.message}` }],
              isError: true
            };
          }
      
          return {
            content: [{ type: "text", text: `Layer removed from outfit successfully: ${JSON.stringify(data, null, 2)}` }]
          };
        }
      );
  }
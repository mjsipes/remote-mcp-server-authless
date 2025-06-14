import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export function register_layer_tools(server: McpServer, supabase: SupabaseClient) {
  server.tool("get_all_layers", {}, async () => {
    console.log("get_all_layers");
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

  server.tool(
    "insert_layer", 
    { 
      name: z.string().optional(), 
      description: z.string().optional(), 
      warmth: z.number().optional(),
      top: z.boolean().optional(),
      bottom: z.boolean().optional()
    },
    async ({ 
      name = null, 
      description = null, 
      warmth = null, 
      top = null, 
      bottom = null 
    }) => {
      console.log("insert_layer");
      const { data, error } = await supabase
        .from('layer')
        .insert({ name, description, warmth, top, bottom })
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error inserting layer: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Layer created successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );

  server.tool(
    "update_layer",
    {
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      warmth: z.number().optional(),
      top: z.boolean().optional(),
      bottom: z.boolean().optional()
    },
    async ({ 
      id,
      name = null, 
      description = null, 
      warmth = null, 
      top = null, 
      bottom = null 
    }) => {
      console.log("update_layer");
      const updates: { name?: string | null; description?: string | null; warmth?: number | null; top?: boolean | null; bottom?: boolean | null } = {};
      if (name !== null) updates.name = name || null;
      if (description !== null) updates.description = description || null;
      if (warmth !== null) updates.warmth = warmth || null;
      if (top !== null) updates.top = top || null;
      if (bottom !== null) updates.bottom = bottom || null;
  
      const { data, error } = await supabase
        .from('layer')
        .update(updates)
        .eq('id', id)
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error updating layer: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Layer updated successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );

  server.tool(
    "delete_layer",
    {
      id: z.string()
    },
    async ({ id }) => {
      console.log("delete_layer");
      const { data, error } = await supabase
        .from('layer')
        .delete()
        .eq('id', id)
        .select();
  
      if (error) {
        return {
          content: [{ type: "text", text: `Error deleting layer: ${error.message}` }],
          isError: true
        };
      }
  
      return {
        content: [{ type: "text", text: `Layer deleted successfully: ${JSON.stringify(data, null, 2)}` }]
      };
    }
  );
  
  
} 
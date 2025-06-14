import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";


export function register_calculate_outfit_warmth(server: McpServer, supabase: SupabaseClient) {
    console.log("register_calculate_outfit_warmth");
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

  server.tool("calculate_outfit_warmth_v2", { outfit_id: z.string() }, async ({outfit_id}) => {
      console.log("calculate_outfit_warmth_v2");
    // First, get the layers and calculate warmth
    const { data: layers, error: layersError } = await supabase
        .from('outfit_layer')
        .select(`
            layer (
                warmth,
                top,
                bottom
            )
        `)
        .eq('outfit_id', outfit_id);

    if (layersError) {
        return {
            content: [
                { type: "text", text: `Error getting layers: ${layersError.message}` },
            ],
        };
    }

    // Calculate warmth using the same formula as the database function
    const calculated_warmth = layers.reduce((total, ol) => {
        const layer = ol.layer;
        const coverage = (Number(layer.top) + Number(layer.bottom)) / 2;
        return total + (layer.warmth * coverage);
    }, 0);

    // Update the outfit with the calculated warmth
    const { error: updateError } = await supabase
        .from('outfit')
        .update({ total_warmth: calculated_warmth })
        .eq('id', outfit_id);

    if (updateError) {
        return {
            content: [
                { type: "text", text: `Error updating outfit: ${updateError.message}` },
            ],
        };
    }

    return {
        content: [{ type: "text", text: JSON.stringify(calculated_warmth, null, 2) }],
    };
});
} 
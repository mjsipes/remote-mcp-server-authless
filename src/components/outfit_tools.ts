import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

export function register_outfit_tools(
  server: McpServer,
  supabase: SupabaseClient
) {
  server.tool("get_all_outfits", {}, async () => {
    const { data, error } = await supabase
      .from("outfit")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return {
        content: [
          { type: "text", text: `Error getting outfits: ${error.message}` },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  });

  server.tool(
    "get_outfit_details",
    { outfit_id: z.string() },
    async ({ outfit_id }) => {
      const { data, error } = await supabase.rpc("get_outfit_details", {
        outfit_uuid: outfit_id,
      });

      if (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting outfit details: ${error.message}`,
            },
          ],
        };
      }

      console.log("data", data);

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "get_outfit_details_v2",
    { outfit_id: z.string() },
    async ({ outfit_id }) => {
      const { data, error } = await supabase
        .from("outfit")
        .select(
          `
            name,
            total_warmth,
            outfit_layer(
                layer(
                    name,
                    warmth,
                    top,
                    bottom
                )
            )
        `
        )
        .eq("id", outfit_id)
        .single();

      if (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error getting outfit details: ${error.message}`,
            },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );

  server.tool(
    "insert_outfit",
    {
      name: z.string().optional(),
    },
    async ({ name = null }) => {
      const { data, error } = await supabase
        .from("outfit")
        .insert({
          name: name || null,
          total_warmth: 0,
        })
        .select();

      if (error) {
        return {
          content: [
            { type: "text", text: `Error inserting outfit: ${error.message}` },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Outfit created successfully: ${JSON.stringify(
              data,
              null,
              2
            )}`,
          },
        ],
      };
    }
  );

  server.tool(
    "update_outfit",
    {
      id: z.string(),
      name: z.string().optional(),
      total_warmth: z.number().optional(),
    },
    async ({ id, name = null, total_warmth = null }) => {
      const updates: { name?: string | null; total_warmth?: number | null } =
        {};
      if (name !== null) updates.name = name || null;
      if (total_warmth !== null) updates.total_warmth = total_warmth || null;

      const { data, error } = await supabase
        .from("outfit")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) {
        return {
          content: [
            { type: "text", text: `Error updating outfit: ${error.message}` },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Outfit updated successfully: ${JSON.stringify(
              data,
              null,
              2
            )}`,
          },
        ],
      };
    }
  );

  server.tool(
    "delete_outfit",
    {
      id: z.string(),
    },
    async ({ id }) => {
      const { data, error } = await supabase
        .from("outfit")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        return {
          content: [
            { type: "text", text: `Error deleting outfit: ${error.message}` },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `Outfit deleted successfully: ${JSON.stringify(
              data,
              null,
              2
            )}`,
          },
        ],
      };
    }
  );
}

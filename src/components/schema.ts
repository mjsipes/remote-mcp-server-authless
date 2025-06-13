import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_schema(server: McpServer) {
  async function getSchema(uri: URL, variables: Record<string, unknown>) {
    const schema = {
      tables: {
        layer: {
          columns: {
            id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
            created_at: { type: "timestamp with time zone", notNull: true, default: "now()" },
            name: { type: "text" },
            description: { type: "text" },
            warmth: { type: "smallint" },
            top: { type: "boolean" },
            bottom: { type: "boolean" }
          }
        },
        log: {
          columns: {
            id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
            created_at: { type: "timestamp with time zone", notNull: true, default: "now()" },
            outfit_id: { type: "uuid", default: "gen_random_uuid()", foreignKey: "outfit(id)" },
            date: { type: "date" },
            comfort_level: { type: "smallint" },
            feedback: { type: "text" },
            was_too_hot: { type: "boolean" },
            was_too_cold: { type: "boolean" },
            weather_id: { type: "uuid", foreignKey: "weather(id)" }
          }
        },
        outfit: {
          columns: {
            id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
            created_at: { type: "timestamp with time zone", notNull: true, default: "now()" },
            name: { type: "text" },
            total_warmth: { type: "smallint" }
          }
        },
        outfit_layer: {
          columns: {
            id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
            created_at: { type: "timestamp with time zone", notNull: true, default: "now()" },
            outfit_id: { type: "uuid", default: "gen_random_uuid()", foreignKey: "outfit(id)" },
            layer_id: { type: "uuid", default: "gen_random_uuid()", foreignKey: "layer(id)" }
          }
        },
        weather: {
          columns: {
            id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
            created_at: { type: "timestamp with time zone", notNull: true, default: "now()" },
            latitude: { type: "double precision" },
            longitude: { type: "double precision" },
            date: { type: "date" },
            weather_data: { type: "jsonb" }
          }
        }
      }
    };

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(schema, null, 2),
        },
      ],
    };
  }

  server.resource(
    "schema",
    new ResourceTemplate("schema://", { list: undefined }),
    getSchema
  );
} 
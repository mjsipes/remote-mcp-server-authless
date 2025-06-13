import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function register_schema(server: McpServer) {
  server.resource(
    "schema",
    "schema://database-schema",
    async (uri) => {
      const schema = `-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.layer (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  description text,
  warmth smallint,
  top boolean,
  bottom boolean,
  CONSTRAINT layer_pkey PRIMARY KEY (id)
);

CREATE TABLE public.log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  outfit_id uuid DEFAULT gen_random_uuid(),
  date date,
  comfort_level smallint,
  feedback text,
  was_too_hot boolean,
  was_too_cold boolean,
  weather_id uuid,
  CONSTRAINT log_pkey PRIMARY KEY (id),
  CONSTRAINT outfit_log_outfit_id_fkey FOREIGN KEY (outfit_id) REFERENCES public.outfit(id),
  CONSTRAINT outfit_log_weather_id_fkey FOREIGN KEY (weather_id) REFERENCES public.weather(id)
);

CREATE TABLE public.outfit (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  name text,
  total_warmth smallint,
  CONSTRAINT outfit_pkey PRIMARY KEY (id)
);

CREATE TABLE public.outfit_layer (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  outfit_id uuid DEFAULT gen_random_uuid(),
  layer_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT outfit_layer_pkey PRIMARY KEY (id),
  CONSTRAINT outfit_layer_layer_id_fkey FOREIGN KEY (layer_id) REFERENCES public.layer(id),
  CONSTRAINT outfit_layer_outfit_id_fkey FOREIGN KEY (outfit_id) REFERENCES public.outfit(id)
);

CREATE TABLE public.weather (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  latitude double precision,
  longitude double precision,
  date date,
  weather_data jsonb,
  CONSTRAINT weather_pkey PRIMARY KEY (id)
);`;

      return {
        contents: [{
          uri: uri.href,
          text: schema
        }]
      };
    }
  );
}
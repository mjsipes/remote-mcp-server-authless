import { McpAgent } from "agents/mcp";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import { register_add } from "./components/add";
import { register_secret } from "./components/secret";
import { register_layer } from "./components/layer";
import { register_greeting } from "./components/greeting";
import { register_get_outfit_details } from "./components/get_outfit_details";
import { register_calculate_outfit_warmth } from "./components/calculate_outfit_warmth";

// Define Env interface
interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  [key: string]: string | undefined;
}

// Define our MCP agent with tools
export class MyMCP extends McpAgent {
  server = new McpServer({
    name: "Authless Calculator",
    version: "1.0.0",
  });
  
  declare env: Env;
  declare supabase: SupabaseClient;

  async init() {
    // Create Supabase client once
    console.log("creating supabase client");
    console.log("env", this.env);
    this.supabase = createClient(
      this.env.SUPABASE_URL,
      this.env.SUPABASE_ANON_KEY
    );

    const { data, error } = await this.supabase.from("layer").select("*");
    console.log("data", data);
    console.log("error", error);

    // Register all components directly
    register_add(this.server);
    register_secret(this.server);
    register_layer(this.server, this.supabase);
    register_greeting(this.server);
    register_get_outfit_details(this.server, this.supabase);
    register_calculate_outfit_warmth(this.server, this.supabase);
  }
}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    console.log("hello from cloudflare worker!");

    const url = new URL(request.url);
    console.log("url: ", url);
    if (url.pathname === "/sse" || url.pathname === "/sse/message") {
      return MyMCP.serveSSE("/sse").fetch(request, env, ctx);
    }
    if (url.pathname === "/mcp") {
      return MyMCP.serve("/mcp").fetch(request, env, ctx);
    }
    return new Response("Not found", { status: 404 });
  },
};

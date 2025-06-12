# Remote MCP Server

## Documentation & Resources

- **Documentation**: [Cloudflare Agents Guide](https://developers.cloudflare.com/agents/guides/remote-mcp-server/)
- **Remote Deployment**: [Cloudflare Dashboard](https://dash.cloudflare.com/59c10523ac06b31d13a999c0a14e7161/workers/services/view/remote-mcp-server-authless/production/metrics)

## Quick Start

```bash
# Start the development server
npm start

# Open the MCP inspector
npx @modelcontextprotocol/inspector@latest

# Open inspector in browser
open http://localhost:5173

# Deploy to production
npx wrangler@latest deploy
```

tomorrow see if cursor can recreate the cloudflare worker as a supabase edge function, other wise we will start building it.
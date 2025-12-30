/**
 * MCP Server Data
 * Auto-generated from mcp-servers.data.ts
 */

export interface MCPServerData {
    id: number;
    name: string;
    description: string;
    url: string;
    category?: string;
    installMethod?: "npx" | "pip" | "manual";
    command?: string;
    env?: Record<string, string>;
    args?: string[] | Record<string, any>;
}

export const MCP_SERVERS: MCPServerData[] = [
    {
        "id": 1,
        "name": "Time",
        "description": "A Model Context Protocol server that provides time and timezone conversion capabilities. This server enables LLMs to get current time information and perform timezone conversions using IANA timezone names, with automatic system timezone detection.",
        "url": "https://mcp.so/server/time/modelcontextprotocol",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 2,
        "name": "EdgeOne Pages MCP",
        "description": "An MCP service designed for deploying HTML content to EdgeOne Pages and obtaining an accessible public URL.",
        "url": "https://mcp.so/server/edgeone-pages-mcp/TencentEdgeOne",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 3,
        "name": "Filesystem",
        "description": "Secure file operations with configurable access controls",
        "url": "https://mcp.so/server/filesystem",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 4,
        "name": "Redis",
        "description": "A Model Context Protocol server that provides access to Redis databases. This server enables LLMs to interact with Redis key-value stores through a set of standardized tools.",
        "url": "https://mcp.so/server/redis/modelcontextprotocol",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 5,
        "name": "GitLab",
        "description": "GitLab API, enabling project management",
        "url": "https://mcp.so/server/gitlab/modelcontextprotocol",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 6,
        "name": "Blender",
        "description": "BlenderMCP connects Blender to Claude AI through the Model Context Protocol (MCP), allowing Claude to directly interact with and control Blender. This integration enables prompt assisted 3D modeling, scene creation, and manipulation.",
        "url": "https://mcp.so/server/blender/ahujasid",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 7,
        "name": "AWS KB Retrieval Server",
        "description": "An MCP server implementation for retrieving information from the AWS Knowledge Base using the Bedrock Agent Runtime.",
        "url": "https://mcp.so/server/aws-kb-retrieval-server/modelcontextprotocol",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 8,
        "name": "Sentry",
        "description": "Retrieving and analyzing issues from Sentry.io",
        "url": "https://mcp.so/server/sentry/modelcontextprotocol",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 9,
        "name": "Search1API",
        "description": "One API for Search, Crawling, and Sitemaps",
        "url": "https://mcp.so/server/search1api",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 10,
        "name": "Howtocook MCP",
        "description": "Based on Anduin2017 / HowToCook, an MCP server that helps recommend recipes, plan meals, and solve dietary questions",
        "url": "https://mcp.so/server/howtocook-mcp/worryzyy",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 11,
        "name": "mcp-server-flomo",
        "description": "Write notes to Flomo",
        "url": "https://mcp.so/server/mcp-server-flomo/chatmcp",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 12,
        "name": "MiniMax MCP",
        "description": "Official MiniMax Model Context Protocol server enabling interaction with Text to Speech, image generation and video generation APIs",
        "url": "https://mcp.so/server/MiniMax-MCP/MiniMax-AI",
        "category": "Media",
        "installMethod": "npx"
    },
    {
        "id": 13,
        "name": "AgentQL MCP Server",
        "description": "Model Context Protocol server that integrates AgentQL's data extraction capabilities.",
        "url": "https://mcp.so/server/agentql-mcp/tinyfish-io",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 14,
        "name": "Perplexity Ask MCP Server",
        "description": "A Model Context Protocol Server connector for Perplexity API, to enable web search without leaving the MCP ecosystem.",
        "url": "https://mcp.so/server/perplexity/ppl-ai",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 15,
        "name": "Jina AI MCP Tools",
        "description": "A Model Context Protocol server that integrates with Jina AI Search Foundation APIs.",
        "url": "https://mcp.so/server/jina-mcp-tools/PsychArch",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 16,
        "name": "PostgreSQL",
        "description": "Read-only database access with schema inspection",
        "url": "https://mcp.so/server/postgres/modelcontextprotocol",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 17,
        "name": "Zhipu Web Search",
        "description": "Web search engine specifically designed for large models with integrated search capabilities",
        "url": "https://mcp.so/server/zhipu-web-search/BigModel",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 18,
        "name": "Amap Maps",
        "description": "Amap official MCP Server for map services",
        "url": "https://mcp.so/server/amap-maps/amap",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 19,
        "name": "Framelink Figma MCP Server",
        "description": "MCP server to provide Figma layout information to AI coding agents like Cursor",
        "url": "https://mcp.so/server/Figma-Context-MCP/GLips",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 20,
        "name": "Baidu Map",
        "description": "Baidu Map official MCP Server - China's first MCP-compatible map service",
        "url": "https://mcp.so/server/baidu-map/baidu-maps",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 21,
        "name": "Firecrawl MCP Server",
        "description": "Official Firecrawl MCP Server - Adds powerful web scraping to Cursor, Claude and any other LLM clients.",
        "url": "https://mcp.so/server/firecrawl-mcp-server/mendableai",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 22,
        "name": "Sequential Thinking",
        "description": "An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process.",
        "url": "https://mcp.so/server/sequentialthinking/modelcontextprotocol",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 23,
        "name": "EverArt",
        "description": "AI image generation using various models",
        "url": "https://mcp.so/server/everart/modelcontextprotocol",
        "category": "Media",
        "installMethod": "npx"
    },
    {
        "id": 24,
        "name": "Serper MCP Server",
        "description": "A Serper MCP Server for web search integration",
        "url": "https://mcp.so/server/serper-mcp-server/garymengcom",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 25,
        "name": "Context7",
        "description": "Context7 MCP Server -- Up-to-date code documentation for LLMs and AI code editors",
        "url": "https://mcp.so/server/context7/upstash",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 26,
        "name": "Playwright MCP",
        "description": "Playwright MCP server for browser automation",
        "url": "https://mcp.so/server/playwright-mcp/microsoft",
        "category": "Browser Automation",
        "installMethod": "npx"
    },
    {
        "id": 27,
        "name": "Puppeteer",
        "description": "Browser automation and web scraping",
        "url": "https://mcp.so/server/puppeteer/modelcontextprotocol",
        "category": "Browser Automation",
        "installMethod": "npx"
    },
    {
        "id": 28,
        "name": "MCP Advisor",
        "description": "MCP Advisor & Installation - Use the right MCP server for your needs",
        "url": "https://mcp.so/server/mcpadvisor/istarwyh",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 29,
        "name": "Qiniu MCP Server",
        "description": "MCP Server based on Qiniu Cloud products for storage and image operations",
        "url": "https://mcp.so/server/qiniu-mcp-server/Qiniu",
        "category": "Media",
        "installMethod": "npx"
    },
    {
        "id": 30,
        "name": "GBOX Android MCP",
        "description": "GBOX provides environments for AI Agents to operate computer and mobile devices",
        "url": "https://mcp.so/server/gbox/babelcloud",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 31,
        "name": "Neon MCP Server",
        "description": "MCP server for interacting with Neon Management API and databases",
        "url": "https://mcp.so/server/mcp-server-neon/neondatabase-labs",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 32,
        "name": "302_sandbox_mcp",
        "description": "Create a remote sandbox that can execute code/run commands/upload and download files",
        "url": "https://mcp.so/server/302_sandbox_mcp/302ai",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 33,
        "name": "MCP Server for Milvus",
        "description": "The Milvus MCP server enables AI applications to interact with Milvus vector databases using natural language commands",
        "url": "https://mcp.so/server/MCP%20Server%20for%20Milvus/zilliztech",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 34,
        "name": "302_browser_use_mcp",
        "description": "Automatically create a remote browser to complete specified tasks, developed based on Browser Use + Sandbox",
        "url": "https://mcp.so/server/302_browser_use_mcp/302ai",
        "category": "Browser Automation",
        "installMethod": "npx"
    },
    {
        "id": 35,
        "name": "Mailtrap Email Sending MCP",
        "description": "An MCP server that provides a tool for sending transactional emails via Mailtrap",
        "url": "https://mcp.so/server/Mailtrap%20Email%20API/Mailtrap",
        "category": "Communication",
        "installMethod": "npx"
    },
    {
        "id": 36,
        "name": "MCP Server Chatsum",
        "description": "Summarize chat message",
        "url": "https://mcp.so/server/mcp-server-chatsum/chatmcp",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 37,
        "name": "Fetch",
        "description": "Web content fetching and conversion for efficient LLM usage",
        "url": "https://mcp.so/server/fetch/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 38,
        "name": "Slack",
        "description": "Channel management and messaging capabilities",
        "url": "https://mcp.so/server/slack/modelcontextprotocol",
        "category": "Communication",
        "installMethod": "npx"
    },
    {
        "id": 39,
        "name": "Brave Search",
        "description": "Web and local search using Brave's Search API",
        "url": "https://mcp.so/server/brave-search/modelcontextprotocol",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 40,
        "name": "Github",
        "description": "Repository management, file operations, and GitHub API integration",
        "url": "https://mcp.so/server/github/modelcontextprotocol",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 41,
        "name": "Google Maps",
        "description": "Location services, directions, and place details",
        "url": "https://mcp.so/server/google-maps/modelcontextprotocol",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 42,
        "name": "Bucket Feature Flags MCP Server",
        "description": "Flag features directly from chat in your code editor, including VS Code, Cursor, Windsurf, Claude Code",
        "url": "https://mcp.so/server/Bucket/bucketco",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 43,
        "name": "vercel-mcp",
        "description": "Lightweight MCP server to give your Cursor Agent access to the Vercel API.",
        "url": "https://mcp.so/server/vercel-api-mcp/zueai",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 44,
        "name": "Notion MCP Server",
        "description": "Mirror of Notion MCP integration",
        "url": "https://mcp.so/server/SAhmadUmass_notion-mcp-server/MCP-Mirror",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 45,
        "name": "Todoist MCP Server Extended",
        "description": "Enabling natural language management of todoist via Claude, MCP and todoist REST APIv2",
        "url": "https://mcp.so/server/todoist-mcp-server-extended/Chrusic",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 46,
        "name": "MCP",
        "description": "MCP example from webset",
        "url": "https://mcp.so/server/mcp_leanring/zhkzly",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 47,
        "name": "kospi-kosdaq-stock-server",
        "description": "An MCP server that provides KOSPI/KOSDAQ stock data using FastMCP",
        "url": "https://mcp.so/server/kospi-kosdaq-stock-server/dragon1086",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 48,
        "name": "Steel Puppeteer",
        "description": "Mirror of Puppeteer with Steel integration",
        "url": "https://mcp.so/server/rdvo_mcp-server/MCP-Mirror",
        "category": "Browser Automation",
        "installMethod": "npx"
    },
    {
        "id": 49,
        "name": "GalaConnect MCP Server",
        "description": "Galachain MCP server for use with LLMs",
        "url": "https://mcp.so/server/galachain-mcp/IndiaJonathan",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 50,
        "name": "MCP Server Research Project",
        "description": "Research claude code and mcp server",
        "url": "https://mcp.so/server/mcp_server_research/ckz",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 51,
        "name": "@enemyrr/mcp-server-pagespeed",
        "description": "Mirror of pagespeed insights MCP server",
        "url": "https://mcp.so/server/enemyrr_mcp-server-pagespeed/MCP-Mirror",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 52,
        "name": "Weather MCP Server",
        "description": "A weather information server built using Model Context Protocol providing real-time weather data and forecasts",
        "url": "https://mcp.so/server/weather-server/pg-yuly",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 53,
        "name": "MCP-DevTools",
        "description": "A pptr mcp server for better cursor",
        "url": "https://mcp.so/server/MCP-pptr/RingoTC",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 54,
        "name": "Mianshiya MCP Server",
        "description": "MCP Server for interview question search",
        "url": "https://mcp.so/server/mcp-mianshiya-server/gulihua10010",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 55,
        "name": "dbt Semantic Layer MCP Server",
        "description": "MCP Server for querying DBT Semantic Layer",
        "url": "https://mcp.so/server/dbt-semantic-layer-mcp-server/TommyBez",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 56,
        "name": "ntropy-mcp",
        "description": "Ntropy MCP server for financial data",
        "url": "https://mcp.so/server/ntropy-mcp/smithery-ai",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 57,
        "name": "SkySQL MCP Server",
        "description": "SkySQL MCP server and client repository",
        "url": "https://mcp.so/server/skysql-mcp/skysqlinc",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 58,
        "name": "livecode MCP",
        "description": "Run io.livecode.ch as an MCP server",
        "url": "https://mcp.so/server/livecode-mcp/namin",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 59,
        "name": "MCP-Wikipedia-API-Server",
        "description": "A FastAPI-MCP server that fetches Wikipedia summaries for AI assistants",
        "url": "https://mcp.so/server/MCP-Wikipedia-API-Server/Rishavv007",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 60,
        "name": "MCP Server Trello",
        "description": "Mirror of Trello MCP integration",
        "url": "https://mcp.so/server/delorenj_mcp-server-trello/MCP-Mirror",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 61,
        "name": "Terminal MCP",
        "description": "MCP server for unix pty control - gives AI models authentic terminal access",
        "url": "https://mcp.so/server/terminal-mcp/ianks",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 62,
        "name": "Alphavantage MCP Server",
        "description": "Alpha Vantage financial data MCP server",
        "url": "https://mcp.so/server/AlphavantageMCPServer/DonMorr",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 63,
        "name": "Yahoo Finance MCP Server",
        "description": "Comprehensive financial data from Yahoo Finance including stocks, options, and market news",
        "url": "https://mcp.so/server/yahoo-finance-mcp/Alex2Yang97",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 64,
        "name": "DevContext",
        "description": "Cutting-edge MCP server designed for continuous, project-centric context awareness",
        "url": "https://mcp.so/server/devcontext/Alfredo%20Urdaneta",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 65,
        "name": "Marimo Documentation MCP Server",
        "description": "Programmatic access to the Marimo Documentation",
        "url": "https://mcp.so/server/marimo-docs-mcp/StevenBtw",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 66,
        "name": "Todo List MCP Server",
        "description": "An MCP server for managing todos within LLMs",
        "url": "https://mcp.so/server/todo-list-mcp/RegiByte",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 67,
        "name": "Excalidraw MCP Server",
        "description": "Model Context Protocol server for Excalidraw",
        "url": "https://mcp.so/server/excalidraw-mcp/i-tozer",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 68,
        "name": "ledger-service MCP server",
        "description": "MCP Server for ledger management",
        "url": "https://mcp.so/server/ledger-mcp-server/mprokopov",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 69,
        "name": "Mcpmapserver",
        "description": "Google map MCP server for study",
        "url": "https://mcp.so/server/mcpmapserver/tthogho1",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 70,
        "name": "cloudflare-api-mcp",
        "description": "Lightweight MCP server to give your Cursor Agent access to the Cloudflare API",
        "url": "https://mcp.so/server/cloudflare-api-mcp/amxv",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 71,
        "name": "NN-New",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/NN-New/ninilang",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 72,
        "name": "system_information_mcp",
        "description": "Cursor MCP Server for Development Environment Information",
        "url": "https://mcp.so/server/system_information_mcp/carterlasalle",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 73,
        "name": "model-context-provider-server",
        "description": "MCP server for model context provision",
        "url": "https://mcp.so/server/model-context-provider-server/bizprat",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 74,
        "name": "mcp-kafka",
        "description": "An MCP server for Apache Kafka & its ecosystem",
        "url": "https://mcp.so/server/mcp-kafka/brandon-powers",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 75,
        "name": "mcp-demo",
        "description": "A demo repository to showcase MCP Server functionality",
        "url": "https://mcp.so/server/mcp-demo/pohunghuang-nctu",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 76,
        "name": "aws-mcp-infra-helper",
        "description": "MCP server enabling Claude to run security scans on Terraform code and AWS resources",
        "url": "https://mcp.so/server/aws-mcp-infra-helper/madhurprash",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 77,
        "name": "TRELLIS Blender Plugin",
        "description": "Blender plugin for TRELLIS - 3D AIGC Model",
        "url": "https://mcp.so/server/trellis_blender/FishWoWater",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 78,
        "name": "Claude MCP Trello",
        "description": "Model Context Protocol server for interacting with Trello boards",
        "url": "https://mcp.so/server/claude_mcp_trello/claudio",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 80,
        "name": "GitHub MCP Server",
        "description": "GitHub MCP Server implementation and testing repository",
        "url": "https://mcp.so/server/github_mcp_test/test",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 81,
        "name": "Mathematica Documentation MCP server",
        "description": "MCP server for checking Mathematica code via local MMA installation",
        "url": "https://mcp.so/server/mathematica_docs/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 82,
        "name": "Raindrop.io MCP Server",
        "description": "An MCP server for Raindrop.io integration",
        "url": "https://mcp.so/server/raindrop_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 83,
        "name": "yt-dlp-mcp",
        "description": "Model Context Protocol server that bridges Video & Audio content with Large Language Models using yt-dlp",
        "url": "https://mcp.so/server/yt-dlp-mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 84,
        "name": "YR MCP Server",
        "description": "MCP Server for using Yr Weather Data as Context in LLM tools",
        "url": "https://mcp.so/server/yr_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 85,
        "name": "MCP Servers",
        "description": "A collection of Minecraft Protocol servers implemented in TypeScript",
        "url": "https://mcp.so/server/mcp_servers_minecraft/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 86,
        "name": "mcp-sondehub",
        "description": "A MCP Server for the SondeHub API",
        "url": "https://mcp.so/server/mcp-sondehub/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 87,
        "name": "File Edit Check MCP Server",
        "description": "MCP server that enforces pre-read checks and detailed commit documentation",
        "url": "https://mcp.so/server/file_edit_check/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 88,
        "name": "SQL Server MCP Server",
        "description": "SQL Server MCP Server for Windsurf IDE",
        "url": "https://mcp.so/server/sql_server_mcp/test",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 89,
        "name": "Modes MCP Server",
        "description": "Mirror of Modes MCP integration",
        "url": "https://mcp.so/server/modes_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 90,
        "name": "Verodat MCP Layer",
        "description": "Verodat MCP Server Implementation",
        "url": "https://mcp.so/server/verodat_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 91,
        "name": "ThemeParks.wiki API MCP Server",
        "description": "ThemeParks.wiki API MCP Server",
        "url": "https://mcp.so/server/themeparks_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 92,
        "name": "Encoding DevOps MCP Server",
        "description": "AI-Powered Video Encoding Assistant",
        "url": "https://mcp.so/server/encoding_devops/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 93,
        "name": "Discord MCP Server",
        "description": "Discord MCP Server for Claude Integration",
        "url": "https://mcp.so/server/discord_mcp/test",
        "category": "Communication",
        "installMethod": "npx"
    },
    {
        "id": 94,
        "name": "Perspective MCP Server",
        "description": "Model Context Protocol server for Perspective API",
        "url": "https://mcp.so/server/perspective_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 95,
        "name": "Figma MCP Server",
        "description": "Claude MCP Server to work with figma",
        "url": "https://mcp.so/server/figma_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 96,
        "name": "Lucidity MCP",
        "description": "AI-powered code quality analysis using MCP",
        "url": "https://mcp.so/server/lucidity_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 97,
        "name": "robot-mcp-server",
        "description": "MCP server for robot and automation",
        "url": "https://mcp.so/server/robot-mcp-server/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 98,
        "name": "Chrome MCP Server",
        "description": "MCP server to interact with Chrome",
        "url": "https://mcp.so/server/chrome_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 99,
        "name": "Deriv API Server",
        "description": "Mirror of Deriv API MCP integration",
        "url": "https://mcp.so/server/deriv_api_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 100,
        "name": "MCP server in Python",
        "description": "Creating a barebones MCP server around python",
        "url": "https://mcp.so/server/python_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 101,
        "name": "Apple Notes MCP Server",
        "description": "MCP server for apple notes",
        "url": "https://mcp.so/server/apple_notes_mcp/test",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 102,
        "name": "MCP-demo-blog-analyzer",
        "description": "Quickstart to test MCP blog analyzer",
        "url": "https://mcp.so/server/mcp_demo_blog/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 103,
        "name": "piapi-mcp-server",
        "description": "Mirror of piapi MCP integration",
        "url": "https://mcp.so/server/piapi_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 104,
        "name": "Python project template",
        "description": "MCP and python test server",
        "url": "https://mcp.so/server/python_template/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 105,
        "name": "Dify MCP Server",
        "description": "Model Context Protocol Server for dify workflows",
        "url": "https://mcp.so/server/dify_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 106,
        "name": "MATLAB MCP Server",
        "description": "MATLAB MCP server for scientific computing and data analysis",
        "url": "https://mcp.so/server/matlab_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 107,
        "name": "Headless Agents MCP Server",
        "description": "MCP-ts server for calling agents served on Headless Agents",
        "url": "https://mcp.so/server/headless_agents/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 108,
        "name": "MCP Task Manager",
        "description": "MCP server for managing structured task queues",
        "url": "https://mcp.so/server/mcp_task_manager/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 109,
        "name": "Lunchmoney MCP Server",
        "description": "Mirror of Lunchmoney MCP integration",
        "url": "https://mcp.so/server/lunchmoney_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 110,
        "name": "wegene-assistant MCP server",
        "description": "MCP server to analyze genetic test results",
        "url": "https://mcp.so/server/wegene_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 111,
        "name": "MCP Server Template for Cursor",
        "description": "IDEA template for building mcp servers in python",
        "url": "https://mcp.so/server/mcp_cursor_template/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 112,
        "name": "GitHub MCP Server Configuration",
        "description": "Documentation and configuration details for GitHub MCP server setup",
        "url": "https://mcp.so/server/github_mcp_config/test",
        "category": "Development",
        "installMethod": "npx"
    },
    {
        "id": 113,
        "name": "ResembleMCP",
        "description": "Resemble AI MCP Server Implementation Challenge",
        "url": "https://mcp.so/server/resemblemcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 114,
        "name": "Sentry MCP Server",
        "description": "Model Context Protocol server for Sentry",
        "url": "https://mcp.so/server/sentry_mcp_server/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 115,
        "name": "Python notebook",
        "description": "Lightweight python notebook mcp server",
        "url": "https://mcp.so/server/python_notebook/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 116,
        "name": "MCP2HTTP",
        "description": "Minimal transport adapter that bridges MCP clients using stdio with stateless HTTP servers",
        "url": "https://mcp.so/server/mcp2http/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 117,
        "name": "Eerickwendel-contributions-mcp",
        "description": "MCP server for querying Erick Wendel's contributions",
        "url": "https://mcp.so/server/eerickwendel_contributions/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 118,
        "name": "MemProcFS-mcp-server",
        "description": "MemProcFS-mcp-server",
        "url": "https://mcp.so/server/memprocfs_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 119,
        "name": "Terrakube MCP Server",
        "description": "Model Context Protocol Server for Terrakube",
        "url": "https://mcp.so/server/terrakube_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 120,
        "name": "Protoc Gen Go Mcp",
        "description": "Go protobuf compiler extension to turn any gRPC service into an MCP server",
        "url": "https://mcp.so/server/protoc_gen_go_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 121,
        "name": "MCP-SSE",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/mcp_sse/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 122,
        "name": "Sydney Grammar School Headmasters Chat Application",
        "description": "Agentic RAG and MCP server for Sydney Grammar School chat",
        "url": "https://mcp.so/server/sydney_grammar_chat/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 123,
        "name": "Second Opinion MCP Server",
        "description": "Mirror of Second Opinion MCP integration",
        "url": "https://mcp.so/server/second_opinion_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 124,
        "name": "Kibela MCP Server",
        "description": "Mirror of Kibela MCP integration",
        "url": "https://mcp.so/server/kibela_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 125,
        "name": "PostgreSQL MCP server",
        "description": "MCP server for getting schema information from PostgreSQL database",
        "url": "https://mcp.so/server/postgres_schema_mcp/test",
        "category": "Database",
        "installMethod": "npx"
    },
    {
        "id": 126,
        "name": "ResearchMCP",
        "description": "Multi-Search API Aggregator Server built with Deno + Hono",
        "url": "https://mcp.so/server/researchmcp/test",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 127,
        "name": "MCP Telemetry",
        "description": "Observability MCP server adds tracing to all conversations on Claude",
        "url": "https://mcp.so/server/mcp_telemetry/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 128,
        "name": "Super Secret MCP Server",
        "description": "Example node MCP server with special code phrase",
        "url": "https://mcp.so/server/super_secret_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 129,
        "name": "Voxta MCP Bridge Provider",
        "description": "Voxta provider that enables communication with MCP servers",
        "url": "https://mcp.so/server/voxta_mcp_bridge/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 130,
        "name": "AI會話記録・活用統合システム",
        "description": "Automated AI conversation recording and knowledge management system with MCP integration",
        "url": "https://mcp.so/server/ai_conversation_system/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 131,
        "name": "MCP Media Processing Server",
        "description": "MCP server for media processing with video and image manipulation",
        "url": "https://mcp.so/server/mcp_media_processing/test",
        "category": "Media",
        "installMethod": "npx"
    },
    {
        "id": 132,
        "name": "Serper Search and Scrape MCP Server",
        "description": "Serper MCP Server supporting search and webpage scraping",
        "url": "https://mcp.so/server/serper_search_scrape/test",
        "category": "Search",
        "installMethod": "npx"
    },
    {
        "id": 133,
        "name": "Whisper Speech Recognition MCP Server",
        "description": "High-performance speech recognition MCP server based on Faster Whisper",
        "url": "https://mcp.so/server/whisper_mcp/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 134,
        "name": "ClaudeHopper",
        "description": "AI-Powered Construction Document Assistant and macOS menu bar MCP server manager",
        "url": "https://mcp.so/server/claudehopper/test",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 135,
        "name": "Retrieval-Augmented Thinking MCP Server",
        "description": "MCP server for retrieval augmented thinking",
        "url": "https://mcp.so/server/retrieval-augmented-thinking",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 136,
        "name": "AlphaVantage",
        "description": "Bring enterprise-grade stock market data to agents and LLMs",
        "url": "https://mcp.so/server/alphavantage",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 137,
        "name": "mcp-server-flomo MCP Server",
        "description": "Write notes to Flomo",
        "url": "https://mcp.so/server/mcp-server-flomo",
        "category": "Productivity",
        "installMethod": "npx"
    },
    {
        "id": 138,
        "name": "Coding Standards MCP Server",
        "description": "MCP Server for Coding Standards - providing standardized coding guidelines and best practices",
        "url": "https://mcp.so/server/coding-standards",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 139,
        "name": "Flux Image Generation Server",
        "description": "Flux image generation MCP server for AI image creation",
        "url": "https://mcp.so/server/flux_image_gen/test",
        "category": "Media",
        "installMethod": "npx",
        "command": "@gongrzhe/image-gen-server"
    },
    {
        "id": 140,
        "name": "Spreadsheet MCP Server",
        "description": "Mirror of Spreadsheet MCP integration",
        "url": "https://mcp.so/server/spreadsheet_mcp/test",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-sheets"
    },
    {
        "id": 141,
        "name": "Twilio MCP Server",
        "description": "Model Context Protocol server for sending SMS messages using Twilio",
        "url": "https://mcp.so/server/twilio_mcp/test",
        "category": "Communication",
        "installMethod": "npx",
        "command": "@yiyang.1i/sms-mcp-server"
    },
    {
        "id": 142,
        "name": "edgar-sec-mcp",
        "description": "MCP Server to get data from EDGAR SEC database",
        "url": "https://mcp.so/server/edgar_sec_mcp/test",
        "category": "Utilities",
        "installMethod": "pip",
        "command": "sec-edgar-mcp"
    },
    {
        "id": 143,
        "name": "MCP Argo Server",
        "description": "MCP server for running Argo workflows, written in Golang",
        "url": "https://mcp.so/server/mcp_argo/test",
        "category": "Development",
        "installMethod": "manual",
        "command": "go run main.go"
    },
    {
        "id": 144,
        "name": "Unified MCP Client Library",
        "description": "TypeScript library for connecting LangChain.js-compatible LLMs with MCP servers",
        "url": "https://mcp.so/server/unified_mcp_client/test",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-use"
    },
    {
        "id": 145,
        "name": "Deep-research",
        "description": "MCP Deep Research Server using Gemini for AI agent research",
        "url": "https://mcp.so/server/deep_research_mcp/test",
        "category": "Search",
        "installMethod": "manual",
        "command": "git clone https://github.com/google-deepmind/deep-research"
    },
    {
        "id": 146,
        "name": "Test d'intégration MCP Server GitHub",
        "description": "Test repository for MCP server GitHub integration",
        "url": "https://mcp.so/server/test_integration_github/test",
        "category": "Development",
        "installMethod": "npx",
        "command": "test-integration-github"
    },
    {
        "id": 147,
        "name": "WebSocket MCP",
        "description": "Model Context Protocol server and client with custom websocket transport layer",
        "url": "https://mcp.so/server/websocket_mcp/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "websocket-mcp"
    },
    {
        "id": 148,
        "name": "Storacha MCP Storage Server",
        "description": "Self-sovereign data for AI applications using Storacha",
        "url": "https://mcp.so/server/storacha_mcp/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "@storacha/mcp-server"
    },
    {
        "id": 149,
        "name": "MCP LLM",
        "description": "An MCP server that provides LLMs access to other LLMs",
        "url": "https://mcp.so/server/mcp-llm",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-llm"
    },
    {
        "id": 150,
        "name": "frontend-review-mcp",
        "description": "MCP server that visually reviews your agent's design edits",
        "url": "https://mcp.so/server/frontend-review",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "frontend-review-mcp"
    },
    {
        "id": 151,
        "name": "Linear MCP Server",
        "description": "Linear issue tracking MCP Server",
        "url": "https://mcp.so/server/linear",
        "category": "Utilities",
        "installMethod": "npx"
    },
    {
        "id": 152,
        "name": "hackernew-mcp",
        "description": "AI Friendly MCP Server for Hacker News",
        "url": "https://mcp.so/server/hackernews",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-hackernews"
    },
    {
        "id": 153,
        "name": "Secure agentic tool repo",
        "description": "Secure agentic tool repository with execution environment",
        "url": "https://mcp.so/server/secure_agentic/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "secure-agentic-tool"
    },
    {
        "id": 154,
        "name": "my-mcp-server",
        "description": "Try MCP Server example",
        "url": "https://mcp.so/server/my_mcp_server/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "my-mcp-server"
    },
    {
        "id": 155,
        "name": "Together AI Image Generation MCP Server",
        "description": "MCP-Server for together.ai API for Flux 1.1 Pro image generation",
        "url": "https://mcp.so/server/together_ai_mcp/test",
        "category": "Media",
        "installMethod": "npx",
        "command": "together-ai-mcp"
    },
    {
        "id": 156,
        "name": "Skynet-MCP",
        "description": "MCP Server that acts as an agent and spawns more Agents",
        "url": "https://mcp.so/server/skynet_mcp/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "skynet-mcp"
    },
    {
        "id": 157,
        "name": "MCPs and agents",
        "description": "MCP server and AI agents",
        "url": "https://mcp.so/server/mcps_agents/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcps-agents"
    },
    {
        "id": 158,
        "name": "Facebook Ads MCP Server",
        "description": "Facebook Ads MCP Server with campaign, ad set, and creative management",
        "url": "https://mcp.so/server/facebook_ads_mcp/test",
        "category": "App",
        "installMethod": "npx",
        "command": "facebook-ads-mcp"
    },
    {
        "id": 159,
        "name": "testmcpgithubdemo1",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/testmcp_github/test",
        "category": "Development",
        "installMethod": "npx",
        "command": "test-mcp-github"
    },
    {
        "id": 160,
        "name": "Redis MCP Server",
        "description": "Redis MCP Server - Python implementation with docker",
        "url": "https://mcp.so/server/redis_mcp_python/test",
        "category": "Database",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-redis"
    },
    {
        "id": 161,
        "name": "hyperscale-mcp",
        "description": "MCP server for Hyperscale",
        "url": "https://mcp.so/server/hyperscale_mcp/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "hyperscale-mcp"
    },
    {
        "id": 162,
        "name": "MCP-SSE122",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/mcp_sse122/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-sse"
    },
    {
        "id": 163,
        "name": "Hedera Testnet Mirror Node MCP Server",
        "description": "Hedera MCP server for testnet integration",
        "url": "https://mcp.so/server/hedera_testnet/test",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "hedera-mcp"
    },
    {
        "id": 164,
        "name": "MCP DuckDuckResearch",
        "description": "MCP server with DuckDuckGo search, web2md, and web2photo",
        "url": "https://mcp.so/server/mcp_duckduck/test",
        "category": "Search",
        "installMethod": "npx",
        "command": "duckduck-mcp"
    },
    {
        "id": 165,
        "name": "Cosense MCP Server",
        "description": "MCP Server for Cosense",
        "url": "https://mcp.so/server/cosense_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "cosense-mcp"
    },
    {
        "id": 166,
        "name": "yapi-mcp-server",
        "description": "Model Context Protocol server for Yapi API management",
        "url": "https://mcp.so/server/yapi_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "yapi-mcp"
    },
    {
        "id": 167,
        "name": "Harvest Natural Language Time Entry MCP Server",
        "description": "MCP server for natural language time entry in Harvest",
        "url": "https://mcp.so/server/harvest_mcp/page=5",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "harvest-mcp"
    },
    {
        "id": 168,
        "name": "FastAPI MCP Server",
        "description": "FastAPI-based MCP Server for unified tool access",
        "url": "https://mcp.so/server/fastapi_mcp/page=5",
        "category": "Utilities",
        "installMethod": "pip",
        "command": "fastapi-mcp"
    },
    {
        "id": 169,
        "name": "Nix MCP Servers",
        "description": "Nix flake for configuring Model Context Protocol servers",
        "url": "https://mcp.so/server/nix_mcp/page=5",
        "category": "Development",
        "installMethod": "manual",
        "command": "nix run github:nix-community/mcp-servers"
    },
    {
        "id": 170,
        "name": "i18n MCP Server",
        "description": "MCP server for handling i18n JSON files",
        "url": "https://mcp.so/server/i18n_mcp/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "i18n-mcp"
    },
    {
        "id": 171,
        "name": "RTC MCP Server",
        "description": "MCP server for Alibaba Cloud Realtime Computing Flink",
        "url": "https://mcp.so/server/rtc_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "rtc-mcp"
    },
    {
        "id": 172,
        "name": "usaspending-mcp",
        "description": "MCP server to interact with usaspending.gov API",
        "url": "https://mcp.so/server/usaspending_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "usaspending-mcp"
    },
    {
        "id": 173,
        "name": "MCP Server for Paper Analytical Devices",
        "description": "Python MCP Server for Paper Analytical Devices (PAD)",
        "url": "https://mcp.so/server/pad_mcp/page=5",
        "category": "Utilities",
        "installMethod": "pip",
        "command": "pad-mcp"
    },
    {
        "id": 174,
        "name": "gameanalytics-server MCP Server",
        "description": "GameAnalytics MCP server integration",
        "url": "https://mcp.so/server/gameanalytics_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "gameanalytics-mcp"
    },
    {
        "id": 175,
        "name": "Flutter Tools MCP Server",
        "description": "Flutter MCP server for Flutter development",
        "url": "https://mcp.so/server/flutter_mcp/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "flutter-mcp"
    },
    {
        "id": 176,
        "name": "Argus - Repository Analysis Tool",
        "description": "MCP server for analyzing GitLab repositories and security assessment",
        "url": "https://mcp.so/server/argus_mcp/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "argus-mcp"
    },
    {
        "id": 177,
        "name": "mcp-pyodide",
        "description": "Pyodide server implementation for MCP",
        "url": "https://mcp.so/server/mcp_pyodide/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-pyodide"
    },
    {
        "id": 178,
        "name": "SuperGateway",
        "description": "Run MCP stdio servers over SSE and SSE over stdio. AI gateway.",
        "url": "https://mcp.so/server/supergateway_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "supergateway"
    },
    {
        "id": 179,
        "name": "Claude Web Scraper MCP",
        "description": "Simple MCP server integrating eGet web scraper with Claude",
        "url": "https://mcp.so/server/claude_scraper_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "claude-web-scraper"
    },
    {
        "id": 180,
        "name": "Test Repo",
        "description": "Test repository created via MCP server",
        "url": "https://mcp.so/server/test_repo_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "test-repo-mcp"
    },
    {
        "id": 181,
        "name": "TimeTagger MCP Server",
        "description": "MCP server for the timetagger tool",
        "url": "https://mcp.so/server/timetagger_mcp/page=5",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "timetagger-mcp"
    },
    {
        "id": 182,
        "name": "CoinGecko Server",
        "description": "Mirror of CoinGecko MCP integration",
        "url": "https://mcp.so/server/coingecko_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "coingecko-mcp"
    },
    {
        "id": 183,
        "name": "Google Home MCP Server",
        "description": "Mirror of Google Home MCP integration",
        "url": "https://mcp.so/server/google_home_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "google-home-mcp"
    },
    {
        "id": 184,
        "name": "Table of Contents MCP Server",
        "description": "MCP server to run Pipelex pipelines",
        "url": "https://mcp.so/server/toc_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "toc-mcp"
    },
    {
        "id": 185,
        "name": "MCP docx server",
        "description": "MCP server to manipulate DOCX files",
        "url": "https://mcp.so/server/docx_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "docx-mcp"
    },
    {
        "id": 186,
        "name": "MySQL MCP Server",
        "description": "MCP server for MySQL database integration",
        "url": "https://mcp.so/server/mysql_mcp/page=5",
        "category": "Database",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-mysql"
    },
    {
        "id": 187,
        "name": "ClickUp MCP Server",
        "description": "Mirror of ClickUp MCP integration",
        "url": "https://mcp.so/server/clickup_mcp/page=5",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "clickup-mcp"
    },
    {
        "id": 188,
        "name": "MCP Server with Cloudflare Workers",
        "description": "MCP Server deployed on Cloudflare Workers",
        "url": "https://mcp.so/server/cloudflare_workers_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "cloudflare-workers-mcp"
    },
    {
        "id": 189,
        "name": "Appwrite MCP server",
        "description": "MCP to connect LLMs to Appwrite",
        "url": "https://mcp.so/server/appwrite_mcp/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "appwrite-mcp"
    },
    {
        "id": 190,
        "name": "workos-mcp",
        "description": "Lightweight MCP server for WorkOS API",
        "url": "https://mcp.so/server/workos_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "workos-mcp"
    },
    {
        "id": 191,
        "name": "scaflog-zoho-mcp-server",
        "description": "Mirror of Zoho MCP integration",
        "url": "https://mcp.so/server/scaflog_zoho/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "zoho-mcp"
    },
    {
        "id": 192,
        "name": "mcp-persona-sessions",
        "description": "MCP server for persona-driven AI sessions",
        "url": "https://mcp.so/server/persona_sessions/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "persona-sessions-mcp"
    },
    {
        "id": 193,
        "name": "Unreasonable-thinker-server MCP Server",
        "description": "MCP server for unconventional problem-solving",
        "url": "https://mcp.so/server/unreasonable_thinker/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "unreasonable-thinker"
    },
    {
        "id": 194,
        "name": "Mod-Coder-Pack-1.16.1",
        "description": "Mod Coder Pack for Minecraft 1.16.1",
        "url": "https://mcp.so/server/minecraft_mcp_1161/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-minecraft"
    },
    {
        "id": 195,
        "name": "Deno 2 Playwright MCP Server Example",
        "description": "Mirror of Deno Playwright MCP",
        "url": "https://mcp.so/server/deno_playwright_mcp/page=5",
        "category": "Browser Automation",
        "installMethod": "npx",
        "command": "deno-playwright"
    },
    {
        "id": 196,
        "name": "Thingsboard MCP Server",
        "description": "Thingsboard MCP Server for using Thingsboard data",
        "url": "https://mcp.so/server/thingsboard_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "thingsboard-mcp"
    },
    {
        "id": 197,
        "name": "mcp-server-agenda",
        "description": "MCP server to interface agenda note taking software",
        "url": "https://mcp.so/server/agenda_mcp/page=5",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "agenda-mcp"
    },
    {
        "id": 198,
        "name": "Penumbra MCP Server",
        "description": "MCP server for Penumbra blockchain interaction",
        "url": "https://mcp.so/server/penumbra_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "penumbra-mcp"
    },
    {
        "id": 199,
        "name": "Dify MCP Server TypeScript",
        "description": "Mirror of Dify MCP TypeScript",
        "url": "https://mcp.so/server/dify_ts_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "dify-mcp"
    },
    {
        "id": 200,
        "name": "MCP Server Playground",
        "description": "MCP Server example with TypeScript",
        "url": "https://mcp.so/server/mcp_playground/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-playground"
    },
    {
        "id": 201,
        "name": "mcp-cps-data MCP server",
        "description": "MCP Server for Chicago Public Schools data",
        "url": "https://mcp.so/server/cps_data_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "cps-data-mcp"
    },
    {
        "id": 202,
        "name": "Optimized Memory MCP Server v2",
        "description": "Personal project for testing MCP Server for memory management",
        "url": "https://mcp.so/server/memory_mcp_v2/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "memory-mcp-v2"
    },
    {
        "id": 203,
        "name": "Robot Takeover Setup Script",
        "description": "Setup script for MCP servers on Windows",
        "url": "https://mcp.so/server/robot_takeover_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "robot-takeover"
    },
    {
        "id": 204,
        "name": "Istio MCP-over-XDSv3",
        "description": "Sample MCP-over-XDSv3 gRPC server for Istio",
        "url": "https://mcp.so/server/istio_mcp_xdsv3/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "istio-mcp"
    },
    {
        "id": 205,
        "name": "Anthropic MCP Server",
        "description": "Server for Posting Tweets from X using Google Sheet",
        "url": "https://mcp.so/server/anthropic_twitter_mcp/page=5",
        "category": "Social",
        "installMethod": "npx",
        "command": "anthropic-mcp"
    },
    {
        "id": 206,
        "name": "serverMCprtprueba",
        "description": "Test MCP server",
        "url": "https://mcp.so/server/test_mcprt/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "test-mcprt"
    },
    {
        "id": 207,
        "name": "Google Drive MCP Server",
        "description": "Mirror of Google Drive MCP",
        "url": "https://mcp.so/server/gdrive_mcp/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "google-drive-mcp"
    },
    {
        "id": 208,
        "name": "mcp-dice",
        "description": "MCP Server for Rolling Dice",
        "url": "https://mcp.so/server/mcp_dice/page=5",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-dice"
    },
    {
        "id": 209,
        "name": "MCP Starter Server",
        "description": "Start template for a typescript mcp server",
        "url": "https://mcp.so/server/mcp_starter/page=5",
        "category": "Development",
        "installMethod": "npx",
        "command": "create-mcp-server"
    },
    {
        "id": 210,
        "name": "RAG_MCP",
        "description": "RAG-ready MCP server for semantic PDF search with OCR",
        "url": "https://mcp.so/server/rag_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "rag-mcp"
    },
    {
        "id": 211,
        "name": "Perplexity AI MCP Server",
        "description": "Mirror of Perplexity AI MCP",
        "url": "https://mcp.so/server/perplexity_ai_mcp/page=21",
        "category": "Search",
        "installMethod": "npx",
        "command": "perplexity-mcp"
    },
    {
        "id": 212,
        "name": "MCP Server Kusto",
        "description": "Mirror of Kusto MCP server",
        "url": "https://mcp.so/server/kusto_mcp/page=21",
        "category": "Database",
        "installMethod": "npx",
        "command": "kusto-mcp"
    },
    {
        "id": 213,
        "name": "BigQuery MCP server",
        "description": "Mirror of BigQuery MCP",
        "url": "https://mcp.so/server/bigquery_mcp/page=21",
        "category": "Database",
        "installMethod": "npx",
        "command": "bigquery-mcp"
    },
    {
        "id": 214,
        "name": "My MCP Server",
        "description": "Mirror of custom MCP server",
        "url": "https://mcp.so/server/my_custom_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "my-mcp-server"
    },
    {
        "id": 215,
        "name": "GoScry",
        "description": "Go server that acts as bridge between LLM and web browser",
        "url": "https://mcp.so/server/goscry_mcp/page=21",
        "category": "Browser Automation",
        "installMethod": "npx",
        "command": "goscry-mcp"
    },
    {
        "id": 216,
        "name": "Chaitin Rivers Radar",
        "description": "Rivers Radar MCP for website security monitoring",
        "url": "https://mcp.so/server/chaitin_radar_mcp/page=21",
        "category": "Security",
        "installMethod": "npx",
        "command": "rivers-radar-mcp"
    },
    {
        "id": 217,
        "name": "mcPixelmonServer",
        "description": "Mirror of Pixelmon server",
        "url": "https://mcp.so/server/pixelmon_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "pixelmon-mcp"
    },
    {
        "id": 218,
        "name": "Travel Planner MCP Server",
        "description": "Mirror of travel planner",
        "url": "https://mcp.so/server/travel_planner_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "travel-planner-mcp"
    },
    {
        "id": 219,
        "name": "Oracle MCP Server",
        "description": "MCP server implementation for Oracle database operations",
        "url": "https://mcp.so/server/oracle_mcp/page=21",
        "category": "Database",
        "installMethod": "npx",
        "command": "oracle-mcp"
    },
    {
        "id": 220,
        "name": "Placid.app MCP Server",
        "description": "Generate image and video creatives using Placid.app",
        "url": "https://mcp.so/server/placid_mcp/page=21",
        "category": "Media",
        "installMethod": "npx",
        "command": "placid-mcp"
    },
    {
        "id": 221,
        "name": "Handwriting OCR MCP Server",
        "description": "MCP Server for Handwriting OCR",
        "url": "https://mcp.so/server/handwriting_ocr_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "handwriting-ocr-mcp"
    },
    {
        "id": 222,
        "name": "Opera Omnia MCP Server",
        "description": "Access to Opera Omnia JSON datasets",
        "url": "https://mcp.so/server/opera_omnia_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "opera-omnia-mcp"
    },
    {
        "id": 223,
        "name": "Web Browser MCP Server",
        "description": "MCP server for web browsing using BeautifulSoup4",
        "url": "https://mcp.so/server/web_browser_mcp/page=21",
        "category": "Browser Automation",
        "installMethod": "npx",
        "command": "web-browser-mcp"
    },
    {
        "id": 224,
        "name": "tavily-search MCP server",
        "description": "Mirror of Tavily search MCP",
        "url": "https://mcp.so/server/tavily_search/page=21",
        "category": "Search",
        "installMethod": "npx",
        "command": "tavily-search-mcp"
    },
    {
        "id": 225,
        "name": "Cloudflare MCP",
        "description": "Deploy, configure & interrogate Cloudflare resources",
        "url": "https://mcp.so/server/cloudflare_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "cloudflare-mcp"
    },
    {
        "id": 226,
        "name": "GitHub Kanban MCP Server",
        "description": "Mirror of GitHub Kanban",
        "url": "https://mcp.so/server/github_kanban_mcp/page=21",
        "category": "Development",
        "installMethod": "npx",
        "command": "github-kanban-mcp"
    },
    {
        "id": 227,
        "name": "Headline Vibes Analysis MCP Server",
        "description": "Get heat check headlines analysis",
        "url": "https://mcp.so/server/headline_vibes_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "headline-vibes-mcp"
    },
    {
        "id": 228,
        "name": "Meme MCP Server",
        "description": "Simple MCP server for generating memes using ImgFlip",
        "url": "https://mcp.so/server/meme_mcp/page=21",
        "category": "Social",
        "installMethod": "npx",
        "command": "meme-mcp"
    },
    {
        "id": 229,
        "name": "Mcp_cosyvoice",
        "description": "MCP server for voice synthesis",
        "url": "https://mcp.so/server/cosyvoice_mcp/page=21",
        "category": "Media",
        "installMethod": "npx",
        "command": "cosyvoice-mcp"
    },
    {
        "id": 230,
        "name": "Linear MCP",
        "description": "LLM to interact with Linear API",
        "url": "https://mcp.so/server/linear_api_mcp/page=21",
        "category": "Development",
        "installMethod": "npx",
        "command": "linear-mcp"
    },
    {
        "id": 231,
        "name": "Coinmarket MCP server",
        "description": "Mirror of Coinmarket MCP",
        "url": "https://mcp.so/server/coinmarket_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "coinmarket-mcp"
    },
    {
        "id": 232,
        "name": "MCP Server Obsidian Omnisearch",
        "description": "Mirror of Obsidian Omnisearch",
        "url": "https://mcp.so/server/obsidian_omnisearch_mcp/page=21",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "obsidian-omnisearch-mcp"
    },
    {
        "id": 233,
        "name": "Query MCP - Supabase MCP Server",
        "description": "Mirror of Supabase MCP",
        "url": "https://mcp.so/server/supabase_query_mcp/page=21",
        "category": "Database",
        "installMethod": "npx",
        "command": "supabase-query-mcp"
    },
    {
        "id": 234,
        "name": "MCP Server Test",
        "description": "Test MCP server with multiple functions",
        "url": "https://mcp.so/server/mcp_server_test/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-server-test"
    },
    {
        "id": 235,
        "name": "MCP Image Placeholder Server",
        "description": "Lightweight MCP server for generating placeholder images",
        "url": "https://mcp.so/server/image_placeholder_mcp/page=21",
        "category": "Media",
        "installMethod": "npx",
        "command": "image-placeholder-mcp"
    },
    {
        "id": 236,
        "name": "ArXiv MCP Server",
        "description": "Mirror of ArXiv MCP",
        "url": "https://mcp.so/server/arxiv_mcp/page=21",
        "category": "Search",
        "installMethod": "npx",
        "command": "arxiv-mcp"
    },
    {
        "id": 237,
        "name": "MCP File Server",
        "description": "Secure MCP server for file system operations",
        "url": "https://mcp.so/server/file_server_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "file-server-mcp"
    },
    {
        "id": 238,
        "name": "Minecraft MCP Server",
        "description": "Early MCP server implementation for Minecraft",
        "url": "https://mcp.so/server/minecraft_mcp/page=21",
        "category": "Games",
        "installMethod": "npx",
        "command": "minecraft-mcp"
    },
    {
        "id": 239,
        "name": "Web Browser MCP Server",
        "description": "Mirror of web browser MCP",
        "url": "https://mcp.so/server/web_browser_mcp_mirror/page=21",
        "category": "Browser Automation",
        "installMethod": "npx",
        "command": "web-browser-mcp-mirror"
    },
    {
        "id": 240,
        "name": "StrongApps_MCPE_servers",
        "description": "Mirror of StrongApps MCPE servers",
        "url": "https://mcp.so/server/strongapps_mcpe/page=21",
        "category": "Games",
        "installMethod": "npx",
        "command": "strongapps-mcpe"
    },
    {
        "id": 241,
        "name": "Spotify MCP Server",
        "description": "Mirror of Spotify MCP",
        "url": "https://mcp.so/server/spotify_mcp/page=21",
        "category": "Media",
        "installMethod": "npx",
        "command": "spotify-mcp"
    },
    {
        "id": 242,
        "name": "go-mcp-server-service",
        "description": "Mirror of Go MCP service",
        "url": "https://mcp.so/server/go_mcp_service/page=21",
        "category": "Development",
        "installMethod": "npx",
        "command": "go-mcp-service"
    },
    {
        "id": 243,
        "name": "Linkup for Claude",
        "description": "Mirror of Internet Access for Claude",
        "url": "https://mcp.so/server/linkup_claude/page=21",
        "category": "Search",
        "installMethod": "npx",
        "command": "linkup-for-claude"
    },
    {
        "id": 244,
        "name": "OpenCV MCP Server",
        "description": "OpenCV image and video processing MCP server",
        "url": "https://mcp.so/server/opencv_mcp/page=21",
        "category": "Media",
        "installMethod": "npx",
        "command": "opencv-mcp"
    },
    {
        "id": 245,
        "name": "MCP Calculator",
        "description": "Go implementation of MCP server with calculator",
        "url": "https://mcp.so/server/calculator_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-calculator"
    },
    {
        "id": 246,
        "name": "Raygun MCP",
        "description": "Interact with Raygun crash reporting data",
        "url": "https://mcp.so/server/raygun_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "raygun-mcp"
    },
    {
        "id": 247,
        "name": "AgentForgeMCP",
        "description": "Template MCP server for tools, resources, and prompts",
        "url": "https://mcp.so/server/agentforge_mcp/page=21",
        "category": "Development",
        "installMethod": "npx",
        "command": "agentforge-mcp"
    },
    {
        "id": 248,
        "name": "App Store Connect MCP Server",
        "description": "Mirror of App Store Connect MCP",
        "url": "https://mcp.so/server/app_store_connect_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "app-store-connect-mcp"
    },
    {
        "id": 249,
        "name": "Simple Weather MCP Server",
        "description": "Simple Weather MCP Server example",
        "url": "https://mcp.so/server/simple_weather_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "simple-weather-mcp"
    },
    {
        "id": 250,
        "name": "MCP_claude",
        "description": "Demonstration of MCP server for Claude Desktop",
        "url": "https://mcp.so/server/mcp_claude_demo/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-claude"
    },
    {
        "id": 251,
        "name": "Playwright-Lighthouse MCP Server",
        "description": "MCP server for analyzing website performance",
        "url": "https://mcp.so/server/playwright_lighthouse_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "playwright-lighthouse-mcp"
    },
    {
        "id": 252,
        "name": "Calendar AutoAuth MCP Server",
        "description": "Google Calendar integration with auto authentication",
        "url": "https://mcp.so/server/calendar_autoauth_mcp/page=21",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "calendar-autoauth-mcp"
    },
    {
        "id": 253,
        "name": "mcp-serverTesting",
        "description": "MCP server testing",
        "url": "https://mcp.so/server/mcp_testing/page=21",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-server-testing"
    },
    {
        "id": 254,
        "name": "Needle MCP server",
        "description": "Mirror of Needle MCP",
        "url": "https://mcp.so/server/needle_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "needle-mcp"
    },
    {
        "id": 255,
        "name": "lightdash-mcp-server",
        "description": "Mirror of Lightdash MCP",
        "url": "https://mcp.so/server/lightdash_mcp/page=21",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "lightdash-mcp"
    },
    {
        "id": 256,
        "name": "lightfast-mcp",
        "description": "Production-ready MCP implementations for creative apps",
        "url": "https://mcp.so/server/lightfast_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "lightfast-mcp"
    },
    {
        "id": 257,
        "name": "mcp-server-isitdown",
        "description": "MCP server that checks if website is down",
        "url": "https://mcp.so/server/isitdown_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "isitdown-mcp"
    },
    {
        "id": 258,
        "name": "Express100 MCP Server",
        "description": "Express delivery information queries and tracking",
        "url": "https://mcp.so/server/express100_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "express100-mcp"
    },
    {
        "id": 259,
        "name": "Fetch-MCP Repository",
        "description": "MCP server for fetching URLs and YouTube transcripts",
        "url": "https://mcp.so/server/fetch_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "fetch-mcp"
    },
    {
        "id": 260,
        "name": "pty-mcp-server",
        "description": "PTY MCP server implementation",
        "url": "https://mcp.so/server/pty_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "pty-mcp"
    },
    {
        "id": 261,
        "name": "mcp-ffmpeg-tools",
        "description": "Python MCP server for FFmpeg media processing",
        "url": "https://mcp.so/server/ffmpeg_mcp/page=22",
        "category": "Media",
        "installMethod": "npx",
        "command": "ffmpeg-mcp"
    },
    {
        "id": 262,
        "name": "Copilot Terminal MCP Server",
        "description": "Advanced MCP Server for terminal with Copilot integration",
        "url": "https://mcp.so/server/copilot_terminal_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "copilot-terminal-mcp"
    },
    {
        "id": 263,
        "name": "DuckDuckGo MCP Server",
        "description": "Web search MCP with DuckDuckGo integration",
        "url": "https://mcp.so/server/duckduckgo_mcp/page=22",
        "category": "Search",
        "installMethod": "npx",
        "command": "duckduckgo-mcp"
    },
    {
        "id": 264,
        "name": "Obsidian MCP Server Enhanced",
        "description": "Enhanced MCP server for Obsidian vault interaction",
        "url": "https://mcp.so/server/obsidian_enhanced_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "obsidian-enhanced-mcp"
    },
    {
        "id": 265,
        "name": "MCP Atlassian Server",
        "description": "MCP server for Confluence and Jira integration",
        "url": "https://mcp.so/server/atlassian_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "atlassian-mcp"
    },
    {
        "id": 266,
        "name": "Clockify MCP Server",
        "description": "Clockify Model Context Protocol server",
        "url": "https://mcp.so/server/clockify_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "clockify-mcp"
    },
    {
        "id": 267,
        "name": "Onx MCP Server",
        "description": "MCP server for Onspring API integration",
        "url": "https://mcp.so/server/onx_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "onx-mcp"
    },
    {
        "id": 268,
        "name": "unstuck-ai",
        "description": "MCP Server to ask humans for help",
        "url": "https://mcp.so/server/unstuck_ai_mcp/page=22",
        "category": "Social",
        "installMethod": "npx",
        "command": "unstuck-ai-mcp"
    },
    {
        "id": 269,
        "name": "Todoist MCP Server",
        "description": "MCP server for natural language Todoist management",
        "url": "https://mcp.so/server/todoist_mcp_advanced/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "todoist-mcp-advanced"
    },
    {
        "id": 270,
        "name": "Pangea MCP Server",
        "description": "MCP server for Pangea API integration",
        "url": "https://mcp.so/server/pangea_mcp/page=22",
        "category": "Security",
        "installMethod": "npx",
        "command": "pangea-mcp"
    },
    {
        "id": 271,
        "name": "eSagu MCP",
        "description": "Centralized management for Amazon, eBay, Kaufland",
        "url": "https://mcp.so/server/esagu_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "esagu-mcp"
    },
    {
        "id": 272,
        "name": "Facets Module MCP Server",
        "description": "MCP server for Module development",
        "url": "https://mcp.so/server/facets_module_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "facets-module-mcp"
    },
    {
        "id": 273,
        "name": "notify-completion-mcp-server",
        "description": "MCP server for task completion notifications",
        "url": "https://mcp.so/server/notify_completion_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "notify-completion-mcp"
    },
    {
        "id": 274,
        "name": "OpenAI Codex MCP Server",
        "description": "MCP server to wrap OpenAI Codex CLI",
        "url": "https://mcp.so/server/openai_codex_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "openai-codex-mcp"
    },
    {
        "id": 275,
        "name": "TaskNote Bridge",
        "description": "MCP Server for Things 3 and Apple Notes integration",
        "url": "https://mcp.so/server/tasknote_bridge_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "tasknote-bridge"
    },
    {
        "id": 276,
        "name": "TSG Indexer",
        "description": "Library for indexing code repositories with Tree-sitter",
        "url": "https://mcp.so/server/tsg_indexer_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "tsg-indexer"
    },
    {
        "id": 277,
        "name": "AI Agent Marketplace Index",
        "description": "MCP Server for AI Agent Marketplace search",
        "url": "https://mcp.so/server/marketplace_index_mcp/page=22",
        "category": "Search",
        "installMethod": "npx",
        "command": "marketplace-index-mcp"
    },
    {
        "id": 278,
        "name": "Google Workspace MCP Server",
        "description": "Comprehensive Google Workspace integration",
        "url": "https://mcp.so/server/google_workspace_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "google-workspace-mcp"
    },
    {
        "id": 279,
        "name": "MCP Headless Gmail Server",
        "description": "MCP server for Gmail without local credentials",
        "url": "https://mcp.so/server/gmail_headless_mcp/page=22",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "gmail-headless-mcp"
    },
    {
        "id": 280,
        "name": "Descartes Java REPL",
        "description": "Java-based MCP for deep introspection and debugging",
        "url": "https://mcp.so/server/descartes_java_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "descartes-java-mcp"
    },
    {
        "id": 281,
        "name": "mcp-server-postgres",
        "description": "MCP Server for PostgreSQL databases",
        "url": "https://mcp.so/server/postgres_mcp/page=22",
        "category": "Database",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-postgres",
        "args": ["postgresql://localhost:5432/mydb"]
    },
    {
        "id": 282,
        "name": "mcp-human-resources",
        "description": "Spring Boot MCP Server for Human Resources data",
        "url": "https://mcp.so/server/mcp_human_resources/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-human-resources"
    },
    {
        "id": 283,
        "name": "Ping MCP: Solana Blockchain",
        "description": "MCP server for Solana blockchain interaction",
        "url": "https://mcp.so/server/ping_solana_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "ping-solana-mcp"
    },
    {
        "id": 284,
        "name": "MCP-Compose",
        "description": "Run and manage MCP servers as Docker containers",
        "url": "https://mcp.so/server/mcp_compose/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-compose"
    },
    {
        "id": 285,
        "name": "UI Explorer MCP Server",
        "description": "MCP Server for tools to explore UI on computer",
        "url": "https://mcp.so/server/ui_explorer_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "ui-explorer-mcp"
    },
    {
        "id": 286,
        "name": "Mercari JP MCP",
        "description": "Real-time data from Japan's Mercari",
        "url": "https://mcp.so/server/mercari_jp_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mercari-jp-mcp"
    },
    {
        "id": 287,
        "name": "Harness MCP Server",
        "description": "Official Harness MCP server",
        "url": "https://mcp.so/server/harness_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "harness-mcp"
    },
    {
        "id": 288,
        "name": "MIDI MCP Server",
        "description": "MCP server for MIDI file generation",
        "url": "https://mcp.so/server/midi_mcp/page=22",
        "category": "Media",
        "installMethod": "npx",
        "command": "midi-mcp"
    },
    {
        "id": 289,
        "name": "mcp-grpc-transport",
        "description": "gRPC transport for MCP servers",
        "url": "https://mcp.so/server/grpc_transport_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-grpc-transport"
    },
    {
        "id": 290,
        "name": "npcpy",
        "description": "The AI toolkit for AI developers",
        "url": "https://mcp.so/server/npcpy_mcp/page=22",
        "category": "Development",
        "installMethod": "npx",
        "command": "npcpy"
    },
    {
        "id": 291,
        "name": "MyArxivDB_MCP",
        "description": "MCP server for crawling papers from arxiv",
        "url": "https://mcp.so/server/myarxivdb_mcp/page=22",
        "category": "Search",
        "installMethod": "npx",
        "command": "myarxivdb-mcp"
    },
    {
        "id": 292,
        "name": "TM1 MCP Server",
        "description": "MCP server for TM1",
        "url": "https://mcp.so/server/tm1_mcp/page=22",
        "category": "Database",
        "installMethod": "npx",
        "command": "tm1-mcp"
    },
    {
        "id": 293,
        "name": "linuxSshMcpServer",
        "description": "Establish SSH connection to Linux servers",
        "url": "https://mcp.so/server/linux_ssh_mcp/page=22",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "linux-ssh-mcp"
    },
    {
        "id": 294,
        "name": "Filesystem MCP Server",
        "description": "Secure file operations with access controls",
        "url": "https://mcp.so/server/filesystem",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-filesystem",
        "args": ["/path/to/allowed/directory"]
    },
    {
        "id": 295,
        "name": "Termux-API-Tools-MCP-Server",
        "description": "MCP server for controlling Android devices",
        "url": "https://mcp.so/server/termux_api_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "termux-api-mcp"
    },
    {
        "id": 296,
        "name": "Multi-MCP AI Agent",
        "description": "AI agent utilizing multiple MCP servers",
        "url": "https://mcp.so/server/multi_mcp_agent/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "multi-mcp-agent"
    },
    {
        "id": 297,
        "name": "GitHub MCP Server",
        "description": "Using git_hub_mcp_server",
        "url": "https://mcp.so/server/github_mcp_server/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-github",
        "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
        }
    },
    {
        "id": 298,
        "name": "Hh MCP ComfyUI",
        "description": "ComfyUI image generation service via MCP",
        "url": "https://mcp.so/server/comfyui_mcp/page=250",
        "category": "Media",
        "installMethod": "npx",
        "command": "comfyui-mcp"
    },
    {
        "id": 299,
        "name": "ArxivAutoJob",
        "description": "Collect arxiv papers for MCP project",
        "url": "https://mcp.so/server/arxiv_autojob_mcp/page=250",
        "category": "Search",
        "installMethod": "npx",
        "command": "arxiv-autojob"
    },
    {
        "id": 300,
        "name": "LLM SSE MCP Demo",
        "description": "Integration between LLM clients and MCP servers using SSE",
        "url": "https://mcp.so/server/llm_sse_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "llm-sse-mcp"
    },
    {
        "id": 301,
        "name": "TalkEventsToMe",
        "description": "MCP server integration learning project",
        "url": "https://mcp.so/server/talk_events_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "talk-events-mcp"
    },
    {
        "id": 302,
        "name": "ableton-copilot-mcp",
        "description": "MCP server for controlling Ableton Live",
        "url": "https://mcp.so/server/ableton_copilot_mcp/page=250",
        "category": "Media",
        "installMethod": "npx",
        "command": "ableton-copilot-mcp"
    },
    {
        "id": 303,
        "name": "MCP Client-Server Repository",
        "description": "MCP Server that's also an MCP Client",
        "url": "https://mcp.so/server/mcp_client_server_repo/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-client-server"
    },
    {
        "id": 304,
        "name": "custom-instructions",
        "description": "Custom instructions and MCP servers",
        "url": "https://mcp.so/server/custom_instructions_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "custom-instructions-mcp"
    },
    {
        "id": 305,
        "name": "Trello MCP",
        "description": "Trello Desktop MCP for Claude Desktop",
        "url": "https://mcp.so/server/trello_desktop_mcp/page=250",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "trello-desktop-mcp"
    },
    {
        "id": 306,
        "name": "Awesome Remote MCP Servers",
        "description": "Remote MCP Servers with URL endpoints",
        "url": "https://mcp.so/server/awesome_remote_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "awesome-remote-mcp"
    },
    {
        "id": 307,
        "name": "Bull Vision Agent",
        "description": "FastAPI Telegram integration for stock trading",
        "url": "https://mcp.so/server/bull_vision_agent/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "bull-vision-agent"
    },
    {
        "id": 308,
        "name": "C++ MCP-SERVER",
        "description": "C++ implementation with pluggable module architecture",
        "url": "https://mcp.so/server/cpp_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "cpp-mcp-server"
    },
    {
        "id": 309,
        "name": "HTTPX MCP Server",
        "description": "REST API operations MCP server",
        "url": "https://mcp.so/server/httpx_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "httpx-mcp"
    },
    {
        "id": 310,
        "name": "Natural Language MCP-MSSQL Client",
        "description": "Natural Language SQL Chat Interface",
        "url": "https://mcp.so/server/nl_mssql_mcp/page=250",
        "category": "Database",
        "installMethod": "npx",
        "command": "nl-mssql-mcp"
    },
    {
        "id": 311,
        "name": "InBrowserMCP Project",
        "description": "Express framework based MCP SDK",
        "url": "https://mcp.so/server/inbrowser_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "inbrowser-mcp"
    },
    {
        "id": 312,
        "name": "Deebo: AI Agent Debugging Copilot",
        "description": "Autonomous debugging agent MCP server",
        "url": "https://mcp.so/server/deebo_debug_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "deebo-mcp"
    },
    {
        "id": 313,
        "name": "Scratchpad Tool MCP Server",
        "description": "Think tool for LLMs",
        "url": "https://mcp.so/server/scratchpad_tool_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "scratchpad-tool-mcp"
    },
    {
        "id": 314,
        "name": "Crawl4AI MCP Server",
        "description": "High-performance web scraping and crawling",
        "url": "https://mcp.so/server/crawl4ai_mcp/page=250",
        "category": "Browser Automation",
        "installMethod": "npx",
        "command": "crawl4ai-mcp"
    },
    {
        "id": 315,
        "name": "MCP Server for IGCL",
        "description": "PoC of MCP Server for IGCL",
        "url": "https://mcp.so/server/igcl_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "igcl-mcp"
    },
    {
        "id": 316,
        "name": "Python MSSQL MCP Server",
        "description": "MCP Server for MSSQL Integration",
        "url": "https://mcp.so/server/python_mssql_mcp/page=250",
        "category": "Database",
        "installMethod": "npx",
        "command": "python-mssql-mcp"
    },
    {
        "id": 317,
        "name": "ninja-build-mcp",
        "description": "MCP Server for Ninja build tool",
        "url": "https://mcp.so/server/ninja_build_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "ninja-build-mcp"
    },
    {
        "id": 318,
        "name": "MCP Playground",
        "description": "MCP Java Client/Server using Spring AI",
        "url": "https://mcp.so/server/mcp_playground_java/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-playground-java"
    },
    {
        "id": 319,
        "name": "GitHub MCP Server",
        "description": "Simple custom-built GitHub integration",
        "url": "https://mcp.so/server/github_custom_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "github-custom-mcp"
    },
    {
        "id": 320,
        "name": "Docker MCP Server",
        "description": "Docker's MCP Server",
        "url": "https://mcp.so/server/docker_mcp/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "docker-mcp"
    },
    {
        "id": 321,
        "name": "LinkedIn Model Context Protocol Server",
        "description": "LinkedIn interactions for job search and applications",
        "url": "https://mcp.so/server/linkedin_mcp/page=250",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "linkedin-mcp"
    },
    {
        "id": 322,
        "name": "Free TikTok MCP Server",
        "description": "TikTok analytics integration",
        "url": "https://mcp.so/server/tiktok_mcp/page=250",
        "category": "Social",
        "installMethod": "npx",
        "command": "tiktok-mcp"
    },
    {
        "id": 323,
        "name": "MCP Auth Node.js SDK",
        "description": "Plug-and-play auth for Node.js MCP servers",
        "url": "https://mcp.so/server/mcp_auth_nodejs/page=250",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-auth-nodejs"
    },
    {
        "id": 324,
        "name": "MS SQL MCP Server 1.1",
        "description": "MCP server for MS SQL Server",
        "url": "https://mcp.so/server/ms_sql_mcp_v1/page=250",
        "category": "Database",
        "installMethod": "npx",
        "command": "ms-sql-mcp"
    },
    {
        "id": 325,
        "name": "Solscan MCP",
        "description": "Solana transaction queries with Solscan API",
        "url": "https://mcp.so/server/solscan_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "solscan-mcp"
    },
    {
        "id": 326,
        "name": "Formula One MCP Server",
        "description": "Mirror of Formula One MCP",
        "url": "https://mcp.so/server/f1_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "f1-mcp"
    },
    {
        "id": 327,
        "name": "MCP Server for macOS Use",
        "description": "AI agent with OS-level tools",
        "url": "https://mcp.so/server/macos_mcp/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "macos-mcp"
    },
    {
        "id": 328,
        "name": "Awesome MCP Servers",
        "description": "Curated list of best MCP Servers",
        "url": "https://mcp.so/server/awesome_mcp_servers/page=250",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "awesome-mcp-servers"
    },
    {
        "id": 329,
        "name": "Mcp Cookbook",
        "description": "Reusable recipes and procedures for development",
        "url": "https://mcp.so/server/mcp_cookbook/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-cookbook"
    },
    {
        "id": 330,
        "name": "claude-code-mcp Project",
        "description": "MCP Server connects with claude code local",
        "url": "https://mcp.so/server/claude_code_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "claude-code-mcp"
    },
    {
        "id": 331,
        "name": "MCP From Zero",
        "description": "Prompt focused MCP for data analytics",
        "url": "https://mcp.so/server/mcp_from_zero/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-from-zero"
    },
    {
        "id": 332,
        "name": "MCP Calculator Server",
        "description": "Calculator functionality MCP server",
        "url": "https://mcp.so/server/calculator_server_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "calculator-server-mcp"
    },
    {
        "id": 333,
        "name": "VME MCP Server",
        "description": "Intelligent VMware MCP with NLP",
        "url": "https://mcp.so/server/vme_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "vme-mcp"
    },
    {
        "id": 334,
        "name": "MuckRock MCP Server",
        "description": "FOIA request management MCP server",
        "url": "https://mcp.so/server/muckrock_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "muckrock-mcp"
    },
    {
        "id": 335,
        "name": "MCP Server Template",
        "description": "Lightweight Express.js and TypeScript template",
        "url": "https://mcp.so/server/mcp_template_sse/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-template-sse"
    },
    {
        "id": 336,
        "name": "Aqara MCP Server",
        "description": "Aqara's official MCP Server",
        "url": "https://mcp.so/server/aqara_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "aqara-mcp"
    },
    {
        "id": 337,
        "name": "XcodeBuildMCP",
        "description": "Xcode-related tools MCP server",
        "url": "https://mcp.so/server/xcode_build_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "xcode-build-mcp"
    },
    {
        "id": 338,
        "name": "BloodHound MCP Server",
        "description": "Converse with BloodHound data",
        "url": "https://mcp.so/server/bloodhound_mcp/page=260",
        "category": "Security",
        "installMethod": "npx",
        "command": "bloodhound-mcp"
    },
    {
        "id": 339,
        "name": "Node Code Sandbox MCP",
        "description": "JavaScript execution in Docker containers",
        "url": "https://mcp.so/server/node_sandbox_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "node-sandbox-mcp"
    },
    {
        "id": 340,
        "name": "MCPJungle",
        "description": "Self-hosted MCP Server registry",
        "url": "https://mcp.so/server/mcpjungle/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcpjungle"
    },
    {
        "id": 341,
        "name": "Binance MCP Server",
        "description": "Crypto trading tools for AI Agents",
        "url": "https://mcp.so/server/binance_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "binance-mcp"
    },
    {
        "id": 342,
        "name": "Dotfiles",
        "description": "Personal dotfiles configuration",
        "url": "https://mcp.so/server/dotfiles_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "dotfiles-mcp"
    },
    {
        "id": 343,
        "name": "MCP stdio adapter",
        "description": "Expose remote MCP server as local stdio",
        "url": "https://mcp.so/server/stdio_adapter_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "stdio-adapter-mcp"
    },
    {
        "id": 344,
        "name": "Statsig",
        "description": "Feature flags and instrumentation MCP",
        "url": "https://mcp.so/server/statsig_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "statsig-mcp"
    },
    {
        "id": 345,
        "name": "Infercnv-MCP",
        "description": "CNV analysis using infercnv",
        "url": "https://mcp.so/server/infercnv_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "infercnv-mcp"
    },
    {
        "id": 346,
        "name": "Blue Prince Architect Notes",
        "description": "MCP Server for Blue Prince notes",
        "url": "https://mcp.so/server/blue_prince_mcp/page=260",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "blue-prince-mcp"
    },
    {
        "id": 347,
        "name": "Trino MCP Server in Go",
        "description": "High-performance Trino MCP server",
        "url": "https://mcp.so/server/trino_mcp_go/page=260",
        "category": "Database",
        "installMethod": "npx",
        "command": "trino-mcp-go"
    },
    {
        "id": 348,
        "name": "Zulip MCP Server",
        "description": "Unofficial Zulip MCP server",
        "url": "https://mcp.so/server/zulip_mcp/page=260",
        "category": "Communication",
        "installMethod": "npx",
        "command": "zulip-mcp"
    },
    {
        "id": 349,
        "name": "Prysm MCP Server",
        "description": "Web scraping tools for AI assistants",
        "url": "https://mcp.so/server/prysm_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "prysm-mcp"
    },
    {
        "id": 350,
        "name": "Deep Research MCP Server",
        "description": "Comprehensive web research using Tavily",
        "url": "https://mcp.so/server/deep_research_tavily_mcp/page=260",
        "category": "Search",
        "installMethod": "npx",
        "command": "deep-research-tavily-mcp"
    },
    {
        "id": 351,
        "name": "NPM Helper",
        "description": "NPM package management MCP server",
        "url": "https://mcp.so/server/npm_helper_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "npm-helper-mcp"
    },
    {
        "id": 352,
        "name": "Spring MCP Server",
        "description": "Spring framework MCP server",
        "url": "https://mcp.so/server/spring_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "spring-mcp"
    },
    {
        "id": 353,
        "name": "MySQL MCP Server v2",
        "description": "MySQL integration v2",
        "url": "https://mcp.so/server/mysql_mcp_v2/page=260",
        "category": "Database",
        "installMethod": "npx",
        "command": "mysql-mcp-v2"
    },
    {
        "id": 354,
        "name": "Kite MCP Server",
        "description": "Zerodha Kite MCP server",
        "url": "https://mcp.so/server/kite_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "kite-mcp"
    },
    {
        "id": 355,
        "name": "Desktop Commander",
        "description": "Run and manage long processes",
        "url": "https://mcp.so/server/desktop_commander_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "desktop-commander-mcp"
    },
    {
        "id": 356,
        "name": "generic-form-filler-hackathon",
        "description": "Generic form filler using MCP servers",
        "url": "https://mcp.so/server/form_filler_hack_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "form-filler-hack-mcp"
    },
    {
        "id": 357,
        "name": "WhatsApp Flows API MCP Server",
        "description": "WhatsApp business automation",
        "url": "https://mcp.so/server/whatsapp_flows_mcp/page=260",
        "category": "Communication",
        "installMethod": "npx",
        "command": "whatsapp-flows-mcp"
    },
    {
        "id": 358,
        "name": "Fastly API MCP Server",
        "description": "MCP server and OpenAPI schema for Fastly",
        "url": "https://mcp.so/server/fastly_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "fastly-mcp"
    },
    {
        "id": 359,
        "name": "MCP VOICEVOX Go",
        "description": "Text-to-speech synthesis MCP server",
        "url": "https://mcp.so/server/voicevox_mcp/page=260",
        "category": "Media",
        "installMethod": "npx",
        "command": "voicevox-mcp"
    },
    {
        "id": 360,
        "name": "deep-learning-capstone",
        "description": "Deep Learning capstone about MCP servers",
        "url": "https://mcp.so/server/dl_capstone_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "dl-capstone-mcp"
    },
    {
        "id": 361,
        "name": "Claude MCP Approval Server",
        "description": "WhatsApp integration for Claude Code approval",
        "url": "https://mcp.so/server/claude_approval_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "claude-approval-mcp"
    },
    {
        "id": 362,
        "name": "mcp-weather-app",
        "description": "Learning MCP servers",
        "url": "https://mcp.so/server/weather_app_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "weather-app-mcp"
    },
    {
        "id": 363,
        "name": "XDC GOAT MCP Server",
        "description": "XDC GOAT integration",
        "url": "https://mcp.so/server/xdc_goat_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "xdc-goat-mcp"
    },
    {
        "id": 364,
        "name": "civic-mcp-server",
        "description": "Civic MCP server",
        "url": "https://mcp.so/server/civic_mcp/page=260",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "civic-mcp"
    },
    {
        "id": 365,
        "name": "NotionBae",
        "description": "MCP Server for Notion.com",
        "url": "https://mcp.so/server/notionbae_mcp/page=260",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "notionbae-mcp"
    },
    {
        "id": 366,
        "name": "Terraform MCP Server by Binadox",
        "description": "Terraform validation and cost estimation",
        "url": "https://mcp.so/server/terraform_binadox_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "terraform-binadox-mcp"
    },
    {
        "id": 367,
        "name": "SearXNG MCP Server",
        "description": "MCP Server for SearXNG",
        "url": "https://mcp.so/server/searxng_mcp/page=260",
        "category": "Search",
        "installMethod": "npx",
        "command": "searxng-mcp"
    },
    {
        "id": 368,
        "name": "UE5-MCP",
        "description": "MCP for Unreal Engine 5",
        "url": "https://mcp.so/server/ue5_mcp/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "ue5-mcp"
    },
    {
        "id": 369,
        "name": "MCP Serve",
        "description": "Server for Deep Learning Models",
        "url": "https://mcp.so/server/mcp_serve/page=260",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-serve"
    },
    {
        "id": 370,
        "name": "Nero AI Image Processing",
        "description": "AI-powered image processing MCP server",
        "url": "https://mcp.so/server/nero_ai_mcp/page=260",
        "category": "Media",
        "installMethod": "npx",
        "command": "nero-ai-mcp"
    },
    {
        "id": 371,
        "name": "Met Museum MCP Server",
        "description": "Metropolitan Museum of Art collection discovery",
        "url": "https://mcp.so/server/met_museum_mcp/page=270",
        "category": "Education",
        "installMethod": "npx",
        "command": "met-museum-mcp"
    },
    {
        "id": 372,
        "name": "Oorlogsbronnen MCP Server",
        "description": "Dutch WWII archives access",
        "url": "https://mcp.so/server/oorlogsbronnen_mcp/page=270",
        "category": "Education",
        "installMethod": "npx",
        "command": "oorlogsbronnen-mcp"
    },
    {
        "id": 373,
        "name": "Amplitude",
        "description": "Behavior analytics and experimentation platform",
        "url": "https://mcp.so/server/amplitude_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "amplitude-mcp"
    },
    {
        "id": 374,
        "name": "Kubectl MCP Tool",
        "description": "Kubernetes cluster chat interface",
        "url": "https://mcp.so/server/kubectl_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "kubectl-mcp"
    },
    {
        "id": 375,
        "name": "Coincap MCP",
        "description": "Crypto data from CoinCap API",
        "url": "https://mcp.so/server/coincap_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "coincap-mcp"
    },
    {
        "id": 376,
        "name": "Justrunmy.app Hosting MCP Server",
        "description": "Application creation and operation",
        "url": "https://mcp.so/server/justrunmy_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "justrunmy-mcp"
    },
    {
        "id": 377,
        "name": "Node.js Sandbox MCP Server",
        "description": "Docker container execution MCP",
        "url": "https://mcp.so/server/nodejs_sandbox_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "nodejs-sandbox-mcp"
    },
    {
        "id": 378,
        "name": "Mcp Server Commands",
        "description": "Run commands MCP server",
        "url": "https://mcp.so/server/mcp_commands/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-commands"
    },
    {
        "id": 379,
        "name": "Vibe Math MCP",
        "description": "High-performance math MCP with Polars",
        "url": "https://mcp.so/server/vibe_math_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "vibe-math-mcp"
    },
    {
        "id": 380,
        "name": "Google Tasks MCP Server",
        "description": "Task list management MCP",
        "url": "https://mcp.so/server/google_tasks_mcp/page=270",
        "category": "Productivity",
        "installMethod": "npx",
        "command": "@brandcast_app/google-tasks-mcp",
        "env": {
            "GOOGLE_CLIENT_ID": "YOUR_CLIENT_ID",
            "GOOGLE_CLIENT_SECRET": "YOUR_CLIENT_SECRET"
        }
    },
    {
        "id": 381,
        "name": "Nocodb MCP Server",
        "description": "Nocodb integration MCP",
        "url": "https://mcp.so/server/nocodb_mcp/page=270",
        "category": "Database",
        "installMethod": "npx",
        "command": "nocodb-mcp"
    },
    {
        "id": 382,
        "name": "InfluxDB MCP Server",
        "description": "InfluxDB query MCP",
        "url": "https://mcp.so/server/influxdb_mcp/page=270",
        "category": "Database",
        "installMethod": "npx",
        "command": "influxdb-mcp"
    },
    {
        "id": 383,
        "name": "Multi-Chat MCP Server",
        "description": "Google Chat integration MCP",
        "url": "https://mcp.so/server/multi_chat_mcp/page=270",
        "category": "Communication",
        "installMethod": "npx",
        "command": "multi-chat-mcp"
    },
    {
        "id": 384,
        "name": "Jina Reader MCP Server",
        "description": "Jina Reader integration",
        "url": "https://mcp.so/server/jina_reader_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "jina-reader-mcp"
    },
    {
        "id": 385,
        "name": "BigBugAI",
        "description": "Trending tokens analysis MCP",
        "url": "https://mcp.so/server/bigbugai_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "bigbugai-mcp"
    },
    {
        "id": 386,
        "name": ".NET Types Explorer MCP Server",
        "description": "Type information from .NET projects",
        "url": "https://mcp.so/server/dotnet_types_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "dotnet-types-mcp"
    },
    {
        "id": 387,
        "name": "dolphindb-mcp-server",
        "description": "DolphinDB integration",
        "url": "https://mcp.so/server/dolphindb_mcp/page=270",
        "category": "Database",
        "installMethod": "npx",
        "command": "dolphindb-mcp"
    },
    {
        "id": 388,
        "name": "Caiyun Weather MCP Server",
        "description": "Official weather MCP server",
        "url": "https://mcp.so/server/caiyun_weather_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "caiyun-weather-mcp"
    },
    {
        "id": 389,
        "name": "MCP Simulation",
        "description": "Multi-Context Processing simulation",
        "url": "https://mcp.so/server/mcp_simulation/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-simulation"
    },
    {
        "id": 390,
        "name": "Databricks MCP Server",
        "description": "Databricks integration MCP",
        "url": "https://mcp.so/server/databricks_mcp/page=270",
        "category": "Database",
        "installMethod": "npx",
        "command": "databricks-mcp"
    },
    {
        "id": 391,
        "name": "FunASR-Powered MCP Server",
        "description": "Alibaba speech processing MCP",
        "url": "https://mcp.so/server/funasr_mcp/page=270",
        "category": "Media",
        "installMethod": "npx",
        "command": "funasr-mcp"
    },
    {
        "id": 392,
        "name": "iOS Simulator MCP Server",
        "description": "iOS simulator interaction MCP",
        "url": "https://mcp.so/server/ios_simulator_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "ios-simulator-mcp"
    },
    {
        "id": 393,
        "name": "k6-mcp-server",
        "description": "K6 load testing MCP",
        "url": "https://mcp.so/server/k6_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "k6-mcp"
    },
    {
        "id": 394,
        "name": "Multiverse MCP Server",
        "description": "Multiple MCP instance management",
        "url": "https://mcp.so/server/multiverse_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "multiverse-mcp"
    },
    {
        "id": 395,
        "name": "BrowserStack MCP Server",
        "description": "Official BrowserStack MCP",
        "url": "https://mcp.so/server/browserstack_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "browserstack-mcp"
    },
    {
        "id": 396,
        "name": "JVM MCP Server",
        "description": "JVM-based MCP implementation",
        "url": "https://mcp.so/server/jvm_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "jvm-mcp"
    },
    {
        "id": 397,
        "name": "Webhook Tester MCP Server",
        "description": "Webhook testing via webhook-test.com",
        "url": "https://mcp.so/server/webhook_tester_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "webhook-tester-mcp"
    },
    {
        "id": 398,
        "name": "FastMCP Weather Server",
        "description": "Production-ready weather MCP",
        "url": "https://mcp.so/server/fastmcp_weather/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "fastmcp-weather"
    },
    {
        "id": 399,
        "name": "Fetch MCP Server",
        "description": "Flexible HTTP fetching MCP",
        "url": "https://mcp.so/server/fetch_mcp_flexible/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "fetch-mcp-flexible"
    },
    {
        "id": 400,
        "name": "Gin-MCP",
        "description": "Zero-Config Gin API bridge",
        "url": "https://mcp.so/server/gin_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "gin-mcp"
    },
    {
        "id": 401,
        "name": "Renamify",
        "description": "Smart search and replace for codebases",
        "url": "https://mcp.so/server/renamify_mcp/page=270",
        "category": "Development",
        "installMethod": "npx",
        "command": "renamify-mcp"
    },
    {
        "id": 402,
        "name": "GoCopilotAgent",
        "description": "Go-based task list server",
        "url": "https://mcp.so/server/gocopilot_agent_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "gocopilot-agent-mcp"
    },
    {
        "id": 403,
        "name": "Web3 Research MCP",
        "description": "Crypto research MCP",
        "url": "https://mcp.so/server/web3_research_mcp/page=270",
        "category": "Search",
        "installMethod": "npx",
        "command": "web3-research-mcp"
    },
    {
        "id": 404,
        "name": "Alchemy MCP Server",
        "description": "Official Alchemy blockchain MCP",
        "url": "https://mcp.so/server/alchemy_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "alchemy-mcp"
    },
    {
        "id": 405,
        "name": "AIOS Monorepo",
        "description": "All source code for AIOS (Manual Install)",
        "url": "https://github.com/agiresearch/AIOS",
        "category": "Development",
        "installMethod": "manual",
        "command": "git clone https://github.com/agiresearch/AIOS"
    },
    {
        "id": 406,
        "name": "METAESTETICS Clinic Management",
        "description": "Clinic management platform source code",
        "url": "https://mcp.so/server/metaestetics_mcp/page=270",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "metaestetics-mcp"
    },
    {
        "id": 407,
        "name": "PageSpeed MCP Server",
        "description": "Pull pagespeed data MCP",
        "url": "https://mcp.so/server/pagespeed_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "pagespeed-mcp"
    },
    {
        "id": 408,
        "name": "MCP To LangChain Tools Conversion",
        "description": "TypeScript utility for MCP tool conversion",
        "url": "https://mcp.so/server/mcp_langchain_convert/page=275",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-langchain-convert"
    },
    {
        "id": 409,
        "name": "pymcp",
        "description": "Asynchronous Python MCP library",
        "url": "https://mcp.so/server/pymcp/page=275",
        "category": "Development",
        "installMethod": "npx",
        "command": "pymcp"
    },
    {
        "id": 410,
        "name": "Model Context Protocol Servers",
        "description": "MCP Server Collection",
        "url": "https://mcp.so/server/mcp_collection/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "mcp-collection"
    },
    {
        "id": 411,
        "name": "Supabase MCP Server",
        "description": "Supabase integration (via PostgREST)",
        "url": "https://github.com/supabase/mcp-server-postgrest",
        "category": "Database",
        "installMethod": "npx",
        "command": "@supabase/mcp-server-postgrest",
        "env": {
            "SUPABASE_URL": "YOUR_SUPABASE_URL",
            "SUPABASE_KEY": "YOUR_SUPABASE_KEY"
        }
    },
    {
        "id": 412,
        "name": "Awesome-MCP-Server",
        "description": "All MCP related projects",
        "url": "https://mcp.so/server/awesome_mcp_projects/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "awesome-mcp-projects"
    },
    {
        "id": 413,
        "name": "Exchange Rate MCP Server",
        "description": "Norges Bank exchange rate API",
        "url": "https://mcp.so/server/exchange_rate_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "exchange-rate-mcp"
    },
    {
        "id": 414,
        "name": "Figma MCP Server",
        "description": "Figma API full functionality",
        "url": "https://github.com/GLips/Figma-Context-MCP",
        "category": "Design",
        "installMethod": "npx",
        "command": "figma-developer-mcp",
        "env": {
            "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_TOKEN"
        }
    },
    {
        "id": 415,
        "name": "Semantic PostgreSQL MCP Server",
        "description": "PostgreSQL with semantic search",
        "url": "https://github.com/mcp-squad/semantic-postgres",
        "category": "Database",
        "installMethod": "npx",
        "command": "@modelcontextprotocol/server-postgres",
        "args": ["postgresql://localhost:5432/mydb"]
    },
    {
        "id": 416,
        "name": "Slack MCP Server with SSE Transport",
        "description": "Slack integration with SSE",
        "url": "https://mcp.so/server/slack_sse_mcp/page=275",
        "category": "Communication",
        "installMethod": "npx",
        "command": "slack-sse-mcp",
        "env": {
            "SLACK_BOT_TOKEN": "YOUR_BOT_TOKEN",
            "SLACK_TEAM_ID": "YOUR_TEAM_ID"
        }
    },
    {
        "id": 417,
        "name": "MCP GitHub Reader",
        "description": "GitHub repos into context",
        "url": "https://mcp.so/server/github_reader_mcp/page=275",
        "category": "Development",
        "installMethod": "npx",
        "command": "github-reader-mcp"
    },
    {
        "id": 418,
        "name": "mcp-server-weather-test",
        "description": "Weather server testing",
        "url": "https://mcp.so/server/weather_test_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "weather-test-mcp"
    },
    {
        "id": 419,
        "name": "Freqtrade Test Repository",
        "description": "MCP server functionality testing",
        "url": "https://mcp.so/server/freqtrade_test_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "freqtrade-test-mcp"
    },
    {
        "id": 420,
        "name": "DevOps MCP Servers",
        "description": "MCP servers for DevOps tools",
        "url": "https://mcp.so/server/devops_mcp/page=275",
        "category": "Development",
        "installMethod": "npx",
        "command": "devops-mcp"
    },
    {
        "id": 421,
        "name": "fpl-server",
        "description": "MCP server for FPL",
        "url": "https://mcp.so/server/fpl_mcp/page=275",
        "category": "Sports",
        "installMethod": "npx",
        "command": "fpl-mcp"
    },
    {
        "id": 422,
        "name": "CronSignal",
        "description": "Monitor cron jobs and scheduled tasks",
        "url": "https://mcp.so/server/cronsignal_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "cronsignal-mcp"
    },
    {
        "id": 423,
        "name": "Tandoor MCP Server",
        "description": "Tandoor Recipe Manager integration",
        "url": "https://github.com/starbuck93/tandoor-mcp-server",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "tandoor-mcp",
        "env": {
            "TANDOOR_URL": "YOUR_TANDOOR_URL",
            "TANDOOR_API_TOKEN": "YOUR_API_TOKEN"
        }
    },
    {
        "id": 424,
        "name": "AI-powered Chat System",
        "description": "Multiple MCP servers integration",
        "url": "https://mcp.so/server/ai_chat_system_mcp/page=275",
        "category": "Communication",
        "installMethod": "npx",
        "command": "ai-chat-system-mcp"
    },
    {
        "id": 425,
        "name": "MCP-FREDAPI",
        "description": "FRED API integration with MCP",
        "url": "https://mcp.so/server/fred_mcp/page=275",
        "category": "Utilities",
        "installMethod": "npx",
        "command": "fred-mcp"
    },
    {
        "id": 426,
        "name": "mcp_repo_96c7c875",
        "description": "Test repository for GitHub MCP",
        "url": "https://mcp.so/server/mcp_github_test/page=275",
        "category": "Development",
        "installMethod": "npx",
        "command": "mcp-github-test"
    },
    {
        "id": 427,
        "name": "MongoDB MCP Server",
        "description": "MongoDB integration",
        "url": "https://github.com/mongodb-js/mongodb-mcp-server",
        "category": "Database",
        "installMethod": "npx",
        "command": "mongodb-mcp-server",
        "env": {
            "MONGODB_CONNECTION_STRING": "mongodb://localhost:27017"
        }
    },
    {
        "id": 428,
        "name": "spring-ai-mcp-server",
        "description": "MCP Server using Spring AI (Manual Install)",
        "url": "https://github.com/spring-projects/spring-ai",
        "category": "Development",
        "installMethod": "manual",
        "command": "mvn spring-boot:run"
    },
    {
        "id": 430,
        "name": "📡 UniFi Network MCP Server",
        "description": "MCP server for UniFi network management",
        "url": "https://mcp.so/server/unifi_network_mcp/page=35"
    },
    {
        "id": 431,
        "name": "MCP Kubernetes Server",
        "description": "Mirror of Kubernetes MCP",
        "url": "https://mcp.so/server/kubernetes_mcp_mirror/page=35"
    },
    {
        "id": 432,
        "name": "MCP Pro",
        "description": "Model Context Protocol Server Management with Remote MCP Gateway",
        "url": "https://mcp.so/server/mcp_pro/page=35"
    },
    {
        "id": 433,
        "name": "agent-twitter-client-mcp",
        "description": "MCP implementation for Twitter interactions",
        "url": "https://mcp.so/server/twitter_agent_mcp/page=35"
    },
    {
        "id": 434,
        "name": "Chatbot MCP",
        "description": "Simple client and server MCP",
        "url": "https://mcp.so/server/chatbot_mcp/page=35"
    },
    {
        "id": 435,
        "name": "MCP Qwen Project",
        "description": "MCP client/server example using Qwen",
        "url": "https://mcp.so/server/qwen_mcp/page=35"
    },
    {
        "id": 436,
        "name": "Clojure SDK",
        "description": "Clojure SDK to create MCP servers",
        "url": "https://mcp.so/server/clojure_sdk_mcp/page=35"
    },
    {
        "id": 437,
        "name": "GitHub Actions MCP Server",
        "description": "GitHub Actions Model Context Protocol Server",
        "url": "https://mcp.so/server/github_actions_mcp/page=35"
    },
    {
        "id": 438,
        "name": "Cairo Coder",
        "description": "Most powerful open-source Cairo code generator",
        "url": "https://mcp.so/server/cairo_coder_mcp/page=35"
    },
    {
        "id": 439,
        "name": "mcp-github-cli",
        "description": "MCP server for GitHub using GH CLI",
        "url": "https://mcp.so/server/github_cli_mcp/page=35"
    },
    {
        "id": 440,
        "name": "Elevenlabs MCP",
        "description": "Official ElevenLabs MCP server",
        "url": "https://mcp.so/server/elevenlabs_mcp/page=35"
    },
    {
        "id": 441,
        "name": "RedNote MCP",
        "description": "MCP server for accessing RedNote (XiaoHongShu)",
        "url": "https://mcp.so/server/rednote_mcp/page=35"
    },
    {
        "id": 442,
        "name": "mcp-server-k8s",
        "description": "Simple MCP server for Kubernetes",
        "url": "https://mcp.so/server/k8s_simple_mcp/page=35"
    },
    {
        "id": 443,
        "name": "Clanki 2.0",
        "description": "AI's Supercharged Bridge to Anki",
        "url": "https://mcp.so/server/clanki_anki_mcp/page=35"
    },
    {
        "id": 444,
        "name": "EdgeOne Pages MCP",
        "description": "MCP Client and Server with Functions",
        "url": "https://mcp.so/server/edgeone_pages_functions/page=35"
    },
    {
        "id": 445,
        "name": "MCP Order Flow Server",
        "description": "Fetch and get order flow information",
        "url": "https://mcp.so/server/order_flow_mcp/page=35"
    },
    {
        "id": 446,
        "name": "subtitle-mcp",
        "description": "MCP Server for ETL (Extract Translate Load)",
        "url": "https://mcp.so/server/subtitle_etl_mcp/page=35"
    },
    {
        "id": 447,
        "name": "airtable-mcp-server",
        "description": "Airtable MCP Server for AI systems",
        "url": "https://mcp.so/server/airtable_mcp/page=35"
    },
    {
        "id": 448,
        "name": "WhatsApp MCP Server",
        "description": "TypeScript/Baileys WhatsApp integration",
        "url": "https://mcp.so/server/whatsapp_ts_mcp/page=35"
    },
    {
        "id": 449,
        "name": "Metal Price MCP Server",
        "description": "Gold and precious metal prices via GoldAPI",
        "url": "https://mcp.so/server/metal_price_mcp/page=35"
    },
    {
        "id": 450,
        "name": "codemirror-mcp",
        "description": "CodeMirror extension for MCP",
        "url": "https://mcp.so/server/codemirror_mcp/page=35"
    },
    {
        "id": 451,
        "name": "JiraMCPServer",
        "description": "Simple Jira MCP server prototype",
        "url": "https://mcp.so/server/jira_prototype_mcp/page=35"
    },
    {
        "id": 452,
        "name": "mcp-server-python-template",
        "description": "Template repository for Python MCP server",
        "url": "https://mcp.so/server/python_template_mcp/page=35"
    },
    {
        "id": 453,
        "name": "Retail MCP Server",
        "description": "MCP implementation for retail products",
        "url": "https://mcp.so/server/retail_mcp/page=35"
    },
    {
        "id": 454,
        "name": "Intento Translation MCP Server",
        "description": "Intento Translate MCP server",
        "url": "https://mcp.so/server/intento_translate_mcp/page=35"
    },
    {
        "id": 455,
        "name": "Consult7",
        "description": "Leverage models with massive context windows",
        "url": "https://mcp.so/server/consult7_mcp/page=35"
    },
    {
        "id": 456,
        "name": "Search Stock News MCP Server",
        "description": "Real-time stock news search via Tavily",
        "url": "https://mcp.so/server/stock_news_mcp/page=35"
    },
    {
        "id": 457,
        "name": "Glide MCP Server",
        "description": "Glide Apps API v2 MCP",
        "url": "https://mcp.so/server/glide_mcp/page=35"
    },
    {
        "id": 458,
        "name": "MCP Server",
        "description": "Personal MCP server",
        "url": "https://mcp.so/server/personal_mcp/page=35"
    },
    {
        "id": 459,
        "name": "YouTube MCP Server",
        "description": "Upload videos to YouTube via Claude",
        "url": "https://mcp.so/server/youtube_upload_mcp/page=35"
    },
    {
        "id": 460,
        "name": "J-Archive MCP Server",
        "description": "J-Archive for GitHub Copilot and AI",
        "url": "https://mcp.so/server/jarchive_mcp/page=35"
    },
    {
        "id": 461,
        "name": "MCP Bone",
        "description": "MCP Server container connection",
        "url": "https://mcp.so/server/mcp_bone/page=35"
    },
    {
        "id": 462,
        "name": "Sample MCP Server",
        "description": "Sample MCP in TypeScript",
        "url": "https://mcp.so/server/sample_ts_mcp/page=35"
    },
    {
        "id": 463,
        "name": "uptodoc",
        "description": "MCP server for latest documentation",
        "url": "https://mcp.so/server/uptodoc_mcp/page=35"
    },
    {
        "id": 464,
        "name": "EntraID MCP Server",
        "description": "EntraID via Microsoft Graph FastMCP",
        "url": "https://mcp.so/server/entraid_mcp/page=35"
    },
    {
        "id": 465,
        "name": "Api200",
        "description": "Open source API gateway for integrations",
        "url": "https://mcp.so/server/api200_mcp/page=35"
    },
    {
        "id": 466,
        "name": "Spring Boot AI MCP Client",
        "description": "Spring Boot application for MCP servers",
        "url": "https://mcp.so/server/spring_boot_ai_mcp/page=35"
    },
    {
        "id": 467,
        "name": "defold-mcp",
        "description": "MCP server for Defold projects in Cursor",
        "url": "https://mcp.so/server/defold_mcp/page=35"
    },
    {
        "id": 468,
        "name": "Pearl MCP Server",
        "description": "Pearl AI and Expert services MCP",
        "url": "https://mcp.so/server/pearl_mcp/page=55"
    },
    {
        "id": 469,
        "name": "Repo Context MCP",
        "description": "Programmatic access to repository contents",
        "url": "https://mcp.so/server/repo_context_mcp/page=55"
    },
    {
        "id": 470,
        "name": "ContextualAgentRulesHub",
        "description": "MCP server for contextual agent rules",
        "url": "https://mcp.so/server/contextual_rules_mcp/page=55"
    },
    {
        "id": 471,
        "name": "mcpserver-certexpiry-checker",
        "description": "Check certificate expiry details",
        "url": "https://mcp.so/server/cert_expiry_mcp/page=55"
    },
    {
        "id": 472,
        "name": "Scrapeless MCP Server",
        "description": "Real-time web data via Google services",
        "url": "https://mcp.so/server/scrapeless_mcp/page=55"
    },
    {
        "id": 473,
        "name": "MCP Storyblok Server",
        "description": "Storyblok content management MCP",
        "url": "https://mcp.so/server/storyblok_mcp/page=55"
    },
    {
        "id": 474,
        "name": "AGI-MCP-Agent",
        "description": "Modular AGI framework based on MCP",
        "url": "https://mcp.so/server/agi_mcp_agent/page=55"
    },
    {
        "id": 475,
        "name": "EventCatalog MCP Server",
        "description": "EventCatalog integration MCP",
        "url": "https://mcp.so/server/eventcatalog_mcp/page=55"
    },
    {
        "id": 476,
        "name": "Bigcommerce API MCP",
        "description": "BigCommerce REST API integration",
        "url": "https://mcp.so/server/bigcommerce_mcp/page=55"
    },
    {
        "id": 477,
        "name": "MCP Google Sheets Server",
        "description": "Read, write, manipulate spreadsheets",
        "url": "https://mcp.so/server/google_sheets_mcp/page=55"
    },
    {
        "id": 478,
        "name": "Rbdc MCP",
        "description": "Database server supporting SQLite, MySQL, PostgreSQL, MSSQL",
        "url": "https://mcp.so/server/rbdc_mcp/page=55"
    },
    {
        "id": 479,
        "name": "QuantConnect",
        "description": "QuantConnect cloud platform bridge MCP",
        "url": "https://mcp.so/server/quantconnect_mcp/page=55"
    },
    {
        "id": 480,
        "name": "GitHub MCP Server Demo",
        "description": "GitHub MCP with repository creation",
        "url": "https://mcp.so/server/github_demo_mcp/page=55"
    },
    {
        "id": 481,
        "name": "My_tasks_mcp",
        "description": "Simple task management MCP",
        "url": "https://mcp.so/server/tasks_mcp/page=55"
    },
    {
        "id": 482,
        "name": "Bilibili Video Info MCP",
        "description": "Bilibili video subtitle and comment extraction",
        "url": "https://mcp.so/server/bilibili_video_mcp/page=55"
    },
    {
        "id": 483,
        "name": "Clear Thought MCP Server",
        "description": "Clear Thought MCP server",
        "url": "https://mcp.so/server/clear_thought_mcp/page=55"
    },
    {
        "id": 484,
        "name": "MCP Server.exe",
        "description": "Cursor MCP launcher executable",
        "url": "https://mcp.so/server/mcp_exe_launcher/page=55"
    },
    {
        "id": 485,
        "name": "MaxKB",
        "description": "Open-source AI assistant with MCP",
        "url": "https://mcp.so/server/maxkb_mcp/page=55"
    },
    {
        "id": 486,
        "name": "Math MCP Server",
        "description": "Mathematical calculations and analysis",
        "url": "https://mcp.so/server/math_mcp/page=55"
    },
    {
        "id": 487,
        "name": "sindi-ai-mcp-server",
        "description": "Java implementation of MCP",
        "url": "https://mcp.so/server/sindi_java_mcp/page=55"
    },
    {
        "id": 488,
        "name": "MCP Documentation Server",
        "description": "MCP developer documentation",
        "url": "https://mcp.so/server/mcp_docs_server/page=55"
    },
    {
        "id": 489,
        "name": "Switch Bot MCP Server",
        "description": "Control SwitchBot devices",
        "url": "https://mcp.so/server/switchbot_mcp/page=55"
    },
    {
        "id": 490,
        "name": "RuleGo",
        "description": "Lightweight rule engine framework for Go",
        "url": "https://mcp.so/server/rulego_mcp/page=55"
    },
    {
        "id": 491,
        "name": "ArgoCD AI Agent",
        "description": "ArgoCD with 1st party MCP Server",
        "url": "https://mcp.so/server/argocd_ai_agent/page=55"
    },
    {
        "id": 492,
        "name": "MCP server for kintone",
        "description": "Kintone sample MCP server",
        "url": "https://mcp.so/server/kintone_mcp/page=55"
    },
    {
        "id": 493,
        "name": "McpServer",
        "description": "Java Spring framework MCP",
        "url": "https://mcp.so/server/spring_mcp_impl/page=55"
    },
    {
        "id": 494,
        "name": "Unofficial Ensembl MCP Server",
        "description": "Ensembl REST API genomic data",
        "url": "https://mcp.so/server/ensembl_mcp/page=55"
    },
    {
        "id": 495,
        "name": "mcp-national-rail",
        "description": "Train schedules from National Rail",
        "url": "https://mcp.so/server/national_rail_mcp/page=55"
    },
    {
        "id": 496,
        "name": "Box MCP Server",
        "description": "Box content access and tools",
        "url": "https://mcp.so/server/box_mcp/page=55"
    },
    {
        "id": 497,
        "name": "Vectorize MCP Server",
        "description": "Official Vectorize MCP",
        "url": "https://mcp.so/server/vectorize_mcp/page=55"
    },
    {
        "id": 498,
        "name": "Vibe Coding Buddy",
        "description": "Your Vibe Coding companion",
        "url": "https://mcp.so/server/vibe_coding_buddy/page=55"
    },
    {
        "id": 499,
        "name": "Trivy MCP Server Plugin",
        "description": "Trivy plugin for MCP server",
        "url": "https://mcp.so/server/trivy_mcp/page=55"
    },
    {
        "id": 500,
        "name": "Tiny Chat",
        "description": "LLM application with RAG and MCP",
        "url": "https://mcp.so/server/tiny_chat_mcp/page=55"
    },
    {
        "id": 501,
        "name": "File_Summarizer_MCP_Server",
        "description": "Read and summarize files with Tika",
        "url": "https://mcp.so/server/file_summarizer_mcp/page=55"
    },
    {
        "id": 502,
        "name": "n8n MCP Server",
        "description": "n8n API tools and resources",
        "url": "https://mcp.so/server/n8n_mcp/page=55"
    },
    {
        "id": 503,
        "name": "Mcp Recraft Server",
        "description": "Recraft AI API MCP",
        "url": "https://mcp.so/server/recraft_mcp/page=55"
    },
    {
        "id": 504,
        "name": "Auto MCP",
        "description": "Convert OpenAPI to MCP server",
        "url": "https://mcp.so/server/auto_openapi_mcp/page=55"
    },
    {
        "id": 505,
        "name": "Base Network MCP Server",
        "description": "Query Base Network blockchain",
        "url": "https://mcp.so/server/base_network_mcp/page=55"
    },
    {
        "id": 506,
        "name": "AIDevTools Sidekick MCP Server",
        "description": "AI-powered software development tools",
        "url": "https://mcp.so/server/aidevtools_mcp/page=55"
    },
    {
        "id": 507,
        "name": "Yutu",
        "description": "YouTube automation MCP server",
        "url": "https://mcp.so/server/yutu_youtube_mcp/page=55"
    },
    {
        "id": 508,
        "name": "Angreal MCP Server",
        "description": "MCP for angreal projects",
        "url": "https://mcp.so/server/angreal_mcp/page=55"
    },
    {
        "id": 509,
        "name": "@b12/website-generator-mcp-server",
        "description": "B12's website generation MCP",
        "url": "https://mcp.so/server/b12_website_mcp/page=70"
    },
    {
        "id": 510,
        "name": "decoupler-MCP",
        "description": "Biological activities analysis MCP",
        "url": "https://mcp.so/server/decoupler_bio_mcp/page=70"
    },
    {
        "id": 511,
        "name": "WebSearch MCP Server",
        "description": "Mirror of web search MCP",
        "url": "https://mcp.so/server/websearch_mirror_mcp/page=70"
    },
    {
        "id": 512,
        "name": "CDK API MCP Server",
        "description": "AWS CDK API references and samples",
        "url": "https://mcp.so/server/aws_cdk_mcp/page=70"
    },
    {
        "id": 513,
        "name": "Task Manager MCP Server",
        "description": "Node.js task planning with LLM",
        "url": "https://mcp.so/server/task_manager_llm_mcp/page=70"
    },
    {
        "id": 514,
        "name": "Discovery",
        "description": "Static app for MCP server exploration",
        "url": "https://mcp.so/server/discovery_mcp_app/page=70"
    },
    {
        "id": 515,
        "name": "Claude Auto-Approve MCP",
        "description": "Auto-approve functionality MCP",
        "url": "https://mcp.so/server/claude_autoapprove_mcp/page=70"
    },
    {
        "id": 516,
        "name": "MCP Telegram Server",
        "description": "Telegram integration for Cursor",
        "url": "https://mcp.so/server/telegram_cursor_mcp/page=70"
    },
    {
        "id": 517,
        "name": "HOA-mcp-server",
        "description": "HOA document information retrieval",
        "url": "https://mcp.so/server/hoa_mcp/page=70"
    },
    {
        "id": 518,
        "name": "feed-mcp",
        "description": "RSS, Atom, JSON Feeds MCP",
        "url": "https://mcp.so/server/feed_mcp/page=70"
    },
    {
        "id": 519,
        "name": "Trykitt MCP Server",
        "description": "Trykitt API wrapper MCP",
        "url": "https://mcp.so/server/trykitt_mcp/page=70"
    },
    {
        "id": 520,
        "name": "MCP-Server-Template",
        "description": "Web crawling MCP template",
        "url": "https://mcp.so/server/crawl_template_mcp/page=70"
    },
    {
        "id": 521,
        "name": "kam-mcp-server",
        "description": "KAM MCP Server",
        "url": "https://mcp.so/server/kam_mcp/page=70"
    },
    {
        "id": 522,
        "name": "@mcplookup-org/mcp-server",
        "description": "MCP Bridge Server with dynamic discovery",
        "url": "https://mcp.so/server/mcplookup_bridge/page=70"
    },
    {
        "id": 523,
        "name": "MCP Server – Scryfall API",
        "description": "Scryfall API integration",
        "url": "https://mcp.so/server/scryfall_mcp/page=70"
    },
    {
        "id": 524,
        "name": "ZAN MCP Server",
        "description": "ZAN Node Service MCP",
        "url": "https://mcp.so/server/zan_node_mcp/page=70"
    },
    {
        "id": 525,
        "name": "IR Toolshed MCP Server",
        "description": "Network incident response tools",
        "url": "https://mcp.so/server/ir_toolshed_mcp/page=70"
    },
    {
        "id": 526,
        "name": "MCP Web Client",
        "description": "Web client for MCP servers",
        "url": "https://mcp.so/server/mcp_web_client/page=70"
    },
    {
        "id": 527,
        "name": "Confluence MCP Server",
        "description": "Confluence API sample MCP",
        "url": "https://mcp.so/server/confluence_mcp/page=70"
    },
    {
        "id": 528,
        "name": "DAS MCP Server on Cloudflare",
        "description": "Helius API asset search on Cloudflare",
        "url": "https://mcp.so/server/das_cloudflare_mcp/page=70"
    },
    {
        "id": 529,
        "name": "MCP Server Implementation Guide",
        "description": "Cursor integration guide",
        "url": "https://mcp.so/server/impl_guide_mcp/page=70"
    },
    {
        "id": 530,
        "name": "mcp",
        "description": "Zeroda trade SDK MCP",
        "url": "https://mcp.so/server/zeroda_mcp/page=70"
    },
    {
        "id": 531,
        "name": "REAPER MCP Server",
        "description": "Mixed and mastered tracks in REAPER",
        "url": "https://mcp.so/server/reaper_mcp/page=70"
    },
    {
        "id": 532,
        "name": "Canvas MCP Server v2.0",
        "description": "Canvas LMS API with 37 tools",
        "url": "https://mcp.so/server/canvas_lms_mcp/page=70"
    },
    {
        "id": 533,
        "name": "Documentation",
        "description": "MCP server testing repository",
        "url": "https://mcp.so/server/docs_test_mcp/page=70"
    },
    {
        "id": 534,
        "name": "Turbot Guardrails MCP Server",
        "description": "Guardrails data exploration",
        "url": "https://mcp.so/server/turbot_guardrails_mcp/page=70"
    },
    {
        "id": 535,
        "name": "OMNI-MQTT-MCP",
        "description": "MQTT MCP using FastMCP",
        "url": "https://mcp.so/server/mqtt_fastmcp/page=70"
    },
    {
        "id": 536,
        "name": "SimpleCalculator MCP Docker",
        "description": "Arithmetic operations with Docker",
        "url": "https://mcp.so/server/simple_calc_docker_mcp/page=70"
    },
    {
        "id": 537,
        "name": "Azure Functions Java Quickstart",
        "description": "Remote MCP server on Azure",
        "url": "https://mcp.so/server/azure_functions_mcp/page=70"
    },
    {
        "id": 538,
        "name": "mcp-init",
        "description": "Create TypeScript MCP server",
        "url": "https://mcp.so/server/init_ts_mcp/page=70"
    },
    {
        "id": 539,
        "name": "Kubernetes MCP Server",
        "description": "Kubernetes cluster MCP",
        "url": "https://mcp.so/server/k8s_full_mcp/page=70"
    },
    {
        "id": 540,
        "name": "MCP Server Starter",
        "description": "Simple MCP starter",
        "url": "https://mcp.so/server/simple_starter_mcp/page=70"
    },
    {
        "id": 541,
        "name": "AgentMode",
        "description": "All-in-1 MCP for developers",
        "url": "https://mcp.so/server/agentmode_mcp/page=70"
    },
    {
        "id": 542,
        "name": "PowerShell MCP Server",
        "description": "PowerShell MCP integration",
        "url": "https://mcp.so/server/powershell_mcp/page=70"
    },
    {
        "id": 543,
        "name": "Docker MCP Server",
        "description": "Docker integration MCP",
        "url": "https://mcp.so/server/docker_integration_mcp/page=70"
    },
    {
        "id": 544,
        "name": "Bluetooth MCP Server",
        "description": "Bluetooth for Claude AI",
        "url": "https://mcp.so/server/bluetooth_mcp/page=70"
    },
    {
        "id": 545,
        "name": "MCP iCal Server",
        "description": "MacOS Calendar interaction MCP",
        "url": "https://mcp.so/server/ical_macos_mcp/page=70"
    },
    {
        "id": 546,
        "name": "PubMed Analysis MCP Server",
        "description": "PubMed research data MCP",
        "url": "https://mcp.so/server/pubmed_analysis_mcp/page=70"
    },
    {
        "id": 547,
        "name": "File Search Assistant",
        "description": "File-search AI with embeddings",
        "url": "https://mcp.so/server/file_search_ai_mcp/page=85"
    },
    {
        "id": 548,
        "name": "MATLAB MCP Integration",
        "description": "MATLAB Engine API MCP",
        "url": "https://mcp.so/server/matlab_engine_mcp/page=85"
    },
    {
        "id": 549,
        "name": "Todo App",
        "description": "Built with Cursor using Box MCP",
        "url": "https://mcp.so/server/todo_app_mcp/page=85"
    },
    {
        "id": 550,
        "name": "Cloud Automator MCP server",
        "description": "Cloud Automator REST API wrapper",
        "url": "https://mcp.so/server/cloud_automator_mcp/page=85"
    },
    {
        "id": 551,
        "name": "CVE MCP Server",
        "description": "CVE vulnerability information",
        "url": "https://mcp.so/server/cve_mcp/page=85"
    },
    {
        "id": 552,
        "name": "Nuxt MCP Server on Vercel",
        "description": "Nuxt MCP with Vercel deployment",
        "url": "https://mcp.so/server/nuxt_vercel_mcp/page=85"
    },
    {
        "id": 553,
        "name": "ai-dev-mcp-server",
        "description": "AI-based development MCP",
        "url": "https://mcp.so/server/ai_dev_mcp/page=85"
    },
    {
        "id": 554,
        "name": "JSON Resume MCP Server",
        "description": "Resume update during coding",
        "url": "https://mcp.so/server/json_resume_mcp/page=85"
    },
    {
        "id": 555,
        "name": "CSharpMCP",
        "description": "Roslyn-based C# code execution",
        "url": "https://mcp.so/server/csharp_roslyn_mcp/page=85"
    },
    {
        "id": 556,
        "name": "mcp_servers",
        "description": "MCP Servers collection",
        "url": "https://mcp.so/server/mcp_servers_collection/page=85"
    },
    {
        "id": 557,
        "name": "aws-mcp-cloud-dev",
        "description": "AI-powered AWS development",
        "url": "https://mcp.so/server/aws_ai_dev_mcp/page=85"
    },
    {
        "id": 558,
        "name": "Java Map Component Platform",
        "description": "Java MCP implementation",
        "url": "https://mcp.so/server/java_mcp_platform/page=85"
    },
    {
        "id": 559,
        "name": "Bitcoin Wallet MCP Server",
        "description": "Bitcoin payments MCP",
        "url": "https://mcp.so/server/bitcoin_wallet_mcp/page=85"
    },
    {
        "id": 560,
        "name": "MCP Installer",
        "description": "Search and install MCP servers",
        "url": "https://mcp.so/server/mcp_installer/page=85"
    },
    {
        "id": 561,
        "name": "Unity MCP",
        "description": "Unity Editor actions via MCP",
        "url": "https://mcp.so/server/unity_editor_mcp/page=85"
    },
    {
        "id": 562,
        "name": "Miden MCP Server",
        "description": "Miden development MCP",
        "url": "https://mcp.so/server/miden_mcp/page=85"
    },
    {
        "id": 563,
        "name": "Agent-MCP",
        "description": "Local agent MCP server-client",
        "url": "https://mcp.so/server/agent_local_mcp/page=85"
    },
    {
        "id": 564,
        "name": "MCP APP",
        "description": "RAG application MCP",
        "url": "https://mcp.so/server/app_rag_mcp/page=85"
    },
    {
        "id": 565,
        "name": "Automated-Webflow",
        "description": "Connect MCP servers to Webflow",
        "url": "https://mcp.so/server/webflow_mcp/page=85"
    },
    {
        "id": 566,
        "name": "iRacing MCP",
        "description": "iRacing data chat interface",
        "url": "https://mcp.so/server/iracing_mcp/page=85"
    },
    {
        "id": 567,
        "name": "MCP SERVER",
        "description": "Anthropic SDK for dotnet 9",
        "url": "https://mcp.so/server/dotnet9_sdk_mcp/page=85"
    },
    {
        "id": 568,
        "name": "Spring Web to MCP Converter",
        "description": "Convert Spring REST to MCP",
        "url": "https://mcp.so/server/spring_rest_converter_mcp/page=85"
    },
    {
        "id": 569,
        "name": "MCP Server Tester",
        "description": "Automated testing for MCP servers",
        "url": "https://mcp.so/server/mcp_server_tester/page=85"
    },
    {
        "id": 570,
        "name": "BNM-MCP",
        "description": "Bank Negara Malaysia API MCP",
        "url": "https://mcp.so/server/bnm_api_mcp/page=85"
    },
    {
        "id": 571,
        "name": "Hugo MCP",
        "description": "Create and manage Hugo sites",
        "url": "https://mcp.so/server/hugo_mcp/page=85"
    },
    {
        "id": 572,
        "name": "Advanced PocketBase MCP Server",
        "description": "PocketBase integration",
        "url": "https://mcp.so/server/pocketbase_advanced_mcp/page=85"
    },
    {
        "id": 573,
        "name": "MCP-IQWiki",
        "description": "IQ.wiki knowledge base MCP",
        "url": "https://mcp.so/server/iqwiki_mcp/page=85"
    },
    {
        "id": 574,
        "name": "GitHub Enterprise MCP Server",
        "description": "GitHub Enterprise integration",
        "url": "https://mcp.so/server/github_enterprise_mcp/page=85"
    },
    {
        "id": 575,
        "name": "mcp-server-v2ex",
        "description": "V2EX community MCP",
        "url": "https://mcp.so/server/v2ex_mcp/page=85"
    },
    {
        "id": 576,
        "name": "MCP BigQuery Server",
        "description": "BigQuery table queries",
        "url": "https://mcp.so/server/bigquery_queries_mcp/page=85"
    },
    {
        "id": 577,
        "name": "MCP Tools Project",
        "description": "Python MCP toolset with automation",
        "url": "https://mcp.so/server/mcp_tools_python/page=85"
    },
];

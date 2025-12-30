const mcpServers = [
    {
        "id": 1,
        "name": "Time",
        "description": "A Model Context Protocol server that provides time and timezone conversion capabilities. This server enables LLMs to get current time information and perform timezone conversions using IANA timezone names, with automatic system timezone detection.",
        "url": "https://mcp.so/server/time"
    },
    {
        "id": 2,
        "name": "AlphaVantage",
        "description": "Bring enterprise-grade stock market data to agents and LLMs",
        "url": "https://mcp.so/server/alphavantage",
        "sponsor": true
    },
    {
        "id": 3,
        "name": "EdgeOne Pages MCP",
        "description": "An MCP service designed for deploying HTML content to EdgeOne Pages and obtaining an accessible public URL.",
        "url": "https://mcp.so/server/edgeone-pages-mcp"
    },
    {
        "id": 4,
        "name": "Filesystem",
        "description": "Secure file operations with configurable access controls",
        "url": "https://mcp.so/server/filesystem"
    },
    {
        "id": 5,
        "name": "Redis",
        "description": "A Model Context Protocol server that provides access to Redis databases. This server enables LLMs to interact with Redis key-value stores through a set of standardized tools.",
        "url": "https://mcp.so/server/redis"
    },
    {
        "id": 6,
        "name": "GitLab",
        "description": "GitLab API, enabling project management",
        "url": "https://mcp.so/server/gitlab"
    },
    {
        "id": 7,
        "name": "Blender",
        "description": "BlenderMCP connects Blender to Claude AI through the Model Context Protocol (MCP), allowing Claude to directly interact with and control Blender. This integration enables prompt assisted 3D modeling, scene creation, and manipulation.",
        "url": "https://mcp.so/server/blender"
    },
    {
        "id": 8,
        "name": "Aws Kb Retrieval Server",
        "description": "An MCP server implementation for retrieving information from the AWS Knowledge Base using the Bedrock Agent Runtime.",
        "url": "https://mcp.so/server/aws-kb-retrieval"
    },
    {
        "id": 9,
        "name": "Sentry",
        "description": "Retrieving and analyzing issues from Sentry.io",
        "url": "https://mcp.so/server/sentry"
    },
    {
        "id": 10,
        "name": "Search1API",
        "description": "One API for Search, Crawling, and Sitemaps",
        "url": "https://mcp.so/server/search1api"
    },
    {
        "id": 11,
        "name": "Howtocook Mcp",
        "description": "MCP Server based on Anduin2017/HowToCook, helps recommend recipes, plan meals, and solve the problem of what to eat today",
        "url": "https://mcp.so/server/howtocook"
    },
    {
        "id": 12,
        "name": "mcp-server-flomo MCP Server",
        "description": "Write notes to Flomo",
        "url": "https://mcp.so/server/mcp-server-flomo"
    },
    {
        "id": 13,
        "name": "MiniMax MCP",
        "description": "Official MiniMax Model Context Protocol (MCP) server that enables interaction with powerful Text to Speech, image generation and video generation APIs.",
        "url": "https://mcp.so/server/minimax-mcp"
    },
    {
        "id": 14,
        "name": "AgentQL MCP Server",
        "description": "Model Context Protocol server that integrates AgentQL's data extraction capabilities.",
        "url": "https://mcp.so/server/agentql"
    },
    {
        "id": 15,
        "name": "Perplexity Ask MCP Server",
        "description": "A Model Context Protocol Server connector for Perplexity API, to enable web search without leaving the MCP ecosystem.",
        "url": "https://mcp.so/server/perplexity"
    },
    {
        "id": 16,
        "name": "Jina AI MCP Tools",
        "description": "A Model Context Protocol (MCP) server that integrates with Jina AI Search Foundation APIs.",
        "url": "https://mcp.so/server/jina-ai"
    },
    {
        "id": 17,
        "name": "PostgreSQL",
        "description": "Read-only database access with schema inspection",
        "url": "https://mcp.so/server/postgresql"
    },
    {
        "id": 18,
        "name": "Zhipu Web Search",
        "description": "Zhipu Web Search MCP Server is a search engine specifically designed for large models. It integrates four search engines, allowing users to flexibly compare and switch between them.",
        "url": "https://mcp.so/server/zhipu-web-search"
    },
    {
        "id": 19,
        "name": "Amap Maps",
        "description": "Amap (Aode) official MCP Server for map services",
        "url": "https://mcp.so/server/amap"
    },
    {
        "id": 20,
        "name": "Framelink Figma MCP Server",
        "description": "MCP server to provide Figma layout information to AI coding agents like Cursor",
        "url": "https://mcp.so/server/framelink-figma"
    },
    {
        "id": 21,
        "name": "Baidu Map",
        "description": "Baidu Map core API now fully compatible with MCP protocol",
        "url": "https://mcp.so/server/baidu-map"
    },
    {
        "id": 22,
        "name": "Firecrawl Mcp Server",
        "description": "Official Firecrawl MCP Server - Adds powerful web scraping to Cursor, Claude and any other LLM clients.",
        "url": "https://mcp.so/server/firecrawl"
    },
    {
        "id": 23,
        "name": "Sequential Thinking",
        "description": "An MCP server implementation that provides a tool for dynamic and reflective problem-solving through a structured thinking process.",
        "url": "https://mcp.so/server/sequential-thinking"
    },
    {
        "id": 24,
        "name": "EverArt",
        "description": "AI image generation using various models",
        "url": "https://mcp.so/server/everart"
    },
    {
        "id": 25,
        "name": "Serper MCP Server",
        "description": "A Serper MCP Server for search functionality",
        "url": "https://mcp.so/server/serper"
    },
    {
        "id": 26,
        "name": "Context7",
        "description": "Context7 MCP Server -- Up-to-date code documentation for LLMs and AI code editors",
        "url": "https://mcp.so/server/context7"
    },
    {
        "id": 27,
        "name": "Playwright Mcp",
        "description": "Playwright MCP server for browser automation",
        "url": "https://mcp.so/server/playwright"
    },
    {
        "id": 28,
        "name": "Puppeteer",
        "description": "Browser automation and web scraping",
        "url": "https://mcp.so/server/puppeteer"
    },
    {
        "id": 29,
        "name": "MCP Advisor",
        "description": "MCP Advisor & Installation - Use the right MCP server for your needs",
        "url": "https://mcp.so/server/mcp-advisor"
    },
    {
        "id": 30,
        "name": "Qiniu MCP Server",
        "description": "MCP Server built on Qiniu Cloud products, supporting AI model client access to Qiniu Cloud storage resources",
        "url": "https://mcp.so/server/qiniu"
    },
    {
        "id": 31,
        "name": "GBOX Android MCP",
        "description": "GBOX provides environments for AI Agents to operate computer and mobile devices",
        "url": "https://mcp.so/server/gbox-android"
    },
    {
        "id": 32,
        "name": "Neon MCP Server",
        "description": "MCP server for interacting with Neon Management API and databases",
        "url": "https://mcp.so/server/neon"
    },
    {
        "id": 33,
        "name": "302_sandbox_mcp",
        "description": "Create a remote sandbox that can execute code/run commands/upload and download files",
        "url": "https://mcp.so/server/302-sandbox"
    },
    {
        "id": 34,
        "name": "MCP Server for Milvus",
        "description": "The Milvus MCP server enables AI applications to interact with Milvus vector databases using natural language commands.",
        "url": "https://mcp.so/server/milvus"
    },
    {
        "id": 35,
        "name": "302_browser_use_mcp",
        "description": "Automatically create a remote browser to complete your specified tasks, developed based on Browser Use + Sandbox.",
        "url": "https://mcp.so/server/302-browser-use"
    },
    {
        "id": 36,
        "name": "Mailtrap Email Sending MCP",
        "description": "An MCP server that provides a tool for sending transactional emails via Mailtrap",
        "url": "https://mcp.so/server/mailtrap"
    },
    {
        "id": 37,
        "name": "Mcp Server Chatsum",
        "description": "Summarize chat message",
        "url": "https://mcp.so/server/chatsum"
    },
    {
        "id": 38,
        "name": "Fetch",
        "description": "Web content fetching and conversion for efficient LLM usage",
        "url": "https://mcp.so/server/fetch"
    },
    {
        "id": 39,
        "name": "Slack",
        "description": "Channel management and messaging capabilities",
        "url": "https://mcp.so/server/slack"
    },
    {
        "id": 40,
        "name": "Brave Search",
        "description": "Web and local search using Brave's Search API",
        "url": "https://mcp.so/server/brave-search"
    },
    {
        "id": 41,
        "name": "Github",
        "description": "Repository management, file operations, and GitHub API integration",
        "url": "https://mcp.so/server/github"
    },
    {
        "id": 42,
        "name": "Google Maps",
        "description": "Location services, directions, and place details",
        "url": "https://mcp.so/server/google-maps"
    },
    {
        "id": 43,
        "name": "Bucket Feature Flags MCP Server",
        "description": "Flag features directly from chat in your code editor, including VS Code, Cursor, Windsurf, Claude Code",
        "url": "https://mcp.so/server/bucket-feature-flags"
    },
    {
        "id": 44,
        "name": "Coding Standards MCP Server",
        "description": "MCP Server for Coding Standards - providing standardized coding guidelines and best practices",
        "url": "https://mcp.so/server/coding-standards"
    },
    {
        "id": 45,
        "name": "vercel-mcp",
        "description": "Lightweight MCP server to give your Cursor Agent access to the Vercel API.",
        "url": "https://mcp.so/server/vercel"
    },
    {
        "id": 46,
        "name": "Todoist MCP Server Extended",
        "description": "Todoist MCP Server Extended - Enabling natural language management of todoist via Claude, MCP and todoist REST APIv2.",
        "url": "https://mcp.so/server/todoist"
    },
    {
        "id": 47,
        "name": "Notion MCP Server",
        "description": "Notion MCP Server implementation for Claude and other AI assistants",
        "url": "https://mcp.so/server/notion"
    },
    {
        "id": 48,
        "name": "mcp",
        "description": "MCP example from webset",
        "url": "https://mcp.so/server/mcp-example"
    },
    {
        "id": 49,
        "name": "MCP Server Research Project",
        "description": "Research claude code and mcp server",
        "url": "https://mcp.so/server/research-project"
    },
    {
        "id": 50,
        "name": "Weather MCP Server",
        "description": "A weather information server built using Model Context Protocol (MCP) to provide real-time weather data and forecasts",
        "url": "https://mcp.so/server/weather"
    },
    {
        "id": 51,
        "name": "Protoc Gen Go Mcp",
        "description": "Go protobuf compiler extension to turn any gRPC service into an MCP server",
        "url": "https://mcp.so/server/protoc-gen-go"
    },
    {
        "id": 52,
        "name": "GalaConnect MCP Server",
        "description": "Galachain MCP server for use with LLMs",
        "url": "https://mcp.so/server/galaconnect"
    },
    {
        "id": 53,
        "name": "MCP Servers",
        "description": "Type safety mcp servers with deno",
        "url": "https://mcp.so/server/mcp-servers-deno"
    },
    {
        "id": 54,
        "name": "MCP Server 项目",
        "description": "MCP server project",
        "url": "https://mcp.so/server/mcp-server-project"
    },
    {
        "id": 55,
        "name": "kospi-kosdaq-stock-server",
        "description": "An MCP server that provides KOSPI/KOSDAQ stock data using FastMCP",
        "url": "https://mcp.so/server/kospi-kosdaq"
    },
    {
        "id": 56,
        "name": "Steel Puppeteer",
        "description": "Browser automation tool",
        "url": "https://mcp.so/server/steel-puppeteer"
    },
    {
        "id": 57,
        "name": "Sydney Grammar School Headmasters Chat Application",
        "description": "Agentic RAG and MCP server for Sydney Grammar School chat",
        "url": "https://mcp.so/server/sydney-grammar"
    },
    {
        "id": 58,
        "name": "Second Opinion MCP Server",
        "description": "Second opinion MCP Server",
        "url": "https://mcp.so/server/second-opinion"
    },
    {
        "id": 59,
        "name": "Kibela MCP Server",
        "description": "Kibela MCP Server",
        "url": "https://mcp.so/server/kibela"
    },
    {
        "id": 60,
        "name": "ResearchMCP",
        "description": "Multi-Search API Aggregator Server built with Deno + Hono",
        "url": "https://mcp.so/server/researchmcp"
    },
    {
        "id": 61,
        "name": "PostgreSQL (Page 2)",
        "description": "MCP server for getting schema information from a PostgreSQL database",
        "url": "https://mcp.so/server/postgresql-page2"
    },
    {
        "id": 62,
        "name": "Super Secret MCP Server",
        "description": "Example node MCP server with special code phrases",
        "url": "https://mcp.so/server/super-secret"
    },
    {
        "id": 63,
        "name": "Voxta MCP Bridge Provider",
        "description": "Voxta provider that enables communication with Model Context Protocol (MCP) servers",
        "url": "https://mcp.so/server/voxta"
    },
    {
        "id": 64,
        "name": "AI会話記録・活用統合システム",
        "description": "Automated AI conversation recording and knowledge management system with MCP integration",
        "url": "https://mcp.so/server/ai-conversation-system"
    },
    {
        "id": 65,
        "name": "MCP Telemetry",
        "description": "Observability helps. This MCP server adds tracing to all your conversations on Claude",
        "url": "https://mcp.so/server/mcp-telemetry"
    },
    {
        "id": 66,
        "name": "Serper Search and Scrape MCP Server",
        "description": "Serper MCP Server supporting search and webpage scraping",
        "url": "https://mcp.so/server/serper-search-scrape"
    },
    {
        "id": 67,
        "name": "MCP Media Processing Server",
        "description": "A Node.js server implementing Model Context Protocol (MCP) for media processing operations",
        "url": "https://mcp.so/server/media-processing"
    },
    {
        "id": 68,
        "name": "Spreadsheet MCP Server",
        "description": "MCP Server for spreadsheet operations",
        "url": "https://mcp.so/server/spreadsheet"
    },
    {
        "id": 69,
        "name": "Twilio MCP Server",
        "description": "A Model Context Protocol (MCP) server that enables Claude and other AI assistants to send SMS messages using Twilio.",
        "url": "https://mcp.so/server/twilio"
    },
    {
        "id": 70,
        "name": "edgar-sec-mcp",
        "description": "An MCP Server to get data from EDGAR",
        "url": "https://mcp.so/server/edgar-sec"
    },
    {
        "id": 71,
        "name": "MCP Argo Server",
        "description": "An MCP server for running Argo workflows, written in Golang",
        "url": "https://mcp.so/server/argo"
    },
    {
        "id": 72,
        "name": "Unified MCP Client Library",
        "description": "mcp-use is a TypeScript library that makes it easy to connect LangChain.js-compatible LLMs with MCP servers.",
        "url": "https://mcp.so/server/mcp-use"
    },
    {
        "id": 73,
        "name": "Deep-research",
        "description": "MCP Deep Research Server using Gemini creating a Research AI Agent",
        "url": "https://mcp.so/server/deep-research"
    },
    {
        "id": 74,
        "name": "WebSocket MCP",
        "description": "Model Context Protocol (MCP) server and client with a custom websocket transport layer.",
        "url": "https://mcp.so/server/websocket-mcp"
    },
    {
        "id": 75,
        "name": "Storacha MCP Storage Server",
        "description": "Storacha MCP storage server - self-sovereign data for your AI applications.",
        "url": "https://mcp.so/server/storacha"
    },
    {
        "id": 76,
        "name": "MCP LLM",
        "description": "An MCP server that provides LLMs access to other LLMs",
        "url": "https://mcp.so/server/mcp-llm"
    },
    {
        "id": 77,
        "name": "frontend-review-mcp",
        "description": "MCP server that visually reviews your agent's design edits",
        "url": "https://mcp.so/server/frontend-review"
    },
    {
        "id": 78,
        "name": "Linear MCP Server",
        "description": "Linear issue tracking MCP Server",
        "url": "https://mcp.so/server/linear"
    },
    {
        "id": 79,
        "name": "hackernew-mcp",
        "description": "AI Friendly MCP Server for Hacker News",
        "url": "https://mcp.so/server/hackernews"
    },
    {
        "id": 80,
        "name": "my-mcp-server",
        "description": "Try MCP Server",
        "url": "https://mcp.so/server/my-mcp"
    },
    {
        "id": 81,
        "name": "Together AI Image Generation MCP Server",
        "description": "MCP-Server for the together.ai API to generate images using Flux 1.1 pro",
        "url": "https://mcp.so/server/together-ai"
    },
    {
        "id": 82,
        "name": "Skynet-MCP",
        "description": "An MCP Server that acts as an agent and can spawn more Agents, by using MCP",
        "url": "https://mcp.so/server/skynet"
    },
    {
        "id": 83,
        "name": "Facebook Ads MCP Server",
        "description": "The Facebook Ads MCP Server offers robust Facebook Ads integration",
        "url": "https://mcp.so/server/facebook-ads"
    },
    {
        "id": 84,
        "name": "testmcpgithub",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/testmcpgithub"
    },
    {
        "id": 85,
        "name": "Redis MCP Server",
        "description": "Redis MCP Server - Python implementation with docker",
        "url": "https://mcp.so/server/redis-python"
    },
    {
        "id": 86,
        "name": "hyperscale-mcp",
        "description": "An MCP server for Hyperscale",
        "url": "https://mcp.so/server/hyperscale"
    },
    {
        "id": 87,
        "name": "Hedera Testnet Mirror Node MCP Server",
        "description": "Hedera MCP server",
        "url": "https://mcp.so/server/hedera"
    },
    {
        "id": 88,
        "name": "MCP DuckDuckResearch",
        "description": "MCP server with duckducksearch, web2md, and web2photo",
        "url": "https://mcp.so/server/duckduck-research"
    },
    {
        "id": 89,
        "name": "MCP-DevTools",
        "description": "A pptr mcp server for better cursor",
        "url": "https://mcp.so/server/devtools"
    },
    {
        "id": 90,
        "name": "Whisper Speech Recognition MCP Server",
        "description": "A high-performance speech recognition MCP server based on Faster Whisper",
        "url": "https://mcp.so/server/whisper"
    },
    {
        "id": 91,
        "name": "dbt Semantic Layer MCP Server",
        "description": "MCP Server for querying DBT Semantic Layer",
        "url": "https://mcp.so/server/dbt-semantic"
    },
    {
        "id": 92,
        "name": "Mcpserver",
        "description": "A simple mcp server exposing a list of colors",
        "url": "https://mcp.so/server/colors"
    },
    {
        "id": 93,
        "name": "MultiversX MCP Server",
        "description": "MCP Server for MultiversX",
        "url": "https://mcp.so/server/multiversx"
    },
    {
        "id": 94,
        "name": "Retrieval-Augmented Thinking MCP Server",
        "description": "MCP server for retrieval augmented thinking and problem solving",
        "url": "https://mcp.so/server/rat"
    },
    {
        "id": 95,
        "name": "Flux Image Generation Server",
        "description": "Flux image generation MCP server",
        "url": "https://mcp.so/server/flux"
    },
    {
        "id": 96,
        "name": "ClaudeHopper",
        "description": "A macOS menu bar application that helps manage MCP (Model Context Protocol) servers for Claude Desktop.",
        "url": "https://mcp.so/server/claudehopper"
    },
    {
        "id": 97,
        "name": "ntropy-mcp MCP server",
        "description": "Ntropy MCP server",
        "url": "https://mcp.so/server/ntropy"
    },
    {
        "id": 98,
        "name": "SkySQL MCP Server",
        "description": "SkySQL MCP server and client repository.",
        "url": "https://mcp.so/server/skysql"
    },
    {
        "id": 99,
        "name": "MCP server for io.livecode.ch",
        "description": "Run io.livecode.ch as an MCP server",
        "url": "https://mcp.so/server/livecode"
    },
    {
        "id": 100,
        "name": "MCP-Wikipedia-API-Server",
        "description": "A FastAPI-MCP server that fetches Wikipedia summaries for AI assistants",
        "url": "https://mcp.so/server/wikipedia"
    },
    {
        "id": 101,
        "name": "MCP Server Trello",
        "description": "Trello integration MCP Server",
        "url": "https://mcp.so/server/trello"
    },
    {
        "id": 102,
        "name": "Alphavantage MCP Server",
        "description": "MCP server for unix pty control",
        "url": "https://mcp.so/server/pty"
    },
    {
        "id": 103,
        "name": "Yahoo Finance MCP Server",
        "description": "This is a Model Context Protocol (MCP) server that provides comprehensive financial data from Yahoo Finance.",
        "url": "https://mcp.so/server/yahoo-finance"
    },
    {
        "id": 104,
        "name": "NN-New",
        "description": "Created from MCP server demo",
        "url": "https://mcp.so/server/nn-new"
    },
    {
        "id": 105,
        "name": "cloudflare-api-mcp",
        "description": "Lightweight MCP server to give your Cursor Agent access to the Cloudflare API",
        "url": "https://mcp.so/server/cloudflare"
    },
    {
        "id": 106,
        "name": "DevContext",
        "description": "DevContext is a cutting-edge Model Context Protocol (MCP) server designed to provide developers with continuous, project-centric context awareness.",
        "url": "https://mcp.so/server/devcontext"
    },
    {
        "id": 107,
        "name": "DevEnvInfoServer",
        "description": "Cursor MCP Server for Development Environment Information",
        "url": "https://mcp.so/server/devenvinfo"
    },
    {
        "id": 108,
        "name": "ToDo App",
        "description": "Built a MCP server for learning purposes",
        "url": "https://mcp.so/server/todo-app"
    },
    {
        "id": 109,
        "name": "Apache Kafka MCP Server",
        "description": "An MCP server for Apache Kafka & its ecosystem.",
        "url": "https://mcp.so/server/kafka"
    },
    {
        "id": 110,
        "name": "MCP Demo Project",
        "description": "A demo repository to showcase MCP Server functionality",
        "url": "https://mcp.so/server/demo"
    },
    {
        "id": 111,
        "name": "aws-mcp-infra-helper",
        "description": "This creates an MCP server enabling Claude to run security scans on Terraform code",
        "url": "https://mcp.so/server/aws-infra"
    },
    {
        "id": 112,
        "name": "Dummy MCP Server",
        "description": "Creating an MCP server in order to plug it with a slack-bot",
        "url": "https://mcp.so/server/dummy"
    },
    {
        "id": 113,
        "name": "Twitch MCP Server",
        "description": "Twitch integration MCP Server",
        "url": "https://mcp.so/server/twitch"
    },
    {
        "id": 114,
        "name": "MCP Starter Project",
        "description": "How to setup mcp server and mcp client.",
        "url": "https://mcp.so/server/starter"
    },
    {
        "id": 115,
        "name": "MCP Registry Server",
        "description": "MCP Registry Server",
        "url": "https://mcp.so/server/registry"
    },
    {
        "id": 116,
        "name": "Twitter MCP Server",
        "description": "Twitter integration MCP Server",
        "url": "https://mcp.so/server/twitter"
    },
    {
        "id": 117,
        "name": "wayne-mcp-servers",
        "description": "My custom MCP (Model Context Protocol) servers.",
        "url": "https://mcp.so/server/wayne"
    },
    {
        "id": 118,
        "name": "Gel Database MCP Server",
        "description": "MCP Server enabling LLM Agents to interact with Gel database",
        "url": "https://mcp.so/server/gel"
    },
    {
        "id": 119,
        "name": "MCP server for youtube",
        "description": "Allows you to directly search and access transcripts on youtube through a single call in the Claude LLM",
        "url": "https://mcp.so/server/youtube"
    },
    {
        "id": 120,
        "name": "MCP Money",
        "description": "MCP server to give nutsack wallets to agents",
        "url": "https://mcp.so/server/money"
    },
    {
        "id": 121,
        "name": "Weather MCP Server",
        "description": "A Model Context Protocol (MCP) server that provides weather forecast data from the Government of Canada Weather API",
        "url": "https://mcp.so/server/weather-canada"
    },
    {
        "id": 122,
        "name": "Upstash MCP Server",
        "description": "Upstash Redis MCP Server",
        "url": "https://mcp.so/server/upstash"
    },
    {
        "id": 123,
        "name": "Claude MCP Trello",
        "description": "A Model Context Protocol (MCP) server that provides tools for interacting with Trello boards.",
        "url": "https://mcp.so/server/claude-trello"
    },
    {
        "id": 124,
        "name": "FastAPI Hello World Application",
        "description": "A test repository created using the GitHub MCP server",
        "url": "https://mcp.so/server/fastapi-hello"
    },
    {
        "id": 125,
        "name": "GitHub MCP Server",
        "description": "GitHub MCP Server implementation and testing repository",
        "url": "https://mcp.so/server/github-impl"
    },
    {
        "id": 126,
        "name": "Mcpmap server",
        "description": "Google map MCP server for study",
        "url": "https://mcp.so/server/mcpmap"
    },
    {
        "id": 127,
        "name": "Fastapi Mcp Server",
        "description": "FastAPI MCP Server using FastAPI for Model Context Protocol",
        "url": "https://mcp.so/server/fastapi"
    },
    {
        "id": 128,
        "name": "Nix MCP Servers",
        "description": "A nix flake for configuring Model Context Protocol (MCP) servers across supported AI assistant clients",
        "url": "https://mcp.so/server/nix"
    },
    {
        "id": 129,
        "name": "i18n MCP Server",
        "description": "MCP server for handling i18n JSON files",
        "url": "https://mcp.so/server/i18n"
    },
    {
        "id": 130,
        "name": "RTC MCP Server",
        "description": "A Model Context Protocol (MCP) server implementation for managing Alibaba Cloud Realtime Computing Flink resources",
        "url": "https://mcp.so/server/rtc"
    },
    {
        "id": 131,
        "name": "usaspending-mcp",
        "description": "MCP server to interact with usaspending.gov api",
        "url": "https://mcp.so/server/usaspending"
    },
    {
        "id": 132,
        "name": "MCP Server for Paper Analytical Devices (PAD)",
        "description": "A Python MCP Server for Paper Analytical Devices (PAD)",
        "url": "https://mcp.so/server/pad"
    },
    {
        "id": 133,
        "name": "gameanalytics-server MCP Server",
        "description": "GameAnalytics MCP server for Model Context Protocol integration",
        "url": "https://mcp.so/server/gameanalytics"
    },
    {
        "id": 134,
        "name": "Flutter Tools MCP Server",
        "description": "Flutter MCP server",
        "url": "https://mcp.so/server/flutter"
    },
    {
        "id": 135,
        "name": "Toolkit MCP Server",
        "description": "A Model Context Protocol server providing LLM Agents with system utilities and tools",
        "url": "https://mcp.so/server/toolkit"
    },
    {
        "id": 136,
        "name": "MCP Weather Server for Claude",
        "description": "An MCP server for Claude that provides real-time weather alerts and forecasts using the U.S. National Weather Service API.",
        "url": "https://mcp.so/server/weather-nws"
    },
    {
        "id": 137,
        "name": "Telephone Operator",
        "description": "Give your agents a phone",
        "url": "https://mcp.so/server/telephone"
    },
    {
        "id": 138,
        "name": "Marimo Documentation MCP Server",
        "description": "A Model Context Protocol (MCP) server that provides programmatic access to the Marimo Documentation.",
        "url": "https://mcp.so/server/marimo"
    },
    {
        "id": 139,
        "name": "Todo List MCP Server",
        "description": "An MCP server for managing todos within LLMs, created for educational purposes",
        "url": "https://mcp.so/server/todo-list"
    },
    {
        "id": 140,
        "name": "Excalidraw MCP Server",
        "description": "Model Context Protocol (MCP) server for Excalidraw - Work in Progress",
        "url": "https://mcp.so/server/excalidraw"
    },
    {
        "id": 141,
        "name": "GitHub MCP Server (Go)",
        "description": "Model Context Protocol (MCP) server for GitHub based on mcp-go",
        "url": "https://mcp.so/server/github-go"
    },
    {
        "id": 142,
        "name": "ledger-service MCP server",
        "description": "MCP Server for my ledger",
        "url": "https://mcp.so/server/ledger"
    },
    {
        "id": 143,
        "name": "mcp-pyodide",
        "description": "A Pyodide server implementation for the Model Context Protocol (MCP).",
        "url": "https://mcp.so/server/pyodide"
    },
    {
        "id": 144,
        "name": "Argus - Repository Analysis and Security Assessment Tool",
        "description": "A Model Context Protocol (MCP) server for analyzing GitLab repositories and performing security assessments.",
        "url": "https://mcp.so/server/argus"
    },
    {
        "id": 145,
        "name": "Google Home MCP Server",
        "description": "Google Home integration MCP Server",
        "url": "https://mcp.so/server/google-home"
    },
    {
        "id": 146,
        "name": "SuperGateway",
        "description": "Run MCP stdio servers over SSE and SSE over stdio. AI gateway.",
        "url": "https://mcp.so/server/supergateway"
    },
    {
        "id": 147,
        "name": "Claude Web Scraper MCP",
        "description": "A simple MCP server that integrates eGet web scraper with Claude for Desktop.",
        "url": "https://mcp.so/server/web-scraper"
    },
    {
        "id": 148,
        "name": "Test Repo",
        "description": "Test repository created via MCP server",
        "url": "https://mcp.so/server/test-repo"
    },
]

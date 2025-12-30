const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'mcp-servers.data.ts');
const outputFile = path.join(__dirname, 'src', 'data', 'mcp-servers.ts');

try {
    let content = fs.readFileSync(inputFile, 'utf8');

    // Find the start of the array
    const start = content.indexOf('[');
    // Find the end of the array (last ']')
    const end = content.lastIndexOf(']');

    if (start === -1 || end === -1) {
        throw new Error('Could not find array in file');
    }

    const arrayString = content.substring(start, end + 1);

    // Use eval to parse the array (handles trailing commas, comments etc)
    const rawServers = eval(arrayString);

    console.log(`Found ${rawServers.length} servers in raw data`);

    // Deduplicate
    const uniqueServers = [];
    const seenUrls = new Set();
    const seenNames = new Set();

    let nextId = 1;

    for (const server of rawServers) {
        // Normalize URL for dedup check
        // Remove trailing slash
        const url = server.url ? server.url.replace(/\/$/, '').toLowerCase() : '';
        const name = server.name.trim();

        // Check duplicates
        // Some servers might have same name but different URL (e.g. mirrors), we should keep them?
        // User said "fix duplicate IDs".
        // Let's dedup by Name AND URL. If strictly exact name and url, skip.
        // Actually, let's dedup by Name primarily, as the marketplace shows names.
        // If we have "Time" (url A) and "Time" (url B), we should probably pick one or rename one.
        // Looking at the data, the second list (lines 800+) seemed to have better descriptions?
        // Let's prioritize the LAST seen item if we just iterate? The file has list1 then list2.
        // The snippet showed list1 then list 2.
        // Let's use a Map to keep the last seen version of a server by Name.

        const key = name.toLowerCase();

        // Also check if URL is seen
        if (url && seenUrls.has(url)) {
            continue;
        }

        if (seenNames.has(key)) {
            // If we already have this name, check if URL is different.
            // If URL is different, it might be a different server or a mirror.
            // But if we want a clean marketplace, maybe unique names are better.
            // Let's skip duplicates for now.
            continue;
        }

        seenUrls.add(url);
        seenNames.add(key);

        // Clean up server object
        const cleanServer = {
            id: nextId++,
            name: server.name,
            description: server.description,
            url: server.url,
            category: server.category || inferCategory(server),
            installMethod: server.installMethod || 'npx',
            command: server.command || undefined
        };

        uniqueServers.push(cleanServer);
    }

    console.log(`Processed ${uniqueServers.length} unique servers`);

    // Generate output content
    const outputContent = `/**
 * MCP Server Data
 * Auto-generated from mcp-servers.data.ts
 */

export interface MCPServerData {
    id: number;
    name: string;
    description: string;
    url: string;
    category: string;
    installMethod: "npx" | "pip" | "manual";
    command?: string;
}

export const MCP_SERVERS: MCPServerData[] = ${JSON.stringify(uniqueServers, null, 4)};
`;

    fs.writeFileSync(outputFile, outputContent);
    console.log(`Written to ${outputFile}`);

} catch (e) {
    console.error('Error:', e);
}

function inferCategory(server) {
    const desc = (server.description || '').toLowerCase();
    const name = (server.name || '').toLowerCase();

    if (name.includes('weather') || desc.includes('weather')) return 'Utilities';
    if (name.includes('git') || desc.includes('git') || desc.includes('repo')) return 'Development';
    if (name.includes('database') || desc.includes('database') || name.includes('sql') || name.includes('redis')) return 'Database';
    if (name.includes('search') || desc.includes('search')) return 'Search';
    if (name.includes('browser') || desc.includes('browser') || name.includes('playwright') || name.includes('puppeteer')) return 'Browser Automation';
    if (name.includes('mail') || desc.includes('email') || name.includes('slack') || name.includes('discord')) return 'Communication';
    if (name.includes('notes') || desc.includes('notes') || name.includes('todo') || name.includes('notion')) return 'Productivity';
    if (name.includes('filesystem') || desc.includes('file')) return 'Development';
    if (name.includes('image') || desc.includes('image') || name.includes('video') || desc.includes('media')) return 'Media';

    return 'Utilities'; // Default
}

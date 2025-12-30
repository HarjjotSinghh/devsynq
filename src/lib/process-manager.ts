/**
 * Process Management Library
 * Handles detection, monitoring, and control of running IDE processes
 */

import { RunningIDE, ProcessStats, IDEType } from '../types';
const { exec, spawn } = require('child_process');
const os = require('os');

// ============================================================================
// Resource History Tracking
// ============================================================================

// Store history for the last 60 data points (10 minutes at 10s intervals)
const HISTORY_MAX_POINTS = 60;

interface ResourceHistoryEntry {
  timestamp: number;
  cpu: number;
  memory: number;
}

// History per IDE name
const resourceHistory: Map<string, ResourceHistoryEntry[]> = new Map();

// System resource history
const systemResourceHistory: ResourceHistoryEntry[] = [];

/**
 * Add a resource sample for an IDE
 */
export function addResourceSample(ideName: string, cpu: number, memory: number): void {
  let history = resourceHistory.get(ideName);
  if (!history) {
    history = [];
    resourceHistory.set(ideName, history);
  }

  history.push({
    timestamp: Date.now(),
    cpu: cpu || 0,
    memory: memory || 0,
  });

  // Keep only last HISTORY_MAX_POINTS
  if (history.length > HISTORY_MAX_POINTS) {
    history.shift();
  }
}

/**
 * Add a system resource sample
 */
export function addSystemResourceSample(cpu: number, memory: number): void {
  systemResourceHistory.push({
    timestamp: Date.now(),
    cpu: cpu || 0,
    memory: memory || 0,
  });

  if (systemResourceHistory.length > HISTORY_MAX_POINTS) {
    systemResourceHistory.shift();
  }
}

/**
 * Get resource history for an IDE
 */
export function getResourceHistory(ideName: string): { cpu: number[]; memory: number[] } {
  const history = resourceHistory.get(ideName) || [];
  return {
    cpu: history.map(h => h.cpu),
    memory: history.map(h => h.memory),
  };
}

/**
 * Get system resource history
 */
export function getSystemResourceHistory(): { cpu: number[]; memory: number[] } {
  return {
    cpu: systemResourceHistory.map(h => h.cpu),
    memory: systemResourceHistory.map(h => h.memory),
  };
}

/**
 * Clear history for an IDE (when it stops running)
 */
export function clearResourceHistory(ideName: string): void {
  resourceHistory.delete(ideName);
}

// IDE process patterns for detection
interface IDEProcessPattern {
  name: IDEType;
  icon: string;
  color: string;
  winPatterns: string[];
  macPatterns: string[];
  linuxPatterns: string[];
}

const IDE_PATTERNS: IDEProcessPattern[] = [
  {
    name: IDEType.Cursor,
    icon: "⚡",
    color: "#fff1bb",
    winPatterns: ["Cursor.exe"],
    macPatterns: ["Cursor"],
    linuxPatterns: ["cursor"],
  },
  {
    name: IDEType.Windsurf,
    icon: "🏄",
    color: "#06b6d4",
    winPatterns: ["Windsurf.exe"],
    macPatterns: ["Windsurf"],
    linuxPatterns: ["windsurf"],
  },
  {
    name: IDEType.VSCode,
    icon: "💻",
    color: "#0078d4",
    winPatterns: ["Code.exe"],
    macPatterns: ["Code", "Visual Studio Code"],
    linuxPatterns: ["code"],
  },
  {
    name: IDEType.Zed,
    icon: "⚡",
    color: "#f59e0b",
    winPatterns: ["Zed.exe"],
    macPatterns: ["Zed"],
    linuxPatterns: ["zed"],
  },
  {
    name: IDEType.WebStorm,
    icon: "🌐",
    color: "#00d8ff",
    winPatterns: ["webstorm64.exe", "webstorm.exe"],
    macPatterns: ["webstorm"],
    linuxPatterns: ["webstorm"],
  },
  {
    name: IDEType.Trae,
    icon: "🚀",
    color: "#1e1e1e",
    winPatterns: ["Trae.exe"],
    macPatterns: ["Trae"],
    linuxPatterns: ["trae"],
  },
  {
    name: IDEType.Antigravity,
    icon: "🛰️",
    color: "#4285f4",
    winPatterns: ["Antigravity.exe"],
    macPatterns: ["Antigravity"],
    linuxPatterns: ["antigravity"],
  },
  {
    name: IDEType.Kiro,
    icon: "👻",
    color: "#8e48ff",
    winPatterns: ["Kiro.exe"],
    macPatterns: ["Kiro"],
    linuxPatterns: ["kiro"],
  },
  {
    name: IDEType.Qoder,
    icon: "🟢",
    color: "#18d16f",
    winPatterns: ["Qoder.exe"],
    macPatterns: ["Qoder"],
    linuxPatterns: ["qoder"],
  },
  {
    name: IDEType.Replit,
    icon: "🌀",
    color: "#f26207",
    winPatterns: ["Replit.exe"],
    macPatterns: ["Replit"],
    linuxPatterns: ["replit"],
  },
  {
    name: IDEType.Cody,
    icon: "🤖",
    color: "#ff5b4d",
    winPatterns: ["Cody.exe"],
    macPatterns: ["Cody"],
    linuxPatterns: ["cody"],
  },
  {
    name: IDEType.IntelliJIDEA,
    icon: "💡",
    color: "#ff4081",
    winPatterns: ["idea64.exe", "idea.exe"],
    macPatterns: ["idea"],
    linuxPatterns: ["idea"],
  },
  {
    name: IDEType.PyCharm,
    icon: "🐍",
    color: "#21d19f",
    winPatterns: ["pycharm64.exe", "pycharm.exe"],
    macPatterns: ["pycharm"],
    linuxPatterns: ["pycharm"],
  },
];

/**
 * Parse date string from PowerShell output
 * Handles both ISO 8601 and Microsoft JSON date format \/Date(ticks)\/
 */
function parsePowerShellDate(dateStr: string | null | undefined): number | undefined {
  if (!dateStr) return undefined;

  // Handle Microsoft JSON date format /Date(1234567890)/
  const msDateMatch = dateStr.match(/\/Date\((\d+)\)\//);
  if (msDateMatch) {
    return parseInt(msDateMatch[1] ?? '0', 10);
  }

  // Handle ISO date format
  const timestamp = new Date(dateStr).getTime();
  return isNaN(timestamp) ? undefined : timestamp;
}

/**
 * Execute a shell command and return the output
 */
function execAsync(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer: 1024 * 1024 * 10 },
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

/**
 * Get running IDE processes on Windows
 */
async function getWindowsProcesses(): Promise<RunningIDE[]> {
  const runningIDEs: RunningIDE[] = [];

  try {
    // Get process list with memory info using PowerShell
    const psCommand = `Get-Process | Where-Object { $_.MainWindowTitle -ne '' -or $_.Name -match 'Code|Cursor|Windsurf|Zed|WebStorm|idea|pycharm|Trae|Replit|Cody|Antigravity|Kiro|Qoder' } | Select-Object Id, Name, Path, CPU, WorkingSet64, StartTime | ConvertTo-Json -Compress`;

    const output = await execAsync(
      `powershell -NoProfile -Command "${psCommand}"`
    );

    if (!output.trim()) return runningIDEs;

    let processes: any[];
    try {
      const parsed = JSON.parse(output);
      // PowerShell returns a single object if only one result, array otherwise
      processes = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return runningIDEs;
    }

    for (const proc of processes) {
      if (!proc.Name) continue;

      for (const pattern of IDE_PATTERNS) {
        const matches = pattern.winPatterns.some((p) =>
          proc.Name.toLowerCase().includes(p.toLowerCase().replace(".exe", ""))
        );

        if (matches) {
          runningIDEs.push({
            name: pattern.name,
            icon: pattern.icon,
            color: pattern.color,
            pid: proc.Id,
            execPath: proc.Path || "",
            cpuUsage: proc.CPU ? Math.round(proc.CPU * 100) / 100 : undefined,
            memoryUsage: proc.WorkingSet64
              ? Math.round(proc.WorkingSet64 / 1024 / 1024)
              : undefined,
            startTime: parsePowerShellDate(proc.StartTime),
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error getting Windows processes:", error);
  }

  // Deduplicate by name (keep only one entry per IDE with highest memory usage)
  const deduped = new Map<IDEType, RunningIDE>();
  for (const ide of runningIDEs) {
    const existing = deduped.get(ide.name);
    if (!existing || (ide.memoryUsage ?? 0) > (existing.memoryUsage ?? 0)) {
      deduped.set(ide.name, ide);
    }
  }

  return Array.from(deduped.values());
}

/**
 * Get running IDE processes on macOS
 */
async function getMacProcesses(): Promise<RunningIDE[]> {
  const runningIDEs: RunningIDE[] = [];

  try {
    // Use ps to get process info
    const output = await execAsync(
      "ps aux | grep -E 'Cursor|Code|Windsurf|Zed|webstorm|idea|pycharm|Trae|Replit|Cody|Antigravity|Kiro|Qoder' | grep -v grep"
    );
    const lines = output.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 11) continue;

      const pid = parseInt(parts[1] ?? "0");
      const cpu = parseFloat(parts[2] ?? "0");
      const command = parts.slice(10).join(" ");

      for (const pattern of IDE_PATTERNS) {
        const matches = pattern.macPatterns.some((p) =>
          command.toLowerCase().includes(p.toLowerCase())
        );

        if (matches) {
          // Get memory in MB (RSS from ps is in KB)
          const rss = parseInt(parts[5] ?? "0") / 1024;

          runningIDEs.push({
            name: pattern.name,
            icon: pattern.icon,
            color: pattern.color,
            pid,
            execPath: command,
            cpuUsage: cpu,
            memoryUsage: Math.round(rss),
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error getting Mac processes:", error);
  }

  // Deduplicate
  const deduped = new Map<IDEType, RunningIDE>();
  for (const ide of runningIDEs) {
    const existing = deduped.get(ide.name);
    if (!existing || (ide.memoryUsage ?? 0) > (existing.memoryUsage ?? 0)) {
      deduped.set(ide.name, ide);
    }
  }

  return Array.from(deduped.values());
}

/**
 * Get running IDE processes on Linux
 */
async function getLinuxProcesses(): Promise<RunningIDE[]> {
  const runningIDEs: RunningIDE[] = [];

  try {
    const output = await execAsync(
      "ps aux | grep -E 'cursor|code|windsurf|zed|webstorm|idea|pycharm|trae|replit|cody|antigravity|kiro|qoder' | grep -v grep"
    );
    const lines = output.split("\n").filter((l) => l.trim());

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 11) continue;

      const pid = parseInt(parts[1] ?? "0");
      const cpu = parseFloat(parts[2] ?? "0");
      const command = parts.slice(10).join(" ");

      for (const pattern of IDE_PATTERNS) {
        const matches = pattern.linuxPatterns.some((p) =>
          command.toLowerCase().includes(p.toLowerCase())
        );

        if (matches) {
          const rss = parseInt(parts[5] ?? "0") / 1024;

          runningIDEs.push({
            name: pattern.name,
            icon: pattern.icon,
            color: pattern.color,
            pid,
            execPath: command,
            cpuUsage: cpu,
            memoryUsage: Math.round(rss),
          });
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error getting Linux processes:", error);
  }

  const deduped = new Map<IDEType, RunningIDE>();
  for (const ide of runningIDEs) {
    const existing = deduped.get(ide.name);
    if (!existing || (ide.memoryUsage ?? 0) > (existing.memoryUsage ?? 0)) {
      deduped.set(ide.name, ide);
    }
  }

  return Array.from(deduped.values());
}

/**
 * Get all running IDE processes
 */
export async function getRunningIDEs(): Promise<RunningIDE[]> {
  const platform = os.platform();

  switch (platform) {
    case 'win32':
      return getWindowsProcesses();
    case 'darwin':
      return getMacProcesses();
    case 'linux':
      return getLinuxProcesses();
    default:
      return [];
  }
}

/**
 * Get process statistics
 */
export async function getProcessStats(): Promise<ProcessStats> {
  const processes = await getRunningIDEs();

  return {
    totalCPU: processes.reduce((sum, p) => sum + (p.cpuUsage ?? 0), 0),
    totalMemory: processes.reduce((sum, p) => sum + (p.memoryUsage ?? 0), 0),
    runningCount: processes.length,
  };
}

/**
 * Focus/bring to front an IDE window by PID
 */
export async function focusIDE(pid: number): Promise<{ success: boolean; error?: string }> {
  const platform = os.platform();

  try {
    if (platform === 'win32') {
      // Use PowerShell to bring window to front
      const command = `powershell -NoProfile -Command "(Get-Process -Id ${pid}).MainWindowHandle | ForEach-Object { $Code = @'
using System;
using System.Runtime.InteropServices;
public class WinAPI {
    [DllImport(\\"user32.dll\\")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport(\\"user32.dll\\")]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
}
'@
Add-Type -TypeDefinition $Code
[WinAPI]::ShowWindow($_, 9)
[WinAPI]::SetForegroundWindow($_)
}"`;
      await execAsync(command);
    } else if (platform === 'darwin') {
      // Use AppleScript on macOS
      await execAsync(`osascript -e 'tell application "System Events" to set frontmost of (first process whose unix id is ${pid}) to true'`);
    } else {
      // On Linux, try wmctrl or xdotool
      try {
        await execAsync(`wmctrl -i -a $(wmctrl -lp | grep ${pid} | cut -d' ' -f1)`);
      } catch {
        await execAsync(`xdotool search --pid ${pid} windowactivate`);
      }
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Kill an IDE process by PID
 */
export async function killIDE(pid: number): Promise<{ success: boolean; error?: string }> {
  const platform = os.platform();

  try {
    if (platform === 'win32') {
      await execAsync(`taskkill /PID ${pid} /F`);
    } else {
      await execAsync(`kill -9 ${pid}`);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Kill all running IDE processes
 */
export async function killAllIDEs(): Promise<{ success: string[]; failed: Array<{ name: string; error: string }> }> {
  const runningIDEs = await getRunningIDEs();
  const results = {
    success: [] as string[],
    failed: [] as Array<{ name: string; error: string }>,
  };

  for (const ide of runningIDEs) {
    const result = await killIDE(ide.pid);
    if (result.success) {
      results.success.push(ide.name);
    } else {
      results.failed.push({ name: ide.name, error: result.error ?? 'Unknown error' });
    }
  }

  return results;
}

/**
 * Get detailed resource usage for monitoring
 */
export async function getResourceUsage(): Promise<{
  totalSystemMemory: number;
  freeSystemMemory: number;
  ideMemoryUsage: number;
  ideCount: number;
  cpuCores: number;
}> {
  const processes = await getRunningIDEs();
  const totalMem = os.totalmem() / 1024 / 1024; // Convert to MB
  const freeMem = os.freemem() / 1024 / 1024;
  const ideMem = processes.reduce((sum, p) => sum + (p.memoryUsage ?? 0), 0);

  return {
    totalSystemMemory: Math.round(totalMem),
    freeSystemMemory: Math.round(freeMem),
    ideMemoryUsage: Math.round(ideMem),
    ideCount: processes.length,
    cpuCores: os.cpus().length,
  };
}

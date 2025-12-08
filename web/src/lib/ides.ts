export enum IDEType {
    Cursor = "Cursor",
    VSCode = "VS Code",
    Windsurf = "Windsurf",
    Zed = "Zed",
    WebStorm = "WebStorm",
    Trae = "Trae",
    Replit = "Replit",
    Cody = "Cody",
    Continue = "Continue",
    IntelliJIDEA = "IntelliJ IDEA",
    PyCharm = "PyCharm",
    Antigravity = "Antigravity",
    Kiro = "Kiro",
    Qoder = "Qoder",
  }
  
  export type IDEAvailability = "available" | "soon";
  
  export type IDEMeta = {
    name: IDEType;
    icon: string;
    color: string;
    downloadUrl?: string;
    status?: IDEAvailability;
  };
  
  export const IDE_LIST: IDEMeta[] = [
    {
      name: IDEType.Cursor,
      icon: "⚡",
      color: "#7c3aed",
      downloadUrl: "https://cursor.sh/",
      status: "available",
    },
    {
      name: IDEType.Windsurf,
      icon: "🏄",
      color: "#06b6d4",
      downloadUrl: "https://codeium.com/windsurf",
      status: "available",
    },
    {
      name: IDEType.VSCode,
      icon: "💻",
      color: "#0078d4",
      downloadUrl: "https://code.visualstudio.com/",
      status: "available",
    },
    {
      name: IDEType.Zed,
      icon: "⚡",
      color: "#f59e0b",
      downloadUrl: "https://zed.dev/",
      status: "available",
    },
    {
      name: IDEType.WebStorm,
      icon: "🌐",
      color: "#00d8ff",
      downloadUrl: "https://www.jetbrains.com/webstorm/",
      status: "available",
    },
    {
      name: IDEType.Trae,
      icon: "🚀",
      color: "#1e1e1e",
      downloadUrl: "https://www.trae.ai/",
      status: "available",
    },
    {
      name: IDEType.Antigravity,
      icon: "🛰️",
      color: "#4285f4",
      downloadUrl: "https://www.google.com/antigravity",
      status: "available",
    },
    {
      name: IDEType.Kiro,
      icon: "👻",
      color: "#8e48ff",
      downloadUrl: "https://aws.amazon.com/kiro",
      status: "available",
    },
    {
      name: IDEType.Qoder,
      icon: "🟢",
      color: "#18d16f",
      downloadUrl: "https://qoder.com",
      status: "available",
    },
    {
      name: IDEType.Replit,
      icon: "🌀",
      color: "#f26207",
      downloadUrl: "https://replit.com/desktop",
      status: "available",
    },
    {
      name: IDEType.Cody,
      icon: "🤖",
      color: "#ff5b4d",
      downloadUrl: "https://sourcegraph.com/cody",
      status: "available",
    },
    {
      name: IDEType.Continue,
      icon: "🔗",
      color: "#4ade80",
      downloadUrl: "https://continue.dev",
      status: "available",
    },
    {
      name: IDEType.IntelliJIDEA,
      icon: "💡",
      color: "#ff4081",
      downloadUrl: "https://www.jetbrains.com/idea/download/",
      status: "available",
    },
    {
      name: IDEType.PyCharm,
      icon: "🐍",
      color: "#21d19f",
      downloadUrl: "https://www.jetbrains.com/pycharm/download/",
      status: "available",
    },
  ];
  
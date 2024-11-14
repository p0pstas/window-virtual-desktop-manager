import { execSync } from 'child_process';

interface Window {
  hwnd: string;
  title: string;
  processId: string;
  isVisible: boolean;
}

interface Monitor {
  name: string;
  width: number;
  height: number;
}

export function listOpenWindows(): Window[] {
  const output = execSync('powershell "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Select-Object Id, MainWindowTitle, MainWindowHandle"').toString();
  const lines = output.split('\n').slice(3);
  const windows: Window[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3) {
      const processId = parts[0];
      const hwnd = parts[parts.length - 1];
      const title = parts.slice(1, parts.length - 1).join(' ');
      windows.push({ hwnd, title, processId, isVisible: true });
    }
  }

  return windows;
}

export function openWindow(command: string): void {
  execSync(command);
}

export function closeWindow(hwnd: string): void {
  execSync(`powershell "(Get-Process -Id (Get-Process | Where-Object {$_.MainWindowHandle -eq ${hwnd}}).Id).CloseMainWindow()"`);
}

export function minimizeWindow(hwnd: string): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(int hWnd, int nCmdShow);
'@) ; [Win32.WinAPI]::ShowWindow(${hwnd}, 6)"`);
}

export function maximizeWindow(hwnd: string): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(int hWnd, int nCmdShow);
'@) ; [Win32.WinAPI]::ShowWindow(${hwnd}, 3)"`);
}

export function moveWindow(hwnd: string, x: number, y: number, width: number, height: number): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool MoveWindow(int hWnd, int X, int Y, int nWidth, int nHeight, bool bRepaint);
'@) ; [Win32.WinAPI]::MoveWindow(${hwnd}, ${x}, ${y}, ${width}, ${height}, $true)"`);
}

export function getMonitors(): Monitor[] {
  const output = execSync('powershell "Get-CimInstance -Namespace root\\wmi -ClassName WmiMonitorBasicDisplayParams"').toString();
  const lines = output.split('\n').slice(3);
  const monitors: Monitor[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3) {
      const name = parts[0];
      const width = parseInt(parts[1], 10);
      const height = parseInt(parts[2], 10);
      monitors.push({ name, width, height });
    }
  }

  return monitors;
}

export function getActiveWindow(): Window | null {
  const output = execSync('powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern int GetForegroundWindow();
'@) ; [Win32.WinAPI]::GetForegroundWindow()"').toString().trim();

  if (output) {
    const hwnd = output;
    const windows = listOpenWindows();
    return windows.find(window => window.hwnd === hwnd) || null;
  }

  return null;
}

export function getWindows(): Window[] {
  return listOpenWindows();
}

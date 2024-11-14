import { execSync } from 'child_process';

interface VirtualDesktop {
  id: string;
  name: string;
}

export function listVirtualDesktops(): VirtualDesktop[] {
  const output = execSync('powershell "Get-Process | Where-Object {$_.MainWindowTitle -ne \'\'} | Select-Object Id, MainWindowTitle, MainWindowHandle"').toString();
  const lines = output.split('\n').slice(3);
  const desktops: VirtualDesktop[] = [];

  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3) {
      const id = parts[0];
      const name = parts.slice(1).join(' ');
      desktops.push({ id, name });
    }
  }

  return desktops;
}

export function createVirtualDesktop(): void {
  execSync('powershell "New-Item -Path \\"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VirtualDesktops\\" -Name \\"NewDesktop\\" -Force"');
}

export function deleteVirtualDesktop(id: string): void {
  execSync(`powershell "Remove-Item -Path \\"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VirtualDesktops\\${id}\\" -Force"`);
}

export function switchVirtualDesktop(id: string): void {
  execSync(`powershell "Set-ItemProperty -Path \\"HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VirtualDesktops\\" -Name \\"CurrentDesktop\\" -Value ${id}"`);
}

export function moveWindowToVirtualDesktop(hwnd: string, desktopId: string): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool MoveWindowToDesktop(int hWnd, int desktopId);
'@) ; [Win32.WinAPI]::MoveWindowToDesktop(${hwnd}, ${desktopId})"`);
}

export function pinWindow(hwnd: string): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool PinWindow(int hWnd);
'@) ; [Win32.WinAPI]::PinWindow(${hwnd})"`);
}

export function unpinWindow(hwnd: string): void {
  execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool UnpinWindow(int hWnd);
'@) ; [Win32.WinAPI]::UnpinWindow(${hwnd})"`);
}

export function getWindowDesktopNumber(hwnd: string): number {
  const output = execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern int GetWindowDesktopNumber(int hWnd);
'@) ; [Win32.WinAPI]::GetWindowDesktopNumber(${hwnd})"`).toString();
  return parseInt(output.trim(), 10);
}

export function isPinnedWindow(hwnd: string): boolean {
  const output = execSync(`powershell "(Add-Type -Name WinAPI -Namespace Win32 -MemberDefinition @'
    [DllImport("user32.dll")]
    public static extern bool IsPinnedWindow(int hWnd);
'@) ; [Win32.WinAPI]::IsPinnedWindow(${hwnd})"`).toString();
  return output.trim().toLowerCase() === 'true';
}

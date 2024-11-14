# Window and Virtual Desktop Manager

Generated with Copilot Workspace, not tested! Possible replacement of https://github.com/popstas/windows11-manager

This library provides functions to control windows and virtual desktops on Windows 11. It allows you to list, move, resize, minimize, maximize, and close windows, as well as create, remove, and switch between virtual desktops.

## Installation

To install the library, run:

```sh
npm install window-virtual-desktop-manager
```

## Usage

### Window Management

#### List all open windows

```js
const { windowManager } = require('window-virtual-desktop-manager');

const windows = windowManager.listOpenWindows();
console.log(windows);
```

#### Open a new window

```js
const { windowManager } = require('window-virtual-desktop-manager');

windowManager.openWindow('notepad.exe');
```

#### Close a window

```js
const { windowManager } = require('window-virtual-desktop-manager');

const hwnd = '123456'; // Replace with the actual window handle
windowManager.closeWindow(hwnd);
```

#### Minimize a window

```js
const { windowManager } = require('window-virtual-desktop-manager');

const hwnd = '123456'; // Replace with the actual window handle
windowManager.minimizeWindow(hwnd);
```

#### Maximize a window

```js
const { windowManager } = require('window-virtual-desktop-manager');

const hwnd = '123456'; // Replace with the actual window handle
windowManager.maximizeWindow(hwnd);
```

#### Move a window

```js
const { windowManager } = require('window-virtual-desktop-manager');

const hwnd = '123456'; // Replace with the actual window handle
windowManager.moveWindow(hwnd, 100, 100, 800, 600);
```

### Virtual Desktop Management

#### List all virtual desktops

```js
const { virtualDesktopManager } = require('window-virtual-desktop-manager');

const desktops = virtualDesktopManager.listVirtualDesktops();
console.log(desktops);
```

#### Create a new virtual desktop

```js
const { virtualDesktopManager } = require('window-virtual-desktop-manager');

virtualDesktopManager.createVirtualDesktop();
```

#### Delete a virtual desktop

```js
const { virtualDesktopManager } = require('window-virtual-desktop-manager');

const desktopId = '123456'; // Replace with the actual virtual desktop ID
virtualDesktopManager.deleteVirtualDesktop(desktopId);
```

#### Switch to a virtual desktop

```js
const { virtualDesktopManager } = require('window-virtual-desktop-manager');

const desktopId = '123456'; // Replace with the actual virtual desktop ID
virtualDesktopManager.switchVirtualDesktop(desktopId);
```

#### Move a window to a virtual desktop

```js
const { virtualDesktopManager } = require('window-virtual-desktop-manager');

const hwnd = '123456'; // Replace with the actual window handle
const desktopId = '123456'; // Replace with the actual virtual desktop ID
virtualDesktopManager.moveWindowToVirtualDesktop(hwnd, desktopId);
```

# Nextree

Nextree is a Visual Studio Code extension that provides an interactive dependency visualizer for Next.js applications. It analyzes your project structure and creates visual dependency trees showing how your pages, components, and stores are connected.

---

## Installation

### From Source (Development)

1. Clone this repository
2. Open the project in VS Code
3. Press `F5` to launch the Extension Development Host
4. In the new VS Code window, open your Next.js project
5. Use `Ctrl+Shift+P` → `Nextree: Show Tree` to launch

---

## Overview

Nextree scans your Next.js project and creates interactive dependency graphs that help you:

- **Understand component relationships**: See which components import which dependencies
- **Analyze page complexity**: Visualize all components used by each page
- **Navigate large codebases**: Click on nodes to jump to files
- **Identify architectural patterns**: Distinguish between client components, server components, and state stores

The extension analyzes JavaScript/TypeScript files (`.js`, `.jsx`, `.ts`, `.tsx`) and maps their import relationships to create a visual representation of your application's architecture.

---

## Getting Started

1. Open a Next.js project in VS Code
2. Launch Nextree using:
   - Command Palette: `Ctrl+Shift+P` → `Nextree: Show Tree`
3. A webview panel will open showing your project's dependency tree
4. Use the page navigation buttons to switch between different pages
5. Click on any node to open the corresponding file

---

## Features

### Visual Dependency Analysis
- **Automatic file scanning**: Recursively analyzes all JS/TS files in your project
- **Import mapping**: Tracks relative imports between components
- **Page-centric views**: Shows dependency trees for each page individually

### Component Type Detection
- **Client Components**: Green nodes for components with `"use client"` directive
- **Server Components**: Blue nodes for server-side components
- **State Stores**: Orange nodes for Zustand, Redux, or Context-based stores
- **Pages**: Red nodes for `page.tsx/jsx` files

### Interactive Navigation
- **File jumping**: Click any node to open the file in VS Code
- **Page filtering**: Only shows pages with multiple dependencies
- **Dynamic layout**: Uses ReactFlow for smooth, interactive diagrams

### Smart Filtering
- **Ignores common folders**: Automatically excludes `node_modules`, `.next`, `dist`, etc.
- **Single-component pages hidden**: Pages with only one component are filtered from navigation
- **Relative import resolution**: Properly resolves `./` and `../` imports

---

## How It Works

1. **File Discovery**: Walks through your project directory, finding all `.js/.jsx/.ts/.tsx` files
2. **Content Analysis**: Reads file contents to detect:
   - `"use client"` directives for client components
   - Store-related imports (Zustand, Redux, Context)
   - Import statements using regex patterns
3. **Dependency Mapping**: Creates edges between files based on relative imports
4. **Tree Generation**: Uses depth-first search to find all dependencies for each page
5. **Visualization**: Renders interactive graphs using ReactFlow

---

## Example Project Structure

Given a Next.js project like:

```
app/
├── page.tsx                 (imports Header, Footer)
├── about/
│   └── page.tsx            (imports AboutContent)
├── components/
│   ├── Header.tsx          (imports Logo)
│   ├── Footer.tsx          (imports SocialLinks)
│   ├── Logo.tsx
│   ├── AboutContent.tsx
│   └── SocialLinks.tsx
└── stores/
    └── userStore.ts
```

Nextree will show:
- **Main page** dependency tree: `page.tsx` → `Header.tsx` → `Logo.tsx`, `Footer.tsx` → `SocialLinks.tsx`
- **About page** dependency tree: `about/page.tsx` → `AboutContent.tsx`
- **Color coding**: Client components (green), server components (blue), stores (orange)

---

## Technical Details

### Supported File Types
- `.js`, `.jsx` - JavaScript files
- `.ts`, `.tsx` - TypeScript files

### Detection Patterns
- **Client components**: `/^(['"]use client['\"];?)/m` at file start
- **Stores**: Keywords like `zustand`, `redux`, `createContext` in imports or filename
- **Imports**: `/import\s+.*?from\s+['\"](.*?)['\"]/g` regex pattern

### Performance Optimizations
- Uses `useCallback` and `useMemo` for expensive calculations
- Memoizes dependency tree calculations
- Filters out irrelevant directories early in the scan

---

## Known Limitations

- Only analyzes relative imports (no absolute imports or node_modules)
- Regex-based parsing (may miss complex import patterns)
- No support for dynamic imports (`import()`)
- Requires `"use client"` directive to be at the top of the file
- Does not analyze prop drilling or context usage

---

## Contributing

Contributions are welcome. You can:

- Fork this repository and submit a pull request
- Suggest features or improvements via Issues
- Share feedback to improve workflows

If you find this project useful, please consider starring it on GitHub.

---

## Acknowledgements

Nextree was inspired by [Reactree](https://github.com/oslabs-beta/ReacTree), a visual hierarchy tool for React projects. Nextree extends these ideas to support the App Router, layouts, modular folder structures, and domain isolation found in professional Next.js applications.
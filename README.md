# Nextree

Nextree is a Visual Studio Code extension that provides a dynamic and interactive visualizer for Next.js (App Router) applications. It is designed to help teams understand and navigate large-scale, modular architectures with ease.

---

## Installation

To install Nextree from the VS Code Marketplace:

1. Open the Extensions view (`Ctrl+Shift+X` or `⇧⌘X`).
2. Search for `nextree`.
3. Click Install.

VS Code will automatically download and install the extension.

---

## Overview

Nextree is tailored for Next.js projects that use the App Router and follows modern architectural patterns found in large codebases, including:

- Modular structure within the `app/` directory
- Domain-based organization using `modules/` folders
- Scoped folders such as `_components`, `_hooks`, `_stores`
- Clear separation between global and domain-specific logic

Instead of manually navigating nested folders, Nextree provides a visual tree of the entire component and module hierarchy, making it easier to understand and maintain your project structure.

This extension is inspired by [Reactree](https://marketplace.visualstudio.com/items?itemName=ReacTreeDev.reactree), but is specifically adapted for Next.js projects.

---

## Getting Started

After installation, you can launch the extension by:

- Using the command palette: `⇧⌘P` / `Ctrl+Shift+P` → `Nextree: Show Panel`
- Clicking "Start Tree" in the status bar

A panel will display the hierarchy of your application, starting from the `app/` folder. The tree view reflects your project's structure and naming conventions.

---

## Features

- Visualize modules and submodules under the `app/` directory
- Recognize special folders: `_components`, `_hooks`, `_stores`, `_config`, and others
- Quick navigation: click any node to open the corresponding file
- Automatic refresh on file changes
- Planned: drag-and-drop layout customization
- Dark mode UI inspired by Next.js and Vercel

---

## Example Use Case

Given a project structure like:

```
app/
  modules/
    aprovacao/
      _components/
      _stores/
      _hooks/
      page.tsx
```

Nextree will display a tree like:

```
app
└── modules
    └── aprovacao
        ├── _components
        ├── _stores
        ├── _hooks
        └── page.tsx
```

This helps your team:

- Understand domain boundaries
- Identify shared and scoped components
- Maintain consistency across modules

---

## Extension Settings

| Setting               | Description                                         |
| --------------------- | --------------------------------------------------- |
| `nextree.autoRefresh` | Automatically refresh the tree when files change    |
| `nextree.exclude`     | Glob patterns to exclude folders from the tree view |
| `nextree.compactView` | Show a condensed tree layout                        |

---

## Known Limitations

- Optimized for Next.js App Router (`app/` directory)
- May not detect props or JSX trees inside deeply abstracted logic
- Does not support the legacy `pages/` directory

---

## Roadmap

- Tree layout presets (vertical, radial, etc.)
- Export diagram as PNG or SVG
- Display relationships between layouts, pages, and templates
- Detect dynamic routes (`[id]`, `(group)`, etc.)
- Visual mapping for context/providers
- CLI utility for CI/CD snapshots

---

## Contributing

Contributions are welcome. You can:

- Fork this repository and submit a pull request
- Suggest features or improvements via Issues
- Share feedback to improve workflows

If you find this project useful, please consider starring it on GitHub.

---

## Acknowledgements

Nextree was inspired by [Reactree](https://marketplace.visualstudio.com/items?itemName=AhmadAwais.reactree), a visual hierarchy tool for React projects. Nextree extends these ideas to support the App Router, layouts, modular folder structures, and domain isolation found in professional Next.js applications.

import * as vscode from 'vscode';
import { GraphData } from './nextjsAnalyzer';

export function showGraphWebview(context: vscode.ExtensionContext, graphData: GraphData) {
    const panel = vscode.window.createWebviewPanel(
        'nextreeGraph',
        'Nextree Component Graph',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );
    panel.webview.html = getWebviewContent(graphData, panel.webview, context.extensionUri);
}

function getWebviewContent(graphData: GraphData, webview: vscode.Webview, extensionUri: vscode.Uri): string {
    // Identify all page.tsx/page.jsx/etc and generete tabs
    const pageNodes = graphData.nodes.filter(n => /^page\.(t|j)sx?$/.test(n.label.replace(/ \(client\)| \(server\)/, '')));

    function getSubgraphIds(pageId: string) {
        const visited = new Set<string>();
        function dfs(nodeId: string) {
            if (visited.has(nodeId)) return;
            visited.add(nodeId);
            graphData.edges.filter(e => e.from === nodeId).forEach(e => dfs(e.to));
        }
        dfs(pageId);
        return Array.from(visited);
    }

    const pageTabs = pageNodes
        .map(n => {
            const parts = n.file.split(/[\\\/]/);
            const route = '/' + parts.slice(1, -1).join('/');
            const subgraphIds = getSubgraphIds(n.id);
            return { id: n.id, label: route || '/', subgraphIds };
        })
        .filter(tab => tab.subgraphIds.length > 1);

    // Adjust labels and colors
    const nodes = graphData.nodes.map(n => {
        let label = n.label.replace(/ \(client\)| \(server\)/, '');
        let color = n.type === 'store' ? '#ff9800' : n.type === 'client' ? '#4caf50' : '#2196f3';
        if (/^page\.(t|j)sx?$/.test(label)) {
            // Show client/server on node label page.tsx
            if (n.type === 'client') {
                label = 'page.tsx (client)';
            } else if (n.type === 'server') {
                label = 'page.tsx (server)';
            } else {
                label = 'page.tsx';
            }
            color = '#e53935';
        }
        return { ...n, label, color };
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Nextree Component Graph</title>
        <link href="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.css" rel="stylesheet" />
        <script src="https://unpkg.com/cytoscape@3.26.0/dist/cytoscape.min.js"></script>
        <style>
            #mynetwork { width: 100vw; height: 90vh; border: 1px solid #ccc; }
            #legend { position: absolute; top: 20px; right: 40px; background: #111; color: #fff; border: 1px solid #bbb; border-radius: 8px; padding: 10px 18px; font-size: 15px; box-shadow: 0 2px 8px #0001; z-index: 10; }
            .legend-dot { display: inline-block; width: 16px; height: 16px; border-radius: 50%; margin-right: 8px; vertical-align: middle; }
            #tabs { margin-bottom: 10px; }
            .tab { display: inline-block; padding: 6px 16px; margin-right: 4px; border-radius: 6px 6px 0 0; background: #111; color: #fff; cursor: pointer; border: 1px solid #bbb; }
            .tab.active { background: #2196f3; color: #fff; }
        </style>
    </head>
    <body>
        <h2>Nextree Component Graph</h2>
        <div id="legend">
            <div><span class="legend-dot" style="background:#e53935"></span>Page.tsx</div>
            <div><span class="legend-dot" style="background:#4caf50"></span>Client Component</div>
            <div><span class="legend-dot" style="background:#2196f3"></span>Server Component</div>
            <div><span class="legend-dot" style="background:#ff9800"></span>Store/Context</div>
        </div>
        <div id="tabs">
            ${pageTabs.map((tab, i) => `<span class="tab${i === 0 ? ' active' : ''}" id="tab-${tab.id}">${tab.label}</span>`).join('')}
        </div>
        <div id="mynetwork"></div>
        <script>
            const allNodes = ${JSON.stringify(nodes.map(n => ({ data: { id: n.id, label: n.label, type: n.type }, style: { 'background-color': n.color } })))};
            const allEdges = ${JSON.stringify(graphData.edges.map(e => ({ data: { source: e.from, target: e.to } })))};
            let pageTabs = ${JSON.stringify(pageTabs)};
            pageTabs = pageTabs.map(tab => ({ ...tab, subgraphIds: new Set(tab.subgraphIds) }));
            function getSubgraph(pageId) {
                const tab = pageTabs.find(t => t.id === pageId);
                if (!tab) return { subNodes: [], subEdges: [] };
                const subNodes = allNodes.filter(n => tab.subgraphIds.has(n.data.id));
                const subEdges = allEdges.filter(e => tab.subgraphIds.has(e.data.source) && tab.subgraphIds.has(e.data.target));
                return { subNodes, subEdges };
            }
            function draw(tabId) {
                const { subNodes, subEdges } = getSubgraph(tabId);
                const container = document.getElementById('mynetwork');
                container.innerHTML = '';
                const cy = cytoscape({
                    container,
                    elements: [ ...subNodes, ...subEdges ],
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'background-color': 'data(background-color)',
                                'label': 'data(label)',
                                'color': '#fff',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'font-size': 13,
                                'width': 80,
                                'height': 40,
                                'shape': 'roundrectangle',
                                'text-wrap': 'wrap',
                                'text-max-width': 70,
                                'text-outline-width': 2,
                                'text-outline-color': '#222'
                            }
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 0.7,
                                'line-color': '#bbb',
                                'target-arrow-color': '#bbb',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier',
                                'arrow-scale': 0.9
                            }
                        }
                    ],
                    layout: {
                        name: 'breadthfirst',
                        directed: true,
                        padding: 40,
                        spacingFactor: 1.5,
                        animate: true,
                        orientation: 'vertical',
                        roots: subNodes.filter(n => /^page\.(t|j)sx?/.test(n.data.label)).map(n => n.data.id),
                        nodeDimensionsIncludeLabels: true,
                        edgeElasticity: 100,
                        edgeSep: 100,
                        nodeSep: 100,
                        rankDir: 'TB'
                    }
                });
            }
            pageTabs.forEach((tab, i) => {
                const el = document.getElementById('tab-' + tab.id);
                if (!el) return;
                el.onclick = () => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    el.classList.add('active');
                    draw(tab.id);
                };
                if (i === 0) draw(tab.id);
            });
        </script>
    </body>
    </html>
    `;
}

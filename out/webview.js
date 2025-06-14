"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.showGraphWebview = showGraphWebview;
const vscode = __importStar(require("vscode"));
function showGraphWebview(context, graphData) {
    const panel = vscode.window.createWebviewPanel('nextreeGraph', 'Nextree Component Graph', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent(graphData, panel.webview, context.extensionUri);
}
function getWebviewContent(graphData, webview, extensionUri) {
    // Identifica todos os page.tsx/page.jsx/etc e gera abas
    const pageNodes = graphData.nodes.filter(n => /^page\.(t|j)sx?$/.test(n.label.replace(/ \(client\)| \(server\)/, '')));
    // Só cria aba se a subárvore tiver mais de 1 nó
    function getSubgraphIds(pageId) {
        const visited = new Set();
        function dfs(nodeId) {
            if (visited.has(nodeId))
                return;
            visited.add(nodeId);
            graphData.edges.filter(e => e.from === nodeId).forEach(e => dfs(e.to));
        }
        dfs(pageId);
        return Array.from(visited); // <-- serializa como array
    }
    const pageTabs = pageNodes
        .map(n => {
        const parts = n.file.split(/[\\\/]/);
        const route = '/' + parts.slice(1, -1).join('/');
        const subgraphIds = getSubgraphIds(n.id);
        return { id: n.id, label: route || '/', subgraphIds };
    })
        .filter(tab => tab.subgraphIds.length > 1);
    // Ajusta labels normalmente
    const nodes = graphData.nodes.map(n => {
        let label = n.label.replace(/ \(client\)| \(server\)/, '');
        if (/^page\.(t|j)sx?$/.test(label)) {
            const parts = n.file.split(/[\\\/]/);
            const route = '/' + parts.slice(1, -1).join('/');
            label = `${label} (${route || '/'})`;
        }
        return { ...n, label };
    });
    // Função para buscar subárvore a partir de um page
    function getSubgraph(pageId) {
        const visited = new Set();
        function dfs(nodeId) {
            if (visited.has(nodeId))
                return;
            visited.add(nodeId);
            graphData.edges.filter(e => e.from === nodeId).forEach(e => dfs(e.to));
        }
        dfs(pageId);
        const subNodes = nodes.filter(n => visited.has(n.id));
        const subEdges = graphData.edges.filter(e => visited.has(e.from) && visited.has(e.to));
        return { subNodes, subEdges };
    }
    // Usa vis-network via CDN
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Nextree Component Graph</title>
        <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
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
            <div><span class="legend-dot" style="background:#4caf50"></span>Client Component</div>
            <div><span class="legend-dot" style="background:#2196f3"></span>Server Component</div>
            <div><span class="legend-dot" style="background:#ff9800"></span>Store/Context</div>
        </div>
        <div id="tabs">
            ${pageTabs.map((tab, i) => `<span class="tab${i === 0 ? ' active' : ''}" id="tab-${tab.id}">${tab.label}</span>`).join('')}
        </div>
        <div id="mynetwork"></div>
        <script>
            const allNodes = ${JSON.stringify(nodes.map(n => ({ id: n.id, label: n.label, color: n.type === 'store' ? '#ff9800' : n.type === 'client' ? '#4caf50' : '#2196f3' })))};
            const allEdges = ${JSON.stringify(graphData.edges.map(e => ({ ...e, arrows: 'to' })))};
            let pageTabs = ${JSON.stringify(pageTabs)};
            // Converte subgraphIds para Set
            pageTabs = pageTabs.map(tab => ({ ...tab, subgraphIds: new Set(tab.subgraphIds) }));
            function getSubgraph(pageId) {
                const tab = pageTabs.find(t => t.id === pageId);
                if (!tab) return { subNodes: [], subEdges: [] };
                const subNodes = allNodes.filter(n => tab.subgraphIds.has(n.id));
                const subEdges = allEdges.filter(e => tab.subgraphIds.has(e.from) && tab.subgraphIds.has(e.to));
                return { subNodes, subEdges };
            }
            function draw(tabId) {
                const { subNodes, subEdges } = getSubgraph(tabId);
                const visNodes = new vis.DataSet(subNodes);
                const visEdges = new vis.DataSet(subEdges);
                const container = document.getElementById('mynetwork');
                container.innerHTML = '';
                const data = { nodes: visNodes, edges: visEdges };
                const options = {
                    layout: {
                        hierarchical: {
                            enabled: true,
                            direction: 'UD',
                            sortMethod: 'hubsize',
                            nodeSpacing: 350,
                            levelSeparation: 250,
                            treeSpacing: 500,
                            blockShifting: true,
                            edgeMinimization: true,
                            parentCentralization: true
                        }
                    },
                    edges: {
                        smooth: {
                            type: 'cubicBezier',
                            forceDirection: 'vertical',
                            roundness: 0.4
                        }
                    },
                    physics: false,
                    interaction: { dragNodes: true, zoomView: true, dragView: true }
                };
                const network = new vis.Network(container, data, options);
                network.once('afterDrawing', function() {
                    network.fit({ animation: true });
                });
            }
            // Tabs
            pageTabs.forEach((tab, i) => {
                const el = document.getElementById('tab-' + tab.id);
                if (!el) return;
                el.onclick = () => {
                    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                    el.classList.add('active');
                    draw(tab.id);
                };
                // Ativa a primeira aba por padrão
                if (i === 0) draw(tab.id);
            });
        </script>
    </body>
    </html>
    `;
}
//# sourceMappingURL=webview.js.map
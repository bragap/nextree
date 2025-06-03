window.addEventListener('message', (event) => {
  const tree = event.data;
  renderTree(tree);
});

function renderTree(data) {
  const container = document.getElementById('tree');
  if (!container) return;
  container.innerHTML = ''; 

  const createNode = (node, depth = 0) => {
    const div = document.createElement('div');
    div.style.marginLeft = `${depth * 20}px`;
    div.style.padding = '4px';
    div.style.fontFamily = 'monospace';
    div.textContent = `📁 ${node.name} (${node.type})${node.isClient ? ' ⚡' : ''}`;

    container.appendChild(div);

    if (node.children) {
      node.children.forEach((child) => createNode(child, depth + 1));
    }
  };

  if (data.app) {
    createNode(data.app);
  }

  if (data.components) {
    createNode(data.components);
  }
}

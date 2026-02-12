class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

let root = null;

function height(n) {
  return n ? n.height : 0;
}

function getBalance(n) {
  return n ? height(n.left) - height(n.right) : 0;
}

function rightRotate(y) {
  let x = y.left;
  let T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = 1 + Math.max(height(y.left), height(y.right));
  x.height = 1 + Math.max(height(x.left), height(x.right));

  return x;
}

function leftRotate(x) {
  let y = x.right;
  let T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = 1 + Math.max(height(x.left), height(x.right));
  y.height = 1 + Math.max(height(y.left), height(y.right));

  return y;
}

function insert(node, key) {
  if (!node) return new Node(key);

  if (key < node.val)
    node.left = insert(node.left, key);
  else if (key > node.val)
    node.right = insert(node.right, key);
  else
    return node;

  node.height = 1 + Math.max(height(node.left), height(node.right));
  let balance = getBalance(node);

  // LL
  if (balance > 1 && key < node.left.val)
    return rightRotate(node);

  // RR
  if (balance < -1 && key > node.right.val)
    return leftRotate(node);

  // LR
  if (balance > 1 && key > node.left.val) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }

  // RL
  if (balance < -1 && key < node.right.val) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  return node;
}

function add() {
  let v = parseInt(document.getElementById("val").value);
  if (isNaN(v)) return;

  root = insert(root, v);
  redraw();
}

function resetTree() {
  root = null;
  redraw();
}

function redraw() {
  const svg = document.getElementById("tree");
  svg.innerHTML = "";

  const width = svg.clientWidth;

  if (root) {
    drawTree(root, width / 2, 70, width / 4);
  }
}


function drawTree(node, x, y, gap) {
  if (!node) return;

  if (node.left) {
    drawLine(x, y, x - gap, y + 90);
    drawTree(node.left, x - gap, y + 90, gap / 2);
  }

  if (node.right) {
    drawLine(x, y, x + gap, y + 90);
    drawTree(node.right, x + gap, y + 90, gap / 2);
  }

  drawNode(x, y, node);
}

function drawNode(x, y, node) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("tree");

  let circle = document.createElementNS(svgNS, "circle");
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", 25);
  circle.setAttribute("fill", "#2ecc71");
  circle.setAttribute("stroke", "#1e8449");
  circle.setAttribute("stroke-width", "2");

  let text = document.createElementNS(svgNS, "text");
  text.setAttribute("x", x);
  text.setAttribute("y", y + 5);
  text.setAttribute("text-anchor", "middle");
  text.setAttribute("fill", "white");
  text.setAttribute("font-size", "14");
  text.setAttribute("font-weight", "bold");

  // Show value + balance factor
  text.textContent = node.val + " (" + getBalance(node) + ")";

  svg.appendChild(circle);
  svg.appendChild(text);
}

function drawLine(x1, y1, x2, y2) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("tree");

  let line = document.createElementNS(svgNS, "line");
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1 + 25);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2 - 25);
  line.setAttribute("stroke", "#333");
  line.setAttribute("stroke-width", "2");

  svg.appendChild(line);
}
function buildTree() {
  let values = document.getElementById("values").value.trim();
  if (!values) return;

  resetTree();

  let nums = values.split(" ").map(Number);

  nums.forEach(num => {
    if (!isNaN(num)) {
      root = insert(root, num);
    }
  });

  redraw();
}

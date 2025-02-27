const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

class TreeNode {
    constructor(value, color = 'red') {
        this.value = value;
        this.color = color;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class RedBlackTree {
    constructor() {
        this.root = null;
        this.NIL = new TreeNode(null, 'black');
    }

    findNode(value) {
        if (!this.root) return null;
        let currentNode = this.root;
        while (currentNode !== this.NIL && currentNode !== null) {
            if (value === currentNode.value) {
                return currentNode;
            }
            currentNode = value < currentNode.value ? currentNode.left : currentNode.right;
        }
        return null;
    }

    rotateLeft(node) {
        if (!node || !node.right) return; 
        const temp = node.right;
        node.right = temp.left;
        
        if (temp.left !== this.NIL) {
            temp.left.parent = node;
        }
        temp.parent = node.parent;
        
        if (!node.parent) {
            this.root = temp;
        } else if (node === node.parent.left) {
            node.parent.left = temp;
        } else {
            node.parent.right = temp;
        }
        temp.left = node;
        node.parent = temp;
    }

    rotateRight(node) {
        if (!node || !node.left) return;
        const temp = node.left;
        node.left = temp.right; 
        
        if (temp.right !== this.NIL) {
            temp.right.parent = node;
        }
        temp.parent = node.parent;
        
        if (!node.parent) {
            this.root = temp;
        } else if (node === node.parent.right) {
            node.parent.right = temp;
        } else {
            node.parent.left = temp;
        }
        temp.right = node;
        node.parent = temp;     
    }

    insert(value) {
        const newNode = new TreeNode(value);
        newNode.left = this.NIL;
        newNode.right = this.NIL;

        if (!this.root) {
            this.root = newNode;
            this.root.color = 'black';
            return;
        }

        this.insertNode(this.root, newNode);
        this.fixTree(newNode);
    }

    insertNode(root, newNode) {
        if (newNode.value < root.value) {
            if (root.left === this.NIL) {
                root.left = newNode;
                newNode.parent = root;
            } else {
                this.insertNode(root.left, newNode);
            }
        } else {
            if (root.right === this.NIL) {
                root.right = newNode;
                newNode.parent = root;
            } else {
                this.insertNode(root.right, newNode);
            }
        }
    }

    fixTree(node) {
        while (node !== this.root && node.parent && node.parent.color === 'red') {
            if (node.parent === node.parent.parent.left) {
                const uncle = node.parent.parent.right;
                
                if (uncle && uncle.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.right) {
                        node = node.parent;
                        this.rotateLeft(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateRight(node.parent.parent);
                }
            } else {
                const uncle = node.parent.parent.left;
                
                if (uncle && uncle.color === 'red') {
                    node.parent.color = 'black';
                    uncle.color = 'black';
                    node.parent.parent.color = 'red';
                    node = node.parent.parent;
                } else {
                    if (node === node.parent.left) {
                        node = node.parent;
                        this.rotateRight(node);
                    }
                    node.parent.color = 'black';
                    node.parent.parent.color = 'red';
                    this.rotateLeft(node.parent.parent);
                }
            }
        }
        this.root.color = 'black';
    }

    delete(value) {
        let nodeToDelete = this.findNode(value);
        if (!nodeToDelete) return;
    
        let x, originalNode = nodeToDelete;
        let originalColor = originalNode.color;
    
        if (nodeToDelete.left === this.NIL) {
            x = nodeToDelete.right;
            this.transplant(nodeToDelete, nodeToDelete.right);
        }
        else if (nodeToDelete.right === this.NIL) {
            x = nodeToDelete.left;
            this.transplant(nodeToDelete, nodeToDelete.left);   
        }
        else {

            originalNode = this.getMaximum(nodeToDelete.left); 
            originalColor = originalNode.color;
            x = originalNode.left;
    
            if (originalNode.parent !== nodeToDelete) {
                this.transplant(originalNode, originalNode.left);
                originalNode.left = nodeToDelete.left;
                originalNode.left.parent = originalNode;
            }
    
            this.transplant(nodeToDelete, originalNode);
            originalNode.right = nodeToDelete.right;
            originalNode.right.parent = originalNode;
            originalNode.color = nodeToDelete.color;
        }
    
        if (originalColor === 'black') {
            this.fixDelete(x);
        }
    }
    
    
    
    fixDelete(node) {
        while (node !== this.root && node.color === 'black') {
            let sibling;
            
            if (node === node.parent.left) {
                sibling = node.parent.right;
                
         
                if (sibling.color === 'red') {
                    sibling.color = 'black';
                    node.parent.color = 'red';
                    this.rotateLeft(node.parent);
                    sibling = node.parent.right;
                }
            
                if (sibling.left.color === 'black' && sibling.right.color === 'black') {
                    sibling.color = 'red';
                    node = node.parent;
                } else {
                   
                    if (sibling.right.color === 'black') {
                        sibling.left.color = 'black';
                        sibling.color = 'red';
                        this.rotateRight(sibling);
                        sibling = node.parent.right;
                    }
                    
                 
                    sibling.color = node.parent.color;
                    node.parent.color = 'black';
                    sibling.right.color = 'black';
                    this.rotateLeft(node.parent);
                    node = this.root;
                }
            } else {
                
                sibling = node.parent.left;
                
                if (sibling.color === 'red') {
                    sibling.color = 'black';
                    node.parent.color = 'red';
                    this.rotateRight(node.parent);
                    sibling = node.parent.left;
                }
    
                if (sibling.right.color === 'black' && sibling.left.color === 'black') {
                    sibling.color = 'red';
                    node = node.parent;
                } else {
                    if (sibling.left.color === 'black') {
                        sibling.right.color = 'black';
                        sibling.color = 'red';
                        this.rotateLeft(sibling);
                        sibling = node.parent.left;
                    }
    
                    sibling.color = node.parent.color;
                    node.parent.color = 'black';
                    sibling.left.color = 'black';
                    this.rotateRight(node.parent);
                    node = this.root;
                }
            }
        }
        node.color = 'black';
    }
    
    transplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        if (v !== null && v !== this.NIL) {
            v.parent = u.parent;
        }
    }

    getMaximum(node) {
        while (node.right !== this.NIL && node.right !== null) {
            node = node.right;
        }
        return node;
    }

    getMinimum(node) {
        while (node.left !== this.NIL && node.left !== null) {
            node = node.left;
        }
        return node;
    }
}


function drawNode(value, x, y, color) {
    if (typeof value !== 'number' || typeof x !== 'number' || typeof y !== 'number') return;
    
    ctx.fillStyle = color === 'red' ? '#ff4d4d' : '#333';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(value.toString(), x, y);
}

function drawLine(x1, y1, x2, y2) {
    if (typeof x1 !== 'number' || typeof y1 !== 'number' || 
        typeof x2 !== 'number' || typeof y2 !== 'number') return;
        
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function drawTree(node, x, y, spacing = 100) {
    if (!node || node === redBlackTree.NIL) return;

    if (node.left && node.left !== redBlackTree.NIL) {
        drawLine(x, y, x - spacing, y + 80);
        drawTree(node.left, x - spacing, y + 80, spacing / 1.5);
    }

    if (node.right && node.right !== redBlackTree.NIL) {
        drawLine(x, y, x + spacing, y + 80);
        drawTree(node.right, x + spacing, y + 80, spacing / 1.5);
    }

    drawNode(node.value, x, y, node.color);
}

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (redBlackTree.root) {
        drawTree(redBlackTree.root, canvas.width / 2, 50);
    }
}

const redBlackTree = new RedBlackTree();

document.getElementById('insertNode').addEventListener('click', () => {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
        redBlackTree.insert(value);
        updateCanvas();
        document.getElementById('nodeValue').value = '';
    } else {
        alert("Please enter a valid number");
    }
});

document.getElementById('deleteButton').addEventListener('click', () => {
    const value = parseInt(document.getElementById('deleteValue').value);
    if (!isNaN(value)) {
        redBlackTree.delete(value);
        updateCanvas();
        document.getElementById('deleteValue').value = '';
    } else {
        alert("Please enter a valid number");
    }
});
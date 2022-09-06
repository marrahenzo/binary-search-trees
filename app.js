class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    //Remove duplicates and sort the array before building the tree
    arr = this.removeDuplicates(arr);
    arr.sort((a, b) => a - b);
    this.root = this.buildTree(arr, 0, arr.length - 1);
  }

  buildTree(arr, start, end) {
    //Recursive function to insert nodes based on their value
    if (start > end) return null;
    let middle = Math.round((start + end) / 2);
    let root = new Node(arr[middle]);

    root.left = this.buildTree(arr, start, middle - 1);
    root.right = this.buildTree(arr, middle + 1, end);

    return root;
  }

  removeDuplicates(arr) {
    let newArr = [];
    for (let item of arr) {
      if (!newArr.includes(item)) newArr.push(item);
    }
    return newArr;
  }

  insert(value) {
    let hasChild = true;
    let root = this.root;
    while (hasChild) {
      //Value is less than node but the node has a left subtree
      if (value < root.data && root.left !== null) {
        root = root.left;
        //Value is less than node and the node has no left subtree
      } else if (value < root.data) {
        root.left = new Node(value);
        hasChild = false;
      }
      //Value is less than node but the node has a right subtree
      if (value > root.data && root.right !== null) {
        root = root.right;
        //Value is less than node and the node has no right subtree
      } else if (value > root.data) {
        root.right = new Node(value);
        hasChild = false;
      }
      //Value already exists, so it won't be inserted
      if (value === root.data) hasChild = false;
    }
  }

  delete(value) {
    let previous = null;
    let current = this.root;
    while (value !== current.data) {
      previous = current;
      //Break if value doesn't exist or update current root if node has subtrees
      if (value < current.data) {
        if (!current.left) break;
        current = current.left;
      } else if (value > current.data) {
        if (!current.right) break;
        current = current.right;
      }
    }
    //If value exists and its node has no subtrees
    if (!current.left && !current.right) {
      //Check which leaf the node is and remove it
      if (previous.left === current) {
        previous.left = null;
      } else {
        previous.right = null;
      }
    }
    //If value exists and its node has only one child
    if ((current.left && !current.right) || (!current.left && current.right)) {
      //Replace node with child according to the node's "side"
      if (current.left) {
        if (current === previous.left) {
          previous.left = current.left;
        } else {
          previous.right = current.left;
        }
      } else {
        if (current === previous.left) {
          previous.left = current.right;
        } else {
          previous.right = current.right;
        }
      }
    }
    //If value exists and its node has more than one child
    if (current.left && current.right) {
      let oldPrevious = previous;
      previous = current;
      current = current.right;
      //Get closest higher number than current node
      while (current.left) {
        current = current.left;
      }
      //Remove reference to itself to avoid stack overflow
      this.delete(previous.right.data);
      //Replace node
      current.left = previous.left;
      current.right = previous.right;
      if (previous === oldPrevious.left) {
        oldPrevious.left = current;
      } else {
        oldPrevious.right = current;
      }
    }
  }

  find(value) {
    let current = this.root;
    if (value === current.data) return current;
    while (value < current.data) {
      current = current.left;
    }
    while (value > current.data) {
      current = current.right;
    }
    if (value === current.data) return current;
    else return null;
  }

  levelOrder(func) {
    if (this.root === null) return null;
    let current = this.root;
    let queue = [current];
    let arr = [];
    //While there is at least one node remaining
    while (queue.length > 0) {
      current = queue[0];
      //If a function is provided, call it with the current node as a parameter
      //otherwise, add the current node to an array
      if (func) func(current);
      else arr.push(current);
      //If node has children, add them to queue
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
      queue.shift();
    }
    if (!func) return arr;
  }
}

const prettyPrint = (node, prefix = '', isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
  }
  console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
  }
};

let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 36, 45, 98, 150];

let tree = new Tree(arr);
tree.insert(0);
tree.insert(10);
tree.insert(20);
tree.delete(8);

prettyPrint(tree.root);

console.log(tree.levelOrder());

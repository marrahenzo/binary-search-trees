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

  buildTree(arr) {
    //Recursive function to insert nodes based on their value
    if (arr.length === 1) return new Node(arr[0]);
    if (arr.length === 0) return null;

    let middle = Math.floor(arr.length / 2);
    let root = new Node(arr[middle]);

    root.left = this.buildTree(arr.slice(0, middle));
    root.right = this.buildTree(arr.slice(middle + 1, arr.length));

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
      else arr.push(current.data);
      //If node has children, add them to queue
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
      queue.shift();
    }
    if (!func) return arr;
  }

  inorder(func, current = this.root, arr = []) {
    if (!current) return;

    this.preorder(func, current.left, arr);
    if (func) func(current);
    else arr.push(current.data);
    this.preorder(func, current.right, arr);
    if (!func) return arr;
  }

  preorder(func, current = this.root, arr = []) {
    if (!current) return;

    if (func) func(current);
    else arr.push(current.data);
    this.preorder(func, current.left, arr);
    this.preorder(func, current.right, arr);
    if (!func) return arr;
  }

  postorder(func, current = this.root, arr = []) {
    if (!current) return;

    this.preorder(func, current.left, arr);
    this.preorder(func, current.right, arr);
    if (func) func(current);
    else arr.push(current.data);
    if (!func) return arr;
  }

  height(value) {
    let node;
    if (typeof value !== 'object') {
      node = this.find(value);
    } else node = value;
    let leftHeight = 0;
    let rightHeight = 0;
    if (!node) return 0;
    if (node.left) {
      leftHeight = this.height(node.left);
    }
    if (node.right) {
      rightHeight = this.height(node.right);
    }
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(value) {
    let current = this.root;
    let counter = 0;
    while (value < current.data) {
      if (current.left) {
        current = current.left;
        counter++;
      } else break;
    }
    while (value > current.data) {
      if (current.right) {
        current = current.right;
        counter++;
      } else break;
    }
    if (current.data === value) {
      return counter;
    } else return null;
  }

  isBalanced() {
    let difference = this.height(this.root.left) - this.height(this.root.right);
    return difference >= -1 && difference <= 1;
  }

  rebalance() {
    let arr = this.levelOrder();
    this.root = this.buildTree(arr, 0, arr.length);
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

function printRandomNumbers(min = 1, max = 100, amount = 20) {
  let arr = [];
  let number = 0;
  let counter = 0;
  while (counter < amount) {
    number = Math.random() * max + min;
    if (!arr.includes(number)) {
      arr.push(Math.round(number));
      counter++;
    }
  }
  return arr;
}

//1. Create a binary search tree from an array of random numbers.
//You can create a function if you want that returns an array of random numbers each time you call it.

let arr = printRandomNumbers();

let tree = new Tree(arr);

prettyPrint(tree.root);

//2. Confirm that the tree is balanced by calling isBalanced

console.log(tree.isBalanced());

//3. Print out all elements in level, pre, post, and in order

console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.postorder());
console.log(tree.inorder());

//4. Unbalance the tree by adding several numbers > 100

tree.insert(100);
tree.insert(101);
tree.insert(102);
tree.insert(103);
tree.insert(100);
tree.insert(105);
tree.insert(170);
tree.insert(368);

//5. Confirm that the tree is unbalanced by calling isBalanced

console.log(tree.isBalanced());

//6. Balance the tree by calling rebalance

tree.rebalance();

//7. Confirm that the tree is balanced by calling isBalanced

console.log(tree.isBalanced());

//8. Print out all elements in level, pre, post, and in order

console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.postorder());
console.log(tree.inorder());

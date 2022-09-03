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
        if (current.left === null) break;
        current = current.left;
      } else if (value > current.data) {
        if (current.right === null) break;
        current = current.right;
      }
    }
    //If value exists and its node has no subtrees
    if (current.left === null && current.right === null) {
      //Check which leaf the node is and remove it
      if (previous.left === current) {
        previous.left = null;
      } else {
        previous.right = null;
      }
    }
    console.log(current);
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

let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

let tree = new Tree(arr);
tree.insert(0);
tree.insert(10);
tree.insert(20);
tree.delete(67);

prettyPrint(tree.root);

# Depth First Search Problems

## Depth First Search Concept

### What is Depth First Search
Depth First Search (DFS) is a graph/tree traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (either explicitly or via recursion call stack) to track the path. DFS visits a node, then recursively visits all its unvisited neighbors, going deep into the structure before exploring siblings.

### Core Operations:
1. **Visit**: Mark current node as visited - O(1)
2. **Traverse**: Overall DFS traversal runs in O(V + E) time across the entire graph
3. **Backtrack**: Return from recursion when no unvisited neighbors - O(1)
4. **Track State**: Use visited set/array to avoid cycles - O(V) space

### When to Use DFS
Use DFS when:
1. Need to explore all paths or find any path
2. Problem involves trees or graphs
3. Must visit all nodes/cells in connected component
4. Looking for cycles in a graph
5. Need to validate tree properties (BST, balance, etc.)
6. Problem involves backtracking or exploring all possibilities
7. Memory allows recursive call stack (depth of tree/graph)
8. Order of exploration doesn't matter (vs BFS for shortest path)

### Common DFS Patterns
```
1. Tree DFS (Recursive):
   function dfs(node):
       if node is null: return
       process(node)
       dfs(node.left)
       dfs(node.right)
   
2. Graph DFS (Recursive):
   function dfs(node, visited):
       if visited[node]: return
       visited[node] = true
       for neighbor in node.neighbors:
           dfs(neighbor, visited)

3. Grid DFS (4-directional):
   function dfs(row, col, grid, visited):
       if out of bounds or visited: return
       visited[row][col] = true
       dfs(row+1, col)  // down
       dfs(row-1, col)  // up
       dfs(row, col+1)  // right
       dfs(row, col-1)  // left
```

### Example:
**Problem:** Count number of islands in a 2D grid

**Why DFS?** Need to explore entire connected component (island). When we find land ('1'), we want to mark all connected land cells as visited to count as one island. DFS naturally explores all reachable cells from starting point. Each DFS call marks one complete island. Alternative BFS works too, but DFS is simpler with recursion.

**Without DFS:** Tracking connected components manually is complex
**With DFS:** Start at unvisited land, recursively mark all connected land → O(rows × cols)

---

## Maximum Depth of Binary Tree | LeetCode 104 | Easy
Given the `root` of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.

### Examples:
1. Input: root = [3,9,20,null,null,15,7], Output = 3  
   - Tree structure:
     ```
         3
        / \
       9  20
         /  \
        15   7
     ```
   - Longest path: 3 → 20 → 15 (or 7), depth = 3

2. Input: root = [1,null,2], Output = 2  
   - Tree structure:
     ```
       1
        \
         2
     ```
   - Only right child, depth = 2

3. Input: root = [], Output = 0  
   - Empty tree, depth = 0

4. Input: root = [1,2,3,4,null,null,5,null,null,null,null,6], Output = 4  
   - Tree structure:
     ```
           1
          / \
         2   3
        /     \
       4       5
                \
                 6
     ```
   - Longest path: 1 → 3 → 5 → 6, depth = 4

5. Input: root = [1,2,2,3,3,3,3,4,4,4,4,4,4,null,null], Output = 4  
   - Full binary tree down to level 4
   - Multiple paths of length 4
   - Example path: 1 → 2 → 3 → 4, depth = 4

### Pseudocode:
```
WHY DFS?
- Need to explore all paths from root to leaves
- Depth is defined recursively: max(left_depth, right_depth) + 1
- DFS naturally follows tree structure
- Each recursive call handles one subtree
- O(n) time to visit all nodes once
- Alternative: BFS level-order, but DFS is more intuitive for depth

1. Base case: if node is null, return 0
2. Recursively find depth of left subtree
3. Recursively find depth of right subtree
4. Return max(left_depth, right_depth) + 1
```

### C# Solution:
```csharp
public int MaxDepth(TreeNode root) {
    if (root == null) return 0;
    
    int leftDepth = MaxDepth(root.left);
    int rightDepth = MaxDepth(root.right);
    
    return Math.Max(leftDepth, rightDepth) + 1;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once.

**Space Complexity**: O(h) where h is the height of the tree, for the recursion call stack. Worst case O(n) for skewed tree, best case O(log n) for balanced tree.

## Number of Islands | LeetCode 200 | Medium
Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.

### Examples:
1. Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]], Output = 1  
   - 5x4 grid with one large island in top-left
   - DFS from any '1' marks entire connected component
   - Only 1 island found

2. Input: grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]], Output = 3  
   - 5x4 grid with three separate islands
   - Top-left: 4 connected cells
   - Middle: 1 isolated cell at (2,2)
   - Bottom-right: 2 connected cells

3. Input: grid = [["1","0","1"],["0","1","0"],["1","0","1"]], Output = 5  
   - 3x3 checkerboard pattern
   - Each '1' is isolated (diagonal doesn't count)
   - 5 separate islands

4. Input: grid = [["1"]], Output = 1  
   - Single cell grid with land
   - 1 island

5. Input: grid = [["1","1","1"],["0","1","0"],["1","1","1"]], Output = 1  
   - 3x3 grid with '1's forming a plus/cross shape
   - All '1's connected through center
   - DFS marks all 8 cells as one island
   - 1 island total

### Pseudocode:
```
WHY DFS?
- Need to mark entire connected component as visited
- When we find unvisited land, must explore all reachable land cells
- DFS recursively visits all 4 directions from each cell
- Naturally handles irregular island shapes
- Each DFS call processes one complete island
- O(m*n) time, visiting each cell once

1. Initialize count = 0
2. Create visited array (or modify grid in-place)
3. For each cell (i, j) in grid:
   - If cell is '1' and not visited:
     Increment count (found new island)
     Call DFS(i, j) to mark entire island
4. DFS(i, j):
   - If out of bounds or water or visited: return
   - Mark current cell as visited
   - Recursively call DFS for 4 neighbors: (i+1,j), (i-1,j), (i,j+1), (i,j-1)
5. Return count
```

### C# Solution:
```csharp
public int NumIslands(char[][] grid) {
    if (grid == null || grid.Length == 0) return 0;
    
    int count = 0;
    int rows = grid.Length;
    int cols = grid[0].Length;
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == '1') {
                count++;
                DFS(grid, i, j);
            }
        }
    }
    
    return count;
}

private void DFS(char[][] grid, int i, int j) {
    if (i < 0 || i >= grid.Length || j < 0 || j >= grid[0].Length || grid[i][j] != '1') {
        return;
    }
    
    grid[i][j] = '0';
    
    DFS(grid, i + 1, j);
    DFS(grid, i - 1, j);
    DFS(grid, i, j + 1);
    DFS(grid, i, j - 1);
}
```

### Complexity

**Time Complexity**: O(m × n) where m is number of rows and n is number of columns. We visit each cell at most once.

**Space Complexity**: O(m × n) in worst case for recursion stack if entire grid is land (one giant island).

## Validate Binary Search Tree | LeetCode 98 | Medium
Given the `root` of a binary tree, determine if it is a valid binary search tree (BST). A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.

### Examples:
1. Input: root = [2,1,3], Output = true  
   - Tree structure:
     ```
       2
      / \
     1   3
     ```
   - 1 < 2 < 3, valid BST

2. Input: root = [5,1,4,null,null,3,6], Output = false  
   - Tree structure:
     ```
         5
        / \
       1   4
          / \
         3   6
     ```
   - Node 4 is right child of 5, but 4 < 5 (invalid)
   - Or: node 3 is in right subtree of 5, but 3 < 5 (invalid)

3. Input: root = [1], Output = true  
   - Single node is valid BST

4. Input: root = [5,4,6,null,null,3,7], Output = false  
   - Tree structure:
     ```
         5
        / \
       4   6
          / \
         3   7
     ```
   - Node 3 is left child of 6 (3 < 6, ok)
   - But node 3 is in right subtree of 5, and 3 < 5 (invalid!)
   - Must track range, not just parent value

5. Input: root = [10,5,15,1,8,null,20,null,null,6,9], Output = true  
   - Tree structure:
     ```
           10
          /  \
         5    15
        / \     \
       1   8    20
          / \
         6   9
     ```
   - All nodes satisfy BST property with range constraints
   - Left subtree (1,5,6,8,9) all < 10
   - Right subtree (15,20) all > 10

### Pseudocode:
```
WHY DFS WITH RANGE?
- BST property must hold for entire subtree, not just immediate children
- Example: node can be > parent but must be < grandparent if in left subtree
- Need to track valid range (min, max) for each subtree
- DFS with range bounds ensures all descendants satisfy constraints
- Can't just compare with parent: need full ancestor context
- O(n) to visit each node once

1. Helper function: isValidBST(node, min, max)
2. Base case: if node is null, return true
3. Check: if node.val <= min or node.val >= max, return false
4. Recursively validate left subtree: isValidBST(node.left, min, node.val)
   - Left children must be < node.val
5. Recursively validate right subtree: isValidBST(node.right, node.val, max)
   - Right children must be > node.val
6. Return left_valid AND right_valid
7. Initial call: isValidBST(root, -infinity, +infinity)
```

### C# Solution:
```csharp
public bool IsValidBST(TreeNode root) {
    return IsValidBST(root, long.MinValue, long.MaxValue);
}

private bool IsValidBST(TreeNode node, long min, long max) {
    if (node == null) return true;
    
    if (node.val <= min || node.val >= max) return false;
    
    return IsValidBST(node.left, min, node.val) && 
           IsValidBST(node.right, node.val, max);
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once.

**Space Complexity**: O(h) where h is the height of the tree, for the recursion call stack. Worst case O(n) for skewed tree, best case O(log n) for balanced tree.

## Pacific Atlantic Water Flow | LeetCode 417 | Medium
There is an `m x n` rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges. The island is partitioned into a grid of square cells. You are given an `m x n` integer matrix `heights` where `heights[r][c]` represents the height above sea level of the cell at coordinate (r, c). The island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is less than or equal to the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean. Return a 2D list of grid coordinates where rain water can flow to both the Pacific and Atlantic oceans.

### Examples:
1. Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]], Output = [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]  
   - 5x5 grid
   - Pacific: top row + left column
   - Atlantic: bottom row + right column
   - Cell (0,4) with height 5: can reach both oceans
   - Total 7 cells can reach both oceans

2. Input: heights = [[1]], Output = [[0,0]]  
   - Single cell touches all edges
   - Can reach both Pacific and Atlantic
   - Return [[0,0]]

3. Input: heights = [[1,2,3],[8,9,4],[7,6,5]], Output = [[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]]  
   - 3x3 grid forming a square spiral
   - Center (1,1) with height 9 is highest
   - Most cells can reach both oceans via flow paths
   - 7 cells total can reach both

4. Input: heights = [[3,3,3],[3,1,3],[0,2,4]], Output = [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]  
   - 3x3 grid with valley in center
   - Center (1,1) with height 1 can only reach via higher cells
   - 6 cells can reach both oceans

5. Input: heights = [[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]], Output = [[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0],[3,1],[3,2],[3,3]]  
   - 4x4 grid with increasing perimeter, high center
   - Water flows from high center to edges
   - 10 cells can reach both oceans

### Pseudocode:
```
WHY DFS FROM OCEANS?
- Naive: for each cell, try to reach both oceans → O(m*n * m*n) too slow
- Better: reverse the flow! Start from oceans, flow upward (to equal or higher cells)
- Run DFS from all Pacific border cells, mark reachable cells
- Run DFS from all Atlantic border cells, mark reachable cells
- Answer: cells reachable from both
- O(m*n) time, visiting each cell at most twice (once per ocean)

1. Create two boolean arrays: canReachPacific, canReachAtlantic
2. DFS from Pacific borders (top row and left column):
   - For each cell on border: DFS(row, col, canReachPacific)
3. DFS from Atlantic borders (bottom row and right column):
   - For each cell on border: DFS(row, col, canReachAtlantic)
4. DFS(row, col, reachable):
   - If out of bounds or already visited: return
   - Mark reachable[row][col] = true
   - For each 4-direction neighbor:
     If neighbor height >= current height: DFS(neighbor, reachable)
5. Collect result: all cells where canReachPacific AND canReachAtlantic
```

### C# Solution:
```csharp
public IList<IList<int>> PacificAtlantic(int[][] heights) {
    List<IList<int>> result = new List<IList<int>>();
    if (heights == null || heights.Length == 0) return result;
    
    int rows = heights.Length;
    int cols = heights[0].Length;
    bool[][] pacific = new bool[rows][];
    bool[][] atlantic = new bool[rows][];
    
    for (int i = 0; i < rows; i++) {
        pacific[i] = new bool[cols];
        atlantic[i] = new bool[cols];
    }
    
    for (int i = 0; i < rows; i++) {
        DFS(heights, pacific, i, 0);
        DFS(heights, atlantic, i, cols - 1);
    }
    
    for (int j = 0; j < cols; j++) {
        DFS(heights, pacific, 0, j);
        DFS(heights, atlantic, rows - 1, j);
    }
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                result.Add(new List<int> { i, j });
            }
        }
    }
    
    return result;
}

private void DFS(int[][] heights, bool[][] visited, int i, int j) {
    if (visited[i][j]) return;
    visited[i][j] = true;
    
    int[][] directions = { new int[] {0,1}, new int[] {1,0}, new int[] {0,-1}, new int[] {-1,0} };
    
    foreach (var dir in directions) {
        int newI = i + dir[0];
        int newJ = j + dir[1];
        
        if (newI >= 0 && newI < heights.Length && 
            newJ >= 0 && newJ < heights[0].Length && 
            heights[newI][newJ] >= heights[i][j]) {
            DFS(heights, visited, newI, newJ);
        }
    }
}
```

### Complexity

**Time Complexity**: O(m × n) where m is number of rows and n is number of columns. Each cell is visited at most twice (once for each ocean).

**Space Complexity**: O(m × n) for the two boolean arrays and recursion stack in worst case.

---

## Path Sum | LeetCode 112 | Easy
Given the `root` of a binary tree and an integer `targetSum`, return `true` if the tree has a root-to-leaf path such that adding up all the values along the path equals `targetSum`. A leaf is a node with no children.

### Examples:
1. Input: root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22, Output = true  
   - Path: 5 → 4 → 11 → 2 (sum = 22)
   - This is a valid root-to-leaf path

2. Input: root = [1,2,3], targetSum = 5, Output = false  
   - Paths: 1→2 (sum=3), 1→3 (sum=4)
   - No path sums to 5

3. Input: root = [], targetSum = 0, Output = false  
   - Empty tree
   - No paths exist

4. Input: root = [1,2], targetSum = 1, Output = false  
   - Only path: 1→2 (sum=3)
   - Root alone doesn't count (not a leaf)

5. Input: root = [1], targetSum = 1, Output = true  
   - Single node is a leaf
   - Path sum = 1

### Pseudocode:
```
WHY DFS?
- Need to explore root-to-leaf paths
- DFS naturally follows paths from root to leaves
- Track running sum, subtract node values
- At leaf: check if remaining sum equals 0
- O(n) time, visit each node once

1. Base case: if root is null, return false
2. Subtract root.val from targetSum
3. If root is leaf (no children):
   - Return true if targetSum == 0
4. Recursively check left subtree with updated targetSum
5. Recursively check right subtree with updated targetSum
6. Return true if either path found
```

### C# Solution:
```csharp
public bool HasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    
    // At leaf node, check if remaining sum is 0
    if (root.left == null && root.right == null) {
        return targetSum == root.val;
    }
    
    // Recurse with updated target
    int remaining = targetSum - root.val;
    return HasPathSum(root.left, remaining) || HasPathSum(root.right, remaining);
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(h) for recursion stack where h is tree height. Worst case O(n) for skewed tree.

---

## Binary Tree Tilt | LeetCode 563 | Easy
Given the `root` of a binary tree, return the sum of every tree node's tilt. The tilt of a tree node is the absolute difference between the sum of all left subtree node values and all right subtree node values. If a node does not have a left child, then the sum of the left subtree node values is treated as 0. The rule is similar if there is no right child.

### Examples:
1. Input: root = [1,2,3], Output = 1  
   - Node 2 (leaf): tilt = |0 - 0| = 0
   - Node 3 (leaf): tilt = |0 - 0| = 0
   - Node 1: left_sum=2, right_sum=3, tilt = |2 - 3| = 1
   - Total tilt = 0 + 0 + 1 = 1

2. Input: root = [4,2,9,3,5,null,7], Output = 15  
   - Node 3: tilt = 0
   - Node 5: tilt = 0
   - Node 2: tilt = |3 - 5| = 2
   - Node 7: tilt = 0
   - Node 9: tilt = |0 - 7| = 7
   - Node 4: tilt = |(3+5+2) - (7+9)| = |10 - 16| = 6
   - Total = 0 + 0 + 2 + 0 + 7 + 6 = 15

3. Input: root = [21,7,14,1,1,2,2,3,3], Output = 9  
   - Complex tree with multiple levels
   - Calculate tilt at each node

4. Input: root = [1], Output = 0  
   - Single node: tilt = |0 - 0| = 0

5. Input: root = [1,2,null], Output = 2  
   - Node 2: tilt = |0 - 0| = 0
   - Node 1: left_sum = 2, right_sum = 0, tilt = 2
   - Total tilt = 2

### Pseudocode:
```
WHY DFS (POST-ORDER)?
- Need to calculate subtree sums first (bottom-up)
- Each node needs sum from left and right subtrees
- Post-order: process children before parent
- Track global tilt sum across all nodes
- O(n) time, visit each node once

1. Initialize global variable totalTilt = 0
2. Helper function calculateSum(node):
   - If node is null: return 0
   - Calculate leftSum = calculateSum(node.left)
   - Calculate rightSum = calculateSum(node.right)
   - tilt = |leftSum - rightSum|
   - Add tilt to totalTilt
   - Return node.val + leftSum + rightSum
3. Call calculateSum(root)
4. Return totalTilt
```

### C# Solution:
```csharp
public int FindTilt(TreeNode root) {
    int totalTilt = 0;
    CalculateSum(root, ref totalTilt);
    return totalTilt;
}

private int CalculateSum(TreeNode node, ref int totalTilt) {
    if (node == null) return 0;
    
    int leftSum = CalculateSum(node.left, ref totalTilt);
    int rightSum = CalculateSum(node.right, ref totalTilt);
    
    int tilt = Math.Abs(leftSum - rightSum);
    totalTilt += tilt;
    
    return node.val + leftSum + rightSum;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(h) for recursion stack where h is tree height.

---

## Diameter of Binary Tree | LeetCode 543 | Easy
Given the `root` of a binary tree, return the length of the diameter of the tree. The diameter of a binary tree is the length of the longest path between any two nodes in a tree. This path may or may not pass through the root. The length of a path between two nodes is represented by the number of edges between them.

### Examples:
1. Input: root = [1,2,3,4,5], Output = 3  
   - Longest path: 4 → 2 → 1 → 3 (3 edges)
   - Or: 5 → 2 → 1 → 3 (3 edges)
   - Diameter = 3

2. Input: root = [1,2], Output = 1  
   - Only path: 2 → 1 (1 edge)
   - Diameter = 1

3. Input: root = [1], Output = 0  
   - Single node, no edges
   - Diameter = 0

4. Input: root = [1,2,3,4,5,null,null,6,7], Output = 4  
   - Longest path: 6 → 4 → 2 → 1 → 3 (4 edges)
   - Path goes from leftmost leaf through root to right child

5. Input: root = [1,null,2,null,3,null,4], Output = 3  
   - Skewed tree (right-only)
   - Longest path: 1 → 2 → 3 → 4 (3 edges)

### Pseudocode:
```
WHY DFS (POST-ORDER)?
- Diameter at node = left_height + right_height
- Need heights of left and right subtrees
- Post-order: calculate children heights first
- Track maximum diameter seen globally
- O(n) time, visit each node once

1. Initialize global maxDiameter = 0
2. Helper function calculateHeight(node):
   - If node is null: return 0
   - leftHeight = calculateHeight(node.left)
   - rightHeight = calculateHeight(node.right)
   - diameter_through_node = leftHeight + rightHeight
   - Update maxDiameter if diameter_through_node is larger
   - Return 1 + max(leftHeight, rightHeight)
3. Call calculateHeight(root)
4. Return maxDiameter
```

### C# Solution:
```csharp
public int DiameterOfBinaryTree(TreeNode root) {
    int maxDiameter = 0;
    CalculateHeight(root, ref maxDiameter);
    return maxDiameter;
}

private int CalculateHeight(TreeNode node, ref int maxDiameter) {
    if (node == null) return 0;
    
    int leftHeight = CalculateHeight(node.left, ref maxDiameter);
    int rightHeight = CalculateHeight(node.right, ref maxDiameter);
    
    // Diameter through this node
    int diameter = leftHeight + rightHeight;
    maxDiameter = Math.Max(maxDiameter, diameter);
    
    // Return height of this subtree
    return 1 + Math.Max(leftHeight, rightHeight);
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(h) for recursion stack where h is tree height.

---

## Path Sum II | LeetCode 113 | Medium
Given the `root` of a binary tree and an integer `targetSum`, return all root-to-leaf paths where the sum of the node values in the path equals `targetSum`. Each path should be returned as a list of the node values, not node references. A root-to-leaf path is a path starting from the root and ending at any leaf node. A leaf is a node with no children.

### Examples:
1. Input: root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22, Output = [[5,4,11,2],[5,8,4,5]]  
   - Path 1: 5 → 4 → 11 → 2 (sum = 22)
   - Path 2: 5 → 8 → 4 → 5 (sum = 22)

2. Input: root = [1,2,3], targetSum = 5, Output = []  
   - No paths sum to 5
   - Paths: [1,2]=3, [1,3]=4

3. Input: root = [1,2], targetSum = 0, Output = []  
   - Only path [1,2] = 3
   - No match

4. Input: root = [1], targetSum = 1, Output = [[1]]  
   - Single node matches

5. Input: root = [1,2,3,4,5], targetSum = 8, Output = [[1,2,5]]  
   - Only path [1,2,5] sums to 8

### Pseudocode:
```
WHY DFS WITH BACKTRACKING?
- Need all valid paths (not just one)
- DFS explores all root-to-leaf paths
- Backtracking: add node, recurse, remove node
- Track current path and remaining sum
- O(n) time to explore all paths

1. Initialize result list
2. Initialize current path list
3. Helper function dfs(node, currentPath, remainingSum):
   - If node is null: return
   - Add node.val to currentPath
   - If node is leaf and remainingSum == node.val:
     - Add copy of currentPath to result
   - Recurse on left child with remainingSum - node.val
   - Recurse on right child with remainingSum - node.val
   - Remove node.val from currentPath (backtrack)
4. Call dfs(root, currentPath, targetSum)
5. Return result
```

### C# Solution:
```csharp
public IList<IList<int>> PathSum(TreeNode root, int targetSum) {
    List<IList<int>> result = new List<IList<int>>();
    List<int> currentPath = new List<int>();
    DFS(root, targetSum, currentPath, result);
    return result;
}

private void DFS(TreeNode node, int remainingSum, List<int> currentPath, List<IList<int>> result) {
    if (node == null) return;
    
    currentPath.Add(node.val);
    
    // Check if leaf and sum matches
    if (node.left == null && node.right == null && remainingSum == node.val) {
        result.Add(new List<int>(currentPath));
    }
    
    // Recurse on children
    DFS(node.left, remainingSum - node.val, currentPath, result);
    DFS(node.right, remainingSum - node.val, currentPath, result);
    
    // Backtrack
    currentPath.RemoveAt(currentPath.Count - 1);
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(h) for recursion stack and current path, where h is tree height.

---

## Longest Univalue Path | LeetCode 687 | Medium
Given the `root` of a binary tree, return the length of the longest path, where each node in the path has the same value. This path may or may not pass through the root. The length of the path between two nodes is represented by the number of edges between them.

### Examples:
1. Input: root = [5,4,5,1,1,null,5], Output = 2  
   - Longest path: 5 → 5 → 5 (2 edges)
   - Path goes through root: left 5, root 5, right 5

2. Input: root = [1,4,5,4,4,null,5], Output = 2  
   - Longest path: 4 → 4 → 4 (2 edges)
   - Through node with value 4

3. Input: root = [1], Output = 0  
   - Single node, no edges

4. Input: root = [1,1,1,1,1,1,1], Output = 4  
   - All nodes have value 1
   - Longest path goes through multiple levels

5. Input: root = [1,2,2,2,2], Output = 2  
   - Values: root=1, children=2, grandchildren=2
   - Longest univalue path in subtree with 2's

### Pseudocode:
```
WHY DFS (POST-ORDER)?
- Similar to diameter problem
- At each node: combine left and right paths if values match
- Track longest path with same value
- Post-order: process children first
- O(n) time, visit each node once

1. Initialize maxLength = 0
2. Helper function calculatePath(node, parentValue):
   - If node is null: return 0
   - leftPath = calculatePath(node.left, node.val)
   - rightPath = calculatePath(node.right, node.val)
   - Update maxLength = max(maxLength, leftPath + rightPath)
   - If node.val == parentValue:
     - Return 1 + max(leftPath, rightPath)
   - Else:
     - Return 0 (break the chain)
3. Call calculatePath(root, null or sentinel value)
4. Return maxLength
```

### C# Solution:
```csharp
public int LongestUnivaluePath(TreeNode root) {
    int maxLength = 0;
    CalculatePath(root, ref maxLength);
    return maxLength;
}

private int CalculatePath(TreeNode node, ref int maxLength) {
    if (node == null) return 0;
    
    int left = CalculatePath(node.left, ref maxLength);
    int right = CalculatePath(node.right, ref maxLength);
    
    int leftPath = 0, rightPath = 0;
    
    // If left child has same value, extend path
    if (node.left != null && node.left.val == node.val) {
        leftPath = left + 1;
    }
    
    // If right child has same value, extend path
    if (node.right != null && node.right.val == node.val) {
        rightPath = right + 1;
    }
    
    // Update max length considering path through this node
    maxLength = Math.Max(maxLength, leftPath + rightPath);
    
    // Return longer path for parent to use
    return Math.Max(leftPath, rightPath);
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(h) for recursion stack where h is tree height.

---

## Clone Graph | LeetCode 133 | Medium
Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list (List[Node]) of its neighbors.

### Examples:
1. Input: adjList = [[2,4],[1,3],[2,4],[1,3]], Output = [[2,4],[1,3],[2,4],[1,3]]  
   - 4 nodes forming a square
   - Node 1 connects to 2,4
   - Node 2 connects to 1,3
   - Clone maintains same structure

2. Input: adjList = [[]], Output = [[]]  
   - Single node with no neighbors

3. Input: adjList = [], Output = []  
   - Empty graph

4. Input: adjList = [[2],[1]], Output = [[2],[1]]  
   - Two nodes connected to each other

5. Input: adjList = [[2,3],[1,3],[1,2]], Output = [[2,3],[1,3],[1,2]]  
   - Triangle graph with 3 nodes

### Pseudocode:
```
WHY DFS WITH HASHMAP?
- Need to create new node instances (deep copy)
- Must avoid infinite loops (graph has cycles)
- HashMap maps original node → cloned node
- DFS traverses graph, creating clones
- O(n + e) time where n=nodes, e=edges

1. If node is null: return null
2. Initialize HashMap: original → clone
3. Create clone of input node
4. Add to HashMap
5. DFS helper function(node, map):
   - If node in map: return map[node]
   - Create clone = new Node(node.val)
   - Add to map: map[node] = clone
   - For each neighbor in node.neighbors:
     - clone.neighbors.add(DFS(neighbor, map))
   - Return clone
6. Return DFS(node, map)
```

### C# Solution:
```csharp
public class Node {
    public int val;
    public IList<Node> neighbors;
    
    public Node() {
        val = 0;
        neighbors = new List<Node>();
    }
    
    public Node(int _val) {
        val = _val;
        neighbors = new List<Node>();
    }
    
    public Node(int _val, List<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}

public Node CloneGraph(Node node) {
    if (node == null) return null;
    
    Dictionary<Node, Node> map = new Dictionary<Node, Node>();
    return DFS(node, map);
}

private Node DFS(Node node, Dictionary<Node, Node> map) {
    if (map.ContainsKey(node)) {
        return map[node];
    }
    
    Node clone = new Node(node.val);
    map[node] = clone;
    
    foreach (Node neighbor in node.neighbors) {
        clone.neighbors.Add(DFS(neighbor, map));
    }
    
    return clone;
}
```

### Complexity

**Time Complexity**: O(n + e) where n is number of nodes and e is number of edges.

**Space Complexity**: O(n) for the HashMap and recursion stack.

---

## Graph Valid Tree | LeetCode 261 | Medium
Given `n` nodes labeled from `0` to `n-1` and a list of undirected edges, check if these edges make up a valid tree. A valid tree must be connected and have no cycles.

### Examples:
1. Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]], Output = true  
   - 5 nodes, 4 edges (tree has n-1 edges)
   - All nodes connected, no cycles
   - Valid tree

2. Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]], Output = false  
   - 5 nodes, 5 edges (one extra edge)
   - Cycle exists: 1 → 2 → 3 → 1
   - Not a valid tree

3. Input: n = 1, edges = [], Output = true  
   - Single node with no edges
   - Valid tree

4. Input: n = 4, edges = [[0,1],[2,3]], Output = false  
   - Two disconnected components
   - Not connected, not a tree

5. Input: n = 3, edges = [[0,1],[0,2]], Output = true  
   - 3 nodes, 2 edges
   - Connected, no cycles

### Pseudocode:
```
WHY DFS WITH VISITED SET?
- Tree properties: n nodes, n-1 edges, connected, acyclic
- First check: edges.length == n-1 (necessary condition)
- DFS to check connectivity and cycles
- Track visited nodes and parent to avoid false cycle detection
- O(n + e) time

1. If edges.length != n-1: return false (wrong number of edges)
2. Build adjacency list from edges
3. Initialize visited set
4. DFS helper(node, parent, visited, graph):
   - Mark node as visited
   - For each neighbor of node:
     - If neighbor == parent: skip (came from here)
     - If neighbor in visited: return false (cycle)
     - If !DFS(neighbor, node, visited, graph): return false
   - Return true
5. If !DFS(0, -1, visited, graph): return false
6. Return visited.size == n (all nodes reachable)
```

### C# Solution:
```csharp
public bool ValidTree(int n, int[][] edges) {
    // Tree must have exactly n-1 edges
    if (edges.Length != n - 1) return false;
    
    // Build adjacency list
    List<int>[] graph = new List<int>[n];
    for (int i = 0; i < n; i++) {
        graph[i] = new List<int>();
    }
    
    foreach (var edge in edges) {
        graph[edge[0]].Add(edge[1]);
        graph[edge[1]].Add(edge[0]);
    }
    
    // DFS to check connectivity
    HashSet<int> visited = new HashSet<int>();
    DFS(0, -1, graph, visited);
    
    // All nodes must be visited (connected)
    return visited.Count == n;
}

private void DFS(int node, int parent, List<int>[] graph, HashSet<int> visited) {
    visited.Add(node);
    
    foreach (int neighbor in graph[node]) {
        if (neighbor == parent) continue;
        if (!visited.Contains(neighbor)) {
            DFS(neighbor, node, graph, visited);
        }
    }
}
```

### Complexity

**Time Complexity**: O(n + e) where n is number of nodes and e is number of edges (e = n-1 for valid tree).

**Space Complexity**: O(n) for adjacency list, visited set, and recursion stack.

---

## Flood Fill | LeetCode 733 | Easy
An image is represented by an `m x n` integer grid `image` where `image[i][j]` represents the pixel value of the image. You are also given three integers `sr`, `sc`, and `color`. You should perform a flood fill on the image starting from the pixel `image[sr][sc]`. Return the modified image after performing the flood fill.

### Examples:
1. Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2, Output = [[2,2,2],[2,2,0],[2,0,1]]  
   - Start at (1,1) with value 1
   - Fill all connected 1's with 2
   - Resulting grid shown

2. Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0, Output = [[0,0,0],[0,0,0]]  
   - Color is same as starting color
   - No change needed

3. Input: image = [[1]], sr = 0, sc = 0, color = 2, Output = [[2]]  
   - Single pixel, change to 2

4. Input: image = [[1,1],[0,0]], sr = 0, sc = 0, color = 2, Output = [[2,2],[0,0]]  
   - Fill connected 1's

5. Input: image = [[0,0,0],[0,1,1]], sr = 1, sc = 1, color = 1, Output = [[0,0,0],[0,1,1]]  
   - Start color equals target color
   - No change

### Pseudocode:
```
WHY DFS?
- Need to fill all connected cells with same color
- DFS explores all reachable cells recursively
- 4-directional connectivity
- Track original color, replace with new color
- Early return if new color == old color
- O(m × n) time

1. Get originalColor = image[sr][sc]
2. If originalColor == color: return image (no change needed)
3. DFS helper(row, col):
   - If out of bounds: return
   - If image[row][col] != originalColor: return
   - Set image[row][col] = color
   - DFS(row+1, col), DFS(row-1, col), DFS(row, col+1), DFS(row, col-1)
4. Call DFS(sr, sc)
5. Return image
```

### C# Solution:
```csharp
public int[][] FloodFill(int[][] image, int sr, int sc, int color) {
    int originalColor = image[sr][sc];
    if (originalColor == color) return image;
    
    DFS(image, sr, sc, originalColor, color);
    return image;
}

private void DFS(int[][] image, int row, int col, int originalColor, int newColor) {
    if (row < 0 || row >= image.Length || col < 0 || col >= image[0].Length) {
        return;
    }
    
    if (image[row][col] != originalColor) {
        return;
    }
    
    image[row][col] = newColor;
    
    // 4-directional DFS
    DFS(image, row + 1, col, originalColor, newColor);
    DFS(image, row - 1, col, originalColor, newColor);
    DFS(image, row, col + 1, originalColor, newColor);
    DFS(image, row, col - 1, originalColor, newColor);
}
```

### Complexity

**Time Complexity**: O(m × n) where m and n are dimensions of the image. Each cell visited at most once.

**Space Complexity**: O(m × n) for recursion stack in worst case (entire grid is same color).

---

## Surrounded Regions | LeetCode 130 | Medium
Given an `m x n` matrix `board` containing `'X'` and `'O'`, capture all regions that are 4-directionally surrounded by `'X'`. A region is captured by flipping all `'O'`s into `'X'`s in that surrounded region.

### Examples:
1. Input: board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]], Output = [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]  
   - Middle O's are surrounded, flip to X
   - Bottom O is on border, stays O

2. Input: board = [["X"]], Output = [["X"]]  
   - Single cell, no change

3. Input: board = [["O","O"],["O","O"]], Output = [["O","O"],["O","O"]]  
   - All O's touch border, none captured

4. Input: board = [["X","X","X"],["X","O","X"],["X","X","X"]], Output = [["X","X","X"],["X","X","X"],["X","X","X"]]  
   - Center O is completely surrounded

5. Input: board = [["O","X","X"],["X","O","X"],["X","X","O"]], Output = [["O","X","X"],["X","X","X"],["X","X","O"]]  
   - Corner O's on border stay O
   - Center O surrounded, becomes X

### Pseudocode:
```
WHY DFS FROM BORDERS?
- O's connected to border cannot be captured
- Instead of finding surrounded regions, find border-connected regions
- Mark all border-connected O's as temporary '#'
- Flip remaining O's to X (these are surrounded)
- Restore '#' back to O
- O(m × n) time

1. If board is empty: return
2. For each cell on border (first/last row/col):
   - If cell is 'O': DFS to mark all connected O's as '#'
3. DFS helper(row, col):
   - If out of bounds or not 'O': return
   - Mark cell as '#'
   - DFS in 4 directions
4. After DFS from all borders:
   - Iterate through entire board:
     - If cell is 'O': change to 'X' (surrounded)
     - If cell is '#': change to 'O' (border-connected)
5. Return board
```

### C# Solution:
```csharp
public void Solve(char[][] board) {
    if (board.Length == 0) return;
    
    int rows = board.Length;
    int cols = board[0].Length;
    
    // Mark border-connected O's
    for (int i = 0; i < rows; i++) {
        if (board[i][0] == 'O') DFS(board, i, 0);
        if (board[i][cols - 1] == 'O') DFS(board, i, cols - 1);
    }
    
    for (int j = 0; j < cols; j++) {
        if (board[0][j] == 'O') DFS(board, 0, j);
        if (board[rows - 1][j] == 'O') DFS(board, rows - 1, j);
    }
    
    // Flip remaining O's to X, restore # to O
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (board[i][j] == 'O') {
                board[i][j] = 'X';
            } else if (board[i][j] == '#') {
                board[i][j] = 'O';
            }
        }
    }
}

private void DFS(char[][] board, int row, int col) {
    if (row < 0 || row >= board.Length || col < 0 || col >= board[0].Length) {
        return;
    }
    
    if (board[row][col] != 'O') return;
    
    board[row][col] = '#';
    
    DFS(board, row + 1, col);
    DFS(board, row - 1, col);
    DFS(board, row, col + 1);
    DFS(board, row, col - 1);
}
```

### Complexity

**Time Complexity**: O(m × n) where m and n are board dimensions. Each cell visited at most twice.

**Space Complexity**: O(m × n) for recursion stack in worst case.

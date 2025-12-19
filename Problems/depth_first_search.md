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

4. Input: heights = [[3,3,3],[3,1,3],[0,2,4]], Output = [[0,0],[0,1],[0,2],[1,0],[1,2],[2,2]]  
   - 3x3 grid with valley in center
   - Center (1,1) with height 1 can only reach via higher cells
   - 6 cells can reach both oceans

5. Input: heights = [[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]], Output = [[0,3],[1,0],[1,1],[1,2],[1,3],[2,0],[2,1],[2,2],[2,3],[3,0]]  
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

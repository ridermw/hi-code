# Breadth First Search Problems

## Breadth First Search Concept

### What is Breadth First Search
Breadth First Search (BFS) is a graph/tree traversal algorithm that explores nodes level by level, visiting all neighbors at the current depth before moving to the next level. It uses a queue data structure to track nodes to visit. BFS guarantees the shortest path in unweighted graphs and is ideal when you need to explore nodes by distance or level.

### Core Operations:
1. **Enqueue**: Add node to queue - O(1)
2. **Dequeue**: Remove and process front node - O(1)
3. **Visit**: Mark node as visited to avoid cycles - O(1)
4. **Traverse**: Overall BFS traversal runs in O(V + E) time across the entire graph

### When to Use BFS
Use BFS when:
1. Need shortest path in unweighted graph
2. Must process nodes level by level (tree level order)
3. Want minimum steps/moves to reach target
4. Need to explore nearest neighbors first
5. Problem asks for "minimum", "shortest", "level" explicitly
6. Graph might be infinite (BFS finds solution faster than DFS)
7. Want to avoid deep recursion (BFS uses queue, not call stack)

### Common BFS Patterns
```
1. Tree Level Order:
   queue.enqueue(root)
   while queue not empty:
       node = queue.dequeue()
       process(node)
       enqueue(node.left)
       enqueue(node.right)
   
2. Grid BFS (Shortest Path):
   queue.enqueue(start)
   visited[start] = true
   while queue not empty:
       current = queue.dequeue()
       for each neighbor in 4 directions:
           if valid and not visited:
               queue.enqueue(neighbor)
               visited[neighbor] = true

3. Multi-Source BFS:
   for each source:
       queue.enqueue(source)
       visited[source] = true
   while queue not empty:
       process level by level
```

### Example:
**Problem:** Find shortest path in maze from start to end

**Why BFS?** Need shortest path (minimum steps). BFS explores all positions at distance 1, then distance 2, etc. First time we reach end is guaranteed shortest path. DFS might find a path but not necessarily shortest. BFS with queue ensures we explore by increasing distance.

**Without BFS:** DFS finds a path but might not be shortest → could be very long
**With BFS:** First path found is shortest → O(rows × cols)

---

## Binary Tree Level Order Traversal | LeetCode 102 | Easy
Given the `root` of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

### Examples:
1. Input: root = [3,9,20,null,null,15,7], Output = [[3],[9,20],[15,7]]  
   - Tree structure:
     ```
         3
        / \
       9  20
         /  \
        15   7
     ```
   - Level 0: [3]
   - Level 1: [9, 20]
   - Level 2: [15, 7]

2. Input: root = [1], Output = [[1]]  
   - Single node tree
   - Level 0: [1]

3. Input: root = [], Output = []  
   - Empty tree
   - No levels

4. Input: root = [1,2,3,4,5,6,7], Output = [[1],[2,3],[4,5,6,7]]  
   - Complete binary tree:
     ```
           1
          / \
         2   3
        / \ / \
       4  5 6  7
     ```
   - Level 0: [1]
   - Level 1: [2, 3]
   - Level 2: [4, 5, 6, 7]

5. Input: root = [1,2,3,4,null,null,5,6,null,null,null,null,7], Output = [[1],[2,3],[4,5],[6,7]]  
   - Unbalanced tree:
     ```
           1
          / \
         2   3
        /     \
       4       5
      /         \
     6           7
     ```
   - Level 0: [1]
   - Level 1: [2, 3]
   - Level 2: [4, 5]
   - Level 3: [6, 7]

### Pseudocode:
```
WHY BFS?
- Need to process nodes level by level (explicit requirement)
- Queue naturally maintains FIFO order for same-level nodes
- Can track level boundaries by processing queue size at each iteration
- DFS would require extra logic to track levels
- O(n) time, visiting each node once

1. If root is null, return empty list
2. Create result list and queue
3. Enqueue root
4. While queue is not empty:
   - Get current level size (number of nodes at this level)
   - Create list for current level
   - For each node in current level (levelSize times):
     Dequeue node
     Add node value to current level list
     Enqueue left child if exists
     Enqueue right child if exists
   - Add current level list to result
5. Return result
```

### C# Solution:
```csharp
public IList<IList<int>> LevelOrder(TreeNode root) {
    List<IList<int>> result = new List<IList<int>>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    
    while (queue.Count > 0) {
        int levelSize = queue.Count;
        List<int> currentLevel = new List<int>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.Dequeue();
            currentLevel.Add(node.val);
            
            if (node.left != null) queue.Enqueue(node.left);
            if (node.right != null) queue.Enqueue(node.right);
        }
        
        result.Add(currentLevel);
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once.

**Space Complexity**: O(w) where w is the maximum width of the tree (maximum nodes at any level). In worst case (complete binary tree), this is O(n/2) = O(n).

## Rotting Oranges | LeetCode 994 | Medium
You are given an `m x n` grid where each cell can have one of three values:
- 0 representing an empty cell
- 1 representing a fresh orange
- 2 representing a rotten orange

Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.

### Examples:
1. Input: grid = [[2,1,1],[1,1,0],[0,1,1]], Output = 4  
   - Initial state:
     ```
     2 1 1
     1 1 0
     0 1 1
     ```
   - Minute 1: Top row spreads
   - Minute 2: Middle spreads
   - Minute 3: Bottom continues
   - Minute 4: All rotten

2. Input: grid = [[2,1,1],[0,1,1],[1,0,1]], Output = -1  
   - Bottom-left orange (1,0) is isolated
   - Cannot be reached by rot
   - Return -1

3. Input: grid = [[0,2]], Output = 0  
   - No fresh oranges to rot
   - Already complete: 0 minutes

4. Input: grid = [[2,1,1,1,1],[1,1,1,1,1],[1,1,2,1,1],[1,1,1,1,1]], Output = 3  
   - 5x4 grid with two rotten oranges at opposite corners
   - Both rot simultaneously spreading outward
   - Multi-source BFS finds minimum time: 3 minutes

5. Input: grid = [[2,2,2,1,1],[2,2,2,1,1],[1,1,1,1,1],[1,1,1,1,2]], Output = 2  
   - Multiple rotten oranges start (top-left cluster and bottom-right)
   - Fresh oranges in middle and right
   - Rot spreads from multiple sources
   - All fresh oranges rotten in 2 minutes

### Pseudocode:
```
WHY MULTI-SOURCE BFS?
- Need minimum time (BFS guarantees shortest path/time)
- Multiple starting points (all rotten oranges rot simultaneously)
- Add all rotten oranges to queue initially
- Each BFS level represents one minute
- Track fresh orange count to detect impossible cases
- O(m*n) time, each cell processed once

1. Count fresh oranges and add all rotten oranges to queue
2. If no fresh oranges, return 0
3. Initialize minutes = 0
4. While queue not empty and fresh > 0:
   - Get level size (oranges rotting at this minute)
   - For each orange in current level:
     Dequeue position
     For each 4-direction neighbor:
       If neighbor is fresh (value 1):
         Mark as rotten (change to 2)
         Decrement fresh count
         Enqueue neighbor
   - Increment minutes
5. If fresh > 0: return -1 (impossible)
6. Return minutes
```

### C# Solution:
```csharp
public int OrangesRotting(int[][] grid) {
    int rows = grid.Length;
    int cols = grid[0].Length;
    Queue<(int, int)> queue = new Queue<(int, int)>();
    int fresh = 0;
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == 2) {
                queue.Enqueue((i, j));
            } else if (grid[i][j] == 1) {
                fresh++;
            }
        }
    }
    
    if (fresh == 0) return 0;
    
    int minutes = 0;
    int[][] directions = { new int[] {0,1}, new int[] {1,0}, new int[] {0,-1}, new int[] {-1,0} };
    
    while (queue.Count > 0 && fresh > 0) {
        int size = queue.Count;
        
        for (int i = 0; i < size; i++) {
            var (r, c) = queue.Dequeue();
            
            foreach (var dir in directions) {
                int newR = r + dir[0];
                int newC = c + dir[1];
                
                if (newR >= 0 && newR < rows && newC >= 0 && newC < cols && grid[newR][newC] == 1) {
                    grid[newR][newC] = 2;
                    fresh--;
                    queue.Enqueue((newR, newC));
                }
            }
        }
        
        minutes++;
    }
    
    return fresh == 0 ? minutes : -1;
}
```

### Complexity

**Time Complexity**: O(m × n) where m is number of rows and n is number of columns. Each cell is visited at most once.

**Space Complexity**: O(m × n) for the queue in worst case when all cells are rotten.

## 01 Matrix | LeetCode 542 | Medium
Given an `m x n` binary matrix `mat`, return the distance of the nearest 0 for each cell. The distance between two adjacent cells is 1.

### Examples:
1. Input: mat = [[0,0,0],[0,1,0],[0,0,0]], Output = [[0,0,0],[0,1,0],[0,0,0]]  
   - 3x3 grid with single 1 in center
   - Center cell has distance 1 to any adjacent 0
   - All 0s remain 0

2. Input: mat = [[0,0,0],[0,1,0],[1,1,1]], Output = [[0,0,0],[0,1,0],[1,2,1]]  
   - Bottom-right has distance 2 from nearest 0
   - Bottom-left and bottom-center have distance 1

3. Input: mat = [[0]], Output = [[0]]  
   - Single 0, distance is 0

4. Input: mat = [[1,1,1],[1,1,1],[1,1,0]], Output = [[4,3,2],[3,2,1],[2,1,0]]  
   - 3x3 grid with single 0 at bottom-right
   - Distances increase as we move away
   - Top-left has distance 4 (Manhattan distance)

5. Input: mat = [[0,1,1,1,0],[1,1,1,1,1],[1,1,1,1,1],[1,1,1,1,1],[0,1,1,1,0]], Output = [[0,1,2,1,0],[1,2,2,2,1],[2,2,3,2,2],[1,2,2,2,1],[0,1,2,1,0]]  
   - 5x5 grid with 0s at four corners
   - Multi-source BFS from all four corners
   - Center (2,2) has distance 3 (farthest from any 0)
   - Symmetric pattern radiating from corners

### Pseudocode:
```
WHY MULTI-SOURCE BFS?
- Need shortest distance from each 1 to nearest 0
- Could do BFS from each 1 → O(m*n * m*n) too slow
- Better: BFS from all 0s simultaneously
- Add all 0s to queue initially, they have distance 0
- Process level by level: distance 1, then 2, then 3, etc.
- Each 1 gets minimum distance when first reached
- O(m*n) time, each cell processed once

1. Create result matrix initialized with large values
2. Add all 0 positions to queue with distance 0
3. While queue not empty:
   - Dequeue position and current distance
   - For each 4-direction neighbor:
     If result[neighbor] > current distance + 1:
       Update result[neighbor] = current distance + 1
       Enqueue neighbor with new distance
4. Return result matrix
```

### C# Solution:
```csharp
public int[][] UpdateMatrix(int[][] mat) {
    int rows = mat.Length;
    int cols = mat[0].Length;
    int[][] result = new int[rows][];
    Queue<(int, int)> queue = new Queue<(int, int)>();
    
    for (int i = 0; i < rows; i++) {
        result[i] = new int[cols];
        for (int j = 0; j < cols; j++) {
            if (mat[i][j] == 0) {
                result[i][j] = 0;
                queue.Enqueue((i, j));
            } else {
                result[i][j] = int.MaxValue;
            }
        }
    }
    
    int[][] directions = { new int[] {0,1}, new int[] {1,0}, new int[] {0,-1}, new int[] {-1,0} };
    
    while (queue.Count > 0) {
        var (r, c) = queue.Dequeue();
        
        foreach (var dir in directions) {
            int newR = r + dir[0];
            int newC = c + dir[1];
            
            if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
                if (result[newR][newC] > result[r][c] + 1) {
                    result[newR][newC] = result[r][c] + 1;
                    queue.Enqueue((newR, newC));
                }
            }
        }
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(m × n) where m is number of rows and n is number of columns. Each cell is processed at most once.

**Space Complexity**: O(m × n) for the queue and result matrix.

## Bus Routes | LeetCode 815 | Hard
You are given an array `routes` representing bus routes where `routes[i]` is a bus route that the ith bus repeats forever. You will start at the bus stop `source` (not on any bus initially), and you want to go to the bus stop `target`. Return the least number of buses you must take to travel from `source` to `target`. Return -1 if it is not possible.

### Examples:
1. Input: routes = [[1,2,7],[3,6,7]], source = 1, target = 6, Output = 2  
   - Bus 0: stops at [1, 2, 7]
   - Bus 1: stops at [3, 6, 7]
   - Start at stop 1 (on bus 0) → transfer at stop 7 → take bus 1 to stop 6
   - Total: 2 buses

2. Input: routes = [[7,12],[4,5,15],[6],[15,19],[9,12,13]], source = 15, target = 12, Output = -1  
   - Bus 0: [7, 12]
   - Bus 1: [4, 5, 15]
   - Bus 2: [6]
   - Bus 3: [15, 19]
   - Bus 4: [9, 12, 13]
   - Start at 15 (bus 1 or 3), but cannot reach 12
   - No connection between buses containing 15 and buses containing 12
   - Return -1

3. Input: routes = [[1,2,3],[4,5,6]], source = 1, target = 6, Output = -1  
   - Two separate bus routes with no common stops
   - Cannot transfer between buses
   - Impossible to reach

4. Input: routes = [[1,2,3,4,5],[2,3,4],[3,4,5,6]], source = 1, target = 6, Output = 2  
   - Bus 0: [1, 2, 3, 4, 5]
   - Bus 1: [2, 3, 4]
   - Bus 2: [3, 4, 5, 6]
   - Start at 1 (bus 0) → transfer at 3, 4, or 5 → take bus 2 to 6
   - 2 buses needed

5. Input: routes = [[1,2,3,4,5,6,7],[8,9,10,11,12],[1,8,13,14],[5,12,15,16,17]], source = 1, target = 17, Output = 2  
   - Bus 0: [1, 2, 3, 4, 5, 6, 7]
   - Bus 1: [8, 9, 10, 11, 12]
   - Bus 2: [1, 8, 13, 14]
   - Bus 3: [5, 12, 15, 16, 17]
    - Minimal path: start on bus 0 at stop 1 → ride to stop 5 → transfer to bus 3 → ride to stop 17
    - Alternative path via bus 2 then bus 1 then bus 3 would take 3 buses
    - Minimum buses needed: 2

### Pseudocode:
```
WHY BFS ON BUSES?
- Need minimum number of buses (not stops)
- Graph: nodes are buses, edges connect buses sharing stops
- BFS finds shortest path = minimum transfers
- Start from all buses containing source stop
- Each BFS level = one more bus taken
- Track visited buses (not stops) to avoid cycles
- O(N * S) where N = buses, S = stops per bus

1. Build map: stop → list of buses serving that stop
2. If source == target: return 0
3. Add all buses containing source to queue
4. Mark these buses as visited
5. Initialize busCount = 1
6. While queue not empty:
   - Get level size (buses at current transfer count)
   - For each bus in current level:
     Dequeue bus
     For each stop in this bus:
       If stop == target: return busCount
       For each connecting bus at this stop:
         If not visited:
           Mark visited
           Enqueue connecting bus
   - Increment busCount
7. Return -1 (target not reachable)
```

### C# Solution:
```csharp
public int NumBusesToDestination(int[][] routes, int source, int target) {
    if (source == target) return 0;
    
    Dictionary<int, List<int>> stopToBuses = new Dictionary<int, List<int>>();
    
    for (int i = 0; i < routes.Length; i++) {
        foreach (int stop in routes[i]) {
            if (!stopToBuses.ContainsKey(stop)) {
                stopToBuses[stop] = new List<int>();
            }
            stopToBuses[stop].Add(i);
        }
    }
    
    if (!stopToBuses.ContainsKey(source) || !stopToBuses.ContainsKey(target)) {
        return -1;
    }
    
    Queue<int> queue = new Queue<int>();
    HashSet<int> visitedBuses = new HashSet<int>();
    
    foreach (int bus in stopToBuses[source]) {
        queue.Enqueue(bus);
        visitedBuses.Add(bus);
    }
    
    int busCount = 1;
    
    while (queue.Count > 0) {
        int size = queue.Count;
        
        for (int i = 0; i < size; i++) {
            int bus = queue.Dequeue();
            
            foreach (int stop in routes[bus]) {
                if (stop == target) return busCount;
                
                if (stopToBuses.ContainsKey(stop)) {
                    foreach (int nextBus in stopToBuses[stop]) {
                        if (!visitedBuses.Contains(nextBus)) {
                            visitedBuses.Add(nextBus);
                            queue.Enqueue(nextBus);
                        }
                    }
                }
            }
        }
        
        busCount++;
    }
    
    return -1;
}
```

### Complexity

**Time Complexity**: O(n × s) where n is the number of bus routes and s is the average number of stops per route. Each bus is processed once, and for each bus we check all its stops.

**Space Complexity**: O(n × s) for the stop-to-buses map and visited set.

---

## Binary Tree Right Side View | LeetCode 199 | Medium
Given the `root` of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.

### Examples:
1. Input: root = [1,2,3,null,5,null,4], Output = [1,3,4]  
   - Level 0: see node 1 (rightmost)
   - Level 1: see node 3 (rightmost between 2 and 3)
   - Level 2: see node 4 (rightmost between 5 and 4)
   - From right side: [1, 3, 4]

2. Input: root = [1,null,3], Output = [1,3]  
   - Level 0: see node 1
   - Level 1: see node 3 (only node)
   - From right side: [1, 3]

3. Input: root = [], Output = []  
   - Empty tree
   - No nodes visible

4. Input: root = [1,2,3,4], Output = [1,3,4]  
   - Level 0: node 1
   - Level 1: node 3 (rightmost)
   - Level 2: node 4 (only node at this level)

5. Input: root = [1,2,3,4,5,6,7,8], Output = [1,3,7,8]  
   - Perfect binary tree structure
   - Rightmost at each level: 1, 3, 7, 8

### Pseudocode:
```
WHY BFS (LEVEL ORDER)?
- Need rightmost node at each level
- BFS processes tree level by level
- Last node in each level = rightmost visible node
- Track level boundaries using queue size
- O(n) time to visit all nodes once

1. If root is null, return empty list
2. Initialize queue with root
3. Initialize result list
4. While queue not empty:
   - Get level size (number of nodes at current level)
   - For i from 0 to level size - 1:
     - Dequeue node
     - If i == level size - 1: add node.val to result (rightmost)
     - Enqueue left child if exists
     - Enqueue right child if exists
5. Return result
```

### C# Solution:
```csharp
public IList<int> RightSideView(TreeNode root) {
    List<int> result = new List<int>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    
    while (queue.Count > 0) {
        int levelSize = queue.Count;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.Dequeue();
            
            // Last node in this level is rightmost
            if (i == levelSize - 1) {
                result.Add(node.val);
            }
            
            if (node.left != null) queue.Enqueue(node.left);
            if (node.right != null) queue.Enqueue(node.right);
        }
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(w) where w is the maximum width of the tree (queue size at any level).

---

## Binary Tree Zigzag Level Order Traversal | LeetCode 103 | Medium
Given the `root` of a binary tree, return the zigzag level order traversal of its nodes' values. (i.e., from left to right, then right to left for the next level and alternate between).

### Examples:
1. Input: root = [3,9,20,null,null,15,7], Output = [[3],[20,9],[15,7]]  
   - Level 0: [3] (left to right)
   - Level 1: [20,9] (right to left - reversed from [9,20])
   - Level 2: [15,7] (left to right)

2. Input: root = [1], Output = [[1]]  
   - Single node
   - Level 0: [1]

3. Input: root = [], Output = []  
   - Empty tree
   - No levels

4. Input: root = [1,2,3,4,null,null,5], Output = [[1],[3,2],[4,5]]  
   - Level 0: [1] (left to right)
   - Level 1: [3,2] (right to left)
   - Level 2: [4,5] (left to right)

5. Input: root = [1,2,3,4,5,6,7], Output = [[1],[3,2],[4,5,6,7]]  
   - Perfect binary tree
   - Alternating direction each level
   - Level 2 has 4 nodes in left-to-right order

### Pseudocode:
```
WHY BFS WITH DIRECTION FLAG?
- Need level-order traversal (BFS)
- Alternate direction at each level
- Use flag to track left-to-right vs right-to-left
- Reverse list when going right-to-left
- O(n) time, visit each node once

1. If root is null, return empty list
2. Initialize queue with root
3. Initialize result list, leftToRight = true
4. While queue not empty:
   - Get level size
   - Initialize current level list
   - For each node in level:
     - Dequeue node
     - Add node.val to current level
     - Enqueue left and right children
   - If not leftToRight: reverse current level
   - Add current level to result
   - Toggle leftToRight flag
5. Return result
```

### C# Solution:
```csharp
public IList<IList<int>> ZigzagLevelOrder(TreeNode root) {
    List<IList<int>> result = new List<IList<int>>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new Queue<TreeNode>();
    queue.Enqueue(root);
    bool leftToRight = true;
    
    while (queue.Count > 0) {
        int levelSize = queue.Count;
        List<int> currentLevel = new List<int>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.Dequeue();
            currentLevel.Add(node.val);
            
            if (node.left != null) queue.Enqueue(node.left);
            if (node.right != null) queue.Enqueue(node.right);
        }
        
        if (!leftToRight) {
            currentLevel.Reverse();
        }
        
        result.Add(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(w) where w is the maximum width of the tree.

---

## Maximum Width of Binary Tree | LeetCode 662 | Medium
Given the `root` of a binary tree, return the maximum width of the given tree. The maximum width of a tree is the maximum width among all levels. The width of one level is defined as the length between the end-nodes (the leftmost and rightmost non-null nodes), where the null nodes between the end-nodes are also counted into the length calculation.

### Examples:
1. Input: root = [1,3,2,5,3,null,9], Output = 4  
   - Level 0: [1] (width = 1)
   - Level 1: [3,2] (width = 2)
   - Level 2: [5,3,null,9] (width = 4, including null between 3 and 9)
   - Maximum width = 4

2. Input: root = [1,3,null,5,3], Output = 2  
   - Level 0: [1] (width = 1)
   - Level 1: [3] (width = 1)
   - Level 2: [5,3] (width = 2)
   - Maximum width = 2

3. Input: root = [1,3,2,5], Output = 2  
   - Level 0: width 1
   - Level 1: width 2
   - Level 2: width 1
   - Maximum = 2

4. Input: root = [1,3,2,5,null,null,9,6,null,null,7], Output = 8  
   - Large width at deeper levels
   - Count includes null nodes between leftmost and rightmost

5. Input: root = [1], Output = 1  
   - Single node
   - Width = 1

### Pseudocode:
```
WHY BFS WITH INDEX TRACKING?
- Need to track position of each node as if tree were complete
- In complete binary tree: left child at 2*i, right child at 2*i+1
- Width = rightmost_index - leftmost_index + 1
- BFS processes level by level
- Track index for each node to calculate width
- O(n) time, visit each node once

1. If root is null, return 0
2. Initialize queue with (root, index=0)
3. Initialize maxWidth = 0
4. While queue not empty:
   - Get level size
   - Get leftmost index in level
   - For each node in level:
     - Dequeue (node, index)
     - Update rightmost index
     - Enqueue left child with index 2*index
     - Enqueue right child with index 2*index+1
   - Calculate width = rightmost - leftmost + 1
   - Update maxWidth
5. Return maxWidth
```

### C# Solution:
```csharp
public int WidthOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    
    Queue<(TreeNode node, int index)> queue = new Queue<(TreeNode, int)>();
    queue.Enqueue((root, 0));
    int maxWidth = 0;
    
    while (queue.Count > 0) {
        int levelSize = queue.Count;
        int leftmost = queue.Peek().index;
        int rightmost = leftmost;
        
        for (int i = 0; i < levelSize; i++) {
            var (node, index) = queue.Dequeue();
            rightmost = index;
            
            if (node.left != null) {
                queue.Enqueue((node.left, 2 * index));
            }
            if (node.right != null) {
                queue.Enqueue((node.right, 2 * index + 1));
            }
        }
        
        maxWidth = Math.Max(maxWidth, rightmost - leftmost + 1);
    }
    
    return maxWidth;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of nodes. Each node is visited once.

**Space Complexity**: O(w) where w is the maximum width of the tree.

---

## Minimum Knight Moves | LeetCode 1197 | Medium
In an infinite chess board with coordinates from -infinity to +infinity, you have a knight at square [0, 0]. A knight has 8 possible moves it can make. Return the minimum number of steps needed to move the knight to the square [x, y]. It is guaranteed the answer exists.

### Examples:
1. Input: x = 2, y = 1, Output = 1  
   - One knight move: (0,0) → (2,1)
   - Direct L-shape move

2. Input: x = 5, y = 5, Output = 4  
   - (0,0) → (2,1) → (4,2) → (3,4) → (5,5)
   - Or: (0,0) → (1,2) → (3,3) → (5,4) → (5,5)
   - Minimum 4 moves

3. Input: x = 0, y = 0, Output = 0  
   - Already at destination
   - 0 moves

4. Input: x = 1, y = 1, Output = 2  
   - (0,0) → (2,1) → (1,1) or (0,0) → (1,2) → (1,1)
   - Cannot reach (1,1) in one move
   - Minimum 2 moves

5. Input: x = 5, y = 1, Output = 4  
   - One optimal path: (0,0) → (2,1) → (4,2) → (6,3) → (5,1)
   - Cannot reach (5,1) in 2 moves
   - Minimum moves required: 4

### Pseudocode:
```
WHY BFS?
- Need shortest path = minimum moves
- BFS guarantees shortest path in unweighted graph
- Each position is a node, knight moves are edges
- 8 possible directions from any position
- Use visited set to avoid revisiting positions
- O(x*y) in practical cases, BFS explores necessary positions

1. If x == 0 and y == 0: return 0
2. Initialize 8 knight move directions: [(2,1), (1,2), (-1,2), (-2,1), (-2,-1), (-1,-2), (1,-2), (2,-1)]
3. Initialize queue with (0, 0)
4. Initialize visited set with (0, 0)
5. Initialize moves = 0
6. While queue not empty:
   - Get level size
   - For each position in level:
     - Dequeue (row, col)
     - If row == x and col == y: return moves
     - For each direction:
       - Calculate new position (newRow, newCol)
       - Optimization: use abs(newRow) + abs(newCol) bounds to limit search
       - If not visited:
         - Mark visited
         - Enqueue new position
   - Increment moves
7. Return moves
```

### C# Solution:
```csharp
public int MinKnightMoves(int x, int y) {
    // Work in positive quadrant due to symmetry
    x = Math.Abs(x);
    y = Math.Abs(y);
    
    int[][] directions = new int[][] {
        new int[] {2, 1}, new int[] {1, 2}, new int[] {-1, 2}, new int[] {-2, 1},
        new int[] {-2, -1}, new int[] {-1, -2}, new int[] {1, -2}, new int[] {2, -1}
    };
    
    Queue<(int, int)> queue = new Queue<(int, int)>();
    HashSet<(int, int)> visited = new HashSet<(int, int)>();
    
    queue.Enqueue((0, 0));
    visited.Add((0, 0));
    int moves = 0;
    
    while (queue.Count > 0) {
        int size = queue.Count;
        
        for (int i = 0; i < size; i++) {
            var (row, col) = queue.Dequeue();
            
            if (row == x && col == y) return moves;
            
            foreach (var dir in directions) {
                int newRow = row + dir[0];
                int newCol = col + dir[1];
                
                // Optimization: limit search space
                if (!visited.Contains((newRow, newCol)) && newRow >= -2 && newCol >= -2) {
                    visited.Add((newRow, newCol));
                    queue.Enqueue((newRow, newCol));
                }
            }
        }
        
        moves++;
    }
    
    return moves;
}
```

### Complexity

**Time Complexity**: O(max(|x|, |y|)²) - BFS explores positions within the target area.

**Space Complexity**: O(max(|x|, |y|)²) for the visited set and queue.

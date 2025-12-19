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

5. Input: routes = [[1,2,3,4,5,6,7],[8,9,10,11,12],[1,8,13,14],[5,12,15,16,17]], source = 1, target = 17, Output = 3  
   - Bus 0: [1, 2, 3, 4, 5, 6, 7]
   - Bus 1: [8, 9, 10, 11, 12]
   - Bus 2: [1, 8, 13, 14]
   - Bus 3: [5, 12, 15, 16, 17]
   - Path: Start at 1 (bus 0) → transfer at 5 (bus 3) ... wait, need to check
   - Better path: Start at 1 (bus 0 or 2) → via bus 0 to stop 5 → transfer to bus 3 → stop 12 → get to 17
   - Actually: bus 0 (stop 1 to 5) → bus 3 (stop 5 to 17) = 2 buses
   - Or: bus 2 (1 to 8) → bus 1 (8 to 12) → bus 3 (12 to 17) = 3 buses
   - Minimum is 2 buses

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

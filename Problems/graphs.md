# Graph Problems

## Graph Concept

### What is a Graph?
A graph is a data structure consisting of nodes (vertices) connected by edges. Graphs can be directed (edges have direction) or undirected, weighted or unweighted, cyclic or acyclic (DAG - Directed Acyclic Graph). Common representations include adjacency lists (map of node to neighbors) and adjacency matrices.

### Core Operations:
- **Add Edge**: Connect two vertices - O(1)
- **DFS/BFS Traversal**: Visit all reachable nodes - O(V + E)
- **Cycle Detection**: Check if graph contains cycles - O(V + E)
- **Topological Sort**: Linear ordering of DAG vertices - O(V + E)
- **Shortest Path**: Find minimum path (Dijkstra, BFS) - O(E log V) or O(V + E)

### When to Use Graphs?
Use graphs when:
- Modeling relationships between entities (social networks, dependencies)
- Need to find paths, cycles, or connectivity
- Problem involves prerequisites or ordering constraints
- Must detect dependencies or circular dependencies
- Finding shortest paths or minimum spanning trees
- Problems with "courses", "tasks", "dependencies", "prerequisites"
- Network flow or matching problems

### Common Graph Patterns:
```
1. Topological Sort (Course Schedule):
   Calculate in-degrees for all nodes
   Add nodes with 0 in-degree to queue
   Process queue: for each node, reduce neighbors' in-degrees
   If processed count == total nodes: valid ordering exists
   
2. Cycle Detection (DFS):
   Track node states: unvisited, visiting, visited
   DFS: mark as visiting, recurse on neighbors
   If neighbor is "visiting": cycle found
   Mark as visited after processing
   
3. Connected Components:
   For each unvisited node:
       Run DFS/BFS to mark entire component
       Increment component count
```

### Example:
**Problem:** Can you finish all courses given prerequisites?

**Why Graphs?** Courses and prerequisites form a directed graph. Course A → Course B means "A must be taken before B". If graph has a cycle, you can't finish (circular dependency). Use topological sort or cycle detection to determine if valid ordering exists. DFS with state tracking detects cycles in O(V + E) time.

**Without Graphs:** Tracking dependencies manually is complex and error-prone
**With Graphs:** Build adjacency list, run cycle detection → O(V + E)

---

## Course Schedule | LeetCode 207 | Medium
There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return `true` if you can finish all courses. Otherwise, return `false`.

### Examples:
1. Input: numCourses = 2, prerequisites = [[1,0]], Output = true  
   - 2 courses: 0 and 1
   - Must take 0 before 1
   - Valid order: [0, 1]
   - No cycles

2. Input: numCourses = 2, prerequisites = [[1,0],[0,1]], Output = false  
   - Course 1 requires 0
   - Course 0 requires 1
   - Circular dependency: 0 → 1 → 0
   - Impossible

3. Input: numCourses = 5, prerequisites = [[1,4],[2,4],[3,1],[3,2]], Output = true  
   - 5 courses: 0, 1, 2, 3, 4
   - Dependencies: 1→4, 2→4, 3→1, 3→2
   - Valid order: [0, 4, 1, 2, 3] or [4, 0, 1, 2, 3]
   - No cycles

4. Input: numCourses = 3, prerequisites = [], Output = true  
   - No prerequisites
   - Any order works
   - No cycles (no edges)

5. Input: numCourses = 7, prerequisites = [[1,0],[2,0],[3,1],[3,2],[4,3],[5,3],[6,4],[6,5]], Output = true  
   - 7 courses with complex dependencies
   - 0 has no prereqs
   - 1 and 2 depend on 0
   - 3 depends on 1 and 2
   - 4 and 5 depend on 3
   - 6 depends on 4 and 5
   - Valid DAG, valid order: [0,1,2,3,4,5,6]

### Pseudocode:
```
WHY TOPOLOGICAL SORT?
- Prerequisites form directed graph: edge a→b means "take a before b"
- Cycle = circular dependency = impossible to finish
- Topological sort only exists for DAGs (acyclic graphs)
- Use in-degree counting: process nodes with no prerequisites first
- If can process all nodes → no cycle → possible
- O(V + E) time using BFS (Kahn's algorithm)

1. Build adjacency list: graph[course] = list of courses that depend on it
2. Calculate in-degree for each course (number of prerequisites)
3. Add all courses with in-degree 0 to queue
4. Initialize count = 0
5. While queue not empty:
   - Dequeue course
   - Increment count
   - For each neighbor (courses depending on this course):
     Decrement neighbor's in-degree
     If in-degree becomes 0: enqueue neighbor
6. Return count == numCourses
```

### C# Solution:
```csharp
public bool CanFinish(int numCourses, int[][] prerequisites) {
    List<int>[] graph = new List<int>[numCourses];
    int[] inDegree = new int[numCourses];
    
    for (int i = 0; i < numCourses; i++) {
        graph[i] = new List<int>();
    }
    
    foreach (var prereq in prerequisites) {
        graph[prereq[1]].Add(prereq[0]);
        inDegree[prereq[0]]++;
    }
    
    Queue<int> queue = new Queue<int>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.Enqueue(i);
    }
    
    int count = 0;
    while (queue.Count > 0) {
        int course = queue.Dequeue();
        count++;
        
        foreach (int neighbor in graph[course]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                queue.Enqueue(neighbor);
            }
        }
    }
    
    return count == numCourses;
}
```

### Complexity

**Time Complexity**: O(v + e) where v is number of courses and e is number of prerequisites. We process each node and edge once.

**Space Complexity**: O(v + e) for the adjacency list and in-degree array.

## Course Schedule II | LeetCode 210 | Medium
There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return the ordering of courses you should take to finish all courses. If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.

### Examples:
1. Input: numCourses = 2, prerequisites = [[1,0]], Output = [0,1]  
   - Must take 0 before 1
   - Valid order: [0,1]

2. Input: numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]], Output = [0,1,2,3] or [0,2,1,3]  
   - 0 has no prereqs (start here)
   - 1 and 2 depend on 0 (can take in either order)
   - 3 depends on 1 and 2 (must be last)
   - Multiple valid orderings

3. Input: numCourses = 1, prerequisites = [], Output = [0]  
   - Single course, no dependencies

4. Input: numCourses = 3, prerequisites = [[0,1],[0,2],[1,2]], Output = [2,1,0]  
   - 2 has no prereqs
   - 1 depends on 2
   - 0 depends on 1 and 2
   - Valid order: [2,1,0]

5. Input: numCourses = 6, prerequisites = [[1,0],[2,1],[3,2],[4,3],[5,4]], Output = [0,1,2,3,4,5]  
   - Linear dependency chain
   - Only one valid topological order
   - Must start at 0, end at 5

### Pseudocode:
```
WHY TOPOLOGICAL SORT?
- Same as Course Schedule I but need actual ordering
- Topological sort gives valid ordering of DAG nodes
- Use Kahn's algorithm: process nodes with 0 in-degree
- Order of processing is valid topological order
- If cycle exists: can't process all nodes → return empty
- O(V + E) time

1. Build adjacency list and calculate in-degrees
2. Add all courses with in-degree 0 to queue
3. Initialize result list
4. While queue not empty:
   - Dequeue course and add to result
   - For each neighbor:
     Decrement in-degree
     If in-degree becomes 0: enqueue
5. If result size == numCourses: return result
6. Else: return empty array (cycle detected)
```

### C# Solution:
```csharp
public int[] FindOrder(int numCourses, int[][] prerequisites) {
    List<int>[] graph = new List<int>[numCourses];
    int[] inDegree = new int[numCourses];
    
    for (int i = 0; i < numCourses; i++) {
        graph[i] = new List<int>();
    }
    
    foreach (var prereq in prerequisites) {
        graph[prereq[1]].Add(prereq[0]);
        inDegree[prereq[0]]++;
    }
    
    Queue<int> queue = new Queue<int>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.Enqueue(i);
    }
    
    List<int> result = new List<int>();
    
    while (queue.Count > 0) {
        int course = queue.Dequeue();
        result.Add(course);
        
        foreach (int neighbor in graph[course]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                queue.Enqueue(neighbor);
            }
        }
    }
    
    return result.Count == numCourses ? result.ToArray() : new int[0];
}
```

### Complexity

**Time Complexity**: O(v + e) where v is number of courses and e is number of prerequisites.

**Space Complexity**: O(v + e) for the adjacency list, in-degree array, and result list.

## Alien Dictionary | LeetCode 269 | Hard
There is a new alien language that uses the English alphabet. However, the order among the letters is unknown to you. You are given a list of strings `words` from the alien language's dictionary, where the strings in `words` are sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order by the new language's rules. If there is no solution, return `""`. If there are multiple solutions, return any of them.

### Examples:
1. Input: words = ["wrt","wrf","er","ett","rftt"], Output = "wertf"  
   - Compare "wrt" vs "wrf": t comes before f
   - Compare "wrf" vs "er": w comes before e
   - Compare "er" vs "ett": r comes before t
   - Compare "ett" vs "rftt": e comes before r
   - Valid order: w → e → r → t → f

2. Input: words = ["z","x"], Output = "zx"  
   - z comes before x
   - Simple two-letter ordering

3. Input: words = ["z","x","z"], Output = ""  
   - Contradiction: z before x, but also z after x
   - Invalid input, return ""

4. Input: words = ["abc","ab"], Output = ""  
   - "abc" before "ab" violates dictionary rules
   - First word is prefix of second but comes before
   - Invalid, return ""

5. Input: words = ["baa","abcd","abca","cab","cad"], Output = "bdac"  
   - Compare "baa" vs "abcd": b before a
   - Compare "abcd" vs "abca": d before a
   - Compare "cab" vs "cad": b before d
   - Build graph: b→a, d→a, b→d, a→c
   - Topological order: b → d → a → c

### Pseudocode:
```
WHY TOPOLOGICAL SORT ON CHARACTERS?
- Lexicographic order defines character precedence
- Compare adjacent words: first differing character defines edge
- Build directed graph of character dependencies
- Topological sort gives valid character ordering
- Detect cycles (contradictions) and invalid cases
- O(C) where C is total characters in all words

1. Build graph: compare adjacent words
   - For each pair of adjacent words:
     Find first differing character
     Add edge: char1 → char2
     Handle invalid case: word1 is prefix of word2 but comes after
2. Calculate in-degrees for all characters
3. Topological sort using BFS (Kahn's algorithm)
4. If cycle detected or can't process all chars: return ""
5. Return topological order as string
```

### C# Solution:
```csharp
public string AlienOrder(string[] words) {
    Dictionary<char, HashSet<char>> graph = new Dictionary<char, HashSet<char>>();
    Dictionary<char, int> inDegree = new Dictionary<char, int>();
    
    foreach (string word in words) {
        foreach (char c in word) {
            if (!graph.ContainsKey(c)) {
                graph[c] = new HashSet<char>();
                inDegree[c] = 0;
            }
        }
    }
    
    for (int i = 0; i < words.Length - 1; i++) {
        string word1 = words[i];
        string word2 = words[i + 1];
        int minLen = Math.Min(word1.Length, word2.Length);
        
        if (word1.Length > word2.Length && word1.StartsWith(word2)) {
            return "";
        }
        
        for (int j = 0; j < minLen; j++) {
            if (word1[j] != word2[j]) {
                if (!graph[word1[j]].Contains(word2[j])) {
                    graph[word1[j]].Add(word2[j]);
                    inDegree[word2[j]]++;
                }
                break;
            }
        }
    }
    
    Queue<char> queue = new Queue<char>();
    foreach (var kvp in inDegree) {
        if (kvp.Value == 0) queue.Enqueue(kvp.Key);
    }
    
    StringBuilder result = new StringBuilder();
    
    while (queue.Count > 0) {
        char c = queue.Dequeue();
        result.Append(c);
        
        foreach (char neighbor in graph[c]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                queue.Enqueue(neighbor);
            }
        }
    }
    
    return result.Length == graph.Count ? result.ToString() : "";
}
```

### Complexity

**Time Complexity**: O(c) where c is the total number of characters in all words. We process each character once.

**Space Complexity**: O(1) or O(26) since there are at most 26 lowercase English letters, regardless of input size.

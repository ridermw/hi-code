# Backtracking Problems

## Backtracking Concept

### What is Backtracking?
Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, and removing solutions that fail to satisfy the constraints at any point (time-saving through pruning). It's essentially a depth-first search with the ability to abandon a path as soon as it determines that path cannot lead to a valid solution.

### Core Operations:
- **Choose**: Make a choice and add it to the current solution - O(1)
- **Explore**: Recursively explore the consequences of that choice - O(branches)
- **Unchoose**: Remove the choice (backtrack) if it doesn't lead to solution - O(1)
- **Check Constraints**: Validate if current path is still valid - O(1) to O(n)

### When to Use Backtracking?
Use backtracking when:
- Need to find all (or some) solutions to a problem
- Must explore all possible configurations or combinations
- Problem involves making a sequence of decisions
- Can prune invalid paths early (constraint satisfaction)
- Looking for permutations, combinations, or subsets
- Problem asks for "all possible", "generate all", or "find all valid"
- Need to satisfy multiple constraints simultaneously
- Brute force is too slow but pruning can help

### Common Backtracking Patterns:
```
1. Subsets/Combinations:
   function backtrack(start, current):
       add current to result
       for i from start to n:
           add nums[i] to current
           backtrack(i+1, current)
           remove nums[i] from current
   
2. Permutations:
   function backtrack(current, remaining):
       if remaining is empty: add current to result
       for each element in remaining:
           add element to current
           backtrack(current, remaining without element)
           remove element from current

3. Constraint Satisfaction (Sudoku, N-Queens):
   function backtrack(position):
       if position is end: return true
       for each possible value:
           if value is valid:
               place value
               if backtrack(next position): return true
               remove value (backtrack)
       return false
```

### Example:
**Problem:** Generate all subsets of a set [1,2,3]

**Why Backtracking?** Need all possible combinations (2^n total). At each element, we have 2 choices: include it or exclude it. Backtracking explores both branches: include element, recurse, then backtrack and exclude element, recurse. This builds a decision tree where each leaf is a valid subset.

**Without Backtracking:** Iteratively generating all combinations is complex and less intuitive
**With Backtracking:** Natural recursive exploration of decision tree → O(2^n × n)

---

## Subsets | LeetCode 78 | Medium
Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.

**Note:** If `nums` can contain duplicates, sort first and skip equal neighbors when iterating to avoid duplicate subsets.

### Examples:
1. Input: nums = [1,2,3], Output = [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]  
   - Empty set: []
   - Single elements: [1], [2], [3]
   - Pairs: [1,2], [1,3], [2,3]
   - All three: [1,2,3]
   - Total: 2^3 = 8 subsets

2. Input: nums = [0], Output = [[],[0]]  
   - Empty set and single element
   - Total: 2^1 = 2 subsets

3. Input: nums = [1,2], Output = [[],[1],[2],[1,2]]  
   - Four subsets for two elements
   - Total: 2^2 = 4 subsets

4. Input: nums = [1,2,3,4], Output = [[],[1],[2],[3],[4],[1,2],[1,3],[1,4],[2,3],[2,4],[3,4],[1,2,3],[1,2,4],[1,3,4],[2,3,4],[1,2,3,4]]  
   - 16 total subsets (2^4)
   - All combinations from size 0 to size 4
   - Order doesn't matter but all must be present

5. Input: nums = [5,1,6,3,9], Output = (32 subsets total, 2^5)  
   - Examples: [], [5], [1], [5,1], [5,1,6], [5,1,6,3], [5,1,6,3,9]
   - Also: [1,6], [3,9], [5,6,9], [1,3,9], etc.
   - All 32 combinations from empty to all 5 elements

### Pseudocode:
```
WHY BACKTRACKING?
- Need all possible subsets (2^n combinations)
- At each position: decide to include or exclude element
- Backtracking explores both branches of decision tree
- Add current subset at each step (all partial subsets are valid)
- Start index prevents duplicates ([1,2] same as [2,1])
- Time: O(2^n × n) for generating and copying all subsets

1. Initialize result list
2. Backtrack function(start, current subset):
   - Add copy of current subset to result
   - For i from start to end of nums:
     Add nums[i] to current subset
     Recursively call backtrack(i+1, current subset)
     Remove nums[i] from current subset (backtrack)
3. Call backtrack(0, empty list)
4. Return result
```

### C# Solution:
```csharp
public IList<IList<int>> Subsets(int[] nums) {
    List<IList<int>> result = new List<IList<int>>();
    Backtrack(nums, 0, new List<int>(), result);
    return result;
}

private void Backtrack(int[] nums, int start, List<int> current, List<IList<int>> result) {
    result.Add(new List<int>(current));
    
    for (int i = start; i < nums.Length; i++) {
        current.Add(nums[i]);
        Backtrack(nums, i + 1, current, result);
        current.RemoveAt(current.Count - 1);
    }
}
```

### Complexity

**Time Complexity**: O(2^n × n) where n is the length of nums. We generate 2^n subsets, and each subset takes O(n) time to copy.

**Space Complexity**: O(n) for the recursion call stack depth. Output space not counted.

## Generate Parentheses | LeetCode 22 | Medium
Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.

### Examples:
1. Input: n = 3, Output = ["((()))","(()())","(())()","()(())","()()()"]  
   - 3 pairs: 6 characters total (3 open, 3 close)
   - 5 valid combinations (Catalan number C_3 = 5)
   - All must be balanced and well-formed

2. Input: n = 1, Output = ["()"]  
   - Single pair: only one valid combination
   - C_1 = 1

3. Input: n = 2, Output = ["(())","()()"]  
   - 2 pairs: 4 characters
   - 2 valid combinations (C_2 = 2)
   - (()) is nested, ()() is sequential

4. Input: n = 4, Output = ["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"]  
   - 4 pairs: 8 characters
   - 14 valid combinations (C_4 = 14)
   - Mix of nested and sequential patterns

5. Input: n = 5, Output = (42 valid combinations, C_5 = 42)  
   - Examples: "((((()))))", "(((()())))", "((()()()))", "(()()()())", etc.
   - All must maintain balance: at any point, # of close ≤ # of open

### Pseudocode:
```
WHY BACKTRACKING?
- Need all valid combinations (Catalan number: exponential)
- Can't just generate all 2^(2n) strings and filter (too slow)
- Backtracking with constraints: only add '(' if count < n, only add ')' if close < open
- Prune invalid paths early (when close would exceed open)
- Build string incrementally, backtrack when can't add more
- Time: O(4^n / sqrt(n)) bounded by Catalan numbers

1. Backtrack function(current string, open count, close count):
   - If current length == 2n: add to result, return
   - If open < n: 
     Add '(' to current
     Recursively call backtrack(current + '(', open+1, close)
   - If close < open:
     Add ')' to current
     Recursively call backtrack(current + ')', open, close+1)
2. Call backtrack("", 0, 0)
3. Return result
```

### C# Solution:
```csharp
public IList<string> GenerateParenthesis(int n) {
    List<string> result = new List<string>();
    Backtrack(result, "", 0, 0, n);
    return result;
}

private void Backtrack(List<string> result, string current, int open, int close, int max) {
    if (current.Length == max * 2) {
        result.Add(current);
        return;
    }
    
    if (open < max) {
        Backtrack(result, current + "(", open + 1, close, max);
    }
    
    if (close < open) {
        Backtrack(result, current + ")", open, close + 1, max);
    }
}
```

### Complexity

**Time Complexity**: O(4^n / √n) which is the nth Catalan number. Each valid sequence is generated once.

**Space Complexity**: O(n) for the recursion call stack depth.

## Combination Sum | LeetCode 39 | Medium
Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`. You may return the combinations in any order. The same number may be chosen from `candidates` an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.

### Examples:
1. Input: candidates = [2,3,6,7], target = 7, Output = [[2,2,3],[7]]  
   - 2+2+3 = 7
   - 7 = 7
   - Two valid combinations

2. Input: candidates = [2,3,5], target = 8, Output = [[2,2,2,2],[2,3,3],[3,5]]  
   - 2+2+2+2 = 8
   - 2+3+3 = 8
   - 3+5 = 8
   - Three combinations

3. Input: candidates = [2], target = 1, Output = []  
   - Cannot sum to 1 with only 2
   - No valid combinations

4. Input: candidates = [1,2,3], target = 6, Output = [[1,1,1,1,1,1],[1,1,1,1,2],[1,1,1,3],[1,1,2,2],[1,2,3],[2,2,2]]  
   - Multiple ways to sum to 6
   - Can reuse numbers unlimited times
   - [1,1,1,1,1,1], [2,2,2], [1,2,3], etc.

5. Input: candidates = [2,3,4,5,6,7], target = 10, Output = [[2,2,2,2,2],[2,2,3,3],[2,2,6],[2,3,5],[2,4,4],[3,3,4],[3,7],[4,6],[5,5]]  
   - Many combinations sum to 10
   - Various lengths from 2 elements ([3,7]) to 5 elements ([2,2,2,2,2])
   - Total: 9 unique combinations

### Pseudocode:
```
WHY BACKTRACKING?
- Need all valid combinations (unknown number of solutions)
- Can reuse elements: allows multiple recursive calls with same index
- Must avoid duplicates: use start index, don't look backwards
- Prune when sum exceeds target (optimization)
- Each path explores one combination possibility
- Time: O(2^target) worst case (many small numbers)

1. Sort candidates (optional, helps with pruning)
2. Backtrack function(start, current list, remaining target):
   - If remaining == 0: add copy of current to result, return
   - If remaining < 0: return (pruning)
   - For i from start to end of candidates:
     If candidates[i] > remaining: break (pruning)
     Add candidates[i] to current
     Recursively call backtrack(i, current, remaining - candidates[i])
       Note: pass i (not i+1) to allow reuse
     Remove candidates[i] from current (backtrack)
3. Call backtrack(0, empty list, target)
4. Return result
```

### C# Solution:
```csharp
public IList<IList<int>> CombinationSum(int[] candidates, int target) {
    List<IList<int>> result = new List<IList<int>>();
    Array.Sort(candidates);
    Backtrack(candidates, target, 0, new List<int>(), result);
    return result;
}

private void Backtrack(int[] candidates, int target, int start, List<int> current, List<IList<int>> result) {
    if (target == 0) {
        result.Add(new List<int>(current));
        return;
    }
    
    for (int i = start; i < candidates.Length; i++) {
        if (candidates[i] > target) break;
        
        current.Add(candidates[i]);
        Backtrack(candidates, target - candidates[i], i, current, result);
        current.RemoveAt(current.Count - 1);
    }
}
```

### Complexity

**Time Complexity**: O(2^t) where t is the target value. In worst case with many small numbers, we explore exponential combinations.

**Space Complexity**: O(t) for the recursion depth in worst case (using all 1s to sum to target).

## Word Search | LeetCode 79 | Medium
Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

### Examples:
1. Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED", Output = true  
   - 4x3 grid
   - Path: A(0,0) → B(0,1) → C(0,2) → C(1,2) → E(2,2) → D(2,1)
   - Valid path exists

2. Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE", Output = true  
   - Path: S(1,0) → E(2,0) → E(2,1) or other valid paths
   - Word found

3. Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB", Output = false  
   - Would need to reuse B at (0,1)
   - Cannot reuse cells
   - No valid path

4. Input: board = [["A"]], word = "A", Output = true  
   - Single cell matches single character
   - Trivial case

5. Input: board = [["A","B","C","D"],["E","F","G","H"],["I","J","K","L"],["M","N","O","P"]], word = "ABFGK", Output = true  
   - 4x4 grid
   - Valid path: A(0,0) → B(0,1) → F(1,1) → G(1,2) → K(2,2)
   - Moves are horizontal or vertical only
   - Each cell is used at most once

### Pseudocode:
```
WHY BACKTRACKING?
- Need to explore all possible paths from starting positions
- At each cell, try 4 directions, backtrack if path doesn't work
- Must track visited cells to avoid reuse
- Prune early when character doesn't match
- Start from every cell that matches first character
- Time: O(m*n * 4^L) where L is word length

0. If word is empty: return true; if board is empty: return false
1. For each cell (i, j) in board:
    - If board[i][j] == word[0]:
       If DFS(i, j, 0) returns true: return true
2. DFS function(row, col, index):
   - If index == word length: return true (found complete word)
   - If out of bounds or visited or board[row][col] != word[index]: return false
   - Mark cell as visited (change character or use visited array)
   - For each 4 directions:
     If DFS(newRow, newCol, index+1): return true
   - Unmark cell as visited (backtrack)
   - Return false
3. Return false if no starting position succeeds
```

### C# Solution:
```csharp
public bool Exist(char[][] board, string word) {
   if (string.IsNullOrEmpty(word)) return true;
   if (board == null || board.Length == 0 || board[0].Length == 0) return false;
    int rows = board.Length;
    int cols = board[0].Length;
    
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (board[i][j] == word[0]) {
                if (DFS(board, word, i, j, 0)) return true;
            }
        }
    }
    
    return false;
}

private bool DFS(char[][] board, string word, int i, int j, int index) {
    if (index == word.Length) return true;
    
    if (i < 0 || i >= board.Length || j < 0 || j >= board[0].Length || 
        board[i][j] != word[index]) {
        return false;
    }
    
    char temp = board[i][j];
    board[i][j] = '#';
    
    bool found = DFS(board, word, i + 1, j, index + 1) ||
                 DFS(board, word, i - 1, j, index + 1) ||
                 DFS(board, word, i, j + 1, index + 1) ||
                 DFS(board, word, i, j - 1, index + 1);
    
    board[i][j] = temp;
    
    return found;
}
```

### Complexity

**Time Complexity**: O(m × n × 4^l) where m and n are dimensions of board and l is length of word. We try starting from each cell, and explore 4 directions at each step (with pruning).

**Space Complexity**: O(l) for the recursion call stack depth equal to word length.

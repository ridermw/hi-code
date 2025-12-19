# Dynamic Programming Problems

## Dynamic Programming Concept

### What is Dynamic Programming?
Dynamic Programming (DP) is an optimization technique that solves complex problems by breaking them down into simpler subproblems, solving each subproblem once, and storing the results to avoid redundant computation. DP applies to problems with optimal substructure (optimal solution contains optimal solutions to subproblems) and overlapping subproblems.

### Core Operations:
- **Memoization** (Top-Down): Store results of recursive calls - O(1) lookup
- **Tabulation** (Bottom-Up): Build solution iteratively from base cases - O(1) per state
- **State Transition**: Compute current state from previous states - O(1) to O(n)
- **Optimization**: Choose best option among multiple choices - O(k) for k options

### When to Use Dynamic Programming?
Use DP when:
- Problem asks for optimal value (min/max/count)
- Can break problem into similar subproblems
- Subproblems overlap (same computation repeated)
- Problem has optimal substructure
- Keywords: "maximum", "minimum", "longest", "shortest", "count ways"
- Decisions at each step affect future decisions
- Brute force recursion times out due to repeated work

### Common DP Patterns:
```
1. 1D DP (Fibonacci, House Robber):
   dp[i] = optimal solution using first i elements
   dp[i] = function(dp[i-1], dp[i-2], ...)
   
2. 2D DP (Knapsack, LCS):
   dp[i][j] = optimal solution using first i items with constraint j
   dp[i][j] = function(dp[i-1][j], dp[i][j-1], dp[i-1][j-1], ...)
   
3. String DP (Palindrome, Edit Distance):
   dp[i][j] = solution for substring from i to j
   Consider matching endpoints or breaking into substrings
```

### Example:
**Problem:** Fibonacci sequence F(n) = F(n-1) + F(n-2)

**Why DP?** Naive recursion computes F(3) multiple times when calculating F(5). Without memoization: O(2^n) - exponential. With DP: store F(i) after first computation, reuse for F(i+1), F(i+2), etc. Time becomes O(n), space O(n) or O(1) with optimization.

**Without DP:** Recursive calls recompute same values → O(2^n)
**With DP:** Store and reuse computed values → O(n)

---

## Climbing Stairs / Counting Bits | LeetCode 338 | Easy
Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1's in the binary representation of `i`.

### Examples:
1. Input: n = 2, Output = [0,1,1]  
   - 0 = 0b0 → 0 ones
   - 1 = 0b1 → 1 one
   - 2 = 0b10 → 1 one

2. Input: n = 5, Output = [0,1,1,2,1,2]  
   - 0 = 0b0 → 0
   - 1 = 0b1 → 1
   - 2 = 0b10 → 1
   - 3 = 0b11 → 2
   - 4 = 0b100 → 1
   - 5 = 0b101 → 2

3. Input: n = 10, Output = [0,1,1,2,1,2,2,3,1,2,2]  
   - 10 = 0b1010 → 2 ones
   - Pattern emerges based on previous values

4. Input: n = 15, Output = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4]  
   - 15 = 0b1111 → 4 ones
   - Powers of 2 have exactly 1 one

5. Input: n = 20, Output = [0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,1,2,2,3,2]  
   - 20 = 0b10100 → 2 ones
   - Relationship: count[i] = count[i >> 1] + (i & 1)

### Pseudocode:
```
WHY DP?
- Brute force: count bits for each number → O(n log n)
- DP observation: count[i] relates to count[i/2]
- When we right shift i by 1: removes rightmost bit
- count[i] = count[i >> 1] + (i & 1)
- i >> 1 removes last bit, i & 1 checks if last bit is 1
- O(n) time, O(n) space

1. Initialize dp array of size n+1
2. dp[0] = 0 (base case: 0 has no 1-bits)
3. For i from 1 to n:
   - dp[i] = dp[i >> 1] + (i & 1)
   - Right shift i by 1 and add 1 if i is odd
4. Return dp array
```

### C# Solution:
```csharp
public int[] CountBits(int n) {
    int[] dp = new int[n + 1];
    
    for (int i = 1; i <= n; i++) {
        dp[i] = dp[i >> 1] + (i & 1);
    }
    
    return dp;
}
```

### Complexity

**Time Complexity**: O(n) since we compute each value once.

**Space Complexity**: O(n) for the dp array (required for output).

## Coin Change / Unique Paths | LeetCode 62 | Medium
There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (0, 0). The robot tries to move to the bottom-right corner (m-1, n-1). The robot can only move either down or right at any point in time. Given the two integers `m` and `n`, return the number of possible unique paths the robot can take to reach the bottom-right corner.

### Examples:
1. Input: m = 3, n = 7, Output = 28  
   - 3 rows, 7 columns
   - Must make 2 moves down and 6 moves right
   - 28 unique orderings

2. Input: m = 3, n = 2, Output = 3  
   - Paths: Down-Down-Right, Down-Right-Down, Right-Down-Down
   - 3 unique paths

3. Input: m = 1, n = 1, Output = 1  
   - Already at destination
   - 1 path (no movement)

4. Input: m = 4, n = 4, Output = 20  
   - 4x4 grid
   - Need 3 down + 3 right moves
   - 20 unique paths

5. Input: m = 10, n = 10, Output = 48620  
   - Large grid: 10x10
   - Need 9 down + 9 right moves
   - Combinatorial explosion: C(18, 9) = 48620 paths

### Pseudocode:
```
WHY DP?
- Recursive: paths(i,j) = paths(i-1,j) + paths(i,j-1)
- Overlapping subproblems: paths(2,2) computed multiple times
- DP: store results in table, compute each cell once
- Base case: first row and column all have 1 path (straight line)
- O(m*n) time and space

1. Create dp table of size m x n
2. Initialize first row: dp[0][j] = 1 for all j
3. Initialize first column: dp[i][0] = 1 for all i
4. For i from 1 to m-1:
   - For j from 1 to n-1:
     dp[i][j] = dp[i-1][j] + dp[i][j-1]
5. Return dp[m-1][n-1]
```

### C# Solution:
```csharp
public int UniquePaths(int m, int n) {
    int[][] dp = new int[m][];
    
    for (int i = 0; i < m; i++) {
        dp[i] = new int[n];
        dp[i][0] = 1;
    }
    
    for (int j = 0; j < n; j++) {
        dp[0][j] = 1;
    }
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    
    return dp[m - 1][n - 1];
}
```

### Complexity

**Time Complexity**: O(m × n) as we fill each cell once.

**Space Complexity**: O(m × n) for the dp table. Can be optimized to O(n) using 1D array.

## Longest Increasing Subsequence | LeetCode 300 | Medium
Given an integer array `nums`, return the length of the longest strictly increasing subsequence.

### Examples:
1. Input: nums = [10,9,2,5,3,7,101,18], Output = 4  
   - LIS: [2,3,7,101] or [2,3,7,18] or [2,5,7,101]
   - Length 4

2. Input: nums = [0,1,0,3,2,3], Output = 4  
   - LIS: [0,1,2,3]
   - Length 4

3. Input: nums = [7,7,7,7,7,7,7], Output = 1  
   - All same value (not strictly increasing)
   - Length 1

4. Input: nums = [1,3,6,7,9,4,10,5,6], Output = 6  
   - LIS: [1,3,4,5,6,9] or [1,3,6,7,9,10]
   - Actually [1,3,6,7,9,10] = 6

5. Input: nums = [3,5,6,2,5,4,19,5,6,7,12], Output = 6  
   - Multiple LIS exist
   - Example: [3,5,6,7,12,19] = 6? Let me check: [3,5,6,19] = 4
   - Actually: [2,4,5,6,7,12] = 6 or [2,5,6,7,12,19] = 6

### Pseudocode:
```
WHY DP?
- Need optimal subsequence (not subarray - elements need not be contiguous)
- dp[i] = length of LIS ending at index i
- For each i: check all j < i where nums[j] < nums[i]
- dp[i] = max(dp[j]) + 1 for all valid j
- Answer = max(dp[i]) for all i
- O(n²) time, O(n) space (binary search gives O(n log n))

1. Initialize dp array: dp[i] = 1 for all i
2. For i from 1 to n-1:
   - For j from 0 to i-1:
     If nums[j] < nums[i]:
       dp[i] = max(dp[i], dp[j] + 1)
3. Return max value in dp array
```

### C# Solution:
```csharp
public int LengthOfLIS(int[] nums) {
    if (nums.Length == 0) return 0;
    
    int[] dp = new int[nums.Length];
    Array.Fill(dp, 1);
    int maxLen = 1;
    
    for (int i = 1; i < nums.Length; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.Max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.Max(maxLen, dp[i]);
    }
    
    return maxLen;
}
```

### Complexity

**Time Complexity**: O(n²) with nested loops. Can be optimized to O(n log n) with binary search approach.

**Space Complexity**: O(n) for the dp array.

## Word Break | LeetCode 139 | Medium
Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.

### Examples:
1. Input: s = "leetcode", wordDict = ["leet","code"], Output = true  
   - "leetcode" = "leet" + "code"
   - Both words in dictionary

2. Input: s = "applepenapple", wordDict = ["apple","pen"], Output = true  
   - "applepenapple" = "apple" + "pen" + "apple"
   - Can reuse "apple"

3. Input: s = "catsandog", wordDict = ["cats","dog","sand","and","cat"], Output = false  
   - Cannot segment into valid words
   - "catsandog" has no valid breakdown

4. Input: s = "aaaaaaa", wordDict = ["aaaa","aaa"], Output = true  
   - "aaaaaaa" = "aaaa" + "aaa"
   - Or "aaa" + "aaaa"

5. Input: s = "cars", wordDict = ["car","ca","rs"], Output = true  
   - "cars" = "car" + "s"? No, "s" not in dict
   - "cars" = "ca" + "rs"? Yes!

### Pseudocode:
```
WHY DP?
- Recursive: try every possible split point
- Overlapping subproblems: same substring checked multiple times
- dp[i] = true if s[0..i) can be segmented
- For each position i: check if any word ends at i and remaining is valid
- O(n² × m) time where m is max word length

1. Convert wordDict to set for O(1) lookup
2. Initialize dp array: dp[0] = true (empty string)
3. For i from 1 to n:
   - For j from 0 to i:
     If dp[j] == true AND s[j..i) in wordDict:
       dp[i] = true
       break
4. Return dp[n]
```

### C# Solution:
```csharp
public bool WordBreak(string s, IList<string> wordDict) {
    HashSet<string> wordSet = new HashSet<string>(wordDict);
    bool[] dp = new bool[s.Length + 1];
    dp[0] = true;
    
    for (int i = 1; i <= s.Length; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && wordSet.Contains(s.Substring(j, i - j))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[s.Length];
}
```

### Complexity

**Time Complexity**: O(n² × m) where n is length of string and m is average word length (for substring operation).

**Space Complexity**: O(n) for the dp array plus O(k) for the set where k is number of words.

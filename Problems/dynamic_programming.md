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

## Counting Bits | LeetCode 338 | Easy
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
   - LIS: [1,3,6,7,9,10] (length 6)

5. Input: nums = [3,5,6,2,5,4,19,5,6,7,12], Output = 6  
   - Multiple LIS exist
   - Example: [2,4,5,6,7,12] (length 6)

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

---

## Decode Ways | LeetCode 91 | Medium
A message containing letters from A-Z can be encoded into numbers using the following mapping: 'A' -> "1", 'B' -> "2", ..., 'Z' -> "26". To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above. Given a string `s` containing only digits, return the number of ways to decode it.

### Examples:
1. Input: s = "12", Output = 2  
   - "12" can be decoded as "AB" (1 2) or "L" (12)
   - Two ways

2. Input: s = "226", Output = 3  
   - "2 2 6" → "BBF"
   - "22 6" → "VF"
   - "2 26" → "BZ"
   - Three ways

3. Input: s = "06", Output = 0  
   - "0" cannot be mapped (invalid)
   - "06" cannot be mapped (leading zero)
   - Zero ways

4. Input: s = "11106", Output = 2  
   - "1 1 10 6" → "AAJF"
   - "11 10 6" → "KJF"
   - "1 1 1 06" → invalid (06 has leading zero)
   - "11 1 06" → invalid
   - Two ways

5. Input: s = "10", Output = 1  
   - "10" → "J"
   - "1 0" → invalid (0 cannot be mapped alone)
   - One way

### Pseudocode:
```
WHY DP?
- Subproblem: ways(i) = ways to decode s[i..n]
- Recurrence: ways(i) = ways(i+1) if s[i] valid + ways(i+2) if s[i:i+2] valid
- Overlapping subproblems (ways(i) used multiple times)
- Bottom-up: dp[i] = ways to decode s[0..i]
- O(n) time, O(n) space (can optimize to O(1))

1. If s is empty or starts with '0': return 0
2. Initialize dp array of size n+1
3. dp[0] = 1 (empty string: one way)
4. dp[1] = 1 if s[0] != '0', else 0
5. For i from 2 to n:
   - ways = 0
   - If s[i-1] != '0': ways += dp[i-1] (single digit decode)
   - twoDigit = s[i-2:i] as integer
   - If 10 <= twoDigit <= 26: ways += dp[i-2] (two digit decode)
   - dp[i] = ways
6. Return dp[n]
```

### C# Solution:
```csharp
public int NumDecodings(string s) {
    if (string.IsNullOrEmpty(s) || s[0] == '0') return 0;
    
    int n = s.Length;
    int[] dp = new int[n + 1];
    dp[0] = 1; // Empty string
    dp[1] = 1; // First character (already checked not '0')
    
    for (int i = 2; i <= n; i++) {
        // Single digit decode
        if (s[i - 1] != '0') {
            dp[i] += dp[i - 1];
        }
        
        // Two digit decode
        int twoDigit = int.Parse(s.Substring(i - 2, 2));
        if (twoDigit >= 10 && twoDigit <= 26) {
            dp[i] += dp[i - 2];
        }
    }
    
    return dp[n];
}
```

### Complexity

**Time Complexity**: O(n) where n is the length of string. Single pass through string.

**Space Complexity**: O(n) for dp array. Can be optimized to O(1) by tracking only last two values.

---

## Maximal Square | LeetCode 221 | Medium
Given an `m x n` binary matrix filled with 0's and 1's, find the largest square containing only 1's and return its area.

### Examples:
1. Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], Output = 4  
   - Largest square is 2×2 (area = 4)
   - Located at rows 1-2, cols 2-3
   - All cells are '1'

2. Input: matrix = [["0","1"],["1","0"]], Output = 1  
   - No 2×2 square of 1's
   - Largest is 1×1 (area = 1)

3. Input: matrix = [["0"]], Output = 0  
   - Single cell is '0'
   - No square of 1's

4. Input: matrix = [["1","1"],["1","1"]], Output = 4  
   - Entire 2×2 matrix is a square
   - Area = 4

5. Input: matrix = [["1","1","1"],["1","1","1"],["0","1","1"]], Output = 4  
   - Largest square is 2×2 at top-right or center-right
   - Area = 4

### Pseudocode:
```
WHY DP?
- Subproblem: dp[i][j] = side length of largest square ending at (i,j)
- Recurrence: if matrix[i][j] == '1':
    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
- This ensures square property (all sides equal)
- Track maximum side length seen
- O(m × n) time and space

1. Initialize dp matrix of size (m+1) × (n+1) with zeros
2. Initialize maxSide = 0
3. For i from 1 to m:
   - For j from 1 to n:
     - If matrix[i-1][j-1] == '1':
       - dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
       - maxSide = max(maxSide, dp[i][j])
4. Return maxSide × maxSide
```

### C# Solution:
```csharp
public int MaximalSquare(char[][] matrix) {
    if (matrix.Length == 0) return 0;
    
    int rows = matrix.Length;
    int cols = matrix[0].Length;
    int[,] dp = new int[rows + 1, cols + 1];
    int maxSide = 0;
    
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= cols; j++) {
            if (matrix[i - 1][j - 1] == '1') {
                dp[i, j] = Math.Min(Math.Min(dp[i - 1, j], dp[i, j - 1]), dp[i - 1, j - 1]) + 1;
                maxSide = Math.Max(maxSide, dp[i, j]);
            }
        }
    }
    
    return maxSide * maxSide;
}
```

### Complexity

**Time Complexity**: O(m × n) where m and n are matrix dimensions.

**Space Complexity**: O(m × n) for dp matrix. Can be optimized to O(n) with rolling array.

---

## Maximum Profit in Job Scheduling | LeetCode 1235 | Hard
We have `n` jobs, where every job is scheduled to be done from `startTime[i]` to `endTime[i]`, obtaining a profit of `profit[i]`. You're given the `startTime`, `endTime` and `profit` arrays, return the maximum profit you can take such that there are no two jobs in the subset with overlapping time range.

### Examples:
1. Input: startTime = [1,2,3,3], endTime = [3,4,5,6], profit = [50,10,40,70], Output = 120  
   - Take jobs at indices 0 and 3: time [1,3] and [3,6], profit = 50 + 70 = 120
   - Jobs don't overlap (3 is end of first, start of second)

2. Input: startTime = [1,2,3,4,6], endTime = [3,5,10,6,9], profit = [20,20,100,70,60], Output = 150  
   - Take jobs at indices 1 and 4: [2,5] and [6,9], profit = 20 + 60 = 80
   - Or take jobs 0 and 4: [1,3] and [6,9], profit = 20 + 60 = 80
   - Best: Take job 2 alone [3,10] = 100, or job 0 [1,3] + job 4 [6,9] = 80
   - Actually best is job 0 [1,3] + job 3 [4,6] + job 4 [6,9] = 20 + 70 + 60 = 150

3. Input: startTime = [1,1,1], endTime = [2,3,4], profit = [5,6,4], Output = 6  
   - All jobs start at time 1, can only pick one
   - Maximum profit is 6

4. Input: startTime = [1,2,3,4], endTime = [2,3,4,5], profit = [10,10,10,10], Output = 40  
   - All jobs are non-overlapping sequential
   - Take all: 10 + 10 + 10 + 10 = 40

5. Input: startTime = [6,15,7,11,1,3,16,2], endTime = [19,18,19,16,10,8,19,8], profit = [2,9,1,19,5,7,3,19], Output = 41  
   - Complex scheduling problem
   - Optimal selection maximizes profit

### Pseudocode:
```
WHY DP WITH BINARY SEARCH?
- Similar to weighted job scheduling
- Sort jobs by end time
- For each job: choose to take it or skip it
- If take: profit[i] + dp[last_compatible_job]
- Use binary search to find last compatible job (ends before current starts)
- O(n log n) time

1. Create array of (start, end, profit) tuples
2. Sort by end time
3. Initialize dp array where dp[i] = max profit using jobs 0..i
4. dp[0] = profit[0]
5. For i from 1 to n-1:
   - profitWithCurrent = profit[i]
   - Use binary search to find last job j where endTime[j] <= startTime[i]
   - If found: profitWithCurrent += dp[j]
   - dp[i] = max(dp[i-1], profitWithCurrent)
6. Return dp[n-1]
```

### C# Solution:
```csharp
public int JobScheduling(int[] startTime, int[] endTime, int[] profit) {
    int n = startTime.Length;
    var jobs = new List<(int start, int end, int profit)>();
    
    for (int i = 0; i < n; i++) {
        jobs.Add((startTime[i], endTime[i], profit[i]));
    }
    
    // Sort by end time
    jobs.Sort((a, b) => a.end.CompareTo(b.end));
    
    int[] dp = new int[n];
    dp[0] = jobs[0].profit;
    
    for (int i = 1; i < n; i++) {
        // Option 1: Skip current job
        int profitWithoutCurrent = dp[i - 1];
        
        // Option 2: Take current job
        int profitWithCurrent = jobs[i].profit;
        
        // Binary search for last compatible job
        int lastCompatible = FindLastCompatible(jobs, i);
        if (lastCompatible != -1) {
            profitWithCurrent += dp[lastCompatible];
        }
        
        dp[i] = Math.Max(profitWithoutCurrent, profitWithCurrent);
    }
    
    return dp[n - 1];
}

private int FindLastCompatible(List<(int start, int end, int profit)> jobs, int currentIndex) {
    int left = 0, right = currentIndex - 1;
    int result = -1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (jobs[mid].end <= jobs[currentIndex].start) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n log n) for sorting and n binary searches.

**Space Complexity**: O(n) for the dp array and jobs list.

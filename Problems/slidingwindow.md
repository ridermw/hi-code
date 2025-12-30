# Sliding Window Problems

## Sliding Window Concept

### What is Sliding Window?
The sliding window technique is an optimization method that transforms nested loops into a single loop by maintaining a "window" that slides across the data structure (usually an array or string). Instead of recalculating from scratch for each position, we incrementally update the window by adding new elements on one end and removing elements from the other.

### When to Use Sliding Window?
Use this technique when:
- You need to find a contiguous subarray/substring that satisfies certain conditions
- The problem asks for min/max length, sum, or count of subarrays
- Recalculating the answer from scratch for each position would be inefficient
- The window boundaries can be determined by a valid/invalid condition

### Generic Pattern:
```
Initialize window boundaries (left, right)
Initialize window state (sum, set, map, etc.)

For right from 0 to array length - 1:
    Expand: Add element at right to window state
    
    While window is invalid:
        Shrink: Remove element at left from window state
        Move left boundary forward
    
    Update result based on current valid window
```

### Example:
**Problem:** Find max sum of subarray with sum ≤ target

**Why Sliding Window?** Instead of checking all O(n²) subarrays, we maintain one window and adjust it based on whether sum ≤ target. As we slide right, if sum > target, we shrink from left. This reduces time to O(n).

**Without Sliding Window:** Check every subarray [i...j], recalculate sum each time → O(n²) or O(n³)
**With Sliding Window:** Maintain running sum, add/remove elements as window slides → O(n)

---

## 1. [Medium] Longest Substring Without Repeating Characters (LeetCode #3)

### Description:
Find the length of the longest substring that contains no repeating characters. This problem requires maintaining a window of unique characters and expanding/shrinking it as needed.

### Examples:
1. Input: "abcabcbb" → Output: 3 (substring "abc")
   - The first three characters "abc" are unique
   - When we encounter 'a' again, we must shrink the window from the left
   - Continue until "abc" becomes "bca", "cab", etc.
2. Input: "bbbbb" → Output: 1 (substring "b")
   - All characters are the same, so maximum length is 1
3. Input: "pwwkew" → Output: 3 (substring "wke")
   - The substring "wke" has no repeating characters and is longest
   - The window slides to maintain uniqueness
4. Input: "abba" → Output: 2 ("ab" or "ba")
5. Input: "tmmzuxt" → Output: 5 ("mzuxt")

### Pseudocode:
```
WHY SLIDING WINDOW?
- Checking all O(n²) substrings and validating each would be O(n³)
- Instead, maintain a window of unique characters
- When duplicate found, shrink window from left until unique again
- This ensures we check each character at most twice (once in, once out) → O(n)

Initialize left = 0, maxLength = 0, charMap (HashSet)
For right from 0 to string length - 1:
    // Expand window by adding right character
    While character at right exists in charMap:
        Remove character at left from charMap  // Shrink window
        Increment left pointer
    
    Add character at right to charMap
    Update maxLength = max(maxLength, right - left + 1)
```

### C# Solution:
```csharp
public int LengthOfLongestSubstring(string s) {
    HashSet<char> charSet = new HashSet<char>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.Length; right++) {
        // Shrink window until no duplicate
        while (charSet.Contains(s[right])) {
            charSet.Remove(s[left]);
            left++;
        }
        
        // Add current character
        charSet.Add(s[right]);
        
        // Update maximum length
        maxLength = Math.Max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

- **Time Complexity**: O(n) where n is the length of the string. Each character is added once and removed at most once.
- **Space Complexity**: O(min(n, c)) where c is the character set size (26 for lowercase English letters). Worst case O(n) if all characters are unique.

---

## 2. [Medium] Longest Repeating Character Replacement (LeetCode #424)

### Description:
Given a string and integer k, find the length of the longest substring that can be made with at most k replacements. The approach uses sliding window to maintain a valid window where we can make all characters the same with at most k changes.

### Examples:
1. Input: s = "ABAB", k = 2 → Output: 4 (substring "AAAA" or "BBBB")
   - We can replace 2 characters to make all same
   - Window size 4: "ABAB" → can become "AAAA" or "BBBB"
2. Input: s = "AABABBA", k = 1 → Output: 4 (substring "AABA" or "BABB")
   - We can make at most one replacement
   - Optimal solution is window of size 4 where we replace one character
3. Input: s = "ABCDE", k = 0 → Output: 1 (any single character)
   - No replacements allowed, so maximum is 1
4. Input: s="AAAA", k=2 → Output: 4
5. Input: s="ABBB", k=1 → Output: 4

### Pseudocode:
```
WHY SLIDING WINDOW?
- Need longest valid substring where (window_size - most_frequent_char) ≤ k
- Instead of checking all O(n²) substrings, maintain a window
- Track frequency to know most common character in current window
- When invalid (need > k replacements), shrink from left
- This reduces O(n²) brute force to O(n) single pass

Initialize left = 0, maxCount = 0, maxLength = 0
Initialize frequency map (Dictionary<char, int>)

For right from 0 to string length - 1:
    Update frequency of character at right  // Expand window
    
    Update maxCount = max(maxCount, frequency[character at right])
    
    While (right - left + 1) - maxCount > k:  // Window invalid
        Decrement frequency of character at left  // Shrink window
        Increment left pointer
    
    Update maxLength = max(maxLength, right - left + 1)
```

### C# Solution:
```csharp
public int CharacterReplacement(string s, int k) {
    Dictionary<char, int> frequency = new Dictionary<char, int>();
    int left = 0;
    int maxCount = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.Length; right++) {
        // Update frequency of current character
        if (frequency.ContainsKey(s[right])) {
            frequency[s[right]]++;
        } else {
            frequency[s[right]] = 1;
        }
        
        // Update maxCount (maximum frequency of any character in current window)
        maxCount = Math.Max(maxCount, frequency[s[right]]);
        
        // Shrink window if we need more than k replacements
        while ((right - left + 1) - maxCount > k) {
            frequency[s[left]]--;
            left++;
        }
        
        // Update maximum window size
        maxLength = Math.Max(maxLength, right - left + 1);
    }
    
    return maxLength;
}
```

- **Time Complexity**: O(n) where n is the length of the string. Each character is processed at most twice (added once, removed once).
- **Space Complexity**: O(c) where c is the number of unique characters in the string (at most 26 for uppercase English letters, effectively O(1)).

---

## 3. [Easy] Maximum Sum of Subarrays of Size K (LeetCode #643)

### Description:
Find the maximum sum of any contiguous subarray of size k in the given array. This is a classic fixed-size sliding window problem where we maintain a window of exactly k elements.

### Examples:
1. Input: arr = [2, 1, 5, 1, 3, 2], k = 3 → Output: 9 (subarray [5,1,3])
   - First window: [2,1,5] = 8
   - Second window: [1,5,1] = 7  
   - Third window: [5,1,3] = 9 (maximum)
2. Input: arr = [2, 3, 4, 1, 5], k = 2 → Output: 7 (subarray [3,4])
   - First window: [2,3] = 5
   - Second window: [3,4] = 7 (maximum)
   - Third window: [4,1] = 5
3. Input: arr = [1, 2, 3], k = 3 → Output: 6 (entire array)
   - Only one window possible: [1,2,3] = 6
4. Input: [5,5,5,5,5], k=2 → Output: 10
5. Input: [-1,-2,-3,-4], k=2 → Output: -3

### Pseudocode:
```
WHY SLIDING WINDOW?
- Brute force: calculate sum for each k-sized subarray → O(n*k)
- Sliding window: reuse previous sum, subtract left element, add right element
- This optimizes from O(n*k) to O(n) - classic fixed-size window problem

Initialize windowSum = sum of first k elements
Initialize maxSum = windowSum

For i from k to array length - 1:
    Remove element at i-k from windowSum  // Slide window: remove old left
    Add element at i to windowSum         // Slide window: add new right
    Update maxSum = max(maxSum, windowSum)
```

### C# Solution:
```csharp
public int MaximumSumSubarray(int[] arr, int k) {
    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    int maxSum = windowSum;
    
    // Slide window from left to right
    for (int i = k; i < arr.Length; i++) {
        // Remove first element of previous window and add last element of current window
        windowSum = windowSum - arr[i - k] + arr[i];
        
        // Update maximum sum if current window sum is greater
        maxSum = Math.Max(maxSum, windowSum);
    }
    
    return maxSum;
}
```

- **Time Complexity**: O(n) where n is the length of the array. We calculate the first window sum in O(k), then slide through remaining elements in O(n-k). Overall O(n).
- **Space Complexity**: O(1) - only use constant variables for sum tracking.

---

## 4. [Medium] Max Points You Can Obtain From Cards (LeetCode #1423)

### Description:
You are given a row of cards with point values. You can take exactly k cards, taking one from either the beginning or end of the row in each step. The goal is to maximize the sum of taken cards.

### Examples:
1. Input: cardPoints = [1,2,3,4,5,6,1], k = 3 → Output: 12
   - Take 3 from left: [1,2,3] = 6
   - Take 2 from left, 1 from right: [1,2] + [1] = 4
   - Take 1 from left, 2 from right: [1] + [6,1] = 8
   - Take 3 from right: [5,6,1] = 12 (maximum)
2. Input: cardPoints = [2,2,2], k = 2 → Output: 4
   - Take any 2 cards: [2,2] = 4
3. Input: cardPoints = [9,7,7,9,7,7,9], k = 7 → Output: 55
   - Take all cards: [9,7,7,9,7,7,9] = 55
4. Input: [100,40,17,9,73,75], k=3 → Output: 248
5. Input: [1,79,80,1,1,1,200,1], k=3 → Output: 202

### Pseudocode:
```
WHY SLIDING WINDOW?
- Can take k cards from left/right ends only
- Instead of trying all combinations, realize: taking i from right = taking (k-i) from left
- Start with k cards from left, then slide window: drop one left card, add one right card
- This checks all k+1 combinations in O(k) instead of exponential

Calculate sum of first k cards  // Initial window: all from left
Initialize maxPoints = sum of first k cards

For i from 0 to k-1:
    Remove element at position (k-1-i) from sum  // Drop one from left
    Add element at position (length-k+i) to sum  // Add one from right
    Update maxPoints = max(maxPoints, currentSum)
```

### C# Solution:
```csharp
public int MaxScore(int[] cardPoints, int k) {
    // Calculate sum of first k cards
    int currentSum = 0;
    for (int i = 0; i < k; i++) {
        currentSum += cardPoints[i];
    }
    
    int maxScore = currentSum;
    
    // Try taking i cards from right and (k-i) cards from left
    for (int i = 0; i < k; i++) {
        // Remove one card from left side (at position k-1-i)
        currentSum -= cardPoints[k - 1 - i];
        // Add one card from right side (at position length-k+i)
        currentSum += cardPoints[cardPoints.Length - k + i];
        
        maxScore = Math.Max(maxScore, currentSum);
    }
    
    return maxScore;
}
```

- **Time Complexity**: O(k) where k is the number of cards to take. We calculate initial sum in O(k) and slide the window k times.
- **Space Complexity**: O(1) - only use constant variables for sum tracking.

---

## 5. [Medium] Max Sum of Distinct Subarrays Length K (LeetCode #2461)

### Description:
Find the maximum sum among all distinct subarrays of size k in the array. This requires checking that each subarray has all unique elements.

### Examples:
1. Input: nums = [1,2,3,4,5,6], k = 3 → Output: 15 (subarray [4,5,6])
   - All subarrays of size 3 have distinct elements
   - [1,2,3] = 6, [2,3,4] = 9, [3,4,5] = 12, [4,5,6] = 15 (maximum)
2. Input: nums = [1,2,1,3,2], k = 3 → Output: 6 (subarray [1,3,2])
   - [1,2,1] - has duplicate 1, so invalid
   - [2,1,3] - all distinct = 6  
   - [1,3,2] - all distinct = 6 (maximum)
3. Input: nums = [5,5,5,5], k = 2 → Output: 0 (no valid subarrays)
   - All subarrays have duplicates, so sum = 0
4. Input: [4,4,4,1,2,3], k=3 → Output: 7
5. Input: [1,2,3,2,1,4,5], k=3 → Output: 10

### Pseudocode:
```
WHY SLIDING WINDOW?
- Need k-sized subarrays with all distinct elements
- Brute force: check all O(n-k+1) subarrays, validate distinctness each time → O(n*k)
- Sliding window: maintain frequency map as window slides, check in O(1) → O(n)
- Add/remove elements incrementally instead of rechecking entire subarray

Initialize maxSum = 0
Initialize windowStart = 0, currentSum = 0
Initialize frequencyMap (Dictionary<int, int>)

For windowEnd from 0 to array length - 1:
    Add element at windowEnd to frequencyMap and currentSum  // Expand window
    
    If window size > k:  // Window too large
        Remove element at windowStart from frequencyMap and currentSum  // Shrink
        Increment windowStart
    
    If window size == k:
        If all elements in window are distinct:  // Check: frequency.Count == k
            Update maxSum = max(maxSum, currentSum)
```

### C# Solution:
```csharp
public int MaximumSubarraySum(int[] nums, int k) {
    Dictionary<int, int> frequency = new Dictionary<int, int>();
    int windowStart = 0;
    int currentSum = 0;
    int maxSum = 0;
    
    for (int windowEnd = 0; windowEnd < nums.Length; windowEnd++) {
        // Add current element to window
        if (frequency.ContainsKey(nums[windowEnd])) {
            frequency[nums[windowEnd]]++;
        } else {
            frequency[nums[windowEnd]] = 1;
        }
        
        currentSum += nums[windowEnd];
        
        // Shrink window if it's larger than k
        if (windowEnd - windowStart + 1 > k) {
            // Remove leftmost element
            frequency[nums[windowStart]]--;
            if (frequency[nums[windowStart]] == 0) {
                frequency.Remove(nums[windowStart]);
            }
            currentSum -= nums[windowStart];
            windowStart++;
        }
        
        // Check if window size is exactly k and all elements are distinct
        if (windowEnd - windowStart + 1 == k && frequency.Count == k) {
            // All k elements are distinct (dictionary size equals window size)
            maxSum = Math.Max(maxSum, currentSum);
        }
    }
    
    return maxSum;
}
```

- **Time Complexity**: O(n) where n is the length of the array. Each element is added to and removed from the window at most once.
- **Space Complexity**: O(k) for the frequency dictionary, which stores at most k unique elements in the window.

---

## 6. [Hard] Adjacent Increasing Subarrays Detection II (LeetCode #3350)

### Description:
Given an integer array `nums`, determine whether there exists an integer `k ≥ 2` and an index `i` such that:

• `nums[i .. i + k - 1]` is strictly increasing  
• `nums[i + k .. i + 2k - 1]` is strictly increasing  
• the two subarrays are adjacent and of equal length

Return `true` if such a pair exists, otherwise return `false`.

This is a Hard sliding window problem because we must efficiently detect two back to back increasing windows without brute force.

### Examples:
1. Input: nums = [1,2,3,4]
   Output: true
   Explanation:
   [1,2] and [3,4] are two adjacent increasing subarrays of equal length 2.

2. Input: nums = [1,2,1,2,3]
   Output: true
   Explanation:
   [1,2] (indices 0..1) and [1,2] (indices 2..3) are adjacent increasing subarrays of length 2.

3. Input: nums = [1,2,1,2,1]
   Output: false
   Explanation:
   No two adjacent strictly increasing subarrays of equal length exist.
4. Input: [1,2,3,1,2,3] → Output: true
    Explanation: [1,2,3] and [1,2,3] are adjacent increasing subarrays of length 3.

5. Input: [5,4,3,2,1,2,3,4] → Output: true
    Explanation: [1,2] and [3,4] are adjacent increasing subarrays of length 2.

### Pseudocode:
```
WHY SLIDING WINDOW?
- We need to compare adjacent increasing segments efficiently
- Precompute increasing run lengths from both directions
- Slide a boundary and compare window sizes in O(n)

If array length < 4:
    return false

Build incLeft:
    incLeft[0] = 1
    For i from 1 to n-1:
        If nums[i] > nums[i-1]:
            incLeft[i] = incLeft[i-1] + 1
        Else:
            incLeft[i] = 1

Build incRight:
    incRight[n-1] = 1
    For i from n-2 down to 0:
        If nums[i] < nums[i+1]:
            incRight[i] = incRight[i+1] + 1
        Else:
            incRight[i] = 1

For i from 0 to n-2:
    // We need the same length k for both runs, with k >= 2
    If min(incLeft[i], incRight[i+1]) >= 2:
        return true  // there exists k (choose k = 2..min) giving adjacent increasing runs

return false
```

### C# Solution:
```csharp
public bool HasAdjacentIncreasingSubarrays(int[] nums) {
    int n = nums.Length;
    if (n < 4) {
        return false;
    }

    int[] incLeft = new int[n];
    int[] incRight = new int[n];

    // Build incLeft: length of increasing run ending at i
    incLeft[0] = 1;
    for (int i = 1; i < n; i++) {
        if (nums[i] > nums[i - 1]) {
            incLeft[i] = incLeft[i - 1] + 1;
        } else {
            incLeft[i] = 1;
        }
    }

    // Build incRight: length of increasing run starting at i
    incRight[n - 1] = 1;
    for (int i = n - 2; i >= 0; i--) {
        if (nums[i] < nums[i + 1]) {
            incRight[i] = incRight[i + 1] + 1;
        } else {
            incRight[i] = 1;
        }
    }

    // Check adjacent increasing subarrays
    for (int i = 0; i < n - 1; i++) {
        if (Math.Min(incLeft[i], incRight[i + 1]) >= 2) {
            return true;
        }
    }

    return false;
}
```

- **Time Complexity**: O(n)
  We make three linear passes over the array: one to build incLeft, one to build incRight, and one to scan for a valid adjacent split.

- **Space Complexity**: O(n)
  Two auxiliary arrays incLeft and incRight are used to store increasing run lengths.

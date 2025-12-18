# Sliding Window Problems

## 1. Longest Substring Without Repeating Characters

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

### Pseudocode:
```
Initialize left = 0, maxLength = 0, charMap (HashSet)
For right from 0 to string length - 1:
    While character at right exists in charMap:
        Remove character at left from charMap
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

## 2. Longest Repeating Character Replacement

### Description:
Given a string and integer k, find the length of the longest substring that can be made with at most k replacements. The approach uses sliding window to maintain a valid window where we can make all characters the same with at most k changes.

### Examples:
1. Input: s = "ABAB", k = 2 → Output: 4 (substring "AAAA" or "BBBB")
   - We can replace 2 characters to make all same
   - Window size 4: "ABAB" → can become "AAAA" or "BBBB"
2. Input: s = "AABABBA", k = 1 → Output: 4 (substring "AABA" or "BABA")
   - We can make at most one replacement
   - Optimal solution is window of size 4 where we replace one character
3. Input: s = "ABCDE", k = 0 → Output: 1 (any single character)
   - No replacements allowed, so maximum is 1

### Pseudocode:
```
Initialize left = 0, maxCount = 0, maxLength = 0
Initialize frequency map (Dictionary<char, int>)

For right from 0 to string length - 1:
    Update frequency of character at right
    
    Update maxCount = max(maxCount, frequency[character at right])
    
    While (right - left + 1) - maxCount > k:
        Decrement frequency of character at left
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

## 3. Maximum Sum of Subarrays of Size K

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

### Pseudocode:
```
Initialize windowSum = sum of first k elements
Initialize maxSum = windowSum

For i from k to array length - 1:
    Remove element at i-k from windowSum
    Add element at i to windowSum
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

## 4. Max Points You Can Obtain From Cards

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

### Pseudocode:
```
Calculate sum of first k cards
Initialize maxPoints = sum of first k cards

For i from 0 to k-1:
    Remove element at position (k-1-i) from sum
    Add element at position (length-k+i) to sum
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

## 5. Max Sum of Distinct Subarrays Length K

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

### Pseudocode:
```
Initialize maxSum = 0
Initialize windowStart = 0, currentSum = 0
Initialize frequencyMap (Dictionary<int, int>)

For windowEnd from 0 to array length - 1:
    Add element at windowEnd to frequencyMap and currentSum
    
    If window size > k:
        Remove element at windowStart from frequencyMap and currentSum
        Increment windowStart
    
    If window size == k:
        If all elements in window are distinct:
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

## 6. Adjacent Increasing Subarrays Detection II

### Description:
This is a complex problem involving finding whether there exists an adjacent increasing subarray of at least length 3 that can be extended. The problem deals with detecting patterns where we have a sequence that increases and can potentially continue with additional elements.

### Examples:
1. Input: [1,2,3,4] → Output: True (subarray [1,2,3,4] is increasing)
2. Input: [1,2,1,2,3] → Output: True (subarray [1,2,3] is increasing)
3. Input: [1,2,1,2,1] → Output: False (no increasing subarray of length ≥ 3)

### Pseudocode:
```
Initialize maxLen = 0, currentLen = 1
For i from 1 to array length - 1:
    If arr[i] > arr[i-1]:
        currentLen++
        maxLen = max(maxLen, currentLen)
    Else:
        currentLen = 1

Return maxLen >= 3
```

### C# Solution:
```csharp
public bool IsValid(int[] arr) {
    if (arr.Length < 3) return false;
    
    int maxLen = 0;
    int currentLen = 1;
    
    for (int i = 1; i < arr.Length; i++) {
        if (arr[i] > arr[i - 1]) {
            currentLen++;
            maxLen = Math.Max(maxLen, currentLen);
        } else {
            currentLen = 1;
        }
    }
    
    return maxLen >= 3;
}
```
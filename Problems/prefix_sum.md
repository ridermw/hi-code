# Prefix Sum Problems

## Prefix Sum Concept

### What is Prefix Sum?
Prefix sum (also called cumulative sum) is a technique where we precompute the sum of all elements from the start of an array up to each index. This allows us to calculate the sum of any subarray in O(1) time instead of O(n). Given array `nums`, prefix[i] = nums[0] + nums[1] + ... + nums[i]. Subarray sum from index i to j equals prefix[j] - prefix[i-1].

### Core Operations:
- **Build Prefix Array**: Compute cumulative sums - O(n)
- **Range Sum Query**: Get sum of elements from i to j - O(1)
- **Subarray Count**: Use HashMap to count subarrays with given sum - O(n)
- **2D Prefix Sum**: Extend to matrices for rectangle sum queries - O(m × n) build, O(1) query

### When to Use Prefix Sum?
Use prefix sum when:
- Need to calculate multiple range sum queries efficiently
- Finding subarrays with specific sum properties
- Problems involve cumulative calculations (running totals)
- Want to optimize from O(n) per query to O(1) per query
- Keywords: "subarray sum", "range sum", "cumulative", "continuous"
- Can trade O(n) preprocessing for O(1) queries
- 2D version for matrix rectangle sum queries

### Common Prefix Sum Patterns:
```
1. Basic Prefix Sum:
   prefix[0] = nums[0]
   for i from 1 to n-1:
       prefix[i] = prefix[i-1] + nums[i]
   
   Range sum [i, j]:
       if i == 0: return prefix[j]
       else: return prefix[j] - prefix[i-1]
   
2. Subarray Sum Equals K (HashMap):
   Map current prefix sum to frequency
   If (currentSum - k) exists in map: found subarray
   This handles arbitrary start positions
   
3. 2D Prefix Sum:
   prefix[i][j] = sum of rectangle from (0,0) to (i,j)
   prefix[i][j] = matrix[i][j] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1]
```

### Example:
**Problem:** Given array [3, -2, 5, -1], find sum of elements from index 1 to 3

**Why Prefix Sum?** Without preprocessing, sum requires O(n) time per query. Build prefix array: [3, 1, 6, 5]. Query sum[1 to 3] = prefix[3] - prefix[0] = 5 - 3 = 2. Handles negative numbers correctly. Multiple queries become O(1) each after O(n) preprocessing.

**Without Prefix Sum:** Sum elements [1 to 3] each query → O(n) per query
**With Prefix Sum:** Preprocess O(n), then O(1) per query

---

## Subarray Sum Equals K | LeetCode 560 | Medium
Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`. A subarray is a contiguous non-empty sequence of elements within an array.

### Examples:
1. Input: nums = [1,1,1], k = 2, Output = 2  
   - Subarrays: [1,1] (index 0-1) and [1,1] (index 1-2)
   - Two subarrays with sum = 2

2. Input: nums = [1,2,3], k = 3, Output = 2  
   - Subarrays: [1,2] (sum=3) and [3] (sum=3)
   - Two subarrays with sum = 3

3. Input: nums = [1], k = 0, Output = 0  
   - Single element array
   - No subarray with sum = 0

4. Input: nums = [1,-1,0], k = 0, Output = 3  
   - Subarrays: [1,-1] (sum=0), [0] (sum=0), [1,-1,0] (sum=0)
   - Three subarrays with sum = 0

5. Input: nums = [3,4,7,2,-3,1,4,2], k = 7, Output = 4  
   - Subarrays: [3,4], [7], [7,2,-3,1], [2,-3,1,4,2]
   - Four different subarrays sum to 7
   - Includes negative numbers

### Pseudocode:
```
WHY PREFIX SUM WITH HASHMAP?
- Need all subarrays (can start at any index, not just 0)
- If prefix sum at j is S and at i is S-k, then sum[i+1 to j] = k
- Store frequency of each prefix sum in HashMap
- For each position: check if (currentSum - k) exists
- Count how many times we've seen (currentSum - k)
- O(n) time, O(n) space

1. Initialize HashMap: {0: 1} (sum 0 seen once before start)
2. Initialize currentSum = 0, count = 0
3. For each num in nums:
   - currentSum += num
   - If (currentSum - k) in map:
     count += map[currentSum - k]
   - map[currentSum]++ (increment frequency)
4. Return count
```

### C# Solution:
```csharp
public int SubarraySum(int[] nums, int k) {
    Dictionary<int, int> prefixSumCount = new Dictionary<int, int>();
    prefixSumCount[0] = 1;
    
    int currentSum = 0;
    int count = 0;
    
    foreach (int num in nums) {
        currentSum += num;
        
        if (prefixSumCount.ContainsKey(currentSum - k)) {
            count += prefixSumCount[currentSum - k];
        }
        
        if (prefixSumCount.ContainsKey(currentSum)) {
            prefixSumCount[currentSum]++;
        } else {
            prefixSumCount[currentSum] = 1;
        }
    }
    
    return count;
}
```

### Complexity

**Time Complexity**: O(n) where n is the length of the array. Single pass through array with O(1) HashMap operations.

**Space Complexity**: O(n) for the HashMap storing prefix sums.

## Range Sum Query - Immutable | LeetCode 303 | Easy
Given an integer array `nums`, handle multiple queries of the following type: Calculate the sum of the elements of `nums` between indices `left` and `right` inclusive where `left <= right`. Implement the `NumArray` class with methods to handle sum range queries.

### Examples:
1. Input: ["NumArray", "sumRange", "sumRange", "sumRange"], [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], Output: [null, 1, -1, -3]  
   - NumArray initialized with [-2, 0, 3, -5, 2, -1]
   - sumRange(0, 2) = -2 + 0 + 3 = 1
   - sumRange(2, 5) = 3 + (-5) + 2 + (-1) = -1
   - sumRange(0, 5) = -2 + 0 + 3 + (-5) + 2 + (-1) = -3

2. Input: ["NumArray", "sumRange", "sumRange"], [[[1, 2, 3, 4, 5]], [1, 3], [0, 4]], Output: [null, 9, 15]  
   - sumRange(1, 3) = 2 + 3 + 4 = 9
   - sumRange(0, 4) = 1 + 2 + 3 + 4 + 5 = 15

3. Input: ["NumArray", "sumRange"], [[[5]], [0, 0]], Output: [null, 5]  
   - Single element
   - sumRange(0, 0) = 5

4. Input: ["NumArray", "sumRange", "sumRange"], [[[-1, -2, -3]], [0, 1], [1, 2]], Output: [null, -3, -5]  
   - All negative numbers
   - sumRange(0, 1) = -1 + (-2) = -3
   - sumRange(1, 2) = -2 + (-3) = -5

5. Input: ["NumArray", "sumRange", "sumRange", "sumRange"], [[[1, -1, 2, -2, 3]], [0, 0], [0, 4], [2, 4]], Output: [null, 1, 3, 3]  
   - Mixed positive and negative
   - Multiple range queries

### Pseudocode:
```
WHY PREFIX SUM?
- Multiple sumRange queries: O(n) each without preprocessing
- Build prefix sum array once: O(n)
- Each query becomes O(1): prefix[right] - prefix[left-1]
- Trade initialization time for fast queries
- Immutable array: preprocess once, query many times

Constructor:
1. prefix = new array of size n+1
2. prefix[0] = 0
3. For i from 0 to n-1:
   prefix[i+1] = prefix[i] + nums[i]

SumRange(left, right):
1. Return prefix[right+1] - prefix[left]
```

### C# Solution:
```csharp
public class NumArray {
    private int[] prefix;
    
    public NumArray(int[] nums) {
        prefix = new int[nums.Length + 1];
        for (int i = 0; i < nums.Length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }
    
    public int SumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}
```

### Complexity

**Time Complexity**: O(n) for constructor where n is array length. O(1) for each sumRange query.

**Space Complexity**: O(n) for the prefix sum array.

## Product of Array Except Self | LeetCode 238 | Medium
Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. You must write an algorithm that runs in O(n) time and without using the division operation.

### Examples:
1. Input: nums = [1,2,3,4], Output = [24,12,8,6]  
   - answer[0] = 2 × 3 × 4 = 24
   - answer[1] = 1 × 3 × 4 = 12
   - answer[2] = 1 × 2 × 4 = 8
   - answer[3] = 1 × 2 × 3 = 6

2. Input: nums = [-1,1,0,-3,3], Output = [0,0,9,0,0]  
   - Contains zero
   - answer[0] = 1 × 0 × (-3) × 3 = 0
   - answer[2] = (-1) × 1 × (-3) × 3 = 9
   - All others include the zero → 0

3. Input: nums = [2,3], Output = [3,2]  
   - Two elements
   - answer[0] = 3, answer[1] = 2

4. Input: nums = [1,1,1,1], Output = [1,1,1,1]  
   - All ones
   - Product remains 1

5. Input: nums = [2,-2,3,-3,4], Output = [72,-72,48,-48,36]  
   - Mixed signs
   - answer[0] = (-2) × 3 × (-3) × 4 = 72
   - answer[1] = 2 × 3 × (-3) × 4 = -72
   - Sign handling important

### Pseudocode:
```
WHY PREFIX/SUFFIX PRODUCT?
- Cannot use division (otherwise: total product / nums[i])
- For each position: product of left side × product of right side
- Build prefix product (left to right) and suffix product (right to left)
- answer[i] = prefix[i-1] × suffix[i+1]
- Optimize: use answer array for prefix, then multiply with suffix in-place
- O(n) time, O(1) extra space (output doesn't count)

1. Initialize answer array of size n, all elements = 1
2. Build left products in answer array:
   leftProduct = 1
   For i from 0 to n-1:
     answer[i] = leftProduct
     leftProduct *= nums[i]
3. Build right products and multiply into answer:
   rightProduct = 1
   For i from n-1 down to 0:
     answer[i] *= rightProduct
     rightProduct *= nums[i]
4. Return answer
```

### C# Solution:
```csharp
public int[] ProductExceptSelf(int[] nums) {
    int n = nums.Length;
    int[] answer = new int[n];
    
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = answer[i - 1] * nums[i - 1];
    }
    
    int rightProduct = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return answer;
}
```

### Complexity

**Time Complexity**: O(n) where n is the length of the array. Two passes through the array.

**Space Complexity**: O(1) excluding the output array. Only uses constant extra space.

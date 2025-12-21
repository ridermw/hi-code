# Two Pointers Problems

## Two Pointers Concept

### What is Two Pointers?
Two pointers is an algorithmic technique that uses two references (indices) to traverse a data structure, typically an array or linked list. The pointers can move in various patterns: toward each other, in the same direction, or at different speeds. This approach often reduces time complexity from O(n²) to O(n).

### Types of Two Pointer Patterns:
1. **Opposite Ends** - Start at beginning and end, move toward center
2. **Same Direction (Fast/Slow)** - Both start at beginning, move at different speeds
3. **Fixed Distance** - Maintain constant gap between pointers
4. **Sliding Window** - Expand and contract window based on conditions

### When to Use Two Pointers?
Use this technique when:
- Working with sorted arrays (enables direction-based decisions)
- Need to find pairs/triplets with specific properties
- Optimizing from nested loops (O(n²) → O(n))
- Problems involving symmetry or opposite ends
- Need to partition or rearrange in-place

### Generic Patterns:
```
1. Opposite Ends (Converging):
   left = 0, right = array.length - 1
   while left < right:
       process(array[left], array[right])
       if condition: move left
       else: move right

2. Same Direction (Fast/Slow):
   slow = 0, fast = 0
   while fast < array.length:
       if condition: slow++
       fast++

3. Fixed Distance:
   for i = 0 to length - k:
       j = i + k
       process(array[i], array[j])
```

### Example:
**Problem:** Find two numbers in sorted array that sum to target

**Why Two Pointers?** With one pointer at start (small values) and one at end (large values), we can make greedy decisions. If sum too small, move left pointer (increase sum). If sum too large, move right pointer (decrease sum). This exploits the sorted property.

**Without Two Pointers:** Check all pairs → O(n²)
**With Two Pointers:** Each pointer moves at most n times → O(n)

---

## 1. Container With Most Water | LeetCode 11 | Medium

### Description:
Given n non-negative integers representing vertical lines, find two lines that form a container which holds the most water.

### Examples:
1. Input: [1,8,6,2,5,4,8,3,7] → Output: 49 (Lines at index 1 and 8)
2. Input: [1,1] → Output: 1 (Lines at index 0 and 1)
3. Input: [4,3,2,1,4] → Output: 16 (Lines at index 0 and 4)
4. Input: [1,2,1] → Output: 2 (Lines at index 0 and 2)
5. Input: [2,3,10,5,7,8,9] → Output: 36 (Lines at index 2 and 6)

### Pseudocode:
```
WHY TWO POINTERS (OPPOSITE ENDS)?
- Water amount limited by shorter line: area = min(h1, h2) × width
- Brute force: try all pairs → O(n²)
- Key insight: wider container is better, but limited by shorter line
- Start with maximum width, then greedily improve height
- Always move pointer at shorter line (moving taller won't improve)
- This guarantees we consider the optimal container → O(n)

Initialize left = 0, right = array.length - 1
Initialize maxWater = 0

While left < right:
    Calculate currentWater = min(height[left], height[right]) × (right - left)
    Update maxWater = max(maxWater, currentWater)
    
    If height[left] < height[right]:
        left++  // Move shorter line, try to find taller
    Else:
        right--  // Move shorter line
```

### C# Solution:
```csharp
public int MaxArea(int[] height) {
    int left = 0;
    int right = height.Length - 1;
    int maxWater = 0;
    
    while (left < right) {
        int currentWater = Math.Min(height[left], height[right]) * (right - left);
        maxWater = Math.Max(maxWater, currentWater);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}
```

### Complexity:
**Time Complexity**: O(n) where n is the number of elements. Each pointer moves at most n times total.

**Space Complexity**: O(1) - only uses constant variables for tracking.

---

## 2. Two Sum Sorted | LeetCode 167 | Easy

### Description:
Given a sorted array and target sum, find two indices such that their values add up to the target.

### Examples:
1. Input: [2,7,11,15], target = 9 → Output: [1,2] (indices 1 and 2)
2. Input: [2,3,4], target = 6 → Output: [1,3] (indices 1 and 3)
3. Input: [-1,0], target = -1 → Output: [1,2] (indices 1 and 2)
4. Input: [0,0,3,4], target = 0 → Output: [1,2] (indices 1 and 2)
5. Input: [-10,-8,-2,1,2,9], target = -9 → Output: [1,4] (indices 1 and 4)

### Pseudocode:
```
WHY TWO POINTERS (OPPOSITE ENDS)?
- Array is sorted: enables directional decisions
- Brute force: check all pairs → O(n²)
- Two pointers exploit sorted order: sum too small? increase left (larger value)
  sum too large? decrease right (smaller value)
- Each comparison eliminates one element from consideration
- Guaranteed to find answer if exists → O(n)

Initialize left = 0, right = array.length - 1

While left < right:
    Calculate sum = array[left] + array[right]
    
    If sum == target:
        Return [left + 1, right + 1] (1-indexed)
    Else if sum < target:
        left++  // Need larger sum, move to larger value
    Else:
        right--  // Need smaller sum, move to smaller value
```

### C# Solution:
```csharp
public int[] TwoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.Length - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        
        if (sum == target) {
            return new int[] { left + 1, right + 1 }; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[0]; // Should never reach here
}
```

### Complexity:
**Time Complexity**: O(n) where n is the length of the array. Each pointer moves through array once.

**Space Complexity**: O(1) - only uses constant variables.

---

## 3. Three Sum | LeetCode 15 | Medium

### Description:
Find all unique triplets that sum to zero in an array.

### Examples:
1. Input: [-1,0,1,2,-1,-4] → Output: [[-1,-1,2], [-1,0,1]]
2. Input: [0,1,1] → Output: []
3. Input: [0,0,0] → Output: [[0,0,0]]
4. Input: [-2,0,0,2,2] → Output: [[-2,0,2]]
5. Input: [-1,-1,-1,2,2] → Output: [[-1,-1,2]]

### Pseudocode:
```
WHY TWO POINTERS?
- Extension of Two Sum: fix one element, find two that sum to -fixed
- Brute force: three nested loops → O(n³)
- Sort first: enables two pointer approach for inner pair
- For each element i, use two pointers for remaining array
- Skip duplicates to ensure unique triplets
- Reduces O(n³) to O(n²) [O(n) × O(n) inner loop]

Sort array  // O(n log n)
For i from 0 to length - 3:
    If i > 0 and array[i] == array[i-1]: continue  // Skip duplicates
    If array[i] > 0: break  // Early stop: remaining numbers are positive
    
    Initialize left = i + 1, right = array.length - 1
    
    While left < right:
        Calculate sum = array[i] + array[left] + array[right]
        
        If sum == 0:
            Add triplet to result
            Skip duplicates for left and right  // Important for uniqueness
            left++, right--
            
        Else if sum < 0:
            left++  // Need larger sum
        Else:
            right--  // Need smaller sum
```

### C# Solution:
```csharp
public IList<IList<int>> ThreeSum(int[] nums) {
    Array.Sort(nums);
    var result = new List<IList<int>>();
    
    for (int i = 0; i < nums.Length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1;
        int right = nums.Length - 1;
        
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            
            if (sum == 0) {
                result.Add(new List<int> { nums[i], nums[left], nums[right] });
                
                // Skip duplicates
                while (left < right && nums[left] == nums[left + 1]) left++;
                while (left < right && nums[right] == nums[right - 1]) right--;
                
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }
    
    return result;
}
```

### Complexity:
**Time Complexity**: O(n²) where n is the length of the array. Sorting is O(n log n), outer loop O(n), inner two-pointer loop O(n).

**Space Complexity**: O(1) or O(n) depending on sorting implementation. Result list not counted in space complexity.

---

## 4. Triangle Numbers | LeetCode 611 | Medium

### Description:
Count the number of valid triangles that can be formed with given array elements.

### Examples:
1. Input: [2,2,3,4] → Output: 3 (Valid triangles: [2,3,4], [2,3,4], [2,2,3])
2. Input: [4,3,2,1] → Output: 0 (No valid triangles)
3. Input: [1,2,3,4,5] → Output: 3 (Valid triangles: [2,3,4], [2,4,5], [3,4,5])
4. Input: [1,1,1,1] → Output: 4 (All triplets form a triangle)
5. Input: [2,2,3,4,4] → Output: 8 (Multiple triangles across duplicates)

### Pseudocode:
```
WHY TWO POINTERS (OPTIMIZATION)?
- Triangle valid if: a + b > c (largest side < sum of other two)
- Brute force: check all triplets → O(n³)
- After sorting: if nums[i] + nums[j] > nums[k], all elements between j and k work
- Fix i and j, use while loop to find rightmost valid k
- Reuse k position for next j (optimization: k only moves forward)
- Reduces O(n³) to O(n²)

Sort array  // After sorting: i < j < k
Initialize count = 0

For i from 0 to length - 3:
    Initialize k = i + 2  // Start k just after j
    For j from i+1 to length - 2:
        // Find rightmost k where nums[i] + nums[j] > nums[k]
        While k < length AND nums[i] + nums[j] > nums[k]:
            k++  // Extend valid range
        Add (k - j - 1) to count  // All elements [j+1, k-1] form valid triangles
        
Return count
```

### C# Solution:
```csharp
public int TriangleNumber(int[] nums) {
    Array.Sort(nums);
    int count = 0;
    int n = nums.Length;
    
    for (int i = 0; i < n - 2; i++) {
        int k = i + 2;
        for (int j = i + 1; j < n - 1; j++) {
            while (k < n && nums[i] + nums[j] > nums[k]) {
                k++;
            }
            count += k - j - 1;
        }
    }
    
    return count;
}
```

### Complexity:
**Time Complexity**: O(n²) where n is the length of the array. Sorting is O(n log n), outer loop O(n), inner nested loops O(n²) worst case (but k optimization helps).

**Space Complexity**: O(1) - only uses counter and indices (excluding sorting space).

---

## 5. Move Zeroes | LeetCode 283 | Easy

### Description:
Move all zeros to the end of array while maintaining relative order of non-zero elements.

### Examples:
1. Input: [0,1,0,3,12] → Output: [1,3,12,0,0]
2. Input: [0] → Output: [0]
3. Input: [1,2,3] → Output: [1,2,3]
4. Input: [0,0,0,1] → Output: [1,0,0,0]
5. Input: [4,0,5,0,0,3,0,1] → Output: [4,5,3,1,0,0,0,0]

### Pseudocode:
```
WHY TWO POINTERS (SAME DIRECTION)?
- Need to partition: non-zeros first, then zeros
- Can't use extra space (in-place requirement)
- One pointer (read) scans all elements, other (write) tracks position for non-zeros
- Write pointer only advances for non-zeros, creating gap for zeros
- Fill remaining positions after all non-zeros placed
- O(n) time, O(1) space

Initialize writeIndex = 0  // Tracks position to write next non-zero

For i from 0 to array.length - 1:
    If array[i] != 0:
        array[writeIndex++] = array[i]  // Copy non-zero, advance write pointer

// Fill remaining positions with 0
While writeIndex < array.length:
    array[writeIndex++] = 0
```

### C# Solution:
```csharp
public void MoveZeroes(int[] nums) {
    int writeIndex = 0;
    
    // Move non-zero elements to front
    for (int i = 0; i < nums.Length; i++) {
        if (nums[i] != 0) {
            nums[writeIndex++] = nums[i];
        }
    }
    
    // Fill remaining positions with zeros
    while (writeIndex < nums.Length) {
        nums[writeIndex++] = 0;
    }
}
```

### Complexity:
**Time Complexity**: O(n) where n is the length of the array. Single pass through array to move non-zeros, then fill zeros.

**Space Complexity**: O(1) - in-place modification with constant variables.

---

## 6. Sort Colors | LeetCode 75 | Medium

### Description:
Sort an array containing only 0s, 1s, and 2s representing red, white, and blue colors.

### Examples:
1. Input: [2,0,2,1,1,0] → Output: [0,0,1,1,2,2]
2. Input: [2,0,1] → Output: [0,1,2]
3. Input: [0] → Output: [0]
4. Input: [2,2,1,1,0,0] → Output: [0,0,1,1,2,2]
5. Input: [1,2,0,1,2,0,1] → Output: [0,0,1,1,1,2,2]

### Pseudocode:
```
WHY THREE POINTERS (DUTCH NATIONAL FLAG)?
- Need to partition into three sections: 0s, 1s, 2s
- Could count then overwrite → two passes
- Three pointers enable one-pass solution:
  * low: boundary for 0s (everything before low is 0)
  * mid: current element being processed
  * high: boundary for 2s (everything after high is 2)
- Invariant: [0..low-1]=0, [low..mid-1]=1, [high+1..end]=2, [mid..high]=unprocessed
- O(n) time, O(1) space, single pass

Initialize low = 0, mid = 0, high = array.length - 1

While mid <= high:  // Process all elements
    If array[mid] == 0:
        Swap array[low] and array[mid]
        low++, mid++  // Both advance (0 in correct position)
    Else if array[mid] == 1:
        mid++  // Already in correct region, just advance
    Else:  // array[mid] == 2
        Swap array[mid] and array[high]
        high--  // Don't advance mid (need to recheck swapped element)
```

### C# Solution:
```csharp
public void SortColors(int[] nums) {
    int low = 0;
    int mid = 0;
    int high = nums.Length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            // Swap nums[low] and nums[mid]
            int temp = nums[low];
            nums[low] = nums[mid];
            nums[mid] = temp;
            
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            // Swap nums[mid] and nums[high]
            int temp = nums[mid];
            nums[mid] = nums[high];
            nums[high] = temp;
            
            high--;
        }
    }
}
```

### Complexity:
**Time Complexity**: O(n) where n is the length of the array. Single pass through the array.

**Space Complexity**: O(1) - in-place swapping with three pointers.

---

## 7. Trapping Rain Water | LeetCode 42 | Hard

### Description:
Calculate how much water can be trapped between bars of given heights.

### Examples:
1. Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6
2. Input: [3,0,2,0,4] → Output: 7
3. Input: [1,0,1] → Output: 1
4. Input: [4,2,0,3,2,5] → Output: 9
5. Input: [5,2,1,2,1,5] → Output: 14

### Pseudocode:
```
WHY TWO POINTERS (OPPOSITE ENDS)?
- Water at position i = min(maxLeft, maxRight) - height[i]
- Brute force: for each position, find max left and right → O(n²)
- Could precompute max arrays → O(n) time, O(n) space
- Two pointers optimization: track max from both sides while converging
- Key insight: water trapped depends on smaller of the two maxes
- Process from side with smaller max (that's the limiting factor)
- O(n) time, O(1) space - optimal

Initialize left = 0, right = array.length - 1
Initialize maxLeft = 0, maxRight = 0
Initialize totalWater = 0

While left < right:
    If height[left] <= height[right]:  // Left side is limiting
        If height[left] >= maxLeft:
            maxLeft = height[left]  // Update max, no water trapped
        Else:
            totalWater += maxLeft - height[left]  // Trap water
        left++
    Else:  // Right side is limiting
        If height[right] >= maxRight:
            maxRight = height[right]  // Update max, no water trapped
        Else:
            totalWater += maxRight - height[right]  // Trap water
        right--
```

### C# Solution:
```csharp
public int Trap(int[] height) {
    int left = 0;
    int right = height.Length - 1;
    int maxLeft = 0;
    int maxRight = 0;
    int totalWater = 0;
    
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) {
                maxLeft = height[left];
            } else {
                totalWater += maxLeft - height[left];
            }
            left++;
        } else {
            if (height[right] >= maxRight) {
                maxRight = height[right];
            } else {
                totalWater += maxRight - height[right];
            }
            right--;
        }
    }
    
    return totalWater;
}
```

### Complexity:
**Time Complexity**: O(n) where n is the length of the array. Single pass with two pointers converging.

**Space Complexity**: O(1) - only uses constant variables to track maximums and water.
# Binary Search Problems

## Binary Search Concept

### What is Binary Search
Binary search is a highly efficient searching algorithm that works on sorted data. It repeatedly divides the search space in half, comparing the middle element with the target value. Based on this comparison, the search space is narrowed down by eliminating half of the remaining elements. This process continues until the target is found or the search space is exhausted.

### Core Operations:
1. **Initialize**: Left = 0, Right = array length - 1
2. **Find Mid**: mid = left + (right - left) / 2 (avoids overflow in some languages)
3. **Compare**: Compare arr[mid] with target
4. **Adjust**: Move left or right pointer based on comparison
5. **Time**: O(log n) - dramatically faster than linear O(n) for large datasets

### When to Use Binary Search
Use binary search when:
1. Array is sorted (or can be sorted)
2. Need to find an element, boundary, or answer in sorted range
3. Problem involves "first occurrence", "last occurrence", or similar
4. Searching in a large dataset and need logarithmic complexity
5. Can apply binary search to answer (search for answer value itself)
6. Problem asks for "minimum/maximum value where condition is true"

### Common Binary Search Patterns
```
1. Find Exact Value:
   while left <= right:
       mid = (left + right) / 2
       if arr[mid] == target: return mid
       elif arr[mid] < target: left = mid + 1
       else: right = mid - 1
   
2. Find Boundary (First/Last Occurrence):
   while left < right:
       mid = (left + right) / 2
       if arr[mid] >= target: right = mid
       else: left = mid + 1

3. Binary Search on Answer:
   while left < right:
       mid = (left + right) / 2
       if canAchieve(mid): right = mid
       else: left = mid + 1
```

### Example:
**Problem:** Find the first element >= target in sorted array

**Why Binary Search?** Linear scan is O(n). Since array is sorted, we can eliminate half the search space each time. Check middle: if middle >= target, answer might be there or left; if middle < target, answer must be right. O(log n) solution.

**Without Binary Search:** Check each element left to right → O(n)
**With Binary Search:** Eliminate half search space each comparison → O(log n)

---

## Median of Two Sorted Arrays | LeetCode 4 | Hard
Given two sorted arrays `nums1` and `nums2` of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log(min(m, n))).

### Examples:
1. Input: nums1 = [1,3], nums2 = [2], Output = 2.0  
   - Combined sorted: [1,2,3] (length=3, odd)
   - Median is middle element at index 1: value 2.0
   - Partition nums1 at index 1: left=[1], right=[3]
   - Partition nums2 at index 1: left=[2], right=[]
   - Left side max: max(1, 2) = 2 → median

2. Input: nums1 = [1,2], nums2 = [3,4], Output = 2.5  
   - Combined sorted: [1,2,3,4] (length=4, even)
   - Median is average of middle two: (2+3)/2 = 2.5
   - Final partition: nums1 at index 2 (left=[1,2], right=[]), nums2 at index 0 (left=[], right=[3,4])
   - Left max = max(2, -∞) = 2, Right min = min(∞, 3) = 3
   - Median = (2 + 3) / 2 = 2.5

3. Input: nums1 = [1,5,9,11,15], nums2 = [2,3,6,7,8], Output = 6.5  
   - Combined sorted: [1,2,3,5,6,7,8,9,11,15] (length=10, even)
   - Median: (6+7)/2 = 6.5
   - Partition nums1 at index 3: left=[1,5,9], right=[11,15]
   - Partition nums2 at index 2: left=[2,3], right=[6,7,8]
   - Left max: 9, Right min: 6 (invalid, 9 > 6)
   - Move partition left in nums1 until valid

4. Input: nums1 = [], nums2 = [1,3,5,7,9], Output = 5.0  
   - Shorter array is empty (nums1)
   - All 5 elements come from nums2
   - Median is middle element: 5.0

5. Input: nums1 = [0,1,2,3,4,5,6,7,8,9], nums2 = [10,11,12,13,14,15,16,17,18,19], Output = 9.5  
   - Two equal-length arrays (10 elements each, total 20)
   - Combined: [0..9, 10..19], even length
   - Partition nums1 at index 5: left=[0,1,2,3,4], right=[5,6,7,8,9]
   - Partition nums2 at index 5: left=[10,11,12,13,14], right=[15,16,17,18,19]
   - Left max: 14, Right min: 5 (invalid, iterate)

### Pseudocode:
```
WHY BINARY SEARCH?
- Need O(log(min(m,n))) complexity, not O(m+n) merge
- Can't just merge arrays and find middle - too slow
- Instead: partition one array with binary search
- Other array partitions automatically based on first
- Both partitions have valid range of elements
- When correct partition found, median calculated in O(1)

1. Ensure nums1 is the shorter array (if not, swap)
2. Binary search on nums1's partition point:
   - left = 0, right = len(nums1)
   - For each mid:
     Calculate partition point in nums2: partition2 = (m + n + 1) / 2 - partition1
     Get boundary values:
       - left1 = nums1[partition1 - 1] (or -∞ if partition1 = 0)
       - right1 = nums1[partition1] (or +∞ if partition1 = m)
       - left2 = nums2[partition2 - 1] (or -∞ if partition2 = 0)
       - right2 = nums2[partition2] (or +∞ if partition2 = n)
     Check validity: if left1 <= right2 AND left2 <= right1: FOUND
     Otherwise adjust binary search boundaries
3. Calculate median from boundary values:
   - If (m + n) is even: median = (max(left1, left2) + min(right1, right2)) / 2
   - If (m + n) is odd: median = max(left1, left2)
```

### C# Solution:
```csharp
public double FindMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.Length > nums2.Length) {
        return FindMedianSortedArrays(nums2, nums1);
    }
    
    int m = nums1.Length, n = nums2.Length;
    int left = 0, right = m;
    
    while (left <= right) {
        int partition1 = (left + right) / 2;
        int partition2 = (m + n + 1) / 2 - partition1;
        
        int left1 = partition1 == 0 ? int.MinValue : nums1[partition1 - 1];
        int right1 = partition1 == m ? int.MaxValue : nums1[partition1];
        int left2 = partition2 == 0 ? int.MinValue : nums2[partition2 - 1];
        int right2 = partition2 == n ? int.MaxValue : nums2[partition2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 == 0) {
                return (Math.Max(left1, left2) + Math.Min(right1, right2)) / 2.0;
            } else {
                return Math.Max(left1, left2);
            }
        } else if (left1 > right2) {
            right = partition1 - 1;
        } else {
            left = partition1 + 1;
        }
    }
    return -1;
}
```

### Complexity

**Time Complexity**: O(log(min(m, n))) since we perform binary search on the shorter array.

**Space Complexity**: O(1) as we only use a constant amount of extra space.

## Search in Rotated Sorted Array | LeetCode 33 | Medium
There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]. Given the rotated array nums and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.

### Examples:
1. Input: nums = [4,5,6,7,0,1,2], target = 0, Output = 4  
   - Rotation point at index 3 (value 7 → 0)
   - Original sorted: [0,1,2,4,5,6,7]
   - Mid=3 (value 6): nums[0]=4 ≤ nums[3]=6, left half sorted
   - Target 0 < 4, must be right half → search right
   - Eventually finds 0 at index 4

2. Input: nums = [4,5,6,7,0,1,2], target = 3, Output = -1  
   - Rotation point at index 3
   - Check all sorted halves during binary search
   - 3 never equals any mid value and narrows search space to empty
   - Returns -1 (not found)

3. Input: nums = [0,1,2,4,5,6,7], target = 4, Output = 3  
   - No rotation (sorted array)
   - Checks mid = 4 (index 3)
   - Target 4 == mid → return 3

4. Input: nums = [3,1,2], target = 2, Output = 2  
   - Rotated at index 0 (3 rotated once: [3,1,2])
   - Start: left=0, right=2, mid=1 (value 1)
   - nums[left]=3 > nums[mid]=1, right half sorted
   - Target 2 > mid (1) and 2 ≤ nums[right] (2) → search right
   - Finds 2 at index 2

5. Input: nums = [6,7,8,9,0,1,2,3,4,5], target = 3, Output = 7  
   - Rotated at index 4 (0 moved to front)
   - Length 10 array: multiple iterations needed
   - Mid=2 (value 8): nums[0]=6 ≤ nums[2]=8, left sorted
   - Target 3 < 6 → search right half
   - Eventually finds 3 at index 7

### Pseudocode:
```
WHY BINARY SEARCH?
- Could linearly search (O(n)), but constraint is O(log n)
- Array is mostly sorted, just rotated once
- One half of array is always fully sorted
- Can identify which half and whether target is in it
- Then binary search that half recursively

1. Initialize left = 0, right = length - 1
2. While left <= right:
   - Calculate mid = (left + right) / 2
   - If nums[mid] == target: return mid
   
   - Determine which half is properly sorted:
     - If nums[left] <= nums[mid]: left half is sorted
       - If nums[left] <= target < nums[mid]: search left (right = mid - 1)
       - Else: search right (left = mid + 1)
     - Else: right half is sorted
       - If nums[mid] < target <= nums[right]: search right (left = mid + 1)
       - Else: search left (right = mid - 1)
3. If target not found: return -1
```

### C# Solution:
```csharp
public int Search(int[] nums, int target) {
    int left = 0, right = nums.Length - 1;
    
    while (left <= right) {
        int mid = (left + right) / 2;
        
        if (nums[mid] == target) return mid;
        
        // Determine which half is sorted
        if (nums[left] <= nums[mid]) {
            // Left half is sorted
            if (nums[left] <= target && target < nums[mid]) {
                // Target in left half
                right = mid - 1;
            } else {
                // Target in right half
                left = mid + 1;
            }
        } else {
            // Right half is sorted
            if (nums[mid] < target && target <= nums[right]) {
                // Target in right half
                left = mid + 1;
            } else {
                // Target in left half
                right = mid - 1;
            }
        }
    }
    
    return -1;
}
```

### Complexity

**Time Complexity**: O(log n) since we eliminate half the search space with each iteration.

**Space Complexity**: O(1) as we only use a constant amount of extra space.

## Koko Eating Bananas | LeetCode 875 | Medium
Koko loves to eat bananas. There are n piles of bananas, the i-th pile has `piles[i]` bananas. The guards have gone and will come back in h hours. Koko can decide her eating speed of k bananas per hour. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and will not eat any more bananas during this hour. Koko likes to finish eating all the bananas before the guards come back. Return the minimum eating speed to finish all n piles within h hours.

### Examples:
1. Input: piles = [1,1,1,1,1,1,1,1,1,1], h = 10, Output = 1  
   - 10 piles of 1 banana each, 10 hours available
   - At speed 1: ceil(1/1) + ceil(1/1) + ... = 1+1+...+1 = 10 hours ✓
   - Minimum speed is 1

2. Input: piles = [3,6,7,11], h = 8, Output = 4  
   - 4 piles: 3, 6, 7, 11 bananas; 8 hours
   - Try speed 3: ceil(3/3)=1, ceil(6/3)=2, ceil(7/3)=3, ceil(11/3)=4 → 1+2+3+4=10 > 8 ✗
   - Try speed 4: ceil(3/4)=1, ceil(6/4)=2, ceil(7/4)=2, ceil(11/4)=3 → 1+2+2+3=8 ✓
   - Binary search narrows: minimum speed is 4

3. Input: piles = [1,1,1,1,1,1,1,1,1,1], h = 5, Output = 2  
   - 10 piles of 1 banana, 5 hours
   - At speed 2: each pile takes ceil(1/2)=1 hour → 10 hours > 5 ✗
   - At speed 1: each pile takes ceil(1/1)=1 hour → 10 hours > 5 ✗
   - Binary search tests between 1 and max(piles)=1 to find valid speed

4. Input: piles = [1000000000], h = 2, Output = 500000000  
   - Single enormous pile: 1 billion bananas, 2 hours
   - At speed k: ceil(1000000000/k) hours needed
   - Speed 500000000: ceil(1000000000/500000000)=2 hours ✓
   - Speed 499999999: ceil(1000000000/499999999)=3 hours ✗
   - Minimum speed is 500000000

5. Input: piles = [312884132,968299470,310146142], h = 968709470, Output = 1  
   - 3 enormous piles, huge time limit
   - Total bananas: 312884132 + 968299470 + 310146142 = 1591329744
   - Speed 1: total hours = sum of all piles = 1591329744 > 968709470 ✗
   - Binary search finds minimum speed where each pile ceil division sums to ≤ h

### Pseudocode:
```
WHY BINARY SEARCH ON ANSWER?
- Need minimum speed that allows finishing in time
- Speed directly affects total hours (faster speed = fewer hours needed)
- Relationship: given speed k, total_hours = sum of ceil(pile/k)
- Can binary search on speed: if speed k works, try slower; if not, try faster
- Search space: 1 to max(piles)

1. Helper function canFinish(speed):
   - Calculate total hours needed for this speed
   - Sum up ceil(pile/speed) for all piles
   - Return if total hours <= h
   
2. Binary search on speed:
   - left = 1, right = max(piles)
   - While left < right:
     mid = (left + right) / 2
     If canFinish(mid): we can go slower, right = mid
     Else: we need faster speed, left = mid + 1
3. Return left (minimum speed that works)
```

### C# Solution:
```csharp
public int MinEatingSpeed(int[] piles, int h) {
    int left = 1, right = piles.Max();
    
    while (left < right) {
        int mid = (left + right) / 2;
        if (CanFinish(piles, h, mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

private bool CanFinish(int[] piles, int h, int speed) {
    long hours = 0;
    foreach (int pile in piles) {
        hours += (pile + speed - 1) / speed; // Ceiling division
    }
    return hours <= h;
}
```

### Complexity

**Time Complexity**: O(n * log(max(piles))) where n is the number of piles. We do log(max(piles)) binary search iterations, and each iteration checks all piles.

**Space Complexity**: O(1) excluding the input array.
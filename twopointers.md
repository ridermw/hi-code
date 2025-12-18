# Two Pointers Problems

## 1. Container With Most Water

### Description:
Given n non-negative integers representing vertical lines, find two lines that form a container which holds the most water.

### Examples:
1. Input: [1,8,6,2,5,4,8,3,7] → Output: 49 (Lines at index 1 and 8)
2. Input: [1,1] → Output: 1 (Lines at index 0 and 1)
3. Input: [4,3,2,1,4] → Output: 16 (Lines at index 0 and 4)

### Pseudocode:
```
Initialize left = 0, right = array.length - 1
Initialize maxWater = 0

While left < right:
    Calculate currentWater = min(height[left], height[right]) * (right - left)
    Update maxWater = max(maxWater, currentWater)
    
    If height[left] < height[right]:
        left++
    Else:
        right--
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

## 2. Two Sum Sorted

### Description:
Given a sorted array and target sum, find two indices such that their values add up to the target.

### Examples:
1. Input: [2,7,11,15], target = 9 → Output: [1,2] (indices 1 and 2)
2. Input: [2,3,4], target = 6 → Output: [1,3] (indices 1 and 3)
3. Input: [-1,0], target = -1 → Output: [1,2] (indices 1 and 2)

### Pseudocode:
```
Initialize left = 0, right = array.length - 1

While left < right:
    Calculate sum = array[left] + array[right]
    
    If sum == target:
        Return [left + 1, right + 1] (1-indexed)
    Else if sum < target:
        left++
    Else:
        right--
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

## 3. Three Sum

### Description:
Find all unique triplets that sum to zero in an array.

### Examples:
1. Input: [-1,0,1,2,-1,-4] → Output: [[-1,-1,2], [-1,0,1]]
2. Input: [0,1,1] → Output: []
3. Input: [0,0,0] → Output: [[0,0,0]]

### Pseudocode:
```
Sort array
For i from 0 to length - 3:
    If i > 0 and array[i] == array[i-1]: continue (skip duplicates)
    
    Initialize left = i + 1, right = array.length - 1
    
    While left < right:
        Calculate sum = array[i] + array[left] + array[right]
        
        If sum == 0:
            Add triplet to result
            Skip duplicates for left and right
            
        Else if sum < 0:
            left++
        Else:
            right--
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

## 4. Triangle Numbers

### Description:
Count the number of valid triangles that can be formed with given array elements.

### Examples:
1. Input: [2,2,3,4] → Output: 3 (Valid triangles: [2,3,4], [2,3,4], [2,2,3])
2. Input: [4,3,2,1] → Output: 0 (No valid triangles)
3. Input: [1,2,3,4,5] → Output: 7 (Valid triangles)

### Pseudocode:
```
Sort array
Initialize count = 0

For i from 0 to length - 3:
    For j from i+1 to length - 2:
        Find the rightmost k where array[k] < array[i] + array[j]
        Add (k - j) to count
        
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

## 5. Move Zeroes

### Description:
Move all zeros to the end of array while maintaining relative order of non-zero elements.

### Examples:
1. Input: [0,1,0,3,12] → Output: [1,3,12,0,0]
2. Input: [0] → Output: [0]
3. Input: [1,2,3] → Output: [1,2,3]

### Pseudocode:
```
Initialize writeIndex = 0

For i from 0 to array.length - 1:
    If array[i] != 0:
        array[writeIndex++] = array[i]

Fill remaining positions with 0
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

## 6. Sort Colors

### Description:
Sort an array containing only 0s, 1s, and 2s representing red, white, and blue colors.

### Examples:
1. Input: [2,0,2,1,1,0] → Output: [0,0,1,1,2,2]
2. Input: [2,0,1] → Output: [0,1,2]
3. Input: [0] → Output: [0]

### Pseudocode:
```
Initialize low = 0, mid = 0, high = array.length - 1

While mid <= high:
    If array[mid] == 0:
        Swap array[low] and array[mid]
        low++, mid++
    Else if array[mid] == 1:
        mid++
    Else:
        Swap array[mid] and array[high]
        high--
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

## 7. Trapping Rain Water

### Description:
Calculate how much water can be trapped between bars of given heights.

### Examples:
1. Input: [0,1,0,2,1,0,1,3,2,1,2,1] → Output: 6
2. Input: [3,0,2,0,4] → Output: 7
3. Input: [1,0,1] → Output: 1

### Pseudocode:
```
Initialize left = 0, right = array.length - 1
Initialize maxLeft = 0, maxRight = 0
Initialize totalWater = 0

While left < right:
    If array[left] <= array[right]:
        If array[left] >= maxLeft:
            maxLeft = array[left]
        Else:
            totalWater += maxLeft - array[left]
        left++
    Else:
        If array[right] >= maxRight:
            maxRight = array[right]
        Else:
            totalWater += maxRight - array[right]
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
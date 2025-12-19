# Heap Problems

## Heap Concept

### What is a Heap?
A heap is a specialized tree-based data structure that satisfies the heap property. In a max heap, for any given node, the node's value is greater than or equal to the values of its children. In a min heap, the node's value is less than or equal to its children. Heaps are typically implemented as binary heaps using arrays, where for element at index i, the left child is at 2i+1 and right child is at 2i+2.

### Core Operations:
- **Insert**: Add element and bubble up - O(log n)
- **Extract-Min/Max**: Remove root and bubble down - O(log n)
- **Peek**: View root element without removing - O(1)
- **Heapify**: Convert array to heap - O(n)
- **Build Heap**: Create heap from array - O(n)

### When to Use Heaps?
Use heaps when:
- Need to repeatedly find/remove min or max element
- Must maintain sorted order while adding/removing elements
- Problem asks for "Kth largest/smallest" element
- Need to merge K sorted lists or streams
- Priority queue functionality required
- Problem involves "top K", "closest K", or similar queries
- Must process elements in priority order

### Common Heap Patterns:
```
1. Top K Elements (Min Heap of size K):
   for each element:
       add to heap
       if heap.size > K: remove min
   result = all elements in heap
   
2. K-Way Merge (Min Heap):
   add first element from each list to heap
   while heap not empty:
       extract min, add to result
       add next element from same list to heap

3. Running Median (Two Heaps):
   maxHeap (lower half), minHeap (upper half)
   maintain balance: sizes differ by at most 1
   median = root(s) of heap(s)
```

### Example:
**Problem:** Find the Kth largest element in array

**Why Heap?** We need the Kth largest, not all elements sorted. Sorting entire array is O(n log n). Instead, maintain a min heap of size K containing the K largest elements seen so far. The root is always the Kth largest. For each element: if larger than root, it belongs in top K - remove root, add new element. This is O(n log K), much better when K << n.

**Without Heap:** Sort entire array, pick Kth element → O(n log n)
**With Heap:** Maintain size-K min heap → O(n log K)

---

## Kth Largest Element in an Array | LeetCode 215 | Medium
Given an integer array `nums` and an integer `k`, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element. Can you solve it without sorting?

### Examples:
1. Input: nums = [3,2,1,5,6,4], k = 2, Output = 5  
   - Sorted: [6,5,4,3,2,1]
   - 2nd largest is 5
   - Min heap approach: maintain heap [5,6] of size 2
   - Root of heap (5) is the 2nd largest

2. Input: nums = [3,2,3,1,2,4,5,5,6], k = 4, Output = 4  
   - Sorted: [6,5,5,4,3,3,2,2,1]
   - 4th largest is 4
   - Min heap maintains [4,5,5,6] of size 4
   - Root is 4

3. Input: nums = [1], k = 1, Output = 1  
   - Single element, 1st largest is 1
   - Heap contains only [1]

4. Input: nums = [7,6,5,4,3,2,1], k = 5, Output = 3  
   - Already sorted descending
   - 5th largest: 3
   - Heap maintains [3,4,5,6,7] of size 5
   - Root is 3

5. Input: nums = [3,2,3,1,2,4,5,5,6,7,7,8,2,3,1,1,1,10,11,5,6,2,4,7,8,5,6], k = 20, Output = 2  
   - Large array with duplicates (27 elements)
   - Sorted: [11,10,8,8,7,7,7,6,6,6,5,5,5,5,4,4,3,3,3,3,2,2,2,2,1,1,1]
   - 20th largest is 3
   - Maintain heap of size 20, root gives answer

### Pseudocode:
```
WHY MIN HEAP OF SIZE K?
- Don't need full sort, just Kth largest
- Full sort: O(n log n)
- Min heap of size K: smallest element at root
- If new element > root: it's in top K, remove root, add new
- After processing all: root is exactly Kth largest
- Time: O(n log K), better than O(n log n) when K is small

1. Create a min heap (priority queue)
2. Add first K elements to the heap
3. For remaining elements (from index K to n-1):
   - If current element > heap root (min element in heap):
     Remove root from heap
     Add current element to heap
4. Return the root of the heap (Kth largest)
```

### C# Solution:
```csharp
public int FindKthLargest(int[] nums, int k) {
    PriorityQueue<int, int> minHeap = new PriorityQueue<int, int>();
    
    for (int i = 0; i < nums.Length; i++) {
        minHeap.Enqueue(nums[i], nums[i]);
        if (minHeap.Count > k) {
            minHeap.Dequeue();
        }
    }
    
    return minHeap.Peek();
}
```

### Complexity

**Time Complexity**: O(n log k) where n is the length of the array and k is the kth largest element. We process each element once, and each heap operation takes O(log k).

**Space Complexity**: O(k) for storing k elements in the heap.

## K Closest Points to Origin | LeetCode 973 | Medium
Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin (0, 0). The distance between two points on the X-Y plane is the Euclidean distance (√((x1 - x2)² + (y1 - y2)²)). You may return the answer in any order.

### Examples:
1. Input: points = [[1,3],[-2,2]], k = 1, Output = [[-2,2]]  
   - Distance [1,3]: √(1² + 3²) = √10 ≈ 3.16
   - Distance [-2,2]: √(4 + 4) = √8 ≈ 2.83
   - Closer point: [-2,2]

2. Input: points = [[3,3],[5,-1],[-2,4]], k = 2, Output = [[3,3],[-2,4]]  
   - Distance [3,3]: √(9 + 9) = √18 ≈ 4.24
   - Distance [5,-1]: √(25 + 1) = √26 ≈ 5.10
   - Distance [-2,4]: √(4 + 16) = √20 ≈ 4.47
   - 2 closest: [3,3] and [-2,4]

3. Input: points = [[0,1],[1,0]], k = 2, Output = [[0,1],[1,0]]  
   - Both at distance 1 from origin
   - Return both (order doesn't matter)

4. Input: points = [[1,1],[2,2],[3,3],[4,4],[5,5]], k = 3, Output = [[1,1],[2,2],[3,3]]  
   - All on diagonal, sorted by distance
   - Distances: √2, √8, √18, √32, √50
   - Take first 3

5. Input: points = [[68,97],[34,-84],[60,100],[2,31],[-27,-38],[-73,-74],[-55,-39],[62,91],[62,92],[-57,-67]], k = 5, Output = [[2,31],[-27,-38],[-55,-39],[-57,-67],[34,-84]]  
   - 10 points, need 5 closest
   - Calculate all distances, maintain heap of size 5
   - Max heap keeps farthest of the K closest at root

### Pseudocode:
```
WHY MAX HEAP OF SIZE K?
- Need K closest points, don't need all points sorted
- Full sort: O(n log n)
- Max heap of size K: farthest point at root
- If new point closer than root: it's in top K, remove root, add new
- After processing: heap contains K closest
- Time: O(n log K), better when K << n

1. Create a max heap (priority queue) based on distance
2. Calculate distance: can use x² + y² (skip sqrt for efficiency)
3. Add first K points to the heap
4. For remaining points:
   - Calculate distance of current point
   - If current distance < max distance in heap (root):
     Remove root from heap
     Add current point to heap
5. Return all points in the heap
```

### C# Solution:
```csharp
public int[][] KClosest(int[][] points, int k) {
    PriorityQueue<int[], int> maxHeap = new PriorityQueue<int[], int>(
        Comparer<int>.Create((a, b) => b.CompareTo(a))
    );
    
    foreach (var point in points) {
        int dist = point[0] * point[0] + point[1] * point[1];
        maxHeap.Enqueue(point, dist);
        
        if (maxHeap.Count > k) {
            maxHeap.Dequeue();
        }
    }
    
    int[][] result = new int[k][];
    for (int i = 0; i < k; i++) {
        result[i] = maxHeap.Dequeue();
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n log k) where n is the number of points and k is the number of closest points. Each point is processed once with heap operations taking O(log k).

**Space Complexity**: O(k) for storing k points in the heap.

## Merge K Sorted Lists | LeetCode 23 | Hard
You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.

### Examples:
1. Input: lists = [[1,4,5],[1,3,4],[2,6]], Output = [1,1,2,3,4,4,5,6]  
   - 3 sorted lists
   - List 1: 1→4→5
   - List 2: 1→3→4
   - List 3: 2→6
   - Merged: 1→1→2→3→4→4→5→6

2. Input: lists = [], Output = []  
   - Empty input
   - Return empty list

3. Input: lists = [[]], Output = []  
   - Single empty list
   - Return empty list

4. Input: lists = [[1],[2],[3],[4],[5]], Output = [1,2,3,4,5]  
   - 5 lists, each with single element
   - Already sorted: 1→2→3→4→5

5. Input: lists = [[-10,-9,-9,-3,-1,-1,0],[-5],[4],[-8],[-9,-6,-5,-4,-2,2,3],[-3,-3,-2,-1,0]], Output = [-10,-9,-9,-9,-8,-6,-5,-5,-4,-3,-3,-3,-2,-2,-1,-1,-1,0,0,2,3,4]  
   - 6 lists of varying lengths (total 22 nodes)
   - Multiple negative numbers and duplicates
   - Final merged list maintains ascending order

### Pseudocode:
```
WHY MIN HEAP?
- Need to repeatedly find minimum across K lists
- Brute force: scan all K list heads each time → O(nK) where n = total nodes
- Min heap: always has minimum at root → O(log K) per operation
- Add first node from each list to heap
- Extract min, add to result, add next node from same list
- Time: O(n log K) for n total nodes across K lists

1. Create a min heap based on node values
2. Add the head of each non-empty list to the heap
3. Create a dummy head for the result list
4. While heap is not empty:
   - Extract minimum node from heap
   - Add it to result list
   - If extracted node has a next node:
     Add next node to heap
5. Return result list (dummy.next)
```

### C# Solution:
```csharp
public ListNode MergeKLists(ListNode[] lists) {
    if (lists == null || lists.Length == 0) return null;
    
    PriorityQueue<ListNode, int> minHeap = new PriorityQueue<ListNode, int>();
    
    foreach (var list in lists) {
        if (list != null) {
            minHeap.Enqueue(list, list.val);
        }
    }
    
    ListNode dummy = new ListNode(0);
    ListNode current = dummy;
    
    while (minHeap.Count > 0) {
        ListNode node = minHeap.Dequeue();
        current.next = node;
        current = current.next;
        
        if (node.next != null) {
            minHeap.Enqueue(node.next, node.next.val);
        }
    }
    
    return dummy.next;
}
```

### Complexity

**Time Complexity**: O(n log k) where n is the total number of nodes across all lists and k is the number of lists. Each node is added and removed from the heap once.

**Space Complexity**: O(k) for storing at most k nodes in the heap at any time.

## Find K Closest Elements | LeetCode 658 | Medium
Given a sorted integer array `arr`, two integers `k` and `x`, return the `k` closest integers to `x` in the array. The result should also be sorted in ascending order. An integer `a` is closer to `x` than an integer `b` if: |a - x| < |b - x|, or |a - x| == |b - x| and a < b.

### Examples:
1. Input: arr = [1,2,3,4,5], k = 4, x = 3, Output = [1,2,3,4]  
   - Distances from 3: |1-3|=2, |2-3|=1, |3-3|=0, |4-3|=1, |5-3|=2
   - 4 closest: 3 (dist 0), 2 (dist 1), 4 (dist 1), then 1 or 5 (dist 2)
   - Tie at dist 1: prefer 2 over 4 (smaller value)
   - Result: [1,2,3,4]

2. Input: arr = [1,2,3,4,5], k = 4, x = -1, Output = [1,2,3,4]  
   - Target -1 is left of array
   - All elements at positive distances
   - 4 closest are simply first 4 elements

3. Input: arr = [1,1,1,10,10,10], k = 1, x = 9, Output = [10]  
   - Distances: |1-9|=8, |10-9|=1
   - Closest is 10

4. Input: arr = [0,0,1,2,3,3,4,7,7,8], k = 3, x = 5, Output = [3,3,4]  
   - 10 elements, need 3 closest to 5
   - Distances: |0-5|=5, |1-5|=4, |2-5|=3, |3-5|=2, |4-5|=1, |7-5|=2, |8-5|=3
   - Closest: 4 (dist 1), then 3 and 3 (dist 2), then ties
   - Result: [3,3,4]

5. Input: arr = [1,3,5,7,9,11,13,15,17,19], k = 5, x = 10, Output = [7,9,11,13,15]  
   - 10 elements, need 5 closest to 10
   - Distances: |1-10|=9, |3-10|=7, |5-10|=5, |7-10|=3, |9-10|=1, |11-10|=1, |13-10|=3, |15-10|=5, |17-10|=7, |19-10|=9
   - Closest: 9 (dist 1), 11 (dist 1), 7 (dist 3), 13 (dist 3), then 5 or 15 (dist 5)
   - Prefer smaller when tied: but maintain sorted order
   - Result: [7,9,11,13,15]

### Pseudocode:
```
WHY MAX HEAP OF SIZE K?
- Need K closest elements from sorted array
- Could use two pointers (optimal for sorted array)
- Heap approach: maintain K closest seen so far
- Max heap: farthest of K closest at root
- If new element closer than root: remove root, add new
- Time: O(n log K)
- Note: Two-pointer or binary search + expand might be O(log n + K), better for sorted input

1. Create a max heap based on distance to x
2. Use custom comparator: distance first, then value (smaller preferred)
3. For each element in array:
   - Calculate distance: |element - x|
   - Add to heap with priority (distance, value)
   - If heap size > K: remove max
4. Extract all K elements from heap
5. Sort result in ascending order
6. Return result
```

### C# Solution:
```csharp
public IList<int> FindClosestElements(int[] arr, int k, int x) {
    PriorityQueue<int, (int, int)> maxHeap = new PriorityQueue<int, (int, int)>(
        Comparer<(int dist, int val)>.Create((a, b) => {
            int cmp = b.dist.CompareTo(a.dist);
            if (cmp == 0) return b.val.CompareTo(a.val);
            return cmp;
        })
    );
    
    foreach (int num in arr) {
        int dist = Math.Abs(num - x);
        maxHeap.Enqueue(num, (dist, num));
        
        if (maxHeap.Count > k) {
            maxHeap.Dequeue();
        }
    }
    
    List<int> result = new List<int>();
    while (maxHeap.Count > 0) {
        result.Add(maxHeap.Dequeue());
    }
    
    result.Sort();
    return result;
}
```

### Complexity

**Time Complexity**: O(n log k + k log k) where n is the array length and k is the number of closest elements. We process n elements with heap operations of O(log k), then sort the result of size k.

**Space Complexity**: O(k) for storing k elements in the heap.

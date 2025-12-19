# Greedy Problems

## Greedy Concept

### What is a Greedy Algorithm?
A greedy algorithm makes locally optimal choices at each step with the hope of finding a global optimum. Unlike dynamic programming which considers all possibilities, greedy algorithms commit to a choice without looking back. Greedy works when local optimal choices lead to global optimal solution (greedy choice property + optimal substructure).

### Core Operations:
- **Choose**: Select best option at current step - O(1) to O(log n)
- **Update State**: Modify problem based on choice - O(1)
- **Verify**: Check if solution is valid/optimal - O(n)
- **Sort** (often): Order elements to enable greedy selection - O(n log n)

### When to Use Greedy?
Use greedy when:
- Problem has greedy choice property (local optimum → global optimum)
- Can prove greedy strategy works (often via exchange argument)
- Need optimal solution and greedy is provably correct
- Problem involves intervals, scheduling, or selection
- Keywords: "maximum", "minimum" with specific constraints
- Sorting helps reveal optimal strategy
- DP would work but greedy is simpler and faster

### Common Greedy Patterns:
```
1. Interval Scheduling:
   Sort intervals by end time
   Select interval that ends earliest
   Remove overlapping intervals
   Repeat
   
2. Huffman Coding / Merge:
   Always merge two smallest elements
   Use min heap for efficiency
   Continue until one element remains
   
3. Fractional Knapsack:
   Sort items by value/weight ratio
   Take items with best ratio first
   Fill knapsack greedily
```

### Example:
**Problem:** Activity Selection - maximize number of non-overlapping activities

**Why Greedy?** Sort by end time, always pick activity that finishes earliest. This leaves maximum room for future activities. Proof: if optimal solution differs, we can swap our choice with optimal's choice without making it worse. Greedy gives optimal solution in O(n log n) time.

**Without Greedy:** Try all combinations → O(2^n) exponential
**With Greedy:** Sort and select greedily → O(n log n)

---

## Best Time to Buy and Sell Stock | LeetCode 121 | Easy
You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

### Examples:
1. Input: prices = [7,1,5,3,6,4], Output = 5  
   - Buy on day 2 (price = 1)
   - Sell on day 5 (price = 6)
   - Profit = 6 - 1 = 5

2. Input: prices = [7,6,4,3,1], Output = 0  
   - Prices only decrease
   - No profitable transaction possible

3. Input: prices = [2,4,1], Output = 2  
   - Buy at 2, sell at 4
   - Profit = 2

4. Input: prices = [3,2,6,5,0,3], Output = 4  
   - Buy at 2, sell at 6
   - Profit = 4
   - Not: buy at 0, sell at 3 (0 comes after 6)

5. Input: prices = [1,2,3,4,5,6,7,8,9,10], Output = 9  
   - Buy at 1, sell at 10
   - Continuous increase: profit = 10 - 1 = 9

### Pseudocode:
```
WHY GREEDY?
- Need to buy before selling (one pass)
- Track minimum price seen so far
- At each day: calculate profit if we sell today (current - min)
- Update max profit if current profit is better
- Greedy: always buy at lowest price seen so far
- O(n) time, O(1) space

1. Initialize minPrice = infinity, maxProfit = 0
2. For each price in prices:
   - If price < minPrice: update minPrice = price
   - Else: calculate profit = price - minPrice
     Update maxProfit = max(maxProfit, profit)
3. Return maxProfit
```

### C# Solution:
```csharp
public int MaxProfit(int[] prices) {
    int minPrice = int.MaxValue;
    int maxProfit = 0;
    
    foreach (int price in prices) {
        if (price < minPrice) {
            minPrice = price;
        } else {
            maxProfit = Math.Max(maxProfit, price - minPrice);
        }
    }
    
    return maxProfit;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of days. Single pass through array.

**Space Complexity**: O(1) using only two variables.

## Jump Game | LeetCode 55 | Medium
You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return `true` if you can reach the last index, or `false` otherwise.

### Examples:
1. Input: nums = [2,3,1,1,4], Output = true  
   - Jump 1 step from index 0 to 1
   - Jump 3 steps from index 1 to 4 (last index)

2. Input: nums = [3,2,1,0,4], Output = false  
   - Always land at index 3 (value 0)
   - Cannot jump past index 3

3. Input: nums = [0], Output = true  
   - Already at last index
   - No jump needed

4. Input: nums = [2,0,0], Output = true  
   - Jump 2 steps from index 0 to index 2

5. Input: nums = [1,1,1,1,1], Output = true  
   - Jump 1 step each time
   - Can reach end

### Pseudocode:
```
WHY GREEDY?
- Track farthest reachable position
- If current position > farthest: unreachable, return false
- Update farthest = max(farthest, i + nums[i])
- If farthest >= last index: can reach end
- Greedy: always extend reach as far as possible
- O(n) time, O(1) space

1. Initialize maxReach = 0
2. For i from 0 to n-1:
   - If i > maxReach: return false (position unreachable)
   - Update maxReach = max(maxReach, i + nums[i])
   - If maxReach >= n-1: return true (can reach end)
3. Return true
```

### C# Solution:
```csharp
public bool CanJump(int[] nums) {
    int maxReach = 0;
    
    for (int i = 0; i < nums.Length; i++) {
        if (i > maxReach) return false;
        
        maxReach = Math.Max(maxReach, i + nums[i]);
        
        if (maxReach >= nums.Length - 1) return true;
    }
    
    return true;
}
```

### Complexity

**Time Complexity**: O(n) where n is the length of the array. Single pass through array.

**Space Complexity**: O(1) using only one variable.

## Gas Station | LeetCode 134 | Medium
There are `n` gas stations along a circular route, where the amount of gas at the ith station is `gas[i]`. You have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.

### Examples:
1. Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2], Output = 3  
   - Start at station 3
   - Tank: 0 + 4 - 1 = 3
   - Tank: 3 + 5 - 2 = 6
   - Tank: 6 + 1 - 3 = 4
   - Tank: 4 + 2 - 4 = 2
   - Tank: 2 + 3 - 5 = 0
   - Complete circuit

2. Input: gas = [2,3,4], cost = [3,4,3], Output = -1  
   - Total gas = 9, total cost = 10
   - Insufficient gas overall
   - Impossible to complete circuit

3. Input: gas = [5,1,2,3,4], cost = [4,4,1,5,1], Output = 4  
   - Start at station 4
   - Net gains: [1,-3,1,-2,3]
   - Starting at 4 works

4. Input: gas = [3,3,4], cost = [3,4,4], Output = -1  
   - Net: [0,-1,0]
   - Cannot complete from any start

5. Input: gas = [4,5,2,6,5,3], cost = [3,2,7,3,2,9], Output = 5  
   - Net: [1,3,-5,3,3,-6]
   - Total net = -1, wait that doesn't work
   - Recalculating: total gas = 25, total cost = 26
   - Actually impossible

### Pseudocode:
```
WHY GREEDY?
- If total gas < total cost: impossible
- Key insight: if we fail to reach station j from i, no station between i and j can work
- Start from next station after failure point
- Greedy: only need to check one candidate start position
- O(n) time, O(1) space

1. Calculate totalGas and totalCost
2. If totalGas < totalCost: return -1
3. Initialize tank = 0, start = 0
4. For i from 0 to n-1:
   - tank += gas[i] - cost[i]
   - If tank < 0:
     start = i + 1 (reset start to next station)
     tank = 0
5. Return start
```

### C# Solution:
```csharp
public int CanCompleteCircuit(int[] gas, int[] cost) {
    int totalGas = 0, totalCost = 0;
    int tank = 0, start = 0;
    
    for (int i = 0; i < gas.Length; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
        tank += gas[i] - cost[i];
        
        if (tank < 0) {
            start = i + 1;
            tank = 0;
        }
    }
    
    return totalGas >= totalCost ? start : -1;
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of gas stations. Single pass through arrays.

**Space Complexity**: O(1) using only a few variables.

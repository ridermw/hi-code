# Stack Problems

## Stack Concept

### What is a Stack?
A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Elements can only be added or removed from the top of the stack. Think of it like a stack of plates - you can only add or remove from the top.

### Core Operations:
- **Push**: Add element to top - O(1)
- **Pop**: Remove element from top - O(1)
- **Peek/Top**: View top element without removing - O(1)
- **IsEmpty**: Check if stack is empty - O(1)

### When to Use Stacks?
Use stacks when:
- Need to process elements in reverse order of arrival
- Must match/validate pairs (parentheses, tags)
- Need to track previous states or positions
- Problem involves nested structures
- Required to "undo" or backtrack operations

### Common Stack Patterns:
```
1. Matching Pairs (Parentheses, Tags):
   for each character:
       if opening: push to stack
       if closing: pop and validate match
   
2. Monotonic Stack (Next Greater/Smaller):
   for each element:
       while stack not empty AND condition met:
           pop and process
       push current element

3. Expression Evaluation:
   Parse operators and operands
   Use stack to maintain order of operations
```

### Example:
**Problem:** Find next warmer temperature for each day

**Why Stack?** We need to find the next day where temperature is higher. Instead of checking all future days for each current day (O(n²)), we use a monotonic stack. As we iterate, if current temp is warmer than stack top, we've found the answer for that day. Stack maintains indices of days waiting for a warmer day.

**Without Stack:** For each day, scan all future days → O(n²)
**With Stack:** Process each element once, pop when condition met → O(n)

---

## Valid Parentheses (LeetCode Problem 20)
Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

### Examples:
1. Input = "()", Output = true since the string contains balanced parentheses.
2. Input = "()[]{}", Output = true since the string contains balanced parentheses of different types.
3. Input = "(]", Output = false since the opening bracket is not closed by the correct closing bracket.

### Pseudocode:
```
WHY STACK?
- Brackets must close in correct order: last opened must close first (LIFO)
- Can't use simple counter (multiple bracket types, order matters)
- Stack naturally tracks "most recent unclosed" bracket
- When closing bracket found, must match most recent opening → perfect for stack.pop()
- O(n) time instead of complex nested tracking

1. Use a stack to store opening parentheses
2. Iterate through the input string, character by character
3. If the current character is an open bracket, push it to the stack
4. If the current character is a closing bracket:
   - If the stack is empty, return false (no matching opening)
   - Pop the top element from the stack and check if it matches the current closing bracket
   - If not, return false (wrong type)
5. After iterating through all characters:
   - If the stack is empty, return true (all matched)
   - Otherwise, false (unclosed brackets remain)
```

### C# Solution:
```csharp
public bool IsValid(string s) {
    Stack<char> stack = new Stack<char>();
    foreach (var c in s) {
        if (c == '(' || c == '{' || c == '[') {
            stack.Push(c);
        } else {
            if (stack.Count == 0) return false;
            char openBracket = stack.Pop();
            if (c == ')' && openBracket != '(') return false;
            if (c == '}' && openBracket != '{') return false;
            if (c == ']' && openBracket != '[') return false;
        }
    }
    return stack.Count == 0;
}
```
- Time Complexity: O(n) since we iterate through the input string once.
- Space Complexity: O(n) in the worst case where all characters are opening brackets.

## Decode String (LeetCode Problem 394)
Given an encoded string, return its decoded string. The encoding rule is: `k[encoded_string]`, where the encoded_string inside the square brackets is being repeated exactly k times. Note that `k` is guaranteed to be a positive integer. You may assume that the input string is always valid; No extra white spaces, square brackets are well-formed, etc. Furthermore, you may assume that the original data does not contain any digits and that digits are only for those repeat numbers, `k`. For example, there won't be input like `3a` or `2[4]`.

### Examples:
1. Input = "3[a]2[bc]", Output = "aaabcbc"
2. Input = "3[a2[c]]", Output = "accaccacc"
3. Input = "2[abc]3[cd]ef", Output = "abcabccdcdcdef"

### Pseudocode:
```
WHY STACK?
- Nested brackets require processing innermost first, then outer (LIFO order)
- Can't decode left-to-right linearly due to nesting: "3[a2[c]]" needs "2[c]"→"cc" first
- Stack tracks context: when we hit '[', save current state (previous string, count)
- When we hit ']', pop context, multiply current string, append to previous
- This handles arbitrary nesting depth naturally

1. Use two stacks: one for numbers, one for strings (or one stack of pairs)
2. Initialize current string and current number
3. Iterate through each character:
   - If digit: accumulate number (handle multi-digit like 12)
   - If '[': push current number and current string to stacks, reset both
   - If ']': pop number and previous string, repeat current string, prepend previous
   - If letter: append to current string
4. Return current string
```

### C# Solution:
```csharp
public string DecodeString(string s) {
    Stack<int> countStack = new Stack<int>();
    Stack<string> stringStack = new Stack<string>();
    string currentString = "";
    int currentNum = 0;
    
    foreach (char c in s) {
        if (char.IsDigit(c)) {
            // Build multi-digit number
            currentNum = currentNum * 10 + (c - '0');
        } else if (c == '[') {
            // Save current state and start new context
            countStack.Push(currentNum);
            stringStack.Push(currentString);
            currentNum = 0;
            currentString = "";
        } else if (c == ']') {
            // Decode: pop count and previous string
            int repeatCount = countStack.Pop();
            string previousString = stringStack.Pop();
            
            // Build repeated string
            StringBuilder repeated = new StringBuilder(previousString);
            for (int i = 0; i < repeatCount; i++) {
                repeated.Append(currentString);
            }
            currentString = repeated.ToString();
        } else {
            // Regular character, append to current string
            currentString += c;
        }
    }
    
    return currentString;
}
```

- **Time Complexity**: O(n) where n is the length of the decoded string. Each character in the input is processed once, but may be repeated in the output.
- **Space Complexity**: O(n) for the stacks and intermediate strings during nested decoding.

## Longest Valid Parentheses (LeetCode Problem 32)
Given a string consisting of opening and closing parentheses, find the length of the longest valid (well-formed) parentheses substring.

### Examples:
1. Input = "(()", Output = 2 since the longest valid substring is "()" with a length of 2.
2. Input = ")()())", Output = 4 since the longest valid substring is "()()" with a length of 4.
3. Input = "", Output = 0 since there are no valid parentheses in the string.

### Pseudocode:
```
WHY STACK WITH INDICES?
- Need to find longest valid substring, not just count matches
- Indices help calculate lengths of valid substrings
- Stack tracks positions of unmatched characters (boundaries)
- When match found: distance from stack top gives substring length
- Initial -1 provides base for length calculation

1. Use a stack to store indices
2. Push -1 to the stack (base for length calculation)
3. Iterate through the input string, character by character:
4. If current character is '(':
   - Push its index to the stack
5. If current character is ')':
   - Pop the top index from the stack
   - If stack is not empty: calculate length as (i - stack.Peek())
     Update max length if larger
   - If stack is empty: push current index (new base, marks invalid position)
6. Return the max length found
```

### C# Solution:
```csharp
public int LongestValidParentheses(string s) {
    Stack<int> stack = new Stack<int>();
    stack.Push(-1);
    int maxLength = 0;
    for (int i = 0; i < s.Length; i++) {
        if (s[i] == '(') stack.Push(i);
        else {
            stack.Pop();
            if (stack.Count > 0) maxLength = Math.Max(maxLength, i - stack.Peek());
            else stack.Push(i);
        }
    }
    return maxLength;
}
```
- Time Complexity: O(n) since we iterate through the input string once.
- Space Complexity: O(n) in the worst case where all characters are opening parentheses.

## Daily Temperatures (LeetCode Problem 739)
Given an array `T` representing the daily temperatures, return an array such that `ans[i]` contains the number of days until a warmer temperature. If there is no future day for which this is possible, keep `ans[i]` equals to 0 instead.

### Examples:
1. Input = [73, 74, 75, 71, 69, 72, 76, 73], Output = [1, 1, 4, 2, 1, 1, 0, 0]
2. Input = [30,40,50,60], Output = [1, 1, 1, 0]
3. Input = [30,60,90], Output = [1, 1, 0]

### Pseudocode:
```
WHY MONOTONIC STACK?
- Need "next greater element" for each position
- Brute force: for each day, scan all future days → O(n²)
- Monotonic decreasing stack: maintains days waiting for warmer temp
- When warmer day found, all colder days in stack are resolved
- Each element pushed/popped exactly once → O(n)

1. Use a stack to store indices of daily temperatures
2. Initialize result array with zeros
3. Iterate through the input array, temperature by temperature:
4. While stack is not empty AND current temperature > temperature at stack top:
   - Pop the top index (j) from the stack
   - Calculate days to wait: i - j (NOT i - stack.Peek())
   - Update result[j] = i - j
5. Push the current index to the stack
6. Return the result array (remaining stack elements stay 0)
```

### C# Solution:
```csharp
public int[] DailyTemperatures(int[] T) {
    Stack<int> stack = new Stack<int>();
    int[] ans = new int[T.Length];
    for (int i = 0; i < T.Length; i++) {
        while (stack.Count > 0 && T[i] > T[stack.Peek()]) {
            int j = stack.Pop();
            ans[j] = i - j;
        }
        stack.Push(i);
    }
    return ans;
}
```
- Time Complexity: O(n) since we iterate through the input array once. In the worst case, each element is pushed and popped from the stack exactly once.
- Space Complexity: O(n) in the worst case where all elements are pushed to the stack.

## Largest Rectangle in Histogram (LeetCode Problem 84)
Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, find the area of the largest rectangle in the histogram.

### Examples:
1. Input = [2, 1, 5, 6, 2, 3], Output = 10 
   - Rectangle with height 5: extends from index 2 to 3 (width 2) = 5×2 = 10
   - This is the maximum area possible
2. Input = [2, 4], Output = 4 since the largest rectangle is one bar of height 4 with area 4.
3. Input = [1,2,3,4,5], Output = 9 
   - Rectangle with height 3: extends from index 0 to 4 (width 5 at height 1, or width 3 at height 3)
   - Best is height 3 × width 3 = 9

### Pseudocode:
```
WHY MONOTONIC STACK?
- For each bar, need to find how far left/right it can extend at its height
- Brute force: for each bar, expand left and right → O(n²)
- Monotonic increasing stack: when shorter bar found, all taller bars are bounded
- Stack maintains indices where heights are increasing
- On pop: we know the width (bounded by stack top and current index)
- Each element pushed/popped once → O(n)

1. Use a stack to store indices (maintaining increasing heights)
2. Initialize maxArea = 0
3. Iterate through array (plus one virtual bar at end with height 0):
4. While stack not empty AND current height < height at stack top:
   - Pop the top index (this is the rectangle's height)
   - Calculate width: if stack empty, width = i; else width = i - stack.Peek() - 1
   - Calculate area = height × width
   - Update maxArea if larger
5. Push current index to stack
6. Return maxArea
```

### C# Solution:
```csharp
public int LargestRectangleArea(int[] heights) {
    Stack<int> stack = new Stack<int>();
    int maxArea = 0;
    for (int i = 0; i <= heights.Length; i++) {
        while (stack.Count > 0 && (i == heights.Length || heights[i] < heights[stack.Peek()])) {
            int height = heights[stack.Pop()];
            int width = stack.Count == 0 ? i : i - stack.Peek() - 1;
            maxArea = Math.Max(maxArea, height * width);
        }
        stack.Push(i);
    }
    return maxArea;
}
```
- Time Complexity: O(n) since we iterate through the input array once. In the worst case, each element is pushed and popped from the stack exactly once.
- Space Complexity: O(n) in the worst case where all elements are pushed to the stack.

These Stack problems require us to use data structures such as stacks and linked lists to solve various string-based questions. The stack data structure is useful because it allows us to store and retrieve elements in a last-in, first-out (LIFO) manner. This property is helpful for solving problems related to string manipulation and validation, as it allows us to easily keep track of the previous state or value. By using stacks, we can solve problems such as validating parentheses, decoding encoded strings, finding the longest valid parentheses substring, and calculating the area of the largest rectangle in a histogram. The time complexity of these solutions is O(n), where n is the length of the input string or array, because we iterate through each character or element exactly once. The space complexity is also O(n) in the worst case, because we may need to store all characters or elements in a stack.
# Stack Problems

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
1. Use a stack to store opening parentheses.
2. Iterate through the input string, character by character.
3. If the current character is an open bracket, push it to the stack.
4. If the current character is a closing bracket:
   - If the stack is empty, return false.
   - Pop the top element from the stack and check if it matches the current closing bracket. If not, return false.
5. After iterating through all characters:
   - If the stack is empty, return true. Otherwise, false.

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
1. Use two stacks, one for numbers (`numStack`) and the other for strings (`strStack`).
2. Iterate through the input string, character by character.
3. If the current character is a digit, convert it to an integer and push it to `numStack`.
4. If the current character is an open bracket, push the current encoded string to `strStack` and reset it.
5. If the current character is a closing bracket:
   - Pop the top encoded string from `strStack`.
   - Pop the top number from `numStack`.
   - Append the decoded encoded string (`encodedString.repeat(k)`) to the top of `strStack`.
6. After iterating through all characters, return the remaining string in `strStack` which is the decoded string.

### C# Solution:
```csharp
public string DecodeString(string s) {
    Stack<int> numStack = new Stack<int>();
    Stack<string> strStack = new Stack<string>();
    int num = 0;
    StringBuilder encodedString = new StringBuilder();
    foreach (var c in s) {
        if (char.IsDigit(c)) num = num * 10 + (c - '0');
        else if (char.IsLetter(c) || c == '[') encodedString.Append(c);
        else {
            numStack.Push(num);
            strStack.Push(encodedString.ToString());
            num = 0;
            encodedString.Clear();
        }
    }
    strStack.Push(encodedString.ToString());
    StringBuilder result = new StringBuilder();
    while (strStack.Count > 0) {
        int k = numStack.Pop();
        string encodedStr = strStack.Pop();
        for (int i = 0; i < k; i++) result.Append(encodedStr);
    }
    return result.ToString();
}
```
- Time Complexity: O(n) since we iterate through the input string once.
- Space Complexity: O(n) in the worst case where all characters are encoded strings.

## Longest Valid Parentheses (LeetCode Problem 32)
Given a string consisting of opening and closing parentheses, find the length of the longest valid (well-formed) parentheses substring.

### Examples:
1. Input = "(()", Output = 2 since the longest valid substring is "(())" with a length of 2.
2. Input = ")()())", Output = 4 since the longest valid substring is "()()" with a length of 4.
3. Input = "", Output = 0 since there are no valid parentheses in the string.

### Pseudocode:
1. Use a stack to store indices of opening parentheses.
2. Push -1 to the stack to indicate the beginning of the string.
3. Iterate through the input string, character by character.
4. If the current character is an open parenthesis, push its index to the stack.
5. If the current character is a closing parenthesis:
   - Pop the top index from the stack.
   - If the stack is not empty, calculate the length of the valid parentheses substring as `i - stack.Peek()`. Update the max length if it's larger than the current max length.
   - If the stack is empty, push the current index to the stack to indicate a potential start of a valid parentheses substring.
6. After iterating through all characters, return the max length found so far.

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
1. Use a stack to store indices of daily temperatures.
2. Iterate through the input array, temperature by temperature.
3. While the stack is not empty and the current temperature is warmer than the temperature at the top index of the stack:
   - Pop the top index from the stack.
   - Calculate the number of days to wait for a warmer temperature as `i - stack.Peek()` and update the output array at the popped index.
4. Push the current index to the stack.
5. After iterating through all temperatures, return the output array which contains the number of days to wait for a warmer temperature.

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
1. Input = [2, 1, 5, 6, 2, 3], Output = 10 since the largest rectangle is from index 1 to 4 with an area of 10.
2. Input = [2, 4], Output = 4 since the largest rectangle is either bar with an area of 4.
3. Input = [1,2,3,4,5], Output = 9 since the largest rectangle is from index 0 to 4 with an area of 9.

### Pseudocode:
1. Use a stack to store indices of increasing heights.
2. Iterate through the input array, height by height.
3. While the stack is not empty and the current height is less than the height at the top index of the stack:
   - Pop the top index from the stack.
   - Calculate the area of the rectangle as `heights[stack.Peek()] * (i - stack.Peek() - 1)` and update the max area if it's larger than the current max area.
4. Push the current index to the stack.
5. After iterating through all heights, calculate the area of rectangles from the remaining elements in the stack and update the max area if necessary.
6. Return the max area found so far.

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
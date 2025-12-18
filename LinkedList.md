# Linked List Problems

## 1. Linked List Cycle (LeetCode 141)

### Description:
Given the head of a linked list, determine if the linked list has a cycle in it. A cycle exists if you can start at some node and traverse the list following the next pointers and eventually reach the same node again. Return true if there is a cycle, false otherwise.

### Examples:
1. Input: head = [3,2,0,-4], pos = 1 → Output: true
   - The list is: 3 → 2 → 0 → -4 → (back to node 2)
   - There is a cycle because node -4 points back to node 2
   - The cycle exists and contains nodes 2 and 0

2. Input: head = [1,2], pos = 0 → Output: true
   - The list is: 1 → 2 → (back to node 1)
   - There is a cycle because node 2 points back to node 1
   - The cycle starts at the head

3. Input: head = [1], pos = -1 → Output: false
   - The list is: 1 (no next node)
   - There is no cycle
   - Single node with no pointer back to itself

### Pseudocode:
```
Use Floyd's Cycle Detection Algorithm (Tortoise and Hare):
Initialize slow = head, fast = head

While fast is not null and fast.next is not null:
    Move slow pointer one step: slow = slow.next
    Move fast pointer two steps: fast = fast.next.next
    
    If slow equals fast:
        Return true (cycle detected)

Return false (no cycle found)
```

### C# Solution:
```csharp
/**
 * Definition for singly-linked list node
 */
public class ListNode {
    public int val;
    public ListNode next;
    public ListNode(int val = 0, ListNode next = null) {
        this.val = val;
        this.next = next;
    }
}

public bool HasCycle(ListNode head) {
    // Edge case: empty list or single node without cycle
    if (head == null || head.next == null) {
        return false;
    }
    
    // Initialize slow pointer (moves 1 step at a time)
    ListNode slow = head;
    
    // Initialize fast pointer (moves 2 steps at a time)
    ListNode fast = head;
    
    // Traverse the list
    while (fast != null && fast.next != null) {
        // Move slow pointer by 1 step
        slow = slow.next;
        
        // Move fast pointer by 2 steps
        fast = fast.next.next;
        
        // If pointers meet, cycle exists
        if (slow == fast) {
            return true;
        }
    }
    
    // No cycle found (fast pointer reached the end)
    return false;
}
```

- **Time Complexity**: O(n) where n is the number of nodes. If there is a cycle, fast pointer catches slow pointer within the cycle. If no cycle, fast pointer reaches null.
- **Space Complexity**: O(1) - only uses two pointers regardless of input size.

---

## 2. Palindrome Linked List (LeetCode 234)

### Description:
Given the head of a singly linked list, determine if it is a palindrome. A palindrome reads the same forward and backward. Return true if the linked list is a palindrome, false otherwise.

### Examples:
1. Input: head = [1,2,2,1] → Output: true
   - The list is: 1 → 2 → 2 → 1
   - Reading forward: 1, 2, 2, 1
   - Reading backward: 1, 2, 2, 1
   - They match, so it is a palindrome

2. Input: head = [1,2,3,3,2,1] → Output: true
   - The list is: 1 → 2 → 3 → 3 → 2 → 1
   - Reading forward: 1, 2, 3, 3, 2, 1
   - Reading backward: 1, 2, 3, 3, 2, 1
   - They match, so it is a palindrome

3. Input: head = [1,2,3,4,5] → Output: false
   - The list is: 1 → 2 → 3 → 4 → 5
   - Reading forward: 1, 2, 3, 4, 5
   - Reading backward: 5, 4, 3, 2, 1
   - They don't match, so it is not a palindrome

### Pseudocode:
```
1. Find the middle of the linked list using slow and fast pointers
   - slow moves 1 step, fast moves 2 steps
   - when fast reaches end, slow is at middle

2. Reverse the second half of the list starting from the middle

3. Compare the first half with the reversed second half:
   - Traverse both halves simultaneously
   - If any values don't match, return false

4. Return true if all values match
```

### C# Solution:
```csharp
public bool IsPalindrome(ListNode head) {
    // Edge case: single node is always a palindrome
    if (head == null || head.next == null) {
        return true;
    }
    
    // Step 1: Find the middle of the linked list
    ListNode slow = head;
    ListNode fast = head;
    
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Step 2: Reverse the second half of the list
    ListNode secondHalf = ReverseList(slow);
    
    // Step 3: Compare first half with reversed second half
    ListNode first = head;
    ListNode second = secondHalf;
    
    while (second != null) { // second half is shorter or equal
        if (first.val != second.val) {
            return false; // Not a palindrome
        }
        first = first.next;
        second = second.next;
    }
    
    // All values matched, it is a palindrome
    return true;
}

// Helper method to reverse a linked list
private ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        // Store next node
        ListNode nextTemp = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move prev and current forward
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}
```

- **Time Complexity**: O(n) where n is the number of nodes. Finding middle takes O(n/2), reversing takes O(n/2), and comparison takes O(n/2).
- **Space Complexity**: O(1) - only uses pointers, no extra data structures (constant space).

---

## 3. Remove Nth Node From End of List (LeetCode 19)

### Description:
Given the head of a linked list, remove the nth node from the end of the list and return the head of the list. Use a single pass algorithm if possible. The nodes are counted from 1 (first node is at index 1).

### Examples:
1. Input: head = [1,2,3,4,5], n = 2 → Output: [1,2,3,5]
   - The list is: 1 → 2 → 3 → 4 → 5
   - The 2nd node from the end is node with value 4
   - After removal: 1 → 2 → 3 → 5
   - Node 3 now points to node 5, skipping node 4

2. Input: head = [1], n = 1 → Output: []
   - The list is: 1 (single node)
   - The 1st node from the end is the head itself
   - After removal: empty list
   - We return null as there are no nodes left

3. Input: head = [1,2], n = 1 → Output: [1]
   - The list is: 1 → 2
   - The 1st node from the end is node with value 2
   - After removal: 1 → null
   - Node 1 now points to null, removing node 2

### Pseudocode:
```
1. Create a dummy node pointing to head (handles edge case of removing head)

2. Use two pointers: first and second
   - Create gap of n nodes between them
   - Move first pointer n steps ahead

3. Move both pointers until first reaches the last node
   - When first.next is null, second is at node before target

4. Remove the target node:
   - second.next = second.next.next

5. Return dummy.next (the new head)
```

### C# Solution:
```csharp
public ListNode RemoveNthFromEnd(ListNode head, int n) {
    // Create a dummy node to handle edge case of removing the head
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    
    // Initialize two pointers
    ListNode first = dummy;
    ListNode second = dummy;
    
    // Move first pointer n steps ahead to create a gap of n nodes
    for (int i = 0; i < n; i++) {
        first = first.next;
    }
    
    // Move both pointers until first reaches the last node
    // When first.next is null, first is at the last node and second is at node before target
    while (first.next != null) {
        first = first.next;
        second = second.next;
    }
    
    // Remove the nth node by skipping it
    second.next = second.next.next;
    
    // Return the new head (dummy.next)
    return dummy.next;
}
```

- **Time Complexity**: O(n) where n is the number of nodes. We traverse the list twice: once to find the nth node and once to remove it (in a single pass approach, it's still O(n) with two pointers).
- **Space Complexity**: O(1) - only uses two pointers, no extra data structures.

---

## 4. Reorder List (LeetCode 143)

### Description:
You are given the head of a singly linked list. Reorder the list such that: the list first contains all nodes from the first half, followed by all nodes from the second half in reverse order. The reordering should happen in-place without modifying the node values.

### Examples:
1. Input: head = [1,2,3,4] → Output: [1,4,2,3]
   - Original list: 1 → 2 → 3 → 4
   - First half: 1 → 2
   - Second half reversed: 4 → 3
   - Reordered: 1 → 4 → 2 → 3
   - Alternating pattern: first from first half, then from reversed second half

2. Input: head = [1,2,3,4,5] → Output: [1,5,2,4,3]
   - Original list: 1 → 2 → 3 → 4 → 5
   - First half: 1 → 2 (middle node is 3)
   - Second half: 4 → 5
   - Second half reversed: 5 → 4
   - Reordered: 1 → 5 → 2 → 4 → 3
   - Alternating pattern maintains the middle node 3 at the end

3. Input: head = [1,2] → Output: [1,2]
   - Original list: 1 → 2
   - First half: 1
   - Second half reversed: 2
   - Reordered: 1 → 2
   - No change as there are only 2 nodes

### Pseudocode:
```
1. Find the middle of the list using slow and fast pointers

2. Split the list into two halves at the middle

3. Reverse the second half

4. Merge the two halves by interleaving nodes:
   - Take one node from first half, one from reversed second half
   - Continue until second half is exhausted
```

### C# Solution:
```csharp
public void ReorderList(ListNode head) {
    // Edge case: single node or two nodes
    if (head == null || head.next == null) {
        return;
    }
    
    // Step 1: Find the middle of the list
    ListNode slow = head;
    ListNode fast = head;
    ListNode prev = null;
    
    while (fast != null && fast.next != null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // Step 2: Split the list into two halves
    // prev is the last node of first half, slow is the start of second half
    prev.next = null;
    
    // Step 3: Reverse the second half
    ListNode secondHalf = ReverseList(slow);
    
    // Step 4: Merge the two halves
    ListNode first = head;
    ListNode second = secondHalf;
    
    while (second != null) { // second half is shorter or equal
        // Store next nodes
        ListNode nextFirst = first.next;
        ListNode nextSecond = second.next;
        
        // Interleave: first from first half, then from second half
        first.next = second;
        second.next = nextFirst;
        
        // Move to next nodes
        first = nextFirst;
        second = nextSecond;
    }
}

// Helper method to reverse a linked list
private ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;
    
    while (current != null) {
        // Store next node
        ListNode nextTemp = current.next;
        
        // Reverse the link
        current.next = prev;
        
        // Move prev and current forward
        prev = current;
        current = nextTemp;
    }
    
    return prev;
}
```

- **Time Complexity**: O(n) where n is the number of nodes. Finding middle takes O(n/2), reversing takes O(n/2), and merging takes O(n/2).
- **Space Complexity**: O(1) - only uses pointers, reordering happens in-place.

---

## 5. Swap Nodes in Pairs (LeetCode 24)

### Description:
Given a linked list, swap every two adjacent nodes and return the head of the list. Do this without modifying the values in the list nodes (only nodes themselves may be changed). You must solve the problem in-place with O(1) extra space.

### Examples:
1. Input: head = [1,2,3,4] → Output: [2,1,4,3]
   - Original list: 1 → 2 → 3 → 4
   - Swap nodes 1 and 2: 2 → 1
   - Swap nodes 3 and 4: 4 → 3
   - Result: 2 → 1 → 4 → 3
   - Each pair swaps positions

2. Input: head = [1,2,3] → Output: [2,1,3]
   - Original list: 1 → 2 → 3
   - Swap nodes 1 and 2: 2 → 1
   - Node 3 has no pair: stays at position 3
   - Result: 2 → 1 → 3
   - Odd node at the end remains unchanged

3. Input: head = [1] → Output: [1]
   - Original list: 1 (single node)
   - No pair to swap
   - Result: 1
   - Single node remains as is

### Pseudocode:
```
1. Create a dummy node pointing to head (handles edge case of swapping head)

2. Iterate through the list:
   - While current.next and current.next.next exist:
     a. Identify the pair: current.next and current.next.next
     b. Perform the swap by adjusting pointers
     c. Move current forward by 2 positions

3. Return dummy.next (the new head)
```

### C# Solution:
```csharp
public ListNode SwapPairs(ListNode head) {
    // Create a dummy node to handle edge case of swapping the head
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    
    // Start from dummy node
    ListNode current = dummy;
    
    // Iterate through pairs of nodes
    while (current.next != null && current.next.next != null) {
        // Identify the two nodes to swap
        ListNode first = current.next;      // First node in the pair
        ListNode second = current.next.next; // Second node in the pair
        
        // Perform the swap
        // Before: current → first → second → second.next
        // After:  current → second → first → second.next
        
        // Step 1: Connect current to second
        current.next = second;
        
        // Step 2: Connect first to second.next
        first.next = second.next;
        
        // Step 3: Connect second to first
        second.next = first;
        
        // Move current forward by 2 positions to the next pair
        current = first;
    }
    
    // Return the new head (dummy.next)
    return dummy.next;
}
```

- **Time Complexity**: O(n) where n is the number of nodes. We visit each node exactly once to swap pairs.
- **Space Complexity**: O(1) - only uses constant pointers, swapping happens in-place with no extra data structures.


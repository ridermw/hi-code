# Linked List Problems

## Linked List Concept

### What is a Linked List?
A linked list is a linear data structure where elements (nodes) are stored non-contiguously in memory. Each node contains data and a reference (pointer) to the next node. Unlike arrays, linked lists don't require contiguous memory allocation and allow efficient insertions/deletions at any position.

### Types of Linked List Problems:
1. **Two Pointer Technique** - Fast/slow pointers, finding middle, detecting cycles
2. **Reversal** - Reversing entire list or portions of it
3. **Manipulation** - Removing, swapping, or reordering nodes
4. **Traversal** - In-order, checking properties like palindrome

### When to Use Specific Techniques?
- **Floyd's Cycle Detection (Tortoise & Hare)**: Detect cycles with O(1) space
- **Fast/Slow Pointers**: Find middle in one pass without knowing length
- **Dummy Node**: Simplify edge cases when head might change
- **Reversal**: Problems requiring backward traversal without extra space

### Generic Pattern:
```
Common Techniques:

1. Two Pointers (Fast/Slow):
   slow = head, fast = head
   while fast != null and fast.next != null:
       slow = slow.next
       fast = fast.next.next
   // slow is now at middle or cycle meeting point

2. Reversal:
   prev = null, current = head
   while current != null:
       nextTemp = current.next
       current.next = prev
       prev = current
       current = nextTemp
   return prev  // new head

3. Dummy Node:
   dummy = new Node(0)
   dummy.next = head
   // perform operations
   return dummy.next  // handles head changes
```

### Example:
**Problem:** Find if a cycle exists in a linked list

**Why Two Pointers?** Instead of using a HashSet to track visited nodes (O(n) space), we use fast/slow pointers. If there's a cycle, fast pointer will eventually lap slow pointer and they'll meet. If no cycle, fast reaches null. This achieves O(1) space.

**Without Two Pointers:** Store every visited node in a set, check if current node exists → O(n) space
**With Two Pointers:** Fast moves 2x speed, catches slow if cycle exists → O(1) space

---

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
WHY FLOYD'S ALGORITHM (TWO POINTERS)?
- Brute force: Use HashSet to track visited nodes → O(n) space
- Two pointers optimize to O(1) space by using speed difference
- If cycle exists, fast pointer will eventually catch slow (like runners on a track)
- If no cycle, fast pointer reaches null first
- This trades space for a clever movement pattern

Use Floyd's Cycle Detection Algorithm (Tortoise and Hare):
Initialize slow = head, fast = head

While fast is not null and fast.next is not null:
    Move slow pointer one step: slow = slow.next     // Tortoise
    Move fast pointer two steps: fast = fast.next.next  // Hare
    
    If slow equals fast:
        Return true (cycle detected - pointers met)

Return false (no cycle found - fast reached end)
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
WHY THIS APPROACH?
- Can't access nodes by index like arrays, so need to find middle first
- Could reverse entire list and compare, but that modifies original structure
- Could use extra space (array/stack) to store values → O(n) space
- Instead: find middle, reverse second half in-place, compare → O(1) space
- This optimizes space while preserving ability to restore list if needed

1. Find the middle of the linked list using slow and fast pointers
   - slow moves 1 step, fast moves 2 steps
   - when fast reaches end, slow is at middle (no need to count length)

2. Reverse the second half of the list starting from the middle
   - In-place reversal using pointer manipulation

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
WHY TWO POINTERS WITH GAP?
- Can't access nth node from end directly (no indexing)
- Brute force: traverse to find length, then traverse to (length - n) → two passes
- Two pointers with gap of n: when first reaches end, second is n behind → one pass
- Dummy node simplifies edge case where head is removed (no special handling)
- This achieves single-pass solution with O(1) space

1. Create a dummy node pointing to head (handles edge case of removing head)

2. Use two pointers: first and second
   - Create gap of n nodes between them
   - Move first pointer n steps ahead (establishes n-node gap)

3. Move both pointers until first reaches the last node
   - When first.next is null, second is at node before target
   - Gap maintained throughout: first is always n nodes ahead

4. Remove the target node:
   - second.next = second.next.next (skip the nth node)

5. Return dummy.next (the new head - handles if head was removed)
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

- **Time Complexity**: O(n) where n is the number of nodes. We advance one pointer by n steps, then move both pointers together to the end (overall linear time).
- **Space Complexity**: O(1) - only uses two pointers, no extra data structures.

---

## 4. Reorder List (LeetCode 143)

### Description:
You are given the head of a singly linked list. Reorder the list in-place to follow the pattern:
L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …
Do not modify node values; only change pointers.

### Examples:
1. Input: head = [1,2,3,4] → Output: [1,4,2,3]
   - Original list: 1 → 2 → 3 → 4
   - Reverse the second half (3 → 4 becomes 4 → 3)
   - Merge alternately: 1 → 4 → 2 → 3

2. Input: head = [1,2,3,4,5] → Output: [1,5,2,4,3]
   - Original list: 1 → 2 → 3 → 4 → 5
   - Split after the middle (3): first half 1 → 2 → 3, second half 4 → 5
   - Reverse second half: 5 → 4
   - Merge alternately: 1 → 5 → 2 → 4 → 3

3. Input: head = [1,2] → Output: [1,2]
   - Only two nodes, so the list is already in the required order

### Pseudocode:
```
WHY THIS APPROACH?
- Pattern requires alternating first/last nodes: L0→Ln→L1→Ln-1...
- Can't easily access last node without traversal (no backward pointers)
- Solution: split list, reverse second half, then merge alternately
- This transforms problem: instead of accessing last repeatedly, reverse once
- Achieves O(1) space by manipulating pointers in-place

1. Find the middle using slow/fast pointers
   - After the loop, slow points to the last node of the first half
   - No need to count length first - fast/slow automatically finds middle

2. Reverse the second half starting at slow.next
   - Detach halves: slow.next = null (split into two lists)
   - Reverse second half so we can access "last" nodes from front

3. Merge by alternating nodes
   - Take one from first half, then one from reversed second half
   - Stop when the second half is exhausted (handles odd/even lengths)
```

### C# Solution:
```csharp
public void ReorderList(ListNode head) {
    if (head == null || head.next == null) {
        return;
    }

    // Step 1: Find the middle (slow ends at last node of first half)
    ListNode slow = head;
    ListNode fast = head;
    while (fast.next != null && fast.next.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // Step 2: Reverse the second half (starts after slow)
    ListNode second = ReverseList(slow.next);
    slow.next = null;

    // Step 3: Merge alternating
    ListNode first = head;
    while (second != null) {
        ListNode nextFirst = first.next;
        ListNode nextSecond = second.next;

        first.next = second;
        second.next = nextFirst;

        first = nextFirst;
        second = nextSecond;
    }
}

private ListNode ReverseList(ListNode head) {
    ListNode prev = null;
    ListNode current = head;

    while (current != null) {
        ListNode nextTemp = current.next;
        current.next = prev;
        prev = current;
        current = nextTemp;
    }

    return prev;
}
```

- **Time Complexity**: O(n) where n is the number of nodes (find middle + reverse + merge).
- **Space Complexity**: O(1) - reordering happens in-place using constant pointers.


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
WHY DUMMY NODE + POINTER MANIPULATION?
- Must swap nodes themselves, not just values (requirement)
- Swapping values would be O(1) per pair but violates constraint
- Need to carefully manipulate 3 pointers per swap: current, first, second
- Dummy node simplifies: head will change, dummy.next always points to new head
- In-place pointer changes achieve O(1) space instead of creating new nodes

1. Create a dummy node pointing to head (handles edge case of swapping head)

2. Iterate through the list:
   - While current.next and current.next.next exist (need a pair):
     a. Identify the pair: current.next and current.next.next
     b. Perform the swap by adjusting pointers (3-step process)
        - current → second (bypass first)
        - first → second.next (connect to rest)
        - second → first (complete the swap)
     c. Move current forward by 2 positions (jump to next pair)

3. Return dummy.next (the new head - first node changed)
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


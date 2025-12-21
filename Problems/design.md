# Design Problems

## Design Concept

### What are Design Problems?
Design problems require implementing data structures or systems that support specific operations efficiently. These problems test your ability to combine multiple data structures, manage state, and optimize for time/space complexity. Common patterns include caching systems (LRU, LFU), data structure augmentation, and stream processing.

### Core Considerations:
- **Time Complexity**: Each operation should be as efficient as possible (often O(1) or O(log n))
- **Space Complexity**: Balance memory usage with performance requirements
- **Data Structure Choice**: Select appropriate structures (HashMap, Heap, LinkedList, etc.)
- **Invariant Maintenance**: Ensure data structure properties hold after each operation
- **Edge Cases**: Handle empty states, capacity limits, duplicate operations

### When to Use Specific Designs?
- **Caching (LRU/LFU)**: When need to evict least recently/frequently used items
- **HashMap + LinkedList**: When need O(1) access and ordering
- **HashMap + Heap**: When need O(1) access and priority based operations
- **Multiple Data Structures**: When single structure can't meet all requirements

### Common Design Patterns:
```
1. LRU Cache (HashMap + Doubly LinkedList):
   - HashMap: key → node for O(1) access
   - LinkedList: maintain usage order
   - Move to front on access, evict from back
   
2. LFU Cache (HashMap + HashMap + DoublyLinkedList per freq):
   - keyToValue: key → value
   - keyToFreq: key → frequency
   - keyToNode: key → node reference for O(1) removal
   - freqToKeys: frequency → doubly linked list of keys (LRU within same freq)
   - Evict least frequent, then least recent (head of minFreq list)
   
3. Min/Max Stack (Stack + Auxiliary Structure):
   - Main stack: store values
   - Auxiliary: track min/max at each level
```

### Example:
**Problem:** Implement LRU Cache with get and put operations in O(1)

**Why HashMap + LinkedList?** HashMap gives O(1) access by key. LinkedList maintains recency order. On access, move node to front (most recent). On capacity full, remove from back (least recent). This combination provides O(1) for both operations.

**Without This Design:** Array based approach requires O(n) to maintain order
**With This Design:** HashMap + LinkedList → O(1) get and put

---

## LFU Cache | LeetCode 460 | Hard
Design and implement a data structure for a Least Frequently Used (LFU) cache. Implement the `LFUCache` class:
- `LFUCache(int capacity)` Initializes the object with the capacity of the data structure.
- `int get(int key)` Gets the value of the key if the key exists in the cache. Otherwise, returns -1.
- `void put(int key, int value)` Updates the value of the key if present, or inserts the key if not already present. When the cache reaches its capacity, it should invalidate and remove the least frequently used key before inserting a new item. For this problem, when there is a tie (i.e., two or more keys with the same frequency), the least recently used key would be invalidated.

### Key Insight:
To achieve O(1) operations, we need:
1. **Fast access to values** → HashMap (keyToValue)
2. **Track frequency per key** → HashMap (keyToFreq)
3. **Fast node removal** → HashMap storing node references (keyToNode)
4. **LRU ordering within each frequency** → LinkedList per frequency (freqToKeys)
5. **Fast eviction target** → Track minimum frequency (minFreq)

### LinkedList Convention:
- **AddLast()** adds to tail (most recently used position)
- **First** property accesses head (least recently used position)
- **RemoveFirst()** removes from head (evicts least recently used)

### Examples:
1. Input: ["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1,1], [2,2], [1], [3,3], [2], [3], [4,4], [1], [3], [4]], Output = [null, null, null, 1, null, -1, 3, null, -1, 3, 4]
   - LFUCache(2): capacity = 2
   - put(1, 1): cache = {1=1}, freq[1]=1, minFreq=1
   - put(2, 2): cache = {1=1, 2=2}, freq[1]=1, freq[2]=1, minFreq=1
   - get(1): returns 1, freq[1] becomes 2, minFreq=1 (key 2 still at freq 1)
   - put(3, 3): evict key 2 (only key at minFreq=1), cache = {1=1, 3=3}, minFreq=1
   - get(2): returns -1 (evicted)
   - get(3): returns 3, freq[3] becomes 2, both keys now at freq 2, minFreq=2
   - put(4, 4): evict key 1 (first in freq=2 list, least recently used), cache = {3=3, 4=4}
   - get(1): returns -1 (evicted)
   - get(3): returns 3, freq[3] becomes 3
   - get(4): returns 4, freq[4] becomes 2

2. Input: ["LFUCache", "put", "get", "put", "get", "get"], [[1], [2,1], [2], [3,2], [2], [3]], Output = [null, null, 1, null, -1, 2]
   - Capacity 1, single slot cache
   - put(2,1): cache = {2=1}
   - get(2): returns 1, freq[2]=2
   - put(3,2): evict key 2 (only key, must evict), cache = {3=2}
   - get(2): returns -1 (evicted)
   - get(3): returns 2

3. Input: ["LFUCache", "put", "put", "put", "get", "get"], [[2], [1,1], [2,2], [1,10], [1], [2]], Output = [null, null, null, null, 10, 2]
   - put(1,1): cache = {1=1}, freq[1]=1
   - put(2,2): cache = {1=1, 2=2}, freq[1]=1, freq[2]=1
   - put(1,10): update value to 10, increment freq[1] to 2
   - get(1): returns 10, freq[1] becomes 3
   - get(2): returns 2, freq[2] becomes 2

4. Input: ["LFUCache", "put", "put", "get", "get", "put", "get", "get"], [[2], [1,1], [2,2], [1], [2], [3,3], [1], [3]], Output = [null, null, null, 1, 2, null, -1, 3]
   - put(1,1): cache = {1=1}, freq[1]=1, minFreq=1
   - put(2,2): cache = {1=1, 2=2}, freq[1]=1, freq[2]=1, minFreq=1
   - get(1): returns 1, freq[1]=2, minFreq=1 (key 2 still at freq 1)
   - get(2): returns 2, freq[2]=2, both at freq 2, minFreq=2
   - put(3,3): evict first key from freq=2 list (key 1, accessed earlier), cache = {2=2, 3=3}
   - get(1): returns -1 (evicted)
   - get(3): returns 3, freq[3]=2

5. Input: ["LFUCache", "put", "put", "put", "get"], [[3], [1,1], [2,2], [3,3], [1]], Output = [null, null, null, null, 1]
   - Capacity 3, all fit without eviction
   - put(1,1), put(2,2), put(3,3): all have freq=1
   - get(1): returns 1, freq[1]=2

### Pseudocode:
```
WHY HASHMAP + HASHMAP + DOUBLY LINKED LIST?
- Need O(1) get and put operations
- Track frequency of each key
- Among same frequency, evict least recently used
- Data structures:
  1. keyToValue: key → value (O(1) access)
  2. keyToFreq: key → frequency count
  3. keyToNode: key → node in its current doubly linked list (for O(1) removals)
  4. freqToKeys: frequency → doubly linked list of keys (maintain LRU order)
  5. minFreq: track minimum frequency for eviction
- On access: increment frequency, move to new frequency list
- On eviction: remove least recently used from minFreq list (head of list)

CLASS LFUCache:
  capacity, minFreq
  keyToValue: HashMap<int, int>
  keyToFreq: HashMap<int, int>
  keyToNode: HashMap<int, LinkedListNode<int>>
  freqToKeys: HashMap<int, DoublyLinkedList<int>>
  
  CONSTRUCTOR(capacity):
    this.capacity = capacity
    this.minFreq = 0
    Initialize all HashMaps
  
  GET(key):
    If key not in keyToValue: return -1
    value = keyToValue[key]
    UpdateFrequency(key)
    Return value
  
  PUT(key, value):
    If capacity == 0: return
    
    If key exists:
      keyToValue[key] = value
      UpdateFrequency(key)
      Return
    
    If at capacity:
      Evict: remove least recently used key from freqToKeys[minFreq] (head)
      Remove evicted key from keyToValue, keyToFreq, and keyToNode
      If freqToKeys[minFreq] becomes empty: remove minFreq entry
    
    keyToValue[key] = value
    keyToFreq[key] = 1
    Add key to tail of freqToKeys[1], store node in keyToNode
    minFreq = 1
  
  UPDATEFREQUENCY(key):
    freq = keyToFreq[key]
    node = keyToNode[key]
    keyToFreq[key] = freq + 1
    
    Remove node from freqToKeys[freq] using stored reference (O(1))
    
    If freqToKeys[freq] becomes empty:
      Remove freq from freqToKeys
      If minFreq == freq: minFreq = freq + 1
    
    Add key to tail of freqToKeys[freq + 1]
    Store new node reference in keyToNode[key]
```

### C# Solution:
```csharp
public class LFUCache {
    private readonly int capacity;
    private int minFreq;
    private readonly Dictionary<int, int> keyToValue;
    private readonly Dictionary<int, int> keyToFreq;
    private readonly Dictionary<int, LinkedList<int>> freqToKeys;
    private readonly Dictionary<int, LinkedListNode<int>> keyToNode;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyToValue = new Dictionary<int, int>();
        this.keyToFreq = new Dictionary<int, int>();
        this.freqToKeys = new Dictionary<int, LinkedList<int>>();
        this.keyToNode = new Dictionary<int, LinkedListNode<int>>();
    }
    
    public int Get(int key) {
        if (!keyToValue.ContainsKey(key)) {
            return -1;
        }
        
        UpdateFrequency(key);
        return keyToValue[key];
    }
    
    public void Put(int key, int value) {
        if (capacity == 0) return;
        
        // If key exists, update value and frequency
        if (keyToValue.ContainsKey(key)) {
            keyToValue[key] = value;
            UpdateFrequency(key);
            return;
        }
        
        // At capacity, evict least frequently used, then least recently used
        if (keyToValue.Count == capacity) {
            // Get least recently used key from minimum frequency list (head of list)
            int evictKey = freqToKeys[minFreq].First!.Value;
            freqToKeys[minFreq].RemoveFirst();
            
            if (freqToKeys[minFreq].Count == 0) {
                freqToKeys.Remove(minFreq);
            }
            
            keyToValue.Remove(evictKey);
            keyToFreq.Remove(evictKey);
            keyToNode.Remove(evictKey);
        }
        
        // Insert new key with frequency 1
        keyToValue[key] = value;
        keyToFreq[key] = 1;
        
        if (!freqToKeys.ContainsKey(1)) {
            freqToKeys[1] = new LinkedList<int>();
        }
        
        // Add to tail (most recently used position)
        LinkedListNode<int> node = freqToKeys[1].AddLast(key);
        keyToNode[key] = node;
        
        minFreq = 1;
    }
    
    private void UpdateFrequency(int key) {
        int freq = keyToFreq[key];
        keyToFreq[key] = freq + 1;
        
        // Remove from current frequency list using stored node (O(1) operation)
        LinkedListNode<int> node = keyToNode[key];
        freqToKeys[freq].Remove(node);
        
        // If frequency list becomes empty, remove it and update minFreq if needed
        if (freqToKeys[freq].Count == 0) {
            freqToKeys.Remove(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }
        
        // Add to new frequency list at tail (most recently used position)
        if (!freqToKeys.ContainsKey(freq + 1)) {
            freqToKeys[freq + 1] = new LinkedList<int>();
        }
        
        LinkedListNode<int> newNode = freqToKeys[freq + 1].AddLast(key);
        keyToNode[key] = newNode;
    }
}
```

### Complexity Analysis

**Time Complexity**: O(1) for both get and put operations
- HashMap lookups, insertions, deletions: O(1)
- LinkedList operations using stored node references: O(1)
  - Remove(node): O(1) because we have direct node reference
  - AddLast(key): O(1) always
  - RemoveFirst(): O(1) always
- UpdateFrequency involves only O(1) operations

**Space Complexity**: O(capacity)
- keyToValue: stores up to capacity entries → O(capacity)
- keyToFreq: stores up to capacity entries → O(capacity)
- keyToNode: stores up to capacity entries → O(capacity)
- freqToKeys: in worst case, each key has unique frequency → O(capacity) lists with total O(capacity) nodes
- Total: O(capacity) space across all data structures

### Edge Cases Handled:
1. **Capacity = 0**: Early return prevents any operations
2. **Single capacity**: Correctly evicts only item when inserting new key
3. **Updating existing key**: Increments frequency without eviction
4. **Multiple keys at same frequency**: LRU order maintained within frequency bucket
5. **minFreq tracking**: Automatically increments when frequency list becomes empty

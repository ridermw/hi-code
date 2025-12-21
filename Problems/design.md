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
- **HashMap + Heap**: When need O(1) access and priority-based operations
- **Multiple Data Structures**: When single structure can't meet all requirements

### Common Design Patterns:
```
1. LRU Cache (HashMap + Doubly LinkedList):
   - HashMap: key → node for O(1) access
   - LinkedList: maintain usage order
   - Move to front on access, evict from back
   
2. LFU Cache (HashMap + HashMap + DoublyLinkedList):
   - keyToValue: key → value
   - keyToFreq: key → frequency
   - freqToKeys: frequency → list of keys
   - Evict least frequent, then least recent
   
3. Min/Max Stack (Stack + Auxiliary Structure):
   - Main stack: store values
   - Auxiliary: track min/max at each level
```

### Example:
**Problem:** Implement LRU Cache with get and put operations in O(1)

**Why HashMap + LinkedList?** HashMap gives O(1) access by key. LinkedList maintains recency order. On access, move node to front (most recent). On capacity full, remove from back (least recent). This combination provides O(1) for both operations.

**Without This Design:** Array-based approach requires O(n) to maintain order
**With This Design:** HashMap + LinkedList → O(1) get and put

---

## LFU Cache | LeetCode 460 | Hard
Design and implement a data structure for a Least Frequently Used (LFU) cache. Implement the `LFUCache` class:
- `LFUCache(int capacity)` Initializes the object with the capacity of the data structure.
- `int get(int key)` Gets the value of the key if the key exists in the cache. Otherwise, returns -1.
- `void put(int key, int value)` Updates the value of the key if present, or inserts the key if not already present. When the cache reaches its capacity, it should invalidate and remove the least frequently used key before inserting a new item. For this problem, when there is a tie (i.e., two or more keys with the same frequency), the least recently used key would be invalidated.

### Examples:
1. Input: ["LFUCache", "put", "put", "get", "put", "get", "get", "put", "get", "get", "get"], [[2], [1,1], [2,2], [1], [3,3], [2], [3], [4,4], [1], [3], [4]], Output = [null, null, null, 1, null, -1, 3, null, -1, 3, 4]  
   - LFUCache(2): capacity = 2
   - put(1, 1): cache = {1=1}, freq[1]=1
   - put(2, 2): cache = {1=1, 2=2}, freq[1]=1, freq[2]=1
   - get(1): returns 1, freq[1]=2
   - put(3, 3): evict key 2 (freq=1, older than 3), cache = {1=1, 3=3}
   - get(2): returns -1 (not found)
   - get(3): returns 3, freq[3]=2
   - put(4, 4): evict key 1 (freq=2 but older), cache = {3=3, 4=4}
   - get(1): returns -1
   - get(3): returns 3
   - get(4): returns 4

2. Input: ["LFUCache", "put", "get", "put", "get", "get"], [[1], [2,1], [2], [3,2], [2], [3]], Output = [null, null, 1, null, -1, 2]  
   - Capacity 1, single slot cache
   - put(2,1), get(2) returns 1
   - put(3,2) evicts key 2
   - get(2) returns -1, get(3) returns 2

3. Input: ["LFUCache", "put", "put", "put", "get", "get"], [[2], [1,1], [2,2], [1,10], [1], [2]], Output = [null, null, null, null, 10, 2]  
   - put(1,1), put(2,2)
   - put(1,10) updates key 1 to 10, increments freq
   - get(1) returns 10
   - get(2) returns 2

4. Input: ["LFUCache", "put", "put", "get", "get", "put", "get", "get"], [[2], [1,1], [2,2], [1], [2], [3,3], [1], [3]], Output = [null, null, null, 1, 2, null, -1, 3]  
   - After get(1) and get(2), both have freq=2
   - put(3,3) evicts key with lowest freq (none), so evict LRU
   - Actually both have freq=2, so evict key 1 (older)

5. Input: ["LFUCache", "put", "put", "put", "get"], [[3], [1,1], [2,2], [3,3], [1]], Output = [null, null, null, null, 1]  
   - Capacity 3, all fit
   - get(1) returns 1

### Pseudocode:
```
WHY HASHMAP + HASHMAP + DOUBLY LINKED LIST?
- Need O(1) get and put operations
- Track frequency of each key
- Among same frequency, evict least recently used
- Data structures:
  1. keyToValue: key → value (O(1) access)
  2. keyToFreq: key → frequency count
  3. freqToKeys: frequency → doubly linked list of keys (maintain LRU order)
  4. minFreq: track minimum frequency for eviction
- On access: increment frequency, move to new frequency list
- On eviction: remove least recent from minFreq list

CLASS LFUCache:
  capacity, minFreq
  keyToValue: HashMap<int, int>
  keyToFreq: HashMap<int, int>
  freqToKeys: HashMap<int, LinkedHashSet<int>>
  
  CONSTRUCTOR(capacity):
    this.capacity = capacity
    this.minFreq = 0
    Initialize HashMaps
  
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
      Evict: remove LRU key from freqToKeys[minFreq]
      Remove from keyToValue and keyToFreq
    
    keyToValue[key] = value
    keyToFreq[key] = 1
    freqToKeys[1].add(key)
    minFreq = 1
  
  UPDATEFREQUENCY(key):
    freq = keyToFreq[key]
    keyToFreq[key] = freq + 1
    freqToKeys[freq].remove(key)
    
    If freqToKeys[freq] is empty:
      Remove freq from freqToKeys
      If minFreq == freq: minFreq++
    
    freqToKeys[freq + 1].add(key)
```

### C# Solution:
```csharp
public class LFUCache {
    private int capacity;
    private int minFreq;
    private Dictionary<int, int> keyToValue;
    private Dictionary<int, int> keyToFreq;
    private Dictionary<int, LinkedList<int>> freqToKeys;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFreq = 0;
        this.keyToValue = new Dictionary<int, int>();
        this.keyToFreq = new Dictionary<int, int>();
        this.freqToKeys = new Dictionary<int, LinkedList<int>>();
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
        
        if (keyToValue.ContainsKey(key)) {
            keyToValue[key] = value;
            UpdateFrequency(key);
            return;
        }
        
        // At capacity, evict LFU (then LRU)
        if (keyToValue.Count == capacity) {
            int evictKey = freqToKeys[minFreq].First.Value;
            freqToKeys[minFreq].RemoveFirst();
            
            if (freqToKeys[minFreq].Count == 0) {
                freqToKeys.Remove(minFreq);
            }
            
            keyToValue.Remove(evictKey);
            keyToFreq.Remove(evictKey);
        }
        
        // Insert new key
        keyToValue[key] = value;
        keyToFreq[key] = 1;
        
        if (!freqToKeys.ContainsKey(1)) {
            freqToKeys[1] = new LinkedList<int>();
        }
        freqToKeys[1].AddLast(key);
        
        minFreq = 1;
    }
    
    private void UpdateFrequency(int key) {
        int freq = keyToFreq[key];
        keyToFreq[key] = freq + 1;
        
        // Remove from old frequency list
        freqToKeys[freq].Remove(key);
        
        if (freqToKeys[freq].Count == 0) {
            freqToKeys.Remove(freq);
            if (minFreq == freq) {
                minFreq++;
            }
        }
        
        // Add to new frequency list
        if (!freqToKeys.ContainsKey(freq + 1)) {
            freqToKeys[freq + 1] = new LinkedList<int>();
        }
        freqToKeys[freq + 1].AddLast(key);
    }
}
```

### Complexity

**Time Complexity**: O(1) for both get and put operations. All HashMap and LinkedList operations are O(1).

**Space Complexity**: O(capacity) for storing up to capacity key-value pairs plus frequency tracking structures.

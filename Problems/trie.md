# Trie Problems

## Trie Concept

### What is a Trie?
A Trie (prefix tree) is a tree data structure used to store and retrieve strings efficiently. Each node represents a character, and paths from root to nodes spell out words. Tries excel at prefix-based operations: checking if a word exists, finding all words with a given prefix, and autocomplete functionality.

### Core Operations:
1. **Insert**: Add word to trie - O(m) where m is word length
2. **Search**: Check if word exists - O(m)
3. **StartsWith**: Check if prefix exists - O(m)
4. **Delete**: Remove word from trie - O(m) (not implemented below)
5. **Space**: O(total characters stored × alphabet pointer overhead)

### When to Use Tries
Use tries when:
1. Need to store/search many strings with common prefixes
2. Want efficient prefix matching or autocomplete
3. Must check if string starts with given prefix
4. Building dictionary or spell checker
5. IP routing or phone directory (prefix matching)
6. Word games (Boggle, Scrabble) with dictionary
7. Space tradeoff acceptable for time efficiency

### Common Trie Patterns:
```
1. Standard Trie Node:
   class TrieNode:
       children: map or array (26 for lowercase)
       isEndOfWord: boolean
       
2. Insert Word:
   current = root
   for each char in word:
       if char not in current.children:
           create new node
       current = current.children[char]
   current.isEndOfWord = true
   
3. Search Prefix:
   current = root
   for each char in prefix:
       if char not in current.children:
           return false
       current = current.children[char]
   return true
```

### Example:
**Problem:** Implement dictionary with insert and prefix search

**Why Trie?** HashMap stores whole words (can't check prefixes efficiently). Array search is O(n × m). Trie stores shared prefixes once, searches in O(m) time. Words "app", "apple", "apply" share prefix "app" - stored once in trie. Prefix search just traverses path.

**Without Trie:** Check each word for prefix → O(n × m)
**With Trie:** Follow prefix path → O(m)

---

## Implement Trie (Prefix Tree) | LeetCode 208 | Medium
A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker. Implement the Trie class with `insert`, `search`, and `startsWith` methods.

### Examples:
1. Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"], [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]], Output: [null, null, true, false, true, null, true]  
   - Insert "apple"
   - Search "apple": true (exact match)
   - Search "app": false (not inserted)
   - StartsWith "app": true (prefix of "apple")
   - Insert "app"
   - Search "app": true (now exists)

2. Input: ["Trie", "insert", "insert", "search", "startsWith"], [[], ["hello"], ["hell"], ["hell"], ["hello"]], Output: [null, null, null, true, true]  
   - Insert "hello" and "hell"
   - Both words exist
   - Both are prefixes of each other

3. Input: ["Trie", "insert", "search", "startsWith", "startsWith"], [[], ["word"], ["wor"], ["wo"], ["word"]], Output: [null, null, false, true, true]  
   - Insert "word"
   - "wor" not inserted (false)
   - "wo" is prefix (true)
   - "word" is prefix of itself (true)

4. Input: ["Trie", "insert", "insert", "insert", "search", "startsWith"], [[], ["cat"], ["cats"], ["catch"], ["cat"], ["cat"]], Output: [null, null, null, null, true, true]  
   - Insert multiple words with common prefix "cat"
   - Trie stores shared prefix once

5. Input: ["Trie", "startsWith", "insert", "startsWith"], [[], ["a"], ["apple"], ["a"]], Output: [null, false, null, true]  
   - Empty trie: no prefix "a"
   - After inserting "apple": prefix "a" exists

### Pseudocode:
```
WHY TRIE?
- Need efficient prefix and exact word search
- HashMap: can search word in O(1) but not prefixes
- Array: O(n) search for each query
- Trie: O(m) for both operations where m = word length
- Shares common prefixes: space efficient for many similar words

TrieNode structure:
- children: array of 26 TrieNodes (for 'a'-'z')
- isEndOfWord: boolean

Insert(word):
1. current = root
2. For each char in word:
   - index = char - 'a'
   - If children[index] is null: create new node
   - current = children[index]
3. Set current.isEndOfWord = true

Search(word):
1. current = root
2. For each char in word:
   - index = char - 'a'
   - If children[index] is null: return false
   - current = children[index]
3. Return current.isEndOfWord

StartsWith(prefix):
1. Same as Search but return true if path exists
2. Don't check isEndOfWord
```

### C# Solution:
```csharp
public class TrieNode {
    public TrieNode[] children = new TrieNode[26];
    public bool isEndOfWord = false;
}

public class Trie {
    private TrieNode root;
    
    public Trie() {
        root = new TrieNode();
    }
    
    public void Insert(string word) {
        TrieNode current = root;
        foreach (char c in word) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }
        current.isEndOfWord = true;
    }
    
    public bool Search(string word) {
        TrieNode current = root;
        foreach (char c in word) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return false;
            }
            current = current.children[index];
        }
        return current.isEndOfWord;
    }
    
    public bool StartsWith(string prefix) {
        TrieNode current = root;
        foreach (char c in prefix) {
            int index = c - 'a';
            if (current.children[index] == null) {
                return false;
            }
            current = current.children[index];
        }
        return true;
    }
}
```

### Complexity

**Time Complexity**: O(m) for all operations where m is the length of the word/prefix.

**Space Complexity**: O(total characters stored × alphabet pointer overhead). Each trie node stores up to 26 child references.

## Add and Search Word - Data Structure Design | LeetCode 211 | Medium
Design a data structure that supports adding new words and finding if a string matches any previously added string. Implement the `WordDictionary` class with `addWord` and `search` methods. The `search` function can search a literal word or a regular expression string containing '.' where '.' can represent any letter.

### Examples:
1. Input: ["WordDictionary","addWord","addWord","addWord","search","search","search","search"], [[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]], Output: [null,null,null,null,false,true,true,true]  
   - Add "bad", "dad", "mad"
   - Search "pad": false
   - Search "bad": true
   - Search ".ad": true (matches bad, dad, mad)
   - Search "b..": true (matches bad)

2. Input: ["WordDictionary","addWord","search","search"], [[],["a"],["a"],["."]], Output: [null,null,true,true]  
   - Add "a"
   - Search "a": true
   - Search ".": true (matches any single char)

3. Input: ["WordDictionary","addWord","addWord","search","search"], [[],["cat"],["car"],["c.."]], [".a."], Output: [null,null,null,true,true]  
   - Add "cat" and "car"
   - Search "c..": matches both
   - Search ".a.": matches both (any char, 'a', any char)

4. Input: ["WordDictionary","addWord","addWord","addWord","search"], [[],["apple"],["apply"],["ape"],["ap..."]], Output: [null,null,null,null,true]  
   - "ap..." should match "apple" and "apply" (5 chars starting with "ap")

5. Input: ["WordDictionary","addWord","search","search"], [[],["hello"],["h...."],["....."]], Output: [null,null,true,true]  
   - "h....": 5 chars starting with 'h'
   - ".....": any 5-char word

### Pseudocode:
```
WHY TRIE WITH DFS?
- Standard trie for exact matching
- '.' requires checking all 26 children (wildcardmatch)
- Use DFS/recursion to handle '.' in search
- For regular char: follow single path
- For '.': try all non-null children recursively
- Time: O(m) for exact match, O(26^dots × m) for wildcards

AddWord(word):
- Same as standard trie insert

Search(word):
1. Helper function DFS(node, index):
   - If index == word.length: return node.isEndOfWord
   - char = word[index]
   - If char == '.':
     For each non-null child:
       If DFS(child, index+1): return true
     Return false
   - Else:
     If children[char-'a'] is null: return false
     Return DFS(children[char-'a'], index+1)
2. Return DFS(root, 0)
```

### C# Solution:
```csharp
public class WordDictionary {
    private TrieNode root;
    
    public WordDictionary() {
        root = new TrieNode();
    }
    
    public void AddWord(string word) {
        TrieNode current = root;
        foreach (char c in word) {
            int index = c - 'a';
            if (current.children[index] == null) {
                current.children[index] = new TrieNode();
            }
            current = current.children[index];
        }
        current.isEndOfWord = true;
    }
    
    public bool Search(string word) {
        return SearchHelper(word, 0, root);
    }
    
    private bool SearchHelper(string word, int index, TrieNode node) {
        if (index == word.Length) return node.isEndOfWord;
        
        char c = word[index];
        
        if (c == '.') {
            for (int i = 0; i < 26; i++) {
                if (node.children[i] != null && SearchHelper(word, index + 1, node.children[i])) {
                    return true;
                }
            }
            return false;
        } else {
            int charIndex = c - 'a';
            if (node.children[charIndex] == null) return false;
            return SearchHelper(word, index + 1, node.children[charIndex]);
        }
    }
    
    private class TrieNode {
        public TrieNode[] children = new TrieNode[26];
        public bool isEndOfWord = false;
    }
}
```

### Complexity

**Time Complexity**: O(m) for addWord. O(m) for search with no dots, O(26^k × m) for search with k dots in worst case.

**Space Complexity**: O(n × m × 26) for storing n words of average length m.

---

## Short Encoding of Words | LeetCode 820 | Medium
A valid encoding of an array of `words` is any reference string `s` and array of indices `indices` such that:
- `words.length == indices.length`
- The reference string `s` ends with the '#' character.
- For each index `indices[i]`, the substring of `s` starting from `indices[i]` and up to (but not including) the next '#' character is equal to `words[i]`.

Given an array of `words`, return the length of the shortest reference string `s` possible of any valid encoding of `words`.

### Examples:
1. Input: words = ["time", "me", "bell"], Output = 10  
   - "me" is suffix of "time", so we can encode both with "time#"
   - "bell" is independent, needs "bell#"
   - Combined: "time#bell#" or "bell#time#" (length = 10)

2. Input: words = ["t"], Output = 2  
   - Single word: "t#" (length = 2)

3. Input: words = ["time", "atime", "btime"], Output = 12  
   - "time" is suffix of both "atime" and "btime"
   - Optimal: "atime#btime#" (length = 12)
   - Or: "btime#atime#" (same length)

4. Input: words = ["me", "time"], Output = 5  
   - "me" is suffix of "time"
   - Encode as "time#" (length = 5)

5. Input: words = ["abc", "bc", "c", "def", "ef", "f"], Output = 10  
   - "c" is suffix of "bc" which is suffix of "abc" → "abc#"
   - "f" is suffix of "ef" which is suffix of "def" → "def#"
   - Combined: "abc#def#" (length = 10)

### Pseudocode:
```
WHY TRIE (REVERSE)?
- Need to identify words that are suffixes of other words
- If word A is suffix of word B, we only need to encode B
- Build trie with reversed words (suffix tree)
- Only count leaf nodes (words not suffix of any other)
- O(n × m) time where n = number of words, m = average length

1. Build trie with reversed words
2. For each word in trie:
   - If word is a leaf (no children after it), count its length + 1 (for '#')
   - If word has children, it's a suffix of another word (skip)
3. Sum all lengths
Alternative approach using Set:
1. Add all words to set
2. For each word, remove all its suffixes from set
3. Sum lengths of remaining words + 1 for each
```

### C# Solution (Set Approach):
```csharp
public int MinimumLengthEncoding(string[] words) {
    HashSet<string> wordSet = new HashSet<string>(words);
    
    // Remove all suffixes
    foreach (string word in words) {
        for (int i = 1; i < word.Length; i++) {
            wordSet.Remove(word.Substring(i));
        }
    }
    
    // Sum remaining word lengths + '#'
    int length = 0;
    foreach (string word in wordSet) {
        length += word.Length + 1;
    }
    
    return length;
}
```

### C# Solution (Trie Approach):
```csharp
public int MinimumLengthEncoding(string[] words) {
    TrieNode root = new TrieNode();
    Dictionary<TrieNode, int> nodes = new Dictionary<TrieNode, int>();
    
    // Insert reversed words
    for (int i = 0; i < words.Length; i++) {
        string word = words[i];
        TrieNode current = root;
        
        for (int j = word.Length - 1; j >= 0; j--) {
            char c = word[j];
            if (current.children[c - 'a'] == null) {
                current.children[c - 'a'] = new TrieNode();
            }
            current = current.children[c - 'a'];
        }
        
        nodes[current] = i;
    }
    
    // Count leaf nodes (words not suffix of others)
    int length = 0;
    foreach (var pair in nodes) {
        TrieNode node = pair.Key;
        if (IsLeaf(node)) {
            length += words[pair.Value].Length + 1;
        }
    }
    
    return length;
}

private bool IsLeaf(TrieNode node) {
    foreach (var child in node.children) {
        if (child != null) return false;
    }
    return true;
}

private class TrieNode {
    public TrieNode[] children = new TrieNode[26];
}
```

### Complexity

**Time Complexity**: O(n × m) where n is number of words and m is average word length.

**Space Complexity**: O(n × m) for the set or trie structure.
# Trie Problems

## Trie Concept

A Trie (prefix tree) is a tree data structure used to store and retrieve strings efficiently. Each node represents a character, and paths from root to nodes spell out words. Tries excel at prefix-based operations: checking if a word exists, finding all words with a given prefix, and autocomplete functionality.
### What is a Trie
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

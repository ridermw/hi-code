# Matrix Problems

## Matrix Concept

### What is a Matrix?
A matrix (2D array) is a rectangular grid of elements arranged in rows and columns. Matrix problems often involve traversing in specific patterns (spiral, diagonal, rotation), in-place modifications, or applying transformations. Common operations include rotation, transpose, spiral traversal, and searching. Matrices use row-major indexing: matrix[row][column].

### Core Operations:
- **Access Element**: Get/set matrix[i][j] - O(1)
- **Traverse**: Visit all elements - O(m × n)
- **Rotate 90°**: Transpose then reverse rows - O(m × n)
- **Spiral Order**: Traverse boundaries inward - O(m × n)
- **Set Row/Column**: Mark and update - O(m × n)

### When to Use Matrix Techniques?
Use matrix approaches when:
- 2D grid or rectangular data structure
- Need to rotate, flip, or transpose matrix
- Spiral, diagonal, or boundary traversal required
- In-place modification to save space
- Row/column operations (set all to value, etc.)
- Image processing or grid manipulation
- Keywords: "rotate", "spiral", "matrix", "grid", "2D array"

### Common Matrix Patterns:
```
1. Rotate 90° Clockwise:
   Transpose: swap matrix[i][j] with matrix[j][i]
   Reverse each row: swap matrix[i][j] with matrix[i][n-1-j]
   Result: 90° clockwise rotation
   
2. Spiral Traversal:
   Use boundary pointers: top, bottom, left, right
   Traverse: right → down → left → up
   Shrink boundaries after each direction
   Continue until boundaries cross
   
3. In-Place Row/Column Marking:
   Use first row/column as markers
   Flag for first row/column separately
   Scan matrix, mark row/column headers
   Apply changes based on markers
   Handle first row/column last
```

### Example:
**Problem:** Rotate n × n matrix 90 degrees clockwise in-place

**Why Matrix Manipulation?** Cannot use extra n × n space. Observation: element at (i,j) moves to (j, n-1-i) after rotation. But doing one-by-one requires temp storage. Better: transpose matrix (swap across diagonal), then reverse each row. Both operations are in-place. Transpose + reverse rows = 90° clockwise rotation.

**Without In-Place:** Create new matrix, copy rotated elements → O(n²) space
**With In-Place:** Transpose then reverse rows → O(1) space

---

## Rotate Image | LeetCode 48 | Medium
You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.

### Examples:
1. Input: matrix = [[1,2,3],[4,5,6],[7,8,9]], Output = [[7,4,1],[8,5,2],[9,6,3]]  
   - 3×3 matrix
   - [1,2,3] → [7,4,1]
   - [4,5,6] → [8,5,2]
   - [7,8,9] → [9,6,3]
   - Rotated 90° clockwise

2. Input: matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]], Output = [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]  
   - 4×4 matrix
   - More complex rotation
   - All elements repositioned

3. Input: matrix = [[1]], Output = [[1]]  
   - 1×1 matrix
   - No change (already rotated)

4. Input: matrix = [[1,2],[3,4]], Output = [[3,1],[4,2]]  
   - 2×2 matrix
   - [1,2] becomes [3,1]
   - [3,4] becomes [4,2]

5. Input: matrix = [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]], Output = [[21,16,11,6,1],[22,17,12,7,2],[23,18,13,8,3],[24,19,14,9,4],[25,20,15,10,5]]  
   - 5×5 matrix
   - First column becomes first row
   - Last row becomes first column

### Pseudocode:
```
WHY TRANSPOSE THEN REVERSE?
- Direct rotation complex: element (i,j) → (j, n-1-i)
- Observation: transpose + reverse rows = 90° clockwise
- Transpose: swap across main diagonal (i,j) ↔ (j,i)
- Reverse rows: reverse each row left-to-right
- Both operations in-place: O(1) space
- O(n²) time to visit all elements

1. Transpose matrix:
   For i from 0 to n-1:
     For j from i+1 to n-1:
       Swap matrix[i][j] with matrix[j][i]
2. Reverse each row:
   For i from 0 to n-1:
     Reverse row i (two pointers: left=0, right=n-1)
```

### C# Solution:
```csharp
public void Rotate(int[][] matrix) {
    int n = matrix.Length;
    
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    
    for (int i = 0; i < n; i++) {
        int left = 0, right = n - 1;
        while (left < right) {
            int temp = matrix[i][left];
            matrix[i][left] = matrix[i][right];
            matrix[i][right] = temp;
            left++;
            right--;
        }
    }
}
```

### Complexity

**Time Complexity**: O(n²) where n is the dimension of the matrix. We visit each element twice (transpose and reverse).

**Space Complexity**: O(1) in-place rotation with only constant extra space for swapping.

## Spiral Matrix | LeetCode 54 | Medium
Given an m x n matrix, return all elements of the matrix in spiral order. The spiral starts from the top-left, goes right, then down, then left, then up, and continues spiraling inward.

### Examples:
1. Input: matrix = [[1,2,3],[4,5,6],[7,8,9]], Output = [1,2,3,6,9,8,7,4,5]  
   - Start at top-left: go right [1,2,3]
   - Go down: [6,9]
   - Go left: [8,7]
   - Go up: [4]
   - Center: [5]

2. Input: matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]], Output = [1,2,3,4,8,12,11,10,9,5,6,7]  
   - 3×4 matrix
   - Outer ring: [1,2,3,4,8,12,11,10,9,5]
   - Inner row: [6,7]

3. Input: matrix = [[1]], Output = [1]  
   - Single element

4. Input: matrix = [[1,2,3]], Output = [1,2,3]  
   - Single row
   - Just traverse right

5. Input: matrix = [[1],[2],[3],[4]], Output = [1,2,3,4]  
   - Single column
   - Just traverse down

### Pseudocode:
```
WHY BOUNDARY TRACKING?
- Spiral visits boundaries, then shrinks inward
- Track four boundaries: top, bottom, left, right
- Direction sequence: right → down → left → up → repeat
- After each direction, shrink corresponding boundary
- Stop when boundaries cross
- O(m × n) time, O(1) space (excluding output)

1. Initialize: top=0, bottom=m-1, left=0, right=n-1
2. Initialize result list
3. While top <= bottom AND left <= right:
   - Go right: from left to right on row top, then top++
   - Go down: from top to bottom on column right, then right--
   - If top <= bottom: go left from right to left on row bottom, then bottom--
   - If left <= right: go up from bottom to top on column left, then left++
4. Return result
```

### C# Solution:
```csharp
public IList<int> SpiralOrder(int[][] matrix) {
    List<int> result = new List<int>();
    if (matrix.Length == 0) return result;
    
    int top = 0, bottom = matrix.Length - 1;
    int left = 0, right = matrix[0].Length - 1;
    
    while (top <= bottom && left <= right) {
        for (int col = left; col <= right; col++) {
            result.Add(matrix[top][col]);
        }
        top++;
        
        for (int row = top; row <= bottom; row++) {
            result.Add(matrix[row][right]);
        }
        right--;
        
        if (top <= bottom) {
            for (int col = right; col >= left; col--) {
                result.Add(matrix[bottom][col]);
            }
            bottom--;
        }
        
        if (left <= right) {
            for (int row = bottom; row >= top; row--) {
                result.Add(matrix[row][left]);
            }
            left++;
        }
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(m × n) where m is rows and n is columns. We visit each element exactly once.

**Space Complexity**: O(1) excluding the output list. Only uses boundary pointers.

## Set Matrix Zeroes | LeetCode 73 | Medium
Given an m x n integer matrix `matrix`, if an element is 0, set its entire row and column to 0's. You must do it in place.

### Examples:
1. Input: matrix = [[1,1,1],[1,0,1],[1,1,1]], Output = [[1,0,1],[0,0,0],[1,0,1]]  
   - Zero at position (1,1)
   - Row 1 becomes all zeros
   - Column 1 becomes all zeros

2. Input: matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]], Output = [[0,0,0,0],[0,4,5,0],[0,3,1,0]]  
   - Zeros at (0,0) and (0,3)
   - Row 0 all zeros
   - Columns 0 and 3 all zeros

3. Input: matrix = [[1,2,3],[4,5,6],[7,8,9]], Output = [[1,2,3],[4,5,6],[7,8,9]]  
   - No zeros
   - Matrix unchanged

4. Input: matrix = [[0]], Output = [[0]]  
   - Single element zero

5. Input: matrix = [[1,0,3],[4,5,6],[7,8,9]], Output = [[0,0,0],[4,0,6],[7,0,9]]  
   - Zero at (0,1)
   - Row 0 becomes zeros
   - Column 1 becomes zeros

### Pseudocode:
```
WHY USE FIRST ROW/COLUMN AS MARKERS?
- Cannot immediately set to zero (loses information about other zeros)
- Extra O(m+n) space: store which rows/columns to zero
- Optimize: use first row and first column as marker storage
- Scan matrix: if matrix[i][j] = 0, mark matrix[i][0] and matrix[0][j]
- Need separate flags for first row and first column themselves
- Apply zeros based on markers, handle first row/column last
- O(m × n) time, O(1) space

1. Check if first row has zero → firstRowZero
2. Check if first column has zero → firstColZero
3. Scan matrix[1..m-1][1..n-1]:
   If matrix[i][j] == 0:
     matrix[i][0] = 0 (mark row)
     matrix[0][j] = 0 (mark column)
4. Apply zeros based on markers:
   For i from 1 to m-1:
     For j from 1 to n-1:
       If matrix[i][0] == 0 OR matrix[0][j] == 0:
         matrix[i][j] = 0
5. If firstRowZero: zero out row 0
6. If firstColZero: zero out column 0
```

### C# Solution:
```csharp
public void SetZeroes(int[][] matrix) {
    int m = matrix.Length;
    int n = matrix[0].Length;
    bool firstRowZero = false;
    bool firstColZero = false;
    
    for (int j = 0; j < n; j++) {
        if (matrix[0][j] == 0) firstRowZero = true;
    }
    
    for (int i = 0; i < m; i++) {
        if (matrix[i][0] == 0) firstColZero = true;
    }
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }
        }
    }
    
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            if (matrix[i][0] == 0 || matrix[0][j] == 0) {
                matrix[i][j] = 0;
            }
        }
    }
    
    if (firstRowZero) {
        for (int j = 0; j < n; j++) {
            matrix[0][j] = 0;
        }
    }
    
    if (firstColZero) {
        for (int i = 0; i < m; i++) {
            matrix[i][0] = 0;
        }
    }
}
```

### Complexity

**Time Complexity**: O(m × n) where m is rows and n is columns. We scan the matrix multiple times.

**Space Complexity**: O(1) using the matrix itself for marker storage, only two boolean flags needed.

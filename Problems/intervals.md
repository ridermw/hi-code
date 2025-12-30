# Interval Problems

## Interval Concept

### What are Interval Problems?
Interval problems involve working with ranges or time periods, typically represented as [start, end] pairs. These problems often require merging, scheduling, or finding overlaps between intervals. The key insight is that sorting intervals (usually by start or end time) often reveals the optimal approach.

### Core Operations:
- **Sort**: Order intervals by start or end time - O(n log n)
- **Merge**: Combine overlapping intervals - O(1) per merge
- **Compare**: Check if intervals overlap - O(1)
- **Track**: Maintain active/overlapping intervals - O(n)

### When to Use Interval Techniques?
Use interval approaches when:
- Problem involves time ranges, meetings, or schedules
- Need to find overlaps or gaps between ranges
- Merging or splitting time periods
- Keywords: "meetings", "intervals", "overlapping", "schedule", "merge"
- Sorting by start/end time simplifies the problem
- Need to track concurrent events (use heap/priority queue)
- Boundary conventions matter: most are closed [start,end]; Meeting Rooms III uses half-open [start,end) so touching there is non-overlapping

### Common Interval Patterns:
```
1. Merge Overlapping Intervals:
   Sort by start time
   Compare current with previous
   Merge if overlapping
   O(n log n) time
   
2. Interval Scheduling (Maximum non-overlapping):
   Sort by end time
   Greedily select earliest ending interval
   Skip overlapping intervals
   O(n log n) time
   
3. Minimum Meeting Rooms (Maximum overlapping):
   Use start/end events or min heap
   Track concurrent intervals
   O(n log n) time
   
4. Insert/Merge Single Interval:
   Find position to insert
   Merge with overlapping neighbors
   O(n) time
```

### Example:
**Problem:** Merge Intervals - combine all overlapping intervals

**Approach:** Sort by start time. Compare each interval with the previous merged interval. If they overlap (current.start ≤ previous.end), merge them by updating the end time. Otherwise, add as a new interval.

**Time:** O(n log n) for sorting, O(n) for merging = O(n log n) overall

---

## Can Attend Meetings | LeetCode 252 | Easy
Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, determine if a person could attend all meetings.

### Examples:
1. Input: intervals = [[0,30],[5,10],[15,20]], Output = false  
   - Meeting [0,30] overlaps with [5,10]
   - Cannot attend all meetings

2. Input: intervals = [[7,10],[2,4]], Output = true  
   - No overlapping meetings
   - Can attend all

3. Input: intervals = [[1,5],[5,8],[10,15]], Output = true  
   - [1,5] and [5,8] don't overlap (touching at boundary is ok for this problem)
   - Can attend all

4. Input: intervals = [[1,4],[2,3]], Output = false  
   - [2,3] is completely within [1,4]
   - Overlap exists

5. Input: intervals = [[1,2],[3,4],[5,6]], Output = true  
   - All meetings are separate
   - Can attend all

### Pseudocode:
```
APPROACH:
- Sort intervals by start time
- Check each consecutive pair for overlap
- Two intervals [a,b] and [c,d] overlap if a < d and c < b
- After sorting, only need to check if previous.end > current.start
- O(n log n) time, O(1) space (excluding sort)

1. Sort intervals by start time
2. For i from 1 to n-1:
   - If intervals[i].start < intervals[i-1].end:
     return false (overlap detected)
3. Return true (no overlaps)
```

### C# Solution:
```csharp
public bool CanAttendMeetings(int[][] intervals) {
    if (intervals.Length <= 1) return true;
    
    // Sort by start time
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    
    // Check for overlaps
    for (int i = 1; i < intervals.Length; i++) {
        if (intervals[i][0] < intervals[i-1][1]) {
            return false; // Overlap found
        }
    }
    
    return true;
}
```

### Complexity

**Time Complexity**: O(n log n) where n is the number of intervals, dominated by sorting.

**Space Complexity**: O(1) if sorting in-place, O(n) if sort creates a copy.

---

## Merge Intervals | LeetCode 56 | Medium
Given an array of intervals where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

### Examples:
1. Input: intervals = [[1,3],[2,6],[8,10],[15,18]], Output = [[1,6],[8,10],[15,18]]  
   - [1,3] and [2,6] overlap → merge to [1,6]
   - [8,10] and [15,18] are separate

2. Input: intervals = [[1,4],[4,5]], Output = [[1,5]]  
   - [1,4] and [4,5] touch at 4 → merge to [1,5]

3. Input: intervals = [[1,4],[0,4]], Output = [[0,4]]  
   - [0,4] contains [1,4] → result is [0,4]

4. Input: intervals = [[1,4],[2,3]], Output = [[1,4]]  
   - [2,3] is completely inside [1,4]

5. Input: intervals = [[2,3],[4,5],[6,7],[8,9],[1,10]], Output = [[1,10]]  
   - [1,10] overlaps with all others
   - All merge into [1,10]

### Pseudocode:
```
APPROACH:
- Sort intervals by start time
- Iterate through sorted intervals
- If current overlaps with last merged interval: extend the end
- Otherwise: add current interval to result
- Two intervals overlap if current.start <= previous.end
- O(n log n) time, O(n) space

1. Sort intervals by start time
2. Initialize result with first interval
3. For each interval in sorted intervals:
   - If interval.start <= result.last.end:
     result.last.end = max(result.last.end, interval.end)
   - Else:
     result.add(interval)
4. Return result
```

### C# Solution:
```csharp
public int[][] Merge(int[][] intervals) {
    if (intervals.Length <= 1) return intervals;
    
    // Sort by start time
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    
    var merged = new List<int[]>();
    merged.Add(intervals[0]);
    
    for (int i = 1; i < intervals.Length; i++) {
        int[] current = intervals[i];
        int[] last = merged[merged.Count - 1];
        
        if (current[0] <= last[1]) {
            // Overlapping - merge by extending end
            last[1] = Math.Max(last[1], current[1]);
        } else {
            // Non-overlapping - add as new interval
            merged.Add(current);
        }
    }
    
    return merged.ToArray();
}
```

### Complexity

**Time Complexity**: O(n log n) where n is the number of intervals, dominated by sorting.

**Space Complexity**: O(n) for the result array. O(log n) if counting sort space.

---

## Insert Interval | LeetCode 57 | Medium
You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [start_i, end_i]` represent the start and the end of the ith interval and intervals is sorted in ascending order by start_i. You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by start_i and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary). Return intervals after the insertion.

### Examples:
1. Input: intervals = [[1,3],[6,9]], newInterval = [2,5], Output = [[1,5],[6,9]]  
   - [2,5] overlaps with [1,3] → merge to [1,5]
   - [6,9] remains separate

2. Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8], Output = [[1,2],[3,10],[12,16]]  
   - [4,8] overlaps with [3,5], [6,7], [8,10]
   - Merge all to [3,10]

3. Input: intervals = [[1,5]], newInterval = [0,3], Output = [[0,5]]  
   - [0,3] overlaps with [1,5]
   - Merge to [0,5]

4. Input: intervals = [[1,5]], newInterval = [6,8], Output = [[1,5],[6,8]]  
   - No overlap
   - Add [6,8] after [1,5]

5. Input: intervals = [[3,5],[12,15]], newInterval = [6,6], Output = [[3,5],[6,6],[12,15]]  
   - [6,6] goes between existing intervals

### Pseudocode:
```
APPROACH:
- Three phases: before overlap, during overlap, after overlap
- Phase 1: Add all intervals that end before newInterval starts
- Phase 2: Merge all intervals that overlap with newInterval
- Phase 3: Add all intervals that start after newInterval ends
- No sorting needed - already sorted!
- O(n) time, O(n) space

1. Initialize result = []
2. For each interval:
   - If interval.end < newInterval.start:
     result.add(interval) // Before overlap
   - Else if interval.start > newInterval.end:
     result.add(newInterval) // Add merged
     result.add(interval) // After overlap
     newInterval = null // Mark as added
   - Else: // Overlapping
     newInterval.start = min(newInterval.start, interval.start)
     newInterval.end = max(newInterval.end, interval.end)
3. If newInterval not added: result.add(newInterval)
4. Return result
```

### C# Solution:
```csharp
public int[][] Insert(int[][] intervals, int[] newInterval) {
    var result = new List<int[]>();
    int i = 0;
    int n = intervals.Length;
    
    // Add all intervals before newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.Add(intervals[i]);
        i++;
    }
    
    // Merge all overlapping intervals
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.Min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.Max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.Add(newInterval);
    
    // Add all intervals after newInterval
    while (i < n) {
        result.Add(intervals[i]);
        i++;
    }
    
    return result.ToArray();
}
```

### Complexity

**Time Complexity**: O(n) where n is the number of intervals. Single pass through array.

**Space Complexity**: O(n) for the result array.

---

## Non Overlapping Intervals | LeetCode 435 | Medium
Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**Note:** This is a classic greedy algorithm problem - it's equivalent to the interval scheduling maximization problem.

### Examples:
1. Input: intervals = [[1,2],[2,3],[3,4],[1,3]], Output = 1  
   - Remove [1,3]
   - Remaining [1,2],[2,3],[3,4] don't overlap

2. Input: intervals = [[1,2],[1,2],[1,2]], Output = 2  
   - Keep one [1,2], remove two others

3. Input: intervals = [[1,2],[2,3]], Output = 0  
   - Already non-overlapping

4. Input: intervals = [[1,100],[11,22],[1,11],[2,12]], Output = 2  
   - Remove [1,100] and one other
   - Or remove [2,12] and [11,22]

5. Input: intervals = [[0,2],[1,3],[2,4],[3,5],[4,6]], Output = 2  
   - Remove [1,3] and [3,5]
   - Keep [0,2],[2,4],[4,6]

### Pseudocode:
```
APPROACH:
- Greedy: Sort by end time
- Always keep interval that ends earliest
- Count how many intervals we need to skip (remove)
- If current.start < previous.end: overlap, remove current
- Otherwise: update previous end
- O(n log n) time, O(1) space

1. Sort intervals by end time
2. Initialize count = 0, prevEnd = intervals[0].end
3. For i from 1 to n-1:
   - If intervals[i].start < prevEnd:
     count++ // Overlap - remove this interval
   - Else:
     prevEnd = intervals[i].end // No overlap - update end
4. Return count
```

### C# Solution:
```csharp
public int EraseOverlapIntervals(int[][] intervals) {
    if (intervals.Length <= 1) return 0;
    
    // Sort by end time
    Array.Sort(intervals, (a, b) => a[1].CompareTo(b[1]));
    
    int count = 0;
    int prevEnd = intervals[0][1];
    
    for (int i = 1; i < intervals.Length; i++) {
        if (intervals[i][0] < prevEnd) {
            // Overlap - need to remove this interval
            count++;
        } else {
            // No overlap - update end
            prevEnd = intervals[i][1];
        }
    }
    
    return count;
}
```

### Complexity

**Time Complexity**: O(n log n) where n is the number of intervals, dominated by sorting.

**Space Complexity**: O(1) if sorting in-place, O(log n) for sort space.

---

## Meeting Rooms II | LeetCode 253 | Medium
Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.

### Examples:
1. Input: intervals = [[0,30],[5,10],[15,20]], Output = 2  
   - [0,30] and [5,10] overlap → need 2 rooms
   - [15,20] also overlaps with [0,30] → still 2 rooms max

2. Input: intervals = [[7,10],[2,4]], Output = 1  
   - No overlap → need only 1 room

3. Input: intervals = [[1,5],[2,3],[4,6]], Output = 2  
   - [1,5] and [2,3] overlap → 2 rooms
   - [4,6] overlaps with [1,5] → still 2 rooms max

4. Input: intervals = [[1,2],[2,3],[3,4]], Output = 1  
   - No overlap (touching doesn't count)
   - 1 room sufficient

5. Input: intervals = [[1,10],[2,3],[4,5],[6,7],[8,9]], Output = 2  
   - [1,10] overlaps with all others
   - Maximum 2 rooms needed at any time

### Pseudocode:
```
APPROACH 1 (Min Heap):
- Sort by start time
- Use min heap to track end times of ongoing meetings
- When new meeting starts:
  - Remove meetings that have ended (peek heap)
  - Add current meeting's end time to heap
- Max heap size = max rooms needed
- O(n log n) time, O(n) space

APPROACH 2 (Start/End Events):
- Separate start and end times, sort both
- Use two pointers to process events chronologically
- Start event: need one more room
- End event: free one room
- Track maximum rooms needed
- O(n log n) time, O(n) space

1. Sort intervals by start time
2. Initialize min heap (priority queue)
3. Add first meeting's end time to heap
4. For each meeting from second onwards:
   - While heap.top <= meeting.start:
     heap.pop() // Meeting ended, room freed
   - heap.push(meeting.end) // Allocate room
5. Return heap.size
```

### C# Solution (Min Heap):
```csharp
public int MinMeetingRooms(int[][] intervals) {
    if (intervals.Length == 0) return 0;
    
    // Sort by start time
    Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
    
    // Min heap to track end times
    var heap = new PriorityQueue<int, int>();
    heap.Enqueue(intervals[0][1], intervals[0][1]);
    
    for (int i = 1; i < intervals.Length; i++) {
        // If earliest meeting ended, free the room
        if (heap.Peek() <= intervals[i][0]) {
            heap.Dequeue();
        }
        
        // Allocate room for current meeting
        heap.Enqueue(intervals[i][1], intervals[i][1]);
    }
    
    return heap.Count;
}
```

### C# Solution (Start/End Events):
```csharp
public int MinMeetingRooms(int[][] intervals) {
    if (intervals.Length == 0) return 0;
    
    int n = intervals.Length;
    int[] starts = new int[n];
    int[] ends = new int[n];
    
    for (int i = 0; i < n; i++) {
        starts[i] = intervals[i][0];
        ends[i] = intervals[i][1];
    }
    
    Array.Sort(starts);
    Array.Sort(ends);
    
    int rooms = 0;
    int maxRooms = 0;
    int startPtr = 0, endPtr = 0;
    
    while (startPtr < n) {
        if (starts[startPtr] < ends[endPtr]) {
            // Meeting starts, need a room
            rooms++;
            maxRooms = Math.Max(maxRooms, rooms);
            startPtr++;
        } else {
            // Meeting ends, free a room
            rooms--;
            endPtr++;
        }
    }
    
    return maxRooms;
}
```

### Complexity

**Time Complexity**: O(n log n) where n is the number of intervals. Sorting + heap operations.

**Space Complexity**: O(n) for the heap or start/end arrays.

---

## Employee Free Time | LeetCode 759 | Hard
We are given a list `schedule` of employees, which represents the working time for each employee. Each employee has a list of non-overlapping Intervals, and these intervals are in sorted order. Return the list of finite intervals representing common, positive-length free time for all employees, also in sorted order.

### Examples:
1. Input: schedule = [[[1,2],[5,6]],[[1,3]],[[4,10]]], Output = [[3,4]]  
   - Employee 1: busy [1,2],[5,6]
   - Employee 2: busy [1,3]
   - Employee 3: busy [4,10]
   - Common free time: [3,4]

2. Input: schedule = [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]], Output = [[5,6],[7,9]]  
   - Merge all busy times: [1,5],[6,7],[9,12]
   - Free times: [5,6],[7,9]

3. Input: schedule = [[[1,3],[4,6],[7,9]],[[2,4],[6,8]]], Output = []  
   - Merge: [1,4], [4,8], [7,9] → [1,4], [4,9] → [1,9]
   - No gaps, so no free time

4. Input: schedule = [[[1,2],[3,4]],[[5,6]]], Output = [[2,3],[4,5]]  
   - Gaps between intervals

5. Input: schedule = [[[1,10]],[[2,3]],[[4,5]]], Output = []  
   - [1,10] covers everything
   - No free time

### Pseudocode:
```
APPROACH:
- Flatten all intervals from all employees
- Sort all intervals by start time
- Merge overlapping intervals (find busy times)
- Gaps between merged intervals = free time (only if gap length > 0)
- Handle empty schedules (no intervals → no free time)
- O(n log n) time where n = total intervals

0. If schedule is empty or contains no intervals: return []
1. Flatten all intervals into one list
2. Sort by start time
3. Merge overlapping intervals:
   - Keep track of current busy interval
   - Extend end if overlapping
   - If gap exists, add free time to result
4. Return free time intervals
```

### C# Solution:
```csharp
public class Interval {
    public int start;
    public int end;
    public Interval(int s, int e) { start = s; end = e; }
}

public IList<Interval> EmployeeFreeTime(IList<IList<Interval>> schedule) {
    var result = new List<Interval>();
    var intervals = new List<Interval>();
   if (schedule == null || schedule.Count == 0) return result;
    
    // Flatten all intervals
    foreach (var employee in schedule) {
        intervals.AddRange(employee);
    }
   if (intervals.Count == 0) return result;
    
    // Sort by start time
    intervals.Sort((a, b) => a.start.CompareTo(b.start));
    
    // Find free time by identifying gaps
    var busy = intervals[0];
    
    for (int i = 1; i < intervals.Count; i++) {
        if (intervals[i].start <= busy.end) {
            // Overlapping - extend busy time
            busy.end = Math.Max(busy.end, intervals[i].end);
        } else {
            // Gap found - this is free time
            result.Add(new Interval(busy.end, intervals[i].start));
            busy = intervals[i];
        }
    }
    
    return result;
}
```

### Complexity

**Time Complexity**: O(n log n) where n is the total number of intervals across all employees. Dominated by sorting.

**Space Complexity**: O(n) for flattened intervals list.

---

## Meeting Rooms III | LeetCode 2402 | Hard
You are given an integer `n` representing the number of rooms numbered from 0 to n - 1. You are given a 2D integer array `meetings` where `meetings[i] = [start_i, end_i]` means that a meeting will be held during the half-closed time interval `[start_i, end_i)`. All the values of start_i are unique. Meetings are allocated to rooms in the following manner:
1. Each meeting will take place in the unused room with the lowest number.
2. If no rooms are available, the meeting will be delayed until a room becomes free. The delayed meeting should have the same duration as the original meeting.
3. When a room becomes unused, meetings that have an earlier original start time should be given the room.

Return the number of the room that held the most meetings. If there are multiple rooms, return the room with the lowest number.

### Examples:
1. Input: n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]], Output = 0  
   - Meeting [0,10] uses room 0 (ends at 10)
   - Meeting [1,5] uses room 1 (ends at 5)
   - Meeting [2,7] waits for room 1, starts at 5 (ends at 10)
   - Meeting [3,4] waits for room 0 or 1, starts at 10 (ends at 11)
   - Room 0: 2 meetings, Room 1: 2 meetings
   - Return 0 (lowest room number with max meetings)

2. Input: n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]], Output = 1  
   - Complex allocation with delays

3. Input: n = 2, meetings = [[0,10],[1,2],[12,13]], Output = 0  
   - Room 0: [0,10],[12,13] → 2 meetings
   - Room 1: [1,2] → 1 meeting

### Pseudocode:
```
APPROACH:
- Sort meetings by start time
- Use two heaps:
  1. Available rooms (min heap by room number)
  2. Busy rooms (min heap by end time, then room number)
- For each meeting:
   - Free rooms whose end time ≤ meeting start
   - Assign to lowest-numbered available room
   - If none available, delay meeting to earliest finishing room's end time
- Track meeting count per room
- O(m log n) time where m = meetings, n = rooms

1. Sort meetings by start time
2. Initialize:
    - available rooms heap (0 to n-1)
    - busy rooms heap prioritized by (endTime, room)
    - meeting count array[n]
3. For each meeting (start, end):
    - While busy not empty and busy.top.endTime <= start:
       (room, _) = busy.pop()
       available.push(room)
    - If available not empty:
       room = available.pop()
       busy.push((end, room))
    - Else: // Delay meeting
       (room, endTime) = busy.pop()
       newEnd = endTime + (end - start)
       busy.push((newEnd, room))
    - meetingCount[room]++
4. Return room with max count (lowest number if tie)
```

### C# Solution:
```csharp
public int MostBooked(int n, int[][] meetings) {
    // Sort meetings by start time
    Array.Sort(meetings, (a, b) => a[0].CompareTo(b[0]));
    
    // Available rooms (min heap by room number)
    var available = new PriorityQueue<int, int>();
    for (int i = 0; i < n; i++) {
        available.Enqueue(i, i);
    }
    
    // Busy rooms (min heap by end time, then room number)
    var busy = new PriorityQueue<int, (long, int)>();
    
    int[] meetingCount = new int[n];
    
    foreach (var meeting in meetings) {
        long start = meeting[0];
        long end = meeting[1];
        
        // Free rooms that are done
        while (busy.Count > 0) {
            busy.TryPeek(out int room, out var priority);
            if (priority.Item1 <= start) {
                busy.Dequeue();
                available.Enqueue(room, room);
            } else {
                break;
            }
        }
        
        if (available.Count > 0) {
            // Assign to available room
            int room = available.Dequeue();
            busy.Enqueue(room, (end, room));
            meetingCount[room]++;
        } else {
            // Delay meeting - take earliest available room
            busy.TryDequeue(out int room, out var priority);
            long endTime = priority.Item1;
            long duration = end - start;
            long newEnd = endTime + duration;
            busy.Enqueue(room, (newEnd, room));
            meetingCount[room]++;
        }
    }
    
    // Find room with most meetings (lowest number if tie)
    int maxCount = 0;
    int resultRoom = 0;
    for (int i = 0; i < n; i++) {
        if (meetingCount[i] > maxCount) {
            maxCount = meetingCount[i];
            resultRoom = i;
        }
    }
    
    return resultRoom;
}
```

### Complexity

**Time Complexity**: O(m log m + m log n) where m is the number of meetings and n is the number of rooms. Sorting meetings + heap operations.

**Space Complexity**: O(n) for the heaps and count array.

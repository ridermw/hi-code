// Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] 
// such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.
// Notice that the solution set must not contain duplicate triplets.

// Example 1:
// Input: nums = [-1,0,1,2,-1,-4]
// Output: [[-1,-1,2],[-1,0,1]]
// Explanation: 
// nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
// nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0.
// nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0.
// The distinct triplets are [-1,0,1] and [-1,-1,2].
// Notice that the order of the output and the order of the triplets does not matter.

// Example 2:
// Input: nums = [0,1,1]
// Output: []
// Explanation: The only possible triplet does not sum up to 0.

// Example 3:
// Input: nums = [0,0,0]
// Output: [[0,0,0]]
// Explanation: The only possible triplet sums up to 0.

// Constraints:
// 3 <= nums.length <= 3000
// -10^5 <= nums[i] <= 10^5

public class Solution {
    public IList<IList<int>> ThreeSum(int[] nums) {
        // iterate over the array,
        // take one value and find the complement for 0, then add to a twosum function
        // if twosum exists, then add to solution.
        // 
        var returnList = new List<List<int>>();

        for (int i; i < nums.Length - 2; i++)
        {
            var target = 0 - nums[i];
            var twosList = TwoSum(nums, target, i + 1);
            foreach (var pair in twosList)
            {
                returnList.Add(new List<int>() {i, pair[0], pair[1]});
            }
        }

        return returnList;
    }

    public IList<int[]> TwoSum(int[] nums, int target, int startIndex) {
        // solve TwoSums problem,
        // could be mulitple index pairs
        // start at startIndex to not evaluate previous nums to the left.
        var comps = new Dictionary<int, List<int>>();
        var returnList = new List<int[]>();

        for (int i = startIndex; i < nums.Length; i++) {
            var current = nums[i];
            var comp = target - current;

            if (!comps.ContainsKey(current))
                comps[current] = new List<int>();

            if (comps[current].Count > 0) {
                var compIndex = comps[current].Remove(0);
                returnList.Add(new int[2] {i, compIndex});
            }
            else {
                comps[current].Add(i);
            }
        }

        return returnList;
    }
}

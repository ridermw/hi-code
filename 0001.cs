// Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

// You may assume that each input would have exactly one solution, and you may not use the same element twice.

// You can return the answer in any order.

 

// Example 1:

// Input: nums = [2,7,11,15], target = 9
// Output: [0,1]
// Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
public class Solution {
	public int[] TwoSum(int[] nums, int target) {

		// dictionary: store complement of the number needed for the target.
		// key is the complement, value is the location in index.


		// foreach n in nums,
		// find complement of n, if exists, return [index of n, index of complement]
		// else add to dict[n] = index.

		var comps = new Dictionary<int, int>();

		for (int i = 0; i < nums.Length; i++) {
			var current = nums[i];
			var comp = target - current;

			if (comps.TryGetValue(comp, out int compIndex)) {
				return new int[2] {compIndex, i};
			}
			
			// overwrites comps[current] if it already exits.
			comps[current] = i;
		}

		return new int[2];

	}
}
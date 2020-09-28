/**
 * Object composition with curried functions.
 *
 * The chain starts by taking a key, returning a function that takes
 * a value, returning a function that takes an object which it tries
 * to merge the value on to.
 *
 * @example
 *
 * const withFoo = withKey('foo');
 *
 * // Simple value types
 * const withFooBar = withFoo('bar');
 * const o1 = withFooBar({baz: 'bat'}); // {foo: 'bar', baz: 'bat'}
 *
 * // Complex value type
 * const withFooObj = withFoo({bar: 'pick a bar?'});
 * const o2 = withFooObj({baz: bat}); // {foo: {bar: 'pick a bar?'}, baz: 'bat'}
 *
 * // Merging values
 * const o3 = withFooObj({foo: {baz: 'already here'}});
 * // {foo: {bar: 'pick a bar?', baz: 'already here'}}
 *
 * // overriding values
 * const o4 = withFooObj({foo: {bar: 'already here'}});
 * // {foo: {bar: 'pick a bar?'}}
 *
 * // with arrays
 * const withMyArray = withKey('myArray');
 * const withSomeValues = withMyArray([1, 2, 3]);
 * const o5 = withSomeValues();
 * // {myArray: [1, 2, 3]}
 *
 * const o6 = withSomeValues({myArray: [-2, -1, 0]});
 * // {myArray: [-2, -1, 0, 1, 2, 3]}
 *
 *
 * @param {String} key - The name of the key
 * @returns {Function}
 */
export default function withKey(key) {
	/**
	 * Given the key passed into `withKey` this function accepts the
	 * value that will be used for the given `key`.
	 *
	 * @param {*} value - The value to use for the given `key`
	 * @returns {Function}
	 */
	return function withValue(value) {
		/**
		 * Given the key/value pair passed into `withKey` and `withValue`,
		 * this function will accept an object and attempt to merge the
		 * key/value pair from the functions curried above.
		 *
		 * @param {Object} obj - The object on which to operate
		 * @returns {Object} The updated object
		 */
		return function mergeObject(obj = {}) {
			let valueToMerge;
			// Simple case: add or override values when...
			// - key does not exist
			// - existing value is of different type than new value
			// - value of unmergeable type
			if (
				typeof obj[key] === 'undefined' ||
				typeof obj[key] !== typeof value ||
				['string', 'number', 'function'].includes(typeof value)
			) {
				valueToMerge = value;
				// At this point we know that the object we're merging with has a value
				// for the given key, so if the new value is an array, then we will assume
				// the old value is also an array, and naively merge them.
				// This is by design until we need to support overwriting existing keys
				// with different types (eg. when obj[key] is a string, but you want to
				// overwrite it with an array).
			} else if (Array.isArray(value)) {
				valueToMerge = obj[key].concat(value);
			} else {
				// Last possible case is that it is an object, so we spread the new value on to
				// the existing value
				valueToMerge = { ...obj[key], ...value };
			}
			return { ...obj, ...{ [key]: valueToMerge } };
		};
	};
}

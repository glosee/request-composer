// Below is Eric Elliot's simple compose implementation, which I find works really well
// (https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983)

/**
 * A basic compose implementation, which takes a list of functions, and returns a function that will apply them when invoked.
 *
 * @example
 *
 * const f1 = n => n + 1;
 * const f2 = n => n * 2;
 * const composed = compose(f1, f2);
 * composed(9); // 20 (9 + 1 = 10, 10 * 2 = 20)
 *
 * @param  {Array[Function]} fns - A list of functions
 * @returns {Function} - A function that passes the given argument into the composition
 */
export default function compose(...fns) {
	return function initialCall(x) {
		return fns.reduceRight((value, nextFn) => nextFn(value), x);
	};
}

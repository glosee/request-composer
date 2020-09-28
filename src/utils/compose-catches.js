/**
 * This is just compose for functions that throw errors, allowing you to compose multiple "catches" instead of chaining them.
 *
 * @example
 *
 * const logError = error => {
 *   logger.error(error);
 *   throw error;
 * }
 *
 * const enhance400Error = error => {
 *   if (error.status === 400) {
 *     error = {...error, message: 'you goofed' };
 *   }
 *   throw error;
 * }
 *
 * const errorHandlers = composeCatches(logError, enhance400Error);
 * makeRequest().catch(errorHandlers);
 *
 * @param  {...Function} catches - All arguments must be functions
 * @returns {Function} A function that will run the passed error through all curried functions.
 */
export default function composeCatches(...catches) {
	/**
	 * The function returned from `composeCatches` will execute the passed in catches and throw the result, so that
	 * you can further chain `.catch` calls if you'd like.
	 *
	 * @param {Error} err - An error object
	 * @throws on purpose
	 */
	return function executeCatches(err) {
		const result = catches.reduceRight((acc, next) => {
			try {
				next(acc);
			} catch (e) {
				return e;
			}
		}, err);
		throw result;
	};
}

import compose from './compose';
import composeCatches from './compose-catches';

// TODO: some is fishy between makeFetcher and wrapPromise... either one or the other needs to
// execute sooner, eg.
// const makeFetcher = url => request => fetch(url, request()); OR
// const wrapPromise = chains => promiseMaker => promiseMaker()...
// The new `makeFetcher` inside the example below may be the solution...

/**
 * Given lists of "catches" and "thens", this function will return another function that can be
 * used to wrap a Promise with those post-calls chained.
 *
 * NOTE: for this pattern to work with chaining multiple `catch` handlers, you have to actually
 * return the error passed in instead of throwing it.
 *
 * In the below example we create a promise wrapper that includes global error handling for blanket
 * logout when the response code implies the user cannot access a given resource.
 *
 *
 * @example
 *
 * function globalErrorHandler(err) {
 *   if ([401, 403].includes(err.status)) {
 *     logoutUser(err.message);
 *   }
 *   return err; // DO NOT THROW otherwise we cannot compose catchers
 * }
 *
 * const wrappedFetch = makeFetcher(fetch);
 * const withGlobalErrorHandler = wrapPromise({ catches: [globalErrorHandler] });
 * const customerRequest = withGlobalErrorHandler(wrappedFetch('https://my-api.com/v1/customer'));
 * const createCustomer = customerRequest(postRequest);
 * createCustomer(withBody({ firstName: 'Graham', lastName: 'Losee'}))
 *   .then(data => doSomething(data))
 *   .catch(err => logger.error(`Error creating new customer ${err.status}`))
 *
 * @param {catches: Array, thens: Array} - An object with lists of post-calls to chain to the
 * @returns {Function} - A function that accepts a function that returns a promise
 */
export default function wrapPromise({ catches = [], thens = [] }) {
	return function withAfterEffects(promiseMaker) {
		return function executePromise(...args) {
			return promiseMaker(...args)
				.then(compose(...thens))
				.catch(composeCatches(...catches));
		};
	};
}

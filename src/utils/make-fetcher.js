// TODO: Can we not rely on compose somehow?
import compose from './compose.js';

/**
 * A utility to build reusable "fetchers" using partial application.
 *
 * @example
 *
 * const myFetcher = makeFetcher(fetch);
 * const fetchCustomer = myFetcher('https://api.com/v1/customer);
 * const createCustomer = fetchCustomer(withMethod('POST'));
 * createCustomer(withBody({ firstName: 'Graham', lastName: 'Losee' }))
 *   .then(handleSuccess)
 *   .catch(handleError)
 *
 * @param {Function} fetchModule - A function that executes a request
 * @returns {Function} - A function that accepts a URL to bind requests to
 */
export default function makeFetcher(fetchModule) {
	/**
	 * The first function returned from makeFetcher accepts a URL to bind the fetcher to.
	 *
	 * @example
	 *
	 * const myFetcher = makeFetcher(axios.request);
	 * const fetchFromOffers = myFetcher('https://my-api.com/v1/offers');
	 * // fetchFromOffers(requestData)(additionalData) - will execute the request
	 *
	 * @param {String} url - The URL to fetch
	 * @returns {Function} - A function that accepts a request composer
	 */
	return function bindUrlToFetcher(url) {
		/**
		 * The second function returned from `makeFetcher` accepts and binds a requestComposer.
		 *
		 * @example
		 *
		 * const myFetcher = makeFetcher(fetch);
		 * const fetchFromOffers = myFetcher('https://my-api.com/v1/offers');
		 * const getOffers = fetchFromOffers(withMethod('GET'));
		 * // getOffers(withUserId(userId)) - will execute the request
		 *
		 * @param {Function} request - A function that, when executed, will return a request object
		 * @returns {Function} - A function that will execute the request when called
		 */
		return function bindRequestToFetcher(request) {
			/**
			 * The third and final function returned from `makeFetcher` accepts additional parameters to merge on to
			 * the request composer.
			 *
			 * @example
			 *
			 * const myFetcher = makeFetcher(fetch);
			 * const fetchFromOffers = myFetcher('https://my-api.com/v1/offers');
			 * const getOffers = fetchFromOffers(withMethod('GET'));
			 * getOffers(withUserId(userId)).then(res => res.json()).then(handleOffersData);
			 *
			 * @param {Function} moreData - An optional second requestComposer to add data onto the bound request
			 * @returns {Promise|any} - Whatever the result of calling the originally passed in `fetchModule` is
			 */
			return function executeRequest(moreData) {
				let req = request;
				if (moreData) {
					req = compose(moreData, request);
				}
				return fetchModule(url, req());
			};
		};
	};
}

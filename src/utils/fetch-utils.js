export const mergeUrlParts = url => path => `${url}${path}`;

// TODO: add to utils
const naiveStringifyBody = (body = {}) => {
	return Object.entries(body).reduce((acc, [k, v]) => `${acc}&${k}=${v}`, '');
};

// TODO: add to utils
// Turn `body` into `params` for a GET request
export const fetchGetRequestWithBody = (url, request) => {
	// Just pass through if it's not a GET request
	if (request.method.toLowerCase() !== 'get' || !request.body) {
		console.log('fetchGetRequestWithBody::returning direct fetch call');
		return fetch(url, request);
	}
	// Stringify and remove body so request can work
	const { body, ...rest } = request;
	const params = naiveStringifyBody(body);
	return fetch(`${url}?${params}`, rest);
};

export const wrapFetch = (...args) => {
	if (args.length === 1) {
		// This means user just passed one object
		return fetchGetRequestWithBody(...args);
	}
	// This means user passed a URL and then a request
	const [_url, request] = args;
	// Handle case where request also has a URL param, but default to the
	// URL passed as first arg to be more flexible
	const { url = _url, path, ...rest } = request;
	if (path) {
		return fetchGetRequestWithBody(mergeUrlParts(url)(path), rest);
	}
	return fetchGetRequestWithBody(url, rest);
};

export default wrapFetch;

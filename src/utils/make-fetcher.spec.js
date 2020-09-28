import makeFetcher from './make-fetcher';
import withKey from './with-key';

describe('makeFetcher', () => {
	const fauxFetcher = jest.fn(data => Promise.resolve(data));

	describe('first wrap', () => {
		it('should return a function', () => {
			const fetcher = makeFetcher(fauxFetcher);
			expect(typeof fetcher).toEqual('function');
			expect(fetcher.name).toEqual('bindUrlToFetcher');
		});
	});
	describe('second wrap', () => {
		it('should return a function', () => {
			const fetcherWithUrl = makeFetcher(fauxFetcher)('banana');
			expect(typeof fetcherWithUrl).toEqual('function');
			expect(fetcherWithUrl.name).toEqual('bindRequestToFetcher');
		});
	});
	describe('third wrap', () => {
		it('should return a function', () => {
			const fetcherWithRequest = makeFetcher(fauxFetcher)('banana')(withKey);
			expect(typeof fetcherWithRequest).toEqual('function');
			expect(fetcherWithRequest.name).toEqual('executeRequest');
		});
	});
	describe('execute', () => {
		afterEach(() => {
			fauxFetcher.mockReset();
		});
		it('should call the given fetch function, passing the curried URL and request', async () => {
			const result = makeFetcher(fauxFetcher)('banana')(() => 'pudding');
			await result();
			expect(fauxFetcher).toHaveBeenCalledWith('banana', 'pudding');
		});
		it('should call curried request composer function', async () => {
			const mockFn = jest.fn();
			const result = makeFetcher(fauxFetcher)('banana')(mockFn);
			await result();
			expect(mockFn).toHaveBeenCalled();
		});
		it('should call additional request composer function', async () => {
			const mockFn = jest.fn();
			const result = makeFetcher(fauxFetcher)('banana')(() => 'pudding');
			await result(mockFn);
			expect(mockFn).toHaveBeenCalled();
		});
		it('should call the given fetch function, composing additional data with curried data', async () => {
			// Using `withKey` so internal call to compose works
			const withBody = withKey('body');
			const withMethod = withKey('method');
			const expectedRequest = { body: { foo: 'bar' }, method: 'POST' };
			const result = makeFetcher(fauxFetcher)('banana')(withMethod('POST'));
			await result(withBody({ foo: 'bar' }));
			expect(fauxFetcher).toHaveBeenCalledWith('banana', expectedRequest);
		});
		it('should throw if curried request composer is not a function', async () => {
			const result = makeFetcher(fauxFetcher)('banana')('pudding');
			expect(() => result()).toThrow();
		});
		it('should throw if additional request composer is not a function', async () => {
			const result = makeFetcher(fauxFetcher)('banana')(() => 'pudding');
			expect(() => result('apple')).toThrow();
		});
	});
});

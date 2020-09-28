import composeCatches from './compose-catches';

describe('composeCatches', () => {
	it('should call all given functions, passing the given error to each, and throw the result', () => {
		const testFunctions = [3, 2, 1].map(n => err => {
			err.message = `${err.message}-call${n}`;
			throw err;
		});
		const expected = 'myerror-call1-call2-call3';
		const error = new Error('myerror');
		try {
			composeCatches(...testFunctions)(error);
		} catch (e) {
			expect(e.message).toEqual(expected);
		}
	});
	it('should call all given functions when passed to a promise', async () => {
		const testFunctions = [3, 2, 1].map(n => err => {
			err.message = `${err.message}-call${n}`;
			throw err;
		});
		const expected = 'myerror-call1-call2-call3';
		const error = new Error('myerror');
		try {
			await Promise.reject(error).catch(composeCatches(...testFunctions));
		} catch (e) {
			expect(e).toEqual(e);
			expect(e.message).toEqual(expected);
		}
	});
});

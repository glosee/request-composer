import wrapPromise from './wrap-promise';

describe('wrapPromise', () => {
	it('should call all thens when promise is executed', async () => {
		const thens = [x => `${x}-call03`, x => `${x}-call02`, x => `${x}-call01`];
		const expected = 'result-call01-call02-call03';
		const promise = () => Promise.resolve('result');
		const withMyThens = wrapPromise({ thens });
		const actual = await withMyThens(promise)();
		expect(actual).toEqual(expected);
	});

	it('should call all catches and throw result when promise is executed', async () => {
		const catches = [
			x => {
				x.message = `${x.message}-call03`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call02`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call01`;
				throw x;
			},
		];
		const error = new Error('myerror');
		const expected = 'myerror-call01-call02-call03';
		const promise = jest.fn(() => Promise.reject(error));
		const withMyCatches = wrapPromise({ catches });
		await withMyCatches(promise)().catch(err => {
			// It threw the error
			expect(err).toEqual(error); // It used the same error
			expect(err.message).toEqual(expected); // It called all functions and appended to the message
		});
	});

	it('should call all catches if a then throws', async () => {
		const promise = () => Promise.resolve('result');
		const error = new Error('myerror');
		const thens = [
			x => {
				throw error;
			},
			x => `${x}-call02`,
			x => `${x}-call01`,
		];
		const catches = [
			x => {
				x.message = `${x.message}-call03`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call02`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call01`;
				throw x;
			},
		];
		const withAll = wrapPromise({ thens, catches });
		const expected = 'myerror-call01-call02-call03';
		await withAll(promise)().catch(err => {
			// It threw the error
			expect(err).toEqual(error); // It used the same error
			expect(err.message).toEqual(expected); // It called all functions and appended to the message
		});
	});

	it('should return a promise that can be chained again with more thens when resolved', done => {
		const thens = [x => `${x}-call03`, x => `${x}-call02`, x => `${x}-call01`];
		const expected = 'result-call01-call02-call03';
		const promise = () => Promise.resolve('result');
		const withMyThens = wrapPromise({ thens });
		// Don't use async/await to test then chains
		withMyThens(promise)().then(x => {
			expect(x).toEqual(expected);
			done();
		});
		// Force promise to resolve
		process.nextTick(() => {});
	});

	it('should return a promise that can be chained again with more catches when rejected', () => {
		const catches = [
			x => {
				x.message = `${x.message}-call03`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call02`;
				throw x;
			},
			x => {
				x.message = `${x.message}-call01`;
				throw x;
			},
		];
		const error = new Error('myerror');
		const expected = 'myerror-call01-call02-call03';
		const promise = jest.fn(() => Promise.reject(error));
		const withMyCatches = wrapPromise({ catches });
		withMyCatches(promise)().catch(err => {
			// It threw the error
			expect(err).toEqual(error); // It used the same error
			expect(err.message).toEqual(expected); // It called all functions and appended to the message
		});
		process.nextTick(() => {});
	});
});

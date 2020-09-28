import compose from './compose';

describe('compose', () => {
	it('should return a function that composes the passed in functions', () => {
		const f1 = jest.fn(x => x);
		const f2 = jest.fn(x => x);
		const composed = compose(f1, f2);
		expect(typeof composed).toEqual('function');
		expect(composed(1)).toEqual(1);
		expect(f1).toHaveBeenCalledWith(1);
		expect(f2).toHaveBeenCalledWith(1);
	});

	it('should compose in reverse order of arguments', () => {
		const f1 = jest.fn(x => x + 2);
		const f2 = jest.fn(x => x * 2);
		let composed = compose(f1, f2);
		expect(composed(1)).toEqual(4); // [1 * 2 = 2, 2 + 2 = 4]
		composed = compose(f2, f1);
		expect(composed(1)).toEqual(6); // [1 + 2 = 3, 3 * 2 = 6];
	});

	it('should handle a random number of arguments', () => {
		const fns = [...Array(Math.round(Math.random() * 10)).keys()].map(() =>
			jest.fn(),
		);
		compose(...fns)('banana');
		fns.forEach(fn => expect(fn).toHaveBeenCalled());
	});

	it('should throw if something passed in is not a function', () => {
		const f1 = x => x + 1;
		const f2 = 'banana';
		const composed = compose(f1, f2);
		expect(() => composed(1)).toThrow();
	});
});

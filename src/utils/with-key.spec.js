import withKey from './with-key';

describe('withKey', () => {
	describe('first call', () => {
		it('should return a function', () => {
			const actual = withKey('foo');
			expect(typeof actual).toEqual('function');
			expect(actual.name).toEqual('withValue');
		});
	});

	describe('second call', () => {
		it('should return a function', () => {
			const actual = withKey('foo')('bar');
			expect(typeof actual).toEqual('function');
			expect(actual.name).toEqual('mergeObject');
		});
	});

	describe('execution', () => {
		it('should use a new object when no argument passed', () => {
			const expected = { foo: 'bar' };
			const actual = withKey('foo')('bar')();
			expect(actual).toEqual(expected);
		});

		it('should add the given value to given object when key does not exist', () => {
			const expected = { foo: 'bar', baz: 'bat' };
			const actual = withKey('foo')('bar')({ baz: 'bat' });
			expect(actual).toEqual(expected);
		});

		it('should override string value at key when key does exist', () => {
			const expected = { foo: 'banana' };
			const actual = withKey('foo')('banana')({ foo: 'bar' });
			expect(actual).toEqual(expected);
		});

		it('should override number value at key when key does exist', () => {
			const expected = { foo: 456 };
			const actual = withKey('foo')(456)({ foo: 123 });
			expect(actual).toEqual(expected);
		});

		it('should override function value at key when key does exist', () => {
			const fn = jest.fn();
			const expected = { foo: fn };
			const actual = withKey('foo')(fn)({ foo: () => 'other fn' });
			expect(actual).toEqual(expected);
		});

		it('should override any value at key when type of new value is different from old value', () => {
			const expected = { foo: 123 };
			const actual = withKey('foo')(123)({ foo: 'banana' });
			expect(actual).toEqual(expected);
		});

		it('should add values to array when value is an array', () => {
			const expected = { foo: [1, 2, 3, 4, 5, 6] };
			const actual = withKey('foo')([4, 5, 6])({ foo: [1, 2, 3] });
			expect(actual).toEqual(expected);
		});

		it('should add value to object when value is an object', () => {
			const expected = { foo: { bar: 'baz', bat: 'banana' } };
			const actual = withKey('foo')({ bat: 'banana' })({ foo: { bar: 'baz' } });
			expect(actual).toEqual(expected);
		});
	});
});

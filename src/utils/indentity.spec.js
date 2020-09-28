import identity from './identity';

describe('identity', () => {
	it('should return what was passed', () => {
		expect(identity('foo')).toBe('foo');
		expect(identity(undefined)).toBe(undefined);
		expect(identity(12345)).toBe(12345);
		const referenceCheck = { foo: 'bar' };
		expect(identity(referenceCheck)).toBe(referenceCheck);
	});
});

import compose from '/src/utils/compose.js';
import makeFetcher from '/src/utils/make-fetcher.js';
import withKey from '/src/utils/with-key.js';
import wrapFetch from '/src/utils/fetch-utils.js';

// Some common request attributes
const withPath = withKey('path');
const withBody = withKey('body');
const withHeaders = withKey('headers');
const withMode = withKey('mode');
const withMethod = withKey('method');

// Simple currying of method types
const getRequest = withMethod('GET');
const postRequest = withMethod('POST');

// using path
const fetchUser = makeFetcher(wrapFetch)('https://api.github.com/users/glosee');
// const getMe = fetchUser(compose(withMethod('GET'), withPath('/glosee')));
const getMe = fetchUser(compose(getRequest, withMode('cors')));
async function test2() {
	try {
		const res = await getMe();
		const me = await res.json();
		console.log(me);
		const fetchMyAvatar = makeFetcher(wrapFetch)(me.avatar_url)(
			withMethod('GET'),
		);
		let avatar = await fetchMyAvatar();
		avatar = await avatar.blob();
		console.log(avatar, URL.createObjectURL(avatar));
		const imgEl = document.createElement('img');
		imgEl.src = URL.createObjectURL(avatar);
		document.body.appendChild(imgEl);
	} catch (e) {
		throw e;
	}
}
test2();

// other tests
// const data = { foo: 'bar' };
// const path = '/foo';
// const headers = { 'Authorization': 'Bearer 12345' };
// const baseRequest = compose(withBody(data), withPath(path), withHeaders(headers));
// const enhancedRequest = compose(
// 	withBody({ baz: 'bat' }), withHeaders({ 'Accept-Language': 'en-CA' })
// );
// console.log(baseRequest());
// console.log(enhancedRequest(baseRequest()));

// // could also be used to compose complex request bodies
// const withFormData = withKey('formData')
// const myFormInputs = [
//   {name: 'firstName', value: 'Graham'},
//   {name: 'middleName', value: 'Donale'},
//   {name: 'lastName', value: 'Losee'},
//   {name: 'phoneNumber', value: '123456789'},
// ];
// const formData = withFormData(myFormInputs.reduce((acc, {name, value}) => {
//   return withKey(name)(value)({...acc})
// }, {}));
// const body = compose(formData, withKey('banana'));
// console.log('last one', body());

// // try getting a meme
// const memeFetcher = makeFetcher('http://apimeme.com/meme')
// const getMeme = memeFetcher(compose(withBody({
//   meme: 'Condescending-Wonka',
//   top: 'let me guess...',
//   bottom: 'you are really good at fetch',
//   test: 1
// })));
// console.log(getMeme);

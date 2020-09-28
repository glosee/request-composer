import compose from '/src/utils/compose.js';
import makeFetcher from '/src/utils/make-fetcher.js';
import withKey from '/src/utils/with-key.js';
import wrapFetch from '/src/utils/fetch-utils.js';

// Some common request attributes
const withMode = withKey('mode');
const withMethod = withKey('method');

// Simple currying of method types
const getRequest = withMethod('GET');

const axiosFetcher = makeFetcher(axios.request);

// using path
const fetchUser = axiosFetcher('https://api.github.com/users/glosee');
// const getMe = fetchUser(compose(withMethod('GET'), withPath('/glosee')));
const getMe = fetchUser(compose(getRequest, withMode('cors')));
async function test2() {
	try {
		const { data: me } = await getMe();
		console.log(me);
		const imgEl = document.createElement('img');
		imgEl.src = me.avatar_url;
		document.body.appendChild(imgEl);
	} catch (e) {
		throw e;
	}
}
test2();

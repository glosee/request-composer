# request-composer

An exercise is using composition to make http requests.

## Module explained

_TLDR: this module is a somewhat messy WIP, and therefore it is not published to npm. It works, but there are some niceties that need to be sorted out._

This module exposes a number of utilities for composing http requests. It was initially intended to try to create a functional-style API for working with `fetch`.

I initially created this as an experiment over the winter holidays in 2019, when I was frustrated by (and hit the limitations of) another request library. After messing about with it, I really liked the patterns that emerged, and I have been trying to use this library when I can ever since.

There are some messy parts of the code and the package in general. Specifically I'd like to mention:

- the file [./src/utils/fetch-utils.js](./src/utils/fetch-utils.js) is messy and entirely untested -- that's not great...
- there is a bug that I have not done RCA on yet in [./src/utils/wrap-promise.js](./src/utils/wrap-promise.js) -- there is a comment at the top of this file outlining the issue
- the overall scope of the library is unclear... what started out as a clear solution to a particular problem has morphed into a loose collection of utils istead. I need to consider what I want to keep here, and what I want to separate.
  - That said: I have moved the utility `with-key` out into its own package, which I've started to manage here: [grahaml/with-key](https://github.com/grahaml/with-key)

Despite these clear pitfalls, I have posted this here for my own amusement, and so I can continue to refine it as time goes on. The intention is morese to perfect the developer experience, rather than to create a package that gets 1M downloads a day.

Given these clear pitfalls, _this package has not actually been published to npm_. I intend to clean things up when I find the time, and ensure that what I do publish is focused and actually useful.

NOW - All that aside, here are some examples of what you can do with this library:

## Examples

```javascript
import { compose, withKey } from 'request-composer';

const BASE_URL = 'https://my-api.com/';
const baseUrlWithPath = path => `${BASE_URL}${PATH}`;

// Make a common request object
const withUrl = withKey('url');
const withHeaders = withKey('headers');
const withBody = withKey('body');
const withMethod = withKey('method');

const commonHeaders = compose(
  withHeaders({ 'Authorization': `Bearer ${myTokenFromSomewhere}` }),
  withHeaders({ 'Content-Type': 'application/json' })
);

// Further that by adding more common params
const postRequest = compose(commonHeaders, withMethod('POST'));
const getRequest = compose(commonHeaders, withMethod('GET'));

// Make more specific calls
const createCustomer = data => compose(postRequest, withUrl(baseUrlWithPath('/v1/customer')), withBody(data));
const getCustomer = customerId => compose(getRequest, withUrl(baseUrlWithPath(`/v1/customer/${customerId}`));

// Use with fetch!
fetch(getCustomer(myTokenFromSomewhere.customerId))
  .then(response => {
    if (!response.ok) {
      throw new Error(`Error getting customer at ${myTokenFromSomewhere.customerId}`);
    }
    return response.json();
  })
  .catch(logger.error);

fetch(createCustomer({ lastName: 'ever', firstName: 'greatest}))
  .then(response => {
    if (!response.ok) {
      throw new Error(`Could not create customer: ${response.status}`);
    }
    return response.json()
  )
  .catch(logger.error);

// Could also use with axios!
axios.request(
  compose(
    postRequest,
    withData({ foo: 'bar' }), // axios uses `data` instead of `body`
  ))
  .then(({ data }) => data)
  .catch(logger.error)
```

It also includes a handy util that attempts to make working with `fetch` a little easier:

```javascript
import { makeFetcher } from 'request-composer';

const makeCustomerAPICall = makeFetcher('https://my-api.com/v1/customer');
const patchCustomer = makeCustomerAPICall(withMethod('PATCH'));

async function updateCustomer(customerId, data) {
  const response = await patchCustomer(
    withBody({customerId, ...data});
  );
  if (response.ok) {
    return response.json();
  }
}
```

You can even use the utils for complex request bodies:

```javascript
import { withKey } from 'request-composer';

const withFormData = withKey('formData');

// Imagine this was actually a form submission...
const myFormInputs = [
	{ name: 'firstName', value: 'Graham' },
	{ name: 'lastName', value: 'Losee' },
	{ name: 'phoneNumber', value: '123456789' },
];

const formData = withFormData(
	myFormInputs.reduce((acc, { name, value }) => {
		return withKey(name)(value)({ ...acc });
	}, {}),
);
// { firstName: 'Graham', lastName: 'Losee', phoneNumber: '1234567890' }

const createCustomer = compose(postRequest, withBody(formData));
// { method: 'POST', body: { formData }, ...etc }
```

### Live Examples

There are a handful of examples to check out how this works in the browser. See [the examples/ dir]('./examples') in this repository.

#### Running the live examples

To run the examples you will need to clone this repository and build the modules. You will also need to run a simple http server, as the example files load the ES modules directly, and those cannot be loaded over the `file://` protocol.

I recommend using the [`serve`](https://github.com/zeit/serve) module from `npm`, which prefers global installation.

```
$ npm install -g serve
$ serve -p 3001
```

You could also use `python`'s simple http server.

```
$ python -m SimpleHTTPServer
```

The paths in the example are set up to work if your server is running from the root directory of this project.

```bash
$ git clone ... # clone request-composer
$ cd request-composer
$ npm install # ... and wait
$ npm run build # ... and wait - this is actually quite short
$ serve -p 3001
```

Once the server is running go to `http://localhost:{port}/examples/` in your browser to view a list of the available eamples, then select any example to see it in action.

## TODO

- add example with another library - an alternative to `axios`
- split up and add unit tests for fetch utils
- make `wrapFetch` wrap anything -- specifically expose ability to add to the URL via `path` param on a request object

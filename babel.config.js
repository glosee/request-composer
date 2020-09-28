const { NODE_ENV } = process.env;
const targets =
	NODE_ENV === 'test' ? { node: 'current' } : { browsers: ['last 2 versions'] };
module.exports = {
	presets: [['@babel/preset-env', { targets }]],
};

const assert = require('assert');
const request = require('supertest'); // library for making test http requests
const app = require('../app');

describe('the express app', () => {
	it('handles a GET request to /ping', (done) => {
		request(app) // call request, pass in 'app'
			.get('/ping') // chain on customising statement - get request to '/api' in this case
			.end((err, response) => {
				assert(response.body.ping === 'pinging');
				done();
			});
	});
});

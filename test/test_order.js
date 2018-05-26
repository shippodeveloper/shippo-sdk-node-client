let chai = require('chai'),
  assert  = chai.assert,
  ApiClient = require('../src/ApiClient').ApiClient;
describe('DeliveryOrder Endpoint', function () {
  let apiClient;

  beforeEach(function () {
    apiClient = new ApiClient({})
  });

  it('Should get delivery order object', async function () {
    apiClient.callApi('DeliveryOrders/8082442635', {
      qs: {
        access_token: 'rUNY5Q0ipU60TrA4PqaY0TmKg2BHGI6HQkenCQ5WahaVJTxcSFdk3WnJvZ3RVqQD',
      }
    }, function (data) {
      assert.equal(data.createdTime, '2018-05-24T09:57:59.793Z');
    });
  });
});
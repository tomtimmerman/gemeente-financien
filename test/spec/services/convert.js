'use strict';

describe('Service: Convert', function () {

  // load the service's module
  beforeEach(module('gemeenteFinancienApp'));

  // instantiate service
  var Convert;
  beforeEach(inject(function (_Convert_) {
    Convert = _Convert_;
  }));

  it('should do something', function () {
    expect(!!Convert).toBe(true);
  });

});

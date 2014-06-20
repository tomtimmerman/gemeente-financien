'use strict';

describe('Directive: stackedSlopeGraph', function () {

  // load the directive's module
  beforeEach(module('gemeenteFinancienApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<stacked-slope-graph></stacked-slope-graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the stackedSlopeGraph directive');
  }));
});

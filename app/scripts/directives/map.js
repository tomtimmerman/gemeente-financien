'use strict';

angular.module('gemeenteFinancienApp')
  .directive('map', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {


				element.text('this is the map directive');



				/*
				----------------------------------------------------------------------------------------
				--- METHODES
				----------------------------------------------------------------------------------------
				*/





				/*
				----------------------------------------------------------------------------------------
				--- PROPERTIES
				----------------------------------------------------------------------------------------
				*/





				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/




      }
    };
  });

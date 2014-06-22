'use strict';

angular.module('gemeenteFinancienApp')
  .directive('municipalityDetails', function () {
    return {
      //template: '<div></div>',
      templateUrl: '../../views/municipalityDetails.html',
      scope: {
        data: '&data',
        municipalityId: '&municipalityId'
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        //element.text('this is the municipalityDetails directive');

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
				scope.dataset = {};




				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/

				// 
				scope.$watch('municipalityId', function() {
					//console.log(scope.data());
					scope.dataset = scope.data(); // read dataset from controller and set the dataset for the directive scope
					

				});




      }
    };
  });

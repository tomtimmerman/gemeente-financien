'use strict';

angular.module('gemeenteFinancienApp')
  .directive('list', function () {
    return {
      //template: '<div></div>',
      templateUrl: '../../views/list.html',
      restrict: 'E',      
      scope: {
        data: '&data',
        selectedMunicipalities: '=selected'
      },
      link: function postLink(scope, element, attrs) {
      	
        //element.text('this is the list directive');
        



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
				scope.dataset = [];




				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/

				// 
				scope.$watch('selectedMunicipalities', function() {
					//console.log(scope.selected);
					//console.log(scope.data());
					scope.dataset = scope.data(); // read dataset from controller and set the dataset for the directive scope

					// sort dataset on value
					scope.dataset.sort(function(a, b){
						return b.value-a.value;
					})

					// add a rank to dataset entries
					for (var i = 0; i < scope.dataset.length; i++) {
						scope.dataset[i].rank = i+1;
					};
				});

      }
    };
  });

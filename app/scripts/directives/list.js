'use strict';

angular.module('gemeenteFinancienApp')
  .directive('list', function (filterFilter, Convert) {
    return {
      //template: '<div></div>',
      templateUrl: '../../views/list.html',
      restrict: 'E',      
      scope: {
        data: '=data',
        selectedMunicipalities: '=selected',
        filters: '=filters'
      },
      link: function postLink(scope, element, attrs) {
      	
        //element.text('this is the list directive');
        


				/*
				----------------------------------------------------------------------------------------
				--- METHODES
				----------------------------------------------------------------------------------------
				*/

				// 
				var filterDataset = function() {
					scope.dataset = scope.originalDataset; // reset dataset
					if(scope.filters.length > 0) {
			    	scope.dataset = filterFilter(scope.dataset, function(value) {
			    		var returnValue = true;
							for (var i = 0; i < scope.filters.length; i++) {
								if (value.coalition.indexOf(scope.filters[i]) === -1) {
									returnValue = false;
								};
							};
			    		return returnValue;
			    	});
					};
				}


				// 
				var getAverage = function() {
					var total = 0;
					for (var i = 0; i < scope.dataset.length; i++) {
						total += scope.dataset[i].value;
					};
					return Math.round(total/(i+1));
				}


				//
				scope.setSelected = function(id) {
					if (scope.selectedMunicipalities.indexOf(id) === -1) {
						scope.selectedMunicipalities.push(id); // add selectedMunicipalities to filters array
					} else {
						scope.selectedMunicipalities.splice(scope.selectedMunicipalities.indexOf(id), 1); // remove selectedMunicipalities from filters array
					};
				}





				/*
				----------------------------------------------------------------------------------------
				--- PROPERTIES
				----------------------------------------------------------------------------------------
				*/
				scope.originalDataset = []; // original dataset to reset the dataset after filtering out item
				scope.dataset = [];
				scope.average = 0; //  total of the values of the entire dataset
				scope.filteredAverage = 0; // total of the values of the filtered dataset
				scope.convert = Convert; // expose convert service to scope




				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/


				// 
				scope.$watch('data', function() {
					scope.dataset = scope.data; // 
					scope.originalDataset = scope.data; // 

					// sort dataset on value
					scope.dataset.sort(function(a, b){
						return b.value-a.value;
					})

					// add a rank to dataset entries
					for (var i = 0; i < scope.dataset.length; i++) {
						scope.dataset[i].rank = i+1;
					};

					scope.average = getAverage();

					filterDataset();

					scope.filteredAverage = getAverage();
				});



				/*
				// 
				scope.$watchCollection('selectedMunicipalities', function() {


				});
				*/


				// 
				scope.$watchCollection('filters', function() {

					filterDataset();

					scope.filteredAverage = getAverage();

				});

      }
    };
  });

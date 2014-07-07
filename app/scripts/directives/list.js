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
        filters: '=filters',
        //legend: '=legend'
        type: '@type',
        getColorScale: '&colorScale'
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
//console.log(scope.color(1500));
//console.log(scope.color(0));
//console.log();


					scope.dataset = scope.originalDataset; // reset dataset

					// filter out 0 values
					scope.dataset = filterFilter(scope.dataset, function(item) { 
						var returnValue = true;
						if (item.value === 0 || item.value === null) {returnValue = false;};
						return returnValue;
					});

					// 
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
					var count = 0;
					for (var i = 0; i < scope.dataset.length; i++) {
						total += scope.dataset[i].value;
						if (scope.dataset[i].value !== 0) {count++}; // only count values that are above 0
					};
					return Math.round(total/count);
				}


				/*
				// returns the class for the municipality path
				scope.getClass = function(value) {
//console.log(scope.legend);
					var returnClass = 'none';
					for (var i = 0; i < scope.legend.categories.length; i++) {
						if (returnClass === 'none' && value !== null && scope.legend.categories[i].max > value && scope.legend.categories[i].min === null && scope.legend.categories[i].max !== null) {
							returnClass = scope.legend.categories[i].class;
						} else if(returnClass === 'none' && value !== null && scope.legend.categories[i].max > value && scope.legend.categories[i].min <= value && scope.legend.categories[i].max !== null && scope.legend.categories[i].min !== null) {
							returnClass = scope.legend.categories[i].class;
						} else if(returnClass === 'none' && value !== null && scope.legend.categories[i].max === null && scope.legend.categories[i].min <= value && scope.legend.categories[i].min !== null) {
							returnClass = scope.legend.categories[i].class;
						//} else if(returnClass === 'none' && scope.legend.categories[i].max === null && scope.legend.categories[i].min === null) {
							//returnClass = scope.legend.categories[i].class;
						};
					};
					return returnClass;
				}
				*/


				//
				scope.setSelected = function(id) {
					if (scope.selectedMunicipalities.indexOf(id) === -1) {
						scope.selectedMunicipalities.push(id); // add selectedMunicipalities to filters array
					} else {
						scope.selectedMunicipalities.splice(scope.selectedMunicipalities.indexOf(id), 1); // remove selectedMunicipalities from filters array
					};
				}


				// returns the color of the badge
				scope.getColor = function(value) {
					 return (value !== null && value !== 0) ? color(value) : '#f1f1f1';
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
				var color; // color scale



				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/


				// 
				scope.$watch('data', function() {
					scope.dataset = scope.data; // 
					scope.originalDataset = scope.data; // 

					scope.average = getAverage();

					filterDataset();

					scope.filteredAverage = getAverage();

					color = scope.getColorScale(); // set color scale

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

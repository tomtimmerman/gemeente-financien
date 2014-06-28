'use strict';

angular.module('gemeenteFinancienApp')
  .directive('map', function ($window, Convert) {
    return {
      //template: '<div></div>',
      templateUrl: '../../views/map.html',
      restrict: 'E',
      scope: {
        data: '=data',
        selectedMunicipalities: '=selected',
        filters: '=filters',
        legend: '=legend'
      },
      link: function postLink(scope, element, attrs) {


				//element.text('this is the map directive');







				/*
				----------------------------------------------------------------------------------------
				--- METHODES
				----------------------------------------------------------------------------------------
				*/

				// returns the width of the element
				scope.getElementDimentions = function () {
					return {'width': angular.element(element).find('div').width(), 'height': angular.element(element).find('div').height()};
				};


				// returns data object for the municipality
				var getMunicipalityData = function(id) {
					var returnObject = {};
					for (var i = 0; i < scope.dataset.length; i++) {
						if (scope.dataset[i].id === id) {
							returnObject = scope.dataset[i];
						};
					};
					return returnObject;
				}


				// returns the class for the municipality path
				var getClass = function(value) {
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


				// 
				var drawMap = function() {
					// clear map
					svg.selectAll('g').remove(); // remove all groups, empty svg element

					// add group that contains all the municipality paths
					var map = svg.append('g')
						.attr('id', 'map');

					// init map projection and path generator
					projection = d3.geo.mercator()
					    .center([7,52.5])
					    .scale(6750)
					    .rotate([0,0]);

					path = d3.geo.path()
					    .projection(projection);

					// draw map
					d3.json('../../data/gemeentes_topojson.json', function(error, nl) {
					  if (error) return console.error(error);

					  map.selectAll('path')
					    //.data(topojson.object(nl, nl.objects.gemeentes_geojson).geometries)
					    .data(topojson.feature(nl, nl.objects.gemeentes_geojson).features)
					    .enter()
					      .append('path')
					      .attr('d', path)
					      //.attr('class', 'municipality')
					      .attr('class', function(d) {
					      	var mData = getMunicipalityData(d.id);
					      	var value = (mData.value) ? mData.value : null;
					      	//console.log(mData);
					      	var c = getClass(value);
					      	//console.log(c);
					      	return c;
					      })
					      .on('mouseover', function(d) {
									//var clientRect = d3.select(this).node().getBoundingClientRect(); // dimentions en position of element
									//drawTooltip(d.id, clientRect);
									//console.log(d.id);
									var mData = getMunicipalityData(d.id);
									console.log(mData);
								})
					      .on('mouseout', function(d) {
					        //svg.selectAll('.tooltip').remove(); // remove tooltip
					      });

					});

				}


				//
				var updateMap = function() {

					svg.select('#map').selectAll('path')
						.attr('class', function(d) {

							//console.log(d);
			      	var mData = getMunicipalityData(d.id);
			      	var value = (mData.value) ? mData.value : null;
			      	var c = getClass(value);
			      	return c;

						})



console.log('-----------');
console.log('sub1: ' + svg.select('#map').selectAll('.sub1')[0].length);
console.log('sub2: ' + svg.select('#map').selectAll('.sub2')[0].length);
console.log('sub3: ' + svg.select('#map').selectAll('.sub3')[0].length);
console.log('sub4: ' + svg.select('#map').selectAll('.sub4')[0].length);
console.log('sub5: ' + svg.select('#map').selectAll('.sub5')[0].length);
console.log('sub6: ' + svg.select('#map').selectAll('.sub6')[0].length);
					
				}



				/*
				----------------------------------------------------------------------------------------
				--- PROPERTIES
				----------------------------------------------------------------------------------------
				*/

				//scope.originalDataset = []; // original dataset to reset the dataset after filtering out item
				scope.dataset = {};
				var w = angular.element($window); // window object
				var svg = null; // handle to svg element
				var width = 0; // width of the chart
				var height = 0; // height of the chart
				var projection; // map projection
				var path; // map path generator



				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/

				// 
				scope.$watch('data', function() {
					scope.dataset = scope.data; // 
					//scope.originalDataset = scope.data; // 


					if(svg !== null) {
						updateMap();
					}


				});


				// 
				scope.$watchCollection('filters', function() {
					
				});


				// 
				scope.$watchCollection('legend', function() {
//console.log(scope.legend);
				});


				// watch if the width of the element changes
				scope.$watch(scope.getElementDimentions, function (newValue, oldValue) {
					// 
					width = newValue.width;
					height = width * 1.2;
					if(height > 600) height = 600; // set max height of 600px

					// initialize chart if it isn't initialized yet
					if(svg === null) {
						svg = d3.select(element[0]).append('svg')
							.attr('width', width)
							.attr('height', height);
					};

					// update chart dimentions
					svg
						.attr('width', width)
						.attr('height', height);



					drawMap();

					//updateMap();
					/*
					==============================================================
					Kan ook kijken of ik de hele map kan scalen i.p.v opnieuw teken bij resize
					==============================================================
					*/

				}, true);


				// apply scope when window is resized????
				w.bind('resize', function () {
					scope.$apply();
				});






      }
    };
  });

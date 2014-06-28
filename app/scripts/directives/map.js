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

				//
				scope.setSelected = function(id) {
					if (scope.selectedMunicipalities.indexOf(id) === -1) {
						scope.selectedMunicipalities.push(id); // add selectedMunicipalities to filters array
					} else {
						scope.selectedMunicipalities.splice(scope.selectedMunicipalities.indexOf(id), 1); // remove selectedMunicipalities from filters array
					};
				}


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



					// init map projection and path generator
					//projection = d3.geo.mercator()
					    //.rotate([0,0])
					    //.center([7,52.5])
					    //.scale(6750);
					    //.scale(width)
					    //.translate([0, 0]);
					    //.translate([width / 2, height / 2]);
					    //.scale(height*10);
					    //
					    //.center([5.378247, 52.013965]);
					    //.center([6.5,52.5]);
					    //.translate([width / 2, height / 2]);
					    //.translate([-300, 800]);

					/*
					// define zoom behavior
					var zoom = d3.behavior.zoom()
						.scaleExtent([1, 8])
						.on("zoom", move);
					*/

					// 
					//path = d3.geo.path()
					    //.projection(projection);


					// bind zoom funcitonality to svg element
					//svg.call(zoom);

					// add group that contains all the municipality paths
					var map = svg.append('g')
						.attr('id', 'map');

					// draw map
					d3.json('../../data/gemeentes_topojson.json', function(error, nl) {
					  if (error) return console.error(error);


						var b = d3.geo.bounds(topojson.feature(nl, nl.objects.gemeentes_geojson).features[393]); // get position of gemeente Woudenberg, most central gemeente for centering map

					  //
					  projection = d3.geo.mercator()
					  	.center([(b[1][0]+b[0][0])/2, (b[1][1]+b[0][1])/2])
					  	.translate([width/2, height/2])
					  	.scale(height*10);

					  //
						path = d3.geo.path()
						    .projection(projection);


					  map.selectAll('path')
					    //.data(topojson.object(nl, nl.objects.gemeentes_geojson).geometries)
					    .data(topojson.feature(nl, nl.objects.gemeentes_geojson).features)
					    .enter()
					      .append('path')
					      .attr('d', path)
					      //.attr('class', 'municipality')
					      .attr('class', function(d, i) {
					      	var mData = getMunicipalityData(d.id);
					      	var value = (mData.value) ? mData.value : null;
					      	var c = getClass(value);

					      	// add selected class to selected municipalities
					      	if (scope.selectedMunicipalities.indexOf(d.id) !== -1) {
					      		c+= ' selected';
					      	};
//var mData = getMunicipalityData(d.id);
//if (mData.name === 'Woudenberg') {console.log('Woudenberg:'+i)};
					      	return c;
					      })
					      .on('click', function(d) {
					      	scope.setSelected(d.id);
					      	scope.$apply();
								})
					      .on('mouseover', function(d) {
									var mData = getMunicipalityData(d.id);
									//console.log(mData);
								})
					      .on('mouseout', function(d) {
					        //svg.selectAll('.tooltip').remove(); // remove tooltip
					      });

					});

					/*
					// scroll and zoom the map
					function move() {
					  var t = d3.event.translate,
					      s = d3.event.scale;
					  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
					  t[1] = Math.min(height / 2 * (s - 1) + 230 * s, Math.max(height / 2 * (1 - s) - 230 * s, t[1]));
					  zoom.translate(t);
					  map.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
					}
					*/



				}


				// update classes of the municipality paths.
				var updateMap = function() {

					if(svg !== null) { // check if svg is initialized
						svg.select('#map').selectAll('path')
							.attr('class', function(d) {
				      	var mData = getMunicipalityData(d.id);
				      	var value = (mData.value) ? mData.value : null;
				      	var c = getClass(value);

				      	// add selected class to selected municipalities
				      	if (scope.selectedMunicipalities.indexOf(d.id) !== -1) {
				      		c+= ' selected';
				      	};

				      	// hide filtered municipalities
								for (var i = 0; i < scope.filters.length; i++) {
									if (mData.coalition && mData.coalition.indexOf(scope.filters[i]) === -1) {
										//c = c + ' hide-municipality'
										c = 'none';
									};
								};

				      	return c;
							})
						}
/*
console.log('-----------');
console.log('sub1: ' + svg.select('#map').selectAll('.sub1')[0].length);
console.log('sub2: ' + svg.select('#map').selectAll('.sub2')[0].length);
console.log('sub3: ' + svg.select('#map').selectAll('.sub3')[0].length);
console.log('sub4: ' + svg.select('#map').selectAll('.sub4')[0].length);
console.log('sub5: ' + svg.select('#map').selectAll('.sub5')[0].length);
console.log('sub6: ' + svg.select('#map').selectAll('.sub6')[0].length);
*/

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
					updateMap();
				});

				
				// 
				scope.$watchCollection('selectedMunicipalities', function() {
					updateMap();
				});


				// 
				scope.$watchCollection('filters', function() {
					updateMap();
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
					} else {
						// update chart dimentions
						svg
							.attr('width', width)
							.attr('height', height);
					};





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

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
        //legend: '=legend'
        type: '@type',
        getColorScale: '&colorScale'
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



				/*
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
				*/


				//
				var drawLegend = function() {
					var legendWidth = 200;
					var legendHeight = 15;
					var legendBarHeight = 10;
					var legendMargin = {'top': 0, 'right': 20, 'bottom': 0, 'left': 20}

					if (legend !== null) { // check if legend is initialized

						// get maximum value in the map dataset
						var max = d3.max(scope.dataset, function(item) {
						  return item.value;
						});

						// get minimum value in the map dataset
						var min = d3.min(scope.dataset, function(item) {
						  return (item.value !== 0 ) ? item.value : null;
						});

						// get the average 
						var average = d3.mean(scope.dataset, function(item) {
						  return item.value;
						});

						// clear legend,
						legend.selectAll('g').remove();

						// position legend
				    legend.attr('transform', function() { 
			      	//var x = width - legendWidth,
			      	var x = (width / 2) - (legendWidth / 2),
			      			y = height - legendHeight - 15;
			        return 'translate(' + x + ',' + y + ')'; 
			      });

			      var l = legend.append('g');

				    // set gradient
						var gradient = l.append('linearGradient')
							.attr('id', 'gradient')
						  .attr('x1', 0)
						  .attr('y1', 0)
						  .attr('x2', legendWidth)
						  .attr('y2', legendBarHeight)
						  .attr('gradientUnits', 'userSpaceOnUse')

						gradient
						  .append('stop')
						  .attr('offset', '0%')
						  //.attr('stop-color', '#ff0')
						  .attr('stop-color', color(min))
						  .attr('stop-opacity', 1);

						if (scope.type === 'relative') { // add extra stop if relative
							gradient
							  .append('stop')
							  .attr('offset', '50%')
							  .attr('stop-color', color(average))
							  .attr('stop-opacity', 1);							
						};
						  
						gradient
						  .append('stop')
						  .attr('offset', '100%')
						  .attr('stop-color', color(max))
						  .attr('stop-opacity', 1);

						// add legend rect
						l.append('rect')
							.attr('x', legendMargin.left)
							.attr('y', legendHeight - legendBarHeight)
							.attr('width', legendWidth-legendMargin.left-legendMargin.right)
							.attr('height', legendBarHeight-legendMargin.top-legendMargin.bottom)
							.style('fill', 'url(#gradient)');

						// add legend text
						l.append('text')
							.attr('x', legendMargin.left)
							.attr('y', 0)
							.attr('text-anchor', 'middle')
							//.text(Convert.formatNumber(min));
							.text(function() {
								var value = Convert.formatNumber(min);
								return (scope.type === 'absolute') ? '€ ' + value : value + '%';
							});

						if (scope.type === 'relative') { // add extra stop if relative
							l.append('text')
								.attr('x', (legendWidth-legendMargin.right-legendMargin.left)/2 + legendMargin.left)
								.attr('y', 0)
								.attr('text-anchor', 'middle')
								.text(Math.round(average) + '%');							
						}

						l.append('text')
							.attr('x', legendWidth-legendMargin.right)
							.attr('y', 0)
							.attr('text-anchor', 'middle')
							//.text(Convert.formatNumber(max));
							.text(function() {
								var value = Convert.formatNumber(max);
								return (scope.type === 'absolute') ? '€ ' + value : value + '%';
							});
					};

				}


				//
				var drawTooltip = function(bbox, data) {
					var tt = tooltip.append('g')
						.attr('class', '.map-tooltip')
			      .attr('transform', function() { 
			      	//var x = bbox.left,
			      	//		y = bbox.top;
			      	var x = 20,
			      			y = 20;
			        //return 'translate(' + x + ',' + y + ')'; 
			        return 'translate(' + x + ',' + y + ')'; 
			      });

					var t = tt.append('text')
				    .attr('x', 5)
				    .attr('y', 9)
				    .attr('dy', '.35em');

				  var rank = (data.value !== 0 && data.value !== null) ? ' (#' + data.rank +')' : ''; // rank of the municipality, if value = 0 don't show rank
					t.append('tspan').text(data.name + rank)
						.attr('class', 'tooltip-header')
						.attr('x', 3)
						.attr('dy', 3);

					// 
					if (data.value === 0 || data.value === null) {
						var value = 'Niet bekend'
					} else {
						if (scope.type === 'absolute') {
							var value = '€ ' + Convert.formatNumber(data.value) + ' per inwoner'
						} else {
							var value = (data.value > 0) ? '+' + data.value + ' %' : data.value + ' %';
						};
						
					};

					t.append('tspan').text(value)
					.attr('class', 'tooltip-text')
						.attr('x', 3)
						.attr('dy', 15);

					//
					var coalition = '' 
					if (data.coalition.length > 0) {
						//coalition = 'Niet bekend'
						for (var i = 0; i < data.coalition.length; i++) {
							if (i !== 0) {coalition += ' | '}; // 
							coalition += Convert.partyName(data.coalition[i]) + '';
						};
					};

					t.append('tspan').text(coalition)
					.attr('class', 'tooltip-text')
						.attr('x', 3)
						.attr('dy', 15);

				}


				// 
				var drawMap = function() {
					// clear map
					svg.selectAll('g').remove(); // remove all groups, empty svg element

					// add group that contains all the municipality paths
					var map = svg.append('g')
						.attr('id', 'map');

					// add group for tooltip
					tooltip =  svg.append('g')
						.attr('id', 'tooltip');

					// add group for legend
					legend =  svg.append('g')
						.attr('id', 'legend');

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

						// draw municipality path's
					  map.selectAll('path')
					    //.data(topojson.object(nl, nl.objects.gemeentes_geojson).geometries)
					    .data(topojson.feature(nl, nl.objects.gemeentes_geojson).features)
					    .enter()
					      .append('path')
					      .attr('d', path)

					      //.attr('class', 'municipality')
					      /*
					      .attr('class', function(d, i) {
					      	//var mData = getMunicipalityData(d.id);
					      	//var value = (mData.value) ? mData.value : null;
					      	//var c = getClass(value);
									var c = '';

					      	// add selected class to selected municipalities
					      	if (scope.selectedMunicipalities.indexOf(d.id) !== -1) {
					      		c+= 'selected';
					      	};
//var mData = getMunicipalityData(d.id);
//if (mData.name === 'Woudenberg') {console.log('Woudenberg:'+i)};
					      	return c;
					      })
					      */
					      .on('click', function(d) {
					      	var mData = getMunicipalityData(d.id);
					      	if (mData.value !== 0) { // only select if value is not 0
						      	scope.setSelected(d.id);
						      	scope.$apply();
					      	};
								})
					      .on('mouseover', function(d) {
									var mData = getMunicipalityData(d.id);
									var bbox = d3.select(this).node().getBoundingClientRect();
									drawTooltip(bbox, mData);
//console.log(bbox);
//console.log(mData);
//console.log(d3.transform(d3.select(this).attr("transform")).translate);
//console.log(d3.select(this).getBBox());
//console.log(d3.geo.bounds(d)[0]);
								})
					      .on('mouseout', function() {
					        svg.selectAll('#tooltip').selectAll('g').remove(); // remove tooltip
					      });

					  // set map coloring
					  updateMap();
					  drawLegend();

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

					


					// 
					if(svg !== null) { // check if svg is initialized
						svg.select('#map').selectAll('path')
							.attr('class', function(d) {
								/*
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
								*/
								var c = '';
								var mData = getMunicipalityData(d.id);

				      	// add selected class to selected municipalities
				      	if (scope.selectedMunicipalities.indexOf(d.id) !== -1) {
				      		c+= 'selected';
				      	};

				      	// add none class to municipalities with no data
				      	if (mData.value === 0 || mData.value === null) {
				      		c+= ' none';
				      	};

				      	return c;
	
							})
							
							// set fill color for municipalities
							.attr('fill', function(d) {
				      	var mData = getMunicipalityData(d.id);
				      	//var value = (mData.value) ? mData.value : null;
				      	//var value = mData.value;
				      	var c = (mData.value !== null && mData.value !== 0) ? color(mData.value) : '#e1e1e1'; // set color

				      	// hide filtered municipalities
								for (var i = 0; i < scope.filters.length; i++) {
									if (mData.coalition && mData.coalition.indexOf(scope.filters[i]) === -1) {
										//c = c + ' hide-municipality'
										c = '#e1e1e1';
									};
								};

				      	//return color(value);
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
				var tooltip = null; // tooltip group
				var legend = null; // legend group
				var width = 0; // width of the chart
				var height = 0; // height of the chart
				var projection; // map projection
				var path; // map path generator
				var color; // color scale



				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/

				// 
				scope.$watch('data', function() {
					scope.dataset = scope.data; // 
					color = scope.getColorScale(); // get color scale
					//scope.originalDataset = scope.data; // 
					updateMap();
					drawLegend();
				});

				
				// 
				scope.$watchCollection('selectedMunicipalities', function() {
					updateMap();
				});


				// 
				scope.$watchCollection('filters', function() {
					updateMap();
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

'use strict';

angular.module('gemeenteFinancienApp')
  .directive('municipalityDetails', function ($window, Convert) {
    return {
      //template: '<div></div>',
      templateUrl: '../../views/municipalityDetails.html',
      scope: {
        data: '&data',
        municipalityId: '&municipalityId'
      },
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

 
				/*
				----------------------------------------------------------------------------------------
				--- METHODES
				----------------------------------------------------------------------------------------
				*/

				// returns an array containing the total value of each column
				var getTotalValues = function() {
					var returnArray = [];
					for (var i = 0; i < scope.dataset.data[0].data.length; i++) { // loop through columns
						var total = 0;
						for (var j = 0; j < scope.dataset.data.length; j++) { // loop through subjects
							total += scope.dataset.data[j].data[i];
						};
						returnArray.push(total);
					};
					return returnArray;
				}


				// returns the width of the element
				scope.getElementWidth = function () {
					return angular.element(element).find('div').width();
				};








				//
				var drawTooltip = function(data, position, column) {
//console.log(position);
//var el = svg.select('#'+id);
//console.log(el);

					var tooltip = svg.append('g')
						.attr('class', 'graph-tooltip')
			      .attr('transform', function() { 
			      	var x = position[0],
			      			y = position[1];
			      	if (x > 0) {
			      		x -= segmentWidth;
			      	} else {
			      		x += segmentWidth;
			      	};
			        return 'translate(' + x + ',' + y + ')'; 
			      });

					tooltip.append('rect')
						.attr('class', 'tooltip-bg')
						.attr('width', segmentWidth)
						.attr('height', 33)

					var t = tooltip.append('text')
						.attr('class', 'tooltip-text')
				    .attr('x', 5)
				    .attr('y', 9)
				    .attr('dy', '.35em');
				    //.text(function() { 
				    	//return data.name;
				    //});

					t.append('tspan').text(Convert.subjectName(data.name))
						.attr('x', 3)
						.attr('dy', 3);

					var percentage = Math.round(data.data[column]/(totalValues[column]/100)); // calculate percentage of max value
					t.append('tspan').text('€ ' + Convert.formatNumber(data.data[column]) + ' per inwoner (' + percentage + '%)')
						.attr('x', 3)
						.attr('dy', 15);

				}






				// draws the chart
				var drawChart = function() {
					// clear chart
					svg.selectAll('g').remove(); // remove all groups, empty svg element

					// DRAW DATA COLUMNS
					for (var i = 0; i < scope.dataset.data[0].data.length; i++) {
						var segmentHeight = 0;

						// set start X and Y positions
						var startY = height - margin.bottom; // start Y position of the segments
						var startX = 0 + margin.left; // start X position of the 1st column
						if (i > 0) {  // set start position for the other columns
						  startX += (segmentWidth + (segmentWidth / 2)) * i;
						};

					  // sort time series by value
					  var timeSeries = scope.dataset.data;
					  timeSeries = timeSeries.sort(function(a,b) {
					    //return a['data'][i] < b['data'][i];
					    //return a.data[i] < b.data[i];
					    return b.data[i]-a.data[i];
					  });

					  // add new column group
					  var column = svg.append('g')
					    .attr('id', 'column' + i); 

					  // draw segment groups
					  var segment = column.selectAll('g')
					      .data(timeSeries)
					    .enter().append('g')
					      .attr('id', function(d) {
					        return d.id + '-' + i;
					      })
					      .attr('class', function(d) {
					        return d.class;
					      })
					      .on('mouseover', function(d) {
					      	var column = this.id.split('-')[1];
					      	var position = d3.transform(d3.select(this).attr('transform')).translate; // get position of the group where the mouse passes over
					      	drawTooltip(d, position, column); // draw tooltip
								})
					      .on('mouseout', function(d) {
									svg.select('.graph-tooltip').remove(); // remove tooltip
								})
					      .attr('transform', function(d) { 
					        var x = startX; // set y value of segment
					        var percentage = d.data[i]/(maxValue/100); // calculate percentage of max value
					        segmentHeight = (height - margin.top - margin.bottom)/100*percentage; // calculate the height of the segment
					        var y = startY - segmentHeight; // set y value of segment
					        startY -= segmentHeight; // set start y position for next segment

					        return 'translate(' + x + ',' + y + ')'; 
					      });


						// draw segment background
						segment.append('rect')
						  .attr('width', segmentWidth)
						  .attr('height', function(d) {
						      var percentage = d.data[i]/(maxValue/100); // calculate percentage of max value
						      return (height - margin.top - margin.bottom)/100*percentage; // calculate the height of the segment
						  });

					  // draw segment text
					  segment.append('text')
					    .attr('x', 2)
					    .attr('y', 6)
					    .attr('dy', '.35em')
					    .text(function(d) { 
								if ( ((height - margin.top - margin.bottom)/100*(d.data[i]/(maxValue/100))) > 11 ) { // don't show label if it doesn't fit
						      var percentage = d.data[i]/(totalValues[i]/100); // calculate percentage of max value
						      return Convert.subjectName(d.name) + ' (' + Math.round(percentage) + '%)'; 
								} else {
									return '';
								};
					    });

					}

					// DRAW SLOPES
					var slopes = svg.append('g') // slopes group
						.attr('id', 'slopes');

					for (var i = 0; i < scope.dataset.data[0].data.length-1; i++) {
						for (var j = 0; j < timeSeries.length; j++) {
					    // get position(x,y) and dimentions(height, width) of the segments where the slope is draw in between
					    var columnNumber = i; 
					    var segmentClass = timeSeries[j].class;
					    var cornerPoints = {'x1': 0, 'y1': 0, 'x2': 0, 'y2': 0, 'x3': 0, 'y3': 0, 'x4': 0, 'y4': 0}
					    // first column
					    var positionSegmentColumn1 = d3.transform(svg.selectAll('#column' + columnNumber).selectAll('.' + segmentClass).attr('transform')).translate;
					    var dimentionSegmentColumn1 = svg.selectAll('#column' + columnNumber).selectAll('.' + segmentClass).selectAll('rect').node().getBoundingClientRect();
					    // second column
					    columnNumber++; 
					    var positionSegmentColumn2 = d3.transform(svg.selectAll('#column' + columnNumber).selectAll('.' + segmentClass).attr('transform')).translate;
					    var dimentionSegmentColumn2 = svg.selectAll('#column' + columnNumber).selectAll('.' + segmentClass).selectAll('rect').node().getBoundingClientRect();

					    // set points for the slope path
					    cornerPoints.x1 = positionSegmentColumn1[0] + dimentionSegmentColumn1.width;
					    cornerPoints.y1 = positionSegmentColumn1[1];
					    cornerPoints.x2 = positionSegmentColumn1[0] + dimentionSegmentColumn1.width;
					    cornerPoints.y2 = positionSegmentColumn1[1] + dimentionSegmentColumn1.height;
					    cornerPoints.x3 = positionSegmentColumn2[0];
					    cornerPoints.y3 = positionSegmentColumn2[1] + dimentionSegmentColumn2.height;;
					    cornerPoints.x4 = positionSegmentColumn2[0];
					    cornerPoints.y4 = positionSegmentColumn2[1];

					    // add new column group
					    var slopeColumn = slopes.append('g'); 

					    // set slope path
					    var path = 'M ' + cornerPoints.x1 + ' ' + cornerPoints.y1 + ' L ' + cornerPoints.x2 + ' ' + cornerPoints.y2 + ' L ' + cornerPoints.x3 + ' ' + cornerPoints.y3 + ' L ' + cornerPoints.x4 + ' ' + cornerPoints.y4 + ' Z';

					    // draw slope path
					    slopeColumn.append('path')
					        .attr('d', path)
					        .attr('class', segmentClass + ' slope');

						}
					}

					// DRAW COLUMN LABELS
					var headerLabels = svg.append('g') //
						.attr('id', 'header-labels');

					for (var i = 0; i < scope.dataset.data[0].data.length; i++) {
					  var x = 0 + margin.left + (segmentWidth/2); // start X position of the 1st column
					  if (i > 0) {  // set start position for the other columns
					    x += (segmentWidth + (segmentWidth / 2)) * i;
					  };
					  
					  // draw period labels
					  headerLabels.append('text')
					    .attr('x', x)
					    .attr('y', 0 + 12)
					    .attr('class', 'axis-label-period')
					    .text(function(d) { 
					      return columnBottomLabels[i]; 
					    });

					  // draw total labels
					  headerLabels.append('text')
					    .attr('x', x)
					    .attr('y', 0 + 27)
					    .attr('class', 'axis-label-total')
					    .text(function(d) { 
					      return '€ ' + Convert.formatNumber(totalValues[i]) + ' per inwoner'; 
					    });

					}

				}





				/*
				----------------------------------------------------------------------------------------
				--- PROPERTIES
				----------------------------------------------------------------------------------------
				*/
				
				scope.dataset = {};
				var w = angular.element($window); // window object
				var svg = null; // handle to svg element
				var width = 0; // width of the chart
				var height = 0; // height of the chart
				var segmentWidth = 0; // width of the segments in the chart
				var margin = {'top': 35, 'right': 0, 'bottom': 0, 'left': 0}; // margin of the chart
				var maxValue = 0; // maximum value in dataset, length of the y axis
				var totalValues = []; // array containing total values of the columns
				var columnBottomLabels = ['2010', '2013'];
				scope.convert = Convert; // expose convert service to scope
				



				/*
				----------------------------------------------------------------------------------------
				--- EVENT LISTENERS
				----------------------------------------------------------------------------------------
				*/

				// 
				scope.$watch('municipalityId', function() {
					scope.dataset = scope.data(); // read dataset from controller and set the dataset for the directive scope
					totalValues = getTotalValues(); // get the total values of each column
					maxValue = d3.max(totalValues); // set the maximum value
				});


				// watch if the width of the element changes
				scope.$watch(scope.getElementWidth, function (newValue, oldValue) {
					//console.log(newValue);

					// 
					width = newValue;
					//height = width * 1.2;
					height = width * 1;
					segmentWidth = (width - margin.left - margin.right) / (scope.dataset.data[0].data.length + ((scope.dataset.data[0].data.length-1)*0.5));

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

					drawChart();

				}, true);


				// apply scope when window is resized????
				w.bind('resize', function () {
					scope.$apply();
				});





      }
    };
  });




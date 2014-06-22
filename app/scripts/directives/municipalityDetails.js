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


				// draws the chart
				var drawChart = function() {
					// clear chart
					svg.selectAll('g').remove(); // remove all groups, empty svg element

					// DRAW DATA COLUMNS
					for (var i = 0; i < scope.dataset.data[0].data.length; i++) {

						// set start X and Y positions
						var startY = height - margin.bottom; // start Y position of the segments
						var startX = 0 + margin.left; // start X position of the 1st column
						if (i > 0) {  // set start position for the other columns
						  startX += (segmentWidth + (segmentWidth / 2)) * i;
						};

					  // sort time series by value
					  var timeSeries = scope.dataset.data;
					  timeSeries = timeSeries.sort(function(a,b) {
					    return a['data'][i] < b['data'][i];
					  });

					  // add new column group
					  var column = svg.append('g')
					    .attr('id', 'column' + i); 

					  // draw segment groups
					  var segment = column.selectAll('g')
					      .data(timeSeries)
					    .enter().append('g')
					      .attr('class', function(d) {
					        return d.class;
					      })
					      .attr('transform', function(d) { 
					        var x = startX; // set y value of segment
					        var percentage = d.data[i]/(maxValue/100); // calculate percentage of max value
					        var segmentHeight = (height - margin.top - margin.bottom)/100*percentage; // calculate the height of the segment
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
					      var percentage = d.data[i]/(totalValues[i]/100); // calculate percentage of max value
					      return d.name + ' (' + Math.round(percentage) + '%)'; 
					    });

					}

					// DRAW SLOPES
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
					    var slopeColumn = svg.append('g'); 

					    // set slope path
					    var path = 'M ' + cornerPoints.x1 + ' ' + cornerPoints.y1 + ' L ' + cornerPoints.x2 + ' ' + cornerPoints.y2 + ' L ' + cornerPoints.x3 + ' ' + cornerPoints.y3 + ' L ' + cornerPoints.x4 + ' ' + cornerPoints.y4 + ' Z';

					    // draw slope path
					    slopeColumn.append('path')
					        .attr('d', path)
					        .attr('class', segmentClass + ' slope');

						}
					}

					// DRAW COLUMN LABELS
					var bottomLabels = svg.append('g'); // x axis labels
					var topLabels = svg.append('g'); // x axis labels

					for (var i = 0; i < scope.dataset.data[0].data.length; i++) {
					  var x = 0 + margin.left + (segmentWidth/2); // start X position of the 1st column
					  if (i > 0) {  // set start position for the other columns
					    x += (segmentWidth + (segmentWidth / 2)) * i;
					  };
					  
					  // draw bottom axis labels
					  bottomLabels.append('text')
					    .attr('x', x)
					    .attr('y', height)
					    .attr('class', 'axis-label')
					    .text(function(d) { 
					      return columnBottomLabels[i]; 
					    });

					  // draw top total labels
					  topLabels.append('text')
					    .attr('x', x)
					    .attr('y', 0 + 10)
					    .attr('class', 'axis-label')
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
				var margin = {'top': 15, 'right': 0, 'bottom': 15, 'left': 0}; // margin of the chart
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
					height = width * 1.2;
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




'use strict';

angular.module('gemeenteFinancienApp')
  .controller('MainCtrl', function ($scope, Dataset) {

	/*
	- belasting nog niet in dataset
	*/


	/*
	----------------------------------------------------------------------------------------
	--- METHODES
	----------------------------------------------------------------------------------------
	*/

	// validate???
	// setSelected(id)
	// setDataset(name)
	// setFilter(name)
	
	/*
	// returns the formatted caption of the legend category
	$scope.formatLegendCaption = function(min, max) {
		var returnValue = min + ' - ' + max;
		if (min === null && max !== null) {
			returnValue = '< ' + max;
		};
		if (min !== null && max === null) {
			returnValue = '> ' + min;
		};
		if (min === null && max === null) {
			returnValue = 'Niet bekend';
		};
		return returnValue;
	}
	*/


	//
	$scope.getMapColorScale = function() {
		// set color scale
		var color = d3.scale.linear()
		  .domain([mapDataMin, mapDataMax])
		  //.range(['#edf8fb', '#006d2c']);
		  .range(['#6cbeff', '#002039']);

		return color;
	}


	// returns an array with data formatted for the map [{id, name, value2013}]
	var getMapData = function() {
		var returnArray = [];

//console.log($scope.selectedDataset.substring(0, 1));

		for (var i = 0; i < $scope.municipalitiesDataset.length; i++) { // loop through municipalities
			var value = null;
			for (var j = 0; j < $scope.municipalitiesDataset[i].data.length; j++) { // loop through municipalities data
				if ($scope.municipalitiesDataset[i].data[j].name === $scope.selectedDataset) { // if dataset is found
					value = ($scope.municipalitiesDataset[i].data[j].value2013 !== null) ? $scope.municipalitiesDataset[i].data[j].value2013 : 0; // set value 0 if value is null
					returnArray.push({'id': $scope.municipalitiesDataset[i].id, 'name': $scope.municipalitiesDataset[i].name, 'coalition': $scope.municipalitiesDataset[i].coalition, 'value': value, 'selected': isSelected($scope.municipalitiesDataset[i].id)});
				};

				if (j === $scope.municipalitiesDataset[i].data.length-1 && value === null) { // loop is at last item and need data is not found, add an 0 record
					returnArray.push({'id': $scope.municipalitiesDataset[i].id, 'name': $scope.municipalitiesDataset[i].name, 'coalition': $scope.municipalitiesDataset[i].coalition, 'value': 0, 'selected': isSelected($scope.municipalitiesDataset[i].id)});
				};
			};
		};

		// sort data on value
		returnArray.sort(function(a, b){
			return b.value-a.value;
		})

		// add a rank to data entries
		for (var i = 0; i < returnArray.length; i++) {
			returnArray[i].rank = i+1;
		};

		return returnArray;
	}


	// returns an object with data formatted for the municipality details {name, data[{id,name,class,data[value2010,value2013]}]}
	$scope.getMunicipalityDetailsData = function(id) {
		var returnObj = {};
		for (var i = 0; i < $scope.municipalitiesDataset.length; i++) { // loop through municipalities
			if ($scope.municipalitiesDataset[i].id === id) {
				returnObj.name = $scope.municipalitiesDataset[i].name; // municipality name
				returnObj.coalition = $scope.municipalitiesDataset[i].coalition; // municipality coalition
				returnObj.data = []; // graph data
				for (var j = 0; j < $scope.municipalitiesDataset[i].data.length; j++) { // loop through municipalities data
					if ($scope.municipalitiesDataset[i].data[j].name !== 'totaal' && $scope.municipalitiesDataset[i].data[j].name !== 'belasting') { // leave out the 'totaal' value
						returnObj.data.push({'id': j, 'name': $scope.municipalitiesDataset[i].data[j].name, 'class': $scope.municipalitiesDataset[i].data[j].name, 'data': [$scope.municipalitiesDataset[i].data[j].value2010,$scope.municipalitiesDataset[i].data[j].value2013]});
					};
				};
			};
		};
		return returnObj;
	}


	// add or remove filter from filter array
	$scope.setFilter = function(filter) {
		if ($scope.filters.indexOf(filter) === -1) {
			$scope.filters.push(filter); // add filter to filters array
		} else {
			$scope.filters.splice($scope.filters.indexOf(filter), 1); // remove filter from filters array
		};
	}

/*
	// returns the legend for the selected dataset
	var getLegend = function(name) {
		var returnObj = {};
		for (var i = 0; i < $scope.mapLegends.length; i++) {
			if ($scope.mapLegends[i].dataset === name) {
				returnObj = $scope.mapLegends[i];
			};
		};
		return returnObj;
	}
*/


	// returns true or false. True if id is in selectedMunicipalities array
	var isSelected = function(id) {
		var returnValue = false;
		if($scope.selectedMunicipalities.indexOf(id) !== -1) {
			returnValue = true;
		};
		return returnValue;
	}


	// update map data, set selected item
	var updateMapData = function() {
		for (var i = 0; i < $scope.mapData.length; i++) {
			if (isSelected($scope.mapData[i].id)) {
				$scope.mapData[i].selected = true;
			};
		};
	}


	// 
	$scope.setSelected = function(id) {
		// update selectedMunicipalities array
		if($scope.selectedMunicipalities.indexOf(id) === -1) {
			$scope.selectedMunicipalities.push(id); // add id to selectedMunicipalities array
		} else {
			$scope.selectedMunicipalities.splice($scope.selectedMunicipalities.indexOf(id), 1); // remove id from selectedMunicipalities array
		};

		updateMapData();

		/*
		// update mapData
		for (var i = 0; i < $scope.mapData.length; i++) {
			if ($scope.mapData[i].id === id) {
				$scope.mapData[i].selected = true;
			};
		};
		*/

	}


	// set the min, max and average of the map data 
	var setMapDataRange = function() {
		// get maximum value in the map dataset
		mapDataMax = d3.max($scope.mapData, function(item) {
		  return item.value;
		});

		// get minimum value in the map dataset
		mapDataMin = d3.min($scope.mapData, function(item) {
		  return (item.value !== 0 ) ? item.value : null;
		});

		// set the average 
		mapDataAverage = d3.mean($scope.mapData, function(item) {
		  return item.value;
		});

	}













	/*
	----------------------------------------------------------------------------------------
	--- PROPERTIES
	----------------------------------------------------------------------------------------
	*/

	var mapDataMin = 0,
			mapDataMax = 0,
			mapDataAverage = 0;


	$scope.selectedMunicipalities = []; // array with id's of selected municipalities
	$scope.selectedDataset = 'totaal'; // selected data property
	//$scope.mouseOnMunicipality = null; // mouse over this municipality
	$scope.filters = []; // active party filters
	$scope.municipalitiesDataset = []; // contains the main dataset
	$scope.mapData = []; // contains the data for the map

	//$scope.dataMunicipalitiesDetails = [];
	/*
	$scope.mapLegends = [
		{'dataset': 'totaal', 'categories': [
			//{'label': 'Niet bekend', 'class': 'none', 'min': null, 'max': null},
			{'label': '', 'class': 'sub1', 'min': null, 'max': 1800},
			{'label': '', 'class': 'sub2', 'min': 1800, 'max': 2000},
			{'label': '', 'class': 'sub3', 'min': 2000, 'max': 2200},
			{'label': '', 'class': 'sub4', 'min': 2200, 'max': 2500},
			{'label': '', 'class': 'sub5', 'min': 2500, 'max': 3000},
			{'label': '', 'class': 'sub6', 'min': 3000, 'max': null}
		]},
		{'dataset': 'bestuur', 'categories': [
			//{'label': 'Niet bekend', 'class': 'none', 'min': null, 'max': null},
			{'label': '', 'class': 'sub1', 'min': null, 'max': 130},
			{'label': '', 'class': 'sub2', 'min': 130, 'max': 150},
			{'label': '', 'class': 'sub3', 'min': 150, 'max': 170},
			{'label': '', 'class': 'sub4', 'min': 170, 'max': 200},
			{'label': '', 'class': 'sub5', 'min': 200, 'max': 235},
			{'label': '', 'class': 'sub6', 'min': 235, 'max': null}
		]},
		{'dataset': 'veiligheid', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 65},
			{'label': '', 'class': 'sub2', 'min': 65, 'max': 75},
			{'label': '', 'class': 'sub3', 'min': 75, 'max': 85},
			{'label': '', 'class': 'sub4', 'min': 85, 'max': 100},
			{'label': '', 'class': 'sub5', 'min': 100, 'max': 115},
			{'label': '', 'class': 'sub6', 'min': 115, 'max': null}
		]},
		{'dataset': 'verkeer', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 120},
			{'label': '', 'class': 'sub2', 'min': 120, 'max': 145},
			{'label': '', 'class': 'sub3', 'min': 145, 'max': 165},
			{'label': '', 'class': 'sub4', 'min': 165, 'max': 200},
			{'label': '', 'class': 'sub5', 'min': 200, 'max': 260},
			{'label': '', 'class': 'sub6', 'min': 260, 'max': null}
		]},
		{'dataset': 'economisch', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 6},
			{'label': '', 'class': 'sub2', 'min': 6, 'max': 10},
			{'label': '', 'class': 'sub3', 'min': 10, 'max': 15},
			{'label': '', 'class': 'sub4', 'min': 15, 'max': 25},
			{'label': '', 'class': 'sub5', 'min': 25, 'max': 35},
			{'label': '', 'class': 'sub6', 'min': 35, 'max': null}
		]},
		{'dataset': 'onderwijs', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 75},
			{'label': '', 'class': 'sub2', 'min': 75, 'max': 100},
			{'label': '', 'class': 'sub3', 'min': 100, 'max': 125},
			{'label': '', 'class': 'sub4', 'min': 125, 'max': 175},
			{'label': '', 'class': 'sub5', 'min': 175, 'max': 300},
			{'label': '', 'class': 'sub6', 'min': 300, 'max': null}
		]},
		{'dataset': 'cultuur', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 150},
			{'label': '', 'class': 'sub2', 'min': 150, 'max': 200},
			{'label': '', 'class': 'sub3', 'min': 200, 'max': 250},
			{'label': '', 'class': 'sub4', 'min': 250, 'max': 300},
			{'label': '', 'class': 'sub5', 'min': 300, 'max': 400},
			{'label': '', 'class': 'sub6', 'min': 400, 'max': null}
		]},
		{'dataset': 'sociaal', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 400},
			{'label': '', 'class': 'sub2', 'min': 400, 'max': 500},
			{'label': '', 'class': 'sub3', 'min': 500, 'max': 700},
			{'label': '', 'class': 'sub4', 'min': 700, 'max': 800},
			{'label': '', 'class': 'sub5', 'min': 800, 'max': 1100},
			{'label': '', 'class': 'sub6', 'min': 1100, 'max': null}
		]},
		{'dataset': 'gezondheid', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 75},
			{'label': '', 'class': 'sub2', 'min': 75, 'max': 150},
			{'label': '', 'class': 'sub3', 'min': 150, 'max': 200},
			{'label': '', 'class': 'sub4', 'min': 200, 'max': 300},
			{'label': '', 'class': 'sub5', 'min': 300, 'max': 400},
			{'label': '', 'class': 'sub6', 'min': 400, 'max': null}
		]},
		{'dataset': 'huisvesting', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 75},
			{'label': '', 'class': 'sub2', 'min': 75, 'max': 150},
			{'label': '', 'class': 'sub3', 'min': 150, 'max': 200},
			{'label': '', 'class': 'sub4', 'min': 200, 'max': 300},
			{'label': '', 'class': 'sub5', 'min': 300, 'max': 400},
			{'label': '', 'class': 'sub6', 'min': 400, 'max': null}
		]},
		{'dataset': 'overig', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 75},
			{'label': '', 'class': 'sub2', 'min': 75, 'max': 150},
			{'label': '', 'class': 'sub3', 'min': 150, 'max': 200},
			{'label': '', 'class': 'sub4', 'min': 200, 'max': 300},
			{'label': '', 'class': 'sub5', 'min': 300, 'max': 400},
			{'label': '', 'class': 'sub6', 'min': 400, 'max': null}
		]},
		{'dataset': 'belasting', 'categories': [
			{'label': '', 'class': 'sub1', 'min': null, 'max': 75},
			{'label': '', 'class': 'sub2', 'min': 75, 'max': 150},
			{'label': '', 'class': 'sub3', 'min': 150, 'max': 200},
			{'label': '', 'class': 'sub4', 'min': 200, 'max': 300},
			{'label': '', 'class': 'sub5', 'min': 300, 'max': 400},
			{'label': '', 'class': 'sub6', 'min': 400, 'max': null}
		]}
	];

	$scope.legend = $scope.mapLegends[0]; // legend for the current selected dataset
	*/



	/*
	----------------------------------------------------------------------------------------
	--- EVENT LISTENERS
	----------------------------------------------------------------------------------------
	*/

	// load dataset, wait for promise to be fullfilled, DATA IS LOADED!!!!
	Dataset.getMunicipalities().then(function(data) {
	  $scope.municipalitiesDataset = data;
	});


	// 
	$scope.$watch('municipalitiesDataset', function(newValue, oldValue) {
		// check if dataset is set
		if($scope.municipalitiesDataset.length > 0) {  
			// init if all data is loaded and set correctly
			//$scope.selectedMunicipalities = [24493]; // add Amsterdam as default selected
			$scope.mapData = getMapData(); // set map data
			$scope.setSelected(24493); // add Amsterdam as default selected
			setMapDataRange();
		}
	});


	// 
	$scope.$watch('selectedDataset', function(newValue, oldValue) {
		//console.log($scope.selectedDataset);	
		$scope.mapData = getMapData(); // set map data
		//$scope.legend = getLegend(newValue);
		setMapDataRange();
	});



	$scope.$watchCollection('selectedMunicipalities', function() {
		//console.log($scope.selectedMunicipalities);
		$scope.mapData = getMapData(); // set map data



/*
// *****************************************************
for (var i = 0; i < $scope.mapData.length; i++) {
	//$scope.mapData[i]
	if ($scope.mapData[i].value === 0 || $scope.mapData[i].value === null) {
		console.log($scope.mapData[i].name);
	};
};
// *****************************************************
*/
	});




});

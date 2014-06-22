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
	



	// returns an array with data formatted for the map [{id, name, value2013}]
	var getMapData = function() {
		var returnArray = [];
		for (var i = 0; i < $scope.municipalitiesDataset.length; i++) { // loop through municipalities
			for (var j = 0; j < $scope.municipalitiesDataset[i].data.length; j++) { // loop through municipalities data
				if ($scope.municipalitiesDataset[i].data[j].name === $scope.selectedDataset && $scope.municipalitiesDataset[i].data[j].value2013 !== null) { // if selected dataset is found, value is not null and push into return array
					//returnArray.push({'id': $scope.municipalitiesDataset[i].id, 'name': $scope.municipalitiesDataset[i].name, 'value': $scope.municipalitiesDataset[i].data[j].value2013});
					returnArray.push({'id': $scope.municipalitiesDataset[i].id, 'name': $scope.municipalitiesDataset[i].name, 'coalition': $scope.municipalitiesDataset[i].coalition, 'value': $scope.municipalitiesDataset[i].data[j].value2013, 'selected': isSelected($scope.municipalitiesDataset[i].id)});
				};
			};
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
					if ($scope.municipalitiesDataset[i].data[j].name !== 'totaal') { // leave out the 'totaal' value
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


	// returns true or false. True if id is in selectedMunicipalities array
	var isSelected = function(id) {
		var returnValue = false;
		if($scope.selectedMunicipalities.indexOf(id) !== -1) {
			returnValue = true;
		};
		return returnValue;
	}


	// update map data
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





	/*
	----------------------------------------------------------------------------------------
	--- PROPERTIES
	----------------------------------------------------------------------------------------
	*/

	$scope.selectedMunicipalities = []; // array with id's of selected municipalities
	$scope.selectedDataset = 'totaal'; // selected data property
	$scope.mouseOnMunicipality = null; // mouse over this municipality
	$scope.filters = []; // active party filters
	$scope.municipalitiesDataset = []; // contains the main dataset
	$scope.mapData = []; // contains the data for the map
	//$scope.dataMunicipalitiesDetails = [];


	



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
		}
	});


	// 
	$scope.$watch('selectedDataset', function(newValue, oldValue) {
		//console.log($scope.selectedDataset);	
		$scope.mapData = getMapData(); // set map data
	});



	$scope.$watchCollection('selectedMunicipalities', function() {

		//console.log($scope.selectedMunicipalities);
		$scope.mapData = getMapData(); // set map data

	});




});

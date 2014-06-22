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
	
	// getMapData()
	// getSlopeGraphData()


	// returns an array with data formatted for the map {id, name, value2013}
	$scope.getMapData = function() {
		var returnArray = [];
		for (var i = 0; i < $scope.municipalitiesDataset.length; i++) { // loop through municipalities
			for (var j = 0; j < $scope.municipalitiesDataset[i].data.length; j++) { // loop through municipalities data
				if ($scope.municipalitiesDataset[i].data[j].name === $scope.selectedDataset && $scope.municipalitiesDataset[i].data[j].value2013 !== null) { // if selected dataset is found, value is not null and push into return array
					returnArray.push({'id': $scope.municipalitiesDataset[i].id, 'name': $scope.municipalitiesDataset[i].name, 'value': $scope.municipalitiesDataset[i].data[j].value2013});
				};
			};
		};
		return returnArray;
	}


	// 
	$scope.getMunicipalityDetailsData = function(id) {
		var returnObj = {};

		for (var i = 0; i < $scope.municipalitiesDataset.length; i++) { // loop through municipalities
			if ($scope.municipalitiesDataset[i].id === id) {
				returnObj.name = $scope.municipalitiesDataset[i].name; // municipality name
				returnObj.data = []; // graph data
				for (var j = 0; j < $scope.municipalitiesDataset[i].data.length; j++) { // loop through municipalities data
					returnObj.data.push({'id': j, 'name': $scope.municipalitiesDataset[i].data[j].name, 'class': $scope.municipalitiesDataset[i].data[j].name, 'data': [$scope.municipalitiesDataset[i].data[j].value2010,$scope.municipalitiesDataset[i].data[j].value2013]});
				};
			};
		};

		return returnObj;
	}




	/*
	----------------------------------------------------------------------------------------
	--- PROPERTIES
	----------------------------------------------------------------------------------------
	*/

	$scope.selectedMunicipalities = []; // array with id's of selected municipalities
	$scope.selectedDataset = 'totaal'; // selected data set
	$scope.mouseOnMunicipality = null; // mouse over this municipality
	$scope.filters = []; // active party filters
	$scope.municipalitiesDataset = [];
	//$scope.dataMunicipalitiesDetails = [];


	



	/*
	----------------------------------------------------------------------------------------
	--- EVENT LISTENERS
	----------------------------------------------------------------------------------------
	*/

	// load dataset, wait for promise to be fullfilled
	Dataset.getMunicipalities().then(function(data) {
	  //console.log(data);
	  $scope.municipalitiesDataset = data;
	});


	// 
	$scope.$watch('municipalitiesDataset', function(newValue, oldValue) {
		// check if dataset is set
		if($scope.municipalitiesDataset.length > 0) { 
			//console.log($scope.municipalitiesDataset);
			$scope.selectedMunicipalities = [24493]; // add Amsterdam as selected
		}
	});


	// 
	$scope.$watch('selectedDataset', function(newValue, oldValue) {
		//console.log($scope.selectedDataset);	
	});






});

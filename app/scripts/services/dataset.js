'use strict';

angular.module('gemeenteFinancienApp')
  .service('Dataset', function Dataset($q, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function

		
		// function returns the municipalities data
		var getMunicipalities = function() {
			var deferred = $q.defer();
				$http.get('../../data/gemeenten_totaal.json').success(function(data) {
					deferred.resolve(data);
				});
			return deferred.promise;
		}


		return {
			'getMunicipalities': getMunicipalities
		};







  });

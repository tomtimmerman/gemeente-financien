'use strict';

angular.module('gemeenteFinancienApp')
  .service('Convert', function Convert() {
    // AngularJS will instantiate a singleton by calling "new" on this function


		// set . as thousands separator for a number
		var formatNumber = function(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		}


		// 
		var partyName = function(name) {
			var returnValue = '';
			switch(name) {
				case 'sp':
					returnValue = 'SP';
					break;
				case 'gl':
					returnValue = 'GroenLinks';
					break;
				case 'pvda':
					returnValue = 'PVDA';
					break;
				case 'd66':
					returnValue = 'D66';
					break;
				case 'lokaal':
					returnValue = 'Lokale partijen';
					break;
				case 'cu':
					returnValue = 'ChristenUnie';
					break;
				case 'cda':
					returnValue = 'CDA';
					break;
				case 'ton':
					returnValue = 'TON';
					break;
				case 'vvd':
					returnValue = 'VVD';
					break;
			}
			return returnValue;
		}


		return {
			'formatNumber': formatNumber,
			'partyName': partyName
		};


  });

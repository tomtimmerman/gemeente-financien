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


		// 
		var subjectName = function(name) {
			var returnValue = '';
			switch(name) {
				case 'totaal':
					returnValue = 'Totale uitgaven';
					break;
				case 'bestuur':
					returnValue = 'Algemeen Bestuur';
					break;
				case 'veiligheid':
					returnValue = 'Openbare orde en Veiligheid';
					break;
				case 'verkeer':
					returnValue = 'Verkeer, Vervoer en Waterstaat';
					break;
				case 'economisch':
					returnValue = 'Economische zaken';
					break;
				case 'onderwijs':
					returnValue = 'Onderwijs';
					break;
				case 'cultuur':
					returnValue = 'Cultuur en Recreatie';
					break;
				case 'sociaal':
					returnValue = 'Sociale zekerheid';
					break;
				case 'gezondheid':
					returnValue = 'Volksgezondheid en Milieu';
					break;
				case 'huisvesting':
					//returnValue = 'Ruimtelijke ordening en Volkshuisvesting';
					returnValue = 'Ruimtelijke ord. en Volkshuisvesting';
					break;
				case 'overig':
					returnValue = 'Overig';
					break;
			}
			return returnValue;
		}



		return {
			'formatNumber': formatNumber,
			'partyName': partyName,
			'subjectName': subjectName
		};


  });

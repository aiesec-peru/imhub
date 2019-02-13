var app = angular.module('applicants_icx', []);

app.controller('Analytics', ['$scope', '$http', function ($scope,$http) {
	$scope.go = function() {
		var access_token = $scope.access_token;
		var start_date = document.getElementById("fecha_in").value;
		var end_date = document.getElementById("fecha_out").value;
		//var programa = document.getElementById("programa").value;

		//spinner_up();

		//MC CAMAC
		if(!start_date && !end_date){
			start_date = '2016-07-01'; //AÑO-MES-DÍA
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			var yyyy = today.getFullYear();

			if(dd<10) {
	    		dd = '0' + dd
			} 

			if(mm<10) {
	    		mm = '0' + mm
			}
			end_date = yyyy+'-'+mm+'-'+dd; //HOY
		}

		//Por defecto oGV
		var options = {
			uri_base: 'https://gis-api.aiesec.org/v2/',
			uri_point: 'people.json?access_token=',		
			filters: '&filters[registered_from]%5Bfrom%5D=' + start_date + '&filters[registered_to]%5Bfrom%5D=' + end_date ,
			sub_filter: '&page='
		};		

		var people_expa = [];

		$http.get(options.uri_base + options.uri_point + access_token + options.filters).
        		success(
        			function(res) {
        				add(res.paging.total_pages);        	
        			}
        		).
        		error(
        			function (error) {
						console.log(error);
					}
				);

		function add (pag) {
			for (var i = 0; i <= pag - 1; i++) {
				$http.get(options.uri_base + options.uri_point + access_token + options.filters + options.sub_filter + (i+1) ).
	    			success(function(res) {
						for (var j =  0; j <= res.data.length - 1; j++) {
console.log(res.data[j]);
								people_expa.push({
								"name": res.data[j].first_name === null ? '':res.data[j].first_name,
								"last_name": res.data[j].last_name === null ? '': res.data[j].last_name,
								"email": res.data[j].email === null ? '':res.data[j].email,
								"home_lc": res.data[j].home_lc.name === null ? '':res.data[j].home_lc.name,
								"country": res.data[j].home_lc.country === null ? '':res.data[j].home_lc.country,
								"interviewed": res.data[j].interviewed === null ? '':res.data[j].interviewed,
								"phone": res.data[j].phone === null ? '':res.data[j].phone,
								"expa_link": res.data[j].id === null ? '': 'https://experience.aiesec.org/#/people/' + res.data[j].id,
								"status": 'open',
								"product": res.data[j].programmes.short_name
							});
						};			

						$scope.people = people_expa;
	    			}).
	    			error(
	    				function (error) {
						console.log(error);
						}
					);
			};
		}

		function spinner () {
			$('#status').fadeOut(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({'overflow':'visible'});
		}

		function spinner_up () {
			$('#status').fadeIn(); // will first fade out the loading animation
			$('#preloader').delay(300).fadeIn('slow'); // will fade out the white DIV that covers the website.
			$('body').delay(300).css({'overflow':'hidden'});
		}

	}
}])
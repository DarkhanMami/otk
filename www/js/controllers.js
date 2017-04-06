angular.module('starter.controllers', ['chart.js', 'ngCordova'])
  .controller('LoginCtrl', function($scope, $state, $ionicHistory) {

    $scope.show = false;
    $scope.loginData = {
      "code": ""
    };

    $scope.$on("$ionicView.enter", function(event, data) {
      $scope.loginData = {
        "code": ""
      };

      $scope.message = ""

      if (window.localStorage.getItem("token", "") !== "") {
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('app.dohod');
      } else {
        $scope.show = true;
      }

    });

    $scope.checkCode = function(loginData) {
      if (loginData.code == "1234") {
        $ionicHistory.clearHistory();
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
        $state.go('app.dohod');
      } else {
        $scope.message = "Неверный код"
      }
    }

  })
  .controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, $state) {
    $scope.logout = function() {
      window.localStorage.setItem("token", "");
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true
      });
      $state.go('login');
    }


    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal



  })

  .controller("BarCtrl", function($scope, Data, $ionicLoading, $http, $timeout, $cordovaFile) {
    $scope.show = false;
    var promise = Data.init();

    // $scope.currentMonth = "";
    promise.then(function(greeting) {
      Data.updateAllData();
      run("Анализ рентабельности по ТС");

    }, function(reason) {
      console.log(reason);
    });


    var run = function(preTit) {


      $scope.colNames = Data.getColNames();
      $scope.places = Data.getPlaces("янв");
      $scope.monthes = Data.getMonthes();
      $scope.currentMonth = $scope.monthes[0];
      $scope.pretitle = preTit;
      $scope.currentMonthIndex = 0;
      $scope.utt = 'otk';

      $scope.sortKey = 'name';
      $scope.reverse = true;


      $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      };





      $scope.height = screen.height / 36;

      $scope.onClick = function(points, evt) {
        $scope.places = Data.getPlaces($scope.monthes[points[1]._index]);
        $scope.currentMonthIndex = points[1]._index;
        $scope.currentMonth = $scope.monthes[points[1]._index];

        // $scope.selectedItem = Data.getSingleData($scope.query.name, points[1]._index + 1, $scope.query.colName1, $scope.query.colName2);
        // $scope.selectedItem["name"] = $scope.query.name;

        $scope.$apply();
      };

      $scope.changeUTT = function(utt) {
        Data.changeData(utt);
        if (utt.includes("otk")) {
          run($scope.pretitle);
          $scope.utt = "otk";
        } else if (utt.includes("data_mutt")) {
          run($scope.pretitle);
          $scope.utt = "data_mutt";
        } else if (utt.includes("data_jutt")) {
          run($scope.pretitle);
          $scope.utt = "data_jutt";
        } else if (utt.includes("data_butt")) {
          run($scope.pretitle);
          $scope.utt = "data_butt";
        }

      };

      $scope.isLoading = false;


      $scope.updateDatabase = function() {
        //Data.updateData();

        // console.log('isLoading ');
        $scope.isLoading = true;

        Data.updateDataHelper("");
        Data.updateDataHelper("usluga");
        Data.updateDataHelper("ceh");
        Data.updateDataHelper("statya");


        setTimeout(function() {
          Data.updateAllData();
          setTimeout(function() {
            run("Анализ рентабельности по ТС");
            $scope.isLoading = false;
            $scope.$apply();
          }, 2000);
        }, 4000);

      };

      $scope.updateData = function(name) {
        $scope.result = Data.getNumbers(name);

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r3,
          $scope.result.r4
        ];

        angular.forEach($scope.places, function(value, key) {
          if (value.name == name) {
            $scope.selectedItem = {
              "name": name,
              "v1": value.v1,
              "v2": value.v2,
              "v3": value.v3,
              "v4": value.v4,
              "v5": value.v5,
              "v6": value.v6,
              "v7": value.v7,
              "v8": value.v8,
            }
          }
        }, null);


        $scope.datasetOverride = [{
          yAxisID: 'y-axis-1'
        }, {
          yAxisID: 'y-axis-2'
        }];

        $scope.options = {
          scales: {
            yAxes: [{
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
              },
              {
                id: 'y-axis-2',
                type: 'linear',
                display: true,
                position: 'right'
              }
            ]
          },


          "legend": {
            "display": false,
            "position": "top"
          }

        };

      }

      $scope.updateData($scope.places[0].name);


      $scope.updateTS = function() {
        Data.changeAllData('');
        setTimeout(function() {
          run("Анализ рентабельности по ТС");
          $scope.$apply();
        }, 10);
      };

      $scope.updateUsluga = function() {
        Data.changeAllData('usluga');
        setTimeout(function() {
          run("Анализ рентабельности по услугам РУ");
          $scope.$apply();
        }, 10);
      };

      $scope.updateCeh = function() {
        Data.changeAllData('ceh');
        setTimeout(function() {
          run("Анализ рентабельности по цехам");
          $scope.$apply();
        }, 10);
      };

      $scope.updateStatya = function() {
        Data.changeAllData('statya');
        setTimeout(function() {
          run("Анализ рентабельности по статьям затрат");
          $scope.$apply();
        }, 10);
      };



      $scope.raw_selected = function(name) {
        $scope.result = Data.getNumbers(name);
        console.log($scope.result);
        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r3,
          $scope.result.r4
        ];

        $scope.b1 = {
          v1: $scope.result.r1[$scope.currentMonthIndex],
          v2: $scope.result.r2[$scope.currentMonthIndex],
          v3: $scope.result.r3[$scope.currentMonthIndex],
          v4: $scope.result.r4[$scope.currentMonthIndex]
        };

        angular.forEach($scope.places, function(value, key) {
          if (value.name == name) {
            $scope.selectedItem = {
              "name": name,
              "v1": value.v1,
              "v2": value.v2,
              "v3": value.v3,
              "v4": value.v4,
              "v5": value.v5,
              "v6": value.v6,
              "v7": value.v7,
              "v8": value.v8,
            }
          }
        }, null);
      }


      $scope.result = Data.getNumbers($scope.places[0].name);

      $scope.labels = $scope.monthes;

      $scope.series = [$scope.colNames[3], $scope.colNames[3]];

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r3,
        $scope.result.r4
      ];


      $scope.b1 = {
        v1: $scope.result.r1[$scope.currentMonthIndex],
        v2: $scope.result.r2[$scope.currentMonthIndex],
        v3: $scope.result.r3[$scope.currentMonthIndex],
        v4: $scope.result.r4[$scope.currentMonthIndex]
      };
      // $scope.b2 = {
      //     v1: $scope.result.r3[$scope.currentMonthIndex],
      //     v2: $scope.result.r4[$scope.currentMonthIndex]
      // };
      // $scope.b3 = {
      //     v1: $scope.result.r5[$scope.currentMonthIndex],
      //     v2: $scope.result.r6[$scope.currentMonthIndex]
      // };
      // $scope.b4 = {
      //     v1: $scope.result.r7[$scope.currentMonthIndex],
      //     v2: $scope.result.r8[$scope.currentMonthIndex]
      // };

      //$scope.colors = ['#72C02C', '#3498DB', '#717984', '#F1C40F'];

      $scope.colors = [{
          backgroundColor: '#00cc00',
          borderColor: '#00cc66',
          hoverBackgroundColor: '#A2DED0',
          hoverBorderColor: '#A2DED0'
        },
        {
          backgroundColor: '#0066ff',
          borderColor: '#3366ff',
          hoverBackgroundColor: '#65C6BB',
          hoverBorderColor: '#65C6BB'
        },
        {

          borderColor: '#006600'
        },
        {
          borderColor: '#0000cc'
        },

      ];


      $scope.datasetOverride = [{
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }];
      $scope.options = {
        scales: {
          yAxes: [{
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right',
              // elements: {
              //     line: {
              //         fill: false,
              //         skipNull: true,
              //         drawNull: false,
              //     }
              // }
            }
          ]
        },


        "legend": {
          "display": false,
          "position": "top"
        }

      };


      $scope.show = true;


    }
  })



  .controller('OcenkaCtrl', function($scope, NalogyData) {
    $scope.show = false;
    var promise = NalogyData.init();
    // $scope.currentMonth = "";
    promise.then(function(greeting) {
      run();

    }, function(reason) {
      console.log(reason);
    });

    $scope.currentMonthIndex = 0;

    $scope.onClick = function(points, evt) {
      //   console.log(points[1]._index);
      $scope.currentMonthIndex = points[1]._index;
      $scope.currentMonth = $scope.monthes[points[1]._index];
      $scope.updateGraph();
      $scope.$apply();
    };

    $scope.updateGraph = function() {
      console.log('updating graph');
      console.log($scope.year1);
      console.log($scope.year2);

      $scope.result = {
        r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
        r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
        r3: NalogyData.filter($scope.year1, $scope.query.name, 1),
        r4: NalogyData.filter($scope.year2, $scope.query.name, 1),
        r5: NalogyData.filter($scope.year1, $scope.query.name, 2),
        r6: NalogyData.filter($scope.year2, $scope.query.name, 2),
        r7: NalogyData.filter($scope.year1, $scope.query.name, 3),
        r8: NalogyData.filter($scope.year2, $scope.query.name, 3),
        r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
        r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
      }



      $scope.places = [{
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12
        },
        {
          name: 'TC 2',
          v1: 369,
          v2: 68,
          v3: 13.5,
          v4: 301,
          v5: 12.1,
          v6: 289,
          v7: 12
        },
        {
          name: 'TC 3',
          v1: 532,
          v2: 39,
          v3: 12.9,
          v4: 313,
          v5: 12.6,
          v6: 289,
          v7: 12
        },
        {
          name: 'TC 4',
          v1: 341,
          v2: -4,
          v3: 12.5,
          v4: 345,
          v5: 13.9,
          v6: 322,
          v7: 23
        },
        {
          name: 'TC 5',
          v1: 328,
          v2: 33,
          v3: 12.0,
          v4: 295,
          v5: 11.9,
          v6: 272,
          v7: 23
        },
        {
          name: 'TC 6',
          v1: 310,
          v2: 53,
          v3: 11.4,
          v4: 257,
          v5: 10.4,
          v6: 234,
          v7: 23
        },
        {
          name: 'TC 7',
          v1: 154,
          v2: -11,
          v3: 5.6,
          v4: 165,
          v5: 6.7,
          v6: 120,
          v7: 45
        }

      ];


      if ($scope.pretitle == "Анализ рентабельности по ТС") {
        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12
        };
      } else if ($scope.pretitle == "Анализ рентабельности по услугам") {
        $scope.selectedItem = {
          name: 'Услуга 1',
          v1: 571,
          v2: 1,
          v3: 20.9,
          v4: 570,
          v5: 23.0,
          v6: 530,
          v7: 40
        };
      } else if ($scope.pretitle == "Анализ рентабельности по цехам") {
        $scope.selectedItem = {
          name: 'Подразделение 1',
          v1: 812,
          v2: 1,
          v3: 29.7,
          v4: 811,
          v5: 32.7,
          v6: 738,
          v7: 73
        };
      } else if ($scope.pretitle == "Анализ рентабельности по статьям") {
        $scope.selectedItem = {
          name: 'НДС',
          v1: 523,
          v2: 21.1,
          v3: 511,
          v4: 12
        };
      };




      $scope.b1 = {
        v1: $scope.result.r1[$scope.currentMonthIndex],
        v2: $scope.result.r2[$scope.currentMonthIndex]
      };
      $scope.b2 = {
        v1: $scope.result.r3[$scope.currentMonthIndex],
        v2: $scope.result.r4[$scope.currentMonthIndex]
      };
      $scope.b3 = {
        v1: $scope.result.r5[$scope.currentMonthIndex],
        v2: $scope.result.r6[$scope.currentMonthIndex]
      };
      $scope.b4 = {
        v1: $scope.result.r7[$scope.currentMonthIndex],
        v2: $scope.result.r8[$scope.currentMonthIndex]
      };


      $scope.labels = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сен', 'окт', 'ноя', 'дек'];

      $scope.series = [$scope.query.colName, $scope.query.colName];


    }

    $scope.raw_selected = function(name) {
      console.log('seleted ' + name);
      $scope.query.name = name;
      $scope.result = {
        r1: [12, 32, 28, 7, 68, 21, 21, 28, 40, 32, 16, 32],
        r2: [21, 27, 17, 11, 49, 38, 25, 14, 39, 29, 24, null],
        r9: [14.0, 7.4, 11.1, 15, 7.0, 4.1, 9.3, 7.9, 13.7, 24.5, 21.6, 16.7],
        r10: [11.8, 13.9, 9.4, 7.7, 9.9, 6.1, 14.8, 20.8, 17.6, 23.8, 27.2, null]
      }

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];

      angular.forEach($scope.places, function(value, key) {
        if (value.name == name) {
          $scope.selectedItem = {
            name: name,
            v1: value.v1,
            v2: value.v2,
            v3: value.v3,
            v4: value.v4,
            v5: value.v5,
            v6: value.v6,
            v7: value.v7,
          }
        }
      }, null);
    }

    var run = function() {

      $scope.companies = NalogyData.getCompanies();

      $scope.sortKey = 'name';
      $scope.reverse = false;

      $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      };

      var years = NalogyData.getYears();
      $scope.years = years.slice(0, years.length - 1);
      //   console.log($scope.years);
      $scope.monthes = NalogyData.getMonthes();
      $scope.year1 = 2015;
      $scope.years1 = [2015];
      $scope.year2 = 2016;

      $scope.query = {
        name: $scope.companies[0],
      }

      $scope.pretitle = 'Анализ рентабельности по ТС';

      $scope.currentMonth = NalogyData.getMonthes()[0];

      $scope.height = screen.height / 36;

      $scope.updateGraph();

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];
      for (i in $scope.result.r9) {
        if ($scope.result.r9[i]) {
          $scope.lastyear1 = $scope.result.r9[i];
        }
      }
      for (i in $scope.result.r10) {
        if ($scope.result.r10[i]) {
          $scope.lastyear2 = $scope.result.r10[i];
        }
      }
      //   $scope.lastyear2 = $scope.result.r10[$scope.result.r10.length - 1];

      $scope.colors = [{
          backgroundColor: '#00cc00',
          borderColor: '#00cc66',
          hoverBackgroundColor: '#A2DED0',
          hoverBorderColor: '#A2DED0'
        },
        {
          backgroundColor: '#0066ff',
          borderColor: '#3366ff',
          hoverBackgroundColor: '#65C6BB',
          hoverBorderColor: '#65C6BB'
        },
        {

          borderColor: '#006600'
        },
        {
          borderColor: '#0000cc'
        },

      ];


      $scope.datasetOverride = [{
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }];
      $scope.options = {
        scales: {
          yAxes: [{
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right',
              // elements: {
              //     line: {
              //         fill: false,
              //         skipNull: true,
              //         drawNull: false,
              //     }
              // }
            }
          ]
        },


        "legend": {
          "display": false,
          "position": "top"
        }

      };

      $scope.updateData = function() {

        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }
        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];


        $scope.places = [{
            name: 'TC 1',
            v1: 398,
            v2: 16,
            v3: 14.6,
            v4: 382,
            v5: 15.4,
            v6: 370,
            v7: 12
          },
          {
            name: 'TC 2',
            v1: 369,
            v2: 68,
            v3: 13.5,
            v4: 301,
            v5: 12.1,
            v6: 289,
            v7: 12
          },
          {
            name: 'TC 3',
            v1: 532,
            v2: 39,
            v3: 12.9,
            v4: 313,
            v5: 12.6,
            v6: 289,
            v7: 12
          },
          {
            name: 'TC 4',
            v1: 341,
            v2: -4,
            v3: 12.5,
            v4: 345,
            v5: 13.9,
            v6: 322,
            v7: 23
          },
          {
            name: 'TC 5',
            v1: 328,
            v2: 33,
            v3: 12.0,
            v4: 295,
            v5: 11.9,
            v6: 272,
            v7: 23
          },
          {
            name: 'TC 6',
            v1: 310,
            v2: 53,
            v3: 11.4,
            v4: 257,
            v5: 10.4,
            v6: 234,
            v7: 23
          },
          {
            name: 'TC 7',
            v1: 154,
            v2: -11,
            v3: 5.6,
            v4: 165,
            v5: 6.7,
            v6: 120,
            v7: 45
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по ТС';


        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12
        };
      }

      $scope.updateData2 = function() {

        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];

        $scope.places = [{
            name: 'Услуга 1',
            v1: 571,
            v2: 1,
            v3: 20.9,
            v4: 570,
            v5: 23.0,
            v6: 530,
            v7: 40
          },
          {
            name: 'Услуга 2',
            v1: 423,
            v2: -58,
            v3: 15.5,
            v4: 481,
            v5: 19.4,
            v6: 441,
            v7: 40
          },
          {
            name: 'Услуга 3',
            v1: 327,
            v2: 26,
            v3: 11.9,
            v4: 301,
            v5: 12.1,
            v6: 261,
            v7: 40
          },
          {
            name: 'Услуга 4',
            v1: 256,
            v2: 55,
            v3: 9.5,
            v4: 201,
            v5: 8.1,
            v6: 161,
            v7: 32
          },
          {
            name: 'Услуга 5',
            v1: 218,
            v2: -38,
            v3: 8.0,
            v4: 256,
            v5: 10.9,
            v6: 224,
            v7: 32
          },
          {
            name: 'Услуга 6',
            v1: 217,
            v2: -30,
            v3: 7.9,
            v4: 247,
            v5: 10.0,
            v6: 215,
            v7: 13
          },
          {
            name: 'Услуга 7',
            v1: 207,
            v2: 55,
            v3: 7.6,
            v4: 152,
            v5: 6.1,
            v6: 120,
            v7: 13
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по услугам';
        $scope.selectedItem = {
          name: 'Услуга 1',
          v1: 571,
          v2: 1,
          v3: 20.9,
          v4: 570,
          v5: 23.0,
          v6: 530,
          v7: 40
        };
      }
      $scope.updateData3 = function() {

        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];

        $scope.places = [{
            name: 'Подразделение 1',
            v1: 812,
            v2: 1,
            v3: 29.7,
            v4: 811,
            v5: 32.7,
            v6: 738,
            v7: 73
          },
          {
            name: 'Подразделение 2',
            v1: 621,
            v2: 98,
            v3: 22.7,
            v4: 523,
            v5: 21.1,
            v6: 453,
            v7: 70
          },
          {
            name: 'Подразделение 3',
            v1: 429,
            v2: -95,
            v3: 15.7,
            v4: 524,
            v5: 21.1,
            v6: 454,
            v7: 70
          },
          {
            name: 'Подразделение 4',
            v1: 358,
            v2: 173,
            v3: 13.1,
            v4: 185,
            v5: 7.5,
            v6: 164,
            v7: 21
          },
          {
            name: 'Подразделение 5',
            v1: 295,
            v2: 74,
            v3: 10.8,
            v4: 221,
            v5: 8.9,
            v6: 200,
            v7: 21
          },
          {
            name: 'Подразделение 6',
            v1: 82,
            v2: 30,
            v3: 3.0,
            v4: 52,
            v5: 2.1,
            v6: 31,
            v7: 5
          },
          {
            name: 'Подразделение 7',
            v1: 42,
            v2: 2,
            v3: 1.5,
            v4: 40,
            v5: 1.6,
            v6: 35,
            v7: 5
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по цехам';

        $scope.selectedItem = {
          name: 'Подразделение 1',
          v1: 812,
          v2: 1,
          v3: 29.7,
          v4: 811,
          v5: 32.7,
          v6: 738,
          v7: 73
        };

      }


      $scope.updateData4 = function() {


        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];

        $scope.places = [{
            name: 'НДС',
            v1: 523,
            v2: 21.1,
            v3: 511,
            v4: 12
          },
          {
            name: 'Соцналог',
            v1: 410,
            v2: 16.5,
            v3: 398,
            v4: 12
          },
          {
            name: 'Зарплата',
            v1: 350,
            v2: 14.1,
            v3: 320,
            v4: 30
          },
          {
            name: 'Штрафы',
            v1: 308,
            v2: 12.4,
            v3: 278,
            v4: 30
          },
          {
            name: 'Пеня',
            v1: 251,
            v2: 10.1,
            v3: 221,
            v4: 30
          },
          {
            name: 'Закуп Услуга 1',
            v1: 141,
            v2: 5.7,
            v3: 121,
            v4: 20
          },
          {
            name: 'Закуп Услуга 2',
            v1: 140,
            v2: 5.6,
            v3: 120,
            v4: 20
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по статьям';

        $scope.selectedItem = {
          name: 'НДС',
          v1: 523,
          v2: 21.1,
          v3: 511,
          v4: 12
        };
      }

      $scope.show = true;
    }


  })


  .controller('PlanCtrl', function($scope, NalogyData) {
    $scope.show = false;
    var promise = NalogyData.init();
    // $scope.currentMonth = "";
    promise.then(function(greeting) {
      run();

    }, function(reason) {
      console.log(reason);
    });

    $scope.currentMonthIndex = 0;

    $scope.onClick = function(points, evt) {
      //   console.log(points[1]._index);
      $scope.currentMonthIndex = points[1]._index;
      $scope.currentMonth = $scope.monthes[points[1]._index];
      $scope.updateGraph();
      $scope.$apply();
    };

    $scope.updateGraph = function() {
      console.log('updating graph');
      console.log($scope.year1);
      console.log($scope.year2);

      $scope.result = {
        r1: [532, 532, 556, 556, 556, 561, 561, 561, 572, 572, 580, 580],
        r2: [528, 528, 511, 511, 536, 536, 536, 542, 542, 542, 542, null],
        r3: NalogyData.filter($scope.year1, $scope.query.name, 1),
        r4: NalogyData.filter($scope.year2, $scope.query.name, 1),
        r5: NalogyData.filter($scope.year1, $scope.query.name, 2),
        r6: NalogyData.filter($scope.year2, $scope.query.name, 2),
        r7: NalogyData.filter($scope.year1, $scope.query.name, 3),
        r8: NalogyData.filter($scope.year2, $scope.query.name, 3),
        r9: [4.7, 8.8, 27.7, 46.4, 66.2, 73.4, 92.9, 97.1, 95.8, 98.3, 99.1, 99.1],
        r10: [16.7, 23.3, 49.7, 64.2, 81.5, 84.1, 90.9, 97.4, 98.5, 98.5, 98.5, null]
      }


      $scope.places = [{
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        },
        {
          name: 'TC 2',
          v1: 369,
          v2: 68,
          v3: 13.5,
          v4: 301,
          v5: 12.1,
          v6: 289,
          v7: 12,
          v8: 47
        },
        {
          name: 'TC 3',
          v1: 532,
          v2: 39,
          v3: 12.9,
          v4: 313,
          v5: 12.6,
          v6: 289,
          v7: 12,
          v8: 17
        },
        {
          name: 'TC 4',
          v1: 341,
          v2: -4,
          v3: 12.5,
          v4: 345,
          v5: 13.9,
          v6: 322,
          v7: 23,
          v8: 68
        },
        {
          name: 'TC 5',
          v1: 328,
          v2: 33,
          v3: 12.0,
          v4: 295,
          v5: 11.9,
          v6: 272,
          v7: 23,
          v8: 14
        },
        {
          name: 'TC 6',
          v1: 310,
          v2: 53,
          v3: 11.4,
          v4: 257,
          v5: 10.4,
          v6: 234,
          v7: 23,
          v8: 4
        },
        {
          name: 'TC 7',
          v1: 154,
          v2: -11,
          v3: 5.6,
          v4: 165,
          v5: 6.7,
          v6: 120,
          v7: 45,
          v8: 18
        }

      ];


      if ($scope.pretitle == "Бюджет Плана закупок (млн.тг)") {
        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      };




      $scope.b1 = {
        v1: $scope.result.r1[$scope.currentMonthIndex],
        v2: $scope.result.r2[$scope.currentMonthIndex]
      };
      $scope.b2 = {
        v1: $scope.result.r3[$scope.currentMonthIndex],
        v2: $scope.result.r4[$scope.currentMonthIndex]
      };
      $scope.b3 = {
        v1: $scope.result.r5[$scope.currentMonthIndex],
        v2: $scope.result.r6[$scope.currentMonthIndex]
      };
      $scope.b4 = {
        v1: $scope.result.r7[$scope.currentMonthIndex],
        v2: $scope.result.r8[$scope.currentMonthIndex]
      };


      $scope.labels = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сен', 'окт', 'ноя', 'дек'];

      $scope.series = [$scope.query.colName, $scope.query.colName];


    }

    $scope.raw_selected = function(name) {
      console.log('seleted ' + name);
      $scope.query.name = name;
      $scope.result = {
        r1: [12, 32, 28, 7, 68, 21, 21, 28, 40, 32, 16, 32],
        r2: [21, 27, 17, 11, 49, 38, 25, 14, 39, 29, 24, null],
        r9: [14.0, 7.4, 11.1, 15, 7.0, 4.1, 9.3, 7.9, 13.7, 24.5, 21.6, 16.7],
        r10: [11.8, 13.9, 9.4, 7.7, 9.9, 6.1, 14.8, 20.8, 17.6, 23.8, 27.2, null]
      }

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];

      angular.forEach($scope.places, function(value, key) {
        if (value.name == name) {
          $scope.selectedItem = {
            name: name,
            v1: value.v1,
            v2: value.v2,
            v3: value.v3,
            v4: value.v4,
            v5: value.v5,
            v6: value.v6,
            v7: value.v7,
            v8: value.v8,
          }
        }
      }, null);
    }

    var run = function() {

      $scope.companies = NalogyData.getCompanies();

      $scope.sortKey = 'name';
      $scope.reverse = false;

      $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      };

      var years = NalogyData.getYears();
      $scope.years = years.slice(0, years.length - 1);
      //   console.log($scope.years);
      $scope.monthes = NalogyData.getMonthes();
      $scope.year1 = 2015;
      $scope.years1 = [2015];
      $scope.year2 = 2016;

      $scope.query = {
        name: $scope.companies[0],
      }

      $scope.pretitle = 'Бюджет Плана закупок (млн.тг)';
      $scope.pretitle2 = 'Исполнение ПЗ по заключению договоров (%)';

      $scope.currentMonth = NalogyData.getMonthes()[0];

      $scope.height = screen.height / 36;

      $scope.updateGraph();

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];
      for (i in $scope.result.r9) {
        if ($scope.result.r9[i]) {
          $scope.lastyear1 = $scope.result.r9[i];
        }
      }
      for (i in $scope.result.r10) {
        if ($scope.result.r10[i]) {
          $scope.lastyear2 = $scope.result.r10[i];
        }
      }
      //   $scope.lastyear2 = $scope.result.r10[$scope.result.r10.length - 1];

      $scope.colors = [{
          backgroundColor: '#00cc00',
          borderColor: '#00cc66',
          hoverBackgroundColor: '#A2DED0',
          hoverBorderColor: '#A2DED0'
        },
        {
          backgroundColor: '#0066ff',
          borderColor: '#3366ff',
          hoverBackgroundColor: '#65C6BB',
          hoverBorderColor: '#65C6BB'
        },
        {

          borderColor: '#006600'
        },
        {
          borderColor: '#0000cc'
        },

      ];


      $scope.datasetOverride = [{
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }];
      $scope.options = {
        scales: {
          yAxes: [{
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right',
              // elements: {
              //     line: {
              //         fill: false,
              //         skipNull: true,
              //         drawNull: false,
              //     }
              // }
            }
          ]
        },


        "legend": {
          "display": false,
          "position": "top"
        }

      };

      $scope.updateData = function() {

        $scope.result = {
          r1: [532, 532, 556, 556, 556, 561, 561, 561, 572, 572, 580, 580],
          r2: [528, 528, 511, 511, 536, 536, 536, 542, 542, 542, 542, null],
          r9: [4.7, 8.8, 27.7, 46.4, 66.2, 73.4, 92.9, 97.1, 95.8, 98.3, 99.1, 99.1],
          r10: [16.7, 23.3, 49.7, 64.2, 81.5, 84.1, 90.9, 97.4, 98.5, 98.5, 98.5, null]
        }
        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];



        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Бюджет Плана закупок (млн.тг)';
        $scope.pretitle2 = 'Исполнение ПЗ по заключению договоров (%)';


        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      }

      $scope.updateData2 = function() {

        $scope.result = {
          r1: [2, 13, 18, 106, 189, 236, 284, 356, 423, 486, 515, 535],
          r2: [6, 25, 37, 128, 234, 256, 312, 368, 453, 527, 531, null],
          r9: [8.0, 27.7, 11.7, 41.1, 51.4, 57.3, 54.5, 65.3, 77.2, 86.5, 89.6, 93.0],
          r10: [6.8, 20.3, 14.6, 39.0, 53.5, 56.8, 64.1, 69.7, 84.8, 98.7, 99.4, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];


        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Поставка по договорам (млн. тг)';
        $scope.pretitle2 = 'Исполнение по договорам (%)';
        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      }
      $scope.updateData3 = function() {

        $scope.result = {
          r1: [215, 207, 198, 152, 138, 351, 423, 328, 217, 458, 527, 225],
          r2: [201, 152, 134, 127, 368, 425, 327, 286, 125, 438, 561, null],
          r9: [11.6, 12.1, 12.6, 16.4, 13.0, 5.1, 4.3, 5.5, 8.3, 3.9, 3.4, 8.0],
          r10: [9.0, 13.8, 18.7, 21.3, 5.2, 4.5, 5.8, 6.6, 19.2, 5.3, 3.9, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];


        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Запасы на складах (млн. тг)';
        $scope.pretitle2 = 'Доля невостреб. запасов (%)';

        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };

      }


      $scope.updateData4 = function() {


        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];

        $scope.places = [{
            name: 'НДС',
            v1: 523,
            v2: 21.1,
            v3: 511,
            v4: 12
          },
          {
            name: 'Соцналог',
            v1: 410,
            v2: 16.5,
            v3: 398,
            v4: 12
          },
          {
            name: 'Зарплата',
            v1: 350,
            v2: 14.1,
            v3: 320,
            v4: 30
          },
          {
            name: 'Штрафы',
            v1: 308,
            v2: 12.4,
            v3: 278,
            v4: 30
          },
          {
            name: 'Пеня',
            v1: 251,
            v2: 10.1,
            v3: 221,
            v4: 30
          },
          {
            name: 'Закуп Услуга 1',
            v1: 141,
            v2: 5.7,
            v3: 121,
            v4: 20
          },
          {
            name: 'Закуп Услуга 2',
            v1: 140,
            v2: 5.6,
            v3: 120,
            v4: 20
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по статьям';

        $scope.selectedItem = {
          name: 'НДС',
          v1: 523,
          v2: 21.1,
          v3: 511,
          v4: 12
        };
      }

      $scope.show = true;
    }


  })


  .controller('IspolnenieCtrl', function($scope, NalogyData) {
    $scope.show = false;
    var promise = NalogyData.init();
    // $scope.currentMonth = "";
    promise.then(function(greeting) {
      run();

    }, function(reason) {
      console.log(reason);
    });

    $scope.currentMonthIndex = 0;

    $scope.onClick = function(points, evt) {
      //   console.log(points[1]._index);
      $scope.currentMonthIndex = points[1]._index;
      $scope.currentMonth = $scope.monthes[points[1]._index];
      $scope.updateGraph();
      $scope.$apply();
    };

    $scope.updateGraph = function() {
      console.log('updating graph');
      console.log($scope.year1);
      console.log($scope.year2);

      $scope.result = {
        r1: [3521, 3765, 3895, 3547, 3462, 3429, 3478, 3591, 3506, 3480, 3471, 3452],
        r2: [3442, 3457, 3764, 3340, 3341, 3259, 3241, 3235, 3221, 3180, 3100, null],
        r3: NalogyData.filter($scope.year1, $scope.query.name, 1),
        r4: NalogyData.filter($scope.year2, $scope.query.name, 1),
        r5: NalogyData.filter($scope.year1, $scope.query.name, 2),
        r6: NalogyData.filter($scope.year2, $scope.query.name, 2),
        r7: NalogyData.filter($scope.year1, $scope.query.name, 3),
        r8: NalogyData.filter($scope.year2, $scope.query.name, 3),
        r9: [91.4, 90.6, 90.6, 90.7, 90.9, 91.0, 91.0, 91.1, 91.1, 91.2, 91.2, 91.3],
        r10: [91.9, 91.8, 91.5, 91.7, 91.8, 91.9, 92.0, 92.1, 92.1, 92.2, 92.2, null]
      }



      $scope.places = [{
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        },
        {
          name: 'TC 2',
          v1: 369,
          v2: 68,
          v3: 13.5,
          v4: 301,
          v5: 12.1,
          v6: 289,
          v7: 12,
          v8: 47
        },
        {
          name: 'TC 3',
          v1: 532,
          v2: 39,
          v3: 12.9,
          v4: 313,
          v5: 12.6,
          v6: 289,
          v7: 12,
          v8: 17
        },
        {
          name: 'TC 4',
          v1: 341,
          v2: -4,
          v3: 12.5,
          v4: 345,
          v5: 13.9,
          v6: 322,
          v7: 23,
          v8: 68
        },
        {
          name: 'TC 5',
          v1: 328,
          v2: 33,
          v3: 12.0,
          v4: 295,
          v5: 11.9,
          v6: 272,
          v7: 23,
          v8: 14
        },
        {
          name: 'TC 6',
          v1: 310,
          v2: 53,
          v3: 11.4,
          v4: 257,
          v5: 10.4,
          v6: 234,
          v7: 23,
          v8: 4
        },
        {
          name: 'TC 7',
          v1: 154,
          v2: -11,
          v3: 5.6,
          v4: 165,
          v5: 6.7,
          v6: 120,
          v7: 45,
          v8: 18
        }

      ];


      if ($scope.pretitle == "Простои (тыс. маш-час)") {
        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      };




      $scope.b1 = {
        v1: $scope.result.r1[$scope.currentMonthIndex],
        v2: $scope.result.r2[$scope.currentMonthIndex]
      };
      $scope.b2 = {
        v1: $scope.result.r3[$scope.currentMonthIndex],
        v2: $scope.result.r4[$scope.currentMonthIndex]
      };
      $scope.b3 = {
        v1: $scope.result.r5[$scope.currentMonthIndex],
        v2: $scope.result.r6[$scope.currentMonthIndex]
      };
      $scope.b4 = {
        v1: $scope.result.r7[$scope.currentMonthIndex],
        v2: $scope.result.r8[$scope.currentMonthIndex]
      };


      $scope.labels = ['янв', 'фев', 'март', 'апр', 'май', 'июнь', 'июль', 'авг', 'сен', 'окт', 'ноя', 'дек'];

      $scope.series = [$scope.query.colName, $scope.query.colName];


    }

    $scope.raw_selected = function(name) {
      console.log('seleted ' + name);
      $scope.query.name = name;
      $scope.result = {
        r1: [12, 32, 28, 7, 68, 21, 21, 28, 40, 32, 16, 32],
        r2: [21, 27, 17, 11, 49, 38, 25, 14, 39, 29, 24, null],
        r9: [14.0, 7.4, 11.1, 15, 7.0, 4.1, 9.3, 7.9, 13.7, 24.5, 21.6, 16.7],
        r10: [11.8, 13.9, 9.4, 7.7, 9.9, 6.1, 14.8, 20.8, 17.6, 23.8, 27.2, null]
      }

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];

      angular.forEach($scope.places, function(value, key) {
        if (value.name == name) {
          $scope.selectedItem = {
            name: name,
            v1: value.v1,
            v2: value.v2,
            v3: value.v3,
            v4: value.v4,
            v5: value.v5,
            v6: value.v6,
            v7: value.v7,
            v8: value.v8,
          }
        }
      }, null);
    }

    var run = function() {

      $scope.companies = NalogyData.getCompanies();

      $scope.sortKey = 'name';
      $scope.reverse = false;

      $scope.sort = function(keyname) {
        $scope.sortKey = keyname; //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      };

      var years = NalogyData.getYears();
      $scope.years = years.slice(0, years.length - 1);
      //   console.log($scope.years);
      $scope.monthes = NalogyData.getMonthes();
      $scope.year1 = 2015;
      $scope.years1 = [2015];
      $scope.year2 = 2016;

      $scope.query = {
        name: $scope.companies[0],
      }

      $scope.pretitle = 'Простои (тыс. маш-час)';
      $scope.pretitle2 = 'Коэф исп календ времени (%)';

      $scope.currentMonth = NalogyData.getMonthes()[0];

      $scope.height = screen.height / 36;

      $scope.updateGraph();

      $scope.data = [
        $scope.result.r1,
        $scope.result.r2,
        $scope.result.r9,
        $scope.result.r10
      ];
      for (i in $scope.result.r9) {
        if ($scope.result.r9[i]) {
          $scope.lastyear1 = $scope.result.r9[i];
        }
      }
      for (i in $scope.result.r10) {
        if ($scope.result.r10[i]) {
          $scope.lastyear2 = $scope.result.r10[i];
        }
      }
      //   $scope.lastyear2 = $scope.result.r10[$scope.result.r10.length - 1];

      $scope.colors = [{
          backgroundColor: '#00cc00',
          borderColor: '#00cc66',
          hoverBackgroundColor: '#A2DED0',
          hoverBorderColor: '#A2DED0'
        },
        {
          backgroundColor: '#0066ff',
          borderColor: '#3366ff',
          hoverBackgroundColor: '#65C6BB',
          hoverBorderColor: '#65C6BB'
        },
        {

          borderColor: '#006600'
        },
        {
          borderColor: '#0000cc'
        },

      ];


      $scope.datasetOverride = [{
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-1',
        type: 'bar'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }, {
        yAxisID: 'y-axis-2',
        type: 'line'
      }];
      $scope.options = {
        scales: {
          yAxes: [{
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right',
              // elements: {
              //     line: {
              //         fill: false,
              //         skipNull: true,
              //         drawNull: false,
              //     }
              // }
            }
          ]
        },


        "legend": {
          "display": false,
          "position": "top"
        }

      };

      $scope.updateData = function() {

        $scope.result = {
          r1: [3521, 3765, 3895, 3547, 3462, 3429, 3478, 3591, 3506, 3480, 3471, 3452],
          r2: [3442, 3457, 3764, 3340, 3341, 3259, 3241, 3235, 3221, 3180, 3100, null],
          r9: [91.4, 90.6, 90.6, 90.7, 90.9, 91.0, 91.0, 91.1, 91.1, 91.2, 91.2, 91.3],
          r10: [91.9, 91.8, 91.5, 91.7, 91.8, 91.9, 92.0, 92.1, 92.1, 92.2, 92.2, null]
        }
        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];



        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Простои (тыс. маш-час)';
        $scope.pretitle2 = 'Коэф исп календ времени (%)';


        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      }

      $scope.updateData2 = function() {

        $scope.result = {
          r1: [1619, 1400, 1630, 1580, 1640, 1585, 1630, 1645, 1611, 1650, 1590, 1645],
          r2: [1625, 1611, 1598, 1687, 1668, 1652, 1695, 1729, 1711, 1708, 1699, null],
          r9: [95.0, 90.9, 95.6, 95.8, 96.2, 96.1, 95.6, 96.5, 94.2, 93.4, 93.0, 93.1],
          r10: [92.0, 92.0, 93.2, 94.0, 92.5, 91.5, 93.6, 95.0, 95.0, 95.0, 95.0, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];


        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Рабочий парк ТС (маш-дн)';
        $scope.pretitle2 = 'Коэффициент готовности (%)';

        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };
      }
      $scope.updateData3 = function() {

        $scope.result = {
          r1: [36695, 32442, 36246, 35344, 36766, 35485, 36746, 36611, 36833, 38232, 36875, 38266],
          r2: [38278, 37900, 36643, 39072, 39287, 39409, 39551, 39798, 39359, 39336, 39192, null],
          r9: [98.1, 97.9, 97.9, 97.9, 98.0, 98.0, 98.0, 98.0, 98.0, 98.1, 98.1, 98.1],
          r10: [98.2, 98.2, 98.1, 98.2, 98.2, 98.2, 98.3, 98.3, 98.3, 98.3, 98.3, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];


        $scope.options.scales.yAxes[1].display = true;

        $scope.pretitle = 'Исп внутрисменного времени (маш-час)';
        $scope.pretitle2 = 'Коэф исп внутрисменного времени (%)';

        $scope.selectedItem = {
          name: 'TC 1',
          v1: 398,
          v2: 16,
          v3: 14.6,
          v4: 382,
          v5: 15.4,
          v6: 370,
          v7: 12,
          v8: 34
        };

      }


      $scope.updateData4 = function() {


        $scope.result = {
          r1: [200, 210, 250, 180, 170, 210, 220, 250, 270, 300, 320, 310],
          r2: [210, 240, 230, 170, 210, 250, 230, 280, 270, 310, 330, null],
          r9: [10.0, 2.4, 9.1, 9.5, 4.0, 4.1, 6.3, 8.9, 10.7, 11.5, 11.6, 10.7],
          r10: [4.8, 8.9, 7.4, 4.7, 1.9, 6.1, 7.8, 8.8, 8.6, 8.8, 9.2, null]
        }

        $scope.data = [
          $scope.result.r1,
          $scope.result.r2,
          $scope.result.r9,
          $scope.result.r10
        ];

        $scope.places = [{
            name: 'НДС',
            v1: 523,
            v2: 21.1,
            v3: 511,
            v4: 12
          },
          {
            name: 'Соцналог',
            v1: 410,
            v2: 16.5,
            v3: 398,
            v4: 12
          },
          {
            name: 'Зарплата',
            v1: 350,
            v2: 14.1,
            v3: 320,
            v4: 30
          },
          {
            name: 'Штрафы',
            v1: 308,
            v2: 12.4,
            v3: 278,
            v4: 30
          },
          {
            name: 'Пеня',
            v1: 251,
            v2: 10.1,
            v3: 221,
            v4: 30
          },
          {
            name: 'Закуп Услуга 1',
            v1: 141,
            v2: 5.7,
            v3: 121,
            v4: 20
          },
          {
            name: 'Закуп Услуга 2',
            v1: 140,
            v2: 5.6,
            v3: 120,
            v4: 20
          }

        ];

        $scope.options.scales.yAxes[1].display = true;
        $scope.pretitle = 'Анализ рентабельности по статьям';

        $scope.selectedItem = {
          name: 'НДС',
          v1: 523,
          v2: 21.1,
          v3: 511,
          v4: 12
        };
      }

      $scope.show = true;
    }


  });

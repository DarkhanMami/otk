angular.module('starter.services', ['ngCordova'])
.factory('NalogyData', function ($http, $q) {
    var data = {};
    var years = [];
    var companies = [];
    var monthes = [];
    var asyncInit = function() {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
      return $q(function(resolve, reject) {
          var fileNames = ["nalogy_data.json", "nalogy_years.json", "nalogy_companies.json"];
          $http.get(fileNames[0]).success(function (response) {
              data = response;
              $http.get(fileNames[1]).success(function (response) {
                  years = response;
                  $http.get(fileNames[2]).success(function (response) {
                      companies = response;
                      $http.get("nalogy_monthes.json").success(function (response) {
                          monthes = response;
                          resolve("OK");
                      });
                  });
              });
          });
     });
    }

    return {
        init: asyncInit,
        filter: function(year, company, column) {
            result = [];
            column = parseInt(column);
            year = parseInt(year);
            for (i in monthes) {
                result.push(data[company][year][monthes[i]][column]);
            }
            return result;
        },
        getData: function() {
            return data;
        },
        getCompanies: function() {
            return companies;
        },
        getYears: function() {
            return years;
        },
        getMonthes: function() {
            return monthes;
        }
    }
})
.factory('Data', function ($http, $q, $cordovaFile) {
    var monthes = [];
    var colNames = [];
    var places = [];
    var fullData = {};
    var smartData = {};

    var main_monthes = {};
    var main_colNames = {};
    var main_places = {};
    var main_fullData = {};
    var main_smartData = {};

    var currentMonth;
    var currentMonthNum = "01";
    var count = 0;

    var asyncInit = function() {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
     
      return $q(function(resolve, reject) {
          
          $http.get("/android_asset/www/monthes2.json").success(function (response) {
              main_monthes = response;
              $http.get("/android_asset/www/fullData2.json").success(function (response) {
                  main_fullData = response;
                  $http.get("/android_asset/www/colNames2.json").success(function (response) {
                      main_colNames = response;
                      $http.get("/android_asset/www/places2.json").success(function (response) {
                          main_places = response;
                          $http.get("/android_asset/www/smartData2.json").success(function (response) {
                              main_smartData = response;

                              monthes = main_monthes['otk'];
                              fullData = main_fullData['otk'];
                              colNames = main_colNames['otk'];
                              places = main_places['otk'];
                              smartData = main_smartData['otk'];
                              currentMonth = monthes[0];
                              resolve("OK");
                          });
                      });
                  });
              });
          });

          });

      
    }
    return {
        init: asyncInit,
        setCurrentMonth: function(newMonth) {
            for (k in monthes) {
                if (monthes[k] == newMonth) {
                    k = +k + 1;

                    if (k < 10) {
                        currentMonthNum = "0"+k;
                    } else {
                        currentMonthNum = ""+k;
                    }
                    break;

                }
            }

            currentMonth = newMonth;
        },

        updateAllData: function(){
            $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/monthes2.json").then(function (response) {                
                main_monthes = JSON.parse(response);
                $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/fullData2.json").then(function (response) {
                    main_fullData = JSON.parse(response);
                    $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/colNames2.json").then(function (response) {
                        main_colNames = JSON.parse(response);
                        $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/places2.json").then(function (response) {
                            main_places = JSON.parse(response);
                            $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/smartData2.json").then(function (response) {
                                main_smartData = JSON.parse(response);

                                monthes = main_monthes['otk'];
                                fullData = main_fullData['otk'];
                                colNames = main_colNames['otk'];
                                places = main_places['otk'];
                                smartData = main_smartData['otk'];                                
                                currentMonth = monthes[0];
                            });
                        });
                    });
                });
            });
        },

        changeAllData: function(type){
            $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json").then(function (response) {                
                main_monthes = JSON.parse(response);
                $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json").then(function (response) {
                    main_fullData = JSON.parse(response);
                    $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json").then(function (response) {
                        main_colNames = JSON.parse(response);
                        $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/" + type + "places2.json").then(function (response) {
                            main_places = JSON.parse(response);
                            $cordovaFile.readAsText(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json").then(function (response) {
                                main_smartData = JSON.parse(response);

                                monthes = main_monthes['otk'];
                                fullData = main_fullData['otk'];
                                colNames = main_colNames['otk'];
                                places = main_places['otk'];
                                smartData = main_smartData['otk'];                                
                                currentMonth = monthes[0];
                            });
                        });
                    });
                });
            });
        },


        updateData: function() {

            // $http.get("http://192.168.33.87:81/nova-api/get_full_data")
            // .success(function(data) {
            //     $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/fullData2.json", true)
            //         .then(function (success) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/fullData2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/fullData2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });
            //         }, function (error) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/fullData2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/fullData2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });                      
            //         });
            // });

            // $http.get("http://192.168.33.87:81/nova-api/get_monthes")
            // .success(function(data) {
            //     $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/monthes2.json", true)
            //         .then(function (success) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/monthes2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/monthes2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });
            //         }, function (error) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/monthes2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/monthes2.json", data, true)
            //                     .then(function (success) {

            //                     });
            //               });                      
            //         });
            // });

            // $http.get("http://192.168.33.87:81/nova-api/get_colNames")
            // .success(function(data) {
            //     $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/colNames2.json", true)
            //         .then(function (success) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/colNames2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/colNames2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });
            //         }, function (error) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/colNames2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/colNames2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });                      
            //         });
            // });

            // $http.get("http://192.168.33.87:81/nova-api/get_places")
            // .success(function(data) {
            //     $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/places2.json", true)
            //         .then(function (success) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/places2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/places2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });
            //         }, function (error) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/places2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/places2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });                      
            //         });
            // });

            // $http.get("http://192.168.33.87:81/nova-api/get_smartData")
            // .success(function(data) {
            //     $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/smartData2.json", true)
            //         .then(function (success) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/smartData2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/smartData2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });
            //         }, function (error) {
            //           $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/smartData2.json", true)
            //               .then(function (success) {
            //                 $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/smartData2.json", data, true)
            //                     .then(function (success) {
            //                     });
            //               });                      
            //         });
            // });

            updateDataHelper("");

            
       },

       updateDataHelper: function(type) {

            $http.get("http://192.168.33.87:81/nova-api/" + type + "get_full_data")
            .success(function(data) {
                $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json", true)
                    .then(function (success) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json", data, true)
                                .then(function (success) {
                                });
                          });
                    }, function (error) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "fullData2.json", data, true)
                                .then(function (success) {
                                });
                          });                      
                    });
            });

            $http.get("http://192.168.33.87:81/nova-api/" + type + "get_monthes")
            .success(function(data) {
                $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json", true)
                    .then(function (success) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json", data, true)
                                .then(function (success) {
                                });
                          });
                    }, function (error) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "monthes2.json", data, true)
                                .then(function (success) {

                                });
                          });                      
                    });
            });

            $http.get("http://192.168.33.87:81/nova-api/" + type + "get_colNames")
            .success(function(data) {
                $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json", true)
                    .then(function (success) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json", data, true)
                                .then(function (success) {
                                });
                          });
                    }, function (error) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "colNames2.json", data, true)
                                .then(function (success) {
                                });
                          });                      
                    });
            });

            $http.get("http://192.168.33.87:81/nova-api/" + type + "get_places")
            .success(function(data) {
                $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/" + type + "places2.json", true)
                    .then(function (success) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "places2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "places2.json", data, true)
                                .then(function (success) {
                                });
                          });
                    }, function (error) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "places2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "places2.json", data, true)
                                .then(function (success) {
                                });
                          });                      
                    });
            });

            $http.get("http://192.168.33.87:81/nova-api/" + type + "get_smartData")
            .success(function(data) {
                $cordovaFile.removeFile(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json", true)
                    .then(function (success) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json", data, true)
                                .then(function (success) {
                                });
                          });
                    }, function (error) {
                      $cordovaFile.createFile(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json", true)
                          .then(function (success) {
                            $cordovaFile.writeFile(cordova.file.dataDirectory, "otk_data/" + type + "smartData2.json", data, true)
                                .then(function (success) {
                                });
                          });                      
                    });
            });
            
       },



        changeData: function(utt) {
            if (utt == "data_mutt") {
                monthes = main_monthes['data_mutt'];
                fullData = main_fullData['data_mutt'];
                colNames = main_colNames['data_mutt'];
                places = main_places['data_mutt'];
                smartData = main_smartData['data_mutt'];
                currentMonth = monthes[0];
            } else if (utt == "data_mutt_1") {
                monthes = main_monthes['data_mutt_1'];
                fullData = main_fullData['data_mutt_1'];
                colNames = main_colNames['data_mutt_1'];
                places = main_places['data_mutt_1'];
                smartData = main_smartData['data_mutt_1'];
                currentMonth = monthes[0];
            } else if (utt == "data_mutt_2") {
                monthes = main_monthes['data_mutt_2'];
                fullData = main_fullData['data_mutt_2'];
                colNames = main_colNames['data_mutt_2'];
                places = main_places['data_mutt_2'];
                smartData = main_smartData['data_mutt_2'];
                currentMonth = monthes[0];
            } else if (utt == "data_mutt_3") {
                monthes = main_monthes['data_mutt_3'];
                fullData = main_fullData['data_mutt_3'];
                colNames = main_colNames['data_mutt_3'];
                places = main_places['data_mutt_3'];
                smartData = main_smartData['data_mutt_3'];
                currentMonth = monthes[0];
            } else if (utt == "data_jutt") {
                monthes = main_monthes['data_jutt'];
                fullData = main_fullData['data_jutt'];
                colNames = main_colNames['data_jutt'];
                places = main_places['data_jutt'];
                smartData = main_smartData['data_jutt'];
                currentMonth = monthes[0];
            } else if (utt == "data_jutt_1") {
                monthes = main_monthes['data_jutt_1'];
                fullData = main_fullData['data_jutt_1'];
                colNames = main_colNames['data_jutt_1'];
                places = main_places['data_jutt_1'];
                smartData = main_smartData['data_jutt_1'];
                currentMonth = monthes[0];
            } else if (utt == "data_jutt_2") {
                monthes = main_monthes['data_jutt_2'];
                fullData = main_fullData['data_jutt_2'];
                colNames = main_colNames['data_jutt_2'];
                places = main_places['data_jutt_2'];
                smartData = main_smartData['data_jutt_2'];
                currentMonth = monthes[0];
            } else if (utt == "data_jutt_3") {
                monthes = main_monthes['data_jutt_3'];
                fullData = main_fullData['data_jutt_3'];
                colNames = main_colNames['data_jutt_3'];
                places = main_places['data_jutt_3'];
                smartData = main_smartData['data_jutt_3'];
                currentMonth = monthes[0];
            } else if (utt == "data_jutt_4") {
                monthes = main_monthes['data_jutt_4'];
                fullData = main_fullData['data_jutt_4'];
                colNames = main_colNames['data_jutt_4'];
                places = main_places['data_jutt_4'];
                smartData = main_smartData['data_jutt_4'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt") {
                monthes = main_monthes['data_butt'];
                fullData = main_fullData['data_butt'];
                colNames = main_colNames['data_butt'];
                places = main_places['data_butt'];
                smartData = main_smartData['data_butt'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt_1") {
                monthes = main_monthes['data_butt_1'];
                fullData = main_fullData['data_butt_1'];
                colNames = main_colNames['data_butt_1'];
                places = main_places['data_butt_1'];
                smartData = main_smartData['data_butt_1'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt_2") {
                monthes = main_monthes['data_butt_2'];
                fullData = main_fullData['data_butt_2'];
                colNames = main_colNames['data_butt_2'];
                places = main_places['data_butt_2'];
                smartData = main_smartData['data_butt_2'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt_3") {
                monthes = main_monthes['data_butt_3'];
                fullData = main_fullData['data_butt_3'];
                colNames = main_colNames['data_butt_3'];
                places = main_places['data_butt_3'];
                smartData = main_smartData['data_butt_3'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt_4") {
                monthes = main_monthes['data_butt_4'];
                fullData = main_fullData['data_butt_4'];
                colNames = main_colNames['data_butt_4'];
                places = main_places['data_butt_4'];
                smartData = main_smartData['data_butt_4'];
                currentMonth = monthes[0];
            } else if (utt == "data_butt_5") {
                monthes = main_monthes['data_butt_5'];
                fullData = main_fullData['data_butt_5'];
                colNames = main_colNames['data_butt_5'];
                places = main_places['data_butt_5'];
                smartData = main_smartData['data_butt_5'];
                currentMonth = monthes[0];
            } else if (utt == "otk") {
                monthes = main_monthes['otk'];
                fullData = main_fullData['otk'];
                colNames = main_colNames['otk'];
                places = main_places['otk'];
                smartData = main_smartData['otk'];
                currentMonth = monthes[0];
            };
        },
        getCurrentMonth: function() {
            return currentMonth;
        },
        getMonthes: function() {
            return monthes;
        },
        getSingleData: function (name, day, colName1, colName2) {
            if (day < 10) {
                day = "0" + day
            }
            day = "" + day + "/"+currentMonthNum+"/2016"
            var col1 = -1;
            var col2 = -1;
            for (k in colNames) {
                if (colNames[k] == colName1) {
                    col1 = k;
                }
                if (colNames[k] == colName2) {
                    col2 = k;
                }
            }
            if (col1 == -1 || col2 == -1) {
                return {
                    "code": 1,
                    "message": "Wrong column names"
                }
            }

            var obj = {
                'v1': smartData[currentMonth + name + day][col1],
                'v2': smartData[currentMonth + name + day][col2],
            }
            return obj;
        },
      
      getPlaces: function (month) {
          var result = [];

          for (i in places) {
              var p = places[i];
              var key = month + p;
              if (key in smartData) {
                  var obj = {
                      'name': p,
                      'v1': smartData[month + p][3],
                      'v2': smartData[month + p][4],
                      'v3': smartData[month + p][5],
                      'v4': smartData[month + p][6],
                      'v5': smartData[month + p][7],
                      'v6': smartData[month + p][8],
                      'v7': smartData[month + p][9],
                      'v8': Math.round(smartData[month + p][11]),
                  }
              } else {
                  var obj = {
                      'name': p,
                      'v1': 0,
                      'v2': 0,
                      'v3': 0,
                      'v4': 0,
                      'v5': 0,
                      'v6': 0,
                      'v7': 0,
                      'v8': 0,
                  }
              }
              result.push(obj)
          }

          return result;
      },
      getColNames: function() {

          return colNames;
      },
      getNumbers: function(name) {
        col = 3;

        var r1 = [null, null, null, null, null, null, null, null, null, null, null, null];
        var r2 = [null, null, null, null, null, null, null, null, null, null, null, null];
        var r3 = [null, null, null, null, null, null, null, null, null, null, null, null];
        var r4 = [null, null, null, null, null, null, null, null, null, null, null, null];
        var m1 = 0;
        var m2 = 0;
        for (k in monthes) {
          for (j in fullData[monthes[k]]) {
            if (fullData[monthes[k]][j][0] == name) {
                if (fullData[monthes[k]][j][2] == 2016) {
                  r1[m1] = fullData[monthes[k]][j][3];
                  r3[m1] = fullData[monthes[k]][j][10] * 100;
                  r3[m1] = parseFloat(Math.round(r3[m1] * 100) / 100).toFixed(2);
                  m1 = m1 + 1;
                }
                if (fullData[monthes[k]][j][2] == 2017) {
                  r2[m2] = fullData[monthes[k]][j][3];
                  r4[m1] = fullData[monthes[k]][j][10] * 100;
                  r4[m1] = parseFloat(Math.round(r4[m1] * 100) / 100).toFixed(2);
                  m2 = m2 + 1;
                }
                break;
            }
          }
        }
        return {
            "code": 0,
            "message": "SUCCESS",
            "r1": r1,
            "r2": r2,
            "r3": r3,
            "r4": r4
        }
      }
    }
});

angular.module('dataApp', ['gleanerServices', 'gleanerApp', 'checklist-model'])
    .controller('DataCtrl', ['$scope', '$window', 'Versions',
        function($scope, $window, Versions) {
            $scope.deleteGame = function() {
                if ($scope.selectedGame) {
                    $scope.selectedGame.$remove(function() {
                        $window.location = "/app";
                    });
                }
            };

            $scope.addEmptyVersion = function() {
                if ($scope.selectedGame) {
                    var version = new Versions();
                    version.name = 'Untitled version';
                    version.gameId = $scope.selectedGame._id;
                    version.$save(function() {
                        $scope.selectedVersion = version;
                        $scope.refreshVersions();
                    });
                }
            };

            $scope.saveVersion = function() {
                if ($scope.selectedVersion) {
                    $scope.selectedVersion.$save();
                }
            };

            $scope.setSelectedVersion = function(version) {
                $scope.selectedVersion = version;
            };

            $scope.deleteVersion = function() {
                if ($scope.selectedVersion) {
                    $scope.selectedVersion.$remove(function() {
                        $scope.refreshVersions();
                    });
                }
            };

            $scope.updateZones = function($data) {
                try {
                    $scope.selectedVersion.zones = JSON.parse($data);
                    $scope.selectedVersion.$save();
                    updateZonesGraph();
                } catch (err) {
                    return 'Invalid JSON';
                }
            };

            $scope.$watch('selectedVersion', function() {
                if ($scope.selectedVersion) {
                    $scope.editedZones = JSON.stringify($scope.selectedVersion.zones, undefined, 4);
                    $scope.zoneNames = [];
                    for (var id in $scope.selectedVersion.zones.nodes) {
                        $scope.zoneNames.push(id);
                    }
                    updateZonesGraph();
                }
            });

            var updateZonesGraph = function() {
                Gleaner.zonesgraph('#zones-graph', $scope.selectedVersion.zones, '/app/');
            };

            $scope.addDerivedVar = function() {
                if ($scope.selectedVersion) {
                    if (!$scope.selectedVersion.derivedVars) {
                        $scope.selectedVersion.derivedVars = [];
                    }
                    $scope.selectedVersion.derivedVars.push({
                        name: 'new_var',
                        value: 0
                    });
                    $scope.selectedVersion.$save();
                }
            };

            $scope.deleteDerivedVar = function(variable) {
                var index = $scope.selectedVersion.derivedVars.indexOf(variable);
                if (index > -1) {
                    $scope.selectedVersion.derivedVars.splice(index, 1);
                }
                $scope.selectedVersion.$save();
            };


            $(function() {
                $('#fileupload').fileupload({
                    dataType: 'json',
                    acceptFileTypes: /(\.|\/)(zip|ead)$/i,
                    start: function(e) {
                        $scope.eadLoading = true;
                    },
                    done: function(e, data) {
                        $scope.selectedVersion.loading = true;
                        $scope.selectedVersion.$save(function() {
                            $.post('/app/extractdata/', {
                                file: data.files[0].name,
                                versionId: $scope.selectedVersion._id
                            }, function() {
                                $('#analysis-state').text('Extracting data from .ead...');
                                checkVersionLoaded($scope.selectedVersion);
                            });

                        });
                    },
                    progressall: function(e, data) {
                        var progress = parseInt(data.loaded / data.total * 100, 10);
                        $('#analysis-state').text('Loading ' + progress + ' %');
                    }

                });
            });


            var checkVersionLoaded = function(version) {
                var check = function() {
                    version.$get(function() {
                        if (version.loading) {
                            setTimeout(check, 1000);
                        } else {
                            $scope.eadLoading = false;
                        }
                    });
                };
                check();
            };
        }
    ]);
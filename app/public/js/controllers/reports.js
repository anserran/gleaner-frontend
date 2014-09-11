var gridster;
var idCounter = 0;

google.load('visualization', '1.0', {
    'packages': ['corechart']
});

angular.module('reportsApp', ['gleanerServices', 'gleanerApp'])
    .controller('ReportsCtrl', ['$scope', 'Result',
        function($scope, Result) {
            $scope.$watch('selectedVersion', function() {
                if ($scope.selectedVersion) {
                    $scope.results = Result.get({
                        gameId: $scope.selectedGame._id,
                        versionId: $scope.selectedVersion._id
                    }, function() {
                        var panels = $scope.selectedVersion.panels;
                        if (panels) {
                            panels.forEach(addPanelToDom);
                            if (panels[0]) {
                                $scope.showPanel(0);
                            }
                        }
                    });
                }
            });

            $(function() {
                $('#relaunch-analysis').click(function() {
                    $.post('/api/analyze/' + $scope.selectedVersion._id);
                });

                gridster = $(".gridster ul").gridster({
                    widget_margins: [10, 10],
                    min_cols: 3,
                    max_cols: 3,
                    resize: {
                        enabled: true,
                        stop: savePanels
                    },
                    draggable: {
                        stop: savePanels
                    },
                    serialize_params: function($w, wgd) {
                        var report = $w.children('div').data();
                        report.x = wgd.col;
                        report.y = wgd.row;
                        report.width = wgd.size_x;
                        report.height = wgd.size_y;
                        return report;
                    }
                }).data('gridster');
            });

            $scope.addPanel = function() {
                var newPanel = {
                    name: 'New panel',
                    reports: []
                };

                var panels = $scope.selectedVersion.panels;
                if (!panels) {
                    $scope.selectedVersion.panels = panels = [];
                }
                panels.push(newPanel);
                $scope.selectedVersion.$save(function() {
                    addPanelToDom(newPanel);
                });
            };

            $scope.showPanel = function(i) {
                $scope.selectedPanel = $scope.selectedVersion.panels[i];
                showReports($scope.selectedPanel);
            };

            $scope.addNewReport = function() {
                var report = $scope.newReport;
                $scope.selectedPanel.reports.push(report);
                $scope.selectedVersion.$save(function() {
                    addReportToDom(report);
                });
            };

            $scope.setReportType = function(type) {
                $scope.newReport = {
                    type: type
                };
                $("#reports-list").hide();
                $("#report-configuration").removeClass('hidden');
            };

            var addPanelToDom = function(panel) {
                var i = $('#panel-list li').length - 1;

                var newPanel = $('#panel-link').clone();
                newPanel.removeClass('hidden');
                newPanel.children('a').text(panel.name || 'Unnamed panel').on('click', function() {
                    $scope.showPanel(i);
                });
                $('#panel-list').append(newPanel);
            };

            var showReports = function(panel) {
                gridster.remove_all_widgets();
                var reportsDiv = $('#reports');
                reportsDiv.empty();
                var reports = panel.reports;
                if (!reports || reports.length === 0) {
                    reportsDiv.append('<p>No reports in this panel</p>');
                } else {
                    reports.forEach(addReportToDom);
                }
            };

            var addReportToDom = function(report) {
                var containerId = 'report' + idCounter++;
                var widget = gridster.add_widget('<li><div id="' + containerId + '"></div></li>', report.width, report.height, report.x, report.y);
                Gleaner.draw('#' + containerId, $scope.results, report);
                widget.children('div').data(report);
                idCounter++;
            };

            var savePanels = function(event, ui, $widget) {
                $scope.selectedPanel.reports = gridster.serialize();
                $scope.selectedVersion.$save();
            };
        }
    ]);
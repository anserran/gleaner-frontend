google.load('visualization', '1.0', {
    'packages': ['corechart']
});

angular.module('reportsApp', ['gleanerServices', 'gleanerApp'])
    .controller('ReportsCtrl', ['$scope',
        function($scope) {
            $scope.$watch('selectedVersion', function() {
                if ($scope.selectedVersion) {
                    drawChart();
                }
            });

            var drawChart = function() {
                $.get('/api/games/' + $scope.selectedGame._id + '/versions/' + $scope.selectedVersion._id + '/results', function(data) {
                    /*var completeData = new google.visualization.DataTable();
                    completeData.addColumn('string', 'Completed');
                    completeData.addColumn('number', 'Gameplays');

                    completeData.addRows([
                        ['Yes', data.gameplaysCompleted],
                        ['No', data.gameplaysCount - data.gameplaysCompleted],
                    ]);

                    var options = {
                        'title': 'Gameplays completed',
                        'width': 400,
                        'height': 300
                    };

                    var chart = new google.visualization.PieChart(document.getElementById('completed'));
                    chart.draw(completeData, options);

                    var initiatedData = new google.visualization.DataTable();
                    initiatedData.addColumn('string', 'Completed');
                    initiatedData.addColumn('number', 'Gameplays');

                    initiatedData.addRows([
                        ['Yes', data.gameplaysInitiated],
                        ['No', data.gameplaysCount - data.gameplaysInitiated],
                    ]);
                    chart = new google.visualization.PieChart(document.getElementById('initiated'));
                    options.title = 'Gameplays initiated';
                    chart.draw(initiatedData, options);
                    for (var key in data) {
                        if (key.indexOf('v_') === 0) {
                            var varData = new google.visualization.DataTable();
                            varData.addColumn('string', 'Value');
                            varData.addColumn('number', 'Count');

                            var values = [];
                            for (var label in data[key]) {
                                values.push([label, data[key][label]]);
                            }
                            varData.addRows(values);
                            var id = 'var_' + key;
                            var div = $('#variables').append('<div id="' + id + '""></div>');
                            var chart1 = new google.visualization.PieChart(document.getElementById(id));
                            options.title = key.substr(2) + ' result';
                            chart1.draw(varData, options);
                        }
                    }*/

                    for (var key in data) {
                        if (key.indexOf('q1_') === 0) {
                            var varName = key.substr(3);
                            var div = $('#variables').append('<div>' + varName + '</div>');
                            div.append('<p> Median: ' + data['q2_' + varName] + '</p>');
                            div.append('<p> Median: ' + data['q1                                                                       _' + varName] + '</p>');
                        }
                    }
                });
            };

            $(function() {
                $('#relaunch-analysis').click(function() {
                    $.post('/api/analyze/' + $scope.selectedVersion._id);
                });
            });
        }
    ]);
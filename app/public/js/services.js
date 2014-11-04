var gleanerServices = angular.module('gleanerServices', ['ngResource']);

gleanerServices.factory('Games', ['$resource',
    function($resource) {
        return $resource('/api/games/:gameId', {
            gameId: '@_id'
        });
    }
]);

gleanerServices.factory('Versions', ['$resource',
    function($resource) {
        return $resource('/api/games/:gameId/versions/:versionId', {
            versionId: '@_id',
            gameId: '@gameId'
        });
    }
]);

gleanerServices.factory('Results', ['$resource',
    function($resource) {
        return $resource('/api/games/:gameId/versions/:versionId/results');
    }
]);

gleanerServices.factory('Online', ['$resource',
    function($resource) {
        return $resource('/api/online');
    }
]);
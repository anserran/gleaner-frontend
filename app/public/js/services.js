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

gleanerServices.factory('$params', ['$window',
    function($window) {
        return _.object(_.compact(_.map($window.location.search.slice(1).split('&'), function(item) {
            if (item) return item.split('=');
        })));
    }
]);
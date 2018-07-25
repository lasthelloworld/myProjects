/**
 * Created by cuss on 2015/5/9 0009.
 */

(function () {
    'use strict';
    angular
        .module('app.tool')
        .factory('appService', appService);

    appService.$inject = ['$q', '$http', '$location', '$rootScope', '$timeout'];
    // app断信息 全局 保存Service一些配置
    function appService($q, $http, $location, $rootScope, $timeout) {
        var service = {
            app: {
                "Server": {
                    "BASEPROTOCOL": "http",
                    "URL": "192.168.4.19",
                    "PORT": "8081",
                    "Route": ""
                },
                "FUN": {
                    "GetSJZEventData": { "url": "/nms/MetricsItem/GetSJZEventData", "method": "post", "headers": { "Content-type": "application/json" } },
                    "GetSJYEventData": { "url": "/nms/MetricsItem/GetSJYEventData", "method": "post", "headers": { "Content-type": "application/json" } },
                    "GetJZYEventData": { "url": "/nms/MetricsItem/GetJZYEventData", "method": "post", "headers": { "Content-type": "application/json" } },
                    "GetInitEventData": { "url": "/nms/MetricsItem/GetInitEventData", "method": "post", "headers": { "Content-type": "application/json" } },
                    "GetMStructConfig": { "url": "/nms/MetricsRecord/GetMStructConfig", "method": "post", "headers": { "Content-type": "application/json" } },
                    "GetMetricsItemDataTree": { "url": "/nms/MetricsItem/GetMetricsItemDataTree", "method": "post", "headers": { "Content-type": "application/json" } }
                 }
            },
            getAsynApp: getAsynApp,
            getDistDataByFun: getDistDataByFun
        }
        return service;

        function getDistDataByFun(method) {

            var data = {};
            var temp = null;
            var server = null;
            if (service.app.FUN && service.app.FUN[method]) {
                temp = service.app.FUN[method];

            }
            if (service.app.Server) {
                server = service.app.Server;
                server.ANWS = server.BASEPROTOCOL + "://" + server.URL;
                if (server.PORT != "") {
                    server.ANWS += ":" + server.PORT;
                }
                if (server.Route != "") {
                    server.ANWS += "/" + server.Route;
                }
            }
            if (temp) {
                data.url = (server.ANWS || "") + (temp.url || "");
                data.method = temp.method || "get";
                data.headers = temp.headers || {};
                data.data = {};
                data.data.Params = {};
                return data;
            }
            return null;
        }

        function getAsynApp() {
            var deferred = $q.defer();
            var data = {};
            $q.all([$http(angular.extend(data, { url: 'assets/json/interface.json' }))])
                .then(function (dataList) {
                    setApp(dataList[0].data);
                    deferred.resolve(dataList);
                }, function (error) {
                    deferred.resolve(error);
                });
            return deferred.promise;
        }

        function setApp(data) {
            service.app = data;
        }

    }
})();

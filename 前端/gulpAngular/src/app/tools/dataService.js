/*
 * @File name: data.service.js
 * @Desc:    crud database
 * @Author: cuss
 * @Date:  2015年5月6日 14:53:38
 * @Last Modified by:   cuss
 * @Last Modified time: 2015年5月6日 14:53:48
 */
(function () {
    'use strict';

    angular
        .module('app.tool')
        .factory('dataService', dataService);

    dataService.$inject = ['$http', '$q'];
    // 对于数据库的服务
    // 标准格式参照 sqlBase.json  目录下 asset/interface.json 
    function dataService($http, $q) {
        var vm = this;
        var service = {
            baseMethod: "post",
            dataBase: {
                baseUrl: '/sys/log',
                headers: {
                    'Content-type': 'application/json',
                    'charset': 'utf-8'
                }
            },
            doData: doData

        };
        return service;

        //默认传入url header 一个特定的sqlBase 格式
        function doData(data) {
            var deferred = $q.defer();
            data = data || {};
            if (data && !data.url) {
                data.url = service.dataBase.baseUrl;
            }
            if (data && !data.method) {
                data.method = service.baseMethod;
            }
            // if (data && !data.headers) {
            //     data.headers = {};
            // }
            if (data) {
                data.headers = angular.extend(service.dataBase.headers, data.headers);
            }
            var req = {
                method: data.method,
                url: data.url,
                headers: data.headers,
                data: data.data
            };
            console.log('data---request--->', req);
            console.log('data---request--- JSON--->  %c ' + JSON.stringify(req.data), "color:red");
            $http(req).
                success(function (data, status, headers) {
                    console.log('data---success--->' + req.url, {
                        data: data,
                        status: status,
                        headers: headers
                    });
                    // 成功返回
                    // 增加拦截登录
                    if (data && data.Flag == -999) {
                    }
                    deferred.resolve({
                        data: data,
                        status: status,
                        headers: headers
                    });

                }).
                error(function (data, status, headers) {
                    //失败
                    data = data || "Request failed";
                    console.log('data---error--->' + req.url, {
                        data: data,
                        status: status,
                        headers: headers
                    });
                    var url = document.location.href;
                    var index = url.indexOf('/login');
                    if (status === 503 && index < 0 && vm.isReLogin != 1) {
                    }
                    if (status === 500) {
                    }
                    deferred.reject({
                        data: data,
                        status: status
                    })
                });
            return deferred.promise;
        }
    }
})();

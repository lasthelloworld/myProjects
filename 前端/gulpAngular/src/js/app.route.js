/**
 * Created by pengyun on 2017/5/4.
 */


(function () {
    'use strict';
    angular.module("app")
        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider
                .state('main', {
                    url: '/',
                    templateUrl: 'app/main/main.html',
                    controller: 'main',
                    controllerAs: 'vm'
                })
                .state('event', {
                    url: '/event',
                    templateUrl: 'app/event/event.html',
                    controller: 'event',
                    controllerAs: 'vm'
                })
                .state('nmsTest',{
                    url:'/nmsTest',
                    templateUrl:'app/nmsTest/nmsTest.html',
                    controller:'nmsTest',
                    controllerAs:'vm'
                });

            $urlRouterProvider.otherwise('/');
        });
})();

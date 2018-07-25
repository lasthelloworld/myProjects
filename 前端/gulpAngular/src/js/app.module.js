/**
 * Created by pengyun on 2017/5/4.
 */


(function () {
    'use strict';
    var app = angular.module("app", [
        'ui.router',
        'app.tool',
        'app.home',
        'app.main',
        'app.nmsTest',
        'app.event'
    ]);
    // app.run(appRun);
    // appRun.$inject =['appService'];
    // function appRun(appService){
    //     appService.getAsynApp();
    // }
})();



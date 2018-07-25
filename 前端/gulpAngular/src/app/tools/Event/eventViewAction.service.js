/**
 * Created by pengyun on 2017/9/26.
 * 事件处理完毕后处理回调逻辑--专注于视图
 */

(function () {
    'use strict';
    angular.module('app.tool')
        .factory('eventViewAction', eventViewAction);
    eventViewAction.$inject = ['eventHelper', '$timeout'];
    function eventViewAction(eventHelper, $timeout) {
        var service = {
            doView: doView //执行事件执行完毕的后续处理
        }
        return service;

        function doView(eventPromise, SubData, scope) {
            return  eventPromise.then(function (eventResult) {//内部是同步操作
                switch (eventResult.EventType) {
                    case "SJZDZ":
                        actionSJZView(eventResult, SubData, scope);
                        break;//数据值视图事件
                    case "JZYDZ":
                       actionJZYView(eventResult,SubData,scope);
                       break;
                    case "JLDZ":
                        actionJLDZView(eventResult,SubData,scope);
                        break; 
                }
            }, function (eventError) {

            });
        }

        function actionSJZView(eventResult, SubData, scope) {
            var formObj = eventResult.ResultData.Data.NormalObj;
            var tableArr = eventResult.ResultData.Data.CollectObj;

            //表单
            if (formObj != null) {
                // $timeout(function () { //创建干净域 手动更新
                //     scope.$apply(function () {
                        angular.forEach(formObj, function (Value, Key) {
                            var subItem = eventHelper.findSubItem(SubData, Key);
                            if (subItem != null) {
                                subItem.DefaultVal = Value;
                            }
                        });
                //     });
                // }, 0, false);
            }
            //表格
            if (tableArr && tableArr instanceof Array) {

            }

        }
        function actionJZYView(eventResult,SubData,scope){
            var list = eventResult.ResultData; 
        }
        function actionJLDZView(eventResult,SubData,scope){
            for(var cIndex=0;cIndex<eventResult.ResultData.ChooseItem.length;cIndex++){
                 var ChooseItem = eventResult.ResultData.ChooseItem[cIndex];
                 angular.forEach(ChooseItem.Source,function(code,index,arr){
                    angular.element("div[colid='"+code+"']").css({
                        "display":(ChooseItem.IsShow)?"block":"none"
                    });
                 });
            }
        }
    }
})();
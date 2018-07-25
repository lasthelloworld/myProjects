/**
 * Created by pengyun on 2017/9/26.
 * 定义事件操作--专注于对于事件执行的逻辑
 */

(function () {
    'use strict';

    angular.module('app.tool')
        .factory('eventAction', eventAction);
    eventAction.$inject = ['appService', 'dataService','eventHelper','$q'];
    function eventAction(appService, dataService,eventHelper,$q) {
        var service = {
            actionJZYDZ: actionJZYDZ,//加载源事件
            actionSJYDZ: actionSJYDZ,//数据源事件
            actionBindSJY: actionBindSJY,//数据源帮值事件
            actionJLDZ: actionJLDZ,//级联事件
            actionSJZDZ: actionSJZDZ,//数据值事件
            actionInitDZ: actionInitDZ,//初始化事件
            actionWCDZ: actionWCDZ,//完成事件
            getParamsByList: getParamsByList,
            getParams: getParams,
            GetMetricsItemDataTree: GetMetricsItemDataTree, //测试:获取数据结构
            doEvent: doEvent
        };
        return service;

        //根据MetricsItemList,MetricsItemList必须是一类事件 获取参数
        function getParamsByList(eventMetricsItemList,SubData,commonParams,extendParams) {
            var reqParams = {}
            var MICodes = [];
            if (eventMetricsItemList.length > 0) {
                angular.forEach(eventMetricsItemList, function (item, index) {
                    MICodes.push(item.MetricsItemCode);
                    var itemParams = getParams(item,SubData,commonParams,extendParams);
                    Object.assign(reqParams, itemParams);
                });
                if (eventMetricsItemList[0].EventType == "SJYDZ") {
                    reqParams.MICodes = MICodes.join(',');
                }
            }
            return reqParams;
        }//针对于数据源特殊情况处理的获取请求参数

        function getParams(eventMetricsItem,SubData,commonParams,extendParams) {
            var reqParams = {
                MCSID: commonParams.MCSID,//指标集结构ID
                NurseUnitID: commonParams.NurseUnitID,//护理单元ID
                StandardID: commonParams.StandardID//标准ID
            }
            if (eventMetricsItem.ParamMCodes && eventMetricsItem.ParamMCodes instanceof Array) {//扩展参数
                angular.forEach(eventMetricsItem.ParamMCodes, function (pCode, pIndex, arr) {
                    reqParams[pCode] = eventHelper.findSubItem(SubData,pCode).DefaultVal;//找到对应Code的值赋值
                });
            }
            switch (eventMetricsItem.EventType) {
                case "SJZDZ":
                    reqParams.MICode = eventMetricsItem.MetricsItemCode //触发源Code
                    reqParams.Tag = eventMetricsItem.Tag;
                    if(extendParams!=null){
                        reqParams.Value = extendParams.Value;
                    }
                    // reqParams.Value = "";
                    // reqParams.ValueID = "";下拉框多选框情况才有值
                    break;
                case "SJYDZ":
                    reqParams.MICode = eventMetricsItem.MetricsItemCode;
                    break;
                case "JZYDZ":
                    reqParams.MICode   = eventMetricsItem.MetricsItemCode;
                    if(extendParams!=null){
                        reqParams.Value = extendParams.Value;
                    }
                    break;
                case "JLDZ":
                    reqParams.MICode = eventMetricsItem.MetricsItemCode;
                    reqParams.ChooseItem = eventMetricsItem.ChooseItem;
                    if(extendParams!=null){
                        reqParams.Value = extendParams.Value; 
                    }
                    break;

            }

            return reqParams;
        }

        function actionInitDZ(reqParams) {
            var request = appService.getDistDataByFun("GetInitEventData");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }
        function actionSJYDZ(reqParams) {
            var request = appService.getDistDataByFun("GetSJYEventData");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }
        function actionBindSJY(targetCode, SubData, dataList) {
            for (var sIndex = 0; sIndex < SubData.length; sIndex++) {
                if (SubData[sIndex].Code == targetCode) {//结构指标项
                    SubData[sIndex].Source = dataList;
                }
            }
        }

        function actionSJZDZ(reqParams) {
            var request = appService.getDistDataByFun("GetSJZEventData");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }
        function actionJZYDZ(reqParams) {
            var request = appService.getDistDataByFun("GetJZYEventData");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }
        function actionJLDZ(reqParams) {
            console.log("执行级联事件");
            for(var cIndex=0;cIndex<reqParams.ChooseItem.length;cIndex++){
                reqParams.ChooseItem[cIndex].IsShow = (reqParams.ChooseItem[cIndex].ChooseItemID==reqParams.Value);
            }
            return reqParams;
        }
        function actionWCDZ() {
            console.log("执行完成事件");
        }

        function GetMetricsItemDataTree(reqParams) {
            var request = appService.getDistDataByFun("GetMetricsItemDataTree");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }

        function asynDo(action, params) {
            var defered = $q.defer();
            action(params, defered.resolve, defered.reject);
            return defered.promise;
        }

        //入口 doEvent 入参可能会改准备留好借口
        function doEvent(eventMetricsItem,SubData,commonParams,extendParams){
            var params = getParams(eventMetricsItem,SubData,commonParams,extendParams);//参数
            var action = function Delegate(params, resolve, reject) {//操作壳子，内部包对应事件类型的事件
                var eventResult = {
                    EventType: eventMetricsItem.EventType,
                    MetricsItemCode: eventMetricsItem.MetricsItemCode,
                    ResultData: null
                }
                switch (eventMetricsItem.EventType) {
                    case "InitDZ":
                        actionInitDZ(params).then(function (msg) {
                            if (msg.data.Flag == 1) {
                                eventResult.ResultData = msg.data.Output.Data;
                                resolve(eventResult);
                            } else {
                                reject(msg.data.Msg);
                            }
                        });
                        break;
                    case "JZYDZ":
                        actionJZYDZ(params).then(function (msg) {
                            if (msg.data.Flag == 1) {
                                eventResult.ResultData = msg.data.Output.Data;
                                resolve(eventResult);
                            } else {
                                reject(msg.data.Msg);
                            }
                        });
                        break;
                    case "SJYDZ":
                        actionSJYDZ(params).then(function (msg) {
                            if (msg.data.Flag == 1) {
                                eventResult.ResultData = msg.data.Output.Data;
                                resolve(eventResult);
                            } else {
                                reject(msg.data.Msg);
                            }
                        });
                        break;
                    case "SJZDZ":
                        actionSJZDZ(params).then(function (msg) {
                            if (msg.data.Flag == 1) {
                                eventResult.ResultData = msg.data.Output.Data;
                                resolve(eventResult);
                            } else {
                                reject(msg.data.Msg);
                            }
                        });
                        break;
                    case "JLDZ":
                            eventResult.ResultData =  actionJLDZ(params);//非异步
                            resolve(eventResult);
                     break;
                    case "WCDZ": break;
                }
            }
            return asynDo(action, params);
        }

        function getValue(extendParams){
            // switch(extendParams.MType){//控件类型决定取值类型

            // }
        }
    }
})();

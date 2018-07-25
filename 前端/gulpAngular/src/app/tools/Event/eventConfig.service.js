/**
 * Created by pengyun on 2017/9/26.
 * 事件配置信息
 */

(function () {
    'use strict';
    angular.module('app.tool')
        .factory('eventConfig', eventConfig);
    eventConfig.$inject = ['appService', 'dataService'];
    function eventConfig(appService, dataService) {
        var service = {
            GetMStructConfig: GetMStructConfig,//标准结构集配置--用于测试
            GetEventConfigList: GetEventConfigList //获取事件Code键值对列表
        }
        return service;

        function GetMStructConfig(reqParams) {
            var request = appService.getDistDataByFun("GetMStructConfig");
            request.data.Params = reqParams;
            return dataService.doData(request);
        }
        function GetEventConfigList(mStructConfig) {
            var EventConfigList = {}
            //格式化数据（关键在减少循环）
            if (mStructConfig.Struct.Event && mStructConfig.Struct.Event.EventItem) {
                var EventItems = mStructConfig.Struct.Event.EventItem;//数据源事件集合
                angular.forEach(EventItems, function (eventItem, eIndex, eArr) {//事件项遍历
                    //事件项下指标项遍历
                    angular.forEach(eventItem.MetricsItem, function (mItem, mIndex, mArr) {
                        var KeyCode = "";
                        mItem.EventType = eventItem.EventType;
                        switch (eventItem.EventType) {
                            case "InitDZ":
                                KeyCode = "Page";
                                break;
                            case "SJYDZ":
                                KeyCode = "Page";
                                var targetCode = mItem.MetricsItemCode;
                                //数据源帮值操作需在目标Code和页面初始化Page时执行不同操作
                                InsertKeyCodeData(EventConfigList, targetCode, mItem);
                                break;
                            case "SJZDZ":
                                KeyCode = mItem.MetricsItemCode;
                                break;
                            case "JZYDZ":
                                KeyCode = mItem.MetricsItemCode;
                                break;
                            case "JLDZ":
                                KeyCode = mItem.MetricsItemCode;
                                break;
                        }
                        InsertKeyCodeData(EventConfigList, KeyCode, mItem);
                    });
                });
            }

            return EventConfigList;
        }
        function InsertKeyCodeData(EventConfigList, KeyCode, mItem) {
            if (!EventConfigList[KeyCode] && KeyCode != "") {
                EventConfigList[KeyCode] = [];
            }
            if (KeyCode != "") {
                EventConfigList[KeyCode].push(mItem);
            }
        }
    }
})();
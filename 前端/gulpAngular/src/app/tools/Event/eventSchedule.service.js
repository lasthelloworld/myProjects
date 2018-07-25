/**
 * Created by pengyun on 2017/9/26.
 * 事件调度操作
 */

(function () {
    'use strict';

    angular.module('app.tool')
        .factory('eventShedule', eventShedule);
    eventShedule.$inject = ['eventAction', 'eventConfig', '$q'];
    function eventShedule(eventAction, eventConfig, $q) {
        //事件业务类型优先级
        var EventTypeLevel = {
            InitDZ: 1, //初始化事件
            JZYDZ: 1,//加载源事件
            SJYDZ: 1,//数据源事件
            SJZDZ: 2, //数据值事件
            JLDZ: 3,//级联事件
            WCDZ: 4 //完成事件
        }
        var service = {
            disPatch: disPatch//调度分发事件
        };
        return service;

        //SourceEventCode:触发源Code
        //SourceEventCode：格式化后的事件列表
        //eventTypeLevel:可选参数，自定义排序方式
        //返回优先级排序后的执行队列
        function disPatch(EventConfigList, SourceEventCode, eventTypeLevel) {
            var eventConfigList = EventConfigList[SourceEventCode];
            if (eventTypeLevel != null) {//事件优先级
                EventTypeLevel = eventTypeLevel;
            }
            return eventConfigList.sort(sortFunc);
        }

        function sortFunc(item1, item2) {
            var number1 = 0, number2 = 0;
            if (typeof EventTypeLevel[item1.EventType] != 'undefined') {
                number1 = EventTypeLevel[item1.EventType];
            }
            if (typeof EventTypeLevel[item2.EventType] != 'undefined') {
                number2 = EventTypeLevel[item2.EventType];
            }

            return number1 - number2;
        }
        
    }
})();

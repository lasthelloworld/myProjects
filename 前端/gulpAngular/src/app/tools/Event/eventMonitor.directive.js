

(function () {
    'use strict';
    angular.module('app.tool')
        .directive('eventMonitor', eventMonitor);
    eventMonitor.$inject = ['eventShedule', 'eventAction', 'eventViewAction', 'eventHelper'];
    function eventMonitor(eventShedule, eventAction, eventViewAction, eventHelper) {
        var directive = {
            scope: false,
            restrict: "A",
            require: "ngModel",
            link: eventMonitorLink
        }
        return directive;


        function eventMonitorLink(scope, element, attr, ngModel) {
            var sc = scope.sc = scope;
            var KeyCode = attr.eventMonitor.split('|')[0];
            var DomType = attr.eventMonitor.split('|')[1];
            var SubData = sc.vm.SubData;
            var DataStroage = sc.vm.DataStroage;
            var EventList = eventShedule.disPatch(sc.vm.EventConfigList, KeyCode, null);
            var boundary = EventList.length*10;//最多执行次数--边界
            var actionCount = 0;//执行次数
            var IsFirst = true;

            if (typeof sc.vm.HasActionCodes === 'undefined') {//检查父级别是否创建了HasActionCodes
                sc.vm.HasActionCodes = [];//执行了默认值事件的KeyCode集合
            }

            var formatterFunc = function (value) {//Model to View
                console.log("Model to View");
                if (IsFirst && sc.vm.HasActionCodes.indexOf(KeyCode) < 0) {//第一次执行Model to View
                    IsFirst = false;
                    sc.vm.HasActionCodes.push(KeyCode);
                    var currentIndex = 0;
                    eventPolling(value, EventList, SubData,currentIndex,boundary,actionCount,scope);
                }
                // console.log("Code:"+KeyCode+"控件类型:"+DomType+"值:"+value+"ngModel值"+ngModel.$modelValue);
                return value;
            }
            var parserFunc = function (value) {//View to Model
                console.log("View to Model");
                var currentIndex = 0;
                eventPolling(value, EventList, SubData,currentIndex,boundary,actionCount,scope);
                return value;
            }
            ngModel.$formatters.push(formatterFunc);
            ngModel.$parsers.push(parserFunc);
        }
        //事件轮询
        function eventPolling(value, EventList, SubData, currentIndex,boundary,actionCount,scope) {
            var extendParams = {
                Value: value
            }
            actionCount++;
            if(actionCount>boundary){//超过执行边界，存在死循环
                alert("事件配置存在指向指标项Code为["+EventList[currentIndex].MetricsItemCode+"]的循环配置");
            }
            if (currentIndex < EventList.length) {//未执行完
                var mItem = EventList[currentIndex];
                if (mItem.EventType != "SJYDZ" && mItem.EventType != "InitDZ") {
                    var eventPromise = eventAction.doEvent(mItem,SubData,scope.vm.CommonParams, extendParams);
                    eventViewAction.doView(eventPromise, SubData, scope).then(function () {
                        currentIndex++;
                        eventPolling(value, EventList, SubData, currentIndex,boundary,actionCount,scope);
                    });
                } else {
                    currentIndex++;
                }
            }else{//执行完
                actionCount =0;
            }
        }

        function eventValidate(domType, EventType) {
            var domTypeRule = {
                "Label": [],
                "TextBox": [],
                "TextArea": [],
                "DateTime": [],
                "DateWithTime": [],
                "Month": [],
                "Year": [],
                "ListTextBox": ["InitDZ", "JZYDZ", "SJYDZ", "SJZDZ"],
                "MutilSelect": [],
                "RadioBox": [],
                "ComboBox": [],
                "File": [],
                "RichText": [],
                "Image": []
            }
            return domTypeRule[domType].indexOf(EventType) > -1;
        }

    }
})();
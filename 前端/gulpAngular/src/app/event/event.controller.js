/**
 * Created by pengyun on 2017/5/8.
 *
 */


(function () {
    'use strict';
    angular.module('app.event')
        .controller('event', event);
    event.$inject = ['$scope', '$parse', 'eventConfig', 'eventAction', 'eventShedule', '$timeout', '$q'];
    function event($scope, $parse, eventConfig, eventAction, eventShedule, $timeout, $q) {
        var vm = this;
        vm.Name = "事件测试";
        //获取指标项配置
        vm.mStructConfig = {};
        vm.EventConfigList = {};
        vm.pageEventConfigList = [];
        vm.CommonParams = {
            StandardID: "df61ee9d-42cd-4138-8cb3-ae2728433054",
            NurseUnitID: "e83eb5a2-bacc-44b7-8765-ac2ee33bc76e",
            MCSID: ""
        }
        vm.SubData = [];
        vm.DataStroage = {};
        vm.IsLoad = false;

        vm.getData = function () {
            var defered = $q.defer();
            //请求事件结构
            var reqParams = {
                StandardID: "df61ee9d-42cd-4138-8cb3-ae2728433054"
            }
            eventConfig.GetMStructConfig(reqParams).then(function (msg) {
                if (msg.data.Flag == 1) {
                    vm.mStructConfig = msg.data.Output.Data;
                    vm.CommonParams.MCSID = msg.data.Output.Data.ID;
                    vm.EventConfigList = eventConfig.GetEventConfigList(vm.mStructConfig);
                }
            }).then(function () {
                //2.获取提交数据结构
                var treeReqParams = {
                    StandardID: "df61ee9d-42cd-4138-8cb3-ae2728433054"
                }
                eventAction.GetMetricsItemDataTree(treeReqParams).then(function (msg) {
                    if (msg.data.Flag == 1) {
                        vm.SubData = msg.data.Output.Data.ColData;
                    }
                }).then(function () {
                    //测试
                    vm.BLSJ_CYSJ = angular.element.grep(vm.SubData, function (item, index) {
                        return item.Code == 'BLSJ_CYSJ';
                    })[0];
                    console.log(vm.BLSJ_CYSJ);//常用事件

                    vm.BLSJ_SJLX = angular.element.grep(vm.SubData, function (item, index) {
                        return item.Code == 'BLSJ_SJLX';
                    })[0];
                    console.log(vm.BLSJ_SJLX);//事件类型

                    vm.BLSJ_SJMC = angular.element.grep(vm.SubData, function (item, index) {
                        return item.Code == 'BLSJ_SJMC';
                    })[0];
                    console.log(vm.BLSJ_SJMC);//事件名称

                    vm.BLSJ_ZYH = angular.element.grep(vm.SubData, function (item, index) {
                        return item.Code == 'BLSJ_ZYH';
                    })[0];
                    console.log(vm.BLSJ_ZYH);
                    defered.resolve(true);
                });
            });
            return defered.promise;
        }
        vm.InitPageEvent = function () {
            var defered = $q.defer();
            vm.pageEventConfigList = eventShedule.disPatch(vm.EventConfigList, "Page", null);//分发Page事件
            var funcList = [];
            angular.forEach(vm.pageEventConfigList, function (mItem, mIndex, arr) {
                funcList.push(eventAction.doEvent(mItem,vm.SubData,vm.CommonParams,null));
            });
            return $q.all(funcList);
        }
        //第一步先解决数据存储中数据源绑定问题
        function bindData() {
            angular.forEach(vm.pageEventConfigList, function (mItem, mIndex, arr) {
                switch (mItem.EventType) {
                    case "SJYDZ":
                        var datalist = [];
                        var targetCode = null;
                        angular.forEach(vm.DataStroage, function (item, index, arr) {
                            if (item.EventType == mItem.EventType
                                && item.MetricsItemCode == mItem.MetricsItemCode) {
                                for (var i = 0; i < item.ResultData.length; i++) {
                                    if (item.ResultData[i].MICode == mItem.MetricsItemCode) {
                                        targetCode = item.ResultData[i].MICode;
                                        datalist.push(item.ResultData[i]);
                                    }
                                }
                            }
                        });//根据事件类型、和源Code找到对应目标Code需绑定Source数据仓库对象
                        if (targetCode != null) {
                            eventAction.actionBindSJY(targetCode,vm.SubData, datalist);
                        }
                        break;
                }
            });
        }

        vm.getData().then(function (msg) {
            if (msg) {
                vm.InitPageEvent().then(function (promiseResultList) {
                    vm.DataStroage = promiseResultList;//页面加载完毕，页面事件获取到的数据集合
                    bindData();
                    vm.IsLoad = true;
                });
            }
        });

    }
})();
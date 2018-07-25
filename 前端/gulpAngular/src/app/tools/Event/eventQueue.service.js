/**
 * Created by pengyun on 2017/9/26.
 * 定义事件操作
 */

(function () {
    'use strict';

    angular.module('app.tool')
        .factory('eventQueue', eventQueue);
    eventQueue.$inject = ['appService', 'dataService', '$q'];
    function eventQueue(appService, dataService, $q) {
        var service = {
            createQueue: createQueue //创建队列
        };
        return service;

        function TaskQueue(Code) {
            this.List = [];//队列操作集合
            this.Code = Code;//队列地址--调度地址
            if (typeof TaskQueue.initialized == 'undefined') {
                TaskQueue.prototype.push = function (task) {
                    if (task == null) {
                        return false;
                    }
                    list.unshift(task);//队首插入
                    return true;
                }//入队
                TaskQueue.prototype.pop = function () {
                    return this.List.pop();
                }//取队列项 先入先出
                TaskQueue.prototype.size = function () {
                    return this.List.length;
                }
                TaskQueue.prototype.quere = function () {
                    return this.List;
                }//获取队列
            }
        }

        function createQueue(Code) {
            return new TaskQueue(Code);
        }


    }
})();

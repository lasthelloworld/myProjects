/**
 * Created by pengyun on 2017/9/26.
 * 事件帮助类 用于一些常用的公共方法
 */

(function () {
    'use strict';
    angular.module('app.tool')
        .factory('eventHelper', eventHelper);
    eventHelper.$inject = ['appService', 'dataService'];
    function eventHelper(appService, dataService) {
        var service = {
            findSubItem:findSubItem//根据Code查找提交对象
        }
        return service;
        
        function findSubItem(SubData,ColCode){
            var subItem = null;
            for(var sIndex=0;sIndex<SubData.length;sIndex++){
                if(SubData[sIndex].Code==ColCode){
                    subItem = SubData[sIndex];
                    break;
                }
            }
            return subItem;
        }

    }
})();
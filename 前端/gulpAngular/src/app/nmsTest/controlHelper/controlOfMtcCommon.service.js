/**
 * Created by pengyun on 2018/2/1
 * 控件基类及扩展类
 */

(function () {
    'use strict';
    angular.module("app.nmsTest")
        .factory("controlOfMtcCommon", controlOfMtcCommon);
    controlOfMtcCommon.$inject = [];
    function controlOfMtcCommon() {

        var service = {
            findControl: findControl
        }
        return service;

        function findControl(rowID,colID){
            var el = null;
            var searchRuleStr = [];
            searchRuleStr.push("*");
            if(rowID && rowID!=""){
                searchRuleStr.push("[rowid='"+rowID+"']");
            }
            if(colID && colID!=""){
                searchRuleStr.push("[colid='"+colID+"']");
            }
            el  = angular.element(searchRuleStr.join(""));
            el = (el.length>0)?el:null;
            return el;
        }

        /**
         * 根据SubData获取是按行对象|列对象生成控件   ---对应重构getControlType函数
         * @param {*} model  SubData[index]
         */
        function getRowOrColOfControl(model){
            console.log();
        }

        /** 
         * 取行/列默认值     --- 对应重构getValue函数
         * @param {*} rowOrCol 列|对应生成控件列的最后一个层级的行指标项 
         * @param {*} targetCode 目标列的指标项Code
         */
        function getRowOrColDefaultVal(rowOrCol,targetCode){
                console.log();
        }

    }

})();

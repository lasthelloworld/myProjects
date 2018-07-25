/**
 * Created by pengyun on 2018/2/1
 * 控件基类及扩展类
 */

(function () {
    'use strict';
    angular.module("app.nmsTest")
        .factory("controlValue", controlValue);
    controlValue.$inject = [];
    function controlValue() {

        var service = {
            getControlValue: getControlValue
        }
        return service;

        function getControlValue(ctrlModel){
            var el = ctrlModel.Element;
            var config = ctrlModel.Config;

            var value = null;
            switch (config.target.MType) {
                case "Label":
                    value = el.text();
                    break;
                case "TextBox":
                     value = el.val();
                    break;
                case "TextArea":
                    value = el.val();
                    break;
                case "ComboBox":
                      var option = el.find("option:selected");
                      value = {
                          ID:option.val(),
                          Value:option.text()
                      }
                    break;
                case "RadioBox":
                    var newSelector = el.selector+":checked";
                    var checkRadio = angular.element(newSelector);
                    value = {
                        ID:checkRadio.val(),
                        Value:checkRadio.attr("textValue")
                    }
                    break;
                case "CheckBox":
                    var newSelector = el.selector+":checked";
                    var checkList = angular.element(newSelector);
                    value = [];
                    checkList.each(function(index,item){
                        var domItem = angular.element(item);
                        value.push({
                            ID:domItem.val(),
                            Value:domItem.attr("textValue")
                        })
                    });
                    break;
                case "DateTime":
                    value = el.val();
                    break;
                case "DateWithTime":
                    value = el.val();
                    break;
                case "Month":
                    value = el.val();
                    break;
                case "Year":
                    value = el.val();
                    break;
                default:
                    value = el.text();
                    break;
            }
            return value;
        }
        function setControlBindModel(el){
            var config = el.data("Config");
            
        }
        
    }

})();

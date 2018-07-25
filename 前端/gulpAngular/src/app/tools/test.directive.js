

(function(){
        'use strict';
        angular.module('app.tool')
        .directive('test',test);
        test.$inject = [];
        function test(){
            var directive = {
                restrict:"EA",
                replace:true,
                transclude:true,
                scope:{
                    config:"="
                },
                templateUrl:getTemplateUrl,
                link:testLink
            }
            return directive;
            function getTemplateUrl(element,attr){
                return "app/tools/template/test.template.html";
            }
            function testLink(scope,element,attr){
                var sc = scope.sc = scope;
                sc.templateKey = attr.templateKey;
            }
        }
})();
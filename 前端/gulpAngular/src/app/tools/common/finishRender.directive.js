

(function () {
    'use strict';
    angular.module('app.tool')
        .directive('finishRender', finishRender);
    finishRender.$inject = ['$timeout', '$parse'];
    function finishRender($timeout, $parse) {
        var directive = {
            restrict: "A",
            link: finishRenderLink
        }
        return directive;

        function finishRenderLink(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('testFinished');
                });
            }
        }
    }
})();
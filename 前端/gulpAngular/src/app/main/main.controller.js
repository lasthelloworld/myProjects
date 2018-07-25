/**
 * Created by pengyun on 2017/5/8.
 *
 */


(function () {
    'use strict';
    angular.module('app.main')
        .controller('main', main);
    main.$inject = ['$scope', '$parse', '$timeout'];
    function main($scope, $parse, $timeout) {
        var vm = this;
        var $currentDigest  = angular.copy($scope.$digest);
        $scope.$digest = function(){}

        vm.SexList = [{
            ID: "001",
            Name: "男"
        }, {
            ID: "002",
            Name: "女"
        }]
        vm.SubData = {
            Name: "HelloWorld",
            SelectSex: vm.SexList[0],
            Age: 12
        }
        vm.templateKey = "A.html";
        vm.InitName = function () {
            setTimeout(function () {
                //  $scope.$apply(function () {
                vm.SubData.Name = "NMB";
                console.log("姓名已从HelloWorld变为" + vm.SubData.Name);
                //  }, 2000);
            }, 2000);
        }
        vm.InitName();

        $scope.$watchCollection("vm.SubData", function (newVal, oldVal) {
            if (oldVal === newVal) {
                console.log("第一次加载");
            } else {
                console.log("新值");
            }
        });
        angular.element("#addAge1").bind("click", function () {
            vm.SubData.Age++;
            console.log("实际年龄改变为" + vm.SubData.Age);
        });
        angular.element("#addAge2").bind("click", function () {
            //这句话表示把相应执行操作传递给angular context 开始执行$digest
            //$digest 操作是判断每个$watch值是否改变
            $scope.$apply(function () {//实现作用域树上的监控
                vm.SubData.Age++;
                console.log("准备进入$digest轮询触发$watch，触发更改view操作");
            });
        });
        angular.element("#addAge3").bind("click", function () {
            vm.SubData.Age++;
            $scope.$digest = function(){}
            $scope.$digest();//只执行当前域的监控，性能好但不安全，需确定好SubData提交范围
        });
        angular.element("#addAge4").bind("click",function(){
            vm.SubData.Age++;
            $scope.$digest = angular.copy($currentDigest);
            $scope.$digest();
        });
    }
})();
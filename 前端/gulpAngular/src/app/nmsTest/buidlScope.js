
function Scope() {
    this.$$watchers = [];//监听列表//私有变量，不应在外部调用
    Scope.prototype.$watch = function (watchFn, listenerFn,valueEq) {
        var watcher = {
            watchFn: watchFn,
            listenerFn: listenerFn,
            valueEq:!!valueEq
        }
        this.$$watchers.push(watcher);
    }//每个scope上都有$watch函数，watchFn是字符串|函数，一般是一个表达式例如:vm.FullName,listenerFn 监听函数 function(newVal,oldVal)
    Scope.prototype.$digest = function () {
        var dirty;
        var ttl = 10;
        do {
            dirty = this.$$digestOnce();//放弃不稳定的digest，两个监听互相改值，超过限定次数就放弃
            if(dirty && !(ttl--)){
                throw "10 digest iterations reached";
            }
        } while (dirty);
    };//$digest现在至少运行每个监听器一次了。如果第一次运行完，有监控值发生变更了，标记为dirty，所有监听器再运行第二次。这会一直运行，直到所有监控的值都不再变化，整个局面稳定下来了。
    Scope.prototype.$$digestOnce = function () {
        var self = this;
        var dirty;
        _.forEach(this.$$watchers, function (watch) {
            var newValue = watch.watchFn(self);
            var oldValue = watch.last;
            if (newValue !== oldValue) {
                watch.listenerFn(newValue, oldValue, self);
                dirty = true;
            }
            watch.last = newValue;
        });
        return dirty;
    };//循环遍历当前域监听列表,slef为当前域，传入进行比较，last记录上一次的值。
    /**
     * Angular作用域的重要性能特性：
     * (1)在作用域上添加数据本身并不会有性能折扣。如果没有监听器在监控某个属性，
     * 它在不在作用域上都无所谓。Angular并不会遍历作用域的属性，它遍历的是监听器。
     * (2)$digest里会调用每个监控函数，因此，最好关注监听器的数量，还有每个独立的监控函数或者表达式的性能。
     */
}

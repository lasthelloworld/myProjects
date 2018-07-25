



/** 
 * 观察者
 * @param {*} obj  观察目标对象
 * @param {*} vm  域对象
 */
function observe(obj, vm) {
    object.keys[obj].forEach(function (key) {
          defineReactive(vm,key,obj[key]);
    });
}

/**
 * 响应式数据绑定
 * @param {*} obj  对象
 * @param {*} key  对象属性名
 * @param {*} val  对象值
 */
function defineReactive(obj, key, val) {
    //创建主题
    var dep = new Dep();

    Object.defineProperty(obj, key, {
        get: function () {
            // 添加订阅者 watcher 到主题对象 Dep
            if (Dep.target) dep.addSub(Dep.target);
            return val
        },
        set: function (newVal) {
            if (newVal === val) return
            val = newVal;
            // 作为发布者发出通知
            dep.notify();
        }
    });
}


/**
 * 节点劫持
 * @desc 将挂载目标的所有子节点劫持（真的是劫持，通过 append 方法，DOM 中的节点会被自动删除）到DocumentFragment中
 *       经过一番处理后，再将 DocumentFragment 整体返回插入挂载目标。
 * @param {*} node 绑定数据的dom节点
 * @param {*} vm   vm域
 */
function nodeToFragment(node, vm) {
    var flag = document.createDocumentFragment();//创建文档片段，作为插入节点容器使用,DocumentFragment 处理节点，速度和性能远远优于直接操作 DOM
    var child;
    // 许多同学反应看不懂这一段，这里有必要解释一下
    // 首先，所有表达式必然会返回一个值，赋值表达式亦不例外
    // 理解了上面这一点，就能理解 while (child = node.firstChild) 这种用法
    // 其次，appendChild 方法有个隐蔽的地方，就是调用以后 child 会从原来 DOM 中移除
    // 所以，第二次循环时，node.firstChild 已经不再是之前的第一个子元素了
    while (child = node.firstChild) {
        compile(child, vm);
        flag.appendChild(child); // 将子节点劫持到文档片段中
    }

    return flag
}


/**
 * 数据初始化绑定
 * @param {*} node 
 * @param {*} vm 
 */
function compile(node, vm) {
    var reg = /\{\{(.*)\}\}/;
    // 节点类型为元素
    if (node.nodeType === 1) {
        var attr = node.attributes;
        // 解析属性
        for (var i = 0; i < attr.length; i++) {
            if (attr[i].nodeName == 'v-model') {
                var name = attr[i].nodeValue; // 获取 v-model 绑定的属性名
                node.addEventListener('input', function (e) {
                    // 给相应的 data 属性赋值，进而触发该属性的 set 方法
                    vm[name] = e.target.value;
                });
                node.value = vm[name]; // 将 data 的值赋给该 node
                node.removeAttribute('v-model');
            }
        };

        new Watcher(vm, node, name, 'input');
    }
    // 节点类型为 text
    if (node.nodeType === 3) {
        if (reg.test(node.nodeValue)) {
            var name = RegExp.$1; // 获取匹配到的字符串
            name = name.trim();

            new Watcher(vm, node, name, 'text');
        }
    }
}


function Watcher(vm, node, name, nodeType) {
    Dep.target = this;
    this.name = name;
    this.node = node;
    this.vm = vm;
    this.nodeType = nodeType;
    this.update();
    Dep.target = null;
    if (typeof Watcher.initialized == 'undefined') {
        Watcher.prototype = {
            update: function () {
                this.get();
                if (this.nodeType == 'text') {
                    this.node.nodeValue = this.value;
                }
                if (this.nodeType == 'input') {
                    this.node.value = this.value;
                }
            },// 获取 data 中的属性值
            get: function () {
                this.value = this.vm[this.name]; // 触发相应属性的 get
            }
        }
    }
}

/**
 * 一个主题对象
 */
function Dep() {
    this.subs = [];
    if (typeof Dep.initialized == 'undefined') {
        Dep.prototype = {
            addSub: function (sub) {
                this.subs.push(sub);
            },//订阅
            notify: function () {
                this.subs.forEach(function (sub) {
                    sub.update();
                });
            }//通知
        }
    }
}


function Vue(options){
    this.data = options.data;
    var data = this.data;
    observe(data,this);

    var id = options.el;
    var dom = nodeToFragment(document.getElementById(id),this);

    //劫持编译完成后，将dom返回指定dom中
    document.getElementById(id).appendChild(dom);
}

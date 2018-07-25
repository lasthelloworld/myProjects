/**
 * Created by pengyun on 2018/2/1
 * 控件基类及扩展类
 */

(function () {
    'use strict';
    angular.module("app.nmsTest")
        .factory("controlModel", controlModel);
    controlModel.$inject = ['controlValue', 'controlOfMtcCommon'];
    function controlModel(controlValue, controlOfMtcCommon) {
        function Extend(child, parent) {
            //1.方法继承（父类方法必须定义在原型上）
            var parentPro = beget(parent.prototype);//获取父类原型对象（包含原型中的方法，beget后不包含原型的属性）
            parentPro.constructor = child;
            child.prototype = parentPro;
        }
        //切掉了原型对象上多余的那份父类实例属性constructor
        function beget(obj) {
            var func = function () { }
            func.prototype = obj;
            return new func();
        }
        var service = {
            createModel: createModel
        }
        return service;

        function createModel(ctrlConfig) {
            var model = {};
            if (ctrlConfig.target == null) {
                ctrlConfig.target = ctrlConfig.StructData.Col;
            }
            switch (ctrlConfig.target.MType) {
                case "TextBox":
                    Extend(TextBoxModel, ctrlModel);
                    model = new TextBoxModel(ctrlConfig);
                    break;
                case "TextArea":
                    Extend(TextAreaModel, ctrlModel);
                    model = new TextAreaModel(ctrlConfig);
                    break;
                case "ComboBox":
                    Extend(ComboBoxModel, ctrlModel);
                    model = new ComboBoxModel(ctrlConfig);
                    break;
                case "RadioBox":
                    Extend(RadioBoxModel, ctrlModel);
                    model = new RadioBoxModel(ctrlConfig);
                    break;
                case "CheckBox":
                    Extend(CheckBoxModel, ctrlModel);
                    model = new CheckBoxModel(ctrlConfig);
                    break;
                case "DateTime":
                    Extend(DateTimeModel, ctrlModel);
                    model = new DateTimeModel(ctrlConfig);
                    break;
                case "DateWithTime":
                    Extend(DateWithTimeModel, ctrlModel);
                    model = new DateWithTimeModel(ctrlConfig);
                    break;
                case "Month":
                    Extend(MonthModel, ctrlModel);
                    model = new MonthModel(ctrlConfig);
                    break;
                case "Year":
                    Extend(YearModel, ctrlModel);
                    model = new YearModel(ctrlConfig);
                    break;
                default:
                    Extend(LabelModel, ctrlModel);
                    model = new LabelModel(ctrlConfig);
                    break;
            }
            return model;
        }
        function ctrlModel(ctrlConfig) {
            this.Element = null;//生成的元素
            this.Control = null;//生成的控件（控件所属于元素中，这里单独建立方便取）
            this.Config = formatConfig(ctrlConfig);
            if (typeof ctrlModel.initialized == 'undefined') {//基类可扩展可重写
                var that = this;
                ctrlModel.prototype.GetConfig = function () {
                    return this.Config;
                }
                ctrlModel.prototype.BindEvent = function(EventList){

                }
                ctrlModel.prototype.UpdateModelValue = function(){
                    updateModelValue(this);
                }
            }
            function formatConfig(ctrlConfig) {
                var StructData = ctrlConfig.StructData;//model
                var target = ctrlConfig.target;//target
                var RowCode = (StructData.Row && StructData.Row != null) ? StructData.Row.Code : '';
                var ColCode = (StructData.Col && StructData.Col != null) ? StructData.Col.Code : '';
                var RowID = (StructData.RowID && StructData.RowID != null) ? StructData.RowID : '';
                var ColID = (StructData.ColID && StructData.ColID != null) ? StructData.ColID : '';

                var IsEnabled = ctrlConfig.IsEnabled;
                var TargetMIID = ctrlConfig.TargetMIID;
                var value = (target.MINature == "1") ? StructData.MetricsExtVal : StructData.DefaultVal;

                //缺少判断数据类型
                if (target.MType == "RadioBox" || target.MType == "CheckBox" || target.MType == "ComboBox") {
                    value = StructData.MetricsExtVal;
                }

                var readOnly = false;
                if (IsEnabled == false) {
                    readOnly = true;
                } else {
                    readOnly = (StructData.ReadOnly == 1 || StructData.IsReadOnly) ? true : false;
                }
                return {
                    RowCode: RowCode,
                    ColCode: ColCode,
                    RowID: RowID,
                    ColID: ColID,
                    value: value,
                    IsOutData: StructData.IsOutData,
                    TargetMIID: TargetMIID,
                    StructData: ctrlConfig.StructData,
                    target: ctrlConfig.target,
                    readOnly: readOnly
                }
            }
            /**
             * 更新元素对应绑定对象的值
             * @param {*} that 
             */
            function updateModelValue(that) {
                var target = that.Config.target;
                var StructData = that.Config.StructData;
                var value = controlValue.getControlValue(that);//获取控件值（值类型|对象数组类型）
                if (target.MType == "RadioBox" || target.MType == "CheckBox" || target.MType == "ComboBox") {
                    StructData.MetricsExtVal = value;
                }else{
                    if(target.MINature == "1"){
                        StructData.MetricsExtVal = value;
                    }else{
                        StructData.DefaultVal = value;
                    }
                }
            }
        }


        function TextBoxModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof TextBoxModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var textBox = angular.element("<input type='text' >");

                textBox.attr("row", that.Config.RowCode)
                textBox.attr("col", that.Config.ColCode);
                textBox.attr("RowID", that.Config.RowID);
                textBox.attr("ColID", that.Config.ColID);

                if (that.Config.readOnly) textBox.attr("disabled", "disabled");
                textBox.val(that.Config.value);

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    textBox.addClass("ctlInput form-control");
                    tdDiv.append(textBox);
                    el = tdDiv;
                } else {
                    textBox.addClass("ctlInput print-control");
                    el = textBox;
                }
                that.Element = el;
                that.Control = textBox;
                return el;
            }
        }

        function TextAreaModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof TextAreaModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var textArea = angular.element("<textarea>");


                textArea.attr("row", that.Config.RowCode);
                textArea.attr("col", that.Config.ColCode);
                textArea.attr("RowID", that.Config.RowID);
                textArea.attr("ColID", that.Config.ColID);
                if (that.Config.readOnly) textArea.attr("disabled", "disabled");
                textArea.val(that.Config.value);

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    textArea.addClass("ctlTextarea form-control");
                    tdDiv.append(textArea);
                    el = tdDiv;
                } else {
                    textArea.addClass("ctlTextarea print-control");
                    el = textArea;
                }
                that.Element = el;
                that.Control = textArea;

                return el;
            }
        }

        function LabelModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof LabelModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null;
                var label = angular.element("<label>");


                label.attr("row", that.Config.RowCode);
                label.attr("col", that.Config.ColCode);
                label.attr("RowID", that.Config.RowID);
                label.attr("ColID", that.Config.ColID);

                label.text(that.Config.value);

                label.addClass("ctllabel");
                el = label;

                that.Element = el;
                that.Control = label;
                return el;
            }
        }

        function ComboBoxModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof ComboBoxModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var comboBox = angular.element("<select >");


                comboBox.attr("row", that.Config.RowCode)
                comboBox.attr("col", that.Config.ColCode);
                comboBox.attr("RowID", that.Config.RowID);
                comboBox.attr("ColID", that.Config.ColID);

                if (that.Config.readOnly) comboBox.attr("disabled", "disabled");

                for (var index = 0; index < that.Config.StructData.Value.length; index++) {
                    var item = that.Config.StructData.Value[index];
                    var option = angular.element("<option>");
                    option.val(item.ID);
                    option.text(item.Value);
                    comboBox.append(option);
                }
                comboBox.val(that.Config.value);

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    comboBox.addClass("ctlSelect form-control printShowSelect");
                    tdDiv.append(comboBox);
                    el = tdDiv;
                } else {
                    comboBox.addClass("ctlSelect print-control printShowSelect");
                    el = comboBox;
                }

                that.Element = el;
                that.Control = comboBox;
                return el;
            }
        }
        function RadioBoxModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            this.Control = [];
            if (typeof RadioBoxModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var radioListArea = angular.element("<div>");
                for (var index = 0; index < that.Config.StructData.Value.length; index++) {
                    var item = that.Config.StructData.Value[index];
                    var radioArea = angular.element("<div class='md-radio' style='float:left; margin-left:5px;margin-top: 3px;' >");

                    var radio = angular.element("<input type='radio'>");


                    var radioID = that.Config.RowID + "_" + that.Config.ColID + "_" + item.ID;
                    var radioName = that.Config.RowID + "_" + that.Config.ColID;
                    if (that.Config.readOnly) radio.attr("disabled", "disabled");
                    radio.attr("id", radioID);
                    radio.attr("row", that.Config.RowCode);
                    radio.attr("col", that.Config.ColCode);
                    radio.attr("RowID", that.Config.RowID);
                    radio.attr("ColID", that.Config.ColID);
                    radio.attr("name", radioName);


                    radio.addClass("md-radiobtn print-control");
                    radio.val(item.ID);
                    radio.attr("textValue", item.Value);//单选框文本值


                    var labelText = angular.element("<label>");
                    labelText.attr("for", radioID);
                    labelText.html("<span class='inc'></span><span class='check'></span><span class='box'></span>" + item.Value);

                    if (item.ID == that.Config.value) {//设置选中
                        radio.attr("checked", true);
                    } else {
                        radioArea.addClass("radioBoxIsNotCheck");
                        labelText.addClass("radioBoxIsCheck");
                    }


                    that.Control.push(radio);
                    radioArea.append(radio);
                    radioArea.append(labelText);
                    radioListArea.append(radioArea);

                }

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    tdDiv.append(radioListArea);
                    el = tdDiv;
                } else {
                    el = radioListArea;
                }

                that.Element = el;
                return el;
            }
        }
        function CheckBoxModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            this.Control = [];
            if (typeof CheckBoxModel.initialized == 'undefined') {
                var that = this;
                console.log("类初始化");
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var checkListArea = angular.element("<div>");
                for (var index = 0; index < that.Config.StructData.Value.length; index++) {
                    var item = that.Config.StructData.Value[index];
                    var valueIndex = that.Config.value.indexOf(item.ID);

                    var checkBoxArea = angular.element("<div class='md-checkbox has-success margin-left  flex-4' style='margin-left: 5px;margin-top: 3px;float: left;' >");
                    var checkItem = angular.element("<input type='checkbox'>");

                    var checkItemID = that.Config.RowCode + "_" + that.Config.ColCode + "_" + item.ID;
                    var checkBoxName = that.Config.RowID + "_" + that.Config.ColID;
                    if (that.Config.readOnly) checkItem.attr("disabled", "disabled");
                    checkItem.attr("id", checkItemID);
                    checkItem.attr("row", that.Config.RowCode);
                    checkItem.attr("col", that.Config.ColCode);
                    checkItem.attr("RowID", that.Config.RowID);
                    checkItem.attr("ColID", that.Config.ColID);
                    checkItem.attr("name", checkBoxName);

                    checkItem.addClass("md-check print-control");
                    checkItem.val(item.ID);
                    checkItem.attr("textValue", item.Value);//复选框文本值


                    var labelText = angular.element("<label>");
                    labelText.attr("for", checkItemID);
                    labelText.html("<span></span><span class='check'></span> <span class='box'></span>" + item.Value);

                    if (item.ID == that.Config.value) {//设置选中
                        checkItem.attr("checked", true);
                    } else {
                        checkBoxArea.addClass("checkBoxIsNotCheck");
                        labelText.addClass("checkBoxIsCheck");
                    }

                    that.Control.push(checkItem);
                    checkBoxArea.append(checkItem);
                    checkBoxArea.append(labelText);
                    checkListArea.append(checkBoxArea);
                }

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    tdDiv.append(checkListArea);
                    el = tdDiv;
                } else {
                    el = checkListArea;
                }

                that.Element = el;
                return el;
            }
        }
        function DateTimeModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof DateTimeModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var dateTimeInput = angular.element("<input type='text' >");

                dateTimeInput.attr("row", that.Config.RowCode);
                dateTimeInput.attr("col", that.Config.ColCode);
                dateTimeInput.attr("RowID", that.Config.RowID);
                dateTimeInput.attr("ColID", that.Config.ColID);

                if (that.Config.readOnly) dateTimeInput.attr("disabled", "disabled");
                dateTimeInput.val(that.Config.value);

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    dateTimeInput.addClass("ctlInput form-control");
                    tdDiv.append(dateTimeInput);
                    el = tdDiv;
                } else {
                    dateTimeInput.addClass("ctlInput print-control");
                    el = dateTimeInput;
                }

                that.Element = el;
                that.Control = dateTimeInput;
                return el;
            }
        }
        function DateWithTimeModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof DateWithTimeModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var dwtInput = angular.element("<input type='text' >");
                dwtInput.attr("row", that.Config.RowCode)
                dwtInput.attr("col", that.Config.ColCode);
                dwtInput.attr("RowID", that.Config.RowID);
                dwtInput.attr("ColID", that.Config.ColID);


                if (that.Config.readOnly) dwtInput.attr("disabled", "disabled");
                dwtInput.val(that.Config.value);

                if (that.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    dwtInput.addClass("ctlInput form-control");
                    tdDiv.append(dwtInput);
                    el = tdDiv;
                } else {
                    dwtInput.addClass("ctlInput print-control");
                    el = dwtInput;
                }

                that.Element = el;
                that.Control = dwtInput;
                return el;
            }
        }

        function MonthModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof MonthModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var monthInput = angular.element("<input type='text' >");
                monthInput.attr("row", this.Config.RowCode)
                monthInput.attr("col", this.Config.ColCode);
                monthInput.attr("RowID", this.Config.RowID)
                monthInput.attr("ColID", this.Config.ColID);

                if (this.Config.readOnly) monthInput.attr("disabled", "disabled");
                monthInput.val(this.Config.value);

                if (this.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    monthInput.addClass("ctlInput form-control");
                    tdDiv.append(monthInput);
                    el = tdDiv;
                } else {
                    monthInput.addClass("ctlInput print-control");
                    el = monthInput;
                }

                this.Element = el;
                this.Control = monthInput;
                return el;
            }
        }
        function YearModel(ctrlConfig) {
            ctrlModel.apply(this, arguments);
            if (typeof YearModel.initialized == 'undefined') {
                var that = this;
                createDocument(that);
            }
            function createDocument(that) {
                var el = null, tdDiv = null;
                var yearInput = angular.element("<input type='text' >");
                yearInput.attr("row", this.Config.RowCode)
                yearInput.attr("col", this.Config.ColCode);
                yearInput.attr("RowID", this.Config.RowID)
                yearInput.attr("ColID", this.Config.ColID);

                if (this.Config.readOnly) yearInput.attr("disabled", "disabled");
                yearInput.val(this.Config.value);

                if (this.Config.IsOutData) {
                    tdDiv = angular.element("<div class='tdleft'>");
                    yearInput.addClass("ctlInput form-control");
                    tdDiv.append(yearInput);
                    el = tdDiv;
                } else {
                    yearInput.addClass("ctlInput print-control");
                    el = yearInput;
                }

                this.Element = el;
                this.Control = yearInput;
                return el;
            }
        }
    }

})();

var InDConsole = function() {
    this.cssStyle = {
        'console': "position: absolute;opacity: 0.7;z-index: 9999;",
        'header-expand': "color: #ffffff;cursor: pointer;font-size: x-large;",
        'expand': "color: #333333;cursor: pointer;",
        'expand-triangle': "color: #666666;",
        'text': "color: #333333;",
        'name': "color: #990099;",
        'string': "color: #CC0033;",
        'number': "color: #3300CC;",
        'boolean': "color: #3300CC;",
        'null': "color: #3300CC;",
        'undefined': "color: #333333;",
        'object': "border-bottom: 1px solid #ddd;padding-top: 5px;padding-bottom: 5px;"
    };
    this.settings = {
        width: 500,
        headerHeight: 28,
        bodyHeight: 600,
        headerBKColor: '#666666',
        bodyBKColor: '#eeeeee',
        fontSize: '16px'
    };
    this.header = null;
    this.main = null;
    this.logContainer = null;
    this.moving = false;
};

// 初始化
InDConsole.prototype.init = function(settings) {
    settings = settings || {};
    // 保存设置
    this.settings.width = settings.width || this.settings.width;
    this.settings.headerHeight = settings.headerHeight || this.settings.headerHeight;
    this.settings.bodyHeight = settings.bodyHeight || this.settings.bodyHeight;
    this.settings.headerBKColor = settings.headerBKColor || this.settings.headerBKColor;
    this.settings.bodyBKColor = settings.bodyBKColor || this.settings.bodyBKColor;
    this.settings.fontSize = settings.fontSize || this.settings.fontSize;

    // 创建样式
    var headerStyle = 'width:' + parseInt(this.settings.width) + 'px;' +
        'height:' + parseInt(this.settings.headerHeight) + 'px;' +
        'background-color:' + this.settings.headerBKColor + ';';
    var bodyStyle = 'width:' + parseInt(this.settings.width) + 'px;' +
        'height:' + parseInt(this.settings.bodyHeight) + 'px;' +
        'background-color:' + this.settings.bodyBKColor + ';' +
        'overflow:auto;';
    // 添加主元素
    var cssStyle = this.cssStyle;
    document.body.innerHTML += '<div style="' + cssStyle['console'] + 'font-size:' + this.settings.fontSize + ';" class="InDConsole-main"><div style="' + headerStyle + '" class="InDConsole-header"><span  style="' + cssStyle['header-expand'] + '">▼</span></div><div style="' + bodyStyle + '" class="InDConsole-container"></div></div>';
    this.main = document.getElementsByClassName('InDConsole-main')[0];
    this.logContainer = document.getElementsByClassName('InDConsole-container')[0];
    this.header = document.getElementsByClassName('InDConsole-header')[0];
    var main = this.main;
    var header = this.header;

    // 隐藏/显示区域
    header.firstElementChild.onclick = function(e) {
        var object = header.firstElementChild;
        var title = object.textContent.replace(/(^\s*)|(\s*$)/g, "");
        if(title.indexOf('▼') == 0) {
            object.innerHTML = object.innerHTML.replace(/▼/, '▶');
            main.lastElementChild.style.display = 'none';
        } else {

            object.innerHTML = object.innerHTML.replace(/▶/, '▼');
            main.lastElementChild.style.display = 'block';
        }
    };
};

// 打印
InDConsole.prototype.log = function(object) {
    if(this.logContainer) {
        this.addNode(this.logContainer, null, object);
    } else {
        // 未初始化
        console.log("未初始化");
    }
};

// 添加节点
InDConsole.prototype.addNode = function(parent, name, object) {
    var cssStyle = this.cssStyle;
    parent.innerHTML += '<div style="' + cssStyle['object'] + '"></div>';

    if(typeof object === 'object') {
        this.addNodeObject(parent.lastElementChild, name, object);
    } else {
        this.addNodeBase(parent.lastElementChild, name, object);
    }
};

// 添加基础节点。一个基础node由3部分组成：展开箭头，name和value。若不需要某一部分，传null即可
InDConsole.prototype.addNodeBase = function(parent, name, value) {
    if(typeof value === "function") {
        var r = this.addNodeEmpty(parent, true);
        var rsInfo = this.getSpan(name, value, true, false);
        this.insallSpan(r.infoNode, rsInfo);
        var rsChild = this.getSpan(null, value.toString(), false, false, {
            enableQuotationMark: false
        });
        this.addNodeBase(r.childNode, null, rsChild.titleSpan);
    } else {
        var r = this.addNodeEmpty(parent, false);
        var rs = this.getSpan(name, value, false, false);
        this.insallSpan(r.infoNode, rs);
    }
};

// 添加一个空内容节点
InDConsole.prototype.addNodeEmpty = function(parent, enableExpand) {
    var innerHTML = '';
    var cssStyle = this.cssStyle;
    // 允许展开，添加展开按钮
    if(enableExpand) {
        innerHTML = '<div style="' + cssStyle['expand'] + '" onclick="document.doExpand(this)"></div><div style="display:none;"></div>';
    }
    parent.innerHTML += '<div style="margin-left: 20px">' + innerHTML + '</div>';

    var r = {
        infoNode: null,
        childNode: null
    };
    if(enableExpand) {
        r.infoNode = parent.lastElementChild.firstElementChild;
        r.childNode = parent.lastElementChild.lastElementChild;
    } else {
        r.infoNode = parent.lastElementChild;
    }
    return r;
};

// 根据node的属性获取内容span
InDConsole.prototype.getSpan = function(name, value, enableExpand, enableOmit, customStyle) {
    var rs = {
        expandSpan: null,
        nameSpan: null,
        titleSpan: null
    };

    customStyle = customStyle || {};
    var cssStyle = this.cssStyle;
    if(enableExpand) {
        rs.expandSpan = '<span style="' + cssStyle['expand-triangle'] + '">▶ </span>';
    }
    if(name) {
        if(customStyle.nameStyle) {
            rs.nameSpan = '<span style="' + cssStyle[customStyle.nameStyle] + '">' + name + '</span>';
        } else {
            rs.nameSpan = '<span style="' + cssStyle.name + '">' + name + '</span>';
        }
    }

    var type = null;
    if(value === null) type = value = 'null';
    if(value === undefined) type = value = 'undefined';
    if(!type) type = typeof(value);
    if(type === 'function') {
        var strF = value.toString();
        var param = strF.substring(strF.indexOf('(') + 1, strF.indexOf(')'));
        rs.titleSpan = '<span><i style="color:blue;">f</i> (' + param + ')</span>';
    } else {
        if(enableOmit) {
            value = '' + value;
            if(value.length > 20) value = value.substring(0, 20) + '...';
        }

        var destStyle = (customStyle.titleStyle) ? customStyle.titleStyle : type;
        if(name) {
            // 对于有name属性的可展开节点，展开时，允许隐藏title
            rs.titleSpan = '<span class="enable-hide" style="' + cssStyle[destStyle] + '">' + value + '</span>';
        } else {
            rs.titleSpan = '<span style="' + cssStyle[destStyle] + '">' + value + '</span>';
        }

        // 是否添加引号
        if(customStyle.enableQuotationMark != undefined) {
            if(customStyle.enableQuotationMark) {
                rs.titleSpan = '\"' + rs.titleSpan + '\"';
            }
        } else {
            if(type === 'string') {
                rs.titleSpan = '\"' + rs.titleSpan + '\"';
            }
        }
    }

    return rs;
};

// 为一个节点添加内容
InDConsole.prototype.insallSpan = function(parent, rs) {
    var innerHTML = '';
    if(rs.expandSpan) innerHTML += rs.expandSpan;
    if(rs.nameSpan) innerHTML += rs.nameSpan;
    if(rs.nameSpan && rs.titleSpan) innerHTML += " : ";
    if(rs.titleSpan) innerHTML += rs.titleSpan;

    parent.innerHTML = innerHTML;
};

// 添加Object节点。Object节点前可能有name，也可能没有
InDConsole.prototype.addNodeObject = function(parent, name, object) {
    if(object === null) {
        // 若Object为null，则直接添加一个null节点
        return this.addNodeBase(parent, name, object);
    }

    // Object不为null，则添加一个带有expand的节点作为Object节点，然后填充内容
    var r = this.addNodeEmpty(parent, true);
    var title = this.getObjectTitle(name, object);
    var rs = this.getSpan(name, title, true, false, {
        titleStyle: 'text',
        enableQuotationMark: false
    });
    this.insallSpan(r.infoNode, rs);

    var child = r.childNode;
    for(var attr in object) {
        var cObject = object[attr];
        if(typeof cObject === 'object') {
            this.addNodeObject(child, attr, cObject);
        } else {
            this.addNodeBase(child, attr, cObject);
        }
    }
};

// 获取object的title
InDConsole.prototype.getObjectTitle = function(name, object) {
    var title = '{';
    for(var attr in object) {
        if(title.length > 256) {
            title += "..., ";
            break;
        }

        var cObject = object[attr];
        var type = typeof cObject;
        if(type === 'object') {
            title += attr + ' : {...}, ';
        } else if(type === 'function') {
            var rs = this.getSpan(attr, cObject, true, false, {
                nameStyle: 'text'
            });
            title += rs.nameSpan + " : " + rs.titleSpan + ", ";
        } else {
            var rs = this.getSpan(attr, cObject, false, true, {
                nameStyle: 'text'
            });
            title += rs.nameSpan + " : " + rs.titleSpan + ", ";
        }
    }
    // 这里要删除title最后一个，号及一个空格，共2个字符
    title = title.substring(0, title.length - 2) + '}';
    return title;
};

// 展开/收起
document.doExpand = function(object) {
    var title = object.textContent.replace(/(^\s*)|(\s*$)/g, "");
    if(title.indexOf('▼') == 0) {
        object.innerHTML = object.innerHTML.replace(/▼/, '▶');
        object.parentNode.lastElementChild.style.display = 'none';
        // 对于允许隐藏title的，展开时将title隐藏，收起时将title显示
        var es = object.getElementsByClassName("enable-hide");
        if(es.length > 0) {
            es[0].style.display = '';
        }
    } else {
        object.innerHTML = object.innerHTML.replace(/▶/, '▼');
        object.parentNode.lastElementChild.style.display = 'block';
        // 对于允许隐藏title的，展开时将title隐藏，收起时将title显示
        var es = object.getElementsByClassName("enable-hide");
        if(es.length > 0) {
            es[0].style.display = 'none';
        }
    }
};

// 安装web端拖动
InDConsole.prototype.installWebDrag = function() {
    // 拖动
    var that = this;
    var main = this.main;
    var header = this.header;
    header.onmousedown = function(e) {
        that.offsetX = that.main.offsetLeft - e.clientX;
        that.offsetY = that.main.offsetTop - e.clientY;

        that.moving = true;
    };
    header.onmouseup = function(e) {
        that.moving = false;
    };
    document.onmousemove = function(e) {
        if(that.moving) {
            main.style.left = that.offsetX + e.clientX + 'px';
            main.style.top = that.offsetY + e.clientY + 'px';
        }
    };
};

// 安装拖动功能
InDConsole.prototype.installDrag = function() {
	this.installWebDrag();
	//this.installAppDrag();
};

InDConsole.prototype.moveTo = function(x, y) {
    this.main.style.left = x + 'px';
    this.main.style.top = y + 'px';
};

// Vue将下面export放开
//export var InDConsole = new InDConsole();

// 说明
/***
 导入
 1.常规web：
 引入InDConsole.js，然后new对象：
 var InDConsole = new InDConsole();
 初始化：
 InDConsole.init({
	width: 500,
	headerHeight: 30,
	bodyHeight: 600,
	headerBKColor: '#666666',
	bodyBKColor: '#eeeeee',
	fontSize: '16px'
});
安装拖动功能：
InDConsole.installWebDrag();
 2.Vue: 放开本js代码末尾关于Vue的一行，然后导入：
 import { InDConsole } from './InDConsole'
 初始化：
 export default {
	mounted() {
		InDConsole.init({
			width: 500,
			headerHeight: 30,
			bodyHeight: 600,
			headerBKColor: '#666666',
			bodyBKColor: '#eeeeee',
			fontSize: '16px'
		});
	}
}

 使用
 InDConsole.log(object);
 // 拖动功能只有PC端可用。移动端无法使用
 ***/
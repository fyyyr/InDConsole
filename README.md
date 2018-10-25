# InDConsole
使用js实现的一个独立的仿控制台打印功能。在页面中内嵌了一个打印区域，可像浏览器控制台一样对任意对象进行打印。在不方便调用浏览器控制台的场景下，例如移动端，可以为调试提供许多便利。
## 特性
1.像浏览器控制台一样，直接打印对象。不同对象有对应的打印效果。  
2.大小，背景色，字体等可进行定制。  
3.可将打印区展开/收起。  
4.PC端可进行拖动。移动端会自动嵌入到页面最下方。  
5.使用原生js实现，不依赖任何第三方库。其中使用了document对象，所以如微信小程序这样删除掉document对象的js框架无法使用。  
## 效果
![](https://github.com/fyyyr/InDConsole/blob/master/InDConsole/InDConsole.png?raw=true)
## 说明
### 导入
#### 常规web页面导入
1.引入InDConsole.js，然后new对象：
```
var InDConsole = new InDConsole();
```
2.初始化：
```
 InDConsole.init({
	width: 500,
	headerHeight: 30,
	bodyHeight: 600,
	headerBKColor: '#666666',
	bodyBKColor: '#eeeeee',
	fontSize: '16px'
});
```
3.安装拖动功能：
```
InDConsole.installWebDrag();
```
#### Vue页面导入
1.放开本js代码末尾关于Vue的一行，然后导入：
```
import { InDConsole } from './InDConsole'
```
2.初始化：
```
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
```
### 使用
```
InDConsole.log(object);
```
### 其他
拖动功能只有PC端可用。移动端无法使用。

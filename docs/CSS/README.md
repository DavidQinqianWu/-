# CSS

:::tip
这里是关于 CSS 类型的面试题还有各种样式的基本实现, 我会给上效果图和代码
:::

## 响应式布局的常用解决方案是什么?

[响应式常用解决方案](https://github.com/forthealllight/blog/issues/13) <!-- 跳转到根部的 README.md -->

```js
(function flexible(window, document) {
	var docEl = document.documentElement;
	// 获得分辨率和物理尺寸像素比
	var dpr = window.devicePixelRatio || 1;

	// adjust body font size
	function setBodyFontSize() {
		if (document.body) {
			document.body.style.fontSize = 12 * dpr + "px";
		} else {
			document.addEventListener("DOMContentLoaded", setBodyFontSize);
		}
	}
	// 矫正
	setBodyFontSize();

	// set 1rem = viewWidth / 10
	function setRemUnit() {
		// 这里可以根据设计的稿子来进行调整,
		// 如果设计稿是 1336px, 我们可以设置为 13.36,
		// 这样设计稿中的所有 px 都除以 100 就可以
		var rem = docEl.clientWidth / 13.36;
		docEl.style.fontSize = rem + "px";
		console.log(rem);
	}

	setRemUnit();

	// reset rem unit on page resize
	window.addEventListener("resize", setRemUnit);
	window.addEventListener("pageshow", function(e) {
		if (e.persisted) {
			setRemUnit();
		}
	});

	// detect 0.5px supports
	if (dpr >= 2) {
		var fakeBody = document.createElement("body");
		var testElement = document.createElement("div");
		testElement.style.border = ".5px solid transparent";
		fakeBody.appendChild(testElement);
		docEl.appendChild(fakeBody);
		if (testElement.offsetHeight === 1) {
			docEl.classList.add("hairlines");
		}
		docEl.removeChild(fakeBody);
	}
})(window, document);
```

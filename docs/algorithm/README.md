# 算法

## 1. 随机打乱数组

> 输入一个数组,随机打乱他们的顺序

```js
function randomArray(arrayInput) {
	let result = [];

	return result;
}
```

## 2. 各种排序

### 选择排序

核心思想: 数组从头到尾遍历, 每一次遍历找出当前位置的最小的,然后交换. 第一次遍历, 找出第最小的, 然后和第 0 位置的元素交换. 第二次遍历, 找出最小的, 跟第 1 位置的 元素进行交换

![选择排序](./img/selectSort.gif)

```js
function selectSort(array) {
	for (let i = 0; i < array.length - 1; i++) {
		// 每次记录下最小的 index 值
		let minItemRecorder = i;
		for (let j = i + 1; j < array.length; j++) {
			if (array[minItemRecorder] > array[j]) {
				minItemRecorder = j;
			}
			if (j === array.length - 1) {
				let temp = array[i];
				array[i] = array[minItemRecorder];
				array[minItemRecorder] = temp;
			}
		}
	}
	console.log(array);
}
selectSort([2, 5, 4, 3, 8, 6, 4]);
```

### 冒泡排序

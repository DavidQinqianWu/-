# 数据结构与算法

## 常见算法

### 输入一个数组,随机打乱并输出

> 核心思路就是我们在排列的时候, 我们从原来的数组中随机抽取该位置上的数组

```js
function randomArray(arrayInput) {
	for (let i = 0; i < arrayInput.length; i++) {
		// 从原来的数组中随机挑取
		let index = parseInt(Math.radom() * (arrayInput.length - 1));
		let tempValue = arrayInput[i];
		// 把数组随机位置上的元素给跳出来, 然后把第 i 的先给拿出来
		arrayInput[i] = arrayInput[index];
		// 调换位置
		arrayInput[index] = tempValue;
	}
	return arrayInput;
}
let newArray = randomArray([1, 2, 3, 4, 5]);
```

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

## 数据结构

### 链表

1. 链表的插入和删除还有更新都是 `O(1)`, 指的是当我们已经知道前驱节点之后, 我们要删除前驱节点指向的下一个节点的, 这个时候才是 `O(1)`.

   > void remove(Node *list, Node *previousNodeToBeDeleted), 这个时候才是 O(1)

2. 如果用链表让我们去删除整个数据中的的指定的那个节点, 那就是应该 `O(n)`.

   > void remove(Node* list, Node *pNodeToBeDeleted)

### 数组

1. 数组中按照下表去随机访问的时间复杂度是 `O(1)`,

2. 添加删除都是 `O(n)`

## 非常规算法

### 字符串 KMP 算法

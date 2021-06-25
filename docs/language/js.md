# js

## 基本类型

### Number类

> Number 类是包括`整型数据`和`浮点型数据`

1. 八进制: 如果要表示一个 8 进制,那么必须 0 开头, 然后判断每一位的数值是不是 0-7之间的, 如果没有那么就是按照 八进制处理, 否则就是破坏规则,按照 10 进制处理

2. 16 进制: 前两位必须是 0x 开头, 其他位置需要是(0-9, a-f, A-F) 否则抛出异常
3. js 中有三种方式完成数值转换, `parseInt()`, `parseFloat()`, `Number()`
    * `Number()`:
        1. 如果是数字则按照对应进制数据格式, **统一**转换为十进制,并返回;

        ```js
            Number(10) // 10
            Number(010) // 8, 二进制位 010 就是十进制的 8
            Number(0x10) // 16

        ```

        2. 如果是 `boolean`类型, `true` 为 1, `false`为 0;
        3. 如果是 `null` 返回 0
        4. 如果是 `undefined` 返回 `Nan`;
        5. 如果是字符串, 则:
            * 如果只包含数字, 那么会直接转成 十进制 如果前面有 0 则会忽略
            * 如果是有效的浮点类型, 那么转换成对应的附点类型

            ```js
                Number('0.12') // 0.12
                Number('00.012') //0.012 
            ```

            * 如果是 16 进制, 则会转换为对应的 10 进制

            ```js
            Number('0x12') // 18
            Number('0x21') // 33
            ```

#### parseInt()

`parseInt()` 最好给出指定的 进制数给我们
eg: 经典案例

```js

var arr =['1','2','3','4'];
var result = arr.map(parseInt);

// 得到的结果是: [1, NaN, NaN, NaN];
// 相当于 
arr.map(function(ite, index) {
    return parseInt(ite, index);
})

parseInt('1', 0); //1 以0 为基数的, 都会返回本身
parseInt('2', 1); // 基数都只能为 2-36 位的
parseInt('3', 2); // 3 超出了 2 进制范围
parseInt('4', 3); // 4 超出了 3 进制范围
```

#### parseFloat()

`parseFloat()`没有进制的概念, 一律按照普通 10 进制去计算

### String 类型

1. `String()`, '' 和 `new String(xx)`的区别
前两者都是会转成基本字符本身, 而 new String(xx) 则会转成对象
2. string 类型常见的算法

* 字符串逆序:

```js
function reverseString(str) {
    return str.split('').reverse().join('');
}

function reverseString2(str){
    let result ='';
    for(let i=str.length-1; i>=0; i--){
        result += str.charAt(i);
    }
    return result;
}




```

## 正则表达式

> 不会正则表达式不是一个好的软件工程师, 让我们来搞定他们把

### 元字符

* `.`匹配除了换行符以外的任意字符(包括空格)
* `\s`匹配任意的空白字符串
* `\d`匹配数字
* `\b`匹配单词的开始和结束

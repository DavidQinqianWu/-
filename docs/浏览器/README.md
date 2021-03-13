# 浏览器

## cookie, session, webStorage(localStorage, sessionStorage)

- Cookie：一种网页存储技术, 与 webStorage 想对应

  1. cookie 数据始终在同源的 http 请求中携带, 而 session 和 localStorage 则不会
  2. cookie 是有生命期的, 在生命期内, 即使关闭浏览器也有效,不会丢失,若没有设置生命期, 则关闭窗口 cookie 就消失了, 里面的东西也就没有了.
  3. 所有同源窗口共享 cookie 存储的 token 信息
  4. 来源于服务器端, 以文本的形式保存在客户端, 可以与服务器交互, 不能存超过 4kb 的信息.
     在请求报文中, set-cookie 字段, 之后 客户端请求都会在 http 协议的头文件中设置 cookie 字段
  5. cookie 有路径区分概念, 不同的路径, cookie 都是不一样的, cookie 里面记录的东西也就不一样

```js
//  用 cookie 给记录下来
document.cookie = "age = 18";
// 这样我们就能把一个 name 为 username, value 为 XX 的值给记录下来,
```

![cookie](./img/cookie.png)

- session:

  1. session 保存在服务器端, HashTable 形式来存储, 没有大小限制
  2. 服务器发根据自己的 session 检查 是否有这个 sessionId, 如果没有就给客户端一个 sessionId

- 知识点串联: 登录系统
  ::: tip
  当我们登录的时候, 服务器会检查我们的请求中是否有 sessionId(客户端以 cookie 形式保存), 如果在服务器端中的 session 列表中没有,那么就会让我们 输入账号密码, 如果正确给客户端一个 sessionId, 同时服务器会记录下这个 sessionId 在自己的 session 中. 而此时客户端会以次 sessionId 以 cookie 的形式记录下来. 下次登录的时候, 直接请求带上这个 sessionId, 这样客户端检查 sessionId 是在自己的 session 中的,然后就不需要让客户端输入账号密码了, 因为之前已经做过校验了, 直接返回该 sessionId 对应的 session 对象
  :::
  ::: warning
  如果客户端不支持使用 cookie 的话, 那么我们就需要在 url 请求中用 url + sessionId (url 拼接的形式)来请求了, 相当于把参数加到 url 后面
  例子: www.baidu.com/?sessionId=XNEIG123
  :::

::: tip
`WebStorage = localStorage + sessionStorage` 组成, 是针对 cookie 的劣势而在 HTML5 中做的优化,
现在有很多的浏览器主要是把我们的 `sessionId` 不在存入 cookie 中,而是存入到 webStorage 当中
:::

- localStorage:

  1. 始终有效, 即使浏览器关闭也有效
  2. 所有同源窗口共享
  3. 不是与服务器交互的
  4. js 做的本地化存储
  5. 字符串类型, 可以 `JSON.stringify()`

- sessionStorage:

  1. 将数据保存在 session 对象中,这里的 session 就是值用户在浏览某个网站的时候, 进入到这个网站到 X 掉这个页面,
     即使刷新或者进入另一个同源页面, 也不会消失,因为这都算是一个 session 内
  2. 数据是临时的保存
  3. 不与服务器进行交互通信
  4. 字符串类型, 可以 `JSON.stringify()`

  ::: warning
  WkWebview 和 android 的 webview 也是可以做本地化储存的,但是会有几点问题

  1. 不要用 Local Storage 来做持久化存储，在 iOS 中，出现存储空间紧张时，它会被系统清理掉；
  2. 不要用 Local Storage 来存大量数据，它的读写效率很低下，因为它需要序列化/反序列化, 可能还没有网络请求来的快；
  3. 大小限制为 5M
     :::

## DNS 解析

a）首先会搜索浏览器自身的 DNS 缓存（缓存时间比较短，大概只有 1 分钟，且只能容纳 1000 条缓存）

b）如果浏览器自身的缓存里面没有找到，那么浏览器会搜索系统自身的 DNS 缓存

c）如果还没有找到，那么尝试从 hosts 文件里面去找

d）在前面三个过程都没获取到的情况下，就递归地去域名服务器去查找，具体过程如下

![dns域名解析](./img/5rxqugj8dh.png)

## 浏览器跨域问题

## 浏览器工作原理

1. 拿到请求的 html 文件
2. 解析 html, 同时如果有引用, 就那么就去下载我们的引用(js 文件, css 文件)
3. 生成 html DOM 树, 生成 CSS 渲染树
4. 结合 两个树生成一个 html 树
5. 计算位置和尺寸(重绘)
6. 渲染呈现界面 (重排)

![浏览器工作流程](./img/exploer.png)

## 重绘与重排

1. 先发重排, 在发生重绘
2. 重绘是例如 background 的改变等等, 而重排则是发生 dom 节点, 或者 size 等物理尺寸发生变化, 浏览不得不重新计算该元素的位置

## 浏览器的缓存

> 次针对的的是 响应头文件, 服务器响应客户端的请求,理论上来说这个是双向的, 响应报文和请求报文都会有

1. 强缓存

   - 当我们建立连接的时候, 浏览器会看响应请求的缓存时间, 如果响应请求的字段`Expires`没有过期. 那么`客户端第二次请求`的时候(例如刷新), 就不用再发发请求到服务器去拿资源, 就是强缓存.

   - `Expires 是一个绝对时间`, 这样当我们的系统时间被改变之后, 我们的会出现缓存混乱的情况

   - `cache-control:max-age 3600` 是一个相对时间, 例如,在这次请求的之内的 3600 秒, 都是可以使用缓存的. 他用来弥补 `Expires`的不足

   - 可以大大减少服务器的压力

2. 协商缓存

- 当我们的浏览器发现这次的请求过了缓存时间(此时浏览器认为该缓存不能用了), 那么浏览器就会问服务器拿资源,让服务器去帮忙判断是否可以用缓存, 于是服务器一看没有更新,就让浏览器还是取用缓存,(表现形式是没有返回响应, 或者 304)
- last-modify / if-modify-since, 是服务器给浏览器告诉浏览器自己这边缓存的时间期限, 第一次请求返回的是 last-modify, 下一次响应报文则是`if-modify-since`, 精确到 s
- 因为 last- modify 和 if-modify-since 是依靠的是绝对时间, 因此缠身了 ETag, 类似于 git 的版本号, ETag 保证每一个资源时唯一的, 因此当 ETag 发生了变化,我们可以知道服务器那边的资源发生了变化, ETag 大大提高了 modify 时间精度不准备 的问题

场景总结:
当我们第一次请求的时候, 客户端得到的响应报文中会加入 cache control: max-age 等字样, 告诉我们客户端在多少 s 之内,如果在次发起请求(例如:刷新)的时候, 可以直接用缓存, 不需要真正的发送请求过来. 所以当我们的浏览器在刷新的时候, 会采用强缓存, 直接在本地读取,不发送请求给服务器. 当我们第三次刷新页面(这个时候已经超过了服务器给的 max-age 生命时间 ).我们的客户端不知到是否在服务器上发生了更新, 这个时候浏览器会请求服务器问服务器要数据, 会拿上第一次服务器发过来的 ETag 作为 请求报文中的`If-None-Match`, 去求情服务器. 这个时候服务器一看我这边没有发生跟新, 就会发送 304 给浏览器(相当用户告诉浏览器, 我这边没有更新, 你还是可以用上一次的缓存.). 第三次就是我们的协商缓存. 如果服务器有更新, 那么响应报文中就会返回 200 , 发送新的 ETag 告诉我们浏览器这个是新的, 我们去更新.

---

这个就是第一的 response 和第二的 request 和 response

![当服务器没有发生变化使得协商缓存](./img/cache1.png)

---

这个就是第一的 response 和第二的 request 和 response

![当服务器发生变化用的协商缓存](./img/cache2.png)

# 浏览器

## cookie, session, webStorage(localStorage, sessionStorage)

- Cookie：一种网页存储技术, 与 webStorage 想对应

  1. cookie 数据始终在同源的 http 请求中携带, 而 session 和 localStorage 则不会
  2. cookie 是有生命期的, 在生命期内, 即使关闭浏览器也有效,不会丢失,若没有设置生命期, 则关闭窗口 cookie 就消失了, 里面的东西也就没有了.
  3. 所有**同源窗口**共享 cookie 存储的 token 信息
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
  `WebStorage = localStorage + sessionStorage` 组成, 是针对 cookie 的劣势而在 HTML5 中做的优化,现在有很多的浏览器主要是把我们的 `sessionId` 不在存入 cookie 中,而是存入到 webStorage 当中
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

### 什么是同源:

浏览器自带的同源策略: 协议+host+(域名,ip)+端口. 只要满足这个, 就是同源

### 为什么会有跨域问题:

1. 发生在浏览器, 浏览器的一个防御措施
2. 产生原因是: 就是因为我们要在两个不同源的地方去请求数据, 例如在百度当前页面去请求 google, 这个时候浏览器会判断我们是跨域行为,浏览器会禁止当前的百度请求 google 行为

### 跨域问题描述和解决方案:

#### 1. `CROS` 方式

> 服务器设置通过响应头文件添加字段

1. 当 A 页面发送请求到 B 页面的网站的时候,浏览器先问下 B 页面的网站是否允许请求跨域, 在百度页面上有一个发送 ajax 请求, 访问 google. 浏览器会先询问 google 上的服务器是否允许从百度页面上发来的 ajax 请求. 这个时候浏览器会发送 **option** 请求, 去询问 google 服务器, 如果 google 发送的响应报文中 有
   `Access-Control-Allow-Origin`中包含百度的这个域名, 这样浏览器就会发送 Get 请求. 注意这个 是第二次才发送的, 真正的请求文件. 如果 google 不允许, 则这第二次的请求就不会发送. 同时浏览告诉你, 在百度这个页面访问 google 的请求跨域了. 不好的就是, 每一次我们发送 get 请求, 浏览器都会去询问 google 是否支持跨域, 这样相当于每次一 Get 请求 = 发送两个请求(一个是询问请求, 一个是真的 Get 请求)

   :::tip
   `Access-Control-Allow-Origin`如果设置了具体的域名, 那么就**只能设置一个**(不好的地放),如果需要设置多个 只能用通配符 \*, 如果用了\* 就能不能携带 cookie(浏览器为了安全设置)
   :::

2. 还有一种是 `Access-Control-Max-Age`, 这种是在第一次发送询问请求之后的多少 s 之内, 都可以不用再次询问了,直接可以发送普通的请求, 这样就免掉了每次发请求都要发询问, 大大增加沟通效率

3. `Access-Control-Allow-Method`: 允许跨域的方法,例如允许 Get
4. `Access-Control-Allow-Header`: 允许哪些请求头才能跨域

#### 2. proxy 方式(前端利用 node 中间件代理, 或者后端用 nginx)

> 网页发送请求到我们的同源服务器代理, 由代理服务器替代我们去访问别的服务器.

1. 例如我们在百度页面发送 ajax 请求到 google, 我们可以去访问百度服务器, 百度服务器可以设置一个代理, 拦截我们要取访问 google 的这个 ajax 请求, 然后由百度服务器去访问 google 服务器, 因为服务器和服务器之间没有跨域这个问题. 所以当百度服务器替我们去拿数据,在返给客户端展示

2. 正向代理: 类似于 VPN, 我们登录上我们的 VPN 之后, 我们输入 google, 可以明确的告诉浏览器我就要去 google 访问, 那么我们会走一个代理服务器, 但是我们不知道是哪一个代理服务器帮我们翻墙, 我们的最终目的地是受客户端控制的,

3. 反向代理: 我明确去访问代理服务器,代理服务器自己决定去哪里访问, 客户端无法控制, 最终目的地客户端无法控制, 通常反向代理域 都会有 api 字段在 url 当中
   :::tip

4. vue 中用的就是 反向代理, 用 node 起了一个代理服务器,帮我们去访问

5. webpack 也是这样的
   ![webpack代理处理跨域问题](./img/webpack_proxy.png)

   :::

#### 3. Jsonp 方式

> html 中有一些天然支持跨域的标签, 我们就可以利用这个技术, 重点理解原理,和实现方法. 现在不经常使用了

1. 首先我们在前端 A 页面声明一个函数 `function A(dataFromPageB)`
2. 然后我们在 A 页面中利用 script 标签这个天然支持跨域请求, 通过 src 去请求 pageB, 通常会把这个函数拼接到 url 请求当中
3. pageB 页面只需要在返回的请求中 返回**字符串** `A(dataWannaCross)`, 当 pageA 拿到这个请求的文件的时候, 会自动执行 `function A`
4. 因为 script 标签只支持 get, 不支持 post, 所以 JSONp 也仅仅支持 get 请求(这个是不好的地方)
5. 安全性会降低, 因为如果服务器被黑了,返回的是木马程序, 那么我们前端也是会执行
6. 其他类似标签: `img`, `iframe`, `link`, 这些都不存在跨域请求的限制
7. jsonp 需要有服务端的支持

   ![jsonp原理](./img/jsonp.png)

**总结**: JSONp 相当于是 PageB 通过服务器返回函数名字( functionA(参数) ) 帮我们自动激活了 PageA 里面的我们命名的方法

#### 4. postMessage 方式 + iframe (不常用)

1. 利用 iframe, 在页面中嵌入一个隐藏的 iframe,这个 iframe src 指向我们要请求的地址的 html
2. 利用 postMessage 与 iframe src 执行的网页进行通信
3. iframe 会阻塞加载

#### 5. webSocket 也能支持跨域请求数据

#### 6. document.domain + iframe

::: warning
该方法只能实现同一个主域, 不同子域的请求
:::

#### 7. window.name + iframe

1. A 页面嵌入 iframe, 该 iframe 去访问 B 的 window.name(我们可以让 window.name 可以赋值我们需要的数据)
2. 因为访问不同源的 window.name 浏览器会去禁止, 那么我只需要在 A 页面拿到 B 返回的 window.name 之前, 让 A 页面的 iframe src 指向一个同源的文件(proxy.html)就可以避免掉
   ![window.name + iframe](./img/window.name.png)

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

## 浏览器中的 `fetch` 和我们的 `axios`的区别

### fetch

- fetch 是一个我们浏览器自带的底层 api, 他支持 es6 的 Promise 语法, 比较糙, 需要我们自己进行封装

- 不支持进度检测, 当我们上传大文件的时候,我们希望看到进度条

- 不支持区分 400 和 500 的 区分
- fetch 和 XMLHttpRequest 是一个级别的, 都是属于底层 api

### axios

- axios 是一个更高级的封装, 自带 cookie 等,已经被配置好的网络请求框架
- 有上传进度检测, 我们可以来根据这个回调,来制作上传进度条
- 可以在服务器端(node)使用, 也可以在客户端使用
- 自动转换 JSON 数据
- 支持拦截请求

## 多页面应用中的通信

### 1. 使用 `localStorage`

> 1. 在一个标签页里面使用 localStorage.setItem(name, val)添加,修改内容
> 2. 另一个页面去监听 storage 时间, 可以得到 localStorage 存储的值, 实现不同标签页面之间的通信 `window.addEventListener('storage', function)`
> 3. 必须得是在同源,如果想要不同域名之下, 需要在 A 页面嵌入 B 页面(另一个域名), 来获取

### 2. 使用 `cookie`

> 1. A 页面存储信息到 cookie 中, B 页面轮询查看 A 页面中的 cookie 是否有存储更新
> 2. A 页面 `document.cookie = 'name=' + value`
> 3. B 页面每过一段时间去轮询 document.cookie
>    不一个域名下的无法共享

### 3. 使用 `webSocket`

> 1. 全双工, 建立 webSocket 连接之后, 服务器可以主动发消息给客户端
> 2. H5 新特性

### 4. 使用 `share worker`

> 1. 引入 worker.js
> 2. 可以实现多标签, iframe 共同使用. sharedWorker 可以在是被多个 window 共同使用,但是必须保证这些标签页是同源的(相同的协议, 主机和端口)

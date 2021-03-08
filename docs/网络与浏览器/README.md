# 网络与浏览器

::: tip
前端而言, 网络往往伴随着浏览器一起说出, 因此我决定把网络和浏览器放到一起去说, 从而串成一个体系,方便大家理解
:::

## 网络

```js
let name = "haha";
function action {
    name = 'woqu'
}
// 由此我们可以知道
```

## 浏览器

### cookie, session

- Cookie：

  1. cookie 数据始终在同源的 http 请求中携带, 而 session 和 localStorage 则不会
  2. cookie 是有生命期的, 在生命期内, 即使关闭浏览器也有效,不会丢失.
  3. 如果不设置声明生命期, 那么关闭窗口就没有了
  4. 所有同源窗口共享
  5. 来源于服务器端, 以文本的形式保存在客户端, 可以与服务器交互, 不能超过 4kb
  6. cookie 有路径的概念, 不同路径下的有不同的 cookie, 因为你不能把百度的 cookie 给发送给 google

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

### localStorage 和 sessionStorage 组成的 WebStorage

::: tip
`WebStorage = localStorage + sessionStorage` 组成, 是针对 cookie 的劣势而在 HTML5 中做的优化
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

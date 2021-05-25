# Vue3 源码学习手册

## 1. 环境,调试,运行

### 1.1 npm 运行文件分析(`/scrips/dev.js`)

- 从 /scripts 可以获得在 `npm run dev`是的时候回调用 dev.js 的代码逻辑,
- `const args = require('minimist')(process.argv.slice(2))` 这个中的(`minimist`)库可以允许我们在设置 运行指令的时候 添加 -v -f 等等自定的属性参数,

```javascript
$ node example/parse.js -x 3 -y 4 -n5 -abc --beep=boop foo bar baz
// minimist 库可以把我们的指令给转成这样的模式
{ _: [ 'foo', 'bar', 'baz' ], // 由于 foo bar baz 前面有没有 -的前缀,所以 key 为_
  x: 3,
  y: 4,
  n: 5,
  a: true,
  b: true,
  c: true,
  beep: 'boop' }
```

```js
const args = require('minimist')(process.argv.slice(2)) // 分解指令
const target = args._.length ? fuzzyMatchTarget(args._)[0] : 'vue'
const formats = args.formats || args.f // 把-f 或者 -formats 指令中的参数提取出来
const sourceMap = args.sourcemap || args.s // 把 -s 或者 -sourcemap 中的参数提取出了, 在 rollup 打包的时候, vue3 根据你这个参数决定是否生成 sourcemap
execa(
  // execa 是用来在 node 环境的时候是赋值给全局变量
  'rollup',
  [
    '-wc',
    '--environment',
    [
      `COMMIT:${commit}`,
      `TARGET:${target}`,
      `FORMATS:${formats || 'global'}`,
      sourceMap ? `SOURCE_MAP:true` : ``
    ]
      .filter(Boolean)
      .join(',')
  ],
  {
    stdio: 'inherit'
  }
)
```

### 1.2 git commit 文件分析(`/scrips/verifyCommit.js`)

- 在我们自己 fork 了代码之后, 如果提交代码没有按照 vue3 的 commit 要求规范是无法被推送的, 那么这个控制你的 commit 的格式就是在 `/scripts/verifyCommit.js` 文件中

```javascript
// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk')
const msgPath = process.env.GIT_PARAMS
const msg = require('fs')
  .readFileSync(msgPath, 'utf-8')
  .trim()

const commitRE = /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/
// 从这里可以看出 对我们的品论提交 有严格的要求, 除了不能有 需要包含以上的评论, 例如:
// test: this is test
// 当然 不能有 revert, 在代码里面已经给出了

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
      `invalid commit message format.`
    )}\n\n` +
      chalk.red(
        `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
      ) +
      `    ${chalk.green(`feat(compiler): add 'comments' option`)}\n` +
      `    ${chalk.green(
        `fix(v-model): handle events on blur (close #28)`
      )}\n\n` +
      chalk.red(`  See .github/commit-convention.md for more details.\n`)
  )
  process.exit(1)
}
```

### 1.3 `package.json` 指令分析

- `npm run dev-compiler`

开启 template-explorer server 服务器, 能够开启 vue 的 ssr 渲染

- `npm run open`

开启 template-explorer server 网页, 能够让我们看到 template 是如何被转成 代码的, 尤大大说他自己经常用这个来 debug, 当 template 模板没有按照他预想的那样去渲染的时候

## 2. 代码

> 3 大模块: `reactivity` 模块主要是建立响应式, `compiler`模块主要是负责把 `template` 转换成 `render()` 方法, `render module` 包含三个阶段, `render`阶段, `mount` 阶段, 和 `patch phase`(diff 算法, 新老 dom 对比)

### 2.1 `@vue/reactivity 模块`

> 这是一个极其重要的模块，它是一个数据响应式系统。其暴露的主要 API 有 `ref`（数据容器）、`reactive`（基于 Proxy 实现的响应式数据）、`computed`（计算数据）、`effect`（副作用） 等几部分`,

### 2.2 `@vue/compiler-core 模块`

> 这个编译器的暴露了 AST 和 baseCompile 相关的 API，它能把一个字符串变成一棵 AST。

### 2.3 `@vue/runtime-dom 模块`

> 这个模块是基于上面模块而写的浏览器上的 runtime，主要功能是适配了浏览器环境下节点和节点属性的增删改查。它暴露了两个重要 API：`render()` 和 `createApp()`，并声明了一个 `ComponentPublicInstance` 接口。

### 2.4 `runtime-core 模块`

#### 2.4.1 `h.ts`

> `h.ts`文件下有多个关于 h 函数的声明重载, 可以学习一下

##### `h()`

- `h()`vue3 提供的 `h()` 函数给了我们一定的灵活性, 也就是说我们及时没有 template, 也可以通过 `h()`直接生成 virtual DOM. 如果我们写的 template 模板中有很多的逻辑判断,或者 template 中有逻辑判断, js 中有逻辑判断, 不够纯粹的时候, `h()`函数或许给了我们一个结局方案,就是用 js 来直接创建 virtual DOM
- 如果我们写了 template, vue3 会帮我们把 template 用`h()` 给转换成 virtual DOM,
- related API: `createVNode()`

```ts
// Actual implementation
/**
 * 如果第二位是 props, 那么 props 应该是一个对象形式:
 * {
 * id:'foo',
 * onClick: this.onClick
 * }
 *
 * 如果第三位是 children, 那么 第三位就文本节点('string形式')或者子节点(数组形式)
 */
export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      // single vnode without props
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren])
      }
      // props without children
      return createVNode(type, propsOrChildren)
    } else {
      // omit props

      /** WQQ :
       * 说明这里是一个普通节点, 如: <span>hello world</span>
       */
      return createVNode(type, null, propsOrChildren)
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (l === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}
```

#### 2.4.2 `renderer.ts`

##### `patch()`

`patch()`方法是一个比较 新旧虚拟 Dom 的方法, 从来确定如何更新 旧的 DOM 从而保留下新的 DOM.

```typescript
const patch: PatchFn = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  isSVG = false,
  optimized = false
) => {
  // patching & not same type, unmount old tree
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }

  if (n2.patchFlag === PatchFlags.BAIL) {
    optimized = false
    n2.dynamicChildren = null
  }

  const { type, ref, shapeFlag } = n2
  switch (type) {
    case Text:
      processText(n1, n2, container, anchor)
      break
    case Comment:
      processCommentNode(n1, n2, container, anchor)
      break
    case Static:
      if (n1 == null) {
        mountStaticNode(n2, container, anchor, isSVG)
      } else if (__DEV__) {
        patchStaticNode(n1, n2, container, isSVG)
      }
      break
    case Fragment:
      processFragment(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        optimized
      )
      break
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        processComponent(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        )
      } else if (shapeFlag & ShapeFlags.TELEPORT) {
        ;(type as typeof TeleportImpl).process(
          n1 as TeleportVNode,
          n2 as TeleportVNode,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      } else if (__FEATURE_SUSPENSE__ && shapeFlag & ShapeFlags.SUSPENSE) {
        ;(type as typeof SuspenseImpl).process(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized,
          internals
        )
      } else if (__DEV__) {
        warn('Invalid VNode type:', type, `(${typeof type})`)
      }
  }

  // set ref
  if (ref != null && parentComponent) {
    setRef(ref, n1 && n1.ref, parentSuspense, n2)
  }
}
```

## 3. Vue3 亮点

> 中所周知,Vue3 提升了 Diff 算法的效率,然后 Diff 算法是虚拟 DOM 新旧的对比和查找效率,因此我们来看看, 哪些 feature 给 Vue3 提升了 Diff 算法

### 3.1 `hoisted`

- 在 vue3 的 template parse 阶段, 如果 vue 返现了我们的节点是一个静态节点(就是我们说的里面的节点没有包含**变量**), vue 就会把这个节点标记为 `hoisted`类型
- `hoisted`类型的节点, 因为是静态节点(纯 HTML 节点), 因此 Vue 并不会去检查`hoisted`

```html
<div>
  Hello World!
  <div>{{name}}</div>
</div>
```

被转译成为 js 方法之后,从 template-explorer 之后能够看到

```js
import {
  toDisplayString as _toDisplayString,
  createVNode as _createVNode,
  createTextVNode as _createTextVNode,
  openBlock as _openBlock,
  createBlock as _createBlock
} from 'vue'
/** WQQ:
 * 由该方法可以知道, 我们的纯文本的静态节点被转为了 hoisted 变量
 * 根据尤大大说, hoisted 节点类型在 diff 算法中能够被 catch, 从而提高 diff 的算法效率
 * 因为如果该节点改变就是整替换, 而不是去查看里面的哪些属性被添加了, 哪些属性值被改变了
 *
 */
const _hoisted_1 = /*#__PURE__*/ _createTextVNode(' Hello World! ')
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createBlock('div', null, [
      _hoisted_1,
      _createVNode('div', null, _toDisplayString(_ctx.name), 1 /* TEXT */)
    ])
  )
}

// Check the console for the AST
```

### 3.2 `patch` flag

- patch flag 也是 vue3 中的一大亮点, 在 template 转出来的对应节点, 会被添加一个 patch flag 标记, 用来表示此节点是一个什么样的节点

- 每一种单一类型都有自己对应的权重 每一种类型都是 2 次方的形式来表示, 这样的好处就是, 如果该节点是一个复合类型的基点(例如动态 text + 动态 class). 那么 template 在转出之后是 patchFlag 是 3 = ( 1 + 2 )
- patch 类型: patchFlag.ts

  ```javascript
  ;-1 // 静态节点(此类型与其他的互斥)
  1 // 绑定有动态文本节点
  2 // 绑定有的有 动态 class 节点
  4 // 绑定有 行内 style {} 类型 节点
  8 //   props
  ```

### 3.3 `block 追踪`

- 相关代码: `_createBlock()`
- block 数组用来存放那些可能会被改变的 DOM=>Obj
- v-if 这种 会改变 dom 结构的之会被当成一个 block, 而改 block 也是可以被 template block 存入的, 举例子

```html
<div>
  <p>hello</p>
  <div v-if="ok">world</div>
</div>

// 下面是被转译的代码
<script>
const _hoisted_1 = /*#__PURE__*/_createVNode("p", null, "hello", -1 /* HOISTED */)
const _hoisted_2 = { key: 0 }
export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createBlock("div", null, [
    _hoisted_1,
    (_ctx.ok) // 如果 v-if 的 ok 是 true
      ? (_openBlock(), _createBlock("div", _hoisted_2, "world")) // 那么我就给这个 v-if 也建立一个 block
      : _createCommentVNode("v-if", true) // 否则就是一个 comment note, 相当于不存在了
  ]))
}
</script>
```

> 在每一份 template 被解析的时候, 该 template 都会生成一个 名叫 block 的数组, 在通过对 template 里面的 dom 解析成 object 的过程中, 如果对应的 dom=>obj 都会有一个 patch Flag, 而 patch flag 里面如果是>=1 的数据, 会被添加到该 template 对应生成的 block 数组中. 因此无论你的 template 里面嵌套有多深, 在 block 数组中, 他们都是 flat 的,因此大大提高 vue 的查找效率, 只需要在第一次的时候 加入 block 数组中.然后如果我们的节点发生变化, vue 就不需要去遍历到深层的那些响应式节点, 只需要去查找 block 数组里面的就行了, 因为 block 存的就是该 template 里面所有响应式的 DOM=>Obj

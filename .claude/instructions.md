基于 Uni-app (Vue 3 版本）和 uView UI 2.x 开发微信小程序
# Claude 小程序开发说明

# 平台约束：代码必须遵循 Uni-app 规范，严禁使用 window、document 等浏览器特有对象。所有平台差异必须使用条件编译（如 #ifdef MP-WEIXIN）。

# 组件库规范：优先使用 uView UI 2.x 组件，严禁在已有 uView 对应组件时手动编写复杂 CSS 布局。

# 生命周期：区分 Vue 生命周期（onMounted）与页面生命周期（onLoad, onShow），涉及数据请求时优先使用 onLoad。

1. 组合式 API 与响应式规则
目标：规范代码结构，防止 setData 数据过载。
代码组织：统一使用 <script setup> 语法。逻辑按功能块（Composables）拆分，严禁将所有逻辑堆死在页面文件内。

响应式精简：只有渲染到模板上的变量才使用 ref 或 reactive。临时变量、配置常量、定时器引用等应使用普通的 let/const 或 shallowRef，以减轻小程序数据层负担。

计算属性：优先使用 computed 派生数据，避免在 watch 中手动修改多个状态导致的多次渲染。

2. Uni-app & 微信小程序适配规则
目标：处理 Vue 3 在小程序端的特殊行为。

Rule 示例：

获取组件实例：在 Vue 3 的组合式API中，使用 ref 获取组件实例后，调用 uView 组件方法需确保在 onMounted 生命周期之后执行，因为此时DOM元素已经挂载完成。

页面通讯：优先使用 uni.$emit 和 uni.$on 进行跨页面通讯，但在页面 onUnload 时必须显式调用 uni.$off 销毁监听，防止内存泄漏。

解构陷阱：严禁直接对 props 或 reactive 对象进行解构，必须使用 toRefs 保持响应式。

3. uView UI 2.x (兼容 Vue 3) 使用规则
目标：针对在Vue 3中使用uView 2.x的语法习惯。

Rule 示例：

v-model 绑定：uView 2.x 组件支持 v-model。在自定义组件时，务必遵循 Vue 3 的 update:modelValue 规范。

样式穿透：修改 uView 内置组件样式时，由于小程序开启了 styleIsolation: 'apply-shared'，必须使用 :deep() 伪类。

校验逻辑：使用 u-form 时，rules 定义应放在 onMounted 中，并通过 uForm.value.setRules(rules) 手动设置，以确保响应式校验生效。

4. 目录结构与分层 (Skill 建议)

- 页面逻辑较复杂时，必须在同级目录建立 `usePageName.ts` (Composables)。
- 组件化：超过 200 行的模板必须拆分为局部组件放入页面文件夹下的 `components/`。
- 类型定义：所有 API 返回结果必须定义 `interface`，严禁使用 `any`。


5. 性能与打包规则 (微信小程序专供)
Rule 示例：

静态资源：图片组件 u-image 必须开启 lazy-load。

分包加载：新功能模块必须建议建立分包 subPackages。

生命周期：网络请求应放在 onLoad 中触发，页面 UI 交互优化放在 onShow。
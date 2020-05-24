/**
 * 功能：
 *  1. 创建指定组件实例
 *  2. 挂载到 body 标签中
 */

import Vue from 'vue'

export default function create(Component, props) {
  // 1. 创建组件实例
  // 方式一：
  // const Construc = Component.extend({data: {foo: '123'}, methods: {}})
  // const insten = new Construc()

  // 方式二：
  const vm = new Vue({
    // render 方法提供一个 h 函数，这个函数可以渲染 VNode(虚拟dom)
    // render 方法生成 VNode
    render(h) {
      return h(Component, {props})
    }
  }).$mount()
  // 官方文档说明，如果 $mout 的值是 body，会报错，所以先不挂载
  // 同时，$mount 是把 虚拟dom 转为（更新为数据变化后的）真实 dom，并挂载到目标上，这里没有设置目标，所以只触发更新，不挂载

  // 2. 获取组件实例
  const insten = vm.$children[0]

  // 3. 挂载（追加）到 body 中，由于上面的 $mount 没有设置更新目标，所以这里手动挂载到页面中，
  document.body.appendChild(vm.$el)
  // $el 为 vue 虚拟 dom 渲染出来的真实 dom 节点

  // 4. 清理函数
  insten.remove = () => {
    document.body.removeChild(vm.$el) // 在 dom 中移除
    vm.$destroy() // 销毁组件
  }

  // 5. 返回组件实例
  return insten
}
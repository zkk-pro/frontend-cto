<template>
  <div class="k-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  // 把自己传递给 后代组件，这样后代组件就可以拿到 model 和 rules 等数据和方法
  provide() {
    return {'form': this}
  },
  props: {
    // 接收form表单数据
    model: {
      type: Object,
      required: true
    },
    // 校验规则
    rules: Object
  },
  methods: {
    validate(cb) {
      // 得到的是若干个 Promise Boolean数组，
      const tasks = this.$children
        .filter(item => item.prop) // 有的 KFormItem 没有 prop 属性，则表示不需要校验，需要过滤掉
        .map(item => item.validate())

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false))
    }
  }
}
</script>

<style>
</style>
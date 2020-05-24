<template>
  <div>
    <!-- 
      自定义组件要实现v-model,必须实现v-bind:value、@input 
      $attrs：接收没有在 props 声明的属性
    -->
    <input v-bind="$attrs" :value="value" @input="onInput" @blur="onBlur">
  </div>
</template>

<script>
export default {
  inheritAttrs: false, // 避免顶层容器继承
  props: {
    value: String
  },
  methods: {
    onInput(e) {
      this.$emit('input', e.target.value)
      // 当有值的时候，输入时执行校验，消除错误提示
      if (e.target.value) {
        this.$parent.$emit('validate')
      }
    },
    onBlur() {
      // 触发校验：通知父组件校验数据
      this.$parent.$emit('validate')
    }
  }
}
</script>

<style>
</style>
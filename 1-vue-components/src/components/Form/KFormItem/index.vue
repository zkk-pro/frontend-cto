<template>
  <div>
    <label v-if="label">{{label}}</label>
    <!-- slot插槽预留给input组件 -->
    <slot></slot>
    <p v-if="errorMessage">{{errorMessage}}</p>
  </div>
</template>

<script>
import Schema from 'async-validator' // 验证库
export default {
  props: {
    label: String,
    prop: String
  },
  data() {
    return {
      errorMessage: ''
    }
  },
  inject: ['form'], // KForm组件（祖先）注入的数据
  methods: {
    // 执行组件的校验
    validate() {
      // 1. 获取检验规则
      const rule = this.form.rules[this.prop]
      // 2. 获取当前数据
      const value = this.form.model[this.prop]
      // 3. 校验
      const desc = {
        // key: 需要校验的属性；value：校验规则
        [this.prop]: rule
      }
      const schema = new Schema(desc) // 需要一个描述符
      // 执行校验函数，参数1：对象->key:校验的属性，value:输入的值; 参数2：回调函数
      // validate 函数返回的是一个 Promise
      return schema.validate({ [this.prop]: value }, errors => {
        if (errors) {
          console.log(errors)
          this.errorMessage = errors[0].message
        } else {
          this.errorMessage = ''
        }
      })
    }
  },
  mounted() {
    this.$on('validate', () => this.validate())
  }
}
</script>

<style>
</style>
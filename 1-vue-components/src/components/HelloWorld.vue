<template>
  <div class="hello">
    <div>{{msg}}</div>
    <div>foo: {{foo}}</div>
    <div>祖代传递过来的值是：{{ancestorData}}</div>
    <button @click="$parent.$emit('add', 'brother1数据')">兄弟组件通信</button>
    <p></p>
    <!-- 匿名插槽 -->
    <slot></slot>
    <!-- 具名插槽 -->
    <slot name="title"></slot>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  inject: ['ancestorData'],
  data() {
    return {
      foo: 'foo原始数据'
    }
  },
  created() {
    this.$parent.$on('add', (data) => {
      console.log('brother2：兄弟发送过来的数据--', data)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

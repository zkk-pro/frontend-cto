<template>
  <div v-if="show">
    <h2>{{title}}</h2>
    <div>{{content}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    duration: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    // 打开
    open() {
      this.show = true
      setTimeout(() => this.close(), this.duration)
    },
    // 关闭
    close() {
      this.show = false
      this.remove()
    }
  }
}
</script>

<style>
</style>
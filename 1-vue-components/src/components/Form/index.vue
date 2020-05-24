<template>
  <div>
    <k-form :model="form" :rules="rules" ref="form">
      <k-form-item label="用户名" prop="username">
        <k-input type="text" v-model="form.username" />
      </k-form-item>
      <k-form-item label="密码" prop="password">
        <k-input type="password" v-model="form.password" />
      </k-form-item>
      <k-form-item>
        <button @click="onLogin">登录</button>
      </k-form-item>
    </k-form>
    {{form}}
  </div>
</template>

<script>
import KInput from "./KInput";
import KFormItem from "./KFormItem";
import KForm from "./KForm";

export default {
  data() {
    return {
      form: {
        username: "tom",
        password: ''
      },
      rules: {
        username: [{required: true, message: '用户名必填'}],
        password: [{required: true, message: '密码必填'}],
      }
    };
  },
  components: {
    KInput,
    KFormItem,
    KForm
  },
  methods: {
    onLogin() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return alert('数据有误')
        }
        alert('数据都正确')
      })
    }
  }
};
</script>

<style>
</style>
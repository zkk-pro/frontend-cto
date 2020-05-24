<template>
  <div id="app">
    <HelloWorld msg="父传子通过props" ref="hw">
      <p>匿名插槽数据</p>
      <!-- 匿名插槽也可以使用 default 的方式 -->
      <!-- <template v-slot:default>匿名插槽数据</template> -->
      <template v-slot:title>具名插槽数据</template>
    </HelloWorld>

    <hr />

    <button @click="refsClick">通过$refs</button>
    <button @click="childrenClick">通过$children</button>

    <hr />

    <h2>实战：form表单的实现</h2>
    <Form />

    <hr />
    <h2>实战：弹框的实现</h2>
    <button @click="showPop">显示弹框</button>

    <hr />
    <h2>实战：树组件的实现</h2>
    <ul>
      <Tree :treeData="treeData" />
    </ul>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import Form from "./components/Form";
import alertPop from "./components/Alert/index.js";
import Tree from "./components/Tree";

export default {
  name: "App",
  data() {
    return {
      treeData: {
        title: "A",
        children: [
          {
            title: "A-1"
          },
          {
            title: "B",
            children: [
              {
                title: "B-1",
                children: [{ title: "B-1-B" }]
              }
            ]
          },
          {
            title: "C",
            children: [
              {
                title: "C-1",
                children: [{ title: "B-1-B" }]
              }
            ]
          }
        ]
      }
    };
  },
  provide() {
    return {
      ancestorData: "I am ancestor data"
    };
  },
  components: {
    HelloWorld,
    Form,
    Tree
  },
  methods: {
    refsClick() {
      console.log(this.$refs.hw); // 获取到的是组件的实例
      this.$refs.hw.foo = "通过$refs改变的值";
    },
    childrenClick() {
      console.log(this.$children); // 获得当前组件下所有组件实例（数组）
      this.$children[0].foo = "通过$children改变的值";
    },
    showPop() {
      alertPop({ title: "弹框", content: "内容", duration: 10000 }).open();
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

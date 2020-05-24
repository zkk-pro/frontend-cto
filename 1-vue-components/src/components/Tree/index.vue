<template>
    <li>
      <span @click="hasChild ? isOpen = !isOpen : ''">{{treeData.title}}</span>
      <span v-if="hasChild">{{isOpen ? '-' : '+'}}</span>
      <ul v-if="hasChild" v-show="isOpen">
        <Tree v-for="item in treeData.children" :key="item.title" :treeData="item" />
      </ul>
    </li>
</template>

<script>
export default {
  name: "Tree",
  props: {
    treeData: Object
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    hasChild() {
      return this.treeData.children && this.treeData.children.length
    }
  }
};
</script>

<style>
</style>
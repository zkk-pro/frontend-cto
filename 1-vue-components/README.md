# Vue组件化

组件化是Vue的核心思想，主要目的是为了代码的复用。

## 组件通信

### 父组件=>子组件

1. 通过 props 属性

    ```javascript
    // child
    props: {msg: String}

    // parent
    <HelloWorld msg="hello world"></HelloWorld>
    ```

2. 通过引用 refs

   ```javascript
   // parent
   <HelloWorld ref="hw" />
   
   this.$refs.hw.xxx = 'xxx'
   ```

3. 通过子元素 $children

    ```javascript
    // parent
    this.$children[0].xx = 'xxx'
    ```
    
    > 通过$children的方式获取到子元素，是不保证顺序的，也不是响应式的

### 子组件=>父组件

1. 通过自定义事件

   子组件派发自定义事件，并且可以传值，在组件标签中监听自定义事件，并通过事件处理函数获取子组件传递的值。（观察者模式）

   ```javascript
   // child
   this.$emit('add', 'haha')
   
   // parent
   <Cart @add="handleAdd($event)" />
   ```

   > 看上面的代码，监听add自定义事件的监听者实际上是`组件本身`，而不是父组件，事件的派发者是谁，事件的监听者就是谁。

### 兄弟组件通信

1. 通过共同的祖辈组件

   通过共同的祖辈组件搭桥，$parent 或 $root。

   ```javascript
   // brother1
   this.$parent.$on('foo', handleFn)
   
   // brother2
   this.$parent.$emit('foo')
   ```

### 祖先和后代之间

由于嵌套过多，传递 props 不切实际，Vue提供了 `provide/inject` API 完成该任务。

1. provide/inject：能够实现祖先给后代传值

   ```javascript
   // ancestor 祖代
   provide() {
     return {ancestorData: 'I am ancestor data'}
   }
   
   // descendant 后代
   inject: ['ancestorData']
   ```

### 任意两个组件之间传值（没关系）：

1. 事件总线：创建一个 Bus 类负责派发、监听和回调管理

   ```javascript
   // Bus：事件派发、监听和回调管理
   class Bus {
     constructor() {
       this.callbacks = {}
     }
   
     $on(name, fn) {
       this.callbacks[name] = this.callbacks[name] || []
       this.callbacks[name].push(fn)
     }
   
     $emit(name, args) {
       if (this.callbacks[name]) {
         this.callbacks[name].forEach(cb => cb(args));
       }
     }
   }
   
   // main.js
   Vue.prototype.$bus = new Bus()
   
   // 使用
   this.$bus.$on('add', handleFn)
   this.$bus.$emit('add', 'params...')
   ```

   > 实践中可以用 Vue 代替 Bus，因为它已经实现了$on/$emit功能

## 插槽（slot）

插槽语法是 Vue 实现的内容分发 API，用于复合组件开发。

> Vue 2.6.0之后采用全新的 v-slot 语法取代之前的slot、slot-scope

### 匿名插槽

```javascript
// comp
<div>
 <slot></slot>
</div>

// parent
<Comp>content...</Comp>
// 匿名插槽也可以使用 default 的方式
// <template v-slot:default>匿名插槽数据</template>
```

### 具名插槽

```javascript
// comp
<div>
 <slot name="title"></slot>
</div>

// parent
<template v-slot:title>具名插槽数据</template>
```

### 作用域插槽

> 插槽的作用域是父级的，可以直接访问父级的数据，那如果要访问组件本身的数据怎么办？在 slot 标签上绑定值，在父级通过 slotProps 的方式获取值。

```javascript
// comp
<div>
 <slot name="title" slotData="i am slot data" bar="bar~~~"></slot>
</div>

// parent
<template v-slot:title=slotProps>{{slotProps.slotData}}--{{slotProps.bar}}</template>
// 或者使用解构赋值的方式
<template v-slot:title={slotData, bar}>{{slotData}}--{{bar}}</template>
```

## 实战：form表单的实现

1. 实现input组件
2. 实现formItem组件：展示label、数据校验、显示错误信息
3. 实现form组件：全局校验、提供表单数据、提供校验规则

### KInput组件的实现

```javascript
// KInput 组件
<template>
  <!-- 
      自定义组件要实现v-model,必须实现v-bind:value、@input 
      $attrs：接收没有在 props 声明的属性
   -->
  <input v-bind="$attrs" :value="value" @input="e => $emit('input', e.target.value)" />
</template>

<script>
  export default {
    inhritAttrs: false, // 避免顶层容器继承
    props: {
      value: String
    }
  }
</script>
```

### KFormItem组件的实现

```javascript
// KFormItem 组件
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
```

### KForm组件的实现

```javascript
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
```

### 最后：使用组件

```javascript
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
```

### 盘点

1. `v-model` 改变默认行为：

   ```javascript
   export default {
     model: {
       prop: 'checked', // 默认是 value 属性
       event: 'change', // 默认是 input 事件
     }
   }
   ```

2. `v-model` 和 `.sync` 的区别

   ```javascript
   <Input :value.sync="form.username" />
   // 相当于
   <Input :value="form.username" @update:value="handleFn">
     
   /* 
   ```

   1. 通过对比可以发现，v-model 可以通过在组件里定义 model 属性来改变 `value`属性 和 `event` 自定义事件，而 `.sync` $emit 的事件只能是：update:xxx, xxx 表示绑定的 value 属性。
   2. 场景上来说：`.sync` 用于非表单组件，`v-model` 用于表单组件
   3. `.sync` 的控制能力在父级，主要是 value 属性在父级定义，update事件固定

## 实战：弹框类组件实现

弹框类组件的特点是：它们独立于当前 vue 实例之外存在，通常挂载与 body 标签中，通过 js 动态创建的，不需要再任何组件中声明和引用。

> 代码：
>
> 1. src/heler/create.js // 动态创建组件实例（通用）
> 2. src/components/Alert/Alert.vue // 组件（结构、样式、数据、方法）
> 3. src/components/Alert/index.js // 上面两者结合，并动态创建组件
> 4. 使用：src/App.vue

### 盘点

1. vue-loader 会把.vue 文件里的 template 编译成  render 函数

## 实战：树组件实现（递归组件）

递归组件有两个必须：

1. 必须有结束条件；
2. 必须有 name 属性。

> 代码：
>
> 1. src/components/Tree.vue // 树形组件
> 2. 使用：src/App.vue

### 盘点

1. 注意控制是否展开状态
2. 注意判断是否还有子节点（结束条件）
3. 注意标签结构以 `li` 标签为根标签
4. 注意组件接收的数据结构是 `Object` 而不是 `Array`
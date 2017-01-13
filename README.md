# vue-async-data for Vue.js 2.0

**this plugin is experimental!**

Async data loading plugin for Vue.js

### Install

- this plugin is written in ES2015,
  so recommend compile with babel/babel-polyfill.

``` bash
npm install kamijin-fanta/vue-async-data
```

``` js
// use as global plugin
import Vue from 'vue';
import { AsyncDataPlugin } from './utils/asyncdata';
Vue.use(AsyncDataPlugin);
```

``` js
// use as locally mixin
import { AsyncDataMixin } from './utils/asyncdata';

export default {
  mixins: [ AsyncDataMixin ],
}
```

### Usage

``` html
<template>
  <div>
    <p v-if="userNameLoading">Loading...</p>
    <p v-else-if="userNameError">Error: {{ userNameError }}</p>
    <p v-else>Hello {{ userName }} !</p>
    <button v-on:click="asyncReload('userName')">Reload userName</button>
  </div>
</template>

<script>
export default {
  name: 'show-data',
  asyncData: {
    userName () {
      return new Promise((resolve, reject) => {
        setTimeout(_ => {
          if (Math.random() > 0.5) {
            resolve('risa');
          } else {
            reject('fetch error...');
          }
        }, 1000);
      })
    },
  },
}
</script>
```


### API

#### this.asyncData: object
#### this.asyncReload([name])
#### this.asyncLoading: object
#### this.asyncError: object

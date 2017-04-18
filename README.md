# vue-async-data for Vue.js 2.0

Async data loading plugin for Vue.js

[![NPM](https://nodei.co/npm/vue-async-data-2.png)](https://nodei.co/npm/vue-async-data-2/)

## Install

- this plugin is written in ES2015,
  so recommend compile with babel/babel-polyfill.

``` bash
npm install vue-async-data-2
```

``` js
// use as global plugin
import Vue from 'vue';
import { AsyncDataPlugin } from 'vue-async-data-2';
Vue.use(AsyncDataPlugin);
```

``` js
// use as locally mixin
import { AsyncDataMixin } from 'vue-async-data-2';

export default {
  mixins: [ AsyncDataMixin ],
}
```

## Usage

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


## Standard API

### this.asyncData: object

specify a function that returns `Promise`.
you can also specify a default value.

```js
asyncData: {
  userName () {  // return promise
    return new Promise((resolve) => {
      resolve('risa');
    })
  },
  userNameDefault: 'unknown',  // default value
  userNameLazy: false,  // skip run at mount?
},
```

### this.asyncReload([name])

refresh data.

if name arg is specified, only that field is updated.

```js
this.asyncReload('userName')
this.asyncReload()
```


### this.asyncLoading: boolean

global reload flag.

### this.asyncError: boolean

global error flag.


## Auto Generate Property

### this.[name]

if `resolve`, set response.

### this.[name]Error

if throw `reject`, set error message.

### this.[name]Loading: boolean

set to true until there response.

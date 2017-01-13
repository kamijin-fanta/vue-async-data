let AsyncDataMixin = {
  created () {
  },
  mounted () {
    this.asyncReload();
  },
  methods: {
    // name args optional
    asyncReload (name) {
      let asyncData = this.$options.asyncData;
      if (asyncData) {
        let names = Object.keys(asyncData)
          .filter(s => !s.endsWith('Default'))
          .filter(s => name === undefined || s === name);

        if (name !== undefined && name.length === 0) {
          console.error(`asyncData.${name} cannot find.`, this);
          return;
        }

        for (let prop of names) {
          // helper
          let setData = data => { this[prop] = data };
          let setError = err => {
            this[`${prop}Error`] = err;
            if (err) this.asyncError = true;
            else this.asyncError = !!names.find(n => this[`${n}Error`]);
          };
          let setLoading = flag => {
            this[`${prop}Loading`] = flag
            if (flag) this.asyncLoading = true;
            else this.asyncLoading = !!names.find(n => this[`${n}Loading`]);
          };

          setLoading(true);
          setError(undefined);

          if (typeof asyncData[prop] !== 'function') {
            console.error(`asyncData.${prop} must be funtion. actual: ${asyncData[prop]}`, this);
            continue;
          }
          asyncData[prop].apply(this)
            .then(res => {
              setData(res);
              setLoading(false);
            })
            .catch(err => {
              setError(err);
              setLoading(false);
            });
        }
      }
    },
  },
  data () {
    let asyncData = this.$options.asyncData;
    if (asyncData) {
      let dataObj = {
        'asyncLoading': true,
        'asyncError': false,
      };

      let names = Object.keys(asyncData)
        .filter(s => !s.endsWith('Default'));
      names.forEach(name => {
        dataObj[name] = asyncData[`${name}Default`];
      });

      let loadingNames = names.map(s => `${s}Loading`);
      loadingNames.forEach(name => { dataObj[name] = true });

      let errorNames = names.map(s => `${s}Error`);
      errorNames.forEach(name => { dataObj[name] = undefined });

      return dataObj;
    }
    return {}
  }
}

let AsyncDataPlugin = {
  install (Vue, options) {
    Vue.mixin(AsyncDataMixin)
  }
}

let api = {
  AsyncDataPlugin,
  AsyncDataMixin,
}

if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = api
} else if (typeof window !== 'undefined') {
  window.AsyncDataMixin = AsyncDataMixin;
  window.AsyncDataPlugin = AsyncDataPlugin;
}

var AsyncDataMixin = {
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
        for (let prop of names) {
          // helper
          let setData = data => { this[prop] = data };
          let setError = err => {
            this[prop + 'Error'] = err;
            if (err) this.asyncError = true;
            else this.asyncError = !!names.find(n => this[n + 'Error']);
          };
          let setLoading = flag => {
            this[prop + 'Loading'] = flag
            if (flag) this.asyncLoading = true;
            else this.asyncLoading = !!names.find(n => this[`${n}Loading`]);
          };

          setLoading(true);
          setError(undefined);
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

var AsyncDataPlugin = {
  install (Vue, options) {
    // console.log('Plugin Install', options);
    Vue.mixin(AsyncDataMixin)
  }
}

var api = {
  AsyncDataPlugin: AsyncDataPlugin,
  AsyncDataMixin: AsyncDataMixin,
}

if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = api
} else if (typeof window !== 'undefined') {
  window.AsyncDataMixin = AsyncDataMixin;
  window.AsyncDataPlugin = AsyncDataPlugin;
}

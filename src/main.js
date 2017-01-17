let optionNames = [
  'Default',
  'Lazy',
];
let isOptionName = (key, names = optionNames) =>
  names.find(n => key.endsWith(n));

let AsyncDataMixin = {
  created () {
  },
  mounted () {
    this.asyncReload(undefined, true);
  },
  methods: {
    // name args optional
    asyncReload (propertyName, skipLazy = false) {
      let asyncData = this.$options.asyncData;
      if (asyncData) {
        let names = Object.keys(asyncData)
          .filter(s => !isOptionName(s))
          .filter(s => propertyName === undefined || s === propertyName)
          .filter(s => skipLazy === false || !asyncData[`${s}Lazy`]);

        if (propertyName !== undefined && names.length === 0) {
          console.error(`asyncData.${propertyName} cannot find.`, this);
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
        .filter(s => !isOptionName(s));
      names.forEach(name => {
        dataObj[name] = asyncData[`${name}Default`];
      });

      names.forEach(name => {
        let loadingName = `${name}Loading`
        dataObj[loadingName] = !`${name}Lazy`
      });

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

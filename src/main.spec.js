import Vue from 'vue';
import { AsyncDataMixin } from './main';

describe('AsyncData', () => {
  let resolve = (done) => {
    return new Vue({
      template: `<div></div>`,
      mixins: [ AsyncDataMixin ],
      asyncData: {
        sandbox () {
          return new Promise((resolve, reject) => {
            this.counter++;
            resolve('OK!' + this.counter);
            setTimeout(() => {
              if (done) done();
            }, 10)
          });
        },
        sandboxDefault: 'Default!',
      },
      data () {
        return {
          counter: 0
        }
      }
    }).$mount();
  };
  let reject = (done) => {
    return new Vue({
      template: `<div></div>`,
      mixins: [ AsyncDataMixin ],
      asyncData: {
        sandbox () {
          return new Promise((resolve, reject) => {
            this.counter++;
            reject('NG!' + this.counter);
            setTimeout(() => {
              if (done) done();
            }, 50)
          });
        }
      },
      data () {
        return {
          counter: 0
        }
      }
    }).$mount();
  }

  beforeEach(() => {
  })

  it('If "asyncData" property is not found, mixin does not work.', () => {
    let emptyVm = new Vue({
      template: `<div></div>`,
      mixins: [ AsyncDataMixin ],
    }).$mount();
    expect(emptyVm.asyncLoading).toEqual(undefined);
  })

  it('Default property is set.', () => {
    let resolveVm = resolve();
    expect(resolveVm.asyncLoading).toEqual(true);
    expect(resolveVm.asyncError).toEqual(false);
    expect(resolveVm.sandbox).toEqual('Default!');
  })

  it('Resolve promise.', (done) => {
    let resolveVm = resolve(() => {
      expect(resolveVm.sandbox).toEqual('OK!1');
      expect(resolveVm.sandboxLoading).toEqual(false);
      expect(resolveVm.asyncLoading).toEqual(false);
      expect(resolveVm.asyncError).toEqual(false);
      done();
    });
    expect(resolveVm.asyncError).toEqual(false);
  })

  it('Reject promise.', (done) => {
    let rejectVm = reject(() => {
      expect(rejectVm.sandboxError).toEqual('NG!1');
      expect(rejectVm.sandboxLoading).toEqual(false);
      expect(rejectVm.asyncError).toEqual(true);
      done();
    });
    expect(rejectVm.asyncError).toEqual(false);
  })

  it('lazy reload.', () => {
    let spy = jasmine.createSpy();

    let lazyVm = new Vue({
      template: `<div></div>`,
      mixins: [ AsyncDataMixin ],
      asyncData: {
        sandbox () {
          return new Promise((resolve, reject) => {
            resolve('OK!');
            spy();
          });
        },
        sandboxDefault: 'Default!',
        sandboxLazy: true,
      }
    }).$mount();

    expect(lazyVm.sandboxLoading).toEqual(false);
    expect(spy).not.toHaveBeenCalled();

    lazyVm.asyncReload('sandbox');
    expect(spy).toHaveBeenCalled();
    spy.calls.reset();

    lazyVm.asyncReload();
    expect(spy).toHaveBeenCalled();
  })
})

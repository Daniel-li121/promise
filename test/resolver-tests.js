require('mocha-as-promised')();
var assert = require('better-assert');
var Promise = require('../');
var sentinel = {};
var promise = new Promise(function (resolve) {
  resolve(sentinel);
});

var _it = it;
describe('resolver-tests', function () {
  describe('The Promise Constructor', function () {
    it('can be called without new with the same results', function () {
      return Promise(function (resolve) { resolve(null); })
    })
    it('has `Object.getPrototypeOf(promise) === Promise.prototype`', function () {
      assert(Object.getPrototypeOf(promise) === Promise.prototype)
    })
    it('has `promise.constructor === Promise`', function () {
      assert(promise.constructor === Promise)
    })
    it('has `promise.constructor === Promise.prototype.constructor`', function () {
      assert(promise.constructor === Promise.prototype.constructor)
    })
    it('has `Promise.length === 1`', function () {
      assert(Promise.length === 1)
    })
    describe('if resolver is not a function', function () {
      it('must throw a `TypeError`', function () {
        try {
          new Promise({})
        } catch (ex) {
          assert(ex instanceof TypeError)
          return
        }
        throw new Error('Should have thrown a TypeError')
      })
    })
    describe('if resolver is a function', function () {
      it('must be called with the promise\'s resolver arguments', function () {
        return new Promise(function (resolve, reject) {
          assert(typeof resolve === 'function')
          assert(typeof reject === 'function')
          resolve(null)
        })
      })
      it('must be called immediately, before `Promise` returns', function () {
        var called = false;
        new Promise(function (resolve, reject) {
          called = true;
        })
        assert(called)
      })
    })
    describe('Calling resolve(x)', function () {
      describe('if promise is resolved', function () {
        it('nothing happens', function () {
          var thenable = {then: function (onComplete) {
            setTimeout(function () {
              onComplete(sentinel)
            }, 50)
          }};
          return new Promise(function (resolve) {
            process.nextTick(function () {
              resolve(thenable)
              resolve(null)
            });
          })
          .then(function (result) {
            assert(result === sentinel)
          })
        })
      })
      describe('otherwise', function () {
        describe('if x is a thenable', function () {
          it('assimilates the thenable', function () {

          })
        })
        describe('otherwise', function () {
          it('is fulfilled with x as the fulfillment value', function () {
            return new Promise(function (resolve, reject) {
              resolve(sentinel)
            })
            .then(function (fulfillmentValue) {
              assert(fulfillmentValue === sentinel)
            })
          })
        })
      })
    })
    describe('Calling reject(x)', function () {
      describe('if promise is resolved', function () {
        it('nothing happens', function () {
          var thenable = {then: function (onComplete) {
            setTimeout(function () {
              onComplete(sentinel)
            }, 50)
          }};
          return new Promise(function (resolve, reject) {
            process.nextTick(function () {
              resolve(thenable)
              reject('foo')
            });
          })
          .then(function (result) {
            assert(result === sentinel)
          })
        })
      })
      describe('otherwise', function () {
        it('is rejected with x as the rejection reason', function () {
          return new Promise(function (resolve, reject) {
            reject(sentinel)
          })
          .then(null, function (rejectionReason) {
            assert(rejectionReason === sentinel)
          })
        })
      })
    })
  })
  describe('if resolver throws', function () {
    describe('if promise is resolved', function () {
      it('nothing happens', function () {
        var thenable = {then: function (onComplete) {
          setTimeout(function () {
            onComplete(sentinel)
          }, 50)
        }};
        return new Promise(function (resolve, reject) {
          resolve(thenable)
          throw new Error('foo');
        })
        .then(function (result) {
          assert(result === sentinel)
        })
      })
    })
    describe('otherwise', function () {
      it('is rejected with e as the rejection reason', function () {
        return new Promise(function (resolve, reject) {
          throw sentinel
        })
        .then(null, function (rejectionReason) {
          assert(rejectionReason === sentinel)
        })
      })
    })
  })
})
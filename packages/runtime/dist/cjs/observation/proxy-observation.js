"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyObservable = exports.unwrap = exports.getRaw = exports.getProxy = exports.wrap = exports.rawKey = void 0;
const connectable_switcher_js_1 = require("./connectable-switcher.js");
const R$get = Reflect.get;
const toStringTag = Object.prototype.toString;
const proxyMap = new WeakMap();
function canWrap(obj) {
    switch (toStringTag.call(obj)) {
        case '[object Object]':
        case '[object Array]':
        case '[object Map]':
        case '[object Set]':
            // it's unlikely that methods on the following 2 objects need to be observed for changes
            // so while they are valid/ we don't wrap them either
            // case '[object Math]':
            // case '[object Reflect]':
            return true;
        default:
            return false;
    }
}
exports.rawKey = '__raw__';
function wrap(v) {
    return canWrap(v) ? getProxy(v) : v;
}
exports.wrap = wrap;
function getProxy(obj) {
    // deepscan-disable-next-line
    return proxyMap.get(obj) ?? createProxy(obj);
}
exports.getProxy = getProxy;
function getRaw(obj) {
    // todo: get in a weakmap if null/undef
    return obj[exports.rawKey] ?? obj;
}
exports.getRaw = getRaw;
function unwrap(v) {
    // eslint-disable-next-line
    return canWrap(v) && v[exports.rawKey] || v;
}
exports.unwrap = unwrap;
function doNotCollect(key) {
    return key === 'constructor'
        || key === '__proto__'
        // probably should revert to v1 naming style for consistency with builtin?
        // __o__ is shorters & less chance of conflict with other libs as well
        || key === '$observers'
        || key === Symbol.toPrimitive
        || key === Symbol.toStringTag;
}
function createProxy(obj) {
    const handler = obj instanceof Array
        ? arrayHandler
        : obj instanceof Map || obj instanceof Set
            ? collectionHandler
            : objectHandler;
    const proxiedObj = new Proxy(obj, handler);
    proxyMap.set(obj, proxiedObj);
    return proxiedObj;
}
const objectHandler = {
    get(target, key, receiver) {
        // maybe use symbol?
        if (key === exports.rawKey) {
            return target;
        }
        const connectable = connectable_switcher_js_1.currentConnectable();
        if (!connectable_switcher_js_1.connecting || doNotCollect(key) || connectable == null) {
            return R$get(target, key, receiver);
        }
        // todo: static
        connectable.observeProperty(target, key);
        return wrap(R$get(target, key, receiver));
    },
};
const arrayHandler = {
    get(target, key, receiver) {
        // maybe use symbol?
        if (key === exports.rawKey) {
            return target;
        }
        const connectable = connectable_switcher_js_1.currentConnectable();
        if (!connectable_switcher_js_1.connecting || doNotCollect(key) || connectable == null) {
            return R$get(target, key, receiver);
        }
        switch (key) {
            case 'length':
                connectable.observeProperty(target, 'length');
                return target.length;
            case 'map':
                return wrappedArrayMap;
            case 'includes':
                return wrappedArrayIncludes;
            case 'indexOf':
                return wrappedArrayIndexOf;
            case 'lastIndexOf':
                return wrappedArrayLastIndexOf;
            case 'every':
                return wrappedArrayEvery;
            case 'filter':
                return wrappedArrayFilter;
            case 'findIndex':
                return wrappedArrayFindIndex;
            case 'flat':
                return wrappedArrayFlat;
            case 'flatMap':
                return wrappedArrayFlatMap;
            case 'join':
                return wrappedArrayJoin;
            case 'push':
                return wrappedArrayPush;
            case 'pop':
                return wrappedArrayPop;
            case 'reduce':
                return wrappedReduce;
            case 'reduceRight':
                return wrappedReduceRight;
            case 'reverse':
                return wrappedArrayReverse;
            case 'shift':
                return wrappedArrayShift;
            case 'unshift':
                return wrappedArrayUnshift;
            case 'slice':
                return wrappedArraySlice;
            case 'splice':
                return wrappedArraySplice;
            case 'some':
                return wrappedArraySome;
            case 'sort':
                return wrappedArraySort;
            case 'keys':
                return wrappedKeys;
            case 'values':
            case Symbol.iterator:
                return wrappedValues;
            case 'entries':
                return wrappedEntries;
        }
        connectable.observeProperty(target, key);
        return wrap(R$get(target, key, receiver));
    },
    // for (let i in array) ...
    ownKeys(target) {
        connectable_switcher_js_1.currentConnectable()?.observeProperty(target, 'length');
        return Reflect.ownKeys(target);
    },
};
function wrappedArrayMap(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.map((v, i) => 
    // do we wrap `thisArg`?
    unwrap(cb.call(thisArg, wrap(v), i, this)));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
function wrappedArrayEvery(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.every((v, i) => cb.call(thisArg, wrap(v), i, this));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArrayFilter(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.filter((v, i) => 
    // do we wrap `thisArg`?
    unwrap(cb.call(thisArg, wrap(v), i, this)));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
function wrappedArrayIncludes(v) {
    const raw = getRaw(this);
    const res = raw.includes(unwrap(v));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArrayIndexOf(v) {
    const raw = getRaw(this);
    const res = raw.indexOf(unwrap(v));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArrayLastIndexOf(v) {
    const raw = getRaw(this);
    const res = raw.lastIndexOf(unwrap(v));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArrayFindIndex(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.findIndex((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArrayFlat() {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(raw.flat());
}
function wrappedArrayFlatMap(cb, thisArg) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return getProxy(raw.flatMap((v, i) => wrap(cb.call(thisArg, wrap(v), i, this))));
}
function wrappedArrayJoin(separator) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return raw.join(separator);
}
function wrappedArrayPop() {
    return wrap(getRaw(this).pop());
}
function wrappedArrayPush(...args) {
    return getRaw(this).push(...args);
}
function wrappedArrayShift() {
    return wrap(getRaw(this).shift());
}
function wrappedArrayUnshift(...args) {
    return getRaw(this).unshift(...args);
}
function wrappedArraySplice(...args) {
    return wrap(getRaw(this).splice(...args));
}
function wrappedArrayReverse(...args) {
    const raw = getRaw(this);
    const res = raw.reverse();
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
function wrappedArraySome(cb, thisArg) {
    const raw = getRaw(this);
    const res = raw.some((v, i) => unwrap(cb.call(thisArg, wrap(v), i, this)));
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return res;
}
function wrappedArraySort(cb) {
    const raw = getRaw(this);
    const res = raw.sort(cb);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
function wrappedArraySlice(start, end) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return getProxy(raw.slice(start, end));
}
function wrappedReduce(cb, initValue) {
    const raw = getRaw(this);
    const res = raw.reduce((curr, v, i) => cb(curr, wrap(v), i, this), initValue);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
function wrappedReduceRight(cb, initValue) {
    const raw = getRaw(this);
    const res = raw.reduceRight((curr, v, i) => cb(curr, wrap(v), i, this), initValue);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(res);
}
// the below logic takes inspiration from Vue, Mobx
// much thanks to them for working out this
const collectionHandler = {
    get(target, key, receiver) {
        // maybe use symbol?
        if (key === exports.rawKey) {
            return target;
        }
        const connectable = connectable_switcher_js_1.currentConnectable();
        if (!connectable_switcher_js_1.connecting || doNotCollect(key) || connectable == null) {
            return R$get(target, key, receiver);
        }
        switch (key) {
            case 'size':
                connectable.observeProperty(target, 'size');
                return target.size;
            case 'clear':
                return wrappedClear;
            case 'delete':
                return wrappedDelete;
            case 'forEach':
                return wrappedForEach;
            case 'add':
                if (target instanceof Set) {
                    return wrappedAdd;
                }
                break;
            case 'get':
                if (target instanceof Map) {
                    return wrappedGet;
                }
                break;
            case 'set':
                if (target instanceof Map) {
                    return wrappedSet;
                }
                break;
            case 'has':
                return wrappedHas;
            case 'keys':
                return wrappedKeys;
            case 'values':
                return wrappedValues;
            case 'entries':
                return wrappedEntries;
            case Symbol.iterator:
                return target instanceof Map ? wrappedEntries : wrappedValues;
        }
        return wrap(R$get(target, key, receiver));
    },
};
function wrappedForEach(cb, thisArg) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return raw.forEach((v, key) => {
        cb.call(/* should wrap or not?? */ thisArg, wrap(v), wrap(key), this);
    });
}
function wrappedHas(v) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return raw.has(unwrap(v));
}
function wrappedGet(k) {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    return wrap(raw.get(unwrap(k)));
}
function wrappedSet(k, v) {
    return wrap(getRaw(this).set(unwrap(k), unwrap(v)));
}
function wrappedAdd(v) {
    return wrap(getRaw(this).add(unwrap(v)));
}
function wrappedClear() {
    return wrap(getRaw(this).clear());
}
function wrappedDelete(k) {
    return wrap(getRaw(this).delete(unwrap(k)));
}
function wrappedKeys() {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    const iterator = raw.keys();
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: wrap(value), done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
function wrappedValues() {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    const iterator = raw.values();
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: wrap(value), done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
function wrappedEntries() {
    const raw = getRaw(this);
    connectable_switcher_js_1.currentConnectable()?.observeCollection(raw);
    const iterator = raw.entries();
    // return a wrapped iterator which returns observed versions of the
    // values emitted from the real iterator
    return {
        next() {
            const next = iterator.next();
            const value = next.value;
            const done = next.done;
            return done
                ? { value: void 0, done }
                : { value: [wrap(value[0]), wrap(value[1])], done };
        },
        [Symbol.iterator]() {
            return this;
        },
    };
}
exports.ProxyObservable = Object.freeze({
    getProxy,
    getRaw,
    wrap,
    unwrap,
    rawKey: exports.rawKey,
});
//# sourceMappingURL=proxy-observation.js.map
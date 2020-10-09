import { SetterNotifier } from './setter-observer';
import { InternalObserversLookup } from './binding-context';
function getObserversLookup(obj) {
    let $observers = obj.$observers;
    if ($observers == null) {
        $observers = new InternalObserversLookup();
        if (!Reflect.defineProperty(obj, '$observers', { configurable: false, value: $observers })) {
            // todo: define in a weakmap
        }
    }
    return $observers;
}
const noValue = {};
// impl, wont be seen
export function observable(targetOrConfig, key, descriptor) {
    // either this check, or arguments.length === 3
    // or could be both, so can throw against user error for better DX
    if (key == null) {
        // for:
        //    @observable('prop')
        //    class {}
        //
        //    @observable({ name: 'prop', changeHandler: ... })
        //    class {}
        //
        //    class {
        //      @observable() prop
        //      @observable({ changeHandler: ... }) prop2
        //    }
        return ((t, k, d) => deco(t, k, d, targetOrConfig));
    }
    // for:
    //    class {
    //      @observable prop
    //    }
    return deco(targetOrConfig, key, descriptor);
    function deco(target, key, descriptor, config) {
        var _a;
        // class decorator?
        const isClassDecorator = key === void 0;
        config = typeof config !== 'object'
            ? { name: config }
            : (config || {});
        if (isClassDecorator) {
            key = config.name;
        }
        if (key == null || key === '') {
            throw new Error('Invalid usage, cannot determine property name for @observable');
        }
        // determine callback name based on config or convention.
        const callback = config.callback || `${String(key)}Changed`;
        let initialValue = noValue;
        if (descriptor) {
            // we're adding a getter and setter which means the property descriptor
            // cannot have a "value" or "writable" attribute
            delete descriptor.value;
            delete descriptor.writable;
            initialValue = (_a = descriptor.initializer) === null || _a === void 0 ? void 0 : _a.call(descriptor);
            delete descriptor.initializer;
        }
        else {
            descriptor = { configurable: true };
        }
        // make the accessor enumerable by default, as fields are enumerable
        if (!('enumerable' in descriptor)) {
            descriptor.enumerable = true;
        }
        // todo(bigopon/fred): discuss string api for converter
        const $set = config.set;
        descriptor.get = function g() {
            return getNotifier(this, key, callback, initialValue, $set).getValue();
        };
        descriptor.set = function s(newValue) {
            getNotifier(this, key, callback, initialValue, $set).setValue(newValue, 0 /* none */);
        };
        descriptor.get.getObserver = function gO(obj) {
            return getNotifier(obj, key, callback, initialValue, $set);
        };
        if (isClassDecorator) {
            Reflect.defineProperty(target.prototype, key, descriptor);
        }
        else {
            return descriptor;
        }
    }
}
class CallbackSubscriber {
    constructor(obj, key, cb) {
        this.obj = obj;
        this.key = key;
        this.cb = cb;
    }
    handleChange(value, oldValue) {
        this.cb.call(this.obj, value, oldValue, this.key);
    }
}
function getNotifier(obj, key, callbackKey, initialValue, set) {
    const lookup = getObserversLookup(obj);
    let notifier = lookup[key];
    if (notifier == null) {
        notifier = new SetterNotifier(set);
        lookup[key] = notifier;
        if (initialValue !== noValue) {
            notifier.setValue(initialValue, 0 /* none */);
        }
        const callback = obj[callbackKey];
        if (typeof callback === 'function') {
            notifier.subscribe(new CallbackSubscriber(obj, key, callback));
        }
    }
    return notifier;
}
/*
          | typescript       | babel
----------|------------------|-------------------------
property  | config           | config
w/parens  | target, key      | target, key, descriptor
----------|------------------|-------------------------
property  | target, key      | target, key, descriptor
no parens | n/a              | n/a
----------|------------------|-------------------------
class     | config           | config
          | target           | target
*/
//# sourceMappingURL=observable.js.map
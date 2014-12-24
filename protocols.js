
var Protocol = (function () {
    'use strict';
    
    function Protocol(spec) {
        if (!(this instanceof Protocol)) return new Protocol(spec);

        var protocol = this;

        protocol.__spec = spec;
        var types = protocol.__types = [];
        var implementations = protocol.__implementations = [];

        eachKeyOf(spec, function (methodName) {
            protocol[methodName] = function (value) {
                for (var i = 0; i < types.length; i++) {
                    if (hasType(value, types[i])) {
                        return implementations[i][methodName]
                            .apply(null, arguments);
                    }
                }
                throw new TypeError('No implementation of "' + 
                    methodName + '" for the value "' + value + '"');
            };
        });
    }

    Protocol.prototype.extendTo = function (type, implementation) {

        eachKeyOf(this.__spec, function (methodName, defaultMethod) {
            if (!(methodName in implementation)) {
                if (typeof(defaultMethod) === 'function') {
                    implementation[methodName] = defaultMethod;
                }
                else throw new TypeError(
                    'The protocol implementation for "' + type.name + 
                    '"" must contain the method "' + methodName + '"');
            }
        });

        for (var i = 0; i < this.__types.length; i++) {
            if (this.__types[i] === type) {
                throw new TypeError(
                    'The protocol is already implemented for the type "' + 
                    type.name + '"');
            }
        }

        this.__implementations.push(implementation);
        this.__types.push(type);

        return this;
    };

    Protocol.prototype.supports = function (type) {
        var types = this.__types;

        // if type is falsey match the type itself, 
        // to support null and undefined
        var exampleInstance = type ?
            objectCreate(type.prototype) :
            type;

        for (var i = 0; i < types.length; i++) {
            if (hasType(exampleInstance, types[i])) {
                return true;
            }
        }

        return false;
    };

    function hasType(x, type) {
        switch (typeof x) {
            case 'object': 
                if (typeof(type) === "function") {
                    return x instanceof type;
                }
                return x === null && type === null;
            case "number":
                return type === Number;
            case "string":
                return type === String;
            case "boolean":
                return type === Boolean;
            case "undefined":
                return type === undefined;
            case "function":
                return type === Function;
            case "symbol":
                return type === Symbol;
            default:
                return false;
        }
    }

    // Utility functions

    function eachKeyOf(obj, callback) {
        for (var key in obj) {
            callback(key, obj[key]);
        }
    }

    var objectCreate = typeof Object.create === 'function' ?
        Object.create :
        (function () {
            var Obj = function () {};
            return function (prototype) {
                Obj.prototype = prototype;
                var result = new Obj();
                Obj.prototype = null;
                return result;
            };
        })();
    
    return Protocol;
}());

if (typeof module === 'object') {
    module.exports = Protocol;
}
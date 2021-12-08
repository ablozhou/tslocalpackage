"use strict";
exports.__esModule = true;
var Hello = /** @class */ (function () {
    function Hello(message) {
        this.greeting = message;
    }
    Hello.prototype.greet = function (name) {
        var say = "Hello ".concat(name, "!");
        console.log(say);
        return say;
    };
    return Hello;
}());
exports["default"] = Hello;

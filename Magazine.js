"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Magazine = void 0;
var Magazine = /** @class */ (function () {
    function Magazine(id, title) {
        this.id = id;
        this.title = title;
    }
    Magazine.prototype.getId = function () {
        return this.id;
    };
    Magazine.prototype.getTitle = function () {
        return this.title;
    };
    return Magazine;
}());
exports.Magazine = Magazine;

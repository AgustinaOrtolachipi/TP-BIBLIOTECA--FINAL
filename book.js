"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
var Book = /** @class */ (function () {
    function Book(id, title) {
        this.id = id;
        this.title = title;
    }
    Book.prototype.getId = function () {
        return this.id;
    };
    Book.prototype.getTitle = function () {
        return this.title;
    };
    return Book;
}());
exports.Book = Book;

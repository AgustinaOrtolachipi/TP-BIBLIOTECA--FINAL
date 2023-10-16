"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
var Loan = /** @class */ (function () {
    function Loan(user, item, startDate) {
        if (startDate === void 0) { startDate = new Date(); }
        this.user = user;
        this.item = item;
        this.returned = false;
        this.startDate = startDate;
    }
    Loan.prototype.getUser = function () {
        return this.user;
    };
    Loan.prototype.getItem = function () {
        return this.item;
    };
    Loan.prototype.getStartDate = function () {
        return this.startDate;
    };
    Loan.prototype.isReturned = function () {
        return this.returned;
    };
    Loan.prototype.returnItem = function () {
        this.returned = true;
    };
    return Loan;
}());
exports.Loan = Loan;

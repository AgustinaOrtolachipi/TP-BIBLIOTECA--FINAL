"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(id, username) {
        this.id = id;
        this.username = username;
        this.scoring = 0;
        this.penalized = false;
        this.isActive = true; // El usuario está activo al crear la membresía
    }
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.getUsername = function () {
        return this.username;
    };
    User.prototype.getScoring = function () {
        return this.scoring;
    };
    User.prototype.isPenalized = function () {
        return this.penalized;
    };
    User.prototype.isMemberActive = function () {
        return this.isActive;
    };
    User.prototype.updateScoring = function (points) {
        this.scoring += points;
        if (this.scoring >= 6) {
            this.penalized = true;
            this.isActive = false; // Desactivar la membresía al alcanzar 6 puntos de penalización
        }
    };
    User.prototype.addPenalty = function (points) {
        this.scoring += points;
        if (this.scoring >= 6) {
            this.penalized = true;
            this.isActive = false; // Desactivar la membresía al alcanzar 6 puntos de penalización
        }
    };
    User.prototype.cancelMembership = function () {
        this.isActive = false; // Cancelar la membresía del usuario
    };
    return User;
}());
exports.User = User;

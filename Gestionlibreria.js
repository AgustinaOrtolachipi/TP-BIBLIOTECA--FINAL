"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
var inquirer_1 = require("inquirer");
var fs_1 = require("fs");
var User_1 = require("../TP BIBLIOTECA/User");
var Book_1 = require("../TP BIBLIOTECA/Book");
var Magazine_1 = require("../TP BIBLIOTECA/Magazine");
var Loan_1 = require("../TP BIBLIOTECA/Loan");
var LibraryService = /** @class */ (function () {
    function LibraryService() {
        this.users = [];
        this.books = [];
        this.magazines = [];
        this.loans = [];
    }
    LibraryService.prototype.createUser = function (userId, username) {
        var user = new User_1.User(userId, username);
        this.users.push(user);
        return user;
    };
    LibraryService.prototype.createBook = function (bookId, title) {
        var book = new Book_1.Book(bookId, title);
        this.books.push(book);
        return book;
    };
    LibraryService.prototype.createMagazine = function (magazineId, title) {
        var magazine = new Magazine_1.Magazine(magazineId, title);
        this.magazines.push(magazine);
        return magazine;
    };
    LibraryService.prototype.borrowItem = function (user, item) {
        // Verificar si el usuario está penalizado
        if (user.isPenalized()) {
            console.log('El usuario está penalizado y no puede realizar préstamos.');
            return;
        }
        // Verificar si el ítem ya está prestado
        if (this.isItemBorrowed(item)) {
            console.log('El ítem ya está prestado por otro usuario.');
            return;
        }
        var loan = new Loan_1.Loan(user, item);
        this.loans.push(loan);
        // Registrar el préstamo en un archivo
        this.logLoan(loan);
        // Actualizar el scoring del usuario
        user.updateScoring(1); // El usuario devuelve el ítem a tiempo y se reduce el scoring
        console.log('Ítem prestado con éxito.');
    };
    LibraryService.prototype.returnItem = function (user, item) {
        var loan = this.findLoanByUserAndItem(user, item);
        if (!loan) {
            console.log('El usuario no tiene este ítem prestado.');
            return;
        }
        if (loan.isReturned()) {
            console.log('El ítem ya ha sido devuelto.');
            return;
        }
        loan.returnItem();
        // Calcular la penalización
        var penalty = this.calculatePenalty(loan);
        if (penalty > 0) {
            user.addPenalty(penalty);
            console.log("El usuario ha recibido una penalizaci\u00F3n de ".concat(penalty, " puntos."));
        }
        // Registrar el retorno del ítem en el archivo
        this.logReturn(loan);
        console.log('Ítem devuelto con éxito.');
    };
    LibraryService.prototype.listLoanHistory = function () {
        console.log('Historial de préstamos:');
        this.loans.forEach(function (loan) {
            var username = loan.getUser().getUsername();
            var itemTitle = loan.getItem().getTitle();
            var startDate = loan.getStartDate().toDateString();
            var isReturned = loan.isReturned() ? 'Sí' : 'No';
            console.log("Usuario: ".concat(username, ", \u00CDtem: ").concat(itemTitle, ", Fecha de inicio: ").concat(startDate, ", Devuelto: ").concat(isReturned));
        });
    };
    LibraryService.prototype.mainMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answer, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'list',
                                name: 'option',
                                message: 'Menú de opciones:',
                                choices: [
                                    'Crear usuario',
                                    'Crear libro',
                                    'Crear revista',
                                    'Prestar ítem',
                                    'Devolver ítem',
                                    'Listar historial de préstamos',
                                    'Salir',
                                ],
                            },
                        ])];
                    case 1:
                        answer = _b.sent();
                        _a = answer.option;
                        switch (_a) {
                            case 'Crear usuario': return [3 /*break*/, 2];
                            case 'Crear libro': return [3 /*break*/, 4];
                            case 'Crear revista': return [3 /*break*/, 6];
                            case 'Prestar ítem': return [3 /*break*/, 8];
                            case 'Devolver ítem': return [3 /*break*/, 10];
                            case 'Listar historial de préstamos': return [3 /*break*/, 12];
                            case 'Salir': return [3 /*break*/, 13];
                        }
                        return [3 /*break*/, 14];
                    case 2: return [4 /*yield*/, this.createUserMenu()];
                    case 3:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 4: return [4 /*yield*/, this.createBookMenu()];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 6: return [4 /*yield*/, this.createMagazineMenu()];
                    case 7:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 8: return [4 /*yield*/, this.borrowItemMenu()];
                    case 9:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 10: return [4 /*yield*/, this.returnItemMenu()];
                    case 11:
                        _b.sent();
                        return [3 /*break*/, 14];
                    case 12:
                        this.listLoanHistory();
                        return [3 /*break*/, 14];
                    case 13:
                        process.exit(0);
                        _b.label = 14;
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.createUserMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'userId',
                                message: 'Ingrese el ID del usuario:',
                            },
                            {
                                type: 'input',
                                name: 'username',
                                message: 'Ingrese el nombre de usuario:',
                            },
                        ])];
                    case 1:
                        answers = _a.sent();
                        this.createUser(answers.userId, answers.username);
                        console.log('Usuario creado con éxito.');
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.createBookMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'bookId',
                                message: 'Ingrese el ID del libro:',
                            },
                            {
                                type: 'input',
                                name: 'title',
                                message: 'Ingrese el título del libro:',
                            },
                        ])];
                    case 1:
                        answers = _a.sent();
                        this.createBook(answers.bookId, answers.title);
                        console.log('Libro creado con éxito.');
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.createMagazineMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var answers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'magazineId',
                                message: 'Ingrese el ID de la revista:',
                            },
                            {
                                type: 'input',
                                name: 'title',
                                message: 'Ingrese el título de la revista:',
                            },
                        ])];
                    case 1:
                        answers = _a.sent();
                        this.createMagazine(answers.magazineId, answers.title);
                        console.log('Revista creada con éxito.');
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.borrowItemMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userAnswers, user, itemAnswers, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'userId',
                                message: 'Ingrese el ID del usuario:',
                            },
                        ])];
                    case 1:
                        userAnswers = _a.sent();
                        user = this.findUserById(userAnswers.userId);
                        if (!user) {
                            console.log('Usuario no encontrado.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'itemId',
                                    message: 'Ingrese el ID del ítem a prestar:',
                                },
                            ])];
                    case 2:
                        itemAnswers = _a.sent();
                        item = this.findItemById(itemAnswers.itemId);
                        if (!item) {
                            console.log('Ítem no encontrado.');
                            return [2 /*return*/];
                        }
                        this.borrowItem(user, item);
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.returnItemMenu = function () {
        return __awaiter(this, void 0, void 0, function () {
            var userAnswers, user, itemAnswers, item;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, inquirer_1.default.prompt([
                            {
                                type: 'input',
                                name: 'userId',
                                message: 'Ingrese el ID del usuario:',
                            },
                        ])];
                    case 1:
                        userAnswers = _a.sent();
                        user = this.findUserById(userAnswers.userId);
                        if (!user) {
                            console.log('Usuario no encontrado.');
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, inquirer_1.default.prompt([
                                {
                                    type: 'input',
                                    name: 'itemId',
                                    message: 'Ingrese el ID del ítem a devolver:',
                                },
                            ])];
                    case 2:
                        itemAnswers = _a.sent();
                        item = this.findItemById(itemAnswers.itemId);
                        if (!item) {
                            console.log('Ítem no encontrado.');
                            return [2 /*return*/];
                        }
                        this.returnItem(user, item);
                        return [2 /*return*/];
                }
            });
        });
    };
    LibraryService.prototype.isItemBorrowed = function (item) {
        return this.loans.some(function (loan) { return loan.getItem() === item && !loan.isReturned(); });
    };
    LibraryService.prototype.calculatePenalty = function (loan) {
        var startDate = loan.getStartDate();
        var returnDate = new Date();
        var daysDiff = Math.floor((returnDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
            return 2;
        }
        else if (daysDiff >= 2 && daysDiff <= 5) {
            return 3;
        }
        else if (daysDiff > 5 && daysDiff <= 10) {
            return 6;
        }
        else if (daysDiff > 10) {
            // Cancelar la membresía del usuario
            var User_2 = loan.getUser();
            User_2.cancelMembership();
        }
        return 0;
    };
    LibraryService.prototype.logLoan = function (loan) {
        var logEntry = "Pr\u00E9stamo: Usuario - ".concat(loan.getUser().getUsername(), ", \u00CDtem - ").concat(loan.getItem().getTitle(), ", Fecha - ").concat(loan.getStartDate());
        fs_1.default.appendFileSync('loan-history.txt', logEntry + '\n');
    };
    LibraryService.prototype.logReturn = function (loan) {
        var logEntry = "Devoluci\u00F3n: Usuario - ".concat(loan.getUser().getUsername(), ", \u00CDtem - ").concat(loan.getItem().getTitle(), ", Fecha - ").concat(new Date().toDateString());
        fs_1.default.appendFileSync('loan-history.txt', logEntry + '\n');
    };
    LibraryService.prototype.findLoanByUserAndItem = function (user, item) {
        return this.loans.find(function (loan) { return loan.getUser() === user && loan.getItem() === item; });
    };
    LibraryService.prototype.findUserById = function (userId) {
        return this.users.find(function (user) { return user.getId() === userId; });
    };
    LibraryService.prototype.findItemById = function (itemId) {
        return __spreadArray(__spreadArray([], this.books, true), this.magazines, true).find(function (item) { return item.getId() === itemId; });
    };
    return LibraryService;
}());
exports.LibraryService = LibraryService;
var libraryService = new LibraryService();
libraryService.mainMenu();

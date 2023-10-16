import inquirer from 'inquirer';
import fs from 'fs';
import { User } from '../TP BIBLIOTECA/User';
import { Book } from '../TP BIBLIOTECA/Book';
import { Magazine } from '../TP BIBLIOTECA/Magazine';
import { Loan } from '../TP BIBLIOTECA/Loan';

export class LibraryService {
  private users: User[] = [];
  private books: Book[] = [];
  private magazines: Magazine[] = [];
  private loans: Loan[] = [];

  createUser(userId: string, username: string): User {
    const user = new User(userId, username);
    this.users.push(user);
    return user;
  }

  createBook(bookId: string, title: string): Book {
    const book = new Book(bookId, title);
    this.books.push(book);
    return book;
  }

  createMagazine(magazineId: string, title: string): Magazine {
    const magazine = new Magazine(magazineId, title);
    this.magazines.push(magazine);
    return magazine;
  }

  borrowItem(user: User, item: Book | Magazine) {
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

    const loan = new Loan(user, item);
    this.loans.push(loan);

    // Registrar el préstamo en un archivo
    this.logLoan(loan);

    // Actualizar el scoring del usuario
    user.updateScoring(1); // El usuario devuelve el ítem a tiempo y se reduce el scoring

    console.log('Ítem prestado con éxito.');
  }

  returnItem(user: User, item: Book | Magazine) {
    const loan = this.findLoanByUserAndItem(user, item);
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
    const penalty = this.calculatePenalty(loan);
    if (penalty > 0) {
      user.addPenalty(penalty);
      console.log(`El usuario ha recibido una penalización de ${penalty} puntos.`);
    }

    // Registrar el retorno del ítem en el archivo
    this.logReturn(loan);

    console.log('Ítem devuelto con éxito.');
  }

  listLoanHistory() {
    console.log('Historial de préstamos:');
    this.loans.forEach((loan) => {
      const username = loan.getUser().getUsername();
      const itemTitle = loan.getItem().getTitle();
      const startDate = loan.getStartDate().toDateString();
      const isReturned = loan.isReturned() ? 'Sí' : 'No';
      console.log(`Usuario: ${username}, Ítem: ${itemTitle}, Fecha de inicio: ${startDate}, Devuelto: ${isReturned}`);
    });
  }

  async mainMenu() {
    const answer = await inquirer.prompt([
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
    ]);

    switch (answer.option) {
      case 'Crear usuario':
        await this.createUserMenu();
        break;
      case 'Crear libro':
        await this.createBookMenu();
        break;
      case 'Crear revista':
        await this.createMagazineMenu();
        break;
      case 'Prestar ítem':
        await this.borrowItemMenu();
        break;
      case 'Devolver ítem':
        await this.returnItemMenu();
        break;
      case 'Listar historial de préstamos':
        this.listLoanHistory();
        break;
      case 'Salir':
        process.exit(0);
    }
  }

  async createUserMenu() {
    const answers = await inquirer.prompt([
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
    ]);

    this.createUser(answers.userId, answers.username);
    console.log('Usuario creado con éxito.');
  }

  async createBookMenu() {
    const answers = await inquirer.prompt([
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
    ]);

    this.createBook(answers.bookId, answers.title);
    console.log('Libro creado con éxito.');
  }

  async createMagazineMenu() {
    const answers = await inquirer.prompt([
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
    ]);

    this.createMagazine(answers.magazineId, answers.title);
    console.log('Revista creada con éxito.');
  }

  async borrowItemMenu() {
    const userAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: 'Ingrese el ID del usuario:',
      },
    ]);

    const user = this.findUserById(userAnswers.userId);
    if (!user) {
      console.log('Usuario no encontrado.');
      return;
    }

    const itemAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'itemId',
        message: 'Ingrese el ID del ítem a prestar:',
      },
    ]);

    const item = this.findItemById(itemAnswers.itemId);
    if (!item) {
      console.log('Ítem no encontrado.');
      return;
    }

    this.borrowItem(user, item);
  }

  async returnItemMenu() {
    const userAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'userId',
        message: 'Ingrese el ID del usuario:',
      },
    ]);

    const user = this.findUserById(userAnswers.userId);
    if (!user) {
      console.log('Usuario no encontrado.');
      return;
    }

    const itemAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'itemId',
        message: 'Ingrese el ID del ítem a devolver:',
      },
    ]);

    const item = this.findItemById(itemAnswers.itemId);
    if (!item) {
      console.log('Ítem no encontrado.');
      return;
    }

    this.returnItem(user, item);
  }

  private isItemBorrowed(item: Book | Magazine) {
    return this.loans.some((loan) => loan.getItem() === item && !loan.isReturned());
  }

  private calculatePenalty(loan: Loan): number {
    const startDate = loan.getStartDate();
    const returnDate = new Date();
    const daysDiff = Math.floor((returnDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      return 2;
    } else if (daysDiff >= 2 && daysDiff <= 5) {
      return 3;
    } else if (daysDiff > 5 && daysDiff <= 10) {
      return 6;
    } else if (daysDiff > 10) {
      // Cancelar la membresía del usuario
      const User = loan.getUser();
      User.cancelMembership();
    }

    return 0;
  }

  private logLoan(loan: Loan) {
    const logEntry = `Préstamo: Usuario - ${loan.getUser().getUsername()}, Ítem - ${loan.getItem().getTitle()}, Fecha - ${loan.getStartDate()}`;
    fs.appendFileSync('loan-history.txt', logEntry + '\n');
  }

  private logReturn(loan: Loan) {
    const logEntry = `Devolución: Usuario - ${loan.getUser().getUsername()}, Ítem - ${loan.getItem().getTitle()}, Fecha - ${new Date().toDateString()}`;
    fs.appendFileSync('loan-history.txt', logEntry + '\n');
  }

  private findLoanByUserAndItem(user: User, item: Book | Magazine): Loan | undefined {
    return this.loans.find((loan) => loan.getUser() === user && loan.getItem() === item);
  }

  private findUserById(userId: string): User | undefined {
    return this.users.find((user) => user.getId() === userId);
  }

  private findItemById(itemId: string): Book | Magazine | undefined {
    return [...this.books, ...this.magazines].find((item) => item.getId() === itemId);
  }
}

const libraryService = new LibraryService();
libraryService.mainMenu();


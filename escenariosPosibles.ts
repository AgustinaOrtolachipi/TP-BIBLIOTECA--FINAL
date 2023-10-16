// Importar las clases y funciones relevantes

import { LibraryService } from './Gestionlibreria';
import { User } from './User';
import { Book } from './Book';
import { Magazine } from './Magazine';
import { Loan } from './Loan';

// Casos de prueba
const testCases = async () => {
  const libraryService = new LibraryService();

  // Crear usuario y ítem
  const user = libraryService.createUser('1', 'Anna');
  const book = libraryService.createBook('B1', 'Libro 1');
  const magazine = libraryService.createMagazine('M1', 'Revista 1');

  // Prestar un ítem
  libraryService.borrowItem(user, book);
  libraryService.borrowItem(user, magazine);

  // Devolver un ítem a tiempo
  libraryService.returnItem(user, book);
  libraryService.returnItem(user, magazine);

  // Devolver un ítem tarde
  const lateReturnDate = new Date();
  lateReturnDate.setDate(lateReturnDate.getDate() + 11);
  const lateLoan = new Loan(user, book, lateReturnDate); // Simular un préstamo con fecha de retorno tardía
  libraryService.returnItem(user, book); // Devolver el ítem tarde

  // Listar historial de préstamos
  libraryService.listLoanHistory();
};

testCases();

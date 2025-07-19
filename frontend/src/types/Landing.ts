export interface IReader {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface IBook {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  available: boolean;
}

export interface ILending {
  _id: string;
  reader: IReader;
  book: IBook;
  lendDate: string;
  dueDate: string;
  returned: boolean;
}

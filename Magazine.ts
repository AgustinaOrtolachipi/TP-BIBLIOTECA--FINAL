


export class Magazine {
    private id: string;
    private title: string;
  
    constructor(id: string, title: string) {
      this.id = id;
      this.title = title;
    }
  
    getId(): string {
      return this.id;
    }
  
    getTitle(): string {
      return this.title;
    }
  }
  
  
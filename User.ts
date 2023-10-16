

export class User {
    private id: string;
    private username: string;
    private scoring: number;
    private penalized: boolean;
    private isActive: boolean; // Agregamos un estado para la membresía
  
    constructor(id: string, username: string) {
      this.id = id;
      this.username = username;
      this.scoring = 0;
      this.penalized = false;
      this.isActive = true; // El usuario está activo al crear la membresía
    }
  
    getId(): string {
      return this.id;
    }
  
    getUsername(): string {
      return this.username;
    }
  
    getScoring(): number {
      return this.scoring;
    }
  
    isPenalized(): boolean {
      return this.penalized;
    }
  
    isMemberActive(): boolean {
      return this.isActive;
    }
  
    updateScoring(points: number) {
      this.scoring += points;
      if (this.scoring >= 6) {
        this.penalized = true;
        this.isActive = false; // Desactivar la membresía al alcanzar 6 puntos de penalización
      }
    }
  
    addPenalty(points: number) {
      this.scoring += points;
      if (this.scoring >= 6) {
        this.penalized = true;
        this.isActive = false; // Desactivar la membresía al alcanzar 6 puntos de penalización
      }
    }
  
    cancelMembership() {
      this.isActive = false; // Cancelar la membresía del usuario
    }
  }
  
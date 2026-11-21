export interface Reservavel {
  readonly estaReservado: boolean;
  reservar(usuario: string): void;
  cancelarReserva(): void;
}

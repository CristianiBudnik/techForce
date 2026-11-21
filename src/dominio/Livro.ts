import { ItemIndisponivelError, ValidacaoError } from "../excecoes/erros";
import { ItemAcervo } from "./ItemAcervo";
import { Reservavel } from "./Reservavel";

export class Livro extends ItemAcervo implements Reservavel {
  private static readonly _multaPorDia = 1.5;
  private static readonly _multaMaxima = 50;

  constructor(
    titulo: string,
    anoPublicacao: number,
    private readonly _autor: string,
    private readonly _paginas: number,
    id?: number
  ) {
    super(titulo, anoPublicacao, 14, id);
    const autorAjustado = this._autor.trim();
    if (!autorAjustado) {
      throw new ValidacaoError("O autor do livro não pode ficar vazio.");
    }
    if (!Number.isInteger(this._paginas) || this._paginas <= 0) {
      throw new ValidacaoError("O número de páginas deve ser um inteiro positivo.");
    }
    this._autor = autorAjustado;
  }

  override get tipo(): string {
    return "Livro";
  }

  get autor(): string {
    return this._autor;
  }

  get paginas(): number {
    return this._paginas;
  }

  get estaReservado(): boolean {
    return this._reservadoPor !== null;
  }

  get reservadoPor(): string | null {
    return this._reservadoPor;
  }

  override calcularMulta(diasAtraso: number): number {
    return Math.min(diasAtraso * Livro._multaPorDia, Livro._multaMaxima);
  }

  override descricao(): string {
    return `${super.descricao()} - Autor: ${this._autor} - Páginas: ${this._paginas}`;
  }

  reservar(usuario: string): void {
    if (this.statusDisponibilidade !== "Emprestado") {
      throw new ItemIndisponivelError(`O livro "${this.titulo}" precisa estar emprestado para ser reservado.`);
    }
    if (this.estaReservado) {
      throw new ItemIndisponivelError(`O livro "${this.titulo}" já está reservado por ${this._reservadoPor}.`);
    }
    const nome = usuario.trim();
    if (!nome) {
      throw new ValidacaoError("Informe o nome do usuário para registrar a reserva.");
    }
    this._reservadoPor = nome;
  }

  cancelarReserva(): void {
    if (!this.estaReservado) {
      throw new ItemIndisponivelError(`O livro "${this.titulo}" não possui reserva ativa.`);
    }
    this._reservadoPor = null;
  }

  private _reservadoPor: string | null = null;
}

import { ItemIndisponivelError, ValidacaoError } from "../excecoes/erros";

export type StatusDisponibilidade = "Disponível" | "Emprestado";

const MILISSEGUNDOS_POR_DIA = 86_400_000;

export abstract class ItemAcervo {
  private static _contadorId = 0;

  constructor(
    private readonly _titulo: string,
    private readonly _anoPublicacao: number,
    private readonly _prazoDias: number,
    public readonly id: number = ++ItemAcervo._contadorId
  ) {
    if (!_titulo.trim()) {
      throw new ValidacaoError("O título do item não pode ficar vazio.");
    }
    if (!Number.isInteger(_anoPublicacao) || _anoPublicacao < 0) {
      throw new ValidacaoError("O ano de publicação deve ser um inteiro não negativo.");
    }
    if (!Number.isInteger(_prazoDias) || _prazoDias <= 0) {
      throw new ValidacaoError("O prazo de empréstimo deve ser um inteiro positivo.");
    }
    this._titulo = _titulo.trim();
  }

  abstract get tipo(): string;

  abstract calcularMulta(diasAtraso: number): number;

  get titulo(): string {
    return this._titulo;
  }

  get anoPublicacao(): number {
    return this._anoPublicacao;
  }

  get prazoDias(): number {
    return this._prazoDias;
  }

  get statusDisponibilidade(): StatusDisponibilidade {
    return this._dataEmprestimo === null ? "Disponível" : "Emprestado";
  }

  get tempoEmprestado(): number {
    if (this._dataEmprestimo === null) {
      return 0;
    }
    const dias = Math.floor((Date.now() - this._dataEmprestimo.getTime()) / MILISSEGUNDOS_POR_DIA);
    return Math.max(0, dias);
  }

  get dataEmprestimo(): Date | null {
    return this._dataEmprestimo === null ? null : new Date(this._dataEmprestimo.getTime());
  }

  emprestar(data: Date = new Date()): void {
    this.validarData(data);
    if (this._dataEmprestimo !== null) {
      throw new ItemIndisponivelError(`O item "${this._titulo}" já está emprestado.`);
    }
    this._dataEmprestimo = new Date(data.getTime());
  }

  devolver(data: Date = new Date()): number {
    this.validarData(data);
    if (this._dataEmprestimo === null) {
      throw new ItemIndisponivelError(`O item "${this._titulo}" não está emprestado.`);
    }
    const diasDecorridos = Math.max(
      0,
      Math.floor((data.getTime() - this._dataEmprestimo.getTime()) / MILISSEGUNDOS_POR_DIA)
    );
    const diasAtraso = diasDecorridos - this._prazoDias;
    this._dataEmprestimo = null;
    return diasAtraso > 0 ? this.calcularMulta(diasAtraso) : 0;
  }

  descricao(): string {
    return `${this.tipo} "${this._titulo}" (${this._anoPublicacao}) - Prazo: ${this._prazoDias} dias - ${this.statusDisponibilidade}`;
  }

  private validarData(data: Date): void {
    if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
      throw new ValidacaoError("A data informada é inválida.");
    }
  }

  private _dataEmprestimo: Date | null = null;
}

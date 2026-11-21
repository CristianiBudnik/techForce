import { ValidacaoError } from "../excecoes/erros";
import { ItemAcervo } from "./ItemAcervo";

export class JogoEletronico extends ItemAcervo {
  private static readonly _multaFixa = 5;
  private static readonly _multaPorDia = 3;

  constructor(titulo: string, anoPublicacao: number, private readonly _plataforma: string, id?: number) {
    super(titulo, anoPublicacao, 7, id);
    const plataformaAjustada = this._plataforma.trim();
    if (!plataformaAjustada) {
      throw new ValidacaoError("A plataforma do jogo não pode ficar vazia.");
    }
    this._plataforma = plataformaAjustada;
  }

  override get tipo(): string {
    return "Jogo eletrônico";
  }

  get plataforma(): string {
    return this._plataforma;
  }

  override calcularMulta(diasAtraso: number): number {
    return JogoEletronico._multaFixa + diasAtraso * JogoEletronico._multaPorDia;
  }

  override descricao(): string {
    return `${super.descricao()} - Plataforma: ${this._plataforma}`;
  }
}

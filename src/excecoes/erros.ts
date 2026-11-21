export class ErroDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidacaoError extends ErroDominio {}

export class ItemNaoEncontradoError extends ErroDominio {
  constructor(public readonly id: number) {
    super(`Item com id ${id} não encontrado no acervo.`);
  }
}

export class ItemIndisponivelError extends ErroDominio {}

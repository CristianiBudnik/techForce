import { ItemNaoEncontradoError } from "../excecoes/erros";

export class RepositorioMemoria<T extends { readonly id: number }> {
  constructor(private readonly _itens: T[] = []) {
    this._itens = [..._itens];
  }

  get quantidade(): number {
    return this._itens.length;
  }

  adicionar(item: T): T {
    this._itens.push(item);
    return item;
  }

  buscarPorId(id: number): T {
    const item = this._itens.find((candidato) => candidato.id === id);
    if (item === undefined) {
      throw new ItemNaoEncontradoError(id);
    }
    return item;
  }

  listar(): ReadonlyArray<T> {
    return [...this._itens];
  }

  filtrar(predicado: (item: T) => boolean): ReadonlyArray<T> {
    return this._itens.filter(predicado);
  }

  remover(id: number): T {
    const item = this.buscarPorId(id);
    const indice = this._itens.findIndex((candidato) => candidato.id === id);
    this._itens.splice(indice, 1);
    return item;
  }
}

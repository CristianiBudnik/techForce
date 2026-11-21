import { ItemAcervo } from "./ItemAcervo";
import { Livro } from "./Livro";

export interface DadosLivro {
  readonly id: number;
  readonly titulo: string;
  readonly anoPublicacao: number;
  readonly autor: string;
  readonly paginas: number;
}

export type ResumoItem = Pick<ItemAcervo, "id" | "titulo" | "statusDisponibilidade">;

export type NovoLivro = Omit<DadosLivro, "id">;

export type FiltroBusca = Partial<Pick<DadosLivro, "titulo" | "autor">>;

export function paraResumo(item: ItemAcervo): ResumoItem {
  return {
    id: item.id,
    titulo: item.titulo,
    statusDisponibilidade: item.statusDisponibilidade
  };
}

export function criarLivro(dados: NovoLivro): Livro {
  return new Livro(dados.titulo, dados.anoPublicacao, dados.autor, dados.paginas);
}

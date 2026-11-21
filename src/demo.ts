import { ErroDominio } from "./excecoes/erros";
import { ItemAcervo } from "./dominio/ItemAcervo";
import { JogoEletronico } from "./dominio/JogoEletronico";
import { Livro } from "./dominio/Livro";
import { criarLivro, paraResumo } from "./dominio/tipos";
import { RepositorioMemoria } from "./repositorio/RepositorioMemoria";

const repositorio = new RepositorioMemoria<ItemAcervo>();

function tentar<T>(descricao: string, acao: () => T): T | undefined {
  try {
    return acao();
  } catch (erro) {
    if (erro instanceof ErroDominio) {
      console.log(`Erro ao ${descricao}: ${erro.message}`);
      return undefined;
    }
    throw erro;
  }
}

function imprimirAcervo(tituloSecao: string): void {
  console.log(`\n${tituloSecao}`);
  console.log("-".repeat(tituloSecao.length));
  for (const item of repositorio.listar()) {
    const resumo = paraResumo(item);
    console.log(`#${resumo.id} | ${resumo.titulo} | ${resumo.statusDisponibilidade}`);
    console.log(`  ${item.descricao()}`);
    if (item instanceof Livro && item.estaReservado) {
      console.log(`  Reservado por: ${item.reservadoPor}`);
    }
  }
}

function imprimirResumos(): void {
  console.log("\nResumos gerados com paraResumo:");
  for (const item of repositorio.listar()) {
    console.log(`  ${JSON.stringify(paraResumo(item))}`);
  }
}

console.log("=== Demonstração automática: Acervo Biblioteca ===");

const livro = criarLivro({
  titulo: "Dom Casmurro",
  anoPublicacao: 1899,
  autor: "Machado de Assis",
  paginas: 256
});
const jogo = new JogoEletronico("Tetris", 1984, "Atari");

repositorio.adicionar(livro);
repositorio.adicionar(jogo);

imprimirAcervo("Acervo inicial");

const dataEmprestimo = new Date("2026-01-01T00:00:00Z");
const dataDevolucaoLivro = new Date("2026-01-20T00:00:00Z");
const dataDevolucaoJogo = new Date("2026-01-12T00:00:00Z");

tentar("emprestar o livro", () => livro.emprestar(dataEmprestimo));
tentar("emprestar o jogo", () => jogo.emprestar(dataEmprestimo));
tentar("emprestar o livro novamente", () => livro.emprestar(dataEmprestimo));
imprimirAcervo("Após os empréstimos");

tentar("reservar o livro para Ana", () => livro.reservar("Ana"));
tentar("reservar o livro novamente para Bruno", () => livro.reservar("Bruno"));
imprimirAcervo("Após as reservas");

const multaLivro = tentar("devolver o livro com atraso", () => livro.devolver(dataDevolucaoLivro));
const multaJogo = tentar("devolver o jogo com atraso", () => jogo.devolver(dataDevolucaoJogo));

if (multaLivro !== undefined) {
  console.log(`\nMulta do livro: R$ ${multaLivro.toFixed(2)}`);
}
if (multaJogo !== undefined) {
  console.log(`Multa do jogo: R$ ${multaJogo.toFixed(2)}`);
}

imprimirAcervo("Após as devoluções");
imprimirResumos();

tentar("buscar o id 999", () => repositorio.buscarPorId(999));

console.log("\nDemonstração concluída.");

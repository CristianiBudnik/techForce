import { createInterface } from "node:readline/promises";
import { stdin as entrada, stdout as saida } from "node:process";
import { ErroDominio, ItemIndisponivelError, ValidacaoError } from "./excecoes/erros";
import { ItemAcervo } from "./dominio/ItemAcervo";
import { JogoEletronico } from "./dominio/JogoEletronico";
import { Livro } from "./dominio/Livro";
import { criarLivro, paraResumo } from "./dominio/tipos";
import { RepositorioMemoria } from "./repositorio/RepositorioMemoria";

const repositorio = new RepositorioMemoria<ItemAcervo>();
const leitor = createInterface({ input: entrada, output: saida });

const livroExemplo = criarLivro({
  titulo: "Dom Casmurro",
  anoPublicacao: 1899,
  autor: "Machado de Assis",
  paginas: 256
});
const jogoExemplo = new JogoEletronico("Tetris", 1984, "Atari");
repositorio.adicionar(livroExemplo);
repositorio.adicionar(jogoExemplo);

function exibirMenu(): void {
  console.log("\n===== Acervo Biblioteca =====");
  console.log("1 - Listar");
  console.log("2 - Cadastrar livro");
  console.log("3 - Cadastrar jogo");
  console.log("4 - Emprestar");
  console.log("5 - Devolver");
  console.log("6 - Reservar livro");
  console.log("7 - Cancelar reserva");
  console.log("0 - Sair");
}

async function lerTexto(mensagem: string): Promise<string> {
  return (await leitor.question(mensagem)).trim();
}

async function lerInteiro(mensagem: string): Promise<number> {
  const texto = await lerTexto(mensagem);
  const numero = Number(texto);
  if (texto === "" || !Number.isInteger(numero)) {
    throw new ValidacaoError("Informe um número inteiro válido.");
  }
  return numero;
}

function listarAcervo(): void {
  const itens = repositorio.listar();
  if (itens.length === 0) {
    console.log("O acervo está vazio.");
    return;
  }
  console.log(`\nAcervo (${repositorio.quantidade} item(ns)):`);
  for (const item of itens) {
    const resumo = paraResumo(item);
    console.log(`#${resumo.id} | ${resumo.titulo} | ${resumo.statusDisponibilidade}`);
    console.log(`  ${item.descricao()}`);
    if (item instanceof Livro && item.estaReservado) {
      console.log(`  Reservado por: ${item.reservadoPor}`);
    }
  }
}

async function cadastrarLivro(): Promise<void> {
  const titulo = await lerTexto("Título: ");
  const anoPublicacao = await lerInteiro("Ano de publicação: ");
  const autor = await lerTexto("Autor: ");
  const paginas = await lerInteiro("Número de páginas: ");
  const livro = criarLivro({ titulo, anoPublicacao, autor, paginas });
  repositorio.adicionar(livro);
  console.log(`Livro cadastrado com id ${livro.id}.`);
}

async function cadastrarJogo(): Promise<void> {
  const titulo = await lerTexto("Título: ");
  const anoPublicacao = await lerInteiro("Ano de publicação: ");
  const plataforma = await lerTexto("Plataforma: ");
  const jogo = new JogoEletronico(titulo, anoPublicacao, plataforma);
  repositorio.adicionar(jogo);
  console.log(`Jogo cadastrado com id ${jogo.id}.`);
}

async function emprestar(): Promise<void> {
  const id = await lerInteiro("Id do item: ");
  const item = repositorio.buscarPorId(id);
  item.emprestar();
  console.log(`Empréstimo registrado: ${item.titulo}.`);
}

async function devolver(): Promise<void> {
  const id = await lerInteiro("Id do item: ");
  const item = repositorio.buscarPorId(id);
  const multa = item.devolver();
  const mensagemMulta = multa > 0 ? `Multa: R$ ${multa.toFixed(2)}.` : "Multa: R$ 0,00.";
  console.log(`Devolução registrada: ${item.titulo}. ${mensagemMulta}`);
}

async function obterLivroPorId(): Promise<Livro> {
  const id = await lerInteiro("Id do livro: ");
  const item = repositorio.buscarPorId(id);
  if (!(item instanceof Livro)) {
    throw new ItemIndisponivelError("O item informado não é um livro.");
  }
  return item;
}

async function reservarLivro(): Promise<void> {
  const livro = await obterLivroPorId();
  const usuario = await lerTexto("Nome do usuário: ");
  livro.reservar(usuario);
  console.log(`Reserva registrada para ${livro.reservadoPor}.`);
}

async function cancelarReserva(): Promise<void> {
  const livro = await obterLivroPorId();
  const usuario = livro.reservadoPor;
  livro.cancelarReserva();
  console.log(`Reserva de ${usuario} cancelada.`);
}

async function processarOpcao(opcao: string): Promise<boolean> {
  switch (opcao) {
    case "1":
      listarAcervo();
      break;
    case "2":
      await cadastrarLivro();
      break;
    case "3":
      await cadastrarJogo();
      break;
    case "4":
      await emprestar();
      break;
    case "5":
      await devolver();
      break;
    case "6":
      await reservarLivro();
      break;
    case "7":
      await cancelarReserva();
      break;
    case "0":
      return false;
    default:
      console.log("Opção inválida. Tente novamente.");
  }
  return true;
}

async function executar(): Promise<void> {
  try {
    console.log("Bem-vindo ao Acervo Biblioteca!");
    while (true) {
      exibirMenu();
      const opcao = await lerTexto("Escolha uma opção: ");
      try {
        if (!(await processarOpcao(opcao))) {
          break;
        }
      } catch (erro) {
        if (erro instanceof ErroDominio) {
          console.log(`Erro: ${erro.message}`);
        } else {
          throw erro;
        }
      }
    }
  } finally {
    leitor.close();
    console.log("Encerrando o Acervo Biblioteca. Até logo!");
  }
}

executar().catch((erro: unknown) => {
  console.error("Erro inesperado:", erro);
});

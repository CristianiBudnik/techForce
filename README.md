# Acervo Biblioteca

Aplicação de console em TypeScript (Node.js) que consolida conceitos de orientação a objetos. Todo o código, texto e mensagens estão em português.

## Execução

Instale as dependências:

```bash
npm install
```

Roteiro automático:

```bash
npm run demo
```

Menu interativo (código-fonte):

```bash
npm start
```

Compilação e execução da versão compilada:

```bash
npm run build
npm run start:dist
```

## Estrutura

```text
src/
  dominio/
    ItemAcervo.ts
    Livro.ts
    JogoEletronico.ts
    Reservavel.ts
    tipos.ts
  excecoes/
    erros.ts
  repositorio/
    RepositorioMemoria.ts
  main.ts
  demo.ts
dist/
```

## Conceitos por aula

| Aula / conceito | Onde aparece |
| --- | --- |
| Aula 2 - Construtores e coleções | `src/dominio/ItemAcervo.ts`, `src/dominio/Livro.ts`, `src/dominio/JogoEletronico.ts`, `src/repositorio/RepositorioMemoria.ts` |
| Aula 3 - Encapsulamento | `src/dominio/ItemAcervo.ts`, `src/dominio/Livro.ts`, `src/dominio/JogoEletronico.ts` |
| Aula 4 - Acessores e estáticos | `src/dominio/ItemAcervo.ts` |
| Aula 5 - Herança e classes abstratas | `src/dominio/ItemAcervo.ts`, `src/dominio/Livro.ts`, `src/dominio/JogoEletronico.ts` |
| Aula 6 - Interfaces | `src/dominio/Reservavel.ts`, `src/dominio/Livro.ts` |
| Aula 7 - Generics, Utility Types e exceções | `src/repositorio/RepositorioMemoria.ts`, `src/dominio/tipos.ts`, `src/excecoes/erros.ts` |
| Aplicação - Menu interativo | `src/main.ts` |
| Aplicação - Roteiro automático | `src/demo.ts` |

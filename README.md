# Rock Software Solutions · Site

Site institucional da Rock Software Solutions em **React + TypeScript** (Vite), com cubo 3D em **Three.js** (React Three Fiber), animações em **Motion** e rolagem suave com **Lenis**.

## Rodar no computador

```bash
npm install
npm run dev
```

Abra o endereço que aparecer no terminal (normalmente http://localhost:5173).

## Publicar

```bash
npm run build
```

Os arquivos finais ficam em `dist/`. Na Vercel, é só importar a pasta: o framework é detectado como **Vite**.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| WhatsApp, e-mail, Instagram, serviços, camadas, projetos, palavras do topo, tecnologias, setores, módulos do configurador | `src/data.ts` |
| Textos e layout de cada seção | `src/components/*.tsx` |
| Cubo 3D (formas, luz, animação) | `src/three/Cube3D.tsx` e `src/three/textures.ts` |
| Cores, fontes e espaçamentos | `src/styles.css` (variáveis no `:root`) |
| Imagens, vídeos e fontes | `public/assets/` |

## O que tem no site

- **Abertura**: o cubo se monta camada por camada com um contador de 000 a 100 e a cortina sobe revelando o site.
- **Topo**: cubo 3D da marca que se monta em três camadas, segue o mouse e pode ser girado com o arrasto. A última palavra do título se “decodifica” entre empresa, construtora, locadora, loja, clínica e indústria.
- **Ao rolar o topo**: as linhas do título se afastam para lados opostos e o cubo afunda e encolhe.
- **Tecnologias**: duas faixas (stack real + serviços em contorno) que aceleram, inclinam e invertem a direção conforme a velocidade da rolagem.
- **SOB MEDIDA** (`src/components/Statement.tsx`): a seção fica fixa, a rolagem entra pela letra “I” até o vídeo do Kargo ocupar a tela; depois a frase acende palavra por palavra e os números contam.
- **Serviços**: cada serviço tem uma ilustração animada própria e eles se alternam sozinhos até a pessoa escolher um.
- **Do planejamento ao suporte**: a seção fica fixa enquanto a pessoa rola; o cubo se abre, mostra os circuitos por dentro e destaca cada camada (planejamento, desenvolvimento, suporte).
- **Serviços e Sobre**: entram como um cartão arredondado que se abre até ocupar a largura toda.
- **Projetos**: vídeos reais do Kargo e do Motuga (sem valores); o aparelho se deita em 3D e se levanta com a rolagem, o nome do projeto desliza em contorno ao fundo e a cor do fundo muda conforme o projeto.
- **Sobre**: foto com revelação e citação que acende palavra por palavra na rolagem.
- **Contato**: formulário que monta a mensagem e abre o WhatsApp já preenchido, com prévia ao vivo.
- **Rodapé**: as letras de ROCK sobem uma a uma conforme a página chega ao fim.
- **Cursor** (só com mouse): um anel que inverte as cores sobre botões e links e mostra “Arraste” sobre o cubo. O cabeçalho some ao descer e volta ao subir.
- Quem ativa “reduzir movimento” no sistema vê uma versão sem animações; sem suporte a 3D, aparece o cubo em imagem.

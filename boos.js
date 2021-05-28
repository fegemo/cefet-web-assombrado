// CURIOSO VOCÊ, HEIN?? Isso é ótimo!
// Já que está aqui, (a) tente alterar os três parâmetros abaixo
// e ver o resultado
// e também (b) procure pela palavra 'click' neste arquivo e a substitua
// por 'mouseenter'. Veja no que dá!
//
const DISTANCIA_PERCORRIDA_MAXIMA = 80; // em px
const TEMPO_PARA_MUDAR_DE_LADO = 250;   // em ms (milissegundos)
const DURACAO_DO_MOVIMENTO = 500;       // idem

// pega todo mundo que tem class="boo" na página
let boos = document.querySelectorAll('.boo');

// percorre cada um
boos.forEach(booEl => {
  const estilos = window.getComputedStyle(booEl);
  const transicaoMesmaDirecao = `all ${DURACAO_DO_MOVIMENTO}ms ease`;
  const transicaoMudandoDirecao = `
    opacity ${DURACAO_DO_MOVIMENTO}ms ease,
    left ${DURACAO_DO_MOVIMENTO}ms ease ${TEMPO_PARA_MUDAR_DE_LADO}ms,
    top ${DURACAO_DO_MOVIMENTO}ms ease ${TEMPO_PARA_MUDAR_DE_LADO}ms,
    transform ${TEMPO_PARA_MUDAR_DE_LADO}ms ease`;

  // coloca uma transição para movimentar, e não teletransportar
  // além de passar a usar apenas as propriedades left e top, mesmo que
  // este boo tenha right ou bottom definidos
  booEl.style.transition = transicaoMesmaDirecao;
  booEl.style.left = estilos.left;
  booEl.style.right = 'initial';

  booEl.style.top = estilos.top;
  booEl.style.bottom = 'initial';
  booEl.style.cursor = 'pointer';

  // quando este boo for clicado...
  booEl.addEventListener('click', e => {
    let booEl = e.currentTarget;
    // largura e altura máximas até onde ele pode ir
    let larguraDisponivelNaPagina = document.body.clientWidth;
    let alturaDisponivelNoContainer = booEl.parentElement.clientHeight;

    // sorteia um ângulo (0 a 360°) que é a direção para onde ele vai andar
    let anguloDirecao = Math.random() * Math.PI * 2;
    // sorteia uma distância que ele vai percorrer, que é pelo menos 50%
    // da DISTANCIA_PERCORRIDA_MAXIMA
    let distanciaPercorrida = (Math.random() * DISTANCIA_PERCORRIDA_MAXIMA / 2) + DISTANCIA_PERCORRIDA_MAXIMA / 2;

    // encontra a nova coordenada (x,y), usando o círculo trigonométrico
    // (ângulo e raio)
    // se ficar curioso sobre esta conta, veja a imagem em imgs/circulo-trigonometrico.png
    let novoX = booEl.offsetLeft + Math.cos(anguloDirecao) * distanciaPercorrida;
    let novoY = booEl.offsetTop + Math.sin(anguloDirecao) * distanciaPercorrida;

    // garante que a nova coordenada (x,y) não saiu da página
    novoX = Math.min(larguraDisponivelNaPagina - booEl.width, Math.max(0, novoX));
    novoY = Math.min(alturaDisponivelNoContainer - booEl.height, Math.max(0, novoY));

    const estaViradoParaEsquerda = booEl.style.transform === 'scaleX(-1)';
    const estaViradoParaDireita = !estaViradoParaEsquerda;
    const vaiAndarParaDireita = novoX > booEl.offsetLeft;
    const vaiAndarParaEsquerda = !vaiAndarParaDireita;

    // determina se vai ter que fazer uma pausa pra mudar de lado
    if ((estaViradoParaDireita && vaiAndarParaEsquerda) ||
      (estaViradoParaEsquerda && vaiAndarParaDireita)) {
      booEl.style.transition = transicaoMudandoDirecao;
    } else {
      booEl.style.transition = transicaoMesmaDirecao;
    }

    // se andou para a direita, não reflete a imagem
    if (vaiAndarParaDireita) {
      booEl.style.transform = 'scaleX(1)';
    }
    // se andou para a esquerda, reflete (gira 180°)
    else {
      booEl.style.transform = 'scaleX(-1)';
    }

    // atualiza as propriedades CSS para efetivamente mudar a posição
    booEl.style.left = `${novoX}px`;
    booEl.style.top = `${novoY}px`;

    // temporariamente, torna este boo opaco e não responder a eventos de mouse
    // (pra não começar outro movimento antes de terminar este)
    booEl.style.opacity = 1;
    booEl.style.pointerEvents = 'none';
    setTimeout(() => {
      booEl.style.pointerEvents = 'initial';
      booEl.style.removeProperty('opacity');
    }, DURACAO_DO_MOVIMENTO);
  });
});
const slides = document.querySelectorAll(".slide");
const bolinhas = document.querySelectorAll(".dot");
const btnProximo = document.getElementById("btn-proximo");
const btnAnterior = document.getElementById("btn-anterior");
const btnPular = document.getElementById("btn-pular");

const totalSlides = slides.length;
let slideAtual = 0;

function irPara(indice) {
  if (indice < 0 || indice >= totalSlides) return;

  slides[slideAtual].classList.remove("slide-ativo");
  bolinhas[slideAtual].classList.remove("dot-ativo");

  slideAtual = indice;

  slides[slideAtual].classList.add("slide-ativo");
  bolinhas[slideAtual].classList.add("dot-ativo");

  btnAnterior.disabled = slideAtual === 0;

  if (slideAtual === totalSlides - 1) {
    btnProximo.textContent = "Entendi";
  } else {
    btnProximo.textContent = "Próximo";
  }
}

btnProximo.addEventListener("click", () => {
  if (slideAtual === totalSlides - 1) {
    alert("Tutorial concluído! Bem-vindo ao JOVI Cam.");
    window.location.href = "hub.html";
    return;
  }
  irPara(slideAtual + 1);
});

btnAnterior.addEventListener("click", () => {
  irPara(slideAtual - 1);
});

btnPular.addEventListener("click", () => {
  const confirmar = confirm("Pular o tutorial e ir direto para o app?");
  if (confirmar) {
    window.location.href = "hub.html";
  }
});

bolinhas.forEach((bolinha) => {
  bolinha.addEventListener("click", () => {
    const indice = Number(bolinha.dataset.slide);
    irPara(indice);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") btnProximo.click();
  if (e.key === "ArrowLeft" && !btnAnterior.disabled) btnAnterior.click();
});

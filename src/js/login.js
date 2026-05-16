  const form = document.getElementById("form-login");
const inputEmail = document.getElementById("email");
const inputSenha = document.getElementById("senha");
const erroEmail = document.getElementById("erro-email");
const erroSenha = document.getElementById("erro-senha");
const linkCadastro = document.getElementById("link-cadastro");

const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const tamanhoMinimoSenha = 6;

function mostrarErro(input, elemento, mensagem) {
  elemento.textContent = mensagem;
  if (mensagem) {
    input.classList.add("input-invalido");
  } else {
    input.classList.remove("input-invalido");
  }
}

function validarEmail() {
  const valor = inputEmail.value.trim();
  if (!valor) {
    mostrarErro(inputEmail, erroEmail, "Informe seu email.");
    return false;
  }
  if (!regexEmail.test(valor)) {
    mostrarErro(inputEmail, erroEmail, "Email inválido. Use o formato nome@exemplo.com.");
    return false;
  }
  mostrarErro(inputEmail, erroEmail, "");
  return true;
}

function validarSenha() {
  const valor = inputSenha.value;
  if (!valor) {
    mostrarErro(inputSenha, erroSenha, "Informe sua senha.");
    return false;
  }
  if (valor.length < tamanhoMinimoSenha) {
    mostrarErro(inputSenha, erroSenha, `Senha deve ter ao menos ${tamanhoMinimoSenha} caracteres.`);
    return false;
  }
  mostrarErro(inputSenha, erroSenha, "");
  return true;
}

inputEmail.addEventListener("blur", validarEmail);
inputSenha.addEventListener("blur", validarSenha);
inputEmail.addEventListener("input", () => {
  if (erroEmail.textContent) validarEmail();
});
inputSenha.addEventListener("input", () => {
  if (erroSenha.textContent) validarSenha();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const emailOk = validarEmail();
  const senhaOk = validarSenha();
  if (!emailOk || !senhaOk) {
    alert("Verifique os campos destacados antes de continuar.");
    return;
  }
  alert(`Login realizado com sucesso!\nBem-vindo(a), ${inputEmail.value.trim()}.`);
  window.location.href = "hub.html";
});

linkCadastro.addEventListener("click", (e) => {
  e.preventDefault();
  const nome = prompt("Para criar uma conta, digite seu nome:");
  if (nome === null) return;
  if (nome.trim().length < 2) {
    alert("Nome muito curto. Tente novamente.");
    return;
  }
  const confirmar = confirm(`Criar conta para "${nome.trim()}"?`);
  if (confirmar) {
    alert(`Conta criada! Agora faça login com seu email e senha.`);
    inputEmail.focus();
  }
});

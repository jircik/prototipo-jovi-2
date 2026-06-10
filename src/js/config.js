const LS_KEY = "jovi_modos_ativos";
const MODOS_FIXOS = new Set(["ia", "estudo"]);
const DEFAULT_ATIVOS = [
  { id: "ia",    label: "IA" },
  { id: "estudo",label: "Estudo" },
  { id: "noite", label: "Noite" },
  { id: "foto",  label: "Foto" },
  { id: "video", label: "Vídeo" }
];

const grade         = document.getElementById("grade-modos");
const btnEditar     = document.getElementById("btn-editar");
const abasInferiores = document.querySelectorAll("#bottom-tabs .mode-tab[data-mode]");

function getModos() {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : DEFAULT_ATIVOS;
  } catch { return DEFAULT_ATIVOS; }
}

function salvarModos() {
  const ativos = Array.from(grade.querySelectorAll('.item-modo[data-active="true"]'))
    .map(el => ({ id: el.dataset.id, label: el.dataset.label }))
    .filter(m => m.id);
  localStorage.setItem(LS_KEY, JSON.stringify(ativos));
}

function setAtivo(item) {
  item.dataset.active = "true";
  const badge = item.querySelector(".badge");
  if (!badge) return;
  badge.classList.remove("badge-adicionar");
  badge.classList.add("badge-remover");
  badge.textContent = "✕";
  badge.setAttribute("aria-label", "Remover");
  const divisor = grade.querySelector(".divisor-secao");
  if (divisor) grade.insertBefore(item, divisor);
}

function setInativo(item) {
  item.dataset.active = "false";
  const badge = item.querySelector(".badge");
  if (!badge) return;
  badge.classList.remove("badge-remover");
  badge.classList.add("badge-adicionar");
  badge.textContent = "+";
  badge.setAttribute("aria-label", "Adicionar");
  grade.appendChild(item);
}

function registrarBadge(badge) {
  badge.addEventListener("click", (e) => {
    e.stopPropagation();
    const item = badge.closest(".item-modo");
    const id   = item.dataset.id;
    const nome = item.dataset.name;

    if (badge.classList.contains("badge-remover")) {
      if (MODOS_FIXOS.has(id)) return;
      const confirmar = confirm(`Remover "${nome}" da câmera?`);
      if (!confirmar) return;

      if (item.classList.contains("item-custom")) {
        item.remove();
        salvarModos();
      } else {
        setInativo(item);
        salvarModos();
      }
    } else {
      setAtivo(item);
      salvarModos();
    }
  });
}

function criarModoCustom(nome) {
  const label = nome.length > 8 ? nome.substring(0, 7) + "…" : nome;
  const id = "c_" + nome.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "").substring(0, 12);

  const item = document.createElement("article");
  item.className = "item-modo item-custom";
  item.dataset.name  = nome;
  item.dataset.id    = id;
  item.dataset.label = label;
  item.dataset.active = "true";

  item.innerHTML = `
    <button class="badge badge-remover" aria-label="Remover">✕</button>
    <div class="icone-modo icone-ia">
      <span class="estrela-ia">✦</span>
    </div>
    <p class="label-modo label-azul">${nome}</p>
  `;

  const divisor = grade.querySelector(".divisor-secao");
  if (divisor) grade.insertBefore(item, divisor);
  else grade.appendChild(item);

  registrarBadge(item.querySelector(".badge"));
  salvarModos();
}

function inicializar() {
  const modosAtivos = getModos().map(m => m.id);
  grade.querySelectorAll(".item-modo").forEach(item => {
    const id = item.dataset.id;
    if (!id || MODOS_FIXOS.has(id)) return;
    const deveEstarAtivo = modosAtivos.includes(id);
    const estaAtivo = item.dataset.active === "true";
    if (deveEstarAtivo && !estaAtivo) setAtivo(item);
    else if (!deveEstarAtivo && estaAtivo) setInativo(item);
  });
}

document.querySelectorAll(".badge").forEach(registrarBadge);

btnEditar.addEventListener("click", () => {
  const nome = prompt("Nome do novo modo customizado:");
  if (nome === null) return;
  const nomeTratado = nome.trim();
  if (nomeTratado.length < 2) {
    alert("Nome muito curto. O modo não foi criado.");
    return;
  }
  const jaExiste = Array.from(grade.querySelectorAll(".item-modo"))
    .some(item => item.dataset.name.toLowerCase() === nomeTratado.toLowerCase());
  if (jaExiste) {
    alert(`Já existe um modo chamado "${nomeTratado}".`);
    return;
  }
  criarModoCustom(nomeTratado);
});

abasInferiores.forEach(aba => {
  aba.addEventListener("click", () => {
    abasInferiores.forEach(a => a.classList.remove("mode-tab-ativo"));
    aba.classList.add("mode-tab-ativo");
  });
});

inicializar();

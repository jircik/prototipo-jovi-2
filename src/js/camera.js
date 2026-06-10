const LS_KEY = "jovi_modos_ativos";
const DEFAULT_ATIVOS = [
  { id: "ia",    label: "IA" },
  { id: "estudo",label: "Estudo" },
  { id: "noite", label: "Noite" },
  { id: "foto",  label: "Foto" },
  { id: "video", label: "Vídeo" }
];

const MODO_CONFIG = {
  ia:      { chip: "IA · Modo Noite detectado",  cls: "mode-tab-ia" },
  estudo:  { chip: "IA Auto · Texto detectado",  cls: "mode-tab-estudo" },
  noite:   { chip: "Modo Noite ativo" },
  foto:    { chip: "Modo Foto" },
  video:   { chip: "Gravando vídeo" },
  res:     { chip: "Alta Resolução ativa" },
  pano:    { chip: "Modo Panorâmica" },
  retrato: { chip: "Modo Retrato" },
  comida:  { chip: "Modo Comida" },
  timer:   { chip: "Modo Intervalo" },
  burst:   { chip: "Modo Instantâneo" },
  astro:   { chip: "Modo Astro" },
  duplo:   { chip: "Vis. Dupla ativa" },
  doc:     { chip: "Doc Ultra HD" }
};

const telaCamera = document.getElementById("camera");
const labelChip  = document.getElementById("chip-label");
const navModos   = document.getElementById("mode-tabs");
const opcoesZoom = document.querySelectorAll(".zoom-option");
const botoesTopo = document.querySelectorAll(".ctrl-btn");
const overlayGrid   = document.getElementById("grid-overlay");
const btnShutter    = document.getElementById("btn-shutter");
const btnFlip       = document.getElementById("btn-flip");
const btnGaleria    = document.getElementById("btn-gallery");
const btnResumo     = document.getElementById("btn-resumo");
const btnCopiar     = document.getElementById("btn-copiar");
const contadorFotos = document.getElementById("contador-fotos");
const overlayFlash  = document.getElementById("overlay-flash");
const videoCam      = document.getElementById("video-cam");

let modoAtual    = "ia";
let fotosTiradas = 0;
let stream       = null;
let cameraFrontal = false;

function getModos() {
  try {
    const s = localStorage.getItem(LS_KEY);
    return s ? JSON.parse(s) : DEFAULT_ATIVOS;
  } catch { return DEFAULT_ATIVOS; }
}

/* ── Dynamic tab rendering ───────────────────── */
function renderizarAbas() {
  const modos = getModos();
  navModos.innerHTML = "";

  modos.forEach(({ id, label }) => {
    const cfg = MODO_CONFIG[id] || {};
    const btn = document.createElement("button");
    btn.className = "mode-tab" + (cfg.cls ? " " + cfg.cls : "");
    btn.dataset.mode = id;

    if (id === "ia") {
      btn.textContent = label;
      btn.classList.add("mode-tab-ativo");
    } else {
      btn.textContent = label;
    }

    btn.addEventListener("click", () => trocarModo(id));
    navModos.appendChild(btn);
  });

  const link = document.createElement("a");
  link.href = "config.html";
  link.className = "mode-tab";
  link.textContent = "Modos";
  navModos.appendChild(link);
}

/* ── Mode switching ──────────────────────────── */
function trocarModo(novoModo) {
  if (novoModo === modoAtual) return;

  document.querySelectorAll(".mode-tab[data-mode]").forEach(aba =>
    aba.classList.remove("mode-tab-ativo")
  );
  const abaAtiva = document.querySelector(`.mode-tab[data-mode="${novoModo}"]`);
  if (abaAtiva) abaAtiva.classList.add("mode-tab-ativo");

  telaCamera.classList.remove(`camera-${modoAtual}`);
  if (novoModo === "ia" || novoModo === "estudo") {
    telaCamera.classList.add(`camera-${novoModo}`);
  } else {
    telaCamera.classList.add("camera-ia");
  }

  modoAtual = novoModo;
  const cfg = MODO_CONFIG[novoModo];
  labelChip.textContent = cfg ? cfg.chip : novoModo;
}

/* ── Zoom ────────────────────────────────────── */
opcoesZoom.forEach((opcao) => {
  opcao.addEventListener("click", () => {
    opcoesZoom.forEach((o) => o.classList.remove("zoom-option-ativo"));
    opcao.classList.add("zoom-option-ativo");
  });
});

/* ── Top controls ────────────────────────────── */
botoesTopo.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("ctrl-btn-ativo");
    if (btn.dataset.ctrl === "grid") {
      overlayGrid.classList.toggle("hidden");
    }
    if (btn.dataset.ctrl === "settings") {
      window.location.href = "config.html";
    }
  });
});

/* ── Shutter ─────────────────────────────────── */
btnShutter.addEventListener("click", () => {
  overlayFlash.classList.remove("flash-ativo");
  void overlayFlash.offsetWidth;
  overlayFlash.classList.add("flash-ativo");

  fotosTiradas += 1;
  contadorFotos.textContent = `${fotosTiradas} ${fotosTiradas === 1 ? "foto" : "fotos"}`;

  setTimeout(() => {
    alert(`Foto capturada!\nModo: ${modoAtual.toUpperCase()} · Total: ${fotosTiradas}`);
  }, 280);
});

/* ── Flip Camera ─────────────────────────────── */
btnFlip.addEventListener("click", async () => {
  btnFlip.classList.add("flipping");
  setTimeout(() => btnFlip.classList.remove("flipping"), 300);
  cameraFrontal = !cameraFrontal;
  await iniciarCamera();
});

/* ── Gallery ─────────────────────────────────── */
btnGaleria.addEventListener("click", () => {
  if (fotosTiradas === 0) {
    alert("Você ainda não tirou nenhuma foto.");
    return;
  }
  alert(`Galeria · ${fotosTiradas} ${fotosTiradas === 1 ? "foto disponível" : "fotos disponíveis"}.`);
});

/* ── Estudo actions ──────────────────────────── */
btnResumo.addEventListener("click", () => {
  alert("Resumo gerado pela IA:\n\nO conteúdo capturado foi processado e está disponível no seu app de notas.");
});

async function copiarParaClipboard(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch { /* cai no fallback */ }

  // Fallback para contextos não-seguros (ex.: file://)
  try {
    const area = document.createElement("textarea");
    area.value = texto;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

btnCopiar.addEventListener("click", async () => {
  if (telaCamera.classList.contains("no-camera") || !videoCam.videoWidth) {
    alert("Câmera indisponível. Não há imagem para ler o texto.");
    return;
  }
  if (typeof Tesseract === "undefined") {
    alert("Leitor de texto ainda carregando. Tente novamente em instantes.");
    return;
  }

  const textoOriginal = btnCopiar.textContent;
  btnCopiar.disabled = true;
  btnCopiar.textContent = "Lendo…";

  // Captura o frame atual do vídeo
  const canvas = document.createElement("canvas");
  canvas.width = videoCam.videoWidth;
  canvas.height = videoCam.videoHeight;
  canvas.getContext("2d").drawImage(videoCam, 0, 0, canvas.width, canvas.height);

  try {
    const { data } = await Tesseract.recognize(canvas, "por+eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          btnCopiar.textContent = `Lendo… ${Math.round(m.progress * 100)}%`;
        }
      }
    });

    const texto = (data.text || "").trim();
    if (!texto) {
      alert("Nenhum texto reconhecido na imagem. Aproxime a câmera do conteúdo.");
      return;
    }

    const copiado = await copiarParaClipboard(texto);
    if (copiado) {
      alert(`Texto copiado para a área de transferência!\n\n${texto}`);
    } else {
      alert(`Texto reconhecido (não foi possível copiar automaticamente):\n\n${texto}`);
    }
  } catch (err) {
    console.error("Erro no OCR:", err);
    alert("Não foi possível ler o texto. Tente novamente.");
  } finally {
    btnCopiar.disabled = false;
    btnCopiar.textContent = textoOriginal;
  }
});

/* ── Camera stream ───────────────────────────── */
async function iniciarCamera() {
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: cameraFrontal ? "user" : "environment" },
      audio: false
    });
    videoCam.srcObject = stream;
    telaCamera.classList.remove("no-camera");
  } catch (err) {
    telaCamera.classList.add("no-camera");
    console.warn("Câmera indisponível:", err);
  }
}

renderizarAbas();

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  iniciarCamera();
} else {
  telaCamera.classList.add("no-camera");
}

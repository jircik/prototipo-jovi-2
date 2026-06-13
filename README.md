Aqui está o README do projeto:

---

# JOVI Cam

Protótipo de câmera inteligente desenvolvido na **Sprint 2** pelo Grupo de estudantes da FIAP **PENTACODE**.

> teste em https://jircik.github.io/prototipo-jovi-sprint-2/pages/onboarding.html

## Sobre o Projeto

JOVI Cam é uma aplicação web mobile-first que simula uma interface de câmera com IA integrada, modos de captura customizáveis e reconhecimento de texto em tempo real (OCR). O design segue o padrão visual de câmera nativa do celular JOVI. O projeto foi desenvolvido como solução ao challenge da FIAP em colaboração com a JOVI (Vivo), onde os alunos devem melhorar e reinventar a experiência de uso da camera nativa do celular, com foco nos estudantes full-time.

## Equipe

| Nome |
|---|
| Arthur Jircik |
| Felipe Garcia |
| Andre Luiz |
| Guilherme Amorim |
| Matheus Marcelino |

## Funcionalidades

- **Onboarding** — Tutorial de 4 slides introdutório com navegação por teclado e botão de pular
- **Interface de câmera** — Stream de vídeo ao vivo com suporte a câmera frontal e traseira
- **Modos de captura** — IA, Estudo, Noite, Foto, Vídeo (e mais 9 modos opcionais)
- **Modo Estudo** — OCR via Tesseract.js para extrair e copiar texto da câmera em tempo real
- **Controles de câmera** — Grid overlay, flash, HDR, filtros, zoom (0.6×, 1×, 2×)
- **Configuração de modos** — Adicionar, remover e criar modos personalizados com persistência via `localStorage`

## Tecnologias

- HTML5, CSS3, JavaScript (ES6+) — sem frameworks
- [Tesseract.js v5](https://github.com/naptha/tesseract.js) — OCR em português e inglês
- Web APIs: `MediaDevices`, `Canvas`, `Clipboard`, `localStorage`
- Google Fonts — DM Sans

## Estrutura do Projeto

```
prototipo-jovi-sprint-2/
├── index.html               # Redireciona para o onboarding
├── pages/
│   ├── onboarding.html      # Tutorial inicial
│   ├── camera.html          # Interface principal da câmera
│   └── config.html          # Gerenciamento de modos
└── src/
    ├── js/
    │   ├── onboarding.js
    │   ├── camera.js
    │   └── config.js
    └── css/
        ├── onboarding.css
        ├── camera.css
        └── config.css
```
## Notas

- Os modos **IA** e **Estudo** são fixos e não podem ser removidos.
- As configurações de modos são salvas no `localStorage` com a chave `jovi_modos_ativos`.
- O OCR suporta texto em português (`por`) e inglês (`eng`).

---

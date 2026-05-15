document.getElementById("link-sair").addEventListener("click", (e) => {
  const confirmar = confirm("Deseja realmente sair?");
  if (!confirmar) e.preventDefault();
});

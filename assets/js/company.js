async function login(id) {
  const userData = await api.get("empresas/" + id);

  sessionStorage.setItem(
    "user",
    JSON.stringify({
      id: userData.id,
      nome: userData.nome,
      imagem: userData.imagem,
    })
  );

  window.location.reload();
}

function logout() {
  sessionStorage.clear();
  window.location.reload();
}

function retrieveLoggedUser() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return user;
}

function showButtons(isOwnProfile) {
  const ownProfileButtons = [
    '[data-open-modal="editProfile"]',
    '[data-open-modal="addDomains"]',
    "#loginBtn",
  ];

  if (isOwnProfile) {
    ownProfileButtons.forEach((selector) => {
      document.querySelector(selector).style.display = "flex";
    });
  }

  // Alterar isso depois
  const loggedUser = retrieveLoggedUser();
  if (loggedUser) {
    document.getElementById("loginBtn").style.display = "none";
    document.querySelector(".logged-user-image").style.display = "flex";
    document.querySelector(".logged-user-image").src = loggedUser.imagem;
  }
}

function renderCompany(company) {
  const $companyImage = document.querySelectorAll(".company-image");
  const $companyName = document.querySelectorAll(".company-name");
  const $companyAbout = document.querySelectorAll(".details-description");

  $companyImage.forEach(($el) => ($el.src = company.imagem));
  $companyName.forEach(($el) => ($el.innerText = company.nome));
  $companyAbout.forEach(($el) => ($el.innerText = company.sobre));
}

function renderDomains(domains) {
  // alterar isso depois
  const tbody = document.querySelector("tbody");

  tbody.innerHTML = "";
  for (const domain of domains) {
    tbody.innerHTML += `
      <tr>
        <td>${domain.dominio}</td>
        <td>${domain.cert_https ? "Sim" : "Não"}</td>
        <td>${domain.conex_http ? "Sim" : "Não"}</td>
        <td>${domain.filtro_http ? "Sim" : "Não"}</td>
      </tr>
    `;
  }
}

async function retrieveDomains(company) {
  const domains = await api.get("dominios?empresa=" + company);

  return domains;
}

async function loadCompany(id) {
  if (!id) return false;

  const company = await api.get("empresas/" + id);

  if (!company) return false;

  return company;
}

async function loadPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const company = await loadCompany(id);
  const loggedUser = retrieveLoggedUser();

  if (!company) {
    alert("Erro ao buscar a empresa!");
    return;
  }

  renderCompany(company);
  showButtons(loggedUser ? loggedUser.id == id : false);

  const companyDomains = await retrieveDomains(id);

  if (companyDomains) renderDomains(companyDomains);

  //Alterar isso depois
  document.getElementById("loginBtn").addEventListener("click", (e) => {
    e.preventDefault();
    login(id);
  });

  document.querySelector("#cadDom").addEventListener("submit", async (e) => {
    e.preventDefault();

    const domain = document
      .querySelector("#cadDom")
      .querySelector("input").value;

    closeModal();
    document.querySelector("#load").classList.add("active");
    document.querySelector(".modal-wrapper").classList.add("active");

    await api.post("dominios", {
      empresa: id,
      dominio: domain,
      cert_https: true,
      conex_http: true,
      filtro_http: true,
    });

    window.location.reload();
  });

  document.querySelector("#editProf").addEventListener("submit", async (e) => {
    e.preventDefault();

    const sobre = document
      .querySelector("#editProf")
      .querySelector("textarea").value;

    closeModal();
    document.querySelector("#load").classList.add("active");
    document.querySelector(".modal-wrapper").classList.add("active");

    await api.patch("empresas/" + id, { sobre });

    window.location.reload();
  });

  closeModal();
}

//Alterar isso depois
document.querySelector(".logged-user-image").addEventListener("click", () => {
  logout();
});

loadPage();

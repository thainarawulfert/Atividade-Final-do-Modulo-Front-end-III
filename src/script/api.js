window.onload = () => {
  load("/character/?page=1");
  contadorRodade();
};

const api = axios.create({
  baseURL: "https://rickandmortyapi.com/api",
});

const botaoProximo = document.getElementById("botaoProximo");

let informacoes;
let proximaPagina = null;
let paginaAnterior = null;

async function renderizarPersonagem(personagen) {
  let cards = document.getElementById("containerPersonagens");

  let statusCor = "";
  let statusTexto = "";

  if (personagen.status === "Alive") {
    statusCor = "#56CD42";
    statusTexto = "Vivo";
  } else if (personagen.status === "Dead") {
    statusCor = "#CD4242";
    statusTexto = "Morto";
  } else {
    statusCor = "#BBBBBB";
    statusTexto = "Desconhecido";
  }

  const episodioNResponde = await axios.get(personagen.episode[0]);
  const episodioNome = episodioNResponde.data.name;

  cards.innerHTML += `
  <div class="card mb-3 me-5 card_body"  style="max-width: 34rem; min-width: 34rem; ">
  <div class="row g-0">
    <div class="col-md-4">
      <img src="${personagen.image}" class="img-fluid rounded-start" alt="..." style="max-height: 220px; min-height: 220px;">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <a class="anchor_modal" data-bs-toggle="modal" data-bs-target="#${personagen.id}">${personagen.name}</a> 
        <section class="container_status">
        <span class="statusCirculo" style="background-color: ${statusCor};"></span>
        <p>${statusTexto} - ${personagen.species}</p>
        </section>
        <p class="card-text">Visto por último: <small class="text-body-secondary text-location"> ${personagen.location.name}</small></p>
        
        <p class="card-text">${episodioNome}</p>
      </div>
    </div>
  </div>
  <div class="modal fade" id="${personagen.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <!-- ------------------ Modal ---------------------- -->
  <div class="modal-dialog">
    <div class="modal-content modal_background">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">${personagen.name}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
      <img src="${personagen.image}" class="img-fluid rounded-start" alt="..." style="max-height: 200px; min-height: 200px;">
        <div class="card-body"> 
        <section class="container_status">
        <span class="statusCirculo" style="background-color: ${statusCor};"></span>
        <p>${statusTexto} - ${personagen.species}</p>
        </section>
        <p class="card-text">Visto por último:</p>
        <p class="card-text"><small class="text-body-secondary text-location"> ${personagen.location.name}</small></p>
        <p class="card-text">${episodioNome}</p>
      </div>
      </div>
    </div>
  </div>
</div>`;
}

function montar(personagensi) {
  let cards = document.getElementById("containerPersonagens");
  cards.innerHTML = "";

  personagensi.forEach((personagen) => {
    renderizarPersonagem(personagen);
  });
}

function mostrarPersonagens(res) {
  const personagens = res.results.slice(0, 6);
  informacoes = res.info;

  btnAnterior.disabled = informacoes.prev === null;

  montar(personagens);
}

function load(url, buscar = "") {
  const buscarPersonagem = buscar ? `&name=${buscar}` : ""; // busca personagem por nome
  api.get(url + buscarPersonagem).then((res) => {
    const paginas = res.data;
    proximaPagina = res.data.info.next;
    paginaAnterior = res.data.info.prev;
    mostrarPersonagens(paginas);
  });
}

function pesquisar() {
  const buscar = buscarInput.value;
  load("/character/?page=1", buscar);
}

function mudarPagina(url) {
  if (url != null) {
    load(url);
  }
}

const buscarInput = document.getElementById("inputBuscar");

buscarInput.addEventListener("input", () => {
  pesquisar();
});

const btnAnterior = document.getElementById("botaoAnterior");
btnAnterior.addEventListener("click", () => {
  mudarPagina(paginaAnterior, buscarInput.value);
  window.scrollTo(0, 0);
});

const btnProxima = document.getElementById("botaoProximo");
btnProxima.addEventListener("click", () => {
  mudarPagina(proximaPagina, buscarInput.value);
  window.scrollTo(0, 0);
});

function contadorRodade() {
  api.get("/character").then((res) => {
    const quantidadePersonagens = res.data.info.count;
    const quantidadeNoSpan = document.getElementById("quantidadePersonagens");

    quantidadeNoSpan.textContent = quantidadePersonagens;
  });

  api.get("/location").then((res) => {
    const localizacao = res.data.info.count;
    const localizacaoNoSpan = document.getElementById("localizacao");

    localizacaoNoSpan.textContent = localizacao;
  });

  api.get("/episode").then((res) => {
    const episodio = res.data.info.count;
    const episodioNoSpan = document.getElementById("episodios");

    episodioNoSpan.textContent = episodio;
  });
}

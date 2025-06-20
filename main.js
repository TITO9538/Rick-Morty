let contenedor = document.querySelector("#contenedor-cards");
let sig = document.querySelector("#sig");
let ant = document.querySelector("#ant");
let pagina = 1;
let filtrosActivos = {};

async function traerPersonajes(pagina) {
  contenedor.innerHTML = "";
  try {
    let { data } = await axios.get(`https://rickandmortyapi.com/api/character?page=${pagina}`);
    renderizarPersonajes(data.results);
  } catch (error) {
    console.error("Error al traer personajes:", error);
    contenedor.innerHTML = `<p class="text-center text-red-600">No se pudieron cargar los personajes.</p>`;
  }
}

function renderizarPersonajes(personajes) {
  contenedor.innerHTML = "";
  personajes.forEach((personaje) => {
    let genero = traducirGenero(personaje.gender);
    let estado = personaje.status === "Dead" ? "Muertito" : personaje.status === "Alive" ? "Vivo" : "Desconocido";

    contenedor.innerHTML += `
      <div class="card flex flex-col items-center justify-center p-4 bg-slate-300 rounded-xl shadow hover:shadow-md transition">
        <div class="bg-gray-100 rounded-xl overflow-hidden w-full">
          <img src="${personaje.image}" alt="${personaje.name}" class="rounded-xl w-full object-cover" />
        </div>
        <div class="flex flex-col justify-start w-full p-2 gap-1 text-center">
          <p class="text-sm text-gray-500">ID: ${personaje.id}</p>
          <p class="text-gray-600">${genero}</p>
          <p class="font-medium">${estado}</p>
        </div>
      </div>
    `;
  });
}

function traducirGenero(genero) {
  switch (genero) {
    case "Male": return "Masculino";
    case "Female": return "Femenino";
    case "Genderless": return "Sin género";
    default: return "Desconocido";
  }
}

sig.addEventListener("click", function () {
  pagina++;
  traerPersonajes(pagina);
});

ant.addEventListener("click", function () {
  if (pagina > 1) {
    pagina--;
    traerPersonajes(pagina);
  }
});

document.querySelector("#boton-drop").addEventListener("click", () => {
  document.querySelector("#dropdown").classList.toggle("hidden");
});

//mi dropdown
const filtrosMenu = document.querySelector("#listado-clases");
const filtros = {
  status: ["alive", "dead", "unknown"],
  species: ["human", "alien", "robot"],
  gender: ["male", "female", "genderless"],
};

filtrosMenu.innerHTML = "";

Object.entries(filtros).forEach(([tipo, valores]) => {
  filtrosMenu.innerHTML += `<li class='px-4 py-2 font-bold uppercase text-xs'>${tipo}</li>`;
  valores.forEach((valor) => {
    filtrosMenu.innerHTML += `
      <li>
        <button data-filtro="${tipo}" data-valor="${valor}" class="filtro-btn block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white capitalize">
          ${valor}
        </button>
      </li>
    `;
  });
});

filtrosMenu.addEventListener("click", (e) => {
  if (e.target.classList.contains("filtro-btn")) {
    const tipo = e.target.dataset.filtro;
    const valor = e.target.dataset.valor;

   filtrosActivos[tipo] = valor;

    aplicarFiltros();

    document.querySelector("#dropdown").classList.add("hidden");
  }
});

async function aplicarFiltros() {
  contenedor.innerHTML = "<p class='text-center text-slate-400'>Cargando personajes filtrados...</p>";

  let url = "https://rickandmortyapi.com/api/character/?";

  for (const [clave, valor] of Object.entries(filtrosActivos)) {
    url += `${clave}=${valor}&`;
  }

  try {
    const { data } = await axios.get(url);
    renderizarPersonajes(data.results);
  } catch (error) {
    contenedor.innerHTML = `<p class='text-center text-red-400'>No se encontraron personajes con los filtros aplicados.</p>`;
  }
}

traerPersonajes(pagina);
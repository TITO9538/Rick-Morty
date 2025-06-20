let contenedor = document.querySelector("#contenedor-cards");
let sig = document.querySelector("#sig");
let ant = document.querySelector("#ant");
let pagina = 1;

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
 personajes.slice(0, 6).forEach((personaje) => {
    let genero = traducirGenero(personaje.gender);
    let estado = personaje.status === "Dead" ? " Muertito" :
                 personaje.status === "Alive" ? "vivo agunta todavia" :
                 " Desconocido";

    contenedor.innerHTML += `
      <div class="card flex flex-col items-center justify-center p-4 bg-slate-300 rounded-xl shadow hover:shadow-md transition">
        <div class="bg-gray-100 rounded-xl overflow-hidden w-full">
          <img src="${personaje.image}" alt="${personaje.name}" class="rounded-xl w-full object-cover" />
        </div>
        <div class="flex flex-col justify-start w-full p-2 gap-1 text-center">
          <h2 class="text-2xl font-bold">${personaje.name}</h2>
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
traerPersonajes(pagina);
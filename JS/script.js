let entrenador;

// Nombre de usario
document.getElementById("btn-nombre").addEventListener("click", function() {
    const nombre = document.getElementById("nombre").value.trim();
    const resultado = validarNombre(nombre);

    switch (resultado) {
        case "null":
            Swal.fire("Error", "Por lo que veo, no has ingresado ningún nombre", "error");
            break;
        case "numero":
            Swal.fire("Error", "Un nombre no tiene números", "error");
            break;
        case "corto":
            Swal.fire("Error", "Tu nombre debe tener 3 letras como mínimo", "error");
            break;
        default:
            entrenador = nombre.toUpperCase();
            // Guardar el nombre del entrenador en localStorage
            localStorage.setItem('entrenador', entrenador);
            Swal.fire("¡Saludos " + entrenador + "!", "Soy el profesor Oak.", "success");
            document.getElementById("intro").classList.add("oculto");
            document.getElementById("seleccionPokebola").classList.remove("oculto");
            break;
    }
});

// Nombre Pokemon
document.querySelectorAll("#seleccionPokebola .btnPokebola").forEach(button => {
    button.addEventListener("click", function() {
        const pokebola = button.getAttribute("data-pokemon");
        let pokemon;

        switch (pokebola) {
            case "1":
                pokemon = "CHARMANDER";
                break;
            case "2":
                pokemon = "SQUIRTLE";
                break;
            case "3":
                pokemon = "BULBASAUR";
                break;
        }

        // Guardar pokemon seleccionado - localStorage
        localStorage.setItem('pokemon', pokemon);
        Swal.fire("¡Felicitaciones!", `${entrenador} has conseguido a ${pokemon}`, "success");
        document.getElementById("seleccionPokebola").classList.add("oculto");
        document.getElementById("pokedex").classList.remove("oculto");
        document.getElementById("pelea").classList.remove("oculto");
    });
});

// Simulación encuentro de Pokemon salvaje usando fetch
document.getElementById("btnAventura").addEventListener("click", async function() {
    try {
        const response = await fetch("data.json");
        const pokemons = await response.json();
        const pokemonAleatorio = pokemons[Math.floor(Math.random() * pokemons.length)];
        document.getElementById("resultado").innerHTML = `<p>${datos(pokemonAleatorio)}</p>`;
    } catch (error) {
        Swal.fire("Error", "No se pudo cargar la información de los Pokemon", "error");
    }
});

// Filtrar Pokemon por tipo usando fetch
document.getElementById("btnFiltrar").addEventListener("click", async function() {
    const tipo = document.getElementById("inputTipo").value.trim();

    try {
        const response = await fetch("data.json");
        const pokemons = await response.json();
        const pokemonsFiltrados = filtrarPorTipo(pokemons, tipo);
        
        const mensaje = pokemonsFiltrados.length > 0
            ? `Pokemon de tipo ${tipo}:\n${pokemonsFiltrados.map(pokemon => datos(pokemon)).join('\n\n')}`
            : `No se encontraron Pokemon de tipo ${tipo}`;

        Swal.fire("Resultado", mensaje, "info");
        document.getElementById("resultado").innerText = mensaje;
    } catch (error) {
        Swal.fire("Error", "No se pudo filtrar los Pokemon", "error");
    }
});

// Simulación de una pelea entre dos Pokemon usando fetch
document.getElementById("btnSimularPelea").addEventListener("click", async function() {
    try {
        const response = await fetch("data.json");
        const pokemons = await response.json();
        const pokemon1 = pokemons[Math.floor(Math.random() * pokemons.length)];
        const pokemon2 = pokemons[Math.floor(Math.random() * pokemons.length)];

        if (pokemon1.nombre === pokemon2.nombre) {
            Swal.fire("Error", "El mismo Pokemon fue seleccionado dos veces. Simulando otra vez...", "error");
            return;
        }

        const contenedorPelea = document.createElement("div");

        const mensajeInicial = document.createElement("p");
        mensajeInicial.textContent = `${pokemon1.nombre} VS ${pokemon2.nombre}`;
        contenedorPelea.appendChild(mensajeInicial);

        const fuerzaPokemon1 = (pokemon1.fuerza || 0) - (pokemon2.defensa || 0);
        const fuerzaPokemon2 = (pokemon2.fuerza || 0) - (pokemon1.defensa || 0);

        const resultado = fuerzaPokemon1 > fuerzaPokemon2
            ? `${pokemon1.nombre} ha ganado la pelea!`
            : fuerzaPokemon1 < fuerzaPokemon2
            ? `${pokemon2.nombre} ha ganado la pelea!`
            : "La pelea terminó en empate.";

        const mensajeResultado = document.createElement("p");
        mensajeResultado.textContent = resultado;
        contenedorPelea.appendChild(mensajeResultado);

        document.getElementById("resultado").innerHTML = '';
        document.getElementById("resultado").appendChild(contenedorPelea);
    } catch (error) {
        Swal.fire("Error", "No se pudo cargar la información de los Pokemon", "error");
    }
});

function validarNombre(nombre) {
    return !nombre || nombre.length < 3 ? (nombre === "" ? "null" : "corto") : !isNaN(nombre) ? "numero" : "valido";
}

// Función para mostrar los datos del Pokemon
function datos(pokemon) {
    return `Nombre: ${pokemon.nombre}\nTipo: ${pokemon.tipo}\nFuerza: ${pokemon.fuerza}\nDefensa: ${pokemon.defensa}\nEvolución: ${pokemon.evolucion}\nFuerte contra: ${pokemon.fuerte}\nDébil contra: ${pokemon.debil}`;
}

// Función para filtrar Pokemon por tipo
function filtrarPorTipo(pokemons, tipo) {
    return pokemons.filter(pokemon => pokemon.tipo.toLowerCase() === tipo.toLowerCase());
}

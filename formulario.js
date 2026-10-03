const URL_COUNTRY_REGION_DATA =
    "https://cdn.jsdelivr.net/npm/country-region-data@4.1.0/data.json";

let paisesRegiones = [];

document.addEventListener("DOMContentLoaded", () => {
    configurarRadioButtons();
    configurarCheckboxes();
    configurarFormulario();
    cargarPaisesYRegiones();
});

function configurarRadioButtons() {
    const radios = document.querySelectorAll('input[name="tipoRegistro"]');
    const botonRadio = document.getElementById("btn-radio");
    const contenido = document.getElementById("contenido-radio");

    radios.forEach((radio) => {
        radio.addEventListener("change", () => {
            // Al compartir el mismo atributo name, solo uno puede estar activo.
            botonRadio.disabled = false;
            contenido.textContent = `Seleccionaste: ${radio.value}. Ahora puedes continuar.`;
            contenido.classList.remove("d-none");
        });
    });

    botonRadio.addEventListener("click", () => {
        const seleccionado = document.querySelector('input[name="tipoRegistro"]:checked');
        if (seleccionado) {
            contenido.textContent = `Botón activado correctamente para: ${seleccionado.value}.`;
        }
    });
}

async function cargarPaisesYRegiones() {
    const paisSelect = document.getElementById("pais");
    const estadoDatos = document.getElementById("estado-datos");

    try {
        const respuesta = await fetch(URL_COUNTRY_REGION_DATA);

        if (!respuesta.ok) {
            throw new Error("No fue posible descargar el JSON.");
        }

        paisesRegiones = await respuesta.json();
        llenarPaises();
        estadoDatos.textContent = "Países y regiones cargados correctamente desde country-region-data.";
    } catch (error) {
        // Respaldo sencillo para que la actividad siga funcionando sin conexión.
        paisesRegiones = obtenerDatosDeRespaldo();
        llenarPaises();
        estadoDatos.textContent = "Sin conexión al JSON remoto. Se cargaron datos de respaldo para la demostración.";
        console.error(error);
    }

    paisSelect.addEventListener("change", llenarRegiones);
}

function llenarPaises() {
    const paisSelect = document.getElementById("pais");

    paisSelect.innerHTML = '<option value="">Selecciona un país</option>';

    paisesRegiones.forEach((pais) => {
        const opcion = document.createElement("option");
        opcion.value = pais.countryShortCode;
        opcion.textContent = pais.countryName;
        paisSelect.appendChild(opcion);
    });
}

function llenarRegiones() {
    const paisSelect = document.getElementById("pais");
    const regionSelect = document.getElementById("region");
    const paisSeleccionado = paisesRegiones.find(
        (pais) => pais.countryShortCode === paisSelect.value
    );

    regionSelect.innerHTML = '<option value="">Selecciona una región</option>';

    if (!paisSeleccionado) {
        regionSelect.disabled = true;
        return;
    }

    paisSeleccionado.regions.forEach((region) => {
        const opcion = document.createElement("option");
        opcion.value = region.shortCode || region.name;
        opcion.textContent = region.name;
        regionSelect.appendChild(opcion);
    });

    regionSelect.disabled = false;
}

function configurarCheckboxes() {
    const checkTerminos = document.getElementById("acepto-terminos");
    const checkDatos = document.getElementById("confirmo-datos");
    const botonEnviar = document.getElementById("btn-enviar");

    function actualizarBoton() {
        // El botón solo se activa cuando AMBOS checkboxes están seleccionados.
        botonEnviar.disabled = !(checkTerminos.checked && checkDatos.checked);
    }

    checkTerminos.addEventListener("change", actualizarBoton);
    checkDatos.addEventListener("change", actualizarBoton);
}

function configurarFormulario() {
    const formulario = document.getElementById("formulario-registro");
    const mensaje = document.getElementById("mensaje-formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const radio = document.querySelector('input[name="tipoRegistro"]:checked');
        const pais = document.getElementById("pais");
        const region = document.getElementById("region");

        if (!radio || !pais.value || !region.value) {
            mensaje.textContent = "Selecciona una opción, un país y una región antes de enviar.";
            mensaje.className = "alert alert-danger mt-3";
            return;
        }

        const nombrePais = pais.options[pais.selectedIndex].text;
        const nombreRegion = region.options[region.selectedIndex].text;

        mensaje.textContent =
            `Formulario enviado. Tipo: ${radio.value}; País: ${nombrePais}; Región: ${nombreRegion}.`;
        mensaje.className = "alert alert-success mt-3";
    });
}

function obtenerDatosDeRespaldo() {
    return [
        {
            countryName: "Mexico",
            countryShortCode: "MX",
            regions: [
                { name: "Nuevo León", shortCode: "NLE" },
                { name: "Jalisco", shortCode: "JAL" },
                { name: "Ciudad de México", shortCode: "CMX" },
                { name: "Baja California", shortCode: "BCN" }
            ]
        },
        {
            countryName: "United States",
            countryShortCode: "US",
            regions: [
                { name: "California", shortCode: "CA" },
                { name: "Texas", shortCode: "TX" },
                { name: "New York", shortCode: "NY" }
            ]
        },
        {
            countryName: "Canada",
            countryShortCode: "CA",
            regions: [
                { name: "Ontario", shortCode: "ON" },
                { name: "Quebec", shortCode: "QC" },
                { name: "British Columbia", shortCode: "BC" }
            ]
        }
    ];
}

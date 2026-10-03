document.addEventListener("DOMContentLoaded", () => {
    protegerPagina();
    configurarLogin();
    configurarBotones();
    mostrarUsuario();
});

function protegerPagina() {
    const estaEnProfile = window.location.pathname.endsWith("profile.html");
    const autenticado = sessionStorage.getItem("usuarioAutenticado") === "true";

    if (estaEnProfile && !autenticado) {
        window.location.href = "index.html";
    }
}

function configurarLogin() {
    const loginForm = document.getElementById("login-form");

    if (!loginForm) return;

    loginForm.addEventListener("submit", validarLogin);
}
async function validarLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username === "" || password === "") {
        mostrarMensajeLogin(
            "Por favor completa usuario y contraseña.",
            "danger"
        );
        return;
    }

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            sessionStorage.setItem("usuarioAutenticado", "true");
            sessionStorage.setItem("nombreUsuario", data.usuario.nombre);

            mostrarMensajeLogin(
                "¡Inicio de sesión correcto! Redirigiendo...",
                "success"
            );

            setTimeout(() => {
                window.location.href = "profile.html";
            }, 700);

        } else {
            mostrarMensajeLogin(
                data.message,
                "danger"
            );

            document.getElementById("password").value = "";
        }

    } catch (error) {
        console.error("Error:", error);

        mostrarMensajeLogin(
            "Error al conectar con el servidor.",
            "danger"
        );
    }
}

function mostrarMensajeLogin(texto, tipo) {
    const mensaje = document.getElementById("login-message");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo} mt-3`;
    mensaje.classList.remove("d-none");
}

function configurarBotones() {
    const botonSaludo = document.getElementById("btn-saludo");
    const botonTema = document.getElementById("btn-tema");
    const botonFecha = document.getElementById("btn-fecha");
    const botonLogout = document.getElementById("btn-logout");

    if (botonSaludo) botonSaludo.addEventListener("click", mostrarSaludo);
    if (botonTema) botonTema.addEventListener("click", cambiarTema);
    if (botonFecha) botonFecha.addEventListener("click", mostrarFecha);
    if (botonLogout) botonLogout.addEventListener("click", cerrarSesion);
}

function mostrarSaludo() {
    const salida = document.getElementById("resultado-js");
    if (!salida) return;

    salida.textContent = "¡Hola! Este mensaje fue creado desde una función de JavaScript.";
}

function cambiarTema() {
    document.body.classList.toggle("tema-oscuro");

    const boton = document.getElementById("btn-tema");
    if (boton) {
        boton.textContent = document.body.classList.contains("tema-oscuro")
            ? "Usar tema claro"
            : "Cambiar tema";
    }
}

function mostrarFecha() {
    const salida = document.getElementById("resultado-js");
    if (!salida) return;

    const ahora = new Date();
    salida.textContent = `Fecha y hora: ${ahora.toLocaleString("es-MX")}`;
}

function mostrarUsuario() {
    const elemento = document.getElementById("usuario-activo");
    if (!elemento) return;

    const nombre = sessionStorage.getItem("nombreUsuario");
    elemento.textContent = nombre ? `Sesión iniciada como: ${nombre}` : "Modo visitante";
}

function cerrarSesion() {
    sessionStorage.removeItem("usuarioAutenticado");
    sessionStorage.removeItem("nombreUsuario");
    window.location.href = "index.html";
}

let usuarioEditandoId = null;
document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();

     const formulario = document.getElementById("form-usuario");
     const botonCancelar = document.getElementById("btn-cancelar");

    formulario.addEventListener("submit", guardarUsuario);
    botonCancelar.addEventListener("click", cancelarEdicion);
});

async function cargarUsuarios() {
    try {

        const response = await fetch("/users");

        if (!response.ok) {
            throw new Error("No se pudieron obtener los usuarios");
        }

        const usuarios = await response.json();

        mostrarUsuarios(usuarios);

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-danger">
                Error al cargar los usuarios.
            </div>
        `;
    }
}


function mostrarUsuarios(usuarios) {

    const tabla = document.getElementById("tabla-usuarios");

    tabla.innerHTML = "";

    usuarios.forEach(usuario => {

        const fila = document.createElement("tr");

        fila.innerHTML = `
    <td>${usuario.id}</td>
    <td>${usuario.username}</td>
    <td>${usuario.nombre || ""}</td>
    <td>${usuario.email || ""}</td>
    <td>
        <button
            class="btn btn-warning btn-sm"
            onclick="editarUsuario(${usuario.id})">
            Editar
        </button>

        <button
            class="btn btn-danger btn-sm"
            onclick="eliminarUsuario(${usuario.id})">
            Eliminar
        </button>
    </td>
`;

        tabla.appendChild(fila);
    });
}
function guardarUsuario(event) {

    if (usuarioEditandoId === null) {
        agregarUsuario(event);
    } else {
        actualizarUsuario(event);
    }
}
async function agregarUsuario(event) {

    event.preventDefault();

    const username = document.getElementById("nuevo-username").value.trim();
    const password = document.getElementById("nuevo-password").value;
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const email = document.getElementById("nuevo-email").value.trim();

    try {

        const response = await fetch("/users", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password,
                nombre,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al crear usuario");
        }

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-success">
                Usuario agregado correctamente.
            </div>
        `;

        document.getElementById("form-usuario").reset();

        cargarUsuarios();

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-danger">
                No se pudo agregar el usuario.
            </div>
        `;
    }
}
async function eliminarUsuario(id) {

    const confirmar = confirm(
        "¿Estás seguro de que quieres eliminar este usuario?"
    );

    if (!confirmar) {
        return;
    }

    try {

        const response = await fetch(`/users/${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al eliminar usuario");
        }

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-success">
                Usuario eliminado correctamente.
            </div>
        `;

        cargarUsuarios();

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-danger">
                No se pudo eliminar el usuario.
            </div>
        `;
    }
}
function editarUsuario(id) {

    const filas = document.querySelectorAll("#tabla-usuarios tr");

    for (const fila of filas) {

        const celdas = fila.querySelectorAll("td");

        if (Number(celdas[0].textContent) === id) {

            document.getElementById("nuevo-username").value =
                celdas[1].textContent;

            document.getElementById("nuevo-nombre").value =
                celdas[2].textContent;

            document.getElementById("nuevo-email").value =
                celdas[3].textContent;

            document.getElementById("nuevo-password").value = "";

            break;
        }
    }

    usuarioEditandoId = id;

    document.getElementById("btn-guardar").textContent =
        "Guardar cambios";

    document.getElementById("btn-cancelar")
        .classList.remove("d-none");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
async function actualizarUsuario(event) {

    event.preventDefault();

    const username =
        document.getElementById("nuevo-username").value.trim();

    const password =
        document.getElementById("nuevo-password").value;

    const nombre =
        document.getElementById("nuevo-nombre").value.trim();

    const email =
        document.getElementById("nuevo-email").value.trim();

    if (password === "") {
        alert("Escribe la contraseña para guardar los cambios.");
        return;
    }

    try {

        const response = await fetch(`/users/${usuarioEditandoId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password,
                nombre,
                email
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al actualizar usuario");
        }

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-success">
                Usuario actualizado correctamente.
            </div>
        `;

        cancelarEdicion();
        cargarUsuarios();

    } catch (error) {

        console.error("Error:", error);

        document.getElementById("mensaje-usuarios").innerHTML = `
            <div class="alert alert-danger">
                No se pudo actualizar el usuario.
            </div>
        `;
    }
}
function cancelarEdicion() {

    usuarioEditandoId = null;

    document.getElementById("form-usuario").reset();

    document.getElementById("btn-guardar").textContent =
        "Agregar usuario";

    document.getElementById("btn-cancelar")
        .classList.add("d-none");
}
const socket = io();

//Socket Chat
socket.on("mensajes", (data) => {
  const html = data
    .map((msj) => {
      return `<div class="rounded col-3 text-break" style="background: gray">
        <strong style="color: blue">${msj.email}:</strong>
        <em style="color: white">${msj.message}</em>
        <br>
        <em>${msj.date}</em>
        </div>`;
    })
    .join("<br>");

  document.getElementById("messages").innerHTML = html;
});

document
  .getElementById("chat-form")
  .addEventListener("submit", function (event) {
    const message = {
      date: new Date().toLocaleString(),
      email: document.getElementById("email").value,
      message: document.getElementById("message").value,
    };

    socket.emit("new-message", message);
    event.preventDefault();
    document.getElementById("chat-form").reset();
  });

//Socket producto
socket.on("productos", (data) => {
  const html =
    data.length > 0
      ? `<table class="table table-dark text-center" ><tr style="color: yellow;">
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
            </tr> ${data
              .map((msj) => {
                return `
                  <tr>
                    <td>
                        ${msj.nombre}
                    </td>
                    <td>
                        ${msj.precio}
                    </td>
                    <td>
                        <img style="max-height: 100px;" src="${msj.thumbnail}" alt="${msj.nombre}">
                    </td>
                    <td>
                        <button type="button"
                          class="btn btn-danger" onclick="deleteProduct(${msj.id})")>Borrar</button>
                    </td>
                </tr>   
        `;
              })
              .join("")}</table>`
      : `<h3 class="alert alert-danger">No se encontraron productos</h3>`;

  document.getElementById("historial-productos").innerHTML = html;
});

document
  .getElementById("products-form")
  .addEventListener("submit", function (event) {
    const producto = {
      nombre: document.getElementById("nombre").value,
      precio: document.getElementById("precio").value,
      thumbnail: document.getElementById("thumbnail").value,
    };

    socket.emit("new-product", producto);
    event.preventDefault();
    document.getElementById("products-form").reset();
  });

//Boton Delete
document
  .getElementById("chat-form")
  .addEventListener("submit", function (event) {
    const message = {
      author: document.getElementById("username").value,
      text: document.getElementById("text").value,
      date: new Date().toLocaleString(),
    };

    socket.emit("new-message", message);
    event.preventDefault();
    document.getElementById("chat-form").reset();
  });

const deleteProduct = (id) => {
  socket.emit("delete-product", id);
};

const socket = io();

//Socket Chat
socket.on("mensajes", (data) => {
  const html = data
    .map((msj) => {
      return `<p style="color: brown">
        <strong style="color: blue">${msj.email} </strong>
        [${msj.date}]
        <em style="color: green">${msj.message}</em>
        </p>`;
    })
    .join("");

  document.querySelector("#messages").innerHTML = html;
});

document
  .querySelector("#chat-form")
  .addEventListener("submit", function (event) {
    const message = {
      date: new Date().toLocaleString(),
      email: document.querySelector("#email").value,
      message: document.querySelector("#message").value,
    };

    socket.emit("new-message", message);
    event.preventDefault();
    document.querySelector("#chat-form").reset();
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

  document.querySelector("#historial-productos").innerHTML = html;
});

document
  .querySelector("#products-form")
  .addEventListener("submit", function (event) {
    const producto = {
      nombre: document.querySelector("#nombre").value,
      precio: document.querySelector("#precio").value,
      thumbnail: document.querySelector("#thumbnail").value,
    };

    socket.emit("new-product", producto);
    event.preventDefault();
    document.querySelector("#products-form").reset();
  });

//Boton Delete
document
  .querySelector("#chat-form")
  .addEventListener("submit", function (event) {
    const message = {
      author: document.querySelector("#username").value,
      text: document.querySelector("#text").value,
      date: new Date().toLocaleString(),
    };

    socket.emit("new-message", message);
    event.preventDefault();
    document.querySelector("#chat-form").reset();
  });

const deleteProduct = (id) => {
  socket.emit("delete-product", id);
};

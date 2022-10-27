class Usuario{
    constructor(nombre, apellido, libros, mascotas){
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }
    getFullName(){
        return `${this.nombre} ${this.apellido}`
    };
    addMascota(mascotaNueva){
        this.mascotas.push(mascotaNueva);
    };
    countMascotas(){
        return this.mascotas.length;
    };
    addBook(nombre, autor){
        this.libros.push({nombre: nombre, autor: autor})
    };
    getBookNames(){
        return this.libros.map(e => e.nombre);
    }
}

const user1 = new Usuario("Luciano", "Lupo",[{nombre: "1984", autor: "Orwell"}], ["Mao"]);
let nombre = user1.getFullName(); 
user1.addMascota("Milhouse");
let cantidadMascotas = user1.countMascotas();
user1.addBook("La Rebelion en la granja", "Orwell");
let nombreLibros = user1.getBookNames();
console.log(user1)
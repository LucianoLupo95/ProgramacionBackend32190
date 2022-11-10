const express = require('express');
const fs = require('fs');
const app = express()

//Contenedor
class Contenedor{
    constructor(archivo){
        this.archivo = archivo;
    }
    async save(obj){
        const arrayObjetos = await this.getAll();
        arrayObjetos.push(obj);
        let indice = arrayObjetos.indexOf(obj);
        if(arrayObjetos.length <= 1){
            arrayObjetos[indice]['id']= 1;
        }else{
            arrayObjetos[indice]['id'] = arrayObjetos[indice - 1 ]['id'] + 1;            
        }
        const str = JSON.stringify(arrayObjetos, null, 2);
        try{
            await fs.promises.writeFile(this.archivo, str);
        }
        catch(err) {
            console.log("No se pudo guardar");
        }
    }
    async getById(id){
        let array = await this.getAll();
        let element = array.find(e => e.id === id); 
        if(element == undefined){
            element = null;
        }
        return element;
    }
    async getAll(){
        try{
            const contenido = await fs.promises.readFile(this.archivo, 'utf-8');
            const obj = JSON.parse(contenido);
            return obj;
        }
        catch(err) {
            return [];
        }    
    }
    async deleteById(id){
        let array = await this.getAll();
        let nuevoArray = array.filter(e => e.id !== id);
        const str = JSON.stringify(nuevoArray, null, 2);
        try{
            await fs.promises.writeFile(this.archivo, str);
        }
        catch(err) {
            console.log("No se pudo borrar");
        }

    }
    async deleteAll(){
        try{
            await fs.promises.writeFile(this.archivo, []);
        }
        catch{
            console.log("No se pudo eliminar");
        }
    }
};
const contenedorProductos = new Contenedor('productos.txt');

app.get('/productos', (req, res) => {
    contenedorProductos.getAll()
    .then((productos) => res.send(productos))
    .catch(err => console.log(err))
})
app.get('/productoRandom', (req, res) => {

    contenedorProductos.getAll()
    .then(productos =>{
        let random = Math.floor(Math.random() * productos.length);
        res.send(productos[random]);
    })
    .catch(err => console.log(err))
    // contenedor.getAll()
    // .then(productos =>{
    //     let randomNum = Math.floor(Math.random() * (productos.length - 0 + 1)) + 0;
    //     res.send(JSON.stringify(productos[randomNum],null,2))
    // })
    // .catch(err => console.log(err))
})


const server = app.listen(8080, () =>{
    console.log('Servidor escuchando en el puerto 8080');
})

server.on('error', error => console.log('Hubo un error: ' + error))



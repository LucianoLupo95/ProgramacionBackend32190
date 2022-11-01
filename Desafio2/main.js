const fs = require('fs');
class Contenedor{
    constructor(archivo){
        this.archivo = archivo;
        this.arrayObjetos = [];
    }
    async save(obj){
        const arrayObjetos = await this.getAll();
        arrayObjetos.push(obj);
        let indice = arrayObjetos.indexOf(obj);
        if(arrayObjetos.length <= 1){
            arrayObjetos[indice]['id'] = 1;
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
    getById(id){
        let array = this.getAll();
        let element = array.find(e => e['id'] == id); 
        if(element == undefined){
            element = null;
        }
        return element;
    }
    getAll(){
        try{
            const contenido = fs.readFileSync(this.archivo, 'utf-8');
            const obj = JSON.parse(contenido);
            return obj;
        }
        catch(err) {
            return this.arrayObjetos;
        }    
    }
    async deleteById(id){
        let array = this.getAll();
        let nuevoArray = array.filter(e => e['id'] != id);
        const str = JSON.stringify(nuevoArray, null, 2);
        try{
            await fs.promises.writeFile(this.archivo, str);
        }
        catch(err) {
            console.log("No se pudo guardar");
        }

    }
    async deleteAll(){
        try{
            await fs.promises.unlink(this.archivo);
        }
        catch{
            console.log("No se pudo eliminar");
        }
    }
};

const objeto1 = {
    title: "Amatista",
    price: 800,
    thumbnail: "https://rocasycristales.com/2863-large_default/amatista.jpg"
}

const objeto2 = {
    title: "Citrino",
    price: 1000,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_779438-MLA43309401563_082020-O.jpg"
}
const contenedor = new Contenedor("./prueba.txt");

async function ejecutarTodo(){
    await contenedor.save(objeto1);
    await contenedor.save(objeto2);
    await contenedor.save(objeto2);
    await contenedor.save(objeto1);
    console.log("save():\n");
    console.log(contenedor.getAll());
    console.log()

    console.log("getById(1):\n");
    console.log(contenedor.getById(1))

    await contenedor.deleteById(2);
    console.log()
    console.log("deleteById(2):\n");
    console.log(contenedor.getAll());

    await contenedor.deleteAll();
    console.log()
    console.log("deleteAll():\n");
    console.log(contenedor.getAll());
}

ejecutarTodo();

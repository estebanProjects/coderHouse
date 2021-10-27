const express = require('express')
const path = require('path')
const fs = require('fs')


const app = express()
const port = process.env.PORT || 8080

const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

const productRoutes = require('./productos')

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use("/api", productRoutes)

// PROYECT-

const writeFileAsync = async (arr, nameFile) => {
  await fs.promises.writeFile(
    nameFile,
    JSON.stringify(arr, null, 2),
    "utf-8"
  );
}; 

const readFileAsync = async (nameFile) => {
  let file = await fs.promises.readFile(nameFile, "utf-8");
  return file;
};

const truncateAsync = async (nameFile) => {
  await fs.promises.truncate(
    nameFile, 0, function() {

    }
  )
}

class Contenedor {
  constructor(nameFile) {
    this.nameFile = nameFile
  }

  async save(product) {
    let fileExits = await readFileAsync(this.nameFile); 
    if (fileExits && fileExits.length >= 0) {
      let dataFile = JSON.parse(fileExits);
      product.id = dataFile[dataFile.length - 1].id + 1;
      dataFile.push(product);
      // this.productos = dataFile;
      writeFileAsync(dataFile, this.nameFile);
      return product.id
    } else {
      let dataFile = []
      product.id = 1;
      dataFile.push(product);
      console.log(dataFile)

      writeFileAsync(dataFile, this.nameFile);
      return product.id
    }
  }

  async getById(id) {
    let fileExits = await readFileAsync(this.nameFile)

    if(fileExits) {
      let dataFile = JSON.parse(fileExits)

      for(let i=0; i<dataFile.length; i++) {
        if(dataFile[i].id == id) {
          return dataFile[i]
        }
      }
      return {error: "Producto no encontrado"}
    }
  }

  async getAll() {
    let datos = await readFileAsync(this.nameFile)

    if(datos) {
      let dataFile = JSON.parse(datos)
      return dataFile
    }
  }

  async deleteById(id) {
    let datos = await readFileAsync(this.nameFile)
    
    if(datos) {
      let dataFile = JSON.parse(datos)
      for(let i=0; i<dataFile.length; i++) {
        if(dataFile[i].id == id) {
          dataFile.splice(i, 1)
          truncateAsync(this.nameFile)
          writeFileAsync(dataFile, this.nameFile)
        }
      }
    }
  }

  async deleteAll() {
    truncateAsync(this.nameFile)
  }

}

// PROYECT-

let contenedor = new Contenedor("./productos.txt");


// llama a todos los metodos de Contenedor
async function ejecutarPrograma() {
  
    // Save
    let id = await contenedor.save({                                                                                                                                                 
      title: 'Escuadra',                                                                                                                                 
      price: 123.45,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png'                                                                                                                                                                         
    })
    console.log("id del elemento guardado: ",id) 
  
    let id2 = await contenedor.save({                                                                                                                                                    
      title: 'Calculadora',                                                                                                                              
      price: 234.56,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png'                                                                                                                                                                                  
    })
    console.log("id del elemento guardado: ",id2) 
  
    let id3 = await contenedor.save({                                                                                                                                                    
      title: 'Globo Terráqueo',                                                                                                                          
      price: 345.67,                                                                                                                                     
      thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png',                                                                                                                                                                               
    })
    console.log("id del elemento guardado: ",id3) 
  
    // Get by Id
   let obj = await contenedor.getById(1)
   console.log("El objeto con el id buscado:\n ",obj)
    // Get All
   let objAll = await contenedor.getAll()
   console.log("Todos los objetos del archivo:\n",objAll)
    // Delete By Id
   //  await contenedor.deleteById(2) 
  
    // Delete All
   // await contenedor.deleteAll() 
}
  
// ejecutarPrograma()

// Metodos Get
app.get('/', (req, res) => {
  res.send("<h1 style='color:blue'> Welcome :D!</h1><br/><h2 style='color:aqua'>Prueba entrando en /productos y /productoRandom</h2>")      
})

app.get('/productoRandom', async (req, res) => {
      let allData = await readFileAsync(contenedor.nameFile)
      allData = JSON.parse(allData)
      let numRandom = Math.floor(Math.random()*allData.length)
      let productChosen = allData[numRandom]

      res.send(productChosen)    
})

app.get('/form', (req, res) => {
  res.sendFile(__dirname+"/public/form.html")
})

app.post("/", async (req, res) => {
  req.body.price = Number(req.body.price)                                                                                                                                                                      
    await contenedor.save(req.body)  
    console.log(req.body)
    res.send("Informacion enviada")
})

module.exports.contenedor = contenedor


app.listen(port, () => {
    console.log("Server run on port " + port)
})
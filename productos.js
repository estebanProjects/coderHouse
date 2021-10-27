const express = require('express')
const fs = require('fs')
const app = express()

// app.use(bodyParser.json());
app.use(express.json())


const inde = require('./index')

const { Router } = express

const writeFileAsync = async (arr, nameFile) => {
    await fs.promises.writeFile(
      nameFile,
      JSON.stringify(arr, null, 2),
      "utf-8"
    );
  }; 

const router = new Router()

// GET
router.get('/productos', async (req, res) => {
    res.send(await inde.contenedor.getAll())    
})

router.get('/productos/:id', async (req, res) => {
    console.log(req.params.id)
    res.send(await inde.contenedor.getById(req.params.id))
})

// POST
router.post('/productos', async (req, res) => {
    await inde.contenedor.save(req.body)
    res.send("El producto se guardo correctamente")
})

// PUT
router.put('/productos/:id', async (req, res) => {
    let datos = await inde.contenedor.getAll()
    let index = datos.findIndex(x => {
        return x.id == req.params.id
    })

    datos[index].title = req.body.title
    datos[index].price = req.body.price
    datos[index].thumbnail = req.body.thumbnail
    writeFileAsync(datos, inde.contenedor.nameFile)
    
    res.send("Producto actualizado!")
})

// DELETE
router.delete('/productos/:id', async (req, res) => {
    await inde.contenedor.deleteById(req.params.id)
    res.send("Producto removido correctamente!")
})

module.exports = router
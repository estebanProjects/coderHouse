const express = require('express')
const app = express()

// app.use(bodyParser.json());
app.use(express.json())


const inde = require('./index')

const { Router } = express


const router = new Router()

// GET
router.get('/productos', async (req, res) => {
    let productos = await inde.contenedor.getAll() 
    console.log(productos)
    res.render('productosAll', {productos})
    // res.send(await inde.contenedor.getAll())    
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
    
    inde.writeFileAsync(datos, inde.contenedor.nameFile)
    
    res.send("Producto actualizado!")
})

// DELETE
router.delete('/productos/:id', async (req, res) => {
    await inde.contenedor.deleteById(req.params.id)
    res.send("Producto removido correctamente!")
})

module.exports = router
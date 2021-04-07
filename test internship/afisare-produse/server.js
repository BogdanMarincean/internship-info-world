const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const cors = require('cors')
const app=express()

app.use(cors())
app.use(bodyParser.json())

const sequelize = new Sequelize('produse_test', 'root', '', {
    dialect: 'mysql'
})

const Produs = sequelize.define('produs', {
    nume: {
        type: Sequelize.STRING,
        allowNull: false
    },
    pret: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cantitate: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    descriere: {
        type: Sequelize.STRING,
        allowNull: true
    },
    comentarii: {
        type: Sequelize.STRING,
        allowNull: true
    },
    rating: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
})

app.get('/create', async (req, res, next) => {
    try {
      await sequelize.sync({ force: true })
      res.status(201).json({ message: 'created' })
    } catch (err) {
      next(err)
    }
  })

  app.post('/produse', async (req, res, next) => {
    try {
      await Produs.create(req.body)
      res.status(201).json({ message: 'created' })
    } catch (err) {
      next(err)
    }
  })
  app.get('/produse', async(req, res, next) => {
    try {
      const produse = await Produs.findAll()
      res.status(200).json(produse)
    } catch(err) {
      next(err)
    }
  })

  app.put('/produse/:pid', async (req, res, next) => {
    try {
      const produs = await Produs.findByPk(req.params.pid)
      if (produs) {
        await produs.update(req.body)
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (err) {
      next(err)
    }
  })
   
  app.delete('/produse/:pid', async (req, res, next) => {
    try {
      const produs = await Produs.findByPk(req.params.pid)
      if (produs) {
        await produs.destroy()
        res.status(202).json({ message: 'accepted' })
      } else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (err) {
      next(err)
    }
  })

app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})
   
app.listen(8080)
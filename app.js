const express = require('express');
const chalk = require('chalk')

const PORT = process.env.PORT || 5555

const app = express();
const database = require('./conf')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

//.1. Ruta POST para crear una nueva playlist
app.post('/crear-playlist', (req, res)=>{
  database.query('INSERT INTO playlist SET ?', req.body, (error, results)=>{
    if(!error){
      res.send(req.body)
    } else {
      res.send(error)
    }
  })
})

//2. Ruta GET para ver una playlist poniendo su ID en el url
app.get('/playlist/:id', (req, res)=>{
  database.query('SELECT * FROM playlist WHERE id=?', req.params.id, (error, results)=>{
    if(!error){
      res.send(results)
    } else {
      res.send(error)
    }
  })
})


//3. Ruta POST para crear una canción y asignarla a una playlist
app.post('/crear-cancion', (req, res)=>{
  database.query('INSERT INTO track SET ?', req.body, (error, results)=>{
    if(!error){
      database.query('SELECT * FROM track WHERE title=?', req.body.title, (error, results)=>{
        if(!error){
          res.send(results)
        } else {
          res.send(error)
        }
      })
    } else {
      res.send(error)
    }
  })
})

//4. Ruta GET para ver todas las canciones de una playlist
app.get('/playlist/ver-canciones/:id', (req, res)=>{
  database.query('SELECT * FROM track WHERE playlist_id=?', req.params.id, (error, results)=>{
    if(!error){
      res.send(results)
    } else {
      res.send(error)
    }
  })
})

//5. Ruta DELETE para eliminar una playlit
app.delete('/eliminar-playlist/:id', (req, res)=>{
  database.query('DELETE FROM playlist WHERE id=?', req.params.id, (error, results)=>{
    if(!error){
      res.send('Playlist borrada')
    } else {
      res.send(error)
    }
  })
})

//6. Ruta PUT para editar una playlist
app.put('/edit-playlist/:nombrePlaylist', (req, res) => {
  database.query('UPDATE playlist SET ? WHERE title=?', [req.body, req.params.nombrePlaylist], (error, results) => {
      if (!error) {
          res.status(201).json(results);
      } else {
          res.status(400).send(error);
      }
  })
})

//7. Ruta DELETE para eliminar una canción de una playlist
app.put('/eliminar-cancion-de-playlist/:id', (req, res) => {
  database.query('UPDATE track SET playlist_id=0 WHERE id=?', req.params.id, (error, results) => {
      if (!error) {
          database.query('SELECT * FROM track WHERE id=?', req.params.id, (error, results)=>{
            if(!error){
              res.send(results)
            } else {
              res.send(error)
            }
          })
      } else {
          res.status(400).send(error);
      }
  })
})

//8. Ruta PUT para editar una canción de una playlist
app.put('/editar-cancion/:id', (req, res)=>{
  database.query('UPDATE track SET ? WHERE id=?', [req.body, req.params.id], (error, results) => {
    if (!error) {
        database.query('SELECT * FROM track WHERE id=?', req.params.id, (error, results)=>{
          if(!error){
            res.send(results)
          } else {
            res.send(error)
          }
        })
    } else {
        res.status(400).send(error);
    }
  })
})


//BONUS

//9. Ruta GET para conseguir una playlist por titulo y genero
app.get('/bonus', (req, res)=>{
  if(req.query.title == undefined && req.query.genre == undefined){
    res.status(404).send()
  } else if(req.query.title == undefined){
    database.query('SELECT * FROM playlist WHERE genre=?', req.query.genre, (error, results)=>{
      !error
      ? res.send(results)
      : res.send(error)
    })
  } else if(req.query.genre == undefined){
    database.query('SELECT * FROM playlist WHERE title=?', req.query.title, (error, results)=>{
      !error
      ? res.send(results)
      : res.send(error)
    }) 
  } else {
    database.query('SELECT * FROM playlist WHERE title=? AND genre=?', [req.query.title, req.query.genre], (error, results)=>{
      !error
      ? res.send(results)
      : res.send(error)
    })
  }
})


app.listen(PORT, ()=>{
  console.log(chalk.green.inverse.bold(`Conectado en puerto ${PORT}`))
})
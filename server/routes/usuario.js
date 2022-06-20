const express = require("express");

const bcrypt = require('bcrypt'); //para encriptar la contraseña
const _ = require('underscore')

const Usuario = require("../models/usuario");

const app = express();
app.get("/usuario", function (req, res) {

  let desde = req.query.desde || 0;

  let limite = req.query.limite || 5;
  limite = Number(limite)
  //filtra los resultados como queramos y los muestra
  Usuario.find({ estado: true }, 'nombre email role estado google img')
  .skip(desde) //salta los primeros 5
  .limit(limite) //muestra los primeros 5
  .exec( (err, usuarios) =>{
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    Usuario.count({estado: true},(err,conteo)=>{
      //regresamos la respuesta al servicio a postman
    res.json({
      ok: true,
      usuarios,
      cuantos:conteo
    })
    })
    
  } )
  
  //res.json("get Usuario LOCAL!!");
});

app.post("/usuario", function (req, res) {
  let body = req.body;
  //crea un nueva instancia de ese schemma con todas las propiedades de mongoose
  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10), 
    role: body.role,
  });

  //esta es la forma que lo guardo en la base de datos 'save' es una propiedad de mongoose
  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

    //para que la encryptacion de la contraseña no se muestre en el usuarioDB
    //usuarioDB.password = null;
    
    
    //si no es un err que me tire la info.
    res.json({
      ok: true,
      usuario: usuarioDB,
    });
  });
});

app.put("/usuario/:id", function (req, res) {
  let id = req.params.id;
  let body =  _.pick(req.body, ['nombre','email', 'img', 'role','estado']) ;



  //actualizar los datos de los usuarios, atraves del id mediante la peticion PUT
  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true},  (err, usuarioDB) => {
    

    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }

      res.json({
    ok: true,
    usuario: usuarioDB
  });
  
  })

 
});

app.delete("/usuario/:id", function (req, res) {
  
  let id = req.params.id
//eliminamos un registro de la base de datos
  //Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{

  let cambiaEstado = {
    estado: false
  }

  Usuario.findByIdAndUpdate(id,cambiaEstado, {new: true}, (err, usuarioBorrado)=>{


    if (err) {
      return res.status(400).json({
        ok: false,
        err,
      });
    }
    //si no existe usuario borrado pasa esto
    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          messaje: 'Usuario no encontrado'
        }
      });
    }

    res.json({
      ok: true,
      usuario: usuarioBorrado
    })

  })
  
  
  //res.json("delete Usuario");
});

module.exports = app;

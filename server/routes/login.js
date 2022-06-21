const express = require("express");

const bcrypt = require('bcrypt'); //para encriptar la contraseña
const jwt = require('jsonwebtoken')

const Usuario = require("../models/usuario");

const app = express();


app.post('/login', (req, res)=>{
    //obtenemos el body (el email y el password)
    let body = req.body;
    //verificamos si ese mail existe
    Usuario.findOne({ email: body.email }, (err, usuarioDB)=>{  //usamos la U mayuscula de Usuario para utilizar el schemma completo- findOne regresa solo uno

        if (err) {
            return res.status(500).json({
              ok: false,
              err,
            });
          }

          if (!usuarioDB ){
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
              });
          }

          //tomamos la contraseña la encriptamos y vemos si hace match con la contraseña de la BD, en este caso se utiliza compareSync
          if ( !bcrypt.compareSync( body.password, usuarioDB.password)){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
              });
          } 

          let token = jwt.sign({
            usuario: usuarioDB
          }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN})  //expira en 60 seg * 60min osea 1hs

          res.json({
            ok: true,
            usuario:usuarioDB,
            token
          })

    }) 

})









module.exports = app;

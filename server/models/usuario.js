const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un rol valido'
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"],
  },
  email: {
    type: String,
    unique: true,  //es para que no hay mas de un usuario con el mismo mail
    required: [true, "El correo es necesario"],
  },
  password: {
    type: String,
    required: [true, "La contraseña debe ser obligatoria"],
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: 'USER_ROLE', //Porque no es obligatorio
    enum: rolesValidos,
  },
  estado: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false,    //Si no se crea con el usuario de google siempre va a ser un usuario normal, por eso es false
  },
});
//modificamos cuando se imprima mediante toJson el user schemma, en este caso eliminar la encriptacion del password de la vista de los usuarios
usuarioSchema.methods.toJSON = function (){

  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico'})

module.exports = mongoose.model( 'Usuario', usuarioSchema )
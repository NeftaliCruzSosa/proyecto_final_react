const express = require("express");
const User = require("../models/users.model");
const router = express.Router();
const { isAdmin, isAuth } = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const { generateSign } = require("../../util/jwt/jwt");


router.post("/login", async (req, res) => {

    try {
        const userDB = await User.findOne({email: req.body.email});
        if (!userDB) {
            return res.status(404).json("No existe el usuario");
        }
        if (bcrypt.compareSync(req.body.password, userDB.password)){
            const token = generateSign(userDB._id, userDB.email);
            return res.status(200).json({token, userDB});
        } else {
            return res.status(200).json("La contraseña es incorrecta");
        }
    } catch (error) {
        return res.status(500).json("Error al loguear el usuario");
    }

});

router.post("/logout", async (req, res) => {

    try {
        const token = null;
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json(error);
    }

});

router.post("/checksession", [isAuth], (req, res, next) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post("/create", async (req, res) => {
    try {
      const user = req.body;
      const newUser = new User(user);
      console.log(user)
      console.log(newUser)
      if (newUser.rol === "user") {
          const created = await newUser.save();
          return res.status(201).json(created);
      }else {
          return res.status(500).json("No puedes crear cuenta de admin")
      } 
    } catch (error) {
      return res.status(500).json("Error al crear el usuario");
    }
  });

  router.delete("/delete/:id", [isAdmin], async (req, res, next) => {
    try {
      const id = req.params.id;
      const userToDelete = await User.findByIdAndDelete(id);
      return res.status(200).json("Se ha conseguido borrar el usuario");
    } catch (error) {
      return next(error);
    }
  });
  
  router.put("/edit/:id", [isAdmin], async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = req.body;
      const userModify = new User(user);
      userModify._id = id;
      await User.findByIdAndUpdate(id, userModify);
      return res.status(200).json("Se ha conseguido editar el usuario");
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;

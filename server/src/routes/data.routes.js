const { Router } = require("express");
const router = Router();

const {
  checkDatabaseConnection,
    createRegistroPcd,
    updateRegistroPcd,
    getRegistrosByMunicipio,
    getRegistroById,
    createUsuario,
    loginUsuario,
    editUsuario,
    deleteUsuario,
    getUsuariosByMunicipio
} = require("../controllers/data.controllers");

router.get("/check", checkDatabaseConnection);
router.post("/registro-pcd/:id_usuario", createRegistroPcd);
router.put("/registro-pcd/:id_registro_discapacidad", updateRegistroPcd);
router.get("/registro-pcd/:id_registro_discapacidad", getRegistroById);
router.get("/registros-pcd/:id_municipio", getRegistrosByMunicipio);
router.post("/usuario/:id_municipio", createUsuario);
router.put("/usuario/:id_usuario", editUsuario);
router.delete("/usuario/:id_usuario", deleteUsuario);
router.get("/usuarios/:id_municipio", getUsuariosByMunicipio);
router.post("/login", loginUsuario);

module.exports = router;
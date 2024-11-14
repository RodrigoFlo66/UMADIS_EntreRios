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
    getUsuariosByMunicipio,
    createRegistroAtencion,
    updateRegistroAtencion,
    getRegistrosAtencionByDiscapacidad,
    getRegistrosAtencionByUsuario,
    getRegistrosAtencion
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
router.post("/registro-atencion/:id_usuario/:id_registro_discapacidad", createRegistroAtencion);
router.put("/registro-atencion/:id_registro_atencion", updateRegistroAtencion);
router.get("/registros-atencion/:id_registro_discapacidad", getRegistrosAtencionByDiscapacidad);
router.get("/registros-atencion-usuario/:id_usuario", getRegistrosAtencionByUsuario);
router.get("/registro-atencion/:id_registro_atencion", getRegistrosAtencion);

module.exports = router;
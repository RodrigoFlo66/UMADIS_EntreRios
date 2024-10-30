const { Router } = require("express");
const router = Router();

const {
  getRegistros,
  createRegistro,
  selecRegistro,
  deleteRegistro,
  getAllregistros,
  updateRegistro,
  getFilteredRegistros,
  getStatistics
} = require("../controllers/data.controllers");

router.get("/registro", getRegistros);
router.get("/AllRegistro", getAllregistros);
router.get("/registro/:id_registro", selecRegistro);
router.get("/filterRegistro", getFilteredRegistros);
router.get("/statistics", getStatistics);
router.post("/registro", createRegistro);
router.delete("/registro/:id_registro", deleteRegistro);
router.put("/registro/:id_registro", updateRegistro);

module.exports = router;
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const storeRoutes = require("./routes/data.routes");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(storeRoutes);

// Encapsula el inicio del servidor en una función
function startServer() {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
  
  module.exports = { startServer };
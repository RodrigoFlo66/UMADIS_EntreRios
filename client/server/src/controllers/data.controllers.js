const bcrypt = require('bcrypt'); 
const pool = require("../db");
const multer = require("multer");
const { createAndUploadFile } = require('../uploadPDF.js');
const storage = multer.memoryStorage(); // Almacena el archivo en memoria como buffer
const upload = multer({ storage });
// Configuración de Multer para aceptar solo archivos PDF
const uploadFile = (req, res, next) => {
  upload.single('file')(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
          return res.status(400).json({ error: err.message });
      } else if (err) {
          return res.status(400).json({ error: err.message });
      }

      const file = req.file;

      if (!file) {
          return res.status(400).json({ error: "Por favor, sube un archivo." });
      }

      try {
          console.log("Archivo recibido: ", file.originalname);

          // Subir el archivo a Google Drive
          const link = await createAndUploadFile(file);

          // Enviar la URL del archivo subido al cliente
          res.json({ link });
      } catch (error) {
          console.error("Error al subir el archivo a Google Drive:", error);
          res.status(500).json({ error: "No se pudo subir el archivo. Intenta nuevamente." });
      }
  });
};

const checkDatabaseConnection = async (req, res) => {
  try {
    // Ejecutar una consulta simple para comprobar la conexión
    const result = await pool.query("SELECT NOW()");
    return res.json({
      message: 'Database connection successful',
      currentDate: result.rows[0].now,
    });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Error executing query' });
  }
}

const getEstadisticas = async (req, res) => {
  try {
    // Consulta SQL para obtener las estadísticas de los registros con permanencia 'PERMANECE'
    const queryPermanencia = `
      SELECT 
        distrito_domicilio,
        sexo,
        CASE
          WHEN fecha_nacimiento IS NULL THEN 'Desconocida'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 0 AND 5 THEN '0-5'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 6 AND 18 THEN '6-18'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 19 AND 30 THEN '19-30'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) BETWEEN 31 AND 59 THEN '31-59'
          WHEN EXTRACT(YEAR FROM AGE(fecha_nacimiento)) >= 60 THEN '60+'
          ELSE 'Desconocida'
        END AS rango_edad,
        grado_discapacidad,
        tipo_discapacidad,
        COUNT(*) AS total
      FROM public.REGISTRO_PCD
      WHERE permanencia = 'PERMANECE'
      GROUP BY distrito_domicilio, sexo, rango_edad, grado_discapacidad, tipo_discapacidad
      ORDER BY distrito_domicilio, sexo, rango_edad, grado_discapacidad, tipo_discapacidad;
    `;
    const resultPermanencia = await pool.query(queryPermanencia);

    // Consulta SQL para obtener estadísticas de todos los registros (PERMANECE + CERRADO)
    const queryTotal = `
      SELECT distrito_domicilio, permanencia, COUNT(*) AS total
      FROM public.REGISTRO_PCD
      GROUP BY distrito_domicilio, permanencia
      ORDER BY distrito_domicilio, permanencia;
    `;
    const resultTotal = await pool.query(queryTotal);

    // Formatear los datos de permanencia
    const data = {};
    resultTotal.rows.forEach(row => {
      const {distrito_domicilio, permanencia, total} = row;
      if (!data[distrito_domicilio]) {
        data[distrito_domicilio] = {
          PERMANECE: 0,
          CERRADO: 0,
          VARON: 0,
          MUJER: 0,
          "0-5": 0,
          "6-18": 0,
          "19-30": 0,
          "31-59": 0,
          "60+": 0,
          "MUY GRAVE": 0,
          "GRAVE": 0,
          "MODERADO": 0,
          "LEVE": 0,
          AUDITIVA: 0,
          "FISICA MOTORA": 0,
          INTELECTUAL: 0,
          MULTIPLE: 0,
          PSIQUICA: 0,
          VISCERAL: 0,
          VISUAL: 0,
          RETRASO: 0,
        };
      }

      if (permanencia) {
        data[distrito_domicilio][permanencia] += parseInt(total);
      }
    });

    // Sumar los datos de la consulta de permanencia 'PERMANECE'
    resultPermanencia.rows.forEach(row => {
      const { distrito_domicilio, sexo, rango_edad, grado_discapacidad, tipo_discapacidad, total } = row;
      
      // Verificar si ya existe el distrito
      if (!data[distrito_domicilio]) {
        data[distrito_domicilio] = {
          PERMANECE: 0,
          CERRADO: 0,
          VARON: 0,
          MUJER: 0,
          "0-5": 0,
          "6-18": 0,
          "19-30": 0,
          "31-59": 0,
          "60+": 0,
          "MUY GRAVE": 0,
          "GRAVE": 0,
          "MODERADO": 0,
          "LEVE": 0,
          AUDITIVA: 0,
          "FISICA MOTORA": 0,
          INTELECTUAL: 0,
          MULTIPLE: 0,
          PSIQUICA: 0,
          VISCERAL: 0,
          VISUAL: 0,
          RETRASO: 0,
        };
      }

      // Contar según los atributos
      if (sexo) {
        data[distrito_domicilio][sexo] += parseInt(total);
      }

      if (rango_edad) {
        data[distrito_domicilio][rango_edad] += parseInt(total);
      }

      if (grado_discapacidad) {
        data[distrito_domicilio][grado_discapacidad] += parseInt(total);
      }

      if (tipo_discapacidad) {
        data[distrito_domicilio][tipo_discapacidad] += parseInt(total);
      }
    });

    // Convertir los datos en filas para Tabulator
    const rows = [
      { atributo: "PERMANECE", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.PERMANECE])) },
      { atributo: "CERRADO", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.CERRADO])) },
      { atributo: "VARON", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.VARON])) },
      { atributo: "MUJER", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.MUJER])) },
      { atributo: "0-5", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["0-5"]])) },
      { atributo: "6-18", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["6-18"]])) },
      { atributo: "19-30", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["19-30"]])) },
      { atributo: "31-59", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["31-59"]])) },
      { atributo: "60+", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["60+"]])) },
      { atributo: "MUY GRAVE", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["MUY GRAVE"]])) },
      { atributo: "GRAVE", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["GRAVE"]])) },
      { atributo: "MODERADO", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["MODERADO"]])) },
      { atributo: "LEVE", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["LEVE"]])) },
      { atributo: "AUDITIVA", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.AUDITIVA])) },
      { atributo: "FISICA MOTORA", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores["FISICA MOTORA"]])) },
      { atributo: "INTELECTUAL", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.INTELECTUAL])) },
      { atributo: "MULTIPLE", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.MULTIPLE])) },
      { atributo: "PSIQUICA", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.PSIQUICA])) },
      { atributo: "VISCERAL", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.VISCERAL])) },
      { atributo: "VISUAL", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.VISUAL])) },
      { atributo: "RETRASO", ...Object.fromEntries(Object.entries(data).map(([distrito, valores]) => [distrito, valores.RETRASO])) },
    ];

    res.json(rows);
  } catch (err) {
    console.error("Error al obtener las estadísticas:", err);
    res.status(500).json({ error: "Hubo un error al obtener los datos." });
  }
};



//REGISTRO_PCD//
const getRegistroById = async (req, res) => {
  const { id_registro_discapacidad } = req.params;
  try {
    const query = `
      SELECT 
        r.id_registro_discapacidad,
        r.nombre_apellido,
        r.fecha_nacimiento,
        EXTRACT(YEAR FROM AGE(r.fecha_nacimiento)) AS edad,
        r.sexo,
        r.nro_ci,
        r.estado_civil,
        r.idioma_pcd,
        r.tipo_discapacidad,
        r.grado_discapacidad,
        r.deficiencia,
        r.edad_inicio_discapacidad,
        r.dispositivo_utiliza,
        r.nivel_escolaridad,
        r.info_vivienda,
        r.info_laboral,
        r.nombre_familiar,
        r.nro_hijos_pcd,
        r.conyuge_pcd,
        r.direc_domicilio,
        r.distrito_domicilio,
        r.telefono_pdc,
        r.telefono_referencia,
        r.permanencia,
        r.motivo_cierre,
        r.numero_hermanos_pcd,
        r.afiliacion_opcd,
        r.fuente_informacion,
        r.id_municipio
      FROM public.REGISTRO_PCD r
      WHERE r.id_registro_discapacidad = $1;
    `;
    const result = await pool.query(query, [id_registro_discapacidad]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    // Retornar una respuesta con el registro encontrado
    return res.json({
      message: 'Registro obtenido exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al obtener el registro:', error);
    return res.status(500).json({ error: 'Error al obtener el registro' });
  }
};
const getRegistrosByMunicipio = async (req, res) => {
  const { id_municipio } = req.params;
  try {
    const query = `
      SELECT 
        r.id_registro_discapacidad,
        r.nombre_apellido,
        r.fecha_nacimiento,
        EXTRACT(YEAR FROM AGE(r.fecha_nacimiento)) AS edad,
        r.sexo,
        r.nro_ci,
        r.estado_civil,
        r.idioma_pcd,
        r.tipo_discapacidad,
        r.grado_discapacidad,
        r.deficiencia,
        r.edad_inicio_discapacidad,
        r.dispositivo_utiliza,
        r.nivel_escolaridad,
        r.info_vivienda,
        r.info_laboral,
        r.nombre_familiar,
        r.nro_hijos_pcd,
        r.conyuge_pcd,
        r.direc_domicilio,
        r.distrito_domicilio,
        r.telefono_pdc,
        r.telefono_referencia,
        r.permanencia,
        r.motivo_cierre,
        r.numero_hermanos_pcd,
        r.afiliacion_opcd,
        r.fuente_informacion,
        r.id_municipio
      FROM public.REGISTRO_PCD r
      WHERE r.id_municipio = $1;
    `;
    const result = await pool.query(query, [id_municipio]);

    // Retornar una respuesta con los registros encontrados
    return res.json({
      message: 'Registros obtenidos exitosamente',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    return res.status(500).json({ error: 'Error al obtener los registros' });
  }
};
const createRegistroPcd = async (req, res) => {
  const {
    nombre_apellido,
    fecha_nacimiento,
    sexo,
    nro_ci,
    estado_civil,
    idioma_pcd,
    tipo_discapacidad,
    grado_discapacidad,
    deficiencia,
    edad_inicio_discapacidad,
    dispositivo_utiliza,
    nivel_escolaridad,
    info_vivienda,
    info_laboral,
    nombre_familiar,
    nro_hijos_pcd,
    conyuge_pcd,
    direc_domicilio,
    distrito_domicilio,
    telefono_pdc,
    telefono_referencia,
    permanencia,
    motivo_cierre,
    numero_hermanos_pcd,
    afiliacion_opcd,
    fuente_informacion
  } = req.body;

  const { id_municipio } = req.params; 

  try {
    // Consulta SQL para insertar los datos en la tabla REGISTRO_PCD
    const query = `
      INSERT INTO public.REGISTRO_PCD (
        nombre_apellido,
        fecha_nacimiento,
        sexo,
        nro_ci,
        estado_civil,
        idioma_pcd,
        tipo_discapacidad,
        grado_discapacidad,
        deficiencia,
        edad_inicio_discapacidad,
        dispositivo_utiliza,
        nivel_escolaridad,
        info_vivienda,
        info_laboral,
        nombre_familiar,
        nro_hijos_pcd,
        conyuge_pcd,
        direc_domicilio,
        distrito_domicilio,
        telefono_pdc,
        telefono_referencia,
        permanencia,
        motivo_cierre,
        numero_hermanos_pcd,
        afiliacion_opcd,
        fuente_informacion,
        id_municipio
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      ) RETURNING id_registro_discapacidad;
    `;

    // Ejecutar la consulta con los valores
    const result = await pool.query(query, [
      nombre_apellido,
      fecha_nacimiento,
      sexo,
      nro_ci,
      estado_civil,
      idioma_pcd,
      tipo_discapacidad,
      grado_discapacidad,
      deficiencia,
      edad_inicio_discapacidad,
      dispositivo_utiliza,
      nivel_escolaridad,
      info_vivienda,
      info_laboral,
      nombre_familiar,
      nro_hijos_pcd,
      conyuge_pcd,
      direc_domicilio,
      distrito_domicilio,
      telefono_pdc,
      telefono_referencia,
      permanencia,
      motivo_cierre,
      numero_hermanos_pcd,
      afiliacion_opcd,
      fuente_informacion,
      id_municipio
    ]);

    // Retornar una respuesta con el ID del nuevo registro creado
    return res.json({
      message: 'Registro creado exitosamente',
      idRegistro: result.rows[0].id_registro_discapacidad
    });
  } catch (error) {
    console.error('Error al crear el registro:', error);
    return res.status(500).json({ error: 'Error al crear el registro' });
  }
};
const updateRegistroPcd = async (req, res) => {
  const {
    nombre_apellido,
    fecha_nacimiento,
    sexo,
    nro_ci,
    estado_civil,
    idioma_pcd,
    tipo_discapacidad,
    grado_discapacidad,
    deficiencia,
    edad_inicio_discapacidad,
    dispositivo_utiliza,
    nivel_escolaridad,
    info_vivienda,
    info_laboral,
    nombre_familiar,
    nro_hijos_pcd,
    conyuge_pcd,
    direc_domicilio,
    distrito_domicilio,
    telefono_pdc,
    telefono_referencia,
    permanencia,
    motivo_cierre,
    numero_hermanos_pcd,
    afiliacion_opcd,
    fuente_informacion,
  } = req.body;

  const { id_registro_discapacidad } = req.params;

  try {
    // Consulta SQL para actualizar los datos del registro
    const query = `
      UPDATE public.REGISTRO_PCD SET
        nombre_apellido = COALESCE($1, nombre_apellido),
        fecha_nacimiento = COALESCE($2, fecha_nacimiento),
        sexo = COALESCE($3, sexo),
        nro_ci = COALESCE($4, nro_ci),
        estado_civil = COALESCE($5, estado_civil),
        idioma_pcd = COALESCE($6, idioma_pcd),
        tipo_discapacidad = COALESCE($7, tipo_discapacidad),
        grado_discapacidad = COALESCE($8, grado_discapacidad),
        deficiencia = COALESCE($9, deficiencia),
        edad_inicio_discapacidad = COALESCE($10, edad_inicio_discapacidad),
        dispositivo_utiliza = COALESCE($11, dispositivo_utiliza),
        nivel_escolaridad = COALESCE($12, nivel_escolaridad),
        info_vivienda = COALESCE($13, info_vivienda),
        info_laboral = COALESCE($14, info_laboral),
        nombre_familiar = COALESCE($15, nombre_familiar),
        nro_hijos_pcd = COALESCE($16, nro_hijos_pcd),
        conyuge_pcd = COALESCE($17, conyuge_pcd),
        direc_domicilio = COALESCE($18, direc_domicilio),
        distrito_domicilio = COALESCE($19, distrito_domicilio),
        telefono_pdc = COALESCE($20, telefono_pdc),
        telefono_referencia = COALESCE($21, telefono_referencia),
        permanencia = COALESCE($22, permanencia),
        motivo_cierre = COALESCE($23, motivo_cierre),
        numero_hermanos_pcd = COALESCE($24, numero_hermanos_pcd),
        afiliacion_opcd = COALESCE($25, afiliacion_opcd),
        fuente_informacion = COALESCE($26, fuente_informacion)
      WHERE id_registro_discapacidad = $27
      RETURNING id_registro_discapacidad;
    `;

    // Ejecutar la consulta con los valores del body y el ID del registro
    const result = await pool.query(query, [
      nombre_apellido,
      fecha_nacimiento,
      sexo,
      nro_ci,
      estado_civil,
      idioma_pcd,
      tipo_discapacidad,
      grado_discapacidad,
      deficiencia,
      edad_inicio_discapacidad,
      dispositivo_utiliza,
      nivel_escolaridad,
      info_vivienda,
      info_laboral,
      nombre_familiar,
      nro_hijos_pcd,
      conyuge_pcd,
      direc_domicilio,
      distrito_domicilio,
      telefono_pdc,
      telefono_referencia,
      permanencia,
      motivo_cierre,
      numero_hermanos_pcd,
      afiliacion_opcd,
      fuente_informacion,
      id_registro_discapacidad
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    // Retornar una respuesta de éxito
    return res.json({
      message: 'Registro actualizado exitosamente',
      idRegistro: result.rows[0].id_registro_discapacidad
    });
  } catch (error) {
    console.error('Error al actualizar el registro:', error);
    return res.status(500).json({ error: 'Error al actualizar el registro' });
  }
};
//USUARIO//
const createUsuario = async (req, res) => {
  const { nombre_usuario, pasword, nivel_usuario } = req.body;
  const { id_municipio } = req.params;
  try {
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(pasword, 10); // Usando un factor de costo de 10
    const query = `
      INSERT INTO public.USUARIO (
        nombre_usuario,
        pasword,
        nivel_usuario,
        id_municipio
      ) VALUES (
        $1, $2, $3, $4
      ) RETURNING id_usuario;
    `;
    const result = await pool.query(query, [
      nombre_usuario,
      hashedPassword, // Contraseña hasheada
      nivel_usuario,
      id_municipio
    ]);

    // Retornar una respuesta con el ID del nuevo usuario creado
    return res.json({
      message: 'Usuario creado exitosamente',
      idUsuario: result.rows[0].id_usuario
    });
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ error: 'Error al crear el usuario' });
  }
};
const editUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  const { nombre_usuario, pasword, nivel_usuario } = req.body;

  try {
    // Hashear la nueva contraseña solo si se proporciona en la solicitud
    let hashedPassword;
    if (pasword) {
      hashedPassword = await bcrypt.hash(pasword, 10);
    }

    // Construir la consulta SQL de actualización con los valores proporcionados
    const query = `
      UPDATE public.USUARIO
      SET 
        nombre_usuario = COALESCE($1, nombre_usuario),
        pasword = COALESCE($2, pasword),
        nivel_usuario = COALESCE($3, nivel_usuario)
      WHERE id_usuario = $4
      RETURNING id_usuario, nombre_usuario, nivel_usuario;
    `;

    // Ejecutar la consulta de actualización
    const result = await pool.query(query, [
      nombre_usuario || null,
      hashedPassword || null,
      nivel_usuario || null,
      id_usuario,
    ]);

    // Comprobar si se realizó alguna actualización
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Retornar la información del usuario actualizado
    return res.json({
      message: 'Usuario actualizado correctamente',
      usuario: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
const deleteUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const query = `
      DELETE FROM public.USUARIO
      WHERE id_usuario = $1
      RETURNING id_usuario;
    `;
    const result = await pool.query(query, [id_usuario]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Retornar una respuesta confirmando la eliminación del usuario
    return res.json({
      message: 'Usuario eliminado exitosamente',
      idUsuario: result.rows[0].id_usuario
    });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    return res.status(500).json({ error: 'Error al eliminar el usuario' });
  }
};
const getUsuariosByMunicipio = async (req, res) => {
  const { id_municipio } = req.params;
  try {
    const query = `
      SELECT id_usuario, nombre_usuario, nivel_usuario
      FROM public.USUARIO
      WHERE id_municipio = $1;
    `;
    const result = await pool.query(query, [id_municipio]);
    return res.json({
      message: 'Usuarios obtenidos exitosamente',
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    return res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
};
const loginUsuario = async (req, res) => {
  const { nombre_usuario, pasword } = req.body;

  try {
    const query = `SELECT id_usuario, pasword, nivel_usuario FROM public.USUARIO WHERE nombre_usuario = $1`;
    const result = await pool.query(query, [nombre_usuario]);

    // Verificar si el usuario existe
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Comparar la contraseña ingresada con la almacenada usando bcrypt
    const passwordMatch = await bcrypt.compare(pasword, usuario.pasword);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    return res.json({
      message: 'Inicio de sesión exitoso',
      nivelUsuario: usuario.nivel_usuario
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

const createRegistroAtencion = async (req, res) => {
  const {id_registro_discapacidad } = req.params;
  const {
    fecha_registro,
    lugar_registro,
    nombre_pcd,
    atencion_realizada,
    area_atencion,
    donacion,
    nombre_informante,
    link_adjunto
  } = req.body;

  try {
    const query = `
      INSERT INTO public.REGISTRO_ATENCION_PCD (
        fecha_registro,
        lugar_registro,
        nombre_pcd,
        atencion_realizada,
        area_atencion,
        donacion,
        nombre_informante,
        link_adjunto,
        id_registro_discapacidad
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING id_registro_atencion;
    `;

    const result = await pool.query(query, [
      fecha_registro,
      lugar_registro,
      nombre_pcd,
      atencion_realizada,
      area_atencion,
      donacion,
      nombre_informante,
      link_adjunto,
      id_registro_discapacidad
    ]);

    return res.json({
      message: 'Registro de atención creado exitosamente',
      idRegistroAtencion: result.rows[0].id_registro_atencion
    });
  } catch (error) {
    console.error('Error al crear el registro de atención:', error);
    return res.status(500).json({ error: 'Error al crear el registro de atención' });
  }
};
const updateRegistroAtencion = async (req, res) => {
  const { id_registro_atencion } = req.params;
  const {
    fecha_registro,
    lugar_registro,
    nombre_pcd,
    atencion_realizada,
    area_atencion,
    donacion,
    nombre_informante,
    link_adjunto
  } = req.body;

  try {
    const query = `
      UPDATE public.REGISTRO_ATENCION_PCD
      SET
        fecha_registro = $1,
        lugar_registro = $2,
        nombre_pcd = $3,
        atencion_realizada = $4,
        area_atencion = $5,
        donacion = $6,
        nombre_informante = $7,
        link_adjunto = $8
      WHERE
        id_registro_atencion = $9 
      RETURNING id_registro_atencion;
    `;

    const result = await pool.query(query, [
      fecha_registro,
      lugar_registro,
      nombre_pcd,
      atencion_realizada,
      area_atencion,
      donacion,
      nombre_informante,
      link_adjunto,
      id_registro_atencion
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    return res.json({
      message: 'Registro de atención actualizado exitosamente',
      idRegistroAtencion: result.rows[0].id_registro_atencion
    });
  } catch (error) {
    console.error('Error al actualizar el registro de atención:', error);
    return res.status(500).json({ error: 'Error al actualizar el registro de atención' });
  }
};
const getRegistrosAtencionByDiscapacidad = async (req, res) => {
  const { id_registro_discapacidad } = req.params;

  try {
    const query = `
      SELECT 
        id_registro_atencion,
        fecha_registro,
        lugar_registro,
        nombre_pcd,
        atencion_realizada,
        area_atencion,
        donacion,
        nombre_informante,
        link_adjunto,
        id_registro_discapacidad
      FROM public.REGISTRO_ATENCION_PCD
      WHERE id_registro_discapacidad = $1;
    `;

    const result = await pool.query(query, [id_registro_discapacidad]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros de atención para este ID de discapacidad' });
    }

    return res.json({
      message: 'Registros de atención obtenidos exitosamente',
      registros: result.rows
    });
  } catch (error) {
    console.error('Error al obtener los registros de atención:', error);
    return res.status(500).json({ error: 'Error al obtener los registros de atención' });
  }
};

const getRegistrosAtencion = async (req, res) => {
  const { id_registro_atencion } = req.params;

  try {
    const query = `
      SELECT 
        fecha_registro,
        lugar_registro,
        nombre_pcd,
        atencion_realizada,
        area_atencion,
        donacion,
        nombre_informante,
        link_adjunto,
        id_registro_discapacidad
      FROM public.REGISTRO_ATENCION_PCD
      WHERE id_registro_atencion = $1;
    `;

    const result = await pool.query(query, [id_registro_atencion]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros de atención para este ID de discapacidad' });
    }

    return res.json({
      message: 'Registro de atención obtenido exitosamente',
      registros: result.rows
    });
  } catch (error) {
    console.error('Error al obtener los registros de atención:', error);
    return res.status(500).json({ error: 'Error al obtener los registros de atención' });
  }
};
const getAllRegistrosAtencion = async (req, res) => {
  try {
    const query = `
      SELECT 
        fecha_registro,
        lugar_registro,
        nombre_pcd,
        atencion_realizada,
        area_atencion,
        donacion,
        nombre_informante,
        link_adjunto,
        id_registro_discapacidad
      FROM public.REGISTRO_ATENCION_PCD
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron registros de atención para este ID de discapacidad' });
    }

    return res.json({
      message: 'Registro de atención obtenido exitosamente',
      registros: result.rows
    });
  } catch (error) {
    console.error('Error al obtener los registros de atención:', error);
    return res.status(500).json({ error: 'Error al obtener los registros de atención' });
  }
};
module.exports = {
  uploadFile,
    checkDatabaseConnection,
    createRegistroPcd,
    updateRegistroPcd,
    getRegistroById,
    getRegistrosByMunicipio,
    createUsuario,
    loginUsuario,
    editUsuario,
    deleteUsuario,
    getUsuariosByMunicipio,
    createRegistroAtencion,
    updateRegistroAtencion,
    getRegistrosAtencionByDiscapacidad,
    getRegistrosAtencion,
    getAllRegistrosAtencion,
    getEstadisticas
}
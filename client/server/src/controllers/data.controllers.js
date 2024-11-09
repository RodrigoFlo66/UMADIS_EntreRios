const bcrypt = require('bcrypt'); 
const pool = require("../db");

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

//REGISTRO_PCD//
const getRegistroById = async (req, res) => {
  const { id_registro_discapacidad } = req.params;
  try {
    const query = `
      SELECT 
        r.id_registro_discapacidad,
        r.nombre_apellido,
        r.fecha_nacimiento,
        r.edad,
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
        r.id_usuario
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
        r.edad,
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
        r.id_usuario
      FROM public.REGISTRO_PCD r
      JOIN public.USUARIO u ON r.id_usuario = u.id_usuario
      WHERE u.id_municipio = $1;
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
    edad,
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
    motivo_cierre
  } = req.body;

  const { id_usuario } = req.params; 

  try {
    // Consulta SQL para insertar los datos en la tabla REGISTRO_PCD
    const query = `
      INSERT INTO public.REGISTRO_PCD (
        nombre_apellido,
        fecha_nacimiento,
        edad,
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
        id_usuario
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING id_registro_discapacidad;
    `;

    // Ejecutar la consulta con los valores
    const result = await pool.query(query, [
      nombre_apellido,
      fecha_nacimiento,
      edad,
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
      id_usuario
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
    edad,
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
    motivo_cierre
  } = req.body;

  const { id_registro_discapacidad } = req.params;

  try {
    // Consulta SQL para actualizar los datos del registro
    const query = `
      UPDATE public.REGISTRO_PCD SET
        nombre_apellido = COALESCE($1, nombre_apellido),
        fecha_nacimiento = COALESCE($2, fecha_nacimiento),
        edad = COALESCE($3, edad),
        sexo = COALESCE($4, sexo),
        nro_ci = COALESCE($5, nro_ci),
        estado_civil = COALESCE($6, estado_civil),
        idioma_pcd = COALESCE($7, idioma_pcd),
        tipo_discapacidad = COALESCE($8, tipo_discapacidad),
        grado_discapacidad = COALESCE($9, grado_discapacidad),
        deficiencia = COALESCE($10, deficiencia),
        edad_inicio_discapacidad = COALESCE($11, edad_inicio_discapacidad),
        dispositivo_utiliza = COALESCE($12, dispositivo_utiliza),
        nivel_escolaridad = COALESCE($13, nivel_escolaridad),
        info_vivienda = COALESCE($14, info_vivienda),
        info_laboral = COALESCE($15, info_laboral),
        nombre_familiar = COALESCE($16, nombre_familiar),
        nro_hijos_pcd = COALESCE($17, nro_hijos_pcd),
        conyuge_pcd = COALESCE($18, conyuge_pcd),
        direc_domicilio = COALESCE($19, direc_domicilio),
        distrito_domicilio = COALESCE($20, distrito_domicilio),
        telefono_pdc = COALESCE($21, telefono_pdc),
        telefono_referencia = COALESCE($22, telefono_referencia),
        permanencia = COALESCE($23, permanencia),
        motivo_cierre = COALESCE($24, motivo_cierre)
      WHERE id_registro_discapacidad = $25
      RETURNING id_registro_discapacidad;
    `;

    // Ejecutar la consulta con los valores del body y el ID del registro
    const result = await pool.query(query, [
      nombre_apellido,
      fecha_nacimiento,
      edad,
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
    const query = `SELECT id_usuario, pasword FROM public.USUARIO WHERE nombre_usuario = $1`;
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
      idUsuario: usuario.id_usuario
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

module.exports = {
    checkDatabaseConnection,
    createRegistroPcd,
    updateRegistroPcd,
    getRegistroById,
    getRegistrosByMunicipio,
    createUsuario,
    loginUsuario,
    editUsuario,
    deleteUsuario,
    getUsuariosByMunicipio
}
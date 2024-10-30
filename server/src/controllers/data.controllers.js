const pool = require("../db");
function getCategoriaEdad(edad) {
  if (edad > 0 && edad < 12) {
      return "NIÑA/O";
  } else if (edad >= 12 && edad < 18) {
      return "ADOLESCENTE";
  } else if (edad >= 18 && edad <= 60) {
      return "MAYOR DE EDAD";
  } else if (edad > 60) {
      return "ADULTO MAYOR";
  } else {
      return "Edad inválida";
  }
}
const getRegistros = async (req, res) => {
  const { page = 1, limit = 15 } = req.query; // Obtener los parámetros de paginación
  const offset = (page - 1) * limit;

  try {
    const result = await pool.query("SELECT * FROM REGISTRO LIMIT $1 OFFSET $2", [limit, offset]);
    const total = await pool.query("SELECT COUNT(*) FROM REGISTRO");
    return res.json({
      data: result.rows,
      total: parseInt(total.rows[0].count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
const getAllregistros = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM REGISTRO");
    const total = await pool.query("SELECT COUNT(*) FROM REGISTRO");
    return res.json({
      data: result.rows,
      total: parseInt(total.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Error executing query' });
  }

}
const getFilteredRegistros = async (req, res) => {
  try {
    // Decodificar los filtros de los parámetros de la URL
    const filters = Object.fromEntries(
      Object.entries(req.query).map(([key, value]) => [key, decodeURIComponent(value)])
    );

    let query = "SELECT * FROM REGISTRO";
    const queryParams = [];
    const conditions = [];

    // Construir dinámicamente las condiciones de la consulta SQL
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        // Para campos que pueden tener múltiples valores
        if (filters[key].includes(',')) {
          const values = filters[key].split(',').map(value => value.trim());

          if (key === 'idioma_hablado') {
             // Usar AND para 'idioma_hablado' sin LOWER
             const subConditions = values.map((value) => {
              queryParams.push(`%${value}%`);
              return `${key} LIKE $${queryParams.length}`;
            });
            conditions.push(`(${subConditions.join(' AND ')})`);
          } else {
            if(key === 'categoria_edad'){
              const subConditions = values.map((value) => {
                queryParams.push(`%${value}%`);
                return `${key} LIKE $${queryParams.length}`;
              });
              conditions.push(`(${subConditions.join(' OR ')})`);
            }else{
              // Usar OR para otros campos
              const subConditions = values.map((value) => {
                queryParams.push(`%${value}%`);
                return `LOWER(${key}) LIKE $${queryParams.length}`;
              });
              conditions.push(`(${subConditions.join(' OR ')})`);
            }
          }
        } else {
          if (key === 'idioma_hablado') {
            // Usar AND para 'idioma_hablado' sin LOWER
            queryParams.push(`%${filters[key]}%`);
            conditions.push(`${key} LIKE $${queryParams.length}`);
          } else{
            if (key === 'categoria_edad') {
              queryParams.push(`%${filters[key]}%`);
              conditions.push(`${key} LIKE $${queryParams.length}`);
            }else{
              queryParams.push(`%${filters[key].toLowerCase()}%`);
              conditions.push(`LOWER(${key}) LIKE $${queryParams.length}`);
            }
          }
        }
      }
    });

    // Agregar condiciones a la consulta si existen
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(' AND ');
    }

    // Ejecutar consulta
    const result = await pool.query(query, queryParams);
    return res.json({
      data: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Error executing query' });
  }
};


const createRegistro = async (req, res) => {
  const { 
    nombre_completo,
    ci,
    fecha_nacimiento,
    estado_civil,
    idioma_hablado,
    edad,
    genero,
    nro_carnet_discapacidad,
    fechaExp_carnet_discapacidad,
    fechaVen_carnet_discapacidad,
    direccion_domicilio,
    otb_domicilio,
    distrito_domicilio,
    domicilio_verificado,
    lugar_origen,
    celular,
    fallecido,
    tipo_discapacidad,
    grado_discapacidad,
    causa_discapacidad,
    beneficio_bono,
    independiente,
    familiar_acargo,
    afiliado_org,
    nombre_org,
    apoyo_tecnico,
    nombre_apoyo,
    tipo_medicamento,
    rehabilitacion,
    nombre_rehabilitacion,
    nombre_seguro_salud,
    intitucion_apoyo,
    grado_academico,
    nivel_academico,
    estudia,
    situacion_vivienda,
    generacion_ingresos,
    ocupacion,
    trabaja,
    insercion_laboral,
    fecha_registro,
    motivo_consulta,
    situacion_actual,
    especificar_causa
   } = req.body;

   try{
    const categoriaEdad = getCategoriaEdad(edad);
      const result = await pool.query(`
        INSERT INTO REGISTRO (
          nombre_completo,
          ci,
          fecha_nacimiento,
          estado_civil,
          idioma_hablado,
          edad,
          categoria_edad,
          genero,
          nro_carnet_discapacidad,
          fechaExp_carnet_discapacidad,
          fechaVen_carnet_discapacidad,
          direccion_domicilio,
          otb_domicilio,
          distrito_domicilio,
          domicilio_verificado,
          lugar_origen,
          celular,
          fallecido,
          tipo_discapacidad,
          grado_discapacidad,
          causa_discapacidad,
          beneficio_bono,
          independiente,
          familiar_acargo,
          afiliado_org,
          nombre_org,
          apoyo_tecnico,
          nombre_apoyo,
          tipo_medicamento,
          rehabilitacion,
          nombre_rehabilitacion,
          nombre_seguro_salud,
          intitucion_apoyo,
          grado_academico,
          nivel_academico,
          estudia,
          situacion_vivienda,
          generacion_ingresos,
          ocupacion,
          trabaja,
          insercion_laboral,
          fecha_registro,
          motivo_consulta,
          situacion_actual,
          especificar_causa
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
          $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
          $41, $42, $43, $44, $45
        )`,
        [
          nombre_completo,
        ci,
        fecha_nacimiento,
        estado_civil,
        idioma_hablado,
        edad,
        categoriaEdad,
        genero,
        nro_carnet_discapacidad,
        fechaExp_carnet_discapacidad,
        fechaVen_carnet_discapacidad,
        direccion_domicilio,
        otb_domicilio,
        distrito_domicilio,
        domicilio_verificado,
        lugar_origen,
        celular,
        fallecido,
        tipo_discapacidad,
        grado_discapacidad,
        causa_discapacidad,
        beneficio_bono,
        independiente,
        familiar_acargo,
        afiliado_org,
        nombre_org,
        apoyo_tecnico,
        nombre_apoyo,
        tipo_medicamento,
        rehabilitacion,
        nombre_rehabilitacion,
        nombre_seguro_salud,
        intitucion_apoyo,
        grado_academico,
        nivel_academico,
        estudia,
        situacion_vivienda,
        generacion_ingresos,
        ocupacion,
        trabaja,
        insercion_laboral,
        fecha_registro,
        motivo_consulta,
        situacion_actual,
        especificar_causa
        ]);
      return res.json(result);
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Error executing query' });
  }
}
const updateRegistro = async (req, res) => {
  const { id_registro } = req.params;
  const {  
    nombre_completo,
    ci,
    fecha_nacimiento,
    estado_civil,
    idioma_hablado,
    edad,
    genero,
    nro_carnet_discapacidad,
    fechaExp_carnet_discapacidad,
    fechaVen_carnet_discapacidad,
    direccion_domicilio,
    otb_domicilio,
    distrito_domicilio,
    domicilio_verificado,
    lugar_origen,
    celular,
    fallecido,
    tipo_discapacidad,
    grado_discapacidad,
    causa_discapacidad,
    beneficio_bono,
    independiente,
    familiar_acargo,
    afiliado_org,
    nombre_org,
    apoyo_tecnico,
    nombre_apoyo,
    tipo_medicamento,
    rehabilitacion,
    nombre_rehabilitacion,
    nombre_seguro_salud,
    intitucion_apoyo,
    grado_academico,
    nivel_academico,
    estudia,
    situacion_vivienda,
    generacion_ingresos,
    ocupacion,
    trabaja,
    insercion_laboral,
    fecha_registro,
    motivo_consulta,
    situacion_actual,
    especificar_causa
  } = req.body;

  try {
    const categoriaEdad = getCategoriaEdad(edad);
    const result = await pool.query(`
      UPDATE REGISTRO SET
        nombre_completo = $1,
        ci = $2,
        fecha_nacimiento = $3,
        estado_civil = $4,
        idioma_hablado = $5,
        edad = $6,
        categoria_edad = $7,
        genero = $8,
        nro_carnet_discapacidad = $9,
        fechaExp_carnet_discapacidad = $10,
        fechaVen_carnet_discapacidad = $11,
        direccion_domicilio = $12,
        otb_domicilio = $13,
        distrito_domicilio = $14,
        domicilio_verificado = $15,
        lugar_origen = $16,
        celular = $17,
        fallecido = $18,
        tipo_discapacidad = $19,
        grado_discapacidad = $20,
        causa_discapacidad = $21,
        beneficio_bono = $22,
        independiente = $23,
        familiar_acargo = $24,
        afiliado_org = $25,
        nombre_org = $26,
        apoyo_tecnico = $27,
        nombre_apoyo = $28,
        tipo_medicamento = $29,
        rehabilitacion = $30,
        nombre_rehabilitacion = $31,
        nombre_seguro_salud = $32,
        intitucion_apoyo = $33,
        grado_academico = $34,
        nivel_academico = $35,
        estudia = $36,
        situacion_vivienda = $37,
        generacion_ingresos = $38,
        ocupacion = $39,
        trabaja = $40,
        insercion_laboral = $41,
        fecha_registro = $42,
        motivo_consulta = $43,
        situacion_actual = $44,
        especificar_causa = $45
      WHERE id_registro = $46
    `, [
      nombre_completo,
      ci,
      fecha_nacimiento,
      estado_civil,
      idioma_hablado,
      edad,
      categoriaEdad,
      genero,
      nro_carnet_discapacidad,
      fechaExp_carnet_discapacidad,
      fechaVen_carnet_discapacidad,
      direccion_domicilio,
      otb_domicilio,
      distrito_domicilio,
      domicilio_verificado,
      lugar_origen,
      celular,
      fallecido,
      tipo_discapacidad,
      grado_discapacidad,
      causa_discapacidad,
      beneficio_bono,
      independiente,
      familiar_acargo,
      afiliado_org,
      nombre_org,
      apoyo_tecnico,
      nombre_apoyo,
      tipo_medicamento,
      rehabilitacion,
      nombre_rehabilitacion,
      nombre_seguro_salud,
      intitucion_apoyo,
      grado_academico,
      nivel_academico,
      estudia,
      situacion_vivienda,
      generacion_ingresos,
      ocupacion,
      trabaja,
      insercion_laboral,
      fecha_registro,
      motivo_consulta,
      situacion_actual,
      especificar_causa,
      id_registro
    ]);
    return res.json(result);
  } catch (error) {
    console.error('Error executing query', error);
    return res.status(500).json({ error: 'Error executing query' });
  }
};

const deleteRegistro = async (req, res) => {
  const { id_registro } = req.params;
  const result = await pool.query("DELETE FROM REGISTRO WHERE id_registro = $1", [id_registro]);
  return res.json(result);
}
const selecRegistro = async (req, res) => {
  const { id_registro } = req.params;
  const result = await pool.query("SELECT * FROM REGISTRO WHERE id_registro = $1", [id_registro]);
  return res.json(result.rows);
}
const getStatistics = async (req, res) => {
  try {
      // Paso 1: Consultar los datos de la base de datos
      const query = 'SELECT * FROM REGISTRO';
      const { rows: data } = await pool.query(query);

      const totalRecords = data.length;

      // Paso 2: Calcular las estadísticas

      // Conteo y porcentaje de género
      const genderCount = {};
      data.forEach(record => {
          const gender = record.genero || 'No especificado';
          genderCount[gender] = (genderCount[gender] || 0) + 1;
      });

      const genderPercentage = Object.entries(genderCount).map(([key, value]) => ({
          gender: key,
          percentage: ((value / totalRecords) * 100).toFixed(2)
      }));

      // Promedio de edad
      const ages = data.map(record => record.edad).filter(age => age !== null);
      const averageAge = (ages.reduce((acc, age) => acc + age, 0) / ages.length).toFixed(2);

      // Estado civil más repetido
      const civilStatusCount = {};
      data.forEach(record => {
          const status = record.estado_civil || 'No especificado';
          civilStatusCount[status] = (civilStatusCount[status] || 0) + 1;
      });

      const mostCommonCivilStatus = Object.entries(civilStatusCount).reduce((max, entry) => entry[1] > max[1] ? entry : max)[0];

      // Grado académico más repetido
      const academicDegreeCount = {};
      data.forEach(record => {
          const degree = record.grado_academico || 'No especificado';
          academicDegreeCount[degree] = (academicDegreeCount[degree] || 0) + 1;
      });

      const mostCommonAcademicDegree = Object.entries(academicDegreeCount).reduce((max, entry) => entry[1] > max[1] ? entry : max)[0];

      // Porcentaje y cantidad de fallecidos
      const deceasedCount = { 'SI': 0, 'NO': 0, 'No especificado': 0 };
      data.forEach(record => {
          const deceased = record.fallecido || 'No especificado';
          deceasedCount[deceased] = (deceasedCount[deceased] || 0) + 1;
      });

      const deceasedPercentage = {
          fallecido: ((deceasedCount['SI'] / totalRecords) * 100).toFixed(2),
          no_fallecido: ((deceasedCount['NO'] / totalRecords) * 100).toFixed(2)
      };

      // Paso 3: Retornar los datos estadísticos
      return res.json({
          totalRecords,
          genderCount,
          genderPercentage,
          averageAge,
          mostCommonCivilStatus,
          mostCommonAcademicDegree,
          deceasedCount,
          deceasedPercentage
      });
  } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};


module.exports = {
    getRegistros,
    createRegistro,
    selecRegistro,
    deleteRegistro,
    getAllregistros,
    updateRegistro,
    getFilteredRegistros,
    getStatistics
}
-- Tabla MUNICIPIO
CREATE TABLE public.MUNICIPIO (
    id_municipio SERIAL PRIMARY KEY,
    nombre_municipio VARCHAR(100) NOT NULL
);

-- Tabla USUARIO con relación al MUNICIPIO
CREATE TABLE public.USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(100) NOT NULL,
    pasword VARCHAR(255) NOT NULL,
    nivel_usuario VARCHAR(20) NOT NULL,
    id_municipio INTEGER NOT NULL,
    CONSTRAINT municipio_usuario_fk FOREIGN KEY (id_municipio)
        REFERENCES public.MUNICIPIO (id_municipio)
);

-- Tabla REGISTRO_PCD con relación al MUNICIPIO
CREATE TABLE public.REGISTRO_PCD (
    id_registro_discapacidad SERIAL PRIMARY KEY,
    nombre_apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    sexo VARCHAR(50),
    nro_ci INTEGER,
    estado_civil VARCHAR(50),
    idioma_pcd VARCHAR(50),
    tipo_discapacidad VARCHAR(50),
    grado_discapacidad VARCHAR(50),
    deficiencia VARCHAR(100),
    edad_inicio_discapacidad INTEGER,
    dispositivo_utiliza VARCHAR(100),
    nivel_escolaridad VARCHAR(50),
    info_vivienda VARCHAR(100),
    info_laboral VARCHAR(100),
    nombre_familiar VARCHAR(100),
    nro_hijos_pcd INTEGER,
    conyuge_pcd VARCHAR(100),
    direc_domicilio VARCHAR(255),
    distrito_domicilio VARCHAR(100),
    telefono_pdc VARCHAR(20),
    telefono_referencia VARCHAR(20), 
    permanencia VARCHAR(20),
    motivo_cierre VARCHAR(100),
    numero_hermanos_pcd INTEGER,
    afiliacion_opcd VARCHAR(100),
    fuente_informacion VARCHAR(255),
    id_municipio INTEGER NOT NULL,
    CONSTRAINT municipio_registro_pcd_fk FOREIGN KEY (id_municipio)
        REFERENCES public.MUNICIPIO (id_municipio)
);

-- Tabla REGISTRO_ATENCION_PCD con relación al REGISTRO_PCD
CREATE TABLE public.REGISTRO_ATENCION_PCD (
    id_registro_atencion SERIAL PRIMARY KEY,
    fecha_registro DATE NOT NULL,
    lugar_registro VARCHAR(100) NOT NULL,
    nombre_pcd VARCHAR(100) NOT NULL,
    atencion_realizada VARCHAR(255),
    area_atencion VARCHAR(50) NOT NULL,
    donacion VARCHAR(100),
    nombre_informante VARCHAR(100) NOT NULL,
    link_adjunto VARCHAR(255),
    id_registro_discapacidad INTEGER NOT NULL,
    CONSTRAINT registro_pcd_registro_atencion_pcd_fk FOREIGN KEY (id_registro_discapacidad)
        REFERENCES public.REGISTRO_PCD (id_registro_discapacidad)
);

-- Tabla de perfiles
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT,
    role TEXT CHECK (role IN ('admin', 'user', 'proveedor')) DEFAULT 'user',
    imagen_perfil TEXT,         -- URL o base64 de la imagen de perfil
    banner TEXT,                -- URL del banner del perfil
    presentacion TEXT,          -- Descripción del usuario
    location TEXT,
    username TEXT,
    genero TEXT CHECK (genero IN ('Masculino', 'Femenino', 'No binario', 'Prefiero no decirlo'))
);

-- Tabla de contenidos multimedia
CREATE TABLE contenidos (
    id serial PRIMARY KEY,
    tipo TEXT CHECK (tipo IN ('libro', 'pelicula', 'serie', 'videojuego')) NOT NULL,
    disponibilidad TEXT CHECK (disponibilidad IN ('disponible', 'proximante')) NOT NULL,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    imagen_url TEXT,
    proveedor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
    permite_comentarios BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Relación de usuario con contenidos (biblioteca personal)
CREATE TABLE mi_biblioteca (
    id serial PRIMARY KEY,
    usuario_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contenido_id integer REFERENCES contenidos(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('libro', 'pelicula', 'serie', 'videojuego')) NOT NULL,
    estado TEXT CHECK (estado IN ('Pendiente', 'Completado')) DEFAULT 'Pendiente',
    calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    agregado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
    finalizado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Comentarios sobre contenidos multimedia
CREATE TABLE comentarios_multimedia (
    id serial PRIMARY KEY,
    contenidos_id integer REFERENCES contenidos(id) ON DELETE CASCADE,
    autor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respuestas de admin/moderador a comentarios multimedia
CREATE TABLE rc_multimedia (
    id serial PRIMARY KEY,
    comentario_id integer REFERENCES comentarios_multimedia(id) ON DELETE CASCADE,
    admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de géneros (para multimedia)
CREATE TABLE generos (
    id serial PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

-- Relación muchos a muchos entre contenidos y géneros
CREATE TABLE contenido_generos (
    id serial PRIMARY KEY,
    contenido_id integer REFERENCES contenidos(id) ON DELETE CASCADE,
    genero_id integer REFERENCES generos(id) ON DELETE CASCADE
    -- Para máximo 5 géneros por contenido, gestionar desde backend/lógica
);

-- Tabla de blogs
CREATE TABLE blogs (
    id serial PRIMARY KEY,
    autor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    contenido TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('duda', 'blog')) NOT NULL,
    permite_comentarios BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de comentarios en blogs
CREATE TABLE comentarios_blog (
    id serial PRIMARY KEY,
    blog_id integer REFERENCES blogs(id) ON DELETE CASCADE,
    autor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respuestas de admin a comentarios de blog
CREATE TABLE respuestas_comentarios (
    id serial PRIMARY KEY,
    comentario_id integer REFERENCES comentarios_blog(id) ON DELETE CASCADE,
    admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CHECK (EXISTS (
        SELECT 1 FROM profiles
        WHERE id = admin_id AND role = 'admin'
    ))
);

-- Crear la tabla de tipos de libro
CREATE TABLE tipolibro (
    id serial primary key,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar los tipos
INSERT INTO tipolibro (nombre) VALUES
('manga'), ('comic'), ('novela'), ('novela-ligera'), ('novela-negra');

CREATE TABLE contenido_tipolibors (
    id serial PRIMARY KEY,
    contenido_id integer REFERENCES contenidos(id) ON DELETE CASCADE,
    tipolibro_id integer REFERENCES tipolibro(id) ON DELETE CASCADE
    
);


alter table contenidos
ADD column autor_obra text;
-- TABLAS BASE

-- Usuarios, con vinculación a auth.users
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT CHECK (role IN ('admin', 'user', 'proveedor')) DEFAULT 'user',
    imagen_perfil TEXT,
    banner TEXT,
    presentacion TEXT,
    location TEXT,
    username TEXT UNIQUE,
    genero TEXT CHECK (genero IN ('Masculino', 'Femenino', 'No binario', 'Prefiero no decirlo'))
);

-- Tipos de libro (para clasificar los libros)
CREATE TABLE tipolibro (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);



-- Géneros (pueden usarse en cualquier contenido)
CREATE TABLE generos (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE
);

create table plataforma(
    id serial primary key,
    nombre text not null unique
);

create table temporada(
    id serial primary key,
    numero text not null unique
);



-- TABLAS SECUNDARIAS

-- Contenidos multimedia (pueden ser libros, series, etc)
CREATE TABLE contenidos (
    id SERIAL PRIMARY KEY,
    tipo TEXT CHECK (tipo IN ('libro', 'pelicula', 'serie', 'videojuego')) NOT NULL,
    disponibilidad TEXT CHECK (disponibilidad IN ('disponible', 'proximamente')) NOT NULL,
    titulo TEXT NOT NULL,
    autor_obra TEXT,
    descripcion TEXT,
    imagen_url TEXT,
    proveedor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    permite_comentarios BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- Blogs/Dudas, creados por usuarios con permisos (usualmente admin)
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    contenido TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('duda', 'blog')) NOT NULL,
    permite_comentarios BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- TABLAS DE RELACIÓN Y DERIVADAS

-- Relación muchos-a-muchos entre contenidos y géneros
CREATE TABLE contenido_generos (
    id SERIAL PRIMARY KEY,
    contenido_id INT REFERENCES contenidos(id) ON DELETE CASCADE,
    genero_id INT REFERENCES generos(id) ON DELETE CASCADE
);

CREATE TABLE contenido_plataformas (
    id SERIAL PRIMARY KEY,
    contenido_id INT REFERENCES contenidos(id) ON DELETE CASCADE,
    plataforma_id INT REFERENCES plataforma(id) ON DELETE CASCADE
);


CREATE TABLE contenido_temporada (
    id SERIAL PRIMARY KEY,
    contenido_id INT REFERENCES contenidos(id) ON DELETE CASCADE,
    temporada_id INT REFERENCES temporada(id) ON DELETE CASCADE
);


-- Guardar el contenido en la biblioteca personal de un usuario
CREATE TABLE mi_biblioteca (
    id SERIAL PRIMARY KEY,
    usuario_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tipo TEXT CHECK (tipo IN ('libro', 'pelicula', 'serie', 'videojuego')) NOT NULL,
    estado TEXT CHECK (estado IN ('Pendiente','Completado')) DEFAULT 'Pendiente',
    calificacion numeric CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    agregado_en TIMESTAMPTZ DEFAULT now(),
    finalizado_en TIMESTAMPTZ,
    contenido_id integer references contenidos(id) on delete cascade
);




-- Comentarios en contenidos multimedia (y respuestas admin)
CREATE TABLE comentarios_multimedia (
    id SERIAL PRIMARY KEY,
    contenido_id INT REFERENCES contenidos(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rc_multimedia (
    id SERIAL PRIMARY KEY,
    comentario_id INT REFERENCES comentarios_multimedia(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT now()
);

-- Comentarios en blogs y respuestas admin (para dudas/blogs)
CREATE TABLE comentarios_blog (
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE respuestas_comentarios (
    id SERIAL PRIMARY KEY,
    comentario_id INT REFERENCES comentarios_blog(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    creado_en TIMESTAMPTZ DEFAULT now()
);

create table contenido_tipo(
    id serial PRIMARY KEY,
    contenido_id integer REFERENCES contenidos(id) ON DELETE CASCADE,
    tipolibro_id integer REFERENCES tipolibro(id) ON DELETE CASCADE
);

-- Tabla de listas
CREATE TABLE lista (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descripcion TEXT, -- OPCIONAL
    autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE, 
    contenido_id INTEGER REFERENCES contenidos(id) ON DELETE CASCADE
);


-- Tabla de Review
CREATE TABLE Review (
    id SERIAL PRIMARY KEY,
    texto_reseña TEXT NOT NULL,
    autor_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL,
    titulo TEXT NOT NULL,
     puntuacion numeric CHECK (puntuacion BETWEEN 1 AND 5),
    creado_en TIMESTAMPTZ DEFAULT now()
    
);

-- Tabla intermedia contenido_review
CREATE TABLE contenido_review (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL,
    contenido_id INTEGER NOT NULL,
    FOREIGN KEY (review_id) REFERENCES Review(id) ON DELETE CASCADE,
    FOREIGN KEY (contenido_id) REFERENCES contenidos(id) ON DELETE CASCADE
);



INSERT INTO tipolibro (nombre) VALUES
    ('manga'), ('comic'), ('novela'), ('novela-ligera'), ('novela-negra');

INSERT INTO plataforma (nombre) VALUES
    ('PS4|PS5'), ('Xbox-S|X'), ('nintendo switch-|-2'), ('PC'), ('Nintendo-DS'), ('Nintendo-3Ds');

insert into temporada (numero) values
(1), (2), (3), (4), (5), (6), (7), (8), (9), (10);
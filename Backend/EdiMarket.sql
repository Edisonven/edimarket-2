CREATE TABLE
	usuarios (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(255) NOT NULL,
		email VARCHAR(255) NOT NULL UNIQUE,
		contraseña VARCHAR(255) NOT NULL
	);

CREATE TABLE
	productos (
		id SERIAL PRIMARY KEY,
		nombre VARCHAR(255) NOT NULL,
		descripcion TEXT,
		estado VARCHAR(255) NOT NULL precio NUMERIC(12, 3) CHECK (precio >= 0) NOT NULL,
		stock INT NOT NULL,
		imagen VARCHAR(255),
		vendedor_id INT NOT NULL,
		FOREIGN KEY (vendedor_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

CREATE TABLE
	categorias (
		id SERIAL PRIMARY KEY,
		nombre_categoria VARCHAR(255) NOT NULL
	);

CREATE TABLE
	producto_categoria (
		id SERIAL PRIMARY KEY,
		producto_id INT NOT NULL,
		categoria_id INT NOT NULL,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
		FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE
	);

CREATE TABLE
	favoritos (
		favorito_id SERIAL PRIMARY KEY,
		usuario_id INT NOT NULL,
		producto_id INT NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
	);

CREATE TABLE
	carrito (
		id SERIAL PRIMARY KEY,
		usuario_id INT NOT NULL,
		producto_id INT NOT NULL,
		cantidad INT NOT NULL,
		comprado BOOLEAN NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
	);

CREATE TABLE
	domicilio (
		id SERIAL PRIMARY KEY,
		usuario_id INT NOT NULL,
		direccion VARCHAR(255) NOT NULL,
		ciudad VARCHAR(255) NOT NULL,
		region VARCHAR(255) NOT NULL,
		codigo_postal VARCHAR(20) NOT NULL,
		comuna VARCHAR(255) NOT NULL,
		numero_casa VARCHAR(255) NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
	);

CREATE TABLE
	ventas (
		id SERIAL PRIMARY KEY,
		comprador_id INT NOT NULL,
		producto_id INT NOT NULL,
		cantidad INT NOT NULL,
		valor_total NUMERIC(12, 3) CHECK (valor_total >= 0) NOT NULL,
		fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (comprador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
	);

CREATE TABLE
	metodos_pago (
		id SERIAL PRIMARY KEY,
		usuario_id INT NOT NULL,
		tipo_tarjeta VARCHAR(50) NOT NULL,
		numero_tarjeta VARCHAR(255) NOT NULL,
		nombre_titular VARCHAR(255) NOT NULL,
		fecha_expiracion VARCHAR(20) NOT NULL,
		codigo_seguridad VARCHAR(4) NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
	);

CREATE TABLE
	valoraciones_producto (
		id SERIAL PRIMARY KEY,
		usuario_id INT NOT NULL,
		producto_id INT NOT NULL,
		comentario TEXT,
		calificacion INT NOT NULL CHECK (
			calificación >= 1
			AND calificación <= 5
		),
		fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		valorado BOOLEAN NOT NULL,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
	);

CREATE TABLE
	preguntas_producto (
		id SERIAL PRIMARY KEY,
		producto_id INT NOT NULL,
		usuario_id INT NOT NULL,
		pregunta VARCHAR(255) NOT NULL,
		fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE,
		FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
	);

CREATE TABLE
	orders_valorate (
		id SERIAL PRIMARY KEY,
		comprador_id INT NOT NULL,
		producto_id INT NOT NULL,
		cantidad INT NOT NULL,
		valor_total NUMERIC(12, 3) CHECK (valor_total >= 0) NOT NULL,
		fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		valorado BOOLEAN NOT NULL,
		calificacion INT DEFAULT 0 NOT NULL,
		FOREIGN KEY (comprador_id) REFERENCES usuarios (id) ON DELETE CASCADE,
		FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE
	);
-- Insert Features
INSERT INTO Feature (title, description, video, videoLink) VALUES
('Clientes', 'Actualización de clientes. En esta sección podemos gestionar los clientes y realizar acciones como agregar, modificar y eliminar.', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Productos', 'Gestión de productos, precios y stock.', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Proveedores', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Bancos', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Presupuestos', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Orden de compras', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Facturación', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Caja', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Caja General', '', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Libro de iva', 'Manejo de IVA', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Control de gastos', 'Control de Gastos internos', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Vendedores', 'Gestor de Vendedores', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA'),
('Estadisticas', 'Modulo de estadisticas barias', true, 'https://www.youtube.com/watch?v=zl1CgOgb1DA');

-- Items de "Clientes" (featureId = 1)
INSERT INTO Item (text, featureId) VALUES
('Zonas', 1),
('Categorías de clientes', 1),
('Devolución', 1);

-- Insertar nodos padres con jerarquía para "Cuenta corriente" y "Saldos"
INSERT INTO Item (text, featureId) VALUES
('Cuenta corriente', 1),
('Saldos', 1);

-- Subitems de "Cuenta corriente" (parentId asignado más adelante)
INSERT INTO Item (text, featureId, parentId) VALUES
('Detalle de cuenta corriente', 1, 4),
('Actualizar cuenta corriente por zona', 1, 4),
('Listado de cuenta corriente por zona', 1, 4),
('Bloquear Clientes deudores', 1, 4);

-- Subitems de "Saldos" (parentId asignado más adelante)
INSERT INTO Item (text, featureId, parentId) VALUES
('Listado de saldos general', 1, 5),
('Listado de saldos en ordenes de compra', 1, 5);
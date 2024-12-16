-- Insertar links para homeNavigation
-- Links principales
INSERT INTO `Link` (`text`, `href`, `enabled`, `type`, `navigationId`)
VALUES
('Quienes Somos', '/#welcoming', true, 'mainLink', 1),
('¿Qué podés hacer?', '/#actions', true, 'mainLink', 1),
('Contacto', '/#contacto', true, 'mainLink', 1),
('Beneficios', '/#benefits', true, 'mainLink', 1),
('Facturacion', '/products/invoices', true, 'mainLink', 1);

-- Links de dropdown
INSERT INTO `Link` (`text`, `href`, `enabled`, `type`, `navigationId`)
VALUES
('Facturacion', '/products/invoices', true, 'dropdownLink', 1),
('Soporte', '/soporte', false, 'dropdownLink', 1);

-- Insertar links para featureNavigation
-- Links principales
INSERT INTO `Link` (`text`, `href`, `enabled`, `type`, `navigationId`)
VALUES
('Order Flow', '/products/invoices/#orderFlow', true, 'mainLink', 2),
('Características', '/products/invoices/#caracteristicas', true, 'mainLink', 2),
('Precios', '/products/invoices/#precios', true, 'mainLink', 2),
('Contacto', '/products/invoices/#contacto', true, 'mainLink', 2),
('Preguntas Frecuentes', 'products/qa', true, 'mainLink', 2);

-- Links de dropdown
INSERT INTO `Link` (`text`, `href`, `enabled`, `type`, `navigationId`)
VALUES
('Facturacion', '/products/invoices', true, 'dropdownLink', 2),
('Soporte', '/soporte', false, 'dropdownLink', 2);

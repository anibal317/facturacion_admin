import React, { useEffect, useRef } from "react";

export default function Footer() {
    const footerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (footerRef.current) {
            const updateFooterHeight = () => {
                const height = footerRef.current?.offsetHeight;
                document.documentElement.style.setProperty('--footer-height', `${height}px`);
            };

            updateFooterHeight();
            window.addEventListener('resize', updateFooterHeight);
            return () => window.removeEventListener('resize', updateFooterHeight);
        }
    }, []);
    const currentYear = new Date().getFullYear();
    return (
        <footer ref={footerRef} className="bottom-0 sticky bg-gray-800 p-4 w-full text-center text-white">
            {/* <div className="flex justify-center space-x-4">
                <a href="/about" className="hover:underline">
                    Acerca de
                </a>
                <a href="/contact" className="hover:underline">
                    Contacto
                </a>
                <a href="/privacy" className="hover:underline">
                    Privacidad
                </a>
            </div> */}
            © Bolívar Software {currentYear}. Tu software, nuestra solución. Todos los derechos reservados.
        </footer>
    );
}


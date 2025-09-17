// SISTEMA DE FILTROS DE PRODUCTOS

// Esto se ejecuta cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Filtros de productos inicializados');
    
    // 1. AGARRAR TODOS LOS ELEMENTOS NECESARIOS
    // Buscamos todos los botones de categorías
    const botonesFiltro = document.querySelectorAll('.btn-category');
    // Buscamos todas las tarjetas de productos
    const productos = document.querySelectorAll('.product-card');
    // Buscamos el contenedor principal donde están todos los productos
    const contenedorProductos = document.querySelector('.row');
    
    // 2. CONFIGURAR EL LAYOUT INICIAL (IMPORTANTE)
    // Convertimos el contenedor en un grid para mejor organización
    contenedorProductos.style.display = 'grid';
    // Definimos cómo se van a organizar las columnas
    contenedorProductos.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
    // Espacio entre los productos
    contenedorProductos.style.gap = '20px';
    // Alineamos todos los productos al inicio
    contenedorProductos.style.alignItems = 'start';
    
    // 3. PARA CADA BOTÓN, AGREGAR EL "OÍDO" PARA ESCUCHAR CLICKS
    // Ponemos a cada botón a escuchar cuando alguien hace clic
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', function() {
            console.log('Click en: ' + this.textContent);
            
            // 4. QUITAR EL RESALTADO DE TODOS LOS BOTONES
            // Removemos la clase 'active' de todos los botones
            botonesFiltro.forEach(btn => btn.classList.remove('active'));
            
            // 5. PONERLE RESALTADO AL BOTÓN CLICKEADO
            // Al botón que hicieron clic le agregamos la clase 'active'
            this.classList.add('active');
            
            // 6. VER QUÉ CATEGORÍA ELIGIÓ EL USUARIO
            // Obtenemos la categoría del botón (frutas, verduras, etc.)
            const categoriaElegida = this.getAttribute('data-category');
            console.log('Categoria elegida: ' + categoriaElegida);
            
            // 7. MOSTRAR/OCULTAR PRODUCTOS 
            // Revisamos cada producto para ver si coincide con la categoría
            productos.forEach(producto => {
                // Obtenemos el contenedor padre (col-lg-3) que es el que muestra/oculta
                const contenedorProducto = producto.closest('.col-lg-3');
                
                if (categoriaElegida === 'all') {
                    // Si eligieron "Todos", mostramos TODOS los productos
                    contenedorProducto.style.display = 'block';
                    console.log('Mostrando todos los productos');
                } else {
                    // Verificar si el producto pertenece a la categoría elegida
                    // Los productos pueden tener múltiples categorías separadas por espacios
                    const categoriasProducto = producto.getAttribute('data-category').split(' ');
                    
                    if (categoriasProducto.includes(categoriaElegida)) {
                        // Si el producto coincide con la categoría, lo mostramos
                        contenedorProducto.style.display = 'block';
                        console.log('Mostrando producto: ' + producto.querySelector('.card-title').textContent);
                    } else {
                        // Si no coincide, lo ocultamos completamente
                        contenedorProducto.style.display = 'none';
                        console.log('Ocultando producto: ' + producto.querySelector('.card-title').textContent);
                    }
                }
            });
            
            // 8. FORZAR LA REORGANIZACIÓN DEL GRID
            // se tuvo que forzar la reorganización del grid porque no se actualizaba
            setTimeout(() => {
                // Truco: ocultamos y mostramos rápidamente el contenedor
                contenedorProductos.style.display = 'none';
                setTimeout(() => {
                    contenedorProductos.style.display = 'grid';
                }, 50); // ---> 50 milisegundos
            }, 100); // ---> 100 milisegundos
        });
    });
    
    console.log('Filtros de productos listos y funcionando');
});
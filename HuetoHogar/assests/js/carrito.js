
// VARIABLES GLOBALES para guardar toda la info del carrito

let sumaTotal = 0; // Acá vamos sumando el total de la compra
let listaCarrito, totalCarrito, carritoContainer, subtotalSpan, descuentoSpan; // Estos son los elementos HTML que vamos a usar
let carritoItems = []; // Aquí guardamos todos los productos que el cliente agrega


// CUANDO LA PÁGINA SE CARGA - Esto se ejecuta al inicio

document.addEventListener('DOMContentLoaded', () => {
    console.log('Carrito.js inicializado - Todo cargado correctamente');
    
    // 1. DETECTAR CUANDO ALGUIEN HACE CLIC EN "AGREGAR AL CARRITO"
    // Este es el "oído" que escucha todos los clicks en la página
    document.addEventListener('click', function(e) {
        // Si el click es en un botón de agregar al carrito...
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault(); // Evita que el botón haga su comportamiento normal
            e.stopImmediatePropagation(); // Evita que otros scripts interfieran (problemas anteriores)
            
            // Obtenemos la información del producto desde el botón
            const button = e.target;
            const nombre = button.getAttribute('data-nombre');
            const precio = parseFloat(button.getAttribute('data-precio'));
            const imagen = button.getAttribute('data-imagen');
            
            console.log('Producto agregado:', { nombre, precio, imagen });
            agregarAlCarrito(nombre, precio, imagen); // Llamamos a la función que agrega
        }
    }, true); // Este true es importante para que capture el evento primero

    // 2. CONECTARNOS CON LOS ELEMENTOS HTML DEL CARRITO
    // Buscamos en la página donde mostrar la información
    listaCarrito = document.getElementById('lista-carrito');
    totalCarrito = document.getElementById('total-carrito');
    carritoContainer = document.getElementById('carrito-container');
    subtotalSpan = document.getElementById('subtotal-carrito');
    descuentoSpan = document.getElementById('descuento-valor');

    // 3. CARGAR CARRITO GUARDADO - Si el usuario ya agregó productos antes
    cargarCarritoDesdeLocalStorage();

    // 4. CONFIGURAR BOTÓN DE FINALIZAR COMPRA
    const btnFinalizar = document.getElementById('btn-finalizar-compra');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }

    // 5. CONFIGURAR BOTÓN DE CERRAR CARRITO
    const btnCerrar = document.getElementById('cerrar-carrito');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', toggleCarrito);
    }

    // 6. SINCRONIZAR CON PÁGINA DE CARRITO - Si estamos en carrito.html
    sincronizarCarrito();
});


// FUNCIONES DEL CARRITO EMERGENTE (ventanita)

// Función para mostrar/ocultar el carrito emergente
function toggleCarrito() {
    if (carritoContainer) {
        carritoContainer.classList.toggle('visible'); // Agrega o quita la clase "visible"
    }
}

// FUNCIÓN PRINCIPAL: AGREGAR PRODUCTOS AL CARRITO
function agregarAlCarrito(nombre, precio, imagen = '') {
    console.log('Agregando producto al carrito:', { nombre, precio, imagen });

    // VALIDACIÓN: Revisamos que los datos estén correctos
    if (!nombre || precio === null || precio === undefined || isNaN(precio)) {
        console.error('Error: Datos del producto inválidos');
        alert('Error: Los datos del producto no son válidos');
        return; // Si hay error, nos detenemos aquí
    }

    // VERIFICAMOS si el producto ya está en el carrito
    const productoExistente = carritoItems.find(item => item.nombre === nombre);

    if (productoExistente) {
        // Si ya existe, le sumamos 1 a la cantidad
        productoExistente.cantidad += 1;
        productoExistente.total = productoExistente.precio * productoExistente.cantidad;
        console.log('Producto existente, cantidad aumentada:', productoExistente.cantidad);
    } else {
        // Si es nuevo, lo agregamos al carrito
        carritoItems.push({
            id: Date.now().toString(), // ID único usando la fecha actual
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1, // Empezamos con 1 unidad
            total: precio // Total = precio x cantidad
        });
        console.log('Producto nuevo agregado al carrito');
    }

    // RECALCULAR EL TOTAL de toda la compra
    sumaTotal = carritoItems.reduce((total, item) => total + item.total, 0);
    console.log('Total actualizado:', sumaTotal);

    // ACTUALIZAR LA INTERFAZ para que el usuario vea los cambios
    actualizarCarrito();
    actualizarContadorCarrito();

    // GUARDAR EN MEMORIA (localStorage) para no perder los datos
    guardarCarritoEnLocalStorage();

    // MOSTRAR EL CARRITO si estaba oculto
    if (carritoContainer && !carritoContainer.classList.contains('visible')) {
        toggleCarrito();
    }

    // MOSTRAR MENSAJE DE CONFIRMACIÓN al usuario
    //(`¡${nombre} agregado al carrito!`);
}

// FUNCIÓN PARA QUITAR PRODUCTOS DEL CARRITO
function quitarDeCarrito(itemId) {
    console.log('Intentando quitar producto ID:', itemId);
    
    // Buscamos el producto en el carrito
    const index = carritoItems.findIndex(item => item.id === itemId);

    if (index !== -1) {
        const item = carritoItems[index];

        if (item.cantidad > 1) {
            // Si tiene más de 1, le restamos 1
            item.cantidad -= 1;
            item.total = item.precio * item.cantidad;
            console.log('Reduciendo cantidad a:', item.cantidad);
        } else {
            // Si solo tiene 1, lo eliminamos completamente
            carritoItems.splice(index, 1);
            console.log('Producto eliminado completamente');
        }

        // Recalculamos el total
        sumaTotal = carritoItems.reduce((total, item) => total + item.total, 0);

        // Actualizamos la interfaz
        actualizarCarrito();
        actualizarContadorCarrito();

        // Guardamos los cambios
        guardarCarritoEnLocalStorage();
    }
}

// ACTUALIZAR LA LISTA DE PRODUCTOS EN EL CARRITO EMERGENTE
function actualizarCarrito() {
    if (!listaCarrito) {
        console.error('No se encontró el elemento lista-carrito');
        return;
    }

    // Limpiamos la lista antes de agregar items
    listaCarrito.innerHTML = '';

    if (carritoItems.length === 0) {
        // Mostramos mensaje si el carrito está vacío
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'carrito-vacio';
        emptyMessage.textContent = 'Tu carrito está vacío';
        listaCarrito.appendChild(emptyMessage);
        console.log('Carrito vacío - mostrando mensaje');
    } else {
        // Agregamos cada producto al carrito
        carritoItems.forEach(item => {
            const nuevoItem = document.createElement('li');
            nuevoItem.classList.add('item-carrito');

            // Creamos el HTML para cada producto
            nuevoItem.innerHTML = `
                <span class="nombre-item">${item.nombre} x${item.cantidad}</span>
                <span class="precio-item">$${item.total.toLocaleString('es-CL')} CLP</span>
                <button class="btn-quitar" onclick="quitarDeCarrito('${item.id}')">Quitar</button>
            `;

            listaCarrito.appendChild(nuevoItem);
        });
        console.log('Carrito actualizado con', carritoItems.length, 'productos');
    }

    // Actualizamos los totales
    actualizarTotalCarrito();
}

// ACTUALIZAR LOS TOTALES (subtotal, descuento, total)
function actualizarTotalCarrito() {
    const subtotal = sumaTotal;
    const descuento = 0; // Aquí podríamos agregar descuentos después
    const total = Math.max(subtotal - descuento, 0);

    // Actualizamos los textos en la página
    if (subtotalSpan) subtotalSpan.textContent = `$${subtotal.toLocaleString('es-CL')} CLP`;
    if (descuentoSpan) descuentoSpan.textContent = `$${descuento.toLocaleString('es-CL')} CLP`;
    if (totalCarrito) totalCarrito.textContent = `$${total.toLocaleString('es-CL')} CLP`;
    
    console.log('Totales actualizados');
}

// ACTUALIZAR EL CONTADOR DEL CARRITO (ese número rojo)
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const contadorFlotante = document.getElementById('contador-carrito-flotante');
    
    // Sumamos todas las cantidades de productos
    const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);

    // Actualizamos el contador en el navbar
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'inline' : 'none';
    }

    // Actualizamos el contador flotante (botón redondo)
    if (contadorFlotante) {
        contadorFlotante.textContent = totalItems;
        contadorFlotante.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    console.log('Contador actualizado:', totalItems, 'productos');
}

// FUNCIÓN PARA FINALIZAR LA COMPRA
function finalizarCompra() {
    if (carritoItems.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }

    // Aquí normalmente conectaríamos con una pasarela de pago
    alert('¡Compra finalizada! Total: $' + sumaTotal.toLocaleString('es-CL') + ' CLP');

    // Limpiamos el carrito después de comprar
    carritoItems = [];
    sumaTotal = 0;
    actualizarCarrito();
    actualizarContadorCarrito();
    guardarCarritoEnLocalStorage();
    
    console.log('Compra finalizada - Carrito limpiado');
}

// GUARDAR CARRITO EN LOCALSTORAGE (para que no se pierda al recargar)
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('huertoHogarCarrito', JSON.stringify({
        items: carritoItems,
        total: sumaTotal
    }));
    console.log('Carrito guardado en memoria');
}

// CARGAR CARRITO DESDE LOCALSTORAGE (al recargar la página)
function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('huertoHogarCarrito');

    if (carritoGuardado) {
        try {
            const carritoData = JSON.parse(carritoGuardado);
            carritoItems = carritoData.items || [];
            sumaTotal = carritoData.total || 0;

            // Recalculamos por si acaso
            sumaTotal = carritoItems.reduce((total, item) => total + item.total, 0);

            actualizarCarrito();
            actualizarContadorCarrito();
            
            console.log('Carrito cargado desde memoria:', carritoItems.length, 'productos');
        } catch (error) {
            console.error('Error al cargar carrito:', error);
            // Si hay error, limpiamos
            localStorage.removeItem('huertoHogarCarrito');
        }
    }
}


// FUNCIONES PARA LA PÁGINA CARRITO.HTML

// SINCRONIZAR CARRITO ENTRE PÁGINAS
function sincronizarCarrito() {
    // Solo ejecutamos esto en la página carrito.html
    if (window.location.pathname.includes('carrito.html')) {
        console.log('Sincronizando carrito en página dedicada...');
        
        // Cargamos datos desde memoria
        cargarCarritoDesdeLocalStorage();
        
        // Configuramos botón de vaciar carrito
        const clearCartBtn = document.getElementById('clear-cart-btn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', vaciarCarritoCompleto);
        }
        
        // Configuramos botón de finalizar compra
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', finalizarCompra);
        }
        
        // Actualizamos la vista completa
        actualizarVistaCarritoCompleto();
    }
}

// VACIAR CARRITO COMPLETAMENTE
function vaciarCarritoCompleto() {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        carritoItems = [];
        sumaTotal = 0;
        guardarCarritoEnLocalStorage();
        actualizarVistaCarritoCompleto();
        actualizarContadorCarrito();
        alert('Carrito vaciado correctamente');
        
        console.log('Carrito completamente vaciado');
    }
}

// ACTUALIZAR VISTA COMPLETA DEL CARRITO (página carrito.html)
function actualizarVistaCarritoCompleto() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const totalAmount = document.getElementById('total-amount');
    
    if (!cartItemsContainer) return;
    
    if (carritoItems.length === 0) {
        // Mostramos mensaje de carrito vacío
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        if (subtotalAmount) subtotalAmount.textContent = '$0';
        if (totalAmount) totalAmount.textContent = '$0';
        console.log('Vista carrito: Vacío');
        return;
    }
    
    // Ocultamos mensaje de carrito vacío
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    
    // Generamos HTML para cada producto
    cartItemsContainer.innerHTML = '';
    carritoItems.forEach(item => {
        const productHTML = `
            <div class="cart-item d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
                <div class="d-flex align-items-center">
                    <img src="${item.imagen}" alt="${item.nombre}" width="60" height="60" class="rounded me-3 object-fit-cover">
                    <div>
                        <h6 class="mb-1">${item.nombre}</h6>
                        <small class="text-muted">Cantidad: ${item.cantidad}</small>
                    </div>
                </div>
                <div class="text-end">
                    <div class="fw-bold">$${(item.total).toLocaleString('es-CL')} CLP</div>
                    <button class="btn btn-sm btn-outline-danger mt-1" onclick="quitarUnaUnidad('${item.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
        cartItemsContainer.innerHTML += productHTML;
    });
    
    // Actualizamos totales
    if (subtotalAmount) subtotalAmount.textContent = `$${sumaTotal.toLocaleString('es-CL')}`;
    if (totalAmount) totalAmount.textContent = `$${sumaTotal.toLocaleString('es-CL')}`;
    
    console.log('Vista carrito actualizada con', carritoItems.length, 'productos');
}

// QUITAR UNA UNIDAD DESDE LA PÁGINA CARRITO.HTML
function quitarUnaUnidad(itemId) {
    quitarDeCarrito(itemId);
    actualizarVistaCarritoCompleto(); // Actualizamos la vista completa
}


// HACER FUNCIONES DISPONIBLES GLOBALMENTE
window.toggleCarrito = toggleCarrito;
window.quitarDeCarrito = quitarDeCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.quitarUnaUnidad = quitarUnaUnidad;
window.vaciarCarritoCompleto = vaciarCarritoCompleto;

console.log('Carrito.js completamente cargado y listo para usar');

// SISTEMA DE LOGIN - VALIDACIÓN DE USUARIO

// Buscamos el formulario de login en la página
const loginForm = document.getElementById("loginForm");
// Buscamos el contenedor donde mostraremos mensajes al usuario
const loginMensaje = document.getElementById("alertBox");

// Lista de dominios de correo que aceptamos en nuestro sistema
const ALLOWED_DOMAINS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

// Ponemos el formulario a escuchar cuando alguien intenta enviarlo
loginForm.addEventListener("submit", function (event) {
    // Evitamos que el formulario se envíe de la forma tradicional
    event.preventDefault();

    // Obtenemos los valores que el usuario escribió
    const correo = document.getElementById("loginCorreo").value.trim(); // Email sin espacios extras
    const contrasena = document.getElementById("loginContrasena").value; // Contraseña tal cual

    // Aquí guardaremos todos los errores que encontremos
    let errores = [];

    
    // VALIDACIÓN DEL CORREO ELECTRÓNICO
  
    // Validar que el correo no esté vacío
    if (!correo) {
        errores.push("El correo es obligatorio."); // Agregamos error a la lista
    } 
    // Validar que el correo termine con uno de los dominios permitidos
    else if (!ALLOWED_DOMAINS.some(d => correo.toLowerCase().endsWith(d))) {
        errores.push("El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    }


    // VALIDACIÓN DE LA CONTRASEÑA

    // Validar que la contraseña no esté vacía
    if (!contrasena) {
        errores.push("La contraseña es obligatoria.");
    } 
    // Validar que la contraseña tenga entre 4 y 10 caracteres
    else if (contrasena.length < 4 || contrasena.length > 10) {
        errores.push("La contraseña debe tener entre 4 y 10 caracteres.");
    }


    // MOSTRAR RESULTADO AL USUARIO
    
    // Si encontramos algún error...
    if (errores.length > 0) {
        // Preparamos el mensaje de error (rojo)
        loginMensaje.classList.remove("d-none", "alert-success"); // Quitamos clases de éxito
        loginMensaje.classList.add("alert-danger"); // Ponemos clase de peligro (rojo)
        // Mostramos todos los errores encontrados, uno por línea
        loginMensaje.innerHTML = "<strong>Error:</strong><br>" + errores.join("<br>");
        return; // Nos detenemos aquí, no continuamos
    }

    // SI TODO ESTÁ CORRECTO
    
    // Preparamos el mensaje de éxito (verde)
    loginMensaje.classList.remove("d-none", "alert-danger"); // Quitamos clases de error
    loginMensaje.classList.add("alert-success"); // Ponemos clase de éxito (verde)
    // Mostramos mensaje de login exitoso
    loginMensaje.innerHTML = "<strong>¡Login exitoso!</strong>";
    
    // Aquí normalmente redirigiríamos a otra página o haríamos una petición al servidor
    console.log("Login válido. Correo:", correo);
});
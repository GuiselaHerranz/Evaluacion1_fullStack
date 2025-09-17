// SISTEMA DE REGISTRO DE USUARIOS

// Función para mostrar notificaciones al usuario
function showAlert(message, type) {
    // Buscamos la caja de alerta en la página
    const alertBox = document.getElementById('alertBox');
    // Ponemos el mensaje que queremos mostrar
    alertBox.textContent = message;
    // Le damos clases de Bootstrap según el tipo (success=verde, error=rojo)
    alertBox.className = 'alert alert-' + type;
    // Hacemos visible la alerta
    alertBox.style.display = 'block';

    // La alerta se oculta automáticamente después de 5 segundos
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 5000);
}

// Función para mostrar/ocultar la contraseña (ojito)
function togglePassword(inputId) {
    // Buscamos el campo de contraseña
    const passwordInput = document.getElementById(inputId);
    // Buscamos el icono del ojo (que está al lado del input)
    const toggleIcon = passwordInput.nextElementSibling.querySelector('i');

    // Si la contraseña está oculta (type="password")...
    if (passwordInput.type === 'password') {
        // La mostramos como texto normal
        passwordInput.type = 'text';
        // Cambiamos el icono a "ojo tachado"
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        // Si está visible, la ocultamos
        passwordInput.type = 'password';
        // Cambiamos el icono a "ojo normal"
        toggleIcon.className = 'fas fa-eye';
    }
}

// Función para validar el RUN (versión simplificada)
function validarRun(run) {
    // Limpiamos el RUN: quitamos puntos, guiones y convertimos a mayúsculas
    // Ejemplo: "12.345.678-9" → "123456789"
    run = run.replace(/[\.\-]/g, '').toUpperCase();

    // Verificamos el formato básico con una expresión regular:
    // - ^[0-9]{7,9} → 7 a 9 dígitos al inicio
    // - [0-9K]$ → termina con un dígito o la letra K
    if (!/^[0-9]{7,9}[0-9K]$/.test(run)) {
        return false; // RUN inválido
    }

    return true; // RUN válido
}

// Función para validar el email
function validarEmail(email) {
    // Lista de dominios que aceptamos
    const dominiosPermitidos = ['gmail.com', 'duoc.cl', 'profesor.duoc.cl'];
    // Extraemos la parte después del @ (el dominio)
    const dominio = email.split('@')[1];

    // Si no hay dominio (ej: "usuario@" o "usuario"), es inválido
    if (!dominio) return false;

    // Verificamos si el dominio está en nuestra lista permitida
    return dominiosPermitidos.includes(dominio);
}

// Función para guardar usuario en localStorage
function guardarUsuario(usuario) {
    // Obtenemos todos los usuarios guardados, o empezamos con array vacío si no hay
    const usuarios = JSON.parse(localStorage.getItem('huertohogar_usuarios')) || [];

    // Verificar si el email ya está registrado
    if (usuarios.some(u => u.email === usuario.email)) {
        showAlert('Este correo electrónico ya está registrado', 'error');
        return false; // No se puede guardar
    }

    // Verificar si el RUN ya está registrado
    if (usuarios.some(u => u.run === usuario.run)) {
        showAlert('Este RUN ya está registrado', 'error');
        return false; // No se puede guardar
    }

    // Agregamos la fecha de registro (para saber cuándo se creó la cuenta)
    usuario.fechaRegistro = new Date().toISOString();

    // Agregamos el nuevo usuario al array
    usuarios.push(usuario);

    // Guardamos el array actualizado en localStorage
    localStorage.setItem('huertohogar_usuarios', JSON.stringify(usuarios));

    return true; // Guardado exitoso
}


// MANEJO DEL FORMULARIO DE REGISTRO

// Ponemos el formulario a escuchar cuando alguien intenta registrarse
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitamos que el formulario se envíe normalmente

    // Obtenemos todos los valores del formulario
    const run = document.getElementById('run').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const direccion = document.getElementById('direccion').value;
    const region = document.getElementById('region').value;
    const comuna = document.getElementById('comuna').value;

    
    // VALIDACIONES (guardianes de la entrada)
   
    // Validar RUN
    if (!validarRun(run)) {
        showAlert('Por favor ingresa un RUN válido (7-9 dígitos + dígito verificador)', 'error');
        return; // Detenemos el proceso
    }

    // Validar email
    if (!validarEmail(email)) {
        showAlert('Por favor ingresa un correo válido (@gmail.com, @duoc.cl o @profesor.duoc.cl)', 'error');
        return;
    }

    // Validar longitud de contraseña
    if (password.length < 4 || password.length > 10) {
        showAlert('La contraseña debe tener entre 4 y 10 caracteres', 'error');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden', 'error');
        return;
    }

    // SI TODAS LAS VALIDACIONES PASAN

    // Creamos el objeto usuario con todos los datos
    const usuario = {
        run,
        nombre,
        apellido,
        email,
        password, // En la vida real esto debería estar encriptado
        direccion,
        region,
        comuna,
        rol: 'cliente' // Todos los nuevos usuarios son clientes normales
    };

    // Intentamos guardar el usuario
    if (guardarUsuario(usuario)) {
        // Si se guardó exitosamente
        showAlert('¡Registro exitoso! Ahora puedes iniciar sesión', 'success');

        // Limpiamos el formulario para un próximo registro
        document.getElementById('registrationForm').reset();

        // Redirigimos al login después de 2 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }
});


// VALIDACIÓN EN TIEMPO REAL (mientras escribe)

// Validar RUN cuando el usuario sale del campo
document.getElementById('run').addEventListener('blur', function() {
    // Solo validamos si hay algo escrito
    if (this.value && !validarRun(this.value)) {
        showAlert('Formato de RUN incorrecto. Ejemplo: 12345678K', 'error');
    }
});

// Validar email cuando el usuario sale del campo  
document.getElementById('email').addEventListener('blur', function() {
    // Solo validamos si hay algo escrito
    if (this.value && !validarEmail(this.value)) {
        showAlert('Debe usar @gmail.com, @duoc.cl o @profesor.duoc.cl', 'error');
    }
});
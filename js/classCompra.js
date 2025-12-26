botonVaciarCarrito.style.display = 'none';
botonCarrito.style.display = 'none';
botonFinalizarCompra.style.display = 'none';

class Compra {
    constructor(compras) {
        this.carrito = compras
    }
    obtenerTotal() {
        if(this.carrito.length > 0) {   
            return this.carrito.reduce((acu, compu) => acu + (compu.precio * compu.cantidad),0)
        }
        return 0
    }
}

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mensajeToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        close: true,
        style: {
          background: 'green',
        }
    }).showToast()
}

function mensajeAlert(mensaje) {
    Toastify({
        text: mensaje,
        duration: 1000,
        close: true,
        style: {
          background: 'red',
        }
    }).showToast()
}

// funcion para agregar items al carrito

function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll('button.btn')
    botonesAgregar.forEach((boton)=> {
        boton.addEventListener('click', (e)=> {
            const id = parseInt(e.target.id)
            const productoSeleccionado = productos.find((producto) => producto.id === id)
            const productoEnCarrito = carrito.find((producto) => producto.id === id)
            if(productoEnCarrito){
                mensajeAlert(`Este producto ya se agregó al carrito`)
            }else{  
                carrito.push({
                    ...productoSeleccionado,
                    cantidad : 1 
                })
            numeroCarrito.innerHTML = carrito.length || null
            mensajeToast(`${productoSeleccionado.titulo} se agregó al carrito`)
            localStorage.setItem('carrito', JSON.stringify(carrito))
            }
        })
    })
}

// funcion para cargar los productos del carrito

function cargarProductosEnCarrito() {
    if (carrito.length > 0) {
        tituloIndex.innerHTML = 'Carrito'
        contenedorIndex.innerHTML = ''
        carrito.forEach((producto) => contenedorIndex.innerHTML += crearCardHTMLCart(producto))
        numeroCarrito.innerHTML = carrito.length || null  
        botonCarrito.style.display = 'flex' 
        botonVaciarCarrito.style.display = 'flex' 
        mostrarTotal()
        EliminarProductoEnCarrito()
        SumarProducto()
        RestarProducto()
    } else {
        tituloIndex.innerHTML = ''
        contenedorIndex.innerHTML = crearCardCartError()
    }
}

// funciones del carrito

function SumarProducto() {
    document.querySelectorAll('.sumar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.id);
            const producto = carrito.find(p => p.id === id);
            if(producto.cantidad >= 5){
                mensajeAlert(`A alcanzado el limite de productos`)
            }else{
                producto.cantidad++;
                localStorage.setItem('carrito', JSON.stringify(carrito))
                cargarProductosEnCarrito()
            } 
        })
    })
}

function RestarProducto() {
    document.querySelectorAll('.restar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.id);
            const producto = carrito.find(p => p.id === id)
            if (producto.cantidad > 1) {
                producto.cantidad--
            } else {
                carrito = carrito.filter(p => p.id !== id)
                if(carrito.length === 0){
                    vaciarCarrito()
                }
            }
            localStorage.setItem('carrito', JSON.stringify(carrito))
            cargarProductosEnCarrito()
        })
    })
}

function mostrarTotal() {
    const compra = new Compra(carrito)
    let total = compra.obtenerTotal()
    totalSection.innerHTML = `<h3 class='h3-carrito'>El total de su compra es de: $${total}</h3>`
}


function EliminarProductoEnCarrito() {
    const btn = document.querySelectorAll('.btnn')
    btn.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = parseInt(e.target.id)
            carrito = carrito.filter(producto => producto.id !== id)
            if (carrito.length > 0){
                localStorage.setItem('carrito', JSON.stringify(carrito))
                cargarProductosEnCarrito()
            }else{
                vaciarCarrito()
            }     
        })
    })
}

function vaciarCarrito() {
    carrito = []
    localStorage.setItem('carrito', JSON.stringify(carrito))
    tituloIndex.innerHTML = ''
    contenedorIndex.innerHTML = crearCardCartError()
    totalSection.innerHTML = ''
    botonCarrito.style.display = 'none' 
    botonVaciarCarrito.style.display = 'none'
    numeroCarrito.innerHTML = null
    cargarProductosEnCarrito()
}

linkCarrito.addEventListener('click', cargarProductosEnCarrito)

// pequeña validacion de formulario

function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim()
    const email = document.getElementById('email').value.trim()
    const direccion = document.getElementById('direccion').value.trim()
    const telefono = document.getElementById('telefono').value.trim()
    if (!nombre || !email || !direccion || !telefono) {
        mensajeAlert('Todos los campos son obligatorios')
        return false
    }
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(email)) {
        mensajeAlert('Email inválido')
        return false
    }
    if (telefono.length < 8) {
        mensajeAlert('El teléfono debe tener al menos 8 dígitos')
        return false
    }
    return true
}

// funcion para renderizar el formulario

function mostrarFormulario(){
    botonFinalizarCompra.style.display = 'flex'
    totalSection.style.display = 'none'
    tituloIndex.style.display = 'none'
    botonCarrito.style.display = 'none'
    botonVaciarCarrito.style.display = 'none'
    contenedorIndex.innerHTML = ''
    contenedorIndex.innerHTML = `
                                <label class="label">Nombre completo</label><input type="text" id="nombre" class="input-formulario" value="Cosme Fulanito" >
                                <label class="label">Email</label><input type="email" id="email" class="input-formulario" value="cosmeFulanito@gmail.com">
                                <label class="label">Dirección</label><input type="text" id="direccion" class="input-formulario" value="Avenida Siempre Viva 123">
                                <label class="label">Teléfono</label><input type="number" id="telefono" class="input-formulario" value="1164692686">
                                `
}

botonVaciarCarrito.addEventListener('click', vaciarCarrito)
botonCarrito.addEventListener('click', mostrarFormulario)

function terminarCompra(){
    Swal.fire({
        icon: 'success',
        title: '¡Muchas gracias por su compra! En breve serás contactacto para coordinar la entrega',
        html: '¡Muchas gracias por elegirnos!',
        timer: 5000,
    },)
    setTimeout(()=>{
        localStorage.clear()
        carrito.length = 0
        botonFinalizarCompra.style.display = 'none'
        cargarProductos()
    },2000)
    
}

// finalizacion de compra

botonFinalizarCompra.addEventListener('click', () => {
    if (validarFormulario()) {
        terminarCompra()
    }
})

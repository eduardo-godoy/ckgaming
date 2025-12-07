const urlJson = './productos.json'

const contenedorIndex = document.querySelector('section.main-section')
const tituloIndex = document.querySelector('h1.h1-index')
const numeroCarrito = document.querySelector('p.p-cart')
const inputBuscar = document.querySelector('input.input-index')
const botonComputadora = document.querySelector('li ul.ul-index-1')
const botonNotebooks = document.querySelector('li ul.ul-index-2')
const totalSection = document.querySelector('section.total-section')
const linkCarrito = document.querySelector('a.a-cart')
const logo = document.querySelector('a.logo-a')
const botonCarrito = document.querySelector('.btn-ckeckout')
const botonFinalizarCompra = document.querySelector("a.a-formulario")
botonCarrito.style.display = 'none'
botonFinalizarCompra.style.display = 'none'

// TOMAMOS EL CARRITO DE LOCALSTORAGE Y LO CONVERTIMOS EN UN ARRAY, Y SI NO HAY NADA UN ARRAY VACIO
let carrito = JSON.parse(localStorage.getItem('carrito')) || []
let productos = []


function crearCardError() {
    return `<h1>Lo siento, intente nuevamente mas tarde.</h1>`
}

function crearCardHTML({id, imagen, titulo, precio}) {
    return `<article class='article-card'>
                <img src='${imagen}' class='imagen'/>
                <h2 class='h2-titulo'>${titulo}</h2>
                <h3 class='h2-titulo'>Precio: $${precio}</h3>
                <button id="${id}" class='btn'>Agregar</button>
            </article>`
}

function mensajeToast(mensaje) {
    Toastify({
        text: mensaje,
        duration: 2000,
        close: true,
        style: {
          background: 'gray',
        }
    }).showToast()
}

// FUNCION QUE TOMA A LOS PRODUCTOS POR SU ID Y LOS PUSHEA AL CARRITO VACIO O YA LLENO, PARA DESPUES GUARDARLOS EN LOCALSTORAGE
// MUESTRA LA LONGITUD DEL CARRITO EN SU ICONO ARRIBA A LA DERECHA
function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll("button.btn")
    botonesAgregar.forEach((boton)=> {
        boton.addEventListener("click", (e)=> {
            const id = parseInt(e.target.id)
            const productoSeleccionado = productos.find((producto) => producto.id === id)
            carrito.push(productoSeleccionado)
            numeroCarrito.innerHTML = carrito.length || null
            localStorage.setItem("carrito", JSON.stringify(carrito))
            mensajeToast(`${productoSeleccionado.titulo} se agregó al carrito`)
        })
    })
}

// FUNCIONES QUE CARGAR LOS PRODUCTOS EN EL INDEX + EL FETCH DEL JSON 
function cargarProductos() {
    if (productos.length > 0) {
        contenedorIndex.innerHTML = ''
        tituloIndex.innerHTML = 'Productos'
        productos.forEach((producto) => contenedorIndex.innerHTML += crearCardHTML(producto))
        activarClickEnBotones()
        numeroCarrito.innerHTML = carrito.length || null
    } else {
        contenedorIndex.innerHTML = crearCardError()
    }
}

function cargarProductosJson(){
    contenedorIndex.innerHTML = `<h1>Cargando productos, por favor espere...</h1>`
    setTimeout(()=> {
        fetch(urlJson)
        .then((response) => response.json())
        .then((data) => productos.push(...data))
        .then(()=>cargarProductos())
        .catch((e) => contenedorIndex.innerHTML = crearCardError())
    },1000)
 }

cargarProductosJson()

// EVENTOS DEL INPUT SEARCH, MAS LOS FILTRADOS DE CATEGORIA, POR NOTEBOOK O COMPUTADORA
inputBuscar.addEventListener('search', ()=> {
    let textoAbuscar = inputBuscar.value.trim().toLowerCase()
    let resultado = productos.filter((producto)=> producto.titulo.toLowerCase().includes(textoAbuscar))
    if(resultado.length > 0){
        contenedorIndex.innerHTML = ""
        totalSection.innerHTML = ""
        tituloIndex.innerHTML = 'Productos'
        resultado.forEach((producto)=> contenedorIndex.innerHTML += crearCardHTML(producto))
        activarClickEnBotones()  
    } else {
        contenedorIndex.innerHTML = ""
        totalSection.innerHTML = ""
        tituloIndex.innerHTML = 'No hay resultados'
    }
    
})

botonNotebooks.addEventListener('click', () => {
    let productosASeparar = productos.filter((producto) => producto.categoria == "Notebooks")
    contenedorIndex.innerHTML = ""
    tituloIndex.innerHTML = 'Notebooks'
    productosASeparar.forEach((producto)=> contenedorIndex.innerHTML += crearCardHTML(producto))
    activarClickEnBotones()
})

botonComputadora.addEventListener('click', () => {
    let productosASeparar = productos.filter((producto) => producto.categoria == "Computadoras")
    contenedorIndex.innerHTML = ""
    tituloIndex.innerHTML = 'Computadoras'
    productosASeparar.forEach((producto)=> contenedorIndex.innerHTML += crearCardHTML(producto))
    activarClickEnBotones()
})

logo.addEventListener('click', () => {
    cargarProductos()
})

// FUNCIONES Y EVENTOS DEL CARRITO, HACIENDO CLICK EN EL CARRITO, ESQUINA SUPERIOR DERECHA
function crearCardCartError() {
    return `<h2>No hay productos en el carrito</h2>`
} 

function crearCardHTMLCart({imagen, titulo, precio}) {
    return `<article class='article-card-cart'>
                <img src='${imagen}' class='imagen-cart'/>
                <h2 class='h2-titulo-cart'>${titulo}</h2>
                <h3 class='h3-titulo-cart'>Precio: $${precio}</h3>
            </article>`
}

function mostrarTotal(){
    const compra = new Compra(carrito)
    let total = compra.obtenerTotal()
    totalSection.innerHTML = `<h3 class='h3-carrito'>El total de su compra es de: $${total}</h3>`
}

function cargarProductosEnCarrito() {
    if (carrito.length > 0) {
        tituloIndex.innerHTML = 'Carrito'
        contenedorIndex.innerHTML = ''
        carrito.forEach((producto) => contenedorIndex.innerHTML += crearCardHTMLCart(producto))
        numeroCarrito.innerHTML = carrito.length || null  
        botonCarrito.style.display = 'flex' 
        mostrarTotal()
    } else {
        tituloIndex.innerHTML = ''
        contenedorIndex.innerHTML = crearCardCartError()
    }
}

linkCarrito.addEventListener('click', cargarProductosEnCarrito)

// FUNCION PARA MOSTRAR EL FORMULARIO YA COMPLETADO Y FINALIZAR LA COMPRA
function mostrarFormulario(){
    botonFinalizarCompra.style.display = 'flex'
    totalSection.style.display = 'none'
    tituloIndex.style.display = 'none'
    botonCarrito.style.display = 'none'
    contenedorIndex.innerHTML = ''
    contenedorIndex.innerHTML = `
                                <label class="label">Nombre completo</label><input class="input-formulario" value="Cosme Fulanito">
                                <label class="label">Email</label><input class="input-formulario" value="cosmeFulanito@gmail.com">
                                <label class="label">Dirección</label><input class="input-formulario" value="Avenida Siempre Viva 123">
                                <label class="label">Teléfono</label><input class="input-formulario" value="1164692686">
                                `
}

botonCarrito.addEventListener('click', mostrarFormulario)

// ULTIMA FUNCION Y EVENTO PARA TERMINAR LA COMPRA MOSTRANDO UN MENSAJE POR LA LIBRERIA SWEETALERT2 
// Y REDIRECCIONANDO POR ULTIMA AL INDEX CON TODOS LOS PRODUCTOS Y BORRANDO EL CARRIGO DE LOCALSTORAGE
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

botonFinalizarCompra.addEventListener('click', terminarCompra)
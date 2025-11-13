const contenedorIndex = document.querySelector('section.main-section')
const tituloIndex = document.querySelector('h1.h1-index')
const numeroCarrito = document.querySelector('p.p-cart')
const inputBuscar = document.querySelector('input.input-index')
const botonComputadora = document.querySelector('li ul.ul-index-1')
const botonNotebooks = document.querySelector('li ul.ul-index-2')
const totalSection = document.querySelector('section.total-section')
const btnCart = document.querySelector('a.a-cart')
const logo = document.querySelector('a.logo-a')

// tomamos el carrito de localstorage y lo convertimos en array

let carrito = JSON.parse(localStorage.getItem('carrito')) || []


// funciones del index, renderizado de todos los productos, mas la funcion del agregado al carrito 

function crearCardError() {
    return `<div class="div-card-error">
                <div class="imagen-error">🤦🏻‍♂️</div>
                <div class="leyenda-error">No pudimos cargar los productos</div>
                <div class="leyenda-intento">Intenta nuevamente en unos segundos.</div>
           </div>`
}

function crearCardHTML({id, imagen, titulo, precio}) {
    return `<article class='article-card'>
                <img src='${imagen}' class='imagen'/>
                <h2 class='h2-titulo'>${titulo}</h2>
                <h3 class='h2-titulo'>Precio: $${precio}</h3>
                <button id="${id}" class='btn'>Agregar</button>
            </article>`
}

// funcion que agrega al carrito los productos, tomandolos por su id y pusheandolos en el array de carrito, por ultimo se convierte en 
// un json y se guarda en local storage

function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll("button.btn")
    botonesAgregar.forEach((boton)=> {
        boton.addEventListener("click", (e)=> {
            const id = parseInt(e.target.id)
            const productoSeleccionado = productos.find((producto) => producto.id === id)
            carrito.push(productoSeleccionado)
            numeroCarrito.innerHTML = carrito.length || null
            localStorage.setItem("carrito", JSON.stringify(carrito))
        })
    })
}

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

cargarProductos()

// eventos del input y el navbar, filtra por lo q escibre el usuario o haciendo click en computadora o notebook te filtra por la categoria.

inputBuscar.addEventListener('search', ()=> {
    let textoAbuscar = inputBuscar.value.trim().toLowerCase()
    let resultado = productos.filter((producto)=> producto.titulo.toLowerCase().includes(textoAbuscar))
    console.log(resultado)
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

// funciones y eventos del carrito, haciendo click en el carrito esquina superior derecha

function crearCardHTMLError() {
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
    totalSection.innerHTML = 'El total de su compra es de: $' + total
}

function cargarProductosEnCarrito() {
    if (carrito.length > 0) {
        tituloIndex.innerHTML = 'Carrito'
        contenedorIndex.innerHTML = ''
        carrito.forEach((producto) => contenedorIndex.innerHTML += crearCardHTMLCart(producto))
        numeroCarrito.innerHTML = carrito.length || null
        mostrarTotal()
        totalSection
    } else {
        tituloIndex.innerHTML = ''
        contenedorIndex.innerHTML = crearCardHTMLError()
    }
}

// evento del dom para acceder al carrito

btnCart.addEventListener('click', cargarProductosEnCarrito)
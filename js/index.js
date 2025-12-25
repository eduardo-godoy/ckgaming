const UrlJson = './db/productos.json';

const contenedorIndex = document.querySelector('section.main-section');
const tituloIndex = document.querySelector('h1.h1-index');
const numeroCarrito = document.querySelector('p.p-cart');
const inputBuscar = document.querySelector('input.input-index');
const botonComputadora = document.querySelector('li ul.ul-index-1');
const botonNotebooks = document.querySelector('li ul.ul-index-2');
const totalSection = document.querySelector('section.total-section');
const linkCarrito = document.querySelector('a.a-cart');
const logo = document.querySelector('a.logo-a');
const botonCarrito = document.querySelector('.btn-ckeckout');
const botonFinalizarCompra = document.querySelector("a.a-formulario");
const botonVaciarCarrito = document.querySelector(".btn-ckeckout-cart");

let productos = [];

function crearCardError() {
    return `<h1>Lo siento, intente nuevamente mas tarde.</h1>`
};

function crearCardHTML({id, imagen, titulo, precio}) {
    return `<article class='article-card'>
                <img src='${imagen}' class='imagen'/>
                <h2 class='h2-titulo'>${titulo}</h2>
                <h3 class='h2-titulo'>Precio: $${precio}</h3>
                <button id="${id}" class='btn'>Agregar</button>
            </article>`
};

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
};

function cargarProductosJson(){
    contenedorIndex.innerHTML = `<h1>Cargando productos, por favor espere...</h1>`
    setTimeout(()=> {
        fetch(UrlJson)
        .then((response) => response.json())
        .then((data) => productos.push(...data))
        .then(()=>cargarProductos())
        .catch((e) => contenedorIndex.innerHTML = crearCardError())
    },1000)
 }

cargarProductosJson()

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

function crearCardCartError() {
    return `<h2>No hay productos en el carrito</h2>`
} 

function crearCardHTMLCart({id, imagen, titulo, precio, cantidad}) {
    const subtotal = precio * cantidad;

    return `<article class='article-card-cart'>
                <img src='${imagen}' class='imagen-cart'/>
                <h2 class='h2-titulo-cart'>${titulo}</h2>
                <h3 class='h3-titulo-cart'>Precio: $${precio}</h3>
                <div class="contador-cart">
                    <button class="restar" id="${id}">-</button>
                    <span class="cantidad">${cantidad}</span>
                    <button class="sumar" id="${id}">+</button>
                </div>
                <h3 class="subtotal">Subtotal: $${subtotal}</h3>
                <button id="${id}" class='btnn'>Eliminar</button>
            </article>`
}


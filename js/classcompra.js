class Compra {
    constructor(compras) {
        this.carrito = compras
    }
    obtenerTotal() {
        if(this.carrito.length > 0) {   
            return this.carrito.reduce((acu, compu) => acu + compu.precio, 0)
        }
    }
}

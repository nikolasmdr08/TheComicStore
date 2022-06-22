let monedaActual = localStorage.getItem("monedaActual")
let monedaSeleccionada = localStorage.getItem("monedaSeleccionada")
const selectElement = document.getElementById("moneda")
const seccion = document.getElementById("card")
let car 

if(localStorage.getItem("carrito") !== null){
    car= JSON.parse(localStorage.getItem("carrito"))
}
else{
    car = []
}

let cantItems = 0

class ItemCarrito{
    constructor(id,descripcion,cantidad,precioUnitario){
        this.id = id;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }

    precioConIVA(){
        return this.precioUnitario * 1.21
    }
}

window.onload = () => {
    document.querySelector(".card").innerHTML = ""
    items.forEach( 
        item => {
            let itemActual = `
                <div class="card_item">
                    <img src="IMAGES/${item.img}.jpg" alt="${item.img}" width="175" height="175">
                    <span class="nombre">${item.nombre}</span>
                    <span class="precio">$${(item.precio*monedaActual).toFixed(2)}</span>
                    <a onClick="agregarItem('btn${item.img}', '${item.nombre}', 1, ${item.precio.toFixed(2)})" ><i class="bi bi-plus-circle-fill"></i></a>
                </div>`
            let itemsList = document.querySelector(".card")
            itemsList.innerHTML += itemActual
        }
    )
        
    //numero items carrito
    if(parseInt(localStorage.getItem("cantItems"))>0){
        cantItems = parseInt(localStorage.getItem("cantItems"))
    }
    else{
        cantItems = 0
    }

    let spanCarrito = document.getElementById("itemsCar")
    spanCarrito.innerHTML = cantItems

    //moneda seleccionada
    let selectorSelectedMoneda = document.getElementById(monedaSeleccionada)
    selectorSelectedMoneda.selected = true

}


selectElement.addEventListener('change', (event) => {
    definirMoneda(event.target.value)
});

function definirMoneda(moneda){
    if(moneda==='PE'){
        monedaActual = 1;
    }
    if(moneda==='DO'){
        monedaActual = 0.0081;
    }
    if(moneda==='EU'){
        monedaActual = 0.0077;
    }

    localStorage.setItem("monedaActual",monedaActual)
    localStorage.setItem("monedaSeleccionada",moneda)
    window.location.reload()
}

function elementoACargar(){
    let idItem = parseInt(prompt("ingrese el codigo de item"))
    let cantidadItem = parseInt(prompt("ingrese la cantidad"))
    let precioItem = parseInt(prompt("ingrese el precio unitario"))
    agregarItem(idItem, "",cantidadItem, precioItem)
}

function agregarItem(idItem, descripcion, cantidadItem, precioItem){
    car.push(new ItemCarrito(idItem, descripcion, cantidadItem, precioItem));
    localStorage.removeItem('carrito');
    localStorage.setItem("carrito",JSON.stringify(car))
    cantItems+= 1
    localStorage.setItem("cantItems",cantItems)  
    let spanCarrito = document.getElementById("itemsCar")
    spanCarrito.innerHTML = cantItems
}

function calcularTotal(){
    let total = 0;
    for( item in car){
        total += car[item].cantidad * car[item].precioConIVA();
    }
    return (total*monedaActual).toFixed(2);
}


//agregarItem(1, 15, 1000)
//agregarItem(2, 3, 980)
//agregarItem(3, 7, 560)

//elementoACargar()

//console.log("Total acumulado: "+  calcularTotal())
//console.log(monedaSeleccionada)

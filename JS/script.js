let car = [];
let monedaActual = 1;

function elementoACargar(){
    let idItem = parseInt(prompt("ingrese el codigo de item"))
    let cantidadItem = parseInt(prompt("ingrese la cantidad"))
    let precioItem = parseInt(prompt("ingrese el precio unitario"))
    agregarItem(idItem, cantidadItem, precioItem)
}

function agregarItem(idItem, cantidadItem, precioItem){
    let item = 
    {
        id: idItem,
        cantidad: cantidadItem,
        precio: precioItem
    };

    car.push(item);
}

function definirMoneda(){
    let moneda = prompt("Ingrese el tipo de cambio")
    if(moneda==='PESO'){
        monedaActual = 1;
    }
    if(moneda==='DOLAR'){
        monedaActual = 206;
    }
    if(moneda==='YEN'){
        monedaActual = 0.93;
    }
}

function calcularTotal(){
    debugger
    let total = 0;
    for( item in car){
        total += car[item].cantidad * car[item].precio;
    }
    return total*monedaActual;
}

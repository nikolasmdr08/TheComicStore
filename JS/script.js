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

if(monedaActual === null){
    monedaActual = 1
    localStorage.setItem("monedaActual",monedaActual)
}

if(monedaSeleccionada === null){
    monedaSeleccionada = 'PE'
    localStorage.setItem("monedaSeleccionada",monedaSeleccionada)
}

let cantItems = 0

class ItemCarrito{
    constructor(id,descripcion,cantidad,precioUnitario){
        this.id = id;
        this.descripcion = descripcion;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
    }
}

window.onload = () => {

    obtenerItems(); /// async
        
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
    
    if(car.length!==0){
        car.forEach( elemnto => 
            {
                agregarItemAModal(elemnto.id, elemnto.descripcion, elemnto.cantidad, elemnto.precioUnitario)  
            }
        )
        let total = 
        `
        <li class="listItems">
            <div colspan="2"></div>
            <span class="restricion"> TOTAL </span>
            <span class="restricion">$${calcularTotal()} </span>
        </li>
        `
        let modalCarrito = document.getElementById("list");
        modalCarrito.innerHTML += total;
    }
    else{
        document.getElementById("list").innerHTML = "No se ha seleccionado ningun producto. 😢"
    }
    

}

let contenidoJSON = []
const obtenerItems = async () => {
    const response = await fetch(URL)
    contenidoJSON = await response.json()
    
    tablero = document.querySelector(".cards");
    if(tablero!==null){
        document.querySelector(".cards").innerHTML = ""
        contenidoJSON.forEach( 
            item => {
                let itemActual = `
                    <div class="card_item">
                        <img src="IMAGES/${item.img}.jpg" alt="${item.img}" width="175" height="175">
                        <span class="nombre">${item.nombre}</span>
                        <span class="precio">$${(item.precio*monedaActual).toFixed(2)}</span>
                        <a onClick="agregarItem('btn${item.img}', '${item.nombre}', 1, ${item.precio.toFixed(2)})" ><i class="bi bi-plus-circle-fill"></i></a>
                    </div>`
                let itemsList = document.querySelector(".cards")
                itemsList.innerHTML += itemActual
            }
        )
    }
}

const formSubmit = document.getElementById("recibiNoticiasBTN");
formSubmit.addEventListener('click', recibiNoticias);

function recibiNoticias(){
    const email = document.getElementById("recibiNoticiasEmail");
    if(email.value === ""){
        Swal.fire({
            icon: 'error',
            title: 'Atencion',
            text: 'Debe ingregar una direccion de E-mail'
        })
    }
    else{
        Swal.fire({
            icon: 'success',
            title: 'se registro con exito',
            timer: 1500
          })
    }
}

confirmarCompra.addEventListener('click', ConfirmarCompra);

function ConfirmarCompra(){

    let modal = document.getElementById("exampleModal")
    modal.style.display = 'none'

    cantItems = 0
    let spanCarrito = document.getElementById("itemsCar")
    spanCarrito.innerHTML = cantItems
    localStorage.setItem("cantItems",cantItems)  

    car = []
    let modalCarrito = document.getElementById("list");
    modalCarrito.innerHTML = "No se ha seleccionado ningun producto. 😢";
    localStorage.removeItem('carrito');
    Swal.fire({
        icon: 'success',
        title: 'se registro con exito'
    })
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
    //guardar lista del carrito en localstorage
    localStorage.removeItem('carrito');
    localStorage.setItem("carrito",JSON.stringify(car))
    //guardar cantidad en localstorage
    cantItems+= 1
    localStorage.setItem("cantItems",cantItems)  
    //numero de items en html
    let spanCarrito = document.getElementById("itemsCar")
    spanCarrito.innerHTML = cantItems
    // agregar item visible a carrito
    document.getElementById("list").innerHTML = ""
    car.forEach( elemnto => 
        {
            agregarItemAModal(elemnto.id, elemnto.descripcion, elemnto.cantidad, elemnto.precioUnitario)  
        }
    )
    let total = 
    `
    <li class="listItems">
        <div colspan="2"></div>
        <span class="restricion"> TOTAL </span>
        <span class="restricion">$${calcularTotal()} </span>
    </li>
    `
    let modalCarrito = document.getElementById("list");
    modalCarrito.innerHTML += total;
    // alerta ok
    Swal.fire({
        icon: 'success',
        title: 'Se agrego al carrito de compras',
        showConfirmButton: true,
        timer: 1500
    })
}

function agregarItemAModal(idItem, descripcion, cantidadItem, precioItem){
    let item = 
        `<li class="listItems">
            <span class="restricion" id="carList_nombre">${descripcion}</span>
            <input class="restricion" type="number" name="cant" id="cant_${idItem}" onchange="editarCantidad('cant_${idItem}','${idItem}')" value="${cantidadItem}">
            <span class="restricion" id="carList_precio">$${(precioItem*monedaActual).toFixed(2)}</span>
            <a onclick="eliminarItem('${idItem}')"><i class="bi bi-trash"></i></a>
        </li>`;

    let modalCarrito = document.getElementById("list");
    modalCarrito.innerHTML += item;
}

function editarCantidad(item,id){
    let cantidad = parseInt(document.getElementById(item).value)
    car.find(elemento => elemento.id = id).cantidad = cantidad
    document.getElementById(item).value = cantidad

    localStorage.removeItem('carrito');
    localStorage.setItem("carrito",JSON.stringify(car))

    document.getElementById("list").innerHTML = ""
    car.forEach( elemnto => 
        {
            agregarItemAModal(elemnto.id, elemnto.descripcion, elemnto.cantidad, elemnto.precioUnitario)  
        }
    )
    let total = 
    `
    <li class="listItems">
        <div colspan="2"></div>
        <span class="restricion"> TOTAL </span>
        <span class="restricion">$${calcularTotal()} </span>
    </li>
    `
    let modalCarrito = document.getElementById("list");
    modalCarrito.innerHTML += total;

}

function eliminarItem(id){
    var newArray = car.filter((item) => item.id !== id);
    car = newArray

    localStorage.removeItem('carrito');
    localStorage.setItem("carrito",JSON.stringify(car))

    cantItems-= 1
    localStorage.setItem("cantItems",cantItems) 

    let spanCarrito = document.getElementById("itemsCar")
    spanCarrito.innerHTML = cantItems
    // agregar item visible a carrito
    document.getElementById("list").innerHTML = ""
    
    if(car.length!==0){
        car.forEach( elemnto => 
            {
                agregarItemAModal(elemnto.id, elemnto.descripcion, elemnto.cantidad, elemnto.precioUnitario)  
            }
        )
        let total = 
        `
        <li class="listItems">
            <div colspan="2"></div>
            <span class="restricion"> TOTAL </span>
            <span class="restricion">$${calcularTotal()} </span>
        </li>
        `
        let modalCarrito = document.getElementById("list");
        modalCarrito.innerHTML += total;
    }
    else{
        document.getElementById("list").innerHTML = "No se ha seleccionado ningun producto. 😢"
    }
}

const comentarios = document.getElementById("comentarios")
comentarios!==null ? comentarios.addEventListener('click', guardarComentario) : ""


function guardarComentario(){
    const email  = document.getElementById("email")
    const nombre  = document.getElementById("nombre")
    const mensaje  = document.getElementById("mensaje")

    if(email.value !== "" && nombre.value !== "" && mensaje.value !== ""){
        email.value = ""
        nombre.value = ""
        mensaje.value = ""
        Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado con exito',
            timer: 1500
        })
    }
    else{
        Swal.fire({
            icon: 'error',
            title: 'Atencion',
            text: 'Verifique que los campos esten completos'
          })
    }
}

function calcularTotal(){
    let total = 0;
    for( item in car){
        total += car[item].cantidad * car[item].precioUnitario;
    }
    return (total*monedaActual).toFixed(2);
}


//agregarItem(1, 15, 1000)
//agregarItem(2, 3, 980)
//agregarItem(3, 7, 560)

//elementoACargar()

//console.log("Total acumulado: "+  calcularTotal())
//console.log(monedaSeleccionada)

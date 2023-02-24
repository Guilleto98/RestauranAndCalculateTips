let cliente = {
    mesa: '',
    hora: '',
    pedido: []
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;


    // Revisar si hay campos vacios
    const camposVacios = [mesa, hora].some(campo => campo === '');

    if(camposVacios){

        //Verificar si ya hay una alerta
        const yetExistAlert = document.querySelector('.invalid-feedback')

        if(!yetExistAlert){
            const alerta = document.createElement('DIV')
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center')
            alerta.textContent = 'Todos los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(()=>{
                alerta.remove()
            }, 3000)
        }
        
        return;
    }


    // Asignar datos del cliente a la mesa 1
    cliente = {...cliente, mesa, hora}

    //Ocultar modal
    const modalFormulario = document.querySelector('#formulario')
    const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario)
    modalBoostrap.hide();

    //Mostrar secciones
    mostrarSecciones();

    //Obtener platillos de la API JSON-Server
    obtenerPlatillos();
}

function mostrarSecciones(){
    const seccionesOcultas = document.querySelectorAll('.d-none')
    seccionesOcultas.forEach(seccion => seccion.classList.remove('d-none'))
}

function obtenerPlatillos(){
    const url = 'http://localhost:4000/platillos'

    fetch(url)
        .then( response => response.json())
        .then( resultado => mostrarPlatillos(resultado))
        .catch( fail => console.log(fail))
}

function mostrarPlatillos(platillos){
    const contenido = document.querySelector('#platillos .contenido')
    platillos.forEach( platillo =>{
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');

        //Funcion que detecta la cantidad y el platillo que se esta agregando

        inputCantidad.onchange = function(){
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad})
        }

        const agregar = document.createElement('DIV')
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad)

        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    })

}

function agregarPlatillo(producto){

    //Extraer el pedido actual
    let { pedido } = cliente;
    
    //Revisar que la cantidad sea mayor a 0
        if(producto.cantidad > 0){

        //Comprueba si el elemento existe en el array
            if(pedido.some( articulo => articulo.id === producto.id)){
                //Si el articulo existe, actualizamos la cantidad
                const pedidoActualizado = pedido.map( articulo =>{
                    if(articulo.id === producto.id){
                        articulo.cantidad = producto.cantidad
                    }
                    return articulo
                });
                // Se asigna el nuevo array a cliente.pedido
                cliente.pedido = [...pedidoActualizado]
            }else{
                //Si el articulo no existe lo agregamos al array de peliculas
                cliente.pedido = [...pedido, producto]
            }
    
        }else{
            // Eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id)
        cliente.pedido = [...resultado]
        }

    // LIMPIAR EL CODIGO HTML PREVIO
    limpiarHtml()

    if(cliente.pedido.length){
        // MOSTRAR EL RESUMEN
        actualizarResumen()
    }else{
        mensajePedidoVacio();
    }
}

function limpiarHtml(){
    const contenido = document.querySelector('#resumen .contenido')

    while( contenido.firstChild ){
        contenido.removeChild( contenido.firstChild )
    }
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido')
    const resumen = document.createElement('DIV')
    resumen.classList.add('col-md-6', 'card', 'py-2','px-3', 'shadow')

    //Información de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //Información de la hora
    const hora = document.createElement('P');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaSpan = document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //Agregar a los elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platillos Consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const grupo = document.createElement('UL');
    grupo.classList.add('list-group')
    
    const {pedido} = cliente;
    pedido.forEach(articulo => {
        const {nombre, cantidad, precio, id} = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: '

        const canitdadValor = document.createElement('SPAN');
        canitdadValor.classList.add('fw-normal');
        canitdadValor.textContent = cantidad;

        //Precio del articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: '

        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$ ${precio}`;

        //Subtotal del articulo
        const subTotalEl = document.createElement('P');
        subTotalEl.classList.add('fw-bold');
        subTotalEl.textContent = 'Subtotal: '

        const subTotalElValor = document.createElement('SPAN');
        subTotalElValor.classList.add('fw-normal');
        subTotalElValor.textContent = calcularSubTotal(precio, cantidad);

        //Boton para eliminar
        const botonEliminar = document.createElement('BUTTON');
        botonEliminar.classList.add('btn', 'btn-danger');
        botonEliminar.textContent = 'Eliminar del pedido'

        //Funcion para eliminar el pedido
        botonEliminar.onclick = function(){
            eliminarProducto(id)
        }


        //Agregar valores a sus contenedores
        cantidadEl.appendChild(canitdadValor);
        precioEl.appendChild(precioValor);
        subTotalEl.appendChild(subTotalElValor);

        //Agregar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subTotalEl);
        lista.appendChild(botonEliminar);

        //Agregar lista al grupo principal
        grupo.appendChild(lista)
    })

    //Agregar resumen
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(grupo);

    //Mostrar formulario de propinas
    formularioPropinas();

    contenido.appendChild(resumen)
}

function calcularSubTotal(precio, cantidad){
    return `$ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const {pedido} = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id)
    cliente.pedido = [...resultado]
    
    // LIMPIAR EL CODIGO HTML PREVIO
    limpiarHtml()

    if(cliente.pedido.length){
        // MOSTRAR EL RESUMEN
        actualizarResumen()
    }else{
        mensajePedidoVacio();
    }

    //El producto se elimino, por lo tanto regresamos la cantidad del formulario a 0
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}


function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto = document.createElement('P');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos al pedido';

    contenido.appendChild(texto)
}

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');
    
    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divForm = document.createElement('DIV');
    divForm.classList.add('card', 'py-2', 'px-3', 'shadow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propina';

    //Radio Button 10%
    const radio10 = document.createElement('INPUT')
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropinas;

    const radio10Label = document.createElement('LABEL');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    //Agregar al div principal
    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //Radio Button 20%
    const radio20 = document.createElement('INPUT')
    radio20.type = 'radio';
    radio20.name = 'propina';
    radio20.value = '20';
    radio20.classList.add('form-check-input');
    radio20.onclick = calcularPropinas;

    const radio20Label = document.createElement('LABEL');
    radio20Label.textContent = '20%';
    radio20Label.classList.add('form-check-label');

    const radio20Div = document.createElement('DIV');
    radio20Div.classList.add('form-check');

    //Agregar al div principal
    radio20Div.appendChild(radio20);
    radio20Div.appendChild(radio20Label);

    //Radio Button 30%
    const radio30 = document.createElement('INPUT')
    radio30.type = 'radio';
    radio30.name = 'propina';
    radio30.value = '30';
    radio30.classList.add('form-check-input');
    radio30.onclick = calcularPropinas;

    const radio30Label = document.createElement('LABEL');
    radio30Label.textContent = '30%';
    radio30Label.classList.add('form-check-label');

    const radio30Div = document.createElement('DIV');
    radio30Div.classList.add('form-check');

    //Agregar al div principal
    radio30Div.appendChild(radio30);
    radio30Div.appendChild(radio30Label);

    divForm.appendChild(heading)
    //Agregarlo al formulario
    divForm.appendChild(radio10Div)
    divForm.appendChild(radio20Div)
    divForm.appendChild(radio30Div)
    formulario.appendChild(divForm)

    contenido.appendChild(formulario)

}

function calcularPropinas(){
    const {pedido} = cliente;
    let subTotal = 0;
    

    //Calcular subTotal a pagar
    pedido.forEach( articulo => {
        subTotal += articulo.cantidad * articulo.precio
    })

    //Seleccionar el radioButton de la propina seleccionada por el cliente
    const propinaSelecionada = document.querySelector('[name="propina"]:checked').value;

    const propina = ((subTotal * parseInt(propinaSelecionada)) / 100)

    const total = subTotal + propina


    mostrarTotalHTML(subTotal, total, propina)
}


function mostrarTotalHTML(subTotal, total, propina){

    const divTotales = document.createElement('DIV');
    divTotales.classList.add('total-pagar')


    // SubTotal
    const  subTotalParrafo = document.createElement('P');
    subTotalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    subTotalParrafo.textContent = 'Subtotal Consumo: ';

    const subTotalSpan = document.createElement('SPAN');
    subTotalSpan.classList.add('fw-normal');
    subTotalSpan.textContent = `$ ${subTotal}`;

    subTotalParrafo.appendChild(subTotalSpan);

    // Propina
    const  propinaParrafo = document.createElement('P');
    propinaParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    propinaParrafo.textContent = 'Propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$ ${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    // Total
    const  totalParrafo = document.createElement('P');
    totalParrafo.classList.add('fs-4', 'fw-bold', 'mt-2');
    totalParrafo.textContent = 'Total: ';

    const totalSpan = document.createElement('SPAN');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$ ${total}`;

    totalParrafo.appendChild(totalSpan);

    //Eliminar el ultimo total
    const totalPagarDiv = document.querySelector('.total-pagar');
    if(totalPagarDiv){
        totalPagarDiv.remove()
    }

    divTotales.appendChild(subTotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo)

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}

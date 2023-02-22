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
    const url = 'http://localhost:3000/platillos'

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

    // MOSTRAR EL RESUMEN
    actualizarResumen()
}

function actualizarResumen(){
    const contenido = document.querySelector('#resumen .contenido')
    const resumen = document.createElement('DIV')
    resumen.classList.add('col-md-6')

    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan = document.createElement('SPAN');
    mesaSpan.textContetn = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    mesa.appendChild(mesaSpan);

    contenido.appendChild(mesa);
}
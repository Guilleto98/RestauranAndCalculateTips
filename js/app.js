let cliente = {
    mesa: '',
    hora: '',
    pedido: []
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
        .then( resultado => console.log(resultado))
        .catch( fail => console.log(fail))
}
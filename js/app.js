//CONSTRUCTORES

//Va a tomar los tres campos del cuadro
function Seguro(marca,año,tipo){
    this.marca = marca;
    this.año = año;
    this.tipo = tipo;
}
//realiza cotizacion con los datos no utilizo arrayfunction xq debo acceder a los obj
Seguro.prototype.cotizarSeguro = function(){

    let cantidad;
    const base = 500;

    switch(this.marca){
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
    }
    
    //leer año
    const diferencia = new Date().getFullYear() - this.año;
    //cada año menor el auto es mas barato un 5%
    cantidad -= ((diferencia * 5) * cantidad) / 100;
    
    /* 
    si el seguro es basico se multiplica por un 30% mas 
    si el seguro es completo se multiplica por un 50% mas 
    */

    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    }else{
        cantidad *= 1.50;
    }

    return cantidad;
}
//El otro objeto a crear es la interfaz de usuario
function UI(){}

//Llena las opciones de los años y creamos el protoype
UI.prototype.llenarOpciones = ()  =>{
    const max = new Date().getFullYear(), //tomamos año actual
          min = max - 20; //hasta que año

//llenamos el select
    const selectYear = document.querySelector('#año');

//iteramos del año maximo al minimo
    for(let i = max; i > min; i--){
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
}


//Muestra alertas en pantallas
UI.prototype.mostrarMensaje = (mensaje,tipo) => {

    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto')
    }

    div.classList.add('mensaje' , 'mt-10');
    div.textContent = mensaje;

    //insertar html form
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.insertBefore(div, document.querySelector('#resultado'));

    //limpiar la alerta
    setTimeout(() => {
        div.remove();
    },2000);
}

UI.prototype.mostrarResultado = (total,seguro) => {

    const{marca,año,tipo} = seguro;

    let textoMarca;

    switch(marca){
        case '1':
            textoMarca = 'Americano';
            break;
            case '2':
            textoMarca = 'Asiatico';
            break;
            case '3':
            textoMarca = 'Europeo';
            break;
    }       

    //crear resultado
    const div = document.createElement('div');
    div.classList.add('mt-10');

    div.innerHTML = `
    <p class="header">Tu resumen</p>
    <p class="font-bold">Marca:<span class="font-normal">  ${textoMarca} </span> </p>
    <p class="font-bold">Año:<span class="font-normal">  ${año} </span> </p>
    <p class="font-bold">Tipo:<span class="font-normal capitalize">  ${tipo} </span> </p>
    <p class="font-bold">Total:<span class="font-normal"> $ ${total} </span> </p>
    
    `;

    const resultadoDiv = document.querySelector('#resultado');
    

    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() =>{
        spinner.style.display = 'none'; //se borra el spiner
        resultadoDiv.appendChild(div); //se muestra el resultado
    },2000);
    
}

//instanciar UI
const ui = new UI();


document.addEventListener('DOMContentLoaded', () =>{
    ui.llenarOpciones(); // Llena el select con los años
})


eventListener();
function eventListener(){
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e){

    e.preventDefault();
    //leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    //leer el año 
    const año = document.querySelector('#año').value;
    //leer la cobertura distinta estructura al ser un radiobutton
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    if(marca === ''|| año === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios' , 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...' , 'exito');

    //ocultar cotizaciones previs
    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

    //instanciar el seguro
    const seguro = new Seguro(marca,año,tipo);
    const total = seguro.cotizarSeguro();

    //utilizar el prototype que va a cotizar
    ui.mostrarResultado(total, seguro);
}
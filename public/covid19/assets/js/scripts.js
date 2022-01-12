//import que tiene la definicion de la funcion crearGrafico
import crearGraficoBarra from './init_grafico_barra.js'
import crearGraficoLinea from './init_grafico_linea.js'

//iife que lleva el flujo principal de la app

(async () => {
    //si el token esta en el localstorage, se muetra el menu de situacion chile
    //y se oculta el de logueo
if(localStorage.getItem('jwt-token')) {
    document.getElementById("ul-login").hidden = true
    document.getElementById("ul-logout").hidden = false
}
//Al formulario se le añade un event listener
document.getElementById("form-login").addEventListener("submit", async (evento) => {
    evento.preventDefault()
    //se utiliza el metodo getInstance de la clase de Bootstrap para en lazar el codigo JS con el formulario el html.
    const modal = bootstrap.Modal.getInstance(document.getElementById("modal-login"))
    try {
        //se llama a login() y se obtiene un objeto, el cual almacenamos en session
        const session = await login()
        //si la solicitud a la api es exitosa...
        if (session.status) {
            //limpiamos los campos del formulario
            document.getElementById("form-login").reset()
            //escondemos el modal
            modal.hide()
            //almacenamos en localstorage el token
            localStorage.setItem('jwt-token', session.body)
            //ocultamos la opcion de logear y mostramos la opcion de situacion chile y cerrar session
            document.getElementById("ul-login").hidden = true
            document.getElementById("ul-logout").hidden = false
        }
        //si a la api no se le entrego las credenciales correctas, desplegara un mensaje de error
        else {
            const msg = `<div class="alert alert-danger alert-dismissible" role="alert" id="liveAlert">
                            <i class="fas fa-exclamation-triangle me-3"></i>${session.body}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`
        
            document.getElementById("alert-msg").innerHTML = msg
    }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
    
})

//listener para cerrar sesion
document.getElementById("cerrar-sesion").addEventListener("click", () => {
    //limpiamos la localstorage
    localStorage.clear()
    //recargamos la pagina
    location.reload()
})

//listener para la opcion de situacion chile
document.getElementById("situacion-chile").addEventListener("click", async() => {
    //mostramos la animacion del preloader
    document.getElementById("preloader").hidden = false
    //mostramos el canvas del grafico de chile
    document.getElementById("grafico-chile").hidden = false
    //escondemos el grafico mundial y la tabla
    document.getElementById("grafico-paises").hidden = true
    document.getElementById("tabla-covid").hidden = true
    //cambiamos el encabezado de situacion mundial y lo reemplazamos con "situacion chile"
    document.getElementById("titulo-situacion").innerHTML = "Situación Chile"
    
    
    try {
        //solicitamos la info de los casos confirmados
        const responseConfirmados = await fetch("http://localhost:3000/api/confirmed", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
        }
        })
        //parseamos a json y almacenamos solo algunos casos para que el grafico pueda apreciarse mejor
        let confirmados = await responseConfirmados.json()
        confirmados = confirmados.data.filter((elemento, i) => i > 100 && i < 200)
        
        //lo mismo hacemos tanto para los muertos...
        const responseMuertos = await fetch("http://localhost:3000/api/deaths", {
        headers: {
                Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
            }
        })
        let muertos = await responseMuertos.json()
        muertos = muertos.data.filter((elemento, i) => i > 100 && i < 200)

        //...como para los recuperados
        const responseRecuperados = await fetch("http://localhost:3000/api/recovered", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt-token')}`
        }
        })
        let recuperados = await responseRecuperados.json()
        recuperados = recuperados.data.filter((elemento, i) => i > 100 && i < 200)

        //creamos el grafico con los datos proporcionados
        crearGraficoLinea(confirmados, muertos, recuperados, 'grafico-chile')
        //una vez que los datos fueron recibidos y el grafico construido, se puede ocultar el preloader
        document.getElementById("preloader").hidden = true
        } catch (error) {
        console.error(`Error: ${error}`)
    }
})

// variables que almacenan los respectivos objetos Chart que utiliza Chart.js
let graficaPrincipal
let graficaTabla
//aqui llamamos a la api con el método fetch
try {
    const response = await fetch('http://localhost:3000/api/total')
    let {data} = await response.json()
/*Debido a que la api no entrega datos de los casos activos  ni de los recuperados
 decidimos improvisar asignándole a dichos atributos un valor basado en una formula */
    data.forEach(pais => {
        pais.active = Math.floor((pais.confirmed - pais.deaths) * 0.3)
        pais.recovered = Math.floor((pais.confirmed - pais.deaths) * 0.7)
    })

/* Extra: retorna de forma similar al PDF de requerimientos los 1ero 10 países cuyo nombre no tenga un caracter espacio*/
    data = data.filter((pais, indice) => pais.active >= 10000 && indice < 10 && !pais.location.includes(' '))
    graficaPrincipal = crearGraficoBarra(data, 'grafico-paises', graficaPrincipal)

    tablaBodyCovid(data)
} catch (error) {
    console.error(`Error: ${error}`)
}

// Agregamos un listener a la tabla que maneja cuando se le hace click a los distintos enlaces (anchors)
const tabla = document.getElementById("tabla-covid")
tabla.addEventListener("click", async (evento) => {
    //como solo queremos registrar los click a los enlaces, verificamos que el target solo sean links (etiqueta "a")
    try {
        if(evento.target.nodeName === "A") {
            
            const pais = await fetch(`http://localhost:3000/api/countries/${evento.target.id}`)//[data.find(pais => pais.location === evento.target.id)]
            const {data} = await pais.json()
            data.active = Math.floor((data.confirmed - data.deaths) * 0.3)
            data.recovered = Math.floor((data.confirmed - data.deaths) * 0.7)
            graficaTabla = crearGraficoBarra([data], 'graficos-por-pais', graficaTabla)
    
            document.getElementById("nombre-title").innerHTML = data.location
            //crearGrafico(data,'mi-id',graficaTabla)
            
        }
    } catch (error) {
        console.error(`Error: ${error}`)
    }
})
})()

//Funcion que despliega los datos en la tabla principal
const tablaBodyCovid = (datos) => {
    datos.forEach((fila, indice) => {
        document.getElementById('body-tabla-covid').innerHTML += `<tr>
                                                                    <td>${indice + 1}</td>
                                                                    <td>${fila.location}</td>
                                                                    <td>${fila.active}</td>
                                                                    <td>${fila.confirmed}</td>
                                                                    <td>${fila.deaths}</td>
                                                                    <td>${fila.recovered}</td>                                                                    
                                                                    <td><i class="fas fa-chart-bar"></i><a class='btn btn-secondary ms-3' data-bs-toggle="modal" href='#modal' id='${fila.location}'>Ver Detalle</a></td>
                                                                </tr>`
    })
}

//funcion login
const login = async() => {
    try {
        //guardamos los campos de formulario
        const email = document.getElementById("correo").value
        const password = document.getElementById("clave").value
        //enviamos una solicitud POST con las credenciales otorgadas por el usuario en el cuerpo del request
        const response = await fetch("http://localhost:3000/api/login", 
        {
            method: 'POST',
            //parseamos a JSON
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        //dependiendo de si las credenciales son correctas o no, recibiremos o el token jwt, o un mensaje de error
        const {token, message} = await response.json()
        //si es el token devolvemos este junto a un parametro true
        if (token) {
            return {status: true, body: token}
        }
        //sino pasamos el mensaje junto a un parametro false
        else if(message) {
            return {status: false, body: message}
        }
        
    } catch (error) {
        console.error(`Error: ${error}`)
    }
}




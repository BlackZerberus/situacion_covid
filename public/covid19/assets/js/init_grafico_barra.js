/* Definicion de funcion encargada de generar un grafico, para esto
se utiliza la libreria chart.js en la cual se solicitan 3 parametros:
1. el primero es datos el cual recibe un arreglo con los datos a desplegar
2. El segundo es canvasid el cual recibe una cadena con el id del elemento canvas a dibujar 
3. El tercero es un objeto de tipo Chart el cual le indica a la funcion si debe crearla de 0 o 
volver a crear el grafico */

const crearGraficoBarra = (datos, canvasid, objectChart) => {  
    const labels = datos.map(pais => pais.location)
    const data = {
      labels: labels,
      // Utilización de múltiples datasets, uno por cada tipo de dato
      datasets: [{ 
        label: 'Casos activos',
        data: datos.map(casos => casos.active),
        backgroundColor: [
          '#FC6386',
        ],
        borderColor: [
          '#FC6386',
        ],
        borderWidth: 1
      },
      {
        label: 'Casos Confirmados',
        data: datos.map(casos => casos.confirmed),
        backgroundColor: [
          '#FDD051',
        ],
        borderColor: [
          '#FDD051',
        ],
        borderWidth: 1
      },
      {
        label: 'Casos muertos',
        data: datos.map(casos => casos.deaths),
        backgroundColor: [
          '#CACCCF',
        ],
        borderColor: [
          '#CACCCF',
        ],
        borderWidth: 1
      },
      {
        label: 'Casos recuperados',
        data: datos.map(casos => casos.recovered),
        backgroundColor: [
          '#4BC0C2',
        ],
        borderColor: [
          '#4BC0C2',
        ],
        borderWidth: 1
      }]
    };
    
    const config = {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        },
      };   
    // En el caso de que exista una instancia de chart, primeo destruimos esta y luego volvemos a crear una nueva.
    // y sino se crea una nueva instancia desde cero.
    if(objectChart){
        objectChart.destroy()
        objectChart = new Chart(
            document.getElementById(canvasid),
            config
        );
    }else {
        objectChart = new Chart(
            document.getElementById(canvasid),
            config
        );
    }
    //finalmente, retornara la ultima instancia del objeto Chart creado.
    return objectChart
}

// Exportamos el codigo esta función a ser utilizada en el script principal (el cual tiene dependencia de esta función/script)
    export default crearGraficoBarra
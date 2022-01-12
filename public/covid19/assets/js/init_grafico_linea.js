/* Definicion de funcion encargada de generar un grafico, para esto
se utiliza la libreria chart.js en la cual se solicitan 5 parametros:
1. el primero es confirmados el cual recibe un arreglo con los casos confirmados a desplegar
2. el segundo es muertes el cual recibe un arreglo con los casos de muertes a desplegar
3. el tercero es recuperados el cual recibe un arreglo con los casos recuperados a desplegar
4. El cuarto es canvasid el cual recibe una cadena con el id del elemento canvas a dibujar 
5. El quinto es un objeto de tipo Chart el cual le indica a la funcion si debe crearla de 0 o 
volver a crear el grafico */
const crearGraficoLinea = (confirmados, muertes, recuperados, canvasid, objectChart) => {  
    const labels = confirmados.map(confirmados => confirmados.date)
    const data = {
      labels: labels,
      // Utilización de múltiples datasets, uno por cada tipo de dato
      datasets: [{ 
        label: 'Confirmados',
        data: confirmados.map(fecha => fecha.total),
        fill: false,
        tension: 0.1,
        backgroundColor: [
          '#FDD051',
        ],
        borderColor: [
          '#FDD051',
        ]
      },
      {
        label: 'Muertos',
        data: muertes.map(fecha => fecha.total),
        fill: false,
        tension: 0.1,
        backgroundColor: [
            '#CACCCF',
        ],
        borderColor: [
            '#CACCCF',
        ],
      },
      {
        label: 'Recuperados',
        data: recuperados.map(fecha => fecha.total),
        fill: false,
        tension: 0.1,
        backgroundColor: [
          '#4BC0C2',
        ],
        borderColor: [
          '#4BC0C2',
        ],
      }
      ]
    };
    
    const config = {
        type: 'line',
        data: data,
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

export default crearGraficoLinea
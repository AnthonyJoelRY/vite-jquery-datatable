import './style.css';
import DataTable from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';

const API_URL = "https://gist.githubusercontent.com/emamut/6626d3dff58598b624a1/raw/166183f4520c4603987c55498df8d2983703c316/provincias.json"

async function cargarDatos() {
  try {
    const respuesta = await fetch(API_URL);

    if (!respuesta.ok) {
      throw new Error('Error al consumir la API');
    }

    const json = await respuesta.json();

    // Transformar el objeto anidado en array plano
    const datos = [];
    for (const idProv in json) {
      const prov = json[idProv];
      for (const idCanton in prov.cantones) {
        const canton = prov.cantones[idCanton];
        for (const idParroquia in canton.parroquias) {
          datos.push({
            provincia: prov.provincia,
            canton: canton.canton,
            parroquia: canton.parroquias[idParroquia]
          });
        }
      }
    }

    new DataTable('#tabla-posts', {
      data: datos,
      columns: [
        { data: 'provincia' },
        { data: 'canton' },
        { data: 'parroquia' }
      ],
      pageLength: 10,
      language: {
        search: 'Buscar:',
        lengthMenu: 'Mostrar _MENU_ registros',
        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        paginate: {
          previous: 'Anterior',
          next: 'Siguiente'
        }
      }
    });
  } catch (error) {
    console.error(error);
    document.querySelector('#app').innerHTML += `
      <p class="error">No se pudieron cargar los datos.</p>
    `;
  }
}

cargarDatos();

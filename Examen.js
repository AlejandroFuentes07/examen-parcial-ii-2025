const readline = require("readline")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const fs = require('fs');


// Array para almacenar el catálogo de libros
let catalogo = [];

// Cargar catálogo desde archivo si existe
function cargarCatalogo() {
  try {
    const data = fs.readFileSync('catalogo.json', 'utf8');
    catalogo = JSON.parse(data);
    console.log('Catálogo cargado correctamente.'.green);
  } catch (err) {
    console.log('No se encontró un catálogo existente. Creando uno nuevo.'.yellow);
  }
}

// Guardar catálogo en archivo
function guardarCatalogo() {
  fs.writeFileSync('catalogo.json', JSON.stringify(catalogo, null, 2));
  console.log('Catálogo guardado correctamente.'.green);
}

// Función para mostrar el menú
function mostrarMenu() {
  console.log('\n=== MENÚ PRINCIPAL ==='.rainbow);
  console.log('1. Agregar libro'.cyan);
  console.log('2. Mostrar catálogo'.cyan);
  console.log('3. Buscar libro por título'.cyan);
  console.log('4. Eliminar libro'.cyan);
  console.log('5. Ver estadísticas'.cyan);
  console.log('6. Ordenar libros'.cyan);
  console.log('7. Editar libro'.cyan);
  console.log('8. Filtrar libros por autor'.cyan);
  console.log('9. Salir'.red);
  console.log('======================'.rainbow);
}

// Función para agregar un libro
function agregarLibro() {
  console.log('\n=== AGREGAR LIBRO ==='.blue);
  
  const titulo =rl.question('Ingrese el título del libro: ');
  const autor = rl.question('Ingrese el autor del libro: ');
  
  let precio;
  while (isNaN(precio) || precio <= 0) {
    precio = parseFloat(rl.question('Ingrese el precio del libro (debe ser un número positivo): '));
    if (isNaN(precio) || precio <= 0) {
      console.log('Precio inválido. Intente nuevamente.'.red);
    }
  }
  
  let anio;
  while (isNaN(anio) || anio <= 0) {
    anio = parseInt(rl.question('Ingrese el año de publicación: '));
    if (isNaN(anio) || anio <= 0) {
      console.log('Año inválido. Intente nuevamente.'.red);
    }
  }
  
  const nuevoLibro = {
    titulo,
    autor,
    precio,
    anio
  };
  
  catalogo.push(nuevoLibro);
  guardarCatalogo();
  console.log(`Libro "${titulo}" agregado correctamente.`.green);
}

// Función para mostrar el catálogo
function mostrarCatalogo() {
  console.log('\n=== CATÁLOGO DE LIBROS ==='.blue);
  
  if (catalogo.length === 0) {
    console.log('No hay libros en el catálogo.'.yellow);
    return;
  }
  
  catalogo.forEach((libro, index) => {
    console.log(`\nLibro #${index + 1}`.bold);
    console.log(`Título: ${libro.titulo}`);
    console.log(`Autor: ${libro.autor}`);
    console.log(`Precio: $${libro.precio.toFixed(2)}`);
    console.log(`Año de publicación: ${libro.anio}`);
  });
}

// Función para buscar libro por título
function buscarPorTitulo() {
  console.log('\n=== BUSCAR LIBRO POR TÍTULO ==='.blue);
  const tituloBuscado = rl.question('Ingrese el título del libro a buscar: ');
  
  const libroEncontrado = catalogo.find(libro => 
    libro.titulo.toLowerCase().includes(tituloBuscado.toLowerCase())
  );
  
  if (libroEncontrado) {
    console.log('\nLibro encontrado:'.green);
    console.log(`Título: ${libroEncontrado.titulo}`);
    console.log(`Autor: ${libroEncontrado.autor}`);
    console.log(`Precio: $${libroEncontrado.precio.toFixed(2)}`);
    console.log(`Año de publicación: ${libroEncontrado.anio}`);
  } else {
    console.log('Libro no encontrado.'.red);
  }
}

// Función para eliminar un libro
function eliminarLibro() {
  console.log('\n=== ELIMINAR LIBRO ==='.blue);
  const tituloBuscado = rl.question('Ingrese el título del libro a eliminar: ');
  
  const indice = catalogo.findIndex(libro => 
    libro.titulo.toLowerCase() === tituloBuscado.toLowerCase()
  );
  
  if (indice !== -1) {
    catalogo.splice(indice, 1);
    guardarCatalogo();
    console.log(`Libro "${tituloBuscado}" eliminado correctamente.`.green);
  } else {
    console.log('Libro no encontrado.'.red);
  }
}

// Función para mostrar estadísticas
function mostrarEstadisticas() {
  console.log('\n=== ESTADÍSTICAS ==='.blue);
  
  if (catalogo.length === 0) {
    console.log('No hay libros en el catálogo para mostrar estadísticas.'.yellow);
    return;
  }
  
  // Cantidad total de libros
  console.log(`Cantidad total de libros: ${catalogo.length}`.bold);
  
  // Precio promedio
  const totalPrecios = catalogo.reduce((sum, libro) => sum + libro.precio, 0);
  const promedio = totalPrecios / catalogo.length;
  console.log(`Precio promedio: $${promedio.toFixed(2)}`.bold);
  
  // Libro más antiguo
  const libroMasAntiguo = catalogo.reduce((antiguo, actual) => 
    actual.anio < antiguo.anio ? actual : antiguo
  );
  console.log(`Libro más antiguo: "${libroMasAntiguo.titulo}" (${libroMasAntiguo.anio})`.bold);
  
  // Libro más caro
  const libroMasCaro = catalogo.reduce((caro, actual) => 
    actual.precio > caro.precio ? actual : caro
  );
  console.log(`Libro más caro: "${libroMasCaro.titulo}" ($${libroMasCaro.precio.toFixed(2)})`.bold);
}

// Función para ordenar libros
function ordenarLibros() {
  console.log('\n=== ORDENAR LIBROS ==='.blue);
  console.log('1. Por precio (ascendente)');
  console.log('2. Por precio (descendente)');
  console.log('3. Por año de publicación');
  
  const opcion = parseInt(rl.question('Seleccione una opción de ordenamiento: '));
  
  switch (opcion) {
    case 1:
      catalogo.sort((a, b) => a.precio - b.precio);
      console.log('Libros ordenados por precio (ascendente).'.green);
      break;
    case 2:
      catalogo.sort((a, b) => b.precio - a.precio);
      console.log('Libros ordenados por precio (descendente).'.green);
      break;
    case 3:
      catalogo.sort((a, b) => a.anio - b.anio);
      console.log('Libros ordenados por año de publicación.'.green);
      break;
    default:
      console.log('Opción inválida. No se realizó ningún ordenamiento.'.red);
      return;
  }
  
  mostrarCatalogo();
}

// Función para editar un libro
function editarLibro() {
  console.log('\n=== EDITAR LIBRO ==='.blue);
  const tituloBuscado = rl.question('Ingrese el título del libro a editar: ');
  
  const libro = catalogo.find(libro => 
    libro.titulo.toLowerCase() === tituloBuscado.toLowerCase()
  );
  
  if (!libro) {
    console.log('Libro no encontrado.'.red);
    return;
  }
  
  console.log('\nDeje en blanco los campos que no desea modificar.');
  
  const nuevoTitulo = rl.question(`Título actual: ${libro.titulo}\nNuevo título: `);
  if (nuevoTitulo) libro.titulo = nuevoTitulo;
  
  const nuevoAutor = rl.question(`Autor actual: ${libro.autor}\nNuevo autor: `);
  if (nuevoAutor) libro.autor = nuevoAutor;
  
  let nuevoPrecio = rl.question(`Precio actual: ${libro.precio}\nNuevo precio: `);
  if (nuevoPrecio) {
    nuevoPrecio = parseFloat(nuevoPrecio);
    if (!isNaN(nuevoPrecio) && nuevoPrecio > 0) {
      libro.precio = nuevoPrecio;
    } else {
      console.log('Precio inválido. Se mantiene el precio actual.'.red);
    }
  }
  
  let nuevoAnio = rl.question(`Año actual: ${libro.anio}\nNuevo año: `);
  if (nuevoAnio) {
    nuevoAnio = parseInt(nuevoAnio);
    if (!isNaN(nuevoAnio) && nuevoAnio > 0) {
      libro.anio = nuevoAnio;
    } else {
      console.log('Año inválido. Se mantiene el año actual.'.red);
    }
  }
  
  guardarCatalogo();
  console.log('Libro editado correctamente.'.green);
}

// Función para filtrar libros por autor
function filtrarPorAutor() {
  console.log('\n=== FILTRAR LIBROS POR AUTOR ==='.blue);
  const autorBuscado = rl.question('Ingrese el nombre del autor: ');
  
  const librosAutor = catalogo.filter(libro => 
    libro.autor.toLowerCase().includes(autorBuscado.toLowerCase())
  );
  
  if (librosAutor.length === 0) {
    console.log('No se encontraron libros de ese autor.'.red);
    return;
  }
  
  console.log(`\nLibros de ${autorBuscado}:`.green);
  librosAutor.forEach((libro, index) => {
    console.log(`\nLibro #${index + 1}`.bold);
    console.log(`Título: ${libro.titulo}`);
    console.log(`Precio: $${libro.precio.toFixed(2)}`);
    console.log(`Año de publicación: ${libro.anio}`);
  });
}

// Función para simular rl.question en consola

// Función principal
function main() {
  cargarCatalogo();
  
  let opcion = 0;
  do {
    mostrarMenu();
    opcion = parseInt(rl.question('Seleccione una opción: '));
    
    switch (opcion) {
      case 1:
        agregarLibro();
        break;
      case 2:
        mostrarCatalogo();
        break;
      case 3:
        buscarPorTitulo();
        break;
      case 4:
        eliminarLibro();
        break;
      case 5:
        mostrarEstadisticas();
        break;
      case 6:
        ordenarLibros();
        break;
      case 7:
        editarLibro();
        break;
      case 8:
        filtrarPorAutor();
        break;
      case 9:
        console.log('Saliendo del sistema...'.yellow);
        break;
      default:
        console.log('Opción inválida. Intente nuevamente.'.red);
    }
  } while (opcion !== 9);
}

// Iniciar el programa
main();
const departamento = require('./scrap/categorias');
const producto = require('./scrap/productos');
const datos_categoria = require('./datos/categorias.js');
const run = require('./datos/base_datos/mongo_atlas.js');
var fs = require('fs');
const path = require('path');

var all_productos = [];


(async () => {
    var categorias = await departamento(datos_categoria.urlBase, datos_categoria.xpath, datos_categoria.categorias, datos_categoria.subcategoria, datos_categoria.volver);
    console.log(categorias);
    for (const element of categorias) {
        var nombre_subcategoria = element.nombre;
        if (nombre_subcategoria == "Tecno" || nombre_subcategoria == 'electroElectro' || nombre_subcategoria == 'mueblesMuebles') {
            for (const subcategoria of element.subcategorias) {
                var productos = [];
                /////////////////// Obtener productos de la subcategoria //////////////////////
                console.log("///////////////////////////////////////////////////" + subcategoria.nombre + "///////////////////////////////////////////////////////////////");
                productos = await producto(subcategoria.url, subcategoria.nombre, nombre_subcategoria);
                console.log('///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////');
                all_productos.push(...productos);
                // break;
            }
        }
    };
    ///////////////////////////////////////// Envio los Productos  a JSON /////////////////////////////////////////////////////////////
    /*   var productos_file = JSON.stringify(all_productos);
      var productos_ruta = path.join(__dirname, './datos/src/json/subcategorias.json');
      fs.writeFileSync(productos_ruta, productos_file); */
    console.log('Finaliza el scraping');
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    run(all_productos);
})();
const departamento = require('./scrap/categorias');
const producto = require('./scrap/productos');
const datos_categoria = require('./datos/categorias.js');
const run = require('./datos/base_datos/mongo_atlas.js');
let fs = require('fs');

let all_productos = [];


(async () => {
    let categorias = await departamento(datos_categoria.urlBase, datos_categoria.xpath, datos_categoria.categorias, datos_categoria.subcategoria, datos_categoria.volver);
    console.log(categorias);
    for (const element of categorias) {
        let nombre_subcategoria = element.nombre;
        if (nombre_subcategoria == "Tecno" || nombre_subcategoria == 'electroElectro' || nombre_subcategoria == 'mueblesMuebles') {
            for (const subcategoria of element.subcategorias) {
                let productos = [];
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

    console.log('Finaliza el scraping');
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    run(all_productos);
})();
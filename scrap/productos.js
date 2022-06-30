const playwright = require('playwright');
const fetch = require('node-fetch');

async function scraping_productos(urlBase, seccion, categoria) {
    let producto = [];
    let finalizado = false;
    const hoy = new Date(Date.now());
    var url_nueva = urlBase.split('?')[0] + '?';
    var fetch_url = url_nueva;
    if (seccion.toLowerCase() == 'celulares' || seccion.toLowerCase() == 'computación') {
        fetch_url = fetch_url + 'facet=Condición%20de%20producto%3ANuevo&s=mdco';
    } else if (seccion.toLowerCase() == 'mundo gamer') {
        fetch_url = fetch_url + 'facet%5B0%5D=Tipo%20de%20producto%3AConsola&facet%5B1%5D=Tipo%20de%20producto%3APC&s=mdco';
    } else if (seccion.toLowerCase() == 'fotografía y video') {
        fetch_url = fetch_url + 'facet%5B0%5D=Tipo%20de%20producto%3AMultifuncional&facet%5B1%5D=Tipo%20de%20producto%3ADron&facet%5B2%5D=Tipo%20de%20producto%3ACámara%20Instantánea&facet%5B3%5D=Tipo%20de%20producto%3ACámara%20de%20Vídeo%20Deportiva&s=mdco';
    } else if (seccion.toLowerCase() == 'smartwatches y smartbands') {
        fetch_url = fetch_url + 'facet=Precio%3A%24206.288%20-%20%24949.990&s=mdco';
    } else if (seccion.toLowerCase() == 'televisión') {
        fetch_url = fetch_url + 'facet=Precio%3A%24204.290%20-%20%245.199.990&s=mdco';
    } else if (seccion.toLowerCase() == 'audio y música') {
        fetch_url = fetch_url + 'facet=Precio%3A%24286.299%20-%20%244.599.990&s=mdco';
    } else if (seccion.toLowerCase() == 'computación gamer') {
        fetch_url = fetch_url + 'facet=Precio%3A%24221.260%20-%20%249.999.990&s=mdco';
    } else if (seccion.toLowerCase() == 'marcas destacadas') {
        fetch_url = fetch_url + 'facet=Precio%3A%24230.229%20-%20%244.039.991&s=mdco';
    } else if (seccion.toLowerCase() == 'climatización') {
        fetch_url = fetch_url + 'facet=Precio%3A%24216.551%20-%20%241.445.990&s=mdco';
    } else if (seccion.toLowerCase() == 'aseo') {
        fetch_url = fetch_url + 'facet=Precio%3A%24191.588%20-%20%241.149.990&s=mdco';
    } else if (seccion.toLowerCase() == 'cocina') {
        fetch_url = fetch_url + 'facet=Precio%3A%24295.709%20-%20%243.329.990&s=mdco';
    } else if (seccion.toLowerCase() == 'electrodomésticos') {
        fetch_url = fetch_url + 'facet=Precio%3A%24147.029%20-%20%241.489.990&s=mdco';
    } else if (seccion.toLowerCase() == 'costura y bordado') {
        fetch_url = fetch_url + 'facet=Precio%3A%24332.680%20-%20%2414.990.000&s=mdco';
    } else if (seccion.toLowerCase() == 'salud y bienestar') {
        fetch_url = fetch_url + 'facet=Precio%3A%24210.988%20-%20%24999.990&s=mdco';
    } else if (seccion.toLowerCase() == 'comercial e industrial') {
        fetch_url = fetch_url + 'facet=Precio%3A%24248.597%20-%20%247.198.442&s=mdco';
    } else if (seccion.toLowerCase() == 'living y sala de estar') {
        fetch_url = fetch_url + 'facet=Precio%3A%24262.389%20-%20%244.199.990&s=mdco';
    } else if (seccion.toLowerCase() == 'comedor y cocina') {
        fetch_url = fetch_url + 'facet=Precio%3A%24262.389%20-%20%244.199.990&s=mdco';
    } else if (seccion.toLowerCase() == 'cocina y comedor') {
        fetch_url = fetch_url + 'facet=Precio%3A%24262.389%20-%20%244.199.990&s=mdco';
    } else {
        fetch_url = fetch_url + 'facet=Precio%3A%24262.389%20-%20%244.199.990&s=mdco';
    }
    var url_paginacion = '';
    while (!finalizado) {
        try {
            const result = await fetch(fetch_url + url_paginacion, {
                "referrerPolicy": "no-referrer-when-downgrade",
                "body": null,
                "method": "GET",
            }).then(response => response.text()).then(data => {
                const result_data = data.match(/(\{"\@context".+?\n)/gi);
                const result_data_json = JSON.parse(result_data[0]);
                var next_url = data.match(/<a href="([a-z0-9A-Z\ñ\Ñ\á\é\í\ó\ú\Á\É\Í\Ó\Ú\?&;=%\.\-]+?)"><span aria-hidden="true">»/gi)[0];
                next_url = '&' + next_url.split('mdco&amp;')[1].split('">')[0]
                return [result_data_json, next_url];
            });
            url_paginacion = result[1];
            for (let i = 0; i < result[0].itemListElement.length; i++) {
                producto.push({
                    categoria: categoria,
                    subcategoria: seccion,
                    nombre: result[0].itemListElement[i].item.name,
                    promedio: 0,
                    porcentaje_desvio: 0,
                    precio_actual: result[0].itemListElement[i].item.offers.price,
                    precio: [{
                        monto: result[0].itemListElement[i].item.offers.price,
                        dia: `${hoy.toLocaleDateString()}`,
                        hora: `${hoy.toLocaleTimeString()}`
                    }],
                    url: 'https://simple.ripley.cl/' + result[0].itemListElement[i].item.name.replace(/ /gi, '-').replace(/\//gi, '').replace(/á/gi, "a").replace(/é/gi, "e").replace(/í/gi, "i").replace(/ó/gi, "o").replace(/ú/gi, "u").replace(/ñ/gi, "n").toLowerCase() + '-' + result[0].itemListElement[i].item.sku,
                    id: result[0].itemListElement[i].item.sku,
                    imagen: result[0].itemListElement[i].item.image.split('//')[1],
                    marca: result[0].itemListElement[i].item.brand,
                });
            }
        } catch (error) {
            finalizado = true;
        }
    }
    return producto;
}
module.exports = scraping_productos;
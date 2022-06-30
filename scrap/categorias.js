const playwright = require('playwright');

async function scraping_categorias(urlBase, xpath, categorias, subcategoria, volver) {

    let categorias_listada = [];
    let categorias_obtenidas = [];
    let subcategorias_listada = [];
    let subcategorias_obtenidas = [];


    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext({ ignoreHTTPSErrors: true });

    const page = await context.newPage();
    await page.goto(`${urlBase}`, { timeout: 0, waitUntil: 'domcontentloaded' });

    /////////////////////////////////// Abrimos el menu de categorias ////////////////////////////
    await page.click(xpath);
    ////////////////////////////////// Cargamos las categorias ///////////////////////////////////
    categorias_listada = await page.$$(categorias);
    ///////////////////////////////// Recorrmos las categorias //////////////////////////////////
    for (const categoria of categorias_listada) {
        subcategorias_obtenidas = [];
        //////////////////////////////// Guardamos el nombre de la categoria //////////////////////////
        let categoria_nombre = await categoria.innerText();
        categorias_obtenidas.push({
            nombre: categoria_nombre,
            subcategorias: []
        });
        /////////////////////////////// Abrimos la categoria //////////////////////////////////////////
        await categoria.click();
        /////////////////////////////// Cargamos las subcategorias ////////////////////////////////////
        subcategorias_listada = await page.$$(subcategoria);
        ////////////////////////////// Recorremos las subcategorias ///////////////////////////////////
        for (const element of subcategorias_listada) {
            /////////////////////////////// Guardamos el nombre y url de la subcategoria //////////////////////
            let subcategoria_name = await element.innerText();
            let subcategoria_url = await element.getAttribute('href');
            /////// eliminar el primer caracter de subcategoria_url ////////
            subcategoria_url = subcategoria_url.substring(1);
            subcategorias_obtenidas.push({
                nombre: subcategoria_name,
                url: urlBase + subcategoria_url
            });

        }
        ///////////////////////////////// Agregamos subcategorias a la categoria //////////////////////////////
        categorias_obtenidas[categorias_obtenidas.length - 1].subcategorias = subcategorias_obtenidas;
        console.log(categorias_obtenidas);
        /////////////////////////////////// Click en volver /////////////////////////////////////////////////
        await page.click(volver);
        if (categorias_obtenidas.length == categorias_listada.length - 1) {
            break;
        }
    }



    await browser.close();
    return categorias_obtenidas;

}

module.exports = scraping_categorias;
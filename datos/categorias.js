const categorias =
{
    nombre: 'ripley',
    urlBase: 'https://simple.ripley.cl/',
    xpath: "//header[@id='ripley-sticky-header']//a[@title='Menú de categorias']",
    categorias: "//section[@class='tree-node-section']/div[@class='tree-node-items']/a",
    subcategoria: '//ul[@class="category-tree__expanded-category"]/li/a',
    volver: "//a[@class='tree-node-back-button']"
};


module.exports = categorias;
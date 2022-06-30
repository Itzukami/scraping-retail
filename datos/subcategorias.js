const subcategorias =
{
    next: "//div[@class='catalog-page__footer-pagination']//ul[@class='pagination']/li/a",
    marcas: "//div[@class='catalog-container']/div//div[@class='brand-logo']/span",
    nombre: "//div[@class='catalog-container']/div//div[@class='catalog-product-details__name']",
    /// ultimo valor de la lista
    precio: "//div[@class='catalog-container']/div//div[@class='catalog-prices']/ul",
    url: "//div[@class='catalog-container']/div//a",
    id_producto: "//div[@class='catalog-container']/div//a",
    image: "//div[@class='catalog-container']//a//div[@class='images-preview is-pristine'] | //div[@class='catalog-container']//a//div[@class='images-preview is-playing']"

};


module.exports = subcategorias;
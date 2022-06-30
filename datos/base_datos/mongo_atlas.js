const MongoClient = require('mongodb').MongoClient;
const url_string = require('./string_connect.js');
const url = url_string.url;




function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

async function detect(doc, documentos) {
    var updates = [];
    console.log('------- Detect --------');
    //////////////////////////////////////////////////////////// Get all Ids in the document ////////////////////////////////////////////////////////////
    // eliminar los duplicados de los documentos
    var uniqueArray = removeDuplicates(documentos, "id");
    const ids_productos = uniqueArray.map(producto => {
        return producto.id;
    });
    //console.log(ids_productos);
    //////////////////////////////////////////////////////////// Get all Ids in the mongo ////////////////////////////////////////////////////////////
    var ids_existentes = await doc.find({ id: { $in: ids_productos } }).toArray();
    console.log('EXISTENTES : ==>   ' + ids_existentes.length);


    //////////////////////////////////////////////////////////// Get all New Ids  ////////////////////////////////////////////////////////////
    var productos_no_existentes = uniqueArray.filter(documento => {
        return !ids_existentes.some(id_existente => {
            return id_existente.id == documento.id || id_existente.url == documento.url;
        });
    });

    console.log('NO EXISTENTES : ==>    ' + productos_no_existentes.length);

    //////////////////////////////////////////////////////////// Insert all New Ids  ////////////////////////////////////////////////////////////
    if (ids_existentes.length == 0) {
        const ids_insertados = await doc.insertMany(uniqueArray);
        console.log(ids_insertados);
    } else {
        /////////////////////////////////////////////////// Insert New Ids ///////////////////////////////////////////////////
        if (productos_no_existentes.length > 0) {
            //////////////////ingreso de los no existentes
            const ids_insertados = await doc.insertMany(productos_no_existentes);
            console.log('NUEVOS INSERTADOS : ==>   ' + ids_insertados.length);
        }
        /////////////////////////////////////////////////// Update Existing Ids ///////////////////////////////////////////////////

        if (ids_existentes.length > 0) {
            // por id y nombre encontar en documento los precios de ids_existentes
            const items_nuevos = uniqueArray.filter(documento => {
                return ids_existentes.some(id_existente => {
                    return id_existente.id == documento.id || id_existente.url == documento.url;
                });
            });
            // añadir los precios de id_existentes a items_nuevos por id
            for (var i = 0; i < ids_existentes.length; i++) {
                for (var j = 0; j < items_nuevos.length; j++) {
                    if (ids_existentes[i].id == items_nuevos[j].id && ids_existentes[i].url == items_nuevos[j].url) {
                        items_nuevos[j].precio_old = ids_existentes[i].precio;
                    }
                }
            }
            for (let i = 0; i < items_nuevos.length; i++) {
                if (i == 2261) {
                    console.log('Aca esta ' + items_nuevos[i].id);
                }
                var precios_promediar = [];
                var promedio = 0;
                var porcentaje_des = 0;
                console.log('indice: ' + i);
                // si items_nuevos[i].precio_cold es null, no se actualiza
                if (items_nuevos[i].precio_old != null) {
                    if (items_nuevos[i].precio_old.length > 0) {
                        items_nuevos[i].precio_old.map(function (item) {
                            precios_promediar.push(item.monto);
                        });
                        promedio = ArrayAvg(precios_promediar);
                        porcentaje_des = ((items_nuevos[i].precio[0].monto / promedio) - 1) * 100;
                    }
                }
                updates.push({
                    'updateOne': {
                        'filter': { "id": items_nuevos[i].id },
                        'update': { $push: { "precio": items_nuevos[i].precio[0] }, $set: { "promedio": promedio, "porcentaje_desvio": porcentaje_des, "precio_actual": items_nuevos[i].precio[0].monto } }
                    }
                });
            }
        }
    }
    return updates;
}


async function bulkWrite(doc, updates) {
    console.log('------- bulkWrite --------');
    await doc.bulkWrite(updates);
    console.log('------- bulkWrite finalizado--------');
}

function ArrayAvg(myArray) {
    var i = 0, summ = 0, ArrayLen = myArray.length;
    while (i < ArrayLen) {
        summ = summ + parseInt(myArray[i++]);
    }
    return summ / ArrayLen;
}



async function run(documentos) {
    const mongo = await MongoClient.connect(url, { useNewUrlParser: true });
    const db = mongo.db("retail");
    const doc = await db.collection('testt');
    // eliminar contenido de la coleccion
    //await doc.deleteMany({});
    console.log('------- Documentos a procesar -------->  ' + documentos.length);
    const update_existent = await detect(doc, documentos);
    console.log('------- Documentos en cola de carga -------->  ' + update_existent.length);
    if (update_existent.length > 0) {
        await bulkWrite(doc, update_existent);
    }

    await mongo.close()
    console.log('------- Fin de la carga a MongoDB --------');
}







module.exports = run;
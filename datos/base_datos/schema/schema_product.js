const { Schema, model } = require("mongoose");

// Segenera el esquema base
const SCHEMA = new Schema(
    {
        "definitions": {
            "ProductElement": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "categoria": {
                        "type": "string"
                    },
                    "subcategoria": {
                        "type": "string"
                    },
                    "nombre": {
                        "type": "string"
                    },
                    "precio": {
                        "$ref": "#/definitions/Precio"
                    },
                    "url": {
                        "type": "string",
                        "format": "uri",
                        "qt-uri-protocols": [
                            "https"
                        ]
                    },
                    "id": {
                        "type": "string"
                    },
                    "imagen": {
                        "type": "string"
                    },
                    "marca": {
                        "type": "string"
                    }
                },
                "required": [
                    "categoria",
                    "id",
                    "imagen",
                    "marca",
                    "nombre",
                    "precio",
                    "subcategoria",
                    "url"
                ],
                "title": "ProductElement"
            },
            "Precio": {
                "type": "object",
                "additionalProperties": false,
                "properties": {
                    "monto": {
                        "type": "string",
                        "format": "integer"
                    },
                    "dia": {
                        "type": "string"
                    },
                    "hora": {
                        "type": "string",
                        "format": "time"
                    }
                },
                "required": [
                    "dia",
                    "hora",
                    "monto"
                ],
                "title": "Precio"
            }
        }
    });




// exportamon el schema generado
exports.agenda = model("product", SCHEMA);
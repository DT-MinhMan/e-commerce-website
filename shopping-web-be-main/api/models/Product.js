/* eslint-disable quotes */
/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require("uuid");

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {
      type: "string",
      columnType: "varchar(255)",
      required: true,
      description: "Product name",
    },

    price: {
      type: "number",
      defaultsTo: 0,
      description: "Product price",
    },

    status: {
      type: "string",
      isIn: Object.values(sails.config.custom.constants.model.productStatus),
      defaultsTo: sails.config.custom.constants.model.productStatus.ACTIVE,
      description: "Product type status",
    },

    description: {
      type: "string",
      columnType: "citext",
      defaultsTo: "",
      description: "The description.",
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    types: {
      collection: 'Type',
      via: 'product',
      through: 'ProductTypes',
    },

    materials: {
      collection: 'Material',
      via: 'product',
      through: 'ProductMaterials',
    },

    productDetails: {
      collection: 'ProductDetails',
      via: 'product',
    },
  },

  /**
   * Lifecycle callbacks on .create()
   */
  beforeCreate: async (model, next) => {
    model.createdAt = new Date();
    model.updatedAt = new Date();
    model.id = uuid.v4();
    return next();
  },

  /**
   * Lifecycle callbacks on .create()
   */
  beforeUpdate: async (model, next) => {
    model.updatedAt = new Date();
    return next();
  },
};

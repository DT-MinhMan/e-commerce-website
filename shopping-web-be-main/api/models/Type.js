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
      columnType: "varchar(250)",
      description: "Product type name",
      required: true,
    },

    status: {
      type: "string",
      isIn: Object.values(sails.config.custom.constants.model.typeStatus),
      defaultsTo: sails.config.custom.constants.model.typeStatus.ACTIVE,
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

    products: {
      collection: 'Product',
      via: 'type',
      through: 'ProductTypes',
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

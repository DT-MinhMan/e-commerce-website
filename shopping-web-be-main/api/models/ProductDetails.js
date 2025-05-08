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
    quantity: {
      type: "number",
      defaultsTo: 0,
      description: "Product quantity",
    },

    status: {
      type: "string",
      isIn: Object.values(sails.config.custom.constants.model.productDetailsStatus),
      defaultsTo: sails.config.custom.constants.model.productDetailsStatus.ACTIVE,
      description: "Product detail type status",
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

    color: {
      model: 'Color'
    },

    size: {
      model: 'Size'
    },

    product: {
      model: 'Product'
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

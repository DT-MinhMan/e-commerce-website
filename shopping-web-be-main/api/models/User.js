/* eslint-disable quotes */
/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const uuid = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  attributes: {
    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    username: {
      type: "string",
      columnType: "varchar(250)",
      description: "User name used to login by CMS",
      required: true,
    },

    password: {
      type: "string",
      protect: true,
      columnType: "varchar(200)",
      description: "Secure hashed respresentation of the user`s login password",
      allowNull: true,
    },

    email: {
      type: "string",
      columnType: "varchar(100)",
      description: "The mail of the user. Can be used for login CMS",
    },

    firstName: {
      type: "string",
      columnType: "varchar(50)",
      description: "The first name of the user.",
    },

    lastName: {
      type: "string",
      columnType: "varchar(50)",
      description: "The last name of the user",
    },

    birthDay: {
      type: "ref",
      columnType: "date",
      description: "The bird date of the user.",
    },

    address: {
      type: "string",
      columnType: "varchar(250)",
      description: "Address of user.",
    },

    phone: {
      type: "string",
      columnType: "varchar(20)",
      description: "The phone number of the sub.",
    },

    role: {
      type: "string",
      columnType: "varchar(100)",
      description: "User type",
      isIn: Object.values(sails.config.custom.constants.model.userType),
      defaultsTo: sails.config.custom.constants.model.userType.USER,
      allowNull: true,
    },

    description: {
      type: "string",
      columnType: "varchar(250)",
      description: "The description.",
    },


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
  },

  /**
   * Lifecycle callbacks on .create()
   */
  beforeCreate: async (model, next) => {
    model.createdAt = new Date();
    model.updatedAt = new Date();
    /** Create id with format xx-xxx-xx-xxxx, System auto generate it, Not to user transfer */
    model.id = uuid.v4();
    if (model.password) {
      /** get salt round from common setting project */
      const saltRounds = _.get(sails.config.custom, `constants.user.saltRounds`, 10);
      /** password hash */
      model.password = bcrypt.hashSync(model.password, saltRounds);
    }
    return next();
  },

  /**
   * Lifecycle callbacks on .create()
   */
  beforeUpdate: async (model, next) => {
    model.updatedAt = new Date();
    /** Update password if it available */
    if (model.password) {
      /** get salt round from common setting project */
      const saltRounds = _.get(sails.config.custom, `constants.user.saltRounds`, 10);
      /** password hash */
      model.password = bcrypt.hashSync(model.password, saltRounds);
    }
    return next();
  },

  customToJSON: function () {
    return _.omit(this, ['password', 'active', 'createdBy', 'updatedBy', 'deletedBy', 'deletedAt']);
  },

  isAdmin: (user) => {
    return user.role === 'admin';
  },

  validPassword: function (password, user) {
    return bcrypt.compareSync(password, user.password);
  },

  keepSecret: (model) => {
    return _.omit(model, ['password', 'active', 'createdBy', 'updatedBy', 'deletedBy', 'deletedAt']);
  },
};

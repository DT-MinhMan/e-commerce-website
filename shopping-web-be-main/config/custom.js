/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // sendgridSecret: 'SG.fake.3e0Bn0qSQVnwb1E4qNPz9JZP5vLZYqjh7sn8S93oSHU',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
  constants: {
    user: {
      saltRounds: 10
    },
    model: {
      /** User */
      userStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      userType: {
        ADMIN: 'admin',
        USER: 'user',
        ACCOUNTANT: 'accountant',
      },
      /** Product */
      productStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Product Details */
      productDetailsStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Color */
      colorStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Color */
      sizeStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Type */
      typeStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Product Types */
      productTypesStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Material */
      materialStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
      /** Product Materials */
      productMaterialsStatus: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        DELETED: 'deleted',
      },
    }
  }

};

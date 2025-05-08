module.exports = {
  friendlyName: "Add",

  description: "Add type.",

  inputs: {},

  exits: {
    ok: {
      description: "OK",
      responseType: "ok",
    },
    badRequest: {
      description: "Bad Request",
      responseType: "badRequest",
    },
  },

  fn: async function (inputs, exits) {
    /** Defined TAG */
    const TAG = `[C][TYPE][ADD]`;
    /** Get configuration from settings */
    const typeStatusSettings = _.get(sails.config.custom, `constants.model.typeStatus`, {});
    /** Get all params */
    const name = this.req.param("name", "");
    const status = this.req.param("status", "");
    const description = this.req.param("description", "");
    try {
      /** Validate required name params */
      if (_.isEmpty(name)) {
        throw new Error(`Name is required, please input`);
      }
      /** Found type by name */
      const foundTypes = await Type.find({
        name: name
      });
      if(!_.isEmpty(foundTypes)){
        /** Detect type */
        const foundType = _.get(foundTypes, '[0]', {});
        /** Get status*/
        const typeStatus = _.get(foundType, 'status', '');
        if([typeStatusSettings.INACTIVE, typeStatusSettings.DELETED].includes(typeStatus)){
          /** Get id*/
          const typeId = _.get(foundType, 'id', '');
          /** Go update */
          const updateType = await Type.updateOne({id: typeId}).set({status: typeStatusSettings.ACTIVE});
          /** Return exited type*/
          return exits.ok({
            code: 0,
            data: updateType,
            message: `Create type successfully.`,
          });
        } else {
          if([typeStatusSettings.ACTIVE].includes(typeStatus)){
            throw new Error(`Type ${name} already exists`);
          }
        }
      }
      /** Init prepareType */
      let prepareType = {
        id: `New Type`,
        name: name
      };
      if (status !== "") {
        if (!Object.values(typeStatusSettings).includes(status)) {
          throw new Error(`Invalid status value`);
        }
        prepareType['status'] = status;
      }
      if (description !== "") {
        prepareType['status'] = status;
      }
      /** Go create */
      const createType = await Type.create(prepareType).fetch();
      /** Response */
      return exits.ok({
        code: 0,
        data: createType,
        message: `Create type successfully.`,
      });
    } catch (error) {
      /** Prepare to warn message */
      const code = _.get(error, "code", TAG);
      const message = _.get(error, "message", "System error");
      const errMessage = `${TAG}: ${message}`
      throw {
        badRequest: { message: errMessage, code },
      };
    }
  },
};

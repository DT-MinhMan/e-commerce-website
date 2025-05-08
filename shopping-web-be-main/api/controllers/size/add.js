module.exports = {
  friendlyName: "Add",

  description: "Add size.",

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
    const TAG = `[C][SIZE][ADD]`;
    /** Get configuration from settings */
    const sizeStatusSettings = _.get(sails.config.custom, `constants.model.sizeStatus`, {});
    /** Get all params */
    const name = this.req.param("name", "");
    const status = this.req.param("status", "");
    const description = this.req.param("description", "");
    try {
      /** Validate required name params */
      if (_.isEmpty(name)) {
        throw new Error(`Name is required, please input`);
      }
      /** Found size by name */
      const foundSizes = await Size.find({
        name: name,
      });
      if(!_.isEmpty(foundSizes)){
        /** Detect size */
        const foundSize = _.get(foundSizes, '[0]', {});
        /** Get status*/
        const sizeStatus = _.get(foundSize, 'status', '');
        if([sizeStatusSettings.INACTIVE, sizeStatusSettings.DELETED].includes(sizeStatus)){
          /** Get id*/
          const sizeId = _.get(foundSize, 'id', '');
          /** Go update */
          const updateSize = await Size.updateOne({id: sizeId}).set({status: sizeStatusSettings.ACTIVE});
          /** Return exited size*/
          return exits.ok({
            code: 0,
            data: updateSize,
            message: `Create size successfully.`,
          });
        } else {
          if([sizeStatusSettings.ACTIVE].includes(sizeStatus)){
            throw new Error(`Size ${name} already exists`);
          }
        }
      }
      /** Init prepareSize */
      let prepareSize = {
        id: `New Size`,
        name: name
      };
      if (status !== "") {
        if (!Object.values(sizeStatusSettings).includes(status)) {
          throw new Error(`Invalid status value`);
        }
        prepareSize['status'] = status;
      }
      if (description !== "") {
        prepareSize['status'] = status;
      }
      /** Go create */
      const createSize = await Size.create(prepareSize).fetch();
      /** Response */
      return exits.ok({
        code: 0,
        data: createSize,
        message: `Create size successfully.`,
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

module.exports = {
  friendlyName: "Add",

  description: "Add color.",

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
    const TAG = `[C][COLOR][ADD]`;
    /** Get configuration from settings */
    const colorStatusSettings = _.get(sails.config.custom, `constants.model.colorStatus`, {});
    /** Get all params */
    const name = this.req.param("name", "");
    const status = this.req.param("status", "");
    const description = this.req.param("description", "");
    try {
      /** Validate required name params */
      if (_.isEmpty(name)) {
        throw new Error(`Name is required, please input`);
      }
      /** Found color by name */
      const foundColors = await Color.find({
        name: name
      });
      if(!_.isEmpty(foundColors)){
        /** Detect color */
        const foundColor = _.get(foundColors, '[0]', {});
        /** Get status*/
        const colorStatus = _.get(foundColor, 'status', '');
        if([colorStatusSettings.INACTIVE, colorStatusSettings.DELETED].includes(colorStatus)){
          /** Get id*/
          const colorId = _.get(foundColor, 'id', '');
          /** Go update */
          const updateColor = await Color.updateOne({id: colorId}).set({status: colorStatusSettings.ACTIVE});
          /** Return exited color*/
          return exits.ok({
            code: 0,
            data: updateColor,
            message: `Create color successfully.`,
          });
        } else {
          if([colorStatusSettings.ACTIVE].includes(colorStatus)){
            throw new Error(`Color ${name} already exists`);
          }
        }
      }
      /** Init prepareColor */
      let prepareColor = {
        id: `New Color`,
        name: name
      };
      if (status !== "") {
        if (!Object.values(colorStatusSettings).includes(status)) {
          throw new Error(`Invalid status value`);
        }
        prepareColor['status'] = status;
      }
      if (description !== "") {
        prepareColor['status'] = status;
      }
      /** Go create */
      const createColor = await Color.create(prepareColor).fetch();
      /** Response */
      return exits.ok({
        code: 0,
        data: createColor,
        message: `Create color successfully.`,
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

module.exports = {
    friendlyName: "Add",
  
    description: "Add material.",
  
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
      const TAG = `[C][MATERIAL][ADD]`;
      /** Get configuration from settings */
      const materialStatusSettings = _.get(sails.config.custom, `constants.model.materialStatus`, {});
      /** Get all params */
      const name = this.req.param("name", "");
      const status = this.req.param("status", "");
      const description = this.req.param("description", "");
      try {
        /** Validate required name params */
        if (_.isEmpty(name)) {
          throw new Error(`Name is required, please input`);
        }
        /** Found material by name */
        const foundMaterials = await Material.find({
          name: name
        });
        if(!_.isEmpty(foundMaterials)){
          /** Detect material*/
          const foundMaterial = _.get(foundMaterials, '[0]', {});
          /** Get status*/
          const materialStatus = _.get(foundMaterial, 'status', '');
          if([materialStatusSettings.INACTIVE, materialStatusSettings.DELETED].includes(materialStatus)){
            /** Get id*/
            const materialId = _.get(foundMaterial, 'id', '');
            /** Go update */
            const updateMaterial = await Material.updateOne({id: materialId}).set({status: materialStatusSettings.ACTIVE});
            /** Return exited material*/
            return exits.ok({
              code: 0,
              data: updateMaterial,
              message: `Create material successfully.`,
            });
          } else {
            if([materialStatusSettings.ACTIVE].includes(materialStatus)){
              throw new Error(`Material ${name} already exists`);
            }
          }
        }
        /** Init prepareMaterial */
        let prepareMaterial = {
          id: `New Material`,
          name: name
        };
        if (status !== "") {
          if (!Object.values(materialStatusSettings).includes(status)) {
            throw new Error(`Invalid status value`);
          }
          prepareMaterial['status'] = status;
        }
        if (description !== "") {
          prepareMaterial['status'] = status;
        }
        /** Go create */
        const createMaterial = await Material.create(prepareMaterial).fetch();
        /** Response */
        return exits.ok({
          code: 0,
          data: createMaterial,
          message: `Create material successfully.`,
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
  
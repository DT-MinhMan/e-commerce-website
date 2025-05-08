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
      const TAG = `[C][PRODUCT][GET-LIST]`;
      /** Get configuration from settings */
      const colorStatusSettings = _.get(sails.config.custom, `constants.model.colorStatus`, {});
      const sizeStatusSettings = _.get(sails.config.custom, `constants.model.sizeStatus`, {});
      const materialStatusSettings = _.get(sails.config.custom, `constants.model.materialStatus`, {});
      const typeStatusSettings = _.get(sails.config.custom, `constants.model.typeStatus`, {});
      /** Get all params */
      const name = this.req.param("name", "");
      const fromPrice = this.req.param("fromPrice", "");
      const toPrice = this.req.param("toPrice", "");
      const status = this.req.param("status", "");
      const page = this.req.param("page", 0);
      const limit = this.req.param("limit", 10);
      /** Get reference params */
      const types = this.req.param("types", []);
      const materials = this.req.param("materials", []);
      const sizes = this.req.param("sizes", []);
      /** Init prepared query */
      let preparedQuery = {};
      try {
        /** Validate required name params */
        if (!_.isEmpty(name)) {
            preparedQuery['name'] = {contains: `${name}`};
        }
        let priceRange = {};
        if (!_.isEmpty(fromPrice)) {
            priceRange['>='] = fromPrice
        }
        if (!_.isEmpty(toPrice)) {
            priceRange['<='] = toPrice
        }
        if (!_.isEmpty(priceRange)) {
            preparedQuery['price'] = priceRange
        }
        if (!_.isEmpty(status)) {
            preparedQuery['status'] = status
        }
        const productIds = [];
        let foundTypeNameObjects = {};
        if (!_.isEmpty(types)) {
            /** Validate type by id */
            const foundTypes = await Type.find({
                where: {
                    id: types,
                    status: typeStatusSettings.ACTIVE
                },
                select: ['id', 'name']
            });
            if(foundTypes.length < types.length){
                /** map foundTypes */
                const mapfoundTypes = foundTypes.map(dt => dt.id);
                /** filter req types */
                const inValidType = types.filter(type => !mapfoundTypes.includes(type));
                throw new Error(`Type ${inValidType.join(', ')} do not exists`);
            }
            /** foundProductTypes */
            const foundProductTypes = await ProductTypes.find({
                where: {
                    type: types,
                },
                select: ['id', 'product', 'type']
            });
            /** Get productIds */
            for(const productType of foundProductTypes){
                const productId = _.get(productType, 'product', '');
                if(!productIds.includes(productId)){
                    productIds.push(productId);
                }
            }
        }
        if (!_.isEmpty(materials)) {
            /** Validate material by id */
            const foundMaterials = await Material.find({
                where: {
                    id: materials,
                    status: materialStatusSettings.ACTIVE
                },
                select: ['id', 'name']
            });
            if(foundMaterials.length < materials.length){
                /** map foundMaterials */
                const mapfoundMaterials = foundMaterials.map(dt => dt.id);
                /** filter req materials */
                const inValidMaterial = materials.filter(material => !mapfoundMaterials.includes(material));
                throw new Error(`Material ${inValidMaterial.join(', ')} do not exists`);
            }
            /** foundProductMaterials */
            const foundProductMaterials = await ProductMaterials.find({
                where: {
                    material: materials,
                },
                select: ['id', 'product', 'material']
            });
            /** Get productIds */
            for(const productMaterial of foundProductMaterials){
                const productId = _.get(productMaterial, 'product', '');
                if(!productIds.includes(productId)){
                    productIds.push(productId);
                }
            }
        }
        if (!_.isEmpty(sizes)) {
            /** Validate size by id */
            const foundSizes = await Size.find({
                where: {
                    id: sizes,
                    status: sizeStatusSettings.ACTIVE
                },
                select: ['id', 'name']
            });
            if(foundSizes.length < sizes.length){
                /** map foundSizes */
                const mapfoundSizes = foundSizes.map(dt => dt.id);
                /** filter req sizes */
                const inValidSize = sizes.filter(size => !mapfoundSizes.includes(size));
                throw new Error(`Size ${inValidSize.join(', ')} do not exists`);
            }
            /** foundProductSizes */
            const foundProductSizes = await ProductSizes.find({
                where: {
                    size: sizes,
                },
                select: ['id', 'product', 'size']
            });
            /** Get productIds */
            for(const productSize of foundProductSizes){
                const productId = _.get(productSize, 'product', '');
                if(!productIds.includes(productId)){
                    productIds.push(productId);
                }
            }
        }
        if (!_.isEmpty(types) || !_.isEmpty(materials) || !_.isEmpty(sizes)) {
            preparedQuery['id'] = productIds
        }
        /** Go find */
        const foundProduct = await Product.find({
            where: preparedQuery,
            skip: page * limit,
            limit: limit
        });
        const total = await Product.count(preparedQuery);
        /** Response */
        return exits.ok({
          code: 0,
          data: foundProduct,
          pagination: {
            page,
            limit,
            total
          },
          message: `Get list product successfully.`,
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
  
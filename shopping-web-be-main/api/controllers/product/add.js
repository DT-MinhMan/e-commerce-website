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
      const TAG = `[C][PRODUCT][ADD]`;
      /** Get configuration from settings */
      const colorStatusSettings = _.get(sails.config.custom, `constants.model.colorStatus`, {});
      const sizeStatusSettings = _.get(sails.config.custom, `constants.model.sizeStatus`, {});
      const materialStatusSettings = _.get(sails.config.custom, `constants.model.materialStatus`, {});
      const typeStatusSettings = _.get(sails.config.custom, `constants.model.typeStatus`, {});
      /** Get all params */
      const name = this.req.param("name", "");
      const price = this.req.param("price", 0);
      const status = this.req.param("status", "");
      const description = this.req.param("description", "");
      /** Get reference params */
      const types = this.req.param("types", []);
      const materials = this.req.param("materials", []);
      const details = this.req.param("details", []);
      // const colors = this.req.param("colors", []);
      try {
        /** Validate required name params */
        if (_.isEmpty(name)) {
          throw new Error(`Name is required`);
        }
        if (price <= 0) {
          throw new Error(`Price is required or invalid value`);
        }
        if (_.isEmpty(types) || !_.isArray(types)) {
          throw new Error(`Type is required or invalid value`);
        }
        if (_.isEmpty(materials) || !_.isArray(materials)) {
          throw new Error(`Materials is required or invalid valu e`);
        }
        if (_.isEmpty(details) || !_.isArray(details)) {
          throw new Error(`Product details is required or invalid value`);
        }
        /** Validate details */
        let sizeIds = [];
        let colorIds = [];
        let exitedProductDetails = [];
        for(let i = 0 ; i < details.length ; i++){
          const detail = details[i];
          const sizeId = _.get(detail, 'size', '');
          const colorId = _.get(detail, 'color', '');
          const quantity = _.get(detail, 'quantity', -1);
          if(_.isEmpty(sizeId)){
            throw new Error(`Missing size value of details #${i}`);
          }
          if(_.isEmpty(colorId)){
            throw new Error(`Missing color value of details #${i}`);
          }
          if(quantity < 0 || !_.isNumber(quantity)){
            throw new Error(`Invalid quantity value of details #${i}`);
          }
          if(!sizeIds.includes(sizeId)){
            sizeIds.push(sizeId)
          }
          if(!colorIds.includes(colorId)){
            colorIds.push(colorId)
          }
          const existedValue = `${colorId}-${sizeId}`;
          if(!exitedProductDetails.includes(existedValue)){
            exitedProductDetails.push(existedValue);
          } else {
            throw new Error(`Product details #${i} is existed above`);
          }
        }
        /** Validate color by id */
        const foundColors = await Color.find({
          where: {
            id: colorIds,
            status: colorStatusSettings.ACTIVE
          },
          select: ['id', 'name']
        });
        if(foundColors.length < colorIds.length){
          /** map foundColors */
          const mapfoundColors = foundColors.map(dt => dt.id);
          /** filter req colorIds */
          const inValidColor = colorIds.filter(color => !mapfoundColors.includes(color));
          throw new Error(`Color ${inValidColor.join(', ')} do not exists`);
        }
        /** Validate size by id */
        const foundSizes = await Size.find({
          where: {
            id: sizeIds,
            status: sizeStatusSettings.ACTIVE
          },
          select: ['id', 'name']
        });
        if(foundSizes.length < sizeIds.length){
          /** map foundSizes */
          const mapfoundSizes = foundSizes.map(dt => dt.id);
          /** filter req sizeIds */
          const inValidSize = sizeIds.filter(size => !mapfoundSizes.includes(size));
          throw new Error(`Size ${inValidSize.join(', ')} do not exists`);
        }
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
        /** Build object */
        let foundTypeNameObjects = {}
        foundTypes.forEach(dt => {
          foundTypeNameObjects[dt.id] = dt.name;
        })
        let foundMaterialNameObjects = {}
        foundMaterials.forEach(dt => {
          foundMaterialNameObjects[dt.id] = dt.name;
        })
        let foundColorNameObjects = {}
        foundColors.forEach(dt => {
          foundColorNameObjects[dt.id] = dt.name;
        })
        let foundSizeNameObjects = {}
        foundSizes.forEach(dt => {
          foundSizeNameObjects[dt.id] = dt.name;
        })
        /** Init prepareColor */
        let prepareProduct = {
          id: `New Product`,
          name: name,
          price: price,
        };
        if (status !== "") {
          if (!Object.values(colorStatusSettings).includes(status)) {
            throw new Error(`Invalid status value`);
          }
          prepareProduct['status'] = status;
        }
        if (description !== "") {
          prepareProduct['description'] = description;
        }
        /** Go create */
        const createProduct = await Product.create(prepareProduct).fetch();
        const productId = _.get(createProduct, 'id', '');
        let linkProductTypes = []; 
        /** Link Type and materials */
        for(const type of types){
          /** prepared create */
          const preparedCreate = {
            id: 'New ProductTypes',
            product: productId,
            type: type
          }
          /** Link to product type */
          const createProductType = await ProductTypes.create(preparedCreate).fetch();
          /** const get type name*/
          const linkType = _.get(foundTypeNameObjects, _.get(createProductType, 'type', ''), '');
          linkProductTypes.push(linkType);
        }
        let linkProductMaterials = []; 
        /** Link Material and materials */
        for(const material of materials){
          /** prepared create */
          const preparedCreate = {
            id: 'New ProductMaterials',
            product: productId,
            material: material
          }
          /** Link to product material */
          const createProductMaterial = await ProductMaterials.create(preparedCreate).fetch();
          /** const get material name*/
          const linkMaterial = _.get(foundMaterialNameObjects, _.get(createProductMaterial, 'material', ''), "");
          linkProductMaterials.push(linkMaterial);
        }
        /** Init link product details */
        let linkProductDetails = [];
        /** Link product details */
        for(let i = 0 ; i < details.length ; i++){
          const detail = details[i];
          const sizeId = _.get(detail, 'size', '');
          const colorId = _.get(detail, 'color', '');
          const quantity = _.get(detail, 'quantity', -1);
          /** Prepared create */
          const preparedCreate = {
            id: 'New ProductDetails',
            size: sizeId,
            color: colorId,
            quantity: quantity,
            product: productId
          }
          /** Go link */
          const createProductDetail = await ProductDetails.create(preparedCreate).fetch();
          /** Get population*/
          const linkColor = _.get(foundColorNameObjects, _.get(createProductDetail, 'color', ''), "");
          const linkSize = _.get(foundSizeNameObjects, _.get(createProductDetail, 'size', ''), "");
          linkProductDetails.push({
            ..._.pick(createProductDetail, ['quantity', 'description']),
            color: linkColor,
            size: linkSize
          })
        }
        /** Response */
        return exits.ok({
          code: 0,
          data: {
            ...createProduct,
            materials: linkProductMaterials,
            types: linkProductTypes,
            details: linkProductDetails
          },
          message: `Create product successfully.`,
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
  
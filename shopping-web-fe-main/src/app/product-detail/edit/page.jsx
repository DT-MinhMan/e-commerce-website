"use client";
// react
import React, { useEffect, useState } from "react";
import product from "../../../api/apiList/product";
import dayjs from "dayjs";
import _, { isEmpty } from "lodash";
// css
import "./edit-product.css";
// antd
import {
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Typography,
  notification,
  Spin,
  Select,
  Space,
  Card,
  Row
} from "antd";
import {
  DownloadOutlined,
  MinusCircleOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { size } from 'lodash';
const { Title } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

const validateMessages = {
  required: "${label} chưa được điền",
  types: {
    email: "${label} không phải là email!",
    number: "${label} không phải là con số!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const CreateInfo = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [productTypes, setProductTypes] = useState([]);
  const [productMaterials, setProductMaterials] = useState([]);
  const [productColors, setProductColors] = useState([]);
  const [productSizes, setProductSizes] = useState([]);
  const [productDetailType, setProductDetailType] = useState();

  // useEffect
  useEffect(() => {
    listProductDetails();
  }, []);

  // functions
  // list product info
  const listProductDetails = async () => {
	try {
		// init pagination
		const limit = 1000;
		// get types
		const getTypes = await product.list_product_types({ limit });
		// get materials
		const getMaterials = await product.list_product_materials({ limit });
		// get colors
		const getColors = await product.list_product_colors({ limit });
		// get sizes
		const getSizes = await product.list_product_sizes({ limit });
		// Set product types
		const typesOptions = getTypes?.data?.map((dt) => {
			return {
				value: dt?.id,
				label: dt?.name,
				status: dt?.status
			};
		});
		// Set product materials
		const materialsOptions = getMaterials?.data?.map((dt) => {
			return {
				value: dt?.id,
				label: dt?.name,
				status: dt?.status
			};
		});
		// Set product colors
		const colorsOptions = getColors?.data?.map((dt) => {
			return {
				value: dt?.id,
				label: dt?.name,
				status: dt?.status
			};
		});
		// Set product colors
		const sizesOptions = getSizes?.data?.map((dt) => {
			return {
				value: dt?.id,
				label: dt?.name,
				status: dt?.status
			};
		});
		setProductTypes(typesOptions);
		setProductMaterials(materialsOptions);
		setProductColors(colorsOptions);
		setProductSizes(sizesOptions);
	} catch (error) {
		console.log(error);
	}
};
  
  const onFinish = async (values) => {
    try {
      // setLoading(true);
	  const selectedDetail = values.name;
	  const selectedStatus = values.status;
	  let originalDetailName, statusStat;
	  //find name and status based on product's id on each detail types
	  switch (productDetailType) {
		case 'color':
		  originalDetailName = productColors.find(item => item.value === values.details)?.label;
		  statusStat = productColors.find(item => item.value === values.details)?.status;
		  break;
		case 'material':
		  originalDetailName = productMaterials.find(item => item.value === values.details)?.label;
		  statusStat = productMaterials.find(item => item.value === values.details)?.status;
		  break;
		case 'size':
		  originalDetailName = productSizes.find(item => item.value === values.details)?.label;
		  statusStat = productSizes.find(item => item.value === values.details)?.status;
		  break;
		case 'type':
		  originalDetailName = productTypes.find(item => item.value === values.details)?.label;
		  statusStat = productTypes.find(item => item.value === values.details)?.status;
		  break;
		default:
		  break;
	  }

  	  // If they are the same, show a warning and prevent submission
	  if (selectedDetail === originalDetailName && selectedStatus === statusStat) {
		notification.warning({
		  description: "Tên hoặc trạng thái loại sản phẩm chưa được thay đổi!",
		  duration: 4,
		});
		return;
	  }
	  
	  let res; 
	  //change type api link according to the form
	  switch(productDetailType){
	  	case 'color':
      		res = await product.edit_product_colors(values);
			break;
		case 'material':
			res = await product.edit_product_materials(values);
			break;
		case 'size':
			res = await product.edit_product_sizes(values);
			break;
		case 'type':
			res = await product.edit_product_types(values);
			break;
	  } 
	  if (res) {
        if (res.code == 0) {
          notification.success({
            description: "Sửa loại chi tiết sản phẩm thành công!",
            duration: 4,
          });
		  form.resetFields();
		  setProductDetailType(null);

		  listProductDetails();
        } else {
          notification.error({
            description: res.message,
            duration: 4,
          });
        }
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onReset = () => {
    form.resetFields();
	setProductDetailType(null)
  };

  // Reset fields after changed product's detail
  const handleProductDetailTypeChange = (value) => {
	if (form.getFieldValue("details") != '')
		form.setFieldValue("details",null)
		form.setFieldValue("id",null)
		form.setFieldValue("name",null)
		form.setFieldValue("status",'active')
	setProductDetailType(value);
  };

  const handleProductDetailChange = (value) => {
  // Find the selected product based on the selected value
  let selectedProduct;
  if (productDetailType === 'color') {
    selectedProduct = productColors.find((product) => product.value === value);
  } else if (productDetailType === 'material') {
    selectedProduct = productMaterials.find((product) => product.value === value);
  } else if (productDetailType === 'size') {
    selectedProduct = productSizes.find((product) => product.value === value);
  } else if (productDetailType === 'type') {
    selectedProduct = productTypes.find((product) => product.value === value);
  }

  // If a product is found, log the product info into field
  if (selectedProduct) {
    form.setFieldsValue({ 
		id: selectedProduct.value,
		name: selectedProduct.label,
		status: selectedProduct.status
	});
  }
};

  return (
		<div className='container'>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Sửa thông tin chi tiết sản phẩm</Title>
			<Spin spinning={loading} tip={`Đang lấy thông tin !`}>
				<div style={{ margin: '0% 5%' }}>
					<Form
						{...layout}
						form={form}
						name='nest-messages'
						onFinish={onFinish}
						onReset={onReset}
						style={{ maxWidth: '100%' }}
						validateMessages={validateMessages}
					>
						{/*__________productDetailTypes__________ */}
						<Form.Item name='productDetailType' label='Loại sản phẩm' rules={[{required: true}]}>
							<Select
								style={{ width: 120 }}
								onChange={handleProductDetailTypeChange}
								options={[
									{ value: 'color', label: 'Màu' },
									{ value: 'material', label: 'Vật liệu' },
									{ value: 'size', label: 'Kích cỡ' },
									{ value: 'type', label: 'Loại' }
								]}
							/>
						</Form.Item>
						{/*__________material__________ */}
						{productDetailType && (
						<Form.Item label='Tên loại' name='details' disabled={!productDetailType}>
							{productDetailType === 'material' && (
								<Select style={{ width: '100%' }} placeholder='Chọn chất liệu sản phẩm' onChange={handleProductDetailChange}>	
									{productMaterials?.map((productMaterials) => (
										<Select key={productMaterials.value} value={productMaterials.value}>
											{productMaterials.label}
										</Select>
									))}
								</Select>
							)}
							{productDetailType === 'color' && (
								<Select style={{ width: '100%' }} placeholder='Chọn màu sản phẩm' onChange={handleProductDetailChange}>
									{productColors?.map((productColors) => (
										<Select key={productColors.value} value={productColors.value}>
											{productColors.label}
										</Select>
									))}
								</Select>
							)}
							{productDetailType === 'size' && (
								<Select style={{ width: '100%' }} placeholder='Chọn kích cỡ sản phẩm' onChange={handleProductDetailChange}>
									{productSizes?.map((productSizes) => (
										<Select key={productSizes.value} value={productSizes.value}>
											{productSizes.label}
										</Select>
									))}
								</Select>
							)}
							{productDetailType === 'type' && (
								<Select style={{ width: '100%' }} placeholder='Chọn loại sản phẩm' onChange={handleProductDetailChange}>
									{productTypes?.map((productTypes) => (
										<Select key={productTypes.value} value={productTypes.value}>
											{productTypes.label}
										</Select>
									))}
								</Select>
							)}
						</Form.Item>
						)}
						{/*__________id__________ */}
						{productDetailType && (
						<Form.Item name='id' label='ID loại sản phẩm' rules={[{ required: true }]} disabled={!productDetailType}>
							<Input 
								disabled = "True"
							/>
						</Form.Item>
						)}
						{/*__________name__________ */}
						{productDetailType && (
						<Form.Item name='name' label='Tên loại sản phẩm mới' placeholder='Chọn chi tiết sản phẩm trước' rules={[{ required: true }]} disabled={!productDetailType}>
							<Input />
						</Form.Item>
						)}
						{/*__________status__________ */}
						{productDetailType && (
						<Form.Item name='status' label='Trạng thái' rules={[{required: true}]} disabled={!productDetailType}>
							<Select
								style={{ width: 120 }}
								options={[
									{ value: 'active', label: 'Hoạt động' },
									{ value: 'in_active', label: 'Tạm khóa' },
									{ value: 'deleted', label: 'Đã xóa' },
								]}
							/>
						</Form.Item>
						)}
						{/*__________Button__________ */}
						<div className='submit-button' style={{ textAlign: 'right' }}>
						{productDetailType && (
							<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} disabled={!productDetailType}>
                				<Button htmlType="button" onClick={onReset} style={{margin: "0px 5px"}}>
                  					Hủy
                				</Button>
								<Button htmlType='submit'  style={{margin: "0px 5px"}}>
                  					Sửa
                				</Button>
							</Form.Item>
						)}
						</div>
					</Form>
				</div>
			</Spin>
		</div>
	);
};
export default CreateInfo;

"use client";
// react
import React, { useEffect, useState } from "react";
import product from "../../../api/apiList/product";
import dayjs from "dayjs";
// css
import "./add-product.css";
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

  // useEffect
//   useEffect(() => {
//     listProductDetails();
//   }, []);

  // functions
  // list product info
  
  const onFinish = async (values) => {
    try {
      // setLoading(true);
	  const productDetail = form.getFieldValue("productDetailType")
	  let res; 
	  //change type api link according to the form
	  switch(productDetail){
	  	case 'color':
      		res = await product.create_product_colors(values);
			break;
		case 'material':
			res = await product.create_product_materials(values);
			break;
		case 'size':
			res = await product.create_product_sizes(values);
			break;
		case 'type':
			res = await product.create_product_types(values);
			break;
	  } 
	  if (res) {
        if (res.code == 0) {
          notification.success({
            description: "Thêm loại sản phẩm thành công!",
            duration: 4,
          });
		  form.resetFields()
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
  };
  return (
		<div className='container'>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Nhập thông tin chi tiết sản phẩm</Title>
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
						{/*__________name__________ */}
						<Form.Item name='name' label='Tên loại sản phẩm' placeholder='Điền tên loại sản phẩm' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						{/*__________status__________ */}
						<Form.Item name='productDetailType' label='Loại sản phẩm' placeholder='Chọn loại' rules={[{required: true}]}>
							<Select
								defaultValue=''
								style={{ width: 120 }}
								options={[
									{ value: 'color', label: 'Màu' },
									{ value: 'material', label: 'Vật liệu' },
									{ value: 'size', label: 'Kích cỡ' },
									{ value: 'type', label: 'Loại' }
								]}
							/>
						</Form.Item>

						{/*__________status__________ */}
						<Form.Item name='status' label='Trạng thái' placeholder='Trạng thái' rules={[{required: true}]}>
							<Select
								defaultValue=''
								style={{ width: 120 }}
								options={[
									{ value: 'active', label: 'Hoạt động' },
									{ value: 'in_active', label: 'Tạm khóa' },
								]}
							/>
						</Form.Item>
						{/*__________Button__________ */}
						<div className='submit-button' style={{ textAlign: 'right' }}>
							<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                				<Button htmlType="button" onClick={onReset} style={{margin: "0px 5px"}}>
                  					Hủy
                				</Button>
								<Button htmlType='submit'  style={{margin: "0px 5px"}}>
                  					Tạo
                				</Button>
							</Form.Item>
						</div>
					</Form>
				</div>
			</Spin>
		</div>
	);
};
export default CreateInfo;

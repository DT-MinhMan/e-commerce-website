'use client';
// react
import React, { useEffect, useState } from 'react';
import product from '../../../api/apiList/product';
import dayjs from 'dayjs';
import _, { isEmpty, get } from 'lodash';

// css
import './add-product.css';
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
	Row,
	Col,
	Upload,
} from 'antd';
import { DownloadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
const { Title } = Typography;

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 },
};

const validateMessages = {
	required: '${label} chưa được điền',
	types: {
		email: '${label} không phải là email!',
		number: '${label} không phải là con số!',
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	},
};

const onFinish = (values) => {
	console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
	console.log('Failed:', errorInfo);
};
const CreateInfo = () => {
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [productTypes, setProductTypes] = useState([]);
	const [productMaterials, setProductMaterials] = useState([]);
	const [productColors, setProductColors] = useState([]);
	const [productSizes, setProductSizes] = useState([]);
	const navigation = useSearchParams();

	// useEffect
	useEffect(() => {
		getInfo();
		listProductDetails();
	}, []);

	const getInfo = async (items) => {
		try {
			setLoading(true);
			const res = await product.info_product({ id: navigation.get('id') });
			console.log(res);
			if (res) {
				const foundProductData = _.get(res, 'data', {});
				console.log(foundProductData);

				form.setFieldValue('product', foundProductData?.id);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

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
				};
			});
			// Set product materials
			const materialsOptions = getMaterials?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			// Set product colors
			const colorsOptions = getColors?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			// Set product colors
			const sizesOptions = getSizes?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
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
			const body = {
				...values,
			};
			console.log(body);
			const res = await product.add_product_details(body);
			console.log(res);
			if (res) {
				if (res.code == 0) {
					notification.success({
						description: 'Thêm chi tiết sản phẩm thành công!',
						duration: 4,
					});
					onReset();
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
		const restoreID = form.getFieldValue('product');

		form.resetFields();
		form.setFieldValue('product', restoreID);
	};
	return (
		<div className='container' style={{ padding: '20px' }}>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman', marginBottom: '20px'}}>Thêm chi tiết sản phẩm</Title>
			<Spin spinning={loading} tip='Đang lấy thông tin!' style={{ textAlign: 'center', justifyContent: 'center' }}>
				<div style={{ margin: '0 5%' }}>
					<Form
						{...layout}
						form={form}
						name='nest-messages'
						onFinish={onFinish}
						onReset={onReset}
						style={{ maxWidth: '100%' }}
						validateMessages={validateMessages}
					>
						{/*__________Name__________ */}
						<Form.Item name='product' label='Mã sản phẩm' rules={[{ required: true }]} style={{ marginBottom: '20px' }}>
							<Input style={{ backgroundColor: '#f5f5f5', width: '50%', pointerEvents: 'none' }} />
						</Form.Item>

						<Form.List name='details' label='Chi tiết sản phẩm'>
							{(fields, { add, remove }) => (
								<>
									{fields?.map(({ key, name, ...restField }) => (
										<Row
											key={key}
											style={{
												border: '1px solid #e8e8e8',
												marginBottom: '5px',
												padding: '10px',
												borderRadius: '10px',
											}}
											justify='space-between'
											gutter={[16, 16]} // Spacing between columns
										>
											<Col xs={24} sm={24} md={8}>
												<Form.Item
													{...restField}
													label='Kích cỡ'
													name={[name, 'size']}
													rules={[
														{
															required: true,
															message: 'Kích cỡ đang trống',
														},
													]}
												>
													<Select mode='single' style={{ width: '100%' }} placeholder='Chọn kích cỡ'>
														{productSizes?.map((size) => (
															<Select.Option key={size.value} value={size.value}>
																{size.label}
															</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={8}>
												<Form.Item
													{...restField}
													label='Màu sắc'
													name={[name, 'color']}
													rules={[
														{
															required: true,
															message: 'Màu sắc đang trống',
														},
													]}
												>
													<Select mode='single' style={{ width: '100%' }} placeholder='Chọn màu sắc'>
														{productColors?.map((color) => (
															<Select.Option key={color.value} value={color.value}>
																{color.label}
															</Select.Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={8}>
												<Form.Item
													{...restField}
													name={[name, 'qty']}
													label='Số lượng'
													rules={[
														{
															required: true,
															message: 'Số lượng đang trống',
														},
													]}
												>
													<InputNumber placeholder='Nhập số lượng' style={{ width: '100%' }} min={1} />
												</Form.Item>
											</Col>
											<Col xs={24} sm={24} md={24}>
												<Row justify='center' align='middle'>
													<MinusCircleOutlined
														onClick={() => remove(name)}
														style={{ fontSize: '18px', cursor: 'pointer', marginRight: '5px' }} // Add styling as needed
													/>
												</Row>
											</Col>
										</Row>
									))}
									<Row justify='center'>
										<Form.Item>
											<Button type='dashed' onClick={() => add()} icon={<PlusOutlined />}>
												Thêm chi tiết sản phẩm
											</Button>
										</Form.Item>
									</Row>
								</>
							)}
						</Form.List>
						{/*__________Button__________ */}
						<div className='submit-button' style={{ textAlign: 'right' }}>
							<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
								<Button htmlType='button' onClick={onReset} style={{ margin: '0 5px' }}>
									Hủy
								</Button>
								<Button htmlType='submit'>Tạo</Button>
							</Form.Item>
						</div>
					</Form>
				</div>
			</Spin>
		</div>
	);
};
export default CreateInfo;

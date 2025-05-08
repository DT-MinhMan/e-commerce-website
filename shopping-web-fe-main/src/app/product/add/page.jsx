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
	Upload,
	Col,
} from 'antd';
import { DownloadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { size } from 'lodash';
const { Title } = Typography;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 14 },
};

const validateMessages = {
	required: '${label} đang trống',
	types: {
		email: '${label} không phải là email!',
		number: '${label} không phải là con số!',
	},
	number: {
		range: '${label} must be between ${min} and ${max}',
	},
};
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
const CreateInfo = () => {
	const [finalAmount, setFinalAmount] = useState(0);
	const [capital, setCapital] = useState(0);
	const [stacks, setStacks] = useState(0);
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [productTypes, setProductTypes] = useState([]);
	const [productMaterials, setProductMaterials] = useState([]);
	const [productColors, setProductColors] = useState([]);
	const [productSizes, setProductSizes] = useState([]);

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [fileList, setFileList] = useState([]);
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};
	const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
	const uploadButton = (
		<button
			style={{
				border: 0,
				background: 'none',
			}}
			type='button'
		>
			<PlusOutlined />
			<div
				style={{
					marginTop: 8,
				}}
			>
				Thêm hình ảnh
			</div>
		</button>
	);
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
			const validate_file = [];
			for (const file of fileList) {
				validate_file.push(await getBase64(file?.originFileObj));
			}
			const body = {
				...values,
				images: validate_file,
			};
			const res = await product.create_product(body);
			console.log(res);
			if (res) {
				if (res.code == 0) {
					notification.success({
						description: 'Thêm sản phẩm thành công!',
						duration: 4,
					});
				} else {
					notification.error({
						description: res.message,
						duration: 4,
					});
				}
				onReset();
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const onReset = () => {
		form.resetFields();
		setFileList([]);
	};
	return (
		<div className='container'>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Nhập thông tin sản phẩm</Title>
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
						<Form.Item name='name' label='Tên sản phẩm' rules={[{ required: true }]}>
							<Input />
						</Form.Item>
						{/*__________description__________ */}
						<Form.Item name='description' label='Mô tả'>
							<Input.TextArea />
						</Form.Item>
						{/*__________material__________ */}
						<Form.Item label='Chất liệu' name='materials' rules={[{ required: true }]}>
							<Select mode='multiple' style={{ width: '100%' }} placeholder='Chọn chất liệu sản phẩm'>
								{productMaterials?.map((productMaterials) => (
									<Option key={productMaterials.value} value={productMaterials.value}>
										{productMaterials.label}
									</Option>
								))}
							</Select>
						</Form.Item>
						{/*__________type__________ */}
						<Form.Item label='Loại sản phẩm' name='types' rules={[{ required: true }]}>
							<Select mode='multiple' style={{ width: '100%' }} placeholder='Chọn loại sản phẩm'>
								{productTypes?.map((productTypes) => (
									<Option key={productTypes.value} value={productTypes.value}>
										{productTypes.label}
									</Option>
								))}
							</Select>
						</Form.Item>
						{/*__________price__________ */}
						<Form.Item name='price' label='Giá thành' rules={[{ type: 'number', min: 0, required: true }]}>
							<InputNumber />
						</Form.Item>

						{/*__________status__________ */}
						<Form.Item name='status' label='Trạng thái'>
							<Select
								defaultValue='active'
								style={{ width: 120 }}
								options={[
									{ value: 'active', label: 'Hoạt động' },
									{ value: 'in_active', label: 'Tạm khóa' },
									{ value: 'deleted', label: 'Đã xóa' },
								]}
							/>
						</Form.Item>
						<Form.Item name='images' label='Hình ảnh' rules={[{ required: true }]}>
							<Upload
								listType='picture-card'
								fileList={fileList?.map((e) => {
									return {
										...e,
										status: 'done',
									};
								})}
								beforeUpload={(file) => {
									const isLt1M = file.size / 1024 / 1024 < 1; // Check if file size is less than 1MB
									console.log(isLt1M);
									if (!isLt1M) {
										notification.error({
											description: 'Hình ảnh phải nhỏ hơn 1MB',
											duration: 4,
										});
									}
									return isLt1M; // Return false to prevent upload if file is too large
								}}
								onPreview={handlePreview}
								onChange={({ fileList: newFileList }) => {
									// Filter out files larger than 1MB
									const filteredList = newFileList.filter((file) => file.size / 1024 / 1024 < 1);
									setFileList(filteredList); // Update state to exclude large files
								}}
							>
								{fileList.length >= 8 ? null : uploadButton}
							</Upload>
						</Form.Item>
						<div style={{ width: '100%', justifyItems: 'center' }}>
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
						</div>
						{/*__________Button__________ */}
						<div className='submit-button' style={{ textAlign: 'right' }}>
							<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
								<Button htmlType='button' onClick={onReset} style={{ margin: '0px 5px' }}>
									Hủy
								</Button>
								<Button htmlType='submit' style={{ margin: '0px 5px' }}>
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

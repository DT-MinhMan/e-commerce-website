'use client';
// react
import React, { useEffect, useState } from 'react';
import product from '../../../api/apiList/product';
import dayjs from 'dayjs';
import _, { isEmpty, get } from 'lodash';

// css
import './edit-product.css';
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
	Modal,
} from 'antd';

import { DownloadOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useSearchParams, useRouter } from 'next/navigation';
const { Title } = Typography;
const { Option } = Select;
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
const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
const CreateInfo = () => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const [productInfo, setProductInfo] = useState({});
	const [imageList, setImageList] = useState([]);
	const [deletedImages, setDeletedImages] = useState([]); // Track deleted imagesconst [imageList, setImageList] = useState([...productData.image]);
	const navigation = useSearchParams();
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [fileList, setFileList] = useState([]);
	// useEffect
	useEffect(() => {
		getInfo();
	}, []);
	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

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
	const getInfo = async (items) => {
		try {
			setLoading(true);
			const res = await product.info_product({ id: navigation.get('id') });
			if (res) {
				const foundProductData = _.get(res, 'data', {});
				let images = _.get(foundProductData, 'image', []);
				const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
				images = images?.map((dt) => {
					return `${baseUrl}/${dt}`;
				});
				setProductInfo({
					...foundProductData,
					image: images,
				});
				setImageList(images);
				// Set init value
				form.setFieldValue('id', foundProductData?.id);
				form.setFieldValue('name', foundProductData?.name);
				form.setFieldValue('description', foundProductData?.description);
				form.setFieldValue('price', foundProductData?.price);
				form.setFieldValue('status', foundProductData?.status);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	const handleImageChange = (info) => {
		const updatedImageList = info.fileList?.map((file) => file.url || file.thumbUrl);
		setImageList(updatedImageList);

		// Detect deleted images
		const removedImages = productInfo.image.filter((img) => !updatedImageList.includes(img));
		setDeletedImages(removedImages);
	};

	const onFinish = async (values) => {
		try {
			// setLoading(true);
			const body = {};
			// Map details
			let details = [];
			// Iterate over the input data
			Object.keys(values).forEach((key) => {
				// Extract the id from the key
				const [type, id] = key.split('_');
				// Check for 'qty' and 'status' and collect the corresponding values
				if (type === 'qty') {
					const statusKey = `status_${id}`;
					if (values[statusKey]) {
						details.push({
							id,
							qty: values[key],
							status: values[statusKey],
						});
					}
				}
			});
			const productDetails = _.get(productInfo, 'details');
			// Validate details
			let updatedDetails = [];
			for (const detail of details) {
				const id = _.get(detail, 'id', '');
				const qty = _.get(detail, 'qty', '');
				const status = _.get(detail, 'status', '');
				// filter details
				const productDetail = productDetails.filter((dt) => dt?.id === id)[0];
				let preparedUpdate = {};
				if (productDetail?.status !== status) {
					preparedUpdate['status'] = status;
				}
				if (productDetail?.qty !== qty) {
					preparedUpdate['qty'] = qty;
				}
				if (!_.isEmpty(preparedUpdate)) {
					updatedDetails.push({
						id,
						...preparedUpdate,
					});
				}
			}
			const validate_file = [];
			for (const file of fileList) {
				validate_file.push(await getBase64(file?.originFileObj));
			}
			if (!_.isEmpty(validate_file)) {
				body['addImages'] = validate_file;
			}
			if (!_.isEmpty(deletedImages)) {
				let parseImage = [];
				// remove baseUrl
				for (const img of deletedImages) {
					const urlObj = new URL(img);
					parseImage.push(urlObj.pathname.slice(1));
				}
				body['deleteImages'] = parseImage;
			}
			// Get other form vale
			const name = _.get(values, 'name', '');
			const price = _.get(values, 'price', 0);
			const description = _.get(values, 'description', '');
			const status = _.get(values, 'status', '');
			if (name !== productInfo?.name) {
				body['name'] = name;
			}
			if (price !== productInfo?.price) {
				body['price'] = price;
			}
			if (description !== productInfo?.description) {
				body['description'] = description;
			}
			if (status !== productInfo?.status) {
				body['status'] = status;
			}
			if (_.isEmpty(body) && _.isEmpty(updatedDetails)) {
				notification.error({
					description: 'Không có thông tin thay đổi',
					duration: 4,
				});
			} else {
				Modal.confirm({
					title: 'Xác nhận',
					content: 'Bạn có chắc chắn muốn cập nhật thông tin sản phẩm này?',
					okText: 'Đồng ý', // Change OK text
					cancelText: 'Hủy', // Change Cancel text
					okButtonProps: {
						style: {
							borderColor: 'lightGrey',
							color: 'black',
						},
					},
					onOk: async () => {
						setLoading(true);
						if (!_.isEmpty(body)) {
							const res = await product.edit_product({
								id: _.get(values, 'id', ''),
								...body,
							});
							// console.log(body);
							if (res) {
								if (res.code == 0) {
									notification.success({
										description: 'Cập nhật sản phẩm thành công',
										duration: 4,
									});
									router.push(`/product/get-list`);
								} else {
									notification.error({
										description: res.message,
										duration: 4,
									});
								}
							}
						}
						if (!_.isEmpty(updatedDetails)) {
							for (const detail of updatedDetails) {
								const res = await product.edit_product_details({
									...detail,
								});
								if (res) {
									if (res.code == 0) {
										notification.success({
											description: 'Cập nhật chi tiết sản phẩm thành công',
											duration: 4,
										});
									} else {
										notification.error({
											description: res.message,
											duration: 4,
										});
									}
								}
							}
						}
						setLoading(false);
					},
					onCancel() {
						// Do nothing if the user cancels
					},
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Spin spinning={loading}>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}> Cập nhật thông tin sản phẩm </Title>
			<div
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
					padding: '20px',
					justifyItems:'center'
				}}
			>
				<Form
					form={form}
					layout='horizontal'
					onFinish={onFinish}
					style={{
						width: '100%',
						maxWidth: '900px',
						border: '1px solid #f0f0f0',
						padding: '20px',
						backgroundColor: '#fff',
						borderRadius: '8px',
					}}
				>
					<Row gutter={16} style={{ margin: '3px 0px' }}>
						<Form.Item label='Mã sản phẩm' name='id'>
							<Input style={{ pointerEvents: 'none' }} />
						</Form.Item>
					</Row>
					<Row gutter={16} style={{ margin: '3px 0px' }}>
						<Form.Item
							label='Tên sản phẩm'
							name='name'
							rules={[
								{
									required: true,
									message: 'Tên sản phẩm đang trống',
								},
							]}
						>
							<Input />
						</Form.Item>
					</Row>
					<Row gutter={16} style={{ margin: '3px 0px' }}>
						<Form.Item label='Mô tả' name='description'>
							<Input />
						</Form.Item>
					</Row>
					<Row gutter={16} style={{ margin: '3px 0px' }}>
						<Form.Item
							label='Giá thành'
							name='price'
							rules={[
								{ required: true, message: 'Vui lòng nhập giá thành!' }, // Required field
								{ type: 'number', min: 0, message: 'Giá thành phải là số và không được nhỏ hơn 0!' }, // Min constraint
							]}
						>
							<InputNumber min={0} />
						</Form.Item>
					</Row>
					<Row gutter={16} style={{ margin: '3px 0px' }}>
						<Form.Item label='Trạng thái' name='status'>
							<Select>
								<Option value='active'>Hoạt động</Option>
								<Option value='in_active'>Tạm khóa</Option>
								<Option value='deleted'>Đã xóa</Option>
							</Select>
						</Form.Item>
					</Row>
					<div
						style={{
							margin: '3px 0px',
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							overflow: 'auto',
						}}
					>
						<Form.Item label='Hình ảnh sản phẩm:' name='old-images'>
							<Upload
								listType='picture-card'
								fileList={imageList?.map((img) => ({ url: img }))}
								onChange={handleImageChange}
							></Upload>
						</Form.Item>
					</div>
					<div
						style={{
							margin: '3px 0px',
							width: '100%',
							display: 'flex',
							flexDirection: 'row',
							overflow: 'auto',
						}}
					>
						<Form.Item label='Thêm hình ảnh:' name='new-images'>
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
					</div>
					<Row
						gutter={16}
						style={{
							margin: '3px 0px',
						}}
					>
						<p>Chi tiết sản phẩm:</p>
					</Row>
					{productInfo.details?.map((detail, index) => (
						<Card key={index} gutter={16} style={{ margin: '3px 0px' }}>
							<Row gutter={16} style={{ margin: '3px 0px', width: '100%' }}>
								<Col span={12}>
									<p>Màu sắc: {detail?.color?.name}</p>
								</Col>
								<Col span={12}>
									<p>Kích cỡ: {detail?.size?.name}</p>
								</Col>
							</Row>
							<Row gutter={16} style={{ margin: '3px 0px', width: '100%' }}>
								<Col span={12}>
									<Form.Item label={`Số lượng`} name={`qty_${detail?.id}`} initialValue={detail?.qty}>
										<InputNumber min={0} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label={`Trạng thái`} name={`status_${detail?.id}`} initialValue={detail?.status}>
										<Select>
											<Option value='active'>Hoạt động</Option>
											<Option value='in_active'>Tạm khóa</Option>
											<Option value='deleted'>Đã xóa</Option>
										</Select>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					))}

					<Form.Item className='flex justify-end'>
						<Button htmlType='submit'>Cập nhật</Button>
					</Form.Item>
				</Form>
			</div>
		</Spin>
	);
};
export default CreateInfo;
{
	/* Product Images */
}

'use client';
// react
import React, { useEffect, useState } from 'react';
import _, { isEmpty, get } from 'lodash';
import product from '../../../api/apiList/product';
import cart from '../../../api/apiList/cart';

import { CaretUpOutlined } from '@ant-design/icons';
import getStatus from '../../../utils/helpers';
// css
import './search-product.css';

// antd
import {
	Card,
	Row,
	Col,
	Typography,
	notification,
	Divider,
	Select,
	Button,
	Image,
	Form,
	Input,
	InputNumber,
} from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
const { Title, Text } = Typography;
const { Option } = Select;

const CreateInfo = () => {
	// useState
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [productInfo, setProductInfo] = useState({});
	const [productSizes, setProductSizes] = useState([]);
	const [productColors, setProductColors] = useState([]);
	const [filterDetails, setFilterDetails] = useState([]);
	const [availaleNumber, setAvailaleNumber] = useState([]);
	const [mainImage, setMainImage] = useState('');
	const [selectedColor, setselectedColor] = useState('');
	const [selectedSize, setSelectedSize] = useState('');
	const [selectedDetail, setSelectedDetail] = useState('');
	const [form] = Form.useForm();
	const navigation = useSearchParams();
	// useEffect
	useEffect(() => {
		getInfo();
	}, []);
	// functions
	const getInfo = async (items) => {
		try {
			setLoading(true);
			const res = await product.info_product({ id: navigation.get('id') });
			if (res) {
				const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
				const foundProductData = _.get(res, 'data', {});
				// Map images
				let images = _.get(foundProductData, 'image', []);
				images = images?.map((dt) => {
					return `${baseUrl}/${dt}`;
				});
				setAvailaleNumber(foundProductData?.totalQty);
				setFilterDetails(foundProductData?.details);
				// Map product details
				setProductInfo({
					...foundProductData,
					image: images,
				});
				setMainImage(images[0]);
				const colors = foundProductData?.details
					?.map((d) => {
						return {
							label: d?.color?.name,
							value: d?.color?.id,
						};
					})
					?.filter((value, index, self) => self.findIndex((color) => color.value === value.value) === index);
				setProductColors(colors);
				const sizes = foundProductData?.details
					?.map((d) => {
						return {
							label: d?.size?.name,
							value: d?.size?.id,
						};
					})
					?.filter((value, index, self) => self.findIndex((size) => size.value === value.value) === index);
				setProductSizes(sizes);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const handleColorChange = (value) => {
		// Init total
		let newTotal = 0;
		// Go filter details by color value
		const filteredDetails = filterDetails?.filter((dt) => dt?.color?.id === value);
		if (selectedSize == '') {
			const newSizes = filteredDetails?.map((d) => {
				newTotal += d?.qty;
				return {
					label: d?.size?.name,
					value: d?.size?.id,
				};
			});
			setselectedColor(value);
			setProductSizes(newSizes);
			form.setFieldValue('size', undefined);
		} else {
			const seletedDetails = filteredDetails?.filter((d) => d?.size?.id === selectedSize)[0];
			newTotal = seletedDetails?.qty;
			setSelectedDetail(seletedDetails?.id);
		}
		setAvailaleNumber(newTotal);
	};
	const handleSizeChange = (value) => {
		// Init total
		let newTotal = 0;
		// Go filter color by size value
		const filteredDetails = filterDetails?.filter((dt) => dt?.size?.id === value);

		if (selectedColor == '') {
			const newColors = filteredDetails?.map((d) => {
				newTotal += d?.qty;
				return {
					label: d?.color?.name,
					value: d?.color?.id,
				};
			});
			setSelectedSize(value);
			setProductColors(newColors);
			form.setFieldValue('color', undefined);
		} else {
			const seletedDetails = filteredDetails?.filter((d) => d?.color?.id === selectedColor)[0];
			newTotal = seletedDetails?.qty;
			setSelectedDetail(seletedDetails?.id);
		}
		setAvailaleNumber(newTotal);
	};
	const formHandle = async () => {
		if (!localStorage.getItem('token')) {
			router.push(`/login`); // Navigate to the product details page
		} else {
			// Go add to cart
			const qty = form.getFieldValue('qty');
			const res = await cart.create_cart({
				productQty: qty,
				productDetails: selectedDetail,
			});
			if (res) {
				if (res.code == 0) {
					notification.success({
						description: 'Đã thêm sản phẩm vào giỏ hàng',
						duration: 4,
					});
					form.resetFields();
					setSelectedDetail('');
					setselectedColor('');
					setSelectedSize('');
				} else {
					notification.error({
						description: res.message,
						duration: 4,
					});
				}
				setLoading(false);
			}
		}
	};
	return (
		<div className='container'>
			<div style={{ padding: '24px' }}>
				<Row gutter={[16, 16]}>
					{/* Image Section */}
					<Col xs={24} md={9}>
						<Image src={mainImage} alt='Main Product' style={{ width: '100%', marginBottom: '16px' }} />
						<Row gutter={[8, 8]}>
							{productInfo?.image?.map((img, index) => (
								<Col key={index} span={6}>
									<Image
										src={img}
										alt={`Thumbnail ${index + 1}`}
										preview={false}
										style={{
											cursor: 'pointer',
											border: mainImage === img ? '1px solid #1890ff' : '1px solid #d9d9d9',
										}}
										onClick={() => setMainImage(img)}
									/>
								</Col>
							))}
						</Row>
					</Col>

					{/* Product Details */}
					<Col xs={24} md={15}>
						<Card bordered={false}>
							<Form form={form} layout='vertical' onFinish={formHandle}>
								<Title level={3}>{productInfo.name}</Title>
								<Text type='secondary'>{productInfo.description}</Text>
								<Divider />
								<Title level={4} style={{ color: '#000000' }}>
									{new Intl.NumberFormat('vi-VN').format(productInfo.price)} VNĐ
								</Title>
								<Divider />

								{/* Select Color */}
								<Form.Item label='Màu:' name='color' rules={[{ required: true, message: 'Vui lòng chọn màu!' }]}>
									<Select
										placeholder='Chọn màu'
										style={{ width: '100%' }}
										onChange={(value) => handleColorChange(value)}
									>
										{productColors?.map((productColors) => (
											<Option key={productColors.value} value={productColors.value}>
												{productColors.label}
											</Option>
										))}
									</Select>
								</Form.Item>

								{/* Select Size */}
								<Form.Item label='Kích cỡ:' name='size' rules={[{ required: true, message: 'Vui lòng chọn kích cỡ!' }]}>
									<Select
										placeholder='Chọn kích cỡ'
										style={{ width: '100%' }}
										onChange={(value) => handleSizeChange(value)}
										disabled={selectedColor !== '' ? false : true}
									>
										{productSizes?.map((productSizes) => (
											<Option key={productSizes.value} value={productSizes.value}>
												{productSizes.label}
											</Option>
										))}
									</Select>
								</Form.Item>

								<Text style={{ display: 'block', margin: '8px 0px' }}>Số lượng: (Còn lại: {availaleNumber})</Text>
								<Form.Item name='qty' rules={[{ required: true, message: 'Vui lòng chọn số lượng' }]}>
									<InputNumber min={0} max={availaleNumber} />
								</Form.Item>

								{/* Buy Button */}
								<Form.Item>
									<Button style={{ float: 'right' }} htmlType='submit'>
										Thêm vào giỏ hàng
									</Button>
								</Form.Item>
							</Form>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	);
};
export default CreateInfo;

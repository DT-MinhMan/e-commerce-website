'use client';
import React, { useEffect, useState, useCallback } from 'react';
import _, { isEmpty } from 'lodash';
import cart from '../../../api/apiList/cart';
import payment from '../../../api/apiList/payment';
import order from '../../../api/apiList/order';

import { CaretUpOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';

// css
import './search-product.css';
// antd
import {
	Table,
	Checkbox,
	InputNumber,
	Button,
	Space,
	notification,
	Modal,
	Divider,
	Typography,
	Row,
	Col,
	Form,
	Input,
	Select,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
const { Title, Text } = Typography;
const CreateInfo = () => {
	// useState
	const router = useRouter();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [listCart, setListCart] = useState([]); // List of cart items
	const [listPaymentMethod, setListPaymentMethod] = useState([]); // List of cart items
	const [listUserPayments, setListUserPayments] = useState([]); // List of cart items
	const [filterUserPayments, setFilterUserPayments] = useState([]); // List of cart items
	const [totalCost, setTotalCost] = useState(0); // Total cost of selected items
	const navigation = useSearchParams();

	// useEffect to handle updates and recalculate total cost
	useEffect(() => {
		getListCart({});
		getListUserPayment({});
	}, []); // Fetch initial list on component mount

	const columns = [
		{
			title: 'Sản Phẩm',
			dataIndex: 'product',
			align: 'center',
			key: 'product',
			width: '35%',
			render: (product, record) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img
						src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product?.img}`}
						alt={product?.name}
						style={{ width: '35%', marginRight: 10 }}
					/>
					<div style={{ textAlign: 'left' }}>
						<div style={{ fontWeight: 'bold' }}>{product?.name}</div>
						<div>
							Phân Loại:
							<br />- Màu: {record?.color}
							<br />- Size: {record?.size}
						</div>
					</div>
				</div>
			),
		},
		{
			title: 'Đơn Giá',
			dataIndex: 'product',
			align: 'center',
			key: 'price',
			width: '15%',
			render: (product) => (
				<span style={{ color: '#000000' }}>{new Intl.NumberFormat('vi-VN').format(product.price)}</span>
			),
		},
		{
			title: 'Số Lượng',
			dataIndex: 'qty',
			align: 'center',
			key: 'qty',
			width: '10%',
			render: (qty, record) => <span style={{ color: '#000000' }}>{qty}</span>,
		},
		{
			title: 'Tạm tính',
			dataIndex: 'total',
			align: 'center',
			key: 'total',
			width: '40%',
			render: (_, record) => (
				<span style={{ color: '#000000' }}>
					{new Intl.NumberFormat('vi-VN').format(record?.qty * record?.product?.price)}
				</span>
			),
		},
	];
	// Fetch list of cart items
	const getListCart = async () => {
		try {
			const carts = JSON.parse(navigation.get('items'));
			setLoading(true);
			const res = await cart.list_cart({
				id: carts,
			});
			if (res) {
				const data = res?.data;
				setListCart(data);
				let total = 0;
				for (const cart of data) {
					total += cart?.qty * cart?.product?.price;
				}
				setTotalCost(total);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const getListUserPayment = async () => {
		try {
			setLoading(true);
			const res = await payment.list_user_payment({
				limit: 100,
			});
			if (res) {
				const data = res?.data;
				setListUserPayments(data);
				let filterUserPaymentMethods = {};
				for (const payment of data) {
					const paymentId = _.get(payment, 'payment_method_id', '');
					const paymentName = _.get(payment, 'payment_method_name', '');
					if (_.get(filterUserPaymentMethods, paymentId, '') === '') {
						filterUserPaymentMethods[paymentId] = paymentName;
					}
				}
				let finalUserPaymentOption = [
					{
						key: 'default',
						label: 'Thanh toán khi nhận hàng',
					},
				];
				for (const key in filterUserPaymentMethods) {
					finalUserPaymentOption.push({
						key: key,
						label: filterUserPaymentMethods[key],
					});
				}
				setListPaymentMethod(finalUserPaymentOption);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const backHandle = () => {
		router.push('/cart/list');
	};
	const goOrderHandle = async () => {
		const carts = JSON.parse(navigation.get('items'));
		const formValue = form.getFieldValue();
		const address = _.get(formValue, 'address');
		const paymentMethod = _.get(formValue, 'payment-method');
		let body = {
			carts: carts,
			address: address,
		};
		if (paymentMethod != 'default') {
			const userPayment = _.get(formValue, 'user-payment-method');
			body['userPaymentMethod'] = userPayment;
		}
		try {
			setLoading(true);
			const res = await order.create_order(body);
			if (res?.code === 0) {
				notification.success({
					description: 'Tạo đơn hàng thành công',
					duration: 4,
				});
				router.push('/cart/list');
			} else {
				notification.error({
					description: 'Tạo đơn hàng thất bại',
					duration: 4,
				});
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const paymentMethodChangeHandle = (value) => {
		if (value === 'default') {
			setFilterUserPayments([]);
		} else {
			let userPayments = [];
			const filterPayments = listUserPayments.filter((dt) => dt?.payment_method_id === value);
			let showDetail = '';
			switch (value) {
				case '294b5e40-78e1-4958-80d6-c89a1a9e4d2a': // visa
					showDetail = 'cardNumber';
					break;
				default:
					break;
			}
			for (const userPayment of filterPayments) {
				const userPaymentDetails = _.get(userPayment, 'payment_details');
				const userPaymentName = _.get(userPayment, 'payment_method_name');
				const userPaymentId = _.get(userPayment, 'id');
				userPayments.push({
					key: userPaymentId,
					label: `${userPaymentName} - ${_.get(userPaymentDetails, showDetail, '')}`,
				});
			}
			setFilterUserPayments(userPayments);
		}
		form.resetFields(['user-payment-method']);
	};
	return (
		<div className='container'>
			<Title level={3} style={{ fontFamily: 'Times New Roman', textAlign: 'center' }}>
				{' '}
				Chi tiết đơn hàng
			</Title>
			<div className='table'>
				<Table rowKey='id' columns={columns} dataSource={listCart} loading={loading} pagination={false} />
			</div>
			<br />
			<Form form={form} onFinish={goOrderHandle}>
				<Row gutter={[16, 16]} justify='space-between' align='middle' style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={24}>
						<Text strong style={{ fontSize: '16px' }}>
							Địa chỉ nhận hàng:
						</Text>
					</Col>
					<Col xs={24} sm={24} style={{ textAlign: 'right' }}>
						<Form.Item name='address' rules={[{ required: true, message: 'Vui lòng nhập địa chỉ nhận hàng !' }]}>
							<Input.TextArea />
						</Form.Item>
					</Col>
				</Row>
				<Divider />
				<Row gutter={[16, 16]} justify='space-between' align='middle' style={{ marginBottom: '20px' }}>
					<Col xs={24} sm={12}>
						<Text strong style={{ fontSize: '16px' }}>
							Phương thức thanh toán:
						</Text>
					</Col>
					<Col xs={24} sm={12} style={{ textAlign: 'right' }}>
						<Form.Item
							name='payment-method'
							rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán !' }]}
						>
							<Select
								mode='single'
								style={{ width: '100%' }}
								placeholder='Chọn phương thức'
								onChange={paymentMethodChangeHandle}
							>
								{listPaymentMethod?.map((paymentMethod) => (
									<Option key={paymentMethod.key} value={paymentMethod.key}>
										{paymentMethod.label}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>
				{_.isEmpty(filterUserPayments) === true ? null : (
					<Row justify='space-between' align='middle' style={{ marginBottom: '20px' }}>
						<Col xs={24} sm={12}>
							<Text strong style={{ fontSize: '16px' }}>
								Thanh toán bằng:
							</Text>
						</Col>
						<Col xs={24} sm={12} style={{ textAlign: 'right' }}>
							<Form.Item name='user-payment-method' rules={[{ required: true, message: 'Chưa chọn nơi thanh toán !' }]}>
								<Select mode='single' style={{ width: '100%' }} placeholder='Chọn nơi thanh toán'>
									{filterUserPayments?.map((paymentMethod) => (
										<Option key={paymentMethod.key} value={paymentMethod.key}>
											{paymentMethod.label}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
				)}
				<Divider />
				<div>
					<Row gutter={[16, 16]} justify='space-between' align='middle'>
						<Col xs={12} sm={12}>
							<Text style={{ fontSize: '16px' }}>Tổng tiền hàng</Text>
						</Col>
						<Col xs={12} sm={12} style={{ textAlign: 'right' }}>
							<Text>{new Intl.NumberFormat('vi-VN').format(totalCost)}</Text>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify='space-between' align='middle'>
						<Col xs={12} sm={12}>
							<Text style={{ fontSize: '16px' }}>Tổng tiền phí vận chuyển</Text>
						</Col>
						<Col xs={12} sm={12} style={{ textAlign: 'right' }}>
							<Text>{new Intl.NumberFormat('vi-VN').format(0)}</Text>
						</Col>
					</Row>
					<Row gutter={[16, 16]} justify='space-between' align='middle'>
						<Col xs={12} sm={12}>
							<Text style={{ fontSize: '16px' }}>Tổng cộng Voucher giảm giá</Text>
						</Col>
						<Col xs={12} sm={12} style={{ textAlign: 'right' }}>
							<Text style={{ color: '#ff4d4f' }}>{new Intl.NumberFormat('vi-VN').format(0)}</Text>
						</Col>
					</Row>
					<Divider />
					<Row gutter={[16, 16]} justify='space-between' align='middle'>
						<Col xs={12} sm={12}>
							<Title level={5} style={{ color: '#000', margin: 0 }}>
								Tổng thanh toán
							</Title>
						</Col>
						<Col xs={12} sm={12} style={{ textAlign: 'right' }}>
							<Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>
								{new Intl.NumberFormat('vi-VN').format(totalCost)}
							</Title>
						</Col>
					</Row>
				</div>
				<div className='buttons' style={{ float: 'right' }}>
					<Button name='cancel' style={{ margin: 10 }} onClick={backHandle}>
						Hủy
					</Button>
					<Button name='go-order' htmlType='submit' style={{ margin: 10 }}>
						Đặt hàng
					</Button>
				</div>
			</Form>
		</div>
	);
};

export default CreateInfo;

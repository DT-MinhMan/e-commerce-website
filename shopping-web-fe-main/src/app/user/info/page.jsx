'use client';

import React, { useEffect, useState } from 'react';
import user from '../../../api/apiList/user';
import payment from '../../../api/apiList/payment';
import AddUserPaymentModal from './addUserPaymentModal';
import EditUserPaymentModal from './editUserPaymentModal';
import _ from 'lodash';
import { Card, Row, Col, Divider, Typography, Table, Image, Button, Modal, notification } from 'antd';
import { EditOutlined, EyeOutlined, EyeInvisibleOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;

const CreateInfo = () => {
	const [loading, setLoading] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [listUserPayment, setListUserPayment] = useState([]);
	const [addPaymentModal, setAddPaymentModal] = useState(false);
	const [cvvVisibility, setCvvVisibility] = useState({});
	const [addedNewUserPayment, setAddedNewUserPayment] = useState({});
	const [editedUserPayment, setEditedUserPayment] = useState({});
	const [editPaymentModal, setEditPaymentModal] = useState(false);
	const [selectedUserPayment, setSelectedNewUserPayment] = useState({});

	useEffect(() => {
		getUserInfo();
		getListPayment();
	}, []);

	useEffect(() => {
		getListPayment();
	}, [addedNewUserPayment, editedUserPayment]);

	const getUserInfo = async () => {
		try {
			setLoading(true);
			const res = await user.user_info({});
			if (res) {
				if (res?.code === 0) {
					// set user info
					setUserInfo(res?.data);
				}
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const toggleCvvVisibility = (key) => {
		setCvvVisibility((prev) => ({
			...prev,
			[key]: !prev[key],
		}));
	};
	const getListPayment = async () => {
		try {
			setLoading(true);
			const res = await payment.list_user_payment({});
			if (res) {
				if (res?.code === 0) {
					// set user payments
					setListUserPayment(res?.data);
				}
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const addPaymentHandle = () => {
		setAddPaymentModal(true);
	};
	const editHandle = async (record) => {
		setEditPaymentModal(true);
		setSelectedNewUserPayment(record);
	};
	const deletehandle = async (userPaymentId) => {
		Modal.confirm({
			content: `Bạn có chắc muốn loại bỏ phương thức thanh toán này ?`,
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
				const res = await payment.edit_user_payment({
					id: userPaymentId,
					status: 'deleted',
				});
				if (res) {
					if (res?.code === 0) {
						// set user payments
						notification.success({
							description: 'Xóa phương thức thanh toán thành công',
							duration: 4,
						});
						setEditedUserPayment(res?.data);
					} else {
						notification.error({
							description: 'Xóa phương thức thanh toán thất bại',
							duration: 4,
						});
					}
				}
				setLoading(false);
			},
		});
	};

	const columns = [
		{
			align: 'center',
			title: 'Phương thức',
			dataIndex: 'payment_method_name',
			key: 'payment_method_name',
			width: '15%',
		},
		{
			align: 'center',
			title: 'Số thẻ',
			dataIndex: ['payment_details', 'cardNumber'],
			key: 'cardNumber',
			width: '30%',
		},
		{
			align: 'center',
			title: 'Ngày phát hành',
			dataIndex: ['payment_details', 'validFrom'],
			key: 'validFrom',
			width: '15%',
		},
		{
			align: 'center',
			title: 'Ngày hết hạn',
			dataIndex: ['payment_details', 'expriedAt'],
			key: 'expriedAt',
			width: '15%',
		},
		{
			align: 'center',
			title: 'CVV',
			key: 'cvv',
			width: '15%',
			render: (_, record) => (
				<span>
					{cvvVisibility[record.id] ? record.payment_details.cvv : '***'}
					<Button type='link' style={{ color: 'darkGrey' }} onClick={() => toggleCvvVisibility(record.id)}>
						{cvvVisibility[record.id] ? <EyeOutlined /> : <EyeInvisibleOutlined />}
					</Button>
				</span>
			),
		},
		{
			align: 'center',
			title: 'Cập nhật',
			align: 'center',
			width: '5%', // 44
			render: (record) => {
				return (
					<Button
						icon={<EditOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => editHandle(record)}
					/>
				);
			},
		},
		{
			align: 'center',
			title: 'Xoá',
			align: 'center',
			width: '5%', // 44
			render: (record) => {
				return (
					<Button
						icon={<DeleteOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => deletehandle(record?.id)}
					/>
				);
			},
		},
	];
	// User data
	return (
		<div className='container' style={{ padding: '20px' }}>
			<Title level={3} style={{ fontFamily: 'Times New Roman', textAlign: 'center' }}>
				Thông tin người dùng
			</Title>
			<Row gutter={[16, 16]}>
				{/* Image Section */}
				{/* <Col xs={24} md={3}> */}
					{/* <Image src='/main' alt='Ảnh người dùng' style={{ width: '100%', marginBottom: '16px' }} /> */}
				{/* </Col> */}

				{/* Product Details */}
				<Col xs={24} md={21}>
					<span>Email: {userInfo?.email}</span>
					<br />
					<span>Phone: {userInfo?.phone}</span>
				</Col>
			</Row>
			<Divider />
			<div className='payment' style={{ margin: 10 }}>
				Thông tin thanh toán:
				<Button style={{ float: 'right' }} onClick={addPaymentHandle}>
					{' '}
					Thêm{' '}
				</Button>
			</div>
			<Table dataSource={listUserPayment} columns={columns} rowKey={(record, index) => index} pagination={false} />
			<AddUserPaymentModal
				addPaymentModal={addPaymentModal}
				setAddPaymentModal={setAddPaymentModal}
				setAddedNewUserPayment={setAddedNewUserPayment}
			/>
			<EditUserPaymentModal
				editPaymentModal = {editPaymentModal}
				setEditPaymentModal={setEditPaymentModal}
				setEditedUserPayment={setEditedUserPayment}
				selectedUserPayment = {selectedUserPayment}
			/>
		</div>
	);
};

export default CreateInfo;

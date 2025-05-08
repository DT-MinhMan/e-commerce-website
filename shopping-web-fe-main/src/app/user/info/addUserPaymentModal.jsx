'use client';
// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import payment from '../../../api/apiList/payment';
import _ from 'lodash';

// antd
import { Modal, Button, DatePicker, Form, Input, InputNumber, Typography, Select, notification } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;

const paymentFieldLabel = {
	validFrom: 'Ngày phát hành',
	expriedAt: 'Ngày hết hạn',
	cardNumber: 'Số thẻ',
	cvv: 'CVV',
};
const paymentMethodRules = {
	validFrom: [
		{ required: true, message: 'Vui lòng nhập ngày phát hành!' },
		{
			pattern: /^\d{4}-\d{2}-\d{2}$/,
			message: 'Ngày phát hành phải có định dạng YYYY-MM-DD!',
		},
	],
	expriedAt: [
		{ required: true, message: 'Vui lòng nhập ngày hết hạn!' },
		{
			pattern: /^\d{4}-\d{2}-\d{2}$/,
			message: 'Ngày hết hạn phải có định dạng YYYY-MM-DD!',
		},
	],
	cardNumber: [
		{ required: true, message: 'Vui lòng nhập số thẻ!' },
		{
			pattern: /^\d{16}$/,
			message: 'Số thẻ phải có 16 chữ số!',
		},
	],
	cvv: [
		{ required: true, message: 'Vui lòng nhập CVV!' },
		{
			pattern: /^\d{3,4}$/,
			message: 'CVV phải có 3 hoặc 4 chữ số!',
		},
	],
};
const AddPaymentModal = ({ addPaymentModal, setAddPaymentModal, setAddedNewUserPayment}) => {
	// useState
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [listPaymentMethod, setListPaymentMethod] = useState([]);
	const [paymentRequiredField, setPaymentRequiredField] = useState([]);
	useEffect(() => {
		getListPaymentMethod();
	}, []);
	// useEffect
	const getListPaymentMethod = async () => {
		try {
			setLoading(true);
			// Go set filter before update
			const res = await payment.list_payment_method({
				limit: 100,
				status: 'active',
			});
			if (res) {
				// set list
				setListPaymentMethod(res?.data);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	// const filterOption = (input, option) => (option?.label ?? "").includes(input);
	const handleSubmit = async () => {
		const paymentId = form.getFieldValue('payment', '');
		let paymentDetails = {};
		for (const requiredField of paymentRequiredField) {
			const data = form.getFieldValue(requiredField?.key);
			paymentDetails[requiredField?.key] = data;
		}
		const body = {
			paymentMethod: paymentId,
			paymentDetails: paymentDetails,
		};
		const res = await payment.create_user_payment(body);
		if (res) {
			// set list
			if (res?.code === 0) {
				setAddedNewUserPayment(res?.data);
				notification.success({
					description: 'Thêm phương thức thanh toán thành công',
					duration: 4,
				});
			} else {
				notification.error({
					description: res?.message,
					duration: 4,
				});
			}
			
		}
		form.resetFields();
		setAddPaymentModal(false);
		setPaymentRequiredField([]);
	};

	const handleCancel = () => {
		form.resetFields();
		setPaymentRequiredField([]);
		setAddPaymentModal(false);
	};
	const handlePaymentMethodChange = async (value) => {
		// Go filter
		const requiredFields = _.get(
			listPaymentMethod.filter((dt) => dt?.id === value),
			'[0].required_details'
		);
		let requiredDetails = [];
		for (const paymentField of requiredFields) {
			requiredDetails.push({
				key: paymentField,
				label: _.get(paymentFieldLabel, paymentField, ''),
				rules: _.get(paymentMethodRules, paymentField, ''),
			});
		}
		setPaymentRequiredField(requiredDetails);
	};
	return (
		<Modal
			title='Thêm phương thức thanh toán'
			open={addPaymentModal}
			style={{ width: '70%', minWidth: '30%' }}
			footer={null}
			onCancel={handleCancel}
		>
			<Form
				labelCol={{
					span: 9,
				}}
				wrapperCol={{
					span: 15,
				}}
				key='add-payment-form'
				layout='horizontal'
				onFinish={handleSubmit}
				form={form}
				style={{
					maxWidth: '90%',
					height: '100%',
				}}
			>
				<Form.Item key='payment' name='payment' label='Phương thức'>
					<Select
						placeholder='Phương thức thanh toán'
						style={{ width: '100%' }}
						onChange={(value) => handlePaymentMethodChange(value)}
					>
						{listPaymentMethod?.map((paymentMethod) => (
							<Select.Option key={paymentMethod.id} value={paymentMethod.id}>
								{paymentMethod.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
				{paymentRequiredField?.map((requiredField) => (
					<Form.Item
						key={requiredField?.key}
						name={requiredField?.key}
						label={requiredField?.label}
						rules={requiredField?.rules}
					>
						<Input />
					</Form.Item>
				))}

				<Form.Item>
					<Button htmlType='submit' style={{ float: 'right' }}>
						Tạo
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default AddPaymentModal;

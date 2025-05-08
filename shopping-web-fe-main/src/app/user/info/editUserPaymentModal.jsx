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
const EditUserPaymentModal = ({ editPaymentModal, setEditPaymentModal, setEditedUserPayment, selectedUserPayment }) => {
	// useState
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [listPaymentMethodInfo, setPaymentMethodInfo] = useState([]);
	const [paymentRequiredField, setPaymentRequiredField] = useState([]);
	useEffect(() => {
		getPaymentMethodInfo();
	}, [editPaymentModal]);
	// useEffect
	const getPaymentMethodInfo = async () => {
		try {
			setLoading(true);
			// Go set filter before update
			const res = await payment.list_payment_method({
				id: selectedUserPayment?.payment_method_id,
			});
			if (res) {
				const data = res?.data[0];
				// set list
				setPaymentMethodInfo(data);
				let requiredDetails = [];
				for (const paymentField of data?.required_details) {
					requiredDetails.push({
						key: paymentField,
						label: _.get(paymentFieldLabel, paymentField, ''),
						rules: _.get(paymentMethodRules, paymentField, ''),
					});
					// set form value
					form.setFieldValue(paymentField, _.get(selectedUserPayment, `payment_details.${paymentField}`));
				}
				form.setFieldValue('payment', _.get(selectedUserPayment, `payment_method_name`));
				setPaymentRequiredField(requiredDetails);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	// const filterOption = (input, option) => (option?.label ?? "").includes(input);
	const handleSubmit = async () => {
		// Get the current form values
		const currentValues = _.omit(form.getFieldsValue(), 'payment');
		const initialValues = selectedUserPayment?.payment_details || {};
		// Compare values to check if there's any difference
		const hasChanges = _.isEqual(initialValues, currentValues);
		if (hasChanges) {
			notification.info({
				description: 'Không có thay đổi nào được thực hiện.',
				duration: 4,
			});
		} else {
			// Prepare the body for API request
			const body = {
				id: selectedUserPayment?.id,
				paymentDetails: currentValues,
			};
			const res = await payment.edit_user_payment(body);
			if (res) {
				// set list
				if (res?.code === 0) {
					setEditedUserPayment(res?.data);
					notification.success({
						description: 'Cập nhật phương thức thanh toán thành công',
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
			setEditPaymentModal(false);
			setPaymentRequiredField([]);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setEditPaymentModal(false);
		setPaymentRequiredField([]);
	};

	return (
		<Modal
			title='Cập nhật phương thức thanh toán'
			open={editPaymentModal}
			style={{ width: '70%', minWidth: '30%', textAlign: 'center' }}
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
					<Input style={{ pointerEvents: 'none' }} />
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
						Cập nhật
					</Button>
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default EditUserPaymentModal;

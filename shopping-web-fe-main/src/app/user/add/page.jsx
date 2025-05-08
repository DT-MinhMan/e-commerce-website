'use client';
// react
import React, { useEffect, useState } from 'react';
import user from '../../../api/apiList/user';
// css
import './add-user.css';
// antd
import {
	Button,
	Form,
	Input,
	Typography,
	notification,
	Spin,
	Select,
	Card
} from 'antd';
import { DownloadOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { size } from 'lodash';
const { Title } = Typography;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 14 },
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

const CreateInfo = () => {
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	// useEffect
	useEffect(() => {
		// listProductDetails();
	}, []);

	const onFinish = async (values) => {
		try {
			// setLoading(true);
			const res = await user.create_user(values);
			if (res) {
				if (res.code == 0) {
					notification.success({
						description: 'Thêm người dùng thành công!',
						duration: 4,
					});
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
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Nhập thông người dùng</Title>
			<Card>
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
							{/*__________Email__________ */}
							<Form.Item name='email' label='Email' rules={[{ type: 'email', required: true }]}>
								<Input />
							</Form.Item>

							{/*__________role__________ */}
							<Form.Item label='Vai trò' name='role'>
								<Select
									style={{ width: '100%' }}
									options={[
										{ value: 'user', label: 'Khách hàng' },
										{ value: 'staff', label: 'Nhân viên' },
										{ value: 'admin', label: 'Quản trị viên' },
									]}
								/>
							</Form.Item>

							{/*__________status__________ */}
							<Form.Item label='Trạng thái' name='status'>
								<Select
									style={{ width: '100%' }}
									options={[
										{ value: 'active', label: 'Hoạt động' },
										{ value: 'in_active', label: 'Tạm khóa' },
										{ value: 'deleted', label: 'Đã xóa' },
									]}
								/>
							</Form.Item>

							{/*__________Phone__________ */}
							<Form.Item name='phone' label='Số điện thoại' rules={[{ type: 'phone', required: true }]}>
								<Input pattern='[0-9]{10,11}' maxLength={11} message='Số điện thoại phải là 10 số' />
							</Form.Item>

							{/* __________Password__________ */}
							<Form.Item
								name='password'
								label='Mật khẩu'
								rules={[
									{
										type: 'password',
										required: true,
										min: 6,
									},
								]}
							>
								<Input.Password />
							</Form.Item>
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
			</Card>
		</div>
	);
};
export default CreateInfo;

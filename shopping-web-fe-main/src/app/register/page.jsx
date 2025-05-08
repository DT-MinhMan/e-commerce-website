'use client';
// react
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthenticationContext';
// css
import './register.css';
// antd
import { Button, Form, Input, InputNumber, DatePicker, Typography, notification, Spin, Card, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
const { Title } = Typography;

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 14 },
};

const validateMessages = {
	required: '${label} đang trống',
};

const CreateInfo = () => {
	const router = useRouter();
	const { onSignUp } = useAuth();
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();

	const createInfo = async () => {
		try {
			setLoading(true);
			// Get form value
			const email = form.getFieldValue('email');
			const phone = form.getFieldValue('phone');
			const password = form.getFieldValue('password');
			const confirmPassword = form.getFieldValue('confirmPassword');
			if (password !== confirmPassword) {
				notification.error({
					description: 'Mật khẩu không khớp',
					duration: 4,
				});
			} else {
				const body = {
					email,
					password,
					phone,
				};
				//Nhớ vào Layout của component đổi đường dẫn
				const res = await axios.post('http://127.0.0.1:8000/api/user/register', body);
				const dataForm = res.config?.data;
				if (res?.data?.code == 0) {
					notification.success({
						description: 'Tạo tài khoản thành công !',
						duration: 4,
					});
					onSignUp(dataForm?.email, dataForm?.password, dataForm?.phone);
					router.push('/login');
					setLoading(false);
				} else {
					notification.error({
						description: res?.data?.message ? res?.data?.message : 'Đăng ký thất bại !',
						duration: 4,
					});
				}
			}
			setLoading(false);
		} catch (error) {
			notification.error({
				description: 'Đã có lỗi xảy ra, xin vui lòng thử lại sau',
				duration: 4,
			});
		}
	};
	return (
		<div className='container'>
			<Spin spinning={loading} tip={`Đang lấy thông tin !`}>
				<Card>
					<Typography style={{ margin: '1% 0% 5% 0%', fontSize: '1.7rem', textAlign: 'center' }}>Đăng ký</Typography>
					<div style={{ margin: '0% 10%' }}>
						<Form
							{...layout}
							form={form}
							name='nest-messages'
							onFinish={createInfo}
							style={{ maxWidth: '90%' }}
							validateMessages={validateMessages}
							// onValuesChange={valueChange}
						>
							{/*__________Email__________ */}
							<Form.Item
								name='email'
								label='Email'
								rules={[{ required: true }, { type: 'email', message: 'Email không hợp lệ!' }]}
							>
								<Input />
							</Form.Item>

							{/*__________Phone__________ */}
							<Form.Item
								name='phone'
								label='Số điện thoại'
								rules={[
									{ required: true },
									{ pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại phải là 10 hoặc 11 chữ số!' },
								]}
							>
								<Input pattern='[0-9]{10,11}' maxLength={11} message='Số điện thoại phải là 10 số' />
							</Form.Item>

							{/* __________Password__________ */}
							<Form.Item
								name='password'
								label='Mật khẩu'
								rules={[
									{
										required: true,
									},
									{ min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
								]}
							>
								<Input.Password />
							</Form.Item>

							{/* __________Confirm Password__________ */}
							<Form.Item
								name='confirmPassword'
								label='Nhập lại mật khẩu'
								rules={[
									{
										required: true,
										message: 'Vui lòng nhập lại mật khẩu!',
									},
									//Xét mật khẩu trên và dưới có khớp nhau không
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve();
											}
											return Promise.reject(new Error('Mật khẩu không khớp'));
										},
									}),
								]}
							>
								<Input.Password />
							</Form.Item>

							{/*__________Button__________ */}
							<div className='submit-button'>
								<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
									<Button htmlType='submit'>Đăng ký</Button>
								</Form.Item>
							</div>
						</Form>
					</div>
				</Card>
			</Spin>
		</div>
	);
};
export default CreateInfo;

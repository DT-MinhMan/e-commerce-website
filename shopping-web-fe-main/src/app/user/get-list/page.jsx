'use client';
// react
import React, { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import _, { isEmpty, get } from 'lodash';
import user from '../../../api/apiList/user';
import { LockOutlined, UnlockOutlined, EditOutlined, CloseOutlined } from '@ant-design/icons';
import getStatus from '../../../utils/helpers';
import dayjs from 'dayjs';

// css
import './search-company.css';

// antd
import { Button, Checkbox, Form, Input, Typography, Table, Row, Col, Modal, Select, notification } from 'antd';
const { Title } = Typography;

const CreateInfo = () => {
	// useState
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalUsers, setTotalUsers] = useState(0);
	const [filterValue, setFilterValue] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState({});
	const [editUserForm] = Form.useForm();

	// useEffect
	useEffect(() => {
		getList({ ...filterValue });
	}, [page, pageSize]);
	// functions
	const getList = async (items) => {
		try {
			setLoading(true);
			const params = {
				...items,
				page: page - 1,
				limit: pageSize,
			};
			const res = await user.list_user(params);
			if (res) {
				// set total user
				setTotalUsers(res?.pagination?.total);
				// set list
				setList(res?.data);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	// set pagingation
	const handleTableChange = async (pagination, filters, sorter) => {
		const newPage = pagination.current;
		const newPageSize = pagination.pageSize;
		if (newPage !== page) {
			setPage(newPage);
		}
		if (newPageSize !== pageSize) {
			setPageSize(newPageSize);
		}
	};
	const handleLockUnlock = async (userId, currentStatus) => {
		Modal.confirm({
			title: 'Xác nhận',
			content: 'Bạn có chắc chắn muốn cập nhật thông tin người dùng này?',
			okText: 'Đồng ý', // Change OK text
			cancelText: 'Hủy', // Change Cancel text
			okButtonProps: {
				style: {
					borderColor: 'lightGrey',
					color: 'black',
				},
			},
			onOk: async () => {
				try {
					const authUser = JSON.parse(localStorage.getItem('user'));
					const authUserId = authUser?.id;
					if (authUserId !== userId) {
						// Send a request to your backend to update the user's status
						const newStatus = currentStatus === 'active' ? 'in_active' : 'active';
						// Init body
						const body = {
							id: userId,
							status: newStatus,
						};
						setLoading(true);
						// Go update
						const res = await user.edit_user(body);
						// Validate status
						if (res) {
							// Validate action code
							if (res?.code != 0) {
								notification.error({
									message: 'Cập nhật người dùng thất bại !',
									duration: 4,
								});
							}
							getList({});
						} else {
							notification.error({
								message: 'Cập nhật người dùng thất bại !',
								duration: 4,
							});
						}
						setLoading(false);
						notification.success({
							message: 'Cập nhật người dùng thành công',
							duration: 4,
						});
					} else {
						notification.error({
							message: 'Không thể cập nhật trạng thái của chính mình !',
							duration: 4,
						});
					}
				} catch (error) {
					console.error(error);
					// Handle error, e.g., show an error message to the user
				}
			},
			onCancel() {
				// Do nothing if the user cancels
			},
		});
	};
	const showModal = (user) => {
		editUserForm.setFieldValue('id', user?.id);
		editUserForm.setFieldValue('email', user?.email);
		editUserForm.setFieldValue('phone', user?.phone);
		editUserForm.setFieldValue('role', user?.role);
		editUserForm.setFieldValue('status', user?.status);
		setSelectedUser({ ...user });
		setIsModalVisible(true);
	};

	const handleSubmit = async () => {
		// Get authen user
		const authUser = JSON.parse(localStorage.getItem('user'));
		const authUserId = authUser?.id;
		// Validate change value
		const id = selectedUser?.id;
		const phone = editUserForm.getFieldValue('phone');
		const role = editUserForm.getFieldValue('role');
		const status = editUserForm.getFieldValue('status');
		// Init updateValue
		let updateValue = {};
		if (selectedUser?.phone != phone) {
			updateValue['phone'] = phone;
		}
		if (selectedUser?.role != role) {
			updateValue['role'] = role;
		}
		if (selectedUser?.status != status) {
			updateValue['status'] = status;
		}
		if (authUserId === id && (_.get(updateValue, 'status', '') !== '' || _.get(updateValue, 'role', '') !== '')) {
			notification.error({
				message: 'Không thể cập nhật trạng thái hoặc vai trò của chính mình !',
				duration: 4,
			});
		} else {
			if (_.isEmpty(updateValue)) {
				// Alter update value
				notification.error({
					message: 'Không có thông tin thay đổi',
					duration: 4,
				});
			} else {
				// Handle form submission here
				setLoading(true);
				updateValue['id'] = id;
				// Go update
				const res = await user.edit_user(updateValue);
				// Validate status
				if (res) {
					// Validate action code
					if (res?.code != 0) {
						notification.error({
							message: 'Cập nhật người dùng thất bại !',
							duration: 4,
						});
					}
					getList({});
				} else {
					notification.error({
						message: 'Cập nhật người dùng thất bại !',
						duration: 4,
					});
				}
				setLoading(false);
				notification.success({
					message: 'Cập nhật người dùng thành công',
					duration: 4,
				});
			}
		}
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};
	// colums in data table
	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
			width: '10%', // 10
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			align: 'center',
			width: '10%', // 20
		},
		{
			title: 'Vai trò',
			dataIndex: 'role',
			key: 'role',
			align: 'center',
			width: '5%', // 25
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'phone',
			key: 'phone',
			align: 'center',
			width: '3%', // 28
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: '3%', // 31
			// render: (text) => getStatus.getStatus(text),
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'created_at',
			key: 'created_at',
			align: 'center',
			width: '5%', // 36
			render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
		},
		{
			title: 'Ngày cập nhật',
			dataIndex: 'updated_at',
			key: 'updated_at',
			align: 'center',
			width: '5%', // 41
			render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
		},
		{
			title: 'Khóa người dùng',
			align: 'center',
			width: '3%', // 44
			render: (record) => {
				return (
					<Button
						icon={
							record?.status === 'active' ? (
								<UnlockOutlined />
							) : record?.status === 'in_active' ? (
								<LockOutlined />
							) : (
								<CloseOutlined />
							)
						}
						disabled={record?.status === 'deleted'}
						// Add an onClick handler here to perform the unlock/lock action
						onClick={() => handleLockUnlock(record?.id, record?.status)}
					/>
				);
			},
		},
		{
			title: 'Cập nhật',
			align: 'center',
			width: '3%', // 44
			render: (record) => {
				return (
					<Button
						icon={<EditOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => showModal(record)}
					/>
				);
			},
		},
	];
	return (
		<div className='container'>
			<Modal
				title='Cập nhật thông tin người dùng'
				open={isModalVisible}
				style={{ width: '70%', minWidth: '30%', alignContent: 'center' }}
				onCancel={handleCancel}
				footer={null}
			>
				<Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} form={editUserForm} onFinish={handleSubmit}>
					{/* Form fields for editing user details */}
					<Form.Item label='ID' name='id'>
						<Input style={{ pointerEvents: 'none' }} />
					</Form.Item>
					<Form.Item label='Email' name='email'>
						<Input style={{ pointerEvents: 'none' }} />
					</Form.Item>
					<Form.Item
						label='Số điện thoại'
						name='phone'
						rules={[
							{
								pattern: /^[0-9]{10,11}$/, // Regex pattern for 10 or 11 digits
								message: 'Số điện thoại phải có 10 hoặc 11 chữ số!',
							},
						]}
					>
						<Input pattern='[0-9]{10,11}' maxLength={10} />
					</Form.Item>
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
					{/* ... other form items */}
					<Form.Item>
						<Button htmlType='submit' style={{ float: 'right' }}>
							Cập nhật
						</Button>
					</Form.Item>
				</Form>
			</Modal>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Quản lý người dùng</Title>
			<div style={{ margin: '5% 5%' }}>
				<SearchForm getList={getList} setPage={setPage} setFieldValue={setFilterValue} />
			</div>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Table
						columns={columns}
						dataSource={list}
						onChange={handleTableChange}
						pagination={{
							pageSize,
							current: page,
							total: totalUsers,
							showSizeChanger: true,
							pageSizeOptions: ['10', '20', '50', '100'],
						}}
						// tableLayout="auto"
						scroll={{ x: 2000, y: 1000 }}
					/>
				</Col>
			</Row>
		</div>
	);
};
export default CreateInfo;

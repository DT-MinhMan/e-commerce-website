'use client';
// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import order from '../../../api/apiList/order';
import getStatus from '../../../utils/helpers';
import _ from 'lodash';

// antd
import { Modal, Button, Row, Col, Typography, Divider, Card, Form, Input, Select, notification } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Option } = Select;
const EditModal = ({ editModalVisible, setEditModalVisible, selectedOrder, setPage, setFilterValue, filterForm }) => {
	// useState
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	form.setFieldValue('status', selectedOrder?.status);
	const handleCancel = () => {
		setEditModalVisible(false);
	};
	const handleSubmit = async () => {
		// Get the current form values
		const formValues = form.getFieldsValue();
		const status = _.get(formValues, 'status', '');
		// Init body
		let body = {};
		if (status != '' && selectedOrder?.status !== status) {
			body['status'] = status;
		}
		if (_.isEmpty(body)) {
			notification.info({
				description: 'Không có thay đổi nào được thực hiện.',
				duration: 4,
			});
		} else {
			const res = await order.edit_order_status({
				id: selectedOrder?.id,
				...body,
			});
			if (res) {
				// set list
				if (res?.code === 0) {
					notification.success({
						description: 'Cập nhật đơn hàng thành công',
						duration: 4,
					});
					setFilterValue({});
					filterForm.resetFields();
					setPage(1);
				} else {
					notification.error({
						description: res?.message,
						duration: 4,
					});
				}
			}
			form.resetFields();
			setEditModalVisible(false);
		}
	};

	return (
		<Modal
			title={
				<div className='modal-title' style={{ textAlign: 'center' }}>
					Chi tiết đơn hàng
				</div>
			}
			open={editModalVisible}
			style={{ maxWidth: '90%', width: '70%' }}
			onCancel={handleCancel}
			footer={null}
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
				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Mã đơn hàng:</strong> {selectedOrder?.id}
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Trạng thái đơn hàng:</strong>
							<span>
								<Form.Item name='status'>
									<Select
										// style={{ width: '100%' }}
										options={[
											{ value: 'toProgress', label: 'Đang xử lý' },
											{ value: 'toShip', label: 'Đang vận chuyển' },
											{ value: 'completed', label: 'Hoàn thành' },
											{ value: 'deleted', label: 'Đã hủy' },
										]}
									/>
								</Form.Item>
							</span>
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={12}>
						<p>
							<strong>Thành tiền:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder?.total)} VNĐ
						</p>
					</Col>
					<Col span={12}>
						<p>
							<strong>Đã thanh toán:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder?.prepaid)} VNĐ
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Còn lại:</strong> {new Intl.NumberFormat('vi-VN').format(selectedOrder?.remaining)} VNĐ
						</p>
					</Col>
				</Row>

				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '10px',
						marginBottom: '16px',
						overflowX: 'auto',
					}}
				>
					{selectedOrder.image?.map((detail, index) => (
						<Card key={index} style={{ width: 130, textAlign: 'center' }}>
							<Image width={80} src={detail} />
						</Card>
					))}
				</div>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Chi tiết đơn hàng:</strong>
						</p>
					</Col>
				</Row>

				{selectedOrder.details?.map((detail, index) => (
					<Card key={index} style={{ marginBottom: '16px' }}>
						<Row gutter={[16, 16]}>
							<Col span={24}>
								<p style={{ textAlign: 'center', fontWeight: 'bold' }}>{detail?.product_name}</p>
							</Col>
						</Row>
						<Divider />
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<p>
									<strong>Màu sắc:</strong> {detail?.product_color}
								</p>
							</Col>
							<Col span={12}>
								<p>
									<strong>Kích cỡ:</strong> {detail?.product_size}
								</p>
							</Col>
						</Row>
						<Row gutter={[16, 16]}>
							<Col span={12}>
								<p>
									<strong>Số lượng:</strong> {detail?.qty}
								</p>
							</Col>
							<Col span={12}>
								<p>
									<strong>Đơn giá:</strong> {new Intl.NumberFormat('vi-VN').format(detail?.product_price)} VNĐ
								</p>
							</Col>
						</Row>
					</Card>
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
export default EditModal;

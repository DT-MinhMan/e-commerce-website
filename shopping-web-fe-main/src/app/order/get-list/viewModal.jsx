'use client';
// react
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import payment from '../../../api/apiList/payment';
import getStatus from '../../../utils/helpers';
import _ from 'lodash';

// antd
import { Modal, Button, Row, Col, Typography, Divider, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ViewModal = ({ viewModalVisible, setViewModalVisible, selectedOrder }) => {
	// useState
	const [loading, setLoading] = useState(false);
	const handleCancel = () => {
		setViewModalVisible(false);
	};
	return (
		<Modal
			title={
				<div className='modal-title' style={{ textAlign: 'center' }}>
					Chi tiết đơn hàng
				</div>
			}
			open={viewModalVisible}
			style={{ maxWidth: '90%', width: '70%' }}
			onCancel={handleCancel}
			footer={[
				<Button key='back' onClick={handleCancel}>
					Hủy
				</Button>,
			]}
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
						<strong>Trạng thái đơn hàng:</strong> {getStatus.getOrderStatus(selectedOrder?.status)}
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
		</Modal>
	);
};
export default ViewModal;

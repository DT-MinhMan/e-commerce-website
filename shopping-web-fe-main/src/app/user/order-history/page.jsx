'use client';
// react
import React, { useEffect, useState } from 'react';
import SearchForm from '../../user/order-history/SearchForm';
import _, { isEmpty, get } from 'lodash';
import order from '../../../api/apiList/order';
import {
	LockOutlined,
	UnlockOutlined,
	EditOutlined,
	CloseOutlined,
	InfoCircleOutlined,
	CheckOutlined,
	TruckOutlined,
	SafetyOutlined,
	InboxOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import getStatus from '../../../utils/helpers';
import dayjs from 'dayjs';

// css
import './search-product.css';

// antd
import {
	Button,
	Checkbox,
	Form,
	Input,
	Typography,
	Table,
	Row,
	Col,
	Modal,
	Select,
	notification,
	InputNumber,
	Card,
	Image,
	Skeleton,
	Divider,
} from 'antd';
const { Title } = Typography;

const CreateInfo = () => {
	// useState
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalOrders, setTotalOrders] = useState(0);
	const [filterValue, setFilterValue] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});

	// useEffect
	useEffect(() => {
		getList({...filterValue});
	}, [page, pageSize, filterValue]);
	// functions
	const getList = async (items) => {
		try {
			setLoading(true);
			const params = {
				...items,
				page: page - 1,
				limit: pageSize,
			};
			const res = await order.list_order(params);
			if (res) {
				// set total user
				setTotalOrders(res?.pagination?.total);
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
	const showModal = async (record) => {
		const selectedProductId = record?.id;
		// Go found product info
		const foundProductInfo = await order.order_info({ id: selectedProductId });
		const foundProductData = _.get(foundProductInfo, 'data', {});
		let images = _.get(foundProductData, 'image', []);
		images = images?.map((dt) => {
			return `${baseUrl}/${dt}`;
		});

		setSelectedProduct({
			...foundProductData,
			image: images,
		});
		setIsModalVisible(true);
	};
	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const deleteOrReceivedOrder = async (record, action) => {
		// Get status
		let newStatus = '';
		switch (action) {
			case 'delete':
				newStatus = 'deleted';
				break;
			case 'received':
				newStatus = 'completed';
				break;
			default:
				notification.info({
					description: 'Hành động ko hỗ trợ.',
					duration: 4,
				});
				return null;
		}
		Modal.confirm({
			title: 'Xác nhận',
			content: action === 'delete' ? 'Bạn có chắc chắn muốn hủy đơn hàng ?' : 'Bạn xác nhận đã nhận đơn hàng ?',
			okText: action === 'delete' ? 'Đồng ý' : 'Xác nhận', // Change OK text
			cancelText: 'Hủy', // Change Cancel text
			okButtonProps: {
				style: {
					borderColor: 'lightGrey',
					color: 'black',
				},
			},
			onOk: async () => {
				try {
					// Init body
					const body = {
						id: record?.id,
						status: newStatus,
					};
					setLoading(true);
					// Go update
					const res = await order.edit_order_status(body);
					// Validate status
					if (res) {
						// Validate action code
						if (res?.code != 0) {
							notification.error({
								message: 'Cập nhật đơn hàng thất bại !',
								duration: 4,
							});
						} else {
							notification.success({
								message: 'Cập nhật đơn hàng thành công',
								duration: 4,
							});
						}
						getList({});
					} else {
						notification.error({
							message: 'Cập nhật đơn hàng thất bại !',
							duration: 4,
						});
					}
					setLoading(false);
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

	// colums in data table
	const columns = [
		{
			title: 'Mã đơn hàng',
			dataIndex: 'id',
			key: 'id',
			align: 'center',
			width: '10%', // 10
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			align: 'center',
			width: '3%', // 31
			render: (status) => getStatus.getOrderStatus(status),
		},
		{
			title: 'Thành tiền',
			dataIndex: 'total',
			key: 'total',
			align: 'center',
			width: '5%', // 25
			render: (total) => <span style={{ color: '#000000' }}>{new Intl.NumberFormat('vi-VN').format(total)} VNĐ</span>,
		},
		{
			title: 'Địa chỉ giao hàng',
			dataIndex: 'address',
			key: 'name',
			align: 'center',
			width: '10%', // 20
		},
		{
			title: 'Ngày đặt',
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
			width: '5%', // 36
			render: (value) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),

		},
		{
			title: 'Phương thức thanh toán',
			dataIndex: 'payment_method_name',
			key: 'payment_method_name',
			align: 'center',
			width: '5%', // 41
			render: (methodName) => (
				<span style={{ color: '#000000' }}>{methodName === null ? 'Thanh toán khi nhận hàng' : methodName}</span>
			),
		},
		{
			title: 'Chi tiết',
			align: 'center',
			width: '3%', // 44
			render: (record) => {
				return (
					<Button
						icon={<InfoCircleOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => showModal(record)}
					/>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: '5%', // 44
			render: (record) => {
				switch (record?.status) {
					case 'toShip':
						return (
							<Button
								icon={<CheckOutlined />}
								// Add an onClick handler here to perform the edit action
								onClick={() => deleteOrReceivedOrder(record, 'received')}
							/>
						);
					case 'toProgress':
						return (
							<div>
								<Button
									icon={<DeleteOutlined />}
									// Add an onClick handler here to perform the edit action
									onClick={() => deleteOrReceivedOrder(record, 'delete')}
								/>
							</div>
						);
					default: // toProgress
						return null;
				}
			},
		},
	];
	return (
		<div className='container'>
			<Modal
				title={
					<div className='modal-title' style={{ textAlign: 'center' }}>
						Chi tiết đơn hàng
					</div>
				}
				visible={isModalVisible}
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
							<strong>Mã đơn hàng:</strong> {selectedProduct?.id}
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Trạng thái đơn hàng:</strong> {getStatus.getOrderStatus(selectedProduct?.status)}
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={12}>
						<p>
							<strong>Thành tiền:</strong> {new Intl.NumberFormat('vi-VN').format(selectedProduct?.total)} VNĐ
						</p>
					</Col>
					<Col span={12}>
						<p>
							<strong>Đã thanh toán:</strong> {new Intl.NumberFormat('vi-VN').format(selectedProduct?.prepaid)} VNĐ
						</p>
					</Col>
				</Row>

				<Row gutter={[16, 16]} style={{ marginBottom: '8px' }}>
					<Col span={24}>
						<p>
							<strong>Còn lại:</strong> {new Intl.NumberFormat('vi-VN').format(selectedProduct?.remaining)} VNĐ
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
					{selectedProduct.image?.map((detail, index) => (
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

				{selectedProduct.details?.map((detail, index) => (
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
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Lịch sử mua hàng</Title>
			<div style={{ margin: '5% 5%' }}>
				<SearchForm getList={getList} setFilterValue={setFilterValue} setPage={setPage}/>
			</div>
			<Row gutter={[8, 8]}>
				<Col span={24}>
					<Table
						columns={columns}
						loading={loading}
						dataSource={list}
						onChange={handleTableChange}
						pagination={{
							pageSize,
							current: page,
							total: totalOrders,
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

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
import ViewModal from './viewModal';
import EditModal from './editModal';
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
import { useForm } from 'antd/es/form/Form';
const { Title } = Typography;

const CreateInfo = () => {
	// useState
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalOrders, setTotalOrders] = useState(0);
	const [filterValue, setFilterValue] = useState({});
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [filterForm] = Form.useForm();

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
				mustShowOther: true,
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
	const showModal = async (record, action) => {
		const selectedOrderId = record?.id;
		// Go found Order info
		const foundOrderInfo = await order.order_info({ id: selectedOrderId });
		const foundOrderData = _.get(foundOrderInfo, 'data', {});

		setSelectedProduct({
			...foundOrderData,
		});
		if (action === 'view') {
			setViewModalVisible(true);
		} else {
			setEditModalVisible(true);
		}
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
						onClick={() => showModal(record, 'view')}
					/>
				);
			},
		},
		{
			title: 'Cập nhật',
			align: 'center',
			width: '5%', // 44
			render: (record) => {
				return record?.status !== 'deleted' ? (
					<Button
						icon={<EditOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => showModal(record, 'edit')}
					/>
				) : null;
			},
		},
	];
	return (
		<div className='container'>
			<ViewModal
				viewModalVisible={viewModalVisible}
				setViewModalVisible={setViewModalVisible}
				selectedOrder={selectedProduct}
			/>
			<EditModal
				editModalVisible={editModalVisible}
				setEditModalVisible={setEditModalVisible}
				selectedOrder={selectedProduct}
				setPage={setPage}
				setFilterValue={setFilterValue}
				filterForm={filterForm}
			/>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Quản lý đơn hàng</Title>
			<div style={{ margin: '5% 5%' }}> 
				<SearchForm getList={getList} setFilterValue={setFilterValue} setPage={setPage} filterForm={filterForm} />
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

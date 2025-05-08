'use client';
// react
import React, { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import _, { isEmpty, get } from 'lodash';
import product from '../../../api/apiList/product';
import {
	LockOutlined,
	UnlockOutlined,
	EditOutlined,
	CloseOutlined,
	InfoCircleOutlined,
	AppstoreAddOutlined,
} from '@ant-design/icons';
import getStatus from '../../../utils/helpers';
import { useRouter, usePathname } from 'next/navigation';
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
} from 'antd';
const { Title } = Typography;

const CreateInfo = () => {
	// useState
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [totalUsers, setTotalUsers] = useState(0);
	const [filterValue, setfilterValue] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});
	const [editProductForm] = Form.useForm();

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
			const res = await product.list_product(params);
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
			content: 'Bạn có chắc chắn muốn cập nhật thông tin sản phẩm này?',
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
					// Send a request to your backend to update the user's status
					const newStatus = currentStatus === 'active' ? 'in_active' : 'active';
					// Init body
					const body = {
						id: userId,
						status: newStatus,
					};
					setLoading(true);
					// Go update
					const res = await product.edit_product(body);
					// Validate status
					if (res) {
						// Validate action code
						if (res?.code != 0) {
							notification.error({
								message: 'Cập nhật sản phẩm thất bại !',
								duration: 4,
							});
						}
						getList({});
					} else {
						notification.error({
							message: 'Cập nhật sản phẩm thất bại !',
							duration: 4,
						});
					}
					setLoading(false);
					notification.success({
						message: 'Cập nhật sản phẩm thành công',
						duration: 4,
					});
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
	const showModal = async (record) => {
		const selectedProductId = record?.id;
		// Go found product info
		const foundProductInfo = await product.info_product({ id: selectedProductId, limitAccess: false });
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
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
			title: 'Tên sản phẩm',
			dataIndex: 'name',
			key: 'name',
			align: 'center',
			width: '10%', // 20
		},
		{
			title: 'Giá',
			dataIndex: 'price',
			key: 'price',
			align: 'center',
			width: '5%', // 25
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
			title: 'Khóa sản phẩm',
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
			title: 'Chi tiết sản phẩm',
			align: 'center',
			width: '3%', // 47
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
			title: 'Thêm chi tiết sản phẩm',
			align: 'center',
			width: '3%', // 50
			render: (record) => {
				return (
					<Button
						icon={<AppstoreAddOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => router.push(`/product/add-details?id=${record?.id}`)}
					/>
				);
			},
		},
		{
			title: 'Cập nhật',
			align: 'center',
			width: '3%', // 53
			render: (record) => {
				return (
					<Button
						icon={<EditOutlined />}
						// Add an onClick handler here to perform the edit action
						onClick={() => router.push(`/product/edit?id=${record?.id}`)}
					/>
				);
			},
		},
	];
	return (
		<div className='container'>
			<Modal
				title={
					<div className='modal-title' style={{ textAlign: 'center' }}>
						Chi tiết sản phẩm
					</div>
				}
				visible={isModalVisible}
				style={{ width: '70%', minWidth: '30%', alignContent: 'center' }}
				onCancel={handleCancel}
				footer={[
					<Button key='back' onClick={handleCancel}>
						Hủy
					</Button>,
				]}
			>
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Tên sản phẩm:</strong> {selectedProduct?.name}
					</p>
				</Row>
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Mô tả:</strong> {selectedProduct?.description}
					</p>
				</Row>
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Giá thành:</strong> {selectedProduct?.price}
					</p>
				</Row>
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Trạng Thái:</strong> {selectedProduct?.status}
					</p>
				</Row>
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Tổng số lượng:</strong> {selectedProduct?.totalQty}
					</p>
				</Row>
				{/* Details Section */}
				<Row gutter={16} style={{ margin: '3px 0px' }}>
					<p>
						<strong>Hình ảnh sản phẩm:</strong>
					</p>
				</Row>
				<div
					style={{
						margin: '3px 0px',
						width: '100%',
						display: 'flex',
						flexDirection: 'row',
						overflow: 'auto',
					}}
				>
					{selectedProduct.image?.map((detail, index) => (
						<Card key={index} style={{ margin: '3px 3px', width: 130 }}>
							<Image width={80} src={detail} />
						</Card>
					))}
				</div>
				<Row
					gutter={16}
					style={{
						margin: '3px 0px',
					}}
				>
					<p>
						<strong>Chi tiết sản phẩm:</strong>
					</p>
				</Row>
				{selectedProduct.details?.map((detail, index) => (
					<Card key={index} gutter={16} style={{ margin: '3px 0px' }}>
						<Row gutter={16} style={{ margin: '3px 0px', width: '100%' }}>
							<Col gutter={16} style={{ width: '50%' }}>
								<p>
									<strong>Màu sắc:</strong> {detail?.color?.name}
								</p>
							</Col>
							<Col gutter={16} style={{ width: '50%' }}>
								<p>
									<strong>Kích cỡ:</strong> {detail?.size?.name}
								</p>
							</Col>
						</Row>
						<Row gutter={16} style={{ margin: '3px 0px', width: '100%' }}>
							<Col gutter={16} style={{ width: '50%' }}>
								<p>
									<strong>Số lượng:</strong> {detail?.qty}
								</p>
							</Col>
							<Col gutter={16} style={{ width: '50%' }}>
								<p>
									<strong>Trạng Thái:</strong> {detail?.status}
								</p>
							</Col>
						</Row>
					</Card>
				))}
			</Modal>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Quản lý sản phẩm</Title>
			<div style={{ margin: '5% 5%' }}>
				<SearchForm getList={getList} setfilterValue={setfilterValue} setPage={setPage} />
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

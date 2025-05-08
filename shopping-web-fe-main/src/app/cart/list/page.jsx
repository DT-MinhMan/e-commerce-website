'use client';
import React, { useEffect, useState, useCallback } from 'react';
import _, { isEmpty } from 'lodash';
import cart from '../../../api/apiList/cart';
import { CaretUpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

// css
import './search-product.css';
// antd
import { Table, Checkbox, InputNumber, Button, Space, notification, Modal, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
const { Title, Text } = Typography;
const CreateInfo = () => {
	// useState
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]); // List of cart items
	const [selectedRows, setSelectedRows] = useState([]); // Selected rows for calculating total
	const [totalCost, setTotalCost] = useState(0); // Total cost of selected items
	const [updatedRow, setUpdatedRow] = useState({}); // Track qty updates

	// useEffect to handle updates and recalculate total cost
	useEffect(() => {
		getList({});
	}, []); // Fetch initial list on component mount

	useEffect(() => {
		getList({});
		// Recalculate total cost when selected rows or updated qty change
		let total = 0;
		selectedRows.forEach((row) => {
			total += row.qty * row.product.price;
		});
		setTotalCost(total);
	}, [selectedRows, updatedRow]); // Trigger recalculation when selected rows or qty are updated

	// Columns definition for the Table
	const columns = [
		{
			title: 'Sản Phẩm',
			dataIndex: 'product',
			align: 'center',
			key: 'product',
			width: '35%',
			render: (product, record) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img
						src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product?.img}`}
						alt={product?.name}
						style={{ width: '35%', marginRight: 10 }}
					/>
					<div style={{ textAlign: 'left' }}>
						<div style={{ fontWeight: 'bold' }}>{product?.name}</div>
						<div>
							Phân Loại:
							<br />- Màu: {record?.color}
							<br />- Size: {record?.size}
						</div>
					</div>
				</div>
			),
		},
		{
			title: 'Đơn Giá',
			dataIndex: 'product',
			align: 'center',
			key: 'price',
			width: '15%',
			render: (product) => (
				<span style={{ color: '#000000' }}>{new Intl.NumberFormat('vi-VN').format(product.price)}</span>
			),
		},
		{
			title: 'Số Lượng',
			dataIndex: 'qty',
			align: 'center',
			key: 'qty',
			width: '10%',
			render: (qty, record) => (
				<InputNumber
					style={{ width: '100%' }}
					min={1}
					defaultValue={qty}
					max={record?.availableQty}
					onChange={(value) => debouncedHandleQtyChange(value, record)}
				/>
			),
		},
		{
			title: 'Tạm tính',
			dataIndex: 'total',
			align: 'center',
			key: 'total',
			width: '30%',
			render: (_, record) => (
				<span style={{ color: '#000000' }}>
					{new Intl.NumberFormat('vi-VN').format(record?.qty * record?.product?.price)}
				</span>
			),
		},
		{
			title: 'Thao Tác',
			align: 'center',
			key: 'action',
			width: '10%',
			render: (_, record) => (
				<Button
					type='text'
					style={{ width: '100%' }}
					danger
					icon={<DeleteOutlined />}
					onClick={() => handleDelete(record)} // Trigger delete on click
				>
					Xóa
				</Button>
			),
		},
	];

	// Fetch list of cart items
	const getList = async () => {
		try {
			setLoading(true);
			const res = await cart.list_cart({});
			if (res) {
				setList(res?.data);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};

	// Handle row selection (update selected rows and recalculate total)
	const onSelectChange = (selectedRowKeys, selectedRows) => {
		setSelectedRows(selectedRows);
	};

	// Row selection configuration for the table
	const rowSelection = {
		selectedRows,
		onChange: onSelectChange,
	};

	// Debounced quantity change function
	const debouncedHandleQtyChange = useCallback(
		_.debounce((value, record) => handleQtyChange(value, record), 500),
		[list]
	);

	// Handle quantity change (update in DB and local state)
	const handleQtyChange = async (value, record) => {
		const cartId = record?.id;
		const qty = value;

		// Update cart quantity in database
		const res = await cart.edit_cart({ cart: cartId, qty: qty });
		if (res) {
			if (res?.code !== 0) {
				notification.error({
					description: res?.message,
					duration: 4,
				});
			}
		}

		// Update the local updatedRow state
		setUpdatedRow({ cartId, qty });

		// Update selected rows to reflect the new quantity
		setSelectedRows((prevSelectedRows) =>
			prevSelectedRows?.map((row) => (row.id === record.id ? { ...row, qty: value } : row))
		);
	};

	const handlePayment = () => {
		// Navigate to another page with selected rows data
		if(!_.isEmpty(selectedRows)) {
			const cartIds = selectedRows?.map(dt => dt?.id)
			router.push(`/order/create?items=${JSON.stringify(cartIds)}`)
		} else {
			notification.error({
				description: "Bạn chưa chọn bất kỳ sản phẩm nào",
				duration: 4,
			});
		}
	};

	// Handle delete action with confirmation dialog
	const handleDelete = (record) => {
		Modal.confirm({
			title: 'Bạn có chắc muốn loại bỏ sản phẩm này ra khỏi giỏ hàng?',
			content: `Sản phẩm ${record.product?.name} sẽ bị loại bỏ khỏi giỏ hàng.`,
			okText: 'Đồng ý', // Change OK text
			cancelText: 'Hủy', // Change Cancel text
			okButtonProps: {
				style: {
					borderColor: 'lightGrey',
					color: 'black',
				},
			},
			onOk: async () => {
				// Perform the delete operation
				const cartId = record?.id;
				const res = await cart.edit_cart({ cart: cartId, status: 'in_active' });
				if (res) {
					if (res?.code !== 0) {
						notification.error({
							description: res?.message,
							duration: 4,
						});
					} else {
						// Remove the deleted product from the selected rows
						setSelectedRows((prevSelectedRows) => prevSelectedRows.filter((row) => row.id !== cartId));
						setUpdatedRow({ cartId, status: 'in_active' });
					}
				}
			},
		});
	};

	return (
		<div className='container'>
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}> Giỏ hàng </Title>
			<div style={{ padding: 20 }}>
				<Table
					rowKey='id'
					columns={columns}
					dataSource={list}
					loading={loading}
					pagination={false}
					rowSelection={rowSelection} // Add checkbox functionality
					scroll={{ y: 1000 }}
					footer={() => (
						<div>
							Thành tiền:{' '}
							<span style={{ color: '#000000' }}>{new Intl.NumberFormat('vi-VN').format(totalCost)} VNĐ</span>
							<br />
						</div>
					)}
				/>
				<br />
				<Space style={{ float: 'right' }}>
					<Button name='go-payment' onClick={handlePayment}>
						Thanh Toán
					</Button>
				</Space>
			</div>
		</div>
	);
};

export default CreateInfo;

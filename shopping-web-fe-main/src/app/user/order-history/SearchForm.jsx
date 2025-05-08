'use client';
// react
import React, { useState, useEffect } from 'react';
import product from '../../../api/apiList/product';
import dayjs from 'dayjs';

// antd
import { Button, DatePicker, Form, Input, InputNumber, Typography, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
const { Text } = Typography;

const SearchForm = ({ getList, setFilterValue, setPage }) => {
	// useState
	const [form] = Form.useForm();
	// search info
	const searchInfo = async () => {
		const status = form.getFieldValue('status') ? form.getFieldValue('status') : '';
		const fromDate = form.getFieldValue('fromDate') ? dayjs(form.getFieldValue('fromDate')).format('YYYY-MM-DD') : '';
		const toDate = form.getFieldValue('toDate') ? dayjs(form.getFieldValue('toDate')).add(1, 'day').format('YYYY-MM-DD') : '';
		let params = {};
		// if (status !== '') {
			params['status'] = status;
		// }
		if (fromDate !== '') {
			params['fromDate'] = fromDate;
		}
		if (toDate !== '') {
			params['toDate'] = toDate;
		}
		setFilterValue(params);
		setPage(1);
		// await getList(params);
	};

	// filter option
	// const filterOption = (input, option) => (option?.label ?? "").includes(input);

	return (
		<div className='search-table'>
			<Form
				labelCol={{
					span: 12,
				}}
				wrapperCol={{
					span: 14,
				}}
				layout='horizontal'
				onFinish={searchInfo}
				form={form}
				style={{
					maxWidth: '90%',
				}}
			>
				<div className='company-filter-info grid grid-cols-2'>
					{/*__________Trạng thái đơn hàng__________ */}
					<Form.Item name='status' label='Trạng thái'>
						<Select
							defaultValue=''
							style={{ width: '100%' }}
							options={[
								{ value: '', label: 'Tất cả' },
								{ value: 'toProgress', label: 'Đang xử lý' },
								{ value: 'toShip', label: 'Đang vận chuyển' },
								{ value: 'completed', label: 'Hoàn thành' },
								{ value: 'deleted', label: 'Đã hủy' },
							]}
						/>
					</Form.Item>
				</div>

				<div className='company-filter-info grid grid-cols-2'>
					<Form.Item label='Ngày đặt hàng' name='price' />
				</div>
				<div className='company-filter-info grid grid-cols-2'>
					{/*__________Từ__________ */}
					<Form.Item label='Từ' name='fromDate'>
						<DatePicker placeholder='Chọn ngày'/>
					</Form.Item>
					{/*__________Kích cỡ sản phẩm__________ */}
					<Form.Item label='Đến' name='toDate'>
						<DatePicker placeholder='Chọn ngày'/>
					</Form.Item>
				</div>
				{/* <div className="filter-button"> */}
				<Form.Item className='flex justify-end'>
					<Button htmlType='submit' icon={<FilterOutlined style={{ verticalAlign: 'middle' }} />}>
						Lọc
					</Button>
				</Form.Item>
				{/* </div> */}
			</Form>
		</div>
	);
};
export default SearchForm;

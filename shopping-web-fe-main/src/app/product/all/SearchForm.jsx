'use client';
// react
import React, { useState, useEffect } from 'react';
import product from '../../../api/apiList/product';
import dayjs from 'dayjs';

// antd
import { Button, DatePicker, Form, Input, InputNumber, Typography, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
const { Text } = Typography;

const SearchForm = ({ getList, filterForm, setFilterValue, setPage}) => {
	// useState
	const [productTypes, setProductTypes] = useState([]);
	const [productMaterials, setProductMaterials] = useState([]);

	// useEffect
	useEffect(() => {
		listProductDetails();
	}, []);

	// functions
	// list product info
	const listProductDetails = async () => {
		try {
			// init pagination
			const limit = 1000;
			// get types
			const getTypes = await product.list_product_types({ limit });
			// get materials
			const getMaterials = await product.list_product_materials({ limit });
			// Set product types
			const typesOptions = getTypes?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			// Set product materials
			const materialsOptions = getMaterials?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			setProductTypes(typesOptions);
			setProductMaterials(materialsOptions);
		} catch (error) {
			console.log(error);
		}
	};

	// search info
	const searchInfo = async () => {
		const materials = filterForm.getFieldValue('materials') ? filterForm.getFieldValue('materials') : [];
		const types = filterForm.getFieldValue('types') ? filterForm.getFieldValue('types') : [];
		const fromPrice = filterForm.getFieldValue('fromPrice') ? filterForm.getFieldValue('fromPrice') : '';
		const toPrice = filterForm.getFieldValue('toPrice') ? filterForm.getFieldValue('toPrice') : '';
		let params = {};
		if (fromPrice !== '') {
			params['price[from]'] = fromPrice;
		}
		if (toPrice !== '') {
			params['price[to]'] = toPrice;
		}
		if (!_.isEmpty(materials)) {
			params[`materials[]`] = materials;
		}
		if (!_.isEmpty(types)) {
			params[`types[]`] = types;
		}
		setFilterValue({
			...params
		})
		setPage(1);
		// await getList(params);
	};

	return (
		<div className='search-table' style={{ border: '1px solid lightGrey', padding: '10px', borderRadius: '8px' }}>
			<Form
				labelCol={{
					xs: 24,
					sm: 12,
					md: 8,
					lg: 6,
				}}
				onFinish={searchInfo}
				form={filterForm}
				style={{
					maxWidth: '90%',
					textAlign: 'center',
				}}
				key='filter-box'
			>
				<div className='company-filter-info grid grid-cols-2'>
					{/*__________Chất liệu sản phẩm__________ */}
					<Form.Item label='Chất liệu' name='materials'>
						<Select mode='multiple' style={{ width: '100%' }} placeholder='Chọn chất liệu'>
							{productMaterials?.map((productMaterials) => (
								<Option key={productMaterials.value} value={productMaterials.value}>
									{productMaterials.label}
								</Option>
							))}
						</Select>
					</Form.Item>
					{/*__________Loại sản phẩm__________ */}
					<Form.Item label='Loại sản phẩm' name='types'>
						<Select mode='multiple' style={{ width: '100%' }} placeholder='Chọn loại'>
							{productTypes?.map((productTypes) => (
								<Option key={productTypes.value} value={productTypes.value}>
									{productTypes.label}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
				<div className='company-filter-info grid grid-cols-2'>
					{/* <h1>Giá thành:</h1> */}
					{/*__________Từ__________ */}
					<Form.Item label='Từ' name='fromPrice'>
						<InputNumber style={{ width: '100%' }} min={0} />
					</Form.Item>
					{/* <h1>-</h1> */}
					{/*__________Kích cỡ sản phẩm__________ */}
					<Form.Item label='Đến' name='toPrice'>
						<InputNumber style={{ width: '100%' }} min={0} />
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

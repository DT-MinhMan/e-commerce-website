'use client';
// react
import React, { useState, useEffect } from 'react';
import product from '../../../api/apiList/product';
import dayjs from 'dayjs';

// antd
import { Button, DatePicker, Form, Input, InputNumber, Typography, Select } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
const { Text } = Typography;

const SearchForm = ({ getList, setfilterValue, setPage }) => {
	// useState
	const [form] = Form.useForm();
	const [productTypes, setProductTypes] = useState([]);
	const [productMaterials, setProductMaterials] = useState([]);
	const [productColors, setProductColors] = useState([]);
	const [productSizes, setProductSizes] = useState([]);

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
			// get colors
			const getColors = await product.list_product_colors({ limit });
			// get sizes
			const getSizes = await product.list_product_sizes({ limit });
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
			// Set product colors
			const colorsOptions = getColors?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			// Set product colors
			const sizesOptions = getSizes?.data?.map((dt) => {
				return {
					value: dt?.id,
					label: dt?.name,
				};
			});
			setProductTypes(typesOptions);
			setProductMaterials(materialsOptions);
			setProductColors(colorsOptions);
			setProductSizes(sizesOptions);
		} catch (error) {
			console.log(error);
		}
	};

	// search info
	const searchInfo = async () => {
		const name = form.getFieldValue('name') ? form.getFieldValue('name') : '';
		const status = form.getFieldValue('status') ? form.getFieldValue('status') : '';
		const materials = form.getFieldValue('materials') ? form.getFieldValue('materials') : [];
		const types = form.getFieldValue('types') ? form.getFieldValue('types') : [];
		const sizes = form.getFieldValue('sizes') ? form.getFieldValue('sizes') : [];
		const colors = form.getFieldValue('colors') ? form.getFieldValue('colors') : [];
		const fromPrice = form.getFieldValue('fromPrice') ? form.getFieldValue('fromPrice') : '';
		const toPrice = form.getFieldValue('toPrice') ? form.getFieldValue('toPrice') : '';
		let params = {};
		if (name !== '') {
			params['name'] = name;
		}
		if (status !== '') {
			params['status'] = status;
		}
		if (fromPrice !== '') {
			params['price[from]'] = fromPrice;
		}
		if (toPrice !== '') {
			params['price[to]'] = toPrice;
		}
		if (!_.isEmpty(materials)) {
			// for(let i = 0 ; i < materials.length ; i++){
			//   params[`materials[${i}]`] = materials[i];
			// }
			params[`materials[]`] = materials;
		}
		if (!_.isEmpty(types)) {
			// for(let i = 0 ; i < types.length ; i++){
			//   params[`types[${i}]`] = types[i];
			// }
			params[`types[]`] = types;
		}
		if (!_.isEmpty(sizes)) {
			// for(let i = 0 ; i < sizes.length ; i++){
			//   params[`sizes[${i}]`] = sizes[i];
			// }
			params[`sizes[]`] = sizes;
		}
		if (!_.isEmpty(colors)) {
			// for(let i = 0 ; i < colors.length; i++){
			//   params[`colors[${i}]`] = colors[i];
			// }
			params[`colors[]`] = colors;
		}
		setfilterValue(params)
		setPage(1)
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
					{/*__________Tên sản phẩm__________ */}
					<Form.Item name='name' label='tên sản phẩm'>
						<Input />
					</Form.Item>

					{/*__________Trạng thái sản phẩm__________ */}
					<Form.Item name='status' label='Trạng thái'>
						<Select
							defaultValue='All'
							style={{ width: 120 }}
							options={[
								{ value: '', label: 'Tất cả' },
								{ value: 'active', label: 'Hoạt động' },
								{ value: 'in_active', label: 'Tạm khóa' },
								{ value: 'deleted', label: 'Đã xóa' },
							]}
						/>
					</Form.Item>
				</div>

				<div className='company-filter-info grid grid-cols-2'>
					{/*__________Chất liệu sản phẩm__________ */}
					<Form.Item label='Chất liệu' name='materials'>
						<Select mode='multiple' style={{ width: '100%' }} placeholder='Please select'>
							{productMaterials?.map((productMaterials) => (
								<Option key={productMaterials.value} value={productMaterials.value}>
									{productMaterials.label}
								</Option>
							))}
						</Select>
					</Form.Item>
					{/*__________Loại sản phẩm__________ */}
					<Form.Item label='Loại sản phẩm' name='types'>
						<Select mode='multiple' style={{ width: '100%' }} placeholder='Please select'>
							{productTypes?.map((productTypes) => (
								<Option key={productTypes.value} value={productTypes.value}>
									{productTypes.label}
								</Option>
							))}
						</Select>
					</Form.Item>
				</div>
				<div className='company-filter-info grid grid-cols-2'>
					<Form.Item label='Giá tiền' name='price' />
				</div>
				<div className='company-filter-info grid grid-cols-2'>
					{/*__________Từ__________ */}
					<Form.Item label='Từ' name='fromPrice'>
						<InputNumber  min={0} />
					</Form.Item>
					{/*__________Kích cỡ sản phẩm__________ */}
					<Form.Item label='Đến' name='toPrice'>
						<InputNumber min={0} />
					</Form.Item>
				</div>
				{/* <div className="filter-button"> */}
				<Form.Item className='flex justify-end'>
					<Button htmlType='submit' icon={<FilterOutlined style={{ verticalAlign: 'middle' }} />}>
						Filter
					</Button>
				</Form.Item>
				{/* </div> */}
			</Form>
		</div>
	);
};
export default SearchForm;

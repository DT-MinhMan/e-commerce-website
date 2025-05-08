'use client';
// react
import React, { useEffect, useState } from 'react';
import SearchForm from './SearchForm';
import _, { isEmpty, get } from 'lodash';
import product from '../../../api/apiList/product';
import { CaretUpOutlined } from '@ant-design/icons';
import getStatus from '../../../utils/helpers';
import { useRouter, usePathname } from 'next/navigation';

// css
import './search-product.css';

// antd
import { Card, Form, Input, Row, Col, Pagination } from 'antd';
const { Meta } = Card;

const CreateInfo = () => {
	// useState
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState([]);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(12);
	const [total, setTotal] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [filterValue, setFilterValue] = useState({})
	const [filterForm] = Form.useForm();
	// useEffect
	useEffect(() => {
		getList({...filterValue});
	}, [page, pageSize, searchValue, filterValue]);
	// functions
	const getList = async (items) => {
		try {
			setLoading(true);
			const params = {
				...items,
				status: 'active',
				page: page - 1,
				limit: pageSize,
			};
			if (searchTerm !== ''){
				params['name'] = searchValue
			}
			const res = await product.list_product(params);
			if (res) {
				// set total user
				setTotal(res?.pagination?.total);
				// set list
				setList(res?.data);
			}
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const handlePageChange = async (page) => {
		// console.log(page);
		setPage(page);
	};
	const handleProductClick = (id) => {
		router.push(`/product/detail?id=${id}`); // Navigate to the product details page
	};
	// Handle the input change for search term
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Handle search submit
	const handleSearch = async (value) => {
		filterForm.resetFields();
		setFilterValue({});
		setSearchValue(value)
		setPage(1);
	};
	return (
		<div className='container'>
			<div className='search-table'>
				<Form key='search-box' layout='vertical'>
					<Form.Item name={'product-name'}>
						<Input.Search
							value={searchTerm}
							onChange={handleSearchChange} // update searchTerm on input change
							onSearch={handleSearch} // handle search submit
							placeholder='Tên sản phẩm'
						/>
					</Form.Item>
				</Form>
			</div>
			<SearchForm getList={getList} filterForm = {filterForm} setFilterValue={setFilterValue} setPage={setPage}/>
			<div style={{ padding: '20px' }}>
				<h1 style={{ textAlign: 'center', fontSize: '25px', fontFamily: 'Times New Roman' }}>SẢN PHẨM</h1>
				<Row gutter={16}>
					{list?.map((product) => (
						<Col xs={24} sm={12} md={8} lg={6} key={product.id}>
							<Card
								hoverable
								onClick={() => handleProductClick(product.id)}
								cover={<img alt={product.name} src={`${process.env.NEXT_PUBLIC_BASE_URL}/${product?.image[0]}`} />}
							>
								<Meta title={product.name} description={`Giá: ${product.price} VNĐ`} />
							</Card>
						</Col>
					))}
				</Row>
				<Pagination
					current={page}
					pageSize={pageSize}
					total={total}
					onChange={handlePageChange}
					style={{ marginTop: '20px', textAlign: 'center', float: 'right' }}
				/>
			</div>
		</div>
	);
};

export default CreateInfo;

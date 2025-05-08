'use client';
import React, { useState, useEffect } from 'react';
import { theme, Menu, Layout, Button, Image, Skeleton } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import {
	HomeOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	LogoutOutlined,
	AppstoreOutlined,
	AppstoreAddOutlined,
	UserAddOutlined,
	UserOutlined,
	ShoppingCartOutlined,
	IdcardOutlined,
	FormOutlined,
	SkinOutlined,
	FilterOutlined,
	ProductOutlined,
	ProfileOutlined,
	FileSearchOutlined,
	TagsOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthenticationContext';
// import Logo from

const { Header, Sider, Footer, Content } = Layout;

const Layouts = ({ children }) => {
	const router = useRouter();
	const [collapsed, setCollapsed] = useState(false);
	const { onLogout } = useAuth();
	const { isAuthen } = useAuth();
	const { isUserAuthenticated } = useAuth();
	const { isAdmin } = useAuth();
	let userList = [
		{
			key: '/',
			icon: <HomeOutlined />,
			label: 'Trang chủ',
		},
		{
			key: '/product/all',
			icon: <ProductOutlined />,
			label: 'Sản phẩm',
		},
		{
			key: '/login',
			icon: <UserOutlined />,
			label: 'Đăng nhập',
		},
		{
			key: '/register',
			icon: <UserAddOutlined />,
			label: 'Đăng ký',
		},
	];
	if (isUserAuthenticated) {
		const filteredUserList = userList.filter((item) => item.key !== '/login' && item.key !== '/register');
		filteredUserList.push(
			{
				key: 'user-info',
				icon: <UserOutlined />,
				label: 'Thông tin người dùng',
				children: [
					{
						key: '/user/info',
						icon: <ProfileOutlined />,
						label: 'Chi tiết người dùng',
					},
					{
						key: '/user/order-history',
						icon: <FileSearchOutlined />,
						label: 'Đơn hàng',
					},
				],
			},
			{
				key: '/cart/list',
				icon: <ShoppingCartOutlined />,
				label: 'Giỏ hàng',
			}
		);
		if (isAdmin) {
			// Validate role
			filteredUserList.push({
				key: 'management',
				icon: <AppstoreOutlined />,
				label: 'Quản lý',
				children: [
					{
						key: 'sub-management-1',
						icon: <IdcardOutlined />,
						label: 'Quản lý người dùng',
						children: [
							{
								key: '/user/get-list',
								icon: <IdcardOutlined />,
								label: 'Danh sách người dùng',
							},
							{
								key: '/user/add',
								icon: <UserAddOutlined />,
								label: 'Thêm người dùng',
							},
						],
					},
					{
						key: 'sub-management-2',
						icon: <SkinOutlined />,
						label: 'Quản lý sản phẩm',
						children: [
							{
								key: '/product/get-list',
								icon: <FilterOutlined />,
								label: 'Danh sách sản phẩm',
							},
							{
								key: '/product/add',
								icon: <AppstoreAddOutlined />,
								label: 'Thêm sản phẩm',
							},
						],
					},
					{
						key: 'sub-management-3',
						icon: <TagsOutlined />,
						label: 'Quản lý thể loại sản phẩm',
						children: [
							{
								key: '/product-detail/get-list',
								icon: <FilterOutlined />,
								label: 'Danh sách thể loại sản phẩm',
							},
							{
								key: '/product-detail/add',
								icon: <AppstoreAddOutlined />,
								label: 'Thêm thể loại sản phẩm',
							},
							{
								key: '/product-detail/edit',
								icon: <AppstoreAddOutlined />,
								label: 'Sửa thể loại sản phẩm',
							},
						],
					},
					{
						key: '/order/get-list',
						icon: <FormOutlined />,
						label: 'Quản lý đơn hàng',
					},
				],
			});
		}
		userList = filteredUserList;
	}

	const {
		token: { colorBgContainer },
	} = theme.useToken();

	// pathname
	const pathname = usePathname();

	return (
		<Layout>
			<Sider trigger={null} collapsible collapsed={collapsed} width={'20%'}>
				<Menu
					className='text-sm font-sans font-medium'
					mode='inline'
					onClick={({ key }) => {
						router.push(key);
					}}
					defaultSelectedKeys={[pathname]}
					items={userList}
				/>
			</Sider>
			<Layout>
				{/*_________________________________________________START HEADER________________________________________________ */}

				<Header
					className='flex'
					style={{
						position: 'sticky',
						top: 0,
						zIndex: 1,
						width: '100%',
						// alignItems: "center",
						padding: 0,
						background: colorBgContainer,
					}}
				>
					{/*___________________________________________MENU BUTTON__________________________________________*/}
					<div style={{ width: '25%' }}>
						<Button
							className='float-left'
							type='text'
							icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
							onClick={() => setCollapsed(!collapsed)}
							style={{
								fontSize: '16px',
								width: '25%',
								height: '100%',
							}}
						/>
					</div>
					{/*___________________________________________FUNAN LOGO__________________________________________*/}

					<div className='bg-cover' style={{ width: '50%' }}>
						<h1
							style={{
								height: '70%',
								width: '100%',
								maxWidth: 'none',
								fontSize: '180%',
								textAlign: 'center',
								fontFamily: 'Times New Roman',
							}}
						>
							THE BANNED
						</h1>
					</div>
					{/*___________________________________________USER AND LOGOUT__________________________________________*/}
					{isUserAuthenticated === true ? (
						<div style={{ width: '25%' }}>
							<Button
								className='float-right'
								type='text'
								icon={<LogoutOutlined />}
								// onClick={() => setCollapsed(!collapsed)}
								onClick={onLogout}
								style={{
									fontSize: '16px',
									width: '25%',
									height: '100%',
								}}
							/>
						</div>
					) : null}
				</Header>
				{/*___________________________________________END HEADER__________________________________________*/}

				{/*_________________________________________________START MAIN________________________________________________ */}

				<Content
					style={{
						margin: '24px 16px',
						padding: 24,
						minHeight: 280,
						background: colorBgContainer,
					}}
				>
					{children}
				</Content>
				<Footer style={{ textAlign: 'center' }}>Copyright by THE BANNED &copy; 2024</Footer>
			</Layout>
		</Layout>
	);
};

export default Layouts;

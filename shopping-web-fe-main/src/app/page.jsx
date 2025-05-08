// react
'use client'
import React from 'react';
const Banner = dynamic(() => import("../components/banner/page.jsx"), {ssr: false})
//antd
import dynamic from 'next/dynamic';

const Home = () => {
	return (
		<Banner/>
	);
};
export default Home;

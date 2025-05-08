// rafce
'use client';
import React from 'react';
import banner1 from '../../assets/banner/comming-soon.png';
import banner2 from '../../assets/banner/altum-collection.png';

// const bannertest = dynamic(() => import("../assets/banner/comming-soon.png"), {ssr: false})

//antd
import { Button, Checkbox, Form, Input, Typography, Carousel, Image } from 'antd';
import dynamic from 'next/dynamic';

const bannerArray = [
	{
		src: banner1?.src,
		key: 'banner-container-1',
	},
	{
		src: banner2?.src,
		key: 'banner-container-2',
	},
];

const Banner = () => {
	return (
		<div key='container' className='container'>
			<div key='banner-container' className='banner'>
				<Carousel arrows autoplay={true} infinite={false}>
					{bannerArray?.map((item) => (
						<div key={item?.key}>
							<Image width={'100%'} src={item?.src} loading='lazy' preview={false} />
						</div>
					))}
				</Carousel>
			</div>
		</div>
	);
};

export default Banner;

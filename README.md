E-Commerce Website
Hệ thống Web Thương Mại Điện Tử gồm:
* Backend: Sails.js (Node.js) + PostgreSQL
* Frontend: Next.js 13 (App Router) + Ant Design + TailwindCSS
Tổng quan hệ thống
e-commerce-website/
│
├── shopping-web-be-main/   # Backend - Sails.js API
└── shopping-web-fe-main/   # Frontend - Next.js 13
1/ Backend – Sails.js API
* Công nghệ sử dụng: 
- Sails.js v1.5
- PostgreSQL
- sails-postgresql adapter
- bcryptjs
- UUID
- Redis (connect-redis, socket.io-redis)
- Node.js ^18.16

* Cấu trúc chính
shopping-web-be-main/
│
├── api/
│   ├── controllers/
│   │   ├── product/
│   │   │   ├── add.js
│   │   │   └── get-list.js
│   │   ├── color/
│   │   ├── material/
│   │   ├── size/
│   │   └── type/
│   │
│   ├── models/
│   │   ├── Product.js
│   │   ├── Color.js
│   │   ├── Material.js
│   │   ├── Size.js
│   │   └── Type.js
│
├── config/
├── app.js
└── package.json

* Cài đặt Backend
- Yêu cầu:
Node.js >= 18.16
PostgreSQL
Redis (nếu sử dụng session/socket)
- Cài dependencies:;
cd shopping-web-be-main
npm install
- Cấu hình Database:
Mở file:
config/datastores.js
- Cấu hình PostgreSQL:
default: {
  adapter: 'sails-postgresql',
  url: 'postgresql://username:password@localhost:5432/database_name'
}
- Chạy server:
npm start
Backend mặc định chạy tại: http://localhost:1337

* API hiện có
Ví dụ:
Method	Endpoint	Chức năng
POST	/product/add	Thêm sản phẩm
GET	/product/get-list	Lấy danh sách sản phẩm
POST	/color/add	Thêm màu
POST	/material/add	Thêm chất liệu
POST	/size/add	Thêm size
POST	/type/add	Thêm loại

2/Frontend – Next.js 13
* Công nghệ sử dụng
- Next.js 13.4 (App Router)
- React 18
- Ant Design 5
- TailwindCSS
- Axios
- Dayjs / Moment
- React Router DOM

* Cấu trúc chính
shopping-web-fe-main/
│
├── src/
│   ├── app/
│   │   ├── cart/
│   │   ├── product/
│   │   ├── order/
│   │   └── ...
│   │
│   ├── api/
│   │   ├── apiConfig.ts
│   │   ├── authentication.ts
│   │   ├── apiList/
│   │   │   ├── product.ts
│   │   │   ├── cart.ts
│   │   │   ├── order.ts
│   │   │   ├── payment.ts
│   │   │   └── user.ts
│
├── public/
└── package.json

* Cài đặt Frontend
- Cài dependencies:
cd shopping-web-fe-main
npm install
- Cấu hình API URL:
Mở file: src/api/apiConfig.ts
Đảm bảo baseURL trỏ về backend: export const API_BASE_URL = "http://localhost:1337";
- Chạy dự án
npm run dev
Ứng dụng chạy tại: http://localhost:3000

* Luồng hoạt động hệ thống: 
- Frontend gọi API qua Axios
- Backend Sails xử lý request
- ORM kết nối PostgreSQL
- Trả dữ liệu về frontend
- Frontend render UI bằng Ant Design + Tailwind

 * Tính năng chính
 ** Người dùng
- Xem danh sách sản phẩm
- Xem chi tiết sản phẩm
- Thêm vào giỏ hàng
- Tạo đơn hàng
- Thanh toán

** Admin 
- Thêm sản phẩm
- Thêm màu sắc
- Thêm chất liệu
- Thêm size
- Thêm loại sản phẩm
- Quản lý người dùng

* Môi trường phát triển
- Thành phần: Port
- Backend: 1337
- Frontend: 3000
- Database: 5432

* Build Production
- Backend: NODE_ENV=production node app.js
- Frontend
npm run build
npm run start

* Yêu cầu hệ thống
Node.js >= 18
PostgreSQL >= 12
npm >= 9

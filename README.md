
# 🛒 E-Commerce Website Fullstack
### Hệ thống Thương mại Điện tử: Sails.js API & Next.js 13 (App Router)

![Node.js](https://img.shields.io/badge/Node.js-18.16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Sails.js](https://img.shields.io/badge/Sails.js-v1.5-00a8e1?style=for-the-badge&logo=sailsdotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v12+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-13.4-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

---

## 🏗 Tổng quan hệ thống
Hệ thống bao gồm hai phần tách biệt:
```text
e-commerce-website/
│
├── shopping-web-be-main/    # Backend - Sails.js API
└── shopping-web-fe-main/    # Frontend - Next.js 13
```
## 1️⃣ Backend – Sails.js API
🛠 Công nghệ sử dụng
```text
Framework: Sails.js v1.5

Database: PostgreSQL (sails-postgresql adapter)

Library: bcryptjs, UUID, Redis (connect-redis, socket.io-redis)

Runtime: Node.js ^18.16
```
### 📂 Cấu trúc cây (Backend)
```text
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
```
### 🚀 Cài đặt & Chạy
Cài đặt: 
```bash
🔴 cd shopping-web-be-main

🔴 npm install
```

Cấu hình: 
```bash
🔴 Sửa file config/datastores.js với URL PostgreSQL của bạn.
```
Chạy: 

```bash
🔴 npm start (Mặc định tại: http://localhost:1337)
```
### 📡 Danh sách API hiện có

| Phương thức | Endpoint | Chức năng |
| :---: | :--- | :--- |
| 🔵 **POST** | `/product/add` | Thêm sản phẩm mới |
| 🟢 **GET** | `/product/get-list` | Lấy danh sách sản phẩm |
| 🔵 **POST** | `/color/add` | Thêm màu sắc mới |
| 🔵 **POST** | `/material/add` | Thêm chất liệu mới |


## 2️⃣ Frontend – Next.js 13

### 🛠 Công nghệ sử dụng
```text
Framework: Next.js 13.4 (App Router), React 18

UI: Ant Design 5, TailwindCSS

Tools: Axios, Dayjs/Moment, React Router DOM
```
### 📂 Cấu trúc cây (Frontend)
``` text 
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
```
### 🚀 Cài đặt & Chạy
Cài đặt: 
```bash
🔴 cd shopping-web-fe-main

🔴 npm install
```
Cấu hình: 
```bash
🔴 Sửa file src/api/apiConfig.ts trỏ baseURL về http://localhost:1337.
```
Chạy:
```bash 
🔴 npm run dev (Mặc định tại: http://localhost:3000)
```
### ✨ Tính năng chính
``` text
👤 Người dùng
- Xem danh sách và chi tiết sản phẩm.

- Quản lý giỏ hàng, tạo đơn hàng và thanh toán.

🔐 Admin
- Quản lý sản phẩm (Thêm, Màu sắc, Chất liệu, Size, Loại).

- Quản lý người dùng.
```
### 🔄 Luồng hoạt động:
``` text
- Frontend gửi yêu cầu qua Axios đến Backend.

- Backend Sails tiếp nhận và xử lý request logic.

- ORM kết nối và thực hiện truy vấn trên PostgreSQL.

- Dữ liệu được trả về và Next.js thực hiện render UI.
```
### 📦 Triển khai (Build Production)

🔴Backend:
```
NODE_ENV=production node app.js
```

🔴Frontend:
 ```
npm run build 
npm run start
```

### 💻 Yêu cầu hệ thống
```text
- Node.js: >= 18

- PostgreSQL: >= 12

- npm: >= 9
```

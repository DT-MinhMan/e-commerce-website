# 🛒 Báo Cáo Kiểm Thử Phần Mềm - Website Bán Quần Áo "The Banned"

Dự án này là bài tập lớn cuối kỳ môn **Kiểm thử phần mềm** tại Trường Đại học Sài Gòn (SGU). Kho lưu trữ này chứa các tài liệu, kịch bản kiểm thử (Test Cases) và kết quả đánh giá chất lượng cho hệ thống website thương mại điện tử "The Banned".

Dự án áp dụng quy trình phát triển và kiểm thử theo **Mô hình chữ V (V-Model)**, kết hợp cả phương pháp kiểm thử hộp trắng (White-box) và kiểm thử hộp đen (Black-box).


## 💻 Thông Tin Hệ Thống (System Context)

Hệ thống được kiểm thử là một website bán quần áo trực tuyến hoạt động theo mô hình Client-Server, được xây dựng bằng các công nghệ:

* **Frontend:** ReactJS, Ant Design (AntD)
* **Backend:** Django, RESTful API
* **Database:** PostgreSQL

---

## 🧪 Chiến Lược Kiểm Thử (Testing Strategy)

Dự án áp dụng chiến lược kiểm thử toàn diện nhằm đảm bảo chức năng, khả năng sử dụng và độ ổn định của hệ thống:

### 1. Phương pháp kiểm thử
* **Kiểm thử hộp trắng (White-box Testing):**
    * Kỹ thuật áp dụng: Kiểm thử dòng điều khiển (Control Flow Testing).
    * Mục tiêu: Vẽ đồ thị dòng điều khiển, tính toán độ phức tạp Cyclomatic (McCabe) để tìm ra các đường cơ bản (đường độc lập) và thiết kế test case tương ứng cho các hàm Backend (ví dụ: `login`, `add_color`).
* **Kiểm thử hộp đen (Black-box Testing):**
    * Kỹ thuật áp dụng: Phân vùng tương đương (Equivalence Partitioning) và Bảng quyết định (Decision Table Testing).
    * Mục tiêu: Kiểm tra dữ liệu đầu vào/đầu ra trên giao diện người dùng mà không can thiệp vào mã nguồn (ví dụ: chức năng Đăng nhập, Đăng ký).

### 2. Công cụ sử dụng
* Kiểm thử thủ công (Manual Testing) trên giao diện Web.
* **Postman:** Sử dụng để kiểm thử các RESTful API Endpoints của Backend.

---

## 🎯 Phạm Vi Kiểm Thử (Testing Scope)

Dưới đây là danh sách các module nghiệp vụ đã được tiến hành kiểm thử và đánh giá:

### ✅ Các tính năng ĐÃ kiểm thử
* 🔐 **Tài khoản:** Đăng ký, Đăng nhập (User/Admin).
* 🛍️ **Mua sắm:** Danh mục sản phẩm, Thêm vào giỏ hàng, Cập nhật/Xóa sản phẩm trong giỏ.
* 💳 **Thanh toán:** Quy trình nhập thông tin địa chỉ, phương thức thanh toán và xác nhận đơn.
* 📦 **Quản trị (Admin):** Quản lý sản phẩm, Quản lý danh mục/thể loại, Quản lý người dùng.

### ⏳ Các tính năng CHƯA kiểm thử
* Quản lý đơn hàng (Order Management).

---

## 📊 Kết Quả Kiểm Thử Tiêu Biểu

*(Xem chi tiết toàn bộ kịch bản tại Chương 5 trong tài liệu Báo cáo đính kèm)*

* **Đăng nhập (Phân vùng tương đương):** Đã kiểm thử 6 test cases bao phủ các trường hợp email/mật khẩu hợp lệ, để trống, sai định dạng, và tài khoản không tồn tại.
* **Đăng ký (Bảng quyết định):** Đã thiết lập 24 luật (rules) bao phủ các biến thể của Email, Số điện thoại, Mật khẩu và Xác nhận mật khẩu. Đã tìm ra các ngoại lệ xử lý lỗi từ hệ thống.
* **Kiểm thử Backend (Đồ thị dòng điều khiển):** * Hàm `login`: Độ phức tạp Cyclomatic = 3 (3 đường độc lập).
    * Hàm `add_color`: Độ phức tạp Cyclomatic = 5 (5 đường độc lập).

---

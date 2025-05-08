import React from "react";

export function getOrderStatus(value) {
  switch (value) {
    case "toProgress":
      return <span>Đang xử lý</span>;
    case "toShip":
      return <span className="icon-placeout">Đang vận chuyển</span>;
    case "completed":
      return <span className="icon-placeout">Hoàn tất</span>;
    case "deleted":
      return <span className="icon-placeout">Đã hủy</span>;
  }
}
export function getFormType(value) {
  switch (value) {
    case "0":
      return <div className="icon-placeout">Tạo</div>;
    case "1":
      return <div className="icon-placeout">Cập Nhật</div>;
    case "2":
      return <div className="icon-placeout">Hủy</div>;
  }
}
export function getStackholderType(value) {
  switch (value) {
    case "0":
      return <div className="icon-placeout">Cá nhân</div>;
    case "1":
      return <div className="icon-placeout">Tổ chức</div>;
  }
}
export function getStackType(value) {
  switch (value) {
    case "0":
      return <div className="icon-placeout">Cổ phần tự do chuyển nhượng</div>;
    case "1":
      return <div className="icon-placeout">Cổ phần hạn chế chuyển nhượng</div>;
    case "2":
      return <div className="icon-placeout">Cổ phần ưu đãi</div>;
  }
}
export default {
  getOrderStatus,
  getFormType,
  getStackholderType,
  getStackType,
};

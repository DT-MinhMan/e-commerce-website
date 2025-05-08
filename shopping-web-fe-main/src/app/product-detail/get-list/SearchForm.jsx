"use client";
// react
import React, { useState, useEffect } from "react";
import product from "../../../api/apiList/product";
import dayjs from "dayjs";

// antd
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Typography,
  Select,
} from "antd";
import { FilterOutlined } from "@ant-design/icons";
const { Text } = Typography;

const SearchForm = ({ getList, setFilterValue, setPage }) => {
  // useState
  const [form] = Form.useForm();

  // search info
  const searchInfo = async () => {
    const name = form.getFieldValue("name");
    const status = form.getFieldValue("status");
    const productDetailType = form.getFieldValue("productDetailType")
    let params = {};
    if (name !== ''){
      params['name'] = name;
    }
    if (status !== ''){
      params['status'] = status;
    }
    if (productDetailType !== ''){
      params['productDetailType'] = productDetailType;
    }
    setFilterValue(params)
    setPage(1)
    // await getList(params);
  };

  // filter option
  // const filterOption = (input, option) => (option?.label ?? "").includes(input);

  return (
    <div className="search-table">
      <Form
        labelCol={{
          span: 12,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={searchInfo}
        form={form}
        style={{
          maxWidth: "90%",
        }}
      >
        <div className="company-filter-info grid grid-cols-2">
         {/*__________Tên sản phẩm__________ */}
          <Form.Item name="name" label="tên sản phẩm">
            <Input />
          </Form.Item>

          {/*__________Trạng thái sản phẩm__________ */}
          <Form.Item name="status" label="Trạng thái">
            <Select
              defaultValue="All"
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
        
        <div className="company-filter-info grid grid-cols-2">
          {/*__________Loại sản phẩm__________ */}
          <Form.Item name="productDetailType" label="Chi tiết sản phẩm">
            <Select
              defaultValue="color"
              style={{ width: 120 }}
              options={[
                { value: 'color', label: 'Màu' },
                { value: 'material', label: 'Vật liệu' },
                { value: 'size', label: 'Kích cỡ' },
                { value: 'type', label: 'Loại' },
              ]}
            />
          </Form.Item>
        </div>
        {/* <div className="filter-button"> */}
        <Form.Item className="flex justify-end">
          <Button
            htmlType="submit"
            icon={<FilterOutlined style={{ verticalAlign: "middle" }} />}
          >
            Lọc
          </Button>
        </Form.Item>
        {/* </div> */}
      </Form>
    </div>
  );
};
export default SearchForm;

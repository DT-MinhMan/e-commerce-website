"use client";
// react
import React, { useState, useEffect } from "react";
import userSearch from "../../../api/apiList/user";
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

const SearchForm = ({ getList, setPage, setFilterValue }) => {
  // useState
  const [form] = Form.useForm();

  // search info
  const searchInfo = async () => {
    let param = {
      email: form.getFieldValue("userEmail"),
      phone: form.getFieldValue("userPhone"),
      role: form.getFieldValue("userRole"),
      status: form.getFieldValue("userStatus")
    };
    setFilterValue({});
    setPage(1);
    // await getList(param);
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
          {/*__________company name__________ */}
          <Form.Item name="userEmail" label="Email">
            <Input />
          </Form.Item>

         {/*__________company name__________ */}
         <Form.Item name="userPhone" label="Số ">
            <Input pattern="[0-9]*" maxLength={10} />
          </Form.Item>
        </div>

        <div className="company-filter-info grid grid-cols-2">
           {/*__________Company code__________ */}
           <Form.Item name="userRole" label="Vai trò">
            {/* <Select 
              showSearch
              placeholder="Nhập mã tổ chức phát hành"
              optionFilterProp="children"
              filterOption={filterOption}
              options={companyCode}
            /> */}
            <Select
              defaultValue= ''
              style={{ width: 120 }}
              options={[
              { value: '', label: 'Tất cả' },
              { value: 'user', label: 'Khách hàng' },
              { value: 'staff', label: 'Nhân viên'},
              { value: 'admin', label: 'Quản trị viên' },
              ]}
            />
          </Form.Item>

          {/*__________Company phone Num__________ */}
          <Form.Item name="userStatus" label="Trạng thái">
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


        {/*__________Created date__________ */}

        {/* <Text>Ngày tạo</Text>
        <div className="grid grid-cols-2">
          <Form.Item name="startDate" label="từ ngày" wrapperCol={14}>
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>

          <Form.Item name="endDate" label="đến ngày" wrapperCol={14}>
            <DatePicker format={"DD/MM/YYYY"} />
          </Form.Item>
        </div> */}

        {/* <div className="filter-button"> */}
        <Form.Item className="flex justify-end">
          <Button
            htmlType="submit"
            icon={<FilterOutlined style={{ verticalAlign: "middle" }} />}
          >
            Filter
          </Button>
        </Form.Item>
        {/* </div> */}
      </Form>
    </div>
  );
};
export default SearchForm;

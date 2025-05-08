"use client";
// react
import React, { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
import _, { isEmpty, get} from "lodash";
import product from "../../../api/apiList/product";
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  CloseOutlined,
  InfoCircleOutlined 
} from "@ant-design/icons";
import getStatus from "../../../utils/helpers";

// css
import "./search-product.css";

// antd
import {
  Button,
  Checkbox,
  Form,
  Input,
  Typography,
  Table,
  Row,
  Col,
  Modal,
  Select,
  notification,
  InputNumber,
  Card
} from "antd";
const { Title } = Typography;

const CreateInfo = () => {
  // useState
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filterValue, setFilterValue] = useState({});
  // useEffect
  useEffect(() => {
    getList({...filterValue});
  }, [page, pageSize, filterValue]);
  // functions
  const getList = async (items) => {
    try {
      setLoading(true);
      let params = {
        ..._.omit(items,['productDetailType']),
        page: page - 1,
        limit: pageSize,
      };
      // Go set filter before update
      let res;
      switch (items?.productDetailType){
        case 'color':
          res = await product.list_product_colors(params);
          break;
        case 'material':
          res = await product.list_product_materials(params);
          break;
        case 'size':
          res = await product.list_product_sizes(params);
          break;
        case 'type':
          res = await product.list_product_types(params);
          break;
        default:
          res = await product.list_product_colors(params);
          break;
      }
      if (res) {
        // set total user
        setTotalUsers(res?.pagination?.total)
        // set list
        setList(res?.data);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  // set pagingation
  const handleTableChange = async (pagination, filters, sorter) => {
    const newPage = pagination.current;
    const newPageSize = pagination.pageSize;
    // Set limit if it has change
    // if (pageSize != pagination.pageSize){
      if (newPage !== page) {
        setPage(newPage);
      }
      if (newPageSize !== pageSize) {
        setPageSize(newPageSize);
      }
  };
  // colums in data table
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: "5%", // 10
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: "5%", // 20
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "3%", // 31
      // render: (text) => getStatus.getStatus(text),
    },
  ];
  return (
    <div className="container">
			<Title level={2} style={{textAlign:'center', fontFamily: 'Times New Roman'}}>Quản lý chi tiết sản phẩm</Title>
      <div style={{ margin: "5% 5%" }}>
        <SearchForm getList={getList} setFilterValue={setFilterValue} setPage={setPage}/>
      </div>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Table
            columns={columns}
            dataSource={list}
            onChange={handleTableChange}
            pagination={{
              pageSize,
              current: page,
              total: totalUsers,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50", "100"],
            }}
            // tableLayout="auto"
            scroll={{ x: 2000, y: 1000 }}
          />
        </Col>
      </Row>
    </div>
  );
};
export default CreateInfo;

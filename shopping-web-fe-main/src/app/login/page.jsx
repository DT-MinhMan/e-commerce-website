// react
"use client";
import React, { useState } from "react";
import axios from "axios";

// css
import "./login.css";

// antd
import { Button, Form, Input, Card,Typography, notification, Spin } from "antd";
import {useAuth} from "../../contexts/AuthenticationContext";
import authentication from "../../api/authentication";
import { useRouter } from "next/navigation";
import api from "../../api";


const login = () => {

}

const Login = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const {onLogin} = useAuth();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const params = {
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password")
      };
      const goLogin = await axios.post('http://127.0.0.1:8000/api/user/login', params);
      const rawData = goLogin.data
      const actionCode = rawData?.code
      if(actionCode == 0){
        const userData = rawData?.data
        onLogin(userData?.user, userData?.token);
        router.push("/");
        setLoading(false);
      }
      else{
        notification.error({
          message: "Tài khoản hoặc mật khẩu không chính xác",
          duration: 4,
        })
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Spin spinning={loading} tip="Vui lòng chờ">
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 8,
      }}
      style={{
        maxWidth: "100%",
        padding: "5% 15%",
        textAlign: "center",
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      form={form}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      onSubmitCapture={login}
    >
      <Card>  
        <Typography style={{margin:"1% 0% 5% 0%", fontSize:"1.7rem"}}>Đăng nhập</Typography>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Email đang trống",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: true,
              message: "Mật khẩu trang trống",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button htmlType="submit">Đăng nhập</Button>
        </Form.Item>
      </Card>
    </Form>
    </Spin>
  );
};

export default Login;

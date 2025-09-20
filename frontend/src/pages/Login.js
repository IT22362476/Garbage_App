import React from "react";
import { Button, Form, Input, message, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const rules = [{ required: true, message: "This field is required" }];

function Login() {
  const [cookies, setCookie] = useCookies(["userID"]);
  const navigate = useNavigate();
  const userID = cookies.userID;
  const onFinish = async (values) => {
    const { email, password } = values;

    try {
      // Fetch CSRF token from backend
      const csrfRes = await fetch("http://localhost:8070/user/csrf-token", {
        credentials: "include"
      });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.csrfToken;

      const response = await fetch("http://localhost:8070/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "CSRF-Token": csrfToken
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log(data.role);

      if (response.ok) {
        message.success("Login successful!");
        setCookie("userID", data.userId);

        if (data.role === "resident") {
          navigate("/residentHome ");
        } else if (data.role === "admin") {
          navigate("/adminHome");
        } else if (data.role === "collector") {
          navigate(`/CollectorHome/${userID}`);
        } else if (data.role === "recorder") {
          navigate("/CollectedWasteDashboard");
        }
      } else {
        message.error(data.error || "Login failed");
      }
    } catch (error) {
      message.error("An error occurred");
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={rules}>
            <Input
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={rules}>
            <Input.Password
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Login
          </Button>
        </Form>

        <Divider />
        <p className="text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;

import React, { useEffect } from "react";
import { Button, Form, Input, message, Divider, Spin } from "antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";

const rules = [{ required: true, message: "This field is required" }];

function Login() {
  const { user, login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user came back from OAuth
    const authStatus = searchParams.get("auth");
    if (authStatus === "success") {
      message.success("OAuth login successful!");
      navigateBasedOnRole();
    }
  }, [searchParams]);

  useEffect(() => {
    if (!loading && user) {
      navigateBasedOnRole();
    }
  }, [user, loading]);

  const navigateBasedOnRole = () => {
    if (!user) return;

    if (user.role === "resident") {
      navigate("/residentHome");
    } else if (user.role === "admin") {
      navigate("/adminHome");
    } else if (user.role === "collector") {
      navigate(`/CollectorHome/${user.id}`);
    } else if (user.role === "recorder") {
      navigate("/CollectedWasteDashboard");
    }
  };
  const onFinish = async (values) => {
    const { email, password } = values;
    const result = await login(email, password);
    if (result.success) {
      message.success("Login successful!");
      navigateBasedOnRole();
    } else {
      message.error(result.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="relative max-w-md mx-auto bg-white p-10 rounded-lg shadow-md w-full">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10 rounded-lg">
            <Spin tip="Logging in..." size="large" />
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={rules}>
            <Input
              placeholder="Enter your email"
              className="border border-gray-300 rounded-md"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={rules}>
            <Input.Password
              placeholder="Enter your password"
              className="border border-gray-300 rounded-md"
              disabled={loading}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={loading}
          >
            Login
          </Button>
        </Form>

        <Divider>OR</Divider>

        <Button
          type="default"
          block
          onClick={handleGoogleLogin}
          className="mb-4 border-gray-300 text-gray-700 flex items-center justify-center gap-2"
          disabled={loading}
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </Button>

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

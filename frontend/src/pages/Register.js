import React from "react";
import { Button, Form, Input, message, Divider } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaGoogle } from "react-icons/fa";

const baseRules = [{ required: true, message: "This field is required" }];

// Email validation rules
const emailRules = [
  { required: true, message: "Email is required" },
  { type: "email", message: "Please enter a valid email address" },
];

// Name validation rules
const nameRules = [
  { required: true, message: "Name is required" },
  { min: 2, message: "Name must be at least 2 characters long" },
  { max: 50, message: "Name must not exceed 50 characters" },
  {
    pattern: /^[a-zA-Z\s]+$/,
    message: "Name can only contain letters and spaces",
  },
];

// Contact validation rules
const contactRules = [
  { required: true, message: "Contact number is required" },
  {
    pattern: /^[0-9+\-\s\(\)]+$/,
    message: "Please enter a valid contact number",
  },
  { min: 10, message: "Contact number must be at least 10 digits" },
];

// Address validation rules
const addressRules = [
  { required: true, message: "Address is required" },
  { min: 5, message: "Address must be at least 5 characters long" },
  { max: 200, message: "Address must not exceed 200 characters" },
];

// Password validation rules
const passwordRules = [
  { required: true, message: "Password is required" },
  { min: 8, message: "Password must be at least 8 characters long" },
  {
    pattern: /(?=.*[a-z])/,
    message: "Password must contain a lowercase letter",
  },
  {
    pattern: /(?=.*[A-Z])/,
    message: "Password must contain an uppercase letter",
  },
  {
    pattern: /(?=.*\d)/,
    message: "Password must contain a number",
  },
  {
    pattern: /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/,
    message: "Password must contain a special character",
  },
];

// Confirm password validation
const confirmPasswordRules = [
  { required: true, message: "Please confirm your password" },
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match"));
    },
  }),
];

function Register() {
  const location = useLocation();
  const { selectedRole } = location.state || { selectedRole: "" };
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { register, loginWithGoogle } = useAuth();

  // Custom validation function for frontend validation
  const validateForm = (values) => {
    const errors = [];

    // Validate name
    if (!values.name || values.name.trim().length < 2) {
      errors.push({ msg: "Name must be at least 2 characters long" });
    }
    if (values.name && !/^[a-zA-Z\s]+$/.test(values.name)) {
      errors.push({ msg: "Name can only contain letters and spaces" });
    }

    // Validate email
    if (!values.email) {
      errors.push({ msg: "Email is required" });
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.push({ msg: "Please enter a valid email address" });
    }

    // Validate address
    if (!values.address || values.address.trim().length < 5) {
      errors.push({ msg: "Address must be at least 5 characters long" });
    }

    // Validate contact
    if (!values.contact) {
      errors.push({ msg: "Contact number is required" });
    } else if (!/^[0-9+\-\s\(\)]+$/.test(values.contact)) {
      errors.push({ msg: "Please enter a valid contact number" });
    }

    // Validate password
    if (!values.password) {
      errors.push({ msg: "Password is required" });
    } else {
      if (values.password.length < 8) {
        errors.push({ msg: "Password must be at least 8 characters long" });
      }
      if (!/(?=.*[a-z])/.test(values.password)) {
        errors.push({ msg: "Password must contain a lowercase letter" });
      }
      if (!/(?=.*[A-Z])/.test(values.password)) {
        errors.push({ msg: "Password must contain an uppercase letter" });
      }
      if (!/(?=.*\d)/.test(values.password)) {
        errors.push({ msg: "Password must contain a number" });
      }
      if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(values.password)) {
        errors.push({ msg: "Password must contain a special character" });
      }
    }

    // Validate confirm password
    if (values.password !== values.confirmPassword) {
      errors.push({ msg: "Passwords do not match" });
    }

    return errors;
  };

  const onFinish = async (values) => {
    // Frontend validation
    const validationErrors = validateForm(values);
    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => message.error(error.msg));
      return;
    }

    const registerValues = {
      ...values,
      role: selectedRole.toLowerCase(),
    };

    console.log(registerValues);

    try {
      const result = await register(registerValues);

      if (result.success) {
        message.success("Registration successful!");
        form.resetFields();
        navigate("/login");
      } else {
        if (result.error && Array.isArray(result.error)) {
          // Handle backend validation errors
          result.error.forEach((err) => {
            const errorMsg = err.msg || err.message || err;
            message.error(errorMsg);
          });
        } else {
          message.error(result.error || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Network error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="bg-green-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-md w-full my-12">
        <h2 className="text-2xl font-bold mb-6">Register as {selectedRole}</h2>
        <Form
          layout="vertical"
          onFinish={onFinish}
          form={form}
          validateTrigger="onBlur"
        >
          <Form.Item name="name" label="Name" rules={nameRules}>
            <Input
              placeholder="Enter your full name"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={addressRules}>
            <Input.TextArea
              placeholder="Enter your full address"
              className="border border-gray-300 rounded-md"
              rows={3}
            />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={emailRules}>
            <Input
              type="email"
              placeholder="Enter your email address"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>
          <Form.Item name="contact" label="Contact Number" rules={contactRules}>
            <Input
              placeholder="Enter your contact number (e.g., +1234567890)"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={passwordRules}>
            <Input.Password
              placeholder="Enter a strong password"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            rules={confirmPasswordRules}
            dependencies={["password"]}
          >
            <Input.Password
              placeholder="Confirm your password"
              className="border border-gray-300 rounded-md"
            />
          </Form.Item>

          {/* Password requirements info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-medium text-blue-800 mb-2">
              Password Requirements:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains at least one lowercase letter (a-z)</li>
              <li>• Contains at least one uppercase letter (A-Z)</li>
              <li>• Contains at least one number (0-9)</li>
              <li>• Contains at least one special character (!@#$%^&*)</li>
            </ul>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Register
          </Button>
        </Form>

        <Divider>OR</Divider>

        <Button
          type="default"
          block
          onClick={handleGoogleLogin}
          className="mb-4 border-gray-300 text-gray-700 flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-red-500" />
          Continue with Google
        </Button>

        <Divider />
        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

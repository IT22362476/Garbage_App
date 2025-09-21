import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, Button, Avatar } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar size={64} src={user?.avatar} icon={<UserOutlined />} />
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-blue-600 capitalize">
                  Role: {user?.role}
                </p>
                {user?.isOAuthUser && (
                  <p className="text-sm text-green-600">OAuth User</p>
                )}
              </div>
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>

        <Card title="Dashboard">
          <p>
            This is your dashboard. Navigate to different sections based on your
            role.
          </p>

          {user?.role === "resident" && (
            <div className="mt-4">
              <h3>Resident Features:</h3>
              <ul className="list-disc list-inside">
                <li>Schedule waste pickup</li>
                <li>Add garbage details</li>
                <li>View request status</li>
              </ul>
            </div>
          )}

          {user?.role === "admin" && (
            <div className="mt-4">
              <h3>Admin Features:</h3>
              <ul className="list-disc list-inside">
                <li>Manage users</li>
                <li>View analytics</li>
                <li>Manage vehicles</li>
                <li>Approve requests</li>
              </ul>
            </div>
          )}

          {user?.role === "collector" && (
            <div className="mt-4">
              <h3>Collector Features:</h3>
              <ul className="list-disc list-inside">
                <li>View assigned routes</li>
                <li>Update collection status</li>
                <li>View total garbage collected</li>
              </ul>
            </div>
          )}

          {user?.role === "recorder" && (
            <div className="mt-4">
              <h3>Recorder Features:</h3>
              <ul className="list-disc list-inside">
                <li>Record waste data</li>
                <li>Generate reports</li>
                <li>Manage waste station data</li>
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

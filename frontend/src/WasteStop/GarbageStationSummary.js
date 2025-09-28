import React, { useState, useEffect } from "react";
import { Modal, Input, Table, Card, Typography, Space } from "antd";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import WasteHeader from "./WasteHeader";
import Button from "../components/Button";
import {
  InfoCircleOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { CollectedWasteService } from "../services/collectedWasteService";

const { Title, Text } = Typography;

const GarbageStationSummary = () => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isAnalysisModalVisible, setIsAnalysisModalVisible] = useState(false);
  const [collectedWastes, setCollectedWastes] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all collected waste data from the backend
        const data = await CollectedWasteService.getAllWaste();
        setCollectedWastes(data);
        setReportData(data);
        setFilteredData(data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching collected wastes:", error);
      }
    };
    fetchData();
  }, []);

  const handleSeeDetails = () => {
    setIsDetailsModalVisible(true);
  };

  const handleAnalysis = () => {
    setIsAnalysisModalVisible(true);
    // Prepare the data for the chart
    const analysisData = prepareMonthlyAnalysisData(collectedWastes);
    setChartData(analysisData);
  };

  const handleReportDownload = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Truck Number",
          "Area",
          "Paper Waste",
          "Food Waste",
          "Polythene Waste",
          "Total Waste",
        ],
      ], // Define the table columns
      body: reportData.map(
        ({
          truckNumber,
          area,
          paperWaste,
          foodWaste,
          polytheneWaste,
          totalWaste,
        }) => [
          truckNumber,
          area,
          paperWaste,
          foodWaste,
          polytheneWaste,
          totalWaste,
        ]
      ),
    });
    doc.save("CollectedWasteReport.pdf");
  };

  const handleSearch = (value) => {
    const filtered = collectedWastes.filter((waste) =>
      waste.truckNumber.includes(value)
    );
    setFilteredData(filtered);
  };

  const prepareMonthlyAnalysisData = (data) => {
    const analysis = {};
    data.forEach(({ area, totalWaste }) => {
      if (!analysis[area]) analysis[area] = 0;
      analysis[area] += totalWaste;
    });
    return Object.entries(analysis).map(([key, value]) => ({
      name: key,
      value,
    }));
  };

  return (
    <>
      <WasteHeader h1="Summary Portal" />
      <div className="flex flex-col items-center w-full mt-10">
        <Title level={2}>Garbage Station Summary</Title>
        <Space direction="vertical" size="large">
          <div className="flex justify-center space-x-4">
            <Card
              onClick={handleSeeDetails}
              className="hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
              hoverable
              style={{
                width: 300,
                borderRadius: 10,
                backgroundColor: "#f0f2f5",
              }}
              cover={
                <InfoCircleOutlined
                  style={{ fontSize: 50, color: "#1890ff" }}
                />
              }
            >
              <Card.Meta
                title="See Details"
                description="View detailed information about collected waste."
              />
            </Card>
            <Card
              onClick={handleAnalysis}
              className="hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
              hoverable
              style={{
                width: 300,
                borderRadius: 10,
                backgroundColor: "#f0f2f5",
              }}
              cover={
                <BarChartOutlined style={{ fontSize: 50, color: "#52c41a" }} />
              }
            >
              <Card.Meta
                title="Monthly Analysis"
                description="Analyze waste collection data on a monthly basis."
              />
            </Card>
            <Card
              onClick={handleReportDownload}
              className="hover:shadow-xl transition duration-300 ease-in-out cursor-pointer"
              hoverable
              style={{
                width: 300,
                borderRadius: 10,
                backgroundColor: "#f0f2f5",
              }}
              cover={
                <DownloadOutlined style={{ fontSize: 50, color: "#faad14" }} />
              }
            >
              <Card.Meta
                title="See Reports"
                description="Download the reports of collected waste."
              />
            </Card>
          </div>
        </Space>
      </div>

      {/* Details Modal */}
      <Modal
        title="Truck Details"
        open={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
        width={1000} // Adjust this value to your preference
      >
        <Input.Search
          placeholder="Search by Truck Number"
          onSearch={handleSearch}
          enterButton="Search"
        />
        <Table
          dataSource={filteredData}
          columns={[
            {
              title: "Truck Number",
              dataIndex: "truckNumber",
              key: "truckNumber",
            },
            { title: "Area", dataIndex: "area", key: "area" },
            {
              title: "Paper Waste",
              dataIndex: "paperWaste",
              key: "paperWaste",
            },
            { title: "Food Waste", dataIndex: "foodWaste", key: "foodWaste" },
            {
              title: "Polythene Waste",
              dataIndex: "polytheneWaste",
              key: "polytheneWaste",
            },
            {
              title: "Total Waste",
              dataIndex: "totalWaste",
              key: "totalWaste",
            },
          ]}
          rowKey="_id" // Replace with your unique key
        />
      </Modal>
      {/* Monthly Analysis Modal */}
      <Modal
        title="Monthly Analysis"
        open={isAnalysisModalVisible}
        onCancel={() => setIsAnalysisModalVisible(false)}
        footer={null}
      >
        <PieChart width={400} height={400}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042"][index % 4]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Modal>

      <div className="fixed bottom-0 w-full bg-white border-t py-4 flex justify-between items-center px-5">
        <Button Button1="Cancel" Button2="Record New" />
      </div>
    </>
  );
};

export default GarbageStationSummary;

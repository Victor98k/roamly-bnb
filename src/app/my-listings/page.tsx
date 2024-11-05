"use client";

import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import TopNav from "@/components/topNav/topNav";
// import PageHero from "@/components/pageHero/pageHero";
import {
  Modal,
  Input,
  Button,
  message,
  notification,
  Card,
  Form,
  Popconfirm,
  PopconfirmProps,
} from "antd";
import { useRouter } from "next/navigation";
import { Listing } from "@/types/listings";

export default function MyListings() {
  const [messageApi] = message.useMessage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/listings?userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await response.json();
      setListings(Array.isArray(data) ? data : []); // Ensure listings is always an array
    } catch (error) {
      console.error("Error fetching listings:", error);
      api.error({
        message: "Error",
        description: "Failed to fetch listings.",
      });
      setListings([]);
    }
  };

  const handleCreateListing = async (values: any) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          price: parseFloat(values.price), // Convert price to number
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      api.success({
        message: "Success",
        description: "Listing created successfully.",
      });
      setIsModalVisible(false);
      form.resetFields();
      fetchMyListings();
    } catch (error) {
      console.error("Error creating listing:", error);
      api.error({
        message: "Error",
        description: "Failed to create listing.",
      });
    }
  };

  const handleDeleteListing = async (listingId: string) => {
    try {
      await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      fetchMyListings();
    } catch (error) {
      console.error("Error deleting listing:", error);
      api.error({
        message: "Error",
        description: "Failed to delete listing.",
      });
    }
  };

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Listing deleted");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Listing not deleted");
  };

  const submitEditListing = async (listing: Listing) => {
    try {
      // const userId = localStorage.getItem("userId");
      const response = await fetch(`/api/listings/${listing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...listing }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit listing");
      }

      api.success({
        message: "Success",
        description: "Listing edited successfully.",
      });
      setIsEditModalVisible(false);
      form.resetFields();
      fetchMyListings();
    } catch (error) {
      console.error("Error editing listing:", error);
      api.error({
        message: "Error",
        description: "Failed to edit listing.",
      });
    }
  };

  const handleEditListing = (listing: Listing) => {
    setIsEditModalVisible(true);
    form.setFieldsValue({
      id: listing.id,
      title: listing.title,
      description: listing.description,
      city: listing.city,
      price: listing.price,
      image: listing.image,
    });
  };

  return (
    <div>
      <TopNav />
      {contextHolder}
      {/* <PageHero /> */}
      <div className="container mx-auto px-4 py-8">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          className="mb-4"
        >
          Create New Listing
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(listings) && listings.length > 0 ? (
            listings.map((listing) => (
              <Card key={listing.id} title={listing.title}>
                <p>ID: {listing.id}</p>
                <p>{listing.description}</p>
                <p>Price: ${listing.price}</p>
                <p>City: {listing.city}</p>
                <img src={listing.image} alt={listing.title} />
                <Button
                  type="primary"
                  onClick={() => handleEditListing(listing)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this listing?"
                  onConfirm={() => {
                    handleDeleteListing(listing.id);
                    message.success("Listing deleted successfully");
                  }}
                  onCancel={cancel}
                >
                  <Button className="mt-2 ml-2" type="primary" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Card>
            ))
          ) : (
            <p>No listings found.</p>
          )}
        </div>
        <Modal
          title="Create New Listing"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleCreateListing} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please input the title!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true, message: "Please input the description!" },
              ]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please input the city!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input type="number" />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image URL"
              rules={[
                { required: true, message: "Please input the image URL!" },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Create Listing
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Edit Listing"
          visible={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={submitEditListing} layout="vertical">
            <Form.Item name="id" hidden>
              {<Input />}
            </Form.Item>
            <Form.Item name="title" label="Title">
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="image" label="Image URL">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Edit Listing
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

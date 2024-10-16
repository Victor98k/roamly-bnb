"use client";

import { useEffect, useState } from "react";
import {
  Modal,
  DatePicker,
  Input,
  Button,
  message,
  Space,
  notification,
  Popconfirm,
  Drawer,
} from "antd";
import type { PopconfirmProps } from "antd";
import { HeartFilled } from "@ant-design/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";

import { Listing } from "@/types/listings";
import { Booking, Customer } from "@/types/booking";

export default function ListingCards() {
  const [messageApi] = message.useMessage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [customer, setCustomer] = useState<Customer>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch("/api/listings");
      const data = await response.json();
      setListings(data);
    };

    fetchListings();
  }, []);

  // When making a new booking it may cause an error if the userId is not set.

  useEffect(() => {
    if (checkInDate && checkOutDate && selectedListing) {
      const days = dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
      setTotalPrice(days * selectedListing.price);
    }
  }, [checkInDate, checkOutDate, selectedListing]);

  const handleBooking = async () => {
    if (!selectedListing || !checkInDate || !checkOutDate) {
      console.error("Missing booking details");
      return;
    }

    const userId = localStorage.getItem("userId") || "";

    const bookingData: Partial<Booking> = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice: totalPrice,
      customer: customer,
      listingId: selectedListing.id,
      userId: userId,
    };

    console.log("Booking Data:", bookingData);

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error creating booking:", errorData);
        api.error({
          message: "Booking Error",
          description: "Booking could not be completed.",
        });
        return;
      }

      const newBooking = await response.json();
      console.log("Booking created successfully:", newBooking);

      setIsDrawerOpen(false);
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setCustomer({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
      });
      setTotalPrice(0);

      api.success({
        message: "Booking Success",
        description: "Booking created successfully.",
      });
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleOk = () => {
    handleBooking();
    success();
  };

  const success = () => {
    messageApi.open({
      type: "success",
      content: "Booking created successfully",
    });
  };
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Booking created successfully");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Booking not created");
  };

  return (
    <div className="container mx-auto p-4">
      {contextHolder}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <Card
            key={listing.id}
            className="overflow-hidden w-full max-w-md bg-slate-400"
          >
            <CardHeader>
              <CardTitle className="text-2xl text-teal-200">
                {listing.title}
              </CardTitle>
              <CardTitle className="text-sm text-gray-800 underline mt-2">
                {listing.city}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={listing.image}
                alt={listing.title}
                className="w-30 h-50 object-cover mb-4 rounded-xl "
              />
              <p className="text-sm text-gray-600 mb-2">
                {listing.description}
              </p>
              <p className="font-bold  text-2xl">
                <span className="text-teal-200">${listing.price} </span>/ night
              </p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => {
                  setSelectedListing(listing);
                  showDrawer();
                }}
                disabled={!listing.available}
                className="bg-teal-200 text-black hover:bg-teal-300 border  border-gray-400 rounded-3xl px-4 py-2 mr-2"
              >
                {listing.available ? "Book Now" : "Unavailable"}
              </Button>
              <Drawer
                title={`Book ${selectedListing?.title}`}
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                maskStyle={{ backgroundColor: "transparent" }}
              >
                <img
                  src={selectedListing?.image}
                  alt={selectedListing?.title}
                />
                <div className="grid gap-4 py-4 ">
                  <DatePicker
                    placeholder="Check-In Date"
                    value={checkInDate ? dayjs(checkInDate) : null}
                    onChange={(date) =>
                      setCheckInDate(date ? date.toDate() : undefined)
                    }
                    style={{ width: "100%" }}
                  />

                  <DatePicker
                    placeholder="Check-Out Date"
                    value={checkOutDate ? dayjs(checkOutDate) : null}
                    onChange={(date) =>
                      setCheckOutDate(date ? date.toDate() : undefined)
                    }
                    style={{ width: "100%" }}
                  />

                  <Input
                    placeholder="First Name"
                    value={customer.firstName}
                    onChange={(e) =>
                      setCustomer({ ...customer, firstName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Last Name"
                    value={customer.lastName}
                    onChange={(e) =>
                      setCustomer({ ...customer, lastName: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Phone"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                  />
                  <p className="font-bold">Total Price: ${totalPrice}</p>
                </div>
                <Popconfirm
                  title={`Are you sure you want to complete the booking? \n Total Price: $${totalPrice}`}
                  description="Click 'Yes' to confirm the booking."
                  onConfirm={handleOk}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="primary">Complete Booking</Button>
                </Popconfirm>
              </Drawer>
              <Button className="bg-teal-200 text-black hover:bg-teal-300 border border-gray-400 rounded-3xl px-4 py-2 mr-2">
                Details
              </Button>
              <Button className="bg-teal-200 text-black hover:bg-teal-300 border border-gray-400 rounded-3xl px-4 py-2">
                <HeartFilled />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

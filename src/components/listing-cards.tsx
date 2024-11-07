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
import {
  HeartFilled,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
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
import { Booking, UserBooking } from "@/types/booking";

export default function ListingCards() {
  const [messageApi] = message.useMessage();
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("isAdmin") === "true"
  );
  const [bookingInfo, setBookingInfo] = useState<UserBooking>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings");
        if (!response.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setListings(data);
        } else {
          console.error("Data is not an array:", data);
          setListings([]); // Ensure listings is an array
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        setListings([]); // Ensure listings is an array
      }
    };

    fetchListings();
  }, []);

  // VG KRAV
  // VG -  Booking (lätt): Totalpriset beräknas baserat på pris per natt och vistelselängd.
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedListing) {
      const days = dayjs(checkOutDate).diff(dayjs(checkInDate), "day");
      setTotalPrice(days * selectedListing.price);
    }
  }, [checkInDate, checkOutDate, selectedListing]);
  // VG KRAV
  // VG -  Booking (lätt): Bokningar kan endast skapas av en inloggad användare och innehåller användaruppgifter (se ovan) och property. Totalpriset beräknas baserat på pris per natt och vistelselängd.
  const handleBooking = async () => {
    if (!selectedListing || !checkInDate || !checkOutDate) {
      api.error({
        message: "Booking Error",
        description: "Missing booking details.",
      });
      return;
    }

    const userId = localStorage.getItem("userId");
    // Setting the userId in localstorage on login or signup. If the userId is not found in localstorage the user can´t make a booking.
    if (!userId) {
      api.error({
        message: "Booking Error",
        description: "User ID is missing. Please log in again.",
      });
      return;
    }

    if (
      !bookingInfo.firstName ||
      !bookingInfo.lastName ||
      !bookingInfo.phone ||
      !bookingInfo.email
    ) {
      api.error({
        message: "Booking Error",
        description: "Please fill in all contact information.",
      });
      return;
    }

    const bookingData: Partial<Booking> = {
      // The booking data is Partial since we+re not setting the updatedAt etc.
      checkIn: checkInDate,
      checkOut: checkOutDate,
      totalPrice: totalPrice,

      createdBy: {
        firstName: bookingInfo.firstName,
        lastName: bookingInfo.lastName,
        phone: bookingInfo.phone,
        email: bookingInfo.email,
      },
      listingId: selectedListing.id,
      userId: userId,
    };

    // Posting the booking data to the booking endpoint.
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
      setIsDrawerOpen(false);
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setBookingInfo({
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
      api.error({
        message: "Booking Error",
        description: "An unexpected error occurred.",
      });
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
  // const confirm: PopconfirmProps["onConfirm"] = (e) => {
  //   console.log(e);
  //   message.success("Booking created successfully");
  // };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Booking not created");
  };

  // VG KRAV
  // VG - En inloggad admin ska kunna ta bort listings.
  const handleDeleteListing = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      api.success({
        message: "Success",
        description: "Listing deleted successfully as Admin.",
      });

      // refresh listings after delete.
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== listingId)
      );
    } catch (error) {
      console.error("Error deleting listing:", error);
      api.error({
        message: "Error",
        description: "Failed to delete listing.",
      });
    }
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
              {/* Is the listing avalible */}
              <b className="text-sm text-gray-800">Available</b>
              {listing.available ? (
                <CheckCircleFilled
                  style={{ color: "green", fontSize: "24px" }}
                />
              ) : (
                <CloseCircleFilled style={{ color: "red", fontSize: "24px" }} />
              )}
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
                className="bg-sky-600 text-black hover:bg-teal-300 border  border-gray-400 rounded-3xl px-4 py-2 mr-2"
              >
                {/* VG KRAV  */}
                {/* Render the button based on if the listing is avalible or not.  */}
                {listing.available ? "Book Now" : "Unavailable"}
              </Button>

              <Drawer
                title={`Book ${selectedListing?.title}`}
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                maskStyle={{
                  backgroundColor: "transparent",
                }}
                style={{
                  borderRadius: "15px",
                }}
              >
                <img
                  src={selectedListing?.image}
                  alt={selectedListing?.title}
                  className="w-full h-50 object-cover mb-4 rounded-xl "
                />

                <div className="grid gap-4 py-4 ">
                  {/* The today button in the datepicker is not working.  */}
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
                    value={bookingInfo.firstName}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        firstName: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Last Name"
                    value={bookingInfo.lastName}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        lastName: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Phone"
                    value={bookingInfo.phone}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        phone: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Email"
                    type="email"
                    value={bookingInfo.email}
                    onChange={(e) =>
                      setBookingInfo({
                        ...bookingInfo,
                        email: e.target.value,
                      })
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
              {/* <Button className="bg-teal-200 text-black hover:bg-teal-300 border border-gray-400 rounded-3xl px-4 py-2 mr-2">
                Details
              </Button> */}
              <Button className="bg-teal-200 text-black hover:bg-teal-300 border border-gray-400 rounded-3xl px-4 py-2">
                <HeartFilled className="text-red-500" />
              </Button>
            </CardFooter>
            {isAdmin === true && (
              <Popconfirm
                title="Are you sure you want to remove this listing?"
                onConfirm={() => handleDeleteListing(listing.id)}
                onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  className=" ml-5 mt-2 text-black bg-red-500 hover:bg-red-600 border border-gray-400 rounded-3xl px-4 py-2 mr-2 mb-4"
                >
                  Remove Listing as Admin
                </Button>
              </Popconfirm>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

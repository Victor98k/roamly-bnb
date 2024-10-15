"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert } from "antd"; // Import Ant Design's Alert
// interface Listing {
//   id: string;
//   title: string;
//   image: string;
//   description: string;
//   city: string;
//   price: number;
//   available: boolean;
// }
import { Listing } from "@/types/listings";
import { Booking } from "@/types/bookings";

export async function ListingCardsComponent() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [CheckInDate, setCheckInDate] = useState<Date>();
  const [CheckOutDate, setCheckOutDate] = useState<Date>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info" | "warning" | undefined;
    message: string;
    description: string;
  } | null>(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch("/api/listings");
      const data = await response.json();
      setListings(data);
    };

    fetchListings();
  }, []);

  const handleBooking = async () => {
    console.log("Booking:", {
      listing: selectedListing,
      CheckInDate,
      CheckOutDate,
      name,
      email,
    });
    setIsModalOpen(false);
    // Reset form fields
    setCheckInDate(undefined);
    setCheckOutDate(undefined);
    setName("");
    setEmail("");
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listing: selectedListing,
          CheckInDate,
          CheckOutDate,
          name,
          email,
          userId: localStorage.getItem("userId"),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to book listing");
      }
      const data = await response.json();
      setAlert({
        type: "success",
        message: "Booking successful",
        description: "Your booking has been processed",
      });
    } catch (error) {
      console.error("Error during booking:", error);
      setAlert({
        type: "error",
        message: "Booking failed",
        description: "There was an error processing your booking",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {alert && (
        <Alert
          message={alert.message}
          description={alert.description}
          type={alert.type}
          showIcon
          closable
          onClose={() => setAlert(null)}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription>{listing.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p className="text-sm text-gray-600 mb-2">
                {listing.description}
              </p>
              <p className="font-bold">${listing.price} / night</p>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

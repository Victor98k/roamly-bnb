"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Listing {
  id: string
  title: string
  image: string
  description: string
  city: string
  price: number
  available: boolean
}

export function ListingCardsComponent() {
  const [listings, setListings] = useState<Listing[]>([])
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch("/api/listings")
      const data = await response.json()
      setListings(data)
    }

    fetchListings()
  }, [])

  const handleBooking = () => {
    // Handle the booking process here
    console.log("Booking:", { listing: selectedListing, date, name, email })
    setIsModalOpen(false)
    // Reset form fields
    setDate(undefined)
    setName("")
    setEmail("")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription>{listing.city}</CardDescription>
            </CardHeader>
            <CardContent>
              <img src={listing.image} alt={listing.title} className="w-full h-48 object-cover mb-4 rounded-md" />
              <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
              <p className="font-bold">${listing.price} / night</p>
            </CardContent>
            <CardFooter>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => setSelectedListing(listing)}
                    disabled={!listing.available}
                  >
                    {listing.available ? "Book Now" : "Unavailable"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Book {selectedListing?.title}</DialogTitle>
                    <DialogDescription>
                      Make your reservation for {selectedListing?.city}. Click finish when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <Input 
                      placeholder="Enter your email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleBooking}>Finish Booking</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
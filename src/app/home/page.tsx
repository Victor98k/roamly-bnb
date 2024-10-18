"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import TopNav from "@/components/topNav/topNav";
import PageHero from "@/components/pageHero/pageHero";
import ListingCards from "@/components/listingCards/listingCards";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <TopNav />
      <div>
        <PageHero />
        <ListingCards />
      </div>
    </>
  );
}

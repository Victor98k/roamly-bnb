"use client";

import TopNav from "@/components/topNav/topNav";
import PageHero from "@/components/pageHero/pageHero";

export default function Home() {
  return (
    <>
      <TopNav />
      <div>
        <PageHero />{" "}
        {/* Listing cards inside the page hero to clear up styling */}
      </div>
    </>
  );
}

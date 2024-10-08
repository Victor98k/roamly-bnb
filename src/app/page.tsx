import Image from "next/image";
import { useRouter } from "next/navigation";
import SideNav from "@/components/sideNav/sideNav";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="flex-1 flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <h1>Roamlly BnB</h1>
      </div>
    </div>
  );
}

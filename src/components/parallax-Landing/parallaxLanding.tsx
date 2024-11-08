// src/components/ParallaxImage.tsx
// import { useRef } from "react";
// import {
//   motion,
//   useScroll,
//   useSpring,
//   useTransform,
//   useMotionValue,
//   useVelocity,
//   useAnimationFrame,
// } from "framer-motion";
// import { wrap } from "@motionone/utils";
// import Image from "next/image";
// import landingListingOne from "@/app/assets/image/landing-listing.jpg";
// import dubaiLanding from "@/app/assets/image/dubai-landing.jpg";
// import landingTwo from "@/app/assets/image/landingTwo.jpg";
// import NewYork from "@/app/assets/image/newyork-landing.jpg";
// import baliBeach from "@/app/assets/image/bali-beach.jpg";
// import africaHotel from "@/app/assets/image/africa-hotel.jpg";
// import baliLanding from "@/app/assets/image/bali-landing.jpg";
// function ParallaxImage({ imageSrc, baseVelocity = 3 }) {
//   // Slowed down by reducing baseVelocity
//   // Slowed down by reducing baseVelocity
//   const baseX = useMotionValue(0);
//   const { scrollY } = useScroll();
//   const scrollVelocity = useVelocity(scrollY);
//   const smoothVelocity = useSpring(scrollVelocity, {
//     damping: 50,
//     stiffness: 400,
//   });
//   const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
//     clamp: false,
//   });

//   const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

//   const directionFactor = useRef(1);
//   useAnimationFrame((t, delta) => {
//     let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

//     if (velocityFactor.get() < 0) {
//       directionFactor.current = -1;
//     } else if (velocityFactor.get() > 0) {
//       directionFactor.current = 1;
//     }

//     moveBy += directionFactor.current * moveBy * velocityFactor.get();

//     baseX.set(baseX.get() + moveBy);
//   });

//   return (
//     <div className="overflow-hidden relative">
//       <motion.div className="flex space-x-4" style={{ x }}>
//         <Image
//           src={landingListingOne}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={dubaiLanding}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={landingTwo}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={NewYork}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={landingListingOne}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={baliBeach}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//         <Image
//           src={baliLanding}
//           alt="Parallax"
//           className="w-1/5 h-auto rounded-lg"
//         />
//       </motion.div>
//     </div>
//   );
// }

// export default ParallaxImage;

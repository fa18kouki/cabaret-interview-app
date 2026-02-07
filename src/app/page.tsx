import {
  Hero,
  HowItWorks,
  PickupStores,
  UserVoices,
  FAQ,
  Footer,
  FixedCTA,
} from "@/components/lp";

export default function Home() {
  return (
    <main className="bg-black">
      <Hero />
      <HowItWorks />
      <PickupStores />
      <UserVoices />
      <FAQ />
      <Footer />
      <FixedCTA />
    </main>
  );
}

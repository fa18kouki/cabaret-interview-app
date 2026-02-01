import {
  Hero,
  ServiceSteps,
  AppFeatures,
  StoreShowcase,
  UserVoices,
  FAQ,
  CTA,
  Footer,
} from "@/components/lp";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiceSteps />
      <AppFeatures />
      <StoreShowcase />
      <UserVoices />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

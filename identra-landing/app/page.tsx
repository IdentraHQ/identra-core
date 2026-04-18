import { Hero } from "@/components/sections/Hero";
import { ProblemInsight } from "@/components/sections/ProblemInsight";
import { HowIdentraWorks } from "@/components/sections/HowIdentraWorks";
import { ProductExperience } from "@/components/sections/ProductExperience";
import { SecurityTrust } from "@/components/sections/SecurityTrust";
import { Differentiation } from "@/components/sections/Differentiation";
import { DownloadFooter } from "@/components/sections/DownloadFooter";
import { SecureCoreScene } from "@/components/ui/SecureCoreScene";

export default function Home() {
  return (
    <>
      <SecureCoreScene /> {/* Global Fixed Background */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-between w-full pointer-events-none">
        {/* Sections must enable pointer-events-auto where needed */}
        <div className="w-full pointer-events-auto">
          <Hero />
          <ProblemInsight />
          <HowIdentraWorks />
          <ProductExperience />
          <SecurityTrust />
          <Differentiation />
          <DownloadFooter />
        </div>
      </main>
    </>
  );
}

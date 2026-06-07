"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PricingPage } from "../../src/components/PricingPage";

export default function NextPricingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-12 pb-12">
      <PricingPage 
        onBackToDashboard={() => {
          router.push("/dashboard");
        }}
        onUpgradeSuccess={() => {
          router.push("/dashboard");
        }}
        hideBackBtn={false}
      />
    </div>
  );
}

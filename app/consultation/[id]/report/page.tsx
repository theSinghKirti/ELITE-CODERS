"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ReportViewScreen } from "../../../src/components/ReportViewScreen";

export default function NextConsultationReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ReportViewScreen 
        consultationId={id} 
        onBackToDashboard={() => {
          router.push("/dashboard");
        }}
      />
    </div>
  );
}

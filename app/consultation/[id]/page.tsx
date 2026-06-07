"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActiveConsultationScreen } from "../../../src/components/ActiveConsultationScreen";

export default function NextConsultationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [doctorName, setDoctorName] = useState<string>("Dr. General");
  const [initialSymptoms, setInitialSymptoms] = useState<string>("");

  useEffect(() => {
    // Grab cached triage session data if any is available, otherwise default gracefully
    try {
      const storedDoctor = localStorage.getItem("triage_doc") || "Dr. General";
      const storedSymptoms = localStorage.getItem("triage_symptoms") || "High fever with throbbing headache.";
      setDoctorName(storedDoctor);
      setInitialSymptoms(storedSymptoms);
    } catch (e) {
      // Ignore
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <ActiveConsultationScreen
        doctorName={doctorName}
        initialSymptoms={initialSymptoms}
        onClose={() => {
          router.push("/dashboard");
        }}
        onSave={(summary) => {
          console.log("Saving dynamic page consultation telemetry:", summary);
          router.push(`/consultation/${id}/report`);
        }}
      />
    </div>
  );
}

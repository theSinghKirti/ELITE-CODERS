"use client";

import { useState, useEffect } from "react";

export interface SubscriptionState {
  isPaid: boolean;
  isLoading: boolean;
}

export function useSubscription(): SubscriptionState {
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Sync from localStorage immediately for high performance UI states
    const cachedPlan = localStorage.getItem("isPaidPlan");
    if (cachedPlan === "true") {
      setIsPaid(true);
    }

    // 2. Fetch from the subscription verification API endpoint to validate
    async function checkSubscription() {
      try {
        const storedAuth = localStorage.getItem("authUser");
        const email = storedAuth ? JSON.parse(storedAuth).email : "guest@demo.com";

        const response = await fetch(`/api/check-subscription?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          setIsPaid(data.isPaid);
          if (data.isPaid) {
            localStorage.setItem("isPaidPlan", "true");
          } else {
            localStorage.removeItem("isPaidPlan");
          }
        }
      } catch (err) {
        console.warn("⚠️ Subscription validation offline, fallback to cached state:", err);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();

    // Listen for storage events (e.g. upgrades in dashboard or pricing page)
    const handleStorageChange = () => {
      const plan = localStorage.getItem("isPaidPlan");
      setIsPaid(plan === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isPaid, isLoading };
}

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

const PRICE_IDS = {
  proLifetime: import.meta.env.VITE_STRIPE_PRICE_PRO,
  proMonthly: import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY,
};

export function useSubscription(user) {
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !supabase) {
      setPlan("free");
      setLoading(false);
      return;
    }

    supabase
      .from("subscriptions")
      .select("status, plan_type")
      .eq("auth_user_id", user.id)
      .eq("app", "fluoropath")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.status === "pro") {
          setPlan(data.plan_type || "pro");
        } else {
          setPlan("free");
        }
        setLoading(false);
      });
  }, [user]);

  const checkout = useCallback(
    async (priceKey) => {
      if (!supabase) return;
      const priceId = PRICE_IDS[priceKey] || priceKey;
      if (!priceId) {
        console.warn("No Stripe price ID configured for:", priceKey);
        return;
      }
      const res = await supabase.functions.invoke("create-checkout-session", {
        body: {
          priceId,
          app: "fluoropath",
          successUrl: window.location.origin + "/?upgraded=true",
          cancelUrl: window.location.origin + "/",
        },
      });
      if (res.data?.url) {
        window.location.href = res.data.url;
      } else if (res.error) {
        console.error("Checkout error:", res.error);
      }
    },
    []
  );

  const manage = useCallback(async () => {
    if (!supabase) return;
    const res = await supabase.functions.invoke("customer-portal", {
      body: { returnUrl: window.location.origin + "/" },
    });
    if (res.data?.url) {
      window.location.href = res.data.url;
    }
  }, []);

  const isPro = plan !== "free";

  return { plan, isPro, loading, checkout, manage };
}

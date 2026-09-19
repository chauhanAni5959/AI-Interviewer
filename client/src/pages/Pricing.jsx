import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiShield, FiX } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import Sidebar from "../components/Sidebar";
import api from "../utils/axios";
import { createPricingOrder, getPricingPlans, verifyPricingPayment } from "../apis/pricing.api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpay = () => new Promise((resolve, reject) => {
  if (window.Razorpay) {
    resolve(true);
    return;
  }
  const script = document.createElement("script");
  script.src = RAZORPAY_SCRIPT;
  script.onload = () => resolve(true);
  script.onerror = () => reject(new Error("Razorpay could not be loaded."));
  document.body.appendChild(script);
});

const Pricing = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    getPricingPlans()
      .then((data) => {
        const availablePlans = Array.isArray(data?.plans) ? data.plans : [];
        setPlans(availablePlans);
        if (availablePlans.length === 0) {
          setNotice({ type: "error", text: "No pricing plans are available right now." });
        }
      })
      .catch((error) => {
        console.error("Failed to load pricing plans:", error);
        const message = error.response?.status === 401
          ? "Your session has expired. Please sign in again."
          : error.response?.data?.message || "Pricing is temporarily unavailable.";
        setNotice({ type: "error", text: message });
      })
      .finally(() => setPlansLoading(false));
  }, []);

  const handleLogout = async () => {
    await api.get("/api/auth/logout");
    setUser(null);
    localStorage.removeItem("ai_interviewer_user");
    navigate("/", { replace: true });
  };

  const buyPlan = async (plan) => {
    setLoadingPlan(plan.id);
    setNotice(null);
    try {
      await loadRazorpay();
      const orderData = await createPricingOrder(plan.id);
      const checkout = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "AI Interviewer",
        description: `${plan.coins} interview coins`,
        order_id: orderData.order.id,
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#111111" },
        handler: async (response) => {
          try {
            const result = await verifyPricingPayment(response);
            const updatedUser = { ...user, interviewCoin: result.interviewCoin };
            setUser(updatedUser);
            localStorage.setItem("ai_interviewer_user", JSON.stringify(updatedUser));
            setNotice({ type: "success", text: `${result.coinsAdded || plan.coins} coins added to your account.` });
          } catch (error) {
            setNotice({ type: "error", text: error.response?.data?.message || "Payment verification failed." });
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: { ondismiss: () => setLoadingPlan(null) },
      });
      checkout.on("payment.failed", () => {
        setNotice({ type: "error", text: "Payment was not completed. No coins were added." });
        setLoadingPlan(null);
      });
      checkout.open();
    } catch (error) {
      setNotice({ type: "error", text: error.response?.data?.message || error.message || "Unable to start payment." });
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white text-[#151515]">
      <Sidebar user={user} onNewInterview={() => navigate("/interview")} onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa]">
        <header className="flex h-16 items-center justify-between border-b border-[#e9e9e9] bg-white px-4 sm:px-8">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm font-semibold text-[#646464] transition-colors hover:text-[#2167c7]">
            <FiArrowLeft /> Back to workspace
          </button>
          <div className="flex items-center gap-2 rounded-full border border-[#dce8f7] bg-[#f3f8ff] px-3 py-1.5 text-xs font-bold text-[#2167c7]">
            <HiSparkles /> {user?.interviewCoin ?? 0} coins
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#171717] sm:text-4xl">Choose the best plan for your practice</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#777]">Get the interview coins you need and keep building confidence with realistic practice.</p>
            <div className="mt-7 inline-flex items-center rounded-full border border-[#d9d9d9] bg-white p-1 text-xs font-semibold shadow-sm">
              <span className="rounded-full bg-[#2167c7] px-5 py-2 text-white">Coin plans</span>
              <span className="px-5 py-2 text-[#777]">One-time payment</span>
            </div>
          </div>

          {notice && (
            <div className={`mx-auto mt-8 flex max-w-5xl items-center justify-between border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
              <span>{notice.text}</span>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification"><FiX /></button>
            </div>
          )}

          <div className="mx-auto mt-10 grid max-w-5xl gap-0 overflow-hidden border border-[#dedede] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:grid-cols-3">
            {plansLoading && [1, 2, 3].map((placeholder) => (
              <div key={placeholder} className="h-[500px] animate-pulse border-b border-[#e4e4e4] bg-white md:border-b-0 md:border-r" aria-label="Loading pricing plan" />
            ))}
            {!plansLoading && plans.map((plan) => (
              <article key={plan.id} className={`relative flex min-h-[500px] flex-col border-b border-[#e4e4e4] p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 ${plan.featured ? "bg-[#f3f7ff]" : "bg-white"}`}>
                {plan.featured && <span className="absolute right-5 top-4 rounded-full bg-[#378be2] px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-white">Most popular</span>}
                <h2 className="text-center text-base font-bold text-[#252525]">{plan.name}</h2>
                <div className="mt-6 text-center"><span className="text-4xl font-bold tracking-tight text-[#141414]">{plan.displayPrice}</span></div>
                <p className="mt-2 text-center text-xs text-[#8a8a8a]">one-time payment</p>
                <p className="mt-1 text-center text-xs font-semibold text-[#555]">{plan.coins} interview coins</p>
                <button type="button" disabled={loadingPlan !== null} onClick={() => buyPlan(plan)} className="mt-7 min-h-11 w-full bg-[#2167c7] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1857ad] disabled:cursor-wait disabled:opacity-60">
                  {loadingPlan === plan.id ? "Opening checkout..." : "Buy it"}
                </button>
                <p className="mt-4 text-center text-xs text-[#2167c7]">Secure Razorpay checkout</p>
                <p className="mt-7 min-h-12 text-center text-xs leading-5 text-[#777]">{plan.description}</p>
                <div className="my-6 border-t border-[#aebbd0]" />
                <ul className="space-y-3 text-xs leading-5 text-[#555]">
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-[#42b88a]" /> Practice with AI interviews</li>
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-[#42b88a]" /> Detailed performance feedback</li>
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-[#42b88a]" /> Coins never expire</li>
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-7 flex justify-center gap-2 text-xs text-[#777]"><FiShield className="text-[#42b88a]" /> Payments are verified before coins are credited.</div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;

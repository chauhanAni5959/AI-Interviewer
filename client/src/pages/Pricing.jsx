import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f7f7] text-[#151515]">
      <Sidebar user={user} onNewInterview={() => navigate("/interview")} onLogout={handleLogout} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.08),_transparent_28%),#f7f7f7]">
        <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-8">
          <button type="button" onClick={() => navigate("/dashboard")} className="flex items-center gap-2 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-950">
            <FiArrowLeft /> Back to workspace
          </button>
          <div className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
            <HiSparkles className="text-amber-300" /> {user?.interviewCoin ?? 0} coins
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="text-center"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">Practice credits</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">Choose your practice pace</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-500">Simple one-time plans for more realistic interviews, feedback, and progress.</p>
            <div className="mt-7 inline-flex items-center rounded-full border border-neutral-200 bg-white p-1 text-xs font-semibold shadow-sm">
              <span className="rounded-full bg-neutral-950 px-5 py-2 text-white">Coin plans</span>
              <span className="px-5 py-2 text-neutral-500">One-time payment</span>
            </div>
          </motion.div>

          {notice && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mx-auto mt-8 flex max-w-5xl items-center justify-between rounded-2xl border px-4 py-3 text-sm ${notice.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}
            >
              <span>{notice.text}</span>
              <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification"><FiX /></button>
            </motion.div>
          )}

          <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
            {plansLoading && [1, 2, 3].map((placeholder) => (
              <div key={placeholder} className="h-[500px] animate-pulse rounded-3xl border border-neutral-200 bg-white" aria-label="Loading pricing plan" />
            ))}
            {!plansLoading && plans.map((plan, index) => (
              <motion.article
                key={plan.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ y: -4 }}
                className={`relative flex min-h-[500px] flex-col rounded-3xl border p-7 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition-shadow hover:shadow-[0_20px_45px_rgba(15,23,42,0.1)] ${plan.featured ? "border-amber-300 bg-[#fffdf5]" : "border-neutral-200 bg-white"}`}
              >
                {plan.featured && <span className="absolute right-5 top-4 rounded-full bg-amber-300 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-neutral-950">Most popular</span>}
                <h2 className="text-center text-base font-bold text-neutral-950">{plan.name}</h2>
                <div className="mt-6 text-center"><span className="text-4xl font-black tracking-tight text-neutral-950">{plan.displayPrice}</span></div>
                <p className="mt-2 text-center text-xs text-neutral-500">one-time payment</p>
                <p className="mt-1 text-center text-xs font-semibold text-neutral-700">{plan.coins} interview coins</p>
                <button type="button" disabled={loadingPlan !== null} onClick={() => buyPlan(plan)} className="mt-7 min-h-11 w-full rounded-xl bg-neutral-950 px-4 text-sm font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-wait disabled:opacity-60">
                  {loadingPlan === plan.id ? "Opening checkout..." : "Buy it"}
                </button>
                <p className="mt-4 text-center text-xs font-medium text-neutral-500">Secure Razorpay checkout</p>
                <p className="mt-7 min-h-12 text-center text-xs leading-5 text-neutral-500">{plan.description}</p>
                <div className="my-6 border-t border-neutral-200" />
                <ul className="space-y-3 text-xs leading-5 text-neutral-600">
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-emerald-600" /> Practice with AI interviews</li>
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-emerald-600" /> Detailed performance feedback</li>
                  <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-emerald-600" /> Coins never expire</li>
                </ul>
              </motion.article>
            ))}
          </div>

          <div className="mt-7 flex justify-center gap-2 text-xs text-neutral-500"><FiShield className="text-emerald-600" /> Payments are verified before coins are credited.</div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Check,
  Sparkles,
  Zap,
  Building2,
  Crown,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  ChevronDown,
} from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Starter",
    badge: null,
    price: { monthly: 0, yearly: 0 },
    priceInr: { monthly: 0, yearly: 0 },
    description: "Perfect to explore and test the platform",
    icon: Zap,
    color: "from-slate-500 to-slate-600",
    accentColor: "text-slate-400",
    borderColor: "border-slate-700",
    features: [
      "10 Business searches/month",
      "3 AI website generations",
      "1 User seat",
      "Basic email templates",
      "Community support",
      "Public demo links",
    ],
    limitations: [
      "No CRM pipeline",
      "No analytics dashboard",
      "No WhatsApp outreach",
    ],
    cta: "Start for Free",
    ctaStyle: "glass border border-slate-600 hover:border-slate-400",
    razorpayPlanId: null,
    stripePriceId: null,
  },
  {
    id: "pro",
    name: "Pro",
    badge: "Most Popular",
    price: { monthly: 12, yearly: 9 },
    priceInr: { monthly: 999, yearly: 799 },
    description: "For freelancers and small agencies scaling fast",
    icon: Crown,
    color: "from-blue-500 to-purple-600",
    accentColor: "text-blue-400",
    borderColor: "border-blue-500",
    features: [
      "Unlimited business searches",
      "Unlimited AI websites",
      "3 User seats",
      "Full CRM pipeline",
      "Analytics & revenue tracking",
      "Automated email outreach",
      "WhatsApp message templates",
      "Priority support",
      "Custom domain demos",
      "7-day free trial",
    ],
    limitations: [],
    cta: "Start 7-Day Free Trial",
    ctaStyle:
      "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white pulse-glow",
    razorpayPlanId: "plan_pro_inr",
    stripePriceId: "price_pro_usd",
  },
  {
    id: "agency",
    name: "Agency",
    badge: "Best Value",
    price: { monthly: 49, yearly: 39 },
    priceInr: { monthly: 3999, yearly: 3199 },
    description: "For established agencies with multiple clients",
    icon: Building2,
    color: "from-emerald-500 to-teal-600",
    accentColor: "text-emerald-400",
    borderColor: "border-emerald-500",
    features: [
      "Everything in Pro",
      "Unlimited user seats",
      "White-label branding",
      "Client portal access",
      "API access",
      "Bulk outreach campaigns",
      "Advanced CRM automation",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "7-day free trial",
    ],
    limitations: [],
    cta: "Start 7-Day Free Trial",
    ctaStyle:
      "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white",
    razorpayPlanId: "plan_agency_inr",
    stripePriceId: "price_agency_usd",
  },
];

const faqs = [
  {
    q: "Kya credit card chahiye free trial ke liye?",
    a: "Nahi! Aap bina credit card ke 7-din ka free trial shuru kar sakte hain. Sirf email se sign up karein.",
  },
  {
    q: "Kya main kabhi bhi cancel kar sakta hoon?",
    a: "Bilkul. Aap apna subscription kisi bhi waqt cancel kar sakte hain. Koi hidden fees nahi.",
  },
  {
    q: "India mein payment kaise karein?",
    a: "Hum Razorpay support karte hain — UPI, Net Banking, Credit/Debit Card sab accept hota hai. Aap INR mein pay kar sakte hain.",
  },
  {
    q: "International payments ke liye?",
    a: "Hum Stripe accept karte hain for USD payments — all major cards, Apple Pay, Google Pay.",
  },
  {
    q: "Kya refund milega?",
    a: "Haan! Agar aap 30 dinon mein satisfied nahi hain toh full refund milega. No questions asked.",
  },
  {
    q: "White-label kya hota hai?",
    a: "Agency plan mein aap apna logo aur brand naam use kar sakte hain — clients ko 'AI Agency V2' ka koi reference nahi dikhega.",
  },
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Agency Owner, Delhi",
    avatar: "R",
    color: "from-blue-500 to-purple-600",
    text: "Pehle mahine mein hi ₹45,000 kama liye. Pro plan ki value toh ₹999 mein zabardast hai!",
    stars: 5,
  },
  {
    name: "Priya Mehta",
    role: "Freelance Developer, Mumbai",
    avatar: "P",
    color: "from-pink-500 to-rose-600",
    text: "AI se bane websites dekh ke clients shocked ho jaate hain. Agency plan ne meri income triple kar di.",
    stars: 5,
  },
  {
    name: "Arjun Nair",
    role: "Digital Marketer, Bangalore",
    avatar: "A",
    color: "from-emerald-500 to-teal-600",
    text: "7-day trial mein hi 8 clients close kiye. Ab Agency plan pe hoon aur ROI insane hai.",
    stars: 5,
  },
];

declare global {
  interface Window {
    Razorpay: (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleRazorpay = (plan: typeof plans[number]) => {
    setLoadingPlan(plan.id);
    const amount = (billingCycle === "yearly" ? plan.priceInr.yearly : plan.priceInr.monthly) * 100;
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      amount,
      currency: "INR",
      name: "AI Agency V2",
      description: `${plan.name} Plan — ${billingCycle === "yearly" ? "Yearly" : "Monthly"}`,
      image: "/logo.png",
      handler: function () {
        window.location.href = "/register?plan=" + plan.id + "&trial=7";
      },
      prefill: { name: "", email: "", contact: "" },
      theme: { color: "#3b82f6" },
    };
    if (typeof window !== "undefined" && window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      window.location.href = "/register?plan=" + plan.id + "&trial=7";
    }
    setLoadingPlan(null);
  };

  const handleStripe = (plan: typeof plans[number]) => {
    setLoadingPlan(plan.id);
    window.location.href = `/api/checkout/stripe?plan=${plan.id}&billing=${billingCycle}`;
  };

  const handleCta = (plan: typeof plans[number]) => {
    if (plan.id === "free") {
      window.location.href = "/register";
      return;
    }
    if (currency === "INR") {
      handleRazorpay(plan);
    } else {
      handleStripe(plan);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-[#0f172a] -z-10" />
      <div className="fixed inset-0 bg-gradient-radial from-blue-900/20 via-transparent to-transparent -z-10" />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AI Agency V2</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-foreground font-medium">Pricing</Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-24 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Simple, transparent pricing</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Invest Smart,{" "}
              <span className="gradient-text">Earn More</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free. Upgrade when you're ready. Cancel anytime. Our Pro users average <strong className="text-foreground">₹40,000+/month</strong> in new revenue.
            </p>
          </motion.div>

          {/* Controls Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14"
          >
            {/* Billing Toggle */}
            <div className="glass rounded-full p-1 flex items-center gap-1">
              <button
                id="billing-monthly"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                id="billing-yearly"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Yearly
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>

            {/* Currency Toggle */}
            <div className="glass rounded-full p-1 flex items-center gap-1">
              <button
                id="currency-inr"
                onClick={() => setCurrency("INR")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  currency === "INR"
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇮🇳 INR (₹)
              </button>
              <button
                id="currency-usd"
                onClick={() => setCurrency("USD")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  currency === "USD"
                    ? "bg-blue-600 text-white"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🇺🇸 USD ($)
              </button>
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {plans.map((plan, i) => {
              const Icon = plan.icon;
              const isPopular = plan.badge === "Most Popular";
              const price = currency === "INR"
                ? plan.priceInr[billingCycle]
                : plan.price[billingCycle];
              const symbol = currency === "INR" ? "₹" : "$";

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className={`relative glass rounded-3xl p-8 flex flex-col border-2 transition-all duration-300 hover:scale-[1.02] ${
                    isPopular ? "border-blue-500 shadow-2xl shadow-blue-500/20" : plan.borderColor + "/30 hover:border-opacity-60"
                  }`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r ${plan.color} shadow-lg`}>
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon + Name */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{plan.name}</div>
                      <div className="text-xs text-muted-foreground">{plan.description}</div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-bold">
                        {price === 0 ? "Free" : `${symbol}${price.toLocaleString()}`}
                      </span>
                      {price !== 0 && (
                        <span className="text-muted-foreground mb-2 text-sm">/{billingCycle === "yearly" ? "mo, billed yearly" : "month"}</span>
                      )}
                    </div>
                    {price !== 0 && billingCycle === "yearly" && (
                      <div className="mt-1 text-sm text-emerald-400">
                        You save {symbol}{currency === "INR" ? (plan.priceInr.monthly - plan.priceInr.yearly) * 12 : (plan.price.monthly - plan.price.yearly) * 12}/year
                      </div>
                    )}
                    {plan.id !== "free" && (
                      <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        7-day free trial, no card needed
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    id={`cta-${plan.id}`}
                    onClick={() => handleCta(plan)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mb-8 ${plan.ctaStyle} ${loadingPlan === plan.id ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {loadingPlan === plan.id ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Payment methods */}
                  {plan.id !== "free" && (
                    <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" />
                      {currency === "INR"
                        ? "UPI · Net Banking · Cards via Razorpay"
                        : "Cards · Apple Pay · Google Pay via Stripe"}
                    </div>
                  )}

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-muted-foreground">{f}</span>
                      </div>
                    ))}
                    {plan.limitations.map((l, j) => (
                      <div key={j} className="flex items-start gap-3 opacity-40">
                        <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✕</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{l}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          >
            {[
              { icon: Shield, label: "30-Day Money Back", sub: "No questions asked" },
              { icon: Clock, label: "7-Day Free Trial", sub: "No card required" },
              { icon: Users, label: "500+ Agencies", sub: "Actively using it" },
              { icon: Star, label: "4.9/5 Rating", sub: "From 200+ reviews" },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-5 text-center card-hover">
                <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-sm font-semibold">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.sub}</div>
              </div>
            ))}
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Real Results from <span className="gradient-text">Real Users</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 card-hover"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-sm mb-5 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white`}>
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-24 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <button
                    id={`faq-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 text-center border border-blue-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
            <div className="relative">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Abhi Shuru Karein — Free Mein
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                7-din ka free trial. Koi credit card nahi. Agar pasand na aaye toh full refund. Kya khona hai?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register?plan=pro&trial=7"
                  id="final-cta-pro"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold flex items-center gap-2 hover:from-blue-600 hover:to-purple-700 transition-all pulse-glow"
                >
                  Pro Free Trial Shuru Karein <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  id="final-cta-free"
                  className="px-8 py-4 rounded-xl glass text-foreground font-semibold hover:bg-white/5 transition-all"
                >
                  Free Plan Try Karein
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">AI Agency V2</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Refund Policy</a>
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AI Agency V2
          </div>
        </div>
      </footer>
    </div>
  );
}

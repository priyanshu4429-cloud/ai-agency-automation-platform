"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Globe,
  Mail,
  BarChart3,
  ArrowRight,
  PlayCircle,
  Users,
  Zap,
  MapPin,
  Laptop,
  CheckCircle2,
  Menu,
  X,
  Target,
  LineChart,
  MessageSquare,
  Star,
  ChevronRight,
  MousePointerClick,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const stats = [
  { icon: Users, value: "226+", label: "Leads Found" },
  { icon: Globe, value: "150+", label: "AI Websites Generated" },
  { icon: Zap, value: "3x", label: "Faster Outreach" },
  { icon: BarChart3, value: "60%", label: "Average Response Rate" },
];

const steps = [
  { step: "01", icon: MapPin, title: "Find Businesses", desc: "Discover local businesses using real-time data." },
  { step: "02", icon: Laptop, title: "Generate Their Website", desc: "AI creates a complete website with content, images and design." },
  { step: "03", icon: Mail, title: "Reach Them Automatically", desc: "Send personalized outreach emails and messages." },
  { step: "04", icon: BarChart3, title: "Track & Convert", desc: "Manage leads, tasks and deals in your CRM." },
];

const solutions = [
  { icon: Globe, title: "AI Website Generation", desc: "Beautiful, modern websites generated in seconds." },
  { icon: Search, title: "Lead Intelligence", desc: "Find verified businesses without websites." },
  { icon: LineChart, title: "Competitor Analysis", desc: "Analyze their online presence and gaps." },
  { icon: MessageSquare, title: "Automated Outreach", desc: "Send personalized emails at scale." },
  { icon: Database, title: "CRM & Pipeline", desc: "Track leads, tasks and deals easily." },
  { icon: Target, title: "SEO & Content", desc: "AI-generated SEO content to rank better." },
];

// Placeholder component for Database icon since it's not exported from lucide-react directly in some versions
function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

const pricing = [
  {
    name: "Starter",
    desc: "Perfect for individuals",
    price: "₹1,999",
    period: "/month",
    features: ["500 leads per month", "100 AI websites", "Email outreach (basic)", "CRM access"],
    popular: false,
  },
  {
    name: "Growth",
    desc: "For small teams & agencies",
    price: "₹4,999",
    period: "/month",
    features: ["2,000 leads per month", "500 AI websites", "Automated outreach", "Advanced CRM & analytics", "Priority support"],
    popular: true,
  },
  {
    name: "Agency",
    desc: "For high-volume outreach",
    price: "₹9,999",
    period: "/month",
    features: ["10,000+ leads per month", "Unlimited websites", "Smart outreach sequences", "Team collaboration", "White-label (optional)"],
    popular: false,
  },
];

const caseStudies = [
  { name: "Hotel Aman Continental", loc: "Delhi, India", image: "hotel" },
  { name: "FitZone Gym", loc: "Gurgaon, India", image: "gym" },
  { name: "Sharma Dental Clinic", loc: "Noida, India", image: "clinic" },
  { name: "Glow Beauty Salon", loc: "Delhi, India", image: "salon" },
];

const testimonials = [
  { name: "Rohan Mehta", role: "Digital Marketer", text: '"I closed 5 clients in my first month using this platform. The AI websites are amazing!"' },
  { name: "Sneha Verma", role: "Founder, MarketPeak", text: '"Super easy to use and saves hours of manual work. Highly recommended!"' },
  { name: "Aarav Singh", role: "Freelancer", text: '"The outreach automation is a game changer. I can focus on closing, not searching."' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [billing, setBilling] = useState("Monthly");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0a0f1d] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Absolute Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[150px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-800/10 blur-[150px]" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? "bg-[#0a0f1d]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 transition-all duration-300">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="AI Agency Logo" width={160} height={50} className="h-10 w-auto object-contain" priority />
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              <a href="#platform" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Platform</a>
              <a href="#solutions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Solutions</a>
              <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
              <a href="#case-studies" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Case Studies</a>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Link href="/login" className="px-5 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                Get Started <ArrowRight className="inline w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <button className="lg:hidden p-2 text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" />
                AI-Powered Growth for Local Businesses
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white leading-[1.1]">
                Turn Local
                <br />
                Businesses Into
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  Digital Businesses.
                </span>
              </h1>
              
              <p className="text-lg text-slate-400 mb-8 max-w-xl leading-relaxed">
                Find businesses without websites, generate high-converting AI websites, and automate personalized outreach — all from one powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(37,99,235,0.4)]">
                  Start for Free <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <PlayCircle className="w-5 h-5" /> Watch Demo
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-[#0a0f1d] flex items-center justify-center">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
                <span>Trusted by 500+ agencies & freelancers</span>
              </div>
            </motion.div>

            {/* Hero 3D Complex Illustration (CSS representation of the laptop/cards) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 hidden lg:block h-[600px] perspective-[1000px]"
            >
              {/* The "Laptop" Base */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-slate-900/80 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden rotate-x-[15deg] rotate-y-[-10deg] rotate-z-[2deg] transform-style-3d">
                <div className="w-full h-6 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 p-4 flex gap-4">
                   <div className="w-1/4 h-full bg-slate-800/50 rounded-lg flex flex-col gap-2 p-2">
                      <div className="h-6 w-full bg-slate-700 rounded" />
                      <div className="h-6 w-full bg-slate-700/50 rounded" />
                      <div className="h-6 w-full bg-slate-700/50 rounded" />
                   </div>
                   <div className="flex-1 h-full bg-slate-800/30 rounded-lg border border-slate-700/50 relative overflow-hidden">
                      {/* Fake Map Grid */}
                      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_20px_#3b82f6]">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Floating Element 1: Feature Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] left-0 w-64 bg-slate-900/90 backdrop-blur-xl border border-blue-500/30 rounded-xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-semibold text-white">Generate Website</div>
                </div>
                <div className="text-xs text-slate-400">in seconds</div>
              </motion.div>

              {/* Floating Element 2: Target Business Card */}
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[10%] right-[10%] w-72 bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-0 shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden z-30"
              >
                <div className="h-24 bg-gradient-to-r from-cyan-600 to-blue-600 relative p-4">
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider">AI</div>
                   <h4 className="text-white font-bold text-sm">Aman Restaurant</h4>
                   <p className="text-cyan-100 text-xs">Delhi, India</p>
                </div>
                <div className="p-4 bg-slate-900">
                   <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold shadow-[0_0_15px_rgba(37,99,235,0.5)]">Generate Website</button>
                </div>
              </motion.div>

              {/* Floating Element 3: Mini 3D Shop Graphic */}
              <motion.div 
                animate={{ y: [0, -10, 0], rotateZ: [0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[25%] right-[5%] w-64 bg-slate-800/90 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl z-40 flex items-center gap-4"
              >
                 <div className="w-16 h-16 rounded bg-gradient-to-br from-blue-500 to-purple-600 shrink-0"></div>
                 <div>
                    <h5 className="text-white text-sm font-bold">Sharma Auto Care</h5>
                    <p className="text-slate-400 text-xs mb-2">No website</p>
                    <div className="flex gap-2">
                       <button className="px-2 py-1 bg-white/10 rounded text-[10px] text-white">View Demo</button>
                       <button className="px-2 py-1 bg-blue-600 rounded text-[10px] text-white">Outreach</button>
                    </div>
                 </div>
              </motion.div>
              
              {/* Handwritten note */}
              <div className="absolute bottom-[10%] right-[-5%] rotate-[-10deg] font-serif italic text-cyan-400 text-lg opacity-80 pointer-events-none">
                Automate Outreach<br/>Close Clients<br/>Grow
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 border-y border-white/5 bg-slate-900/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-center gap-4 px-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 text-xs font-semibold tracking-wide uppercase">
                Simple. Powerful. Automated.
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
            </div>
            <p className="text-slate-400">From finding businesses to closing clients — in just 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent -translate-y-1/2 -z-10" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0f172a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/30 transition-colors"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] group-hover:bg-blue-500/20 transition-colors" />
                
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-bold text-cyan-400">{step.step}</div>
                  <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center text-blue-400">
                    <step.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute right-[-15px] top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0a0f1d] border border-white/5 rounded-full items-center justify-center z-10 text-slate-500">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Solutions */}
      <section id="solutions" className="py-24 px-4 bg-[#070b14] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 text-xs font-semibold tracking-wide uppercase">
                Everything You Need
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Our Solutions</h2>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-slate-400">Tools to help you find, engage and convert local businesses.</p>
              <Link href="#" className="hidden sm:flex text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors items-center gap-1">
                View All Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {solutions.map((sol, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`bg-[#0f172a] border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-default ${i === 0 || i === 1 ? 'lg:col-span-2' : 'lg:col-span-2'}`}
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-900/30 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(37,99,235,0.1)] group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                  <sol.icon className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">{sol.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{sol.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="py-24 px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-blue-600/5 blur-[200px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 text-xs font-semibold tracking-wide uppercase">
              Fair Pricing
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Plans for Every<br/>Stage of Growth</h2>
            <p className="text-slate-400 text-lg mb-8">Start small, scale big. No hidden fees.</p>
            
            <div className="inline-flex items-center p-1 bg-slate-900 rounded-xl border border-white/5">
              <button 
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${billing === "Monthly" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setBilling("Monthly")}
              >
                Monthly
              </button>
              <button 
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${billing === "Yearly" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
                onClick={() => setBilling("Yearly")}
              >
                Yearly <span className="px-1.5 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-8 flex flex-col ${
                  plan.popular 
                    ? "bg-[#0f172a] border-2 border-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.2)] md:-translate-y-4" 
                    : "bg-[#0f172a] border border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-6">{plan.desc}</p>
                
                <div className="flex items-end gap-1 mb-8">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">{plan.period}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href="/register" 
                  className={`w-full py-3 rounded-xl font-medium text-center text-sm transition-all ${
                    plan.popular 
                      ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.4)]" 
                      : "bg-white/5 text-white hover:bg-white/10 border border-white/10"
                  }`}
                >
                  {plan.name === "Agency" ? "Contact Sales" : `Start ${plan.name} Plan`}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="case-studies" className="py-24 px-4 bg-[#070b14] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 text-xs font-semibold tracking-wide uppercase">
              Real Results
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Generated Websites<br/>for Real Businesses</h2>
            <p className="text-slate-400 text-sm mb-4">See how AI-generated websites help local businesses go digital.</p>
            <Link href="#" className="text-blue-400 text-sm font-medium hover:text-blue-300 flex items-center gap-1">
              View All Case Studies <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-8 snap-x scrollbar-hide">
            {caseStudies.map((study, i) => (
              <div key={i} className="min-w-[280px] sm:min-w-[320px] bg-[#0f172a] rounded-2xl border border-white/5 overflow-hidden snap-start group cursor-pointer hover:border-blue-500/50 transition-colors">
                <div className="h-40 bg-slate-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent z-10" />
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-500 group-hover:scale-105 transition-transform duration-500">
                    <Globe className="w-12 h-12 opacity-50" />
                  </div>
                </div>
                <div className="p-5 relative z-20 -mt-8">
                  <h3 className="font-bold text-white text-base">{study.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{study.loc}</p>
                  <button className="px-4 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-medium border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center gap-1">
                    View Demo <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 text-xs font-semibold tracking-wide uppercase">
              What Our Users Say
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Trusted by Builders<br/>Across India</h2>
            <p className="text-slate-400 text-sm">Helping agencies, freelancers and entrepreneurs grow faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-[#0f172a] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt={t.name} className="w-full h-full rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 italic mb-4">{t.text}</p>
                <div className="flex gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Wrapper */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-blue-900/40 to-[#0f172a] border border-blue-500/20 rounded-[2rem] p-8 sm:p-12 relative overflow-hidden">
          {/* Earth/Globe graphic placeholder */}
          <div className="absolute -bottom-40 right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 border border-blue-500/20 blur-[2px] opacity-50 flex items-start justify-center">
             <div className="w-[480px] h-[480px] rounded-full border border-blue-400/20 mt-4" />
          </div>
          
          <div className="relative z-10 max-w-lg">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your next client is already online.</h2>
            <p className="text-slate-400 text-xs tracking-widest uppercase mb-8">Find. Generate. Reach. Convert. In Minutes.</p>
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30">
              Start Finding Businesses <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="hidden md:block absolute bottom-12 right-12 font-serif italic text-cyan-300 text-xl opacity-70 transform -rotate-6">
            A More<br/>Digital India
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-[#070b14]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link href="/" className="mb-4 block">
                <Image src="/logo.png" alt="AI Agency Logo" width={140} height={40} className="h-8 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Helping local businesses go digital with AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white text-xs mb-4">Product</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Case Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs mb-4">Resources</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs mb-4">Company</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
            <div className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} AI Agency. All rights reserved.
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-1">
              Built with <span className="text-red-500">❤️</span> for a more digital world.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

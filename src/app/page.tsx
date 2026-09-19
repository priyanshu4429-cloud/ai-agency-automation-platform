"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Code,
  Smartphone,
  Search,
  CheckCircle2,
  Menu,
  X,
  MessageCircle,
  Monitor,
  ShoppingCart,
  Database,
  Megaphone,
  Palette,
  Lock,
  ChevronRight,
  Users,
  Globe,
  Zap,
  BarChart3,
  MapPin,
  Laptop,
  Mail
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

const services = [
  { id: "web", icon: Monitor, title: "Website Development", desc: "Custom designed, lightning-fast websites built for conversion and scale." },
  { id: "ecommerce", icon: ShoppingCart, title: "Custom E-Commerce", desc: "Tailored electronic commerce platforms built with robust modern technologies to suit your specific business needs." },
  { id: "mobile", icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform applications that deliver seamless user experiences." },
  { id: "marketing", icon: Megaphone, title: "Digital Marketing", desc: "Data-driven marketing strategies to increase visibility and drive qualified leads." },
  { id: "design", icon: Palette, title: "Graphic Designing", desc: "Stunning visual identities, branding, and UI/UX design that captivates." },
  { id: "crm", icon: Database, title: "ERP & CRM Systems", desc: "Custom business management solutions to streamline your operations." }
];

const technologies = [
  { name: "E-commerce Solutions", sub: "SHOPPING EXPERIENCE", icon: "🛒" },
  { name: "PHP", sub: "BACKEND", icon: "🐘" },
  { name: "Laravel", sub: "FRAMEWORK", icon: "🔴" },
  { name: "CodeIgniter", sub: "FRAMEWORK", icon: "🔥" },
  { name: "WordPress", sub: "CMS", icon: "W" },
  { name: "Shopify", sub: "E-COMMERCE", icon: "🛍️" },
];

const pricingPlans = [
  {
    name: "Standard Plan",
    price: "7,999",
    originalPrice: "10,000",
    gst: "1440",
    features: [
      "5 pages Website",
      "1 Year Free Domain Name (.com .in .org)",
      "1 Year Free Cloud Hosting",
      "Basic SEO Setup",
      "Mobile Responsive Design",
      "Contact Form Integration"
    ],
    popular: false,
    color: "blue"
  },
  {
    name: "Premium Plan",
    price: "13,999",
    originalPrice: "20,000",
    gst: "2520",
    features: [
      "12 pages Website",
      "1 Year Free Domain Name (.com .in .org)",
      "1 Year Free Cloud Hosting",
      "Advanced SEO Optimization",
      "Premium Custom Design",
      "Social Media Integration",
      "Google Analytics Setup"
    ],
    popular: true,
    color: "purple"
  },
  {
    name: "Premium E-commerce",
    price: "21,999",
    originalPrice: "30,000",
    gst: "3960",
    features: [
      "30 pages Website",
      "1 Year Free Domain Name (.com .in .org)",
      "1 Year Free Cloud Hosting",
      "20 Product Categories",
      "30 Product Listing From Our Side",
      "Premium E-commerce Design",
      "Payment Gateway Integration"
    ],
    popular: false,
    color: "pink"
  }
];

const countries = [
  { name: "India", flag: "🇮🇳" },
  { name: "USA", flag: "🇺🇸" },
  { name: "UK", flag: "🇬🇧" },
  { name: "Canada", flag: "🇨🇦" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "France", flag: "🇫🇷" },
  { name: "Australia", flag: "🇦🇺" },
  { name: "UAE", flag: "🇦🇪" },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeService, setActiveService] = useState(services[0].id);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = "919999999999"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I would like to discuss a website project.")}`;

  const activeServiceData = services.find(s => s.id === activeService) || services[0];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-800 font-sans selection:bg-blue-100">
      
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 transition-all duration-300">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="AI Agency Logo" width={180} height={60} className="h-12 w-auto object-contain drop-shadow-sm" priority />
            </Link>
            
            <div className="hidden lg:flex items-center gap-8">
              <a href="#services" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Services</a>
              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#pricing" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
                  <Lock className="w-4 h-4" /> Team Login
                </Link>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5">
                  <MessageCircle className="w-4 h-4" /> WhatsApp Us
                </a>
              </div>
            </div>
            
            <button className="lg:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-100 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-6 space-y-4">
                <a href="#services" className="block text-lg font-bold text-slate-700" onClick={() => setMobileMenuOpen(false)}>Services</a>
                <a href="#how-it-works" className="block text-lg font-bold text-slate-700" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
                <a href="#pricing" className="block text-lg font-bold text-slate-700" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <Link href="/login" className="flex items-center gap-2 text-lg font-bold text-slate-700" onClick={() => setMobileMenuOpen(false)}>
                    <Lock className="w-5 h-5" /> Team Login
                  </Link>
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-blue-600 text-white text-lg font-bold" onClick={() => setMobileMenuOpen(false)}>
                    <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bright 3D Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 min-h-[90vh] flex items-center">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-blue-400/20 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 mb-6 font-bold text-sm shadow-sm border border-blue-200/50">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Growth for Local Businesses</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
                Turn Local
                <br />
                Businesses Into
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Digital Businesses.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Find businesses without websites, generate high-converting AI websites, and automate personalized outreach — all from one powerful platform.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all"
                >
                  Start Your Project <ArrowRight className="w-5 h-5" />
                </a>
                <a 
                  href="#services" 
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-700 font-bold text-lg hover:border-blue-600 hover:text-blue-600 transition-all text-center shadow-sm"
                >
                  Explore Services
                </a>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-600 font-medium">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full rounded-full" />
                    </div>
                  ))}
                </div>
                <span>Trusted by 500+ agencies & freelancers</span>
              </div>
            </motion.div>

            {/* Light Theme 3D Complex Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 hidden lg:block h-[500px] perspective-[1000px]"
            >
              {/* The "Laptop" Base - Light Theme */}
              <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[90%] h-[320px] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden rotate-x-[15deg] rotate-y-[-10deg] rotate-z-[2deg] transform-style-3d">
                <div className="w-full h-8 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 p-5 flex gap-5 bg-slate-50/50">
                   <div className="w-1/4 h-full bg-white rounded-xl flex flex-col gap-3 p-3 border border-slate-100 shadow-sm">
                      <div className="h-6 w-full bg-slate-100 rounded-md" />
                      <div className="h-6 w-full bg-slate-100 rounded-md" />
                      <div className="h-6 w-full bg-slate-100 rounded-md" />
                      <div className="mt-auto h-8 w-full bg-blue-50 rounded-md border border-blue-100" />
                   </div>
                   <div className="flex-1 h-full bg-white rounded-xl border border-slate-200 relative overflow-hidden shadow-sm">
                      {/* Fake Map Grid */}
                      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Map Pointers */}
                      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full shadow-lg" />
                      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-green-500 rounded-full shadow-lg" />
                   </div>
                </div>
              </div>

              {/* Floating Element 1: Feature Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[-5%] w-64 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-2xl p-4 shadow-xl z-20"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">Generate Website</div>
                    <div className="text-xs text-slate-500 font-medium">in seconds</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Element 2: Target Business Card */}
              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[5%] right-[5%] w-72 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl p-0 shadow-2xl overflow-hidden z-30"
              >
                <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-5 flex flex-col justify-end">
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">AI Generated</div>
                   <h4 className="text-white font-bold text-lg leading-tight">Aman Restaurant</h4>
                   <p className="text-blue-100 text-xs mt-1">Delhi, India</p>
                </div>
                <div className="p-5 bg-white">
                   <button className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition-colors">View Live Website</button>
                </div>
              </motion.div>

              {/* Floating Element 3: Mini 3D Shop Graphic */}
              <motion.div 
                animate={{ y: [0, -10, 0], rotateZ: [0, -2, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[20%] right-[-10%] w-72 bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-2xl z-40 flex items-center gap-4"
              >
                 <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 shadow-inner flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-white opacity-50" />
                 </div>
                 <div className="flex-1">
                    <h5 className="text-slate-800 text-sm font-bold leading-tight">Sharma Auto Care</h5>
                    <p className="text-red-500 font-semibold text-[10px] uppercase tracking-wider mb-2 mt-1">No Website Found</p>
                    <div className="flex gap-2">
                       <button className="flex-1 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-600 border border-slate-200 hover:bg-slate-200">View Details</button>
                       <button className="flex-1 py-1.5 bg-blue-600 rounded-lg text-[10px] font-bold text-white shadow-md hover:bg-blue-700">Send Pitch</button>
                    </div>
                 </div>
              </motion.div>
              
              {/* Handwritten note */}
              <div className="absolute bottom-[5%] left-[5%] rotate-[-10deg] font-serif italic text-blue-600 text-xl opacity-80 pointer-events-none drop-shadow-sm">
                Automate Outreach<br/>Close Clients<br/>Grow Fast.
              </div>

            </motion.div>
          </div>
        </div>
      </section>

      {/* Light Stats Section */}
      <section className="py-12 border-y border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-200">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center justify-center gap-4 px-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Light Theme */}
      <section id="how-it-works" className="py-24 px-4 bg-white relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4 text-xs font-bold tracking-wide uppercase">
              Simple. Powerful. Automated.
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">From finding businesses to closing clients — in just 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 -translate-y-1/2 -z-10" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-900/5 transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-[40px] group-hover:bg-blue-100 transition-colors" />
                
                <div className="flex items-center justify-between mb-8">
                  <div className="text-sm font-black text-slate-300 group-hover:text-blue-200 transition-colors text-4xl">{step.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 transition-transform">
                    <step.icon className="w-6 h-6" />
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">{step.desc}</p>

                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border-2 border-slate-100 rounded-full items-center justify-center z-10 text-slate-400 shadow-sm">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Tabs Section (from White Theme) */}
      <section id="services" className="py-24 px-4 bg-slate-50 relative border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight">Our Services</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
              Your Business Deserves a Great Website. We make professional web design simple and accessible. By combining custom development with responsive design, we ensure your site looks perfect on every screen.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
              {services.map((s) => {
                const isActive = activeService === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveService(s.id)}
                    className={`flex items-center gap-4 w-full p-6 text-left relative transition-colors ${isActive ? "bg-white" : "hover:bg-slate-100"}`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTabIndicator" className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600" />
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-blue-100 text-blue-600" : "bg-white border border-slate-200 text-slate-500"}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-sm sm:text-base ${isActive ? "text-blue-600" : "text-slate-700"}`}>{s.title}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Tab Content */}
            <div className="w-full lg:w-2/3 p-8 sm:p-12 relative bg-white">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <activeServiceData.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">{activeServiceData.title}</h3>
                  </div>
                  
                  <p className="text-lg text-slate-600 leading-relaxed mb-10 font-medium">
                    {activeServiceData.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
                    {technologies.map((tech, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-default">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-2xl border border-slate-100 group-hover:scale-110 transition-transform">
                          {tech.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{tech.name}</h4>
                          <p className="text-xs font-bold text-slate-400 tracking-wider mt-1">{tech.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-100">
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-600/30 hover:-translate-y-1">
                      <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section (Web Design Agency Pricing) */}
      <section id="pricing" className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-lg font-bold text-blue-600 mb-2">Web Development and Website Design</h3>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">Plans & Pricing</h2>
            <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed font-medium">
              We are among India's best web solution companies committed to offering full ROI-driven customized web services at affordable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-3xl overflow-hidden flex flex-col ${
                  plan.popular 
                    ? "bg-blue-700 text-white shadow-2xl shadow-blue-900/20 transform lg:-translate-y-4" 
                    : "bg-white text-slate-800 shadow-xl border border-slate-200"
                }`}
              >
                <div className="p-8 sm:p-10 text-center relative">
                  {/* Package Title Tag */}
                  <div className={`inline-block px-6 py-2 rounded-full font-bold text-sm mb-8 shadow-sm ${plan.popular ? "bg-orange-500 text-white" : "bg-red-500 text-white"}`}>
                    {plan.name}
                  </div>
                  
                  {/* Vector Illustration Placeholder */}
                  <div className="w-40 h-40 mx-auto mb-8 relative">
                     <div className={`absolute inset-0 rounded-full blur-2xl opacity-50 ${plan.popular ? "bg-white/20" : "bg-blue-100"}`} />
                     <div className={`relative z-10 w-full h-full rounded-full border-4 flex items-center justify-center shadow-inner ${plan.popular ? "border-blue-400 bg-blue-600" : "border-slate-100 bg-white"}`}>
                        <Monitor className={`w-16 h-16 ${plan.popular ? "text-white" : "text-blue-600"}`} />
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className={`text-xl font-bold line-through ${plan.popular ? "text-blue-300" : "text-slate-400"}`}>₹{plan.originalPrice}</span>
                  </div>
                  <div className="flex items-start justify-center gap-1 mb-2">
                    <span className="text-3xl font-bold mt-2">₹</span>
                    <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                  </div>
                  <p className={`text-xs font-bold tracking-wider ${plan.popular ? "text-blue-200" : "text-slate-500"}`}>( + 18% GST ₹ {plan.gst} )</p>
                </div>

                <div className={`flex-1 p-8 sm:p-10 pt-0 flex flex-col border-t mt-4 ${plan.popular ? "border-blue-600" : "border-slate-100"}`}>
                  <h4 className={`text-center font-bold mb-6 ${plan.popular ? "text-white" : "text-slate-800"}`}>Features Includes</h4>
                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? "text-blue-300" : "text-blue-600"}`} />
                        <span className={`text-sm font-semibold leading-relaxed ${plan.popular ? "text-white" : "text-slate-700"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`w-full py-4 rounded-full font-bold text-center transition-all ${
                      plan.popular 
                        ? "bg-white text-blue-700 hover:bg-zinc-100 shadow-xl" 
                        : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-600 hover:text-white"
                    }`}
                  >
                    Select Plan
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving In Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-10">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest">We Are Serving In</h3>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>
        
        <div className="relative flex overflow-x-hidden group py-4">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            {[...countries, ...countries, ...countries].map((country, i) => (
              <div key={i} className="flex flex-col items-center justify-center mx-12">
                <span className="text-5xl mb-3 drop-shadow-md">{country.flag}</span>
                <span className="text-sm font-bold text-slate-600">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `}</style>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-slate-800 pb-16">
            <div className="md:col-span-2">
              <Link href="/" className="mb-6 block bg-white p-4 rounded-2xl w-fit">
                <Image src="/logo.png" alt="AI Agency Logo" width={200} height={70} className="h-14 w-auto object-contain" />
              </Link>
              <p className="text-slate-400 max-w-md leading-relaxed text-sm">
                100% Trusted and Registered Company providing the best web development and web design services. We ensure that a well-developed and attractive website helps our clients record ROI-driven results.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#services" className="text-slate-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="text-slate-400 hover:text-white transition-colors">Plans & Pricing</a></li>
                <li><a href={whatsappLink} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-3 text-sm font-medium">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
            <div className="font-medium">
              &copy; {new Date().getFullYear()} AI Agency Automation Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-white transition-colors flex items-center gap-2">
                <Lock className="w-4 h-4" /> Team Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

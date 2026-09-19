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
  Layout,
  Rocket,
  Lock,
  Globe2,
  Monitor,
  ShoppingCart,
  Database,
  Megaphone,
  Palette
} from "lucide-react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

const services = [
  { id: "web", icon: Monitor, title: "Website Development", desc: "Custom designed, lightning-fast websites built for conversion and scale." },
  { id: "mobile", icon: Smartphone, title: "Mobile App Development", desc: "Native and cross-platform applications that deliver seamless user experiences." },
  { id: "ecommerce", icon: ShoppingCart, title: "Custom E-Commerce", desc: "Tailored electronic commerce platforms built with robust modern technologies to suit your specific business needs." },
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
  const [activeService, setActiveService] = useState(services[2].id);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = "919999999999"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I would like to discuss a website project.")}`;

  const activeServiceData = services.find(s => s.id === activeService) || services[0];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] selection:bg-blue-500/30 text-zinc-50">
      <ParticleBackground />

      {/* Decorative Gradients */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[80%] rounded-full bg-blue-600/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[10%] -right-[10%] w-[50%] h-[70%] rounded-full bg-purple-600/20 blur-[120px] mix-blend-screen" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? "bg-[#030712]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-24 transition-all duration-500">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-500 group-hover:scale-105">
                <div className="w-full h-full bg-[#030712] rounded-[14px] flex items-center justify-center">
                  <Code className="w-6 h-6 text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-400" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-white">Elite<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Web.</span></span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-10">
              <a href="#services" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Services</a>
              <a href="#pricing" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Pricing</a>
              <a href="#portfolio" className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">Projects</a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="group relative px-6 py-3 rounded-2xl bg-white text-[#030712] text-sm font-black hover:bg-zinc-100 transition-all flex items-center gap-2 overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 duration-300">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <MessageCircle className="w-4 h-4" /> 
                <span className="relative z-10">Chat on WhatsApp</span>
              </a>
            </div>
            
            <button className="lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
              className="lg:hidden bg-[#030712] border-b border-white/10 overflow-hidden"
            >
              <div className="px-6 py-8 space-y-6">
                <a href="#services" className="block text-xl font-bold text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Services</a>
                <a href="#pricing" className="block text-xl font-bold text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
                <a href="#portfolio" className="block text-xl font-bold text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Projects</a>
                <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-black mt-8" onClick={() => setMobileMenuOpen(false)}>
                  <MessageCircle className="w-5 h-5" /> Book Consultation
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Premium 3D Hero */}
      <section className="relative pt-48 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-5xl mx-auto text-center z-10 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-10 hover:bg-white/10 transition-colors cursor-default"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-zinc-200 tracking-wide uppercase">No. 1 Website Development Company</span>
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[1.05] text-white">
              You Imagine.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                We Create.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
              We deliver ROI-driven web solutions, stunning designs, and robust e-commerce platforms tailored to skyrocket your digital growth.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={whatsappLink} 
                target="_blank" 
                rel="noreferrer" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(37,99,235,0.4)] relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Rocket className="w-5 h-5 relative z-10" /> 
                <span className="relative z-10">Start Your Project</span>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#services" 
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all text-center backdrop-blur-md"
              >
                Explore Services
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Floating 3D Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-[20%] left-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
           />
           <motion.div 
             animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} 
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
           />
        </div>
      </section>

      {/* Interactive Services Section */}
      <section id="services" className="py-32 px-4 bg-[#050b1a] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Our Services</h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
              Your business deserves a great website. We make professional web design simple and accessible. By combining custom development with responsive design, we ensure your site looks perfect on every screen.
            </p>
          </div>

          <div className="bg-[#030712] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[500px]">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-1/3 bg-white/5 border-r border-white/5 p-4 sm:p-6 flex flex-col gap-2">
              {services.map((s) => {
                const isActive = activeService === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveService(s.id)}
                    className={`flex items-center gap-4 w-full p-5 rounded-2xl transition-all duration-300 text-left relative overflow-hidden ${isActive ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30" : "hover:bg-white/5 border border-transparent"}`}
                  >
                    {isActive && (
                      <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full" />
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-zinc-400"}`}>
                      <s.icon className="w-5 h-5" />
                    </div>
                    <span className={`font-bold text-sm sm:text-base ${isActive ? "text-white" : "text-zinc-400"}`}>{s.title}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Tab Content */}
            <div className="w-full lg:w-2/3 p-8 sm:p-12 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeService}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <activeServiceData.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-3xl font-black text-white">{activeServiceData.title}</h3>
                  </div>
                  
                  <p className="text-xl text-zinc-400 leading-relaxed mb-10">
                    {activeServiceData.desc}
                  </p>

                  {/* Technology Grid (Dynamic based on selected service, showing generic for now) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-auto">
                    {technologies.map((tech, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {tech.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{tech.name}</h4>
                          <p className="text-xs font-semibold text-zinc-500 tracking-wider mt-1">{tech.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 pt-8 border-t border-white/5">
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">
                      <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 relative overflow-hidden">
        {/* Background glow for pricing */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-4 block">Web Development and Website Design</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">Plans & Pricing</h2>
            <p className="text-zinc-400 max-w-3xl mx-auto text-lg leading-relaxed">
              We are among the best web solution companies committed to offering full ROI-driven customized web services at affordable prices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className={`relative rounded-[2.5rem] p-8 sm:p-10 flex flex-col ${
                  plan.popular 
                    ? "bg-gradient-to-b from-blue-600 to-blue-900 border-2 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.3)] z-10" 
                    : "bg-white/5 border border-white/10 hover:border-white/20 backdrop-blur-xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-400 text-black font-black text-sm uppercase tracking-widest rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div className="text-center mb-10">
                  <h3 className={`text-2xl font-black mb-4 ${plan.popular ? "text-white" : "text-zinc-100"}`}>{plan.name}</h3>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-xl text-zinc-400 line-through font-medium">₹{plan.originalPrice}</span>
                  </div>
                  <div className="flex items-start justify-center gap-1">
                    <span className={`text-3xl font-bold mt-1 ${plan.popular ? "text-blue-200" : "text-blue-500"}`}>₹</span>
                    <span className={`text-6xl font-black tracking-tighter ${plan.popular ? "text-white" : "text-white"}`}>{plan.price}</span>
                  </div>
                  <p className={`text-sm mt-3 font-medium ${plan.popular ? "text-blue-200" : "text-zinc-500"}`}>( + 18% GST ₹ {plan.gst} )</p>
                </div>

                <div className={`flex-1 border-t pt-8 mb-10 ${plan.popular ? "border-blue-500/50" : "border-white/10"}`}>
                  <h4 className={`text-sm font-bold uppercase tracking-wider mb-6 text-center ${plan.popular ? "text-blue-200" : "text-zinc-400"}`}>Features Include</h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.popular ? "text-blue-300" : "text-blue-500"}`} />
                        <span className={`text-sm font-medium leading-relaxed ${plan.popular ? "text-zinc-100" : "text-zinc-300"}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-full py-5 rounded-2xl font-black text-lg text-center transition-all ${
                    plan.popular 
                      ? "bg-white text-blue-700 hover:bg-zinc-100 shadow-xl hover:scale-105" 
                      : "bg-white/10 text-white hover:bg-white/20 hover:scale-105"
                  }`}
                >
                  Choose {plan.name.split(" ")[0]}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving In Marquee */}
      <section className="py-20 border-y border-white/5 bg-black/40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500">We Are Serving In</h3>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full" />
        </div>
        
        <div className="relative flex overflow-x-hidden group">
          <div className="flex animate-marquee group-hover:[animation-play-state:paused] whitespace-nowrap">
            {[...countries, ...countries, ...countries].map((country, i) => (
              <div key={i} className="flex flex-col items-center justify-center mx-12 opacity-50 hover:opacity-100 transition-opacity cursor-default">
                <span className="text-5xl mb-3 drop-shadow-2xl">{country.flag}</span>
                <span className="text-sm font-bold text-zinc-400">{country.name}</span>
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
      <footer className="pt-24 pb-12 px-4 bg-[#030712]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-black text-white">Elite<span className="text-blue-500">Web.</span></span>
              </Link>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                100% Trusted Company providing the best web development and design services globally. We ensure ROI-driven results for every client.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
              <ul className="space-y-4">
                <li><a href="#services" className="text-zinc-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#pricing" className="text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href={whatsappLink} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-sm text-zinc-600 font-medium">
              &copy; {new Date().getFullYear()} EliteWeb Development. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-400 transition-colors flex items-center gap-2">
                <Lock className="w-3 h-3" /> Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

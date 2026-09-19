"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  Lock
} from "lucide-react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

const services = [
  {
    icon: Layout,
    title: "Custom Web Design",
    description: "Beautiful, highly-converting websites tailored specifically to your brand and business goals.",
  },
  {
    icon: Smartphone,
    title: "Responsive Development",
    description: "Flawless experience across all devices. Your website will look perfect on mobile, tablet, and desktop.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description: "Built-in search engine optimization to ensure your local customers can actually find you on Google.",
  },
];

const processSteps = [
  { step: "01", title: "Free Consultation", desc: "We discuss your business needs and vision." },
  { step: "02", title: "Custom Demo", desc: "We build a free preview of your website." },
  { step: "03", title: "Development", desc: "We finalize the design and add your content." },
  { step: "04", title: "Launch", desc: "Your website goes live in as little as 48 hours." },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappNumber = "919999999999"; // Can be dynamic or env var
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi! I would like to book a free consultation for a new website.")}`;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "glass" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">Elite<span className="text-blue-500">Web.</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Services</a>
              <a href="#process" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Our Process</a>
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="px-6 py-2.5 rounded-xl bg-white text-blue-600 text-sm font-bold hover:bg-zinc-100 transition-all flex items-center gap-2 shadow-lg hover:scale-105">
                <MessageCircle className="w-4 h-4" /> Book Consultation
              </a>
            </div>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass p-4 space-y-4 border-t border-white/10">
            <a href="#services" className="block text-sm font-medium text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Services</a>
            <a href="#process" className="block text-sm font-medium text-zinc-300" onClick={() => setMobileMenuOpen(false)}>Our Process</a>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 text-sm font-bold" onClick={() => setMobileMenuOpen(false)}>
              <MessageCircle className="w-4 h-4" /> Book Consultation
            </a>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 border border-white/10">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-zinc-300">Premium Web Development Agency</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-white">
              We Build Websites That
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Grow Your Business
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Stop losing customers to your competitors. Get a stunning, fast, and SEO-optimized website live in less than 48 hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)]">
                Book a Free Consultation <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#services" className="w-full sm:w-auto px-8 py-4 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-all text-center">
                View Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-4 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">What We Do</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
              We provide end-to-end digital solutions to establish your brand online and drive real revenue.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-8 card-hover border border-white/5 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <service.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">How We Work</h2>
              <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                We've streamlined the web design process so you don't have to deal with endless meetings or technical jargon. From idea to launch in days, not months.
              </p>
              
              <div className="space-y-6">
                {[
                  "No upfront commitment required",
                  "Free custom demo before you buy",
                  "Dedicated support and maintenance",
                  "Lightning fast delivery"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-zinc-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              
              <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
                Start Your Project <Rocket className="w-5 h-5" />
              </a>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {processSteps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-3xl p-6 relative overflow-hidden border border-white/5"
                >
                  <div className="absolute -top-4 -right-4 text-8xl font-black text-white/5">{s.step}</div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">{s.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-to-t from-blue-900/20 to-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto glass rounded-[3rem] p-12 sm:p-20 text-center border border-white/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6">Ready for a new website?</h2>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto mb-10">
              Message us on WhatsApp right now and let's get your business online today.
            </p>
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white text-blue-600 font-black text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">
              <MessageCircle className="w-6 h-6" /> Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Code className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white">Elite<span className="text-blue-500">Web.</span></span>
            </div>
            <div className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} EliteWeb Design Agency. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1">
                <Lock className="w-3 h-3" /> Staff Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

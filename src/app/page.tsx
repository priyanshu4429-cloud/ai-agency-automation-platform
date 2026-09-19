"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  Globe,
  Mail,
  BarChart3,
  Zap,
  ArrowRight,
  Shield,
  Users,
  Clock,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import ParticleBackground from "@/components/ParticleBackground";

const features = [
  {
    icon: Search,
    title: "Smart Business Discovery",
    description: "Automatically find local businesses using OpenStreetMap data with advanced filtering and categorization.",
  },
  {
    icon: Globe,
    title: "AI Website Generation",
    description: "Generate complete multi-page professional websites with AI-powered content, SEO, and beautiful designs.",
  },
  {
    icon: Mail,
    title: "Automated Outreach",
    description: "Send personalized emails and WhatsApp messages to prospects with AI-generated compelling copy.",
  },
  {
    icon: BarChart3,
    title: "Full CRM Pipeline",
    description: "Track leads from discovery to conversion with visual pipeline, analytics, and revenue tracking.",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "Deploy live demo websites in seconds with public URLs ready to share with prospects.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Role-based authentication, secure data handling, and audit logs for complete peace of mind.",
  },
];

const steps = [
  { step: "01", title: "Search", desc: "Find businesses without websites in any city" },
  { step: "02", title: "Detect", desc: "Automatically verify if they have a web presence" },
  { step: "03", title: "Generate", desc: "AI creates a stunning multi-page website" },
  { step: "04", title: "Deploy", desc: "Live demo URL ready in seconds" },
  { step: "05", title: "Outreach", desc: "Send personalized emails automatically" },
  { step: "06", title: "Convert", desc: "Track and close deals in the CRM" },
];

const testimonials = [
  { name: "Alex Rivera", role: "Agency Owner", text: "This tool 10x'd our outreach. We went from 5 leads a day to 50+ with zero extra effort." },
  { name: "Sarah Chen", role: "Freelance Developer", text: "The AI-generated websites are incredible. My clients think I spent weeks on them." },
  { name: "Marcus Johnson", role: "Marketing Director", text: "Best investment for our agency. The CRM alone saved us $500/month on other tools." },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? "glass" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AI Agency V2</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
              <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden glass p-4 space-y-4">
            <a href="#features" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#testimonials" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Testimonials</a>
            <Link href="/pricing" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            <Link href="/login" className="block text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            <Link href="/register" className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">Powered by Advanced AI</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Automate Your
              <br />
              <span className="gradient-text">Agency Growth</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Find local businesses, generate AI-powered websites, deploy live demos, and manage your entire sales pipeline — all on autopilot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/pricing" className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all pulse-glow">
                View Pricing & Start Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="px-8 py-4 rounded-xl glass text-foreground font-semibold hover:bg-white/5 transition-all">
                See How It Works
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="glass rounded-2xl p-2 max-w-5xl mx-auto">
              <div className="bg-card rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="ml-4 text-xs text-muted-foreground">AI Agency Dashboard</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-light rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-muted-foreground">Leads Discovered</div>
                  </div>
                  <div className="glass-light rounded-lg p-4">
                    <div className="text-2xl font-bold text-secondary">342</div>
                    <div className="text-sm text-muted-foreground">Websites Generated</div>
                  </div>
                  <div className="glass-light rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">$48,920</div>
                    <div className="text-sm text-muted-foreground">Revenue Generated</div>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <div className="glass-light rounded-lg p-4 h-32 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-primary/60" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Businesses Found", value: "50K+" },
              { label: "Websites Built", value: "12K+" },
              { label: "Emails Sent", value: "100K+" },
              { label: "Revenue Generated", value: "$2M+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete suite of tools to automate your agency from lead discovery to customer conversion.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From search to sale in 6 simple steps. Fully automated.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-5xl font-bold text-white/5">{s.step}</div>
                <div className="text-3xl font-bold gradient-text mb-2">{s.step}</div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Agencies</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our users are saying about AI Agency Automation.
            </p>
          </motion.div>
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
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Sparkles key={star} className="w-4 h-4 text-accent" />
                  ))}
                </div>
                <p className="text-sm mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Automate?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Join thousands of agencies already using AI Agency Automation to scale their business.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all pulse-glow">
            See Pricing & Start Free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">AI Agency V2</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} AI Agency Automation V2
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

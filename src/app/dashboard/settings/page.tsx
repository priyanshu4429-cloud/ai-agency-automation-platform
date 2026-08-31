"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Mail, Globe, Key, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [groqKey, setGroqKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure your agency automation settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Email Configuration</h3>
              <p className="text-xs text-muted-foreground">SMTP settings for email outreach</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">SMTP Host</label>
              <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="smtp.gmail.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SMTP Port</label>
              <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="587" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SMTP Username</label>
              <input type="text" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">SMTP Password</label>
              <input type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">From Email</label>
              <input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="noreply@youragency.com" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Key className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="font-semibold">AI Configuration</h3>
              <p className="text-xs text-muted-foreground">API keys for AI content generation</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Groq API Key</label>
              <input type="password" value={groqKey} onChange={(e) => setGroqKey(e.target.value)} className="w-full px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="gsk_..." />
              <p className="text-xs text-muted-foreground mt-1">Used for AI website content and email generation</p>
            </div>
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted">
            <h4 className="text-sm font-medium mb-2">Environment Variables</h4>
            <p className="text-xs text-muted-foreground mb-2">Set these in your .env file:</p>
            <code className="block text-xs bg-background p-3 rounded-lg font-mono">
              SMTP_HOST=smtp.gmail.com<br />
              SMTP_PORT=587<br />
              SMTP_USER=your-email@gmail.com<br />
              SMTP_PASS=your-app-password<br />
              FROM_EMAIL=noreply@youragency.com<br />
              GROQ_API_KEY=gsk_your_key_here<br />
              JWT_SECRET=your-secret-key
            </code>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}

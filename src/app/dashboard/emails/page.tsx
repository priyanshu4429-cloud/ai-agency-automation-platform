"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Loader2, CheckCircle, Clock } from "lucide-react";

export default function EmailsPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((data) => {
        // Filter email activities for display
        setEmails(data.activities?.filter((a: any) => a.type === "email_sent") || []);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Email Outreach</h1>
        <p className="text-sm text-muted-foreground">Track and manage your email campaigns.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emails Sent</p>
              <p className="text-2xl font-bold">{emails.length}</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Opened</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Email Activity</h3>
        <div className="space-y-3">
          {emails.map((email: any, i: number) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm">{email.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(email.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {emails.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No email activity yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Globe,
  Mail,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#ef4444", "#22c55e"];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/leads?limit=5").then((r) => r.json()),
    ]).then(([analyticsData, leadsData]) => {
      setAnalytics(analyticsData);
      setRecentLeads(leadsData.leads || []);
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

  const statusData = analytics?.statusBreakdown?.map((s: any) => ({
    name: s.status.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
    value: s.count,
  })) || [];

  const chartData = [
    { name: "Mon", leads: 12, emails: 8 },
    { name: "Tue", leads: 19, emails: 12 },
    { name: "Wed", leads: 15, emails: 10 },
    { name: "Thu", leads: 22, emails: 15 },
    { name: "Fri", leads: 28, emails: 20 },
    { name: "Sat", leads: 18, emails: 14 },
    { name: "Sun", leads: 14, emails: 10 },
  ];

  const stats = [
    {
      title: "Total Leads",
      value: analytics?.leads?.total || 0,
      icon: Users,
      change: "+12%",
      up: true,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Websites Built",
      value: analytics?.websites?.total || 0,
      icon: Globe,
      change: "+8%",
      up: true,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Emails Sent",
      value: analytics?.emails?.total || 0,
      icon: Mail,
      change: "+24%",
      up: true,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Tasks Done",
      value: analytics?.tasks?.completed || 0,
      icon: CheckCircle2,
      change: "+5%",
      up: true,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <Link
          href="/dashboard/search"
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Search Businesses
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.up ? (
                <ArrowUpRight className="w-3 h-3 text-success" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-destructive" />
              )}
              <span className={`text-xs ${stat.up ? "text-success" : "text-destructive"}`}>{stat.change}</span>
              <span className="text-xs text-muted-foreground">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                labelStyle={{ color: "#f8fafc" }}
              />
              <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="emails" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Lead Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {statusData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4">
            {statusData.map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-muted-foreground">{s.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Leads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Leads</h3>
          <Link href="/dashboard/leads" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th className="text-left py-3 px-2 font-medium">Business</th>
                <th className="text-left py-3 px-2 font-medium">Category</th>
                <th className="text-left py-3 px-2 font-medium">Location</th>
                <th className="text-left py-3 px-2 font-medium">Status</th>
                <th className="text-left py-3 px-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2">
                    <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:text-primary transition-colors">
                      {lead.businessName}
                    </Link>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground capitalize">{lead.category}</td>
                  <td className="py-3 px-2 text-muted-foreground">{lead.city || "N/A"}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium status-${lead.status} text-white`}>
                      {lead.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

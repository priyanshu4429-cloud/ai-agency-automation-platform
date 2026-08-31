"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, ExternalLink, Eye, Loader2 } from "lucide-react";
import Link from "next/link";

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leads?limit=100")
      .then((r) => r.json())
      .then(async (data) => {
        const allWebsites: any[] = [];
        for (const lead of data.leads || []) {
          const res = await fetch(`/api/leads/${lead.id}`);
          const leadData = await res.json();
          if (leadData.websites) {
            allWebsites.push(...leadData.websites);
          }
        }
        setWebsites(allWebsites);
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
        <h1 className="text-2xl font-bold">Generated Websites</h1>
        <p className="text-sm text-muted-foreground">View and manage all AI-generated websites.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {websites.map((site, i) => (
          <motion.div
            key={site.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 card-hover"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-medium truncate">{site.businessName}</h3>
                <p className="text-xs text-muted-foreground">{site.slug}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{site.viewCount || 0} views</span>
              </div>
              <span className={site.isPublished ? "text-success" : "text-muted-foreground"}>
                {site.isPublished ? "Published" : "Draft"}
              </span>
            </div>
            <Link
              href={`/demo/${site.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Demo
            </Link>
          </motion.div>
        ))}
      </div>

      {websites.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No websites generated yet. Go to a lead and click &quot;Generate Website&quot;.</p>
        </div>
      )}
    </div>
  );
}

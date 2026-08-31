"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  Send,
  Globe2,
  MessageSquare,
  Plus,
  CheckCircle2,
  Clock,
  Loader2,
  ExternalLink,
  StickyNote,
  ListTodo,
  Activity,
  Pencil,
  X,
  Save,
} from "lucide-react";
import Link from "next/link";

const statusOptions = ["new", "contacted", "demo_sent", "follow_up", "negotiation", "won", "lost"];

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [noteContent, setNoteContent] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [savingLead, setSavingLead] = useState(false);
  const [editError, setEditError] = useState("");
  const [editForm, setEditForm] = useState<any>({
    businessName: "", category: "", address: "", city: "", state: "",
    country: "", postalCode: "", phone: "", email: "", website: "",
    whatsapp: "", businessDescription: "",
  });

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  async function fetchLead() {
    setLoading(true);

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const d = await res.json();

      if (!res.ok) {
        console.error("FETCH LEAD API ERROR:", {
          status: res.status,
          response: d,
          leadId,
        });

        setData({
          lead: null,
          activities: [],
          notes: [],
          tasks: [],
          websites: [],
          emails: [],
          error: d?.error || "Failed to load lead",
          details: d?.details || null,
          statusCode: res.status,
        });

        return;
      }

      setData(d);
    } catch (err) {
      console.error("FETCH LEAD CLIENT ERROR:", err);

      setData({
        lead: null,
        activities: [],
        notes: [],
        tasks: [],
        websites: [],
        emails: [],
        error: "Unable to connect to lead API",
        details: err instanceof Error ? err.message : null,
      });
    } finally {
      setLoading(false);
    }
  }

  function openEditLead() {
    const lead = data?.lead;
    if (!lead) return;
    const metadata = lead.metadata && typeof lead.metadata === "object" && !Array.isArray(lead.metadata) ? lead.metadata : {};
    setEditForm({
      businessName: lead.businessName || "", category: lead.category || "",
      address: lead.address || "", city: lead.city || "", state: lead.state || "",
      country: lead.country || "India", postalCode: lead.postalCode || "",
      phone: lead.phone || "", email: lead.email || "", website: lead.website || "",
      whatsapp: metadata.whatsapp || "",
      businessDescription: metadata.businessDescription || "",
    });
    setEditError("");
    setEditOpen(true);
  }

  function updateEditField(field: string, value: string) {
    setEditForm((prev: any) => ({ ...prev, [field]: value }));
  }

  async function saveLeadChanges() {
    if (!editForm.businessName.trim()) return setEditError("Business name is required");
    if (!editForm.category.trim()) return setEditError("Category is required");
    setSavingLead(true);
    setEditError("");
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.details || result?.error || "Failed to update lead");
      setEditOpen(false);
      await fetchLead();
    } catch (err) {
      console.error("UPDATE LEAD CLIENT ERROR:", err);
      setEditError(err instanceof Error ? err.message : "Failed to update lead");
    } finally {
      setSavingLead(false);
    }
  }

  async function updateStatus(status: string) {
    setUpdatingStatus(true);
    try {
      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchLead();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function generateWebsite() {
    setGenerating(true);
    try {
      await fetch("/api/websites/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: parseInt(leadId) }),
      });
      fetchLead();
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  async function sendEmail() {
    setSendingEmail(true);
    try {
      await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: parseInt(leadId) }),
      });
      fetchLead();
    } catch (err) {
      console.error(err);
    } finally {
      setSendingEmail(false);
    }
  }

  async function addNote() {
    if (!noteContent.trim()) return;
    try {
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: parseInt(leadId), content: noteContent }),
      });
      setNoteContent("");
      fetchLead();
    } catch (err) {
      console.error(err);
    }
  }

  async function addTask() {
    if (!taskTitle.trim()) return;
    try {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: parseInt(leadId), title: taskTitle }),
      });
      setTaskTitle("");
      fetchLead();
    } catch (err) {
      console.error(err);
    }
  }

  async function completeTask(taskId: number) {
    try {
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: "completed" }),
      });
      fetchLead();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const lead = data?.lead;

  if (!lead) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-xl p-8">
          <h2 className="text-xl font-bold">
            {data?.error || "Lead could not be loaded"}
          </h2>

          {data?.details && (
            <p className="text-sm text-muted-foreground mt-3 break-words">
              {data.details}
            </p>
          )}

          {data?.statusCode && (
            <p className="text-xs text-muted-foreground mt-2">
              API Status: {data.statusCode}
            </p>
          )}

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => fetchLead()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Retry
            </button>

            <button
              onClick={() => router.push("/dashboard/leads")}
              className="px-4 py-2 rounded-lg bg-muted text-sm font-medium"
            >
              Back to Leads
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "notes", label: "Notes", icon: StickyNote },
    { id: "tasks", label: "Tasks", icon: ListTodo },
    { id: "emails", label: "Emails", icon: Mail },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="glass w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div><h2 className="text-xl font-bold">Edit Lead</h2><p className="text-sm text-muted-foreground mt-1">Update business details and save them to the database.</p></div>
              <button onClick={() => setEditOpen(false)} disabled={savingLead} className="p-2 rounded-lg bg-muted hover:bg-muted/80" aria-label="Close edit lead" title="Close"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["businessName","Business Name"],["category","Category"],["phone","Phone"],
                ["whatsapp","WhatsApp"],["email","Email"],["website","Website"],
                ["city","City"],["state","State"],["country","Country"],["postalCode","Postal Code"],
              ].map(([field,label]) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1.5">{label}</label>
                  <input type={field === "email" ? "email" : "text"} value={editForm[field] || ""} onChange={(e) => updateEditField(field, e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1.5">Full Address</label>
              <textarea value={editForm.address || ""} onChange={(e) => updateEditField("address", e.target.value)} rows={3} className="w-full resize-none px-3 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1.5">Business Description</label>
              <textarea value={editForm.businessDescription || ""} onChange={(e) => updateEditField("businessDescription", e.target.value)} rows={5} className="w-full resize-none px-3 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            {editError && <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{editError}</div>}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditOpen(false)} disabled={savingLead} className="px-4 py-2 rounded-lg bg-muted text-sm font-medium">Cancel</button>
              <button onClick={saveLeadChanges} disabled={savingLead} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2">
                {savingLead ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard/leads")}
          className="p-2 rounded-lg glass hover:bg-white/5 transition-colors"
          title="Back to leads"
          aria-label="Back to leads"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{lead.businessName}</h1>
          <p className="text-sm text-muted-foreground capitalize">{lead.category}</p>
        </div>
        <button onClick={openEditLead} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
          <Pencil className="w-4 h-4" /> Edit Lead
        </button>
      </div>

      {/* Status & Actions */}
      <div className="glass rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Status:</span>
          <select
            value={lead.status}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={updatingStatus}
            aria-label="Status"
            className="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={generateWebsite}
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe2 className="w-4 h-4" />}
            Generate Website
          </button>
          <button
            onClick={sendEmail}
            disabled={sendingEmail}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Send Email
          </button>
          {lead.phone && (
  <a
    href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      `Hi ${lead.businessName} team,

I came across your ${lead.category} business and created a free website preview for you.

You can view the demo here:
${
  data?.websites?.[0]?.demoUrl ||
  `${window.location.origin}/demo/${data?.websites?.[0]?.slug || ""}`
}

This is just a preview concept. If you like the idea, we can build a more professional and fully customized website for your business.

Would you like to discuss it?

Best regards,
AI Agency Team`
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-4 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors flex items-center gap-2"
  >
    <MessageSquare className="w-4 h-4" />
    WhatsApp
  </a>
)}
        </div>
      </div>

      {/* Websites */}
      {data?.websites?.length > 0 && (
        <div className="glass rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">Generated Websites</h3>
          <div className="space-y-2">
            {data.websites.map((site: any) => (
              <div key={site.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <div className="text-sm font-medium">{site.businessName}</div>
                  <div className="text-xs text-muted-foreground">{site.demoUrl}</div>
                </div>
                <Link
                  href={`/demo/${site.slug}`}
                  target="_blank"
                  className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold">Contact Information</h3>
              {lead.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.address}</span>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.phone}</span>
                </div>
              )}
              {lead.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{lead.email}</span>
                </div>
              )}
              {lead.website && (
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {lead.website}
                  </a>
                </div>
              )}
            </div>
            <div className="glass rounded-xl p-5 space-y-3">
              <h3 className="font-semibold">Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Category</span>
                  <p className="capitalize">{lead.category}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">City</span>
                  <p>{lead.city || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">State</span>
                  <p>{lead.state || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Country</span>
                  <p>{lead.country || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Has Website</span>
                  <p>{lead.hasWebsite ? "Yes" : "No"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Source</span>
                  <p className="capitalize">{lead.source}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a note..."
                />
                <button
                  onClick={addNote}
                  disabled={!noteContent.trim()}
                  title="Add note"
                  aria-label="Add note"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {data?.notes?.map((note: any) => (
                <div key={note.id} className="glass rounded-xl p-4">
                  <p className="text-sm">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
              {(!data?.notes || data.notes.length === 0) && (
                <div className="text-center py-12 text-muted-foreground text-sm">No notes yet</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                  className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Add a task..."
                />
                <button
                  onClick={addTask}
                  aria-label="Add task"
                  title="Add task"
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {data?.tasks?.map((task: any) => (
                <div key={task.id} className="glass rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => completeTask(task.id)}
                      aria-label={task.status === "completed" ? "Mark task as incomplete" : "Mark task as complete"}
                      title={task.status === "completed" ? "Mark task as incomplete" : "Mark task as complete"}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        task.status === "completed"
                          ? "bg-success border-success"
                          : "border-muted-foreground hover:border-primary"
                      }`}
                    >
                      {task.status === "completed" && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                    <div>
                      <p className={`text-sm ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{task.status}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!data?.tasks || data.tasks.length === 0) && (
                <div className="text-center py-12 text-muted-foreground text-sm">No tasks yet</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "emails" && (
          <div className="space-y-2">
            {data?.emails?.map((email: any) => (
              <div key={email.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{email.subject}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${email.status === "sent" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {email.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{email.body}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(email.sentAt).toLocaleString()}</p>
              </div>
            ))}
            {(!data?.emails || data.emails.length === 0) && (
              <div className="text-center py-12 text-muted-foreground text-sm">No emails sent yet</div>
            )}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2">
            {data?.activities?.map((activity: any) => (
              <div key={activity.id} className="glass rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(activity.createdAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!data?.activities || data.activities.length === 0) && (
              <div className="text-center py-12 text-muted-foreground text-sm">No activity yet</div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

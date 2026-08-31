"use client";

import { FormEvent, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Loader2,
  Check,
  Building2,
  X,
  MessageCircle,
  FileText,
} from "lucide-react";

const categories = [
  "restaurant",
  "cafe",
  "bar",
  "hospital",
  "clinic",
  "pharmacy",
  "school",
  "hotel",
  "gym",
  "salon",
  "hardware",
  "electrician",
  "bakery",
  "dentist",
  "bank",
  "supermarket",
  "car_repair",
  "florist",
  "furniture",
  "electronics",
  "clothing",
];

const initialManualForm = {
  businessName: "",
  category: "restaurant",
  address: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  phone: "",
  email: "",
  website: "",
  whatsapp: "",
  businessDescription: "",
};

export default function SearchPage() {
  const [city, setCity] = useState("Murliganj, Bihar, India");
  const [category, setCategory] = useState("restaurant");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [creating, setCreating] = useState<Set<string>>(new Set());
  const [created, setCreated] = useState<Set<string>>(new Set());

  const [manualOpen, setManualOpen] = useState(false);
  const [manualForm, setManualForm] = useState(initialManualForm);
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState("");
  const [manualSuccess, setManualSuccess] = useState("");

  async function handleSearch() {
    setLoading(true);
    setSearchError("");

    try {
      const res = await fetch(
        `/api/businesses/search?city=${encodeURIComponent(
          city
        )}&category=${encodeURIComponent(category)}&limit=20`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Business search failed");
      }

      setBusinesses(data.businesses || []);
    } catch (err) {
      setBusinesses([]);
      setSearchError(
        err instanceof Error ? err.message : "Business search failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function createLead(business: any) {
    const businessKey =
      business.osmId ||
      `${business.businessName}-${business.latitude}-${business.longitude}`;

    setCreating((prev) => new Set(prev).add(businessKey));

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName: business.businessName,
          category: business.category,
          address: business.address,
          city: business.city,
          state: business.state,
          country: business.country,
          postalCode: business.postalCode,
          phone: business.phone,
          email: business.email,
          website: business.website,
          latitude: business.latitude,
          longitude: business.longitude,
          osmId: business.osmId,
          source: "openstreetmap",
          metadata: {
            ...(business.tags || {}),
            sourcePhotos: business.media?.sourcePhotos || [],
            coverPhoto: business.media?.coverPhoto || null,
            mediaPolicy: business.media?.policy || "evidence_only",
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to create lead");
      }

      setCreated((prev) => new Set(prev).add(businessKey));
    } catch (err) {
      console.error("CREATE LEAD ERROR:", err);
    } finally {
      setCreating((prev) => {
        const next = new Set(prev);
        next.delete(businessKey);
        return next;
      });
    }
  }

  function updateManualField(
    field: keyof typeof initialManualForm,
    value: string
  ) {
    setManualForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setManualLoading(true);
    setManualError("");
    setManualSuccess("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...manualForm,
          source: "manual",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || "Failed to add business");
      }

      setManualSuccess(
        `${data.lead.businessName} has been added to Leads successfully.`
      );

      setManualForm(initialManualForm);
    } catch (err) {
      setManualError(
        err instanceof Error ? err.message : "Failed to add business"
      );
    } finally {
      setManualLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Search</h1>
          <p className="text-sm text-muted-foreground">
            Search OpenStreetMap or manually add a business to your CRM.
          </p>
        </div>

        <button
          onClick={() => {
            setManualOpen(true);
            setManualError("");
            setManualSuccess("");
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Business Manually
        </button>
      </div>

      <div className="glass rounded-xl p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">City</label>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter city name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (letter) => letter.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}

              Search Businesses
            </button>
          </div>
        </div>

        {searchError && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {searchError}
          </div>
        )}
      </div>

      {businesses.length > 0 && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Results ({businesses.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {businesses.map((business, index) => {
              const businessKey =
                business.osmId ||
                `${business.businessName}-${business.latitude}-${business.longitude}`;

              return (
                <motion.div
                  key={businessKey || index}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.05,
                  }}
                  className="glass card-hover rounded-xl p-5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>

                      <div>
                        <h3 className="font-medium">
                          {business.businessName}
                        </h3>

                        <p className="text-xs capitalize text-muted-foreground">
                          {business.category}
                        </p>
                      </div>
                    </div>

                    {business.hasWebsite ? (
                      <span className="rounded-full bg-success/10 px-2 py-1 text-xs text-success">
                        Has Website
                      </span>
                    ) : (
                      <span className="rounded-full bg-accent/10 px-2 py-1 text-xs text-accent">
                        No Website
                      </span>
                    )}
                  </div>

                  <div className="mb-4 space-y-1.5 text-sm">
                    {business.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                          {business.address}
                        </span>
                      </div>
                    )}

                    {business.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{business.phone}</span>
                      </div>
                    )}

                    {business.email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />

                        <span className="truncate">
                          {business.email}
                        </span>
                      </div>
                    )}

                    {business.website && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />

                        <span className="truncate">
                          {business.website}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => createLead(business)}
                    disabled={
                      creating.has(businessKey) || created.has(businessKey)
                    }
                    className={`flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors ${
                      created.has(businessKey)
                        ? "bg-success/10 text-success"
                        : "bg-primary/10 text-primary hover:bg-primary/20"
                    }`}
                  >
                    {creating.has(businessKey) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : created.has(businessKey) ? (
                      <>
                        <Check className="h-4 w-4" />
                        Added to Leads
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add to Leads
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {manualOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                y: 20,
              }}
              className="glass max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">
                    Add Business Manually
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add business details and save the business directly to
                    your CRM.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setManualOpen(false)}
                  aria-label="Close add business dialog"
                  title="Close"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ManualField
                    label="Business Name"
                    value={manualForm.businessName}
                    onChange={(value) =>
                      updateManualField("businessName", value)
                    }
                    placeholder="Priya Hardware"
                    required
                  />

                  <div>
                    <label htmlFor="category" className="mb-1.5 block text-sm font-medium">
                      Category
                    </label>

                    <select
                      id="category"
                      aria-label="Category"
                      value={manualForm.category}
                      onChange={(e) =>
                        updateManualField("category", e.target.value)
                      }
                      className="w-full rounded-lg border border-border bg-muted px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.map((item) => (
                        <option key={item} value={item}>
                          {item
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (letter) =>
                              letter.toUpperCase()
                            )}
                        </option>
                      ))}
                    </select>
                  </div>

                  <ManualField
                    label="Phone"
                    value={manualForm.phone}
                    onChange={(value) =>
                      updateManualField("phone", value)
                    }
                    placeholder="+91 98765 43210"
                  />

                  <ManualField
                    label="WhatsApp"
                    value={manualForm.whatsapp}
                    onChange={(value) =>
                      updateManualField("whatsapp", value)
                    }
                    placeholder="+91 98765 43210"
                    icon={<MessageCircle className="h-4 w-4" />}
                  />

                  <ManualField
                    label="Email"
                    value={manualForm.email}
                    onChange={(value) =>
                      updateManualField("email", value)
                    }
                    placeholder="business@example.com"
                    type="email"
                  />

                  <ManualField
                    label="Existing Website"
                    value={manualForm.website}
                    onChange={(value) =>
                      updateManualField("website", value)
                    }
                    placeholder="Leave blank if no website"
                  />

                  <ManualField
                    label="City"
                    value={manualForm.city}
                    onChange={(value) =>
                      updateManualField("city", value)
                    }
                    placeholder="Murliganj"
                  />

                  <ManualField
                    label="State"
                    value={manualForm.state}
                    onChange={(value) =>
                      updateManualField("state", value)
                    }
                    placeholder="Bihar"
                  />

                  <ManualField
                    label="Country"
                    value={manualForm.country}
                    onChange={(value) =>
                      updateManualField("country", value)
                    }
                    placeholder="India"
                  />

                  <ManualField
                    label="Postal Code"
                    value={manualForm.postalCode}
                    onChange={(value) =>
                      updateManualField("postalCode", value)
                    }
                    placeholder="852122"
                  />
                </div>

                <ManualField
                  label="Full Address"
                  value={manualForm.address}
                  onChange={(value) =>
                    updateManualField("address", value)
                  }
                  placeholder="Main Road, Murliganj, Bihar"
                />

                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Business Description
                  </label>

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                    <textarea
                      value={manualForm.businessDescription}
                      onChange={(e) =>
                        updateManualField(
                          "businessDescription",
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full resize-none rounded-lg border border-border bg-muted py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Describe what the business does, its main products, services, specialties, and target customers..."
                    />
                  </div>
                </div>

                {manualError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {manualError}
                  </div>
                )}

                {manualSuccess && (
                  <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
                    {manualSuccess}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setManualOpen(false)}
                    className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={manualLoading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {manualLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    Add to Leads
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type ManualFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  icon?: React.ReactNode;
};

function ManualField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  icon,
}: ManualFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}

        {required && <span className="ml-1 text-destructive">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-lg border border-border bg-muted py-2.5 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
            icon ? "pl-10" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}
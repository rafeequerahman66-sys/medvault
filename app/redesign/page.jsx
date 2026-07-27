"use client";

import { useState } from "react";
import { ShoppingCart, Search, Heart, User, ChevronDown, Star, Truck, ShieldCheck, Headphones, CreditCard, ArrowRight } from "lucide-react";
import { C, fmt, KITS, ITEMS, IMG } from "../page";

/* ============================================================
   MedVault — Krist-style redesign PREVIEW  (route: /redesign)
   Isolated from the live "/" app. Reuses real product data.
   Backend flow preserved = WhatsApp ordering.
   ============================================================ */

const WA = (msg) => `https://wa.me/918248613274?text=${encodeURIComponent(msg || "Hi, I'd like to order from MedVault")}`;

const GREEN = "#16A34A";
const INK = "#0D1B2A";
const BG = "#FFFFFF";
const SOFT = "#F5F7FA";
const LINE = "#E7ECF1";
const MUTED = "#6B7A8D";

const CATEGORIES = [
  { label: "Assessment Kits", img: KITS[0]?.images?.[0] || "/kit.jpg" },
  { label: "Diagnostic Equipment", img: IMG.stethoscope?.[0] || "/placeholder.svg" },
  { label: "Physiotherapy", img: IMG.goniometer?.[0] || "/placeholder.svg" },
  { label: "Nursing Essentials", img: IMG.gloves?.[0] || "/placeholder.svg" },
  { label: "Medical Accessories", img: IMG.pentorch?.[0] || "/placeholder.svg" },
];

const BESTSELLERS = [...KITS.slice(0, 3), ...ITEMS.slice(0, 5)].slice(0, 8);

const REVIEWS = [
  { q: "Ordered the MVP kit before my first assessment posting. Everything I needed was in one case.", n: "Aparna R.", y: "1st Year BPT · SRM", r: 5 },
  { q: "The BPL stethoscope is the real deal, not a cheap copy. Delivered to my hostel fast.", n: "Karthik V.", y: "2nd Year BPT · SRM", r: 5 },
  { q: "Free name and register-number printing meant my kit never got swapped in the lab.", n: "Meghna S.", y: "1st Year BPT · SRM", r: 5 },
];

function Stars({ n = 5 }) {
  return (
    <span style={{ color: "#F59E0B", display: "inline-flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < n ? "#F59E0B" : "none"} stroke={i < n ? "#F59E0B" : LINE} />
      ))}
    </span>
  );
}

function ProductCard({ p }) {
  const [hover, setHover] = useState(false);
  const img = p.images?.[0] || "/placeholder.svg";
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: BG, border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden",
        transition: "transform .25s, box-shadow .25s",
        transform: hover ? "translateY(-6px)" : "none",
        boxShadow: hover ? "0 18px 40px rgba(13,27,42,.12)" : "0 1px 3px rgba(13,27,42,.05)",
      }}
    >
      <div style={{ position: "relative", background: SOFT, aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <img src={img} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .4s", transform: hover ? "scale(1.05)" : "none" }} />
        {p.badge && (
          <span style={{ position: "absolute", top: 12, left: 12, background: GREEN, color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", padding: "5px 10px", borderRadius: 999 }}>{p.badge}</span>
        )}
        <button aria-label="Add to wishlist" style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", border: "none", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)", cursor: "pointer", display: "grid", placeItems: "center", color: MUTED }}>
          <Heart size={16} />
        </button>
        <a
          href={WA(`Hi, I'd like to order: ${p.name} (${fmt(p.price)})`)}
          target="_blank" rel="noreferrer"
          style={{
            position: "absolute", left: 12, right: 12, bottom: 12,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: INK, color: "#fff", textDecoration: "none",
            padding: "11px", borderRadius: 12, fontWeight: 700, fontSize: 13,
            transition: "opacity .25s, transform .25s",
            opacity: hover ? 1 : 0, transform: hover ? "translateY(0)" : "translateY(8px)",
          }}
        >
          <ShoppingCart size={15} /> Add to Cart
        </a>
      </div>
      <div style={{ padding: "16px 16px 18px" }}>
        <p style={{ fontSize: 11, color: MUTED, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{p.tagline || "MedVault"}</p>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: INK, lineHeight: 1.35, marginBottom: 8, minHeight: 40 }}>{p.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: INK }}>{fmt(p.price)}</span>
          {p.originalPrice > p.price && <span style={{ fontSize: 13, color: MUTED, textDecoration: "line-through" }}>{fmt(p.originalPrice)}</span>}
        </div>
        <Stars n={5} />
      </div>
    </div>
  );
}

export default function RedesignPreview() {
  const [mega, setMega] = useState(false);

  return (
    <div style={{ background: BG, color: INK, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", minHeight: "100vh" }}>
      {/* Preview ribbon */}
      <div style={{ background: "#111827", color: "#9CA3AF", fontSize: 12, textAlign: "center", padding: "6px" }}>
        PREVIEW — MedVault redesign (Krist layout) · isolated from live site · not deployed
      </div>

      {/* Announcement */}
      <div style={{ background: GREEN, color: "#fff", textAlign: "center", fontSize: 13, fontWeight: 600, padding: "8px 16px" }}>
        Free name + RA-number printing on your first 50 orders · 1-hour delivery around SRM
      </div>

      {/* Navbar */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "#fff", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src="/logo.png" alt="MedVault" style={{ height: 34, width: "auto" }} />
            <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: "-.5px" }}>MedVault</span>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 30, fontSize: 15, fontWeight: 600 }}>
            <a href="#" style={{ color: INK, textDecoration: "none" }}>Home</a>
            <div style={{ position: "relative" }} onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
              <button style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", font: "inherit", color: INK }}>
                Shop <ChevronDown size={15} />
              </button>
              {mega && (
                <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 14, width: 720, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: "0 24px 50px rgba(13,27,42,.14)", padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 200px", gap: 20 }}>
                  {[
                    ["Assessment Kits", ["MVP Kit", "Clinical Goniometer Set", "CNS Assessment Kit"]],
                    ["Diagnostic", ["Stethoscope", "BP Apparatus", "Pen Torch"]],
                    ["Physiotherapy", ["Goniometers", "Reflex Hammers", "Tuning Forks"]],
                  ].map(([head, links]) => (
                    <div key={head}>
                      <p style={{ fontSize: 12, fontWeight: 800, color: GREEN, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>{head}</p>
                      {links.map((l) => (
                        <a key={l} href="#bestseller" style={{ display: "block", fontSize: 14, color: MUTED, textDecoration: "none", padding: "6px 0", fontWeight: 500 }}>{l}</a>
                      ))}
                    </div>
                  ))}
                  <div style={{ borderRadius: 12, overflow: "hidden", background: SOFT, display: "flex", alignItems: "flex-end", padding: 16, backgroundImage: `url(${KITS[0]?.images?.[0] || "/kit.jpg"})`, backgroundSize: "cover", backgroundPosition: "center", color: "#fff" }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700 }}>Featured</p>
                      <p style={{ fontSize: 15, fontWeight: 800 }}>MVP Kit ₹1,799</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <a href="#categories" style={{ color: INK, textDecoration: "none" }}>Categories</a>
            <a href="#about" style={{ color: INK, textDecoration: "none" }}>About</a>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 18, color: INK }}>
            <Search size={20} style={{ cursor: "pointer" }} />
            <Heart size={20} style={{ cursor: "pointer" }} />
            <User size={20} style={{ cursor: "pointer" }} />
            <a href={WA()} target="_blank" rel="noreferrer" style={{ color: INK }}><ShoppingCart size={20} style={{ cursor: "pointer" }} /></a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: SOFT }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 40, alignItems: "center", minHeight: 520 }} className="rd-hero">
          <div style={{ padding: "56px 0" }}>
            <p style={{ color: GREEN, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 13, marginBottom: 16 }}>MedVault · SRM Campus</p>
            <h1 style={{ fontSize: "clamp(34px,4.6vw,58px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-1.5px", marginBottom: 18 }}>
              Assessment Kits for<br /><span style={{ color: GREEN }}>Healthcare Students</span>
            </h1>
            <p style={{ fontSize: 17, color: MUTED, lineHeight: 1.6, maxWidth: 460, marginBottom: 30 }}>
              Everything you need for practical exams. Delivered within 1 hour around SRM.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#bestseller" style={{ background: GREEN, color: "#fff", textDecoration: "none", padding: "15px 30px", borderRadius: 999, fontWeight: 700, fontSize: 15 }}>Shop Assessment Kits</a>
              <a href="#bestseller" style={{ background: "transparent", color: INK, textDecoration: "none", padding: "15px 30px", borderRadius: 999, fontWeight: 700, fontSize: 15, border: `1.5px solid ${INK}` }}>Browse Products</a>
            </div>
          </div>
          <div style={{ position: "relative", alignSelf: "stretch", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ position: "absolute", fontSize: 130, fontWeight: 900, color: "rgba(22,163,74,.06)", letterSpacing: -6, whiteSpace: "nowrap", userSelect: "none" }}>MEDVAULT</span>
            <img src={KITS[0]?.images?.[0] || "/kit.jpg"} alt="MedVault MVP Kit" style={{ position: "relative", maxWidth: "100%", maxHeight: 440, objectFit: "contain", filter: "drop-shadow(0 30px 50px rgba(13,27,42,.18))" }} />
          </div>
        </div>
      </section>

      {/* Shop by Categories */}
      <section id="categories" style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px 20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, marginBottom: 8 }}>Shop by Categories</h2>
        <p style={{ textAlign: "center", color: MUTED, marginBottom: 40 }}>Curated for BPT, nursing & allied-health students at SRM</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20 }} className="rd-cats">
          {CATEGORIES.map((c) => (
            <a key={c.label} href="#bestseller" style={{ textDecoration: "none", color: INK, textAlign: "center" }}>
              <div style={{ aspectRatio: "1/1", borderRadius: "50%", background: SOFT, overflow: "hidden", marginBottom: 14, border: `1px solid ${LINE}` }}>
                <img src={c.img} alt={c.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Our Bestseller */}
      <section id="bestseller" style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 800 }}>Our Bestsellers</h2>
            <p style={{ color: MUTED, marginTop: 6 }}>Genuine BPL instruments and curated exam kits</p>
          </div>
          <a href="#" style={{ color: GREEN, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>View all <ArrowRight size={16} /></a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22 }} className="rd-grid">
          {BESTSELLERS.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* Promotional banner — 1-Hour Delivery */}
      <section style={{ background: INK, color: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }} className="rd-promo">
          <div>
            <p style={{ color: "#7CE7A9", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", fontSize: 13, marginBottom: 14 }}>Fastest on campus</p>
            <h2 style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>Within 1-Hour Delivery</h2>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
              {["SRM University", "SRM Hostels", "Nearby Areas"].map((l) => (
                <div key={l} style={{ background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 14, padding: "16px 22px", minWidth: 130, textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#7CE7A9" }}>✓</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <a href={WA("Hi, I want 1-hour delivery near SRM")} target="_blank" rel="noreferrer" style={{ display: "inline-block", background: GREEN, color: "#fff", textDecoration: "none", padding: "14px 30px", borderRadius: 999, fontWeight: 700 }}>Order on WhatsApp</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={KITS[1]?.images?.[0] || "/pouch.jpg"} alt="Fast delivery" style={{ maxWidth: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 16 }} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: "clamp(24px,3vw,34px)", fontWeight: 800, marginBottom: 8 }}>What students say</h2>
        <p style={{ textAlign: "center", color: MUTED, marginBottom: 40 }}>Rated 4.9 by BPT students across SRM</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="rd-revs">
          {REVIEWS.map((t, i) => (
            <div key={i} style={{ background: SOFT, border: `1px solid ${LINE}`, borderRadius: 16, padding: 28 }}>
              <Stars n={t.r} />
              <p style={{ fontSize: 15, lineHeight: 1.7, color: INK, margin: "16px 0 22px" }}>&ldquo;{t.q}&rdquo;</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `${GREEN}1A`, color: GREEN, display: "grid", placeItems: "center", fontWeight: 800 }}>{t.n[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{t.n}</div>
                  <div style={{ fontSize: 12, color: MUTED }}>{t.y}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust features row */}
      <section style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: "#fff" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }} className="rd-trust">
          {[[Truck, "1-Hour Delivery", "Around SRM campus"], [ShieldCheck, "Genuine BPL", "Authentic products"], [Headphones, "WhatsApp Support", "Quick replies"], [CreditCard, "Flexible Payment", "COD · UPI · WhatsApp"]].map(([Icon, t, s], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: `${GREEN}12`, color: GREEN, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={22} /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div>
                <div style={{ fontSize: 13, color: MUTED }}>{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="about" style={{ background: INK, color: "rgba(255,255,255,.7)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.3fr", gap: 32 }} className="rd-foot">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/logo.png" alt="MedVault" style={{ height: 30 }} />
              <span style={{ fontWeight: 800, fontSize: 18, color: "#fff" }}>MedVault</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>Assessment kits & genuine medical instruments for healthcare students at SRM. 1-hour campus delivery.</p>
            <p style={{ marginTop: 16, fontSize: 14 }}>💬 +91 82486 13274</p>
          </div>
          {[["Shop", ["Assessment Kits", "Diagnostic", "Physiotherapy", "Accessories"]], ["Company", ["About", "Store", "Delivery", "Contact"]]].map(([head, links]) => (
            <div key={head}>
              <p style={{ color: "#fff", fontWeight: 700, marginBottom: 16 }}>{head}</p>
              {links.map((l) => <a key={l} href="#" style={{ display: "block", color: "rgba(255,255,255,.7)", textDecoration: "none", padding: "6px 0", fontSize: 14 }}>{l}</a>)}
            </div>
          ))}
          <div>
            <p style={{ color: "#fff", fontWeight: 700, marginBottom: 16 }}>Get 1-hour delivery updates</p>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Your email" style={{ flex: 1, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 10, padding: "12px 14px", color: "#fff", outline: "none" }} />
              <button style={{ background: GREEN, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontWeight: 700, cursor: "pointer" }}>Join</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", padding: "18px 24px", textAlign: "center", fontSize: 13 }}>© 2026 MedVault · SRM Campus, Chennai</div>
      </footer>

      {/* Responsive */}
      <style>{`
        @media (max-width: 900px) {
          .rd-hero { grid-template-columns: 1fr !important; }
          .rd-promo { grid-template-columns: 1fr !important; }
          .rd-cats { grid-template-columns: repeat(3,1fr) !important; }
          .rd-grid { grid-template-columns: repeat(2,1fr) !important; }
          .rd-revs { grid-template-columns: 1fr !important; }
          .rd-trust { grid-template-columns: repeat(2,1fr) !important; }
          .rd-foot { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .rd-cats { grid-template-columns: repeat(2,1fr) !important; }
          .rd-grid { grid-template-columns: 1fr 1fr !important; }
          .rd-trust { grid-template-columns: 1fr !important; }
          .rd-foot { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

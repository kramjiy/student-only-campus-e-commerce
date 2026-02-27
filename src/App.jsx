import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ═══════════════════════════════════════════════════════════════
// SUPABASE SETUP — Replace these with your actual values from supabase.com
// ═══════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://zyyeblcostebguxqztug.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_8_WLpAIAooOumE6zukdbNA_Gnxj5HQc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ═══════════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════════
const CATEGORIES = ["All","Art & Illustration","Handmade Crafts","Fashion","Tech Builds","Food & Baked","Photography","Music","Books & Notes"];
const DEPTS = ["Fine Arts","Design","Electronics","Mech Engg","Nutrition","Textile Design","Journalism","Music","Computer Science","Civil Engg"];
const HOSTELS = ["Hostel A","Hostel B","Hostel C","Hostel D","Day Scholar","Faculty Quarters"];

const PRODUCTS = [
  { id:1, title:"Hand-painted Galaxy Tote", seller:"Priya M.", sellerId:"priya", avatar:"PM", dept:"Fine Arts", price:349, originalPrice:450, category:"Art & Illustration", rating:4.9, reviews:23, badge:"Hot", verified:true, image:"🎨", colors:["#1a1a2e","#16213e","#0f3460"], description:"Acrylic galaxy painting on canvas tote. Each piece is unique — no two are the same. Made with eco-friendly fabric and washable paints.", tags:["handmade","art","eco"], stock:3, delivery:"1–2 days", location:"Hostel A" },
  { id:2, title:"Crochet Bucket Hat", seller:"Tanvi R.", sellerId:"tanvi", avatar:"TR", dept:"Design", price:280, originalPrice:280, category:"Handmade Crafts", rating:4.7, reviews:41, badge:"New", verified:true, image:"🧶", colors:["#f9a825","#f57f17","#e65100"], description:"Soft crochet bucket hat, perfect for campus days. Made to order in your color choice within 3 days.", tags:["crochet","fashion","custom"], stock:7, delivery:"3 days", location:"Hostel B" },
  { id:3, title:"PCB Art Wall Clock", seller:"Arjun K.", sellerId:"arjun", avatar:"AK", dept:"Electronics", price:599, originalPrice:799, category:"Tech Builds", rating:5.0, reviews:12, badge:"Rare", verified:true, image:"⚡", colors:["#00897b","#004d40","#1de9b6"], description:"Working clock built into a real PCB board. Soldered & tested. USB powered. Comes with adapter.", tags:["tech","DIY","engineering"], stock:2, delivery:"Same day", location:"Hostel C" },
  { id:4, title:"Watercolour Portrait", seller:"Sneha L.", sellerId:"sneha", avatar:"SL", dept:"Fine Arts", price:450, originalPrice:600, category:"Art & Illustration", rating:4.8, reviews:67, badge:"Best Seller", verified:true, image:"🖼️", colors:["#ad1457","#880e4f","#ff4081"], description:"Commission a custom watercolour portrait from your photo. 7–10 day delivery. Framed print available on request.", tags:["portrait","custom","art"], stock:10, delivery:"7–10 days", location:"Hostel A" },
  { id:5, title:"Homemade Brownies (6 Pack)", seller:"Riya S.", sellerId:"riya", avatar:"RS", dept:"Nutrition", price:120, originalPrice:120, category:"Food & Baked", rating:4.6, reviews:89, badge:"🔥 Trending", verified:false, image:"🍫", colors:["#4e342e","#3e2723","#795548"], description:"Rich dark chocolate brownies baked fresh every Friday. Pick up at Hostel D. Eggless variants available.", tags:["food","sweet","homemade"], stock:20, delivery:"Friday pickup", location:"Hostel D" },
  { id:6, title:"Macramé Wall Hanging", seller:"Aisha T.", sellerId:"aisha", avatar:"AT", dept:"Design", price:390, originalPrice:500, category:"Handmade Crafts", rating:4.9, reviews:34, badge:"New", verified:true, image:"🪢", colors:["#f5f5dc","#d7ccc8","#bcaaa4"], description:"Boho macramé wall hanging — perfect dorm decor. Natural cotton rope, ~40cm wide. Custom sizes on request.", tags:["decor","boho","handmade"], stock:5, delivery:"2–3 days", location:"Hostel B" },
  { id:7, title:"Lofi Study Music Pack", seller:"Karan B.", sellerId:"karan", avatar:"KB", dept:"Music", price:99, originalPrice:150, category:"Music", rating:4.5, reviews:103, badge:"Popular", verified:true, image:"🎵", colors:["#311b92","#1a237e","#7c4dff"], description:"20 original lofi beats for personal study sessions. Instant download after purchase. Royalty-free.", tags:["lofi","music","digital"], stock:999, delivery:"Instant", location:"Digital" },
  { id:8, title:"Thermodynamics Notes", seller:"Dev P.", sellerId:"dev", avatar:"DP", dept:"Mech Engg", price:80, originalPrice:80, category:"Books & Notes", rating:4.9, reviews:156, badge:"Must Have", verified:true, image:"📝", colors:["#1b5e20","#2e7d32","#4caf50"], description:"Handwritten + typed notes, full semester. Includes solved PYQs, formula sheets and exam tips.", tags:["notes","study","engineering"], stock:999, delivery:"Instant PDF", location:"Digital" },
  { id:9, title:"Film Photography Prints (A4)", seller:"Mehak J.", sellerId:"mehak", avatar:"MJ", dept:"Journalism", price:180, originalPrice:250, category:"Photography", rating:4.8, reviews:29, badge:"Aesthetic", verified:false, image:"📷", colors:["#37474f","#263238","#607d8b"], description:"Analog film prints of campus life. Each print hand-developed. Limited edition — each batch different.", tags:["photo","film","art"], stock:15, delivery:"1–2 days", location:"Hostel C" },
  { id:10, title:"Embroidered Canvas Pouch", seller:"Pooja V.", sellerId:"pooja", avatar:"PV", dept:"Textile Design", price:210, originalPrice:280, category:"Fashion", rating:4.7, reviews:52, badge:"Cute", verified:true, image:"👜", colors:["#e91e63","#c2185b","#ff80ab"], description:"Hand-embroidered floral pouch in cotton canvas. Great for stationery or coins. Custom monograms available.", tags:["embroidery","fashion","gift"], stock:8, delivery:"2 days", location:"Hostel D" },
  { id:11, title:"Resin Bookmarks (Set of 3)", seller:"Naina C.", sellerId:"naina", avatar:"NC", dept:"Fine Arts", price:150, originalPrice:150, category:"Art & Illustration", rating:5.0, reviews:44, badge:"✨ Fan Fave", verified:true, image:"🔖", colors:["#26c6da","#00acc1","#00bcd4"], description:"Handmade resin bookmarks with dried flowers. No two are alike. Perfect gift for readers.", tags:["resin","bookmark","handmade"], stock:12, delivery:"1 day", location:"Hostel A" },
  { id:12, title:"Vintage Engineering Tee", seller:"Rohit N.", sellerId:"rohit", avatar:"RN", dept:"Mech Engg", price:320, originalPrice:400, category:"Fashion", rating:4.6, reviews:71, badge:"Collab Drop", verified:true, image:"👕", colors:["#f57c00","#e65100","#ff9800"], description:"Oversized vintage print tee. Unisex. Cotton blend. Sizes S–XXL. Limited campus edition.", tags:["fashion","tee","campus"], stock:30, delivery:"1–2 days", location:"Hostel C" },
  { id:13, title:"Hand-thrown Ceramic Mug", seller:"Priya M.", sellerId:"priya", avatar:"PM", dept:"Fine Arts", price:280, originalPrice:350, category:"Handmade Crafts", rating:4.8, reviews:18, badge:"New", verified:true, image:"☕", colors:["#8d6e63","#6d4c41","#bcaaa4"], description:"Hand-thrown pottery mug, food-safe glaze, microwave safe. Each piece slightly unique.", tags:["pottery","ceramic","handmade"], stock:6, delivery:"2–3 days", location:"Hostel A" },
  { id:14, title:"Campus Sketch Zine Vol.2", seller:"Mehak J.", sellerId:"mehak", avatar:"MJ", dept:"Journalism", price:60, originalPrice:60, category:"Books & Notes", rating:4.7, reviews:37, badge:"Popular", verified:false, image:"📓", colors:["#ffd600","#f9a825","#ff8f00"], description:"A zine of hand-drawn campus illustrations. 24 pages, risograph print style. Collectible.", tags:["zine","art","campus"], stock:50, delivery:"Same day", location:"Hostel C" },
  { id:15, title:"Custom Friendship Bracelets", seller:"Tanvi R.", sellerId:"tanvi", avatar:"TR", dept:"Design", price:90, originalPrice:120, category:"Fashion", rating:4.9, reviews:95, badge:"❤️ Loved", verified:true, image:"📿", colors:["#7b1fa2","#6a1b9a","#ce93d8"], description:"Custom name/word bracelets in your chosen colours. Made to order. Great gifting idea.", tags:["bracelet","custom","gift"], stock:99, delivery:"1 day", location:"Hostel B" },
  { id:16, title:"Python DSA Cheat Sheet Pack", seller:"Dev P.", sellerId:"dev", avatar:"DP", dept:"Mech Engg", price:49, originalPrice:80, category:"Books & Notes", rating:5.0, reviews:204, badge:"🔥 #1 Seller", verified:true, image:"🐍", colors:["#0d47a1","#1565c0","#42a5f5"], description:"10-page PDF with every DSA concept, time complexities, and code templates. Print-ready.", tags:["coding","DSA","notes"], stock:999, delivery:"Instant", location:"Digital" },
];

const SELLER_COLORS = [
  ["#7c6ef8","#9b8bff"],["#ff3b5c","#ff6b35"],["#00d4aa","#00b8d4"],
  ["#f9a825","#ff6f00"],["#e91e63","#9c27b0"],["#00897b","#26a69a"],
  ["#f44336","#e91e63"],["#2196f3","#03a9f4"],
];
const sellerColor = (name) => SELLER_COLORS[name.charCodeAt(0) % SELLER_COLORS.length];
const gradientFor = (colors) => `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
const discountPct = (o,c) => o>c ? Math.round((o-c)/o*100) : 0;

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

:root {
  --bg:#08080f; --bg2:#0f0f1a; --bg3:#161625; --bg4:#1e1e30; --bg5:#252538;
  --accent:#6c5ce7; --accent-light:#a29bfe; --accent2:#fd79a8; --accent3:#00cec9;
  --gold:#fdcb6e; --green:#00b894;
  --text:#f0f0f8; --text2:#a0a0c0; --text3:#606080; --text4:#3a3a55;
  --border:#1e1e30; --border2:#2a2a40;
  --card:#0f0f1a; --radius:14px; --radius-lg:20px;
  --shadow: 0 8px 32px rgba(0,0,0,0.4);
  --glow: 0 0 40px rgba(108,92,231,0.2);
  --font-d: 'Syne', sans-serif;
  --font-b: 'DM Sans', sans-serif;
}

*{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body,#root{background:var(--bg);color:var(--text);font-family:var(--font-b);min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:var(--bg2);}
::-webkit-scrollbar-thumb{background:var(--bg5);border-radius:3px;}
::selection{background:rgba(108,92,231,0.3);color:#fff;}

/* NOISE */
.app-root::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");pointer-events:none;z-index:9999;opacity:1;}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:62px;display:flex;align-items:center;padding:0 28px;gap:16px;background:rgba(8,8,15,0.88);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);}
.nav-logo{font-family:var(--font-d);font-weight:800;font-size:18px;letter-spacing:-0.5px;cursor:pointer;display:flex;align-items:center;gap:9px;white-space:nowrap;}
.nav-logo-icon{width:30px;height:30px;border-radius:8px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:15px;}
.nav-logo em{color:var(--accent);font-style:normal;}
.nav-search{flex:1;max-width:380px;position:relative;}
.nav-search input{width:100%;padding:9px 14px 9px 38px;background:var(--bg3);border:1px solid var(--border2);border-radius:40px;color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;transition:all .2s;}
.nav-search input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(108,92,231,.12);}
.nav-search input::placeholder{color:var(--text3);}
.nav-search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text3);pointer-events:none;}
.nav-spacer{flex:1;}
.nav-links{display:flex;align-items:center;gap:6px;}
.nav-link{background:none;border:none;cursor:pointer;color:var(--text2);font-family:var(--font-b);font-size:13px;font-weight:500;padding:7px 14px;border-radius:9px;transition:all .2s;white-space:nowrap;}
.nav-link:hover{background:var(--bg3);color:var(--text);}
.nav-link.active{background:rgba(108,92,231,.15);color:var(--accent-light);}
.nav-btn-primary{background:linear-gradient(135deg,var(--accent),#8b7ff8);border:none;border-radius:40px;cursor:pointer;color:#fff;font-family:var(--font-b);font-weight:600;font-size:13px;padding:9px 20px;display:flex;align-items:center;gap:7px;transition:all .25s;box-shadow:0 4px 20px rgba(108,92,231,.3);white-space:nowrap;}
.nav-btn-primary:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(108,92,231,.5);}
.nav-avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;cursor:pointer;border:2px solid var(--border2);transition:all .2s;flex-shrink:0;}
.nav-avatar:hover{border-color:var(--accent);}
.cart-btn{position:relative;background:var(--bg3);border:1px solid var(--border2);border-radius:10px;cursor:pointer;color:var(--text2);padding:7px 10px;display:flex;align-items:center;gap:6px;font-size:13px;font-family:var(--font-b);font-weight:500;transition:all .2s;}
.cart-btn:hover{border-color:var(--accent);color:var(--text);}
.cart-badge{position:absolute;top:-7px;right:-7px;background:var(--accent2);color:#fff;border-radius:50%;width:17px;height:17px;font-size:10px;display:flex;align-items:center;justify-content:center;font-weight:700;}

/* ── AUTH PAGE ── */
.auth-page{min-height:100vh;display:flex;position:relative;overflow:hidden;}
.auth-left{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:60px 40px;position:relative;background:var(--bg2);border-right:1px solid var(--border);}
.auth-left-bg{position:absolute;inset:0;overflow:hidden;}
.auth-orb1{position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(108,92,231,.2) 0%,transparent 70%);top:-100px;right:-100px;pointer-events:none;}
.auth-orb2{position:absolute;width:350px;height:350px;background:radial-gradient(circle,rgba(253,121,168,.15) 0%,transparent 70%);bottom:-50px;left:-50px;pointer-events:none;}
.auth-left-content{position:relative;z-index:1;text-align:center;max-width:460px;}
.auth-brand{font-family:var(--font-d);font-size:48px;font-weight:800;letter-spacing:-2px;margin-bottom:16px;line-height:1;}
.auth-brand em{color:var(--accent);font-style:normal;}
.auth-brand span{background:linear-gradient(135deg,var(--accent2),#ff6b35);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.auth-tagline{font-size:16px;color:var(--text2);line-height:1.7;margin-bottom:40px;}
.auth-features{display:flex;flex-direction:column;gap:16px;text-align:left;}
.auth-feat{display:flex;align-items:center;gap:14px;background:rgba(255,255,255,.03);border:1px solid var(--border2);border-radius:12px;padding:14px 18px;}
.auth-feat-icon{font-size:24px;flex-shrink:0;}
.auth-feat-text h4{font-size:14px;font-weight:600;margin-bottom:2px;}
.auth-feat-text p{font-size:12px;color:var(--text3);}
.auth-stats{display:flex;gap:24px;justify-content:center;margin-top:36px;}
.auth-stat-num{font-family:var(--font-d);font-size:22px;font-weight:800;letter-spacing:-0.5px;}
.auth-stat-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;}

.auth-right{width:480px;display:flex;align-items:center;justify-content:center;padding:40px 48px;background:var(--bg);}
.auth-form-box{width:100%;}
.auth-tabs{display:flex;background:var(--bg3);border-radius:12px;padding:4px;margin-bottom:32px;border:1px solid var(--border);}
.auth-tab{flex:1;padding:10px;border:none;background:none;cursor:pointer;font-family:var(--font-b);font-size:14px;font-weight:600;color:var(--text3);border-radius:9px;transition:all .25s;}
.auth-tab.active{background:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(108,92,231,.4);}
.auth-title{font-family:var(--font-d);font-size:26px;font-weight:800;letter-spacing:-0.8px;margin-bottom:6px;}
.auth-sub{font-size:14px;color:var(--text3);margin-bottom:28px;}
.form-group{margin-bottom:18px;}
.form-label{font-size:12px;font-weight:600;color:var(--text2);margin-bottom:6px;display:block;text-transform:uppercase;letter-spacing:.8px;}
.form-input{width:100%;padding:12px 14px;background:var(--bg3);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-family:var(--font-b);font-size:14px;outline:none;transition:all .2s;}
.form-input:focus{border-color:var(--accent);box-shadow:0 0 0 3px rgba(108,92,231,.12);}
.form-input::placeholder{color:var(--text3);}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.form-select{width:100%;padding:12px 14px;background:var(--bg3);border:1.5px solid var(--border2);border-radius:10px;color:var(--text);font-family:var(--font-b);font-size:14px;outline:none;cursor:pointer;appearance:none;transition:all .2s;}
.form-select:focus{border-color:var(--accent);}
.btn-full{width:100%;padding:14px;background:linear-gradient(135deg,var(--accent),#8b7ff8);border:none;border-radius:12px;cursor:pointer;color:#fff;font-family:var(--font-d);font-weight:700;font-size:15px;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .25s;box-shadow:0 6px 24px rgba(108,92,231,.35);margin-top:8px;}
.btn-full:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(108,92,231,.5);}
.btn-full:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.auth-divider{display:flex;align-items:center;gap:12px;margin:20px 0;color:var(--text3);font-size:12px;}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:var(--border2);}
.auth-verify{background:rgba(0,206,201,.08);border:1px solid rgba(0,206,201,.2);border-radius:12px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:flex-start;gap:10px;}
.auth-verify-icon{font-size:20px;flex-shrink:0;}
.auth-verify p{font-size:12px;color:var(--text3);line-height:1.6;}
.auth-verify strong{color:var(--accent3);}
.pass-toggle{position:relative;}
.pass-toggle .form-input{padding-right:44px;}
.pass-eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;}

/* ═══ PAGES WRAPPER ═══ */
.page{padding-top:62px;min-height:100vh;}

/* ── HOME PAGE ── */
.hero{padding:70px 28px 48px;position:relative;overflow:hidden;}
.hero-orb1{position:absolute;width:700px;height:700px;background:radial-gradient(circle,rgba(108,92,231,.14) 0%,transparent 65%);top:-200px;right:-150px;pointer-events:none;}
.hero-orb2{position:absolute;width:500px;height:500px;background:radial-gradient(circle,rgba(253,121,168,.1) 0%,transparent 65%);bottom:-100px;left:100px;pointer-events:none;}
.hero-inner{position:relative;z-index:1;max-width:700px;}
.hero-badge{display:inline-flex;align-items:center;gap:7px;background:rgba(108,92,231,.12);border:1px solid rgba(108,92,231,.3);border-radius:40px;padding:5px 14px;font-size:11px;font-weight:700;color:var(--accent-light);margin-bottom:22px;text-transform:uppercase;letter-spacing:.8px;}
.hero h1{font-family:var(--font-d);font-size:clamp(38px,5.5vw,64px);font-weight:800;line-height:1.04;letter-spacing:-2.5px;margin-bottom:18px;}
.hero h1 em{font-style:normal;color:var(--accent-light);}
.hero h1 span{background:linear-gradient(135deg,var(--accent2),#ff8c42);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.hero-sub{font-size:16px;color:var(--text2);line-height:1.75;max-width:480px;margin-bottom:32px;}
.hero-cta{display:flex;gap:12px;flex-wrap:wrap;}
.btn-hero-primary{display:flex;align-items:center;gap:9px;padding:14px 30px;background:linear-gradient(135deg,var(--accent),#8b7ff8);border:none;border-radius:40px;cursor:pointer;color:#fff;font-family:var(--font-d);font-weight:700;font-size:15px;box-shadow:0 6px 28px rgba(108,92,231,.4);transition:all .25s;}
.btn-hero-primary:hover{transform:translateY(-3px);box-shadow:0 10px 40px rgba(108,92,231,.55);}
.btn-hero-sec{display:flex;align-items:center;gap:9px;padding:14px 26px;background:rgba(255,255,255,.05);border:1px solid var(--border2);border-radius:40px;cursor:pointer;color:var(--text2);font-family:var(--font-d);font-weight:600;font-size:15px;transition:all .25s;}
.btn-hero-sec:hover{background:var(--bg3);color:var(--text);border-color:var(--accent);}
.hero-stats{display:flex;gap:36px;margin-top:44px;padding-top:36px;border-top:1px solid var(--border);}
.h-stat-num{font-family:var(--font-d);font-size:28px;font-weight:800;letter-spacing:-1px;}
.h-stat-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:1px;margin-top:2px;}

/* ── FILTER SIDEBAR ── */
.shop-layout{display:flex;gap:0;padding:0 28px 60px;position:relative;}
.filter-sidebar{width:260px;flex-shrink:0;position:sticky;top:80px;height:calc(100vh - 100px);overflow-y:auto;padding-right:20px;scrollbar-width:thin;}
.filter-sidebar-inner{display:flex;flex-direction:column;gap:22px;}
.filter-section{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:18px;}
.filter-section-title{font-family:var(--font-d);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text3);margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;}
.filter-clear-btn{font-size:11px;color:var(--accent);cursor:pointer;font-weight:600;background:none;border:none;}
.filter-clear-btn:hover{opacity:.8;}
.filter-check{display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;border-radius:8px;transition:all .15s;}
.filter-check:hover .fc-label{color:var(--text);}
.fc-box{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--border2);background:var(--bg3);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s;}
.fc-box.checked{background:var(--accent);border-color:var(--accent);}
.fc-label{font-size:13px;color:var(--text2);flex:1;}
.fc-count{font-size:11px;color:var(--text3);}
.price-range{display:flex;flex-direction:column;gap:10px;}
.price-inputs{display:flex;gap:8px;align-items:center;}
.price-input{width:100%;padding:8px 10px;background:var(--bg3);border:1px solid var(--border2);border-radius:8px;color:var(--text);font-size:13px;font-family:var(--font-b);outline:none;}
.price-input:focus{border-color:var(--accent);}
.range-slider{width:100%;accent-color:var(--accent);}
.filter-active-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);display:inline-block;margin-left:6px;}

/* ── PRODUCTS AREA ── */
.products-area{flex:1;min-width:0;}
.cat-bar{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:16px;margin-bottom:4px;}
.cat-bar::-webkit-scrollbar{display:none;}
.cat-chip{flex-shrink:0;padding:7px 16px;border-radius:40px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid var(--border2);background:var(--bg3);color:var(--text3);transition:all .2s;white-space:nowrap;}
.cat-chip:hover{border-color:var(--accent);color:var(--text);}
.cat-chip.active{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 4px 14px rgba(108,92,231,.3);}
.products-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;gap:12px;flex-wrap:wrap;}
.products-count{font-size:13px;color:var(--text3);}
.products-count strong{color:var(--text2);font-weight:600;}
.toolbar-right{display:flex;gap:8px;align-items:center;}
.sort-select{background:var(--bg3);border:1px solid var(--border2);color:var(--text);border-radius:9px;padding:8px 12px;font-family:var(--font-b);font-size:13px;cursor:pointer;outline:none;transition:all .2s;}
.sort-select:focus,.sort-select:hover{border-color:var(--accent);}
.view-toggle{display:flex;background:var(--bg3);border:1px solid var(--border2);border-radius:9px;overflow:hidden;}
.view-btn{padding:8px 12px;background:none;border:none;cursor:pointer;color:var(--text3);display:flex;align-items:center;font-size:16px;transition:all .2s;}
.view-btn.active,.view-btn:hover{background:var(--bg4);color:var(--text);}

/* ── PRODUCT GRID ── */
.pgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:18px;}
.pgrid.list-view{grid-template-columns:1fr;}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;cursor:pointer;transition:all .3s cubic-bezier(.34,1.56,.64,1);position:relative;}
.card:hover{transform:translateY(-7px);border-color:rgba(108,92,231,.45);box-shadow:0 24px 64px rgba(0,0,0,.55),0 0 0 1px rgba(108,92,231,.18),var(--glow);}
.card.list-view{display:flex;flex-direction:row;}
.card.list-view .card-img{width:180px;flex-shrink:0;height:auto;min-height:140px;}
.card-img{height:195px;display:flex;align-items:center;justify-content:center;font-size:78px;position:relative;overflow:hidden;}
.card-img-grad{position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(8,8,15,.9) 100%);}
.card-badge{position:absolute;top:11px;left:11px;background:rgba(8,8,15,.75);border:1px solid rgba(255,255,255,.1);backdrop-filter:blur(8px);border-radius:6px;padding:3px 9px;font-size:10px;font-weight:700;color:var(--text);letter-spacing:.3px;}
.card-badge.b-hot{background:rgba(253,121,168,.2);border-color:rgba(253,121,168,.4);color:var(--accent2);}
.card-badge.b-rare{background:rgba(108,92,231,.2);border-color:rgba(108,92,231,.4);color:var(--accent-light);}
.card-badge.b-new{background:rgba(0,206,201,.2);border-color:rgba(0,206,201,.4);color:var(--accent3);}
.card-badge.b-sell{background:rgba(253,203,110,.2);border-color:rgba(253,203,110,.4);color:var(--gold);}
.card-wish{position:absolute;top:11px;right:11px;background:rgba(8,8,15,.7);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.1);border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;z-index:2;}
.card-wish:hover{background:rgba(253,121,168,.15);border-color:rgba(253,121,168,.3);}
.card-wish.wished{background:rgba(253,121,168,.2);border-color:rgba(253,121,168,.5);}
.card-body{padding:15px;}
.card.list-view .card-body{flex:1;display:flex;flex-direction:column;justify-content:space-between;}
.card-title{font-family:var(--font-d);font-weight:700;font-size:14px;line-height:1.35;margin-bottom:8px;color:var(--text);}
.card-seller-row{display:flex;align-items:center;gap:7px;margin-bottom:9px;}
.s-av{width:21px;height:21px;border-radius:50%;font-size:8px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.s-name{font-size:11px;color:var(--text3);}
.s-name strong{color:var(--text2);font-weight:500;}
.verified-tag{display:inline-flex;align-items:center;gap:3px;font-size:10px;color:var(--green);font-weight:600;margin-left:5px;}
.card-rating-row{display:flex;align-items:center;gap:5px;margin-bottom:11px;}
.stars-wrap{display:flex;gap:1px;}
.r-num{font-size:12px;font-weight:600;}
.r-ct{font-size:11px;color:var(--text3);}
.card-foot{display:flex;align-items:center;justify-content:space-between;padding-top:11px;border-top:1px solid var(--border);}
.price-wrap{display:flex;flex-direction:column;}
.p-curr{font-family:var(--font-d);font-size:19px;font-weight:800;letter-spacing:-.5px;}
.p-orig{font-size:11px;color:var(--text3);text-decoration:line-through;}
.p-disc{font-size:10px;color:var(--accent3);font-weight:700;margin-left:4px;}
.btn-cart{background:linear-gradient(135deg,var(--accent),#8b7ff8);border:none;border-radius:9px;cursor:pointer;color:#fff;font-weight:700;font-size:12px;padding:8px 14px;display:flex;align-items:center;gap:5px;transition:all .25s;box-shadow:0 4px 14px rgba(108,92,231,.3);}
.btn-cart:hover{transform:scale(1.06);box-shadow:0 6px 20px rgba(108,92,231,.5);}
.stock-warn{position:absolute;bottom:66px;left:0;right:0;text-align:center;font-size:10px;color:var(--accent2);font-weight:700;padding:4px;background:rgba(253,121,168,.1);}

/* ── PRODUCT MODAL ── */
.overlay{position:fixed;inset:0;z-index:300;background:rgba(0,0,0,.8);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px;}
.modal{background:var(--bg2);border:1px solid var(--border2);border-radius:22px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,.7);animation:mIn .3s cubic-bezier(.34,1.56,.64,1);}
@keyframes mIn{from{opacity:0;transform:scale(.88) translateY(24px);}to{opacity:1;transform:scale(1) translateY(0);}}
.m-header{padding:22px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.m-close{background:var(--bg4);border:none;cursor:pointer;color:var(--text2);border-radius:8px;width:34px;height:34px;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:16px;}
.m-close:hover{background:var(--bg5);color:var(--text);}
.m-body{padding:26px;}
.m-img{width:100%;height:230px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:96px;margin-bottom:22px;border:1px solid var(--border);}
.m-title{font-family:var(--font-d);font-size:24px;font-weight:800;letter-spacing:-.8px;margin-bottom:6px;}
.m-price-row{display:flex;align-items:baseline;gap:12px;margin:12px 0 14px;}
.m-price{font-family:var(--font-d);font-size:30px;font-weight:800;letter-spacing:-1px;}
.m-desc{color:var(--text2);line-height:1.75;font-size:14px;margin-bottom:18px;}
.tag-row{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:22px;}
.tag{background:var(--bg4);border:1px solid var(--border2);border-radius:6px;padding:4px 10px;font-size:11px;color:var(--text3);}
.m-seller-box{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:18px;}
.m-s-av{width:48px;height:48px;border-radius:50%;font-size:16px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;}
.m-s-name{font-family:var(--font-d);font-size:16px;font-weight:700;}
.m-s-dept{font-size:12px;color:var(--text3);margin-top:2px;}
.m-s-badges{display:flex;gap:7px;margin-top:7px;}
.mbadge{font-size:10px;font-weight:700;padding:3px 9px;border-radius:5px;}
.mbadge.green{background:rgba(0,184,148,.15);border:1px solid rgba(0,184,148,.3);color:var(--green);}
.mbadge.purple{background:rgba(108,92,231,.15);border:1px solid rgba(108,92,231,.3);color:var(--accent-light);}
.m-meta{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;}
.m-meta-item{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 14px;}
.m-meta-label{font-size:10px;color:var(--text3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:4px;font-weight:600;}
.m-meta-val{font-size:14px;font-weight:600;color:var(--text);}
.m-actions{display:flex;gap:10px;}
.btn-buy-now{flex:1;background:linear-gradient(135deg,var(--accent2),#ff6b35);border:none;border-radius:13px;cursor:pointer;color:#fff;font-family:var(--font-d);font-weight:700;font-size:15px;padding:13px;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .25s;box-shadow:0 6px 22px rgba(253,121,168,.3);}
.btn-buy-now:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(253,121,168,.5);}
.btn-icon{width:48px;height:48px;border-radius:12px;border:1px solid var(--border2);background:var(--bg3);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;font-size:18px;flex-shrink:0;}
.btn-icon:hover{border-color:var(--accent);background:rgba(108,92,231,.1);}

/* ── CART ── */
.cart-overlay{position:fixed;inset:0;z-index:400;display:flex;justify-content:flex-end;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);}
.cart-panel{width:420px;background:var(--bg2);border-left:1px solid var(--border);display:flex;flex-direction:column;height:100%;animation:sIn .32s cubic-bezier(.34,1.56,.64,1);}
@keyframes sIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
.cart-hdr{padding:22px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.cart-hdr h2{font-family:var(--font-d);font-size:18px;font-weight:800;}
.cart-items{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;}
.ci{background:var(--bg3);border:1px solid var(--border);border-radius:13px;padding:13px;display:flex;align-items:center;gap:12px;}
.ci-emoji{font-size:32px;width:52px;height:52px;display:flex;align-items:center;justify-content:center;border-radius:10px;flex-shrink:0;}
.ci-info{flex:1;min-width:0;}
.ci-title{font-weight:600;font-size:13px;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ci-seller{font-size:11px;color:var(--text3);margin-bottom:8px;}
.ci-row{display:flex;align-items:center;justify-content:space-between;}
.ci-price{font-family:var(--font-d);font-size:15px;font-weight:800;}
.qty-ctrl{display:flex;align-items:center;gap:7px;}
.qty-b{width:26px;height:26px;border-radius:7px;border:1px solid var(--border2);background:var(--bg4);color:var(--text);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all .2s;line-height:1;}
.qty-b:hover{border-color:var(--accent);background:rgba(108,92,231,.12);}
.qty-n{font-size:13px;font-weight:700;min-width:18px;text-align:center;}
.ci-remove{background:none;border:none;cursor:pointer;color:var(--text3);padding:4px;font-size:16px;border-radius:6px;transition:all .2s;}
.ci-remove:hover{color:var(--accent2);background:rgba(253,121,168,.1);}
.cart-ftr{padding:18px 20px;border-top:1px solid var(--border);}
.cart-row{display:flex;justify-content:space-between;font-size:13px;color:var(--text2);margin-bottom:6px;}
.cart-total-row{display:flex;justify-content:space-between;margin-bottom:18px;margin-top:10px;}
.cart-total-label{font-family:var(--font-d);font-weight:700;font-size:17px;}
.cart-total-amt{font-family:var(--font-d);font-weight:800;font-size:22px;color:var(--accent-light);}
.btn-checkout{width:100%;background:linear-gradient(135deg,var(--accent),#8b7ff8);border:none;border-radius:13px;cursor:pointer;color:#fff;font-family:var(--font-d);font-weight:700;font-size:15px;padding:15px;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .25s;box-shadow:0 6px 22px rgba(108,92,231,.35);}
.btn-checkout:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(108,92,231,.5);}
.cart-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:var(--text3);}
.cart-empty-icon{font-size:52px;opacity:.4;}

/* ── SELL PAGE ── */
.sell-page{max-width:800px;margin:0 auto;padding:40px 28px 80px;}
.sell-header{margin-bottom:40px;}
.sell-header h1{font-family:var(--font-d);font-size:38px;font-weight:800;letter-spacing:-1.5px;margin-bottom:10px;}
.sell-header h1 em{font-style:normal;color:var(--accent-light);}
.sell-header p{color:var(--text2);font-size:15px;line-height:1.7;}
.sell-steps{display:flex;gap:16px;margin-bottom:40px;flex-wrap:wrap;}
.sell-step{flex:1;min-width:160px;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:18px;text-align:center;}
.sell-step-num{width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;font-family:var(--font-d);font-weight:800;font-size:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;}
.sell-step h4{font-size:13px;font-weight:700;margin-bottom:4px;}
.sell-step p{font-size:11px;color:var(--text3);}
.sell-form{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;}
.sell-form h3{font-family:var(--font-d);font-size:20px;font-weight:700;margin-bottom:24px;display:flex;align-items:center;gap:9px;}
.upload-area{border:2px dashed var(--border2);border-radius:14px;padding:40px;text-align:center;cursor:pointer;transition:all .2s;background:var(--bg3);margin-bottom:20px;}
.upload-area:hover{border-color:var(--accent);background:rgba(108,92,231,.05);}
.upload-area.dragover{border-color:var(--accent);background:rgba(108,92,231,.1);}
.upload-icon{font-size:48px;margin-bottom:12px;}
.upload-area h4{font-size:15px;font-weight:600;margin-bottom:6px;}
.upload-area p{font-size:12px;color:var(--text3);}
.emoji-picker{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin-bottom:20px;}
.emoji-opt{font-size:24px;padding:10px;border-radius:10px;cursor:pointer;background:var(--bg3);border:1.5px solid var(--border2);text-align:center;transition:all .2s;}
.emoji-opt:hover,.emoji-opt.selected{border-color:var(--accent);background:rgba(108,92,231,.12);}
.color-picker{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;}
.color-swatch{width:36px;height:36px;border-radius:50%;cursor:pointer;border:3px solid transparent;transition:all .2s;flex-shrink:0;}
.color-swatch.selected{border-color:#fff;box-shadow:0 0 0 2px var(--accent);}
.sell-preview{background:var(--bg3);border:1px solid var(--border);border-radius:14px;padding:20px;margin-top:24px;}
.sell-preview h4{font-size:13px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;}
.btn-submit{width:100%;background:linear-gradient(135deg,var(--green),#00b894);border:none;border-radius:13px;cursor:pointer;color:#fff;font-family:var(--font-d);font-weight:700;font-size:16px;padding:16px;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .25s;box-shadow:0 6px 22px rgba(0,184,148,.35);margin-top:24px;}
.btn-submit:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(0,184,148,.5);}
.listing-posted{text-align:center;padding:60px 40px;}
.listing-posted-icon{font-size:80px;animation:bounce .6s cubic-bezier(.34,1.56,.64,1);}
@keyframes bounce{from{transform:scale(0);}to{transform:scale(1);}}
.listing-posted h2{font-family:var(--font-d);font-size:30px;font-weight:800;letter-spacing:-1px;margin:20px 0 12px;}
.listing-posted p{color:var(--text2);font-size:15px;margin-bottom:28px;}

/* ── HOW IT WORKS ── */
.hiw-page{max-width:960px;margin:0 auto;padding:48px 28px 80px;}
.hiw-hero{text-align:center;margin-bottom:64px;}
.hiw-hero h1{font-family:var(--font-d);font-size:48px;font-weight:800;letter-spacing:-2px;margin-bottom:14px;}
.hiw-hero h1 em{font-style:normal;color:var(--accent-light);}
.hiw-hero p{font-size:16px;color:var(--text2);max-width:520px;margin:0 auto;line-height:1.75;}
.hiw-section{margin-bottom:64px;}
.hiw-section-title{font-family:var(--font-d);font-size:24px;font-weight:800;letter-spacing:-.8px;margin-bottom:8px;}
.hiw-section-sub{font-size:14px;color:var(--text3);margin-bottom:28px;}
.hiw-steps{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px;}
.hiw-step-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:26px;position:relative;overflow:hidden;transition:all .25s;}
.hiw-step-card:hover{border-color:rgba(108,92,231,.4);transform:translateY(-4px);box-shadow:var(--glow);}
.hiw-step-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;}
.hiw-step-card.buyer::before{background:linear-gradient(90deg,var(--accent),var(--accent-light));}
.hiw-step-card.seller::before{background:linear-gradient(90deg,var(--green),var(--accent3));}
.hiw-step-card.trust::before{background:linear-gradient(90deg,var(--gold),var(--accent2));}
.hiw-step-icon{font-size:36px;margin-bottom:14px;}
.hiw-step-num{position:absolute;top:20px;right:20px;font-family:var(--font-d);font-size:40px;font-weight:800;color:var(--border2);line-height:1;}
.hiw-step-card h3{font-family:var(--font-d);font-size:16px;font-weight:700;margin-bottom:8px;}
.hiw-step-card p{font-size:13px;color:var(--text3);line-height:1.65;}
.hiw-trust-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;}
.trust-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;display:flex;gap:16px;align-items:flex-start;transition:all .25s;}
.trust-card:hover{border-color:rgba(108,92,231,.35);transform:translateY(-3px);}
.trust-card-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;}
.trust-card h3{font-size:15px;font-weight:700;margin-bottom:6px;}
.trust-card p{font-size:13px;color:var(--text3);line-height:1.6;}
.faq-list{display:flex;flex-direction:column;gap:10px;}
.faq-item{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;}
.faq-q{width:100%;padding:18px 20px;background:none;border:none;cursor:pointer;color:var(--text);font-family:var(--font-b);font-size:14px;font-weight:600;text-align:left;display:flex;align-items:center;justify-content:space-between;transition:all .2s;}
.faq-q:hover{background:rgba(108,92,231,.05);}
.faq-q.open{color:var(--accent-light);}
.faq-a{padding:0 20px 16px;font-size:13px;color:var(--text3);line-height:1.7;}
.hiw-cta-box{background:linear-gradient(135deg,var(--bg2),var(--bg3));border:1px solid var(--border2);border-radius:var(--radius-lg);padding:48px;text-align:center;position:relative;overflow:hidden;}
.hiw-cta-box::before{content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(108,92,231,.15) 0%,transparent 70%);top:-150px;right:-100px;}
.hiw-cta-box h2{font-family:var(--font-d);font-size:32px;font-weight:800;letter-spacing:-1px;margin-bottom:10px;position:relative;}
.hiw-cta-box p{color:var(--text2);font-size:15px;margin-bottom:28px;position:relative;}
.cta-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;}

/* ── PROFILE PAGE ── */
.profile-page{max-width:1080px;margin:0 auto;padding:40px 28px 80px;}
.profile-header{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;margin-bottom:24px;display:flex;gap:24px;align-items:flex-start;position:relative;overflow:hidden;}
.profile-header::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--accent),var(--accent2),var(--accent3));}
.profile-cover-grad{position:absolute;top:0;right:0;width:300px;height:100%;background:radial-gradient(ellipse,rgba(108,92,231,.1) 0%,transparent 70%);pointer-events:none;}
.profile-av{width:90px;height:90px;border-radius:50%;font-size:30px;font-weight:800;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;border:3px solid var(--border2);position:relative;z-index:1;}
.profile-av-edit{position:absolute;bottom:0;right:0;width:28px;height:28px;border-radius:50%;background:var(--accent);border:2px solid var(--bg2);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;}
.profile-info{flex:1;position:relative;z-index:1;}
.profile-name{font-family:var(--font-d);font-size:26px;font-weight:800;letter-spacing:-.8px;margin-bottom:4px;}
.profile-dept{font-size:14px;color:var(--text3);margin-bottom:12px;}
.profile-badges{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.pbadge{font-size:11px;font-weight:700;padding:4px 12px;border-radius:6px;display:flex;align-items:center;gap:5px;}
.pbadge.verified{background:rgba(0,184,148,.15);border:1px solid rgba(0,184,148,.3);color:var(--green);}
.pbadge.seller{background:rgba(253,203,110,.15);border:1px solid rgba(253,203,110,.3);color:var(--gold);}
.pbadge.rating{background:rgba(108,92,231,.15);border:1px solid rgba(108,92,231,.3);color:var(--accent-light);}
.profile-meta{display:flex;gap:24px;}
.pm-item{text-align:center;}
.pm-num{font-family:var(--font-d);font-size:20px;font-weight:800;letter-spacing:-.5px;}
.pm-label{font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;}
.profile-tabs{display:flex;border-bottom:1px solid var(--border);margin-bottom:28px;}
.profile-tab{padding:14px 20px;background:none;border:none;cursor:pointer;font-family:var(--font-b);font-size:14px;font-weight:600;color:var(--text3);position:relative;transition:all .2s;}
.profile-tab:hover{color:var(--text);}
.profile-tab.active{color:var(--accent-light);}
.profile-tab.active::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:2px;background:var(--accent);}
.profile-content{min-height:400px;}
.profile-grid{display:grid;grid-template-columns:1fr 320px;gap:24px;}
.profile-section{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-lg);padding:24px;margin-bottom:20px;}
.profile-section h3{font-family:var(--font-d);font-size:16px;font-weight:700;margin-bottom:18px;display:flex;align-items:center;gap:8px;}
.edit-field{margin-bottom:14px;}
.order-card{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;}
.order-emoji{font-size:32px;width:52px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.order-info{flex:1;}
.order-title{font-weight:600;font-size:14px;margin-bottom:3px;}
.order-meta{font-size:12px;color:var(--text3);}
.order-status{font-size:11px;font-weight:700;padding:4px 10px;border-radius:6px;}
.status-delivered{background:rgba(0,184,148,.15);color:var(--green);}
.status-transit{background:rgba(253,203,110,.15);color:var(--gold);}
.status-pending{background:rgba(108,92,231,.15);color:var(--accent-light);}
.listing-mgmt-card{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:12px;display:flex;align-items:center;gap:14px;}
.listing-actions{display:flex;gap:8px;}
.btn-sm{padding:6px 14px;border-radius:8px;border:1px solid var(--border2);background:var(--bg4);color:var(--text2);font-size:12px;font-weight:600;cursor:pointer;font-family:var(--font-b);transition:all .2s;}
.btn-sm:hover{border-color:var(--accent);color:var(--accent);}
.btn-sm.danger:hover{border-color:var(--accent2);color:var(--accent2);}
.toggle-row{display:flex;align-items:center;justify-content:space-between;padding:13px 0;border-bottom:1px solid var(--border);}
.toggle-row:last-child{border-bottom:none;}
.toggle-label{font-size:14px;}
.toggle-desc{font-size:12px;color:var(--text3);margin-top:2px;}
.toggle{width:44px;height:24px;border-radius:12px;background:var(--bg4);border:none;cursor:pointer;position:relative;transition:all .3s;flex-shrink:0;}
.toggle.on{background:var(--accent);}
.toggle::after{content:'';position:absolute;width:18px;height:18px;border-radius:50%;background:#fff;top:3px;left:3px;transition:all .3s;}
.toggle.on::after{left:23px;}
.wishlist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;}

/* ── CHECKOUT ── */
.checkout-overlay{position:fixed;inset:0;z-index:500;background:rgba(0,0,0,.85);backdrop-filter:blur(12px);display:flex;align-items:center;justify-content:center;padding:20px;}
.checkout-modal{background:var(--bg2);border:1px solid var(--border2);border-radius:22px;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 40px 100px rgba(0,0,0,.7);animation:mIn .3s cubic-bezier(.34,1.56,.64,1);}
.checkout-progress{display:flex;align-items:center;gap:6px;padding:20px 24px;border-bottom:1px solid var(--border);}
.cp-step{display:flex;align-items:center;gap:6px;}
.cp-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;border:1.5px solid var(--border2);color:var(--text3);transition:all .3s;}
.cp-dot.done{background:var(--green);border-color:var(--green);color:#fff;}
.cp-dot.active{background:var(--accent);border-color:var(--accent);color:#fff;}
.cp-label{font-size:12px;font-weight:600;color:var(--text3);}
.cp-label.active{color:var(--accent-light);}
.cp-line{flex:1;height:1px;background:var(--border);}
.campus-check-banner{background:rgba(0,206,201,.07);border:1px solid rgba(0,206,201,.2);border-radius:12px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;margin:16px 0;}
.ccb-icon{font-size:22px;flex-shrink:0;}
.ccb-title{font-size:13px;font-weight:700;color:var(--accent3);margin-bottom:3px;}
.ccb-desc{font-size:12px;color:var(--text3);}
.payment-opts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:20px;}
.pay-opt{padding:14px 10px;border-radius:11px;border:1.5px solid var(--border2);background:var(--bg3);cursor:pointer;text-align:center;transition:all .2s;}
.pay-opt:hover{border-color:var(--accent);}
.pay-opt.selected{border-color:var(--accent);background:rgba(108,92,231,.1);}
.pay-opt-icon{font-size:24px;margin-bottom:6px;}
.pay-opt-label{font-size:12px;font-weight:600;color:var(--text2);}
.pay-opt.selected .pay-opt-label{color:var(--accent-light);}
.order-summary-mini{background:var(--bg3);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px;}
.osm-item{display:flex;justify-content:space-between;font-size:13px;color:var(--text2);margin-bottom:6px;}
.osm-total{display:flex;justify-content:space-between;font-family:var(--font-d);font-weight:700;font-size:17px;margin-top:10px;padding-top:10px;border-top:1px solid var(--border);}

/* ── SUCCESS ── */
.success-page{text-align:center;padding:56px 40px;}
.success-icon{font-size:80px;animation:bounce .6s cubic-bezier(.34,1.56,.64,1);}
.success-page h2{font-family:var(--font-d);font-size:30px;font-weight:800;letter-spacing:-1px;margin:20px 0 12px;}
.success-page p{color:var(--text2);font-size:15px;margin-bottom:24px;}
.order-id-box{background:var(--bg3);border:1px solid var(--border);border-radius:10px;padding:12px 20px;font-family:monospace;font-size:14px;color:var(--accent-light);display:inline-block;margin-bottom:28px;}

/* ── TOAST ── */
.toast-wrap{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);z-index:9000;}
.toast{background:var(--bg2);border:1px solid var(--border2);border-radius:14px;padding:13px 22px;display:flex;align-items:center;gap:11px;font-size:13px;font-weight:500;box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 0 1px rgba(108,92,231,.2);animation:tIn .35s cubic-bezier(.34,1.56,.64,1);white-space:nowrap;color:var(--text);}
@keyframes tIn{from{opacity:0;transform:translateY(16px) scale(.92);}to{opacity:1;transform:translateY(0) scale(1);}}

/* ── EMPTY / MISC ── */
.empty-state{padding:80px 20px;text-align:center;color:var(--text3);}
.empty-state-icon{font-size:56px;opacity:.4;margin-bottom:14px;}
.empty-state h3{font-family:var(--font-d);font-size:20px;font-weight:700;color:var(--text2);margin-bottom:6px;}
.empty-state p{font-size:14px;}
.section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;}
.section-title-lg{font-family:var(--font-d);font-size:20px;font-weight:800;letter-spacing:-.5px;}
.divider{height:1px;background:var(--border);margin:32px 0;}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .shop-layout{padding:0 16px 60px;}
  .filter-sidebar{display:none;}
  .auth-left{display:none;}
  .auth-right{width:100%;}
  .profile-grid{grid-template-columns:1fr;}
}
@media(max-width:640px){
  .nav{padding:0 14px;gap:10px;}
  .nav-links{display:none;}
  .nav-search{max-width:160px;}
  .hero{padding:80px 16px 40px;}
  .hero h1{letter-spacing:-1.5px;}
  .sell-page,.hiw-page,.profile-page{padding:32px 16px 60px;}
  .cart-panel{width:100%;}
  .profile-header{flex-direction:column;}
  .payment-opts{grid-template-columns:1fr 1fr;}
  .form-row{grid-template-columns:1fr;}
}
`;

// ═══════════════════════════════════════════════════════════════
// SVG ICONS
// ═══════════════════════════════════════════════════════════════
const Ic = {
  Search: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Cart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
  Star: ({f}) => <svg width="12" height="12" viewBox="0 0 24 24" fill={f?"#fdcb6e":"none"} stroke="#fdcb6e" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Heart: ({a}) => <svg width="16" height="16" viewBox="0 0 24 24" fill={a?"#fd79a8":"none"} stroke="#fd79a8" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Plus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Minus: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Check: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  Arrow: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  Grid: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  List: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Filter: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  Shield: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Eye: ({open}) => open
    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  ChevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Bell: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Logout: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const Stars = ({r}) => {
  return <span style={{display:"flex",gap:"1px"}}>{[1,2,3,4,5].map(i=><Ic.Star key={i} f={i<=Math.round(r)}/>)}</span>;
};

const getBadgeClass = (badge) => {
  if (!badge) return "";
  const b = badge.toLowerCase();
  if (b.includes("hot") || b.includes("trend")) return "b-hot";
  if (b.includes("rare")) return "b-rare";
  if (b.includes("new")) return "b-new";
  if (b.includes("sell")) return "b-sell";
  return "";
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ── FilterSidebar ──
function FilterSidebar({ filters, setFilters, products}) {
const catCounts = {};
CATEGORIES.forEach(c => {
  catCounts[c] = c === "All"
    ? products.length
    : products.filter(p => p.category === c).length;
});

  const toggle = (key, val) => setFilters(f => ({
    ...f,
    [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
  }));

  const hasActive = filters.categories.length > 0 || filters.verified !== false ||
    filters.priceMin > 0 || filters.priceMax < 1000 || filters.depts.length > 0;

  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-inner">
        <div className="filter-section">
          <div className="filter-section-title">
            <span>Category {filters.categories.length > 0 && <span className="filter-active-dot"/>}</span>
            {filters.categories.length > 0 && <button className="filter-clear-btn" onClick={() => setFilters(f=>({...f,categories:[]}))}>Clear</button>}
          </div>
          {CATEGORIES.filter(c=>c!=="All").map(c => (
            <label key={c} className="filter-check" onClick={() => toggle("categories", c)}>
              <div className={`fc-box ${filters.categories.includes(c)?"checked":""}`}>
                {filters.categories.includes(c) && <Ic.Check/>}
              </div>
              <span className="fc-label">{c}</span>
              <span className="fc-count">{catCounts[c]}</span>
            </label>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Price Range</div>
          <div className="price-range">
            <div className="price-inputs">
              <input className="price-input" type="number" placeholder="Min ₹" value={filters.priceMin||""} onChange={e=>setFilters(f=>({...f,priceMin:Number(e.target.value)||0}))}/>
              <span style={{color:"var(--text3)",flexShrink:0}}>–</span>
              <input className="price-input" type="number" placeholder="Max ₹" value={filters.priceMax||""} onChange={e=>setFilters(f=>({...f,priceMax:Number(e.target.value)||10000}))}/>
            </div>
            <input className="range-slider" type="range" min="0" max="1000" value={filters.priceMax} onChange={e=>setFilters(f=>({...f,priceMax:Number(e.target.value)}))}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"11px",color:"var(--text3)"}}>
              <span>₹0</span><span>Up to ₹{filters.priceMax >= 1000 ? "1000+" : filters.priceMax}</span>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-section-title">
            <span>Department {filters.depts.length > 0 && <span className="filter-active-dot"/>}</span>
            {filters.depts.length > 0 && <button className="filter-clear-btn" onClick={() => setFilters(f=>({...f,depts:[]}))}>Clear</button>}
          </div>
          {DEPTS.map(d => (
            <label key={d} className="filter-check" onClick={() => toggle("depts", d)}>
              <div className={`fc-box ${filters.depts.includes(d)?"checked":""}`}>
                {filters.depts.includes(d) && <Ic.Check/>}
              </div>
              <span className="fc-label">{d}</span>
            </label>
          ))}
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Seller Type</div>
          <label className="filter-check" onClick={() => setFilters(f=>({...f,verified:!f.verified}))}>
            <div className={`fc-box ${filters.verified?"checked":""}`}>
              {filters.verified && <Ic.Check/>}
            </div>
            <span className="fc-label">Verified Only</span>
            <span className="fc-count">🛡️</span>
          </label>
          <label className="filter-check" onClick={() => setFilters(f=>({...f,inStock:!f.inStock}))}>
            <div className={`fc-box ${filters.inStock?"checked":""}`}>
              {filters.inStock && <Ic.Check/>}
            </div>
            <span className="fc-label">In Stock Only</span>
          </label>
          <label className="filter-check" onClick={() => setFilters(f=>({...f,hasDiscount:!f.hasDiscount}))}>
            <div className={`fc-box ${filters.hasDiscount?"checked":""}`}>
              {filters.hasDiscount && <Ic.Check/>}
            </div>
            <span className="fc-label">On Sale</span>
            <span className="fc-count">%</span>
          </label>
        </div>

        <div className="filter-section">
          <div className="filter-section-title">Rating</div>
          {[4.5, 4.0, 3.5].map(r => (
            <label key={r} className="filter-check" onClick={() => setFilters(f=>({...f,minRating:f.minRating===r?0:r}))}>
              <div className={`fc-box ${filters.minRating===r?"checked":""}`}>
                {filters.minRating===r && <Ic.Check/>}
              </div>
              <span className="fc-label" style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <Stars r={r}/> & above
              </span>
            </label>
          ))}
        </div>

        {hasActive && (
          <button onClick={() => setFilters({categories:[],priceMin:0,priceMax:10000,depts:[],verified:false,inStock:false,hasDiscount:false,minRating:0})}
            style={{width:"100%",padding:"11px",background:"rgba(253,121,168,.1)",border:"1px solid rgba(253,121,168,.3)",borderRadius:"10px",color:"var(--accent2)",cursor:"pointer",fontWeight:"700",fontSize:"13px",fontFamily:"var(--font-b)",transition:"all .2s"}}>
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}

// ── ProductCard ──
function ProductCard({ product, onAdd, onView, onWish, wished, listView }) {
  const disc = discountPct(product.originalPrice, product.price);
  const col = sellerColor(product.seller);
  return (
    <div className={`card${listView?" list-view":""}`} onClick={() => onView(product)}>
      <div className="card-img" style={{background: gradientFor(product.colors)}}>
        <span style={{position:"relative",zIndex:1,fontSize:listView?52:78}}>{product.image}</span>
        <div className="card-img-grad"/>
        <span className={`card-badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
        <button className={`card-wish ${wished?"wished":""}`} onClick={e=>{e.stopPropagation();onWish(product.id);}}>
          <Ic.Heart a={wished}/>
        </button>
        {product.stock <= 3 && product.stock < 999 && <div className="stock-warn">⚡ Only {product.stock} left!</div>}
      </div>
      <div className="card-body">
        <div className="card-title">{product.title}</div>
        <div className="card-seller-row">
          <div className="s-av" style={{background:`linear-gradient(135deg,${col[0]},${col[1]})`}}>{product.avatar}</div>
          <div className="s-name">
            <strong>{product.seller}</strong> · {product.dept}
            {product.verified && <span className="verified-tag"><Ic.Check/> Verified</span>}
          </div>
        </div>
        <div className="card-rating-row">
          <Stars r={product.rating}/>
          <span className="r-num">{product.rating}</span>
          <span className="r-ct">({product.reviews})</span>
        </div>
        <div className="card-foot">
          <div className="price-wrap">
            <div className="p-curr"><sup style={{fontSize:"12px"}}>₹</sup>{product.price.toLocaleString()}</div>
            {disc > 0 && <div><span className="p-orig">₹{product.originalPrice}</span><span className="p-disc">-{disc}%</span></div>}
          </div>
          <button className="btn-cart" onClick={e=>{e.stopPropagation();onAdd(product,e);}}>
            <Ic.Plus/> Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════════════════════════

// ── Auth Page ──
function AuthPage({ onLogin }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"", dept:"", year:"", hostel:"", phone:"" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const upd = (k, v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:""})); };

  const validate = () => {
    const e = {};
    if (!form.email.match(/@/) ) e.email = "Enter a valid college email";
    if (form.password.length < 6) e.password = "Min 6 characters";
    if (tab === "signup") {
      if (!form.name.trim()) e.name = "Name required";
      if (!form.dept) e.dept = "Select department";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      onLogin({ name: form.name || "Karan Singh", email: form.email, dept: form.dept || "Computer Science", hostel: form.hostel || "Hostel A", avatar: (form.name || "Karan Singh").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase() });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-bg"><div className="auth-orb1"/><div className="auth-orb2"/></div>
        <div className="auth-left-content">
          <div className="auth-brand">Campus<em>Market</em><br/><span>for Students</span></div>
          <p className="auth-tagline">The only marketplace where your college ID is your trust score. Buy, sell, and connect within your campus ecosystem.</p>
          <div className="auth-features">
            {[
              {icon:"🏛️", title:"Campus-Exclusive", desc:"Only verified students from your college can buy or sell"},
              {icon:"🛡️", title:"Safe & Secure", desc:"Every seller is verified with a valid college email"},
              {icon:"🚀", title:"Instant Campus Delivery", desc:"Products delivered to your hostel within 24 hours"},
              {icon:"💸", title:"Zero Platform Fee", desc:"100% earnings go directly to the student seller"},
            ].map(f => (
              <div key={f.title} className="auth-feat">
                <div className="auth-feat-icon">{f.icon}</div>
                <div className="auth-feat-text"><h4>{f.title}</h4><p>{f.desc}</p></div>
              </div>
            ))}
          </div>
          <div className="auth-stats">
            {[["1,240+","Listings"],["340+","Sellers"],["₹4.2L","Traded"]].map(([n,l]) => (
              <div key={l} style={{textAlign:"center"}}>
                <div className="auth-stat-num" style={{color:"var(--accent-light)"}}>{n}</div>
                <div className="auth-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div style={{marginBottom:"28px"}}>
            <div style={{fontFamily:"var(--font-d)",fontSize:"20px",fontWeight:"800",letterSpacing:"-.5px",marginBottom:"4px",display:"flex",alignItems:"center",gap:"8px"}}>
              <span style={{fontSize:"22px"}}>🏛️</span> CampusMarket
            </div>
          </div>

          <div className="auth-tabs">
            {["login","signup"].map(t => (
              <button key={t} className={`auth-tab ${tab===t?"active":""}`} onClick={()=>setTab(t)}>
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <div className="auth-title">{tab==="login" ? "Welcome back 👋" : "Join the marketplace ✨"}</div>
          <div className="auth-sub">{tab==="login" ? "Sign in to your campus account" : "Register with your college email to get started"}</div>

          <div className="auth-verify">
            <div className="auth-verify-icon">🔐</div>
            <p>Use your <strong>college email</strong> (e.g. student@college.edu) to verify your campus identity. Non-college emails will be rejected.</p>
          </div>

          {tab === "signup" && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className={`form-input ${errors.name?"border-accent2":""}`} placeholder="Karan Singh" value={form.name} onChange={e=>upd("name",e.target.value)}/>
                {errors.name && <div style={{fontSize:"11px",color:"var(--accent2)",marginTop:"4px"}}>{errors.name}</div>}
              </div>
              <div className="form-row">
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Department</label>
                  <select className="form-select" value={form.dept} onChange={e=>upd("dept",e.target.value)}>
                    <option value="">Select dept.</option>
                    {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.dept && <div style={{fontSize:"11px",color:"var(--accent2)",marginTop:"4px"}}>{errors.dept}</div>}
                </div>
                <div className="form-group" style={{margin:0}}>
                  <label className="form-label">Year</label>
                  <select className="form-select" value={form.year} onChange={e=>upd("year",e.target.value)}>
                    <option value="">Year</option>
                    {["1st","2nd","3rd","4th","5th"].map(y=><option key={y} value={y}>{y} Year</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Hostel / Location</label>
                <select className="form-select" value={form.hostel} onChange={e=>upd("hostel",e.target.value)}>
                  <option value="">Select hostel</option>
                  {HOSTELS.map(h=><option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">College Email</label>
            <input className="form-input" type="email" placeholder="yourname@college.edu" value={form.email} onChange={e=>upd("email",e.target.value)}/>
            {errors.email && <div style={{fontSize:"11px",color:"var(--accent2)",marginTop:"4px"}}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pass-toggle" style={{position:"relative"}}>
              <input className="form-input" type={showPass?"text":"password"} placeholder="••••••••" value={form.password} onChange={e=>upd("password",e.target.value)} style={{paddingRight:"44px"}}/>
              <button className="pass-eye" onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"var(--text3)"}}>
                <Ic.Eye open={showPass}/>
              </button>
            </div>
            {errors.password && <div style={{fontSize:"11px",color:"var(--accent2)",marginTop:"4px"}}>{errors.password}</div>}
          </div>

          <button className="btn-full" onClick={submit} disabled={loading}>
            {loading ? <span style={{display:"flex",alignItems:"center",gap:"8px"}}><span style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>Verifying...</span>
              : tab === "login" ? "Sign In to Campus" : "Create My Account"}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>

          <div style={{textAlign:"center",marginTop:"20px",fontSize:"13px",color:"var(--text3)"}}>
            {tab === "login" ? "Don't have an account? " : "Already have an account? "}
            <span style={{color:"var(--accent-light)",cursor:"pointer",fontWeight:"600"}} onClick={()=>setTab(tab==="login"?"signup":"login")}>
              {tab === "login" ? "Sign up free" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Home / Shop Page ──
function HomePage({ user, products, cart, onAdd, wishlist, onWish }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [listView, setListView] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ categories:[], priceMin:0, priceMax:10000, depts:[], verified:false, inStock:false, hasDiscount:false, minRating:0 });

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const ms = !q || p.title.toLowerCase().includes(q) || p.seller.toLowerCase().includes(q) || p.tags.some(t=>t.includes(q)) || p.category.toLowerCase().includes(q);
    const mc = category === "All" || p.category === category;
    const mfc = filters.categories.length === 0 || filters.categories.includes(p.category);
    const mprice = p.price >= filters.priceMin && (filters.priceMax >= 10000 || p.price <= filters.priceMax);
    const mdept = filters.depts.length === 0 || filters.depts.includes(p.dept);
    const mv = !filters.verified || p.verified;
    const mis = !filters.inStock || p.stock > 0;
    const md = !filters.hasDiscount || p.originalPrice > p.price;
    const mr = p.rating >= (filters.minRating || 0);
    return ms && mc && mfc && mprice && mdept && mv && mis && md && mr;
  }).sort((a,b) => {
    if(sort==="popular") return b.reviews - a.reviews;
    if(sort==="price_low") return a.price - b.price;
    if(sort==="price_high") return b.price - a.price;
    if(sort==="rating") return b.rating - a.rating;
    if(sort==="newest") return b.id - a.id;
    return 0;
  });

  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-orb1"/><div className="hero-orb2"/>
        <div className="hero-inner">
          <div className="hero-badge">🎓 Campus-Exclusive Marketplace</div>
          <h1>Where <em>Student</em><br/>Creators <span>Thrive</span></h1>
          <p className="hero-sub">Discover handmade crafts, original art, food, tech builds & more — made by your fellow students. 100% campus-verified, peer-to-peer commerce.</p>
          <div className="hero-cta">
            <button className="btn-hero-primary" onClick={() => document.getElementById("shop-area")?.scrollIntoView({behavior:"smooth"})}>
              Browse Products <Ic.Arrow/>
            </button>
          </div>
          <div className="hero-stats">
            {[["1,240+","Listings","var(--accent-light)"],["340+","Student Sellers","var(--accent2)"],["₹4.2L","Traded","var(--accent3)"],["4.8★","Avg Rating","var(--gold)"]].map(([n,l,c]) => (
              <div key={l}>
                <div className="h-stat-num" style={{color:c}}>{n}</div>
                <div className="h-stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop area */}
      <div id="shop-area" className="shop-layout">
        <FilterSidebar filters={filters} setFilters={setFilters} products={products}/>

        <div className="products-area">
          {/* Category bar */}
          <div className="cat-bar">
            {CATEGORIES.map(c => (
              <button key={c} className={`cat-chip ${category===c?"active":""}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {/* Toolbar */}
          <div className="products-toolbar">
            <div style={{position:"relative",flex:1,maxWidth:"320px"}}>
              <span style={{position:"absolute",left:"12px",top:"50%",transform:"translateY(-50%)",color:"var(--text3)"}}><Ic.Search/></span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, creators..." style={{width:"100%",padding:"9px 14px 9px 36px",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"40px",color:"var(--text)",fontSize:"13px",fontFamily:"var(--font-b)",outline:"none"}}/>
            </div>
            <div className="toolbar-right">
              <span className="products-count"><strong>{filtered.length}</strong> products</span>
              <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price ↑</option>
                <option value="price_high">Price ↓</option>
              </select>
              <div className="view-toggle">
                <button className={`view-btn ${!listView?"active":""}`} onClick={() => setListView(false)}><Ic.Grid/></button>
                <button className={`view-btn ${listView?"active":""}`} onClick={() => setListView(true)}><Ic.List/></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><h3>No products found</h3><p>Try adjusting your filters or search term</p></div>
          ) : (
            <div className={`pgrid ${listView?"list-view":""}`}>
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onAdd={onAdd} onView={setSelected} onWish={onWish} wished={wishlist.includes(p.id)} listView={listView}/>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {selected && (
        <div className="overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="m-header">
              <span style={{fontSize:"12px",fontWeight:"700",color:"var(--text3)",textTransform:"uppercase",letterSpacing:"1px"}}>Product Details</span>
              <button className="m-close" onClick={() => setSelected(null)}><Ic.X/></button>
            </div>
            <div className="m-body">
              <div className="m-img" style={{background: gradientFor(selected.colors)}}>{selected.image}</div>
              <div style={{display:"flex",gap:"8px",alignItems:"center",marginBottom:"8px",flexWrap:"wrap"}}>
                <span style={{fontSize:"11px",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:"6px",padding:"3px 10px",color:"var(--text3)"}}>{selected.category}</span>
                {selected.verified && <span style={{display:"flex",alignItems:"center",gap:"4px",fontSize:"11px",color:"var(--green)",fontWeight:"700"}}><Ic.Shield/> Verified Seller</span>}
                {selected.stock <= 5 && selected.stock < 999 && <span style={{fontSize:"11px",color:"var(--accent2)",fontWeight:"700"}}>⚡ Only {selected.stock} left</span>}
              </div>
              <div className="m-title">{selected.title}</div>
              <div className="m-price-row">
                <div className="m-price">₹{selected.price.toLocaleString()}</div>
                {discountPct(selected.originalPrice,selected.price) > 0 && <>
                  <div style={{fontSize:"18px",color:"var(--text3)",textDecoration:"line-through"}}>₹{selected.originalPrice}</div>
                  <div style={{background:"rgba(0,206,201,.12)",border:"1px solid rgba(0,206,201,.3)",borderRadius:"6px",padding:"4px 10px",fontSize:"12px",color:"var(--accent3)",fontWeight:"700"}}>{discountPct(selected.originalPrice,selected.price)}% off</div>
                </>}
              </div>
              <div className="m-seller-box">
                <div className="m-s-av" style={{background:`linear-gradient(135deg,${sellerColor(selected.seller)[0]},${sellerColor(selected.seller)[1]})`}}>{selected.avatar}</div>
                <div style={{flex:1}}>
                  <div className="m-s-name">{selected.seller}</div>
                  <div className="m-s-dept">{selected.dept} Department</div>
                  <div className="m-s-badges">
                    {selected.verified && <span className="mbadge green"><Ic.Check/> Verified</span>}
                    <span className="mbadge purple">⭐ {selected.rating} · {selected.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <div className="m-meta">
                <div className="m-meta-item"><div className="m-meta-label">Delivery</div><div className="m-meta-val">{selected.delivery}</div></div>
                <div className="m-meta-item"><div className="m-meta-label">Location</div><div className="m-meta-val">{selected.location}</div></div>
                <div className="m-meta-item"><div className="m-meta-label">Stock</div><div className="m-meta-val">{selected.stock >= 999 ? "In Stock" : `${selected.stock} units`}</div></div>
                <div className="m-meta-item"><div className="m-meta-label">Category</div><div className="m-meta-val">{selected.category}</div></div>
              </div>
              <p className="m-desc">{selected.description}</p>
              <div className="tag-row">{selected.tags.map(t=><span key={t} className="tag">#{t}</span>)}</div>
              <div className="m-actions">
                <button className="btn-buy-now" onClick={() => { onAdd(selected); setSelected(null); }}>🛒 Add to Cart</button>
                <button className={`btn-icon ${wishlist.includes(selected.id)?"wished":""}`} onClick={() => onWish(selected.id)}>
                  <Ic.Heart a={wishlist.includes(selected.id)}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sell Page ──
//function SellPage({ user, onNavigate }) {
function SellPage({ user, onNavigate, onAddProduct }) {
  const EMOJIS = ["🎨","🧶","⚡","🖼️","🍫","🪢","🎵","📝","📷","👜","🔖","👕","☕","📓","📿","🐍","🎭","🎪","🌸","🎋"];
  const CARD_COLORS = [["#1a1a2e","#16213e"],["#f9a825","#f57f17"],["#00897b","#004d40"],["#ad1457","#880e4f"],["#4e342e","#3e2723"],["#311b92","#1a237e"],["#1b5e20","#2e7d32"],["#37474f","#263238"],["#e91e63","#c2185b"],["#f57c00","#e65100"]];
  const [form, setForm] = useState({ title:"", category:"", price:"", description:"", tags:"", stock:"", delivery:"", selectedEmoji:"🎨", selectedColor:0 });
  const [posted, setPosted] = useState(false);
  const [step, setStep] = useState(1);

  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

const submit = () => {
  if (!form.title || !form.price || !form.category) return;

  const newProduct = {
    id: Date.now(),
    title: form.title,
    seller: user.name,
    sellerId: user.name.toLowerCase().replace(/\s/g,""),
    avatar: user.avatar,
    dept: user.dept,
    price: Number(form.price),
    originalPrice: Number(form.price),
    category: form.category,
    rating: 5.0,
    reviews: 0,
    badge: "New",
    verified: true,
    image: form.selectedEmoji,
    colors: CARD_COLORS[form.selectedColor],
    description: form.description || "No description provided.",
    tags: form.tags ? form.tags.split(",").map(t=>t.trim()) : [],
    stock: Number(form.stock) || 10,
    delivery: form.delivery || "1–2 days",
    location: user.hostel || "Campus",
  };

  onAddProduct(newProduct);
  setPosted(true);
};

  if (posted) return (
    <div className="page">
      <div className="sell-page">
        <div className="sell-form">
          <div className="listing-posted">
            <div className="listing-posted-icon">🎉</div>
            <h2>Listing Posted!</h2>
            <p>Your product <strong>"{form.title}"</strong> is now live on CampusMarket. Fellow students can browse and purchase it.</p>
            <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-full" style={{width:"auto",padding:"12px 28px"}} onClick={() => { setPosted(false); setForm({title:"",category:"",price:"",description:"",tags:"",stock:"",delivery:"",selectedEmoji:"🎨",selectedColor:0}); }}>
                Post Another
              </button>
              <button onClick={() => onNavigate("shop")} style={{padding:"12px 28px",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"12px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font-b)",fontWeight:"600",fontSize:"14px"}}>
                View Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="sell-page">
        <div className="sell-header">
          <h1>Start <em>Selling</em></h1>
          <p>List your handmade products, art, food, or services to 5,000+ students on campus. Zero fees, instant access.</p>
        </div>

        <div className="sell-steps">
          {[["1","List your product","Fill in product details"],["2","Choose visuals","Pick emoji & color theme"],["3","Set pricing","Add price, stock, delivery"],["4","Go live","Instant campus visibility"]].map(([n,t,d],i) => (
            <div key={n} className="sell-step" style={{borderColor: step >= i+1 ? "var(--accent)":"var(--border)"}}>
              <div className="sell-step-num" style={{background: step >= i+1 ? "var(--accent)":"var(--bg4)",color: step >= i+1?"#fff":"var(--text3)"}}>{n}</div>
              <h4>{t}</h4><p>{d}</p>
            </div>
          ))}
        </div>

        <div className="sell-form">
          <h3>📦 Product Details</h3>
          <div className="form-group">
            <label className="form-label">Product Title *</label>
            <input className="form-input" placeholder="e.g. Hand-painted Galaxy Tote Bag" value={form.title} onChange={e=>upd("title",e.target.value)}/>
          </div>
          <div className="form-row">
            <div className="form-group" style={{margin:0}}>
              <label className="form-label">Category *</label>
              <select className="form-select" value={form.category} onChange={e=>upd("category",e.target.value)}>
                <option value="">Select category</option>
                {CATEGORIES.filter(c=>c!=="All").map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" type="number" placeholder="299" value={form.price} onChange={e=>upd("price",e.target.value)}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" rows={4} placeholder="Describe your product — materials used, customisation options, size, etc." value={form.description} onChange={e=>upd("description",e.target.value)} style={{resize:"vertical"}}/>
          </div>
          <div className="form-row">
            <div className="form-group" style={{margin:0}}>
              <label className="form-label">Stock Quantity</label>
              <input className="form-input" type="number" placeholder="10" value={form.stock} onChange={e=>upd("stock",e.target.value)}/>
            </div>
            <div className="form-group" style={{margin:0}}>
              <label className="form-label">Delivery Time</label>
              <input className="form-input" placeholder="e.g. 1–2 days, Same day" value={form.delivery} onChange={e=>upd("delivery",e.target.value)}/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input className="form-input" placeholder="handmade, art, custom" value={form.tags} onChange={e=>upd("tags",e.target.value)}/>
          </div>

          <div className="divider"/>
          <h3 style={{fontFamily:"var(--font-d)",fontSize:"18px",fontWeight:"700",marginBottom:"18px",display:"flex",alignItems:"center",gap:"8px"}}>🎨 Product Visuals</h3>

          <div className="form-group">
            <label className="form-label">Choose Icon</label>
            <div className="emoji-picker">
              {EMOJIS.map(e=>(
                <button key={e} className={`emoji-opt ${form.selectedEmoji===e?"selected":""}`} onClick={()=>upd("selectedEmoji",e)}>{e}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Card Color Theme</label>
            <div className="color-picker">
              {CARD_COLORS.map(([c1,c2],i) => (
                <div key={i} className={`color-swatch ${form.selectedColor===i?"selected":""}`}
                  style={{background:`linear-gradient(135deg,${c1},${c2})`}}
                  onClick={()=>upd("selectedColor",i)}/>
              ))}
            </div>
          </div>

          {/* Preview */}
          {form.title && (
            <div className="sell-preview">
              <h4>👁️ Live Preview</h4>
              <div style={{maxWidth:"240px"}}>
                <div style={{background: gradientFor(CARD_COLORS[form.selectedColor]),height:"120px",borderRadius:"12px 12px 0 0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"52px"}}>{form.selectedEmoji}</div>
                <div style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"0 0 12px 12px",padding:"12px"}}>
                  <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"13px",marginBottom:"6px"}}>{form.title||"Your Product"}</div>
                  <div style={{fontSize:"11px",color:"var(--text3)",marginBottom:"8px"}}>{user.name} · {user.dept}</div>
                  <div style={{fontFamily:"var(--font-d)",fontWeight:"800",fontSize:"18px"}}>₹{form.price||"—"}</div>
                </div>
              </div>
            </div>
          )}

          <button className="btn-submit" onClick={submit}>
            🚀 Publish Listing
          </button>
        </div>
      </div>
    </div>
  );
}

// ── How It Works Page ──
function HowItWorksPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null);
  const faqs = [
    ["Who can use CampusMarket?", "Any student with a valid college email address can register, browse, and purchase. To sell, you also need to complete a one-time identity verification."],
    ["Is there any fee to sell on CampusMarket?", "Absolutely none. CampusMarket is 100% free for students. There are no listing fees, transaction fees, or commissions. Every rupee you earn goes straight to you."],
    ["How does campus delivery work?", "Sellers and buyers connect within the same campus. After a purchase, the seller and buyer coordinate delivery to a hostel block, department, or campus pickup point. Delivery is always within 24 hours on campus."],
    ["What if I receive a damaged or wrong product?", "We have a peer-review dispute resolution system. Buyers can raise a dispute within 48 hours of delivery. Our campus admin team reviews and mediates."],
    ["Can I sell digital products like notes or music?", "Yes! Digital products (PDF notes, music packs, design assets) are fully supported. Buyers receive a download link instantly after purchase."],
    ["How is payment handled?", "We support UPI, cash on delivery (campus), and campus wallet. Payments are held in escrow and released to the seller after the buyer confirms receipt."],
    ["What types of products are not allowed?", "Anything illegal, prescription medications, exam papers, copyrighted content resold without permission, or items violating campus rules. Violations result in immediate account suspension."],
  ];

  return (
    <div className="page">
      <div className="hiw-page">
        <div className="hiw-hero">
          <h1>How <em>CampusMarket</em> Works</h1>
          <p>A student-first, trust-based marketplace built for your campus. Here's everything you need to know about buying and selling.</p>
        </div>

        <div className="hiw-section">
          <div className="hiw-section-title">🛍️ For Buyers</div>
          <div className="hiw-section-sub">Purchase amazing student creations in 4 simple steps</div>
          <div className="hiw-steps">
            {[
              {icon:"🔐",title:"Verify & Register",desc:"Sign up with your college email. Your campus identity is verified instantly — no long forms, no waiting."},
              {icon:"🔍",title:"Browse & Discover",desc:"Explore 1,200+ products across 9 categories. Use powerful filters to find exactly what you need."},
              {icon:"🛒",title:"Add to Cart & Checkout",desc:"Secure checkout with UPI, cash, or campus wallet. Your college location is pre-filled for fast delivery."},
              {icon:"📦",title:"Campus Delivery",desc:"Receive your order at your hostel within 24 hours. Rate the seller after delivery to help the community."},
            ].map((s,i) => (
              <div key={s.title} className="hiw-step-card buyer">
                <div className="hiw-step-num">{i+1}</div>
                <div className="hiw-step-icon">{s.icon}</div>
                <h3>{s.title}</h3><p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-section">
          <div className="hiw-section-title">💰 For Sellers</div>
          <div className="hiw-section-sub">Turn your skills into income on campus — zero fees, all profit</div>
          <div className="hiw-steps">
            {[
              {icon:"✍️",title:"Create a Listing",desc:"Use our intuitive listing form. Add a title, description, photos (or pick an icon), price, and stock count in under 2 minutes."},
              {icon:"🎯",title:"Reach 5,000+ Students",desc:"Your listing is instantly visible to all verified students on campus. No ads, no algorithms — everyone sees your products."},
              {icon:"💬",title:"Manage Orders",desc:"Get notified on purchase. Chat with buyers, confirm pickup location, and track all orders from your seller dashboard."},
              {icon:"💸",title:"Get Paid Instantly",desc:"Payment is released as soon as the buyer confirms delivery. Zero platform cut, zero hidden charges."},
            ].map((s,i) => (
              <div key={s.title} className="hiw-step-card seller">
                <div className="hiw-step-num">{i+1}</div>
                <div className="hiw-step-icon">{s.icon}</div>
                <h3>{s.title}</h3><p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-section">
          <div className="hiw-section-title">🛡️ Trust & Safety</div>
          <div className="hiw-section-sub">Built with security at every step</div>
          <div className="hiw-trust-grid">
            {[
              {icon:"🏛️",color:"rgba(108,92,231,.15)",title:"Campus-Only Access",desc:"Only students with a verified college email can access the platform. No outsiders, no anonymous users."},
              {icon:"✅",color:"rgba(0,184,148,.15)",title:"Verified Seller Badges",desc:"Sellers who complete identity verification receive a verified badge. Buyers can filter to see only verified sellers."},
              {icon:"💰",color:"rgba(253,203,110,.15)",title:"Escrow Payments",desc:"Funds are held securely until the buyer confirms delivery. Neither party can lose money unfairly."},
              {icon:"⚖️",color:"rgba(253,121,168,.15)",title:"Dispute Resolution",desc:"Raise a dispute within 48 hours of delivery. Campus admins review evidence and mediate fairly."},
              {icon:"🔒",color:"rgba(0,206,201,.15)",title:"Data Privacy",desc:"Your personal data (email, hostel, phone) is never shared with other students. Only the seller gets your pickup location."},
              {icon:"🚨",color:"rgba(231,76,60,.15)",title:"Report System",desc:"See something suspicious? One-click report sends it to campus moderators who review within 2 hours."},
            ].map(c => (
              <div key={c.title} className="trust-card">
                <div className="trust-card-icon" style={{background:c.color}}>{c.icon}</div>
                <div><h3>{c.title}</h3><p>{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-section">
          <div className="hiw-section-title">❓ Frequently Asked Questions</div>
          <div className="hiw-section-sub">Everything you need to know</div>
          <div className="faq-list">
            {faqs.map(([q,a],i) => (
              <div key={i} className="faq-item">
                <button className={`faq-q ${openFaq===i?"open":""}`} onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  {q} <span style={{fontSize:"18px",transition:"transform .3s",transform:openFaq===i?"rotate(180deg)":"rotate(0)"}}><Ic.ChevDown/></span>
                </button>
                {openFaq===i && <div className="faq-a">{a}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-cta-box">
          <h2>Ready to Join Campus<em style={{fontStyle:"normal",color:"var(--accent-light)"}}>Market</em>?</h2>
          <p>Join 340+ student sellers and 5,000+ buyers already thriving on your campus marketplace.</p>
          <div className="cta-btns">
            <button className="btn-hero-primary" onClick={() => onNavigate("shop")}>Start Buying <Ic.Arrow/></button>
            <button className="btn-hero-sec" onClick={() => onNavigate("sell")}>Start Selling 💰</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Profile Page ──
function ProfilePage({ user, cart, wishlist, onNavigate, products }){
  const [tab, setTab] = useState("orders");
  const [settings, setSettings] = useState({ notifications:true, emailAlerts:true, publicProfile:true, showDept:true });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: user.name, bio:"Final year student | Selling handmade crafts and study notes", phone:"", hostel: user.hostel||"Hostel A" });

  const MOCK_ORDERS = [
    { id:"CMO-A4F2B1", title:"Crochet Bucket Hat", seller:"Tanvi R.", price:280, status:"delivered", emoji:"🧶", date:"Feb 20" },
    { id:"CMO-B8D3C2", title:"Resin Bookmarks Set", seller:"Naina C.", price:150, status:"transit", emoji:"🔖", date:"Feb 25" },
    { id:"CMO-C1E9D3", title:"Thermodynamics Notes", seller:"Dev P.", price:80, status:"pending", emoji:"📝", date:"Feb 27" },
  ];
const MY_LISTINGS = products.filter(
  p => p.sellerId === user.name.toLowerCase().replace(/\s/g,"")
);
  const wishlistedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
  const col = sellerColor(user.name);

  const toggleSetting = (k) => setSettings(s => ({...s, [k]:!s[k]}));

  return (
    <div className="page">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-cover-grad"/>
          <div style={{position:"relative"}}>
            <div className="profile-av" style={{background:`linear-gradient(135deg,${col[0]},${col[1]})`}}>{user.avatar}</div>
            <div className="profile-av-edit">✏️</div>
          </div>
          <div className="profile-info">
            <div className="profile-name">{user.name}</div>
            <div className="profile-dept">{user.dept} · {user.hostel || "Hostel A"}</div>
            <div className="profile-badges">
              <span className="pbadge verified"><Ic.Shield/> Verified Student</span>
              <span className="pbadge seller">⭐ Active Seller</span>
              <span className="pbadge rating">4.9 Rating</span>
            </div>
            <div className="profile-meta">
              {[["12","Listings"],["156","Sales"],["₹42K","Earned"],["4.9★","Rating"]].map(([n,l]) => (
                <div key={l} className="pm-item">
                  <div className="pm-num">{n}</div>
                  <div className="pm-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => setEditMode(e=>!e)} style={{padding:"10px 18px",background:"var(--bg4)",border:"1px solid var(--border2)",borderRadius:"10px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font-b)",fontWeight:"600",fontSize:"13px",display:"flex",alignItems:"center",gap:"7px",alignSelf:"flex-start",position:"relative",zIndex:1}}>
            <Ic.Edit/> {editMode?"Cancel":"Edit Profile"}
          </button>
        </div>

        <div className="profile-tabs">
          {[["orders","📦 Orders"],["listings","🏪 My Listings"],["wishlist","💜 Wishlist"],["settings","⚙️ Settings"]].map(([k,label]) => (
            <button key={k} className={`profile-tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{label}</button>
          ))}
        </div>

        <div className="profile-content">
          {/* ORDERS */}
          {tab === "orders" && (
            <div>
              <div className="section-hdr">
                <div className="section-title-lg">Recent Orders</div>
                <span style={{fontSize:"12px",color:"var(--text3)"}}>{MOCK_ORDERS.length} total</span>
              </div>
              {MOCK_ORDERS.map(o => (
                <div key={o.id} className="order-card">
                  <div className="order-emoji" style={{background:"var(--bg4)"}}>{o.emoji}</div>
                  <div className="order-info">
                    <div className="order-title">{o.title}</div>
                    <div className="order-meta">by {o.seller} · {o.date} · Order #{o.id}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:"var(--font-d)",fontWeight:"700",marginBottom:"6px"}}>₹{o.price}</div>
                    <span className={`order-status status-${o.status}`}>{o.status === "delivered" ? "✅ Delivered" : o.status === "transit" ? "🚚 In Transit" : "⏳ Pending"}</span>
                  </div>
                </div>
              ))}
              {MOCK_ORDERS.length === 0 && <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No orders yet</h3><p>Start browsing to make your first purchase</p></div>}
            </div>
          )}

          {/* LISTINGS */}
          {tab === "listings" && (
            <div>
              <div className="section-hdr">
                <div className="section-title-lg">My Listings</div>
                <button className="nav-btn-primary" style={{fontSize:"12px",padding:"8px 16px"}} onClick={() => onNavigate("sell")}>+ New Listing</button>
              </div>
              {MY_LISTINGS.map(p => (
                <div key={p.id} className="listing-mgmt-card">
                  <div style={{fontSize:"28px",width:"48px",height:"48px",background: gradientFor(p.colors),borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{p.image}</div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"600",fontSize:"14px",marginBottom:"3px"}}>{p.title}</div>
                    <div style={{fontSize:"12px",color:"var(--text3)"}}>{p.category} · ₹{p.price} · {p.reviews} views</div>
                  </div>
                  <div style={{textAlign:"right",marginRight:"14px"}}>
                    <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"15px"}}>₹{p.price}</div>
                    <div style={{fontSize:"11px",color:p.stock<=3?"var(--accent2)":"var(--green)",marginTop:"2px"}}>{p.stock >= 999 ? "Digital" : `${p.stock} in stock`}</div>
                  </div>
                  <div className="listing-actions">
                    <button className="btn-sm">Edit</button>
                    <button className="btn-sm danger">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* WISHLIST */}
          {tab === "wishlist" && (
            <div>
              <div className="section-hdr">
                <div className="section-title-lg">Wishlist</div>
                <span style={{fontSize:"12px",color:"var(--text3)"}}>{wishlistedProducts.length} saved</span>
              </div>
              {wishlistedProducts.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">💜</div><h3>Wishlist is empty</h3><p>Tap the heart icon on any product to save it here</p></div>
              ) : (
                <div className="wishlist-grid">
                  {wishlistedProducts.map(p => (
                    <div key={p.id} style={{background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,overflow:"hidden"}}>
                      <div style={{height:"120px",background: gradientFor(p.colors),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"52px"}}>{p.image}</div>
                      <div style={{padding:"12px"}}>
                        <div style={{fontWeight:"600",fontSize:"13px",marginBottom:"4px"}}>{p.title}</div>
                        <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"16px"}}>₹{p.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="profile-grid">
              <div>
                <div className="profile-section">
                  <h3><Ic.Edit/> Profile Information</h3>
                  <div className="edit-field"><label className="form-label">Full Name</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))}/></div>
                  <div className="edit-field"><label className="form-label">Bio</label><textarea className="form-input" rows={3} value={editForm.bio} onChange={e=>setEditForm(f=>({...f,bio:e.target.value}))} style={{resize:"vertical"}}/></div>
                  <div className="form-row">
                    <div className="edit-field" style={{margin:0}}><label className="form-label">Phone</label><input className="form-input" placeholder="+91 xxxxxxxxxx" value={editForm.phone} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))}/></div>
                    <div className="edit-field" style={{margin:0}}><label className="form-label">Hostel</label>
                      <select className="form-select" value={editForm.hostel} onChange={e=>setEditForm(f=>({...f,hostel:e.target.value}))}>
                        {HOSTELS.map(h=><option key={h}>{h}</option>)}
                      </select>
                    </div>
                  </div>
                  <button className="btn-full" style={{marginTop:"16px"}}>Save Changes</button>
                </div>
              </div>
              <div>
                <div className="profile-section">
                  <h3><Ic.Bell/> Notifications</h3>
                  {[["notifications","Push Notifications","Get notified on new orders & messages"],["emailAlerts","Email Alerts","Receive order updates via email"],["publicProfile","Public Profile","Let others see your seller profile"],["showDept","Show Department","Display your dept. on listings"]].map(([k,label,desc]) => (
                    <div key={k} className="toggle-row">
                      <div><div className="toggle-label">{label}</div><div className="toggle-desc">{desc}</div></div>
                      <button className={`toggle ${settings[k]?"on":""}`} onClick={() => toggleSetting(k)}/>
                    </div>
                  ))}
                </div>
                <div className="profile-section" style={{marginTop:"20px"}}>
                  <h3>🔐 Account</h3>
                  <div style={{fontSize:"13px",color:"var(--text3)",marginBottom:"16px"}}>Logged in as <strong style={{color:"var(--text2)"}}>{user.email}</strong></div>
                  <button style={{width:"100%",padding:"12px",background:"rgba(253,121,168,.1)",border:"1px solid rgba(253,121,168,.3)",borderRadius:"10px",color:"var(--accent2)",cursor:"pointer",fontWeight:"700",fontSize:"13px",fontFamily:"var(--font-b)",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px"}}>
                    <Ic.Logout/> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Checkout ──
function CheckoutModal({ cart, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email:"", hostel:"", room:"", phone:"", payment:"upi" });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));

  const placeOrder = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onSuccess(form); }, 1500);
  };

  return (
    <div className="checkout-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={e=>e.stopPropagation()}>
        <div className="m-header" style={{padding:"20px 24px"}}>
          <span style={{fontFamily:"var(--font-d)",fontWeight:"800",fontSize:"17px"}}>🔐 Secure Checkout</span>
          <button className="m-close" onClick={onClose}><Ic.X/></button>
        </div>

        <div className="checkout-progress">
          {[["1","Delivery"],["2","Payment"],["3","Confirm"]].map(([n,l],i) => (
            <div key={n} className="cp-step" style={{flex:1}}>
              <div className={`cp-dot ${step>i+1?"done":step===i+1?"active":""}`}>{step>i+1?"✓":n}</div>
              <span className={`cp-label ${step===i+1?"active":""}`}>{l}</span>
              {i < 2 && <div className="cp-line"/>}
            </div>
          ))}
        </div>

        <div style={{padding:"20px 24px"}}>
          <div className="campus-check-banner">
            <div className="ccb-icon">🏛️</div>
            <div><div className="ccb-title">Campus Verification Active</div><div className="ccb-desc">Only students with a verified college email can complete purchases. All transactions are secured.</div></div>
          </div>

          {step === 1 && (
            <>
              <div className="form-group"><label className="form-label">College Email</label><input className="form-input" type="email" placeholder="yourname@college.edu" value={form.email} onChange={e=>upd("email",e.target.value)}/></div>
              <div className="form-row">
                <div className="form-group" style={{margin:0}}><label className="form-label">Hostel / Building</label><select className="form-select" value={form.hostel} onChange={e=>upd("hostel",e.target.value)}><option value="">Select</option>{HOSTELS.map(h=><option key={h}>{h}</option>)}</select></div>
                <div className="form-group" style={{margin:0}}><label className="form-label">Room / Block</label><input className="form-input" placeholder="Room 204, Block B" value={form.room} onChange={e=>upd("room",e.target.value)}/></div>
              </div>
              <div className="form-group"><label className="form-label">Phone (optional)</label><input className="form-input" placeholder="+91 xxxxxxxxxx" value={form.phone} onChange={e=>upd("phone",e.target.value)}/></div>
              <button className="btn-full" onClick={() => setStep(2)} disabled={!form.email || !form.hostel}>Next: Payment <Ic.Arrow/></button>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"15px",marginBottom:"14px"}}>Choose Payment</div>
              <div className="payment-opts">
                {[["upi","⚡","UPI / GPay"],["cash","💵","Cash on Delivery"],["wallet","🏦","Campus Wallet"]].map(([k,icon,label]) => (
                  <div key={k} className={`pay-opt ${form.payment===k?"selected":""}`} onClick={() => upd("payment",k)}>
                    <div className="pay-opt-icon">{icon}</div>
                    <div className="pay-opt-label">{label}</div>
                  </div>
                ))}
              </div>
              {form.payment === "upi" && <div className="form-group"><label className="form-label">UPI ID</label><input className="form-input" placeholder="yourname@upi"/></div>}
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={() => setStep(1)} style={{flex:"0 0 auto",padding:"13px 20px",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"12px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font-b)",fontWeight:"600",fontSize:"14px"}}>← Back</button>
                <button className="btn-full" style={{marginTop:0}} onClick={() => setStep(3)}>Review Order <Ic.Arrow/></button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"15px",marginBottom:"14px"}}>Order Summary</div>
              <div className="order-summary-mini">
                {cart.map(i=>(
                  <div key={i.id} className="osm-item">
                    <span>{i.image} {i.title} × {i.qty}</span>
                    <span>₹{(i.price*i.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div className="osm-item"><span>Campus Delivery</span><span style={{color:"var(--green)"}}>FREE 🎉</span></div>
                <div className="osm-total"><span>Total</span><span style={{color:"var(--accent-light)"}}>₹{total.toLocaleString()}</span></div>
              </div>
              <div style={{background:"var(--bg3)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px",marginBottom:"20px",fontSize:"13px"}}>
                <div style={{color:"var(--text3)",marginBottom:"4px"}}>Delivering to</div>
                <div style={{fontWeight:"600"}}>{form.hostel} {form.room && `· ${form.room}`}</div>
                <div style={{color:"var(--text3)",marginTop:"4px"}}>Payment: {form.payment.toUpperCase()}</div>
              </div>
              <div style={{display:"flex",gap:"10px"}}>
                <button onClick={() => setStep(2)} style={{flex:"0 0 auto",padding:"13px 20px",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"12px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font-b)",fontWeight:"600",fontSize:"14px"}}>← Back</button>
                <button className="btn-full" style={{marginTop:0,background:"linear-gradient(135deg,var(--accent2),#ff6b35)",boxShadow:"0 6px 22px rgba(253,121,168,.3)"}} onClick={placeOrder} disabled={loading}>
                  {loading ? <span style={{display:"flex",alignItems:"center",gap:"8px"}}><span style={{width:"16px",height:"16px",border:"2px solid rgba(255,255,255,.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>Placing Order...</span> : `🎓 Place Order · ₹${total.toLocaleString()}`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ROOT APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [products, setProducts] = useState(PRODUCTS);
  const [dbReady, setDbReady] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("shop");
  const [cart, setCart] = useState([]);

  // ── Load products from Supabase on mount ──
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        // Parse JSON fields stored as text
        const parsed = data.map(p => ({
          ...p,
          colors: typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors,
          tags: typeof p.tags === "string" ? JSON.parse(p.tags) : p.tags,
        }));
        setProducts(parsed);
      }
      setDbReady(true);
    }
    loadProducts();
  }, []);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, icon="✅") => {
    setToast({msg,icon});
    setTimeout(() => setToast(null), 2800);
  };

  const addProduct = async (product) => {
    setProducts(prev => [product, ...prev]);
    showToast("Product published successfully 🚀", "📦");
    console.log("📦 Saving to Supabase:", product.title);
    const { data, error } = await supabase.from("products").insert([{
      title: product.title,
      seller: product.seller,
      seller_id: product.sellerId,
      avatar: product.avatar,
      dept: product.dept,
      price: product.price,
      original_price: product.originalPrice,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      verified: product.verified,
      image: product.image,
      colors: JSON.stringify(product.colors),
      description: product.description,
      tags: JSON.stringify(product.tags),
      stock: product.stock,
      delivery: product.delivery,
      location: product.location,
    }]).select();
    if (error) {
      console.error("❌ Supabase error:", error.message, error.details, error.hint);
      alert("DB Error: " + error.message);
    } else {
      console.log("✅ Saved to Supabase!", data);
    }
  };

  const addToCart = (product, e) => {
    if (e) e.stopPropagation();
    setCart(c => {
      const ex = c.find(i=>i.id===product.id);
      if(ex) return c.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i);
      return [...c,{...product,qty:1}];
    });
    showToast(`${product.title} added to cart`, "🛒");
  };

  const removeFromCart = (id) => setCart(c=>c.filter(i=>i.id!==id));
  const updateQty = (id, d) => setCart(c=>{
    const item = c.find(i=>i.id===id);
    if(item && item.qty+d<=0) return c.filter(i=>i.id!==id);
    return c.map(i=>i.id===id?{...i,qty:i.qty+d}:i);
  });

  const toggleWishlist = (id) => {
    setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w,id]);
    const p = PRODUCTS.find(p=>p.id===id);
    showToast(wishlist.includes(id)?"Removed from wishlist":`${p?.title} wishlisted`, "💜");
  };

  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  const handleSuccess = async (checkoutForm) => {
    const id = "CMO-"+Date.now().toString(36).toUpperCase();
    setOrderId(id);
    setCheckoutOpen(false);
    setOrderSuccess(true);
    setCart([]);

    // Save order to Supabase
    const { error } = await supabase.from("orders").insert([{
      order_id: id,
      buyer_name: user.name,
      buyer_email: user.email,
      hostel: checkoutForm?.hostel || "",
      room: checkoutForm?.room || "",
      payment_method: checkoutForm?.payment || "upi",
      items: JSON.stringify(cart.map(i => ({ id: i.id, title: i.title, price: i.price, qty: i.qty }))),
      total: cart.reduce((s,i) => s + i.price * i.qty, 0),
    }]);
    if (error) console.error("Supabase save order error:", error.message);
  };

  if (!user) return (
    <>
      <style>{STYLES}</style>
      <div className="app-root">
        <AuthPage onLogin={setUser}/>
      </div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-root">

        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("shop")}>
            <div className="nav-logo-icon">🏛️</div>
            Campus<em>Market</em>
          </div>
          <div className="nav-search">
            <span className="nav-search-icon"><Ic.Search/></span>
            <input placeholder="Search products, creators..."/>
          </div>
          <div className="nav-spacer"/>
          <div className="nav-links">
            {[["shop","🛍️ Shop"],["sell","💰 Sell"],["hiw","❓ How it Works"]].map(([k,label]) => (
              <button key={k} className={`nav-link ${page===k?"active":""}`} onClick={() => setPage(k)}>{label}</button>
            ))}
          </div>
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            <Ic.Cart/>
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <div className="nav-avatar" style={{background:`linear-gradient(135deg,${sellerColor(user.name)[0]},${sellerColor(user.name)[1]})`}}
            onClick={() => setPage("profile")} title="Profile">
            {user.avatar}
          </div>
        </nav>

        {/* PAGES */}
        {page === "shop" && <HomePage
  user={user}
  products={products}
  cart={cart}
  onAdd={addToCart}
  wishlist={wishlist}
  onWish={toggleWishlist}
/>}
        {page === "sell" && (
  <SellPage
    user={user}
    onNavigate={setPage}
    onAddProduct={addProduct}
  />
)}
        {page === "hiw" && <HowItWorksPage onNavigate={setPage}/>}
        {page === "profile" && <ProfilePage
  user={user}
  cart={cart}
  wishlist={wishlist}
  onNavigate={setPage}
  products={products}
/>}

        {/* CART PANEL */}
        {cartOpen && (
          <div className="cart-overlay" onClick={() => setCartOpen(false)}>
            <div className="cart-panel" onClick={e=>e.stopPropagation()}>
              <div className="cart-hdr">
                <h2>🛒 Cart <span style={{fontWeight:400,fontSize:"14px",color:"var(--text3)"}}>({cartCount})</span></h2>
                <button className="m-close" onClick={() => setCartOpen(false)}><Ic.X/></button>
              </div>
              <div className="cart-items">
                {cart.length === 0 ? (
                  <div className="cart-empty">
                    <div className="cart-empty-icon">🛍️</div>
                    <div style={{fontFamily:"var(--font-d)",fontWeight:"700",fontSize:"17px",color:"var(--text2)"}}>Your cart is empty</div>
                    <p style={{fontSize:"13px"}}>Add amazing student creations!</p>
                    <button className="nav-btn-primary" style={{marginTop:"8px"}} onClick={() => { setCartOpen(false); setPage("shop"); }}>Browse Products</button>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} className="ci">
                    <div className="ci-emoji" style={{background: gradientFor(item.colors)}}>{item.image}</div>
                    <div className="ci-info">
                      <div className="ci-title">{item.title}</div>
                      <div className="ci-seller">{item.seller}</div>
                      <div className="ci-row">
                        <div className="ci-price">₹{(item.price*item.qty).toLocaleString()}</div>
                        <div className="qty-ctrl">
                          <button className="qty-b" onClick={() => updateQty(item.id,-1)}><Ic.Minus/></button>
                          <span className="qty-n">{item.qty}</span>
                          <button className="qty-b" onClick={() => updateQty(item.id,1)}><Ic.Plus/></button>
                        </div>
                      </div>
                    </div>
                    <button className="ci-remove" onClick={() => removeFromCart(item.id)}>✕</button>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="cart-ftr">
                  <div className="cart-row"><span>Subtotal ({cartCount} items)</span><span>₹{cartTotal.toLocaleString()}</span></div>
                  <div className="cart-row"><span>Campus Delivery</span><span style={{color:"var(--green)"}}>Free 🎉</span></div>
                  <div className="cart-total-row">
                    <span className="cart-total-label">Total</span>
                    <span className="cart-total-amt">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button className="btn-checkout" onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>
                    Secure Checkout <Ic.Arrow/>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHECKOUT */}
        {checkoutOpen && <CheckoutModal cart={cart} onClose={() => setCheckoutOpen(false)} onSuccess={handleSuccess}/>}

        {/* ORDER SUCCESS */}
        {orderSuccess && (
          <div className="checkout-overlay" onClick={() => setOrderSuccess(false)}>
            <div className="checkout-modal" onClick={e=>e.stopPropagation()}>
              <div className="m-header"><span style={{fontFamily:"var(--font-d)",fontWeight:"800",fontSize:"17px"}}>Order Confirmation</span><button className="m-close" onClick={() => setOrderSuccess(false)}><Ic.X/></button></div>
              <div className="success-page">
                <div className="success-icon">🎉</div>
                <h2>Order Placed!</h2>
                <p>Your order is confirmed. The student seller has been notified and will deliver to your campus location within 24 hours.</p>
                <div className="order-id-box">{orderId}</div>
                <div style={{display:"flex",gap:"12px",justifyContent:"center",flexWrap:"wrap"}}>
                  <button className="nav-btn-primary" onClick={() => { setOrderSuccess(false); setPage("profile"); }}>View Orders</button>
                  <button onClick={() => setOrderSuccess(false)} style={{padding:"11px 24px",background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:"40px",color:"var(--text2)",cursor:"pointer",fontFamily:"var(--font-b)",fontWeight:"600",fontSize:"13px"}}>Keep Shopping</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast-wrap">
            <div className="toast"><span style={{fontSize:"16px"}}>{toast.icon}</span>{toast.msg}</div>
          </div>
        )}

      </div>
    </>
  );
}
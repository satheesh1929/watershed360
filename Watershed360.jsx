import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, MapPinned, Camera, Wrench, ShieldAlert, Database,
  Search, ChevronRight, Check, X, Droplets, Leaf, Info, Satellite,
  ClipboardCheck, TriangleAlert, ChevronDown, Layers, SlidersHorizontal
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from "recharts";

/* ============================== DEMO DATA ==============================
   Everything below is DEMONSTRATION DATA for a fictional demo watershed.
   No live satellite, government, or field data is represented.
========================================================================= */

const WATERSHED = {
  name: "Mula-Pravara Micro-Watershed",
  code: "4E2B5c",
  district: "Ahmednagar",
  state: "Maharashtra",
  area_ha: 1240,
  classification: "Drought-prone \u2014 Priority Class II",
};

const KPIS = [
  { label: "Area managed", value: "1,240", unit: "ha" },
  { label: "Active interventions", value: "14", unit: "" },
  { label: "Verified field evidence", value: "37", unit: "/ 52" },
  { label: "Water storage index", value: "0.68", unit: "" },
  { label: "NDVI seasonal delta", value: "+0.14", unit: "'21\u2192'25" },
];

const NDVI_TREND = [
  { year: "2021", ndvi: 0.31 },
  { year: "2022", ndvi: 0.33 },
  { year: "2023", ndvi: 0.36 },
  { year: "2024", ndvi: 0.41 },
  { year: "2025", ndvi: 0.45 },
  { year: "2026", ndvi: 0.46 },
];

const INTERVENTIONS = [
  { id: "CD-01", name: "Wadgaon Check Dam", type: "Masonry Check Dam", status: "Intact", built: 2022, x: 310, y: 190, lat: 19.372, lon: 74.548, catchment: 62, storage: "1.8 Mm\u00B3", notes: "Full retention observed through 2025 monsoon." },
  { id: "CD-02", name: "Kolhewadi Check Dam", type: "Masonry Check Dam", status: "Silted", built: 2021, x: 420, y: 260, lat: 19.361, lon: 74.561, catchment: 48, storage: "1.1 Mm\u00B3", notes: "~40% siltation reduces effective storage; desilting recommended." },
  { id: "FP-04", name: "Shendi Farm Pond", type: "Farm Pond", status: "Fully Retained", built: 2023, x: 520, y: 330, lat: 19.349, lon: 74.579, catchment: 9, storage: "0.02 Mm\u00B3", notes: "Consistent retention across two dry seasons." },
  { id: "CCT-07", name: "Devgaon Contour Trenches", type: "Continuous Contour Trench", status: "Intact", built: 2022, x: 230, y: 330, lat: 19.352, lon: 74.531, catchment: 21, storage: "\u2014", notes: "Reduced visible runoff scarring vs 2021 baseline." },
  { id: "GB-02", name: "Nimon Gabion Structure", type: "Gabion Structure", status: "Minor Damage", built: 2021, x: 480, y: 190, lat: 19.378, lon: 74.571, catchment: 15, storage: "\u2014", notes: "Partial wire-mesh degradation on left abutment." },
  { id: "EB-05", name: "Rajur Earthen Bund", type: "Earthen Bund", status: "Dry", built: 2023, x: 610, y: 250, lat: 19.363, lon: 74.593, catchment: 11, storage: "0.01 Mm\u00B3", notes: "No standing water at time of last field visit." },
  { id: "AF-01", name: "Pravara Ridge Afforestation", type: "Afforestation Block", status: "Intact", built: 2024, x: 360, y: 120, lat: 19.389, lon: 74.552, catchment: "\u2014", storage: "\u2014", notes: "Canopy establishment consistent with NDVI uplift in this cell." },
  { id: "PT-03", name: "Loni Percolation Tank", type: "Percolation Tank", status: "Intact", built: 2022, x: 570, y: 400, lat: 19.338, lon: 74.585, catchment: 34, storage: "0.6 Mm\u00B3", notes: "Groundwater recharge trend positive per nearby well logs." },
];

const STATUS_COLOR = {
  "Intact": "#5FC7BD",
  "Fully Retained": "#5FC7BD",
  "Silted": "#D8A44A",
  "Minor Damage": "#D8A44A",
  "Dry": "#C2694A",
};

const EVIDENCE = [
  { id: "EV-114", interventionId: "CD-01", date: "2025-09-02", observer: "S. Kadam (Field Surveyor)", lat: 19.372, lon: 74.548, azimuth: "142\u00B0", altitude: "612 m", camera: "Redmi Note 12, geotag on", ai: "Masonry check dam, water at spillway crest", confidence: 91, verified: true },
  { id: "EV-098", interventionId: "CD-02", date: "2025-08-14", observer: "R. Pawar (Field Surveyor)", lat: 19.361, lon: 74.561, azimuth: "078\u00B0", altitude: "598 m", camera: "iPhone 12, geotag on", ai: "Siltation along upstream face, ~40% capacity loss", confidence: 84, verified: true },
  { id: "EV-121", interventionId: "GB-02", date: "2025-09-10", observer: "S. Kadam (Field Surveyor)", lat: 19.378, lon: 74.571, azimuth: "205\u00B0", altitude: "634 m", camera: "Redmi Note 12, geotag on", ai: "Possible gabion mesh degradation, left abutment", confidence: 76, verified: false },
  { id: "EV-076", interventionId: "AF-01", date: "2025-07-29", observer: "Volunteer submission", lat: 19.389, lon: 74.552, azimuth: "310\u00B0", altitude: "701 m", camera: "Unknown \u2014 no EXIF camera tag", ai: "Dense sapling cover, low bare-soil fraction", confidence: 88, verified: true },
  { id: "EV-133", interventionId: "EB-05", date: "2025-09-05", observer: "R. Pawar (Field Surveyor)", lat: 19.363, lon: 74.593, azimuth: "096\u00B0", altitude: "589 m", camera: "Redmi Note 12, geotag on", ai: "No standing water detected at bund", confidence: 93, verified: true },
];

const PRIORITY_ZONES = [
  {
    id: "PZ-14", name: "Kolhewadi Sub-basin", severity: "High",
    reasons: ["Vegetation decline in 2 of last 3 NDVI cycles", "Check dam CD-02 at ~40% siltation, reducing retention", "Steeper mean slope (9\u201314%) increases runoff risk", "No new conservation structure since 2021"],
    action: "Field verification recommended \u2014 prioritize desilting assessment.",
  },
  {
    id: "PZ-09", name: "Nimon Ridge Cell", severity: "Moderate",
    reasons: ["Gabion structure GB-02 flagged with minor damage (unverified)", "Moderate historical water-availability variability", "Adjacent to 2nd-order drainage with seasonal high flow"],
    action: "Field verification recommended for structural integrity.",
  },
  {
    id: "PZ-22", name: "Rajur Lower Catchment", severity: "Moderate",
    reasons: ["Earthen bund EB-05 recorded dry across last 2 visits", "Sparse conservation structure density downstream", "Land-use layer indicates increasing bare-soil fraction"],
    action: "Suggested for inclusion in next field survey cycle.",
  },
];

const DATA_SOURCES = [
  { name: "SRISHTI-DRISHTI (30 m)", role: "Primary satellite provider", status: "PENDING CREDENTIALS" },
  { name: "Copernicus Sentinel-2", role: "Secondary / open imagery, NDVI & NDWI", status: "CONFIGURED" },
  { name: "Google Earth Engine", role: "Fallback compute & archive access", status: "AVAILABLE" },
  { name: "Microsoft Planetary Computer", role: "DEM, Landsat, Global Surface Water", status: "AVAILABLE" },
  { name: "OpenStreetMap / Overpass", role: "Roads, settlements, waterways context", status: "CONNECTED" },
  { name: "HydroSHEDS / OpenTopography", role: "Terrain & drainage derivation", status: "DEMO" },
];

const SOURCE_STATUS_COLOR = {
  CONNECTED: "#5FC7BD",
  CONFIGURED: "#5FC7BD",
  AVAILABLE: "#93A1AE",
  DEMO: "#D8A44A",
  "PENDING CREDENTIALS": "#C2694A",
};

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "explorer", label: "Watershed Explorer", icon: MapPinned },
  { key: "analysis", label: "Change Analysis", icon: Satellite },
  { key: "evidence", label: "Field Evidence", icon: Camera },
  { key: "interventions", label: "Interventions", icon: Wrench },
  { key: "priority", label: "Priority Zones", icon: ShieldAlert },
  { key: "sources", label: "Data Sources", icon: Database },
];

/* ============================== SHARED UI ============================== */

function DemoBadge({ compact }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: 0.4,
      color: "#D8A44A", border: "1px solid #4a3d24", background: "#241d10",
      padding: compact ? "2px 7px" : "4px 10px", borderRadius: 3,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#D8A44A" }} />
      DEMO MODE
    </span>
  );
}

function StatusPill({ status }) {
  const color = STATUS_COLOR[status] || "#93A1AE";
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, color,
      border: `1px solid ${color}55`, background: `${color}18`,
      padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap",
    }}>{status}</span>
  );
}

function Panel({ title, right, children, style }) {
  return (
    <div style={{ border: "1px solid #2A323D", background: "#171D25", ...style }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderBottom: "1px solid #2A323D",
        }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#93A1AE", letterSpacing: 0.3 }}>{title}</span>
          {right}
        </div>
      )}
      <div style={{ padding: 14 }}>{children}</div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function Dashboard({ goExplorer, goAnalysis }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>{WATERSHED.name}</div>
          <div style={{ fontSize: 13, color: "#93A1AE", marginTop: 3, fontFamily: "'IBM Plex Mono', monospace" }}>
            {WATERSHED.code} \u00B7 {WATERSHED.district}, {WATERSHED.state} \u00B7 {WATERSHED.classification}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={goExplorer} style={btnPrimary}>Open Watershed Explorer <ChevronRight size={14} /></button>
          <button onClick={goAnalysis} style={btnGhost}>Change Analysis</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {KPIS.map((k) => (
          <Panel key={k.label} style={{ padding: 0 }}>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 11.5, color: "#93A1AE", marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 24, fontWeight: 600 }}>
                {k.value} <span style={{ fontSize: 12, color: "#93A1AE" }}>{k.unit}</span>
              </div>
            </div>
          </Panel>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <Panel title="NDVI seasonal trend" right={<DemoBadge compact />}>
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={NDVI_TREND}>
                <CartesianGrid stroke="#2A323D" vertical={false} />
                <XAxis dataKey="year" stroke="#93A1AE" fontSize={11} tickLine={false} axisLine={{ stroke: "#2A323D" }} />
                <YAxis stroke="#93A1AE" fontSize={11} tickLine={false} axisLine={{ stroke: "#2A323D" }} domain={[0.2, 0.5]} />
                <Tooltip contentStyle={{ background: "#1D2530", border: "1px solid #2A323D", fontSize: 12 }} />
                <ReferenceLine x="2022" stroke="#2A323D" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="ndvi" stroke="#93A35B" strokeWidth={2} dot={{ r: 3, fill: "#93A35B" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Priority action alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {PRIORITY_ZONES.slice(0, 2).map((z) => (
              <div key={z.id} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <TriangleAlert size={15} style={{ color: z.severity === "High" ? "#C2694A" : "#D8A44A", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13 }}>{z.name}</div>
                  <div style={{ fontSize: 11.5, color: "#93A1AE" }}>{z.reasons[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Recent field evidence">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {EVIDENCE.slice(0, 4).map((e, i) => (
            <div key={e.id} style={{
              display: "grid", gridTemplateColumns: "70px 1fr auto auto", gap: 12, alignItems: "center",
              padding: "10px 0", borderTop: i > 0 ? "1px solid #2A323D" : "none",
            }}>
              <div style={{
                width: 56, height: 42, background: "#232B36", border: "1px solid #2A323D",
                display: "flex", alignItems: "center", justifyContent: "center", color: "#3d4753",
              }}><Camera size={16} /></div>
              <div>
                <div style={{ fontSize: 13 }}>{e.ai}</div>
                <div style={{ fontSize: 11, color: "#93A1AE", fontFamily: "'IBM Plex Mono', monospace" }}>{e.id} \u00B7 {e.date} \u00B7 near {e.interventionId}</div>
              </div>
              <span style={{ fontSize: 11.5, color: "#5FC7BD" }}>{e.confidence}% conf.</span>
              {e.verified ? <StatusPill status="Intact" /> : <span style={{ fontSize: 11, color: "#D8A44A" }}>Awaiting review</span>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ============================== EXPLORER (MAP) ============================== */

const STREAMS = [
  "M 200 60 L 250 140 L 310 190",
  "M 500 60 L 480 130 L 480 190",
  "M 310 190 L 360 260 L 420 260",
  "M 480 190 L 420 260",
  "M 420 260 L 470 330 L 520 330",
  "M 420 260 L 380 330 L 230 330",
  "M 520 330 L 560 400 L 570 400",
  "M 230 330 L 260 400 L 300 440",
  "M 570 400 L 610 250",
];

const BOUNDARY = "M 150 90 L 540 50 L 660 200 L 640 420 L 480 470 L 260 460 L 160 350 L 190 220 Z";

function WatershedMap({ layers, year, selected, onSelect }) {
  const visibleInterventions = INTERVENTIONS.filter((iv) => iv.built <= parseInt(year, 10));
  return (
    <svg viewBox="0 0 800 560" style={{ width: "100%", height: "100%", background: "#0D1319" }}>
      <defs>
        <pattern id="veg" width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="#141c1a" />
          <circle cx="4" cy="4" r="1.2" fill="#3f5236" />
          <circle cx="10" cy="9" r="1.2" fill="#3f5236" />
        </pattern>
      </defs>

      {layers.boundary && (
        <path d={BOUNDARY} fill="url(#veg)" stroke="#3a4552" strokeWidth="1.5" strokeDasharray="4 3" />
      )}

      {layers.drainage && STREAMS.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#4F89B8" strokeWidth={i < 2 ? 2.4 : 1.4} opacity={0.85} strokeLinecap="round" />
      ))}

      {layers.interventions && visibleInterventions.map((iv) => {
        const isSel = selected?.id === iv.id;
        return (
          <g key={iv.id} onClick={() => onSelect(iv)} style={{ cursor: "pointer" }}>
            <circle cx={iv.x} cy={iv.y} r={isSel ? 10 : 7} fill="#10151B" stroke={STATUS_COLOR[iv.status]} strokeWidth={2.2} />
            <circle cx={iv.x} cy={iv.y} r={2.4} fill={STATUS_COLOR[iv.status]} />
            {isSel && <circle cx={iv.x} cy={iv.y} r={16} fill="none" stroke={STATUS_COLOR[iv.status]} strokeWidth={1} opacity={0.5} />}
          </g>
        );
      })}

      {layers.evidence && EVIDENCE.map((e) => {
        const iv = INTERVENTIONS.find((i) => i.id === e.interventionId);
        if (!iv) return null;
        return (
          <rect key={e.id} x={iv.x - 14} y={iv.y - 22} width={8} height={8} fill="#5FC7BD" opacity={0.9}
            transform={`rotate(45 ${iv.x - 10} ${iv.y - 18})`} />
        );
      })}
    </svg>
  );
}

function Explorer() {
  const [layers, setLayers] = useState({ boundary: true, drainage: true, interventions: true, evidence: true });
  const [year, setYear] = useState("2025");
  const [selected, setSelected] = useState(null);
  const [confirmState, setConfirmState] = useState({});

  const toggleLayer = (k) => setLayers((l) => ({ ...l, [k]: !l[k] }));

  const layerDefs = [
    { key: "boundary", label: "Watershed boundary" },
    { key: "drainage", label: "Drainage network" },
    { key: "interventions", label: "Interventions" },
    { key: "evidence", label: "Field evidence tags" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 300px", gap: 12, height: "calc(100vh - 150px)", minHeight: 520 }}>
      {/* LEFT: layers */}
      <Panel title="Layers" style={{ overflowY: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {layerDefs.map((l) => (
            <label key={l.key} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, cursor: "pointer" }}>
              <input type="checkbox" checked={layers[l.key]} onChange={() => toggleLayer(l.key)} style={{ accentColor: "#5FC7BD" }} />
              {l.label}
            </label>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid #2A323D" }}>
          <div style={{ fontSize: 11.5, color: "#93A1AE", marginBottom: 8 }}>Legend</div>
          {Object.entries(STATUS_COLOR).filter((v, i, arr) => arr.findIndex(([k]) => k === v[0]) === i).map(([k, c]) => (
            <div key={k} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }} />
              {k}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, fontSize: 11, color: "#5b6572", lineHeight: 1.5 }}>
          Stylized cartographic rendering for this preview. Production build renders live tiles (ESRI / OSM / Carto) via MapLibre GL.
        </div>
      </Panel>

      {/* CENTER: map + time slider */}
      <div style={{ display: "flex", flexDirection: "column", border: "1px solid #2A323D", background: "#171D25" }}>
        <div style={{ padding: "8px 14px", borderBottom: "1px solid #2A323D", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12.5, color: "#93A1AE", display: "flex", alignItems: "center", gap: 6 }}>
            <Layers size={13} /> {WATERSHED.name} \u00B7 {WATERSHED.area_ha} ha
          </span>
          <DemoBadge compact />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <WatershedMap layers={layers} year={year} selected={selected} onSelect={setSelected} />
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #2A323D", display: "flex", alignItems: "center", gap: 14 }}>
          <SlidersHorizontal size={14} style={{ color: "#93A1AE" }} />
          <span style={{ fontSize: 11.5, color: "#93A1AE", fontFamily: "'IBM Plex Mono', monospace" }}>TEMPORAL VIEW</span>
          <input type="range" min="2021" max="2025" step="2" value={year}
            onChange={(e) => setYear(e.target.value)} style={{ flex: 1, accentColor: "#5FC7BD" }} />
          {["2021", "2023", "2025"].map((y) => (
            <span key={y} style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
              color: year === y ? "#5FC7BD" : "#5b6572",
            }}>{y}</span>
          ))}
        </div>
      </div>

      {/* RIGHT: intelligence drawer */}
      <Panel title="Feature intelligence" style={{ overflowY: "auto" }}>
        {!selected && (
          <div style={{ fontSize: 12.5, color: "#5b6572", display: "flex", gap: 8, alignItems: "flex-start" }}>
            <Info size={14} style={{ marginTop: 1, flexShrink: 0 }} />
            Click a marker on the map to inspect an intervention.
          </div>
        )}
        {selected && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{selected.name}</div>
              <div style={{ fontSize: 11.5, color: "#93A1AE", fontFamily: "'IBM Plex Mono', monospace" }}>{selected.id} \u00B7 {selected.type}</div>
            </div>
            <StatusPill status={selected.status} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
              <Meta label="Built" value={selected.built} />
              <Meta label="Catchment" value={typeof selected.catchment === "number" ? `${selected.catchment} ha` : selected.catchment} />
              <Meta label="Storage" value={selected.storage} />
              <Meta label="Coordinates" value={`${selected.lat}, ${selected.lon}`} mono />
            </div>
            <div style={{ fontSize: 12.5, color: "#c3ccd3", lineHeight: 1.5 }}>{selected.notes}</div>

            <div style={{ borderTop: "1px solid #2A323D", paddingTop: 10 }}>
              <div style={{ fontSize: 11.5, color: "#93A1AE", marginBottom: 6 }}>AI field-image interpretation</div>
              {(() => {
                const ev = EVIDENCE.find((e) => e.interventionId === selected.id);
                if (!ev) return <div style={{ fontSize: 12, color: "#5b6572" }}>No linked field evidence yet.</div>;
                const state = confirmState[ev.id];
                return (
                  <div>
                    <div style={{ fontSize: 12.5 }}>{ev.ai}</div>
                    <div style={{ fontSize: 11.5, color: "#5FC7BD", marginTop: 3 }}>{ev.confidence}% confidence \u00B7 model v0.9-demo</div>
                    {!state && (
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <button onClick={() => setConfirmState((s) => ({ ...s, [ev.id]: "confirmed" }))} style={btnTiny}><Check size={12} /> Confirm</button>
                        <button onClick={() => setConfirmState((s) => ({ ...s, [ev.id]: "rejected" }))} style={btnTinyGhost}><X size={12} /> Reject</button>
                      </div>
                    )}
                    {state && (
                      <div style={{ fontSize: 11.5, marginTop: 8, color: state === "confirmed" ? "#5FC7BD" : "#C2694A" }}>
                        {state === "confirmed" ? "Confirmed by reviewer" : "Rejected by reviewer"} \u00B7 not overwritten
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

function Meta({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: "#5b6572" }}>{label}</div>
      <div style={{ fontFamily: mono ? "'IBM Plex Mono', monospace" : "inherit", fontSize: 12.5 }}>{value}</div>
    </div>
  );
}

/* ============================== ANALYSIS (BEFORE/AFTER) ============================== */

function Analysis() {
  const [pos, setPos] = useState(52);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Vegetation change \u2014 2021 vs 2025</div>
        <DemoBadge />
      </div>

      <Panel title="Before / after (NDVI-derived) \u2014 drag divider">
        <div
          style={{ position: "relative", width: "100%", height: 300, overflow: "hidden", cursor: "ew-resize", border: "1px solid #2A323D" }}
          onMouseMove={(e) => {
            if (e.buttons !== 1) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = ((e.clientX - rect.left) / rect.width) * 100;
            setPos(Math.min(100, Math.max(0, pct)));
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2b2116, #1a2a17 55%, #16241a)" }}>
            <Watermark text="2021 \u00B7 PRE-INTERVENTION (DEMO)" />
          </div>
          <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${pos}%)`, background: "linear-gradient(135deg, #16241a, #1c3623 55%, #1f4227)" }}>
            <Watermark text="2025 \u00B7 POST-MONSOON (DEMO)" />
          </div>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: "#E6EBEF" }} />
          <div style={{
            position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%,-50%)",
            width: 28, height: 28, borderRadius: "50%", background: "#171D25", border: "1px solid #E6EBEF",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#E6EBEF",
          }}>\u2194</div>
        </div>
      </Panel>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <StatCard icon={<Leaf size={16} />} label="Vegetation cover change" value="+18.4%" tone="#93A35B" />
        <StatCard icon={<Droplets size={16} />} label="Surface water expansion" value="+34.2 ha" tone="#4F89B8" />
        <StatCard icon={<ClipboardCheck size={16} />} label="Soil moisture retention index" value="+0.11" tone="#5FC7BD" />
      </div>

      <Panel title="Analysis parameters">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, fontSize: 12 }}>
          <Meta label="Dataset" value="Sentinel-2, NDVI" />
          <Meta label="Date range" value="2021-06 \u2192 2025-10" mono />
          <Meta label="Resolution" value="10 m (demo)" />
          <Meta label="Confidence" value="Illustrative \u2014 not field-verified" />
        </div>
      </Panel>
    </div>
  );
}

function Watermark({ text }) {
  return (
    <div style={{
      position: "absolute", bottom: 10, left: 12, fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11, color: "#c3ccd3aa", letterSpacing: 0.3,
    }}>{text}</div>
  );
}

function StatCard({ icon, label, value, tone }) {
  return (
    <Panel style={{ padding: 0 }}>
      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: tone, display: "flex", alignItems: "center", gap: 6, fontSize: 11.5 }}>{icon} {label}</div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 22, fontWeight: 600 }}>{value}</div>
      </div>
    </Panel>
  );
}

/* ============================== FIELD EVIDENCE ============================== */

function EvidenceView() {
  const [openId, setOpenId] = useState(EVIDENCE[0].id);
  const open = EVIDENCE.find((e) => e.id === openId);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, alignContent: "start" }}>
        {EVIDENCE.map((e) => (
          <div key={e.id} onClick={() => setOpenId(e.id)} style={{
            border: `1px solid ${openId === e.id ? "#5FC7BD" : "#2A323D"}`, background: "#171D25", cursor: "pointer",
          }}>
            <div style={{ height: 110, background: "#232B36", display: "flex", alignItems: "center", justifyContent: "center", color: "#3d4753" }}>
              <Camera size={22} />
            </div>
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 12.5 }}>{e.ai}</div>
              <div style={{ fontSize: 10.5, color: "#93A1AE", marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>{e.id} \u00B7 {e.date}</div>
            </div>
          </div>
        ))}
      </div>

      <Panel title="EXIF / evidence record">
        {open && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
            <Meta label="Evidence ID" value={open.id} mono />
            <Meta label="Observer" value={open.observer} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Meta label="Latitude / Longitude" value={`${open.lat}, ${open.lon}`} mono />
              <Meta label="Date" value={open.date} mono />
              <Meta label="Azimuth" value={open.azimuth} mono />
              <Meta label="Altitude" value={open.altitude} mono />
            </div>
            <Meta label="Camera" value={open.camera} />
            <div style={{ borderTop: "1px solid #2A323D", paddingTop: 10 }}>
              <div style={{ fontSize: 11.5, color: "#93A1AE", marginBottom: 4 }}>AI observation</div>
              <div>{open.ai}</div>
              <div style={{ color: "#5FC7BD", fontSize: 11.5, marginTop: 3 }}>{open.confidence}% confidence</div>
              <div style={{ fontSize: 11, color: open.verified ? "#5FC7BD" : "#D8A44A", marginTop: 6 }}>
                {open.verified ? "Verified by field officer" : "Requires field verification"}
              </div>
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ============================== INTERVENTIONS TABLE ============================== */

function InterventionsView() {
  const [filter, setFilter] = useState("All");
  const statuses = ["All", ...new Set(INTERVENTIONS.map((i) => i.status))];
  const rows = filter === "All" ? INTERVENTIONS : INTERVENTIONS.filter((i) => i.status === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={filter === s ? btnPrimarySmall : btnGhostSmall}>{s}</button>
        ))}
      </div>
      <Panel style={{ padding: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ textAlign: "left", color: "#93A1AE", borderBottom: "1px solid #2A323D" }}>
              {["ID", "Name", "Type", "Built", "Catchment", "Status"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < rows.length - 1 ? "1px solid #2A323D" : "none" }}>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace", color: "#93A1AE" }}>{r.id}</td>
                <td style={{ padding: "10px 14px" }}>{r.name}</td>
                <td style={{ padding: "10px 14px", color: "#93A1AE" }}>{r.type}</td>
                <td style={{ padding: "10px 14px", fontFamily: "'IBM Plex Mono', monospace" }}>{r.built}</td>
                <td style={{ padding: "10px 14px" }}>{typeof r.catchment === "number" ? `${r.catchment} ha` : r.catchment}</td>
                <td style={{ padding: "10px 14px" }}><StatusPill status={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}

/* ============================== PRIORITY ZONES ============================== */

function PriorityView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ fontSize: 12.5, color: "#93A1AE", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <Info size={14} style={{ marginTop: 1, flexShrink: 0 }} />
        These are zones flagged as <em>priority for further investigation</em>, not confirmed findings or guaranteed recommendations.
      </div>
      {PRIORITY_ZONES.map((z) => (
        <Panel key={z.id}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{z.name}</div>
              <div style={{ fontSize: 11, color: "#93A1AE", fontFamily: "'IBM Plex Mono', monospace" }}>{z.id}</div>
            </div>
            <span style={{
              fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace",
              color: z.severity === "High" ? "#C2694A" : "#D8A44A",
            }}>{z.severity.toUpperCase()} PRIORITY</span>
          </div>
          <div style={{ fontSize: 11.5, color: "#93A1AE", marginBottom: 6 }}>Why this zone was flagged:</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, lineHeight: 1.7, color: "#c3ccd3" }}>
            {z.reasons.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #2A323D", fontSize: 12.5, color: "#5FC7BD" }}>
            {z.action}
          </div>
        </Panel>
      ))}
    </div>
  );
}

/* ============================== DATA SOURCES ============================== */

function SourcesView() {
  return (
    <Panel title="Provider status" style={{ padding: 0 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ textAlign: "left", color: "#93A1AE", borderBottom: "1px solid #2A323D" }}>
            {["Source", "Role", "Status"].map((h) => <th key={h} style={{ padding: "10px 14px", fontWeight: 500 }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {DATA_SOURCES.map((s, i) => (
            <tr key={s.name} style={{ borderBottom: i < DATA_SOURCES.length - 1 ? "1px solid #2A323D" : "none" }}>
              <td style={{ padding: "10px 14px" }}>{s.name}</td>
              <td style={{ padding: "10px 14px", color: "#93A1AE" }}>{s.role}</td>
              <td style={{ padding: "10px 14px" }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
                  color: SOURCE_STATUS_COLOR[s.status], border: `1px solid ${SOURCE_STATUS_COLOR[s.status]}55`,
                  background: `${SOURCE_STATUS_COLOR[s.status]}18`, padding: "2px 8px", borderRadius: 3,
                }}>{s.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

/* ============================== BUTTON STYLES ============================== */

const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 6, background: "#5FC7BD", color: "#0D1319",
  border: "none", padding: "8px 14px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
};
const btnGhost = {
  background: "transparent", color: "#c3ccd3", border: "1px solid #2A323D",
  padding: "8px 14px", fontSize: 12.5, cursor: "pointer",
};
const btnPrimarySmall = { ...btnPrimary, padding: "5px 11px", fontSize: 11.5 };
const btnGhostSmall = { ...btnGhost, padding: "5px 11px", fontSize: 11.5 };
const btnTiny = {
  display: "inline-flex", alignItems: "center", gap: 4, background: "#5FC7BD22", color: "#5FC7BD",
  border: "1px solid #5FC7BD55", padding: "4px 9px", fontSize: 11.5, cursor: "pointer",
};
const btnTinyGhost = {
  display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", color: "#93A1AE",
  border: "1px solid #2A323D", padding: "4px 9px", fontSize: 11.5, cursor: "pointer",
};

/* ============================== APP SHELL ============================== */

export default function Watershed360() {
  const [view, setView] = useState("dashboard");
  const [role, setRole] = useState("Watershed Officer");

  const viewMap = {
    dashboard: <Dashboard goExplorer={() => setView("explorer")} goAnalysis={() => setView("analysis")} />,
    explorer: <Explorer />,
    analysis: <Analysis />,
    evidence: <EvidenceView />,
    interventions: <InterventionsView />,
    priority: <PriorityView />,
    sources: <SourcesView />,
  };

  return (
    <div style={{
      fontFamily: "'IBM Plex Sans', sans-serif", background: "#10151B", color: "#E6EBEF",
      minHeight: "100%", display: "flex", flexDirection: "column",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        input[type=range] { height: 4px; }
        button:focus-visible, [tabindex]:focus-visible { outline: 2px solid #5FC7BD; outline-offset: 1px; }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px", borderBottom: "1px solid #2A323D", flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 8, height: 22, background: "#5FC7BD" }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 0.2 }}>WATERSHED360</div>
            <div style={{ fontSize: 10, color: "#93A1AE" }}>Geospatial Intelligence for Watershed Development</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Search size={13} style={{ position: "absolute", left: 9, top: 8, color: "#5b6572" }} />
            <input placeholder="Search watersheds, IDs, coordinates\u2026" style={{
              background: "#171D25", border: "1px solid #2A323D", color: "#E6EBEF",
              padding: "6px 10px 6px 28px", fontSize: 12, width: 230,
            }} />
          </div>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{
            background: "#171D25", border: "1px solid #2A323D", color: "#E6EBEF", padding: "6px 8px", fontSize: 12,
          }}>
            {["Watershed Officer", "GIS Analyst", "Field Surveyor", "Researcher", "Admin"].map((r) => <option key={r}>{r}</option>)}
          </select>
          <DemoBadge />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        {/* Sidebar */}
        <div style={{ width: 200, borderRight: "1px solid #2A323D", padding: "14px 10px", flexShrink: 0 }}>
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = view === n.key;
            return (
              <button key={n.key} onClick={() => setView(n.key)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                background: active ? "#1D2530" : "transparent", color: active ? "#E6EBEF" : "#93A1AE",
                border: "none", borderLeft: active ? "2px solid #5FC7BD" : "2px solid transparent",
                padding: "9px 10px", fontSize: 12.5, cursor: "pointer", marginBottom: 2,
              }}>
                <Icon size={15} /> {n.label}
              </button>
            );
          })}
          <div style={{ marginTop: 20, padding: "10px", borderTop: "1px solid #2A323D", fontSize: 10.5, color: "#5b6572", lineHeight: 1.5 }}>
            SIH26015 \u00B7 Phase 1 demo build. All watershed, intervention and evidence data on this screen is fictional demonstration data.
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, padding: 18, overflowY: "auto", minWidth: 0 }}>
          {viewMap[view]}
        </div>
      </div>
    </div>
  );
}

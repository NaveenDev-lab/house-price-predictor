import { useState } from "react"
import axios from "axios"

const fields = [
  { key: "med_inc",    label: "Median Income",       placeholder: "e.g. 8.3",     hint: "Area median income (in tens of thousands)" },
  { key: "house_age",  label: "House Age (years)",    placeholder: "e.g. 41",      hint: "Median age of houses in the block" },
  { key: "ave_rooms",  label: "Average Rooms",        placeholder: "e.g. 6",       hint: "Average number of rooms per house" },
  { key: "ave_bedrms", label: "Average Bedrooms",     placeholder: "e.g. 1",       hint: "Average number of bedrooms per house" },
  { key: "population", label: "Population",           placeholder: "e.g. 322",     hint: "Block population" },
  { key: "ave_occup",  label: "Average Occupants",    placeholder: "e.g. 2.5",     hint: "Average number of people per house" },
  { key: "latitude",   label: "Latitude",             placeholder: "e.g. 37.88",   hint: "Geographic latitude" },
  { key: "longitude",  label: "Longitude",            placeholder: "e.g. -122.23", hint: "Geographic longitude" },
]

const defaultForm = Object.fromEntries(fields.map(f => [f.key, ""]))

export default function App() {
  const [form, setForm]       = useState(defaultForm)
  const [price, setPrice]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setPrice(null)
    setError(null)
  }

  const handlePredict = async () => {
    const payload = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, parseFloat(v)])
    )
    const hasEmpty = Object.values(payload).some(v => isNaN(v))
    if (hasEmpty) { setError("Please fill in all fields."); return }

    setLoading(true)
    setError(null)
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", payload)
      setPrice(res.data.predicted_price)
    } catch {
      setError("Could not connect to backend. Make sure FastAPI is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>ML Project</div>
          <h1 style={styles.title}>🏠 House Price Predictor</h1>
          <p style={styles.subtitle}>
            Enter house details below to get an estimated price powered by a Linear Regression model
            trained on 20,640 California houses.
          </p>
        </div>

        {/* Form Grid */}
        <div style={styles.grid}>
          {fields.map(({ key, label, placeholder, hint }) => (
            <div key={key} style={styles.fieldGroup}>
              <label style={styles.label}>{label}</label>
              <input
                type="number"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => handleChange(key, e.target.value)}
                style={styles.input}
                onFocus={e => e.target.style.borderColor = "#6366f1"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <span style={styles.hint}>{hint}</span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Predicting..." : "Predict Price →"}
        </button>

        {/* Error */}
        {error && (
          <div style={styles.error}>{error}</div>
        )}

        {/* Result */}
        {price !== null && (
          <div style={styles.result}>
            <p style={styles.resultLabel}>Estimated House Price</p>
            <p style={styles.resultPrice}>
              ${price.toLocaleString()}
            </p>
            <p style={styles.resultNote}>
              Based on Linear Regression · California Housing Dataset · R² = 0.576
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "2.5rem",
    maxWidth: "720px",
    width: "100%",
    boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  badge: {
    display: "inline-block",
    background: "#ede9fe",
    color: "#6d28d9",
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 12px",
    borderRadius: "20px",
    marginBottom: "0.75rem",
    letterSpacing: "0.05em",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 0.5rem",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: 1.6,
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.25rem",
    marginBottom: "1.5rem",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    color: "#1e293b",
  },
  hint: {
    fontSize: "11px",
    color: "#94a3b8",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "1rem",
    transition: "opacity 0.2s",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "1rem",
    border: "1px solid #fecaca",
  },
  result: {
    background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
    border: "1.5px solid #86efac",
    borderRadius: "12px",
    padding: "1.5rem",
    textAlign: "center",
  },
  resultLabel: {
    fontSize: "13px",
    color: "#166534",
    fontWeight: 600,
    margin: "0 0 0.25rem",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  resultPrice: {
    fontSize: "42px",
    fontWeight: 700,
    color: "#15803d",
    margin: "0 0 0.5rem",
  },
  resultNote: {
    fontSize: "12px",
    color: "#4ade80",
    margin: 0,
  },
}
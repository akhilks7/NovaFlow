/** Streamed instantly on navigation, mirroring the shape of a stats page. */
export default function Loading() {
  return (
    <div className="stack stack--lg" aria-busy="true" aria-label="Loading">
      <div className="stack stack--sm">
        <span className="skeleton" style={{ width: "180px", height: "14px" }} />
        <span className="skeleton" style={{ width: "min(320px, 70%)", height: "30px" }} />
      </div>

      <div className="grid grid--stats">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="card glass">
            <span className="skeleton" style={{ display: "block", width: "34px", height: "34px" }} />
            <span className="skeleton" style={{ display: "block", width: "60%", height: "30px", marginTop: "0.9rem" }} />
            <span className="skeleton" style={{ display: "block", width: "45%", height: "12px", marginTop: "0.6rem" }} />
          </div>
        ))}
      </div>

      <div className="split">
        <div className="card glass" style={{ minHeight: "260px" }}>
          <span className="skeleton" style={{ display: "block", width: "40%", height: "18px" }} />
          <span className="skeleton" style={{ display: "block", width: "100%", height: "160px", marginTop: "1.2rem" }} />
        </div>
        <div className="card glass" style={{ minHeight: "260px" }}>
          <span className="skeleton" style={{ display: "block", width: "50%", height: "18px" }} />
          <span className="skeleton" style={{ display: "block", width: "100%", height: "160px", marginTop: "1.2rem" }} />
        </div>
      </div>
    </div>
  );
}

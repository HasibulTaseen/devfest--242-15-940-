import { useState } from "react";

function App() {
  const [language, setLanguage] = useState("en");
  const [tender, setTender] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");

  const text = {
    en: {
      appName: "TenderPack",
      subtitle: "Tender Document Package Builder",
      heroTitle: "Build a Complete Tender Package",
      heroText:
        "Load tender requirements, check documents and create a submission-ready PDF package.",
      step1: "STEP 1",
      loadTitle: "Load Tender Requirements",
      loadText:
        "Select the requirements.json file provided with the tender.",
      choose: "Choose requirements.json",
      tenderInfo: "Tender Information",
      tenderId: "Tender ID",
      title: "Tender Title",
      entity: "Procuring Entity",
      bidder: "Bidder",
      deadline: "Submission Deadline",
      checklist: "Document Requirements",
      order: "Order",
      document: "Document",
      type: "Type",
      expiry: "Expiry Check",
      required: "Required",
      optional: "Optional",
      yes: "Required",
      no: "Not Required",
      loaded: "Tender requirements loaded successfully.",
    },

    bn: {
      appName: "TenderPack",
      subtitle: "টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",
      heroTitle: "সম্পূর্ণ টেন্ডার প্যাকেজ তৈরি করুন",
      heroText:
        "টেন্ডারের রিকোয়ারমেন্ট লোড করুন, ডকুমেন্ট পরীক্ষা করুন এবং সাবমিশনের জন্য PDF প্যাকেজ তৈরি করুন।",
      step1: "ধাপ ১",
      loadTitle: "টেন্ডার রিকোয়ারমেন্ট লোড করুন",
      loadText:
        "টেন্ডারের সাথে দেওয়া requirements.json ফাইলটি নির্বাচন করুন।",
      choose: "requirements.json নির্বাচন করুন",
      tenderInfo: "টেন্ডারের তথ্য",
      tenderId: "টেন্ডার আইডি",
      title: "টেন্ডারের নাম",
      entity: "প্রকিউরিং প্রতিষ্ঠান",
      bidder: "বিডার",
      deadline: "জমাদানের শেষ তারিখ",
      checklist: "ডকুমেন্টের প্রয়োজনীয়তা",
      order: "ক্রম",
      document: "ডকুমেন্ট",
      type: "ধরন",
      expiry: "মেয়াদ পরীক্ষা",
      required: "আবশ্যক",
      optional: "ঐচ্ছিক",
      yes: "প্রয়োজন",
      no: "প্রয়োজন নেই",
      loaded: "টেন্ডার রিকোয়ারমেন্ট সফলভাবে লোড হয়েছে।",
    },
  };

  const t = text[language];

  async function handleJSONUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    try {
      if (!file.name.toLowerCase().endsWith(".json")) {
        throw new Error("Please select a JSON file.");
      }

      const content = await file.text();
      const data = JSON.parse(content);

      if (!data.tender) {
        throw new Error("Tender information is missing.");
      }

      if (!Array.isArray(data.requirements)) {
        throw new Error("Requirements list is missing.");
      }

      if (
        !data.tender.tender_id ||
        !data.tender.title ||
        !data.tender.procuring_entity ||
        !data.tender.bidder ||
        !data.tender.submission_deadline
      ) {
        throw new Error(
          "The tender information in requirements.json is incomplete."
        );
      }

      const sortedRequirements = [...data.requirements].sort(
        (a, b) => Number(a.order) - Number(b.order)
      );

      setTender(data.tender);
      setRequirements(sortedRequirements);
    } catch (err) {
      console.error(err);

      setTender(null);
      setRequirements([]);

      setError(
        err instanceof Error
          ? err.message
          : "Could not read requirements.json."
      );
    }

    event.target.value = "";
  }

  function getDocumentTitle(requirement) {
    if (language === "bn") {
      return requirement.title_bn || requirement.title_en;
    }

    return requirement.title_en || requirement.title_bn;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">TP</div>

          <div>
            <h1>{t.appName}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="language-switch">
          <button
            className={language === "en" ? "active" : ""}
            onClick={() => setLanguage("en")}
          >
            EN
          </button>

          <button
            className={language === "bn" ? "active" : ""}
            onClick={() => setLanguage("bn")}
          >
            বাংলা
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="hero-badge">AI DEVFEST 2026</span>

            <h2>{t.heroTitle}</h2>

            <p>{t.heroText}</p>
          </div>

          <div className="hero-decoration">
            <div className="document-icon">PDF</div>
          </div>
        </section>

        {error && (
          <div className="alert alert-error">
            <span>!</span>

            <div>
              <strong>File Error</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="card">
          <div className="section-heading">
            <div>
              <span className="step-badge">{t.step1}</span>

              <h3>{t.loadTitle}</h3>

              <p>{t.loadText}</p>
            </div>

            {tender && <span className="success-badge">✓ {t.loaded}</span>}
          </div>

          <label className="upload-area">
            <div className="upload-icon">↑</div>

            <strong>{t.choose}</strong>

            <span>JSON • requirements.json</span>

            <input
              type="file"
              accept=".json,application/json"
              onChange={handleJSONUpload}
            />
          </label>
        </section>

        {tender && (
          <>
            <section className="card">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">TENDER</span>
                  <h3>{t.tenderInfo}</h3>
                </div>

                <div className="tender-number">{tender.tender_id}</div>
              </div>

              <div className="info-grid">
                <InfoBox
                  label={t.tenderId}
                  value={tender.tender_id}
                />

                <InfoBox
                  label={t.title}
                  value={tender.title}
                />

                <InfoBox
                  label={t.entity}
                  value={tender.procuring_entity}
                />

                <InfoBox
                  label={t.bidder}
                  value={tender.bidder}
                />

                <InfoBox
                  label={t.deadline}
                  value={tender.submission_deadline}
                  full
                />
              </div>
            </section>

            <section className="card">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">CHECKLIST</span>
                  <h3>{t.checklist}</h3>
                </div>

                <div className="count-badge">
                  {requirements.length} documents
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>{t.order}</th>
                      <th>{t.document}</th>
                      <th>{t.type}</th>
                      <th>{t.expiry}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requirements.map((requirement) => (
                      <tr key={requirement.id}>
                        <td>
                          <span className="order-number">
                            {requirement.order}
                          </span>
                        </td>

                        <td>
                          <div className="document-name">
                            <strong>
                              {getDocumentTitle(requirement)}
                            </strong>

                            <span>{requirement.id}</span>
                          </div>
                        </td>

                        <td>
                          {requirement.mandatory ? (
                            <span className="tag required">
                              {t.required}
                            </span>
                          ) : (
                            <span className="tag optional">
                              {t.optional}
                            </span>
                          )}
                        </td>

                        <td>
                          {requirement.has_expiry ? (
                            <span className="tag expiry-yes">
                              {t.yes}
                            </span>
                          ) : (
                            <span className="tag expiry-no">
                              {t.no}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>TenderPack • AI DevFest 2026</p>
        <p>All processing happens locally in your browser.</p>
      </footer>
    </div>
  );
}

function InfoBox({ label, value, full = false }) {
  return (
    <div className={`info-box ${full ? "full" : ""}`}>
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

export default App;
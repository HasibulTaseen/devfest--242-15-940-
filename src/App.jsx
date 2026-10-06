import { useState } from "react";
import { PDFDocument } from "pdf-lib";

function App() {
  const [language, setLanguage] = useState("en");
  const [tender, setTender] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfError, setPdfError] = useState("");
  const [isReadingPDF, setIsReadingPDF] = useState(false);

  const text = {
    en: {
      appName: "TenderPack",
      subtitle: "Tender Document Package Builder",

      heroTitle: "Build a Complete Tender Package",
      heroText:
        "Load tender requirements, upload documents, check your files and prepare a submission-ready PDF package.",

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

      step2: "STEP 2",
      pdfTitle: "Upload Tender Documents",
      pdfText:
        "Upload all PDF documents that may be included in the final tender package.",

      pdfChoose: "Choose PDF Documents",
      pdfHint: "You can select multiple PDF files",

      uploadedFiles: "Uploaded Documents",
      noFiles: "No PDF documents uploaded yet.",

      processing: "Reading PDF documents...",

      remove: "Remove",
      ready: "Ready",
      duplicate: "Duplicate",

      totalFiles: "Files",
      totalPages: "Pages",
      totalSize: "Total Size",

      browserNotice:
        "Your files stay in this browser. They are not uploaded to a server.",
    },

    bn: {
      appName: "TenderPack",
      subtitle: "টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",

      heroTitle: "সম্পূর্ণ টেন্ডার প্যাকেজ তৈরি করুন",
      heroText:
        "টেন্ডারের রিকোয়ারমেন্ট লোড করুন, ডকুমেন্ট আপলোড করুন, ফাইল পরীক্ষা করুন এবং সাবমিশনের জন্য PDF প্যাকেজ তৈরি করুন।",

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

      step2: "ধাপ ২",
      pdfTitle: "টেন্ডার ডকুমেন্ট আপলোড করুন",
      pdfText:
        "চূড়ান্ত টেন্ডার প্যাকেজে প্রয়োজন হতে পারে এমন সব PDF ডকুমেন্ট আপলোড করুন।",

      pdfChoose: "PDF ডকুমেন্ট নির্বাচন করুন",
      pdfHint: "একসাথে একাধিক PDF ফাইল নির্বাচন করা যাবে",

      uploadedFiles: "আপলোড করা ডকুমেন্ট",
      noFiles: "এখনো কোনো PDF ডকুমেন্ট আপলোড করা হয়নি।",

      processing: "PDF ডকুমেন্ট পড়া হচ্ছে...",

      remove: "মুছুন",
      ready: "প্রস্তুত",
      duplicate: "ডুপ্লিকেট",

      totalFiles: "ফাইল",
      totalPages: "পৃষ্ঠা",
      totalSize: "মোট সাইজ",

      browserNotice:
        "আপনার ফাইল এই ব্রাউজারেই থাকবে। কোনো সার্ভারে আপলোড হবে না।",
    },
  };

  const t = text[language];

  async function handleJSONUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    try {
      if (!file.name.toLowerCase().endsWith(".json")) {
        throw new Error("Please select a valid JSON file.");
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

      setPdfFiles([]);
      setPdfError("");
    } catch (err) {
      console.error(err);

      setTender(null);
      setRequirements([]);
      setPdfFiles([]);

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
      return requirement.title_bn || requirement.title_en || requirement.id;
    }

    return requirement.title_en || requirement.title_bn || requirement.id;
  }

  async function createFileHash(arrayBuffer) {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      arrayBuffer
    );

    const hashArray = Array.from(
      new Uint8Array(hashBuffer)
    );

    return hashArray
      .map((byte) =>
        byte.toString(16).padStart(2, "0")
      )
      .join("");
  }

  async function handlePDFUpload(event) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setPdfError("");
    setIsReadingPDF(true);

    const newFiles = [];
    const errorMessages = [];

    try {
      for (const file of selectedFiles) {
        const isPDF =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

        if (!isPDF) {
          errorMessages.push(
            `"${file.name}" was rejected because it is not a PDF file.`
          );

          continue;
        }

        try {
          const arrayBuffer =
            await file.arrayBuffer();

          const hash =
            await createFileHash(arrayBuffer);

          const pdfDocument =
            await PDFDocument.load(arrayBuffer);

          const pageCount =
            pdfDocument.getPageCount();

          newFiles.push({
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            pages: pageCount,
            hash,
            file,
          });
        } catch (fileError) {
          console.error(fileError);

          errorMessages.push(
            `"${file.name}" could not be read. The PDF may be damaged or password protected.`
          );
        }
      }

      setPdfFiles((previousFiles) => [
        ...previousFiles,
        ...newFiles,
      ]);

      if (errorMessages.length > 0) {
        setPdfError(
          errorMessages.join(" ")
        );
      }
    } catch (uploadError) {
      console.error(uploadError);

      setPdfError(
        "Something went wrong while reading the PDF documents."
      );
    } finally {
      setIsReadingPDF(false);

      event.target.value = "";
    }
  }

  function removePDF(id) {
    setPdfFiles((previousFiles) =>
      previousFiles.filter(
        (file) => file.id !== id
      )
    );
  }

  function isDuplicateFile(currentFile) {
    return (
      pdfFiles.filter(
        (file) =>
          file.hash === currentFile.hash
      ).length > 1
    );
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(
        1
      )} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  }

  const totalPages = pdfFiles.reduce(
    (total, file) =>
      total + file.pages,
    0
  );

  const totalSize = pdfFiles.reduce(
    (total, file) =>
      total + file.size,
    0
  );

  const duplicateCount =
    pdfFiles.filter((file) =>
      isDuplicateFile(file)
    ).length;

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            TP
          </div>

          <div>
            <h1>{t.appName}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="language-switch">
          <button
            className={
              language === "en"
                ? "active"
                : ""
            }
            onClick={() =>
              setLanguage("en")
            }
          >
            EN
          </button>

          <button
            className={
              language === "bn"
                ? "active"
                : ""
            }
            onClick={() =>
              setLanguage("bn")
            }
          >
            বাংলা
          </button>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <span className="hero-badge">
              AI DEVFEST 2026
            </span>

            <h2>{t.heroTitle}</h2>

            <p>{t.heroText}</p>

            <div className="privacy-pill">
              <span>●</span>
              {t.browserNotice}
            </div>
          </div>

          <div className="hero-decoration">
            <div className="document-icon">
              <span>PDF</span>
              <small>PACKAGE</small>
            </div>
          </div>
        </section>

        {error && (
          <div className="alert alert-error">
            <span>!</span>

            <div>
              <strong>
                File Error
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}

        <section className="card">
          <div className="section-heading">
            <div>
              <span className="step-badge">
                {t.step1}
              </span>

              <h3>{t.loadTitle}</h3>

              <p>{t.loadText}</p>
            </div>

            {tender && (
              <span className="success-badge">
                ✓ {t.loaded}
              </span>
            )}
          </div>

          <label className="upload-area">
            <div className="upload-icon">
              ↑
            </div>

            <strong>
              {t.choose}
            </strong>

            <span>
              JSON • requirements.json
            </span>

            <input
              type="file"
              accept=".json,application/json"
              onChange={
                handleJSONUpload
              }
            />
          </label>
        </section>

        {tender && (
          <>
            <section className="card">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">
                    TENDER
                  </span>

                  <h3>
                    {t.tenderInfo}
                  </h3>
                </div>

                <div className="tender-number">
                  {tender.tender_id}
                </div>
              </div>

              <div className="info-grid">
                <InfoBox
                  label={t.tenderId}
                  value={
                    tender.tender_id
                  }
                />

                <InfoBox
                  label={t.title}
                  value={
                    tender.title
                  }
                />

                <InfoBox
                  label={t.entity}
                  value={
                    tender.procuring_entity
                  }
                />

                <InfoBox
                  label={t.bidder}
                  value={
                    tender.bidder
                  }
                />

                <InfoBox
                  label={t.deadline}
                  value={
                    tender.submission_deadline
                  }
                  full
                />
              </div>
            </section>

            <section className="card">
              <div className="section-title-row">
                <div>
                  <span className="eyebrow">
                    CHECKLIST
                  </span>

                  <h3>
                    {t.checklist}
                  </h3>
                </div>

                <div className="count-badge">
                  {
                    requirements.length
                  }{" "}
                  documents
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>
                        {t.order}
                      </th>

                      <th>
                        {t.document}
                      </th>

                      <th>
                        {t.type}
                      </th>

                      <th>
                        {t.expiry}
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {requirements.map(
                      (requirement) => (
                        <tr
                          key={
                            requirement.id
                          }
                        >
                          <td>
                            <span className="order-number">
                              {
                                requirement.order
                              }
                            </span>
                          </td>

                          <td>
                            <div className="document-name">
                              <strong>
                                {getDocumentTitle(
                                  requirement
                                )}
                              </strong>

                              <span>
                                {
                                  requirement.id
                                }
                              </span>
                            </div>
                          </td>

                          <td>
                            {requirement.mandatory ? (
                              <span className="tag required">
                                {
                                  t.required
                                }
                              </span>
                            ) : (
                              <span className="tag optional">
                                {
                                  t.optional
                                }
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
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="card">
              <div className="section-heading">
                <div>
                  <span className="step-badge">
                    {t.step2}
                  </span>

                  <h3>
                    {t.pdfTitle}
                  </h3>

                  <p>
                    {t.pdfText}
                  </p>
                </div>

                {pdfFiles.length >
                  0 && (
                  <span className="count-badge">
                    {
                      pdfFiles.length
                    }{" "}
                    PDF
                  </span>
                )}
              </div>

              {pdfError && (
                <div className="alert alert-error">
                  <span>!</span>

                  <div>
                    <strong>
                      PDF Error
                    </strong>

                    <p>
                      {pdfError}
                    </p>
                  </div>
                </div>
              )}

              <label className="upload-area pdf-upload-area">
                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  {t.pdfChoose}
                </strong>

                <span>
                  {t.pdfHint}
                </span>

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  multiple
                  onChange={
                    handlePDFUpload
                  }
                />
              </label>

              {isReadingPDF && (
                <div className="processing-box">
                  <div className="spinner" />

                  <span>
                    {t.processing}
                  </span>
                </div>
              )}

              {pdfFiles.length >
                0 && (
                <div className="pdf-stats">
                  <div className="stat-box">
                    <span>
                      {
                        t.totalFiles
                      }
                    </span>

                    <strong>
                      {
                        pdfFiles.length
                      }
                    </strong>
                  </div>

                  <div className="stat-box">
                    <span>
                      {
                        t.totalPages
                      }
                    </span>

                    <strong>
                      {totalPages}
                    </strong>
                  </div>

                  <div className="stat-box">
                    <span>
                      {
                        t.totalSize
                      }
                    </span>

                    <strong>
                      {formatFileSize(
                        totalSize
                      )}
                    </strong>
                  </div>

                  <div
                    className={`stat-box ${
                      duplicateCount >
                      0
                        ? "warning-stat"
                        : ""
                    }`}
                  >
                    <span>
                      Duplicates
                    </span>

                    <strong>
                      {
                        duplicateCount
                      }
                    </strong>
                  </div>
                </div>
              )}

              <div className="uploaded-section">
                <div className="uploaded-heading">
                  <h4>
                    {
                      t.uploadedFiles
                    }
                  </h4>

                  <span>
                    {
                      pdfFiles.length
                    }{" "}
                    files
                  </span>
                </div>

                {pdfFiles.length ===
                0 ? (
                  <div className="empty-state">
                    <div>
                      PDF
                    </div>

                    <p>
                      {
                        t.noFiles
                      }
                    </p>
                  </div>
                ) : (
                  <div className="pdf-list">
                    {pdfFiles.map(
                      (pdf) => {
                        const duplicate =
                          isDuplicateFile(
                            pdf
                          );

                        return (
                          <div
                            className={`pdf-item ${
                              duplicate
                                ? "pdf-duplicate"
                                : ""
                            }`}
                            key={
                              pdf.id
                            }
                          >
                            <div className="pdf-file-icon">
                              PDF
                            </div>

                            <div className="pdf-details">
                              <strong>
                                {
                                  pdf.name
                                }
                              </strong>

                              <span>
                                {formatFileSize(
                                  pdf.size
                                )}
                                {" • "}
                                {
                                  pdf.pages
                                }{" "}
                                {pdf.pages ===
                                1
                                  ? "page"
                                  : "pages"}
                              </span>
                            </div>

                            <div className="pdf-status">
                              {duplicate ? (
                                <span className="duplicate-badge">
                                  ⚠{" "}
                                  {
                                    t.duplicate
                                  }
                                </span>
                              ) : (
                                <span className="unique-badge">
                                  ✓{" "}
                                  {
                                    t.ready
                                  }
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              className="remove-button"
                              onClick={() =>
                                removePDF(
                                  pdf.id
                                )
                              }
                            >
                              {
                                t.remove
                              }
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="footer">
        <p>
          TenderPack • AI DevFest
          2026
        </p>

        <p>
          Browser-only tender
          document processing
        </p>
      </footer>
    </div>
  );
}

function InfoBox({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={`info-box ${
        full ? "full" : ""
      }`}
    >
      <span>{label}</span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

export default App;
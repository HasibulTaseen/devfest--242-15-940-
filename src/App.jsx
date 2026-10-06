import { useState } from "react";
import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

function App() {
  const [language, setLanguage] = useState("en");
  const [tender, setTender] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");

  const [pdfFiles, setPdfFiles] = useState([]);
  const [pdfError, setPdfError] = useState("");
  const [isReadingPDF, setIsReadingPDF] = useState(false);

  const [matches, setMatches] = useState({});
  const [expiryDates, setExpiryDates] = useState({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState("");

  const text = {
    en: {
      appName: "TenderPack",
      subtitle: "Tender Document Package Builder",

      heroTitle: "Build a Complete Tender Package",
      heroText:
        "Load requirements, upload documents, validate your tender and generate a submission-ready PDF package.",

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

      step3: "STEP 3",
      matchTitle: "Match & Validate Documents",
      matchText:
        "Assign each uploaded PDF to the correct requirement and enter expiry dates where required.",

      matchedFile: "Matched PDF",
      expiryDate: "Expiry Date",

      selectPDF: "Select a PDF",

      missing: "Missing",
      expiryNeeded: "Expiry date needed",
      expired: "Expired",
      notProvided: "Not provided",
      ok: "OK",

      blockingIssues: "Blocking Issues",
      readyDocuments: "Ready Documents",

      step4: "STEP 4",
      generateTitle: "Generate Tender Package",
      generateText:
        "Generate the final PDF with cover page, document index, ordered documents and page numbering.",

      packageReady: "Package Ready",
      packageBlocked: "Package Blocked",

      packageReadyText:
        "All mandatory requirements are valid. You can generate the final package.",

      packageBlockedText:
        "Resolve all blocking issues before generating the package.",

      generateButton: "Generate Package",
      generating: "Generating Package...",

      includedDocuments: "Included Documents",

      browserNotice:
        "Your files stay in this browser. Nothing is uploaded to a server.",
    },

    bn: {
      appName: "TenderPack",
      subtitle: "টেন্ডার ডকুমেন্ট প্যাকেজ বিল্ডার",

      heroTitle: "সম্পূর্ণ টেন্ডার প্যাকেজ তৈরি করুন",
      heroText:
        "রিকোয়ারমেন্ট লোড করুন, ডকুমেন্ট আপলোড করুন, টেন্ডার যাচাই করুন এবং সাবমিশনের জন্য PDF প্যাকেজ তৈরি করুন।",

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
      pdfHint: "একসাথে একাধিক PDF নির্বাচন করা যাবে",

      uploadedFiles: "আপলোড করা ডকুমেন্ট",
      noFiles: "এখনো কোনো PDF আপলোড করা হয়নি।",

      processing: "PDF ডকুমেন্ট পড়া হচ্ছে...",

      remove: "মুছুন",
      ready: "প্রস্তুত",
      duplicate: "ডুপ্লিকেট",

      totalFiles: "ফাইল",
      totalPages: "পৃষ্ঠা",
      totalSize: "মোট সাইজ",

      step3: "ধাপ ৩",
      matchTitle: "ডকুমেন্ট মিল ও যাচাই করুন",
      matchText:
        "প্রতিটি PDF সঠিক রিকোয়ারমেন্টের সাথে মিল করুন এবং প্রয়োজন হলে মেয়াদের তারিখ দিন।",

      matchedFile: "মিল করা PDF",
      expiryDate: "মেয়াদের তারিখ",

      selectPDF: "PDF নির্বাচন করুন",

      missing: "অনুপস্থিত",
      expiryNeeded: "মেয়াদের তারিখ প্রয়োজন",
      expired: "মেয়াদ শেষ",
      notProvided: "দেওয়া হয়নি",
      ok: "ঠিক আছে",

      blockingIssues: "ব্লকিং সমস্যা",
      readyDocuments: "প্রস্তুত ডকুমেন্ট",

      step4: "ধাপ ৪",
      generateTitle: "টেন্ডার প্যাকেজ তৈরি করুন",
      generateText:
        "কভার, ডকুমেন্ট ইনডেক্স, সঠিক ক্রম এবং পৃষ্ঠা নম্বরসহ চূড়ান্ত PDF তৈরি করুন।",

      packageReady: "প্যাকেজ প্রস্তুত",
      packageBlocked: "প্যাকেজ ব্লক করা হয়েছে",

      packageReadyText:
        "সব আবশ্যক রিকোয়ারমেন্ট সঠিক আছে। এখন চূড়ান্ত প্যাকেজ তৈরি করা যাবে।",

      packageBlockedText:
        "প্যাকেজ তৈরির আগে সব ব্লকিং সমস্যা সমাধান করুন।",

      generateButton: "প্যাকেজ তৈরি করুন",
      generating: "প্যাকেজ তৈরি হচ্ছে...",

      includedDocuments: "অন্তর্ভুক্ত ডকুমেন্ট",

      browserNotice:
        "আপনার ফাইল এই ব্রাউজারেই থাকবে। কোনো সার্ভারে আপলোড হবে না।",
    },
  };

  const t = text[language];

  async function handleJSONUpload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setGenerateError("");
    setGenerateSuccess("");

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
      setMatches({});
      setExpiryDates({});
      setPdfError("");
    } catch (err) {
      console.error(err);

      setTender(null);
      setRequirements([]);
      setPdfFiles([]);
      setMatches({});
      setExpiryDates({});

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
      return (
        requirement.title_bn ||
        requirement.title_en ||
        requirement.id
      );
    }

    return (
      requirement.title_en ||
      requirement.title_bn ||
      requirement.id
    );
  }

  async function createFileHash(arrayBuffer) {
    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      arrayBuffer
    );

    return Array.from(new Uint8Array(hashBuffer))
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
    setGenerateSuccess("");
    setIsReadingPDF(true);

    const newFiles = [];
    const errors = [];

    try {
      for (const file of selectedFiles) {
        const isPDF =
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf");

        if (!isPDF) {
          errors.push(
            `"${file.name}" was rejected because it is not a PDF file.`
          );
          continue;
        }

        try {
          const arrayBuffer = await file.arrayBuffer();

          const hash = await createFileHash(arrayBuffer);

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

          errors.push(
            `"${file.name}" could not be read. The PDF may be damaged or password protected.`
          );
        }
      }

      setPdfFiles((previousFiles) => [
        ...previousFiles,
        ...newFiles,
      ]);

      if (errors.length > 0) {
        setPdfError(errors.join(" "));
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

    setMatches((previousMatches) => {
      const updated = {
        ...previousMatches,
      };

      Object.keys(updated).forEach(
        (requirementId) => {
          if (
            updated[requirementId] === id
          ) {
            delete updated[requirementId];
          }
        }
      );

      return updated;
    });

    setGenerateSuccess("");
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
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(2)} MB`;
  }

  function getFileById(id) {
    return pdfFiles.find(
      (file) => file.id === id
    );
  }

  function fileUsedByAnotherRequirement(
    fileId,
    requirementId
  ) {
    if (!fileId) {
      return false;
    }

    return Object.entries(matches).some(
      ([
        otherRequirementId,
        otherFileId,
      ]) =>
        otherRequirementId !==
          requirementId &&
        otherFileId === fileId
    );
  }

  function duplicateContentUsedElsewhere(
    fileId,
    requirementId
  ) {
    if (!fileId) {
      return false;
    }

    const selectedFile =
      getFileById(fileId);

    if (!selectedFile) {
      return false;
    }

    return Object.entries(matches).some(
      ([
        otherRequirementId,
        otherFileId,
      ]) => {
        if (
          otherRequirementId ===
          requirementId
        ) {
          return false;
        }

        const otherFile =
          getFileById(otherFileId);

        if (!otherFile) {
          return false;
        }

        return (
          otherFile.hash ===
          selectedFile.hash
        );
      }
    );
  }

  function handleMatch(
    requirementId,
    fileId
  ) {
    setGenerateSuccess("");
    setGenerateError("");

    if (!fileId) {
      setMatches(
        (previousMatches) => {
          const updated = {
            ...previousMatches,
          };

          delete updated[
            requirementId
          ];

          return updated;
        }
      );

      return;
    }

    if (
      fileUsedByAnotherRequirement(
        fileId,
        requirementId
      )
    ) {
      setPdfError(
        "This PDF is already matched to another requirement."
      );

      return;
    }

    if (
      duplicateContentUsedElsewhere(
        fileId,
        requirementId
      )
    ) {
      setPdfError(
        "A duplicate copy of this PDF content is already matched to another requirement."
      );

      return;
    }

    setPdfError("");

    setMatches(
      (previousMatches) => ({
        ...previousMatches,
        [requirementId]: fileId,
      })
    );
  }

  function handleExpiry(
    requirementId,
    value
  ) {
    setGenerateSuccess("");
    setGenerateError("");

    setExpiryDates(
      (previousDates) => ({
        ...previousDates,
        [requirementId]: value,
      })
    );
  }

  function getRequirementStatus(
    requirement
  ) {
    const matchedFileId =
      matches[requirement.id];

    if (!matchedFileId) {
      if (requirement.mandatory) {
        return {
          key: "missing",
          label: t.missing,
          blocking: true,
        };
      }

      return {
        key: "not-provided",
        label: t.notProvided,
        blocking: false,
      };
    }

    if (requirement.has_expiry) {
      const expiry =
        expiryDates[requirement.id];

      if (!expiry) {
        return {
          key: "expiry-needed",
          label: t.expiryNeeded,
          blocking: true,
        };
      }

      if (
        expiry <
        tender.submission_deadline
      ) {
        return {
          key: "expired",
          label: t.expired,
          blocking: true,
        };
      }
    }

    return {
      key: "ok",
      label: t.ok,
      blocking: false,
    };
  }

  const validationResults =
    requirements.map(
      (requirement) => ({
        requirement,
        status:
          getRequirementStatus(
            requirement
          ),
      })
    );

  const blockingCount =
    validationResults.filter(
      (result) =>
        result.status.blocking
    ).length;

  const okCount =
    validationResults.filter(
      (result) =>
        result.status.key === "ok"
    ).length;

  const totalPages =
    pdfFiles.reduce(
      (total, file) =>
        total + file.pages,
      0
    );

  const totalSize =
    pdfFiles.reduce(
      (total, file) =>
        total + file.size,
      0
    );

  const duplicateCount =
    pdfFiles.filter((file) =>
      isDuplicateFile(file)
    ).length;

  const includedCount =
    requirements.filter(
      (requirement) =>
        matches[requirement.id]
    ).length;

  async function generatePackage() {
    if (!tender) {
      setGenerateError(
        "Tender information is not loaded."
      );
      return;
    }

    if (blockingCount > 0) {
      setGenerateError(
        "Resolve all blocking issues before generating the package."
      );
      return;
    }

    setIsGenerating(true);
    setGenerateError("");
    setGenerateSuccess("");

    try {
      const outputPdf =
        await PDFDocument.create();

      const regularFont =
        await outputPdf.embedFont(
          StandardFonts.Helvetica
        );

      const boldFont =
        await outputPdf.embedFont(
          StandardFonts.HelveticaBold
        );

      const includedRequirements =
        requirements
          .filter(
            (requirement) =>
              matches[
                requirement.id
              ]
          )
          .sort(
            (a, b) =>
              Number(a.order) -
              Number(b.order)
          );

      /*
      =========================================
      DOCUMENT INDEX INFORMATION

      Page 1 = Cover
      Page 2 = Index
      Page 3+ = Documents
      =========================================
      */

      let currentStartPage = 3;

      const documentIndex = [];

      for (
        const requirement of
        includedRequirements
      ) {
        const fileId =
          matches[
            requirement.id
          ];

        const matchedFile =
          getFileById(fileId);

        if (!matchedFile) {
          continue;
        }

        documentIndex.push({
          requirement,
          file: matchedFile,
          startPage:
            currentStartPage,
        });

        currentStartPage +=
          matchedFile.pages;
      }

      /*
      =========================================
      COVER PAGE
      =========================================
      */

      const coverWidth = 595.28;
      const coverHeight = 841.89;

      const coverPage =
        outputPdf.addPage([
          coverWidth,
          coverHeight,
        ]);

      coverPage.drawRectangle({
        x: 0,
        y: coverHeight - 195,
        width: coverWidth,
        height: 195,
        color: rgb(
          0.035,
          0.12,
          0.25
        ),
      });

      coverPage.drawRectangle({
        x: 0,
        y: coverHeight - 195,
        width: 8,
        height: 195,
        color: rgb(
          0.15,
          0.48,
          0.9
        ),
      });

      coverPage.drawText(
        "TENDER DOCUMENT PACKAGE",
        {
          x: 45,
          y: coverHeight - 65,
          size: 11,
          font: boldFont,
          color: rgb(
            0.35,
            0.68,
            1
          ),
        }
      );

      coverPage.drawText(
        String(
          tender.tender_id
        ),
        {
          x: 45,
          y: coverHeight - 112,
          size: 27,
          font: boldFont,
          color: rgb(1, 1, 1),
        }
      );

      let coverTenderTitle =
        String(
          tender.title || ""
        );

      if (
        coverTenderTitle.length >
        65
      ) {
        coverTenderTitle =
          coverTenderTitle.slice(
            0,
            62
          ) + "...";
      }

      coverPage.drawText(
        coverTenderTitle,
        {
          x: 45,
          y: coverHeight - 150,
          size: 15,
          font: regularFont,
          color: rgb(
            0.83,
            0.89,
            0.96
          ),
        }
      );

      coverPage.drawText(
        "Submission-ready tender document package",
        {
          x: 45,
          y: coverHeight - 175,
          size: 9,
          font: regularFont,
          color: rgb(
            0.55,
            0.68,
            0.82
          ),
        }
      );

      let coverY =
        coverHeight - 245;

      function drawCoverField(
        label,
        value
      ) {
        coverPage.drawText(
          label.toUpperCase(),
          {
            x: 45,
            y: coverY,
            size: 7.5,
            font: boldFont,
            color: rgb(
              0.42,
              0.48,
              0.57
            ),
          }
        );

        let displayValue =
          String(value || "-");

        if (
          displayValue.length >
          75
        ) {
          displayValue =
            displayValue.slice(
              0,
              72
            ) + "...";
        }

        coverPage.drawText(
          displayValue,
          {
            x: 45,
            y: coverY - 18,
            size: 11,
            font: regularFont,
            color: rgb(
              0.08,
              0.13,
              0.21
            ),
          }
        );

        coverY -= 52;
      }

      drawCoverField(
        "Tender ID",
        tender.tender_id
      );

      drawCoverField(
        "Tender Title",
        tender.title
      );

      drawCoverField(
        "Procuring Entity",
        tender.procuring_entity
      );

      drawCoverField(
        "Bidder",
        tender.bidder
      );

      drawCoverField(
        "Submission Deadline",
        tender.submission_deadline
      );

      const now =
        new Date();

      const packageDate =
        `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(
          2,
          "0"
        )}-${String(
          now.getDate()
        ).padStart(
          2,
          "0"
        )}`;

      drawCoverField(
        "Package Made Date",
        packageDate
      );

      coverY -= 5;

      coverPage.drawText(
        "INCLUDED DOCUMENTS",
        {
          x: 45,
          y: coverY,
          size: 8,
          font: boldFont,
          color: rgb(
            0.15,
            0.39,
            0.72
          ),
        }
      );

      coverY -= 21;

      documentIndex.forEach(
        (item, index) => {
          if (coverY < 45) {
            return;
          }

          let title =
            item.requirement
              .title_en ||
            item.requirement
              .title_bn ||
            item.requirement.id;

          title =
            String(title);

          if (
            title.length > 58
          ) {
            title =
              title.slice(
                0,
                55
              ) + "...";
          }

          coverPage.drawText(
            `${index + 1}. ${title}`,
            {
              x: 55,
              y: coverY,
              size: 8.5,
              font: regularFont,
              color: rgb(
                0.15,
                0.19,
                0.26
              ),
            }
          );

          coverY -= 16;
        }
      );

      /*
      =========================================
      INDEX PAGE
      =========================================
      */

      const indexPage =
        outputPdf.addPage([
          coverWidth,
          coverHeight,
        ]);

      indexPage.drawRectangle({
        x: 0,
        y: coverHeight - 125,
        width: coverWidth,
        height: 125,
        color: rgb(
          0.035,
          0.12,
          0.25
        ),
      });

      indexPage.drawRectangle({
        x: 0,
        y: coverHeight - 125,
        width: 8,
        height: 125,
        color: rgb(
          0.15,
          0.48,
          0.9
        ),
      });

      indexPage.drawText(
        "DOCUMENT INDEX",
        {
          x: 45,
          y: coverHeight - 62,
          size: 24,
          font: boldFont,
          color: rgb(
            1,
            1,
            1
          ),
        }
      );

      indexPage.drawText(
        String(
          tender.tender_id
        ),
        {
          x: 45,
          y: coverHeight - 88,
          size: 10,
          font: regularFont,
          color: rgb(
            0.55,
            0.72,
            0.9
          ),
        }
      );

      indexPage.drawText(
        "Included documents and starting page numbers",
        {
          x: 45,
          y: coverHeight - 106,
          size: 8,
          font: regularFont,
          color: rgb(
            0.62,
            0.73,
            0.86
          ),
        }
      );

      let indexY =
        coverHeight - 175;

      /*
      INDEX HEADER
      */

      indexPage.drawRectangle({
        x: 40,
        y: indexY - 8,
        width:
          coverWidth - 80,
        height: 32,
        color: rgb(
          0.94,
          0.96,
          0.985
        ),
      });

      indexPage.drawText(
        "ORDER",
        {
          x: 52,
          y: indexY + 3,
          size: 8,
          font: boldFont,
          color: rgb(
            0.35,
            0.42,
            0.52
          ),
        }
      );

      indexPage.drawText(
        "DOCUMENT",
        {
          x: 110,
          y: indexY + 3,
          size: 8,
          font: boldFont,
          color: rgb(
            0.35,
            0.42,
            0.52
          ),
        }
      );

      indexPage.drawText(
        "START PAGE",
        {
          x: 465,
          y: indexY + 3,
          size: 8,
          font: boldFont,
          color: rgb(
            0.35,
            0.42,
            0.52
          ),
        }
      );

      indexY -= 42;

      /*
      INDEX ROWS
      */

      documentIndex.forEach(
        (item) => {
          let documentTitle =
            item.requirement
              .title_en ||
            item.requirement
              .title_bn ||
            item.requirement.id;

          documentTitle =
            String(
              documentTitle
            );

          if (
            documentTitle.length >
            48
          ) {
            documentTitle =
              documentTitle.slice(
                0,
                45
              ) + "...";
          }

          indexPage.drawText(
            String(
              item.requirement
                .order
            ),
            {
              x: 55,
              y: indexY,
              size: 9,
              font: boldFont,
              color: rgb(
                0.15,
                0.38,
                0.7
              ),
            }
          );

          indexPage.drawText(
            documentTitle,
            {
              x: 110,
              y: indexY,
              size: 9,
              font: regularFont,
              color: rgb(
                0.12,
                0.17,
                0.25
              ),
            }
          );

          indexPage.drawText(
            String(
              item.startPage
            ),
            {
              x: 500,
              y: indexY,
              size: 9,
              font: boldFont,
              color: rgb(
                0.1,
                0.42,
                0.25
              ),
            }
          );

          indexPage.drawLine({
            start: {
              x: 45,
              y:
                indexY - 12,
            },

            end: {
              x:
                coverWidth -
                45,
              y:
                indexY - 12,
            },

            thickness: 0.4,

            color: rgb(
              0.86,
              0.89,
              0.93
            ),
          });

          indexY -= 34;
        }
      );

      if (indexY > 90) {
        indexY -= 15;

        indexPage.drawText(
          `Total included documents: ${documentIndex.length}`,
          {
            x: 45,
            y: indexY,
            size: 9,
            font: regularFont,
            color: rgb(
              0.4,
              0.46,
              0.55
            ),
          }
        );
      }

      /*
      =========================================
      ADD ORIGINAL DOCUMENTS
      =========================================

      Extra bottom area is added so footer
      never covers original PDF content.
      =========================================
      */

      const footerHeight = 30;

      for (
        const item of
        documentIndex
      ) {
        const matchedFile =
          item.file;

        const sourceBytes =
          await matchedFile.file.arrayBuffer();

        const sourcePdf =
          await PDFDocument.load(
            sourceBytes
          );

        const sourcePages =
          sourcePdf.getPages();

        for (
          let pageIndex = 0;
          pageIndex <
          sourcePages.length;
          pageIndex++
        ) {
          const sourcePage =
            sourcePages[
              pageIndex
            ];

          const {
            width,
            height,
          } =
            sourcePage.getSize();

          const embeddedPages =
            await outputPdf.embedPdf(
              sourcePdf,
              [pageIndex]
            );

          const embeddedPage =
            embeddedPages[0];

          const newPage =
            outputPdf.addPage([
              width,
              height +
                footerHeight,
            ]);

          /*
          Original page is shifted upward.
          Footer has its own 30pt area.
          */

          newPage.drawPage(
            embeddedPage,
            {
              x: 0,
              y: footerHeight,
              width,
              height,
            }
          );

          newPage.drawLine({
            start: {
              x: 20,
              y:
                footerHeight -
                1,
            },

            end: {
              x:
                width -
                20,
              y:
                footerHeight -
                1,
            },

            thickness: 0.4,

            color: rgb(
              0.82,
              0.84,
              0.87
            ),
          });
        }
      }

      /*
      =========================================
      PAGE FOOTERS
      =========================================
      */

      const outputPages =
        outputPdf.getPages();

      const totalOutputPages =
        outputPages.length;

      outputPages.forEach(
        (page, index) => {
          const {
            width,
          } =
            page.getSize();

          const footerText =
            `${tender.tender_id} | Page ${
              index + 1
            } of ${totalOutputPages}`;

          const fontSize = 8;

          const textWidth =
            regularFont.widthOfTextAtSize(
              footerText,
              fontSize
            );

          page.drawText(
            footerText,
            {
              x:
                (width -
                  textWidth) /
                2,

              y: 10,

              size:
                fontSize,

              font:
                regularFont,

              color: rgb(
                0.35,
                0.39,
                0.45
              ),
            }
          );
        }
      );

      /*
      =========================================
      SAVE AND DOWNLOAD
      =========================================
      */

      const pdfBytes =
        await outputPdf.save();

      const blob =
        new Blob(
          [pdfBytes],
          {
            type:
              "application/pdf",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        `${tender.tender_id}_Package.pdf`;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(
        () => {
          URL.revokeObjectURL(
            url
          );
        },
        1000
      );

      setGenerateSuccess(
        `${tender.tender_id}_Package.pdf generated successfully with document index.`
      );
    } catch (err) {
      console.error(err);

      setGenerateError(
        "Could not generate the PDF package. Please check your uploaded PDF files."
      );
    } finally {
      setIsGenerating(
        false
      );
    }
  }

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

        {/* STEP 1 */}

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
            {/* TENDER INFO */}

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
                  {
                    tender.tender_id
                  }
                </div>
              </div>

              <div className="info-grid">
                <InfoBox
                  label={
                    t.tenderId
                  }
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

            {/* REQUIREMENTS */}

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
                      (
                        requirement
                      ) => (
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
                            <span
                              className={`tag ${
                                requirement.mandatory
                                  ? "required"
                                  : "optional"
                              }`}
                            >
                              {requirement.mandatory
                                ? t.required
                                : t.optional}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`tag ${
                                requirement.has_expiry
                                  ? "expiry-yes"
                                  : "expiry-no"
                              }`}
                            >
                              {requirement.has_expiry
                                ? t.yes
                                : t.no}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* STEP 2 */}

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
                  <StatBox
                    label={
                      t.totalFiles
                    }
                    value={
                      pdfFiles.length
                    }
                  />

                  <StatBox
                    label={
                      t.totalPages
                    }
                    value={
                      totalPages
                    }
                  />

                  <StatBox
                    label={
                      t.totalSize
                    }
                    value={formatFileSize(
                      totalSize
                    )}
                  />

                  <StatBox
                    label="Duplicates"
                    value={
                      duplicateCount
                    }
                    warning={
                      duplicateCount >
                      0
                    }
                  />
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
                    <div>PDF</div>

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

            {/* STEP 3 */}

            <section className="card">
              <div className="section-heading">
                <div>
                  <span className="step-badge">
                    {t.step3}
                  </span>

                  <h3>
                    {t.matchTitle}
                  </h3>

                  <p>
                    {t.matchText}
                  </p>
                </div>
              </div>

              <div className="validation-summary">
                <div
                  className={`validation-box ${
                    blockingCount >
                    0
                      ? "danger-summary"
                      : "success-summary"
                  }`}
                >
                  <span>
                    {
                      t.blockingIssues
                    }
                  </span>

                  <strong>
                    {
                      blockingCount
                    }
                  </strong>
                </div>

                <div className="validation-box success-summary">
                  <span>
                    {
                      t.readyDocuments
                    }
                  </span>

                  <strong>
                    {okCount}
                  </strong>
                </div>
              </div>

              <div className="match-list">
                {requirements.map(
                  (
                    requirement
                  ) => {
                    const status =
                      getRequirementStatus(
                        requirement
                      );

                    const matchedFileId =
                      matches[
                        requirement.id
                      ];

                    return (
                      <div
                        className="match-card"
                        key={
                          requirement.id
                        }
                      >
                        <div className="match-card-top">
                          <div className="match-document">
                            <span className="match-order">
                              {
                                requirement.order
                              }
                            </span>

                            <div>
                              <strong>
                                {getDocumentTitle(
                                  requirement
                                )}
                              </strong>

                              <small>
                                {
                                  requirement.id
                                }{" "}
                                •{" "}
                                {requirement.mandatory
                                  ? t.required
                                  : t.optional}
                              </small>
                            </div>
                          </div>

                          <StatusBadge
                            status={
                              status
                            }
                          />
                        </div>

                        <div className="match-fields">
                          <div className="form-group">
                            <label>
                              {
                                t.matchedFile
                              }
                            </label>

                            <select
                              value={
                                matchedFileId ||
                                ""
                              }
                              onChange={(
                                event
                              ) =>
                                handleMatch(
                                  requirement.id,
                                  event
                                    .target
                                    .value
                                )
                              }
                            >
                              <option value="">
                                {
                                  t.selectPDF
                                }
                              </option>

                              {pdfFiles.map(
                                (
                                  pdf
                                ) => {
                                  const used =
                                    fileUsedByAnotherRequirement(
                                      pdf.id,
                                      requirement.id
                                    );

                                  const duplicateUsed =
                                    duplicateContentUsedElsewhere(
                                      pdf.id,
                                      requirement.id
                                    );

                                  return (
                                    <option
                                      value={
                                        pdf.id
                                      }
                                      key={
                                        pdf.id
                                      }
                                      disabled={
                                        used ||
                                        duplicateUsed
                                      }
                                    >
                                      {
                                        pdf.name
                                      }

                                      {used
                                        ? " — Already used"
                                        : duplicateUsed
                                        ? " — Duplicate already used"
                                        : ""}
                                    </option>
                                  );
                                }
                              )}
                            </select>
                          </div>

                          {requirement.has_expiry &&
                            matchedFileId && (
                              <div className="form-group">
                                <label>
                                  {
                                    t.expiryDate
                                  }
                                </label>

                                <input
                                  type="date"
                                  value={
                                    expiryDates[
                                      requirement
                                        .id
                                    ] ||
                                    ""
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    handleExpiry(
                                      requirement.id,
                                      event
                                        .target
                                        .value
                                    )
                                  }
                                />

                                <small>
                                  Submission
                                  deadline:{" "}
                                  {
                                    tender.submission_deadline
                                  }
                                </small>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </section>

            {/* STEP 4 */}

            <section className="card generate-card">
              <div className="section-heading">
                <div>
                  <span className="step-badge">
                    {t.step4}
                  </span>

                  <h3>
                    {
                      t.generateTitle
                    }
                  </h3>

                  <p>
                    {
                      t.generateText
                    }
                  </p>
                </div>
              </div>

              <div
                className={`package-status-box ${
                  blockingCount ===
                  0
                    ? "package-ready"
                    : "package-blocked"
                }`}
              >
                <div className="package-status-icon">
                  {blockingCount ===
                  0
                    ? "✓"
                    : "!"}
                </div>

                <div>
                  <strong>
                    {blockingCount ===
                    0
                      ? t.packageReady
                      : t.packageBlocked}
                  </strong>

                  <p>
                    {blockingCount ===
                    0
                      ? t.packageReadyText
                      : t.packageBlockedText}
                  </p>
                </div>
              </div>

              <div className="package-details">
                <div>
                  <span>
                    Tender ID
                  </span>

                  <strong>
                    {
                      tender.tender_id
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    {
                      t.includedDocuments
                    }
                  </span>

                  <strong>
                    {
                      includedCount
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    {
                      t.blockingIssues
                    }
                  </span>

                  <strong>
                    {
                      blockingCount
                    }
                  </strong>
                </div>

                <div>
                  <span>
                    Output
                  </span>

                  <strong className="output-name">
                    {
                      tender.tender_id
                    }
                    _Package.pdf
                  </strong>
                </div>
              </div>

              <div
                style={{
                  marginBottom: "18px",
                  padding: "13px 15px",
                  border:
                    "1px solid #dbe7f7",
                  borderRadius: "10px",
                  background:
                    "#f5f9ff",
                  color:
                    "#41658f",
                  fontSize: "11px",
                  lineHeight: "1.6",
                }}
              >
                <strong
                  style={{
                    display:
                      "block",
                    color:
                      "#205ba8",
                    marginBottom:
                      "3px",
                  }}
                >
                  ✓ Document Index Included
                </strong>

                Page 1 will be the
                cover, Page 2 will be
                the document index,
                and the tender
                documents will start
                from Page 3.
              </div>

              {generateError && (
                <div className="alert alert-error">
                  <span>!</span>

                  <div>
                    <strong>
                      Generation
                      Error
                    </strong>

                    <p>
                      {
                        generateError
                      }
                    </p>
                  </div>
                </div>
              )}

              {generateSuccess && (
                <div className="generate-success">
                  <span>✓</span>

                  <div>
                    <strong>
                      Package
                      Generated
                    </strong>

                    <p>
                      {
                        generateSuccess
                      }
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="generate-button"
                disabled={
                  blockingCount >
                    0 ||
                  isGenerating
                }
                onClick={
                  generatePackage
                }
              >
                {isGenerating ? (
                  <>
                    <span className="button-spinner" />

                    {
                      t.generating
                    }
                  </>
                ) : (
                  <>
                    <span>↓</span>

                    {
                      t.generateButton
                    }
                  </>
                )}
              </button>

              {blockingCount >
                0 && (
                <p className="generate-help">
                  Resolve the{" "}
                  <strong>
                    {
                      blockingCount
                    }
                  </strong>{" "}
                  blocking{" "}
                  {blockingCount ===
                  1
                    ? "issue"
                    : "issues"}{" "}
                  above to enable
                  package generation.
                </p>
              )}
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
      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>
    </div>
  );
}

function StatBox({
  label,
  value,
  warning = false,
}) {
  return (
    <div
      className={`stat-box ${
        warning
          ? "warning-stat"
          : ""
      }`}
    >
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function StatusBadge({
  status,
}) {
  return (
    <span
      className={`status-badge status-${status.key}`}
    >
      {status.key === "ok"
        ? "✓"
        : status.blocking
        ? "!"
        : "○"}{" "}
      {status.label}
    </span>
  );
}

export default App;
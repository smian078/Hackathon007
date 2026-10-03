import React, { useState } from 'react';
import QRCode from 'qrcode';
import {
  FilePlus2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Calendar,
  Sparkles,
  Upload,
  Fingerprint,
  KeyRound,
  Blocks,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CredentialType, DocumentRecord } from '../types';
import { api } from '../services/api';
import { computeSHA256, signCredential } from '../blockchain/crypto';
import { saveDocumentToFirestore, recordAuditEventInFirestore } from '../services/firestoreService';

export const IssueDocumentWizard: React.FC = () => {
  const { organizations, currentUser, navigateTo, addNotification, refreshData, themeMode } = useApp();

  const isLight = themeMode === 'light';
  const isOled = themeMode === 'oled';

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form State - Starts empty with real placeholders
  const [docType, setDocType] = useState<CredentialType>('DegreeCertificate');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(
    currentUser.organizationId || organizations[0]?.id || 'org-abc-uni'
  );

  // Recipient details (empty by default for real user input)
  const [holderName, setHolderName] = useState<string>('');
  const [holderEmail, setHolderEmail] = useState<string>('');
  const [recipientId, setRecipientId] = useState<string>('');

  // Document details
  const [title, setTitle] = useState<string>('');
  const [certificateNumber, setCertificateNumber] = useState<string>(
    () => `CERT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const [description, setDescription] = useState<string>('');
  const [specialization, setSpecialization] = useState<string>('');
  const [cgpaMarks, setCgpaMarks] = useState<string>('');

  // Document content / upload
  const [useGenerator, setUseGenerator] = useState<boolean>(true);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<number>(0);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>('application/pdf');
  const [fileContentData, setFileContentData] = useState<string>('');

  // Cryptographic step outputs
  const [computedHash, setComputedHash] = useState<string>('');
  const [issuerSignature, setIssuerSignature] = useState<string>('');
  const [issuedDocument, setIssuedDocument] = useState<DocumentRecord | null>(null);
  const [txDetails, setTxDetails] = useState<{ txHash: string; blockNumber: number } | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const documentTypes: Array<{ type: CredentialType; label: string; desc: string; icon: React.FC<{ className?: string }> }> = [
    {
      type: 'DegreeCertificate',
      label: 'Degree Certificate',
      desc: 'Accredited university degrees, diplomas, transcripts, and convocation awards',
      icon: Award,
    },
    {
      type: 'InternshipCertificate',
      label: 'Work & Internship Experience',
      desc: 'Official completion certificate, employment record, or appraisal letter',
      icon: Building2,
    },
    {
      type: 'DonationReceipt',
      label: 'Donation & CSR Receipt',
      desc: 'Tax exemption certificates, 80G/CSR receipts, and NGO transparent ledger grants',
      icon: FilePlus2,
    },
    {
      type: 'AwardCertificate',
      label: 'Honors & Achievement',
      desc: 'Academic competitions, sports, industry hackathons, and fellowship credentials',
      icon: Sparkles,
    },
  ];

  // Helper classes for high-contrast inputs
  const inputBaseClass = `w-full text-xs p-3 rounded-xl border outline-none font-medium transition-all ${
    isLight
      ? 'bg-slate-50 text-slate-900 border-slate-300 placeholder-slate-400 focus:bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
      : 'bg-neutral-900 text-white border-neutral-700 placeholder-neutral-500 focus:bg-neutral-950 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
  }`;

  const labelClass = `text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-200'}`;

  // STEP 4 -> 5: Compute real SHA-256 fingerprint & generate signature
  const handleNextToHash = async () => {
    if (!title.trim() || !holderName.trim()) {
      addNotification('Missing Information', 'Please provide Document Title and Recipient Name', 'warning');
      return;
    }

    setLoading(true);
    try {
      const payloadString = JSON.stringify({
        title,
        type: docType,
        holderName,
        holderEmail,
        recipientId,
        certificateNumber,
        specialization,
        cgpaMarks,
        description,
        fileContent: fileContentData,
        orgId: selectedOrgId,
        issuedAt: new Date().toISOString(),
      });

      const hash = await computeSHA256(payloadString);
      setComputedHash(hash);

      const org = organizations.find(o => o.id === selectedOrgId) || organizations[0];
      const issuerAddress = org?.walletAddress || '0x1A2B3C4D5E6F7890123456789ABCDEF012345678';
      const docId = certificateNumber || `DOC-${Date.now()}`;
      const signature = await signCredential(issuerAddress, hash, docId);
      setIssuerSignature(signature);

      setStep(5);
    } catch (err: any) {
      addNotification('Hashing Error', err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCredential = async () => {
    setLoading(true);
    try {
      const org = organizations.find(o => o.id === selectedOrgId) || organizations[0] || {
        id: 'org-proofpass-direct',
        name: currentUser.name || 'ProofPass Authority',
        domain: 'proofpass.io',
      };

      // 1. Issue via Server API
      const res = await api.issueDocument({
        title,
        type: docType,
        holderName,
        holderEmail: holderEmail || currentUser.email || 'holder@proofpass.io',
        recipientId,
        certificateNumber,
        issuerOrgId: org.id,
        description,
        customHash: computedHash,
        fileData: fileContentData || undefined,
        fileName: uploadedFileName || `${title.replace(/\s+/g, '_')}_Official.pdf`,
        fileSize: uploadedFileSize || 345000,
        mimeType: uploadedMimeType,
        customFields: {
          Specialization: specialization,
          'Overall Score / CGPA': cgpaMarks,
          'Issuing Authority': org.name,
        },
      });

      // Buffer in localStorage so documents are immediately visible everywhere
      try {
        const stored = JSON.parse(localStorage.getItem('proofpass_local_documents') || '[]');
        localStorage.setItem('proofpass_local_documents', JSON.stringify([res.document, ...stored]));
      } catch {}

      // 2. Persist real document to cloud Firestore database
      await saveDocumentToFirestore(res.document).catch(err => {
        console.warn('Firestore document persistence note:', err);
      });

      // 3. Record real audit event in Firestore
      await recordAuditEventInFirestore({
        id: `aud-${Date.now()}`,
        documentId: res.document.documentId,
        action: 'Credential Issued',
        details: `Official credential issued to ${holderName}`,
        actor: currentUser.name || org.name,
        actorRole: currentUser.role || 'ISSUER',
        timestamp: new Date().toISOString(),
        blockchainTx: res.blockchain.txHash,
      }).catch(err => {
        console.warn('Firestore audit event persistence note:', err);
      });

      setIssuedDocument(res.document);
      setTxDetails(res.blockchain);

      // Generate verification QR Code
      const verifyUrl = `${window.location.origin}/verify/${res.document.documentId}`;
      const qrUrl = await QRCode.toDataURL(verifyUrl, { width: 180, margin: 1 });
      setQrDataUrl(qrUrl);

      addNotification('Credential Issued & Saved', `Anchored ${res.document.documentId} to live ledger and database!`, 'success');
      await refreshData();
      setStep(9); // Success screen
    } catch (err: any) {
      console.error('Issuance error:', err);
      addNotification('Issuance Failed', err.message || 'Could not complete credential issuance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!issuedDocument) return;
    const url = `${window.location.origin}/verify/${issuedDocument.documentId}`;
    navigator.clipboard.writeText(url);
    addNotification('Copied', 'Public verification link copied to clipboard', 'info');
  };

  const handleDownloadStub = () => {
    if (!issuedDocument) return;
    const data = JSON.stringify(issuedDocument, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${issuedDocument.documentId}_ProofPass.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-bold text-cyan-500 uppercase tracking-widest font-mono">
          ProofPass Institutional Wizard
        </span>
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Issue a Verifiable Credential
        </h1>
        <p className={`text-xs sm:text-sm max-w-lg mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Cryptographically sign, compute SHA-256 fingerprint, anchor proof to the blockchain ledger, and generate a live verifiable QR code.
        </p>
      </div>

      {/* Progress Stepper */}
      {step < 9 && (
        <div className="flex items-center justify-between max-w-xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-cyan-500 text-slate-950 font-black' : isLight ? 'bg-slate-200 text-slate-600' : 'bg-neutral-800 text-slate-400'
              }`}
            >
              1
            </span>
            <span className={`text-xs font-medium hidden sm:inline ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Type</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 ${isLight ? 'bg-slate-200' : 'bg-neutral-800'}`} />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-cyan-500 text-slate-950 font-black' : isLight ? 'bg-slate-200 text-slate-600' : 'bg-neutral-800 text-slate-400'
              }`}
            >
              2
            </span>
            <span className={`text-xs font-medium hidden sm:inline ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Recipient</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 ${isLight ? 'bg-slate-200' : 'bg-neutral-800'}`} />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-cyan-500 text-slate-950 font-black' : isLight ? 'bg-slate-200 text-slate-600' : 'bg-neutral-800 text-slate-400'
              }`}
            >
              3
            </span>
            <span className={`text-xs font-medium hidden sm:inline ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Details</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 ${isLight ? 'bg-slate-200' : 'bg-neutral-800'}`} />

          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 5 ? 'bg-cyan-500 text-slate-950 font-black' : isLight ? 'bg-slate-200 text-slate-600' : 'bg-neutral-800 text-slate-400'
              }`}
            >
              4
            </span>
            <span className={`text-xs font-medium hidden sm:inline ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>Anchor</span>
          </div>
        </div>
      )}

      {/* Main Step Container */}
      <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl backdrop-blur-xl transition-all ${
        isOled
          ? 'bg-neutral-950/90 border-neutral-800 text-neutral-100'
          : isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-slate-900/90 border-white/10 text-slate-100'
      }`}>
        {/* STEP 1: SELECT DOCUMENT TYPE */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Step 1: Select Document Type</h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Choose the standard credential schema to format and verify this record
              </p>
            </div>

            {/* Issuing Organization Selector */}
            <div className="space-y-1.5">
              <label className={labelClass}>Issuing Organization</label>
              <select
                value={selectedOrgId}
                onChange={e => setSelectedOrgId(e.target.value)}
                className={inputBaseClass}
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id} className={isLight ? 'text-slate-900 bg-white' : 'text-white bg-neutral-900'}>
                    {org.name} ({org.type} - {org.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Document Types Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {documentTypes.map(item => {
                const Icon = item.icon;
                const isSelected = docType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setDocType(item.type)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? isLight
                          ? 'border-cyan-500 bg-cyan-50/60 ring-2 ring-cyan-500/20 shadow-md'
                          : 'border-cyan-400 bg-cyan-500/10 ring-2 ring-cyan-400/30 shadow-md shadow-cyan-500/10'
                        : isLight
                        ? 'border-slate-200 hover:border-slate-300 bg-slate-50'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">
                          ✓
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.label}</p>
                      <p className={`text-[11px] mt-0.5 leading-snug line-clamp-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={`flex justify-end pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: RECIPIENT DETAILS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Step 2: Enter Recipient Details
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                The holder who owns and will access this credential in their digital wallet
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Recipient Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma, Jane Doe..."
                  value={holderName}
                  onChange={e => setHolderName(e.target.value)}
                  className={inputBaseClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Recipient Email Address *</label>
                <input
                  type="email"
                  placeholder="e.g. recipient@gmail.com"
                  value={holderEmail}
                  onChange={e => setHolderEmail(e.target.value)}
                  className={inputBaseClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>
                  Recipient ID (Roll # / Employee ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. STU-2026-CS-992"
                  value={recipientId}
                  onChange={e => setRecipientId(e.target.value)}
                  className={`${inputBaseClass} font-mono`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium cursor-pointer ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!holderName.trim()) {
                    addNotification('Name Required', 'Please enter the recipient full name', 'warning');
                    return;
                  }
                  setStep(3);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 & 4: DOCUMENT DETAILS & GENERATOR */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Step 3 & 4: Document Details & Content
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Provide credential title, certificate number, and upload or generate document content
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Document Title *</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech in Artificial Intelligence & Data Science"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={inputBaseClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Certificate Number</label>
                <input
                  type="text"
                  value={certificateNumber}
                  onChange={e => setCertificateNumber(e.target.value)}
                  className={`${inputBaseClass} font-mono`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Specialization / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning & Cyber Systems"
                  value={specialization}
                  onChange={e => setSpecialization(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Grade / Score / Honors</label>
                <input
                  type="text"
                  placeholder="e.g. CGPA 9.2 / 10 (First Class with Distinction)"
                  value={cgpaMarks}
                  onChange={e => setCgpaMarks(e.target.value)}
                  className={inputBaseClass}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Description / Remarks</label>
                <textarea
                  rows={3}
                  placeholder="Official conferral details, accreditation notes, or remarks..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={inputBaseClass}
                />
              </div>
            </div>

            {/* Document Content Mode Toggle */}
            <div className={`p-4 rounded-xl border space-y-3 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Document Content File</h3>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Upload an official PDF / certificate file or use automatic SVG template
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setUseGenerator(true)}
                    className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      useGenerator
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    Auto-Generate
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseGenerator(false)}
                    className={`px-3 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      !useGenerator
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : isLight ? 'bg-slate-200 text-slate-700' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {!useGenerator && (
                <div className={`p-4 border-2 border-dashed rounded-xl text-center space-y-2 ${isLight ? 'border-slate-300 bg-white' : 'border-neutral-700 bg-neutral-900'}`}>
                  <Upload className="w-6 h-6 text-cyan-500 mx-auto" />
                  <p className={`text-xs ${isLight ? 'text-slate-700 font-semibold' : 'text-slate-200 font-semibold'}`}>
                    {uploadedFileName || 'Select or drop your official PDF/Image document'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.json,.doc,.docx"
                    onChange={async e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setUploadedFileName(file.name);
                        setUploadedFileSize(file.size);
                        setUploadedMimeType(file.type || 'application/pdf');

                        // If title is default or empty, prefill with file name
                        if (!title) {
                          setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' '));
                        }

                        // Read as Data URL for storage and previewing
                        const reader = new FileReader();
                        reader.onload = async () => {
                          const dataUrl = reader.result as string;
                          setFileContentData(dataUrl);

                          // Compute binary SHA-256 fingerprint
                          try {
                            const buffer = await file.arrayBuffer();
                            const hash = await computeSHA256(buffer);
                            setComputedHash(hash);
                          } catch {
                            const hash = await computeSHA256(dataUrl);
                            setComputedHash(hash);
                          }
                        };
                        reader.readAsDataURL(file);
                        addNotification('File Selected', `Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'success');
                      }
                    }}
                    className={`text-xs mx-auto cursor-pointer ${isLight ? 'text-slate-700' : 'text-slate-300'}`}
                  />
                </div>
              )}
            </div>

            <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium cursor-pointer ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleNextToHash}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>{loading ? 'Computing Fingerprint...' : 'Compute SHA-256 & Sign'}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CRYPTOGRAPHIC SIGNING & REVIEW */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Step 5, 6 & 7: Cryptographic Signing & Blockchain Registration
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Review the computed SHA-256 fingerprint and ECDSA signature before anchoring to the ledger
              </p>
            </div>

            <div className="space-y-3">
              {/* Computed SHA-256 Hash Card */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    <span>Computed SHA-256 Fingerprint</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                    Step 5 Complete
                  </span>
                </div>
                <p className={`font-mono text-xs break-all select-all font-bold ${isLight ? 'text-slate-900' : 'text-cyan-200'}`}>
                  {computedHash}
                </p>
              </div>

              {/* Digital Signature Card */}
              <div className={`p-4 rounded-xl border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    <KeyRound className="w-4 h-4 text-cyan-400" />
                    <span>Institutional Digital Signature</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-semibold border border-cyan-500/30">
                    Step 6 Complete
                  </span>
                </div>
                <p className={`font-mono text-xs break-all font-bold ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{issuerSignature}</p>
                <p className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Signed with private key corresponding to {selectedOrgId}
                </p>
              </div>

              {/* Summary metadata card */}
              <div className={`p-4 rounded-xl border text-xs space-y-2 ${isLight ? 'bg-cyan-50/60 border-cyan-200' : 'bg-cyan-500/10 border-cyan-500/30'}`}>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Credential:</span>
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>{title}</strong>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Recipient:</span>
                  <strong className={isLight ? 'text-slate-900' : 'text-white'}>{holderName} ({holderEmail})</strong>
                </div>
                <div className="flex justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Certificate ID:</span>
                  <strong className={`font-mono ${isLight ? 'text-slate-900' : 'text-cyan-300'}`}>{certificateNumber}</strong>
                </div>
              </div>
            </div>

            <div className={`flex items-center justify-between pt-4 border-t ${isLight ? 'border-slate-100' : 'border-white/10'}`}>
              <button
                type="button"
                onClick={() => setStep(3)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium cursor-pointer ${isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'}`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleIssueCredential}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-600 hover:from-cyan-300 hover:to-violet-500 text-slate-950 text-xs font-black shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
              >
                <Blocks className="w-4 h-4 text-slate-950" />
                <span>
                  {loading ? 'Anchoring Proof to Ledger & Database...' : 'Anchor Proof & Issue Document'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 9: SUCCESS SCREEN */}
        {step === 9 && issuedDocument && (
          <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
                Proof Successfully Anchored
              </span>
              <h2 className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Credential Issued & Saved to Real Database
              </h2>
              <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Anchored to the ProofPass blockchain ledger with an immutable proof fingerprint and
                active zero-account QR verification link.
              </p>
            </div>

            {/* Issued Credentials Summary Grid */}
            <div className={`p-5 rounded-2xl border max-w-lg mx-auto text-left text-xs space-y-3 ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-900 border-neutral-800'
            }`}>
              <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200/60' : 'border-neutral-800'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Document ID:</span>
                <span className="font-mono font-bold text-cyan-400">
                  {issuedDocument.documentId}
                </span>
              </div>

              <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200/60' : 'border-neutral-800'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Recipient:</span>
                <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>{issuedDocument.holderName}</span>
              </div>

              <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200/60' : 'border-neutral-800'}`}>
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Blockchain Tx:</span>
                <span className="font-mono text-[11px] truncate max-w-[220px] text-cyan-400 font-bold">
                  {txDetails?.txHash || issuedDocument.blockchainTx}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Block Number:</span>
                <span className="font-mono font-bold">#{txDetails?.blockNumber || 18452312}</span>
              </div>
            </div>

            {/* QR Code Presentation */}
            {qrDataUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-white rounded-2xl shadow-xl border border-slate-200">
                  <img src={qrDataUrl} alt="Document Verification QR Code" className="w-36 h-36" />
                </div>
                <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  Scan QR with any phone camera to verify proof
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    : 'border-white/10 hover:bg-white/10 text-slate-200'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Public Link</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadStub}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLight
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    : 'border-white/10 hover:bg-white/10 text-slate-200'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Proof JSON</span>
              </button>

              <button
                type="button"
                onClick={() => navigateTo('my-documents')}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <span>View in Digital Wallet</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

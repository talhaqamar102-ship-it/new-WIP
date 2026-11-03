/**
 * Meridian Works - Factory ERP & QA Management Portal
 * Tech Stack: Pure Vanilla HTML5 / CSS / JavaScript (Zero External Libraries)
 * Clean Inspection Mode: All dummy details removed; clean empty forms and clean table states.
 */

interface GRNRecord {
  sr: number;
  date: string;
  maker: string;
  customer: string;
  po: string;
  article: string;
  orderQty: number;
  rcvdPairs: number;
  balance: number;
  status: 'Partial' | 'Received';
}

interface DefectRecord {
  id: string;
  date: string;
  origin: string;
  article: string;
  po: string;
  defectClass: string;
  qty: string;
  tailor: string;
  status: 'In Rework' | 'In Washing' | 'Completed' | 'In Sorting' | 'Scrapped';
  route: string;
  actionText: string;
}

interface CartonRecord {
  cartonNo: string;
  pairs: number;
  netWt: string;
  grossWt: string;
  dims: string;
  barcodeVerified: boolean;
  sealNo: string;
  status: string;
}

// Clean Initial State (All dummy records removed for clean inspection)
const state = {
  activeScreen: 'screen-grn', // Clean initial screen: Inward Goods Register
  
  // Clean Data Stores
  grnList: [] as GRNRecord[],
  defectList: [] as DefectRecord[],
  cartons: [] as CartonRecord[],

  // QC Checklist with clean default unverified states
  qcChecklist: [
    { id: 'chk-1', title: 'Visual Appearance & Cleanliness', details: 'Check 80 samples for visual defects', passed: false },
    { id: 'chk-2', title: 'Dimension & Sizing Tolerances', details: 'Tolerance check according to spec sheet', passed: false },
    { id: 'chk-3', title: 'Barcode EAN-13 Scannability Test', details: 'Direct scan confirmation of 80 master cartons', passed: false },
    { id: 'chk-4', title: 'Polybag Sealing & Silica Sachet', details: 'Verification of moisture barrier packaging', passed: false },
    { id: 'chk-5', title: 'Master Carton 5-Drop Impact Test', details: 'ISTA drop standard compliance verification', passed: false }
  ],

  // Form input clean states
  grnForm: {
    maker: '',
    customer: '',
    po: '',
    article: '',
    orderQty: '',
    rcvdPairs: '',
    balance: ''
  },

  repairForm: {
    batchId: '',
    article: '',
    po: '',
    defectType: '',
    tailor: '',
    qty: ''
  },

  qcOrder: {
    buyer: '',
    po: '',
    article: '',
    orderTotal: '',
    lotCartons: '0',
    lotPairs: '0',
    netWt: '0.0',
    grossWt: '0.0',
    inspectorName: 'Unassigned',
    qcId: '---',
    container: '---'
  },

  // 5-Stage WIP Packing Hall State
  packingWip: {
    selectedBatch: 'REQ-2026-0042',
    buyer: 'Northwind Safety Gear UK',
    po: '27347',
    article: 'Model A9 Stealth Black',
    plannedQty: 3090,
    wipBatch: 'LOT-2026-0042-B1',
    stage1In: 942,
    stage1Passed: 920,
    stage1Defects: 22,
    stage2In: 920,
    stage2Passed: 915,
    stage2Defects: 5,
    stage3In: 915,
    stage3Passed: 910,
    stage3Defects: 5,
    mreqNo: 'MREQ-2026-0018',
    mreqQty: '910 Sets',
    mreqStatus: 'Issued (Trims)',
    stage4In: 910,
    stage4Passed: 900,
    stage4Pending: 10,
    stage5Cartons: '28 Cartons (840 Prs)',
    stage5Pending: '2 Cartons',
    lineEfficiency: '96.4%',
    outputPairs: 840,
    outputCartons: 28,
    inAlteration: 4
  },

  // Dynamic dropdown options populated from backend SQLite database
  dropdownOptions: {
    makers: [
      'Hall A',
      'Maker B',
      'Maker D',
      'Farooq Workshop',
      'Maker C',
      'Hall B',
      'Maker A',
      'Tariq Stitching Unit'
    ],
    customers: [
      'Umbrella Workwear GmbH',
      'Ansell Protective',
      'Northwind',
      'Northwind Safety Ltd',
      'Northwind Safety Gear UK',
      'Sierra',
      'Globex',
      'Globex 1',
      'Stark Protective Ltd'
    ],
    articles: [
      'Arctic Thermo Grip Waterproof',
      'Model A4',
      'Model A9',
      'Model A9 Stealth Black',
      'Model A11',
      'Model A5',
      'Model A8',
      'Model A7',
      'Delta Heavy Grip',
      'Pro Cut-5 Heavy Duty',
      'Model A13',
      'Model A12',
      'Model A3',
      'Model A6',
      'Premium Cowhide Driver Glove',
      'Model A14',
      'Model A1',
      'Sierra',
      'Model A15',
      'Model A2'
    ],
    poList: ['1292', '2326', '2726', '3326', '27344', '27345', '27346', '27347', '27348', '27349', '27350', '27351', '27352', '27353', '27354', '27355', '27356'],
    defectBatchIds: ['ALT-2026-0089', 'ALT-2026-0090', 'ALT-2026-0091', 'DEF-1082', 'DEF-1083', 'DEF-1084', 'DEF-1085', 'DEF-1079', 'ALT-1', 'ALT-2', 'ALT-3', 'ALT-4']
  },

  // Secret 7-Click Super User Admin Gate & Console State
  secretClickCount: 0,
  showPasswordPrompt: false,
  passwordError: '',
  isAdminUnlocked: false,
  adminActiveTab: 'overview' as 'overview' | 'masters' | 'quality' | 'database',
  lastBackupPath: '',
  adminOverview: {
    dbHealth: {
      journalMode: 'wal',
      integrity: 'ok',
      tableCounts: {} as Record<string, number>,
      totalTables: 16
    },
    customers: [] as any[],
    products: [] as any[],
    receivings: [] as any[],
    alterations: [] as any[],
    scrapLedger: [] as any[]
  }
};

// Preset reference sample data (available via toggle if user wants to compare)
const SAMPLE_DATA = {
  grnList: [
    { sr: 1, date: '31-10-2026', maker: 'Hall B', customer: 'Northwind', po: '27347', article: 'Model A9', orderQty: 3090, rcvdPairs: 942, balance: 2148, status: 'Partial' as const },
    { sr: 2, date: '31-10-2026', maker: 'Hall A', customer: 'Globex', po: '27348', article: 'Model A1', orderQty: 2500, rcvdPairs: 2500, balance: 0, status: 'Received' as const },
    { sr: 3, date: '30-10-2026', maker: 'Maker A', customer: 'Northwind', po: '27349', article: 'Ottawa', orderQty: 1800, rcvdPairs: 800, balance: 1000, status: 'Partial' as const },
    { sr: 4, date: '30-10-2026', maker: 'Hall B', customer: 'Globex', po: '27350', article: 'Model A9', orderQty: 2000, rcvdPairs: 2000, balance: 0, status: 'Received' as const },
    { sr: 5, date: '29-10-2026', maker: 'Hall A', customer: 'Northwind', po: '27351', article: 'Model A1', orderQty: 1500, rcvdPairs: 1500, balance: 0, status: 'Received' as const }
  ],
  defectList: [
    { id: 'DEF-1082', date: '31-10-2026', origin: 'Stage 1 (Checking)', article: 'Model A9', po: '27347', defectClass: 'Stitching Skip (Thumb)', qty: '12 Prs', tailor: 'Supervisor A', status: 'In Rework' as const, route: 'Auto-Return to Stage 1 Checking', actionText: 'Update' },
    { id: 'DEF-1083', date: '31-10-2026', origin: 'Stage 1 (Checking)', article: 'Model A9', po: '27347', defectClass: 'Oil / Grease Stain', qty: '10 Prs', tailor: 'Cleaning Station', status: 'In Washing' as const, route: 'Auto-Return to Stage 1 Checking', actionText: 'Update' },
    { id: 'DEF-1084', date: '31-10-2026', origin: 'Stage 2 (Ironing)', article: 'Model A9', po: '27347', defectClass: 'Thermal Crease Defect', qty: '5 Prs', tailor: 'Tariq Presser', status: 'Completed' as const, route: 'Dispatched to Stage 1 Checking', actionText: 'Verified' }
  ],
  cartons: [
    { cartonNo: 'CTN-01', pairs: 28, netWt: '34.4 kg', grossWt: '148.8 kg', dims: '29 x 23 x 28', barcodeVerified: true, sealNo: 'FSKD-4401', status: 'Cleared' },
    { cartonNo: 'CTN-02', pairs: 28, netWt: '34.4 kg', grossWt: '148.8 kg', dims: '28 x 33 x 38', barcodeVerified: true, sealNo: 'FSKD-4402', status: 'Cleared' },
    { cartonNo: 'CTN-03', pairs: 28, netWt: '34.4 kg', grossWt: '148.8 kg', dims: '23 x 23 x 28', barcodeVerified: true, sealNo: 'FSKD-4403', status: 'Cleared' }
  ],
  packingWip: {
    selectedBatch: 'REQ-2026-0042',
    buyer: 'Northwind Safety Gear UK',
    po: '27347',
    article: 'Model A9 Stealth Black',
    plannedQty: 3090,
    wipBatch: 'LOT-2026-0042-B1',
    stage1In: 942,
    stage1Passed: 920,
    stage1Defects: 22,
    stage2In: 920,
    stage2Passed: 915,
    stage2Defects: 5,
    stage3In: 915,
    stage3Passed: 910,
    stage3Defects: 5,
    mreqNo: 'MREQ-2026-0018',
    mreqQty: '910 Sets',
    mreqStatus: 'Issued (Trims)',
    stage4In: 910,
    stage4Passed: 900,
    stage4Pending: 10,
    stage5Cartons: '28 Cartons (840 Prs)',
    stage5Pending: '2 Cartons',
    lineEfficiency: '96.4%',
    outputPairs: 840,
    outputCartons: 28,
    inAlteration: 4
  }
};

// Pure inline SVG Logo (Monochrome)
const LOGO_SVG = `
<svg class="brand-logo-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="46" style="stroke: var(--ink-950)" stroke-width="5" />
  <circle cx="50" cy="50" r="36" style="stroke: var(--ink-500)" stroke-width="2" />
  <path d="M42 66V44L52 50V40L62 46V66H42Z" style="fill: var(--ink-900)" />
  <rect x="34" y="66" width="32" height="4" style="fill: var(--ink-900)" rx="1" />
</svg>
`;

// Helper: Show toast notification
function showToast(message: string): void {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = `<span>✓</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3200);
}

// Ensure direct print stage exists in body
function getDirectPrintStage(): HTMLElement {
  let stage = document.getElementById('direct-print-stage');
  if (!stage) {
    stage = document.createElement('div');
    stage.id = 'direct-print-stage';
    document.body.appendChild(stage);
  }
  return stage;
}

// Modal management
function openModal(title: string, htmlContent: string, isPrintable: boolean = true): void {
  const modal = document.getElementById('global-modal') as HTMLElement;
  const modalTitle = document.getElementById('modal-title') as HTMLElement;
  const modalBody = document.getElementById('modal-body') as HTMLElement;
  const printBtn = document.getElementById('modal-btn-print') as HTMLElement;
  if (modal && modalTitle && modalBody) {
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.add('open');
    if (printBtn) printBtn.style.display = isPrintable ? 'inline-flex' : 'none';

    if (isPrintable) {
      const preview = modalBody.querySelector('#doc-preview-container') as HTMLElement | null;
      const stage = getDirectPrintStage();
      stage.innerHTML = preview ? preview.innerHTML : htmlContent;
      document.body.classList.add('printing-slip');
    }
  }
}

function closeModal(): void {
  const modal = document.getElementById('global-modal');
  if (modal) modal.classList.remove('open');
  document.body.classList.remove('printing-slip');
}

// Synchronous native print engine (preserves browser user gesture activation)
function printDocument(_title: string, htmlContent: string): void {
  const preview = document.getElementById('doc-preview-container');
  const printContent = htmlContent || (preview ? preview.innerHTML : (document.getElementById('modal-body')?.innerHTML || ''));
  if (!printContent) {
    return;
  }

  const stage = getDirectPrintStage();
  stage.innerHTML = printContent;
  document.body.classList.add('printing-slip');

  window.focus();
  window.print();
}



// Minimal Navigation Switcher Bar (3-Zone Uncluttered Contract)
function renderModuleSwitcher(): string {
  const hasData = state.grnList.length > 0 || state.defectList.length > 0 || state.cartons.length > 0;

  return `
    <header class="module-switcher-bar">
      <div class="header-brand" title="Meridian Works">
        ${LOGO_SVG}
        <span class="brand-title">MERIDIAN WORKS</span>
      </div>
      <nav class="module-switcher-left" aria-label="Main Modules">
        <button class="module-nav-btn ${state.activeScreen === 'screen-grn' ? 'active' : ''}" data-screen="screen-grn">
          <span>Inward Register</span>
        </button>
        <button class="module-nav-btn ${state.activeScreen === 'screen-packing' ? 'active' : ''}" data-screen="screen-packing">
          <span>Packing Hall</span>
        </button>
        <button class="module-nav-btn ${state.activeScreen === 'screen-repair' ? 'active' : ''}" data-screen="screen-repair">
          <span>Alteration Bay</span>
        </button>
        <button class="module-nav-btn ${state.activeScreen === 'screen-qc' ? 'active' : ''}" data-screen="screen-qc">
          <span>Final QC</span>
        </button>
        ${state.isAdminUnlocked ? `
          <button class="module-nav-btn ${state.activeScreen === 'screen-admin' ? 'active' : ''}" data-screen="screen-admin">
            <span>System Admin</span>
          </button>
        ` : ''}
      </nav>
      <div class="module-switcher-right">
        <button class="btn-outline" style="padding: 5px 10px; font-size: 11.5px;" id="btn-open-doc-center">
          Printable Slips
        </button>
        ${hasData ? `
          <button class="btn-outline" style="padding: 5px 10px; font-size: 11.5px;" id="btn-clear-all-data">
            Clear Data
          </button>
        ` : `
          <button class="btn-primary" style="padding: 5px 10px; font-size: 11.5px;" id="btn-load-sample-data">
            Load Sample Data
          </button>
        `}
      </div>
    </header>
  `;
}

// Secret 7-Click Password Gate Overlay
function renderSecretPasswordOverlay(): string {
  if (!state.showPasswordPrompt) return '';
  return `
    <div class="secret-auth-overlay" id="secret-auth-overlay">
      <div class="secret-auth-card">
        <div class="secret-auth-header">
          <span class="secret-auth-title">MERIDIAN WORKS &mdash; SYSTEM ADMINISTRATION</span>
          <span class="secret-auth-tag">RESTRICTED</span>
        </div>
        <div class="secret-auth-body">
          <p style="margin: 0 0 14px; font-size: 12.5px; color: var(--ink-600); line-height: 1.5;">
            Enter the Super User authorization passphrase to unlock master system configuration and database administration.
          </p>
          <div>
            <label style="font-size: 11px; font-weight: 700; color: var(--ink-800); text-transform: uppercase; letter-spacing: 0.03em;">Authorization Passphrase</label>
            <input
              type="password"
              id="secret-admin-password-input"
              class="secret-auth-input"
              placeholder="Enter passphrase"
              autocomplete="off"
            />
            ${state.passwordError ? `
              <div style="color: var(--ink-950); font-size: 11.5px; font-weight: 600; margin-top: 6px;">
                ${state.passwordError}
              </div>
            ` : ''}
          </div>
        </div>
        <div class="secret-auth-footer">
          <button class="btn-outline" id="btn-cancel-secret-auth">
            Cancel
          </button>
          <button class="btn-primary" id="btn-submit-secret-auth">
            Authenticate
          </button>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// SCREEN 1: Inward Goods Receiving (Dock #1)
// ==========================================
function renderScreenGRN(): string {
  const sumRcvd = state.grnList.reduce((acc, row) => acc + row.rcvdPairs, 0);
  const sumBalance = state.grnList.reduce((acc, row) => acc + row.balance, 0);

  return `
    <div class="sub-header-bar">
      <div class="sub-header-title">
        Inward Goods Receiving Register (Dock #1)
      </div>
      <div class="sub-header-right">
        <span class="system-date-label">Date: 31-10-2026</span>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="main-viewport">
      <!-- Clean Input Form Card with dropdowns -->
      <section class="form-card">
        <div class="form-row">
          <div class="form-group" style="flex: 1.5;">
            <label>Maker / Contractor</label>
            <select id="grn-maker" class="form-select">
              <option value="">-- Select Maker / Contractor --</option>
              ${state.dropdownOptions.makers.map(m => `<option value="${m}" ${state.grnForm.maker === m ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>Customer</label>
            <select id="grn-customer" class="form-select">
              <option value="">-- Select Customer --</option>
              ${state.dropdownOptions.customers.map(c => `<option value="${c}" ${state.grnForm.customer === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>PO Number</label>
            <select id="grn-po" class="form-select">
              <option value="">-- Select PO Number --</option>
              ${state.dropdownOptions.poList.map(p => `<option value="${p}" ${state.grnForm.po === p ? 'selected' : ''}>PO ${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1.2;">
            <label>Article</label>
            <select id="grn-article" class="form-select">
              <option value="">-- Select Article --</option>
              ${state.dropdownOptions.articles.map(a => `<option value="${a}" ${state.grnForm.article === a ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 0.9;">
            <label>Order Qty</label>
            <input type="number" id="grn-order-qty" class="form-input" placeholder="0" value="${state.grnForm.orderQty}" />
          </div>
          <div class="form-group" style="flex: 0.9;">
            <label>Rcvd Pairs</label>
            <input type="number" id="grn-rcvd-pairs" class="form-input" placeholder="0" value="${state.grnForm.rcvdPairs}" />
          </div>
          <div class="form-group" style="flex: 0.9;">
            <label>Balance</label>
            <input type="number" id="grn-balance" class="form-input" placeholder="0" value="${state.grnForm.balance}" readonly />
          </div>
        </div>

        <div class="form-action-row" style="justify-content: flex-end;">
          <div class="form-actions-right">
            <button class="btn-outline" id="btn-open-size-modal">+ Size Matrix Breakdown</button>
            <button class="btn-primary" id="btn-post-grn">Post Goods Receipt (GRN)</button>
            <button class="btn-outline" id="btn-print-grn-slip">Print Receiving Slip</button>
            <button class="btn-outline" id="btn-clear-grn">Clear</button>
          </div>
        </div>
      </section>

      <!-- Store Register Master Table -->
      <section class="panel-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 50px;">SR #</th>
                <th>Date</th>
                <th>Maker / Contractor</th>
                <th>Customer</th>
                <th>PO Number</th>
                <th>Article</th>
                <th class="text-right">Order Qty</th>
                <th class="text-right">Rcvd Pairs</th>
                <th class="text-right">Balance</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.grnList.length === 0 ? `
                <tr>
                  <td colspan="11" class="text-center" style="padding: 32px 16px; color: var(--ink-500); font-size: 13px;">
                    No records found in Store Register. Enter details above and click <strong>Post Goods Receipt (GRN)</strong> to record an entry.
                  </td>
                </tr>
              ` : state.grnList.map(row => `
                <tr>
                  <td class="text-center font-bold">${row.sr}</td>
                  <td>${row.date}</td>
                  <td>${row.maker}</td>
                  <td>${row.customer}</td>
                  <td>${row.po}</td>
                  <td>${row.article}</td>
                  <td class="text-right font-bold">${row.orderQty.toLocaleString()}</td>
                  <td class="text-right font-bold">${row.rcvdPairs.toLocaleString()}</td>
                  <td class="text-right font-bold">${row.balance.toLocaleString()}</td>
                  <td class="text-center">
                    <span class="status-pill ${row.status === 'Partial' ? 'status-pill-amber' : 'status-pill-neutral'}">
                      ${row.status}
                    </span>
                  </td>
                  <td class="text-center">
                    <span class="action-link" onclick="window.viewGrnRecord(${row.sr})">View</span> | 
                    <span class="action-link" onclick="window.editGrnRecord(${row.sr})">Edit</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Bottom Metric & Action Bar -->
      <footer class="portal-footer">
        <div class="footer-stats-left">
          <span>Total Records: <strong>${state.grnList.length}</strong></span>
          <span class="stat-divider">|</span>
          <span>Sum Received: <strong>${sumRcvd.toLocaleString()} Pairs</strong></span>
          <span class="stat-divider">|</span>
          <span>Balance: <strong>${sumBalance.toLocaleString()} Pairs</strong></span>
        </div>
        <div class="footer-actions-right">
          <button class="btn-outline" id="btn-export-grn-excel">Excel export</button>
          <button class="btn-outline" id="btn-print-grn-summary">Print</button>
        </div>
      </footer>
    </main>
  `;
}

// ==========================================
// SCREEN: Packing Hall Portal & 5-Stage WIP Flow
// ==========================================
function renderScreenPacking(): string {
  const wip = state.packingWip;
  const activeAlts = state.defectList.filter(d => d.status === 'In Rework' || d.status === 'In Washing' || d.status === 'In Sorting');

  return `
    <div class="sub-header-bar">
      <div class="sub-header-title">
        Packing Hall Floor &mdash; 5-Stage WIP Flow &amp; Requisition Slip Generator
      </div>
      <div class="sub-header-right">
        <span class="system-date-label">Date: 31-10-2026</span>
      </div>
    </div>

    <main class="main-viewport">
      <!-- Active Order Toolbar -->
      <section class="form-card">
        <div class="form-row" style="align-items: flex-end;">
          <div class="form-group" style="flex: 1.4; min-width: 190px;">
            <label>Select Active Batch / Lot</label>
            <select id="wip-batch-select" class="form-select" style="font-weight: 700;">
              ${!['REQ-2026-0042', 'REQ-2026-0043', 'REQ-2026-0044'].includes(wip.selectedBatch) ? `<option value="${wip.selectedBatch}" selected>${wip.selectedBatch} (${wip.buyer || 'Northwind'} - ${wip.article || 'Model A9'})</option>` : ''}
              <option value="REQ-2026-0042" ${wip.selectedBatch === 'REQ-2026-0042' ? 'selected' : ''}>REQ-2026-0042 (Northwind - Model A9)</option>
              <option value="REQ-2026-0043" ${wip.selectedBatch === 'REQ-2026-0043' ? 'selected' : ''}>REQ-2026-0043 (Globex - Model A1)</option>
              <option value="REQ-2026-0044" ${wip.selectedBatch === 'REQ-2026-0044' ? 'selected' : ''}>REQ-2026-0044 (Northwind - Ottawa)</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1; min-width: 120px;">
            <label>Buyer</label>
            <div id="wip-disp-buyer" style="font-weight: 700; color: var(--ink-950); padding: 7px 0; font-size: 13px;">${wip.buyer || '---'}</div>
          </div>
          <div class="form-group" style="flex: 0.8; min-width: 90px;">
            <label>PO Number</label>
            <div id="wip-disp-po" style="font-weight: 700; color: var(--ink-950); padding: 7px 0; font-size: 13px;">${wip.po || '---'}</div>
          </div>
          <div class="form-group" style="flex: 1.2; min-width: 150px;">
            <label>Article</label>
            <div id="wip-disp-article" style="font-weight: 700; color: var(--ink-950); padding: 7px 0; font-size: 13px;">${wip.article || '---'}</div>
          </div>
          <div class="form-group" style="flex: 1; min-width: 110px;">
            <label>Planned Qty</label>
            <div id="wip-disp-qty" style="font-weight: 700; color: var(--ink-950); padding: 7px 0; font-size: 13px;">${wip.plannedQty.toLocaleString()} Pairs</div>
          </div>
          <div class="form-group" style="flex: 1; min-width: 130px;">
            <label>Active Lot ID</label>
            <div style="padding: 5px 0;">
              <span class="status-pill" id="wip-disp-lot">${wip.wipBatch || '---'}</span>
            </div>
          </div>
          <div class="form-group" style="flex: 1;">
            <button class="btn-primary" style="width: 100%; justify-content: center;" id="btn-wip-new-req">+ Generate &amp; Print Requisition</button>
          </div>
        </div>
      </section>

      <!-- 5-Stage WIP Floor Process Pipeline -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="font-size: 12.5px; font-weight: 700; color: var(--ink-950); text-transform: uppercase; letter-spacing: 0.04em; margin: 0;">
            5-Stage WIP Floor Process Pipeline
          </h3>
          <span style="font-size: 11.5px; color: var(--ink-500);">Closed-Loop Rework Route &bull; Direct Hand-off to Bay #2</span>
        </div>

        <div style="display: flex; gap: 12px; overflow-x: auto; padding-bottom: 4px;">
          <!-- STAGE 1: Checking / Inspection -->
          <div class="pipeline-stage-card">
            <div>
              <div class="pipeline-stage-header">Stage 1: Checking</div>
              <div class="pipeline-stage-metric"><span>In Stage:</span> <strong id="wip-stg1-in">${wip.stage1In.toLocaleString()}</strong></div>
              <div class="pipeline-stage-metric"><span>Passed:</span> <strong id="wip-stg1-passed">${wip.stage1Passed.toLocaleString()}</strong></div>
              <div class="pipeline-stage-metric"><span>Defects:</span> <strong id="wip-stg1-defects">${wip.stage1Defects.toLocaleString()}</strong></div>
            </div>
            <button class="btn-primary" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-step1">
              Process Stage 1
            </button>
          </div>

          <!-- STAGE 2: Ironing & Brushing -->
          <div class="pipeline-stage-card">
            <div>
              <div class="pipeline-stage-header">Stage 2: Ironing</div>
              <div class="pipeline-stage-metric"><span>In Stage:</span> <strong id="wip-stg2-in">${wip.stage2In.toLocaleString()}</strong></div>
              <div class="pipeline-stage-metric"><span>Passed:</span> <strong id="wip-stg2-passed">${wip.stage2Passed.toLocaleString()}</strong></div>
              <div class="pipeline-stage-metric"><span>Defects:</span> <strong id="wip-stg2-defects">${wip.stage2Defects.toLocaleString()}</strong></div>
            </div>
            <button class="btn-outline" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-step2">
              Process Stage 2
            </button>
          </div>

          <!-- STAGE 3: Pair Matching -->
          <div class="pipeline-stage-card">
            <div>
              <div class="pipeline-stage-header">Stage 3: Matching</div>
              <div class="pipeline-stage-metric"><span>In Stage:</span> <strong id="wip-stg3-in">${wip.stage3In.toLocaleString()}</strong></div>
              <div class="pipeline-stage-metric"><span>Matched:</span> <strong id="wip-stg3-passed">${wip.stage3Passed.toLocaleString()} Prs</strong></div>
              <div class="pipeline-stage-metric"><span>Defects:</span> <strong id="wip-stg3-defects">${wip.stage3Defects.toLocaleString()}</strong></div>
            </div>
            <button class="btn-outline" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-step3">
              Process Stage 3
            </button>
          </div>

          <!-- REQUISITION SLIP GENERATOR -->
          <div class="pipeline-stage-card" style="background: var(--ink-50); border-style: dashed;">
            <div>
              <div class="pipeline-stage-header">Accessories Requisition</div>
              <div class="pipeline-stage-metric"><span>Slip No:</span> <strong id="wip-mreq-no">${wip.mreqNo}</strong></div>
              <div class="pipeline-stage-metric"><span>Sets:</span> <strong id="wip-mreq-qty">${wip.mreqQty}</strong></div>
              <div class="pipeline-stage-metric"><span>Action:</span> <strong>Print Only</strong></div>
            </div>
            <button class="btn-primary" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-print-mreq">
              Generate &amp; Print Slip
            </button>
          </div>

          <!-- STAGE 4: 1st Packing -->
          <div class="pipeline-stage-card">
            <div>
              <div class="pipeline-stage-header">Stage 4: 1st Packing</div>
              <div class="pipeline-stage-metric"><span>Polybag In:</span> <strong id="wip-stg4-in">${wip.stage4In.toLocaleString()} prs</strong></div>
              <div class="pipeline-stage-metric"><span>Packaged:</span> <strong id="wip-stg4-passed">${wip.stage4Passed.toLocaleString()} Prs</strong></div>
              <div class="pipeline-stage-metric"><span>Pending:</span> <strong id="wip-stg4-pending">${wip.stage4Pending}</strong></div>
            </div>
            <button class="btn-outline" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-step4">
              Record 1st Packing
            </button>
          </div>

          <!-- STAGE 5: 2nd Packing -->
          <div class="pipeline-stage-card">
            <div>
              <div class="pipeline-stage-header">Stage 5: Master Cartons</div>
              <div class="pipeline-stage-metric"><span>Spec:</span> <strong>30 Prs / Ctn</strong></div>
              <div class="pipeline-stage-metric"><span>Packed:</span> <strong id="wip-stg5-cartons">${wip.stage5Cartons}</strong></div>
              <div class="pipeline-stage-metric"><span>Pending:</span> <strong>${wip.stage5Pending}</strong></div>
            </div>
            <button class="btn-outline" style="width: 100%; margin-top: 10px; font-size: 12px; padding: 6px; justify-content: center;" id="btn-wip-step5">
              Box &amp; Seal Cartons
            </button>
          </div>
        </div>
      </section>

      <!-- Split Enterprise Data Grids -->
      <section class="two-column-grid">
        <!-- LEFT: Active Alteration / Rework Loop -->
        <div class="panel-card">
          <div class="panel-card-header">
            <span class="panel-card-title">Active Alteration / Repair Loop (Bay #2)</span>
            <span class="panel-counter-badge">${activeAlts.length} Active</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>Source Stage</th>
                  <th>Defect Class</th>
                  <th class="text-right">Qty</th>
                  <th>Status</th>
                  <th>Route</th>
                </tr>
              </thead>
              <tbody>
                ${state.defectList.length === 0 ? `
                  <tr>
                    <td colspan="6" class="table-empty-cell">No active alterations in queue.</td>
                  </tr>
                ` : state.defectList.slice(0, 5).map(d => `
                  <tr>
                    <td><strong>${d.id}</strong></td>
                    <td>${d.origin}</td>
                    <td>${d.defectClass}</td>
                    <td class="text-right font-bold">${d.qty}</td>
                    <td><span class="status-pill">${d.status}</span></td>
                    <td style="font-size: 11px; color: var(--ink-600);">Return to Stage 1</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- RIGHT: Master Shipping Carton Manifest -->
        <div class="panel-card">
          <div class="panel-card-header">
            <span class="panel-card-title">Master Shipping Carton Manifest</span>
            <span class="panel-counter-badge">${state.cartons.length} Cartons</span>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Carton #</th>
                  <th class="text-right">Net Pairs</th>
                  <th class="text-right">Gross Wt</th>
                  <th class="text-center">QC Status</th>
                  <th class="text-center">Barcode</th>
                  <th>QC Seal #</th>
                </tr>
              </thead>
              <tbody>
                ${state.cartons.length === 0 ? `
                  <tr>
                    <td colspan="6" class="table-empty-cell">No cartons logged in manifest.</td>
                  </tr>
                ` : state.cartons.slice(0, 5).map(c => `
                  <tr>
                    <td><strong>${c.cartonNo}</strong></td>
                    <td class="text-right">${c.pairs}</td>
                    <td class="text-right">${c.grossWt}</td>
                    <td class="text-center"><span class="status-pill">${c.status}</span></td>
                    <td class="text-center" style="font-weight: 600;">${c.barcodeVerified ? 'Verified' : 'Pending'}</td>
                    <td style="font-family: monospace; font-size: 11.5px;">${c.sealNo}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Bottom Enterprise Status Bar -->
      <footer class="portal-footer">
        <div class="footer-stats-left">
          <span>Line Efficiency: <strong>${wip.lineEfficiency}</strong></span>
          <span class="stat-divider">&bull;</span>
          <span>Output: <strong>${wip.outputPairs} Pairs / ${wip.outputCartons} Cartons</strong></span>
          <span class="stat-divider">&bull;</span>
          <span>In Alteration: <strong>${wip.inAlteration} Pairs</strong></span>
        </div>
        <div class="footer-actions-right">
          <button class="btn-outline" id="btn-wip-export-shift">Export Shift Log</button>
          <button class="btn-outline" id="btn-wip-print-labels">Print Carton Labels</button>
          <button class="btn-primary" id="btn-wip-final-clearance">Final Dispatch Clearance</button>
        </div>
      </footer>
    </main>
  `;
}

// ==========================================
// SCREEN 3: Alteration & Repair Bay Operations
// ==========================================
function renderScreenRepair(): string {
  return `
    <div class="sub-header-bar">
      <div class="sub-header-title">
        Alteration &amp; Repair Bay #2 &mdash; Rework &amp; Mandatory Stage 1 Return
      </div>
      <div class="sub-header-right">
        <span class="system-date-label">Date: 31-10-2026</span>
      </div>
    </div>

    <main class="main-viewport">
      <div class="alert-banner">
        <span>FACTORY RULE: Every Repaired Pair Is Auto-Routed Back to Stage 1 (Checking &amp; Inspection).</span>
      </div>

      <!-- Clean Repair Entry Form -->
      <section class="form-card">
        <div class="form-row">
          <div class="form-group" style="flex: 1.1;">
            <label>Defect Batch ID</label>
            <select id="defect-batch-id" class="form-select">
              <option value="">-- Select Defect Batch ID --</option>
              ${state.dropdownOptions.defectBatchIds.map(b => `<option value="${b}" ${state.repairForm.batchId === b ? 'selected' : ''}>${b}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1.5;">
            <label>Article</label>
            <select id="defect-article" class="form-select">
              <option value="">-- Select Article --</option>
              ${state.dropdownOptions.articles.map(a => `<option value="${a}" ${state.repairForm.article === a ? 'selected' : ''}>${a}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1;">
            <label>PO Number</label>
            <select id="defect-po" class="form-select">
              <option value="">-- Select PO Number --</option>
              ${state.dropdownOptions.poList.map(p => `<option value="${p}" ${state.repairForm.po === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group" style="flex: 1.6;">
            <label>Defect Type</label>
            <select id="defect-type" class="form-select">
              <option value="">-- Select Defect Type --</option>
              <option>Stitching Skip / Broken Seam</option>
              <option>Oil / Grease Stain</option>
              <option>Thermal Crease Defect</option>
              <option>Size Shade Mismatch</option>
              <option>Seam Cut (Unsalvageable)</option>
            </select>
          </div>
          <div class="form-group" style="flex: 1.6;">
            <label>Assigned Tailor</label>
            <input type="text" id="defect-tailor" class="form-input" placeholder="e.g. Supervisor A" value="${state.repairForm.tailor}" />
          </div>
          <div class="form-group" style="flex: 0.9;">
            <label>Qty in Batch</label>
            <input type="text" id="defect-qty" class="form-input" placeholder="e.g. 22 Pairs" value="${state.repairForm.qty}" />
          </div>
        </div>

        <div class="form-action-row">
          <div class="form-actions-left">
            <button class="btn-primary" id="btn-complete-repair">Complete Repair &amp; Return to Stage 1</button>
          </div>
          <div class="form-actions-right">
            <button class="btn-outline" id="btn-log-scrap">Log as Scrap</button>
            <button class="btn-outline" id="btn-print-defect-tag">Print Defect Route Tag</button>
          </div>
        </div>
      </section>

      <!-- Defect Records Table -->
      <section class="panel-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Defect ID</th>
                <th>Date</th>
                <th>Origin Stage</th>
                <th>Article</th>
                <th>PO Number</th>
                <th>Defect Classification</th>
                <th class="text-right">Qty</th>
                <th>Assigned Tailor</th>
                <th class="text-center">Status</th>
                <th>Mandatory Return Route</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${state.defectList.length === 0 ? `
                <tr>
                  <td colspan="11" class="text-center" style="padding: 30px 16px; color: var(--ink-500);">
                    No defect rework tickets currently active in Bay #2.
                  </td>
                </tr>
              ` : state.defectList.map(defect => `
                  <tr>
                    <td class="font-bold" style="white-space: nowrap;">${defect.id}</td>
                    <td style="white-space: nowrap;">${defect.date}</td>
                    <td>${defect.origin}</td>
                    <td>${defect.article}</td>
                    <td style="white-space: nowrap;">${defect.po}</td>
                    <td>${defect.defectClass}</td>
                    <td class="text-right font-bold" style="white-space: nowrap;">${defect.qty}</td>
                    <td>${defect.tailor}</td>
                    <td class="text-center" style="white-space: nowrap;">
                      <span class="status-pill">${defect.status}</span>
                    </td>
                    <td>${defect.route}</td>
                    <td class="text-center" style="white-space: nowrap;">
                      <button class="table-btn" onclick="window.handleDefectAction('${defect.id}', '${defect.actionText}')">
                        ${defect.actionText}
                      </button>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Bottom Metric & Action Bar -->
      <footer class="portal-footer">
        <div class="footer-stats-left">
          <span>Total Reworked Today: <strong>${state.defectList.filter(d => d.status === 'Completed').length} Pairs</strong></span>
          <span class="stat-divider">|</span>
          <span>Returned to Stage 1: <strong>${state.defectList.length} Pairs</strong></span>
          <span class="stat-divider">|</span>
          <span>Scrapped: <strong>${state.defectList.filter(d => d.status === 'Scrapped').length} Pairs</strong></span>
        </div>
        <div class="footer-actions-right">
          <button class="btn-outline" id="btn-export-pareto">Export Pareto CSV</button>
          <button class="btn-outline" id="btn-print-defect-sheet">Print Defect Summary</button>
        </div>
      </footer>
    </main>
  `;
}

// ==========================================
// SCREEN 4: Final Inspection & Master Carton Clearance
// ==========================================
function renderScreenQC(): string {
  const allPassed = state.qcChecklist.every(c => c.passed);

  return `
    <div class="sub-header-bar">
      <div class="sub-header-title">
        Final Inspection &amp; Master Carton Clearance (Dock #4)
      </div>
      <div class="sub-header-right">
        <span class="system-date-label">Date: 31-10-2026</span>
      </div>
    </div>

    <main class="main-viewport">
      <!-- Order Summary Card -->
      <section class="order-summary-card">
        <div class="order-summary-top">
          <div class="order-metadata-group">
            <span>Buyer: <strong>${state.qcOrder.buyer || 'Northwind Safety Gear UK'}</strong></span>
            <span class="stat-divider">|</span>
            <span>PO Number: <strong>${state.qcOrder.po || '27347'}</strong></span>
            <span class="stat-divider">|</span>
            <span>Article: <strong>${state.qcOrder.article || 'Model A9 Stealth Black'}</strong></span>
            <span class="stat-divider">|</span>
            <span>Order Total: <strong>${state.qcOrder.orderTotal || '3,090 Pairs'}</strong></span>
          </div>
          <div>
            <span class="badge-aql-passed" style="background-color: ${allPassed ? 'var(--ink-950)' : 'var(--ink-500)'};">
              ${allPassed ? 'AQL PASSED - APPROVED FOR EXPORT' : 'INSPECTION PENDING'}
            </span>
          </div>
        </div>
        <div class="order-summary-bottom">
          <span>This Lot: <strong>${state.cartons.length} Cartons</strong></span>
          <span class="stat-divider">|</span>
          <span>Net Weight: <strong>${state.qcOrder.netWt} kg</strong></span>
          <span class="stat-divider">|</span>
          <span>Gross Weight: <strong>${state.qcOrder.grossWt} kg</strong></span>
          <span class="stat-divider">|</span>
          <span>Standard: <strong>AQL 1.5 Normal Single Sampling (Sample Size: 80 Pairs)</strong></span>
        </div>
      </section>

      <!-- 2-Column Split: Checklist Left, Master Manifest Right -->
      <div class="qc-split-grid">
        <!-- Checklist -->
        <section class="panel-card">
          <div class="panel-card-header">
            <span class="panel-card-title">AQL 1.5 Inspection Checklist</span>
          </div>
          <div class="checklist-container">
            ${state.qcChecklist.map(item => `
              <div class="checklist-item" onclick="window.toggleQcCheck('${item.id}')" style="cursor: pointer;">
                <div class="checklist-box" style="background-color: ${item.passed ? 'var(--ink-950)' : 'var(--ink-400)'};">
                  ✓
                </div>
                <div class="checklist-content">
                  <span class="checklist-title">${item.title}</span>
                  ${item.details ? `<span class="${item.passed ? 'checklist-status-pass' : ''}" style="font-size: 11.5px; color: ${item.passed ? 'var(--ink-950)' : 'var(--ink-500)'};">${item.details} ${item.passed ? '— PASS' : ''}</span>` : ''}
                </div>
              </div>
            `).join('')}

            <div class="inspector-stamp-card">
              <div class="stamp-badge-icon" style="background-color: ${allPassed ? 'var(--ink-950)' : 'var(--ink-400)'};">✓</div>
              <div>
                <div class="stamp-text-title">${allPassed ? 'Approved by QA Inspector Tariq Mehmood' : 'Pending Final QA Inspection Sign-off'}</div>
                <div class="stamp-text-sub">(QC ID: ${allPassed ? '4402' : '---'})</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Manifest Table -->
        <section class="panel-card">
          <div class="panel-card-header">
            <span class="panel-card-title">Master Shipping Carton Manifest</span>
          </div>
          <div class="table-responsive" style="max-height: 380px; overflow-y: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Carton #</th>
                  <th class="text-right">Pairs / Ctn</th>
                  <th class="text-right">Net Wt</th>
                  <th class="text-right">Gross Wt</th>
                  <th>Dimensions (cm)</th>
                  <th class="text-center">Barcode Verified</th>
                  <th>QC Seal #</th>
                  <th class="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                ${state.cartons.length === 0 ? `
                  <tr>
                    <td colspan="8" class="text-center" style="padding: 28px 16px; color: var(--ink-500);">
                      No cartons loaded in manifest.
                    </td>
                  </tr>
                ` : state.cartons.map(c => `
                  <tr>
                    <td class="font-bold">${c.cartonNo}</td>
                    <td class="text-right font-bold">${c.pairs}</td>
                    <td class="text-right font-bold">${c.netWt}</td>
                    <td class="text-right font-bold">${c.grossWt}</td>
                    <td>${c.dims}</td>
                    <td class="text-center">
                      <span class="status-pill status-pill-green">Verified ✓</span>
                    </td>
                    <td class="font-bold">${c.sealNo}</td>
                    <td class="text-center">
                      <span class="status-pill status-pill-green">${c.status}</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <!-- Bottom Dispatch Footer -->
      <footer class="portal-footer">
        <div class="footer-stats-left">
          <span>Manifest Cleared: <strong>${state.cartons.length} of ${state.cartons.length} Cartons</strong></span>
          <span class="stat-divider">|</span>
          <span>Total Pairs: <strong>${state.cartons.reduce((acc, c) => acc + c.pairs, 0)}</strong></span>
          <span class="stat-divider">|</span>
          <span>Total Volume: <strong>${state.cartons.length > 0 ? '2.35 CBM' : '0.00 CBM'}</strong></span>
          <span class="stat-divider">|</span>
          <span>Container: <strong>${state.qcOrder.container}</strong></span>
        </div>
        <div class="footer-actions-right">
          <button class="btn-outline" id="btn-open-aql-calculator">AQL 1.5 Calculator</button>
          <button class="btn-outline" id="btn-print-carton-labels">Print Carton Labels</button>
          <button class="btn-outline" id="btn-export-packing-list">Export Packing List</button>
          <button class="btn-primary" id="btn-dispatch-gate">Release &amp; Dispatch</button>
        </div>
      </footer>
    </main>
  `;
}

// ==========================================
// SCREEN 6: Super User Hidden Admin Panel
// ==========================================
function renderScreenAdmin(): string {
  const ov = state.adminOverview;
  const totalRcvdPairs = (ov.receivings.length ? ov.receivings : state.grnList).reduce(
    (sum: number, r: any) => sum + Number(r.rcvd_pairs ?? r.rcvdPairs ?? 0),
    0
  );
  const totalScrapDeduction = ov.scrapLedger.reduce(
    (sum: number, s: any) => sum + Number(s.financial_deduction_amount || 0),
    0
  );

  let tabContentHTML = '';

  if (state.adminActiveTab === 'overview') {
    tabContentHTML = `
      <!-- Inward Goods Receiving (GRN) Management Table -->
      <section class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title">
            <span>Inward Goods Receiving (Dock #1) Ledger</span>
            <span class="panel-counter-badge">${ov.receivings.length} Records</span>
          </div>
          <span class="admin-meta-caption">Total Received: ${totalRcvdPairs.toLocaleString()} Pairs</span>
        </div>
        <div class="table-responsive" style="max-height: 360px; overflow-y: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>GRN #</th>
                <th>Date</th>
                <th>Maker / Contractor</th>
                <th>Customer</th>
                <th>PO Number</th>
                <th>Article</th>
                <th class="text-right">Order Qty</th>
                <th class="text-right">Rcvd Pairs</th>
                <th class="text-right">Balance</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${ov.receivings.length === 0 ? `
                <tr><td colspan="11" class="text-center" style="padding: 20px; color: var(--ink-500);">No receiving records found.</td></tr>
              ` : ov.receivings.map((r: any) => `
                <tr>
                  <td class="font-bold">${r.rcv_number || `#${r.id}`}</td>
                  <td>${r.rcv_date}</td>
                  <td>${r.maker_contractor}</td>
                  <td>${r.customer_name}</td>
                  <td class="font-bold">${r.po_number}</td>
                  <td>${r.article_name}</td>
                  <td class="text-right">${Number(r.order_qty).toLocaleString()}</td>
                  <td class="text-right font-bold">${Number(r.rcvd_pairs).toLocaleString()}</td>
                  <td class="text-right font-bold">${Number(r.balance_qty).toLocaleString()}</td>
                  <td class="text-center"><span class="status-pill">${r.status}</span></td>
                  <td class="text-center">
                    <button class="table-btn" onclick="window.adminDeleteRecord('store_receivings', '${r.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  } else if (state.adminActiveTab === 'masters') {
    tabContentHTML = `
      <div class="two-column-grid">
        <!-- Customer / Buyer Master -->
        <section class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">
              <span>Customer &amp; Buyer Master</span>
              <span class="panel-counter-badge">${ov.customers.length} Buyers</span>
            </div>
            <span class="admin-meta-caption">AQL Inspection Rules</span>
          </div>
          <div style="padding: 14px 16px;">
            <div style="display: grid; grid-template-columns: 1.1fr 1fr 1.1fr auto; gap: 8px; align-items: end; margin-bottom: 12px;">
              <div class="form-group">
                <label>Customer Name</label>
                <input type="text" id="admin-cust-name" class="form-input" placeholder="e.g. Alpine Tactical" />
              </div>
              <div class="form-group">
                <label>Destination Country</label>
                <input type="text" id="admin-cust-country" class="form-input" placeholder="e.g. Germany" value="United Kingdom" />
              </div>
              <div class="form-group">
                <label>QC Inspection Protocol</label>
                <select id="admin-cust-pref" class="form-select">
                  <option value="RANDOM">RANDOM (AQL 1.5)</option>
                  <option value="THOROUGH">THOROUGH (100%)</option>
                </select>
              </div>
              <button class="btn-primary" id="btn-admin-save-customer">Save Buyer</button>
            </div>
            <div class="table-responsive" style="max-height: 210px; overflow-y: auto;">
              <table class="data-table">
                <thead>
                  <tr><th>Customer ID</th><th>Customer Name</th><th>Country</th><th class="text-center">QC Protocol</th></tr>
                </thead>
                <tbody>
                  ${ov.customers.map((c: any) => `
                    <tr>
                      <td class="font-bold">${c.id}</td>
                      <td>${c.name}</td>
                      <td>${c.country || '---'}</td>
                      <td class="text-center"><span class="status-pill">${c.inspection_preference}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- Glove Product / Article Master -->
        <section class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">
              <span>Glove Article &amp; Packaging BOM Master</span>
              <span class="panel-counter-badge">${ov.products.length} Articles</span>
            </div>
            <span class="admin-meta-caption">Per-Pair Accessory Ratios</span>
          </div>
          <div style="padding: 14px 16px;">
            <div style="display: grid; grid-template-columns: 1.2fr 1.2fr 0.7fr 0.7fr auto; gap: 8px; align-items: end; margin-bottom: 12px;">
              <div class="form-group">
                <label>Article Name</label>
                <input type="text" id="admin-prod-name" class="form-input" placeholder="e.g. Stealth Pro V2" />
              </div>
              <div class="form-group">
                <label>Buyer</label>
                <select id="admin-prod-cust" class="form-select">
                  ${ov.customers.map((c: any) => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Stickers/Pr</label>
                <input type="number" id="admin-prod-stickers" class="form-input" value="2" min="1" />
              </div>
              <div class="form-group">
                <label>Pairs/Ctn</label>
                <input type="number" id="admin-prod-carton" class="form-input" value="50" min="1" />
              </div>
              <button class="btn-primary" id="btn-admin-save-product">Save Article</button>
            </div>
            <div class="table-responsive" style="max-height: 210px; overflow-y: auto;">
              <table class="data-table">
                <thead>
                  <tr><th>Product ID</th><th>Article</th><th>Buyer</th><th class="text-right">Polybag</th><th class="text-right">Silica</th><th class="text-right">Stickers</th><th class="text-right">Prs/Ctn</th></tr>
                </thead>
                <tbody>
                  ${ov.products.map((p: any) => `
                    <tr>
                      <td class="font-bold">${p.id}</td>
                      <td class="font-bold">${p.name}</td>
                      <td>${p.customer_name || p.customer_id}</td>
                      <td class="text-right">${p.polybag_per_pair}</td>
                      <td class="text-right">${p.silica_gel_per_pair}</td>
                      <td class="text-right">${p.stickers_per_pair}</td>
                      <td class="text-right font-bold">${p.pairs_per_carton}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <!-- Global Dropdown Options Manager (Makers & PO Numbers) -->
      <section class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title">
            <span>Global Form Dropdown Lists (Makers / Contractors &amp; PO Numbers)</span>
          </div>
          <span class="admin-meta-caption">Synchronized across Inward Receiving &amp; Alteration Bay</span>
        </div>
        <div class="two-column-grid" style="padding: 14px 16px;">
          <div>
            <div style="font-size: 11.5px; font-weight: 700; color: var(--ink-600); margin-bottom: 6px; text-transform: uppercase;">Active Makers / Contractors (${state.dropdownOptions.makers.length})</div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <input type="text" id="admin-add-maker-input" class="form-input" style="flex: 1;" placeholder="Add Maker / Contractor (e.g. Usman Hall عثمان ہال)" />
              <button class="btn-primary" id="btn-admin-add-maker">Add Maker</button>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${state.dropdownOptions.makers.map(m => `
                <span class="admin-tag-item">
                  <span>${m}</span>
                  <button type="button" class="admin-tag-remove" title="Remove" onclick="window.adminRemoveDropdownItem('makers', '${m.replace(/'/g, "\\'")}')">&times;</button>
                </span>
              `).join('')}
            </div>
          </div>
          <div>
            <div style="font-size: 11.5px; font-weight: 700; color: var(--ink-600); margin-bottom: 6px; text-transform: uppercase;">Active Purchase Order Numbers (${state.dropdownOptions.poList.length})</div>
            <div style="display: flex; gap: 8px; margin-bottom: 10px;">
              <input type="text" id="admin-add-po-input" class="form-input" style="flex: 1;" placeholder="Add PO Number (e.g. 27401)" />
              <button class="btn-primary" id="btn-admin-add-po">Add PO #</button>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
              ${state.dropdownOptions.poList.map(po => `
                <span class="admin-tag-item">
                  <span>PO #${po}</span>
                  <button type="button" class="admin-tag-remove" title="Remove" onclick="window.adminRemoveDropdownItem('poList', '${po.replace(/'/g, "\\'")}')">&times;</button>
                </span>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  } else if (state.adminActiveTab === 'quality') {
    tabContentHTML = `
      <!-- Alterations & Rework Bay #2 Master Control -->
      <section class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title">
            <span>Alteration &amp; Repair Bay #2 Master Ledger</span>
            <span class="panel-counter-badge">${ov.alterations.length} Batches</span>
          </div>
          <span class="admin-meta-caption">Mandatory Stage 1 Return &bull; Maximum 2 Rework Cycles</span>
        </div>
        <div class="table-responsive" style="max-height: 230px; overflow-y: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Batch ID</th>
                <th>Req #</th>
                <th>Origin Stage</th>
                <th>Article</th>
                <th class="text-right">Pairs</th>
                <th>Defect Classification</th>
                <th>Assigned Tailor</th>
                <th class="text-center">Cycle</th>
                <th class="text-center">Status</th>
                <th class="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${ov.alterations.length === 0 ? `
                <tr><td colspan="10" class="text-center" style="padding: 18px; color: var(--ink-500);">No alteration records in SQLite.</td></tr>
              ` : ov.alterations.map((a: any) => `
                <tr>
                  <td class="font-bold">ALT-${a.id}</td>
                  <td class="font-bold">${a.req_number}</td>
                  <td>${a.source_stage}</td>
                  <td>${a.product_name || 'Gloves'}</td>
                  <td class="text-right font-bold">${a.pairs_count} Prs</td>
                  <td>${a.defect_reason}</td>
                  <td>${a.tailor_name || 'Supervisor A'}</td>
                  <td class="text-center font-bold">${a.rework_count || 1} / 2</td>
                  <td class="text-center">
                    <span class="status-pill">
                      ${a.is_scrapped ? 'SCRAPPED' : a.status}
                    </span>
                  </td>
                  <td class="text-center" style="white-space: nowrap;">
                    ${a.status !== 'RETURNED_TO_CHECKING' ? `
                      <button class="table-btn" onclick="window.adminForceRepair(${a.id}, false)">Return Step 1</button>
                      <button class="table-btn" onclick="window.adminForceRepair(${a.id}, true)">Condemn Scrap</button>
                    ` : ''}
                    <button class="table-btn" onclick="window.adminDeleteRecord('alterations', '${a.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Scrap & Financial Deduction Ledger -->
      <section class="panel-card">
        <div class="panel-card-header">
          <div class="panel-card-title">
            <span>Condemned Scrap &amp; Financial Deduction Ledger</span>
            <span class="panel-counter-badge">${ov.scrapLedger.length} Entries</span>
          </div>
          <span class="admin-meta-caption">Total Deduction: PKR ${totalScrapDeduction.toLocaleString()}</span>
        </div>
        <div class="table-responsive" style="max-height: 220px; overflow-y: auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Req #</th>
                <th>Article</th>
                <th class="text-right">Scrapped</th>
                <th>Fault Attribution</th>
                <th class="text-right">Deduction (PKR)</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${ov.scrapLedger.length === 0 ? `
                <tr><td colspan="7" class="text-center" style="padding: 18px; color: var(--ink-500);">Zero condemned scrap records.</td></tr>
              ` : ov.scrapLedger.map((s: any) => `
                <tr>
                  <td class="font-bold">#${s.id}</td>
                  <td>${s.req_number}</td>
                  <td>${s.article_name}</td>
                  <td class="text-right font-bold">${s.scrapped_pairs} Prs</td>
                  <td>${s.fault_party}</td>
                  <td class="text-right font-bold">PKR ${Number(s.financial_deduction_amount || 0).toLocaleString()}</td>
                  <td class="text-center">
                    <button class="table-btn" onclick="window.adminDeleteRecord('scrap_ledger', '${s.id}')">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  } else if (state.adminActiveTab === 'database') {
    const counts = ov.dbHealth.tableCounts || {};
    const totalRows = Object.values(counts).reduce((sum: number, n: any) => sum + Number(n || 0), 0);
    tabContentHTML = `
      <div class="two-column-grid">
        <section class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">
              <span>SQLite Database Administration &amp; Snapshot Controls</span>
            </div>
            <span class="admin-meta-caption">Engine: ${String(ov.dbHealth.journalMode).toUpperCase()} Mode</span>
          </div>
          <div style="padding: 16px;">
            <p style="font-size: 12.5px; color: var(--ink-600); line-height: 1.6; margin-bottom: 16px;">
              The Meridian Works MES database operates on native Node.js SQLite configured with <strong>Write-Ahead Logging (WAL)</strong>, <code>PRAGMA synchronous = NORMAL</code>, and foreign key integrity enforcement.
            </p>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <button class="btn-primary" id="btn-admin-trigger-backup" style="justify-content: center; padding: 9px 14px;">
                Execute Online VACUUM Snapshot Backup
              </button>
              <button class="btn-outline" id="btn-admin-reseed-db" style="justify-content: center; padding: 9px 14px;">
                Verify &amp; Re-Seed Factory Master Data
              </button>
              <button class="btn-outline" id="btn-admin-export-json" style="justify-content: center; padding: 9px 14px;">
                Export Full System State (JSON)
              </button>
            </div>
            ${state.lastBackupPath ? `
              <div style="margin-top: 14px; padding: 10px 12px; background: var(--ink-50); border: 1px solid var(--border-strong); border-radius: 4px; font-size: 12px; color: var(--ink-800);">
                <div style="font-weight: 700; color: var(--ink-950); margin-bottom: 2px;">Latest Snapshot File</div>
                <code style="word-break: break-all; color: var(--ink-600);">${state.lastBackupPath}</code>
              </div>
            ` : ''}
          </div>
        </section>

        <section class="panel-card">
          <div class="panel-card-header">
            <div class="panel-card-title">
              <span>Relational Schema &amp; Live Row Count Matrix</span>
              <span class="panel-counter-badge">${ov.dbHealth.totalTables} Tables</span>
            </div>
            <span class="admin-meta-caption">${totalRows.toLocaleString()} Total Records</span>
          </div>
          <div class="table-responsive" style="max-height: 290px; overflow-y: auto;">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Table Name</th>
                  <th class="text-right">Row Count</th>
                  <th class="text-center">Integrity Check</th>
                </tr>
              </thead>
              <tbody>
                ${Object.keys(counts).map(tbl => `
                  <tr>
                    <td class="font-bold" style="font-family: monospace; font-size: 12px;">${tbl}</td>
                    <td class="text-right font-bold">${counts[tbl]}</td>
                    <td class="text-center"><span class="status-pill">OK</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  return `
    <!-- Sub-Header Bar -->
    <div class="sub-header-bar">
      <div class="sub-header-title">
        System Administration &mdash; Master Configuration &amp; Database Control
      </div>
      <div class="sub-header-right">
        <button class="btn-outline" id="btn-admin-refresh" style="padding: 4px 10px; font-size: 11.5px;">
          Sync Database
        </button>
        <button class="btn-primary" id="btn-admin-lock" style="padding: 4px 10px; font-size: 11.5px;">
          Lock Session
        </button>
      </div>
    </div>

    <main class="main-viewport">
      <!-- Top Executive KPI Strip -->
      <div class="admin-kpi-grid">
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">Inward Receiving (Dock #1)</div>
          <div class="admin-kpi-value">${ov.receivings.length || state.grnList.length} GRNs</div>
          <div class="admin-kpi-sub">${totalRcvdPairs.toLocaleString()} Pairs Received</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">Active Buyers</div>
          <div class="admin-kpi-value">${ov.customers.length} Buyers</div>
          <div class="admin-kpi-sub">${ov.products.length} Configured Articles</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">Alteration &amp; Scrap Ledger</div>
          <div class="admin-kpi-value">${ov.alterations.length} Batches</div>
          <div class="admin-kpi-sub">Deductions: PKR ${totalScrapDeduction.toLocaleString()}</div>
        </div>
        <div class="admin-kpi-card">
          <div class="admin-kpi-label">SQLite Storage Engine</div>
          <div class="admin-kpi-value">${String(ov.dbHealth.journalMode).toUpperCase()} &bull; ${String(ov.dbHealth.integrity).toUpperCase()}</div>
          <div class="admin-kpi-sub">${ov.dbHealth.totalTables} Relational Tables</div>
        </div>
      </div>

      <!-- Admin Sub-Navigation Bar -->
      <div class="admin-subnav">
        <div class="admin-subnav-tabs">
          <button class="admin-tab-btn ${state.adminActiveTab === 'overview' ? 'active' : ''}" data-admin-tab="overview">
            Inward Receiving Ledger
          </button>
          <button class="admin-tab-btn ${state.adminActiveTab === 'masters' ? 'active' : ''}" data-admin-tab="masters">
            Buyers, Articles &amp; Dropdowns
          </button>
          <button class="admin-tab-btn ${state.adminActiveTab === 'quality' ? 'active' : ''}" data-admin-tab="quality">
            Alterations &amp; Scrap
          </button>
          <button class="admin-tab-btn ${state.adminActiveTab === 'database' ? 'active' : ''}" data-admin-tab="database">
            SQLite Database &amp; Backups
          </button>
        </div>
        <span class="admin-meta-caption" style="padding-right: 8px;">Direct SQLite WAL Read/Write Active</span>
      </div>

      ${tabContentHTML}

      <!-- Footer Statistics Bar -->
      <footer class="portal-footer">
        <div class="footer-stats-left">
          <span>Active Buyers: <strong>${ov.customers.length}</strong></span>
          <span class="stat-divider">|</span>
          <span>Configured Articles: <strong>${ov.products.length}</strong></span>
          <span class="stat-divider">|</span>
          <span>Database Integrity: <strong>${String(ov.dbHealth.integrity).toUpperCase()} (${String(ov.dbHealth.journalMode).toUpperCase()})</strong></span>
        </div>
        <div class="footer-actions-right">
          <button class="btn-outline" onclick="document.getElementById('btn-admin-refresh')?.click()">Refresh Ledger</button>
          <button class="btn-dark" onclick="document.getElementById('btn-admin-lock')?.click()">Lock Admin Session</button>
        </div>
      </footer>
    </main>
  `;
}

// Global modal container template
function renderModalContainer(): string {
  return `
    <div id="global-modal" class="modal-overlay">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-title" id="modal-title">System Slip</div>
          <button class="modal-close-btn" id="modal-close-x">&times;</button>
        </div>
        <div class="modal-body" id="modal-body"></div>
        <div class="modal-footer">
          <button class="btn-outline" id="modal-btn-close">Close</button>
          <button class="btn-primary" id="modal-btn-print" style="display: inline-flex; align-items: center; gap: 6px; font-size: 12px;">
            Print Document
          </button>
        </div>
      </div>
    </div>
  `;
}

// Main rendering engine
function renderApp(): void {
  const root = document.getElementById('root');
  if (!root) return;

  let screenHTML = '';
  if (state.activeScreen === 'screen-grn') {
    screenHTML = renderScreenGRN();
  } else if (state.activeScreen === 'screen-packing') {
    screenHTML = renderScreenPacking();
  } else if (state.activeScreen === 'screen-repair') {
    screenHTML = renderScreenRepair();
  } else if (state.activeScreen === 'screen-qc') {
    screenHTML = renderScreenQC();
  } else if (state.activeScreen === 'screen-admin') {
    screenHTML = renderScreenAdmin();
  }

  root.innerHTML = `
    ${renderModuleSwitcher()}
    ${screenHTML}
    ${renderSecretPasswordOverlay()}
    ${renderModalContainer()}
  `;

  attachEventHandlers();
}

// Attach interactive event handlers
function attachEventHandlers(): void {
  // Navigation / Switcher buttons
  document.querySelectorAll('.module-nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetScreen = (e.currentTarget as HTMLElement).getAttribute('data-screen');
      if (targetScreen) {
        state.activeScreen = targetScreen;
        renderApp();
      }
    });
  });

  // Global toolbar actions: Size matrix modal & Document center
  document.getElementById('btn-open-size-modal')?.addEventListener('click', openSizeMatrixModal);
  document.getElementById('btn-open-aql-calculator')?.addEventListener('click', openAqlCalculatorModal);
  document.getElementById('btn-open-doc-center')?.addEventListener('click', () => openDocumentCenterModal('grn'));

  // Toggle sample data vs clean blank slate
  document.getElementById('btn-load-sample-data')?.addEventListener('click', () => {
    state.grnList = [...SAMPLE_DATA.grnList];
    state.defectList = [...SAMPLE_DATA.defectList];
    state.cartons = [...SAMPLE_DATA.cartons];
    state.packingWip = { ...SAMPLE_DATA.packingWip };
    state.qcChecklist.forEach(c => c.passed = true);
    state.qcOrder = {
      buyer: 'Northwind Safety Gear UK',
      po: '27347',
      article: 'Model A9 Stealth Black',
      orderTotal: '3,090 Pairs',
      lotCartons: '28',
      lotPairs: '840',
      netWt: '134.4',
      grossWt: '148.8',
      inspectorName: 'Tariq Mehmood',
      qcId: '4402',
      container: 'MSKU-449102-1'
    };
    showToast('Sample template data loaded.');
    renderApp();
  });

  document.getElementById('btn-clear-all-data')?.addEventListener('click', () => {
    state.grnList = [];
    state.defectList = [];
    state.cartons = [];
    state.packingWip = {
      selectedBatch: 'REQ-2026-0042',
      buyer: '',
      po: '',
      article: '',
      plannedQty: 0,
      wipBatch: '---',
      stage1In: 0,
      stage1Passed: 0,
      stage1Defects: 0,
      stage2In: 0,
      stage2Passed: 0,
      stage2Defects: 0,
      stage3In: 0,
      stage3Passed: 0,
      stage3Defects: 0,
      mreqNo: '---',
      mreqQty: '0 Sets',
      mreqStatus: 'Printed',
      stage4In: 0,
      stage4Passed: 0,
      stage4Pending: 0,
      stage5Cartons: '0 Cartons (0 Prs)',
      stage5Pending: '0 Cartons',
      lineEfficiency: '0.0%',
      outputPairs: 0,
      outputCartons: 0,
      inAlteration: 0
    };
    state.qcChecklist.forEach(c => c.passed = false);
    state.qcOrder = {
      buyer: '',
      po: '',
      article: '',
      orderTotal: '',
      lotCartons: '0',
      lotPairs: '0',
      netWt: '0.0',
      grossWt: '0.0',
      inspectorName: 'Unassigned',
      qcId: '---',
      container: '---'
    };
    showToast('All details cleared to blank state.');
    renderApp();
  });

  // Modal handlers
  document.getElementById('modal-close-x')?.addEventListener('click', closeModal);
  document.getElementById('modal-btn-close')?.addEventListener('click', closeModal);
  document.getElementById('modal-btn-print')?.addEventListener('click', () => {
    const title = document.getElementById('modal-title')?.textContent || 'Meridian Works Document';
    const preview = document.getElementById('doc-preview-container');
    const content = preview ? preview.innerHTML : (document.getElementById('modal-body')?.innerHTML || '');
    printDocument(title, content);
  });

  const modal = document.getElementById('global-modal');
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ==========================================
  // SECRET 7-CLICK TRIGGER ON "MERIDIAN WORKS"
  // ==========================================
  document.querySelectorAll('.header-brand').forEach(brandEl => {
    brandEl.addEventListener('click', () => {
      state.secretClickCount += 1;
      if ((window as any).__secretClickTimer) {
        clearTimeout((window as any).__secretClickTimer);
      }
      if (state.secretClickCount >= 7) {
        state.secretClickCount = 0;
        state.showPasswordPrompt = true;
        state.passwordError = '';
        renderApp();
        setTimeout(() => {
          const pwdInput = document.getElementById('secret-admin-password-input') as HTMLInputElement;
          pwdInput?.focus();
        }, 30);
      } else {
        (window as any).__secretClickTimer = setTimeout(() => {
          state.secretClickCount = 0;
        }, 4000);
      }
    });
  });

  // Secret Password Gate Verification.
  // The passphrase is supplied at build time via VITE_ADMIN_PASSPHRASE (see
  // .env.example). It is never committed; when unset the gate stays locked.
  const ADMIN_PASSPHRASE = (
    ((import.meta as any).env?.VITE_ADMIN_PASSPHRASE as string | undefined) || ''
  ).trim().toLowerCase();

  const verifySecretPassword = async () => {
    const pwdInput = document.getElementById('secret-admin-password-input') as HTMLInputElement;
    const entered = (pwdInput?.value || '').trim().toLowerCase();
    if (ADMIN_PASSPHRASE && entered === ADMIN_PASSPHRASE) {
      state.showPasswordPrompt = false;
      state.passwordError = '';
      state.isAdminUnlocked = true;
      state.activeScreen = 'screen-admin';
      showToast('Super User Access Granted. Welcome to the Executive Control Panel.');
      await syncBackendData();
    } else {
      state.passwordError = 'Invalid Super User passphrase. Access denied.';
      renderApp();
      setTimeout(() => {
        const el = document.getElementById('secret-admin-password-input') as HTMLInputElement;
        el?.focus();
      }, 30);
    }
  };

  document.getElementById('btn-submit-secret-auth')?.addEventListener('click', verifySecretPassword);
  document.getElementById('secret-admin-password-input')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      verifySecretPassword();
    } else if (e.key === 'Escape') {
      state.showPasswordPrompt = false;
      state.passwordError = '';
      renderApp();
    }
  });
  document.getElementById('btn-cancel-secret-auth')?.addEventListener('click', () => {
    state.showPasswordPrompt = false;
    state.passwordError = '';
    renderApp();
  });

  if (state.activeScreen === 'screen-grn') {
    attachGRNHandlers();
  } else if (state.activeScreen === 'screen-packing') {
    attachPackingHandlers();
  } else if (state.activeScreen === 'screen-repair') {
    attachRepairHandlers();
  } else if (state.activeScreen === 'screen-qc') {
    attachQCHandlers();
  } else if (state.activeScreen === 'screen-admin') {
    attachAdminHandlers();
  }
}

// Handlers for Screen 1
function attachGRNHandlers(): void {
  const orderQtyInput = document.getElementById('grn-order-qty') as HTMLInputElement;
  const rcvdPairsInput = document.getElementById('grn-rcvd-pairs') as HTMLInputElement;
  const balanceInput = document.getElementById('grn-balance') as HTMLInputElement;

  function updateBalance() {
    const orderQty = parseInt(orderQtyInput?.value || '0', 10);
    const rcvd = parseInt(rcvdPairsInput?.value || '0', 10);
    if (balanceInput) {
      balanceInput.value = Math.max(0, orderQty - rcvd).toString();
    }
  }

  orderQtyInput?.addEventListener('input', updateBalance);
  rcvdPairsInput?.addEventListener('input', updateBalance);

  document.getElementById('btn-post-grn')?.addEventListener('click', async () => {
    const maker = (document.getElementById('grn-maker') as HTMLSelectElement)?.value;
    const customer = (document.getElementById('grn-customer') as HTMLSelectElement)?.value;
    const po = (document.getElementById('grn-po') as HTMLSelectElement)?.value;
    const article = (document.getElementById('grn-article') as HTMLSelectElement)?.value;
    const orderQty = parseInt(orderQtyInput?.value || '0', 10);
    const rcvdPairs = parseInt(rcvdPairsInput?.value || '0', 10);
    const balance = parseInt(balanceInput?.value || '0', 10);

    if (!maker || !po || orderQty <= 0) {
      showToast('Please select valid Maker, PO, and enter Order Quantity.');
      return;
    }

    try {
      const resp = await fetch('/api/store/receivings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          makerContractor: maker,
          customerName: customer,
          poNumber: po,
          articleName: article,
          orderQty,
          rcvdPairs,
          date: '31-10-2026'
        })
      });
      const data = await resp.json();
      if (data.success) {
        showToast(`GRN #${data.data.rcvNumber} posted and stored in SQLite!`);
        await syncBackendData();
        return;
      }
    } catch (err) {
      console.warn('API error, falling back locally', err);
    }

    state.grnList.unshift({
      sr: state.grnList.length + 1,
      date: '31-10-2026',
      maker,
      customer,
      po,
      article,
      orderQty,
      rcvdPairs,
      balance,
      status: balance === 0 ? 'Received' : 'Partial'
    });

    showToast(`Goods Receipt (GRN) for PO #${po} successfully posted!`);
    renderApp();
  });

  document.getElementById('btn-clear-grn')?.addEventListener('click', () => {
    (document.getElementById('grn-maker') as HTMLSelectElement).value = '';
    (document.getElementById('grn-customer') as HTMLSelectElement).value = '';
    (document.getElementById('grn-po') as HTMLSelectElement).value = '';
    (document.getElementById('grn-article') as HTMLSelectElement).value = '';
    (document.getElementById('grn-order-qty') as HTMLInputElement).value = '';
    (document.getElementById('grn-rcvd-pairs') as HTMLInputElement).value = '';
    (document.getElementById('grn-balance') as HTMLInputElement).value = '';
    showToast('Form cleared.');
  });

  document.getElementById('btn-print-grn-slip')?.addEventListener('click', () => {
    const formMaker = (document.getElementById('grn-maker') as HTMLSelectElement)?.value;
    const formCust = (document.getElementById('grn-customer') as HTMLSelectElement)?.value;
    const formPo = (document.getElementById('grn-po') as HTMLSelectElement)?.value;
    const formArt = (document.getElementById('grn-article') as HTMLSelectElement)?.value;
    const formOrd = (document.getElementById('grn-order-qty') as HTMLInputElement)?.value;
    const formRcv = (document.getElementById('grn-rcvd-pairs') as HTMLInputElement)?.value;
    const formBal = (document.getElementById('grn-balance') as HTMLInputElement)?.value;

    const sample = state.grnList[0] || {
      maker: 'Hall B',
      customer: 'Northwind Safety Gear UK',
      po: '27347',
      article: 'Model A9 Stealth Black',
      orderQty: 3090,
      rcvdPairs: 942,
      balance: 2148
    };

    const maker = formMaker || sample.maker;
    const customer = formCust || sample.customer;
    const po = formPo || sample.po;
    const article = formArt || sample.article;
    const ordQty = formOrd || String(sample.orderQty || 3090);
    const rcvQty = formRcv || String(sample.rcvdPairs || 942);
    const balQty = formBal || String(sample.balance || 2148);

    const docHtml = `
      <div class="printable-slip-box">
        <div class="printable-slip-header">
          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; GOODS RECEIVING NOTE (GRN)</h2>
          <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">
            Dock #1 Inward Store Register &bull; Official Inward Goods Slip
          </p>
        </div>
        <div class="printable-meta-grid">
          <div><span>GRN Reference:</span> <strong>GRN-2026-${po}</strong></div>
          <div><span>System Date:</span> <strong>${new Date().toLocaleDateString('en-GB')}</strong></div>
          <div><span>Maker / Contractor:</span> <strong>${maker}</strong></div>
          <div><span>Customer / Buyer:</span> <strong>${customer}</strong></div>
          <div><span>Purchase Order #:</span> <strong>${po}</strong></div>
          <div><span>Article / Product:</span> <strong>${article}</strong></div>
          <div><span>Order Quantity:</span> <strong>${Number(ordQty).toLocaleString()} Pairs</strong></div>
          <div><span>Received Quantity:</span> <strong>${Number(rcvQty).toLocaleString()} Pairs</strong></div>
          <div><span>Balance Remaining:</span> <strong>${Number(balQty).toLocaleString()} Pairs</strong></div>
          <div><span>Vehicle Registration:</span> <strong>LES-4921 (Gate Pass Approved)</strong></div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 12px;">
          <thead>
            <tr style="background: var(--ink-100); color: var(--ink-950);">
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Size 7 / S</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Size 8 / M</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Size 9 / L</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Size 10 / XL</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center; background: var(--ink-200); font-weight: 800;">Total Received</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">${Math.round(Number(rcvQty) * 0.2)} Prs</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">${Math.round(Number(rcvQty) * 0.3)} Prs</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">${Math.round(Number(rcvQty) * 0.35)} Prs</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">${Math.max(0, Number(rcvQty) - Math.round(Number(rcvQty) * 0.85))} Prs</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center; font-weight: 800; color: var(--ink-950); font-size: 13px;">${Number(rcvQty).toLocaleString()} Pairs</td>
            </tr>
          </tbody>
        </table>

        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 24px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
          <span>Contractor Agent Sign: ___________________</span>
          <span>Dock #1 Receiver: ___________________</span>
          <span>Store Head Sign: ___________________</span>
        </div>
      </div>
    `;

    openModal(`Goods Receiving Slip - PO #${po}`, docHtml);
    printDocument(`Goods Receiving Slip - PO #${po}`, docHtml);
  });

  document.getElementById('btn-export-grn-excel')?.addEventListener('click', () => {
    exportTableToCSV('Store_Register_Inward_Goods.csv', state.grnList);
    showToast('Store Register exported as CSV/Excel.');
  });

  document.getElementById('btn-print-grn-summary')?.addEventListener('click', () => {
    const tableRows = state.grnList.map((g, i) => `
      <tr>
        <td style="border: 1px solid var(--border-strong); padding: 5px; text-align: center;">${i + 1}</td>
        <td style="border: 1px solid var(--border-strong); padding: 5px;"><strong>${g.maker}</strong></td>
        <td style="border: 1px solid var(--border-strong); padding: 5px;">${g.customer}</td>
        <td style="border: 1px solid var(--border-strong); padding: 5px;">${g.po}</td>
        <td style="border: 1px solid var(--border-strong); padding: 5px;"><strong>${g.article}</strong></td>
        <td style="border: 1px solid var(--border-strong); padding: 5px; text-align: right;">${g.orderQty.toLocaleString()}</td>
        <td style="border: 1px solid var(--border-strong); padding: 5px; text-align: right; font-weight: bold;">${g.rcvdPairs.toLocaleString()}</td>
        <td style="border: 1px solid var(--border-strong); padding: 5px; text-align: right; font-weight: bold;">${g.balance.toLocaleString()}</td>
      </tr>
    `).join('');

    const totOrder = state.grnList.reduce((acc, x) => acc + (x.orderQty || 0), 0);
    const totRcvd = state.grnList.reduce((acc, x) => acc + (x.rcvdPairs || 0), 0);
    const totBal = state.grnList.reduce((acc, x) => acc + (x.balance || 0), 0);

    const docHtml = `
      <div class="printable-slip-box">
        <div class="printable-slip-header">
          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; DAILY INWARD GOODS REGISTER SUMMARY</h2>
          <p style="margin: 3px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">
            Dock #1 Store Receiving Master Sheet &bull; Date: ${new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px;">
          <thead>
            <tr style="background: var(--ink-100); color: var(--ink-950);">
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">#</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Maker / Contractor</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Customer</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">PO #</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Article</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Order Qty</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Rcvd Pairs</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr style="background: var(--ink-50); font-weight: bold;">
              <td colspan="5" style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Total Daily Register Summary:</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">${totOrder.toLocaleString()}</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">${totRcvd.toLocaleString()}</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">${totBal.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 25px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
          <span>Shift Supervisor: ___________________</span>
          <span>Store Manager: ___________________</span>
          <span>Accounts Audit: ___________________</span>
        </div>
      </div>
    `;

    openModal('Daily Inward Goods Register Summary', docHtml);
    printDocument('Daily Inward Goods Register Summary', docHtml);
  });
}

// Handlers for Screen 3
function attachRepairHandlers(): void {
  document.getElementById('btn-complete-repair')?.addEventListener('click', async () => {
    const batchId = (document.getElementById('defect-batch-id') as HTMLSelectElement)?.value;
    if (!batchId) {
      showToast('Please select a Defect Batch ID.');
      return;
    }
    const cleanId = batchId.replace('ALT-', '').replace('DEF-', '');
    try {
      const res = await fetch(`/api/alterations/${cleanId}/repair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tailorName: (document.getElementById('defect-tailor') as HTMLInputElement)?.value || 'Supervisor A',
          isScrap: false
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Batch ${batchId} marked complete and auto-routed to STAGE 1 Checking.`);
        await syncBackendData();
        return;
      }
    } catch (err) {
      console.warn('Repair API fallback', err);
    }
    showToast(`Batch ${batchId} marked complete and auto-routed to STAGE 1 Checking.`);
  });

  document.getElementById('btn-log-scrap')?.addEventListener('click', async () => {
    const batchId = (document.getElementById('defect-batch-id') as HTMLSelectElement)?.value;
    if (!batchId) {
      showToast('Please select a Defect Batch ID.');
      return;
    }
    const cleanId = batchId.replace('ALT-', '').replace('DEF-', '');
    try {
      const res = await fetch(`/api/alterations/${cleanId}/repair`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tailorName: (document.getElementById('defect-tailor') as HTMLInputElement)?.value || 'Scrap Authority',
          isScrap: true,
          deductionRate: 50
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Batch ${batchId} logged as Scrap/Unrepairable with contractor deduction.`);
        await syncBackendData();
        return;
      }
    } catch (err) {
      console.warn('Scrap API fallback', err);
    }
    showToast(`Batch ${batchId} logged as Scrap/Unrepairable.`);
  });

  document.getElementById('btn-print-defect-tag')?.addEventListener('click', () => {
    const selBatch = (document.getElementById('defect-batch-id') as HTMLSelectElement)?.value;
    const selArt = (document.getElementById('defect-article') as HTMLSelectElement)?.value;
    const selPo = (document.getElementById('defect-po') as HTMLSelectElement)?.value;
    const selTailor = (document.getElementById('defect-tailor') as HTMLInputElement)?.value;
    const selQty = (document.getElementById('defect-qty') as HTMLInputElement)?.value;

    const sample = state.defectList[0] || {
      id: 'ALT-2026-0089',
      date: '2026-10-31',
      origin: 'Stage 1 Checking',
      article: 'Model A9 Stealth Black',
      po: '27347',
      defectClass: 'Stitching Skip / Broken Seam (سلائی ٹوٹ)',
      qty: '22',
      tailor: 'Supervisor A',
      status: 'In Rework' as const,
      route: 'Checking',
      actionText: 'Rework'
    };

    const batchId = selBatch || sample.id;
    const article = selArt || sample.article;
    const po = selPo || sample.po;
    const tailor = selTailor || sample.tailor;
    const qty = selQty || String(sample.qty);

    const docHtml = `
      <div style="border: 2px dashed var(--ink-900); padding: 18px; background: var(--white); color: var(--ink-950); font-family: sans-serif;">
        <div style="text-align: center; border-bottom: 2px solid var(--ink-900); padding-bottom: 10px; margin-bottom: 14px;">
          <div style="font-size: 18px; font-weight: 800; color: var(--ink-950); letter-spacing: 0.05em;">MANDATORY REWORK ROUTE TAG</div>
          <div style="font-size: 12px; font-weight: bold; color: var(--ink-600);">الٹریشن اور مرمت کا سرکاری روٹ کارڈ</div>
        </div>
        <div class="printable-meta-grid" style="color: var(--ink-950);">
          <div><span>Defect Batch ID:</span> <strong>${batchId}</strong></div>
          <div><span>Origin Station:</span> <strong>Stage 1 (Checking &amp; Inspection)</strong></div>
          <div><span>Article Name:</span> <strong>${article}</strong></div>
          <div><span>PO Number:</span> <strong>${po}</strong></div>
          <div><span>Defect Category:</span> <strong>Stitching Skip / Broken Seam (سلائی ٹوٹ)</strong></div>
          <div><span>Batch Quantity:</span> <strong>${qty} Pairs</strong></div>
          <div><span>Assigned Master Tailor:</span> <strong>${tailor}</strong></div>
          <div><span>Max Rework Policy:</span> <strong>Strict 2-Cycle Limit &rarr; Auto-Scrap</strong></div>
        </div>
        <div style="background: var(--ink-100); border: 1px solid var(--ink-900); padding: 10px; border-radius: 4px; text-align: center; font-weight: 800; font-size: 12px; margin: 14px 0; color: var(--ink-950);">
          SHOP-FLOOR ENFORCEMENT: ALL REPAIRED UNITS MUST RETURN DIRECTLY TO STAGE 1 CHECKING FOR 100% RE-INSPECTION. SKIPPING INSPECTION IS SYSTEM-BLOCKED.
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 20px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
          <span>Tailor Sign (درزی دستخط): _______________</span>
          <span>Alteration Bay Lead: _______________</span>
          <span>Re-Inspector Sign: _______________</span>
        </div>
      </div>
    `;

    openModal(`Defect Route Tag - ${batchId}`, docHtml);
    printDocument(`Defect Route Tag - ${batchId}`, docHtml);
  });

  document.getElementById('btn-export-pareto')?.addEventListener('click', () => {
    exportTableToCSV('Alteration_Rework_Pareto.csv', state.defectList);
    showToast('Rework Pareto Analysis CSV generated.');
  });

  document.getElementById('btn-print-defect-sheet')?.addEventListener('click', () => {
    const tableRows = state.defectList.map((d, i) => `
      <tr>
        <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">${i + 1}</td>
        <td style="border: 1px solid var(--border-strong); padding: 6px;"><strong>${d.id}</strong></td>
        <td style="border: 1px solid var(--border-strong); padding: 6px;">${d.article} (PO: ${d.po})</td>
        <td style="border: 1px solid var(--border-strong); padding: 6px;"><strong>${d.defectClass}</strong></td>
        <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: right; font-weight: bold;">${d.qty} Prs</td>
        <td style="border: 1px solid var(--border-strong); padding: 6px;">${d.tailor}</td>
        <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Cycle 1 / 2</td>
        <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: center; font-weight: bold;">${d.status}</td>
      </tr>
    `).join('');

    const totDefects = state.defectList.reduce((acc, x) => acc + (Number(x.qty) || 0), 0);

    const docHtml = `
      <div class="printable-slip-box">
        <div class="printable-slip-header">
          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; DAILY DEFECT &amp; ALTERATION SUMMARY LOG</h2>
          <p style="margin: 3px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">
            Alteration &amp; Repair Bay #2 &bull; Pareto Analysis &amp; Tailor Attribution &bull; Date: ${new Date().toLocaleDateString('en-GB')}
          </p>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 11px;">
          <thead>
            <tr style="background: var(--ink-100); color: var(--ink-950);">
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">#</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Batch ID</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Article &amp; PO</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Defect Reason</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Pairs</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px;">Master Tailor</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Reworks</th>
              <th style="border: 1px solid var(--border-strong); padding: 6px; text-align: center;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
            <tr style="background: var(--ink-50); font-weight: bold;">
              <td colspan="4" style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">Total Active Alteration Units:</td>
              <td style="border: 1px solid var(--border-strong); padding: 6px; text-align: right;">${totDefects} Pairs</td>
              <td colspan="3" style="border: 1px solid var(--border-strong); padding: 6px; text-align: center; color: var(--ink-600);">(Enforcing 100% Return to Stage 1)</td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 25px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
          <span>Alteration Supervisor: ___________________</span>
          <span>Lead QA Inspector: ___________________</span>
          <span>Plant Production Manager: ___________________</span>
        </div>
      </div>
    `;

    openModal('Daily Defect & Alteration Summary Log', docHtml);
    printDocument('Daily Defect & Alteration Summary Log', docHtml);
  });
}

// Handlers for Screen 4
function attachQCHandlers(): void {
  document.getElementById('btn-print-carton-labels')?.addEventListener('click', () => {
    const docHtml = `
      <div style="border: 2px solid var(--ink-950); padding: 20px; font-family: monospace; background: var(--white);">
        <div style="text-align: center; border-bottom: 2px solid var(--ink-950); padding-bottom: 10px; margin-bottom: 14px;">
          <div style="font-size: 19px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; EXPORT MASTER CARTON</div>
          <div style="font-size: 11px; color: var(--ink-600);">INTERNATIONAL EXPORT SHIPPING LABEL &bull; THERMAL DIRECT / A4</div>
        </div>
        <div class="printable-meta-grid" style="font-size: 12.5px;">
          <div><span>DESTINATION:</span> <strong>Northwind Safety Gear UK</strong></div>
          <div><span>CARTON NUMBER:</span> <strong>CTN-01 OF 28</strong></div>
          <div><span>ARTICLE:</span> <strong>Model A9 Stealth Black</strong></div>
          <div><span>PO NUMBER:</span> <strong>PO 27347</strong></div>
          <div><span>QUANTITY:</span> <strong>30 PAIRS</strong></div>
          <div><span>NET WEIGHT:</span> <strong>34.4 KG</strong></div>
          <div><span>GROSS WEIGHT:</span> <strong>148.8 KG</strong></div>
          <div><span>DIMENSIONS:</span> <strong>29 x 23 x 28 CM</strong></div>
          <div><span>QC TAMPER SEAL:</span> <strong>FSKD-4401 (VERIFIED)</strong></div>
          <div><span>AQL 1.5 AUDIT:</span> <strong>PASSED &bull; CLEARED FOR EXPORT</strong></div>
        </div>
        <div style="border: 2px solid var(--ink-950); padding: 14px; text-align: center; background: var(--ink-50); font-weight: 800; font-size: 15px; letter-spacing: 0.12em; margin: 14px 0;">
          ||||| ||||||| |||| |||||||| ||||| |||||| ||||||||<br/>
          *EAN13-5060129283741-CTN01*
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px dashed var(--ink-950); padding-top: 8px;">
          <span>Tamper Seal Status: VERIFIED &bull; INTACT</span>
          <span>Lead QA Inspector: Tariq Mehmood (QC ID: 4402)</span>
        </div>
      </div>
    `;

    openModal('Master Carton Shipping Labels (A4/Thermal)', docHtml);
    printDocument('Master Carton Shipping Labels (A4/Thermal)', docHtml);
  });

  document.getElementById('btn-export-packing-list')?.addEventListener('click', () => {
    exportTableToCSV('Master_Carton_Packing_List.csv', state.cartons);
    showToast('Commercial Export Packing List downloaded.');
  });

  document.getElementById('btn-dispatch-gate')?.addEventListener('click', async () => {
    openModal('Export Dispatch Clearance Slip', `
      <div style="text-align: center; padding: 10px;">
        <div style="color: var(--ink-950); font-size: 32px; margin-bottom: 6px;">✓</div>
        <h3 style="margin: 0; color: var(--ink-950);">CONTAINER GATE RELEASE AUTHORIZED</h3>
        <p style="color: var(--ink-600); font-size: 13px; margin-top: 4px;">AQL 1.5 final clearance and carton manifest audit completed.</p>
      </div>
    `);
  });
}

// Handlers for Packing Hall 5-Stage WIP Flow
function attachPackingHandlers(): void {
  // Batch select change
  document.getElementById('wip-batch-select')?.addEventListener('change', (e) => {
    const val = (e.target as HTMLSelectElement).value;
    state.packingWip.selectedBatch = val;
    if (val === 'REQ-2026-0042') {
      state.packingWip.buyer = 'Northwind Safety Gear UK';
      state.packingWip.po = '27347';
      state.packingWip.article = 'Model A9 Stealth Black';
      state.packingWip.plannedQty = 3090;
      state.packingWip.wipBatch = 'LOT-2026-0042-B1';
    } else if (val === 'REQ-2026-0043') {
      state.packingWip.buyer = 'Globex';
      state.packingWip.po = '3326';
      state.packingWip.article = 'Model A1 Stitched Gloves';
      state.packingWip.plannedQty = 2500;
      state.packingWip.wipBatch = 'LOT-2026-0043-B1';
    } else {
      state.packingWip.buyer = 'Northwind';
      state.packingWip.po = '27349';
      state.packingWip.article = 'Ottawa Heavy Work';
      state.packingWip.plannedQty = 1800;
      state.packingWip.wipBatch = 'LOT-2026-0044-B1';
    }
    showToast(`Loaded WIP batch ${val}`);
    renderApp();
  });

  // Stage 1 Modal
  document.getElementById('btn-wip-step1')?.addEventListener('click', () => {
    openModal('Process Stage 1: Checking & Inspection', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Separate first-pass good units from workmanship defects. Defect pairs are automatically isolated and routed to Alteration Bay #2.
        </p>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Good / Passed Pairs (Advance to Stage 2):</label>
          <input type="number" id="step1-good-input" class="form-input" value="${state.packingWip.stage1Passed}" />
        </div>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Defect Pairs (Route to Repair Bay #2):</label>
          <input type="number" id="step1-defect-input" class="form-input" value="${state.packingWip.stage1Defects}" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label>Defect Classification:</label>
          <select id="step1-defect-reason" class="form-select">
            <option value="Stitching Skip / Broken Seam">Stitching Skip / Broken Seam</option>
            <option value="Oil / Grease Stain">Oil / Grease Stain</option>
            <option value="Shade Mismatch">Shade Mismatch</option>
            <option value="Seam Cut (Unsalvageable)">Seam Cut (Unsalvageable)</option>
            <option value="Sizing Error / Fit Asymmetry">Sizing Error / Fit Asymmetry</option>
            <option value="Bad Edge Trimming">Bad Edge Trimming</option>
            <option value="Thermal Crease Defect">Thermal Crease Defect</option>
          </select>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-submit-step1-action">Confirm &amp; Advance Pairs &rarr;</button>
        </div>
      </div>
    `);

    document.getElementById('btn-submit-step1-action')?.addEventListener('click', () => {
      const good = parseInt((document.getElementById('step1-good-input') as HTMLInputElement)?.value || '0', 10);
      const defects = parseInt((document.getElementById('step1-defect-input') as HTMLInputElement)?.value || '0', 10);
      const reason = (document.getElementById('step1-defect-reason') as HTMLSelectElement)?.value || 'Stitching Skip';
      
      state.packingWip.stage1Passed = good;
      state.packingWip.stage1Defects = defects;
      state.packingWip.stage2In = good;
      
      if (defects > 0) {
        state.defectList.unshift({
          id: `DEF-${Date.now().toString().slice(-4)}`,
          date: '31-10-2026',
          origin: 'Stage 1 (Checking)',
          article: state.packingWip.article,
          po: state.packingWip.po,
          defectClass: reason,
          qty: `${defects} Prs`,
          tailor: 'Supervisor A',
          status: 'In Rework',
          route: 'Auto-Return to Stage 1 Checking',
          actionText: 'Update'
        });
      }
      closeModal();
      showToast(`${good} pairs advanced to Stage 2. ${defects} pairs routed to Repair Bay #2.`);
      renderApp();
    });
  });

  // Stage 2 Modal
  document.getElementById('btn-wip-step2')?.addEventListener('click', () => {
    openModal('Process Stage 2: Ironing & Brushing', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Steam press, crease removal, thread trimming, and thermal flattening verification.
        </p>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Ironed &amp; Finished Pairs (Advance to Stage 3):</label>
          <input type="number" id="step2-good-input" class="form-input" value="${state.packingWip.stage2Passed}" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label>Crease / Soil Rejects:</label>
          <input type="number" id="step2-defect-input" class="form-input" value="${state.packingWip.stage2Defects}" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-submit-step2-action">Advance to Pair Matching &rarr;</button>
        </div>
      </div>
    `);

    document.getElementById('btn-submit-step2-action')?.addEventListener('click', () => {
      const good = parseInt((document.getElementById('step2-good-input') as HTMLInputElement)?.value || '0', 10);
      const defects = parseInt((document.getElementById('step2-defect-input') as HTMLInputElement)?.value || '0', 10);
      state.packingWip.stage2Passed = good;
      state.packingWip.stage2Defects = defects;
      state.packingWip.stage3In = good;
      closeModal();
      showToast(`${good} pairs ironed and advanced to Stage 3.`);
      renderApp();
    });
  });

  // Stage 3 Modal
  document.getElementById('btn-wip-step3')?.addEventListener('click', () => {
    openModal('Process Stage 3: Pair Matching & BOM Calculation', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Verify Left/Right grain alignment, leather shade consistency, and size fidelity. Auto-computes Bill of Materials (BOM) for polybags and packaging trims.
        </p>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Matched Good Pairs:</label>
          <input type="number" id="step3-good-input" class="form-input" value="${state.packingWip.stage3Passed}" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label>Mismatch / Unpaired Gloves:</label>
          <input type="number" id="step3-defect-input" class="form-input" value="${state.packingWip.stage3Defects}" />
        </div>
        <div style="background: var(--ink-100); border: 1px solid var(--border-strong); border-radius: 4px; padding: 10px; margin-bottom: 14px;">
          <div style="font-weight: 700; color: var(--ink-950); margin-bottom: 4px;">Dynamic Packaging BOM Calculation:</div>
          <div style="font-size: 12px; color: var(--ink-600);">
            Polybags: <strong>${state.packingWip.stage3Passed} Pcs</strong> &bull; Hangtags: <strong>${state.packingWip.stage3Passed} Pcs</strong> &bull; Silica: <strong>${state.packingWip.stage3Passed} Sachets</strong> &bull; Barcodes: <strong>${state.packingWip.stage3Passed * 2} Pcs</strong> &bull; Master Cartons: <strong>${Math.ceil(state.packingWip.stage3Passed / 30)} Pcs</strong>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-submit-step3-action">Confirm &amp; Route to 1st Packing &rarr;</button>
        </div>
      </div>
    `);

    document.getElementById('btn-submit-step3-action')?.addEventListener('click', () => {
      const good = parseInt((document.getElementById('step3-good-input') as HTMLInputElement)?.value || '0', 10);
      state.packingWip.stage3Passed = good;
      state.packingWip.stage4In = good;
      state.packingWip.mreqQty = `${good} Sets`;
      closeModal();
      showToast(`${good} pairs matched. Packaging Bill of Materials (BOM) requisition updated.`);
      renderApp();
    });
  });

  // Generate & Print Material Requisition Slip directly
  document.getElementById('btn-wip-print-mreq')?.addEventListener('click', () => {
    const qty = state.packingWip.stage3Passed || 910;
    const mreqId = state.packingWip.mreqNo !== '---' ? state.packingWip.mreqNo : `MREQ-2026-${String(Date.now()).slice(-4)}`;
    state.packingWip.mreqNo = mreqId;
    state.packingWip.mreqQty = `${qty} Sets`;
    state.packingWip.mreqStatus = 'Printed';

    const docHtml = `
      <div class="printable-slip-box">
        <div class="printable-slip-header">
          <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; PACKING HALL REQUISITION SLIP</h2>
          <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">Packing Floor &bull; Packaging Trims &amp; Accessories Requisition</p>
        </div>
        <div class="printable-meta-grid">
          <div><span>Requisition #:</span> <strong>${mreqId}</strong></div>
          <div><span>Date:</span> <strong>31-10-2026</strong></div>
          <div><span>Batch / Lot:</span> <strong>${state.packingWip.selectedBatch}</strong></div>
          <div><span>Buyer / Article:</span> <strong>${state.packingWip.buyer || 'Northwind'} &bull; ${state.packingWip.article || 'Model A9'}</strong></div>
        </div>
        <table class="size-matrix-table" style="margin-bottom: 12px;">
          <thead>
            <tr><th>Item Code</th><th>Material Description</th><th style="text-align: right;">Required Qty</th></tr>
          </thead>
          <tbody>
            <tr><td>ACC-POLY-STD</td><td>Heavy Duty Polybag</td><td style="text-align: right; font-weight: bold;">${qty.toLocaleString()} pcs</td></tr>
            <tr><td>ACC-TAG-STD</td><td>Hangtag / Rider Card</td><td style="text-align: right; font-weight: bold;">${qty.toLocaleString()} pcs</td></tr>
            <tr><td>ACC-SILICA-2G</td><td>Silica Gel Moisture Sachet 2g</td><td style="text-align: right; font-weight: bold;">${qty.toLocaleString()} pouches</td></tr>
            <tr><td>STICKER_BARCODE</td><td>EAN-13 Barcode Sticker</td><td style="text-align: right; font-weight: bold;">${(qty * 2).toLocaleString()} pcs</td></tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 18px; border-top: 1px dashed var(--border-strong); padding-top: 8px;">
          <span>Packing Hall Supervisor: ___________________</span>
          <span>Issued By: ___________________</span>
        </div>
      </div>
    `;
    renderApp();
    openModal(`Packing Requisition Slip — ${mreqId}`, docHtml);
    printDocument(`Packing Requisition Slip — ${mreqId}`, docHtml);
  });

  // Stage 4 Modal
  document.getElementById('btn-wip-step4')?.addEventListener('click', () => {
    openModal('Process Stage 4: 1st Packing (Unit Polybag)', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Insert silica gel sachet, attach rider hangtag, seal airtight polybag, and affix scannable barcode label.
        </p>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Total Polybagged &amp; Labeled Pairs:</label>
          <input type="number" id="step4-packed-input" class="form-input" value="${state.packingWip.stage4Passed}" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label>Remaining in Progress:</label>
          <input type="number" id="step4-pending-input" class="form-input" value="${state.packingWip.stage4Pending}" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-submit-step4-action">Complete 1st Packing &rarr;</button>
        </div>
      </div>
    `);

    document.getElementById('btn-submit-step4-action')?.addEventListener('click', () => {
      const packed = parseInt((document.getElementById('step4-packed-input') as HTMLInputElement)?.value || '0', 10);
      const pending = parseInt((document.getElementById('step4-pending-input') as HTMLInputElement)?.value || '0', 10);
      state.packingWip.stage4Passed = packed;
      state.packingWip.stage4Pending = pending;
      closeModal();
      showToast(`${packed} unit polybags sealed with barcode verification.`);
      renderApp();
    });
  });

  // Stage 5 Modal
  document.getElementById('btn-wip-step5')?.addEventListener('click', () => {
    openModal('Process Stage 5: 2nd Packing (Master Cartons)', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Box 30 pairs per heavy 5-ply export master carton. Automatically generates tamper-evident QC seal serial numbers and computes tare weights.
        </p>
        <div class="form-group" style="margin-bottom: 12px;">
          <label>Cartons to Seal (30 prs/carton):</label>
          <input type="number" id="step5-cartons-input" class="form-input" value="28" />
        </div>
        <div class="form-group" style="margin-bottom: 16px;">
          <label>Carton Seal Batch Prefix:</label>
          <input type="text" id="step5-prefix-input" class="form-input" value="FSKD-44" />
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-submit-step5-action">Seal &amp; Add to Shipping Manifest &rarr;</button>
        </div>
      </div>
    `);

    document.getElementById('btn-submit-step5-action')?.addEventListener('click', () => {
      const numCartons = parseInt((document.getElementById('step5-cartons-input') as HTMLInputElement)?.value || '28', 10);
      state.packingWip.outputCartons = numCartons;
      state.packingWip.outputPairs = numCartons * 30;
      state.packingWip.stage5Cartons = `${numCartons} Cartons (${numCartons * 30} Prs)`;
      
      // Auto populate cartons
      state.cartons = Array.from({ length: numCartons }, (_, i) => ({
        cartonNo: `CTN-${String(i + 1).padStart(2, '0')}`,
        pairs: 30,
        netWt: '4.8 kg',
        grossWt: '5.3 kg',
        dims: '29 x 23 x 28',
        barcodeVerified: true,
        sealNo: `FSKD-44${String(i + 1).padStart(2, '0')}`,
        status: 'Approved (AQL 1.5)'
      }));

      closeModal();
      showToast(`${numCartons} Master Cartons sealed and logged into Shipping Manifest!`);
      renderApp();
    });
  });

  // Generate & Print New Glove Requisition from Packing Hall
  document.getElementById('btn-wip-new-req')?.addEventListener('click', () => {
    openModal('Generate & Print Packing Hall Requisition', `
      <div style="font-size: 13px;">
        <p style="margin-bottom: 12px; color: var(--ink-600);">
          Generate a production requisition slip from the Packing Hall and print it directly.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
          <div class="form-group">
            <label>Buyer / Customer</label>
            <select id="new-req-customer" class="form-select">
              ${state.dropdownOptions.customers.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Article</label>
            <select id="new-req-article" class="form-select">
              ${state.dropdownOptions.articles.map(a => `<option value="${a}">${a}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>PO Number</label>
            <select id="new-req-po" class="form-select">
              ${state.dropdownOptions.poList.map(p => `<option value="${p}">PO ${p}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Requested Pairs</label>
            <input type="number" id="new-req-pairs" class="form-input" value="1000" min="1" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
          <button class="btn-primary" id="btn-confirm-lot-draw">Generate &amp; Print Requisition &rarr;</button>
        </div>
      </div>
    `, false);

    document.getElementById('btn-confirm-lot-draw')?.addEventListener('click', () => {
      const customer = (document.getElementById('new-req-customer') as HTMLSelectElement)?.value || 'Northwind';
      const article = (document.getElementById('new-req-article') as HTMLSelectElement)?.value || 'Model A9';
      const po = (document.getElementById('new-req-po') as HTMLSelectElement)?.value || '27347';
      const pairs = parseInt((document.getElementById('new-req-pairs') as HTMLInputElement)?.value || '1000', 10);
      const reqId = `REQ-2026-${String(Date.now()).slice(-4)}`;

      state.packingWip.selectedBatch = reqId;
      state.packingWip.buyer = customer;
      state.packingWip.article = article;
      state.packingWip.po = po;
      state.packingWip.plannedQty = pairs;
      state.packingWip.wipBatch = `LOT-${reqId}-B1`;
      state.packingWip.stage1In = pairs;

      const slipHtml = `
        <div class="printable-slip-box">
          <div class="printable-slip-header">
            <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; PACKING HALL REQUISITION</h2>
            <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">
              Packing Hall Production Draw Requisition Slip
            </p>
          </div>
          <div class="printable-meta-grid">
            <div><span>Requisition #:</span> <strong>${reqId}</strong></div>
            <div><span>Date:</span> <strong>31-10-2026</strong></div>
            <div><span>Customer / Buyer:</span> <strong>${customer}</strong></div>
            <div><span>PO Number:</span> <strong>PO ${po}</strong></div>
            <div><span>Article:</span> <strong>${article}</strong></div>
            <div><span>Requested Quantity:</span> <strong>${pairs.toLocaleString()} Pairs</strong></div>
            <div><span>Lot Batch ID:</span> <strong>LOT-${reqId}-B1</strong></div>
            <div><span>Origin Station:</span> <strong>Packing Hall #1</strong></div>
          </div>
          <table class="size-matrix-table" style="margin-bottom: 14px;">
            <thead>
              <tr>
                <th>Article</th>
                <th>PO Reference</th>
                <th>Polybags (1/Pr)</th>
                <th>Silica (1/Pr)</th>
                <th>Barcodes (2/Pr)</th>
                <th>Total Pairs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${article}</strong></td>
                <td>PO ${po}</td>
                <td>${pairs.toLocaleString()} pcs</td>
                <td>${pairs.toLocaleString()} pcs</td>
                <td>${(pairs * 2).toLocaleString()} pcs</td>
                <td style="font-weight: 800;">${pairs.toLocaleString()} Pairs</td>
              </tr>
            </tbody>
          </table>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 22px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
            <span>Packing Hall Supervisor: ___________________</span>
            <span>Production Manager: ___________________</span>
          </div>
        </div>
      `;

      renderApp();
      openModal(`Requisition Slip — ${reqId}`, slipHtml, true);
      printDocument(`Requisition Slip — ${reqId}`, slipHtml);
      showToast(`Requisition ${reqId} generated and ready to print.`);
    });
  });

  // Shift log export
  document.getElementById('btn-wip-export-shift')?.addEventListener('click', () => {
    exportTableToCSV('Packing_Hall_Shift_Execution_Log.csv', [
      {
        Batch: state.packingWip.selectedBatch,
        Buyer: state.packingWip.buyer,
        PO: state.packingWip.po,
        Article: state.packingWip.article,
        PlannedQty: state.packingWip.plannedQty,
        Stage1Passed: state.packingWip.stage1Passed,
        Stage1Defects: state.packingWip.stage1Defects,
        Stage2Passed: state.packingWip.stage2Passed,
        Stage3Matched: state.packingWip.stage3Passed,
        Stage4Polybagged: state.packingWip.stage4Passed,
        Stage5CartonsPacked: state.packingWip.outputCartons,
        Efficiency: state.packingWip.lineEfficiency
      }
    ]);
    showToast('Packing Hall Shift Execution Log downloaded.');
  });

  document.getElementById('btn-wip-print-labels')?.addEventListener('click', () => {
    openDocumentCenterModal('carton');
    const preview = document.getElementById('doc-preview-container');
    if (preview) printDocument('Meridian-Doc-carton', preview.innerHTML);
  });

  document.getElementById('btn-wip-final-clearance')?.addEventListener('click', () => {
    state.activeScreen = 'screen-qc';
    renderApp();
    showToast('Navigated to Final Inspection & Master Carton Clearance.');
  });
}

// Function to open Multi-Size Matrix Modal for Goods Receiving
function openSizeMatrixModal(): void {
  const makers = state.dropdownOptions.makers;
  const customers = state.dropdownOptions.customers;
  const poList = state.dropdownOptions.poList;
  const articles = state.dropdownOptions.articles;

  openModal('Dock #1 Inward Goods Receiving — Multi-Size Matrix Breakdown', `
    <div style="font-size: 13px; color: var(--ink-800);">
      <p style="margin-bottom: 12px; color: var(--ink-600);">
        Physical arrival registration with breakdown across standard glove sizes (7/S, 8/M, 9/L, 10/XL, 11/XXL) and transport verification.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
        <div class="form-group">
          <label>Maker / Contractor</label>
          <select id="sm-maker" class="form-select">
            <option value="">-- Select Maker --</option>
            ${makers.map(m => `<option value="${m}">${m}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Customer</label>
          <select id="sm-customer" class="form-select">
            <option value="">-- Select Customer --</option>
            ${customers.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">
        <div class="form-group">
          <label>PO Number</label>
          <select id="sm-po" class="form-select">
            <option value="">-- Select PO --</option>
            ${poList.map(p => `<option value="${p}">PO ${p}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Article Name</label>
          <select id="sm-article" class="form-select">
            <option value="">-- Select Article --</option>
            ${articles.map(a => `<option value="${a}">${a}</option>`).join('')}
          </select>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px;">
        <div class="form-group">
          <label>Challan Number</label>
          <input type="text" id="sm-challan" class="form-input" placeholder="e.g. CH-2026-88" value="CH-${Date.now().toString().slice(-4)}" />
        </div>
        <div class="form-group">
          <label>Vehicle Reg Number</label>
          <input type="text" id="sm-vehicle" class="form-input" placeholder="e.g. FD-4912" value="LES-4921" />
        </div>
        <div class="form-group">
          <label>Gate Pass Number</label>
          <input type="text" id="sm-gatepass" class="form-input" placeholder="e.g. GP-9011" value="GP-${Date.now().toString().slice(-4)}" />
        </div>
      </div>

      <div style="background: var(--ink-50); border: 1px solid var(--border-strong); border-radius: 4px; padding: 10px; margin-bottom: 14px;">
        <div style="font-weight: 700; color: var(--ink-950); margin-bottom: 6px; font-size: 12px; text-transform: uppercase;">
          Size Breakdown Allocation (Pairs)
        </div>
        <table class="size-matrix-table">
          <thead>
            <tr>
              <th>7 / S</th>
              <th>8 / M</th>
              <th>9 / L</th>
              <th>10 / XL</th>
              <th>11 / XXL</th>
              <th style="background: var(--ink-200); color: var(--ink-950);">Total Pairs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" class="size-matrix-input sm-size-val" data-size="7" value="180" /></td>
              <td><input type="number" class="size-matrix-input sm-size-val" data-size="8" value="280" /></td>
              <td><input type="number" class="size-matrix-input sm-size-val" data-size="9" value="300" /></td>
              <td><input type="number" class="size-matrix-input sm-size-val" data-size="10" value="150" /></td>
              <td><input type="number" class="size-matrix-input sm-size-val" data-size="11" value="32" /></td>
              <td style="font-weight: 800; font-size: 14px; color: var(--ink-950);" id="sm-total-display">942</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px;">
        <div class="form-group">
          <label>Contract Order Qty (Pairs)</label>
          <input type="number" id="sm-order-qty" class="form-input" value="3090" />
        </div>
        <div class="form-group">
          <label>Remaining Contract Balance</label>
          <input type="number" id="sm-balance" class="form-input" value="2148" readonly />
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Cancel</button>
        <button class="btn-primary" id="btn-submit-size-matrix">Confirm &amp; Post to Store Register &rarr;</button>
      </div>
    </div>
  `);

  function recalcSizes() {
    let total = 0;
    document.querySelectorAll('.sm-size-val').forEach(input => {
      total += parseInt((input as HTMLInputElement).value || '0', 10);
    });
    const orderQty = parseInt((document.getElementById('sm-order-qty') as HTMLInputElement)?.value || '0', 10);
    const totalDisplay = document.getElementById('sm-total-display');
    const balanceInput = document.getElementById('sm-balance') as HTMLInputElement;
    if (totalDisplay) totalDisplay.textContent = total.toLocaleString();
    if (balanceInput) balanceInput.value = Math.max(0, orderQty - total).toString();
  }

  document.querySelectorAll('.sm-size-val').forEach(input => {
    input.addEventListener('input', recalcSizes);
  });
  document.getElementById('sm-order-qty')?.addEventListener('input', recalcSizes);

  document.getElementById('btn-submit-size-matrix')?.addEventListener('click', async () => {
    const maker = (document.getElementById('sm-maker') as HTMLSelectElement)?.value;
    const customer = (document.getElementById('sm-customer') as HTMLSelectElement)?.value;
    const po = (document.getElementById('sm-po') as HTMLSelectElement)?.value;
    const article = (document.getElementById('sm-article') as HTMLSelectElement)?.value;
    const orderQty = parseInt((document.getElementById('sm-order-qty') as HTMLInputElement)?.value || '0', 10);
    
    let totalRcvd = 0;
    document.querySelectorAll('.sm-size-val').forEach(input => {
      totalRcvd += parseInt((input as HTMLInputElement).value || '0', 10);
    });

    if (!maker || !po || totalRcvd <= 0) {
      showToast('Please select Maker, PO, and enter size quantities.');
      return;
    }

    // Try posting to SQLite API
    try {
      const resp = await fetch('/api/store/receivings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          makerContractor: maker,
          customerName: customer || 'Northwind',
          poNumber: po,
          articleName: article || 'Model A9',
          orderQty: orderQty || totalRcvd,
          rcvdPairs: totalRcvd,
          date: '31-10-2026'
        })
      });
      const data = await resp.json();
      if (data.success) {
        showToast(`GRN with Size Matrix posted to SQLite (GRN #${data.data.rcvNumber})!`);
        closeModal();
        await syncBackendData();
        return;
      }
    } catch (e) {
      console.warn('API fallback', e);
    }

    state.grnList.unshift({
      sr: state.grnList.length + 1,
      date: '31-10-2026',
      maker,
      customer: customer || 'Northwind',
      po,
      article: article || 'Model A9',
      orderQty: orderQty || totalRcvd,
      rcvdPairs: totalRcvd,
      balance: Math.max(0, (orderQty || totalRcvd) - totalRcvd),
      status: totalRcvd >= (orderQty || totalRcvd) ? 'Received' : 'Partial'
    });

    closeModal();
    showToast(`GRN with Size Matrix for PO #${po} added to Store Register!`);
    renderApp();
  });
}

// Function to open Printable Documents & Voucher Center
function openDocumentCenterModal(defaultDoc: string = 'grn'): void {
  function getDocHTML(type: string): string {
    if (type === 'grn') {
      return `
        <div class="printable-slip-box">
          <div class="printable-slip-header">
            <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; GOODS RECEIVING NOTE (GRN)</h2>
            <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">
              Dock #1 Inward Store Register &bull; Official Materials Arrival Voucher
            </p>
          </div>
          <div class="printable-meta-grid">
            <div><span>GRN Reference:</span> <strong>GRN-2026-0042</strong></div>
            <div><span>System Date:</span> <strong>31-10-2026</strong></div>
            <div><span>Maker / Contractor:</span> <strong>Hall B</strong></div>
            <div><span>Customer:</span> <strong>Northwind Safety Gear UK</strong></div>
            <div><span>Purchase Order #:</span> <strong>PO 27347</strong></div>
            <div><span>Article Name:</span> <strong>Model A9 Stealth Black</strong></div>
            <div><span>Challan Number:</span> <strong>CH-8829</strong></div>
            <div><span>Vehicle Registration:</span> <strong>LES-4921</strong></div>
          </div>
          <table class="size-matrix-table" style="margin-bottom: 12px;">
            <thead>
              <tr>
                <th>Size 7 / S</th>
                <th>Size 8 / M</th>
                <th>Size 9 / L</th>
                <th>Size 10 / XL</th>
                <th>Size 11 / XXL</th>
                <th style="background: var(--ink-200); color: var(--ink-950);">Total Received</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>180 Prs</td>
                <td>280 Prs</td>
                <td>300 Prs</td>
                <td>150 Prs</td>
                <td>32 Prs</td>
                <td style="font-weight: 800; color: var(--ink-950); font-size: 14px;">942 Pairs</td>
              </tr>
            </tbody>
          </table>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 18px; border-top: 1px dashed var(--border-strong); padding-top: 10px;">
            <span>Contractor Delivery Agent: ___________________</span>
            <span>Dock #1 Receiver: ___________________</span>
            <span>Store Manager: ___________________</span>
          </div>
        </div>
      `;
    } else if (type === 'route') {
      return `
        <div style="border: 2px dashed var(--ink-900); padding: 16px; background: var(--white); font-family: sans-serif; color: var(--ink-950);">
          <div style="text-align: center; border-bottom: 2px solid var(--ink-900); padding-bottom: 8px; margin-bottom: 12px;">
            <div style="font-size: 16px; font-weight: 800; color: var(--ink-950); letter-spacing: 0.04em;">MANDATORY REWORK ROUTE TAG</div>
            <div style="font-size: 12px; font-weight: bold; color: var(--ink-600);">الٹریشن اور مرمت کا سرکاری روٹ کارڈ</div>
          </div>
          <div class="printable-meta-grid" style="color: var(--ink-950);">
            <div><span>Defect Batch ID:</span> <strong>ALT-2026-0089</strong></div>
            <div><span>Origin Stage:</span> <strong>Stage 1 (Checking &amp; Inspection)</strong></div>
            <div><span>Article Name:</span> <strong>Model A9 Stealth Black</strong></div>
            <div><span>PO Number:</span> <strong>27347</strong></div>
            <div><span>Defect Classification:</span> <strong>Stitching Skip / Broken Seam (سلائی ٹوٹ)</strong></div>
            <div><span>Batch Quantity:</span> <strong>22 Pairs</strong></div>
            <div><span>Assigned Master Tailor:</span> <strong>Supervisor A</strong></div>
            <div><span>Max Allowed Reworks:</span> <strong>2 Cycles (Strict Scrap Rule)</strong></div>
          </div>
          <div style="background: var(--ink-100); border: 1px solid var(--ink-900); padding: 10px; border-radius: 4px; text-align: center; font-weight: 800; font-size: 12px; margin-top: 12px;">
            FACTORY MANDATORY RULE: EVERY REPAIRED PAIR MUST AUTO-RETURN TO STAGE 1 (CHECKING). SKIPPING STAGES IS STRICTLY SYSTEM-LOCKED.
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 20px; border-top: 1px dashed var(--ink-500); padding-top: 8px;">
            <span>Tailor Sign (درزی دستخط): _______________</span>
            <span>Bay #2 Lead: _______________</span>
            <span>Re-Checking Inspector: _______________</span>
          </div>
        </div>
      `;
    } else if (type === 'mreq') {
      return `
        <div class="printable-slip-box">
          <div class="printable-slip-header">
            <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; PACKING HALL REQUISITION SLIP</h2>
            <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">Packing Floor &bull; Packaging Trims &amp; Accessories Requisition</p>
          </div>
          <div class="printable-meta-grid">
            <div><span>Requisition #:</span> <strong>MREQ-2026-0018</strong></div>
            <div><span>Date:</span> <strong>31-10-2026</strong></div>
            <div><span>Batch / Lot:</span> <strong>REQ-2026-0042</strong></div>
            <div><span>Buyer / Article:</span> <strong>Northwind &bull; Model A9</strong></div>
          </div>
          <table class="size-matrix-table" style="margin-bottom: 12px;">
            <thead>
              <tr><th>Item Code</th><th>Material Description</th><th style="text-align: right;">Required Qty</th></tr>
            </thead>
            <tbody>
              <tr><td>ACC-POLY-STD</td><td>Standard Heavy Duty Polybag</td><td style="text-align: right; font-weight: bold;">910 pcs</td></tr>
              <tr><td>ACC-TAG-STD</td><td>Northwind Genuine Hangtag / Rider</td><td style="text-align: right; font-weight: bold;">910 pcs</td></tr>
              <tr><td>ACC-SILICA-2G</td><td>Silica Gel Moisture Sachet 2g</td><td style="text-align: right; font-weight: bold;">910 pouches</td></tr>
              <tr><td>STICKER_BARCODE</td><td>EAN-13 Scannable Barcode Sticker</td><td style="text-align: right; font-weight: bold;">1,820 pcs</td></tr>
            </tbody>
          </table>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 18px; border-top: 1px dashed var(--border-strong); padding-top: 8px;">
            <span>Packing Hall Supervisor: ___________________</span>
            <span>Issued By: ___________________</span>
          </div>
        </div>
      `;
    } else if (type === 'carton') {
      return `
        <div style="border: 2px solid var(--ink-950); padding: 18px; font-family: monospace; background: var(--white);">
          <div style="text-align: center; border-bottom: 2px solid var(--ink-950); padding-bottom: 8px; margin-bottom: 12px;">
            <div style="font-size: 18px; font-weight: 800; color: var(--ink-950);">MERIDIAN WORKS &bull; EXPORT MASTER CARTON</div>
            <div style="font-size: 11px; color: var(--ink-600);">INTERNATIONAL EXPORT SHIPPING LABEL &bull; THERMAL DIRECT / A4</div>
          </div>
          <div class="printable-meta-grid">
            <div><span>DESTINATION:</span> <strong>Northwind Safety Gear UK</strong></div>
            <div><span>CARTON NUMBER:</span> <strong>CTN-01 OF 28</strong></div>
            <div><span>ARTICLE:</span> <strong>Model A9 Stealth Black</strong></div>
            <div><span>PO NUMBER:</span> <strong>27347</strong></div>
            <div><span>QUANTITY:</span> <strong>30 PAIRS</strong></div>
            <div><span>NET WEIGHT:</span> <strong>34.4 KG</strong></div>
            <div><span>GROSS WEIGHT:</span> <strong>148.8 KG</strong></div>
            <div><span>DIMENSIONS:</span> <strong>29 x 23 x 28 CM</strong></div>
            <div><span>QC TAMPER SEAL:</span> <strong>FSKD-4401</strong></div>
            <div><span>AQL 1.5 AUDIT:</span> <strong>PASSED &bull; CLEARED</strong></div>
          </div>
          <div style="border: 1px solid var(--ink-950); padding: 10px; text-align: center; background: var(--ink-50); font-weight: 800; font-size: 14px; letter-spacing: 0.1em; margin-bottom: 12px;">
            ||||| ||||||| |||| |||||||| ||||| |||||| ||||||||<br/>
            *EAN13-5060129283741-CTN01*
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; border-top: 1px dashed var(--ink-950); padding-top: 8px;">
            <span>Tamper Seal Status: VERIFIED &bull; INTACT</span>
            <span>Lead QA Inspector: Tariq Mehmood (QC ID: 4402)</span>
          </div>
        </div>
      `;
    } else if (type === 'packing') {
      return `
        <div class="printable-slip-box">
          <div class="printable-slip-header">
            <h2 style="margin: 0; font-size: 16px; font-weight: 800; color: var(--ink-950);">COMMERCIAL EXPORT PACKING LIST MANIFEST</h2>
            <p style="margin: 2px 0 0; font-size: 11px; text-transform: uppercase; color: var(--ink-600);">Meridian Works &bull; Customs Clearance &amp; Container Gate Release</p>
          </div>
          <div class="printable-meta-grid">
            <div><span>Shipper:</span> <strong>Meridian Works (Pvt) Ltd</strong></div>
            <div><span>Consignee:</span> <strong>Northwind Safety Gear UK</strong></div>
            <div><span>Port of Loading:</span> <strong>Port A</strong></div>
            <div><span>Container #:</span> <strong>MSKU-449102-1</strong></div>
            <div><span>Total Cartons:</span> <strong>28 Cartons</strong></div>
            <div><span>Total Pairs:</span> <strong>840 Pairs</strong></div>
            <div><span>Total Net Weight:</span> <strong>134.4 kg</strong></div>
            <div><span>Total Gross Weight:</span> <strong>148.8 kg</strong></div>
            <div><span>Total Volume:</span> <strong>2.35 CBM</strong></div>
            <div><span>Inspection Standard:</span> <strong>AQL 1.5 Normal Single Sampling</strong></div>
          </div>
          <div style="margin-top: 12px; font-size: 12px; background: var(--ink-100); border: 1px solid var(--border-strong); padding: 8px; border-radius: 4px; color: var(--ink-950); font-weight: bold; text-align: center;">
            ✓ ALL 28 CARTONS CLEARED FOR EXPORT CONTAINER LOADING
          </div>
        </div>
      `;
    } else {
      return '';
    }
  }

  function renderModalInner(activeTab: string) {
    return `
      <div>
        <div style="display: flex; gap: 6px; margin-bottom: 12px; overflow-x: auto; border-bottom: 1px solid var(--ink-200); padding-bottom: 8px;">
          <button class="btn-outline doc-tab-btn ${activeTab === 'grn' ? 'btn-primary' : ''}" data-doc="grn" style="font-size: 11px; padding: 4px 8px;">1. Inward GRN Slip</button>
          <button class="btn-outline doc-tab-btn ${activeTab === 'route' ? 'btn-primary' : ''}" data-doc="route" style="font-size: 11px; padding: 4px 8px;">2. Defect Route Tag</button>
          <button class="btn-outline doc-tab-btn ${activeTab === 'mreq' ? 'btn-primary' : ''}" data-doc="mreq" style="font-size: 11px; padding: 4px 8px;">3. Packing Requisition</button>
          <button class="btn-outline doc-tab-btn ${activeTab === 'carton' ? 'btn-primary' : ''}" data-doc="carton" style="font-size: 11px; padding: 4px 8px;">4. Shipping Label</button>
          <button class="btn-outline doc-tab-btn ${activeTab === 'packing' ? 'btn-primary' : ''}" data-doc="packing" style="font-size: 11px; padding: 4px 8px;">5. Export Packing List</button>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: var(--ink-50); padding: 6px 10px; border-radius: 4px; border: 1px solid var(--ink-200);">
          <span style="font-size: 11.5px; color: var(--ink-600); font-weight: 600;">Document Output Preview (Print Ready)</span>
          <div style="display: flex; gap: 6px;">
            <button class="btn-primary" id="btn-quick-print-doc" style="font-size: 11.5px; padding: 4px 10px; display: inline-flex; align-items: center; gap: 4px;">
              Print Current Tab
            </button>
          </div>
        </div>

        <div id="doc-preview-container">
          ${getDocHTML(activeTab)}
        </div>
      </div>
    `;
  }

  openModal('Factory Document &amp; Printable Voucher Center', renderModalInner(defaultDoc));

  document.querySelectorAll('.doc-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const docType = (e.currentTarget as HTMLElement).getAttribute('data-doc') || 'grn';
      openDocumentCenterModal(docType);
    });
  });

  document.getElementById('btn-quick-print-doc')?.addEventListener('click', () => {
    const docContainer = document.getElementById('doc-preview-container');
    const content = docContainer ? docContainer.innerHTML : '';
    printDocument(`Meridian-Doc-${defaultDoc}`, content);
  });
}

// Function to open ISO 2859-1 (Level II) AQL 1.5 Sampling Calculator Modal
function openAqlCalculatorModal(): void {
  openModal('ISO 2859-1 (Level II) AQL 1.5 Sampling Calculator', `
    <div style="font-size: 13px; color: var(--ink-800);">
      <p style="margin: 0 0 12px; color: var(--ink-600);">
        Automated ISO 2859-1 Normal Single Sampling Plan (AQL 1.5) decision matrix for glove export lots and carton quarantine enforcement.
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 14px;">
        <div class="form-group">
          <label>Lot Size (Total Pairs)</label>
          <input type="number" id="aql-lot-size" class="form-input" value="840" min="1" />
        </div>
        <div class="form-group">
          <label>AQL Standard</label>
          <select id="aql-target" class="form-select" disabled>
            <option value="1.5">AQL 1.5 (Level II Normal)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Found Defects (Sample)</label>
          <input type="number" id="aql-found-defects" class="form-input" value="0" min="0" />
        </div>
      </div>

      <div id="aql-result-box" style="background: var(--ink-50); border: 1px solid var(--border-strong); border-radius: 6px; padding: 14px; margin-bottom: 16px;">
        <!-- Dynamically calculated content -->
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 11px; color: var(--ink-500);">Standard: ISO 2859-1 / ANSI/ASQ Z1.4</span>
        <div style="display: flex; gap: 8px;">
          <button class="btn-outline" onclick="document.getElementById('global-modal').classList.remove('open')">Close</button>
          <button class="btn-primary" id="btn-apply-aql-audit">Apply Audit Result to Active Lot &rarr;</button>
        </div>
      </div>
    </div>
  `);

  function updateAqlCalculation() {
    const lotSize = parseInt((document.getElementById('aql-lot-size') as HTMLInputElement)?.value || '840', 10);
    const defects = parseInt((document.getElementById('aql-found-defects') as HTMLInputElement)?.value || '0', 10);
    
    // ISO 2859-1 Level II logic
    let code = 'A';
    let sampleSize = 2;
    let acceptLimit = 0;
    let rejectLimit = 1;

    if (lotSize <= 8) { code = 'A'; sampleSize = 2; acceptLimit = 0; rejectLimit = 1; }
    else if (lotSize <= 15) { code = 'B'; sampleSize = 3; acceptLimit = 0; rejectLimit = 1; }
    else if (lotSize <= 25) { code = 'C'; sampleSize = 5; acceptLimit = 0; rejectLimit = 1; }
    else if (lotSize <= 50) { code = 'D'; sampleSize = 8; acceptLimit = 0; rejectLimit = 1; }
    else if (lotSize <= 90) { code = 'E'; sampleSize = 13; acceptLimit = 0; rejectLimit = 1; }
    else if (lotSize <= 150) { code = 'F'; sampleSize = 20; acceptLimit = 1; rejectLimit = 2; }
    else if (lotSize <= 280) { code = 'G'; sampleSize = 32; acceptLimit = 1; rejectLimit = 2; }
    else if (lotSize <= 500) { code = 'H'; sampleSize = 50; acceptLimit = 2; rejectLimit = 3; }
    else if (lotSize <= 1200) { code = 'J'; sampleSize = 80; acceptLimit = 3; rejectLimit = 4; }
    else if (lotSize <= 3200) { code = 'K'; sampleSize = 125; acceptLimit = 5; rejectLimit = 6; }
    else if (lotSize <= 10000) { code = 'L'; sampleSize = 200; acceptLimit = 7; rejectLimit = 8; }
    else { code = 'M'; sampleSize = 315; acceptLimit = 10; rejectLimit = 11; }

    const isPassed = defects <= acceptLimit;

    const resultBox = document.getElementById('aql-result-box');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; text-align: center; margin-bottom: 12px;">
          <div style="background: var(--white); border: 1px solid var(--ink-200); padding: 8px; border-radius: 4px;">
            <div style="font-size: 11px; color: var(--ink-500);">Code Letter</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ink-950);">${code}</div>
          </div>
          <div style="background: var(--white); border: 1px solid var(--ink-200); padding: 8px; border-radius: 4px;">
            <div style="font-size: 11px; color: var(--ink-500);">Sample Size</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ink-950);">${sampleSize} Prs</div>
          </div>
          <div style="background: var(--white); border: 1px solid var(--ink-200); padding: 8px; border-radius: 4px;">
            <div style="font-size: 11px; color: var(--ink-500);">Accept (Ac)</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ink-950);">&le; ${acceptLimit}</div>
          </div>
          <div style="background: var(--white); border: 1px solid var(--ink-200); padding: 8px; border-radius: 4px;">
            <div style="font-size: 11px; color: var(--ink-500);">Reject (Re)</div>
            <div style="font-size: 18px; font-weight: 800; color: var(--ink-950);">&ge; ${rejectLimit}</div>
          </div>
        </div>
        <div style="padding: 10px; border-radius: 4px; text-align: center; font-weight: 800; font-size: 13px; background: ${isPassed ? 'var(--ink-100)' : 'var(--ink-200)'}; border: 1px solid var(--ink-900); color: var(--ink-950);">
          ${isPassed ? `✓ AQL 1.5 PASSED &mdash; Found ${defects} defects &le; ${acceptLimit} allowed. Entire lot of ${lotSize.toLocaleString()} pairs approved for export.` : `✗ QUARANTINED &mdash; Found ${defects} defects &ge; ${rejectLimit} rejection limit. Lot quarantined for 100% rework.`}
        </div>
      `;
    }
  }

  document.getElementById('aql-lot-size')?.addEventListener('input', updateAqlCalculation);
  document.getElementById('aql-found-defects')?.addEventListener('input', updateAqlCalculation);
  updateAqlCalculation();

  document.getElementById('btn-apply-aql-audit')?.addEventListener('click', async () => {
    const defects = parseInt((document.getElementById('aql-found-defects') as HTMLInputElement)?.value || '0', 10);
    try {
      const resp = await fetch(`/api/qc/${state.packingWip.selectedBatch}/aql-audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foundDefects: defects,
          inspectorId: '4402',
          inspectorName: 'Tariq Mehmood'
        })
      });
      const data = await resp.json();
      if (data.success) {
        showToast(`AQL Audit logged to SQLite! Status: ${data.data.verdict}`);
      }
    } catch (e) {
      console.warn('AQL audit offline fallback', e);
    }

    state.qcChecklist.forEach(c => c.passed = (defects <= 3));
    closeModal();
    renderApp();
    showToast(`Applied AQL 1.5 audit result (${defects} defects). Inspection checklist updated.`);
  });
}

// Super User Admin Event Handlers
function attachAdminHandlers(): void {
  // Sub-tab switching
  document.querySelectorAll('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = (e.currentTarget as HTMLElement).getAttribute('data-admin-tab') as any;
      if (tab) {
        state.adminActiveTab = tab;
        renderApp();
      }
    });
  });

  // Refresh & Lock buttons
  document.getElementById('btn-admin-refresh')?.addEventListener('click', async () => {
    await syncBackendData();
    showToast('Synchronized SQLite tables with Admin Control Center.');
  });

  document.getElementById('btn-admin-lock')?.addEventListener('click', () => {
    state.isAdminUnlocked = false;
    state.activeScreen = 'screen-grn';
    showToast('Super Admin Session Locked and Hidden.');
    renderApp();
  });

  // Tab 2: Save Customer
  document.getElementById('btn-admin-save-customer')?.addEventListener('click', async () => {
    const name = (document.getElementById('admin-cust-name') as HTMLInputElement)?.value?.trim();
    const country = (document.getElementById('admin-cust-country') as HTMLInputElement)?.value?.trim();
    const inspectionPreference = (document.getElementById('admin-cust-pref') as HTMLSelectElement)?.value;
    if (!name) {
      showToast('Please enter a Customer / Buyer name.');
      return;
    }
    try {
      const res = await fetch('/api/admin/master/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, country, inspectionPreference })
      });
      const json = await res.json();
      if (json.success) {
        if (!state.dropdownOptions.customers.includes(name)) {
          state.dropdownOptions.customers.push(name);
        }
        showToast(`Customer "${name}" saved to SQLite Master & Dropdowns.`);
        await syncBackendData();
      }
    } catch (e) {
      console.warn(e);
    }
  });

  // Tab 2: Save Product / Article
  document.getElementById('btn-admin-save-product')?.addEventListener('click', async () => {
    const name = (document.getElementById('admin-prod-name') as HTMLInputElement)?.value?.trim();
    const customerId = (document.getElementById('admin-prod-cust') as HTMLSelectElement)?.value;
    const stickersPerPair = Number((document.getElementById('admin-prod-stickers') as HTMLInputElement)?.value || 2);
    const pairsPerCarton = Number((document.getElementById('admin-prod-carton') as HTMLInputElement)?.value || 50);
    if (!name || !customerId) {
      showToast('Please enter Article Name and Customer.');
      return;
    }
    try {
      const res = await fetch('/api/admin/master/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, customerId, stickersPerPair, pairsPerCarton })
      });
      const json = await res.json();
      if (json.success) {
        if (!state.dropdownOptions.articles.includes(name)) {
          state.dropdownOptions.articles.push(name);
        }
        showToast(`Article "${name}" saved to SQLite Products Master & Dropdowns.`);
        await syncBackendData();
      }
    } catch (e) {
      console.warn(e);
    }
  });

  // Tab 2: Add Maker & Add PO to Dropdowns
  document.getElementById('btn-admin-add-maker')?.addEventListener('click', () => {
    const val = (document.getElementById('admin-add-maker-input') as HTMLInputElement)?.value?.trim();
    if (!val) return;
    if (!state.dropdownOptions.makers.includes(val)) {
      state.dropdownOptions.makers.push(val);
      showToast(`Added Maker "${val}" to global dropdowns.`);
      renderApp();
    }
  });

  document.getElementById('btn-admin-add-po')?.addEventListener('click', () => {
    const val = (document.getElementById('admin-add-po-input') as HTMLInputElement)?.value?.trim();
    if (!val) return;
    if (!state.dropdownOptions.poList.includes(val)) {
      state.dropdownOptions.poList.push(val);
      showToast(`Added PO #${val} to global dropdowns.`);
      renderApp();
    }
  });

  // Database Backup, Re-Seed & Export JSON
  document.getElementById('btn-admin-trigger-backup')?.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/admin/db/backup', { method: 'POST' });
      const json = await res.json();
      if (json.success && json.data) {
        state.lastBackupPath = json.data.backupPath;
        showToast(`Online VACUUM Backup created successfully!`);
        renderApp();
      }
    } catch (e) {
      console.warn(e);
    }
  });

  document.getElementById('btn-admin-reseed-db')?.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/admin/db/reset-seed', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        showToast('SQLite Database verified and default factory seed records restored.');
        await syncBackendData();
      }
    } catch (e) {
      console.warn(e);
    }
  });

  document.getElementById('btn-admin-export-json')?.addEventListener('click', () => {
    const dump = JSON.stringify(state.adminOverview, null, 2);
    const blob = new Blob([dump], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meridian_industries_full_erp_dump_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('Exported complete ERP SQLite snapshot to JSON.');
  });
}

// Global window functions for table row actions
declare global {
  interface Window {
    viewGrnRecord: (sr: number) => void;
    editGrnRecord: (sr: number) => void;
    handleDefectAction: (id: string, actionText: string) => void;
    toggleQcCheck: (id: string) => void;
    adminDeleteRecord: (table: string, id: string) => void;
    adminRemoveDropdownItem: (listKey: 'makers' | 'poList', val: string) => void;
    adminForceRepair: (altId: number, isScrap: boolean) => void;
  }
}

window.adminDeleteRecord = async function(table: string, id: string) {
  try {
    const res = await fetch(`/api/admin/record/${table}/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Deleted record [${id}] from ${table}.`);
      await syncBackendData();
    } else {
      showToast(`Delete error: ${json.error}`);
    }
  } catch (e) {
    console.warn(e);
  }
};

window.adminRemoveDropdownItem = function(listKey: 'makers' | 'poList', val: string) {
  state.dropdownOptions[listKey] = state.dropdownOptions[listKey].filter(item => item !== val);
  showToast(`Removed "${val}" from dropdown options.`);
  renderApp();
};

window.adminForceRepair = async function(altId: number, isScrap: boolean) {
  try {
    const res = await fetch(`/api/alterations/${altId}/repair`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tailorName: 'Supervisor A',
        isScrap,
        deductionRate: 150
      })
    });
    const json = await res.json();
    if (json.success) {
      showToast(isScrap ? `Alteration #${altId} condemned to Scrap Ledger.` : `Alteration #${altId} returned to Stage 1 Checking.`);
      await syncBackendData();
    }
  } catch (e) {
    console.warn(e);
  }
};

window.viewGrnRecord = function(sr: number) {
  const item = state.grnList.find(r => r.sr === sr);
  if (item) {
    openModal(`GRN Record #${sr}`, `
      <div style="line-height: 1.8; font-size: 13px;">
        <p><strong>Date:</strong> ${item.date}</p>
        <p><strong>Maker:</strong> ${item.maker}</p>
        <p><strong>Customer:</strong> ${item.customer}</p>
        <p><strong>PO Number:</strong> ${item.po}</p>
        <p><strong>Article:</strong> ${item.article}</p>
        <p><strong>Order Qty:</strong> ${item.orderQty.toLocaleString()} Pairs</p>
        <p><strong>Received Qty:</strong> ${item.rcvdPairs.toLocaleString()} Pairs</p>
        <p><strong>Balance:</strong> ${item.balance.toLocaleString()} Pairs</p>
        <p><strong>Status:</strong> <span class="status-pill ${item.status === 'Partial' ? 'status-pill-amber' : 'status-pill-neutral'}">${item.status}</span></p>
      </div>
    `);
  }
};

window.editGrnRecord = function(sr: number) {
  const item = state.grnList.find(r => r.sr === sr);
  if (item) {
    const setSelectVal = (id: string, val: string) => {
      const el = document.getElementById(id) as HTMLSelectElement;
      if (el) {
        let found = false;
        for (let i = 0; i < el.options.length; i++) {
          if (el.options[i].value === val) {
            el.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = val;
          opt.selected = true;
          el.appendChild(opt);
        }
      }
    };

    setSelectVal('grn-maker', item.maker);
    setSelectVal('grn-customer', item.customer);
    setSelectVal('grn-po', item.po);
    setSelectVal('grn-article', item.article);

    (document.getElementById('grn-order-qty') as HTMLInputElement).value = item.orderQty.toString();
    (document.getElementById('grn-rcvd-pairs') as HTMLInputElement).value = item.rcvdPairs.toString();
    (document.getElementById('grn-balance') as HTMLInputElement).value = item.balance.toString();
    showToast(`Loaded Record #${sr} into editor form.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

window.handleDefectAction = function(id: string, actionText: string) {
  showToast(`Action "${actionText}" executed for Defect Record ${id}.`);
};

window.toggleQcCheck = function(id: string) {
  const item = state.qcChecklist.find(c => c.id === id);
  if (item) {
    item.passed = !item.passed;
    renderApp();
  }
};

// Pure Vanilla CSV Exporter
function exportTableToCSV(filename: string, rows: object[]): void {
  if (!rows || !rows.length) {
    showToast('No records available to export.');
    return;
  }
  const separator = ',';
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(separator) +
    '\n' +
    rows
      .map(row => {
        return keys
          .map(k => {
            const rawVal = (row as Record<string, unknown>)[k];
            let cellStr = rawVal === null || rawVal === undefined ? '' : String(rawVal);
            cellStr = cellStr.replace(/"/g, '""');
            if (cellStr.search(/("|,|\n)/g) >= 0) cellStr = `"${cellStr}"`;
            return cellStr;
          })
          .join(separator);
      })
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Dynamic backend SQLite synchronization
async function syncBackendData(): Promise<void> {
  try {
    const res = await fetch('/api/store/dropdowns');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        if (json.data.makers?.length) state.dropdownOptions.makers = json.data.makers;
        if (json.data.customers?.length) state.dropdownOptions.customers = json.data.customers;
        if (json.data.articles?.length) state.dropdownOptions.articles = json.data.articles;
        if (json.data.poList?.length) state.dropdownOptions.poList = json.data.poList;
      }
    }
  } catch (e) {
    console.debug('Dropdown sync offline:', e);
  }

  try {
    const res = await fetch('/api/store/receivings');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        state.grnList = json.data.map((r: any, idx: number) => ({
          sr: r.id || (idx + 1),
          date: r.rcv_date || '31-10-2026',
          maker: r.maker_contractor,
          customer: r.customer_name,
          po: r.po_number,
          article: r.article_name,
          orderQty: r.order_qty,
          rcvdPairs: r.rcvd_pairs,
          balance: r.balance_qty,
          status: (r.status === 'RECEIVED' || r.balance_qty <= 0) ? 'Received' : 'Partial'
        }));
      }
    }
  } catch (e) {
    console.debug('Receivings sync offline:', e);
  }

  try {
    const res = await fetch('/api/alterations');
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        state.dropdownOptions.defectBatchIds = json.data.map((alt: any) => `ALT-${alt.id}`);
        state.defectList = json.data.map((alt: any) => ({
          id: `DEF-${alt.id}`,
          date: alt.sent_at ? alt.sent_at.split(' ')[0] : '31-10-2026',
          origin: (alt.source_stage || 'Step 1').replace(/_/g, ' '),
          article: alt.product_name || 'Model A9',
          po: alt.req_number || '27347',
          defectClass: alt.defect_reason || 'Workmanship Defect',
          qty: `${alt.pairs_count} Prs`,
          tailor: alt.tailor_name || 'Supervisor A',
          status: alt.status === 'RETURNED_TO_CHECKING' ? 'Completed' : (alt.is_scrapped ? 'Scrapped' : 'In Rework'),
          route: 'Auto-Return to Stage 1 Checking',
          actionText: alt.status === 'RETURNED_TO_CHECKING' ? 'Verified' : 'Update'
        }));
      }
    }
  } catch (e) {
    console.debug('Alterations sync offline:', e);
  }

  try {
    const res = await fetch('/api/admin/overview');
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        state.adminOverview = json.data;
      }
    }
  } catch (e) {
    console.debug('Admin overview sync offline:', e);
  }

  renderApp();
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
  syncBackendData();
});
renderApp();
syncBackendData();



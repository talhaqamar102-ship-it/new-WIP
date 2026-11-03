import { Router } from 'express';
import { PackingService } from '../services/packingService.js';
import { AQLService } from '../services/aqlService.js';

export const apiRouter = Router();

// Wrap async handlers
const handle = (fn) => async (req, res) => {
  try {
    const result = await fn(req, res);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// --- INVENTORY & MASTERS ---
apiRouter.get('/inventory/gloves', handle(() => PackingService.getGloveInventory()));
apiRouter.get('/inventory/materials', handle(() => PackingService.getMaterialInventory()));
apiRouter.get('/customers', handle(() => PackingService.getCustomers()));
apiRouter.get('/products', handle((req) => PackingService.getProducts(req.query.customerId)));

// --- GLOVE REQUISITIONS ---
apiRouter.get('/requisitions', handle(() => PackingService.getRequisitions()));
apiRouter.get('/requisitions/:reqNo', handle((req) => PackingService.getRequisition(req.params.reqNo)));
apiRouter.post('/requisitions', handle((req) => {
  const { customerId, productId, requestedPairs, notes } = req.body;
  if (!customerId || !productId || !requestedPairs) {
    throw new Error('customerId, productId, and requestedPairs are required');
  }
  return PackingService.createGloveRequisition(customerId, productId, Number(requestedPairs), notes);
}));

// --- STORE KEEPER ISSUANCE ---
apiRouter.post('/requisitions/:reqNo/issue', handle((req) => {
  return PackingService.issueGloveRequisition(req.params.reqNo);
}));

// --- WIP 5 STAGES ---
apiRouter.post('/wip/:reqNo/step1-checking', handle((req) => {
  const { goodPairs, defectPairs, defectReason } = req.body;
  return PackingService.executeStep1Checking(
    req.params.reqNo,
    Number(goodPairs || 0),
    Number(defectPairs || 0),
    defectReason
  );
}));

apiRouter.post('/wip/:reqNo/step2-ironing', handle((req) => {
  const { goodPairs, defectPairs, defectReason } = req.body;
  return PackingService.executeStep2Ironing(
    req.params.reqNo,
    Number(goodPairs || 0),
    Number(defectPairs || 0),
    defectReason
  );
}));

apiRouter.post('/wip/:reqNo/step3-matching', handle((req) => {
  const { goodPairs, defectPairs, defectReason } = req.body;
  return PackingService.executeStep3Matching(
    req.params.reqNo,
    Number(goodPairs || 0),
    Number(defectPairs || 0),
    defectReason
  );
}));

// --- PACKING MATERIALS REQUISITION ---
apiRouter.post('/wip/:reqNo/material-requisition', handle((req) => {
  return PackingService.createMaterialRequisition(req.params.reqNo);
}));

apiRouter.get('/material-requisitions', handle(() => PackingService.getMaterialRequisitions()));

apiRouter.post('/material-requisitions/:matReqNo/issue', handle((req) => {
  return PackingService.issueMaterialRequisition(req.params.matReqNo);
}));

// --- STEP 4 & STEP 5 ---
apiRouter.post('/wip/:reqNo/step4-packing', handle((req) => {
  const { packedPairs } = req.body;
  return PackingService.executeStep4FirstPacking(req.params.reqNo, Number(packedPairs));
}));

apiRouter.post('/wip/:reqNo/step5-cartons', handle((req) => {
  const { pairsPerCarton } = req.body;
  return PackingService.executeStep5SecondPacking(
    req.params.reqNo,
    pairsPerCarton ? Number(pairsPerCarton) : null
  );
}));

// --- FINAL QC INSPECTION ---
apiRouter.post('/wip/:reqNo/final-inspection', handle((req) => {
  const { cartonsChecked, defectivePairs, defectNotes } = req.body;
  return PackingService.executeFinalInspection(
    req.params.reqNo,
    Number(cartonsChecked),
    Number(defectivePairs || 0),
    defectNotes
  );
}));

// --- ALTERATION & REPAIR LOOP (ALWAYS RETURNS TO STEP 1) ---
apiRouter.get('/alterations', handle((req) => PackingService.getAlterations(req.query.reqNo)));
apiRouter.post('/alterations/:id/return', handle((req) => {
  return PackingService.returnAlteration(Number(req.params.id));
}));

// --- STORE MANAGER INWARD SHIPMENTS / RECEIVINGS ---
apiRouter.get('/store/receivings', handle((req) => {
  return PackingService.getReceivings({
    date: req.query.date,
    customer: req.query.customer,
    maker: req.query.maker,
    search: req.query.search
  });
}));

apiRouter.post('/store/receivings', handle((req) => {
  return PackingService.createReceiving(req.body);
}));

apiRouter.get('/store/dropdowns', handle(() => {
  return PackingService.getReceivingDropdowns();
}));

// --- PACKAGING BOM LOOKUP ---
apiRouter.get('/bom/:productId', handle((req) => {
  return PackingService.getPackagingBOM(req.params.productId, req.query.pairsCount);
}));

// --- MATERIAL RETURN VOUCHER (MRV) ---
apiRouter.post('/materials/return', handle((req) => {
  const { matReqNumber, materialCode, returnedQty, returnReason } = req.body;
  return PackingService.createMaterialReturnVoucher(matReqNumber, materialCode, returnedQty, returnReason);
}));

// --- ALTERATION REWORK ATTRIBUTION (TAILOR & MAX 2-REWORK SCRAP) ---
apiRouter.post('/alterations/:id/repair', handle((req) => {
  const { tailorName, isScrap, deductionRate } = req.body;
  return PackingService.completeAlterationRepair(Number(req.params.id), tailorName, Boolean(isScrap), deductionRate);
}));

// --- AQL 1.5 AUDIT & EXPORT MANIFEST ---
apiRouter.post('/qc/:reqNo/aql-audit', handle((req) => {
  const { foundDefects, inspectorId, inspectorName } = req.body;
  return PackingService.executeAQLAudit(req.params.reqNo, foundDefects, inspectorId, inspectorName);
}));

apiRouter.get('/qc/aql-calc', handle((req) => {
  const lotSize = Number(req.query.lotSize || 840);
  const defects = Number(req.query.defects || 0);
  const aql = Number(req.query.aql || 1.5);
  return AQLService.evaluateLot(lotSize, defects, aql);
}));

apiRouter.get('/export/manifest/:reqNo', handle((req) => {
  return PackingService.getMasterCartonManifest(req.params.reqNo);
}));

// --- SUPER USER ADMIN ENDPOINTS ---
apiRouter.get('/admin/overview', handle(() => {
  return PackingService.getAdminOverview();
}));

apiRouter.post('/admin/inventory/gloves', handle((req) => {
  return PackingService.updateGloveInventoryAdmin(req.body);
}));

apiRouter.post('/admin/inventory/materials', handle((req) => {
  return PackingService.updateMaterialInventoryAdmin(req.body);
}));

apiRouter.post('/admin/master/customer', handle((req) => {
  return PackingService.upsertCustomerAdmin(req.body);
}));

apiRouter.post('/admin/master/product', handle((req) => {
  return PackingService.upsertProductAdmin(req.body);
}));

apiRouter.post('/admin/wip/:reqNo/override', handle((req) => {
  return PackingService.overrideWipAdmin(req.params.reqNo, req.body);
}));

apiRouter.delete('/admin/record/:table/:id', handle((req) => {
  return PackingService.deleteRecordAdmin(req.params.table, req.params.id);
}));

apiRouter.post('/admin/db/backup', handle(() => {
  return PackingService.triggerDatabaseBackupAdmin();
}));

apiRouter.post('/admin/db/reset-seed', handle(() => {
  return PackingService.resetAndSeedDatabaseAdmin();
}));


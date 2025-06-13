import express from "express";
import {
  createDocument,
  getUserDocuments,
  updateDocument,
  deleteDocument,
  shareDocument,
  getDocumentById,
} from "./documentController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/create-doc", auth, createDocument);
router.get("/allDoc", auth, getUserDocuments);
router.put("/:id", auth, updateDocument);
router.get("/:id", auth, getDocumentById);
router.delete("/:id", auth, deleteDocument);
router.post("/share", auth, shareDocument);

export default router;

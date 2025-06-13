import express from "express";
import {
  createDocument,
  getUserDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from "./documentController.js";
import auth from "../../middleware/auth.js";

const router = express.Router();

router.post("/create-doc", auth, createDocument);
router.get("/allDoc", auth, getUserDocuments);
router.get("/:id", auth, getDocumentById);
router.put("/:id", auth, updateDocument);
router.delete("/:id", auth, deleteDocument);

export default router;

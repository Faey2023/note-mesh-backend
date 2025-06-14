import Document from "./documentsModel.js";

export const createDocument = async (req, res) => {
  try {
    const { title, content } = req.body;
    const ownerId = req.user._id;

    const newDoc = new Document({
      title,
      content,
      owner: ownerId,
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create document", error: err.message });
  }
};

//get all
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user._id;

    const docs = await Document.find({
      $or: [
        { owner: userId },
        { sharedWith: { $elemMatch: { user: userId } } },
      ],
    });

    res.status(200).json(docs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch documents", error: err.message });
  }
};

//edit
export const updateDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user._id;

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.owner.equals(userId);
    const isSharedUser = doc.sharedWith.some((entry) =>
      entry.user.equals(userId)
    );

    if (!isOwner && !isSharedUser) {
      return res.status(403).json({ message: "Not authorized to edit" });
    }

    if (title !== undefined) doc.title = title;
    if (content !== undefined) doc.content = content;

    await doc.save();

    res.status(200).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
};

//single doc
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const doc = await Document.findById(id)
      .populate("owner", "fullName avatar email")
      .populate("sharedWith.user", "fullName avatar email");

    if (!doc) return res.status(404).json({ message: "Document not found" });

    const isOwner = doc.owner._id.equals(userId);
    const isShared = doc.sharedWith.some((entry) =>
      entry.user._id.equals(userId)
    );

    if (!isOwner && !isShared) {
      return res.status(403).json({ message: "Not authorized to view" });
    }

    res.status(200).json(doc);
  } catch (err) {
    console.error("Error in getDocumentById:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch document", error: err.message });
  }
};

//delete
export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // console.log("Request to delete doc:", { id, userId });

    const doc = await Document.findById(id);
    if (!doc) {
      // console.log("Document not found");
      return res.status(404).json({ message: "Document not found" });
    }

    if (!doc.owner.equals(userId)) {
      // console.log("Not authorized to delete this document");
      return res.status(403).json({ message: "Only owner can delete" });
    }

    await doc.deleteOne();
    // console.log("Document deleted");
    res.status(200).json({ message: "Document deleted" });
  } catch (err) {
    console.error("Error in deleteDocument:", err);
    res.status(500).json({ message: "Deletion failed", error: err.message });
  }
};

//share
export const shareDocument = async (req, res) => {
  try {
    const { docId, userId } = req.body;
    const ownerId = req.user._id;

    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    if (!doc.owner.equals(ownerId)) {
      return res
        .status(403)
        .json({ message: "Not authorized to share this document" });
    }

    const alreadyShared = doc.sharedWith.some((entry) =>
      entry.user.equals(userId)
    );
    if (alreadyShared) {
      return res.status(400).json({ message: "User already has access" });
    }

    doc.sharedWith.push({ user: userId, role: "viewer" });

    await doc.save();

    res
      .status(200)
      .json({ message: "Document shared successfully", document: doc });
  } catch (err) {
    console.error("Error sharing document:", err);
    res
      .status(500)
      .json({ message: "Failed to share document", error: err.message });
  }
};

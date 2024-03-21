import { Router } from "express";
import { Users } from "../dao/models/index.js";
import { uploadDocument } from "../helpers/multer.js";

const user = Router();

user
  .post("/premium/:uid", async (req, res, next) => {
    try {
      const { uid } = req.params;
      const { role } = req.body;

      const user = await Users.findOne({ _id: uid });
      if (!user) {
        return res.status(404).json({ message: "Missed user" });
      }

      if (role === "premium" && user.role === "user") {
        const requiredDocuments = [
          "identification",
          "proofOfResidence",
          "bankStatement",
        ];

        const hasAllRequiredDocuments = requiredDocuments.every((docName) =>
          user.documents.some((doc) => doc.name === docName)
        );

        if (!hasAllRequiredDocuments) {
          return res
            .status(400)
            .json({ message: "The process of uploading documents has failed" });
        }

        user.role = "premium";
        await user.save();

        res.json({ message: "User is now premium member!" });
      } else if (role === "user" && user.role === "premium") {
        user.role = "user";
        await user.save();

        res.json({ message: "User is no longer a premium member." });
      } else {
        res.status(400).json({ message: "The request is not valid" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  })
  .post(
    "/:uid/documents",
    uploadDocument.fields([
      { name: "document" },
      { name: "profile" },
      { name: "product" },
      { name: "identification" },
      { name: "proofOfResidence" },
      { name: "bankStatement" },
    ]),
    async (req, res, next) => {
      try {
        const { uid } = req.params;
        const baseUrl = "http://localhost:8080/uploads";

        let updates = Object.keys(req.files)
          .map((fileKey) => {
            const fileData = req.files[fileKey][0];
            if (fileData) {
              const documentUrl = `${baseUrl}/${uid}/${fileKey}/${fileData.filename}`;

              const document = {
                name: fileKey,
                reference: documentUrl,
              };
              return { $push: { documents: document } };
            }
          })
          .filter((update) => update); // Filtrar por si acaso hay entradas undefined

        if (updates.length === 0) {
          throw new Error("At least one document is required.");
        }
        await Users.updateOne({ _id: uid }, [...updates]);

        res.json({ message: "Documents uploaded successfully with URLs." });
      } catch (error) {
        next(error);
      }
    }
  );

export default user;

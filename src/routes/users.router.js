import { Router } from "express";
import { Users } from "../dao/models/index.js";
import { uploadDocument } from "../helpers/multer.js";

const user = Router();

user
  .post("/premium/:uid", async (req, res, next) => {
    try {
      const { role } = req.body;
      const { uid } = req.params;
      let newRole;

      if (role == "user") {
        newRole = "premium";
      } else if (role == "premium") {
        newRole = "user";
      } else {
        throw new Error("Invalid role.");
      }

      const updateResult = await Users.updateOne(
        { _id: uid },
        { $set: { role: newRole } }
      );
      if (updateResult.matchedCount === 0) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
      res.json({ message: `Se ha cambiado el rol a ${newRole}.` });
    } catch (error) {
      next(error);
    }
  })
  .post(
    "/:uid/documents",
    uploadDocument.fields([{ name: "document" }, { name: "profile" }]),
    async (req, res, next) => {
      try {
        const { uid } = req.params;
        const documentData = req.files.document[0] || null;
        const profileData = req.files.profile?.[0] || null;
        // Validate files
        if (!documentData && !profileData) {
          throw new Error("Debe subir al menos un archivo.");
        }

        console.log(
          `${
            documentData
              ? `"${documentData.filename}" de tipo "${documentData.mimetype}"`
              : ""
          } y\n` +
            `${
              profileData
                ? `"${profileData.filename}" de tipo "${profileData.mimetype}"`
                : ""
            }`
        );
        console.log(uid);
      } catch (error) {
        console.log(error);
        next(error);
      }
    }
  );

export default user;

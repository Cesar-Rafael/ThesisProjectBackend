const router = require("express").Router();
const { authenticateToken } = require("../utils/jwt");
const EncryptionModule = require("./../utils/encryption");
const multer = require("multer");
const upload = multer({ dest: "public/certificates" });
const STUDENT = require("../../models/student");
const MEMBER = require("../../models/member");

router.route("/upload").post(upload.single("file"), async (req, res) => {
  console.log(req.file);
  const { filename, originalname } = req.file;
  return res.status(200).json({ filename, originalname });
});

router.route("/encrypt").post(authenticateToken, async (req, res) => {
  try {
    const { certificate } = req.body;

    const encryptedCertificate =
      EncryptionModule.encryptCertificate(certificate);

    res.status(200).json({ encryptedCertificate });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Error encrypting" });
  }
});

router.route("/decrypt/one").post(authenticateToken, async (req, res) => {
  try {
    const { idStudent, encryptedCertificate, idCertificate } = req.body;

    const decryptedCertificate = EncryptionModule.decryptCertificate(
      encryptedCertificate,
      idStudent
    );

    const student = await STUDENT.findById(idStudent, {
      fullName: 1,
      dni: 1,
    });

    const { fullName } = student;
    const {
      title,
      diploma_date,
      type,
      createdAt,
      filename,
      originalname,
      idsUniversities,
    } = decryptedCertificate;

    const universities = MEMBER.find(
      { _id: { $in: idsUniversities } },
      { abbreviation: 1, name: 1 }
    );

    res.status(200).json({
      idCertificate,
      idStudent,
      fullName,
      dni,
      title,
      diploma_date,
      createdAt,
      type,
      filename,
      originalname,
      idsUniversities,
      universities,
    });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Error decrypting" });
  }
});

router.route("/decrypt/many").post(authenticateToken, async (req, res) => {
  try {
    const { certificates } = req.body;
    const decryptedCertificates = [];

    for (const certificate of certificates) {
      const { idStudent, encryptedCertificate, idCertificate } = certificate;
      const decryptedCertificate = EncryptionModule.decryptCertificate(
        encryptedCertificate,
        idStudent
      );

      const student = await STUDENT.findById(idStudent, {
        fullName: 1,
        dni: 1,
      });

      const { fullName } = student;
      const {
        title,
        diploma_date,
        type,
        createdAt,
        filename,
        originalname,
        idsUniversities,
      } = decryptedCertificate;

      const universities = MEMBER.find(
        { _id: { $in: idsUniversities } },
        { abbreviation: 1, name: 1 }
      );

      decryptedCertificates.push({
        idCertificate,
        idStudent,
        fullName,
        dni,
        title,
        diploma_date,
        createdAt,
        type,
        filename,
        originalname,
        idsUniversities,
        universities,
      });
    }

    res.status(200).json({ decryptedCertificates });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Error decrypting" });
  }
});

router
  .route("/register-per-university")
  .post(authenticateToken, async (req, res) => {
    try {
      const { idsUniversities } = req.body;

      for (const idUniversity of idsUniversities) {
        await MEMBER.findByIdAndUpdate(idUniversity, {
          $inc: { certificatesNumberValid: 1 },
        });
      }

      res.status(200).json({ message: "Certificates Number Valid updated" });
    } catch (e) {
      console.error("Error: ", e);
      res.status(500).json({ message: "Error decrypting" });
    }
  });

router
  .route("/register-for-student")
  .post(authenticateToken, async (req, res) => {
    try {
      const { idCertificate, idStudent } = req.body;

      await STUDENT.findByIdAndUpdate(idStudent, {
        $push: { certificates: { idCertificate, valid: true } },
      });

      res.status(200).json({ message: "Certificate registered" });
    } catch (e) {
      console.error("Error: ", e);
      res.status(500).json({ message: "Error registering certificate" });
    }
  });

router
  .route("/annul-per-university")
  .post(authenticateToken, async (req, res) => {
    try {
      const { idsUniversities } = req.body;

      for (const idUniversity of idsUniversities) {
        await MEMBER.findByIdAndUpdate(idUniversity, {
          $inc: { certificatesNumberAnnulled: 1, certificatesNumberValid: -1 },
        });
      }

      res.status(200).json({ message: "Certificates Number Valid updated" });
    } catch (e) {
      console.error("Error: ", e);
      res.status(500).json({ message: "Error decrypting" });
    }
  });

router.route("/annul-for-student").post(authenticateToken, async (req, res) => {
  try {
    const { idCertificate, idStudent } = req.body;

    await STUDENT.findByIdAndUpdate(
      idStudent,
      {
        certificates: { $elemMatch: { idCertificate } },
      },
      {
        $set: { "certificates.$.valid": false },
      }
    );

    res.status(200).json({ message: "Certificate annulated" });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Error decrypting" });
  }
});

module.exports = router;

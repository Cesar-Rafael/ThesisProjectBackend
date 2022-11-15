const router = require("express").Router();
const QRCode = require("qrcode");
const STUDENT = require("../../models/student");
const { authenticateToken } = require("../utils/jwt");

router.route("/register").post(authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, birthday, documentType, documentNumber } =
      req.body;
    const fullName = `${lastName}, ${firstName}`;
    if (await STUDENT.findOne({ documentNumber })) {
      return res.status(400).json({ message: "Estudiante ya registrado" });
    }

    const student = await STUDENT.create({
      firstName,
      lastName,
      documentType,
      documentNumber,
      birthday,
      fullName,
    });

    const { ...studentRegistered } = student.toJSON();

    const _id = studentRegistered._id;
    const url = `http://localhost:3006/student/${_id}`;

    await QRCode.toFile(`./public/qrcodes/qr_code_${_id}.png`, url);

    res.status(200).json({ student: studentRegistered });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/search").get(authenticateToken, async (req, res) => {
  try {
    const { _id } = req.query;

    const student = await STUDENT.findById(_id);

    res.status(200).json({ student });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/edit").put(authenticateToken, async (req, res) => {
  try {
    const { _id, firstName, lastName, birthday, documentType, documentNumber } =
      req.body;
    const fullName = `${lastName}, ${firstName}`;

    await STUDENT.findByIdAndUpdate(_id, {
      firstName,
      lastName,
      documentType,
      documentNumber,
      birthday,
      fullName,
    });

    res.status(200).json({ message: "OK" });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/list").get(authenticateToken, async (req, res) => {
  try {
    const students = await STUDENT.find();

    res.status(200).json({ students });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/search").post(async (req, res) => {
  try {
    const { firstName, lastName, documentNumber } = req.body;
    var studentsFound = [];

    if (documentNumber !== "") {
      studentsFound = await STUDENT.find(
        {
          documentNumber,
        },
        { certificates: 0 }
      );
    }

    if (studentsFound.length === 0) {
      studentsFound = await STUDENT.find({
        firstName: { $regex: firstName },
        lastName: { $regex: lastName },
      });
    }

    res.status(200).json({ studentsFound });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

module.exports = router;

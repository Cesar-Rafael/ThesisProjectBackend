const router = require("express").Router();
const MEMBER = require("../../models/member");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("./../utils/jwt");
const { sendPrivateKeyEmail } = require("../utils/email/member");

router.route("/register").post(authenticateToken, async (req, res) => {
  try {
    const { name, type, abbreviation, phone, password } = req.body;
    const email = `${abbreviation.toLowerCase()}@certify.com`;

    if (await MEMBER.findOne({ email })) {
      return res.status(400).json({ message: "Usuario ya registrado" });
    }

    const salt = await bcrypt.genSalt(10);
    const _password = await bcrypt.hash(password, salt);
    const role = "MEMBER";

    const member = await MEMBER.create({
      name,
      type,
      abbreviation,
      phone,
      email,
      role,
      password: _password,
    });

    const { ...memberRegistered } = await member.toJSON();

    delete memberRegistered.password;
    res.status(200).json({ member: memberRegistered });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/list").get(authenticateToken, async (req, res) => {
  try {
    const members = await MEMBER.find(
      { name: { $ne: "admin" } },
      { password: 0 }
    );

    res.status(200).json({ members });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/list/universities").get(authenticateToken, async (req, res) => {
  try {
    const members = await MEMBER.find(
      { name: { $ne: "admin" }, type: { $ne: "ENTITY" } },
      {
        password: 0,
        type: 0,
        phone: 0,
        certificatesNumber: 0,
        email: 0,
        privateKey: 0,
        role: 0,
      }
    );

    res.status(200).json({ members });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/save-public-key").post(authenticateToken, async (req, res) => {
  try {
    const { _id, publicKey } = req.body;

    await MEMBER.findByIdAndUpdate(_id, {
      publicKey,
    });

    res.status(200).json({ message: "Public key updated" });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Public key not updated" });
  }
});

router.route("/list/universities").get(authenticateToken, async (req, res) => {
  try {
    const members = await MEMBER.find(
      { name: { $ne: "admin" }, type: { $ne: "ENTITY" } },
      {
        password: 0,
        type: 0,
        phone: 0,
        certificatesNumber: 0,
        email: 0,
        privateKey: 0,
        role: 0,
      }
    );

    res.status(200).json({ members });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json(response);
  }
});

router.route("/send-private-key").post(authenticateToken, async (req, res) => {
  try {
    const { email, privateKey } = req.body;
    sendPrivateKeyEmail(email, privateKey);
    res.status(200).json({ message: "Email sent" });
  } catch (e) {
    console.error("Error: ", e);
    res.status(500).json({ message: "Email not sent" });
  }
});

module.exports = router;

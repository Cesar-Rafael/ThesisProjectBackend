const router = require('express').Router()
const MEMBER = require('../../models/member')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { generateAccessToken, authenticateToken } = require('../utils/jwt')

router.route('/login')
  .post(async (req, res) => {

    try {

      const { email, password } = req.body

      const member = await MEMBER.findOne({ email })

      if (!member) {
        return res.status(401).json({ message: 'Member not found' })
      }

      if (!await bcrypt.compare(password, member.password)) {
        return res.status(401).json({ message: 'Verify that your credentials are correct' })
      }

      const _member = { _id: member._id }
      const accessToken = generateAccessToken(_member)

      return res.status(200).json({
        accessToken,
        user: {
          name: member.name,
          type: member.type,
          abbreviation: member.abbreviation,
          email: member.email,
          role: member.role,
          publicKey: member.publicKey
        }
      })

    } catch (e) {
      console.error('Error: ', e)
      return res.status(500).json({ message: 'Encountered a server error' })
    }
  });

router.route('/personal')
  .get(authenticateToken, async (req, res) => {

    try {
      const { _id } = req.user

      const member = await MEMBER.findOne({ _id })

      if (!member) return res.status(401).json({ message: 'Invalid auth token' })

      const { password, ...data } = await member.toJSON()

      const user = data
      return res.status(200).json({ user })
    } catch (e) {
      console.error('Error: ', e)
      return res.status(500).json({ message: 'Encountered a server error' })
    }
  });

router.route('/verify')
  .get(authenticateToken, async (req, res) => {

    try {
      const { _id } = req.user


      return res.status(200).json({ user })
    } catch (e) {
      console.error('Error: ', e)
      return res.status(500).json({ message: 'Encountered a server error' })
    }
  });

module.exports = router;
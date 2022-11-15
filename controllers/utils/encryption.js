const AES = require('crypto-js/aes')
const SHA512 = require('crypto-js/sha512')
const CryptoJS = require('crypto-js')

const encryptCertificate = (certificate) => {
  const idStudent = certificate.idStudent
  const certificateEncriptionKey = (SHA512(idStudent)).toString()
  const contentToEncrypt = JSON.stringify(certificate)
  const encryptedCertificate = AES.encrypt(contentToEncrypt, certificateEncriptionKey)
  const encryptedCertificateString = encryptedCertificate.toString()
  return encryptedCertificateString
}

const decryptCertificate = (encryptedCertificateString, idStudent) => {
  const certificateEncriptionKey = (SHA512(idStudent)).toString()
  const decryptedCertificate = AES.decrypt(encryptedCertificateString, certificateEncriptionKey)
  const decryptedCertificateString = decryptedCertificate.toString(CryptoJS.enc.Utf8)
  const certificate = JSON.parse(decryptedCertificateString)
  return certificate
}

module.exports = { encryptCertificate, decryptCertificate }
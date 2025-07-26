// import { initializeApp, getApps, cert } from "firebase-admin/app"
// import { getAuth } from "firebase-admin/auth"
// import { getFirestore } from "firebase-admin/firestore"

// const serviceAccount = {
//   type: "service_account",
//   project_id: "deaf-dumb-bc377",
//   private_key_id: "8b649d68899c2445b3ae8e74b6d630252de8b454",
//   private_key:
//     "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCQGnsWpB684rad\nfWKVTIKHggmJFb1lSJ/5Jx83U1bOJaqaxlZULU2BszNOMT49yHOT5cnCanMqk8AA\nG3VD4xt8Cf7o/6Q2iqUfQ3qOBnVOJMdEJPcl8PQ5ZcTK2PBODpbJyzVUcqq0Bf+Q\nLsqraiicuAPXNHf44UDaBhGd2y2xNrByxsHv/tSsr2jO6Xm3bwS9mnrqx1ON6vna\nuw0Ec6pFgE1Qk2S1uWH8Kfl33ZgvKlk2iM2oKsgpsqz50XMg6aEH7MOSvL0PYs6J\nwnPrzvZDP9LoIZuHIE0Jk5ne2QEvvXs40TFWAdNkgO+PwBmWnn+6j5bcTG3V75TC\nc0hPDggNAgMBAAECggEABqg0zX4/LdgYg07jsf/6+7fhclGjgBjBOgSnFYXvXjwM\np3RadOVYBJIEBSyTMoTnropsCYh/ZBUlRom1DPsZUl/DRMbZaVnoU8If2NXOr39V\nddlyLXCs56FVN+Es4Mdm5nWaoYcWkt4tyPD1AnnukzkjTpGpPAqPVbDTgqinTUtv\n4bkOqcZNO6TdcvbtKYWXHjGGsFVtLWEf3DGbLjSE3P9DPfrEfPO6XP3S+qLRA78S\ndbwGH2BoH/T+ifkCISd9kRAQIHHHVCB8ni1aDa3YpFVEACdxyPbPnYoutXjS0aer\nMd56m+rFkQ6CUzHgF7Cn0mDKaL21axctLAz2FAqYJQKBgQDA3C16Idu+AEGpTMOT\nT3KqSrGVEGLIIHIVPl0j3b0kDSwK/HttzRHJNOq9EFcVQiV5tSUswCv1RAhpLHq4\nfTHeky3x5bw9733SpRmNEiUeEf/X2Vw/7SF5fCc0ajor69Z6aJcSDyjRqLOKTXah\npU/iiA4R//bMzi4GsYoy27HoPwKBgQC/R/Rc+48N3DHWkgZi1cXSI2u3XwDeu18P\nF23fT3I4o2o8TfTYoAnx/BQs1+fmw2j4XoXvKMsOorLV5+1/Ca0qVC+ymcqhGZrG\n+jM0Q9BsXjetlK6zr8jg+rMA/ujOp0+yTLvETyBLiqHs77HiHAd+x0LSBxLgZFfZ\ne6toQU5cswKBgCgEyA8CvZU0emuF+UM1Bicd7rFuwACk8udDlJIfreKwNQZmk7oa\nBmnI6DipDljj6+DQXNFnYve20UP5rdFgcRutUKhUMnZrnqE6Dw49yKPvujXw7Xp6\nWyrZP01aCY4Zlty5nTdrG949clvtbQNnySbJcpn7khu3YMeUyYd6HPWDAoGBAKdl\nB/Prbhi6D59wsUgDPpiUyOpzqKZDIYBqh4u60gHA+PKHYnPFMo7jhKBt3hM0BYP9\n7IYMlA9d0NWjn1Lim/mELS3Gqu5rIulpAjCF/DsqBN3SVUUI2+oPW2HOstxOzU8D\nGftFJ8UUMHrSlUCEOQb4yIBXEmzvQ3YfZTTamgJDAoGBAK+PfyvBzzsDEgBUOSOZ\nmCoBbu67mBMUK5v2aIn9fVe1CgyuvZFtUg3gQ8cHFlWfSJM3mWGAfd6hUMod0jip\nHjaXw8JPiMk85rVKG7jAPIkrxA5gVTrUC1quqOVyesY/qrVpUrIC9agaHIYgfHXm\nC3ieUC7JnxQ/Bfmd+vUUXeAg\n-----END PRIVATE KEY-----\n",
//   client_email: "firebase-adminsdk-fbsvc@deaf-dumb-bc377.iam.gserviceaccount.com",
//   client_id: "114809294490202893775",
//   auth_uri: "https://accounts.google.com/o/oauth2/auth",
//   token_uri: "https://oauth2.googleapis.com/token",
//   auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
//   client_x509_cert_url:
//     "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40deaf-dumb-bc377.iam.gserviceaccount.com",
//   universe_domain: "googleapis.com",
// }

// // Initialize Firebase Admin
// if (!getApps().length) {
//   initializeApp({
//     credential: cert(serviceAccount as any),
//     projectId: "deaf-dumb-bc377",
//   })
// }

// export const adminAuth = getAuth()
// export const adminDb = getFirestore()

// export const verifyIdToken = async (idToken: string) => {
//   try {
//     const decodedToken = await adminAuth.verifyIdToken(idToken)
//     return { user: decodedToken, error: null }
//   } catch (error: any) {
//     return { user: null, error: error.message }
//   }
// }

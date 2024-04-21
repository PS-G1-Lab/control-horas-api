import path from "node:path"
import { fileURLToPath } from "node:url"

import nodemailer from "nodemailer"

import dotenv from "dotenv"

dotenv.config({ path: "../../../../.env" })

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAIL_AUTH_TOKEN,
	},
})

export async function sendMailVerification({ input }) {
	const { email, userName, role } = input

	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)

	let htmlString
	let attachments

	if (role === "0") {
		htmlString = createHtmlTemplateStudent({
			userName,
			email,
		})
		attachments = [
			{
				filename: "logo.png",
				path: `${__dirname}/assets/logo.png`,
				cid: "logo",
			},
		]
	} else {
		htmlString = createHtmlTemplateTeacher({
			userName,
			email,
		})
		attachments = [
			{
				filename: "logo.png",
				path: `${__dirname}/assets/logo.png`,
				cid: "logo",
			},
		]
	}

	const { error } = await transporter.sendMail({
		from: "El equipo de GestionAppmos",
		to: email,
		subject: `Bienvenido/a ${userName}, a GestionAppmos!`,
		html: htmlString,
		attachments,
	})

	if (error) {
		return { error }
	}

	return 0
}

function createHtmlTemplateStudent({ userName, email }) {
	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Título de la Página</title>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: #f6f5ff; margin: 0; padding: 0;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
              <td align="center">
                  <!-- Contenedor Principal -->
                  <table width="800" cellspacing="0" cellpadding="0" border="0" style="background-color: white; margin-left: auto; margin-right: auto;">
                      <tr>
                          <td align="center" style="font-family: 'Open Sans', sans-serif; padding: 20px;">
                              <img src="cid:logo" alt="Logo" style="vertical-align: middle;" />
                              <h1 style="vertical-align: middle; color: #2F2E41;">¡Bienvenido ${userName}!</h1>
                              <p style="font-size: 14px; color: #2F2E41;">Se ha confirmado su registro y su correo <a style="text-decoration: none; color: #2F2E41; font-weight: bold;">${email}</a> ha sido válidado con éxito.</p>
                              <h1 style="color: #2F2E41;">Busca tu primera clase.</h1>
                              <p style="font-size: 14px; color: #2F2E41;">Busca a tu profesor según tus necesidades, experiencia y presupuesto.</p>
                              <div style="font-family: 'Open Sans', sans-serif; background-color: #E6622E; padding: 5px; text-align: center; border-radius: 50px; width: 75px; border-color: #E6622E; ">
                                <a href="#" style="text-decoration: none; color: white; border-color: #E6622E;">Buscar</a>
                              </div>
                              <p style="display: flex; justify-content: left; font-size: 14px; margin-top: 20px; color: #2F2E41; font-weight: bold;">Atte, el equipo de GestionAppmos.</p>
                          </td>
                      </tr>
                  </table>
                  <!-- Fin Contenedor Principal -->
              </td>
          </tr>
      </table>
  </body>
  </html>
  `
}

function createHtmlTemplateTeacher({ userName, email }) {
	return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Título de la Página</title>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: #f6f5ff; margin: 0; padding: 0;">
      <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
          <tr>
              <td align="center">
                  <!-- Contenedor Principal -->
                  <table width="800" cellspacing="0" cellpadding="0" border="0" style="background-color: white; margin-left: auto; margin-right: auto;">
                      <tr>
                          <td align="center" style="font-family: 'Open Sans', sans-serif; padding: 20px;">
                              <img src="cid:logo" alt="Logo" style="vertical-align: middle;" />
                              <h1 style="vertical-align: middle; color: #2F2E41;">¡Bienvenido ${userName}!</h1>
                              <p style="font-size: 14px; color: #2F2E41;">Se ha confirmado su registro y su correo <a style="text-decoration: none; color: #2F2E41; font-weight: bold;">${email}</a> ha sido válidado con éxito.</p>
                              <h1 style="color: #2F2E41;">Crea tu primera clase.</h1>
                              <p style="font-size: 14px; color: #2F2E41;">Transmite tus conocimientos y gana dinero impartiendo clases particulares.</p>
                              <div style="font-family: 'Open Sans', sans-serif; background-color: #E6622E; padding: 5px; text-align: center; border-radius: 50px; width: 75px; border-color: #E6622E; ">
                                <a href="#" style="text-decoration: none; color: white; border-color: #E6622E;">Crear</a>
                              </div>
                              <p style="display: flex; justify-content: left; font-size: 14px; margin-top: 20px; color: #2F2E41; font-weight: bold;">Atte, el equipo de GestionAppmos.</p>
                          </td>
                      </tr>
                  </table>
                  <!-- Fin Contenedor Principal -->
              </td>
          </tr>
      </table>
  </body>
  </html>
  `
}

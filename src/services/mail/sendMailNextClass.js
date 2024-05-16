import path from "node:path"
import { fileURLToPath } from "node:url"

import nodemailer from "nodemailer"

import dotenv from "dotenv"

dotenv.config({ path: "././././.env" })

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 465,
	secure: true,
	auth: {
		user: process.env.MAIL,
		pass: process.env.MAIL_AUTH_TOKEN,
	},
})

export async function sendMailNextClass({ input }) {
	console.log(input)

	const { title, email } = input

	const __filename = fileURLToPath(import.meta.url)
	const __dirname = path.dirname(__filename)

	let htmlString
	let attachments

	htmlString = createHTMLTemplateNextClass({ title })
	attachments = [
		{
			filename: "logo.png",
			path: `${__dirname}/assets/logo.png`,
			cid: "logo",
		},
	]

	const { error } = await transporter.sendMail({
		from: "El equipo de GestionAppmos",
		to: email,
		subject: `Registro en clase ${title} confirmado`,
		html: htmlString,
		attachments,
	})

	if (error) {
		return { error }
	}

	return 0
}

function createHTMLTemplateNextClass({ title }) {
	return `
  <!DOCTYPE html>
  <html lang="es">
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
                  <table width="800" cellspacing="0" cellpadding="0" border="0" style="background-color: white; margin-left: auto; margin-right: auto;">
                      <tr>
                          <td align="center" style="font-family: 'Open Sans', sans-serif; padding: 20px;">
                              <img src="cid:logo" alt="Logo" style="vertical-align: middle;" />
                              <h1 style="vertical-align: middle; color: #2F2E41;">Tu registro a la clase ${title} ha sido confirmado</h1>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
  </body>
  </html>
  `
}

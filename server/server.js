import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import multer from 'multer'
import chat from './chat.js'
dotenv.config()
const app = express()
app.use(cors())
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, 'uploads/')
		},
		filename: function (req, file, cb) {
			cb(null, file.originalname)
		},
	}),
})
const PORT = 5001
let filePath
app.post(
	'/upload',
	upload.single('file'),
	async (req, res) => (filePath = req.file.pathres.send(filePath + ' upload successfully.'))
)
app.get('/chat', async (req, res) => {
	const resp = await chat(filePath, req.query.question)
	res.send(resp.text)
})
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

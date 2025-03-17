import path from "path"
import * as fs from 'fs'

export default async function uploadImage(img: File | 'null') {
    if(img == 'null'){
        return ''
    }
    console.log(img)
    try {
        const bytes = await img.arrayBuffer()
        const buffer = Buffer.from(bytes)
    
        const uploadDir = path.join('public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
    
        const imagePath = path.join(uploadDir, img.name)
        const writeStream = fs.createWriteStream(imagePath)
    
        writeStream.write(buffer)
        writeStream.end()
    
        return path.join('uploads', img.name)
    } catch(err) {
        console.log(err)
    }   
}
import pdf from 'html-pdf';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';
import pdfTemplate from './documents/document.js';
import dotenv from 'dotenv';
import puppeteer from 'puppeteer';

dotenv.config();

//PDF Generating
export const createPdf = async(req, res) => {
    const browser = await puppeteer.launch({
        args:[
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    });
    // Create a new page
    try{
        const page = await browser.newPage();
        const html = pdfTemplate(req.body);
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        const pdf = await page.pdf({
            path: `invoice${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });
    // Close the browser instance
        res.send(pdf);
    }catch(err) {
        console.log(err)
    }finally {
        await browser.close();
    }
};

export const fetchPdf = (req, res) => {
    //const conn = await pool.getConnection();

    res.sendFile(path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`));

    //conn.release();
};

export const sendPdf = (req, res) => {
    //const conn = await pool.getConnection();

    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');

    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            pass: process.env.WORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
        },
    });

    smtpTransport.sendMail(
        {
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Pdf Generate document',
            html: `
        Testing Pdf Generate document, Thanks.`,
            attachments: [
                {
                    content: attachment,
                    filename: `invoice.pdf${req.body.Ordernumber}`,
                    contentType: 'application/pdf',
                    path: pathToAttachment,
                },
            ],
        },
        function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.send('Mail has been sent to your email. Check your mail');
            }
        }
    );

    //conn.release();
};

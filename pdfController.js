import pdf from 'html-pdf';
import path from 'path';
import nodemailer from 'nodemailer';
import fs from 'fs';
import pdfTemplate from './documents/document.js';
import pdfSecondTemplate from './documents/document2.js';
import pdfThirdTemplate from './documents/document3.js';
import pdfFourTemplate from './documents/document4.js';
import pdfFiveTemplate from './documents/document5.js';
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
        const page2 = await browser.newPage();
        const page3 = await browser.newPage();
        const page4 = await browser.newPage();
        const page5 = await browser.newPage();
        const html = pdfTemplate(req.body);
        const html2 = pdfSecondTemplate(req.body);
        const html3 = pdfThirdTemplate(req.body);
        const html4 = pdfFourTemplate(req.body);
        const html5 = pdfFiveTemplate(req.body);
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page2.setContent(html2, { waitUntil: 'domcontentloaded' });
        await page3.setContent(html3, { waitUntil: 'domcontentloaded' });
        await page4.setContent(html4, { waitUntil: 'domcontentloaded' });
        await page5.setContent(html5, { waitUntil: 'domcontentloaded' });
        const pdf = await page.pdf({
            path: `invoice${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });

        const pdf2 = await page2.pdf({
            path: `authorization${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });

        const pdf3 = await page3.pdf({
            path: `ALVAuthorization${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });

        const pdf4= await page4.pdf({
            path: `ApostilleAuthorization${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });

        const pdf5 = await page5.pdf({
            path: `CertificateAuthorization${req.body.Ordernumber}.pdf`,
            printBackground: true,
            format: 'A4',
        });
        
        const pdfs = {
            firstPDF: pdf,
            secondPDF: pdf2,
            thirdPDF: pdf3,
            fourPDF: pdf4,
            fivePDF: pdf5,
        }
    // Close the browser instance
        res.send(pdfs);
    }catch(err) {
        console.log(err)
    }finally {
        await browser.close();
    }
};

export const fetchPdf = (req, res) => {
    //const conn = await pool.getConnection();

    res.sendFile(path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`));
    res.sendFile(path.join(global.__dirname, `authorization${req.body.Ordernumber}.pdf`));
    res.sendFile(path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}.pdf`));
    res.sendFile(path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}.pdf`));
    res.sendFile(path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}.pdf`));

    //conn.release();
};

export const sendPdf = (req, res) => {
    //const conn = await pool.getConnection();

    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}pdf`);
    const pathToAttachment2 = path.join(global.__dirname, `authorization${req.body.Ordernumber}pdf`);
    const pathToAttachment3 = path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}pdf`);
    const pathToAttachment4 = path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}pdf`);
    const pathToAttachment5 = path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment2 = fs.readFileSync(pathToAttachment2).toString('base64');
    const attachment3 = fs.readFileSync(pathToAttachment3).toString('base64');
    const attachment4 = fs.readFileSync(pathToAttachment4).toString('base64');
    const attachment5 = fs.readFileSync(pathToAttachment5).toString('base64');

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
                    filename: `invoice${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                    path: pathToAttachment,
                },
                {
                    content: attachment2,
                    filename: `authorization${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                    path: pathToAttachment2,
                },
                {
                    content: attachment3,
                    filename: `ALVAuthorization${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                    path: pathToAttachment3,
                },
                {
                    content: attachment4,
                    filename: `ApostilleAuthorization${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                    path: pathToAttachment4,
                },
                {
                    content: attachment5,
                    filename: `CertificateAuthorization${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                    path: pathToAttachment5,
                }
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

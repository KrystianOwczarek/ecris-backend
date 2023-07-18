import { createPdf, fetchPdf, sendPdf } from './pdfController.js';
import express from "express";

//Routes for PDF generation

const pdfRoute = express.Router();

pdfRoute.post('/createPdf', createPdf); // generowanie PDF-a

pdfRoute.get('/fetchPdf', fetchPdf); // pobieranie wygenerowanego PDF-a

pdfRoute.post('/sendPdf', sendPdf); // wysyłanie PDF-a przez e-mail

export default pdfRoute;
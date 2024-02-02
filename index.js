import express from "express";
import mysql from "mysql";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from 'dotenv';
import * as fs from "fs";
import pdfRoute from "./pdfRoutes.js";
import path from 'path';
import mime from "mime";
import bodyParser from "body-parser";
import multer from 'multer';
import uuidv4 from 'uuidv4';
global.__dirname = path.resolve();

dotenv.config();


const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //     cb(null, 'uploads')
    // },
    // filename: function (req, file, cb) {
    //     cb(null, file.originalname)
    // }
})

const upload = multer({ storage: storage }).array('file');


//Database connection
const pool = mysql.createPool({
    host: "sql11.freemysqlhosting.net",
    user: "sql11675977",
    password: "uzKKi5it6c",
    database: "sql11675977",
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
})

//You can use env variables in this transporter but you have to configure it on Deta, i left this like this beacuse Deta have problems with env variables.
let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: "ecrisapptest@gmail.com",
        pass: "AW7nhL8wd0mBCvkI"
    },
});

transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages and Gmail API V1: ${success} ===`);
});

// mime
mime.define({
  'application/json': ['json'],
}, { force: true })



const app = express();
app.use(cors());
app.use(express.json());
app.use(pdfRoute);
const port = process.env.PORT || 8080;

//pasery
//Content-type: application/json
app.use(bodyParser.json())



// const db = mysql.createConnection({
//     host: "sql7.freemysqlhosting.net",
//     user: "sql7627486",
//     password: "Gyebp4m63j",
//     database: "sql7627486"
// });

//await db.connect()

if(pool){
    console.log("Database Connected");
}else{
    console.log("Database Denied");
    await pool.connect()
}

app.get("/", async (req, res) => {
    res.json("hello");
});


//Handle order numbers
app.get("/orderNumbers", (req, res) => {
    //const conn = pool.getConnection();
    const q = "SELECT MAX(ID) AS OstatnieID FROM ordernumbers;";
    
    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release()
});



//Handle customize email addreses
app.get("/emailadr", async (req, res) => {
    //const conn = pool.getConnection();

        const q = "SELECT Email FROM emails";
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        });
        //conn.release();
});

app.get("/pageLanguage", async (req, res) => {
    //const conn = pool.getConnection();

        const q = "SELECT language FROM pageLanguage";
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        });
        //conn.release();
});

//Handle customize email addreses
app.get("/emailToSend", async (req, res) => {
    //const conn = pool.getConnection();

        const q = "SELECT * FROM emailToSend";
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json(data);
        })
})

app.get("/powerOfAttorney", async (req, res) => {
    //const conn = pool.getConnection();
    const q = "SELECT * FROM powerOfAttorney";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/emailTemplate", async (req, res) => {
    //const conn = pool.getConnection();
    const q = "SELECT * FROM emailTemplate";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/emailTitle", async (req, res) => {
    //const conn = pool.getConnection();
    const q = "SELECT * FROM emailTitle";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    })
})

app.put("/updateLink", async (req, res) => {
    //const conn = pool.getConnection();
        const q = `UPDATE aditset SET link='${req.body.link}' WHERE ID=1`;
        
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Link update successfully" });
        });
        //conn.release();
});

app.post("/changePageLanguage", async (req, res) => {
    //const conn = pool.getConnection();
        const q = `UPDATE pageLanguage SET language='${req.body.langNumber}' WHERE id=1`;
        
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Link update successfully" });
        });
        //conn.release();
});

//Handle Section Visibility
app.put("/enableService/:id", async (req, res) => {
    //const conn = pool.getConnection();
        const { id } = req.params;
        const q = `UPDATE aditset SET Status = 1 WHERE ID = ${id}`;
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Service enabled successfully" });
        });
        //conn.release();
});


app.put("/enableRequired/:id", async (req, res) => {
    //const conn = pool.getConnection();
        const { id } = req.params;
        const q = `UPDATE aditset SET requirement = 1 WHERE ID = ${id}`;
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Service enabled successfully" });
        });
        //conn.release();
});


app.put("/disableService/:id", async (req, res) => {
    //const conn = pool.getConnection();
        const { id } = req.params;
        const q = `UPDATE aditset SET Status = 0 WHERE ID = ${id}`;
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Service disabled successfully" });
        });
        //conn.release();
});

app.put("/disableRequired/:id", async (req, res) => {
    //const conn = pool.getConnection();
        const { id } = req.params;
        const q = `UPDATE aditset SET requirement = 0 WHERE ID = ${id}`;
        await pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }
            return res.json({ message: "Service disabled successfully" });
        });
        //conn.release();
});

app.get("/aditset", async (req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM aditset";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/aditset1", async (req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM aditset";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});


//-----------------------------------------GET OBJECTS------------------------------------------------------------------
app.get("/typeSendingMail", async(req, res) => {
    const q = "SELECT * FROM typeSendingMail";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/countries", async(req, res) => {
    const q = "SELECT * FROM countries ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/countryList", async(req, res) => {
    const q = "SELECT * FROM countryList ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/getCountryMailMessage", async(req, res) => {
    const q = "SELECT * FROM countryMailMessage";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/getCitizenshipMailMessage", async(req, res) => {
    const q = "SELECT * FROM citizenshipMailMessage";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/getCountryPDFMessage", async(req, res) => {
    const q = "SELECT * FROM countryPDFMessage";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/getCitizenshipPDFMessage", async(req, res) => {
    const q = "SELECT * FROM citizenshipPDFMessage";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/globalCountryGetComment", async(req, res) => {
    const q = "SELECT * FROM globalCountryCommentary";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/globalGetTatCountry", async(req, res) => {
    const q = "SELECT * FROM globalTatCountry";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/globalGetTatCitizenship", async(req, res) => {
    const q = "SELECT * FROM globalTatCitizenship";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

//get all headers from first page
app.get("/fPageHeaders", async(req, res) => {
    const q = "SELECT * FROM fPageHeaders";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/fPageHeadersId", async(req, res) => {
    const q = `SELECT * FROM fPageHeaders WHERE id=${req.body.id}`;
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

//get all headers from second page
app.get("/sPageHeaders", async(req, res) => {
    const q = "SELECT * FROM sPageHeaders";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/sPageHeadersId", async(req, res) => {
    const q = `SELECT * FROM sPageHeaders WHERE id=${req.body.id}`;
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

//get all headers from third page
app.get("/tPageHeaders", async(req, res) => {
    const q = "SELECT * FROM tPageHeaders";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/tPageHeadersId", async(req, res) => {
    const q = `SELECT * FROM tPageHeaders WHERE id=${req.body.id}`;
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });
});

app.get("/citizenships", async (req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM citizenships ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

//ALV - Additional Language Version
app.get("/alv", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM alv ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/apostille", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM apostille ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/certificate", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM certificate ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/delivery", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM delivery ORDER BY kolejnosc";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

//-----------------------------------------GET OBJECTS----------------------------------------------------------------


//------------------------------------------Adding Data-----------------------------------------------------------------
app.post("/addcountries", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO countries(`country_name`,`id`,`tat`,`price_eu`,`price_gb`,`price_bu`,`price_cz`,`price_pl`,`price_dk`,`price_ro`,`price_se`,`comment`,`comment2`, `email_text`, `pdf_text`, `requirement`, `checkboxStatus`, `addtat`, `subtat`,`kolejnosc`) VALUES (?)";

    const values = [
        req.body.country_name,
        req.body.id,
        req.body.tat,
        req.body.price_eu,
        req.body.price_gb,
        req.body.price_bu,
        req.body.price_cz,
        req.body.price_pl,
        req.body.price_dk,
        req.body.price_ro,
        req.body.price_se,
        req.body.comment,
        req.body.comment2,
        req.body.email_text,
        req.body.pdf_text,
        req.body.requirement,
        req.body.checkboxStatus,
        req.body.increaseTat,
        req.body.decreaseTat,
        req.body.order_table
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/addcountriesList", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO countryList(`country`,`vat`,`kolejnosc`,`id`,`deliveryTat`,`disabledService`) VALUES (?)";

    const values = [
        req.body.country,
        req.body.vat,
        req.body.order_table,
        req.body.id,
        req.body.deliveryTat,
        req.body.disabledService,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/globalCountryCommentary", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE globalCountryCommentary SET comment='${req.body.newcomment}' WHERE comment='${req.body.oldcomment}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/countryMailMessage", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE countryMailMessage SET mailMessage='${req.body.newmessage}' WHERE mailMessage='${req.body.oldmessage}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/citizenshipMailMessage", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE citizenshipMailMessage SET mailMessage='${req.body.newmessage}' WHERE mailMessage='${req.body.oldmessage}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/countryPDFMessage", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE countryPDFMessage SET pdfMessage='${req.body.newmessage}' WHERE pdfMessage='${req.body.oldmessage}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/citizenshipPDFMessage", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE citizenshipPDFMessage SET pdfMessage='${req.body.newmessage}' WHERE pdfMessage='${req.body.oldmessage}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/typeSendingMailUpdate", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE typeSendingMail SET mailStatus=${req.body.mailStatus} WHERE id=1`;
    console.log(q)
    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/globalTatCountry", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE globalTatCountry SET addtat='${req.body.addtat}', subtat='${req.body.subtat}' WHERE id=1`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/globalTatCitizenship", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `UPDATE globalTatCitizenship SET addtat='${req.body.addtat}', subtat='${req.body.subtat}' WHERE id=1`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.post("/addLanguageFPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `INSERT INTO fPageHeaders (language,id) VALUES ('${req.body.language}','${req.body.id}')`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
});

app.put("/updatefPageHeader", async (req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = 'UPDATE fPageHeaders SET `jobSeeker1`=?, `jobSeeker2`=?, `jobSeeker3`=?, `jobSeeker4`=?, `jobSeeker5`=?, `jobSeeker6`=?, `chooseCountries`=?, `countryHeader`=?, `tatHeader`=?, `priceHeader`=?, `chooseCitizenship`=?, `citHeader`=?, `repDelHeader`=?, `detailsHeader`=?, `optionalServicesHeader`=?, `optionalServicesComment`=?, `addLangHeader`=?, `addLangComment`=?, `oServicesHeader`=?, `addTatHeader`=?, `certTransHeader`=?, `certTransComment`=?, `apostilleHeader`=?, `apostilleComment`=?, `costHeader`=?, `costStatesHeader`=?, `costReportHeader`=?, `costAddTatHeader`=?, `costCertHeader`=?, `costApostilleHeader`=?, `costSummaryHeader`=?, `costSummaryText`=?, `costAddTatText`=?, `costTotalHeader`=?, `includeTaxText`=?, `chargeHeader`=?, `turnarountTAT`=?, `additionalServices`=? WHERE `id`=?';

    const values = [
        req.body.jobSeeker1,
        req.body.jobSeeker2,
        req.body.jobSeeker3,
        req.body.jobSeeker4,
        req.body.jobSeeker5,
        req.body.jobSeeker6,
        req.body.chooseCountries,
        req.body.countryHeader,
        req.body.tatHeader,
        req.body.priceHeader,
        req.body.chooseCitizenship,
        req.body.citHeader,
        req.body.repDelHeader,
        req.body.detailsHeader,
        req.body.optionalServicesHeader,
        req.body.optionalServicesComment,
        req.body.addLangHeader,
        req.body.addLangComment,
        req.body.oServicesHeader,
        req.body.addTatHeader,
        req.body.certTransHeader,
        req.body.certTransComment,
        req.body.apostilleHeader,
        req.body.apostilleComment,
        req.body.costHeader,
        req.body.costStatesHeader,
        req.body.costReportHeader,
        req.body.costAddTatHeader,
        req.body.costCertHeader,
        req.body.costApostilleHeader,
        req.body.costSummaryHeader,
        req.body.costSummaryText,
        req.body.costAddTatText,
        req.body.costTotalHeader,
        req.body.includeTaxText,
        req.body.chargeHeader,
        req.body.turnarountTAT,
        req.body.additionalServices,
    ];

    pool.query(q, [...values, req.body.id], (err, data) => {
        if (err) {
            console.log(err);
        }
        return res.json(data);
    });
});

app.post("/addLanguageSPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `INSERT INTO sPageHeaders (language,id) VALUES ('${req.body.language}','${req.body.id}')`;

    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
    //conn.release();
});

app.put("/updateSPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = 'UPDATE `sPageHeaders` SET `provideHeader`=?,`provideComment`=?, `title`=?,`titleComment`=?,`forename`=?,`forenameComment`=?,`middleName`=?,`middleNameComment`=?,`surname`=?,`surnameComment`=?,`surnameBirth`=?,`surnameBirthComment`=?,`birthDate`=?,`birthDateComment`=?,`birthTown`=?,`birthTownComment`=?,`birthCountry`=?,`birthCountryComment`=?,`montherName`=?,`montherNameComment`=?,`motherMName`=?,`motherMNameComment`=?,`idNumber`=?,`idNumberComment`=?,`currentAdress`=?,`addressLine1`=?,`addressLine1Comment`=?,`addressLine2`=?,`addressLine2Comment`=?,`country`=?,`countryComment`=?,`emailAddress`=?,`emailAddressComment`=?,`confEmailAddress`=?,`confEmailAddressComment`=?,`phoneNumber`=?,`phoneNumberComment`=?,`uploadScan`=?,`uploadScanComment`=?,`indedRecipent`=?,`indedRecipentComment`=?,`addComment`=?,`addCommentComment`=?,`uploadFiles`=?,`id`=?,`fatherName`=?,`fatherNameComment`=?,`mr`=?,`ms`=? WHERE `id`=?';

    const values = [
        req.body.provideHeader,
        req.body.provideComment,
        req.body.title,
        req.body.titleComment,
        req.body.forename,
        req.body.forenameComment,
        req.body.middleName,
        req.body.middleNameComment,
        req.body.surname,
        req.body.surnameComment,
        req.body.surnameBirth,
        req.body.surnameBirthComment,
        req.body.birthDate,
        req.body.birthDateComment,
        req.body.birthTown,
        req.body.birthTownComment,
        req.body.birthCountry,
        req.body.birthCountryComment,
        req.body.montherName,
        req.body.montherNameComment,
        req.body.motherMName,
        req.body.motherMNameComment,
        req.body.idNumber,
        req.body.idNumberComment,
        req.body.currentAdress,
        req.body.addressLine1,
        req.body.addressLine1Comment,
        req.body.addressLine2,
        req.body.addressLine2Comment,
        req.body.country,
        req.body.countryComment,
        req.body.emailAddress,
        req.body.emailAddressComment,
        req.body.confEmailAddress,
        req.body.confEmailAddressComment,
        req.body.phoneNumber,
        req.body.phoneNumberComment,
        req.body.uploadScan,
        req.body.uploadScanComment,
        req.body.indedRecipent,
        req.body.indedRecipentComment,
        req.body.addComment,
        req.body.addCommentComment,
        req.body.uploadFiles,
        req.body.id,
        req.body.fatherName,
        req.body.fatherNameComment,
        req.body.mr,
        req.body.ms,
    ];

    pool.query(q, [...values, req.body.id], (err, data) => {
        if (err) console.log(err) 
        return res.json(data);
    });
    //conn.release();
});

app.post("/addLanguageTPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const q = `INSERT INTO tPageHeaders (language,id) VALUES ('${req.body.language}','${req.body.id}')`;

    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
    //conn.release();
});

app.put("/updateTPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = 'UPDATE `tPageHeaders` SET `orderSummary`=?,`checkData`=?,`selectedOpt`=?,`addComment`=?,`charge`=?,`tat`=?,`personalData`=?,`address`=?,`privacyPolicy`=?,`id`=?,`announcement`=? WHERE id=?';

    const values = [
        req.body.orderSummary,
        req.body.checkData,
        req.body.selectedOpt,
        req.body.addComment,
        req.body.charge,
        req.body.tat,
        req.body.personalData,
        req.body.address,
        req.body.privacyPolicy,
        req.body.id,
        req.body.announcement
    ];

    pool.query(q, [...values, req.body.id], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/addcitizenships", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO citizenships(`citizenship`,`TAT`,`commentCit`,`email_text`,`pdf_text`,`GTC`,`addtat`,`subtat`,`ID`,`influCit`, `VAT`,`kolejnosc`) VALUES (?)";

    const values = [
        req.body.citizenship,
        req.body.TAT,
        req.body.commentCit,
        req.body.email_text,
        req.body.pdf_text,
        req.body.GTC,
        req.body.increaseTat,
        req.body.decreaseTat,
        req.body.id,
        req.body.influCit,
        req.body.VAT,
        req.body.order_table,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addalv", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO alv(`language`,`id`,`addTAT`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`,`email_text`,`pdf_text`,`kolejnosc`,`comment`) VALUES (?)";

    const values = [
        req.body.language,
        req.body.id,
        req.body.AddTAT,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.email_text,
        req.body.pdf_text,
        req.body.order_table,
        req.body.comment,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addappostile", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO apostille(`type`,`tatApost`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`,`id`,`comment`,`email_text`,`kolejnosc`,`pdf_text`) VALUES (?)";

    const values = [
        req.body.type,
        req.body.tatApost,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.id,
        req.body.comment,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/adddelivery", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO delivery(`id`,`delivery_option`,`delTat`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`,`type`,`email_text`,`kolejnosc`,`pdf_text`,`comment`) VALUES (?)";

    const values = [
        req.body.id,
        req.body.delivery_option,
        req.body.delTat,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.type,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text,
        req.body.comment,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addcertificate", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO certificate(`language`,`tatCER`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`,`id`,`comment`,`influCer`,`email_text`,`kolejnosc`,`pdf_text`) VALUES (?)";

    const values = [
        req.body.language,
        req.body.tatCER,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.id,
        req.body.comment,
        req.body.influCer,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/addService", async(req, res) => {

    const q = `CREATE TABLE ${req.body.header} ( Type VARCHAR(255), Tat INT(11), priceEU INT(11), priceGB INT(11), priceBU INT(11), priceCZ INT(11),pricePL INT(11), priceDK INT(11), priceRO INT(11), priceSE INT(11), comment LONGTEXT, email_text LONGTEXT, visibility INT(11), selected INT(11), multiplicationPrice INT(11), multiplicationTat INT(11), visibilityASelection LONGTEXT, choiceAfterChoice LONGTEXT,pdfText LONGTEXT, bubbleText LONGTEXT, kolejnosc INT(11), id VARCHAR(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.get('/newService', async(req, res) => {
    const q = 'SELECT * FROM `newServices`';
    
    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/columnsNames', async(req, res) => {
    const q = `DESCRIBE ${req.body.url}`;
    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/columnsValues', async(req, res) => {
    const q = `SELECT * FROM ${req.body.url} ORDER BY kolejnosc`;

    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/columnsValues/:id', async(req, res) => {
    const { id } = req.params;
    const q = `SELECT * FROM ${req.body.url} WHERE id='${id}'`;

    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.put('/updateColumnsValues/:id', async(req, res) => {
    const { id } = req.params;
    const array = [];
    const obj = req.body.obj;
    for(const key in obj) {
        array.push(`${key}=?`)
    }
    const q = `UPDATE ${req.body.header} SET ${array.toString()}  WHERE id='${id}'`;
    const values = Object.values(obj);


    pool.query(q,[...values, id], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/addColumnsValues', async(req, res) => {
    const columnArray = [];
    req.body.columns.map(column => columnArray.push(column.Field));
    const columnString = columnArray.toString();
    const q = `INSERT INTO ${req.body.header} (${columnString}) VALUES (?)`;
    const values = [];
    for(const key in req.body.values){
        values.push(req.body.values[key]);
    }
    values.push(req.body.id);


    pool.query(q, [values], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post('/newServices', async(req, res) => {
    const q = 'INSERT INTO newServices (`allServices`,`serviceVisibility`,`requirement`,`multiplicity`,`inclusionTat`,`CrcOrAsTat`,`multiplicationPrice`,`multiplicationTat`,`bubbleText`) VALUES (?)';

    const values = [
        req.body.allServices,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ''
    ];  

    pool.query(q,[values], (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/renameTable', async(req, res) => {
    const q = `ALTER TABLE ${req.body.oldtable} RENAME ${req.body.newtable}`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewService', async(req, res) => {
    const q = `UPDATE newServices SET allServices='${req.body.newtable}' WHERE allServices='${req.body.oldtable}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceVisibility', async(req, res) => {
    const q = `UPDATE newServices SET serviceVisibility='${req.body.visibility}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceRequirement', async(req, res) => {
    const q = `UPDATE newServices SET requirement='${req.body.requirement}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceMultiplicity', async(req, res) => {
    const q = `UPDATE newServices SET multiplicity='${req.body.multiplicity}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceInclusionTat', async(req, res) => {
    const q = `UPDATE newServices SET inclusionTat='${req.body.inclusionTat}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceCrcOrAsTat', async(req, res) => {
    const q = `UPDATE newServices SET CrcOrAsTat='${req.body.CrcOrAsTat}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceMultiplicationPrice', async(req, res) => {
    const q = `UPDATE newServices SET multiplicationPrice='${req.body.multiplicationPrice}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceMultiplicationTat', async(req, res) => {
    const q = `UPDATE newServices SET multiplicationTat='${req.body.multiplicationTat}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateNewServiceBubbleText', async(req, res) => {
    const q = `UPDATE newServices SET bubbleText='${req.body.bubbleText}' WHERE allServices='${req.body.oldname}'`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updatePowerOfAttorney', async(req, res) => {
    const q = `UPDATE powerOfAttorney SET header='${req.body.header}',firstPieceOfText='${req.body.firstPieceOfText}',registers='${req.body.registers}',secondPieceOfText='${req.body.secondPieceOfText}' WHERE id=${req.body.id}`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateEmailTemplate', async(req, res) => {
    const q = `UPDATE emailTemplate SET header='${req.body.header}',text='${req.body.text}' WHERE id=${req.body.id}`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

app.post('/updateEmailTitle', async(req, res) => {
    const q = `UPDATE emailTitle SET title='${req.body.title}',title2='${req.body.title2}' WHERE id=${req.body.id}`;

    pool.query(q, (err, data) => {
        if(err) return res.send(err);
        return res.json(data);
    })
})

//-----------------------------------------DELETING---------------------------------------------------------

app.delete("/delete/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM countries WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});


app.delete("/deleteCountryList/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM countryList WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/deleteService", async(req, res) => {
    const q = `DROP TABLE ${req.body.header}`;
    console.log(q)
    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/deleteServiceFromNewService", async(req, res) => {
    const q = `DELETE FROM newServices WHERE allServices='${req.body.header}'`;
    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.delete("/deleteCit/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM citizenships WHERE ID = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.delete("/deleteCer/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM certificate WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.delete("/deleteApo/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM apostille WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.delete("/deleteDel/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM delivery WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.delete("/deleteAlv/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "DELETE FROM alv WHERE id = ?";

    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/deleteValues/:id", async(req, res) => {
    const bookId = req.params.id;
    const q = `DELETE FROM ${req.body.header} WHERE id = ?`;
    pool.query(q, [bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

//-----------------------------------------DELETING---------------------------------------------------------


//-----------------------------------------PUTING/UPDATING-------------------------------------------------------
app.post("/orderNumbers", async(req, res) => {
    //const conn = pool.getConnection();

    const q = `INSERT INTO ordernumbers (id) VALUES (${req.body.id})`;


    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/countries/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE countries SET `country_name`= ?, id = ?, `tat`= ?, `price_eu`= ?, `price_gb`= ?, `price_bu`= ?, `price_cz`= ?, `price_pl`= ?, `price_dk`= ?, `price_ro`= ?, `price_se`= ?, `comment`= ?, `comment2`= ?, `email_text`= ?, `pdf_text`= ?, `requirement`=?, `checkboxStatus`=?, `addtat`=?, `subtat`=?,`kolejnosc`=? WHERE id = ?";

    const values = [
        req.body.country_name,
        req.body.id,
        req.body.tat,
        req.body.price_eu,
        req.body.price_gb,
        req.body.price_bu,
        req.body.price_cz,
        req.body.price_pl,
        req.body.price_dk,
        req.body.price_ro,
        req.body.price_se,
        req.body.comment,
        req.body.comment2,
        req.body.email_text,
        req.body.pdf_text,
        req.body.requirement,
        req.body.checkboxStatus,
        req.body.increaseTat,
        req.body.decreaseTat,
        req.body.order_table
    ];
    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/updateCountryList/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE countryList SET `country`=?,`vat`=?,`kolejnosc`=?,`id`=?,`deliveryTat`=?, `disabledService`=? WHERE id = ?";

    const values = [
        req.body.country,
        req.body.vat,
        req.body.order_table,
        req.body.id,
        req.body.deliveryTat,
        req.body.disabledService,
    ];
    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});


app.put("/citizenships/:id", async (req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;

    const q = "UPDATE citizenships SET  `citizenship`= ?, `TAT`= ?, `commentCit`= ?, `email_text`= ?, `pdf_text`= ?, `GTC`= ?, `addtat`=?, `subtat`=?, `ID`= ?, `influCit`=?, `kolejnosc`=? WHERE ID = ?";

    const values = [
        req.body.citizenship,
        req.body.TAT,
        req.body.commentCit,
        req.body.email_text,
        req.body.pdf_text,
        req.body.GTC,
        req.body.increaseTat,
        req.body.decreaseTat,
        req.body.ID,
        req.body.influCit,
        req.body.order_table
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(values);
        return res.json(data);
    });

    //conn.release();
});

app.put("/edit/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE emails SET `Email`= ? WHERE `id` = ?";

    const values = [
        req.body.Email
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});



app.put("/alv/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE alv SET `language`= ?, `AddTAT`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=?, `email_text`=?,`pdf_text`=?,`kolejnosc`=?,`comment`=? WHERE `id` = ?";

    const values = [
        req.body.language,
        req.body.AddTAT,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.id,
        req.body.email_text,
        req.body.pdf_text,
        req.body.order_table,
        req.body.comment
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/apostille/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE apostille SET `type`= ?, `tatApost`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=?, `comment`=?, `email_text`=?,`kolejnosc`=?,`pdf_text`=? WHERE `id` = ?";

    const values = [
        req.body.type,
        req.body.tatApost,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.id,
        req.body.comment,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/certificate/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE certificate SET `language`= ?, `tatCER`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=?, `comment`=?, `influCer`=?, `email_text`=?,`kolejnosc`=?,`pdf_text`=? WHERE `id` = ?";

    const values = [
        req.body.language,
        req.body.tatCER,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.id,
        req.body.comment,
        req.body.influCer,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text,
    ];

    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/delivery/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE delivery SET `id`= ?, `delivery_option`= ?, `delTat`= ?,`priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `type`= ?, `email_text`=?,`kolejnosc`=?,`pdf_text`=?,`comment`=? WHERE `id` = ?";

    const values = [
        req.body.id,
        req.body.delivery_option,
        req.body.delTat,
        req.body.priceEU,
        req.body.priceGB,
        req.body.priceBU,
        req.body.priceCZ,
        req.body.pricePL,
        req.body.priceDK,
        req.body.priceRO,
        req.body.priceSE,
        req.body.type,
        req.body.email_text,
        req.body.order_table,
        req.body.pdf_text,
        req.body.comment,
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

//----------------------------------------------EMAIL PREDIFINED--------------------------------------------------------

app.get("/techmail", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT Email FROM emails WHERE ID=1;";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/notificationmail", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT Email FROM emails WHERE ID=2;";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});

app.get("/copyofmail", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT Email FROM emails WHERE ID=3;";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });

    //conn.release();
});


//----------------------------------------------EMAIL SENDING---------------------------------------------------------------
app.post("/send", (req, res) => {
    //const conn = pool.getConnection();


    //console.log('Received CLIENT (/send) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const pathToAttachment2 = path.join(global.__dirname, `authorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment3 = path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment4 = path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment5 = path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment2 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment3 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment4 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment5 = fs.readFileSync(pathToAttachment).toString('base64');

    const q = "SELECT Email FROM emails WHERE ID=3;";
    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        const recipientEmail = data[0].Email;

        let mailOptions = {
            from: `ecrisapptest@gmail.com`,
            to: recipientEmail,
            subject: `${req.body.name}`,
            html: `${req.body.html}`,
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
        };

        
        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.error('Błąd podczas wysyłania e-maila:', err);
                res.json({
                    status: "fail",
                });
            } else {
                console.log("== Message Sent ==");
                res.json({
                    status: "success",
                });
            }
        });
    });
    //conn.release();
});

app.post("/saveDataForEmail", async(req, res) => {
    //const conn = pool.getConnection();
    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const pathToAttachment2 = path.join(global.__dirname, `authorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment3 = path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment4 = path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment5 = path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment2 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment3 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment4 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment5 = fs.readFileSync(pathToAttachment).toString('base64');

    const q = "INSERT INTO emailToSend (`Ordernumber`,`name`,`email`,`message`,`html`,`attachment`,`attachment2`) VALUES (?)";

    const values = [
        req.body.Ordernumber,
        req.body.name,
        req.body.email,
        req.body.message,
        req.body.html,
        attachment,
        attachment2,
        attachment3,
        attachment4,
        attachment5,
    ];
    pool.query(q, [values], (err, data) => {
        if (err) {
            console.error('Błąd podczas wysyłania e-maila:', err);
            res.json({
                status: "fail",
            });
        } else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });
});

app.post("/send1", (req, res) => {
    //const conn = pool.getConnection();


    //console.log('Received CLIENT (/send1) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const pathToAttachment2 = path.join(global.__dirname, `authorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment3 = path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment4 = path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}.pdf`);
    const pathToAttachment5 = path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment2 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment3 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment4 = fs.readFileSync(pathToAttachment).toString('base64');
    const attachment5 = fs.readFileSync(pathToAttachment).toString('base64');



    let mailOptions = {
        from: process.env.EMAIL,
        to: `${req.body.email}`,
        subject: `${req.body.name}`,
        html: `${req.body.html}`,
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
    };

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.error('Błąd podczas wysyłania e-maila:', err);
            res.json({
                status: "fail",
            });
        } else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });

    //conn.release();
});


app.post("/sendMail", (req, res) => {
    //const conn = pool.getConnection();

    //console.log('Received CLIENT (/send1) email data:', req.body);
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        let mailOptions = {
            from: process.env.EMAIL,
            to: `${req.body.email}`,
            subject: `${req.body.name}`,
            html: `${req.body.html}`,
            attachments: [
                {
                    content: req.files[0],
                    filename: `invoice${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                },
                {
                    content: req.files[1],
                    filename: `authorization${req.body.Ordernumber}.pdf`,
                    contentType: 'application/pdf',
                }
            ],
        };
        console.log(mailOptions)

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.error('Błąd podczas wysyłania e-maila:', err);
            res.json({
                status: "fail",
            });
        } else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });
    })
    //conn.release();
});

app.post("/send2", (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
            //console.log('Received TECHNICAL (/send3) email data:', req.body);
        const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
        const pathToAttachment2 = path.join(global.__dirname, `authorization${req.body.Ordernumber}.pdf`);
        const pathToAttachment3 = path.join(global.__dirname, `ALVAuthorization${req.body.Ordernumber}.pdf`);
        const pathToAttachment4 = path.join(global.__dirname, `ApostilleAuthorization${req.body.Ordernumber}.pdf`);
        const pathToAttachment5 = path.join(global.__dirname, `CertificateAuthorization${req.body.Ordernumber}.pdf`);
        const attachment = fs.readFileSync(pathToAttachment).toString('base64');
        const attachment2 = fs.readFileSync(pathToAttachment).toString('base64');
        const attachment3 = fs.readFileSync(pathToAttachment).toString('base64');
        const attachment4 = fs.readFileSync(pathToAttachment).toString('base64');
        const attachment5 = fs.readFileSync(pathToAttachment).toString('base64');
        let attachments = [
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
            },
        ];
        req.files.forEach((file) => {
            const filePath = file.path;
            const f = fs.readFileSync(filePath).toString('base64');
            const attachment = {
                content: f,
                filename: `${file.originalname}`,
                contentType: `${file.mimetype}`,
                path: filePath
            }
            attachments.push(attachment)
        })
        
        console.log(attachments)
    
        const q = "SELECT Email FROM emails WHERE ID=2;";
        pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }

            const recipientEmail = data[0].Email;

            let mailOptions = {
                from: process.env.EMAIL,
                to: recipientEmail,
                subject: `${req.body.name}`,
                html: `${req.body.html}`,
                attachments: attachments
            };


            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.error('Błąd podczas wysyłania e-maila:', err);
                    res.json({
                        status: "fail",
                    });
                } else {
                    console.log("== Message Sent ==");
                    res.json({
                        status: "success",
                    });
                }
            });
        });
    })

    // const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    // const attachment = fs.readFileSync(pathToAttachment).toString('base64');

    

    //conn.release();
});

app.post("/send3", (req, res) => {
    //const conn = pool.getConnection();

    //console.log('Received TECHNICAL (/send4) email data:', req.body);


    // const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    // const attachment = fs.readFileSync(pathToAttachment).toString('base64');

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }

        let attachments = [];
        req.files.forEach((file) => {
            const filePath = file.path;
            const f = fs.readFileSync(filePath).toString('base64');
            const attachment = {
                content: f,
                filename: `${file.originalname}`,
                contentType: `${file.mimetype}`,
                path: filePath
            }
            attachments.push(attachment)
        })

        const q = "SELECT Email FROM emails WHERE ID=1;";
        pool.query(q, (err, data) => {
            if (err) {
                console.log(err);
                return res.json(err);
            }

            const recipientEmail = data[0].Email;

            let mailOptions = {
                from: process.env.EMAIL,
                to: recipientEmail,
                subject: `${req.body.name}`,
                html: `${req.body.html}`,
                attachments: attachments
            
            };


            transporter.sendMail(mailOptions, function (err, data) {
                if (err) {
                    console.error('Błąd podczas wysyłania e-maila:', err);
                    res.json({
                        status: "fail",
                    });
                } else {
                    console.log("== Message Sent ==");
                    res.json({
                        status: "success",
                    });
                }
            });
        });
    })
});

//conn.release();

//Console logs for validation
app.listen(port, () => {
    console.log("Connected to backend1.");
    console.log(`App listening on port ${port}!`);
});


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
global.__dirname = path.resolve();

dotenv.config();

//Database connection
const pool = mysql.createPool({
    host: "sql7.freemysqlhosting.net",
    user: "sql7644212",
    password: "GJGU8fFDkk",
    database: "sql7644212",
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

app.get("/aditset", async (req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT Servive, Status FROM aditset";
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

    const q = "SELECT Status FROM aditset";
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
app.get("/countries", async(req, res) => {
    const q = "SELECT * FROM countries";
    await pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(data);
        }
        return res.json(data);
    });

    //conn.release();
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

app.get("/citizenships", async (req, res) => {
    //const conn = pool.getConnection();

    const q = "SELECT * FROM citizenships";
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

    const q = "SELECT * FROM alv";
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

    const q = "SELECT * FROM apostille";
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

    const q = "SELECT * FROM certificate";
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

    const q = "SELECT * FROM delivery";
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

    const q = "INSERT INTO countries(`country_name`,`id`,`tat`,`price_eu`,`price_gb`,`price_bu`,`price_cz`,`price_pl`,`price_dk`,`price_ro`,`price_se`,`comment`,`comment2`, `requirement`) VALUES (?)";

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
        req.body.requirement,
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/updatefPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = "UPDATE `fPageHeaders` SET `jobSeeker1`=?,`jobSeeker2`=?,`jobSeeker3`=?,`jobSeeker4`=?,`jobSeeker5`=?,`jobSeeker6`=?,`chooseCountries`=?,`countryHeader`=?,`tatHeader`=?,`priceHeader`=?,`chooseCitizenship`=?,`citHeader`=?,`repDelHeader`=?,`detailsHeader`=?,`addLangHeader`=?,`oServicesHeader`=?,`addTatHeader`=?,`certTransHeader`=?,`apostilleHeader`=?,`costHeader`=?,`costStatesHeader`=?,`costReportHeader`=?,`costAddTatHeader`=?,`costCertHeader`=?,`costApostilleHeader`=?,`costSummaryHeader`=?,`costSummaryText`=?,`costAddTatText`=?,`costTotalHeader`=?,`includeTaxText`=?,`id`=? WHERE id=1";

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
        req.body.addLangHeader,
        req.body.oServicesHeader,
        req.body.addTatHeader,
        req.body.certTransHeader,
        req.body.apostilleHeader,
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
        req.body.id,
    ];

    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
    //conn.release();
});



app.put("/updateSPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = "UPDATE `sPageHeaders` SET `provideHeader`=?,`title`=?,`titleComment`=?,`forename`=?,`forenameComment`=?,`middleName`=?,`middleNameComment`=?,`surname`=?,`surnameComment`=?,`surnameBirth`=?,`surnameBirthComment`=?,`birthDate`=?,`birthDateComment`=?,`birthTown`=?,`birthTownComment`=?,`birthCountry`=?,`birthCountryComment`=?,`montherName`=?,`montherNameComment`=?,`motherMName`=?,`motherMNameComment`=?,`idNumber`=?,`idNumberComment`=?,`currentAdress`=?,`addressLine1`=?,`addressLine1Comment`=?,`addressLine2`=?,`addressLine2Comment`=?,`country`=?,`countryComment`=?,`emailAddress`=?,`emailAddressComment`=?,`confEmailAddress`=?,`confEmailAddressComment`=?,`phoneNumber`=?,`phoneNumberComment`=?,`uploadScan`=?,`uploadScanComment`=?,`indedRecipent`=?,`indedRecipentComment`=?,`addComment`=?,`addCommentComment`=?,`uploadFiles`=?,`id`=?,`fatherName`=?,`fatherNameComment`=? WHERE id=1";

    const values = [
        req.body.provideHeader,
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
    ];

    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
    //conn.release();
});

app.put("/updateTPageHeader", async(req, res) => {
    //const conn = pool.getConnection();
    const bookId = req.params.id;
    const q = "UPDATE `tPageHeaders` SET `orderSummary`=?,`checkData`=?,`selectedOpt`=?,`addComment`=?,`charge`=?,`tat`=?,`personalData`=?,`address`=?,`privacyPolicy`=?,`id`=? WHERE id=1";

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
    ];

    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
    //conn.release();
});

app.post("/addcitizenships", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO citizenships(`citizenship`,`TAT`,`commentCit`,`email_text`,`pdf_text`,`GTC`) VALUES (?)";

    const values = [
        req.body.citizenship,
        req.body.TAT,
        req.body.commentCit,
        req.body.email_text,
        req.body.pdf_text,
        req.body.GTC
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addalv", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO alv(`language`,`id`,`addTAT`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`) VALUES (?)";

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
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addappostile", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO apostille(`type`,`tatApost`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`) VALUES (?)";

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
        req.body.priceSE
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/adddelivery", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO delivery(`delivery_option`,`delTat`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`,`type`) VALUES (?)";

    const values = [
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
        req.body.type
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.post("/addcertificate", async(req, res) => {
    //const conn = pool.getConnection();

    const q = "INSERT INTO certificate(`language`,`tatCER`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`) VALUES (?)";

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
    ];

    pool.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/addService", async(req, res) => {

    const q = `CREATE TABLE ${req.body.header} ( Type VARCHAR(255), Tat INT(11), priceEU INT(11), priceGB INT(11), priceBU INT(11), priceCZ INT(11),pricePL INT(11), priceDK INT(11), priceRO INT(11), priceSE INT(11), id INT(11) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;

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
    const q = `SELECT * FROM ${req.body.url}`;

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
    const q = `SELECT * FROM ${req.body.url} WHERE id=${id}`;

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
    const q = `UPDATE ${req.body.header} SET ${array.toString()}  WHERE id=${id}`;
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
    const q = 'INSERT INTO `newServices`(`allServices`) VALUES (?)';

    const values = [
        req.body.allServices
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

    const q = "INSERT INTO ordernumbers(`id`) VALUES ('')";


    pool.query(q, (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/countries/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE countries SET `country_name`= ?, id = ?, `tat`= ?, `price_eu`= ?, `price_gb`= ?, `price_bu`= ?, `price_cz`= ?, `price_pl`= ?, `price_dk`= ?, `price_ro`= ?, `price_se`= ?, `comment`= ?, `comment2`= ?, `requirement`=?  WHERE id = ?";

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
        req.body.requirement,
    ];

    pool.query(q, [...values, bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});


app.put("/citizenships/:id", async (req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;

    const q = "UPDATE citizenships SET `ID`= ?, `citizenship`= ?, `TAT`= ?, `commentCit`= ?, `email_text`= ?, `pdf_text`= ?, `GTC`= ? WHERE ID = ?";

    const values = [
        req.body.ID,
        req.body.citizenship,
        req.body.TAT,
        req.body.commentCit,
        req.body.email_text,
        req.body.pdf_text,
        req.body.GTC
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
    const q = "UPDATE alv SET `language`= ?, `AddTAT`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=? WHERE `id` = ?";

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
        req.body.id
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
    const q = "UPDATE apostille SET `type`= ?, `tatApost`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=? WHERE `id` = ?";

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
        req.body.id
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
    const q = "UPDATE certificate SET `language`= ?, `tatCER`= ?, `priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `id`=? WHERE `id` = ?";

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
        req.body.id
    ];

    pool.query(q, [...values,bookId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });

    //conn.release();
});

app.put("/delivery/:id", async(req, res) => {
    //const conn = pool.getConnection();

    const bookId = req.params.id;
    const q = "UPDATE delivery SET `id`= ?, `delivery_option`= ?, `delTat`= ?,`priceEU`= ?, `priceGB`= ?, `priceBU`= ?, `priceCZ`= ?, `pricePL`= ?, `priceDK`= ?, `priceRO`= ?, `priceSE`= ?, `type`= ? WHERE `id` = ?";

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
        req.body.type
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


    console.log('Received CLIENT (/send) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');

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

app.post("/send1", (req, res) => {
    //const conn = pool.getConnection();


    console.log('Received CLIENT (/send1) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');



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

app.post("/send2", (req, res) => {
    //const conn = pool.getConnection();


    console.log('Received TECHNICAL (/send3) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');

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
        attachments: [
            {
                content: attachment,
                filename: `invoice${req.body.Ordernumber}.pdf`,
                contentType: 'application/pdf',
                path: pathToAttachment,
            },
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

app.post("/send3", (req, res) => {
    //const conn = pool.getConnection();

    console.log('Received TECHNICAL (/send4) email data:', req.body);


    const pathToAttachment = path.join(global.__dirname, `invoice${req.body.Ordernumber}.pdf`);
    const attachment = fs.readFileSync(pathToAttachment).toString('base64');

    const q = "SELECT Email FROM emails WHERE ID=1;";
    pool.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }

        const recipientEmail = data[0].Email;




    let mailOptions = {
        from: process.env.EMAIL,
        to:  recipientEmail,
        subject: `${req.body.name}`,
        html: `${req.body.html}`
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

//Console logs for validation
app.listen(port, () => {
    console.log("Connected to backend1.");
    console.log(`App listening on port ${port}!`);
});


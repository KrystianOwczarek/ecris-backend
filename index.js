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
    user: "sql7627486",
    password: "Gyebp4m63j",
    database: "sql7627486",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

//You can use env variables in this transporter but you have to configure it on Deta, i left this like this beacuse Deta have problems with env variables.
let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    auth: {
        user: "ecrisapptest@gmail.com",
        pass: "xsmtpsib-17ee3c9e215ef809ad3f41eba733d41087081ad69b2dedb4e3395f5f2409b65b-UraGQTcDknM2xWb0"
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
    //const conn = pool.getConnection();

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

    const q = "INSERT INTO countries(`country_name`,`id`,`tat`,`price_eu`,`price_gb`,`price_bu`,`price_cz`,`price_pl`,`price_dk`,`price_ro`,`price_se`,`comment`,`comment2`) VALUES (?)";

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
    ];

    pool.query(q, [values], (err, data) => {
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

    const q = "INSERT INTO alv(`language`, `id`,`addTAT`,`priceEU`,`priceGB`,`priceBU`,`priceCZ`,`pricePL`,`priceDK`,`priceRO`,`priceSE`) VALUES (?)";

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
    const q = "UPDATE countries SET `country_name`= ?, id = ?, `tat`= ?, `price_eu`= ?, `price_gb`= ?, `price_bu`= ?, `price_cz`= ?, `price_pl`= ?, `price_dk`= ?, `price_ro`= ?, `price_se`= ?, `comment`= ?, `comment2`= ? WHERE id = ?";

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
    ];

    pool.query(q, [...values,bookId], (err, data) => {
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


const pdfTemplate = ({ name, items, receipt, email, Ordernumber, totalCharge, vat, waluta, net }) => {
    const today = new Date();
  
    const itemRows = items.map(item => (
      `<tr class="item">
        <td>${item.desc}</td>
        <td>${item.amount} ${item.waluta}</td>
      </tr>`
    ))

    return `
    <!doctype html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PDF Result Template</title>
      <style>
        .invoice-box {
          max-width: 800px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          box-shadow: 0 0 10px rgba(0, 0, 0, .15);
          font-size: 14px;
          line-height: 24px;
          font-family: 'Helvetica Neue', 'Helvetica',
          color: #555;
        }
        .margin-top {
          margin-top: 50px;
        }
        .justify-center {
          text-align: center;
        }
        .invoice-box table {
          width: 100%;
          line-height: inherit;
          text-align: left;
        }
        .invoice-box table td {
          padding: 5px;
          vertical-align: top;
        }
        .invoice-box table tr td:nth-child(2) {
          text-align: right;
        }
        .invoice-box table tr.top table td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.top table td.title {
          font-size: 45px;
          line-height: 45px;
          color: #333;
        }
        .invoice-box table tr.information table td {
          padding-bottom: 40px;
        }
        .invoice-box table tr.heading td {
          background: #eee;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .invoice-box table tr.details td {
          padding-bottom: 20px;
        }
        .invoice-box table tr.item td {
          border-bottom: 1px solid #eee;
        }
        .invoice-box table tr.item.last td {
          border-bottom: none;
        }
        .invoice-box table tr.total td:nth-child(2) {
          border-top: 2px solid #eee;
          font-weight: bold;
        }
        @media only screen and (max-width: 600px) {
          .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
          }
          .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
          }


        }
      </style>
    </head>
    <body>
    <div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="information">
          <td colspan="4">
            <table>
              <tr>
                <td>
                  Office 7 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Tel: &nbsp;(+44) 845 557 1082 <br>
                  35-37 Ludgate Hill &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; Fax: (+44) 845 557 1083 <br>
                  London EC4M 7JN &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Email: info@ecris.eu <br>
                  United Kingdom <br>
                  <br>
                  <strong>VAT No. GB 898 6672 37</strong> <br>
                  <br>
                  INVOICE TO: <br>
                  Block Prime Ltd <br>
                  27 Old Gloucester Street <br>
                  London WC1N 3AX <br>
                  United Kingdom <br>
                  Client VAT No.: GB411306061 <br>
                  VAT Rate: 20 %
                </td>
                <td>
                  <u>This is not a VAT invoice</u>
                  <br>
                  <br>
                  <br>
                  <br>
                  DRAFT INVOICE NUMBER: ${Ordernumber} <br>
                  INVOICE DATE: ${`${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`}
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr class="heading">
          <td>DESCRIPTION</td>
          <td>PRICE</td>
        </tr>
        ${itemRows} <!-- Wstawienie wygenerowanych wierszy z itemami -->
        
        <tr>
        <td>Net</td>
        <td style="width: 40px;">${net} ${waluta}</td>
        </tr>
        <tr>
        <td>VAT</td>
        <td style="width: 40px;" >${vat} ${waluta}</td>
        </tr>
        <tr>
        <td><strong>Total</strong></td>
        <td><strong>${totalCharge} ${waluta}</strong></td>
        </tr>
          </table>
      <br />
      <footer>
        <p class="justify-center">Please make this invoice payable by a bank remittance to our bank account: <br> HSBC, 165 Fleet Street, London, EC4A 2DY, United Kingdom <br>
    Sort Code: 40-06-29 <br>
    Account No.: 42143100 <br>
    PayPal: info@ecris.eu <br>
    (For international payments: IBAN: GB46HBUK40062942143100 BIC: HBUKGB4107P) </p>
      </footer>
    </div>
    </body>
    </html>
    `;
};

export default pdfTemplate;

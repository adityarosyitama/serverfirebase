const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const PORT = 3000;

require("dotenv").config();
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "YOUR_DATABASE_URL",
});

app.get("/", (req, res) => {
  const htmlView = `
 <!DOCTYPE html>
 <html>
   <head>
     <title>Homepage</title>
   </head>
   <body>
     <div>
       <h1>Homepage kumpulan soal</h1>
       <h1>Dibuat oleh Aditya Rosyitama</h1>
     </div>
   </body>
 </html>
`;

res.send(htmlView);
});

app.post("/send-notification", (req, res) => {
  const { deviceToken, title, body, timestamp } = req.body;
  console.log('req',req)
  // const dateA = new Date(timestamp);
  // dateA.setMinutes(dateA.getMinutes() - 5);
  // const tgl = dateA.toISOString();

  const message = {
    notification: {
      title:title,
      body:body,
    },
    // data: {
    //   key1: "value1",
    //   key2: "value2",
    // },
    token: deviceToken,
    sendAt: new Date(timestamp).getTime(),
  };

  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully scheduled message:", response);
      res.status(200).json({ message: "Notification sent successfully" });
    })
    .catch((error) => {
      console.log("Error scheduling message:", error);
      res.status(500).json({ error: "Failed to send notification" });
    });
});


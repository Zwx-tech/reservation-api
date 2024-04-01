//* imports
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 204,
  methods: "GET, POST, PUT, DELETE",
};

//* prevent cors errors
app.use(cors(corsOptions));

//* handle post
app.use(express.json());

app.get("/get-reservations", (req, res) => {
  const { month, year } = req.query;
  const fileNameHelper = (day) =>
    `./reservations/reservations_${day}_${month}_${year}.json`;

  const response = [];
  for (let day = 1; day < 32; day++) {
    const fileName = fileNameHelper(day);
    if (!fs.existsSync(fileName)) continue;
    response.push(...JSON.parse(fs.readFileSync(fileName, "utf-8")));
  }

  res.json(response);
});

//* mocked reservations
// app.get("/get-reservations", (req, res) => {
//   console.log(123);
//   const { month, year } = req.query;
//   res.json([
//     {
//       id: 0,
//       userID: 0,
//       firstName: "John",
//       secondName: "Doe",
//       email: "ankiety.macius@gmail.com",
//       paymentMethod: "card",
//       discountCode: null,
//       additionalInformation: "",
//       date: {
//         hour: "10 AM",
//         day: 25,
//         month: 3,
//         year: 2006,
//       },
//     },
//     {
//       id: 1,
//       userID: 1,
//       firstName: "John",
//       secondName: "Ewart",
//       email: "ankiety.macius@gmail.com",
//       paymentMethod: "cash",
//       discountCode: "ILOVECOFFE",
//       additionalInformation: "",
//       date: {
//         hour: "10 AM",
//         day: 20,
//         month: 3,
//         year: 2006,
//       },
//     },
//     {
//       id: 2,
//       userID: 2,
//       firstName: "Brittni",
//       email: "ankiety.macius@gmail.com",
//       secondName: "Stanton",
//       paymentMethod: "card",
//       discountCode: null,
//       additionalInformation: "",
//       date: {
//         hour: "12 AM",
//         day: 19,
//         month: 3,
//         year: 2006,
//       },
//     },
//     {
//       id: 2,
//       userID: 3,
//       firstName: "Tom",
//       secondName: "Hadaway",
//       email: "ankiety.macius@gmail.com",
//       paymentMethod: "card",
//       discountCode: "MOTH",
//       additionalInformation: "",
//       date: {
//         hour: "11 AM",
//         day: 4,
//         month: 3,
//         year: 2006,
//       },
//     },
//     {
//       id: 2,
//       userID: 4,
//       firstName: "Jack",
//       secondName: "Skeates",
//       email: "ankiety.macius@gmail.com",
//       paymentMethod: "card",
//       discountCode: null,
//       additionalInformation: "",
//       date: {
//         hour: "9 AM",
//         day: 15,
//         month: 3,
//         year: 2006,
//       },
//     },
//   ]);
// });

app.post("/add-reservation", (req, res) => {
  const reservation = { id: Date.now(), userID: 0, ...req.body };

  const fileName = `./reservations/reservations_${reservation.date.day}_${reservation.date.month}_${reservation.date.year}.json`;
  if (!fs.existsSync(fileName)) {
    // create file and add reservation to it
    fs.writeFile(fileName, JSON.stringify([reservation]), (err) => {
      if (err) {
        res.json({ status: "error", message: "Failed to add reservation" });
      } else {
        res.json({ status: "success" });
      }
    });
    return;
  }
  // open file and check if there is not reservations with same date
  const reservationsInFile = JSON.parse(fs.readFileSync(fileName, "utf-8"));
  if (reservationsInFile.find((r) => r.date.hour === reservation.date.hour)) {
    res.json({
      status: "error",
      message: "There is already reservation for this hour",
    });
    return;
  }
  fs.writeFile(
    fileName,
    JSON.stringify([...reservationsInFile, reservation]),
    (err) => {
      if (err) {
        res.json({ status: "error", message: "Failed to add reservation" });
      } else {
        res.json({ status: "success" });
      }
    }
  );
  return;
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

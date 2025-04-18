const db = require("../config/db");

const Doctor = {
  getAll: (callback) => {
    const query = "SELECT * FROM doctors";
    db.query(query, (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results); // results will be an array
      }
    });
  },

  add: (data, callback) => {
    const {
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      description,
      hospitalImage,
      doctorImage,
      category,  // Make sure category is passed in the insert query
    } = data;

    const query = `
      INSERT INTO doctors 
      (hospitalName, doctorName, mobile, email, website, experience, specialization, description, hospitalImage, doctorImage, category) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      description,
      hospitalImage,
      doctorImage,
      category,  // Add category to the query
    ];

    db.query(query, values, callback);
  },
};

module.exports = Doctor;

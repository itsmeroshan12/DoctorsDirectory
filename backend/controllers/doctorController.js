const db = require("../config/db");

// Helper function to generate slugs from hospital names
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

exports.getDoctors = async (req, res) => {
  try {
    const [doctors] = await db.execute("SELECT * FROM doctors ORDER BY id DESC");

    // Attach slug to each doctor object
    const doctorsWithSlugs = doctors.map((doc) => ({
      ...doc,
      slug: slugify(doc.hospitalName),
    }));

    res.status(200).json(doctorsWithSlugs);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
};

// Add doctor details to the database
exports.addDoctor = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.files);

    const {
      hospitalName,
      doctorName,
      mobile,
      email,
      website,
      experience,
      specialization,
      category,
      description,
    } = req.body;

    const doctorImage = req.files?.doctorImage?.[0]?.filename || null;
    const hospitalImage = req.files?.hospitalImage?.[0]?.filename || null;

    if (
      !hospitalName ||
      !doctorName ||
      !mobile ||
      !email ||
      !experience ||
      !specialization ||
      !category ||
      !description
    ) {
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    const sql = `
      INSERT INTO doctors (
        hospitalName, doctorName, mobile, email, website,
        experience, specialization, category,
        doctorImage, hospitalImage, description
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      hospitalName,
      doctorName,
      mobile,
      email,
      website || null,
      experience,
      specialization,
      category,
      doctorImage,
      hospitalImage,
      description,
    ];

    await db.execute(sql, values);

    res.status(201).json({ message: "Doctor added successfully" });
  } catch (err) {
    console.error("Error adding doctor:", err);
    res.status(500).json({ error: "Failed to add doctor" });
  }
};

// ✅ Get single doctor by slug
exports.getDoctorBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const [rows] = await db.execute("SELECT * FROM doctors");
    const doctor = rows.find(
      (doc) =>
        doc.hospitalName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") === slug
    );

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.status(200).json(doctor);
  } catch (err) {
    console.error("Error fetching doctor by slug:", err);
    res.status(500).json({ error: "Failed to fetch doctor details" });
  }
};

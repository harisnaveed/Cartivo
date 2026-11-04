import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// JSON file location
const leadsFile = path.join(__dirname, "../data/leads.json");

// GET: Display Contact Page
export const getContact = (req, res) => {
  const success = req.query.success === "true";

  res.render("contact", {
    success,
  });
};

// POST: Submit Contact Form
export const submitContact = async (req, res) => {
  try {
    // Get form data
    const { name, email, phone, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).send("Name, email and message are required.");
    }

    // Create lead object
    const newLead = {
      id: Date.now().toString(),
      name,
      email,
      phone: phone || "",
      subject: subject || "General Inquiry",
      message,
      createdAt: new Date().toISOString(),
    };

    // Read existing leads
    let leads = [];

    try {
      const fileData = await fs.readFile(leadsFile, "utf-8");
      leads = JSON.parse(fileData);
    } catch (error) {
      // If file doesn't exist, create it
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Add new lead
    leads.push(newLead);

    // Save updated leads
    await fs.mkdir(path.dirname(leadsFile), { recursive: true });

    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 4), "utf-8");

    console.log("New Lead Saved:", newLead);

    // Redirect after successful submission
    // referer is an HTTP header that usually tells the server which page the browser came from.
    const referer = req.get("referer") || "";

    if (referer.includes("/contact")) {
      return res.redirect("/contact?success=true");
    }

    return res.redirect("/?success=true#contact");
  } catch (error) {
    console.error("Contact Form Error:", error.message);

    res.status(500).send("Unable to submit your contact form.");
  }
};

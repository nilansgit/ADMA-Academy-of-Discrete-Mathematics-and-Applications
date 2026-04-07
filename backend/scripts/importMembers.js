import fs from "fs";
import csv from "csv-parser";
import { pool } from "../src/config/db.js";

console.log(process.cwd());

const formatDate = (date) => {
    if (!date) return null;

    const parsed = new Date(date);

    if (isNaN(parsed)) return null;

    return parsed.toISOString().split("T")[0]; // YYYY-MM-DD
};

const mapCsvToMember = (data, membershipNumber) => {
    return {
        membership_number: membershipNumber,
        name: data.name,
        email: data.email,
        phone: data.phone,
        citizenship: data.citizenship || null,
        membership_type: data.membership_type,

        date_of_birth: formatDate(data.date_of_birth) || null,  // 🔥 FIX

        qualification: data.qualification || null,
        address_line1: data.address_line1 || null,
        address_line2: data.address_line2 || null,
        city: data.city || null,
        state: data.state || null,
        postal_code: data.postal_code || null,
        country: data.country || null,

        form_id: null, // or SYSTEM_FORM_ID
        extra_data: JSON.stringify({
            affiliation: data.affiliation || null,
            passportNumber: data.passportNumber || null,
            passportPhoto: data.passportPhoto || null,
            representativeOne: data.representativeOne || null,
            representativeTwo: data.representativeTwo || null,
        }),
    };
};
const run = async () => {
    const members = [];

    await new Promise((resolve, reject) => {
        fs.createReadStream("./scripts/members.csv")
            .pipe(csv())
            .on("data", (row) => members.push(row))
            .on("end", resolve)
            .on("error", reject);
    });

    console.log(`📊 Parsed ${members.length} members`);

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const year = 2005;

        for (const memberData of members) {

            // 🔥 Atomic counter increment
            await connection.query(
                `INSERT INTO membershipCounter (year, last_number)
                VALUES (?, LAST_INSERT_ID(1))
                ON DUPLICATE KEY UPDATE last_number = LAST_INSERT_ID(last_number + 1)`,
                [year]
            );

            const [rows] = await connection.query(
                `SELECT LAST_INSERT_ID() AS lastNumber`
            );

            const lastNumber = rows[0].lastNumber;

            // 🎯 Generate membership number
            const seq = String(lastNumber).padStart(4, '0');
            const membershipNumber = `ADMA${year}${seq}`;

            console.log("Generated:", membershipNumber);

            // 🧩 Map CSV → DB
            const member = mapCsvToMember(memberData, membershipNumber);

            const columns = Object.keys(member);
            const values = Object.values(member);

            await connection.query(
                `INSERT INTO members (${columns.join(", ")})
                 VALUES (${columns.map(() => "?").join(", ")})`,
                values
            );
        }

        await connection.commit();

        console.log("✅ All members imported successfully");

    } catch (err) {
        await connection.rollback();
        console.error("❌ Error:", err);
    } finally {
        connection.release();
        process.exit();
    }
};

run();
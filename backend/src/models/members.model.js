import { pool } from "../config/db.js";

export const getMembers = async ({
  page,
  limit,
  membership,
  name,
}) => {
  const offset = (page - 1) * limit;

  let whereClause = "WHERE 1=1";
  const params = [];

  if (membership) {
    whereClause += " AND membership_number LIKE ?";
    params.push(`%${membership}%`);
  }

  if (name) {
    whereClause += " AND name LIKE ?";
    params.push(`%${name}%`);
  }

  const dataQuery = `
    SELECT 
      id,
      membership_number,
      name,
      email,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country
    FROM members
    ${whereClause}
    ORDER BY membership_number ASC
    LIMIT ? OFFSET ?
  `;

  const dataParams = [...params, limit, offset];

  const countQuery = `
    SELECT COUNT(*) as total
    FROM members
    ${whereClause}
  `;

  const [[rows], [countResult]] = await Promise.all([
    pool.query(dataQuery, dataParams),
    pool.query(countQuery, params),
  ]);

  const total = countResult[0].total;

  return {
    data: rows,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
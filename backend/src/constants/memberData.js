export const mapFormToMember =(data, membershipNumber, formId) => {
  const d = data || {};

  const phone =
    d.phoneCode && d.phoneNumber
      ? `${d.phoneCode}-${d.phoneNumber}`
      : "";

    const monthMap = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };

    let dateOfBirth = null;

    if (d.dobDay && d.dobMonth && d.dobYear) {
        const day = parseInt(d.dobDay, 10);
        const month = monthMap[d.dobMonth];
        const year = parseInt(d.dobYear, 10);

        if (day && month && year) {
            dateOfBirth = new Date(year, month - 1, day); // JS month is 0-based
        }
    }

  return {
        membership_number: membershipNumber,

        // REQUIRED (schema-enforced)
        name: d.name,
        email: d.email,
        phone: phone,
        citizenship: d.citizenship,

        membership_type: mapMembershipType(d.membershipType),

        date_of_birth: dateOfBirth,
        qualification: d.qualification || null,

        address_line1: d.addressLine1 || null,
        address_line2: d.addressLine2 || null,
        city: d.city || null,
        state: d.state || null,
        postal_code: d.postalCode || null,
        country: d.country || null,

        // RELATION
        form_id: formId,

        // EVERYTHING ELSE
        extra_data: JSON.stringify({
            affiliation: d.affiliation || null,
            passportNumber: d.passportNumber || null,
            passportPhoto: d.passportPhoto || null,
            representativeOne: d.representativeOne || null,
            representativeTwo: d.representativeTwo || null,
        }),

        created_at: new Date()
    };
}


function mapMembershipType(membershipType) {
    switch (membershipType.title) {
        case "Life Member (Individual)":
        return "LIFE_MEMBER_INDIVIDUAL";

        case "Benefactor Life Member":
        return "BENEFACTOR_LIFE_MEMBER";

        case "Patron Life Member":
        return "PATRON_LIFE_MEMBER";

        case "Institutional Member":
        return "INSTITUTIONAL_MEMBER";
    }
}
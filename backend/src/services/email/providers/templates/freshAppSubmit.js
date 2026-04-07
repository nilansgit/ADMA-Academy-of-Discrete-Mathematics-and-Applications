export const freshAppSubmit = ({ name, applicationNumber }) => {
  return `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">

    <h2 style="color: #2c3e50;">Application Submitted Successfully ✅</h2>

    <p>Dear ${name},</p>

    <p>
      Thank you for submitting your membership application to <strong>ADMA</strong>.
    </p>

    <p>
      <strong>Application Number:</strong> ${applicationNumber}
    </p>

    <p>
      Your application is currently under <strong>payment verification</strong> by our Treasurer.
    </p>

    <p>
      You will receive further updates once the verification is complete.
    </p>

    <p>
      <strong>Next Steps:</strong><br/>
      • Payment verification<br/>
      • Approval<br/>
      • Membership ID generation
    </p>

    <br/>

    <p>
      For any queries, contact:
      <a href="mailto:support@adma.co.in">support@adma.co.in</a>
    </p>

    <p>
      Visit:
      <a href="https://adma.co.in">www.adma.co.in</a>
    </p>

    <br/>

    <p>Regards,<br/><strong>ADMA Team</strong></p>

    <hr/>

    <p style="font-size: 12px; color: gray;">
      This is an automated email. Please do not reply.
    </p>

  </div>
  `;
};
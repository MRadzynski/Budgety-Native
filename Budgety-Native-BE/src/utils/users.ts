import nodemailer from 'nodemailer';

export const sendEmail = (recipient: string, token: string) => {
  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const emailContent = `
    <div
      style="
        background-color: #4361ee;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        max-width: 600px;
        padding: 32px;
      "
    >
      <h1
        style="
          color: white;
          text-align: center;
        "
      >
        Budgety
      </h1>
      <p style="margin-bottom: 10px; text-align: left">Dear User,</p>
      <p style="line-height: 24px; margin: 0">
        We received a request to reset your password for your Budgety account.
      </p>
      <p style="line-height: 24px; margin: 0">
        If you did not make this request, please ignore this email.
      </p>
      <p style="margin-bottom: 16px">
        Otherwise, please click on the button below to reset your password:
      </p>
      <p style="margin-bottom: 20px; margin-left: auto; margin-right: auto; margin-top: 20px;">
        <a
          href="http://${process.env.EMAIL_RESET_PAGE_ADDRESS}/index.html?${token}"
          style="
            background-color: white;
            border-radius: 8px;
            color: #4361ee;
            padding: 8px 16px;
            text-align: center;
            text-decoration: none;
            width: fit-content;
          "
          >Reset Password</a
        >
      </p>
      <p style="margin-top: 16px;">
        If you're unable to click the button, please copy and paste the URL into
        your web browser.
      </p>
      <p>
        <a
          href="http://${process.env.EMAIL_RESET_PAGE_ADDRESS}/index.html?${token}"
          style="color: white; word-break: break-all;"
        >
          http://${process.env.EMAIL_RESET_PAGE_ADDRESS}/index.html?${token}
        </a>
      </p>
      <p style="margin: 10px 0 30px">
        The link will expire in 1 hour for security reasons.
      </p>
      <p style="margin: 4px 0; text-align: center">All the best,</p>
      <p
        style="
          margin: 0;
          font-size: 20px;
          text-align: center;
        "
      >
        The Budgety Team
      </p>
    </div>
  `;

  const mailDetails = {
    from: process.env.EMAIL_ADDRESS,
    to: recipient,
    subject: 'Budgety: Reset Password',
    html: emailContent
  };

  mailTransporter.sendMail(mailDetails, function (err, data) {
    if (err) {
      console.log('Error Occurs');
    } else {
      console.log('Email sent successfully');
    }
  });
};

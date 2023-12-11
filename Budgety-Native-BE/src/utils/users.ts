import nodemailer from 'nodemailer';
import { de, en, es, fr, it, pl, ru } from '../data/emailTranslations';

const getTranslation = (language: string) => {
  switch (language.toLowerCase()) {
    case 'de':
      return de;
    case 'en':
      return en;
    case 'es':
      return es;
    case 'fr':
      return fr;
    case 'it':
      return it;
    case 'pl':
      return pl;
    case 'ru':
      return ru;
    default:
      return en;
  }
};

export const sendEmail = (
  recipient: string,
  token: string,
  language: string,
  username: string
) => {
  let mailTransporter = nodemailer.createTransport({
    auth: {
      pass: process.env.EMAIL_PASSWORD,
      user: process.env.EMAIL_ADDRESS
    },
    service: 'gmail'
  });

  const translation = getTranslation(language);

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
      <p style="margin-bottom: 10px; text-align: left">${translation.dear} ${
    username || translation.user
  },</p>
      <p style="line-height: 24px; margin: 0">
        ${translation.receivedRequest}
      </p>
      <p style="line-height: 24px; margin: 0">
        ${translation.doNotMakeRequest}
      </p>
      <p style="margin-bottom: 16px">
      ${translation.otherwise}
      </p>
      <p style="margin-bottom: 20px; margin-left: auto; margin-right: auto; margin-top: 20px;">
        <a
          href="http://${
            process.env.EMAIL_RESET_PAGE_ADDRESS
          }/index.html?${token}"
          style="
            background-color: white;
            border-radius: 8px;
            color: #4361ee;
            padding: 8px 16px;
            text-align: center;
            text-decoration: none;
            width: fit-content;
          "
          >${translation.resetPassword}</a
        >
      </p>
      <p style="margin-top: 16px;">
      ${translation.notAbleToClick}
      </p>
      <p>
        <a
          href="http://${
            process.env.EMAIL_RESET_PAGE_ADDRESS
          }/index.html?${token}"
          style="color: white; word-break: break-all;"
        >
          http://${process.env.EMAIL_RESET_PAGE_ADDRESS}/index.html?${token}
        </a>
      </p>
      <p style="margin: 10px 0 30px">
      ${translation.linkExpire}
      </p>
      <p style="margin: 4px 0; text-align: center">${translation.allTheBest}</p>
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
    subject: translation.subject,
    html: emailContent
  };

  mailTransporter.sendMail(mailDetails, function (err, _data) {
    if (err) {
      console.log('Error Occurs');
    } else {
      console.log('Email sent successfully');
    }
  });
};

import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendmail = async (options) => {
    const mailGenerator = new Mailgen ({
        theme: "default",
        product: {
            name: " Task Manager ",
            link:"https://taskmanagelink.com"
        }
    })
    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
    const emailhtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })
     const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailhtml
     }
     try {
        await transporter.sendMail(mail)
     } catch (error){
        console.error (" Email service failed silently. make sure that you have provided your MAILTRAP credentials in the .env file  ")
     }

}
const emailVerificationmailgenContent = (username,verificationUrl)=> {
    return {
        body: {
            name: username,
            intro: "Welcome to our App! we'are excited to have you on board. ",
            action:{
                instructions: "To verify your email please click on the following button",
                button: {
                    color: "#1aae5aff",
                    text: "verify your email",
                    link: verificationUrl
                    
                },
            },
            outro: " Need help, or have questions? just reply to this email, we'd love to help.",
        },
                
        };
    };
const forgetPasswordgenContent = (username,passwordresrturl)=> {
    return {
        body: {
            name: username,
            intro: "We got a request to your reset the password of your account. ",
            action:{
                instructions: "To reset the password please click on the following button",
                button: {
                    color: "#ae1a38ff",
                    text: "verify your password",
                    link: passwordresrturl,
                    
                },
            },
            outro: " Need help, or have questions? just reply to this email, we'd love to help.",
        },
    };
};

export{
    emailVerificationmailgenContent,
    forgetPasswordgenContent,
    sendmail,
};
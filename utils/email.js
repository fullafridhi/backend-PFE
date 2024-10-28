const nodemailer =require('nodemailer');


const sendEmail =async(options)=>{
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
        }
    })
    const mailOptions ={
         from: `"KidQuest Academy" <${process.env.EMAIL_USER}>`,
        // from:`"WEBDEV WARRIORS" <fullafridhi@gmail.com>`,
        to:options.email,
        subject: options.subject,
        html:options.html,

    };
    try {
        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${options.email}`);
    } catch (error) {
        console.error('Error sending email:', error); 
        throw new Error('Email sending failed'); 
    }
    // await transporter.sendMail(mailOptions)
}
module.exports =sendEmail
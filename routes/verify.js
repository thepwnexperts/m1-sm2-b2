const nodemailer = require('nodemailer');
const otplib = require('otplib');
const router = require('express').Router();
const verify = require('../schama/verify');
//const waf = Boolean(process.env.waf);
const waf = JSON.parse(process.env.waf);


router.post('/', async (req, res) => {
    //res.send('we are on /').status(200);
    // Generate a 6-digit OTP
    const to=req.body.to;

    const secret = otplib.authenticator.generateSecret();
    const otp = otplib.authenticator.generate(secret);
    var d = new Date();
    console.log(d);

   var transporter = nodemailer.createTransport({
    host: process.env.host,
    port: process.env.port,
    secure: true,
    auth: {
        user: process.env.user,
        pass: process.env.pass
    }
});

    var mailOptions = {
    from: process.env.user,
    to: to,
    subject: 'OTP',
    text: otp
};

try {
    const existingMail = await verify.find({mail: to});
    console.log(existingMail.length);
    if ((existingMail.length >= 1) && waf) {
        //res.status(400).send('Too many OTP requests for this email');
        //return;
        //clean up duplicate
        await verify.deleteMany({mail: to});
    }
} catch (err) {
    res.status(500).send(err);
    return;
}

transporter.sendMail(mailOptions, async function(error, info){
    if (error) {
        console.log(error);
        res.send(error);
    } else {
        console.log('Email sent: ' + info.response + "   otp=" + otp);
        otpis={
            thisotp:otp
        }

        try{
            const mail_verify=new verify(
                {
                    mail   :to,
                    otp    :otp
                    
                });      
                let savequery = await mail_verify.save();
                console.log(savequery);
                //res.send(otpis).status(200);
                res.send("success").status(200);
                
            }catch(err)
            {
                res.status(400).send( err );
            }     
        //res.send('Email sent: ' + info.response).status(200);
    }
});
    
});

router.post('/verify',async (req,res)=> {
    const to=req.body.from;
    const otp=parseInt(req.body.otp);
   const mails =  await verify.findOne({mail: to});
   if (!mails) {
    res.status(406).send("otp not found ,try to resend");
    return ;
   }

   try {
    const existingMail = await verify.find({mail: to});
    if ((existingMail.length > 1) && waf) {
        const re = await verify.deleteMany({mail: to});
        res.status(400).send('Too many OTP requests sended clearing=> need to send again');
        return;
    }
} catch (err) {
    res.status(500).send(err);
    return;
}

   //console.log(mails);
   const otpsend= parseInt(mails.otp);
   if (otp === otpsend) {
    //const re = await verify.deleteMany({mail: to});
       await verify.deleteMany({mail: to});
    res.send("success: login successfully ").status(200);

   }
   else{
    res.status(406).send("failed: otp not valid");
   }
 
});


module.exports = router;

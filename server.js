const express = require("express");
const { JwtRsaVerifier } = require("aws-jwt-verify");

// Find your Firebase project number in the Firebase console.
const FIREBASE_PROJECT_NUMBER = "1024943326650";

// The issuer and audience claims of the FPNV token are specific to your
// project.
const issuer = `https://fpnv.googleapis.com/projects/${FIREBASE_PROJECT_NUMBER}`;
const audience = `https://fpnv.googleapis.com/projects/${FIREBASE_PROJECT_NUMBER}`;

// The JWKS URL contains the current public signing keys for FPNV tokens.
const jwksUri = "https://fpnv.googleapis.com/v1beta/jwks";

// Configure a JWT verifier to check the following:
// - The token is signed by Google
// - The issuer and audience claims match your project
// - The token has not yet expired (default behavior)
const fpnvVerifier = JwtRsaVerifier.create({ issuer, audience, jwksUri });

const app = express();

// Middleware to parse the token from the request body.
// Since the token is a raw string, we use express.text() middleware.
app.use(express.text({ type: "*/*" }));
app.use(express.json());

app.post('/verifiedPhoneNumber', async (req, res) => {
    if (!req.body) return res.sendStatus(400);
    // Get the token from the body of the request.
    // If it's JSON, extract the token property; otherwise, use the raw body.
    const fpnvToken = typeof req.body === "object" ? req.body.token : req.body;
    
    if (!fpnvToken) return res.sendStatus(400);

    try {
        // Attempt to verify the token using the verifier configured
        // previously.
        const verifiedPayload = await fpnvVerifier.verify(fpnvToken);

        // If verification succeeds, the subject claim of the token contains the
        // verified phone number. You can use this value however it's needed by
        // your app.
        const verifiedPhoneNumber = verifiedPayload.sub;
        console.log("Successfully verified phone number:", verifiedPhoneNumber);
        // (Do something with it...)

        return res.sendStatus(200);
    } catch (error) {
        console.error("Token verification failed:", error);
        // If verification fails, reject the token.
        return res.sendStatus(400);
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

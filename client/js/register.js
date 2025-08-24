// 🔎 helper to extract clean revert reasons
function getRevertReason(err) {
    if (err?.error?.reason) return err.error.reason;
    if (err?.reason) return err.reason;

    // Ganache / MetaMask often embeds it here: "... revert Reason"
    if (err?.message && err.message.includes("revert")) {
        e1 = err.message.split("revert")[1].trim()
        return e1.split(",")[0].trim();
    }

    return err?.message || "Transaction failed";
}


function wireRegisterUI() {
    // === Admin ===
    document.getElementById("registerAdmin").onclick = async () => {
        const name = document.getElementById("adminName").value.trim();
        if (!name) return msg("regMsg", "Provide a name");
        try {
            await app.contract.methods.registerAsAdmin(name).call({ from: app.account });
            await app.contract.methods.registerAsAdmin(name).send({ from: app.account });
            msg("regMsg", " Admin registered");
            await navbar.updateNavStatus();
        } catch (e) {
            msg("regMsg", "" + getRevertReason(e));
            console.error("Admin register error:", e);
        }
    };

    // === Trainer ===
    document.getElementById("registerTrainer").onclick = async () => {
        const name = document.getElementById("trainerName").value.trim();
        if (!name) return msg("regMsg", "Provide a name");
        try {
            await app.contract.methods.registerAsTrainer(name).call({ from: app.account });
            await app.contract.methods.registerAsTrainer(name).send({ from: app.account });
            msg("regMsg", " Trainer registered");
        } catch (e) {
            msg("regMsg", "" + getRevertReason(e));
            console.error("Trainer register error:", e);
        }
    };

    // === Participant ===
    document.getElementById("registerParticipant").onclick = async () => {
        const name = document.getElementById("pName").value.trim();
        const age = Number(document.getElementById("pAge").value);
        const gender = document.getElementById("pGender").value.trim();
        const district = document.getElementById("pDistrict").value.trim();
        const interest = Number(document.getElementById("pInterest").value);

        try {
            await app.contract.methods
                .registerAsParticipant(name, age, gender, district, interest)
                .call({ from: app.account }); // dry run first

            await app.contract.methods
                .registerAsParticipant(name, age, gender, district, interest)
                .send({ from: app.account });

            msg("regMsg", " Participant registered");
            await navbar.updateNavStatus();
        } catch (e) {
            // msg("regMsg", "❌ " + getRevertReason(e));
            msg("regMsg", " " + getRevertReason(e));

            // console.error("Participant register error:", e);
        }
    };
}

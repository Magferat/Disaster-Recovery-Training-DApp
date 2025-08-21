function wireRegisterUI() {
    document.getElementById("registerAdmin").onclick = async () => {
        const name = document.getElementById("adminName").value.trim();
        if (!name) return msg("regMsg", "Provide a name");
        try {
            await app.contract.methods.registerAsAdmin(name).send({ from: app.account });
            msg("regMsg", "Admin registered ✅");
            await navbar.updateNavStatus();
        } catch (e) { msg("regMsg", "❌ " + (e.message || e)); }
    };

    document.getElementById("registerTrainer").onclick = async () => {
        const name = document.getElementById("trainerName").value.trim();
        if (!name) return msg("regMsg", "Provide a name");
        try {
            await app.contract.methods.registerAsTrainer(name).send({ from: app.account });
            msg("regMsg", "Trainer registered ✅");
        } catch (e) { msg("regMsg", "❌ " + (e.message || e)); }
    };

    document.getElementById("registerParticipant").onclick = async () => {
        const name = document.getElementById("pName").value.trim();
        const age = Number(document.getElementById("pAge").value);
        const gender = document.getElementById("pGender").value.trim();
        const district = document.getElementById("pDistrict").value.trim();
        const interest = Number(document.getElementById("pInterest").value);
        try {
            await app.contract.methods.registerAsParticipant(name, age, gender, district, interest)
                .send({ from: app.account });
            msg("regMsg", "Participant registered ✅");
            await navbar.updateNavStatus();
        } catch (e) { msg("regMsg", "❌ " + (e.message || e)); }
    };
}

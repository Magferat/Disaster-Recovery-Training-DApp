function wireAdminUI() {
    document.getElementById("btnUpdateInterest").onclick = async () => {
        const addr = document.getElementById("uAddr1").value.trim();
        const newInter = Number(document.getElementById("uInterest").value);
        try {
            await app.contract.methods.updateInterest(addr, newInter).send({ from: app.account });
            msg("adminMsg", "Interest updated ✅");
        } catch (e) { msg("adminMsg", "❌ " + (e.message || e)); }
    };

    document.getElementById("btnUpdateStatus").onclick = async () => {
        const addr = document.getElementById("uAddr2").value.trim();
        const st = document.getElementById("uStatus").value === "true";
        try {
            await app.contract.methods.updateStatus(addr, st).send({ from: app.account });
            msg("adminMsg", "Status updated ✅");
        } catch (e) { msg("adminMsg", "❌ " + (e.message || e)); }
    };

    document.getElementById("btnSearch").onclick = async () => {
        const out = document.getElementById("searchResult");
        const district = document.getElementById("searchDistrict").value.trim().toLowerCase();
        try {
            const parts = (await app.contract.methods.getParticipants().call({ from: app.account })).map(normalizeUser);
            const filtered = parts.filter(p => p.district.toLowerCase().includes(district));
            out.innerHTML = filtered.length
                ? filtered.map(p => `<div>${p.name} — ${p.district} — ${InterestNames[p.training_interest]} — Completed: ${p.has_completed_training}
                    Addr : ${p.wallet_addr}
                    </div>`).join("")
                : "No matches";
        } catch (e) { out.textContent = e.message || e; }
    };

    document.getElementById("btnCountSort").onclick = async () => {
        const out = document.getElementById("countResult");
        try {
            const parts = (await app.contract.methods.getParticipants().call({ from: app.account })).map(normalizeUser);
            const map = {};
            parts.forEach(p => { map[p.district] = (map[p.district] || 0) + 1; });
            const rows = Object.entries(map).sort((a, b) => b[1] - a[1]);
            out.innerHTML = rows.map(([d, c]) => `<div>${d}: <strong>${c}</strong></div>`).join("");
        } catch (e) { out.textContent = e.message || e; }
    };
}

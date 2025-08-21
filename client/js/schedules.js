async function renderSchedules() {
    if (!app.contract) return;
    const el = document.getElementById("schedules");
    el.innerHTML = "";
    try {
        const trainers = (await app.contract.methods.getTrainers().call()).map(normalizeUser);
        if (trainers.length === 0) { el.textContent = "No trainers yet."; return; }

        for (const t of trainers) {
            const bookings = (await app.contract.methods.getBookingsForTrainer(t.wallet_addr).call()).map(normalizeBooking);
            const card = document.createElement("div");
            card.className = "card";
            const body = document.createElement("div");
            body.className = "card-body";
            body.innerHTML = `<div class="fw-semibold mb-2">Trainer: ${t.name} (${t.wallet_addr.slice(0, 6)}…${t.wallet_addr.slice(-4)})</div>`;
            if (bookings.length === 0) {
                body.innerHTML += `<div class="text-muted small">No bookings yet.</div>`;
            } else {
                const list = document.createElement("div");
                bookings.forEach(b => {
                    const start = new Date(b.startTime * 1000);
                    const end = new Date(b.endTime * 1000);
                    const row = document.createElement("div");
                    row.className = "d-flex justify-content-between border-bottom py-1 small";
                    row.innerHTML = `<span>${start.toLocaleString()} – ${end.toLocaleTimeString()}</span>
                           <span class="text-monospace">${b.participant.slice(0, 6)}…${b.participant.slice(-4)}</span>`;
                    list.appendChild(row);
                });
                body.appendChild(list);
            }
            card.appendChild(body);
            el.appendChild(card);
        }
    } catch (e) {
        el.textContent = "Error: " + (e.message || e);
    }
}

function makeSlotsForDate(dateStr) {
    // As per your spec: 09:00, 09:31, 10:01 — each 30 minutes long
    const base = new Date(dateStr + "T00:00:00");
    function tm(h, m) { const d = new Date(base.getTime()); d.setHours(h, m, 0, 0); return d; }
    const starts = [tm(9, 0), tm(9, 31), tm(10, 1), tm(10, 31), tm(11, 1), tm(11, 31), tm(12, 1)];
    return starts.map(s => {
        const e = new Date(s.getTime() + 30 * 60 * 1000);
        return {
            label: `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            startEpoch: Math.floor(s.getTime() / 1000),
            endEpoch: Math.floor(e.getTime() / 1000),
        };
    });
}

async function loadTrainers() {
    const sel = document.getElementById("trainerSelect");
    sel.innerHTML = "";
    const trainers = (await app.contract.methods.getTrainers().call()).map(normalizeUser);
    if (trainers.length === 0) { sel.innerHTML = "<option>No trainers found</option>"; return; }
    trainers.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t.wallet_addr;
        opt.textContent = `${t.name} (${t.wallet_addr.slice(0, 6)}…${t.wallet_addr.slice(-4)})`;
        sel.appendChild(opt);
    });
}

async function showSlots() {
    const trainer = document.getElementById("trainerSelect").value;
    const dateStr = document.getElementById("slotDate").value;
    const wrap = document.getElementById("slots");
    wrap.innerHTML = "";
    if (!trainer || !dateStr) { wrap.textContent = "Pick trainer and date first."; return; }

    const existing = (await app.contract.methods.getBookingsForTrainer(trainer).call()).map(normalizeBooking);
    const slots = makeSlotsForDate(dateStr);

    slots.forEach(slot => {
        const overlapped = existing.some(b => (slot.startEpoch < b.endTime) && (slot.endEpoch > b.startTime));
        const row = document.createElement("div");
        row.className = "d-flex justify-content-between align-items-center border rounded p-2";
        row.innerHTML = `<div>${slot.label}</div>`;
        const btn = document.createElement("button");
        btn.className = "btn btn-sm " + (overlapped ? "btn-secondary disabled" : "btn-primary");
        btn.textContent = overlapped ? "Booked" : "Book";
        btn.disabled = overlapped;
        btn.onclick = async () => {
            try {
                await app.contract.methods.bookTrainingSlot(trainer, slot.startEpoch).send({ from: app.account, value: app.bookingFeeWei });
                msg("bookMsg", "“Booking Successful”");
                showSlots();
            } catch (e) { msg("bookMsg", "“Booking Unsuccessful” " + (e.message || e)); }
        };
        row.appendChild(btn);
        wrap.appendChild(row);
    });
}

function wireBookingUI() {
    document.getElementById("refreshTrainers").onclick = loadTrainers;
    document.getElementById("loadSlots").onclick = showSlots;
}

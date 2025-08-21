// Mappers
window.RoleNames = ["Admin", "Participant", "Trainer"];
window.InterestNames = ["first_aid", "shelter_rebuild", "food_safety"];

// Normalizers (handle both struct and tuple returns)
window.normalizeUser = (u) => ({
    id: Number(u.id ?? u[0] ?? 0),
    name: (u.name ?? u[1] ?? ""),
    role: Number(u.role ?? u[2] ?? 0),
    wallet_addr: (u.wallet_addr ?? u[3] ?? ""),
    isRegistered: Boolean(u.isRegistered ?? u[4] ?? false),
    age: Number(u.age ?? u[5] ?? 0),
    gender: (u.gender ?? u[6] ?? ""),
    district: (u.district ?? u[7] ?? ""),
    training_interest: Number(u.training_interest ?? u[8] ?? 0),
    has_completed_training: Boolean(u.has_completed_training ?? u[9] ?? false),
});

window.normalizeBooking = (b) => ({
    participant: (b.participant ?? b[0] ?? ""),
    trainer: (b.trainer ?? b[1] ?? ""),
    startTime: Number(b.startTime ?? b[2] ?? 0),
    endTime: Number(b.endTime ?? b[3] ?? 0),
    paidFee: (b.paidFee ?? b[4] ?? "0"),
});

window.msg = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; }

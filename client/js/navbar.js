async function loadNavbar(activeKey) {
    const target = document.getElementById("navbar");
    const base = location.pathname.includes("/pages/") ? ".." : ".";
    const res = await fetch(`${base}/partials/navbar.html`);
    // const res = await fetch(`${base}`);
    // 
    target.innerHTML = await res.text();

    // highlight active
    if (activeKey) {
        document.querySelectorAll('[data-nav]').forEach(a => {
            if (a.getAttribute('data-nav') === activeKey) a.classList.add('active');
        });
    }

    // wire connect
    document.getElementById("connectBtn").onclick = async () => {
        try {
            await web3Helpers.connect();
            await updateNavStatus();
        } catch (e) { alert(e.message || e); }
    };
}

async function updateNavStatus() {
    const roleEl = document.getElementById("navRole");
    const accEl = document.getElementById("navAccount");
    if (!app.contract || !app.account) { roleEl.textContent = "Unconnected"; accEl.textContent = "—"; return; }
    const me = normalizeUser(await app.contract.methods.users(app.account).call());
    roleEl.textContent = me.isRegistered ? (RoleNames[me.role] || "Unknown") : "Unregistered";
    accEl.textContent = app.account.slice(0, 6) + "…" + app.account.slice(-4);
}

window.navbar = { loadNavbar, updateNavStatus };

const rpData = [
    { id: 0, server: "Spotlight RP", character: "天逸", status: "Active", desc: "在混亂的酒吧擔任主唱，同時也是神祕的消息販子。", tags: ["GTA5", "醫生"] },
    { id: 1, server: "星際末日 RP", character: "雪娜-09", status: "Ended", desc: "在荒涼行星獨自存活 300 年的仿生人，試圖尋找人類的遺跡。", tags: ["Sci-Fi", "仿生人"] }
];

function renderMenu() {
    const menu = document.getElementById('rp-menu');
    if(!menu) return;
    menu.innerHTML = rpData.map(item => `
        <div class="p-5 mb-4 rounded-2xl cursor-pointer transition border border-transparent opacity-50 hover:opacity-100" 
             style="background: rgba(255,255,255,0.05)" 
             id="rp-item-${item.id}" onclick="showDetail(${item.id})">
            <div class="text-[9px] uppercase font-bold text-red-400 mb-1">${item.status}</div>
            <div class="text-sm font-black">${item.server}</div>
        </div>
    `).join('');
}

function showDetail(id) {
    const item = rpData[id];
    document.querySelectorAll('[id^="rp-item-"]').forEach(el => {
        el.style.borderColor = "transparent";
        el.style.opacity = "0.5";
    });
    const activeItem = document.getElementById(`rp-item-${id}`);
    activeItem.style.borderColor = "#ef4444";
    activeItem.style.opacity = "1";
    
    document.getElementById('rp-detail').innerHTML = `
        <div style="animation: rpFade 0.5s ease forwards">
            <h3 class="text-red-500 font-black tracking-[0.5em] mb-4 text-xs uppercase">Record Log #${id}</h3>
            <h2 class="text-8xl font-black mb-12 tracking-tighter">${item.character}</h2>
            <div class="grid grid-cols-2 gap-10 mb-12">
                <div><span class="text-[10px] opacity-40 uppercase block mb-2">Location</span><p class="text-2xl font-bold">${item.server}</p></div>
                <div><span class="text-[10px] opacity-40 uppercase block mb-2">Status</span><p class="text-2xl font-bold">${item.status}</p></div>
            </div>
            <p class="text-2xl leading-relaxed text-white/70 max-w-3xl font-light">${item.desc}</p>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderMenu);
const config = {
    angel: { 
        name: "天雪", 
        birth: "09 / 21", 
        race: "天使", 
        bio: "「願這場冬雪，能洗淨世間所有的哀愁。」", 
        color: "#0369a1", 
        aboutTitle: "關於天雪", 
        aboutDesc: "這裡是天雪。喜歡深夜的寂靜，希望能透過歌聲溫暖迷路的靈魂。",
        links: {
            yt: "https://www.youtube.com/@AmayukiShiina",
            x: "https://x.com/Shiina_Amayuk1",
            tw: "https://www.twitch.tv/amayukishiina",
            ig: "https://www.instagram.com/amayuki_shiina/",
            tk: "https://www.tiktok.com/@amayukishiina"
        }
    },
    demon: { 
        name: "夕納", 
        birth: "09 / 16", 
        race: "惡魔", 
        bio: "「讓紅色的雪蓋過一切吧，靈魂什麼的...不需要喔。」", 
        color: "#f87171", 
        aboutTitle: "關於夕納", 
        aboutDesc: "夕納。紅色的雪並不是悲傷，而是極致的狂歡。沒打算放你走喔。",
        links: {
            yt: "https://www.youtube.com/@AmayukiShiina",
            x: "https://x.com/Shiina_Amayuk1",
            tw: "https://www.twitch.tv/amayukishiina",
            ig: "https://www.instagram.com/amayuki_shiina/",
            tk: "https://www.tiktok.com/@amayukishiina"
        }
    }
};

function updateMode(mode) {
    const d = config[mode];
    
    // 更新選單按鈕
    const menuBtn = document.getElementById('menuBtn');
    if(menuBtn) {
        menuBtn.style.color = d.color;
        menuBtn.style.borderColor = d.color + "66";
    }

    // 更新背景與狀態
    document.getElementById('mainStage').className = 'stage ' + (mode === 'demon' ? 'is-demon' : '');
    document.getElementById('bgTitle').innerText = d.name;

    // 更新卡片文字
    document.getElementById('nameDisplay').innerText = d.name;
    document.getElementById('birthVal').innerText = d.birth;
    document.getElementById('raceVal').innerText = d.race;
    document.getElementById('bioText').innerText = d.bio;
    document.getElementById('aboutTitle').innerText = d.aboutTitle;
    document.getElementById('aboutContent').innerHTML = d.aboutDesc;

    // 更新社群連結標題與網址顏色
    document.getElementById('connectTitle').style.color = d.color;
    
    const linkMap = {
        'linkYt': d.links.yt,
        'linkX': d.links.x,
        'linkTw': d.links.tw,
        'linkIg': d.links.ig,
        'linkTk': d.links.tk
    };

    Object.keys(linkMap).forEach(id => {
        const el = document.getElementById(id);
        if(el) {
            el.href = linkMap[id];
            el.target = "_blank";
            el.style.color = d.color;
        }
    });
}

function togglePortal(open) {
    const portal = document.getElementById('nav-portal');
    if (open) {
        portal.style.display = 'flex';
        setTimeout(() => portal.classList.add('active'), 10);
    } else {
        portal.classList.remove('active');
        setTimeout(() => portal.style.display = 'none', 500);
    }
}

// 初始化天使模式
document.addEventListener('DOMContentLoaded', () => {
    updateMode('angel');
});
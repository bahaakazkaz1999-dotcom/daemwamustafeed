// js/main.js

// الرقم الموحد لواتساب (عدّله إلى الرقم المطلوب بصيغة دولية بدون صفر أو +)
const whatsappNumber = '963964588734';

// دالة فتح واتساب مع رسالة محددة
function openWhatsApp(message) {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// دالة عامة لتحميل البيانات من JSON
async function loadData(url, containerId, type) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('فشل في تحميل البيانات');
        const data = await response.json();
        const container = document.getElementById(containerId);
        if (!container) return;
        displayItems(data, container, type);
    } catch (error) {
        console.error(error);
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<p class="error-message">عذراً، حدث خطأ في تحميل البيانات. يرجى المحاولة لاحقاً.</p>';
        }
    }
}

// دالة عرض العناصر حسب النوع
function displayItems(data, container, type) {
    let items = [];
    if (type === 'humanitarian') items = data.humanitarian || [];
    else if (type === 'projects') items = data.projects || [];
    else if (type === 'completed') items = data.completed || [];

    if (items.length === 0) {
        container.innerHTML = '<p>لا توجد عناصر لعرضها حالياً.</p>';
        return;
    }

    container.innerHTML = '';
    items.forEach(item => {
        let card = document.createElement('div');
        card.className = 'card';

        // محتوى البطاقة
        let imageHtml = `<div class="card-image"><img src="${item.image || '/images/placeholder.jpg'}" alt="${item.title}" loading="lazy" onerror="this.src='/images/placeholder.jpg'"></div>`;
        let titleHtml = `<h3>${item.title}</h3>`;
        let descHtml = `<p>${item.description}</p>`;
        let footerHtml = '';

        if (type === 'completed') {
            footerHtml = ''; // لا يوجد زر للأعمال المنجزة
        } else {
            let btnText = type === 'humanitarian' ? 'تواصل للدعم' : 'تواصل للدعم';
            let message = item.whatsapp_message || item.title;
            footerHtml = `<div class="card-footer"><a href="#" class="whatsapp-btn" data-message="${message}"><i class="fab fa-whatsapp"></i> ${btnText}</a></div>`;
        }

        card.innerHTML = `<div class="card-image">${imageHtml}</div><div class="card-content">${titleHtml}${descHtml}${footerHtml}</div>`;
        container.appendChild(card);
    });

    // إضافة event listener لأزرار الواتساب (بدون onclick)
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = this.getAttribute('data-message') || 'دعم حالة إنسانية';
            openWhatsApp(message);
        });
    });
}

// قائمة الجوال
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.getElementById('main-nav').classList.toggle('active');
        });
    }
});
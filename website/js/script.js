// Prompt data for copy functionality
const promptsData = {
    'ensaio-dramatico': `Crie uma fotografia profissional de [DESCRIÇÃO DA PESSOA], estilo ensaio fotográfico de estúdio.

Iluminação: Contraluz quente dourado (temperatura 3200K) destacando perfeitamente o contorno do cabelo e ombros, criando um halo luminoso. Luz principal fria azul-verde (temperatura 5600K) iluminando suavemente o rosto de 45 graus, criando sombras suaves. Luz de preenchimento sutil para reduzir contraste.

Composição: Fundo escuro minimalista (preto ou cinza escuro), pessoa centralizada ou seguindo regra dos terços. Expressão [EXPRESSÃO: confiante/serena/misteriosa], pose [POSE: três-quartos/frontal/perfil artístico].

Qualidade: Fotorrealística, 8K, ultra alta definição, estilo revista de moda, depth of field cinematográfico, cores saturadas mas naturais.`,

    'golden-hour': `Fotografia de retrato profissional ao ar livre durante golden hour de [DESCRIÇÃO DA PESSOA].

Ambiente: [CENÁRIO: parque urbano/praia/campo/jardim], hora dourada (30 minutos antes do pôr do sol), luz natural quente e suave.

Iluminação: Luz solar lateral criando contraluz dourado nos cabelos, refletor discreto para iluminar o rosto, sombras suaves e naturais.

Pose: [POSE ESPECÍFICA: olhando para horizonte/sorriso natural/pose pensativa], roupas [ESTILO: casual elegante/boho/clássico], cabelos soltos ao vento.

Estilo: Fotorrealístico, cores quentes saturadas, bokeh natural no fundo, estilo editorial de revista lifestyle.`,

    'headshot-linkedin': `Crie um headshot profissional para LinkedIn de [DESCRIÇÃO DA PESSOA].

Setup: Fundo neutro [COR: azul corporativo suave/cinza claro/branco], pessoa centralizada da cintura para cima, enquadramento bust shot.

Iluminação: Luz principal suave e uniforme no rosto (softbox ou luz de janela), sem sombras duras. Luz de preenchimento para eliminar sombras sob os olhos. Iluminação flat lighting para aparência limpa e profissional.

Expressão: Sorriso natural e confiante, olhar direto para câmera transmitindo credibilidade, postura ereta e profissional.

Vestimenta: [DRESS CODE: social formal/business casual/elegante contemporâneo], cores sólidas que complementem o fundo.

Resultado: Fotorrealístico, alta resolução, cores naturais, aparência polida mas autêntica, adequado para redes profissionais.`,

    'executivo-premium': `Fotografia corporativa premium de [DESCRIÇÃO DA PESSOA], estilo executivo de alto escalão.

Ambiente: Escritório moderno ou estúdio com elementos corporativos sutis, iluminação sofisticada que demonstre status profissional.

Lighting Setup: Key light posicionado para criar slight drama, rim light para separar do fundo, fill light controlado para manter detalhes nas sombras.

Composição: Enquadramento 3/4 ou bust shot, pose confiante [POSE: braços cruzados/mãos no quadril/apoiado elegantemente], expressão séria mas acessível.

Styling: Terno/roupa executiva impecável, cores [PALETA: tons neutros/azul marinho/cinza carvão], acessórios discretos e elegantes.

Output: Ultra profissional, qualidade revista Forbes/Exame, retoque sutil mas natural, transmitindo autoridade e competência.`,

    'casal-dramatico': `Crie uma fotografia profissional de casal [DESCRIÇÃO DO CASAL], ensaio romântico estilo estúdio cinematográfico.

Iluminação: Contraluz dourado intenso (3200K) criando halo nos cabelos de ambos, luz principal azul-fria (5600K) iluminando rostos a 45°, criando drama romântico com contraste de cores complementares.

Poses: [POSE ESPECÍFICA: abraço íntimo/dança romântica/olhares conectados/testa com testa]. Conexão emocional natural, gestos espontâneos, química palpável entre o casal.

Cenário: Fundo escuro minimalista, fumaça sutil ou partículas de luz para criar atmosfera, elementos que não distraiam do casal.

Mood: Romântico cinematográfico, intimidade respeitosa, elegância contemporânea, amor genuíno.

Resultado: Fotorrealístico, qualidade editorial, cores saturadas mas naturais, composição que celebra o relacionamento.`,

    'casal-natural': `Ensaio de casal durante golden hour em [CENÁRIO: praia/campo/parque/cidade], [DESCRIÇÃO DO CASAL].

Timing: 30 minutos antes do pôr do sol, luz natural dourada e suave envolvendo o casal, sombras longas e românticas.

Composição: Casal [INTERAÇÃO: caminhando de mãos dadas/abraçados contemplando horizonte/rindo juntos], silhuetas parciais com contraluz, elementos naturais enquadrando a cena.

Atmosfera: Romântica e espontânea, momentos genuínos de conexão, risadas naturais, [MOOD: apaixonado/sereno/alegre/contemplativo].

Vestuário: [ESTILO: casual elegante/boho chic/clássico atemporal], cores que harmonizem com a luz dourada e cenário.

Output: Fotorrealístico, cores quentes saturadas, bokeh natural, sensação de filme romântico, autenticidade emocional.`
};

// Copy prompt functionality
function copyPrompt(promptId) {
    const prompt = promptsData[promptId];
    if (!prompt) {
        console.error('Prompt not found:', promptId);
        return;
    }

    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = prompt;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy prompt:', err);
        showCopyError();
    } finally {
        document.body.removeChild(textarea);
    }
}

// Show copy success notification
function showCopySuccess() {
    showNotification(' Prompt copiado com sucesso!', 'success');
}

// Show copy error notification
function showCopyError() {
    showNotification('L Erro ao copiar. Tente novamente.', 'error');
}

// Generic notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Add animation keyframes if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle navigation clicks
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80; // Account for sticky header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation on scroll for better UX
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.stat-card, .prompt-card, .step, .example-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

// Analytics and tracking (placeholder)
function trackPromptCopy(promptId) {
    // Google Analytics or other tracking service
    if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_prompt', {
            'prompt_type': promptId,
            'event_category': 'engagement'
        });
    }

    console.log('Prompt copied:', promptId);
}

// Add tracking to copy function
const originalCopyPrompt = copyPrompt;
copyPrompt = function(promptId) {
    originalCopyPrompt(promptId);
    trackPromptCopy(promptId);
};

// Mobile menu functionality (if needed in future)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Close notifications with Escape key
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Progressive loading for better performance
window.addEventListener('load', function() {
    // Add any post-load optimizations here
    console.log('Prompt Gemini Fotos - Site loaded successfully');
});
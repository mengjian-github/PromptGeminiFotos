// Prompt data for copy functionality
const promptsData = {
    'ensaio-dramatico': `Crie uma fotografia profissional de [DESCRI��O DA PESSOA], estilo ensaio fotogr�fico de est�dio.

Ilumina��o: Contraluz quente dourado (temperatura 3200K) destacando perfeitamente o contorno do cabelo e ombros, criando um halo luminoso. Luz principal fria azul-verde (temperatura 5600K) iluminando suavemente o rosto de 45 graus, criando sombras suaves. Luz de preenchimento sutil para reduzir contraste.

Composi��o: Fundo escuro minimalista (preto ou cinza escuro), pessoa centralizada ou seguindo regra dos ter�os. Express�o [EXPRESS�O: confiante/serena/misteriosa], pose [POSE: tr�s-quartos/frontal/perfil art�stico].

Qualidade: Fotorreal�stica, 8K, ultra alta defini��o, estilo revista de moda, depth of field cinematogr�fico, cores saturadas mas naturais.`,

    'golden-hour': `Fotografia de retrato profissional ao ar livre durante golden hour de [DESCRI��O DA PESSOA].

Ambiente: [CEN�RIO: parque urbano/praia/campo/jardim], hora dourada (30 minutos antes do p�r do sol), luz natural quente e suave.

Ilumina��o: Luz solar lateral criando contraluz dourado nos cabelos, refletor discreto para iluminar o rosto, sombras suaves e naturais.

Pose: [POSE ESPEC�FICA: olhando para horizonte/sorriso natural/pose pensativa], roupas [ESTILO: casual elegante/boho/cl�ssico], cabelos soltos ao vento.

Estilo: Fotorreal�stico, cores quentes saturadas, bokeh natural no fundo, estilo editorial de revista lifestyle.`,

    'headshot-linkedin': `Crie um headshot profissional para LinkedIn de [DESCRI��O DA PESSOA].

Setup: Fundo neutro [COR: azul corporativo suave/cinza claro/branco], pessoa centralizada da cintura para cima, enquadramento bust shot.

Ilumina��o: Luz principal suave e uniforme no rosto (softbox ou luz de janela), sem sombras duras. Luz de preenchimento para eliminar sombras sob os olhos. Ilumina��o flat lighting para apar�ncia limpa e profissional.

Express�o: Sorriso natural e confiante, olhar direto para c�mera transmitindo credibilidade, postura ereta e profissional.

Vestimenta: [DRESS CODE: social formal/business casual/elegante contempor�neo], cores s�lidas que complementem o fundo.

Resultado: Fotorreal�stico, alta resolu��o, cores naturais, apar�ncia polida mas aut�ntica, adequado para redes profissionais.`,

    'executivo-premium': `Fotografia corporativa premium de [DESCRI��O DA PESSOA], estilo executivo de alto escal�o.

Ambiente: Escrit�rio moderno ou est�dio com elementos corporativos sutis, ilumina��o sofisticada que demonstre status profissional.

Lighting Setup: Key light posicionado para criar slight drama, rim light para separar do fundo, fill light controlado para manter detalhes nas sombras.

Composi��o: Enquadramento 3/4 ou bust shot, pose confiante [POSE: bra�os cruzados/m�os no quadril/apoiado elegantemente], express�o s�ria mas acess�vel.

Styling: Terno/roupa executiva impec�vel, cores [PALETA: tons neutros/azul marinho/cinza carv�o], acess�rios discretos e elegantes.

Output: Ultra profissional, qualidade revista Forbes/Exame, retoque sutil mas natural, transmitindo autoridade e compet�ncia.`,

    'casal-dramatico': `Crie uma fotografia profissional de casal [DESCRI��O DO CASAL], ensaio rom�ntico estilo est�dio cinematogr�fico.

Ilumina��o: Contraluz dourado intenso (3200K) criando halo nos cabelos de ambos, luz principal azul-fria (5600K) iluminando rostos a 45�, criando drama rom�ntico com contraste de cores complementares.

Poses: [POSE ESPEC�FICA: abra�o �ntimo/dan�a rom�ntica/olhares conectados/testa com testa]. Conex�o emocional natural, gestos espont�neos, qu�mica palp�vel entre o casal.

Cen�rio: Fundo escuro minimalista, fuma�a sutil ou part�culas de luz para criar atmosfera, elementos que n�o distraiam do casal.

Mood: Rom�ntico cinematogr�fico, intimidade respeitosa, eleg�ncia contempor�nea, amor genu�no.

Resultado: Fotorreal�stico, qualidade editorial, cores saturadas mas naturais, composi��o que celebra o relacionamento.`,

    'casal-natural': `Ensaio de casal durante golden hour em [CEN�RIO: praia/campo/parque/cidade], [DESCRI��O DO CASAL].

Timing: 30 minutos antes do p�r do sol, luz natural dourada e suave envolvendo o casal, sombras longas e rom�nticas.

Composi��o: Casal [INTERA��O: caminhando de m�os dadas/abra�ados contemplando horizonte/rindo juntos], silhuetas parciais com contraluz, elementos naturais enquadrando a cena.

Atmosfera: Rom�ntica e espont�nea, momentos genu�nos de conex�o, risadas naturais, [MOOD: apaixonado/sereno/alegre/contemplativo].

Vestu�rio: [ESTILO: casual elegante/boho chic/cl�ssico atemporal], cores que harmonizem com a luz dourada e cen�rio.

Output: Fotorreal�stico, cores quentes saturadas, bokeh natural, sensa��o de filme rom�ntico, autenticidade emocional.`
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
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">�</button>
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
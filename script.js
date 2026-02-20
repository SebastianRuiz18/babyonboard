document.addEventListener('DOMContentLoaded', () => {
    
// --- CONFIGURACIÓN DE CAPACIDAD ---
    const PASSWORD_DB = {
        "fam1": 1,
        "fam2": 2,
        "fam3": 3,
        "fam4": 4,
        "fam5": 5
    };

    // --- REFERENCIAS DOM ---
    const btnCheck = document.getElementById('rsvp-check-btn');
    const inputCode = document.getElementById('rsvp-code-input');
    const loginView = document.getElementById('rsvp-login-view');
    const errorMsg = document.getElementById('rsvp-error-msg');

    const formView = document.getElementById('rsvp-form-view');
    const rsvpForm = document.getElementById('rsvp-form');
    const successView = document.getElementById('rsvp-success-msg');
    
    // Contenedor donde inyectaremos los inputs
    const dynamicContainer = document.getElementById('dynamic-guests-container');
    const hiddenCodeInput = document.getElementById('hidden-code');
    const submitBtn = document.getElementById('submit-btn');

    // Referencias Zelle
    const btnCopy = document.getElementById('btn-copy');
    const zelleTextElement = document.getElementById('zelle-text');
    const feedbackMsg = document.getElementById('copy-feedback');

    // ==========================================
    // 1. LÓGICA DE LOGIN Y GENERACIÓN DE FORMULARIO
    // ==========================================
    
    function checkPassword() {
        const enteredCode = inputCode.value.trim().toLowerCase(); // Quitamos espacios y minúsculas
        
        if (PASSWORD_DB.hasOwnProperty(enteredCode)) {
            // Guardamos capacidad
            const maxGuests = PASSWORD_DB[enteredCode];
            
            // Guardamos qué código usaron
            hiddenCodeInput.value = enteredCode;

            // ¡MAGIA! Generamos los campos según la capacidad
            generateGuestFields(maxGuests);

            // Cambiamos de pantalla
            loginView.style.display = 'none'; 
            formView.classList.remove('hidden');
            formView.classList.add('fade-in-up');
        } else {
            errorMsg.classList.remove('hidden');
            inputCode.value = ''; 
            inputCode.focus();
        }
    }

    // Función que crea el HTML repetido para cada invitado
    function generateGuestFields(count) {
        dynamicContainer.innerHTML = ""; // Limpiar por si acaso
        
        for (let i = 1; i <= count; i++) {
            // Creamos un div para el invitado
            const guestDiv = document.createElement('div');
            guestDiv.className = "guest-block fade-in-up";
            // Un pequeño retraso en la animación para que aparezcan en cascada
            guestDiv.style.animationDelay = `${i * 0.1}s`; 

            guestDiv.innerHTML = `
                <div class="guest-header">
                    <span class="guest-number">Guest ${i}</span>
                    ${i === 1 ? '<span class="guest-badge">(Main Guest)</span>' : ''}
                </div>
                
                <label class="input-label">Full Name</label>
                <input type="text" name="Guest_${i}_Name" class="rsvp-input-style" required placeholder="First & Last Name">
                
                <label class="input-label">Attending?</label>
                <select name="Guest_${i}_Attendance" class="rsvp-select-style" required>
                    <option value="">Select an option</option>
                    <option value="Yes">Yes, I'll be there!</option>
                    <option value="No">No, I can't make it</option>
                </select>

                <label class="input-label">Allergies or Dietary Restrictions</label>
                <input type="text" name="Guest_${i}_Allergies" class="rsvp-input-style" placeholder="e.g., Gluten, Nuts, None">
                
                ${i < count ? '<div class="divider-small"></div>' : ''} 
            `;
            
            dynamicContainer.appendChild(guestDiv);
        }
    }

    // Listeners del Login
    if (btnCheck) {
        btnCheck.addEventListener('click', checkPassword);
        inputCode.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
        inputCode.addEventListener('input', () => {
            errorMsg.classList.add('hidden');
        });
    }

    // ==========================================
    // 2. ENVÍO CON FORMSUBMIT (AJAX)
    // ==========================================

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = "SENDING...";
            submitBtn.disabled = true;

            const formData = new FormData(rsvpForm);

            fetch(rsvpForm.action, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                // FormSubmit a veces redirige, pero si el fetch funciona asumimos éxito
                formView.style.display = 'none'; 
                successView.classList.remove('hidden');
                successView.classList.add('fade-in-up');
            })
            .catch(error => {
                console.error('Error:', error);
                alert("There was a connection error.");
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // ==========================================
    // 3. COPIADO ZELLE
    // ==========================================
    if (btnCopy) {
        btnCopy.addEventListener('click', () => {
            const emailToCopy = zelleTextElement.innerText;
            navigator.clipboard.writeText(emailToCopy).then(() => {
                feedbackMsg.classList.remove('hidden');
                setTimeout(() => feedbackMsg.classList.add('hidden'), 2000);
            }).catch(err => console.error(err));
        });
    }
});
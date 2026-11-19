document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-login-cliente");
    const emailInput = document.getElementById("email");
    const senhaInput = document.getElementById("senha");
    const toggleSenhaBtn = document.getElementById("toggle-senha");
    const iconeOlho = document.getElementById("icone-olho");
    const alertaBox = document.getElementById("mensagem-alerta");
    const btnEntrar = document.getElementById("btn-entrar");

    // Mostrar ou ocultar senha
    toggleSenhaBtn.addEventListener("click", function () {
        const tipoAtual = senhaInput.getAttribute("type");
        if (tipoAtual === "password") {
            senhaInput.setAttribute("type", "text");
            iconeOlho.classList.remove("fa-eye");
            iconeOlho.classList.add("fa-eye-slash");
        } else {
            senhaInput.setAttribute("type", "password");
            iconeOlho.classList.remove("fa-eye-slash");
            iconeOlho.classList.add("fa-eye");
        }
    });

    function mostrarAlerta(mensagem, tipo) {
        alertaBox.textContent = mensagem;
        alertaBox.className = `alert alert-${tipo} mt-2`;
        alertaBox.classList.remove("d-none");
    }

    // Validação do formulário antes do envio para o PHP
    form.addEventListener("submit", function (event) {
        const emailValor = emailInput.value.trim();
        const senhaValor = senhaInput.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        alertaBox.classList.add("d-none");
        emailInput.classList.remove("is-invalid", "is-valid");
        senhaInput.classList.remove("is-invalid", "is-valid");

        if (!regexEmail.test(emailValor)) {
            event.preventDefault();
            emailInput.classList.add("is-invalid");
            mostrarAlerta("Por favor, digite um e-mail válido.", "danger");
            emailInput.focus();
            return;
        }

        if (senhaValor.length < 4) {
            event.preventDefault();
            senhaInput.classList.add("is-invalid");
            mostrarAlerta("A senha deve conter no mínimo 4 caracteres.", "warning");
            senhaInput.focus();
            return;
        }

        emailInput.classList.add("is-valid");
        senhaInput.classList.add("is-valid");
        btnEntrar.disabled = true;
        btnEntrar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Entrando...';
    });
});

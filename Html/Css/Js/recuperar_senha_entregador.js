document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-recuperar-entregador");
    const emailInput = document.getElementById("email");
    const alertaBox = document.getElementById("mensagem-alerta");
    const btnEnviar = document.getElementById("btn-enviar");

    function mostrarAlerta(mensagem, tipo) {
        alertaBox.textContent = mensagem;
        alertaBox.className = `alert alert-${tipo} mt-2`;
        alertaBox.classList.remove("d-none");
    }

    form.addEventListener("submit", function (event) {
        const emailValor = emailInput.value.trim();
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Limpa alertas anteriores
        alertaBox.classList.add("d-none");
        emailInput.classList.remove("is-invalid", "is-valid");

        // Validação de campo vazio
        if (emailValor === "") {
            event.preventDefault();
            emailInput.classList.add("is-invalid");
            mostrarAlerta("Por favor, preencha o seu e-mail.", "danger");
            emailInput.focus();
            return;
        }

        // Validação de formato de e-mail
        if (!regexEmail.test(emailValor)) {
            event.preventDefault();
            emailInput.classList.add("is-invalid");
            mostrarAlerta("Digite um endereço de e-mail válido (ex: nome@dominio.com).", "warning");
            emailInput.focus();
            return;
        }

        // Feedback visual antes de enviar para o PHP
        emailInput.classList.add("is-valid");
        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Verificando e enviando...';
    });
});
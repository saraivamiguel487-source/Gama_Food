document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-recuperar-entregador');
    const emailInput = document.getElementById('email');
    const alerta = document.getElementById('mensagem-alerta');
    const btnEnviar = document.getElementById('btn-enviar');

    function exibirAlerta(mensagem, tipo) {
        alerta.textContent = mensagem;
        alerta.className = `alert alert-${tipo}`;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!email || !emailValido) {
            exibirAlerta('Por favor, insira um e-mail válido.', 'danger');
            emailInput.focus();
            return;
        }

        // Simulação de envio (substitua pelo fetch() para processar_recuperar_entregador.php)
        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Enviando...';

        setTimeout(() => {
            exibirAlerta('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes.', 'success');
            form.reset();
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = '<i class="fa-solid fa-paper-plane me-2"></i>Enviar Link de Recuperação';
        }, 1000);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const radiosPagamento = document.querySelectorAll('input[name="metodoPagamento"]');
    const paineis = {
        pix: document.getElementById('painel-pix'),
        cartao: document.getElementById('painel-cartao'),
        dinheiro: document.getElementById('painel-dinheiro')
    };

    const btnCopiarPix = document.getElementById('btn-copiar-pix');
    const codigoPix = document.getElementById('codigo-pix');
    const checkTroco = document.getElementById('precisaTroco');
    const campoTroco = document.getElementById('campo-troco');
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    const alerta = document.getElementById('alerta-pagamento');

    // Alternar painéis conforme o método escolhido
    radiosPagamento.forEach(radio => {
        radio.addEventListener('change', (e) => {
            Object.values(paineis).forEach(painel => painel.classList.add('d-none'));
            paineis[e.target.value].classList.remove('d-none');
        });
    });

    // Copiar código PIX
    btnCopiarPix.addEventListener('click', () => {
        navigator.clipboard.writeText(codigoPix.value);
        btnCopiarPix.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copiado!';
        setTimeout(() => {
            btnCopiarPix.innerHTML = '<i class="fa-regular fa-copy me-1"></i> Copiar';
        }, 2000);
    });

    // Exibir/ocultar campo de troco
    checkTroco.addEventListener('change', (e) => {
        campoTroco.classList.toggle('d-none', !e.target.checked);
    });

    // Validação e envio do pedido
    btnFinalizar.addEventListener('click', () => {
        const endereco = document.getElementById('endereco').value.trim();
        const metodo = document.querySelector('input[name="metodoPagamento"]:checked').value;

        if (!endereco) {
            mostrarAlerta('Por favor, informe o endereço de entrega.', 'danger');
            document.getElementById('endereco').focus();
            return;
        }

        if (metodo === 'cartao') {
            const num = document.getElementById('numeroCartao').value.trim();
            const nome = document.getElementById('nomeCartao').value.trim();
            const val = document.getElementById('validadeCartao').value.trim();
            const cvv = document.getElementById('cvvCartao').value.trim();

            if (!num || !nome || !val || !cvv) {
                mostrarAlerta('Preencha todos os dados do cartão para continuar.', 'danger');
                return;
            }
        }

        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Processando...';

        setTimeout(() => {
            mostrarAlerta('Pedido confirmado com sucesso! Seu pedido já está sendo preparado.', 'success');
            btnFinalizar.innerHTML = '<i class="fa-solid fa-check me-2"></i>Pedido Realizado';
        }, 1200);
    });

    function mostrarAlerta(msg, tipo) {
        alerta.textContent = msg;
        alerta.className = `alert alert-${tipo}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

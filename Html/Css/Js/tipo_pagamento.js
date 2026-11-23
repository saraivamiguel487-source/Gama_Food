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
    const inputTroco = document.getElementById('valorTroco');

    const inputNumeroCartao = document.getElementById('numeroCartao');
    const inputValidadeCartao = document.getElementById('validadeCartao');
    const inputCvvCartao = document.getElementById('cvvCartao');
    const alerta = document.getElementById('alerta-pagamento');

    // 1. Alternar exibição dos painéis conforme o tipo de pagamento selecionado
    function atualizarPainelPagamento(metodoSelecionado) {
        Object.entries(paineis).forEach(([chave, painel]) => {
            if (!painel) return;
            painel.classList.toggle('d-none', chave !== metodoSelecionado);
        });

        if (alerta) {
            alerta.classList.add('d-none');
        }
    }

    radiosPagamento.forEach(radio => {
        radio.addEventListener('change', (e) => {
            atualizarPainelPagamento(e.target.value);
        });
    });

    // Garante que o painel inicial corresponda ao radio marcado ao carregar a página
    const radioInicial = document.querySelector('input[name="metodoPagamento"]:checked');
    if (radioInicial) {
        atualizarPainelPagamento(radioInicial.value);
    }

    // 2. Copiar chave/código PIX para a área de transferência
    if (btnCopiarPix && codigoPix) {
        btnCopiarPix.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codigoPix.value);
                const textoOriginal = btnCopiarPix.innerHTML;
                btnCopiarPix.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copiado!';
                btnCopiarPix.classList.replace('btn-gama', 'btn-dark');

                setTimeout(() => {
                    btnCopiarPix.innerHTML = textoOriginal;
                    btnCopiarPix.classList.replace('btn-dark', 'btn-gama');
                }, 2000);
            } catch {
                codigoPix.select();
                document.execCommand('copy');
            }
        });
    }

    // 3. Controlar exibição do campo de troco no pagamento em dinheiro
    if (checkTroco && campoTroco) {
        checkTroco.addEventListener('change', (e) => {
            campoTroco.classList.toggle('d-none', !e.target.checked);
            if (e.target.checked && inputTroco) {
                inputTroco.focus();
            } else if (inputTroco) {
                inputTroco.value = '';
            }
        });
    }

    // 4. Máscaras de formatação para os campos do cartão
    if (inputNumeroCartao) {
        inputNumeroCartao.addEventListener('input', (e) => {
            const numeros = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = numeros.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }

    if (inputValidadeCartao) {
        inputValidadeCartao.addEventListener('input', (e) => {
            let numeros = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (numeros.length >= 3) {
                numeros = `${numeros.substring(0, 2)}/${numeros.substring(2)}`;
            }
            e.target.value = numeros;
        });
    }

    if (inputCvvCartao) {
        inputCvvCartao.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
});

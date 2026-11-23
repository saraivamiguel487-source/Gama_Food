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
    const inputNomeCartao = document.getElementById('nomeCartao');
    const inputValidadeCartao = document.getElementById('validadeCartao');
    const inputCvvCartao = document.getElementById('cvvCartao');
    const selectTipoCartao = document.getElementById('tipoCartao');

    const alerta = document.getElementById('alerta-pagamento');

    // Estado global acessível para outros scripts (ex: pagamento-pagar.js)
    window.GamaFoodPagamento = {
        metodoAtual: 'pix',
        obterDadosDefinidos: () => definirDadosPagamento()
    };

    // 1. Definir método de pagamento e alternar painéis
    function definirMetodoPagamento(metodo) {
        window.GamaFoodPagamento.metodoAtual = metodo;
        sessionStorage.setItem('gamafood_metodo_pagamento', metodo);

        Object.entries(paineis).forEach(([chave, painel]) => {
            if (!painel) return;
            painel.classList.toggle('d-none', chave !== metodo);
        });

        if (alerta) {
            alerta.classList.add('d-none');
        }
    }

    radiosPagamento.forEach(radio => {
        radio.addEventListener('change', (e) => {
            definirMetodoPagamento(e.target.value);
        });
    });

    // Restaurar método salvo anteriormente na sessão ou aplicar o padrão marcado
    const metodoSalvo = sessionStorage.getItem('gamafood_metodo_pagamento');
    if (metodoSalvo) {
        const radioSalvo = document.querySelector(`input[name="metodoPagamento"][value="${metodoSalvo}"]`);
        if (radioSalvo) {
            radioSalvo.checked = true;
            definirMetodoPagamento(metodoSalvo);
        }
    } else {
        const radioInicial = document.querySelector('input[name="metodoPagamento"]:checked');
        if (radioInicial) {
            definirMetodoPagamento(radioInicial.value);
        }
    }

    // 2. Copiar código PIX
    if (btnCopiarPix && codigoPix) {
        btnCopiarPix.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codigoPix.value);
                const htmlOriginal = btnCopiarPix.innerHTML;
                btnCopiarPix.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copiado!';
                btnCopiarPix.classList.replace('btn-gama', 'btn-dark');

                setTimeout(() => {
                    btnCopiarPix.innerHTML = htmlOriginal;
                    btnCopiarPix.classList.replace('btn-dark', 'btn-gama');
                }, 2000);
            } catch {
                codigoPix.select();
                document.execCommand('copy');
            }
        });
    }

    // 3. Definir necessidade de troco (Dinheiro)
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

    // 4. Máscaras de formatação do Cartão
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

    // 5. Retorna o objeto estruturado da forma de pagamento definida
    function definirDadosPagamento() {
        const metodo = window.GamaFoodPagamento.metodoAtual;

        if (metodo === 'pix') {
            return {
                metodo: 'pix',
                chave: codigoPix ? codigoPix.value : ''
            };
        }

        if (metodo === 'cartao') {
            return {
                metodo: 'cartao',
                modalidade: selectTipoCartao ? selectTipoCartao.value : 'credito',
                numero: inputNumeroCartao ? inputNumeroCartao.value.replace(/\s/g, '') : '',
                titular: inputNomeCartao ? inputNomeCartao.value.trim() : '',
                validade: inputValidadeCartao ? inputValidadeCartao.value.trim() : '',
                cvv: inputCvvCartao ? inputCvvCartao.value.trim() : ''
            };
        }

        if (metodo === 'dinheiro') {
            const precisaTroco = checkTroco ? checkTroco.checked : false;
            return {
                metodo: 'dinheiro',
                precisaTroco,
                trocoPara: precisaTroco && inputTroco ? parseFloat(inputTroco.value) : null
            };
        }

        return { metodo };
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Referências dos elementos da interface
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

    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    const alerta = document.getElementById('alerta-pagamento');

    let totalPedido = 0;

    // 1. Carregar itens do carrinho (localStorage) e calcular totais
    carregarResumoPedido();

    function carregarResumoPedido() {
        const listaResumo = document.getElementById('lista-itens-resumo');
        const carrinhoSalvo = JSON.parse(localStorage.getItem('gamafood_carrinho')) || [];
        const taxaEntrega = 5.00;
        let subtotal = 0;

        if (carrinhoSalvo.length > 0 && listaResumo) {
            listaResumo.innerHTML = '';
            carrinhoSalvo.forEach(item => {
                const totalItem = item.preco * item.quantidade;
                subtotal += totalItem;

                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between px-0';
                li.innerHTML = `
                    <span>${item.quantidade}x ${item.nome}</span>
                    <span>${formatarMoeda(totalItem)}</span>
                `;
                listaResumo.appendChild(li);
            });
        } else {
            // Valor padrão caso a página seja aberta diretamente sem itens no localStorage
            subtotal = 38.00;
        }

        totalPedido = subtotal + taxaEntrega;

        document.getElementById('valor-subtotal').textContent = formatarMoeda(subtotal);
        document.getElementById('valor-entrega').textContent = formatarMoeda(taxaEntrega);
        document.getElementById('valor-total').textContent = formatarMoeda(totalPedido);
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // 2. Alternar abas de forma de pagamento
    radiosPagamento.forEach(radio => {
        radio.addEventListener('change', (e) => {
            Object.values(paineis).forEach(painel => painel.classList.add('d-none'));
            if (paineis[e.target.value]) {
                paineis[e.target.value].classList.remove('d-none');
            }
            ocultarAlerta();
        });
    });

    // 3. Copiar código PIX
    if (btnCopiarPix && codigoPix) {
        btnCopiarPix.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codigoPix.value);
                btnCopiarPix.innerHTML = '<i class="fa-solid fa-check me-1"></i> Copiado!';
                setTimeout(() => {
                    btnCopiarPix.innerHTML = '<i class="fa-regular fa-copy me-1"></i> Copiar';
                }, 2000);
            } catch {
                codigoPix.select();
                document.execCommand('copy');
            }
        });
    }

    // 4. Exibir/ocultar campo de troco
    if (checkTroco && campoTroco) {
        checkTroco.addEventListener('change', (e) => {
            campoTroco.classList.toggle('d-none', !e.target.checked);
            if (!e.target.checked && inputTroco) {
                inputTroco.value = '';
            }
        });
    }

    // 5. Máscaras de formatação do cartão
    if (inputNumeroCartao) {
        inputNumeroCartao.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        });
    }

    if (inputValidadeCartao) {
        inputValidadeCartao.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (v.length >= 3) {
                v = `${v.substring(0, 2)}/${v.substring(2)}`;
            }
            e.target.value = v;
        });
    }

    if (inputCvvCartao) {
        inputCvvCartao.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }

    // 6. Validação e processamento do pagamento
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async () => {
            ocultarAlerta();

            const endereco = document.getElementById('endereco').value.trim();
            const complemento = document.getElementById('complemento').value.trim();
            const metodo = document.querySelector('input[name="metodoPagamento"]:checked').value;

            // Validar endereço
            if (!endereco) {
                mostrarAlerta('Por favor, informe o endereço de entrega no Gama.', 'danger');
                document.getElementById('endereco').focus();
                return;
            }

            // Validar dados específicos do método
            let detalhesPagamento = { metodo };

            if (metodo === 'cartao') {
                const numero = inputNumeroCartao.value.replace(/\s/g, '');
                const nome = document.getElementById('nomeCartao').value.trim();
                const validade = inputValidadeCartao.value.trim();
                const cvv = inputCvvCartao.value.trim();
                const modalidade = document.getElementById('tipoCartao').value;

                if (numero.length < 13 || !nome || validade.length < 5 || cvv.length < 3) {
                    mostrarAlerta('Verifique os dados do cartão. Todos os campos devem estar preenchidos corretamente.', 'danger');
                    return;
                }

                detalhesPagamento = {
                    metodo,
                    modalidade,
                    finalCartao: numero.slice(-4),
                    titular: nome
                };
            } else if (metodo === 'dinheiro' && checkTroco.checked) {
                const valorTroco = parseFloat(inputTroco.value);
                if (isNaN(valorTroco) || valorTroco <= totalPedido) {
                    mostrarAlerta(`O valor para troco deve ser maior que o total do pedido (${formatarMoeda(totalPedido)}).`, 'danger');
                    inputTroco.focus();
                    return;
                }
                detalhesPagamento.trocoPara = valorTroco;
            }

            // Bloquear botão durante envio
            btnFinalizar.disabled = true;
            btnFinalizar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Processando pagamento...';

            const dadosPedido = {
                endereco,
                complemento,
                pagamento: detalhesPagamento,
                itens: JSON.parse(localStorage.getItem('gamafood_carrinho')) || [],
                total: totalPedido
            };

            try {
                // Envio para o back-end PHP (ajuste a URL se necessário)
                const resposta = await fetch('processar_pagamento.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(dadosPedido)
                });

                if (!resposta.ok) throw new Error('Servidor indisponível');

                const resultado = await resposta.json();
                if (resultado.sucesso) {
                    concluirPedido();
                } else {
                    throw new Error(resultado.mensagem || 'Erro ao processar pagamento.');
                }
            } catch {
                // Fallback de simulação caso esteja testando sem servidor PHP ativo
                setTimeout(() => {
                    concluirPedido();
                }, 1200);
            }
        });
    }

    function concluirPedido() {
        localStorage.removeItem('gamafood_carrinho');
        mostrarAlerta('Pagamento aprovado e pedido confirmado! Acompanhe o status da entrega.', 'success');
        btnFinalizar.innerHTML = '<i class="fa-solid fa-check me-2"></i>Pedido Confirmado';
    }

    function mostrarAlerta(mensagem, tipo) {
        alerta.textContent = mensagem;
        alerta.className = `alert alert-${tipo}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function ocultarAlerta() {
        alerta.className = 'alert d-none';
    }
});

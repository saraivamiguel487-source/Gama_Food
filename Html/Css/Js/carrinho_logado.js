document.addEventListener("DOMContentLoaded", () => {
    const listaCarrinho = document.getElementById("lista-carrinho");
    const carrinhoVazio = document.getElementById("carrinho-vazio");
    const valorTotalEl = document.getElementById("valor-total");
    const btnFinalizar = document.getElementById("btn-finalizar");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnAdicionarTeste = document.getElementById("btn-adicionar-teste");
    const statusClienteEl = document.getElementById("status-cliente");

    // 1. Verifica se existe um cliente logado no localStorage
    const clienteLogado = JSON.parse(localStorage.getItem("gamafood_cliente_logado"));

    // Define uma chave única de carrinho para o cliente logado (ou visitante)
    const chaveCarrinho = clienteLogado 
        ? `gamafood_carrinho_${clienteLogado.email}` 
        : "gamafood_carrinho_visitante";

    let carrinho = JSON.parse(localStorage.getItem(chaveCarrinho)) || [];

    // 2. Atualiza a interface de acordo com o status de login
    function verificarStatusLogin() {
        if (!statusClienteEl) return;

        if (clienteLogado) {
            statusClienteEl.className = "alert alert-success d-flex justify-content-between align-items-center mt-3 mb-0";
            statusClienteEl.innerHTML = `
                <div>
                    <i class="fa-solid fa-user-check me-2"></i>
                    Olá, <strong>${clienteLogado.nome}</strong>! Entrega em: <em>${clienteLogado.endereco || "Endereço cadastrado"}</em>
                </div>
                <button id="btn-sair" class="btn btn-sm btn-outline-danger">
                    <i class="fa-solid fa-right-from-bracket"></i> Sair
                </button>
            `;

            document.getElementById("btn-sair").addEventListener("click", () => {
                localStorage.removeItem("gamafood_cliente_logado");
                alert("Você saiu da sua conta.");
                window.location.href = "login_cliente.html";
            });
        } else {
            statusClienteEl.className = "alert alert-warning d-flex justify-content-between align-items-center mt-3 mb-0";
            statusClienteEl.innerHTML = `
                <div>
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>
                    Você está navegando como <strong>Visitante</strong>. Faça login para finalizar seu pedido.
                </div>
                <a href="login_cliente.html" class="btn btn-sm btn-gama">
                    <i class="fa-solid fa-right-to-bracket"></i> Fazer Login
                </a>
            `;
        }
    }

    function salvarCarrinho() {
        localStorage.setItem(chaveCarrinho, JSON.stringify(carrinho));
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function renderizarCarrinho() {
        listaCarrinho.innerHTML = "";
        let total = 0;

        if (carrinho.length === 0) {
            carrinhoVazio.classList.remove("d-none");
            valorTotalEl.textContent = formatarMoeda(0);
            btnFinalizar.disabled = true;
            btnLimpar.disabled = true;
            return;
        }

        carrinhoVazio.classList.add("d-none");
        btnFinalizar.disabled = false;
        btnLimpar.disabled = false;

        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="fw-semibold">${item.nome}</td>
                <td>${formatarMoeda(item.preco)}</td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary btn-diminuir" data-index="${index}">-</button>
                        <span class="btn btn-light disabled text-dark fw-bold">${item.quantidade}</span>
                        <button class="btn btn-outline-secondary btn-aumentar" data-index="${index}">+</button>
                    </div>
                </td>
                <td class="fw-bold text-gama">${formatarMoeda(subtotal)}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-danger btn-remover" data-index="${index}" title="Remover item">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            listaCarrinho.appendChild(tr);
        });

        valorTotalEl.textContent = formatarMoeda(total);
        adicionarEventosBotoes();
    }

    function adicionarEventosBotoes() {
        document.querySelectorAll(".btn-aumentar").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.currentTarget.dataset.index;
                carrinho[idx].quantidade++;
                salvarCarrinho();
                renderizarCarrinho();
            });
        });

        document.querySelectorAll(".btn-diminuir").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.currentTarget.dataset.index;
                if (carrinho[idx].quantidade > 1) {
                    carrinho[idx].quantidade--;
                } else {
                    carrinho.splice(idx, 1);
                }
                salvarCarrinho();
                renderizarCarrinho();
            });
        });

        document.querySelectorAll(".btn-remover").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idx = e.currentTarget.dataset.index;
                carrinho.splice(idx, 1);
                salvarCarrinho();
                renderizarCarrinho();
            });
        });
    }

    btnLimpar.addEventListener("click", () => {
        if (confirm("Deseja realmente esvaziar todo o carrinho?")) {
            carrinho = [];
            salvarCarrinho();
            renderizarCarrinho();
        }
    });

    // 3. Bloqueia a finalização se não estiver logado
    btnFinalizar.addEventListener("click", () => {
        if (!clienteLogado) {
            alert("Você precisa estar logado como cliente para finalizar o pedido!");
            window.location.href = "login_cliente.html";
            return;
        }

        alert(`Pedido confirmado, ${clienteLogado.nome}!\nTotal: ${valorTotalEl.textContent}\nSeu pedido será entregue no Gama.`);
        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();
    });

    btnAdicionarTeste.addEventListener("click", () => {
        const lanches = [
            { nome: "X-Periquito Especial", preco: 28.90 },
            { nome: "Combo Bezerrão", preco: 35.00 },
            { nome: "Porção de Batata Alviverde", preco: 18.50 },
            { nome: "Açaí do Gama 500ml", preco: 16.00 }
        ];
        const sorteado = lanches[Math.floor(Math.random() * lanches.length)];
        const existente = carrinho.find(item => item.nome === sorteado.nome);

        if (existente) {
            existente.quantidade++;
        } else {
            carrinho.push({ id: Date.now(), nome: sorteado.nome, preco: sorteado.preco, quantidade: 1 });
        }
        salvarCarrinho();
        renderizarCarrinho();
    });

    verificarStatusLogin();
    renderizarCarrinho();
});

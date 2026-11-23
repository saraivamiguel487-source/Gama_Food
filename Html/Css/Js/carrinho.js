document.addEventListener("DOMContentLoaded", () => {
    const listaCarrinho = document.getElementById("lista-carrinho");
    const carrinhoVazio = document.getElementById("carrinho-vazio");
    const valorTotalEl = document.getElementById("valor-total");
    const btnFinalizar = document.getElementById("btn-finalizar");
    const btnLimpar = document.getElementById("btn-limpar");
    const btnAdicionarTeste = document.getElementById("btn-adicionar-teste");

    // Carrega itens salvos no navegador ou inicia com alguns itens de exemplo
    let carrinho = JSON.parse(localStorage.getItem("gamafood_carrinho")) || [
        { id: 1, nome: "X-Periquito Especial", preco: 28.90, quantidade: 1 },
        { id: 2, nome: "Porção de Batata Alviverde", preco: 18.50, quantidade: 1 }
    ];

    function salvarCarrinho() {
        localStorage.setItem("gamafood_carrinho", JSON.stringify(carrinho));
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

    btnFinalizar.addEventListener("click", () => {
        alert("Pedido realizado com sucesso no GamaFood! Seu lanche já está sendo preparado.");
        carrinho = [];
        salvarCarrinho();
        renderizarCarrinho();
    });

    btnAdicionarTeste.addEventListener("click", () => {
        const lanches = [
            { nome: "Combo Bezerrão", preco: 35.00 },
            { nome: "Suco Natural Verde", preco: 9.50 },
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

    renderizarCarrinho();
});

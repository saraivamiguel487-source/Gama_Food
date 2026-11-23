document.addEventListener("DOMContentLoaded", () => {
    const formRecuperar = document.getElementById("form-recuperar");
    const emailInput = document.getElementById("email");
    const etapaNovaSenha = document.getElementById("etapa-nova-senha");
    const novaSenhaInput = document.getElementById("nova-senha");
    const confirmarSenhaInput = document.getElementById("confirmar-senha");
    const btnSubmit = document.getElementById("btn-submit");
    const mensagemAlerta = document.getElementById("mensagem-alerta");

    let emailVerificado = false;
    let tipoContaEncontrada = null; // "cliente" ou "entregador"
    let indiceUsuario = -1;

    function exibirAlerta(texto, tipo) {
        mensagemAlerta.textContent = texto;
        mensagemAlerta.className = `alert alert-${tipo}`;
        mensagemAlerta.classList.remove("d-none");
    }

    formRecuperar.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailDigitado = emailInput.value.trim().toLowerCase();

        if (!emailDigitado || !emailDigitado.includes("@")) {
            exibirAlerta("Por favor, digite um endereço de e-mail válido.", "danger");
            emailInput.focus();
            return;
        }

        // ETAPA 1: Verificar se o e-mail está cadastrado
        if (!emailVerificado) {
            const clientes = JSON.parse(localStorage.getItem("gamafood_usuarios")) || [];
            const entregadores = JSON.parse(localStorage.getItem("gamafood_entregadores")) || [];

            const idxCliente = clientes.findIndex(u => u.email.toLowerCase() === emailDigitado);
            const idxEntregador = entregadores.findIndex(ent => ent.email.toLowerCase() === emailDigitado);

            if (idxCliente !== -1) {
                tipoContaEncontrada = "cliente";
                indiceUsuario = idxCliente;
            } else if (idxEntregador !== -1) {
                tipoContaEncontrada = "entregador";
                indiceUsuario = idxEntregador;
            } else {
                exibirAlerta("E-mail não encontrado em nossa base. Verifique ou faça seu cadastro.", "warning");
                return;
            }

            // E-mail encontrado: libera os campos para criar a nova senha
            emailVerificado = true;
            emailInput.readOnly = true;
            etapaNovaSenha.classList.remove("d-none");
            novaSenhaInput.required = true;
            confirmarSenhaInput.required = true;
            btnSubmit.innerHTML = '<i class="fa-solid fa-floppy-disk me-1"></i> Salvar Nova Senha';
            exibirAlerta(`Conta de ${tipoContaEncontrada} localizada! Digite sua nova senha abaixo.`, "success");
            novaSenhaInput.focus();
            return;
        }

        // ETAPA 2: Salvar a nova senha no localStorage
        const novaSenha = novaSenhaInput.value.trim();
        const confirmarSenha = confirmarSenhaInput.value.trim();

        if (novaSenha.length < 4) {
            exibirAlerta("A nova senha deve ter pelo menos 4 caracteres.", "danger");
            novaSenhaInput.focus();
            return;
        }

        if (novaSenha !== confirmarSenha) {
            exibirAlerta("As senhas digitadas não coincidem.", "danger");
            confirmarSenhaInput.focus();
            return;
        }

        const chaveStorage = tipoContaEncontrada === "cliente" ? "gamafood_usuarios" : "gamafood_entregadores";
        const lista = JSON.parse(localStorage.getItem(chaveStorage)) || [];
        lista[indiceUsuario].senha = novaSenha;
        localStorage.setItem(chaveStorage, JSON.stringify(lista));

        exibirAlerta("Senha redefinida com sucesso! Redirecionando para o login...", "success");
        btnSubmit.disabled = true;

        setTimeout(() => {
            window.location.href = tipoContaEncontrada === "cliente" ? "login_cliente.html" : "login_entregador.html";
        }, 2000);
    });
});